import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { tokens } from "@theme/theme";
import SearchBar from "./SearchBar";

interface MenuHeaderProps {
  query: string;
  onQueryChange: (q: string) => void;
}

const MenuHeader: React.FC<MenuHeaderProps> = ({ query, onQueryChange }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <Stack
      direction={{ xs: "column", md: "row" }}
      alignItems={{ xs: "stretch", md: "flex-end" }}
      justifyContent="space-between"
      spacing={{ xs: 2, md: 4 }}
      sx={{ mb: { xs: 1.5, md: 3 } }}
    >
      <Box>
        <Typography
          component="h1"
          sx={{
            fontFamily: tokens.fontDisplay,
            fontWeight: 800,
            fontSize: { xs: "2rem", md: "2.8rem" },
            lineHeight: 1,
            textTransform: "uppercase",
          }}
        >
          Menu
        </Typography>
        <Typography sx={{ color: tokens.textMuted, mt: 1, fontSize: { xs: "0.95rem", md: "1.05rem" } }}>
          Drinks, snacks & gaming fuel. Tap <b style={{ color: tokens.text }}>+</b> to add, then send your order on WhatsApp.
        </Typography>
      </Box>
      <Box sx={{ width: { xs: "100%", md: 360 }, flexShrink: 0 }}>
        <SearchBar value={query} onChange={onQueryChange} />
      </Box>
    </Stack>
  </motion.div>
);

export default MenuHeader;
