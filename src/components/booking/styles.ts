import { alpha } from "@mui/material";
import { tokens } from "@theme/theme";

/** Neutral dark surfaces for the booking window (matches the black live page). */
export const ui = {
  paper: "#0E0E13",
  card: "rgba(255,255,255,0.045)",
  cardHover: "rgba(255,255,255,0.08)",
  border: "rgba(255,255,255,0.10)",
  borderHover: "rgba(255,255,255,0.22)",
  muted: tokens.textMuted,
  dim: tokens.textDim,
} as const;

/** Big tappable option (day, duration, time, station). 44px+ touch target. */
export const optionSx = (selected: boolean, disabled = false) =>
  ({
    all: "unset",
    boxSizing: "border-box",
    cursor: disabled ? "not-allowed" : "pointer",
    textAlign: "center",
    borderRadius: "14px",
    minHeight: 44,
    background: selected ? tokens.cyan : disabled ? "rgba(255,255,255,0.02)" : ui.card,
    color: selected ? "#000" : disabled ? ui.dim : tokens.text,
    border: `1px solid ${selected ? tokens.cyan : disabled ? "rgba(255,255,255,0.05)" : ui.border}`,
    boxShadow: selected ? `0 6px 22px ${alpha(tokens.cyan, 0.3)}` : "none",
    transition: "background-color .18s ease, border-color .18s ease, transform .12s ease, box-shadow .18s ease",
    WebkitTapHighlightColor: "transparent",
    "&:hover": selected || disabled ? {} : { borderColor: ui.borderHover, background: ui.cardHover },
    "&:active": disabled ? {} : { transform: "scale(0.97)" },
    "&:focus-visible": { outline: `2px solid ${tokens.cyan}`, outlineOffset: 2 },
  }) as const;

export const sectionTitleSx = {
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: ui.muted,
  mb: 1,
} as const;

export const fieldSx = {
  "& .MuiOutlinedInput-root": { background: ui.card, borderRadius: "14px" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: ui.border },
  "& input, & textarea": { fontSize: 16 },
  "& .MuiInputLabel-root": { color: ui.muted },
} as const;

/** Fades the right edge of a horizontal scroller so it's clear more options are off-screen. */
export const scrollFadeSx = {
  maskImage: "linear-gradient(90deg, #000 calc(100% - 36px), transparent)",
  WebkitMaskImage: "linear-gradient(90deg, #000 calc(100% - 36px), transparent)",
} as const;
