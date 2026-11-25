import React, { useEffect, useRef } from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { Add, DarkModeOutlined, Remove, WbTwilightOutlined } from "@mui/icons-material";
import { tokens } from "@theme/theme";
import type { AvailabilitySlot } from "@/services/api";
import type { DateOption } from "@utils/reservation";
import { durationLabel } from "@utils/reservation";
import { optionSx, scrollFadeSx, ui } from "./styles";

/* ------------------------------------------------------------------ */
/* Day strip                                                           */
/* ------------------------------------------------------------------ */

export const DayPicker: React.FC<{ options: DateOption[]; value: string | null; onChange: (date: string) => void }> = ({
  options,
  value,
  onChange,
}) => {
  const scroller = useRef<HTMLDivElement>(null);

  // Keep the chosen day in view
  useEffect(() => {
    const el = scroller.current;
    const chip = value ? el?.querySelector<HTMLElement>(`[data-date="${value}"]`) : null;
    if (!el || !chip) return;
    if (chip.offsetLeft < el.scrollLeft || chip.offsetLeft + chip.offsetWidth > el.scrollLeft + el.clientWidth) {
      el.scrollTo({ left: chip.offsetLeft - 24, behavior: "smooth" });
    }
  }, [value]);

  return (
    <Box
      ref={scroller}
      role="radiogroup"
      aria-label="Day"
      className="no-scrollbar"
      sx={{ ...scrollFadeSx, position: "relative", display: "flex", gap: 1, overflowX: "auto", mx: { xs: -2, sm: -3 }, px: { xs: 2, sm: 3 }, pb: 0.5, scrollPaddingInline: { xs: 16, sm: 24 }, scrollSnapType: "x proximity" }}
    >
      {options.map((o) => {
        const selected = o.date === value;
        return (
          <Box
            key={o.date}
            component="button"
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${o.label} ${o.sub}${o.closed ? ", closed" : ""}`}
            data-date={o.date}
            disabled={o.closed}
            onClick={() => onChange(o.date)}
            sx={{ ...optionSx(selected, o.closed), flexShrink: 0, width: 76, py: { xs: 0.8, sm: 1 }, scrollSnapAlign: "start" }}
          >
            <Box sx={{ fontWeight: 700, fontSize: "0.9rem", lineHeight: 1.2 }}>{o.label}</Box>
            <Box sx={{ fontSize: "0.74rem", mt: 0.25, opacity: selected ? 0.75 : 0.7 }}>{o.closed ? "Closed" : o.sub}</Box>
          </Box>
        );
      })}
    </Box>
  );
};

/* ------------------------------------------------------------------ */
/* Session length                                                      */
/* ------------------------------------------------------------------ */

export const DurationPicker: React.FC<{ options: number[]; value: number; onChange: (minutes: number) => void }> = ({
  options,
  value,
  onChange,
}) => (
  <Box
    role="radiogroup"
    aria-label="How long"
    className="no-scrollbar"
    sx={{ display: "flex", gap: 1, overflowX: "auto", mx: { xs: -2, sm: -3 }, px: { xs: 2, sm: 3 }, pb: 0.5 }}
  >
    {options.map((m) => (
      <Box
        key={m}
        component="button"
        type="button"
        role="radio"
        aria-checked={m === value}
        onClick={() => onChange(m)}
        sx={{ ...optionSx(m === value), flexShrink: 0, minWidth: 62, px: 1.75, fontWeight: 700, fontSize: "0.95rem", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
      >
        {durationLabel(m)}
      </Box>
    ))}
  </Box>
);

/* ------------------------------------------------------------------ */
/* Number of PCs                                                       */
/* ------------------------------------------------------------------ */

export const PlayersStepper: React.FC<{ value: number; max: number; onChange: (n: number) => void }> = ({ value, max, onChange }) => {
  const btnSx = {
    width: 40,
    height: 40,
    border: `1px solid ${ui.border}`,
    background: ui.card,
    color: tokens.text,
    "&:hover": { background: ui.cardHover },
    "&.Mui-disabled": { color: ui.dim, opacity: 0.5 },
  } as const;
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <IconButton aria-label="Fewer PCs" onClick={() => onChange(value - 1)} disabled={value <= 1} sx={btnSx}>
        <Remove fontSize="small" />
      </IconButton>
      <Typography aria-live="polite" sx={{ minWidth: 26, textAlign: "center", fontFamily: tokens.fontDisplay, fontWeight: 800, fontSize: "1.3rem" }}>
        {value}
      </Typography>
      <IconButton aria-label="More PCs" onClick={() => onChange(value + 1)} disabled={value >= max} sx={btnSx}>
        <Add fontSize="small" />
      </IconButton>
    </Stack>
  );
};

/* ------------------------------------------------------------------ */
/* Start times                                                         */
/* ------------------------------------------------------------------ */

interface TimeGridProps {
  slots: AvailabilitySlot[];
  loading: boolean;
  value: string | null;
  onChange: (start: string) => void;
  /** Whether this start time works for what's being booked. */
  fits: (slot: AvailabilitySlot) => boolean;
  /** Optional scarcity hint shown under a free time, e.g. "1 left". */
  hint?: (slot: AvailabilitySlot) => string | null;
}

const gridSx = { display: "grid", gridTemplateColumns: { xs: "repeat(4, 1fr)", sm: "repeat(5, 1fr)" }, gap: 1 } as const;

export const TimeGrid: React.FC<TimeGridProps> = ({ slots, loading, value, onChange, fits, hint }) => {
  if (loading) {
    return (
      <Box sx={gridSx} aria-busy="true" aria-label="Loading times">
        {Array.from({ length: 15 }).map((_, i) => (
          <Box key={i} className="skeleton" sx={{ height: 48, borderRadius: "14px" }} />
        ))}
      </Box>
    );
  }

  const upcoming = slots.filter((s) => s.status !== "past");
  const groups = [
    { key: "evening", title: "Evening", icon: <WbTwilightOutlined sx={{ fontSize: 16 }} />, items: upcoming.filter((s) => !s.nextDay) },
    { key: "late", title: "After midnight", icon: <DarkModeOutlined sx={{ fontSize: 16 }} />, items: upcoming.filter((s) => s.nextDay) },
  ].filter((g) => g.items.length);

  return (
    <Stack spacing={1.75} role="radiogroup" aria-label="Start time">
      {groups.map((g) => (
        <Box key={g.key}>
          <Stack direction="row" alignItems="center" spacing={0.75} sx={{ color: ui.dim, mb: 0.85 }}>
            {g.icon}
            <Typography sx={{ fontSize: "0.74rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{g.title}</Typography>
          </Stack>
          <Box sx={gridSx}>
            {g.items.map((s) => {
              const ok = fits(s);
              const selected = value === s.start;
              const sub = ok ? hint?.(s) : null;
              const text = s.label.replace(":00", "");
              return (
                <Box
                  key={s.start}
                  component="button"
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={`${text}${ok ? "" : ", taken"}`}
                  disabled={!ok}
                  onClick={() => onChange(s.start)}
                  sx={{
                    ...optionSx(selected, !ok),
                    py: 0.75,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      whiteSpace: "nowrap",
                      textDecoration: ok ? "none" : "line-through",
                      textDecorationColor: "rgba(255,255,255,0.3)",
                    }}
                  >
                    {text}
                  </Box>
                  {sub && (
                    <Box sx={{ fontSize: "0.66rem", fontWeight: 700, color: selected ? "rgba(0,0,0,0.6)" : tokens.amber, lineHeight: 1.2 }}>{sub}</Box>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      ))}
    </Stack>
  );
};
