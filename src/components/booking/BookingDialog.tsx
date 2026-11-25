import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  LinearProgress,
  Slide,
  Stack,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import { ArrowBack, ArrowForward, Close, Computer, EditOutlined, ErrorOutline, Phone, Refresh, SportsEsports, WhatsApp } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import { tokens } from "@theme/theme";
import { CONTACT_INFO } from "@utils/constants";
import { describeApiError, reservationApi } from "@/services/api";
import type { AvailabilitySlot, PCStatus, PublicReservation, ReservationConfig, StationType } from "@/services/api";
import { useAvailability } from "@hooks/useReservation";
import {
  LOUNGE_WHATSAPP,
  TYPE_LABEL,
  buildDateOptions,
  buildDurationOptions,
  durationLabel,
  estimatePrice,
  formatUSD,
  loadContact,
  nearestStations,
  saveContact,
  saveLastBooking,
} from "@utils/reservation";
import { STATUS_META, reservationBadge, sortPcs, stationLabel, statusColor } from "@components/gaming/statusMeta";
import { DayPicker, DurationPicker, PlayersStepper, TimeGrid } from "./Pickers";
import ContactForm from "./ContactForm";
import type { ContactValues } from "./ContactForm";
import BookingConfirmed from "./BookingConfirmed";
import { optionSx, scrollFadeSx, sectionTitleSx, ui } from "./styles";

export interface BookingDialogProps {
  open: boolean;
  type: StationType;
  /** pcNumber of the station that was tapped, or null for "any free one". */
  station: string | null;
  /** Live station list (for the "free now / in use" line and the station chips). */
  live: PCStatus[];
  config: ReservationConfig | null;
  configError: string | null;
  onRetryConfig: () => void;
  onClose: () => void;
  onBooked?: (reservation: PublicReservation) => void;
}

const SlideUp = React.forwardRef(function SlideUp(props: TransitionProps & { children: React.ReactElement }, ref: React.Ref<unknown>) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const phoneDigits = (p: string) => p.replace(/\D/g, "");

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

const Notice: React.FC<{ tone?: "amber" | "red"; children: React.ReactNode }> = ({ tone = "amber", children }) => {
  const c = tone === "red" ? tokens.red : tokens.amber;
  return (
    <Box role="status" sx={{ px: 1.75, py: 1.25, borderRadius: "12px", background: alpha(c, 0.1), border: `1px solid ${alpha(c, 0.35)}`, fontSize: "0.88rem" }}>
      {children}
    </Box>
  );
};

const ContactLounge: React.FC = () => (
  <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1.5 }}>
    <Button variant="outlined" size="small" href={`tel:${CONTACT_INFO.phone}`} startIcon={<Phone />}>
      Call
    </Button>
    <Button
      variant="contained"
      size="small"
      href={LOUNGE_WHATSAPP}
      target="_blank"
      rel="noopener noreferrer"
      startIcon={<WhatsApp />}
      sx={{ background: tokens.whatsapp, color: "#000", "&:hover": { background: "#3BE07A" } }}
    >
      WhatsApp
    </Button>
  </Stack>
);

/* ------------------------------------------------------------------ */
/* The flow (mounted only while the dialog is open, so it starts fresh) */
/* ------------------------------------------------------------------ */

type Step = "time" | "details" | "done";

