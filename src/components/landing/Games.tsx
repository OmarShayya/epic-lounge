import React from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { ArrowForward, Phone } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { tokens } from "@theme/theme";
import { CONTACT_INFO } from "@utils/constants";
import { GAMES, ARENAS } from "@/config/games";
import type { Game, Arena } from "@/config/games";
import SectionHeading from "@components/common/SectionHeading";
import TiltCard from "@components/common/TiltCard";
import Reveal from "@components/common/Reveal";

/** Portrait cover card. Falls back to a branded gradient if the art is missing. */
const GameCover: React.FC<{ game: Game; index: number; total: number }> = ({ game, index, total }) => {
  // Fan the shelf around the centre card on wide screens
  const offset = index - (total - 1) / 2;

  return (
    <Box
      sx={{
        flex: { xs: "0 0 62%", sm: "0 0 38%", md: "1 1 0" },
        minWidth: 0,
        scrollSnapAlign: "center",
        transform: { md: `rotateY(${offset * -6}deg) translateZ(${-Math.abs(offset) * 24}px)` },
        transition: "transform .5s cubic-bezier(.22,1,.36,1)",
        "&:hover": { md: { transform: "rotateY(0deg) translateZ(40px)", zIndex: 2 } },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 18 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        <TiltCard max={12} glow={game.accent} sx={{ borderRadius: "18px", aspectRatio: "2 / 3" }}>
          <Box
            data-cursor="Play"
            sx={{
              position: "absolute",
              inset: 0,
              background: game.cover
                ? `url(${game.cover}) center / cover no-repeat`
                : `radial-gradient(120% 80% at 30% 0%, ${game.accent}55, transparent 60%), ${tokens.surfaceRaised}`,
              transition: "transform .6s cubic-bezier(.22,1,.36,1)",
              ".MuiBox-root:hover > &": { transform: "scale(1.05)" },
            }}
          >
            {!game.cover && (
              <Typography
                sx={{
                  position: "absolute",
                  top: "38%",
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  fontFamily: tokens.fontDisplay,
                  fontWeight: 900,
                  fontSize: "2.4rem",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                {game.short}
              </Typography>
            )}
          </Box>
          {/* Legibility gradient + labels */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.92) 100%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              p: { xs: 1.5, md: 2 },
            }}
          >
            <Box
              component="span"
              sx={{
                alignSelf: "flex-start",
                mb: 1,
                px: 1.1,
                py: 0.4,
                borderRadius: "999px",
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "#000",
                background: game.platform === "PS5" ? "#fff" : tokens.cyan,
              }}
            >
              {game.platform}
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: { xs: "1rem", md: "1.05rem" }, lineHeight: 1.2 }}>
                {game.name}
              </Typography>
              <Typography sx={{ color: tokens.textMuted, fontSize: "0.8rem", mt: 0.25 }}>{game.tag}</Typography>
            </Box>
          </Box>
        </TiltCard>
      </motion.div>
    </Box>
  );
};

/** Big split banner: PC arena vs PS5 rooms, with wide key art behind each. */
const ArenaPanel: React.FC<{ arena: Arena; index: number }> = ({ arena, index }) => (
  <Reveal delay={index * 0.1} style={{ flex: 1, minWidth: 0 }}>
    <TiltCard max={5} glow={arena.accent} sx={{ borderRadius: "24px", minHeight: { xs: 340, md: 420 } }}>
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          background: arena.image
            ? `url(${arena.image}) ${arena.imagePosition ?? "center"} / cover no-repeat`
            : `radial-gradient(100% 80% at 80% 0%, ${arena.accent}44, transparent 60%), ${tokens.surfaceRaised}`,
          transform: "scale(1.02)",
          transition: "transform .8s cubic-bezier(.22,1,.36,1)",
          ".MuiBox-root:hover > &": { transform: "scale(1.08)" },
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.95) 100%)",
        }}
      />
      <Stack
        justifyContent="flex-end"
        spacing={1.5}
        sx={{ position: "relative", height: "100%", minHeight: "inherit", p: { xs: 2.5, md: 4 } }}
      >
        <Typography variant="overline" sx={{ color: arena.accent, lineHeight: 1 }}>
          {arena.overline}
        </Typography>
        <Typography
          sx={{
            fontFamily: tokens.fontDisplay,
            fontWeight: 800,
            fontSize: { xs: "1.8rem", md: "2.4rem" },
            lineHeight: 1.05,
            textTransform: "uppercase",
          }}
        >
          {arena.title}
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.75)", maxWidth: 420 }}>{arena.text}</Typography>
        <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.75}>
          {arena.chips.map((c) => (
            <Box
              key={c}
              component="span"
              sx={{
                px: 1.25,
                py: 0.5,
                borderRadius: "999px",
                fontSize: "0.78rem",
                fontWeight: 600,
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(0,0,0,0.35)",
                backdropFilter: "blur(6px)",
              }}
            >
              {c}
            </Box>
          ))}
        </Stack>
        <Box sx={{ pt: 1 }}>
          {arena.cta.kind === "link" ? (
            <Button component={RouterLink} to={arena.cta.to} variant="contained" endIcon={<ArrowForward />}>
              {arena.cta.label}
            </Button>
          ) : (
            <Button
              href={`tel:${CONTACT_INFO.phone}`}
              variant="contained"
              startIcon={<Phone />}
              sx={{ background: "#fff", "&:hover": { background: "#e9e9ee" } }}
            >
              {arena.cta.label}
            </Button>
          )}
        </Box>
      </Stack>
    </TiltCard>
  </Reveal>
);

const Games: React.FC = () => (
  <Box component="section" id="games" sx={{ pt: { xs: 9, md: 14 }, pb: { xs: 2, md: 4 }, position: "relative", overflow: "hidden" }}>
    <Container maxWidth="lg">
      <SectionHeading
        overline="Now playing"
        title={
          <>
            Pick your <span className="gradient-text">game</span>
          </>
        }
        subtitle="From ranked CS2 grinds to late-night FC matches on PS5 — the titles our regulars live on."
      />

      {/* Cover shelf */}
      <Box
        className="no-scrollbar"
        sx={{
          display: "flex",
          gap: { xs: 1.5, md: 2 },
          perspective: { md: "1400px" },
          overflowX: { xs: "auto", md: "visible" },
          scrollSnapType: { xs: "x mandatory", md: "none" },
          mx: { xs: -2, sm: -3, md: 0 },
          px: { xs: 2, sm: 3, md: 0 },
          pb: 1,
        }}
      >
        {GAMES.map((g, i) => (
          <GameCover key={g.id} game={g} index={i} total={GAMES.length} />
        ))}
      </Box>

      {/* PC vs PS5 */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 1.5, md: 2 }} sx={{ mt: { xs: 5, md: 8 } }}>
        {ARENAS.map((a, i) => (
          <ArenaPanel key={a.id} arena={a} index={i} />
        ))}
      </Stack>

      <Typography sx={{ color: tokens.textDim, fontSize: "0.72rem", mt: 2, textAlign: "right" }}>
        Game titles and artwork are trademarks of their respective owners.
      </Typography>
    </Container>
  </Box>
);

export default Games;
