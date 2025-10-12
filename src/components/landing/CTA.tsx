import React from "react";
import { Box, Container, Typography, Button, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Restaurant, SportsEsports, Phone } from "@mui/icons-material";
import { CONTACT_INFO } from "@utils/constants";

const CTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        py: { xs: 10, md: 15 },
        background:
          "linear-gradient(135deg, #0A1929 0%, #1a237e 50%, #0A1929 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Elements */}
      <Box
        component={motion.div}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        sx={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(0,206,209,0.2) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
        }}
      />

      <Box
        component={motion.div}
        animate={{
          rotate: [360, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        sx={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(155,81,224,0.2) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(80px)",
        }}
      />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Stack spacing={5} alignItems="center" textAlign="center">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h2"
              sx={{
                fontFamily: "Orbitron",
                fontWeight: 900,
                fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
                background:
                  "linear-gradient(135deg, #00CED1 0%, #9B51E0 50%, #FF00FF 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "gradient 3s linear infinite",
                textShadow: "0 0 60px rgba(0,206,209,0.5)",
                "@keyframes gradient": {
                  "0%": { backgroundPosition: "0% center" },
                  "100%": { backgroundPosition: "200% center" },
                },
              }}
            >
              READY TO PLAY?
            </Typography>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Typography
              variant="h5"
              sx={{
                color: "#B2BAC2",
                fontSize: { xs: "1.2rem", md: "1.5rem" },
                maxWidth: "700px",
                lineHeight: 1.6,
              }}
            >
              Join the Epic Lounge community today and experience gaming like
              never before!
            </Typography>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{ width: "100%" }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              sx={{
                justifyContent: "center",
                py: 3,
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: "Orbitron",
                    fontWeight: 900,
                    color: "#00CED1",
                    fontSize: { xs: "2rem", md: "2.5rem" },
                  }}
                >
                  RTX 4090
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#B2BAC2",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Gaming PCs
                </Typography>
              </Box>

              <Box
                sx={{
                  display: { xs: "none", sm: "block" },
                  width: "2px",
                  height: "60px",
                  background: "linear-gradient(180deg, #00CED1, #9B51E0)",
                }}
              />

              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: "Orbitron",
                    fontWeight: 900,
                    color: "#9B51E0",
                    fontSize: { xs: "2rem", md: "2.5rem" },
                  }}
                >
                  2 PS5
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#B2BAC2",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Private Rooms
                </Typography>
              </Box>

              <Box
                sx={{
                  display: { xs: "none", sm: "block" },
                  width: "2px",
                  height: "60px",
                  background: "linear-gradient(180deg, #9B51E0, #FF00FF)",
                }}
              />

              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: "Orbitron",
                    fontWeight: 900,
                    color: "#FF00FF",
                    fontSize: { xs: "2rem", md: "2.5rem" },
                  }}
                >
                  24/7
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#B2BAC2",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Open Daily
                </Typography>
              </Box>
            </Stack>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              sx={{ mt: 4 }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<Restaurant />}
                onClick={() => navigate("/menu")}
                sx={{
                  px: 5,
                  py: 2.5,
                  fontSize: "1.2rem",
                  background:
                    "linear-gradient(135deg, #00CED1 0%, #9B51E0 100%)",
                  boxShadow: "0 10px 40px rgba(0,206,209,0.5)",
                  fontFamily: "Orbitron",
                  fontWeight: 700,
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #5FE3E6 0%, #BA7FED 100%)",
                    boxShadow: "0 15px 50px rgba(155,81,224,0.7)",
                    transform: "translateY(-5px) scale(1.05)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                View Menu
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<Phone />}
                component="a"
                href={`tel:${CONTACT_INFO.phone}`}
                sx={{
                  px: 5,
                  py: 2.5,
                  fontSize: "1.2rem",
                  borderColor: "#9B51E0",
                  color: "#9B51E0",
                  borderWidth: 2,
                  fontFamily: "Orbitron",
                  fontWeight: 700,
                  "&:hover": {
                    borderColor: "#00CED1",
                    color: "#00CED1",
                    borderWidth: 2,
                    background: "rgba(0,206,209,0.1)",
                    transform: "translateY(-5px) scale(1.05)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Call Now
              </Button>
            </Stack>
          </motion.div>

          {/* Bottom Text */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Typography
              variant="body1"
              sx={{
                color: "#B2BAC2",
                fontSize: "1rem",
                mt: 4,
              }}
            >
              🎮 Walk-ins welcome • 🍕 Snacks & Coffee available • 🏆 Daily
              tournaments
            </Typography>
          </motion.div>

          {/* Pulsing Game Controller Icon */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <SportsEsports
              sx={{
                fontSize: 80,
                color: "#00CED1",
                filter: "drop-shadow(0 0 20px rgba(0,206,209,0.6))",
                mt: 4,
              }}
            />
          </motion.div>
        </Stack>
      </Container>
    </Box>
  );
};

export default CTA;