const BookingFlow: React.FC<Omit<BookingDialogProps, "open">> = ({
  type,
  station: initialStation,
  live,
  config,
  configError,
  onRetryConfig,
  onClose,
  onBooked,
}) => {
  const [step, setStep] = useState<Step>("time");
  const [station, setStation] = useState<string | null>(initialStation);
  const [count, setCount] = useState(1);
  const [date, setDate] = useState<string | null>(null);
  const [duration, setDuration] = useState(120);
  const [slotStart, setSlotStart] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [form, setForm] = useState<ContactValues>(() => {
    const saved = loadContact();
    return { name: saved?.name ?? "", phone: saved?.phone ?? "", notes: "", honeypot: "" };
  });
  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<{ status: number; message: string } | null>(null);
  const [result, setResult] = useState<PublicReservation | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const stationRowRef = useRef<HTMLDivElement>(null);

  // Keep the chosen station chip in view (e.g. PC 09 tapped on the map)
  useEffect(() => {
    const row = stationRowRef.current;
    const chip = row?.querySelector<HTMLElement>(`[data-station="${station ?? "any"}"]`);
    if (!row || !chip) return;
    if (chip.offsetLeft + chip.offsetWidth > row.scrollLeft + row.clientWidth || chip.offsetLeft < row.scrollLeft) {
      row.scrollTo({ left: chip.offsetLeft - row.clientWidth / 2 + chip.offsetWidth / 2 });
    }
  }, [station, step]);

  const unit = TYPE_LABEL[type];
  const isPc = type === "pc";
  const bookable = !!config && config.enabled && config.bookableTypes.includes(type);

  const dateOptions = useMemo(() => (config ? buildDateOptions(config) : []), [config]);
  const durationOptions = useMemo(
    () => (config ? buildDurationOptions(config.minDurationMinutes, config.maxDurationMinutes) : []),
    [config]
  );

  // Sensible defaults: the next open night, 2 hours
  useEffect(() => {
    if (!config) return;
    setDate((d) => d ?? dateOptions.find((o) => !o.closed)?.date ?? null);
    setDuration((d) =>
      durationOptions.includes(d) ? d : (durationOptions.find((m) => m >= 120) ?? durationOptions[0] ?? config.minDurationMinutes)
    );
  }, [config, dateOptions, durationOptions]);

  const availability = useAvailability(bookable && date ? { type, date, duration } : null);
  const data = availability.data;
  const stations = useMemo(() => data?.stations ?? [], [data]);
  const main = station ? (stations.find((s) => s.pcNumber === station) ?? null) : null;

  const liveOfType = useMemo(() => sortPcs(live.filter((p) => (p.type ?? "pc") === type)), [live, type]);
  const liveStation = station ? liveOfType.find((p) => p.pcNumber === station) : undefined;
  const maxCount = isPc ? Math.max(1, Math.min(config?.maxStationsPerBooking ?? 1, stations.length || (config?.stationCounts[type] ?? 1))) : 1;

  useEffect(() => setCount((c) => Math.min(Math.max(1, c), maxCount)), [maxCount]);

  // A station that isn't bookable (e.g. being serviced) falls back to "any free one"
  useEffect(() => {
    if (!data || !station || data.stations.some((s) => s.pcNumber === station)) return;
    const name = liveOfType.find((p) => p.pcNumber === station)?.name ?? station;
    setNotice(`${name} can't be booked right now. Showing times for any free ${unit.unit}.`);
    setStation(null);
  }, [data, station, liveOfType, unit.unit]);

  const fits = useCallback(
    (s: AvailabilitySlot) => s.status === "available" && s.availableCount >= count && (!main || s.availableStationIds.includes(main.id)),
    [count, main]
  );
  const hint = useCallback(
    (s: AvailabilitySlot) => (!main && s.availableCount < stations.length && s.availableCount - count <= 1 ? `${s.availableCount} left` : null),
    [main, stations.length, count]
  );

  // Changing what / when / how long clears the chosen time
  useEffect(() => setSlotStart(null), [station, count, date, duration]);

  const slot = useMemo(() => data?.slots.find((s) => s.start === slotStart) ?? null, [data, slotStart]);

  // A refresh can show the chosen time was just taken
  useEffect(() => {
    if (!slotStart || !data) return;
    const s = data.slots.find((x) => x.start === slotStart);
    if (!s || !fits(s)) {
      setSlotStart(null);
      setNotice("That time was just taken. Please pick another one.");
    }
  }, [data, slotStart, fits]);

  const chosenIds = useMemo(() => {
    if (!slot) return [] as string[];
    if (main) return [main.id, ...nearestStations(main.id, slot.availableStationIds, stations, count - 1)];
    return slot.availableStationIds.slice(0, count);
  }, [slot, main, stations, count]);

  const chosen = chosenIds.map((id) => stations.find((s) => s.id === id)).filter(Boolean) as typeof stations;
  const byRate = [...stations].sort((a, b) => a.hourlyRate.usd - b.hourlyRate.usd);
  const priceBase = chosen.length
    ? chosen
    : main
      ? [main, ...byRate.filter((s) => s.id !== main.id).slice(0, count - 1)]
      : byRate.slice(0, count);
  const price = priceBase.length ? estimatePrice(priceBase, duration) : null;
  const rate = main?.hourlyRate.usd ?? (stations.length ? Math.min(...stations.map((s) => s.hourlyRate.usd)) : null);

  const dateOption = dateOptions.find((o) => o.date === date);
  // "Tonight", "Tomorrow", or "Thu, Nov 27"
  const dayText = dateOption ? (dateOption.label.length <= 3 ? `${dateOption.label}, ${dateOption.sub}` : dateOption.label) : "";
  const stationText = main
    ? count > 1 && chosen.length
      ? `PCs ${chosen.map((s) => stationLabel({ pcNumber: s.pcNumber, type })).join(", ")}`
      : count > 1
        ? `${main.name} + ${count - 1} more`
        : main.name
    : `${count > 1 ? `${count} × ` : "Any free "}${count > 1 ? unit.many : unit.unit}`;

  // Compact version for the footer: "PC 09", "PCs 05, 06, 07", "PS 3", "Any free PC"
  const stationShort = main
    ? count > 1 && chosen.length
      ? stationText
      : isPc
        ? `PC ${stationLabel({ pcNumber: main.pcNumber, type })}${count > 1 ? ` + ${count - 1}` : ""}`
        : stationLabel({ pcNumber: main.pcNumber, type })
    : stationText;

  const upcoming = data ? data.slots.filter((s) => s.status !== "past") : [];
  const fullyBooked = !!data && !data.closed && upcoming.length > 0 && !upcoming.some(fits);
  const nextOpenDay = () => {
    const idx = dateOptions.findIndex((o) => o.date === date);
    const next = dateOptions.slice(idx + 1).find((o) => !o.closed);
    if (next) setDate(next.date);
  };
  const hasNextDay = dateOptions.slice(dateOptions.findIndex((o) => o.date === date) + 1).some((o) => !o.closed);

  const tzNote = useMemo(() => {
    if (!config) return null;
    try {
      const local = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return local && local !== config.timezone ? `Times are in lounge time (${config.timezone.split("/").pop()?.replace("_", " ")}).` : null;
    } catch {
      return null;
    }
  }, [config]);

  const nameError = form.name.trim().length < 2 ? "Please enter your name" : undefined;
  const phoneError = phoneDigits(form.phone).length < 7 ? "Please enter a valid phone number" : undefined;

  const goTo = (next: Step) => {
    setStep(next);
    bodyRef.current?.scrollTo({ top: 0 });
  };

  const submit = async () => {
    if (!slot) return goTo("time");
    if (nameError || phoneError) {
      setShowErrors(true);
      (nameError ? nameRef.current : null)?.focus();
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await reservationApi.create({
        type,
        start: slot.start,
        durationMinutes: duration,
        ...(main ? { stationIds: chosenIds } : { stationCount: count }),
        customerName: form.name.trim(),
        customerPhone: form.phone.trim(),
        notes: form.notes.trim() || undefined,
        website: form.honeypot,
      });
      saveContact(form.name.trim(), form.phone.trim());
      saveLastBooking(res.code, form.phone.trim());
      setResult(res);
      goTo("done");
      onBooked?.(res);
    } catch (err) {
      const e = describeApiError(err);
      if (e.status === 409) {
        setSlotStart(null);
        availability.refresh();
        setNotice(`${/[.!?]$/.test(e.message) ? e.message : `${e.message}.`} We've refreshed the times for you.`);
        goTo("time");
      } else {
        setSubmitError(e);
        if (e.status === 403) onRetryConfig();
      }
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------------------------------------------------------- header */
  const TypeIcon = isPc ? Computer : SportsEsports;
  const liveColor = liveStation ? statusColor(liveStation.status) : tokens.green;
  const freeNow = liveOfType.filter((p) => p.status === "available").length;
  const liveLine = liveStation
    ? liveStation.status === "available"
      ? (reservationBadge(liveStation) ?? "Free right now")
      : liveStation.status === "occupied"
        ? "In use right now · book a later time"
        : liveStation.status === "maintenance"
          ? "Being serviced"
          : (reservationBadge(liveStation) ?? STATUS_META[liveStation.status]?.label)
    : `${freeNow} of ${liveOfType.length} free right now`;
  const title = step === "done" ? "Booking confirmed" : main ? `Book ${main.name}` : station && liveStation ? `Book ${liveStation.name}` : `Book a ${unit.one}`;

  const header = (
    <Box sx={{ px: { xs: 2, sm: 3 }, pt: { xs: 1.5, sm: 2.25 }, pb: 1.5, borderBottom: `1px solid ${ui.border}`, flexShrink: 0 }}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        {step === "details" ? (
          <IconButton aria-label="Back to times" onClick={() => goTo("time")} sx={{ ml: -1, color: tokens.text }}>
            <ArrowBack />
          </IconButton>
        ) : (
          <Box
            sx={{
              width: 42,
              height: 42,
              flexShrink: 0,
              borderRadius: "12px",
              display: "grid",
              placeItems: "center",
              color: "#000",
              background: isPc ? tokens.cyan : tokens.purpleBright,
              boxShadow: `0 0 22px ${alpha(isPc ? tokens.cyan : tokens.purple, 0.45)}`,
            }}
          >
            <TypeIcon />
          </Box>
        )}
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography id="booking-title" component="h2" noWrap sx={{ fontFamily: tokens.fontDisplay, fontWeight: 800, fontSize: { xs: "1.05rem", sm: "1.2rem" }, lineHeight: 1.25 }}>
            {title}
          </Typography>
          {step !== "done" && (
            <Stack direction="row" alignItems="center" spacing={0.75} sx={{ color: ui.muted, fontSize: "0.82rem", minWidth: 0 }}>
              <Box sx={{ width: 7, height: 7, borderRadius: "50%", flexShrink: 0, background: liveColor, boxShadow: `0 0 8px ${liveColor}` }} />
              <Box component="span" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {liveLine}
                {rate !== null ? ` · ${main ? "" : "from "}${formatUSD(rate)}/h` : ""}
              </Box>
            </Stack>
          )}
        </Box>
        <IconButton aria-label="Close" onClick={onClose} sx={{ mr: -1, color: ui.muted }}>
          <Close />
        </IconButton>
      </Stack>
    </Box>
  );

  /* ---------------------------------------------------------------- states before the flow */
  let blocker: React.ReactNode = null;
  if (!config && !configError) {
    blocker = (
      <Stack spacing={1.5} sx={{ p: { xs: 2, sm: 3 } }}>
        {[70, 50, 180].map((h, i) => (
          <Box key={i} className="skeleton" sx={{ height: h, borderRadius: "14px" }} />
        ))}
      </Stack>
    );
  } else if (!config) {
    blocker = (
      <Box role="alert" sx={{ p: 4, textAlign: "center" }}>
        <ErrorOutline sx={{ color: tokens.red, fontSize: 34 }} />
        <Typography sx={{ fontWeight: 600, mt: 1 }}>{configError}</Typography>
        <Button variant="contained" startIcon={<Refresh />} onClick={onRetryConfig} sx={{ mt: 2 }}>
          Try again
        </Button>
      </Box>
    );
  } else if (!bookable) {
    blocker = (
      <Box role="status" sx={{ p: 4, textAlign: "center" }}>
        <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>Online booking for {unit.many} is paused</Typography>
        <Typography sx={{ color: ui.muted, mt: 0.75 }}>Call or message us and we'll hold one for you.</Typography>
        <ContactLounge />
      </Box>
    );
  }

  /* ---------------------------------------------------------------- step: time */
  const timeStep = (
    <Stack spacing={{ xs: 2.25, sm: 2.75 }}>
      {notice && (
        <Notice>
          {notice}{" "}
          <Box component="button" type="button" onClick={() => setNotice(null)} sx={{ all: "unset", cursor: "pointer", textDecoration: "underline", ml: 0.5 }}>
            OK
          </Box>
        </Notice>
      )}

      {/* Which station */}
      {liveOfType.length > 1 && (
        <Box>
          <Typography sx={sectionTitleSx}>{isPc ? "PC" : "Room"}</Typography>
          <Box
            ref={stationRowRef}
            role="radiogroup"
            aria-label={isPc ? "PC" : "Room"}
            className="no-scrollbar"
            sx={{ ...scrollFadeSx, position: "relative", display: "flex", gap: 1, overflowX: "auto", mx: { xs: -2, sm: -3 }, px: { xs: 2, sm: 3 }, pb: 0.5 }}
          >
            <Box
              component="button"
              type="button"
              role="radio"
              aria-checked={!station}
              data-station="any"
              onClick={() => setStation(null)}
              sx={{ ...optionSx(!station), flexShrink: 0, px: 1.75, fontWeight: 700, fontSize: "0.88rem", display: "inline-flex", alignItems: "center" }}
            >
              Any free
            </Box>
            {liveOfType.map((p) => {
              const selected = station === p.pcNumber;
              const off = p.status === "maintenance";
              return (
                <Box
                  key={p.pcNumber}
                  component="button"
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={`${p.name}${off ? ", being serviced" : ""}`}
                  data-station={p.pcNumber}
                  disabled={off}
                  onClick={() => setStation(p.pcNumber)}
                  sx={{ ...optionSx(selected, off), flexShrink: 0, minWidth: 56, px: 1.5, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 0.75, fontWeight: 700, fontSize: "0.88rem" }}
                >
                  <Box component="span" sx={{ width: 6, height: 6, borderRadius: "50%", background: selected ? "#000" : statusColor(p.status) }} />
                  {stationLabel(p)}
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      <Box>
        <Typography sx={sectionTitleSx}>Day</Typography>
        <DayPicker options={dateOptions} value={date} onChange={setDate} />
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: isPc ? { xs: "1fr", sm: "1fr auto" } : "1fr", gap: { xs: 2, sm: 2.75 }, alignItems: "end" }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={sectionTitleSx}>How long</Typography>
          <DurationPicker options={durationOptions} value={duration} onChange={setDuration} />
        </Box>
        {isPc && maxCount > 1 && (
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Box sx={{ display: { sm: "none" } }}>
              <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>Players</Typography>
              <Typography sx={{ color: ui.dim, fontSize: "0.8rem" }}>One PC each</Typography>
            </Box>
            <Box>
              <Typography sx={{ ...sectionTitleSx, display: { xs: "none", sm: "block" } }}>Players</Typography>
              <PlayersStepper value={count} max={maxCount} onChange={setCount} />
            </Box>
          </Stack>
        )}
      </Box>

      <Box>
        <Stack direction="row" alignItems="baseline" justifyContent="space-between" spacing={1}>
          <Typography sx={sectionTitleSx}>Start time</Typography>
          {availability.refreshing && <Typography sx={{ color: ui.dim, fontSize: "0.75rem" }}>Updating…</Typography>}
        </Stack>
        {main && count > 1 && (
          <Typography sx={{ color: ui.muted, fontSize: "0.85rem", mt: -0.5, mb: 1.25 }}>
            Times when {main.name} and {count - 1} more {count - 1 > 1 ? "PCs" : "PC"} next to it are free.
          </Typography>
        )}
        {availability.error && !data ? (
          <Box role="alert" sx={{ textAlign: "center", py: 2 }}>
            <Typography sx={{ color: ui.muted }}>{availability.error}</Typography>
            <Button size="small" variant="outlined" startIcon={<Refresh />} onClick={availability.refresh} sx={{ mt: 1.25 }}>
              Retry
            </Button>
          </Box>
        ) : data && (data.closed || !upcoming.length) ? (
          <Box sx={{ p: 2.5, borderRadius: "14px", background: ui.card, border: `1px solid ${ui.border}`, textAlign: "center" }}>
            <Typography sx={{ fontWeight: 600 }}>{data.closed ? "We're closed on this day" : "No more start times on this day"}</Typography>
            {hasNextDay && (
              <Button variant="outlined" size="small" onClick={nextOpenDay} sx={{ mt: 1.5 }}>
                Next open day
              </Button>
            )}
          </Box>
        ) : (
          <>
            {fullyBooked && (
              <Box sx={{ mb: 1.5 }}>
                <Notice>
                  {main ? `${main.name}${count > 1 ? ` and ${count - 1} more` : ""} ${count > 1 ? "aren't" : "isn't"}` : `${count > 1 ? `${count} ${unit.many} aren't` : `No ${unit.unit} is`}`} free for{" "}
                  {durationLabel(duration)} on this day.
                  <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap", rowGap: 1 }}>
                    {main && (
                      <Button size="small" variant="outlined" onClick={() => setStation(null)}>
                        Any free {unit.unit}
                      </Button>
                    )}
                    {duration > (config?.minDurationMinutes ?? 60) && (
                      <Button size="small" variant="outlined" onClick={() => setDuration(durationOptions[0])}>
                        Try {durationLabel(durationOptions[0])}
                      </Button>
                    )}
                    {hasNextDay && (
                      <Button size="small" variant="outlined" onClick={nextOpenDay}>
                        Next day
                      </Button>
                    )}
                  </Stack>
                </Notice>
              </Box>
            )}
            <TimeGrid
              slots={data?.slots ?? []}
              loading={!data}
              value={slotStart}
              fits={fits}
              hint={hint}
              onChange={(s) => {
                setSlotStart(s);
                setNotice(null);
              }}
            />
          </>
        )}
        {tzNote && <Typography sx={{ color: ui.dim, fontSize: "0.76rem", mt: 1.5 }}>{tzNote}</Typography>}
      </Box>
    </Stack>
  );

  /* ---------------------------------------------------------------- step: details */
  const detailsStep = slot && (
    <Stack spacing={2.5}>
      <Box sx={{ p: 2, borderRadius: "16px", background: ui.card, border: `1px solid ${ui.border}` }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 800, fontSize: "1.05rem" }}>
              {slot.label} – {slot.endLabel}
            </Typography>
            <Typography sx={{ color: ui.muted, fontSize: "0.9rem" }}>
              {dayText} · {durationLabel(duration)}
            </Typography>
            <Typography sx={{ color: ui.muted, fontSize: "0.9rem" }}>{stationText}</Typography>
          </Box>
          <Button size="small" startIcon={<EditOutlined />} onClick={() => goTo("time")} sx={{ flexShrink: 0 }}>
            Change
          </Button>
        </Stack>
        {price !== null && (
          <Stack direction="row" justifyContent="space-between" sx={{ mt: 1.5, pt: 1.5, borderTop: `1px solid ${ui.border}` }}>
            <Typography sx={{ color: ui.muted, fontSize: "0.9rem" }}>Estimated · pay at the lounge</Typography>
            <Typography sx={{ fontWeight: 800 }}>{formatUSD(price)}</Typography>
          </Stack>
        )}
      </Box>

      <Box>
        <Typography sx={sectionTitleSx}>Your details</Typography>
        <ContactForm
          values={form}
          onChange={(field, value) => setForm((f) => ({ ...f, [field]: value }))}
          errors={showErrors ? { name: nameError, phone: phoneError } : {}}
          nameRef={nameRef}
          onSubmit={submit}
        />
      </Box>

      {submitError && (
        <Notice tone="red">
          {submitError.message}
          {(submitError.status === 403 || submitError.status === 429) && <ContactLounge />}
        </Notice>
      )}
      <Typography sx={{ color: ui.dim, fontSize: "0.78rem" }}>
        Confirmed instantly. Free to cancel. Your {count > 1 ? `${unit.unit}s are` : `${unit.unit} is`} held {config?.noShowGraceMinutes ?? 15} min after the start time.
      </Typography>
    </Stack>
  );

  /* ---------------------------------------------------------------- footer */
  const footer =
    blocker ? null : step === "done" ? (
      <Button fullWidth variant="contained" size="large" onClick={onClose} sx={{ height: 50, fontWeight: 700 }}>
        Done
      </Button>
    ) : step === "details" ? (
      <Button fullWidth variant="contained" size="large" disabled={submitting} onClick={submit} sx={{ height: 50, fontWeight: 700 }}>
        {submitting ? <CircularProgress size={22} sx={{ color: "inherit" }} /> : `Confirm booking${price !== null ? ` · ~${formatUSD(price)}` : ""}`}
      </Button>
    ) : (
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ flex: 1, minWidth: 0 }} aria-live="polite">
          {slot ? (
            <>
              <Typography noWrap sx={{ fontWeight: 800, fontSize: "0.98rem" }}>
                {slot.label} – {slot.endLabel}
              </Typography>
              <Typography noWrap sx={{ color: ui.muted, fontSize: "0.82rem" }}>
                {dayText} · {stationShort}
                {price !== null ? ` · ~${formatUSD(price)}` : ""}
              </Typography>
            </>
          ) : (
            <Typography sx={{ color: ui.muted, fontSize: "0.92rem" }}>Pick a start time</Typography>
          )}
        </Box>
        <Button
          variant="contained"
          size="large"
          disabled={!slot}
          onClick={() => {
            goTo("details");
            if (!form.name) window.setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 250);
          }}
          endIcon={<ArrowForward />}
          sx={{ height: 50, px: 3, fontWeight: 700, flexShrink: 0 }}
        >
          Continue
        </Button>
      </Stack>
    );

  return (
    <>
      {header}
      {!blocker && step !== "done" && (
        <LinearProgress
          variant="determinate"
          value={step === "time" ? 50 : 100}
          aria-label={step === "time" ? "Step 1 of 2" : "Step 2 of 2"}
          sx={{ height: 2, flexShrink: 0, background: "transparent", "& .MuiLinearProgress-bar": { background: tokens.gradient } }}
        />
      )}
      <Box ref={bodyRef} sx={{ flex: 1, overflowY: "auto", overscrollBehavior: "contain", px: { xs: 2, sm: 3 }, py: { xs: 2.25, sm: 2.75 } }}>
        {blocker ?? (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: step === "time" ? -16 : 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {step === "time" ? timeStep : step === "details" ? detailsStep : result && <BookingConfirmed reservation={result} graceMinutes={config?.noShowGraceMinutes ?? 15} />}
            </motion.div>
          </AnimatePresence>
        )}
      </Box>
      {footer && (
        <Box
          sx={{
            flexShrink: 0,
            px: { xs: 2, sm: 3 },
            pt: 1.5,
            pb: "calc(12px + env(safe-area-inset-bottom))",
            borderTop: `1px solid ${ui.border}`,
            background: alpha(ui.paper, 0.96),
          }}
        >
          {footer}
        </Box>
      )}
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Dialog shell: full-screen sheet on phones, centred card on desktop   */
/* ------------------------------------------------------------------ */

const BookingDialog: React.FC<BookingDialogProps> = ({ open, onClose, ...rest }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      fullWidth
      maxWidth="sm"
      aria-labelledby="booking-title"
      slots={isMobile ? { transition: SlideUp } : undefined}
      slotProps={{
        paper: {
          sx: {
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            background: ui.paper,
            backgroundImage: "none",
            border: isMobile ? "none" : `1px solid ${ui.border}`,
            borderRadius: isMobile ? 0 : "22px",
            height: isMobile ? "100%" : "min(780px, calc(100% - 48px))",
            boxShadow: "0 30px 90px rgba(0,0,0,0.7)",
          },
        },
        backdrop: { sx: { background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" } },
      }}
    >
      <BookingFlow onClose={onClose} {...rest} />
    </Dialog>
  );
};

export default BookingDialog;
