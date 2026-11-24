import { tokens } from "@theme/theme";

/** Shared pill-button look for the booking flow (durations, station chips). */
export const pillSx = (selected: boolean) =>
  ({
    all: "unset",
    boxSizing: "border-box",
    cursor: "pointer",
    px: 2,
    height: 44,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "999px",
    fontWeight: 700,
    fontSize: "0.95rem",
    background: selected ? tokens.cyan : tokens.menuCard,
    color: selected ? "#000" : tokens.text,
    border: `1px solid ${selected ? tokens.cyan : tokens.menuBorder}`,
    transition: "background-color .2s ease, border-color .2s ease, transform .15s ease",
    "&:hover": selected ? {} : { borderColor: "rgba(255,255,255,0.25)", background: tokens.menuCardHover },
    "&:active": { transform: "scale(0.97)" },
    "&:focus-visible": { outline: `2px solid ${tokens.cyan}`, outlineOffset: 2 },
  }) as const;
