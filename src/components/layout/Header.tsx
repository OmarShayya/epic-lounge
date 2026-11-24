import React, { useEffect, useState } from "react";
import { AppBar, Box, Button, Container, IconButton, Stack, Typography } from "@mui/material";
import { Phone, WhatsApp, ArrowOutward } from "@mui/icons-material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { tokens } from "@theme/theme";
import { CONTACT_INFO } from "@utils/constants";

const NAV = [
  { label: "Home", path: "/" },
  { label: "Menu", path: "/menu" },
  { label: "Live PCs", path: "/gaming" },
];

const WHATSAPP_URL = `https://wa.me/${CONTACT_INFO.phone.replace(/\D/g, "")}`;

/** Two-line hamburger that morphs into an X. */
const Burger: React.FC<{ open: boolean }> = ({ open }) => (
  <Box sx={{ position: "relative", width: 22, height: 12 }}>
    {[0, 1].map((i) => (
      <Box
        key={i}
        component="span"
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 2,
          borderRadius: 2,
          background: tokens.text,
          top: open ? 5 : i === 0 ? 0 : 10,
          transform: open ? `rotate(${i === 0 ? 45 : -45}deg)` : "none",
          transition: "all .3s cubic-bezier(.22,1,.36,1)",
        }}
      />
    ))}
  </Box>
);

const Header: React.FC = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          zIndex: 1300,
          background: scrolled || open ? "rgba(12,13,19,0.86)" : "transparent",
          backdropFilter: scrolled || open ? "saturate(160%) blur(16px)" : "none",
          WebkitBackdropFilter: scrolled || open ? "saturate(160%) blur(16px)" : "none",
          borderBottom: `1px solid ${scrolled && !open ? tokens.border : "transparent"}`,
          transition: "background .3s ease, border-color .3s ease",
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ height: tokens.headerHeight }}
          >
            {/* Logo */}
            <Box
              component={RouterLink}
              to="/"
              aria-label="Epic Lounge home"
              sx={{ display: "flex", alignItems: "center", gap: 1.25, textDecoration: "none" }}
            >
              <Box
                component="img"
                src="/logo-96.webp"
                alt=""
                width={40}
                height={40}
                sx={{ width: { xs: 36, md: 40 }, height: { xs: 36, md: 40 }, borderRadius: "10px" }}
              />
              <Typography
                sx={{
                  fontFamily: tokens.fontDisplay,
                  fontWeight: 800,
                  fontSize: { xs: "0.95rem", md: "1.05rem" },
                  letterSpacing: "0.08em",
                  color: tokens.text,
                  lineHeight: 1,
                }}
              >
                EPIC<Box component="span" sx={{ color: tokens.cyan }}>.</Box>LOUNGE
              </Typography>
            </Box>

            {/* Desktop nav */}
            <Stack direction="row" alignItems="center" spacing={1} sx={{ display: { xs: "none", md: "flex" } }}>
              <Box
                sx={{
                  display: "flex",
                  p: 0.5,
                  borderRadius: 999,
                  border: `1px solid ${tokens.border}`,
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                {NAV.map((item) => (
                  <Box
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    sx={{
                      position: "relative",
                      px: 2.25,
                      py: 1,
                      borderRadius: 999,
                      fontSize: "0.92rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      color: isActive(item.path) ? "#000" : tokens.textMuted,
                      transition: "color .25s ease",
                      "&:hover": { color: isActive(item.path) ? "#000" : tokens.text },
                    }}
                  >
                    {isActive(item.path) && (
                      <motion.span
                        layoutId="nav-pill"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: 999,
                          background: tokens.text,
                        }}
                      />
                    )}
                    <span style={{ position: "relative" }}>{item.label}</span>
                  </Box>
                ))}
              </Box>
              <Button
                href={`tel:${CONTACT_INFO.phone}`}
                variant="outlined"
                size="small"
                startIcon={<Phone sx={{ fontSize: 16 }} />}
                sx={{ ml: 1 }}
              >
                Call
              </Button>
            </Stack>

            {/* Mobile toggle */}
            <IconButton
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              sx={{
                display: { xs: "inline-flex", md: "none" },
                width: 44,
                height: 44,
                border: `1px solid ${tokens.border}`,
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <Burger open={open} />
            </IconButton>
          </Stack>
        </Container>
      </AppBar>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            key="mobile-nav"
            initial={{ clipPath: "circle(0% at calc(100% - 38px) 30px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 38px) 30px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 38px) 30px)" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1200,
              background: "#000",
              display: "flex",
              flexDirection: "column",
              paddingTop: 76,
            }}
          >
            <Box
              aria-hidden
              sx={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background:
                  "radial-gradient(500px circle at 100% 0%, rgba(155,81,224,0.18), transparent 60%), radial-gradient(400px circle at 0% 100%, rgba(0,206,209,0.14), transparent 60%)",
              }}
            />
            <Stack sx={{ px: 3, flex: 1, position: "relative" }} spacing={0.5}>
              {NAV.map((item, i) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Box
                    component={RouterLink}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      py: 2.25,
                      borderBottom: `1px solid ${tokens.border}`,
                      textDecoration: "none",
                      color: isActive(item.path) ? tokens.cyan : tokens.text,
                    }}
                  >
                    <Stack direction="row" alignItems="baseline" spacing={2}>
                      <Typography sx={{ fontFamily: tokens.fontDisplay, fontSize: "0.75rem", color: tokens.textDim }}>
                        0{i + 1}
                      </Typography>
                      <Typography sx={{ fontFamily: tokens.fontDisplay, fontWeight: 800, fontSize: "2rem", textTransform: "uppercase" }}>
                        {item.label}
                      </Typography>
                    </Stack>
                    <ArrowOutward sx={{ color: isActive(item.path) ? tokens.cyan : tokens.textDim }} />
                  </Box>
                </motion.div>
              ))}
            </Stack>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              style={{ position: "relative" }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                sx={{ px: 3, pb: "calc(24px + env(safe-area-inset-bottom))", pt: 2 }}
              >
                <Button fullWidth variant="outlined" href={`tel:${CONTACT_INFO.phone}`} startIcon={<Phone />}>
                  Call
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<WhatsApp />}
                  sx={{ background: tokens.whatsapp, color: "#000", "&:hover": { background: "#3BE07A" } }}
                >
                  WhatsApp
                </Button>
              </Stack>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
