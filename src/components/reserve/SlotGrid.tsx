import React from "react";
import { Box, Button, Stack, Typography, alpha } from "@mui/material";
import { DarkModeOutlined, WbTwilightOutlined } from "@mui/icons-material";
import { tokens } from "@theme/theme";
import type { AvailabilitySlot } from "@/services/api";

interface SlotGridProps {
  slots: AvailabilitySlot[];
  loading: boolean;
  closed: boolean;
  count: number;
  /** Total stations of this type (to tell "all free" from "almost gone"). */
  total: number;
  unitMany: string;
  value: string | null;
  onChange: (start: string) => void;
  onNextDay?: () => void;
}

const SlotButton: React.FC<{
  slot: AvailabilitySlot;
  count: number;
  total: number;
  selected: boolean;
  onClick: () => void;
}> = ({ slot, count, total, selected, onClick }) => {
  const enough = slot.status === "available" && slot.availableCount >= count;
  // Only warn when some stations are already taken and this booking would (almost) fill the rest
  const few = enough && slot.availableCount < total && slot.availableCount - count <= 1;
  const sub =
    slot.status === "full"
      ? "Full"
      : !enough
        ? `Only ${slot.availableCount} free`
        : few
          ? `${slot.availableCount} left`
          : `${slot.availableCount} free`;

  return (
    <Box
      component="button"
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={`${slot.label}, ${sub}`}
      disabled={!enough}
      onClick={onClick}
      sx={{
        all: "unset",
        boxSizing: "border-box",
        cursor: enough ? "pointer" : "not-allowed",
        py: 1.1,
        px: 0.5,
        borderRadius: "14px",
        textAlign: "center",
        background: selected ? tokens.cyan : enough ? tokens.menuCard : "rgba(255,255,255,0.03)",
        border: `1px solid ${selected ? tokens.cyan : enough ? tokens.menuBorder : "rgba(255,255,255,0.05)"}`,
        color: selected ? "#000" : enough ? tokens.text : tokens.menuTextDim,
        transition: "background-color .2s ease, border-color .2s ease, transform .15s ease",
        "&:hover": enough && !selected ? { borderColor: alpha(tokens.cyan, 0.6), background: tokens.menuCardHover } : {},
        "&:active": enough ? { transform: "scale(0.97)" } : {},
        "&:focus-visible": { outline: `2px solid ${tokens.cyan}`, outlineOffset: 2 },
      }}
    >
      <Box
        sx={{
          fontWeight: 700,
          fontSize: "0.98rem",
          textDecoration: enough ? "none" : "line-through",
          textDecorationColor: "rgba(255,255,255,0.25)",
        }}
      >
        {slot.label}
      </Box>
      <Box
        sx={{
          fontSize: "0.72rem",
          fontWeight: 600,
          mt: 0.25,
          color: selected ? "rgba(0,0,0,0.65)" : enough ? (few ? tokens.amber : tokens.green) : tokens.menuTextDim,
        }}
      >
        {sub}
      </Box>
    </Box>
  );
};

const gridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "repeat(3, 1fr)", sm: "repeat(4, 1fr)", lg: "repeat(5, 1fr)" },
  gap: 1,
} as const;

/** Start times for the chosen night, grouped into evening / after midnight. */
const SlotGrid: React.FC<SlotGridProps> = ({ slots, loading, closed, count, total, unitMany, value, onChange, onNextDay }) => {
  if (loading) {
    return (
      <Box sx={gridSx} aria-busy="true" aria-label="Loading times">
        {Array.from({ length: 12 }).map((_, i) => (
          <Box key={i} className="skeleton" sx={{ height: 58, borderRadius: "14px" }} />
        ))}
      </Box>
    );
  }

  const upcoming = slots.filter((s) => s.status !== "past");
  const hadPast = upcoming.length < slots.length;

  if (closed || !upcoming.length) {
    return (
      <Box sx={{ p: 2.5, borderRadius: "16px", background: tokens.menuCard, border: `1px solid ${tokens.menuBorder}`, textAlign: "center" }}>
        <Typography sx={{ fontWeight: 600 }}>{closed ? "We're closed on this day" : "No more start times tonight"}</Typography>
        <Typography sx={{ color: tokens.menuText, fontSize: "0.9rem", mt: 0.5 }}>Pick another day to see free times.</Typography>
        {onNextDay && (
          <Button variant="outlined" size="small" onClick={onNextDay} sx={{ mt: 1.5 }}>
            Next open day
          </Button>
        )}
      </Box>
    );
  }

  const anyFits = upcoming.some((s) => s.status === "available" && s.availableCount >= count);
  const groups = [
    { key: "evening", title: "Evening", icon: <WbTwilightOutlined sx={{ fontSize: 17 }} />, items: upcoming.filter((s) => !s.nextDay) },
    { key: "late", title: "After midnight", icon: <DarkModeOutlined sx={{ fontSize: 17 }} />, items: upcoming.filter((s) => s.nextDay) },
  ].filter((g) => g.items.length);

  return (
    <Stack spacing={2} role="radiogroup" aria-label="Start time">
      {!anyFits && (
        <Box
          role="status"
          sx={{ px: 2, py: 1.25, borderRadius: "12px", background: alpha(tokens.amber, 0.12), border: `1px solid ${alpha(tokens.amber, 0.35)}`, fontSize: "0.9rem" }}
        >
          No time has {count} {unitMany} free together on this day. Try fewer, a shorter session or another day.
        </Box>
      )}
      {groups.map((g) => (
        <Box key={g.key}>
          <Stack direction="row" alignItems="center" spacing={0.75} sx={{ color: tokens.menuText, mb: 1 }}>
            {g.icon}
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {g.title}
            </Typography>
          </Stack>
          <Box sx={gridSx}>
            {g.items.map((s) => (
              <SlotButton key={s.start} slot={s} count={count} total={total} selected={value === s.start} onClick={() => onChange(s.start)} />
            ))}
          </Box>
        </Box>
      ))}
      {hadPast && (
        <Typography sx={{ color: tokens.menuTextDim, fontSize: "0.8rem" }}>Earlier times have already passed.</Typography>
      )}
    </Stack>
  );
};

export default SlotGrid;
