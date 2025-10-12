import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { Restaurant } from "@mui/icons-material";

const MenuHeader: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Box sx={{ textAlign: "center", py: { xs: 4, md: 6 } }}>
        <Stack spacing={2} alignItems="center">
          {/* Icon */}
          <Box
            sx={{
              position: "relative",
              width: 80,
              height: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              component={motion.div}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(0,206,209,0.3) 0%, transparent 70%)",
                filter: "blur(15px)",
              }}
            />
            <Restaurant
              sx={{
                fontSize: 50,
                color: "#00CED1",
                filter: "drop-shadow(0 0 15px rgba(0,206,209,0.6))",
                position: "relative",
                zIndex: 1,
              }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h2"
            sx={{
              fontFamily: "Orbitron",
              fontWeight: 800,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              background: "linear-gradient(135deg, #00CED1 0%, #9B51E0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Our Menu
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="h6"
            sx={{
              color: "#B2BAC2",
              maxWidth: "600px",
              fontSize: { xs: "1rem", md: "1.2rem" },
            }}
          >
            Fuel your gaming session with our selection of snacks and beverages
          </Typography>

          {/* Decorative Line */}
          <Box
            sx={{
              width: { xs: 100, md: 150 },
              height: 3,
              background:
                "linear-gradient(90deg, transparent, #00CED1, transparent)",
              mt: 2,
            }}
          />
        </Stack>
      </Box>
    </motion.div>
  );
};

export default MenuHeader;
