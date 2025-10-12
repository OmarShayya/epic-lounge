import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { motion } from "framer-motion";

const LoadingSpinner: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: 3,
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: "#00CED1",
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
            },
          }}
        />
      </motion.div>
      <Typography
        variant="h6"
        sx={{
          fontFamily: "Orbitron",
          color: "#00CED1",
          letterSpacing: "0.1em",
        }}
      >
        Loading...
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
