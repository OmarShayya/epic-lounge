import React, { useState } from "react";
import { Box, Button, Drawer, IconButton, Stack, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Close, WhatsApp, ShoppingBagOutlined } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { tokens } from "@theme/theme";
import { formatLBP, formatUSD, haptic } from "@utils/helpers";
import QtyStepper from "./QtyStepper";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const WHATSAPP_NUMBER = "96170292859"; // Lebanon number

/** Your order: bottom sheet on phones, side panel on desktop. Checkout sends the order on WhatsApp. */
const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const { items, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const totals = getTotalPrice();
  const count = getTotalItems();

  const handleCheckout = () => {
    if (items.length === 0) return;

    let message = `🎮 *EPIC LOUNGE ORDER*\n\n`;
    if (customerName.trim()) message += `👤 *Customer:* ${customerName.trim()}\n\n`;
    message += `📋 *Order Details:*\n`;
    message += `━━━━━━━━━━━━━━━━\n\n`;
    items.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`;
      message += `   • Quantity: ${item.quantity}\n`;
      message += `   • Price: $${item.pricing.usd.toFixed(2)} / ${item.pricing.lbp.toLocaleString()} LBP\n`;
      message += `   • Subtotal: $${(item.pricing.usd * item.quantity).toFixed(2)} / ${(
        item.pricing.lbp * item.quantity
      ).toLocaleString()} LBP\n\n`;
    });
    message += `━━━━━━━━━━━━━━━━\n`;
    message += `💰 *TOTAL:*\n`;
    message += `   • USD: $${totals.usd.toFixed(2)}\n`;
    message += `   • LBP: ${totals.lbp.toLocaleString()}\n\n`;
    if (customerNotes.trim()) message += `📝 *Notes:* ${customerNotes.trim()}\n\n`;
    message += `📍 Epic Lounge - Sidon, Lebanon`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");

    clearCart();
    setCustomerName("");
    setCustomerNotes("");
    onClose();
  };

  return (
    <Drawer
      anchor={isMobile ? "bottom" : "right"}
      open={open}
      onClose={onClose}
      sx={{ zIndex: 1400 }}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 440 },
            maxHeight: { xs: "92dvh", sm: "100%" },
            height: { sm: "100%" },
            borderTopLeftRadius: { xs: "24px", sm: 0 },
            borderTopRightRadius: { xs: "24px", sm: 0 },
            border: `1px solid ${tokens.menuBorder}`,
            background: tokens.menuBg,
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      {/* Grab handle (mobile) */}
      <Box sx={{ display: { xs: "flex", sm: "none" }, justifyContent: "center", pt: 1.25 }}>
        <Box sx={{ width: 40, height: 4, borderRadius: 4, background: tokens.borderStrong }} />
      </Box>

      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2.5, py: 2 }}>
        <Box>
          <Typography sx={{ fontFamily: tokens.fontDisplay, fontWeight: 800, fontSize: "1.25rem", textTransform: "uppercase" }}>
            Your order
          </Typography>
          <Typography sx={{ color: tokens.textMuted, fontSize: "0.85rem" }}>
            {count} {count === 1 ? "item" : "items"}
          </Typography>
        </Box>
        <IconButton
          aria-label="Close order"
          onClick={onClose}
          sx={{ border: `1px solid ${tokens.border}`, width: 40, height: 40 }}
        >
          <Close fontSize="small" />
        </IconButton>
      </Stack>

      {/* Items */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 2.5, pb: 2, overscrollBehavior: "contain" }}>
        {items.length === 0 ? (
          <Stack alignItems="center" spacing={1.5} sx={{ py: 8, textAlign: "center" }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                border: `1px solid ${tokens.border}`,
              }}
            >
              <ShoppingBagOutlined sx={{ color: tokens.textDim, fontSize: 28 }} />
            </Box>
            <Typography sx={{ fontWeight: 600 }}>Your order is empty</Typography>
            <Typography sx={{ color: tokens.textMuted, fontSize: "0.9rem" }}>Add something from the menu to get started.</Typography>
            <Button variant="outlined" onClick={onClose} sx={{ mt: 1 }}>
              Browse menu
            </Button>
          </Stack>
        ) : (
          <>
            <Box sx={{ borderTop: `1px solid ${tokens.border}` }}>
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: "hidden" }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1.5}
                      sx={{ py: 1.75, borderBottom: `1px solid ${tokens.border}` }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 600, lineHeight: 1.3 }} noWrap>
                          {item.name}
                        </Typography>
                        <Typography sx={{ color: tokens.textDim, fontSize: "0.8rem" }}>
                          {formatUSD(item.pricing.usd)} each
                        </Typography>
                      </Box>
                      <QtyStepper
                        variant="subtle"
                        quantity={item.quantity}
                        name={item.name}
                        onAdd={() => {
                          haptic();
                          updateQuantity(item.id, item.quantity + 1);
                        }}
                        onRemove={() => {
                          haptic();
                          updateQuantity(item.id, item.quantity - 1);
                        }}
                      />
                      <Typography sx={{ fontWeight: 700, minWidth: 56, textAlign: "right" }}>
                        {formatUSD(item.pricing.usd * item.quantity)}
                      </Typography>
                    </Stack>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Box>

            <Stack spacing={1.25} sx={{ mt: 2.5 }}>
              <Typography variant="overline" sx={{ color: tokens.textDim, lineHeight: 1 }}>
                Details (optional)
              </Typography>
              <TextField
                fullWidth
                placeholder="Your name or PC number"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                size="small"
                sx={{ "& input": { fontSize: 16 } }}
              />
              <TextField
                fullWidth
                placeholder="Notes — e.g. no sugar, extra ice"
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                multiline
                minRows={2}
                size="small"
                sx={{ "& textarea": { fontSize: 16 } }}
              />
            </Stack>
          </>
        )}
      </Box>

      {/* Total + checkout */}
      {items.length > 0 && (
        <Box
          sx={{
            px: 2.5,
            pt: 2,
            pb: "calc(16px + env(safe-area-inset-bottom))",
            borderTop: `1px solid ${tokens.menuBorder}`,
            background: tokens.menuCard,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 0.25 }}>
            <Typography sx={{ color: tokens.textMuted, fontWeight: 500 }}>Total</Typography>
            <Typography sx={{ fontFamily: tokens.fontDisplay, fontWeight: 800, fontSize: "1.5rem" }}>
              {formatUSD(totals.usd)}
            </Typography>
          </Stack>
          <Typography sx={{ textAlign: "right", color: tokens.textDim, fontSize: "0.85rem", mb: 2 }}>
            {formatLBP(totals.lbp)}
          </Typography>
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<WhatsApp />}
            onClick={handleCheckout}
            sx={{
              background: tokens.whatsapp,
              color: "#000",
              fontWeight: 700,
              "&:hover": { background: "#3BE07A", boxShadow: "0 0 0 6px rgba(37,211,102,0.15)" },
            }}
          >
            Send order on WhatsApp
          </Button>
          <Button fullWidth variant="text" size="small" onClick={clearCart} sx={{ mt: 1, color: tokens.textMuted }}>
            Clear order
          </Button>
        </Box>
      )}
    </Drawer>
  );
};

export default CartDrawer;
