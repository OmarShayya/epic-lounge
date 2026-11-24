import React from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { tokens } from "@theme/theme";
import { durationLabel } from "@utils/reservation";
import { pillSx } from "./styles";

interface DurationChipsProps {
  options: number[];
  value: number;
  onChange: (minutes: number) => void;
}

export const DurationChips: React.FC<DurationChipsProps> = ({ options, value, onChange }) => (
  <Box role="radiogroup" aria-label="Duration" sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
    {options.map((m) => (
      <Box
        key={m}
        component="button"
        type="button"
        role="radio"
        aria-checked={m === value}
        onClick={() => onChange(m)}
        sx={{ ...pillSx(m === value), minWidth: 64 }}
      >
        {durationLabel(m)}
      </Box>
    ))}
  </Box>
);

interface CountStepperProps {
  value: number;
  max: number;
  onChange: (n: number) => void;
  unit: { one: string; many: string };
  hint?: string;
}

export const CountStepper: React.FC<CountStepperProps> = ({ value, max, onChange, unit, hint }) => {
  const btnSx = {
    width: 44,
    height: 44,
    border: `1px solid ${tokens.menuBorder}`,
    background: tokens.menuCard,
    color: tokens.text,
    "&:hover": { background: tokens.menuCardHover },
    "&.Mui-disabled": { color: tokens.menuTextDim, opacity: 0.5 },
  } as const;
  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ flexWrap: "wrap", rowGap: 1 }}>
      <Stack direction="row" alignItems="center" spacing={1.25}>
        <IconButton aria-label={`Fewer ${unit.many}`} onClick={() => onChange(value - 1)} disabled={value <= 1} sx={btnSx}>
          <Remove />
        </IconButton>
        <Box aria-live="polite" sx={{ minWidth: 92, textAlign: "center" }}>
          <Typography component="span" sx={{ fontFamily: tokens.fontDisplay, fontWeight: 800, fontSize: "1.6rem", lineHeight: 1 }}>
            {value}
          </Typography>
          <Typography component="span" sx={{ ml: 0.75, color: tokens.menuText, fontWeight: 600 }}>
            {value === 1 ? unit.one : unit.many}
          </Typography>
        </Box>
        <IconButton aria-label={`More ${unit.many}`} onClick={() => onChange(value + 1)} disabled={value >= max} sx={btnSx}>
          <Add />
        </IconButton>
      </Stack>
      {hint && <Typography sx={{ color: tokens.menuTextDim, fontSize: "0.85rem" }}>{hint}</Typography>}
    </Stack>
  );
};
