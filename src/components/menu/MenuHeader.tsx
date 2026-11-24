import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { tokens } from "@theme/theme";
import { GAMES } from "@/config/games";
import SearchBar from "./SearchBar";

interface MenuHeaderProps {
  query: string;
  onQueryChange: (q: string) => void;
}

// Slanted game-art panels on the right of the banner
const ART = ["cs2", "fc", "valorant"]
  .map((id) => GAMES.find((g) => g.id === id))
  .filter((g): g is NonNullable<typeof g> => !!g && !!g.cover);

const MenuHeader: React.FC<MenuHeaderProps> = ({ query, onQueryChange }) => (
  <Box sx={{ mb: { xs: 1.5, md: 2.5 } }}>
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "24px",
          height: { xs: 168, sm: 190, md: 230 },
          background: "linear-gradient(120deg, #2E2558 0%, #1F2547 60%)",
          border: `1px solid ${tokens.menuBorder}`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        }}
      >
        {/* Art slices */}
        <Box sx={{ position: "absolute", inset: 0, display: "flex", justifyContent: "flex-end" }}>
          {ART.map((g, i) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ height: "100%", marginLeft: i === 0 ? 0 : "-5%" }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: { xs: "28vw", sm: 190, md: 230 },
                  maxWidth: 260,
                  clipPath: "polygon(22% 0, 100% 0, 78% 100%, 0 100%)",
                  background: `url(${g.cover}) center 20% / cover no-repeat`,
                  filter: "saturate(1.1)",
                  transition: "transform .6s cubic-bezier(.22,1,.36,1)",
                  "&:hover": { transform: "scale(1.04)" },
                }}
              />
            </motion.div>
          ))}
        </Box>
        {/* Legibility fade */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: {
              xs: "linear-gradient(90deg, #2A2352 0%, rgba(42,35,82,0.94) 42%, rgba(42,35,82,0.35) 72%, rgba(42,35,82,0.08) 100%)",
              md: "linear-gradient(90deg, #2A2352 0%, rgba(42,35,82,0.92) 45%, rgba(42,35,82,0.2) 75%, transparent 100%)",
            },
          }}
        />
        <Stack
          justifyContent="center"
          sx={{ position: "relative", height: "100%", px: { xs: 2.25, md: 4 }, maxWidth: { xs: "68%", md: "46%" } }}
        >
          <Typography variant="overline" sx={{ color: tokens.cyan, lineHeight: 1.2, fontSize: { xs: "0.66rem", md: "0.75rem" } }}>
            Gamer fuel
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontFamily: tokens.fontDisplay,
              fontWeight: 900,
              fontSize: { xs: "2.2rem", md: "3.2rem" },
              lineHeight: 1,
              textTransform: "uppercase",
              mt: 0.5,
            }}
          >
            Menu
          </Typography>
          <Typography sx={{ color: "#D3D5E6", mt: 1, fontSize: { xs: "0.88rem", md: "1.02rem" }, lineHeight: 1.45 }}>
            Snacks & drinks for every session.{" "}
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
              Tap <b style={{ color: "#fff" }}>+</b> to add, then send your order on WhatsApp.
            </Box>
          </Typography>
        </Stack>
      </Box>
    </motion.div>

    <Box sx={{ mt: { xs: 1.5, md: 2 }, maxWidth: { md: 520 } }}>
      <SearchBar value={query} onChange={onQueryChange} />
    </Box>
  </Box>
);

export default MenuHeader;
