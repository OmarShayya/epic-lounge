import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Check } from "@mui/icons-material";
import { tokens } from "@theme/theme";

interface StepSectionProps {
  id: string;
  step: number;
  title: string;
  /** Short summary of the current choice, shown at the right of the title. */
  value?: React.ReactNode;
  done?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

/** A numbered block of the booking flow. */
const StepSection: React.FC<StepSectionProps> = ({ id, step, title, value, done, disabled, children }) => (
  <Box
    component="section"
    id={id}
    aria-labelledby={`${id}-title`}
    sx={{
      scrollMarginTop: { xs: 76, md: 96 },
      opacity: disabled ? 0.45 : 1,
      pointerEvents: disabled ? "none" : "auto",
      transition: "opacity .3s ease",
    }}
  >
    <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 1.5 }}>
      <Box
        aria-hidden
        sx={{
          width: 28,
          height: 28,
          flexShrink: 0,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          fontSize: "0.82rem",
          fontWeight: 800,
          color: done ? "#000" : tokens.text,
          background: done ? tokens.cyan : "rgba(255,255,255,0.08)",
          border: `1px solid ${done ? tokens.cyan : tokens.menuBorder}`,
          transition: "all .25s ease",
        }}
      >
        {done ? <Check sx={{ fontSize: 17 }} /> : step}
      </Box>
      <Typography id={`${id}-title`} component="h2" sx={{ fontWeight: 700, fontSize: { xs: "1.08rem", md: "1.2rem" } }}>
        {title}
      </Typography>
      {value && (
        <Typography
          component="span"
          sx={{
            ml: "auto !important",
            color: tokens.menuText,
            fontSize: "0.85rem",
            fontWeight: 500,
            textAlign: "right",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            minWidth: 0,
          }}
        >
          {value}
        </Typography>
      )}
    </Stack>
    {children}
  </Box>
);

export default StepSection;
