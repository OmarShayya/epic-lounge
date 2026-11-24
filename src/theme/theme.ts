import { createTheme, alpha } from "@mui/material/styles";

/**
 * Epic Lounge design tokens.
 * Pure black base, with the logo's turquoise + purple used as accents only.
 */
export const tokens = {
  bg: "#000000",
  surface: "#0B0B0E",
  surfaceRaised: "#121217",
  surfaceHover: "#17171D",
  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.16)",
  text: "#F5F5F7",
  textMuted: "#9A9AA6",
  textDim: "#62626E",
  cyan: "#00CED1",
  cyanBright: "#3DF2F5",
  purple: "#9B51E0",
  purpleBright: "#B57CFF",
  green: "#2EE59D",
  red: "#FF4D6D",
  amber: "#FFB347",
  whatsapp: "#25D366",
  // Menu page: brand-tinted purple → navy surfaces (clearly not black)
  menuBg: "#1A1E36",
  menuPageBg:
    "radial-gradient(900px 480px at 90% -5%, rgba(155,81,224,0.45), transparent 60%), radial-gradient(800px 420px at 0% 0%, rgba(0,206,209,0.22), transparent 60%), linear-gradient(180deg, #241C42 0%, #1B2140 38%, #161C33 100%)",
  menuCard: "#262B49",
  menuCardHover: "#2D3354",
  menuBorder: "rgba(255,255,255,0.11)",
  menuText: "#B8BBD0",
  menuTextDim: "#9095B0",
  fontDisplay: '"Orbitron", "Space Grotesk", system-ui, sans-serif',
  fontBody: '"Space Grotesk", system-ui, -apple-system, "Segoe UI", sans-serif',
  headerHeight: { xs: 60, md: 72 },
  gradient: "linear-gradient(135deg, #00CED1 0%, #9B51E0 100%)",
} as const;

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: tokens.cyan, light: tokens.cyanBright, dark: "#009DA0", contrastText: "#000" },
    secondary: { main: tokens.purple, light: tokens.purpleBright, dark: "#7829C8" },
    success: { main: tokens.green },
    error: { main: tokens.red },
    warning: { main: tokens.amber },
    background: { default: tokens.bg, paper: tokens.surface },
    text: { primary: tokens.text, secondary: tokens.textMuted },
    divider: tokens.border,
  },
  typography: {
    fontFamily: tokens.fontBody,
    h1: { fontFamily: tokens.fontDisplay, fontWeight: 800, letterSpacing: "0.01em", lineHeight: 1.05 },
    h2: { fontFamily: tokens.fontDisplay, fontWeight: 800, letterSpacing: "0.01em", lineHeight: 1.1 },
    h3: { fontFamily: tokens.fontDisplay, fontWeight: 700, lineHeight: 1.15 },
    h4: { fontFamily: tokens.fontBody, fontWeight: 700, lineHeight: 1.2 },
    h5: { fontFamily: tokens.fontBody, fontWeight: 700 },
    h6: { fontFamily: tokens.fontBody, fontWeight: 600 },
    body1: { lineHeight: 1.65 },
    body2: { lineHeight: 1.6 },
    overline: { fontFamily: tokens.fontBody, fontWeight: 600, letterSpacing: "0.18em", lineHeight: 1.6 },
    button: { fontFamily: tokens.fontBody, fontWeight: 600, letterSpacing: "0.02em", textTransform: "none" },
  },
  // Keep MUI's 4px base so numeric sx radii stay predictable (borderRadius: 4 → 16px)
  shape: { borderRadius: 4 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: tokens.bg },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 999,
          padding: "12px 26px",
          fontSize: "0.98rem",
          transition: "background-color .25s ease, color .25s ease, border-color .25s ease, box-shadow .25s ease",
        },
        sizeLarge: { padding: "15px 32px", fontSize: "1.05rem" },
        sizeSmall: { padding: "7px 16px", fontSize: "0.85rem" },
        containedPrimary: {
          background: tokens.cyan,
          color: "#000",
          "&:hover": { background: tokens.cyanBright, boxShadow: `0 0 0 6px ${alpha(tokens.cyan, 0.14)}` },
        },
        outlined: {
          borderColor: tokens.borderStrong,
          color: tokens.text,
          "&:hover": { borderColor: tokens.text, background: "rgba(255,255,255,0.04)" },
        },
        text: { color: tokens.text, "&:hover": { background: "rgba(255,255,255,0.05)" } },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { transition: "background-color .2s ease, color .2s ease, transform .2s ease" },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: tokens.surface,
          border: `1px solid ${tokens.border}`,
          borderRadius: 16,
          boxShadow: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 999 },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: tokens.surfaceRaised,
          border: `1px solid ${tokens.border}`,
          fontSize: "0.8rem",
          fontFamily: tokens.fontBody,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: tokens.surface,
          borderRadius: 14,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: tokens.border },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: tokens.borderStrong },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: tokens.cyan, borderWidth: 1 },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { background: tokens.bg, borderColor: tokens.border },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: { backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" },
        invisible: { backgroundColor: "transparent", backdropFilter: "none" },
      },
    },
  },
});

export default theme;
