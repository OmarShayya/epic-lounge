import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Container, Grid, Stack, Typography, alpha, useMediaQuery, useTheme } from "@mui/material";
import { ErrorOutline, Phone, WhatsApp, Refresh, ManageSearch } from "@mui/icons-material";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { tokens } from "@theme/theme";
import { CONTACT_INFO } from "@utils/constants";
import { describeApiError, reservationApi } from "@/services/api";
import type { AvailabilityStation, PublicReservation, StationType } from "@/services/api";
import { useAvailability, useReservationConfig } from "@hooks/useReservation";
import {
  TYPE_LABEL,
  LOUNGE_WHATSAPP,
  buildDateOptions,
  buildDurationOptions,
  durationLabel,
  estimatePrice,
  formatUSD,
} from "@utils/reservation";
import StepSection from "@components/reserve/StepSection";
import TypePicker from "@components/reserve/TypePicker";
import DateStrip from "@components/reserve/DateStrip";
import { CountStepper, DurationChips } from "@components/reserve/Pickers";
import SlotGrid from "@components/reserve/SlotGrid";
import StationPicker from "@components/reserve/StationPicker";
import DetailsForm from "@components/reserve/DetailsForm";
import { SummaryBar, SummaryPanel } from "@components/reserve/BookingSummary";
import BookingSuccess from "@components/reserve/BookingSuccess";

const cardSx = {
  p: { xs: 2, md: 2.75 },
  borderRadius: "22px",
  background: "rgba(255,255,255,0.035)",
  border: `1px solid ${tokens.menuBorder}`,
} as const;

const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

const phoneDigits = (p: string) => p.replace(/\D/g, "");

