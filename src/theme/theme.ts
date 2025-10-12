import { createTheme } from "@mui/material/styles";

// Epic Lounge Brand Colors
const colors = {
  primary: {
    main: "#00CED1", // Turquoise (from logo)
    light: "#5FE3E6",
    dark: "#008B8D",
  },
  secondary: {
    main: "#9B51E0", // Purple (from logo)
    light: "#BA7FED",
    dark: "#7829C8",
  },
  background: {
    default: "#0A1929", // Dark blue-grey
    paper: "#132F4C",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#B2BAC2",
  },
  gaming: {
    neon: "#00FF88",
    accent: "#FF00FF",
  },
};

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    text: colors.text,
  },
  typography: {
    fontFamily: '"Orbitron", "Rajdhani", "Roboto", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: "4rem",
      letterSpacing: "0.02em",
      textTransform: "uppercase",
      background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    h2: {
      fontWeight: 700,
      fontSize: "3rem",
      letterSpacing: "0.01em",
      textTransform: "uppercase",
    },
    h3: {
      fontWeight: 700,
      fontSize: "2rem",
      letterSpacing: "0.01em",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    button: {
      fontWeight: 700,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "12px 32px",
          fontSize: "1rem",
          boxShadow: "0 4px 20px rgba(0, 206, 209, 0.3)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 30px rgba(0, 206, 209, 0.5)",
          },
        },
        contained: {
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgba(19, 47, 76, 0.8)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(0, 206, 209, 0.2)",
          transition: "all 0.3s ease",
          "&:hover": {
            border: "1px solid rgba(0, 206, 209, 0.5)",
            transform: "translateY(-4px)",
            boxShadow: "0 8px 30px rgba(155, 81, 224, 0.3)",
          },
        },
      },
    },
  },
});

export default theme;
