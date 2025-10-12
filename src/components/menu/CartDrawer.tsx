import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Stack,
  Button,
  Divider,
  TextField,
} from "@mui/material";
import {
  Close,
  Add,
  Remove,
  Delete,
  WhatsApp,
  ShoppingCart,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const WHATSAPP_NUMBER = "96181453643"; // Example: Lebanon number

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } =
    useCart();
  const [customerName, setCustomerName] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const totals = getTotalPrice();

  const handleCheckout = () => {
    if (items.length === 0) return;

    // Format order message
    let message = `🎮 *EPIC LOUNGE ORDER*\n\n`;

    if (customerName.trim()) {
      message += `👤 *Customer:* ${customerName.trim()}\n\n`;
    }

    message += `📋 *Order Details:*\n`;
    message += `━━━━━━━━━━━━━━━━\n\n`;

    items.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`;
      message += `   • Quantity: ${item.quantity}\n`;
      message += `   • Price: $${item.pricing.usd.toFixed(
        2
      )} / ${item.pricing.lbp.toLocaleString()} LBP\n`;
      message += `   • Subtotal: $${(item.pricing.usd * item.quantity).toFixed(
        2
      )} / ${(item.pricing.lbp * item.quantity).toLocaleString()} LBP\n\n`;
    });

    message += `━━━━━━━━━━━━━━━━\n`;
    message += `💰 *TOTAL:*\n`;
    message += `   • USD: $${totals.usd.toFixed(2)}\n`;
    message += `   • LBP: ${totals.lbp.toLocaleString()}\n\n`;

    if (customerNotes.trim()) {
      message += `📝 *Notes:* ${customerNotes.trim()}\n\n`;
    }

    message += `📍 Epic Lounge - Sidon, Lebanon`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // Open WhatsApp with pre-filled message
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");

    // Clear cart after checkout
    clearCart();
    setCustomerName("");
    setCustomerNotes("");
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", sm: 400 },
          background: "linear-gradient(180deg, #0A1929 0%, #132F4C 100%)",
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,206,209,0.03) 2px, rgba(0,206,209,0.03) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(155,81,224,0.03) 2px, rgba(155,81,224,0.03) 4px)
          `,
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid rgba(0,206,209,0.2)",
            background: "rgba(10, 25, 41, 0.8)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <ShoppingCart sx={{ color: "#00CED1", fontSize: 28 }} />
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Orbitron",
                  fontWeight: 700,
                  color: "#FFFFFF",
                }}
              >
                Your Cart
              </Typography>
            </Stack>
            <IconButton onClick={onClose} sx={{ color: "#00CED1" }}>
              <Close />
            </IconButton>
          </Stack>
        </Box>

        {/* Cart Items */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
          {items.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
              }}
            >
              <ShoppingCart
                sx={{
                  fontSize: 80,
                  color: "rgba(0,206,209,0.3)",
                  mb: 2,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: "#B2BAC2",
                  mb: 1,
                }}
              >
                Your cart is empty
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(178,186,194,0.6)",
                }}
              >
                Add items from the menu to get started!
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        background: "rgba(19, 47, 76, 0.4)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(0,206,209,0.15)",
                        borderRadius: 2,
                      }}
                    >
                      <Stack spacing={1.5}>
                        {/* Item Info */}
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontFamily: "Rajdhani",
                                fontWeight: 700,
                                color: "#FFFFFF",
                                fontSize: "1.1rem",
                              }}
                            >
                              {item.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#00CED1",
                                fontSize: "0.75rem",
                              }}
                            >
                              {item.category.name}
                            </Typography>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => removeItem(item.id)}
                            sx={{
                              color: "#FF6B9D",
                              "&:hover": {
                                background: "rgba(255,107,157,0.1)",
                              },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Stack>

                        {/* Quantity Controls */}
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <IconButton
                              size="small"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              sx={{
                                background: "rgba(0,206,209,0.1)",
                                color: "#00CED1",
                                "&:hover": {
                                  background: "rgba(0,206,209,0.2)",
                                },
                              }}
                            >
                              <Remove fontSize="small" />
                            </IconButton>
                            <Typography
                              sx={{
                                fontFamily: "Orbitron",
                                fontWeight: 700,
                                color: "#FFFFFF",
                                minWidth: 30,
                                textAlign: "center",
                              }}
                            >
                              {item.quantity}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              sx={{
                                background: "rgba(0,206,209,0.1)",
                                color: "#00CED1",
                                "&:hover": {
                                  background: "rgba(0,206,209,0.2)",
                                },
                              }}
                            >
                              <Add fontSize="small" />
                            </IconButton>
                          </Stack>

                          {/* Price */}
                          <Stack spacing={0.5} alignItems="flex-end">
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: "Orbitron",
                                fontWeight: 700,
                                color: "#00CED1",
                              }}
                            >
                              ${(item.pricing.usd * item.quantity).toFixed(2)}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                fontFamily: "Rajdhani",
                                fontWeight: 600,
                                color: "#9B51E0",
                                fontSize: "0.75rem",
                              }}
                            >
                              {(
                                item.pricing.lbp * item.quantity
                              ).toLocaleString()}{" "}
                              LBP
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Box>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Customer Info */}
              {items.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontFamily: "Rajdhani",
                      fontWeight: 700,
                      color: "#B2BAC2",
                      mb: 1.5,
                    }}
                  >
                    Your Information (Optional)
                  </Typography>
                  <Stack spacing={1.5}>
                    <TextField
                      fullWidth
                      placeholder="Your Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          background: "rgba(19, 47, 76, 0.4)",
                          color: "#FFFFFF",
                          "& fieldset": {
                            borderColor: "rgba(0,206,209,0.2)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(0,206,209,0.4)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#00CED1",
                          },
                        },
                        "& .MuiInputBase-input::placeholder": {
                          color: "#B2BAC2",
                          opacity: 0.6,
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      placeholder="Special requests or notes"
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      multiline
                      rows={2}
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          background: "rgba(19, 47, 76, 0.4)",
                          color: "#FFFFFF",
                          "& fieldset": {
                            borderColor: "rgba(0,206,209,0.2)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(0,206,209,0.4)",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#00CED1",
                          },
                        },
                        "& .MuiInputBase-input::placeholder": {
                          color: "#B2BAC2",
                          opacity: 0.6,
                        },
                      }}
                    />
                  </Stack>
                </Box>
              )}
            </Stack>
          )}
        </Box>

        {/* Footer - Total & Checkout */}
        {items.length > 0 && (
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid rgba(0,206,209,0.2)",
              background: "rgba(10, 25, 41, 0.9)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Stack spacing={2}>
              {/* Total */}
              <Box>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={0.5}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#B2BAC2",
                      fontWeight: 600,
                    }}
                  >
                    Total (USD)
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "Orbitron",
                      fontWeight: 700,
                      color: "#00CED1",
                    }}
                  >
                    ${totals.usd.toFixed(2)}
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#B2BAC2",
                      fontWeight: 600,
                    }}
                  >
                    Total (LBP)
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "Rajdhani",
                      fontWeight: 700,
                      color: "#9B51E0",
                    }}
                  >
                    {totals.lbp.toLocaleString()}
                  </Typography>
                </Stack>
              </Box>

              <Divider sx={{ borderColor: "rgba(0,206,209,0.2)" }} />

              {/* Checkout Button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<WhatsApp />}
                onClick={handleCheckout}
                component={motion.button}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  py: 1.5,
                  background:
                    "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                  boxShadow: "0 8px 32px rgba(37,211,102,0.4)",
                  fontFamily: "Orbitron",
                  fontWeight: 700,
                  fontSize: "1rem",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #2EE874 0%, #1AA489 100%)",
                    boxShadow: "0 12px 48px rgba(37,211,102,0.6)",
                  },
                }}
              >
                Order via WhatsApp
              </Button>

              {/* Clear Cart */}
              <Button
                fullWidth
                variant="outlined"
                size="small"
                onClick={clearCart}
                sx={{
                  borderColor: "rgba(255,107,157,0.5)",
                  color: "#FF6B9D",
                  "&:hover": {
                    borderColor: "#FF6B9D",
                    background: "rgba(255,107,157,0.1)",
                  },
                }}
              >
                Clear Cart
              </Button>
            </Stack>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default CartDrawer;
