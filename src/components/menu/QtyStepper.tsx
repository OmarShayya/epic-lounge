import React from "react";
import { Box, IconButton } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import { tokens } from "@theme/theme";

interface QtyStepperProps {
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  name: string;
  /** "solid" = cyan pill (menu), "subtle" = outlined (cart). */
  variant?: "solid" | "subtle";
}

/**
 * A round "+" button that expands into a − qty + stepper once the item is in the cart.
 */
const QtyStepper: React.FC<QtyStepperProps> = ({ quantity, onAdd, onRemove, name, variant = "solid" }) => {
  const solid = variant === "solid";
  const active = quantity > 0;
  const bg = solid ? (active ? tokens.cyan : tokens.text) : "transparent";
  const fg = solid ? "#000" : tokens.text;

  const btnSx = {
    width: 36,
    height: 36,
    color: fg,
    borderRadius: 999,
    "&:hover": { background: solid ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.06)" },
  };

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 500, damping: 36 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        background: bg,
        border: solid ? "none" : `1px solid ${tokens.borderStrong}`,
        boxShadow: solid ? "0 6px 20px rgba(0,0,0,0.45)" : "none",
        overflow: "hidden",
      }}
    >
      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            key="minus"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            style={{ display: "flex", alignItems: "center" }}
          >
            <IconButton aria-label={`Remove one ${name}`} onClick={onRemove} sx={btnSx}>
              <Remove sx={{ fontSize: 18 }} />
            </IconButton>
            <Box
              component={motion.span}
              key={quantity}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              aria-live="polite"
              sx={{ minWidth: 18, textAlign: "center", fontWeight: 700, color: fg, fontSize: "0.95rem" }}
            >
              {quantity}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
      <IconButton aria-label={`Add ${name}`} onClick={onAdd} data-cursor={active ? undefined : "Add"} sx={btnSx}>
        <Add sx={{ fontSize: 20 }} />
      </IconButton>
    </motion.div>
  );
};

export default QtyStepper;
