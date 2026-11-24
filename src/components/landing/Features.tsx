import React from "react";
import { Box, Container, Typography, Stack } from "@mui/material";
import type { SvgIconComponent } from "@mui/icons-material";
import {
  SportsEsports,
  SportsBar,
  Weekend,
  Wifi,
  EmojiEvents,
  Groups,
  LocalCafe,
  Casino,
  SportsFootball,
  VideogameAsset,
  TableRestaurant,
  LocalActivity,
} from "@mui/icons-material";
import SectionHeading from "@components/common/SectionHeading";
import TiltCard from "@components/common/TiltCard";
import Reveal from "@components/common/Reveal";
import { tokens } from "@theme/theme";

const setupImage = new URL(
  "../../assets/images/WhatsApp Image 2025-11-09 at 20.31.44.jpeg",
  import.meta.url
).href;

interface Feature {
  Icon: SvgIconComponent;
  title: string;
  description: string;
}

const HERO_FEATURE: Feature & { specs: string[] } = {
  Icon: VideogameAsset,
  title: "Online Gaming Zone",
  description:
    "High-end PCs with RTX 5070, 32GB RAM, 244Hz monitors for CS2, Valorant & more",
  specs: ["RTX 5070", "32GB RAM", "244Hz"],
};

const FEATURES: Feature[] = [
  {
    Icon: SportsEsports,
    title: "CS 1.6 LAN Area",
    description: "Classic Counter-Strike 1.6 on LAN for nostalgic battles with friends",
  },
  {
    Icon: Weekend,
    title: "Private PS5 Rooms",
    description: "2 exclusive PS5 rooms for FIFA, Call of Duty & latest console games",
  },
  {
    Icon: SportsBar,
    title: "Billiards Tables",
    description: "Professional pool tables for friendly matches and tournaments",
  },
  {
    Icon: Casino,
    title: "Foosball",
    description: "Fast-paced table football action with your squad",
  },
  {
    Icon: TableRestaurant,
    title: "Chess & Chill Zone",
    description: "Relaxing area to play chess, socialize, and unwind",
  },
  {
    Icon: SportsFootball,
    title: "Big Screen Football",
    description: "Watch live football matches on our massive screen with friends",
  },
  {
    Icon: LocalCafe,
    title: "Coffee & Snacks",
    description: "Fresh coffee, energy drinks, chips, chocolate & gaming fuel",
  },
  {
    Icon: Wifi,
    title: "Ultra-Fast Internet",
    description: "Fiber optic connection with ultra-low latency for competitive gaming",
  },
  {
    Icon: Groups,
    title: "Squad Sessions",
    description: "Book stations for your full squad and dominate together",
  },
  {
    Icon: EmojiEvents,
    title: "Tournaments",
    description: "Regular gaming competitions with awesome prizes",
  },
  {
    Icon: LocalActivity,
    title: "Special Events",
    description: "LAN parties, viewing parties, and exclusive gaming events",
  },
];

const IconTile: React.FC<{ Icon: SvgIconComponent; color: string; size?: number }> = ({
  Icon,
  color,
  size = 40,
}) => (
  <Box
    sx={{
      width: size,
      height: size,
      borderRadius: "12px",
      display: "grid",
      placeItems: "center",
      flexShrink: 0,
      color,
      background: `${color}14`,
      border: `1px solid ${color}2e`,
    }}
  >
    <Icon sx={{ fontSize: size * 0.55 }} />
  </Box>
);

const Features: React.FC = () => {
  return (
    <Box component="section" id="features" sx={{ py: { xs: 9, md: 14 }, scrollMarginTop: 56 }}>
      <Container maxWidth="lg">
        <SectionHeading
          overline="What's inside"
          title={
            <>
              Everything you need to <span className="gradient-text">play</span>
            </>
          }
          subtitle="PCs, consoles, pool, foosball, football on the big screen and a full snack bar — all under one roof."
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
            gridAutoRows: { md: "minmax(190px, auto)" },
            gap: { xs: 1.5, sm: 2, md: 2.5 },
          }}
        >
          {/* Hero feature */}
          <Box sx={{ gridColumn: "span 2", gridRow: { md: "span 2" } }}>
            <Reveal style={{ height: "100%" }}>
              <TiltCard max={6} sx={{ minHeight: { xs: 260, md: "100%" }, borderRadius: "22px" }}>
                <Box
                  aria-hidden="true"
                  sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url("${setupImage}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.45,
                    filter: "saturate(1.1)",
                  }}
                />
                <Box
                  aria-hidden="true"
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.65) 45%, #000 100%)",
                  }}
                />
                <Stack
                  spacing={2}
                  justifyContent="flex-end"
                  sx={{ position: "relative", height: "100%", p: { xs: 2.5, md: 4 } }}
                >
                  <IconTile Icon={HERO_FEATURE.Icon} color={tokens.cyan} size={48} />
                  <Box>
                    <Typography
                      variant="h3"
                      sx={{ fontSize: { xs: "1.4rem", md: "2rem" }, textTransform: "uppercase", mb: 1 }}
                    >
                      {HERO_FEATURE.title}
                    </Typography>
                    <Typography sx={{ color: tokens.textMuted, maxWidth: 440, fontSize: { xs: "0.95rem", md: "1.05rem" } }}>
                      {HERO_FEATURE.description}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    {HERO_FEATURE.specs.map((spec) => (
                      <Box
                        key={spec}
                        component="span"
                        sx={{
                          px: 1.5,
                          py: 0.6,
                          borderRadius: 999,
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          letterSpacing: "0.04em",
                          color: tokens.text,
                          background: "rgba(255,255,255,0.06)",
                          border: `1px solid ${tokens.borderStrong}`,
                          backdropFilter: "blur(6px)",
                        }}
                      >
                        {spec}
                      </Box>
                    ))}
                  </Stack>
                </Stack>
              </TiltCard>
            </Reveal>
          </Box>

          {/* Compact features */}
          {FEATURES.map((feature, index) => {
            const color = index % 2 === 0 ? tokens.purple : tokens.cyan;
            const isLast = index === FEATURES.length - 1;
            return (
              <Box key={feature.title} sx={{ gridColumn: isLast ? "span 2" : undefined, minWidth: 0 }}>
                <Reveal delay={Math.min(index * 0.04, 0.3)} y={20} style={{ height: "100%" }}>
                  <TiltCard glow={color} sx={{ borderRadius: "18px" }}>
                    <Stack
                      useFlexGap
                      spacing={isLast ? { xs: 1.5, md: 2.5 } : 1.5}
                      direction={isLast ? { xs: "column", md: "row" } : "column"}
                      alignItems={isLast ? { xs: "flex-start", md: "center" } : "flex-start"}
                      sx={{ p: { xs: 2, md: 2.75 }, height: "100%" }}
                    >
                      <IconTile Icon={feature.Icon} color={color} />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: { xs: "0.95rem", md: "1.05rem" },
                            lineHeight: 1.3,
                            mb: 0.5,
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          sx={{ color: tokens.textMuted, fontSize: { xs: "0.82rem", md: "0.9rem" }, lineHeight: 1.5 }}
                        >
                          {feature.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </TiltCard>
                </Reveal>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};

export default Features;
