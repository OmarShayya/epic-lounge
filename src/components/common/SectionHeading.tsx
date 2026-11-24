import React from "react";
import { Box, Typography } from "@mui/material";
import Reveal from "./Reveal";
import { tokens } from "@theme/theme";

interface SectionHeadingProps {
  overline: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ overline, title, subtitle, align = "left" }) => (
  <Reveal>
    <Box
      sx={{
        textAlign: align,
        mx: align === "center" ? "auto" : 0,
        maxWidth: 720,
        mb: { xs: 4, md: 6 },
      }}
    >
      <Typography
        variant="overline"
        component="p"
        sx={{
          color: tokens.cyan,
          display: "inline-flex",
          alignItems: "center",
          gap: 1.25,
          mb: 1.5,
          "&::before": {
            content: '""',
            width: 18,
            height: 2,
            borderRadius: 2,
            background: tokens.cyan,
          },
        }}
      >
        {overline}
      </Typography>
      <Typography
        variant="h2"
        sx={{ fontSize: { xs: "1.9rem", sm: "2.4rem", md: "3rem" }, textTransform: "uppercase" }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography sx={{ color: tokens.textMuted, mt: 2, fontSize: { xs: "1rem", md: "1.1rem" } }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  </Reveal>
);

export default SectionHeading;
