import React, { useState } from "react";
import { Fab, Badge } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import CartDrawer from "./CartDrawer";

const FloatingCart: React.FC = () => {
  const { getTotalItems } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const totalItems = getTotalItems();

  return (
    <>
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Badge
              badgeContent={totalItems}
              color="error"
              sx={{
                position: "fixed",
                bottom: { xs: 80, md: 100 },
                right: { xs: 16, md: 32 },
                zIndex: 9998,
                "& .MuiBadge-badge": {
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  fontFamily: "Orbitron",
                  minWidth: 28,
                  height: 28,
                  borderRadius: "50%",
                  border: "3px solid #0A1929",
                  top: -4,
                  right: -4,
                  zIndex: 9999,
                  boxShadow: "0 4px 12px rgba(194, 161, 158, 0.6)",
                  animation: "pulse 1.5s ease-in-out infinite",
                  "@keyframes pulse": {
                    "0%, 100%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.2)" },
                  },
                },
              }}
            >
              <Fab
                color="primary"
                onClick={() => setDrawerOpen(true)}
                component={motion.button}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                sx={{
                  width: { xs: 64, md: 72 },
                  height: { xs: 64, md: 72 },
                  background:
                    "linear-gradient(135deg, #00CED1 0%, #9B51E0 100%)",
                  boxShadow: "0 8px 32px rgba(0,206,209,0.5)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #5FE3E6 0%, #BA7FED 100%)",
                    boxShadow: "0 12px 48px rgba(155,81,224,0.7)",
                  },
                }}
              >
                <ShoppingCart sx={{ fontSize: { xs: 28, md: 32 } }} />
              </Fab>
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};

export default FloatingCart;
