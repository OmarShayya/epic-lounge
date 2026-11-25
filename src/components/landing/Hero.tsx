import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { ArrowForward, EventAvailable } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { tokens } from "@theme/theme";
import { menuApi } from "@services/api";
import type { PCStats } from "@services/api";
import { OPENING_HOURS } from "@utils/constants";
import Magnetic from "@components/common/Magnetic";

const ease = [0.22, 1, 0.36, 1] as const;

/** Letters flip up into place in 3D, one after another. */
const FlipWord: React.FC<{ word: string; delay: number; accent?: boolean }> = ({ word, delay, accent }) => (
  <Box component="span" sx={{ display: "block", perspective: "600px", whiteSpace: "nowrap" }}>
    {word.split("").map((ch, i) => (
      <motion.span
        key={i}
        initial={{ rotateX: -95, y: 30, opacity: 0 }}
        animate={{ rotateX: 0, y: 0, opacity: 1 }}
        transition={{ delay: delay + i * 0.045, duration: 0.8, ease }}
        style={{ display: "inline-block", transformOrigin: "50% 100%" }}
        className={accent ? "gradient-text" : undefined}
      >
        {ch}
      </motion.span>
    ))}
  </Box>
);

const Hero: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [stats, setStats] = useState<PCStats | null>(null);

  // Load three.js lazily so it never blocks the first paint
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    const el = sceneRef.current;
    if (!el) return;

    const supportsWebGL = (() => {
      try {
        const c = document.createElement("canvas");
        return !!(c.getContext("webgl2") || c.getContext("webgl"));
      } catch {
        return false;
      }
    })();
    if (!supportsWebGL) return;

    import("./heroScene")
      .then(({ mountHeroScene }) => {
        if (cancelled) return;
        cleanup = mountHeroScene(el);
        requestAnimationFrame(() => setSceneReady(true));
      })
      .catch((err) => console.error("Hero scene failed to load", err));

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  // Live availability teaser
  useEffect(() => {
    let alive = true;
    menuApi
      .getPCStatus()
      .then((d) => alive && setStats(d.stats))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const scrollToFeatures = () => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        mt: { xs: "-60px", md: "-72px" },
        minHeight: { xs: "100svh", md: "100vh" },
        display: "flex",
        overflow: "hidden",
      }}
    >
      {/* Fallback glow (visible until / if WebGL loads) */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          background: {
            xs: "radial-gradient(60% 40% at 50% 22%, rgba(0,206,209,0.18), transparent 70%), radial-gradient(50% 35% at 60% 30%, rgba(155,81,224,0.18), transparent 70%)",
            md: "radial-gradient(35% 45% at 72% 45%, rgba(0,206,209,0.16), transparent 70%), radial-gradient(30% 40% at 78% 55%, rgba(155,81,224,0.18), transparent 70%)",
          },
        }}
      />

      {/* 3D scene */}
      <Box
        ref={sceneRef}
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          opacity: sceneReady ? 1 : 0,
          transition: "opacity 1.2s ease",
        }}
      />

      {/* Fades to keep text readable and blend into the page */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: {
            xs: "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.85) 62%, #000 100%)",
            md: "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 45%, transparent 70%), linear-gradient(180deg, transparent 70%, #000 100%)",
          },
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: { xs: "flex-end", md: "center" },
          pt: { xs: "60px", md: "72px" },
          pb: { xs: 6, md: 8 },
        }}
      >
        <Stack spacing={{ xs: 2.5, md: 3.5 }} sx={{ maxWidth: 640, width: "100%" }}>
          {/* Status pill */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            <Box
              component={stats ? RouterLink : "div"}
              to="/gaming"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.25,
                px: 1.75,
                py: 0.85,
                borderRadius: 999,
                border: `1px solid ${tokens.border}`,
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(10px)",
                color: tokens.text,
                textDecoration: "none",
                fontSize: "0.85rem",
                fontWeight: 500,
                transition: "border-color .2s ease",
                "&:hover": stats ? { borderColor: tokens.borderStrong } : {},
              }}
            >
              <Box
                component="span"
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: tokens.green,
                  color: "rgba(46,229,157,0.6)",
                  animation: "pulse-dot 2s infinite",
                }}
              />
              {stats ? (
                <>
                  <span>
                    <b>{stats.available}</b> of {stats.total} PCs free right now
                  </span>
                  <ArrowForward sx={{ fontSize: 15, color: tokens.textMuted }} />
                </>
              ) : (
                <span>
                  Open {OPENING_HOURS[0]?.day.toLowerCase()} · {OPENING_HOURS[0]?.hours}
                </span>
              )}
            </Box>
          </motion.div>

          <Typography
            component="h1"
            sx={{
              fontFamily: tokens.fontDisplay,
              fontWeight: 900,
              fontSize: { xs: "3.2rem", sm: "4.6rem", md: "6.4rem" },
              lineHeight: 0.92,
              letterSpacing: "0.01em",
            }}
          >
            <FlipWord word="EPIC" delay={0.15} />
            <FlipWord word="LOUNGE" delay={0.35} accent />
          </Typography>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.7, ease }}>
            <Typography sx={{ color: tokens.textMuted, fontSize: { xs: "1rem", md: "1.25rem" }, maxWidth: 520 }}>
              <Box component="span" sx={{ color: tokens.text, fontWeight: 600 }}>
                Gamer's Heaven.
              </Box>{" "}
              High-end PCs, private PS5 rooms, billiards, live football and good coffee — all under one roof.
            </Typography>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.7, ease }}>
            <Stack direction="row" spacing={1.25} sx={{ pt: 0.5 }}>
              <Magnetic className="hero-cta">
                <Button
                  component={RouterLink}
                  to="/gaming"
                  variant="contained"
                  size="large"
                  startIcon={<EventAvailable />}
                  sx={{ width: { xs: "100%", sm: "auto" }, px: { xs: 2, sm: 4 }, whiteSpace: "nowrap", fontWeight: 700 }}
                >
                  <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>Book now</Box>
                  <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>Book a station</Box>
                </Button>
              </Magnetic>
              <Button
                component={RouterLink}
                to="/menu"
                variant="outlined"
                size="large"
                endIcon={<ArrowForward />}
                className="hero-cta"
                sx={{ backdropFilter: "blur(8px)", px: { xs: 2, sm: 4 }, whiteSpace: "nowrap" }}
              >
                <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>View menu</Box>
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>View the menu</Box>
              </Button>
            </Stack>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.8 }}>
            <Stack
              direction="row"
              flexWrap="wrap"
              useFlexGap
              spacing={{ xs: 1.5, md: 2.5 }}
              sx={{
                display: { xs: "none", sm: "flex" },
                color: tokens.textDim,
                fontSize: "0.82rem",
                fontWeight: 500,
                letterSpacing: "0.04em",
              }}
            >
              {["RTX 5070 GPUs", "244Hz monitors", "Private PS5 rooms", "Fiber internet"].map((f) => (
                <Box key={f} component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
                  <Box component="span" sx={{ width: 4, height: 4, background: tokens.cyan, transform: "rotate(45deg)" }} />
                  {f}
                </Box>
              ))}
            </Stack>
          </motion.div>
        </Stack>
      </Container>

      {/* Scroll hint */}
      <Box
        component="button"
        onClick={scrollToFeatures}
        aria-label="Scroll to features"
        sx={{
          display: { xs: "none", md: "flex" },
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
          width: 26,
          height: 42,
          borderRadius: 999,
          border: `1.5px solid ${tokens.borderStrong}`,
          background: "transparent",
          justifyContent: "center",
          pt: 1,
          "&::after": {
            content: '""',
            width: 3,
            height: 8,
            borderRadius: 2,
            background: tokens.text,
            animation: "scrollhint 1.8s ease-in-out infinite",
          },
          "@keyframes scrollhint": {
            "0%": { transform: "translateY(0)", opacity: 1 },
            "70%": { transform: "translateY(12px)", opacity: 0 },
            "100%": { transform: "translateY(0)", opacity: 0 },
          },
        }}
      />
    </Box>
  );
};

export default Hero;
