import React from "react";
import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import type { SvgIconComponent } from "@mui/icons-material";
import {
  AccessTime,
  ArrowForward,
  Directions,
  LocationOn,
  Phone,
  Restaurant,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Reveal from "@components/common/Reveal";
import Magnetic from "@components/common/Magnetic";
import { CONTACT_INFO, OPENING_HOURS } from "@utils/constants";
import { tokens } from "@theme/theme";

const MAPS_URL = "https://maps.google.com/?q=Sawfar+badghan+main+road+near+habibi+cut";

const InfoRow: React.FC<{
  Icon: SvgIconComponent;
  label: string;
  children: React.ReactNode;
  color?: string;
}> = ({ Icon, label, children, color = tokens.cyan }) => (
  <Stack direction="row" spacing={2} alignItems="flex-start">
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: "12px",
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
        color,
        background: `${color}14`,
        border: `1px solid ${color}2e`,
      }}
    >
      <Icon sx={{ fontSize: 20 }} />
    </Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography
        sx={{
          color: tokens.textDim,
          fontSize: "0.75rem",
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          mb: 0.25,
        }}
      >
        {label}
      </Typography>
      <Box sx={{ color: tokens.text, fontSize: { xs: "0.98rem", md: "1.05rem" }, lineHeight: 1.5 }}>
        {children}
      </Box>
    </Box>
  </Stack>
);

/** Final "Visit us" section: location, hours, contact and the main calls to action. */
const Location: React.FC = () => {
  const navigate = useNavigate();
  const telHref = `tel:${CONTACT_INFO.phone.replace(/\s+/g, "")}`;

  return (
    <Box
      component="section"
      id="location"
      sx={{ py: { xs: 9, md: 14 }, position: "relative", overflow: "hidden", scrollMarginTop: 56 }}
    >
      {/* Soft glow */}
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(600px circle at 15% 60%, ${tokens.cyan}1a, transparent 60%), radial-gradient(700px circle at 90% 30%, ${tokens.purple}1f, transparent 60%)`,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Reveal>
          <Box
            sx={{
              borderRadius: { xs: "24px", md: "28px" },
              border: `1px solid ${tokens.border}`,
              background: "rgba(11,11,14,0.8)",
              backdropFilter: "blur(12px)",
              overflow: "hidden",
            }}
          >
            <Grid container>
              {/* CTA */}
              <Grid size={{ xs: 12, md: 7 }}>
                <Box sx={{ p: { xs: 3, sm: 4, md: 5, lg: 6 }, height: "100%", display: "flex", flexDirection: "column" }}>
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
                    Visit us
                  </Typography>
                  <Typography
                    variant="h2"
                    sx={{ fontSize: { xs: "2rem", sm: "2.6rem", md: "3.4rem" }, textTransform: "uppercase", mb: 2 }}
                  >
                    Ready to <span className="gradient-text">play?</span>
                  </Typography>
                  <Typography sx={{ color: tokens.textMuted, fontSize: { xs: "1rem", md: "1.1rem" }, maxWidth: 460, mb: 4 }}>
                    No reservation needed. Just show up and game!
                  </Typography>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} useFlexGap flexWrap="wrap" sx={{ mt: "auto" }}>
                    <Magnetic>
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<Restaurant />}
                        endIcon={<ArrowForward />}
                        onClick={() => navigate("/menu")}
                        sx={{ width: { xs: "100%", sm: "auto" } }}
                      >
                        View menu
                      </Button>
                    </Magnetic>
                    <Button
                      variant="outlined"
                      startIcon={<Directions />}
                      href={MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get directions
                    </Button>
                    <Button variant="outlined" startIcon={<Phone />} href={telHref}>
                      Call now
                    </Button>
                  </Stack>
                </Box>
              </Grid>

              {/* Details */}
              <Grid size={{ xs: 12, md: 5 }}>
                <Stack
                  spacing={3}
                  sx={{
                    p: { xs: 3, sm: 4, md: 5, lg: 6 },
                    height: "100%",
                    justifyContent: "center",
                    borderTop: { xs: `1px solid ${tokens.border}`, md: "none" },
                    borderLeft: { md: `1px solid ${tokens.border}` },
                    background: "rgba(255,255,255,0.015)",
                  }}
                >
                  <InfoRow Icon={LocationOn} label="Address">
                    <Box
                      component="a"
                      href={MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: "inherit", textDecoration: "none", "&:hover": { color: tokens.cyan } }}
                    >
                      {CONTACT_INFO.address}
                    </Box>
                  </InfoRow>
                  <InfoRow Icon={AccessTime} label="Opening hours" color={tokens.purple}>
                    {OPENING_HOURS.map((schedule) => (
                      <Box key={schedule.day} sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                        <span>{schedule.day}</span>
                        <Box component="span" sx={{ color: tokens.textMuted }}>
                          {schedule.hours}
                        </Box>
                      </Box>
                    ))}
                  </InfoRow>
                  <InfoRow Icon={Phone} label="Phone">
                    <Box
                      component="a"
                      href={telHref}
                      sx={{ color: "inherit", textDecoration: "none", "&:hover": { color: tokens.cyan } }}
                    >
                      {CONTACT_INFO.phone}
                    </Box>
                  </InfoRow>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Reveal>
      </Container>
    </Box>
  );
};

export default Location;
