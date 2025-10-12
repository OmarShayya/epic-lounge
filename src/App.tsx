import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { theme } from "@theme/theme";
import { useCursorFollow } from "@hooks/useCursorFollow";
import { CartProvider } from "./context/CartContext";
import ScrollToTop from "@components/common/ScrollToTop";
import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";
import LandingPage from "@pages/LandingPage";
import MenuPage from "@pages/MenuPage";
import "@assets/styles/global.css";

const AppContent: React.FC = () => {
  // Initialize cursor follow effect
  useCursorFollow();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0A1929",
        cursor: "none", // Hide default cursor for custom trail
      }}
    >
      {/* Animated Background */}
      <div className="animated-bg" />

      {/* Auto scroll to top on route change */}
      <ScrollToTop />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <Box component="main" sx={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/menu" element={<MenuPage />} />
        </Routes>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
