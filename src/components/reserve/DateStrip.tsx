import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { tokens } from "@theme/theme";
import type { DateOption } from "@utils/reservation";

interface DateStripProps {
  options: DateOption[];
  value: string | null;
  onChange: (date: string) => void;
}

/** Horizontally scrollable day picker; closed days are disabled. */
const DateStrip: React.FC<DateStripProps> = ({ options, value, onChange }) => {
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scroller.current;
    if (!el || !value) return;
    const chip = el.querySelector<HTMLElement>(`[data-date="${value}"]`);
    if (!chip) return;
    const left = chip.offsetLeft - el.clientWidth / 2 + chip.clientWidth / 2;
    el.scrollTo({ left, behavior: "smooth" });
  }, [value]);

  return (
    <Box
      ref={scroller}
      role="radiogroup"
      aria-label="Day"
      className="no-scrollbar"
      sx={{
        display: "flex",
        gap: 1,
        overflowX: "auto",
        mx: { xs: -2, sm: 0 },
        px: { xs: 2, sm: 0 },
        pb: 0.5,
        scrollSnapType: "x proximity",
      }}
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
            data-date={o.date}
            disabled={o.closed}
            onClick={() => onChange(o.date)}
            title={o.hours}
            sx={{
              all: "unset",
              boxSizing: "border-box",
              flexShrink: 0,
              scrollSnapAlign: "start",
              width: 84,
              py: 1.25,
              borderRadius: "16px",
              textAlign: "center",
              cursor: o.closed ? "not-allowed" : "pointer",
              background: selected ? tokens.cyan : tokens.menuCard,
              color: selected ? "#000" : o.closed ? tokens.menuTextDim : tokens.text,
              border: `1px solid ${selected ? tokens.cyan : tokens.menuBorder}`,
              opacity: o.closed ? 0.55 : 1,
              transition: "background-color .2s ease, border-color .2s ease, transform .15s ease",
              "&:hover": o.closed || selected ? {} : { borderColor: "rgba(255,255,255,0.25)", background: tokens.menuCardHover },
              "&:active": { transform: "scale(0.97)" },
              "&:focus-visible": { outline: `2px solid ${tokens.cyan}`, outlineOffset: 2 },
            }}
          >
            <Box sx={{ fontWeight: 700, fontSize: "0.92rem", lineHeight: 1.2 }}>{o.label}</Box>
            <Box sx={{ fontSize: "0.75rem", mt: 0.25, opacity: selected ? 0.75 : 0.7 }}>{o.closed ? "Closed" : o.sub}</Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default DateStrip;
