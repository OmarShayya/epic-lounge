import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  IconButton,
  Link,
} from "@mui/material";
import {
  Facebook,
  Instagram,
  Twitter,
  Phone,
  Email,
  LocationOn,
} from "@mui/icons-material";
import { CONTACT_INFO, SOCIAL_LINKS } from "@utils/constants";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(180deg, #0A1929 0%, #000000 100%)",
        borderTop: "1px solid rgba(0,206,209,0.2)",
        py: 6,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand & Description */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2}>
              {/* Epic Lounge Text Logo */}
              <Typography
                sx={{
                  fontSize: "2rem",
                  fontWeight: 900,
                  fontFamily: "Orbitron",
                  textTransform: "uppercase",
                  background:
                    "linear-gradient(135deg, #00CED1 0%, #9B51E0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "0.05em",
                  mb: 1,
                }}
              >
                EPIC LOUNGE
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#B2BAC2",
                  lineHeight: 1.7,
                }}
              >
                Lebanon's premier gaming destination. Experience the ultimate in
                competitive gaming, casual play, and community events.
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton
                  component="a"
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "#00CED1",
                    "&:hover": {
                      color: "#9B51E0",
                      transform: "translateY(-3px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <Facebook />
                </IconButton>
                <IconButton
                  component="a"
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "#00CED1",
                    "&:hover": {
                      color: "#9B51E0",
                      transform: "translateY(-3px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <Instagram />
                </IconButton>
                <IconButton
                  component="a"
                  href={SOCIAL_LINKS.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "#00CED1",
                    "&:hover": {
                      color: "#9B51E0",
                      transform: "translateY(-3px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <Twitter />
                </IconButton>
              </Stack>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Orbitron",
                fontWeight: 700,
                color: "#00CED1",
                mb: 2,
              }}
            >
              Quick Links
            </Typography>
            <Stack spacing={1}>
              <Link
                href="/"
                sx={{
                  color: "#B2BAC2",
                  textDecoration: "none",
                  "&:hover": {
                    color: "#00CED1",
                  },
                  transition: "color 0.3s ease",
                }}
              >
                Home
              </Link>
              <Link
                href="/menu"
                sx={{
                  color: "#B2BAC2",
                  textDecoration: "none",
                  "&:hover": {
                    color: "#00CED1",
                  },
                  transition: "color 0.3s ease",
                }}
              >
                Menu
              </Link>
              <Link
                href="/gaming"
                sx={{
                  color: "#B2BAC2",
                  textDecoration: "none",
                  "&:hover": {
                    color: "#00CED1",
                  },
                  transition: "color 0.3s ease",
                }}
              >
                Gaming Status
              </Link>
              <Link
                href="/#features"
                sx={{
                  color: "#B2BAC2",
                  textDecoration: "none",
                  "&:hover": {
                    color: "#00CED1",
                  },
                  transition: "color 0.3s ease",
                }}
              >
                Features
              </Link>
              <Link
                href="/#about"
                sx={{
                  color: "#B2BAC2",
                  textDecoration: "none",
                  "&:hover": {
                    color: "#00CED1",
                  },
                  transition: "color 0.3s ease",
                }}
              >
                About Us
              </Link>
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Orbitron",
                fontWeight: 700,
                color: "#00CED1",
                mb: 2,
              }}
            >
              Contact Us
            </Typography>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocationOn sx={{ color: "#9B51E0", fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: "#B2BAC2" }}>
                  {CONTACT_INFO.address}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Phone sx={{ color: "#9B51E0", fontSize: 20 }} />
                <Typography
                  component="a"
                  href={`tel:${CONTACT_INFO.phone}`}
                  variant="body2"
                  sx={{
                    color: "#B2BAC2",
                    textDecoration: "none",
                    "&:hover": {
                      color: "#00CED1",
                    },
                  }}
                >
                  {CONTACT_INFO.phone}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Email sx={{ color: "#9B51E0", fontSize: 20 }} />
                <Typography
                  component="a"
                  href={`mailto:${CONTACT_INFO.email}`}
                  variant="body2"
                  sx={{
                    color: "#B2BAC2",
                    textDecoration: "none",
                    "&:hover": {
                      color: "#00CED1",
                    },
                  }}
                >
                  {CONTACT_INFO.email}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box
          sx={{
            mt: 6,
            pt: 3,
            borderTop: "1px solid rgba(0,206,209,0.2)",
          }}
        >
          <Stack spacing={1.5} alignItems="center">
            {/* Main Copyright */}
            <Typography
              variant="body2"
              sx={{
                color: "#B2BAC2",
                textAlign: "center",
              }}
            >
              © {new Date().getFullYear()} Epic Lounge. All rights reserved. |
              Gamer's Heaven
            </Typography>

            {/* Developer Credit - Subtle & Cool */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                opacity: 0.6,
                transition: "opacity 0.3s ease",
                "&:hover": {
                  opacity: 1,
                  "& .dev-text": {
                    background:
                      "linear-gradient(135deg, #00CED1 0%, #9B51E0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  },
                },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(178,186,194,0.6)",
                  fontSize: "0.75rem",
                  fontFamily: "monospace",
                  letterSpacing: "0.05em",
                }}
              >
                Developed
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  color: "rgba(178,186,194,0.6)",
                  fontSize: "0.75rem",
                  fontFamily: "monospace",
                  letterSpacing: "0.05em",
                }}
              >
                by
              </Typography>
              <Typography
                className="dev-text"
                variant="caption"
                sx={{
                  color: "#00CED1",
                  fontSize: "0.75rem",
                  fontFamily: "Orbitron",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  transition: "all 0.3s ease",
                }}
              >
                Omar Shayya & Nael Shayya
              </Typography>
              <Box
                sx={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "#00CED1",
                  animation: "blink 1.5s ease-in-out infinite",
                  "@keyframes blink": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.3 },
                  },
                }}
              />
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
