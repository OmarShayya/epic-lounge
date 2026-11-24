import React from "react";
import { Box } from "@mui/material";
import { tokens } from "@theme/theme";

const ITEMS = [
  "CS2",
  "VALORANT",
  "CS 1.6 LAN",
  "FIFA",
  "CALL OF DUTY",
  "BILLIARDS",
  "FOOSBALL",
  "CHESS",
  "LIVE FOOTBALL",
  "COFFEE & SNACKS",
];

const Diamond: React.FC<{ color: string }> = ({ color }) => (
  <Box
    component="span"
    aria-hidden="true"
    sx={{
      display: "inline-block",
      width: 7,
      height: 7,
      mx: { xs: 2.5, md: 4 },
      transform: "rotate(45deg)",
      background: color,
      borderRadius: "1px",
      flexShrink: 0,
    }}
  />
);

const Row: React.FC<{ hidden?: boolean }> = ({ hidden }) => (
  <Box
    aria-hidden={hidden ? "true" : undefined}
    sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}
  >
    {ITEMS.map((item, i) => (
      <React.Fragment key={item}>
        <Box
          component="span"
          sx={{
            fontFamily: tokens.fontDisplay,
            fontWeight: 700,
            fontSize: { xs: "0.85rem", md: "1.05rem" },
            letterSpacing: "0.14em",
            color: i % 3 === 0 ? tokens.text : tokens.textMuted,
            whiteSpace: "nowrap",
          }}
        >
          {item}
        </Box>
        <Diamond color={i % 2 === 0 ? tokens.cyan : tokens.purple} />
      </React.Fragment>
    ))}
  </Box>
);

/** Infinite, slowly scrolling strip of what you can do at Epic Lounge. */
const Marquee: React.FC = () => (
  <Box
    component="section"
    aria-label="Games and activities"
    sx={{
      position: "relative",
      overflow: "hidden",
      py: { xs: 2, md: 2.5 },
      borderTop: `1px solid ${tokens.border}`,
      borderBottom: `1px solid ${tokens.border}`,
      background: tokens.surface,
      maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
      WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
      "&:hover .marquee-track": { animationPlayState: "paused" },
    }}
  >
    <Box
      className="marquee-track"
      sx={{
        display: "flex",
        width: "max-content",
        animation: "marquee 40s linear infinite",
        willChange: "transform",
      }}
    >
      <Row />
      <Row hidden />
    </Box>
  </Box>
);

export default Marquee;