const ReservePage: React.FC = () => {
  const [params] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { config, error: configError, loading: configLoading, reload: reloadConfig } = useReservationConfig();

  const [type, setType] = useState<StationType>(params.get("type") === "playstation" ? "playstation" : "pc");
  const [date, setDate] = useState<string | null>(null);
  const [duration, setDuration] = useState(120);
  const [count, setCount] = useState(1);
  const [slotStart, setSlotStart] = useState<string | null>(null);
  const [pickMode, setPickMode] = useState<"any" | "pick">("any");
  const [picked, setPicked] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", phone: "", notes: "", honeypot: "" });
  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<{ status: number; message: string } | null>(null);
  const [result, setResult] = useState<PublicReservation | null>(null);
  const [priceFrom, setPriceFrom] = useState<Partial<Record<StationType, number>>>({});
  const nameRef = useRef<HTMLInputElement>(null);

  const types = useMemo(
    () => (config ? config.bookableTypes.filter((t) => (config.stationCounts[t] ?? 0) > 0) : []),
    [config]
  );
  const dateOptions = useMemo(() => (config ? buildDateOptions(config) : []), [config]);
  const durationOptions = useMemo(
    () => (config ? buildDurationOptions(config.minDurationMinutes, config.maxDurationMinutes) : []),
    [config]
  );
  const maxCount = config ? Math.max(1, Math.min(config.maxStationsPerBooking, config.stationCounts[type] ?? 1)) : 1;

  // Sensible defaults once the rules are known
  useEffect(() => {
    if (!config) return;
    if (types.length && !types.includes(type)) setType(types[0]);
    setDate((d) => d ?? dateOptions.find((o) => !o.closed)?.date ?? null);
    setDuration((d) => {
      if (durationOptions.includes(d)) return d;
      return durationOptions.find((m) => m >= 120) ?? durationOptions[0] ?? config.minDurationMinutes;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  // "From $X/h" on the type cards
  useEffect(() => {
    if (!config || !types.length) return;
    let alive = true;
    const firstOpen = dateOptions.find((o) => !o.closed)?.date ?? config.today;
    Promise.all(
      types.map((t) =>
        reservationApi
          .getAvailability({ type: t, date: firstOpen, duration: config.minDurationMinutes })
          .then((a) => [t, Math.min(...a.stations.map((s) => s.hourlyRate.usd))] as const)
          .catch(() => [t, undefined] as const)
      )
    ).then((entries) => {
      if (!alive) return;
      const out: Partial<Record<StationType, number>> = {};
      for (const [t, p] of entries) if (p !== undefined && Number.isFinite(p)) out[t] = p;
      setPriceFrom(out);
    });
    return () => {
      alive = false;
    };
  }, [config, types, dateOptions]);

  useEffect(() => setCount((c) => Math.min(Math.max(1, c), maxCount)), [maxCount]);

  // Changing what/when/how long/how many invalidates the chosen time
  useEffect(() => {
    setSlotStart(null);
    setPicked([]);
  }, [type, date, duration, count]);

  const availability = useAvailability(config && date ? { type, date, duration } : null);
  const slots = useMemo(() => availability.data?.slots ?? [], [availability.data]);
  const slot = useMemo(() => slots.find((s) => s.start === slotStart) ?? null, [slots, slotStart]);

  // If a refresh shows the chosen time no longer fits, drop it
  useEffect(() => {
    if (!slotStart || !availability.data) return;
    const s = availability.data.slots.find((x) => x.start === slotStart);
    if (!s || s.status !== "available" || s.availableCount < count) {
      setSlotStart(null);
      setPicked([]);
    } else {
      setPicked((p) => p.filter((id) => s.availableStationIds.includes(id)));
    }
  }, [availability.data, slotStart, count]);

  const slotStations = useMemo(() => {
    if (!slot || !availability.data) return [] as AvailabilityStation[];
    const byId = new Map(availability.data.stations.map((s) => [s.id, s]));
    return slot.availableStationIds.map((id) => byId.get(id)).filter(Boolean) as AvailabilityStation[];
  }, [slot, availability.data]);

  const chosenStations = pickMode === "pick" ? slotStations.filter((s) => picked.includes(s.id)) : slotStations.slice(0, count);
  const price = slot
    ? formatUSD(estimatePrice(chosenStations.length ? chosenStations : slotStations.slice(0, count), duration))
    : priceFrom[type] !== undefined
      ? `from ${formatUSD(Math.round(priceFrom[type]! * count * (duration / 60) * 100) / 100)}`
      : null;

  const nameError = form.name.trim().length < 2 ? "Please enter your name" : undefined;
  const phoneError = phoneDigits(form.phone).length < 7 ? "Please enter a valid phone number" : undefined;
  const stationsReady = pickMode === "any" || picked.length === count;
  const ready = !!slot && stationsReady && !nameError && !phoneError;

  const dateOption = dateOptions.find((o) => o.date === date);
  const unit = TYPE_LABEL[type];
  const bookingClosed = !!config && (!config.enabled || availability.data?.enabled === false);
  const tzNote = useMemo(() => {
    if (!config) return null;
    try {
      const local = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return local && local !== config.timezone ? `Times are shown in lounge time (${config.timezone.split("/").pop()?.replace("_", " ")}).` : null;
    } catch {
      return null;
    }
  }, [config]);

  const summaryLines = [
    { label: "What", value: `${count} × ${count > 1 ? unit.many : unit.one}` },
    { label: "Day", value: dateOption ? `${dateOption.label}${dateOption.label.length < 9 ? `, ${dateOption.sub}` : ""}` : null },
    { label: "Time", value: slot ? `${slot.label} – ${slot.endLabel}` : null },
    { label: "Length", value: durationLabel(duration) },
    {
      label: "Stations",
      value: slot ? (pickMode === "pick" ? (picked.length ? chosenStations.map((s) => s.pcNumber).join(", ") : null) : "Any available") : null,
    },
  ];

  const ctaLabel = !slot
    ? "Choose a time"
    : !stationsReady
      ? `Pick ${count - picked.length} more`
      : nameError || phoneError
        ? "Add your details"
        : "Confirm booking";

  const submit = async () => {
    if (!slot || !config) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await reservationApi.create({
        type,
        start: slot.start,
        durationMinutes: duration,
        ...(pickMode === "pick" ? { stationIds: picked } : { stationCount: count }),
        customerName: form.name.trim(),
        customerPhone: form.phone.trim(),
        notes: form.notes.trim() || undefined,
        website: form.honeypot,
      });
      setResult(res);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const e = describeApiError(err);
      if (e.status === 409) {
        setSlotStart(null);
        setPicked([]);
        availability.refresh();
        const msg = /[.!?]$/.test(e.message) ? e.message : `${e.message}.`;
        setSubmitError({ status: 409, message: `${msg} We've refreshed the times for you.` });
        setTimeout(() => scrollToId("step-time"), 50);
      } else {
        setSubmitError(e);
        if (e.status === 403) reloadConfig();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const onCta = () => {
    if (!slot) return scrollToId("step-time");
    if (!stationsReady) return scrollToId("step-time");
    if (nameError || phoneError) {
      setShowErrors(true);
      scrollToId("step-details");
      setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 350);
      return;
    }
    submit();
  };

  const resetForAnother = () => {
    setResult(null);
    setSlotStart(null);
    setPicked([]);
    setSubmitError(null);
    setShowErrors(false);
    availability.refresh();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextOpenDay = () => {
    const idx = dateOptions.findIndex((o) => o.date === date);
    const next = dateOptions.slice(idx + 1).find((o) => !o.closed);
    if (next) setDate(next.date);
  };

  const closedBanner = (
    <Box sx={{ ...cardSx, textAlign: "center" }} role="status">
      <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>Online booking is paused right now</Typography>
      <Typography sx={{ color: tokens.menuText, mt: 0.75 }}>Call or message us and we'll sort you out.</Typography>
      <Stack direction="row" spacing={1.25} justifyContent="center" sx={{ mt: 2 }}>
        <Button variant="outlined" href={`tel:${CONTACT_INFO.phone}`} startIcon={<Phone />}>
          Call
        </Button>
        <Button
          variant="contained"
          href={LOUNGE_WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<WhatsApp />}
          sx={{ background: tokens.whatsapp, color: "#000", "&:hover": { background: "#3BE07A" } }}
        >
          WhatsApp
        </Button>
      </Stack>
    </Box>
  );

  return (
    <Box
      sx={{
        mt: { xs: "-60px", md: "-72px" },
        pt: { xs: "60px", md: "72px" },
        pb: { xs: result ? 8 : 16, md: 10 },
        minHeight: "100vh",
        background: tokens.menuPageBg,
      }}
    >
      <Container maxWidth="lg" sx={{ pt: { xs: 2.5, md: 5 }, px: { xs: 2, sm: 3 } }}>
        {result ? (
          <BookingSuccess reservation={result} graceMinutes={config?.noShowGraceMinutes ?? 15} onBookAnother={resetForAnother} />
        ) : (
          <>
            {/* Page header */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "flex-end" }}
                spacing={1.5}
                sx={{ mb: { xs: 2.5, md: 4 } }}
              >
                <Box>
                  <Typography variant="overline" sx={{ color: tokens.cyan, lineHeight: 1.2 }}>
                    Book a station
                  </Typography>
                  <Typography
                    component="h1"
                    sx={{ fontFamily: tokens.fontDisplay, fontWeight: 900, fontSize: { xs: "2.2rem", md: "3.2rem" }, lineHeight: 1, textTransform: "uppercase", mt: 0.5 }}
                  >
                    Reserve
                  </Typography>
                  <Typography sx={{ color: "#D3D5E6", mt: 1, maxWidth: 520 }}>
                    Pick a PC or a PS5 room, choose a time — confirmed instantly. Pay at the lounge.
                  </Typography>
                </Box>
                <Button component={RouterLink} to="/reserve/manage" variant="text" startIcon={<ManageSearch />} sx={{ color: tokens.menuText, px: 1, ml: { xs: -1, sm: 0 } }}>
                  Manage a booking
                </Button>
              </Stack>
            </motion.div>

            {configLoading && !config ? (
              <Stack spacing={2}>
                {[180, 110, 90, 260].map((h, i) => (
                  <Box key={i} className="skeleton" sx={{ height: h, borderRadius: "22px" }} />
                ))}
              </Stack>
            ) : configError || !config ? (
              <Box sx={{ ...cardSx, textAlign: "center" }} role="alert">
                <ErrorOutline sx={{ color: tokens.red, fontSize: 32 }} />
                <Typography sx={{ fontWeight: 600, mt: 1 }}>{configError ?? "Booking is unavailable right now."}</Typography>
                <Button variant="contained" startIcon={<Refresh />} onClick={reloadConfig} sx={{ mt: 2 }}>
                  Try again
                </Button>
              </Box>
            ) : bookingClosed || !types.length ? (
              closedBanner
            ) : (
              <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Stack spacing={{ xs: 2, md: 2.5 }}>
                    <Box sx={cardSx}>
                      <StepSection id="step-type" step={1} title="What do you want to play on?" done>
                        <TypePicker value={type} onChange={setType} types={types} counts={config.stationCounts} priceFrom={priceFrom} />
                      </StepSection>
                    </Box>

                    <Box sx={cardSx}>
                      <StepSection id="step-when" step={2} title="When?" value={dateOption?.hours} done={!!date}>
                        <DateStrip options={dateOptions} value={date} onChange={setDate} />
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: { xs: 2.5, sm: 3 }, mt: 2.5 }}>
                          <Box>
                            <Typography sx={{ fontWeight: 600, mb: 1, fontSize: "0.95rem" }}>How long?</Typography>
                            <DurationChips options={durationOptions} value={duration} onChange={setDuration} />
                          </Box>
                          <Box>
                            <Typography sx={{ fontWeight: 600, mb: 1, fontSize: "0.95rem" }}>
                              {type === "pc" ? "How many PCs?" : "How many rooms?"}
                            </Typography>
                            <CountStepper
                              value={count}
                              max={maxCount}
                              onChange={setCount}
                              unit={type === "pc" ? { one: "PC", many: "PCs" } : { one: "room", many: "rooms" }}
                              hint={type === "pc" ? "One per player" : undefined}
                            />
                          </Box>
                        </Box>
                      </StepSection>
                    </Box>

                    <Box sx={cardSx}>
                      <StepSection
                        id="step-time"
                        step={3}
                        title="Pick a start time"
                        value={slot ? `${slot.label} – ${slot.endLabel}` : availability.refreshing ? "Updating…" : undefined}
                        done={!!slot && stationsReady}
                      >
                        <AnimatePresence>
                          {submitError?.status === 409 && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                              <Box role="alert" sx={{ mb: 1.5, px: 2, py: 1.25, borderRadius: "12px", background: alpha(tokens.amber, 0.12), border: `1px solid ${alpha(tokens.amber, 0.35)}`, fontSize: "0.9rem" }}>
                                {submitError.message}
                              </Box>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        {availability.error && !availability.data ? (
                          <Box role="alert" sx={{ textAlign: "center", py: 2 }}>
                            <Typography sx={{ color: tokens.menuText }}>{availability.error}</Typography>
                            <Button size="small" variant="outlined" startIcon={<Refresh />} onClick={availability.refresh} sx={{ mt: 1.25 }}>
                              Retry
                            </Button>
                          </Box>
                        ) : (
                          <SlotGrid
                            slots={slots}
                            loading={availability.loading || (!availability.data && !availability.error)}
                            closed={!!availability.data?.closed}
                            count={count}
                            total={availability.data?.stations.length ?? config.stationCounts[type] ?? 0}
                            unitMany={type === "pc" ? "PCs" : "rooms"}
                            value={slotStart}
                            onChange={(s) => {
                              setSlotStart(s);
                              setSubmitError(null);
                            }}
                            onNextDay={dateOptions.some((o, i) => i > dateOptions.findIndex((x) => x.date === date) && !o.closed) ? nextOpenDay : undefined}
                          />
                        )}
                        {tzNote && <Typography sx={{ color: tokens.menuTextDim, fontSize: "0.78rem", mt: 1.5 }}>{tzNote}</Typography>}

                        {slot && slotStations.length > count && (
                          <Box sx={{ mt: 2.5 }}>
                            <Typography sx={{ fontWeight: 600, mb: 1, fontSize: "0.95rem" }}>
                              {type === "pc" ? (count > 1 ? "Which PCs?" : "Which PC?") : count > 1 ? "Which rooms?" : "Which room?"}
                            </Typography>
                            <StationPicker
                              stations={slotStations}
                              count={count}
                              mode={pickMode}
                              picked={picked}
                              onModeChange={(m) => {
                                setPickMode(m);
                                if (m === "any") setPicked([]);
                              }}
                              onPickedChange={setPicked}
                            />
                          </Box>
                        )}
                      </StepSection>
                    </Box>

                    <Box sx={cardSx}>
                      <StepSection id="step-details" step={4} title="Your details" done={!nameError && !phoneError}>
                        <DetailsForm
                          name={form.name}
                          phone={form.phone}
                          notes={form.notes}
                          honeypot={form.honeypot}
                          nameRef={nameRef}
                          onChange={(field, value) => setForm((f) => ({ ...f, [field]: value }))}
                          errors={showErrors ? { name: nameError, phone: phoneError } : {}}
                        />
                      </StepSection>
                      <AnimatePresence>
                        {submitError && submitError.status !== 409 && (
                          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <Box
                              role="alert"
                              sx={{ mt: 2, px: 2, py: 1.5, borderRadius: "12px", background: alpha(tokens.red, 0.1), border: `1px solid ${alpha(tokens.red, 0.35)}` }}
                            >
                              <Typography sx={{ fontSize: "0.92rem" }}>{submitError.message}</Typography>
                              {(submitError.status === 403 || submitError.status === 429) && (
                                <Stack direction="row" spacing={1} sx={{ mt: 1.25 }}>
                                  <Button size="small" variant="outlined" href={`tel:${CONTACT_INFO.phone}`} startIcon={<Phone />}>
                                    Call us
                                  </Button>
                                  <Button size="small" variant="outlined" href={LOUNGE_WHATSAPP} target="_blank" rel="noopener noreferrer" startIcon={<WhatsApp />}>
                                    WhatsApp
                                  </Button>
                                </Stack>
                              )}
                            </Box>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {/* Desktop keeps the CTA in the side panel; on mobile it's in the bottom bar */}
                    </Box>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }} sx={{ display: { xs: "none", md: "block" } }}>
                  <SummaryPanel lines={summaryLines} price={price} ctaLabel={ctaLabel} ready={ready} submitting={submitting} onCta={onCta} />
                </Grid>
              </Grid>
            )}
          </>
        )}
      </Container>

      <SummaryBar
        visible={isMobile && !result && !!config && !bookingClosed && types.length > 0}
        lines={summaryLines.filter((l) => l.label !== "Length")}
        price={price}
        ctaLabel={ctaLabel}
        ready={ready}
        submitting={submitting}
        onCta={onCta}
      />
    </Box>
  );
};

export default ReservePage;
