import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { theme } from "@theme/theme";
import { CartProvider } from "./context/CartContext";
import ScrollToTop from "@components/common/ScrollToTop";
import CustomCursor from "@components/common/CustomCursor";
import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";
import LandingPage from "@pages/LandingPage";
import MenuPage from "@pages/MenuPage";
import PCStatusPage from "@pages/PCStatusPage";
import "@assets/styles/global.css";

const AppContent: React.FC = () => {
  const location = useLocation();

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="page-bg" aria-hidden="true" />
      <CustomCursor />
      <ScrollToTop />
      <Header />

      <Box component="main" sx={{ flex: 1 }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Routes location={location}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/gaming" element={<PCStatusPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Box>

      <Footer />
    </Box>
  );
};

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <MotionConfig reducedMotion="user">
      <Router>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </Router>
    </MotionConfig>
  </ThemeProvider>
);

export default App;
