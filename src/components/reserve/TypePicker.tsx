import React from "react";
import { Box, Typography, alpha } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { tokens } from "@theme/theme";
import type { StationType } from "@/services/api";
import { formatUSD } from "@utils/reservation";
import arenaPc from "@assets/games/arena-pc.webp";
import arenaPs5 from "@assets/games/arena-ps5.webp";

interface TypePickerProps {
  value: StationType;
  onChange: (t: StationType) => void;
  types: StationType[];
  counts: Record<StationType, number>;
  priceFrom: Partial<Record<StationType, number>>;
}

const META: Record<StationType, { title: string; blurb: string; art: string; position: string; accent: string }> = {
  pc: {
    title: "Gaming PC",
    blurb: "RTX 5070 · 244Hz · CS2, VALORANT",
    art: arenaPc,
    position: "78% 30%",
    accent: "#FF9F1C",
  },
  playstation: {
    title: "PS5 room",
    blurb: "Private room · EA FC, Call of Duty",
    art: arenaPs5,
    position: "40% 25%",
    accent: tokens.cyan,
  },
};

const TypePicker: React.FC<TypePickerProps> = ({ value, onChange, types, counts, priceFrom }) => (
  <Box
    role="radiogroup"
    aria-label="Station type"
    sx={{ display: "grid", gridTemplateColumns: types.length > 1 ? "1fr 1fr" : "1fr", gap: { xs: 1.25, md: 1.75 } }}
  >
    {types.map((t) => {
      const m = META[t];
      const selected = value === t;
      const count = counts[t] ?? 0;
      return (
        <Box
          key={t}
          component="button"
          type="button"
          role="radio"
          aria-checked={selected}
          onClick={() => onChange(t)}
          disabled={count === 0}
          sx={{
            all: "unset",
            boxSizing: "border-box",
            position: "relative",
            overflow: "hidden",
            borderRadius: "20px",
            minHeight: { xs: 148, md: 176 },
            p: { xs: 1.5, md: 2 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            cursor: count ? "pointer" : "not-allowed",
            opacity: count ? 1 : 0.5,
            border: `2px solid ${selected ? tokens.cyan : "transparent"}`,
            boxShadow: selected ? `0 0 0 4px ${alpha(tokens.cyan, 0.18)}, 0 16px 40px rgba(0,0,0,0.35)` : "0 10px 30px rgba(0,0,0,0.3)",
            transition: "border-color .2s ease, box-shadow .2s ease, transform .2s ease",
            "&:hover": { transform: count ? "translateY(-2px)" : "none" },
            "&:focus-visible": { outline: `2px solid ${tokens.cyan}`, outlineOffset: 3 },
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              background: `url(${m.art}) ${m.position} / cover no-repeat`,
              transition: "transform .6s cubic-bezier(.22,1,.36,1)",
            },
            "&:hover::before": { transform: "scale(1.05)" },
            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(10,10,25,0.1) 0%, rgba(10,10,25,0.55) 45%, rgba(10,10,25,0.95) 100%)",
            },
          }}
        >
          {selected && (
            <CheckCircle sx={{ position: "absolute", top: 10, right: 10, zIndex: 1, color: tokens.cyan, fontSize: 26 }} />
          )}
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography
              sx={{
                fontFamily: tokens.fontDisplay,
                fontWeight: 800,
                fontSize: { xs: "1.02rem", md: "1.3rem" },
                textTransform: "uppercase",
                color: "#fff",
                lineHeight: 1.1,
              }}
            >
              {m.title}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.78)", fontSize: { xs: "0.74rem", md: "0.85rem" }, mt: 0.5, display: { xs: "none", sm: "block" } }}>
              {m.blurb}
            </Typography>
            <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mt: 1 }}>
              <Box component="span" sx={chipSx}>
                {count} {t === "pc" ? (count === 1 ? "PC" : "PCs") : count === 1 ? "room" : "rooms"}
              </Box>
              {priceFrom[t] !== undefined && (
                <Box component="span" sx={{ ...chipSx, background: alpha(m.accent, 0.9), color: "#000", borderColor: "transparent" }}>
                  {formatUSD(priceFrom[t]!)}/h
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      );
    })}
  </Box>
);

const chipSx = {
  px: 1,
  py: 0.3,
  borderRadius: "999px",
  fontSize: "0.74rem",
  fontWeight: 700,
  color: "#fff",
  background: "rgba(0,0,0,0.45)",
  border: "1px solid rgba(255,255,255,0.2)",
  backdropFilter: "blur(6px)",
} as const;

export default TypePicker;
