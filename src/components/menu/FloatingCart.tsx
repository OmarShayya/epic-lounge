import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { ShoppingBagOutlined, ArrowForward } from "@mui/icons-material";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { tokens } from "@theme/theme";
import { formatUSD } from "@utils/helpers";
import { preloadFlags } from "@utils/flags";
import CartDrawer from "./CartDrawer";

/** Sticky "View order" bar along the bottom of the screen; bumps whenever something is added. */
const FloatingCart: React.FC = () => {
  const { getTotalItems, getTotalPrice, addCount } = useCart();
  const [open, setOpen] = useState(false);
  const controls = useAnimationControls();
  const totalItems = getTotalItems();
  const total = getTotalPrice();

  const hasItems = useRef(false);
  hasItems.current = totalItems > 0;

  // The order form shows a country flag: fetch the flags while they're still browsing
  const anyItems = totalItems > 0;
  useEffect(() => {
    if (anyItems) preloadFlags();
  }, [anyItems]);

  useEffect(() => {
    // Only animate when the bar is actually on screen (controls must be bound)
    if (addCount > 0 && hasItems.current) {
      controls.start({ scale: [1, 1.045, 1], transition: { duration: 0.35 } });
    }
  }, [addCount, controls]);

  return (
    <>
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            key="cart-bar"
            initial={{ y: 120 }}
            animate={{ y: 0 }}
            exit={{ y: 120 }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1100,
              padding: "12px 16px calc(12px + env(safe-area-inset-bottom))",
              pointerEvents: "none",
              background: "linear-gradient(180deg, transparent, rgba(22,28,51,0.9) 55%)",
            }}
          >
            <motion.button
              animate={controls}
              onClick={() => setOpen(true)}
              aria-label={`View order, ${totalItems} items, ${formatUSD(total.usd)}`}
              style={{
                pointerEvents: "auto",
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                maxWidth: 560,
                margin: "0 auto",
                height: 60,
                padding: "0 10px 0 10px",
                border: "none",
                borderRadius: 999,
                background: tokens.cyan,
                color: "#000",
                font: "inherit",
                boxShadow: "0 12px 40px rgba(0,206,209,0.25), 0 4px 16px rgba(0,0,0,0.6)",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#000",
                  color: tokens.text,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <ShoppingBagOutlined sx={{ fontSize: 20 }} />
                <Box
                  component={motion.span}
                  key={totalItems}
                  initial={{ scale: 0.4 }}
                  animate={{ scale: 1 }}
                  sx={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    minWidth: 20,
                    height: 20,
                    px: 0.5,
                    borderRadius: 999,
                    background: tokens.text,
                    color: "#000",
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    display: "grid",
                    placeItems: "center",
                    border: `2px solid ${tokens.cyan}`,
                  }}
                >
                  {totalItems}
                </Box>
              </Box>
              <Box sx={{ flex: 1, textAlign: "left", fontWeight: 700, fontSize: "1rem" }}>View order</Box>
              <Box sx={{ fontWeight: 800, fontSize: "1.05rem" }}>{formatUSD(total.usd)}</Box>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.12)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <ArrowForward sx={{ fontSize: 20 }} />
              </Box>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default FloatingCart;
