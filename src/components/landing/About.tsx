import React, { useEffect, useRef, useState } from "react";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import type { SvgIconComponent } from "@mui/icons-material";
import { EmojiEvents, People, Schedule, Star } from "@mui/icons-material";
import { animate, useInView } from "framer-motion";
import SectionHeading from "@components/common/SectionHeading";
import Reveal from "@components/common/Reveal";
import { tokens } from "@theme/theme";

interface Stat {
  Icon: SvgIconComponent;
  /** Numeric part that counts up. */
  value: number;
  decimals?: number;
  /** Text shown after the number, e.g. "+" or "/7". */
  suffix?: string;
  label: string;
  color: string;
}

const STATS: Stat[] = [
  { Icon: EmojiEvents, value: 50, suffix: "+", label: "Tournaments Hosted", color: tokens.cyan },
  { Icon: People, value: 5000, suffix: "+", label: "Happy Gamers", color: tokens.purple },
  { Icon: Schedule, value: 24, suffix: "/7", label: "Gaming Sessions", color: tokens.purple },
  { Icon: Star, value: 4.9, decimals: 1, label: "Average Rating", color: tokens.cyan },
];

const formatNumber = (n: number, decimals: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

const CountUp: React.FC<{ value: number; decimals?: number; suffix?: string }> = ({
  value,
  decimals = 0,
  suffix = "",
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const [display, setDisplay] = useState(() => formatNumber(0, decimals));

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(formatNumber(value, decimals));
      return;
    }
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (n) => setDisplay(formatNumber(decimals ? n : Math.round(n), decimals)),
    });
    return () => controls.stop();
  }, [inView, value, decimals]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
};

const Highlight: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = tokens.cyan,
}) => (
  <Box component="strong" sx={{ color, fontWeight: 600 }}>
    {children}
  </Box>
);

const About: React.FC = () => {
  return (
    <Box component="section" id="about" sx={{ py: { xs: 9, md: 14 }, scrollMarginTop: 56 }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 5, md: 8 }} alignItems="center">
          {/* Story */}
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionHeading
              overline="About us"
              title={
                <>
                  Built by gamers, <span className="gradient-text">for gamers</span>
                </>
              }
            />
            <Reveal delay={0.1}>
              <Stack spacing={2.5} sx={{ color: tokens.textMuted, fontSize: { xs: "1rem", md: "1.08rem" } }}>
                <Typography sx={{ fontSize: "inherit", color: "inherit" }}>
                  Welcome to <Highlight>Epic Lounge</Highlight> - Lebanon's premier gaming destination
                  where passion meets performance. Founded by gamers, for gamers, we've created the
                  ultimate space where competitive esports meets casual fun. Whether you're grinding
                  ranks in <Highlight color={tokens.purpleBright}>CS2</Highlight>, reliving nostalgia
                  with <Highlight color={tokens.purpleBright}>CS 1.6 LAN</Highlight>, battling in{" "}
                  <Highlight color={tokens.purpleBright}>FIFA</Highlight> on our private PS5 rooms, or
                  just chilling with friends over billiards and coffee - we've got you covered.
                </Typography>
                <Typography sx={{ fontSize: "inherit", color: "inherit" }}>
                  With state-of-the-art equipment, lightning-fast internet, and a vibrant community,
                  Epic Lounge isn't just a gaming center - it's a <Highlight>lifestyle</Highlight>.
                </Typography>
              </Stack>
            </Reveal>
          </Grid>

          {/* Stats + mission */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: { xs: 1.5, md: 2 },
              }}
            >
              {STATS.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 0.08} y={20}>
                  <Box
                    sx={{
                      p: { xs: 2.25, md: 3 },
                      borderRadius: "18px",
                      background: tokens.surface,
                      border: `1px solid ${tokens.border}`,
                      height: "100%",
                    }}
                  >
                    <stat.Icon sx={{ color: stat.color, fontSize: 22, mb: { xs: 1.5, md: 2 } }} />
                    <Typography
                      sx={{
                        fontFamily: tokens.fontDisplay,
                        fontWeight: 800,
                        fontSize: { xs: "1.7rem", md: "2.4rem" },
                        lineHeight: 1,
                        mb: 1,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      <CountUp value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
                    </Typography>
                    <Typography sx={{ color: tokens.textMuted, fontSize: { xs: "0.82rem", md: "0.92rem" } }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Reveal>
              ))}
            </Box>

            <Reveal delay={0.2} y={20}>
              <Box
                sx={{
                  mt: { xs: 1.5, md: 2 },
                  p: { xs: 2.5, md: 3 },
                  borderRadius: "18px",
                  border: `1px solid ${tokens.border}`,
                  background: `linear-gradient(135deg, ${tokens.cyan}0f 0%, ${tokens.purple}14 100%)`,
                }}
              >
                <Typography
                  variant="overline"
                  component="p"
                  sx={{ color: tokens.cyan, mb: 1, lineHeight: 1.4 }}
                >
                  Our Mission
                </Typography>
                <Typography sx={{ color: tokens.textMuted, fontSize: { xs: "0.95rem", md: "1rem" } }}>
                  To provide the best gaming experience in Lebanon by combining premium equipment,
                  comfortable spaces, and an awesome community. We believe gaming is more than just a
                  hobby - it's a way to connect, compete, and create memories.
                </Typography>
              </Box>
            </Reveal>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default About;
