import React from "react";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { tokens } from "@theme/theme";
import { CONTACT_INFO, OPENING_HOURS } from "@utils/constants";

const linkSx = {
  color: tokens.textMuted,
  textDecoration: "none",
  fontSize: "0.95rem",
  transition: "color .2s ease",
  "&:hover": { color: tokens.text },
} as const;

const Footer: React.FC = () => (
  <Box component="footer" sx={{ borderTop: `1px solid ${tokens.border}`, mt: "auto", position: "relative", overflow: "hidden" }}>
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
      <Grid container spacing={{ xs: 4, md: 6 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
            <Box component="img" src="/logo-96.webp" alt="" width={40} height={40} sx={{ borderRadius: "10px" }} />
            <Typography sx={{ fontFamily: tokens.fontDisplay, fontWeight: 800, letterSpacing: "0.08em" }}>
              EPIC<Box component="span" sx={{ color: tokens.cyan }}>.</Box>LOUNGE
            </Typography>
          </Stack>
          <Typography sx={{ color: tokens.textMuted, maxWidth: 360 }}>
            Lebanon's gaming destination — high-end PCs, private PS5 rooms, billiards, live football and good coffee.
          </Typography>
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <Typography variant="overline" sx={{ color: tokens.textDim }}>
            Explore
          </Typography>
          <Stack spacing={1.25} sx={{ mt: 1 }}>
            <Box component={RouterLink} to="/" sx={linkSx}>Home</Box>
            <Box component={RouterLink} to="/menu" sx={linkSx}>Menu</Box>
            <Box component={RouterLink} to="/gaming" sx={linkSx}>Live PC status</Box>
            <Box component={RouterLink} to="/reserve" sx={linkSx}>Reserve a station</Box>
            <Box component="a" href="/#features" sx={linkSx}>What's inside</Box>
          </Stack>
        </Grid>

        <Grid size={{ xs: 6, md: 4 }}>
          <Typography variant="overline" sx={{ color: tokens.textDim }}>
            Visit
          </Typography>
          <Stack spacing={1.25} sx={{ mt: 1 }}>
            <Typography sx={{ color: tokens.textMuted, fontSize: "0.95rem" }}>{CONTACT_INFO.address}</Typography>
            {OPENING_HOURS.map((h) => (
              <Typography key={h.day} sx={{ color: tokens.textMuted, fontSize: "0.95rem" }}>
                {h.day} · {h.hours}
              </Typography>
            ))}
            <Box component="a" href={`tel:${CONTACT_INFO.phone}`} sx={linkSx}>
              {CONTACT_INFO.phone}
            </Box>
          </Stack>
        </Grid>
      </Grid>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1}
        sx={{ mt: { xs: 5, md: 7 }, pt: 3, borderTop: `1px solid ${tokens.border}` }}
      >
        <Typography sx={{ color: tokens.textDim, fontSize: "0.85rem" }}>
          © {new Date().getFullYear()} Epic Lounge · Gamer's Heaven
        </Typography>
        <Typography sx={{ color: tokens.textDim, fontSize: "0.85rem" }}>
          Developed by{" "}
          <Box component="span" sx={{ color: tokens.textMuted, fontWeight: 600 }}>
            Omar Shayya & Nael Shayya
          </Box>
        </Typography>
      </Stack>
    </Container>

    {/* Oversized wordmark */}
    <Typography
      aria-hidden
      sx={{
        fontFamily: tokens.fontDisplay,
        fontWeight: 900,
        fontSize: { xs: "18vw", md: "12.5vw" },
        lineHeight: 0.8,
        textAlign: "center",
        whiteSpace: "nowrap",
        color: "transparent",
        WebkitTextStroke: "1px rgba(255,255,255,0.07)",
        userSelect: "none",
        mb: { xs: -1, md: -2 },
      }}
    >
      EPIC LOUNGE
    </Typography>
  </Box>
);

export default Footer;
