import React from "react";
import { Box, Container, Typography, Button, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  SportsEsports,
  Restaurant,
  KeyboardArrowDown,
} from "@mui/icons-material";

const Hero: React.FC = () => {
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "linear-gradient(135deg, #0A1929 0%, #1a237e 100%)",
      }}
    >
      {/* Animated Background Grid */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.08,
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 2px, #00CED1 2px, #00CED1 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, #9B51E0 2px, #9B51E0 4px)
          `,
          backgroundSize: "100px 100px",
          animation: "gridMove 20s linear infinite",
          "@keyframes gridMove": {
            "0%": { transform: "translate(0, 0)" },
            "100%": { transform: "translate(100px, 100px)" },
          },
        }}
      />

      {/* Glowing Orbs */}
      <Box
        component={motion.div}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        sx={{
          position: "absolute",
          top: "10%",
          right: "10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,206,209,0.4) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <Box
        component={motion.div}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        sx={{
          position: "absolute",
          bottom: "10%",
          left: "5%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(155,81,224,0.4) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Stack spacing={4} alignItems="center" textAlign="center">
          {/* Epic Lounge Text Logo */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Typography
              sx={{
                fontSize: { xs: "3rem", sm: "4.5rem", md: "6rem" },
                fontWeight: 900,
                fontFamily: "Orbitron",
                textTransform: "uppercase",
                background:
                  "linear-gradient(135deg, #00CED1 0%, #9B51E0 50%, #FF00FF 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "gradient 4s linear infinite",
                textShadow: "0 0 80px rgba(0,206,209,0.5)",
                letterSpacing: "0.05em",
                position: "relative",
                "@keyframes gradient": {
                  "0%": { backgroundPosition: "0% center" },
                  "100%": { backgroundPosition: "200% center" },
                },
                "&::before": {
                  content: '"EPIC LOUNGE"',
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  zIndex: -1,
                  WebkitTextStroke: "2px rgba(0,206,209,0.3)",
                  WebkitTextFillColor: "transparent",
                  filter: "blur(10px)",
                },
              }}
            >
              EPIC LOUNGE
            </Typography>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
                fontWeight: 900,
                fontFamily: "Orbitron",
                textTransform: "uppercase",
                background:
                  "linear-gradient(135deg, #FFFFFF 0%, #00CED1 50%, #9B51E0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "0.02em",
              }}
            >
              GAMER'S HEAVEN
            </Typography>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: "1.2rem", sm: "1.5rem", md: "2rem" },
                fontWeight: 600,
                color: "#B2BAC2",
                maxWidth: "800px",
                lineHeight: 1.6,
              }}
            >
              The Ultimate Gaming Experience in Lebanon
            </Typography>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
          >
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                color: "#B2BAC2",
                maxWidth: "700px",
                lineHeight: 1.8,
              }}
            >
              Premium Gaming PCs • PS5 Rooms • Billiards • Foosball • Chess
              Lounge • Live Football Matches • Coffee & Snacks
            </Typography>
          </motion.div>

          {/* Gaming Controller Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.6, type: "spring" }}
          >
            <Box
              sx={{
                position: "relative",
                width: { xs: 80, md: 100 },
                height: { xs: 80, md: 100 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component={motion.div}
                animate={{
                  rotate: [0, 5, 0, -5, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(0,206,209,0.4) 0%, transparent 70%)",
                  filter: "blur(20px)",
                }}
              />
              <SportsEsports
                sx={{
                  fontSize: { xs: 60, md: 80 },
                  color: "#00CED1",
                  filter: "drop-shadow(0 0 20px rgba(0,206,209,0.8))",
                  position: "relative",
                  zIndex: 1,
                }}
              />
            </Box>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              sx={{ mt: 2 }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<Restaurant />}
                onClick={() => navigate("/menu")}
                sx={{
                  px: 5,
                  py: 2,
                  fontSize: "1.1rem",
                  background:
                    "linear-gradient(135deg, #00CED1 0%, #9B51E0 100%)",
                  boxShadow: "0 8px 32px rgba(0,206,209,0.4)",
                  fontFamily: "Orbitron",
                  fontWeight: 700,
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #5FE3E6 0%, #BA7FED 100%)",
                    boxShadow: "0 12px 48px rgba(155,81,224,0.6)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                View Menu
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<SportsEsports />}
                onClick={scrollToFeatures}
                sx={{
                  px: 5,
                  py: 2,
                  fontSize: "1.1rem",
                  borderColor: "#00CED1",
                  color: "#00CED1",
                  borderWidth: 2,
                  fontFamily: "Orbitron",
                  fontWeight: 700,
                  "&:hover": {
                    borderColor: "#9B51E0",
                    color: "#9B51E0",
                    borderWidth: 2,
                    background: "rgba(155,81,224,0.1)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                Explore Features
              </Button>
            </Stack>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
          >
            <Box
              onClick={scrollToFeatures}
              sx={{
                mt: 6,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                animation: "bounce 2s infinite",
                "@keyframes bounce": {
                  "0%, 100%": { transform: "translateY(0)" },
                  "50%": { transform: "translateY(10px)" },
                },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "#00CED1",
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  mb: 1,
                  fontFamily: "Orbitron",
                  fontWeight: 600,
                }}
              >
                Scroll Down
              </Typography>
              <KeyboardArrowDown
                sx={{
                  fontSize: 40,
                  color: "#00CED1",
                }}
              />
            </Box>
          </motion.div>
        </Stack>
      </Container>
    </Box>
  );
};

export default Hero;
