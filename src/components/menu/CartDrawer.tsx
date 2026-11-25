import React, { useEffect, useId, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Close, SendRounded, ShoppingBagOutlined, WhatsApp } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { tokens } from "@theme/theme";
import { formatLBP, formatUSD, haptic } from "@utils/helpers";
import { linesFromCart, orderWhatsappUrl } from "@utils/order";
import { phoneError } from "@utils/phone";
import { loadContact, saveContact } from "@utils/reservation";
import { usePlaceOrder } from "@hooks/usePlaceOrder";
import type { OrderDetails } from "@hooks/usePlaceOrder";
import PhoneField from "@components/common/PhoneField";
import QtyStepper from "./QtyStepper";
import OrderSent from "./OrderSent";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const whatsappSx = {
  background: tokens.whatsapp,
  color: "#000",
  fontWeight: 700,
  "&:hover": { background: "#3BE07A", boxShadow: "0 0 0 6px rgba(37,211,102,0.15)" },
} as const;

/**
 * Your order: bottom sheet on phones, side panel on desktop.
 * "Send order" puts it straight into the POS; if that can't work, WhatsApp is always one tap away.
 */
const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const { items, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();
  const [details, setDetails] = useState<OrderDetails>(() => ({ ...loadContact(), notes: "", honeypot: "" }));
  const [showErrors, setShowErrors] = useState(false);
  const { send, sending, failure, sent, reset, clearFailure } = usePlaceOrder();
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const formId = useId();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const totals = getTotalPrice();
  const count = getTotalItems();

  const nameError = details.name.trim().length < 2 ? "Please enter your name" : undefined;
  const phoneInvalid = phoneError(details.phone);
  const phoneShownError = failure?.kind === "phone" ? failure.message : showErrors ? phoneInvalid : undefined;

  useEffect(() => {
    if (failure?.kind === "phone") phoneRef.current?.focus();
  }, [failure]);

  const update = <K extends keyof OrderDetails>(field: K, value: OrderDetails[K]) => {
    setDetails((d) => ({ ...d, [field]: value }));
    if (field === "phone" && failure?.kind === "phone") clearFailure();
  };

  const handleSend = async () => {
    if (nameError || phoneInvalid) {
      setShowErrors(true);
      (nameError ? nameRef : phoneRef).current?.focus();
      return;
    }
    const order = await send(details);
    if (order) {
      saveContact(details.name.trim(), details.phone);
      setDetails((d) => ({ ...d, notes: "" }));
      setShowErrors(false);
      bodyRef.current?.scrollTo({ top: 0 });
    }
  };

  // Today's WhatsApp order, for when the lounge can't be reached
  const fallbackUrl = items.length
    ? orderWhatsappUrl({
        lines: linesFromCart(items),
        totals,
        customerName: details.name,
        phone: details.phone.valid ? details.phone.e164 : undefined,
        notes: details.notes,
      })
    : undefined;
  const sendOnWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!fallbackUrl) return;
    window.open(fallbackUrl, "_blank", "noopener,noreferrer");
    clearCart();
    setDetails((d) => ({ ...d, notes: "" }));
    clearFailure();
    onClose();
  };

  const notice =
    failure && failure.kind !== "phone" ? (
      <Box
        role="alert"
        sx={{
          px: 1.75,
          py: 1.25,
          mb: 1.5,
          borderRadius: "12px",
          fontSize: "0.88rem",
          background: alpha(failure.kind === "rate" ? tokens.amber : tokens.red, 0.1),
          border: `1px solid ${alpha(failure.kind === "rate" ? tokens.amber : tokens.red, 0.35)}`,
        }}
      >
        {failure.message}
      </Box>
    ) : null;

  return (
    <Drawer
      anchor={isMobile ? "bottom" : "right"}
      open={open}
      onClose={onClose}
      sx={{ zIndex: 1400 }}
      slotProps={{
        transition: {
          onExited: () => {
            // After the confirmation is dismissed, the next open shows a fresh cart
            reset();
            setShowErrors(false);
          },
        },
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
            {sent ? "Sent to the counter" : `${count} ${count === 1 ? "item" : "items"}`}
          </Typography>
        </Box>
        <IconButton aria-label="Close order" onClick={onClose} sx={{ border: `1px solid ${tokens.border}`, width: 40, height: 40 }}>
          <Close fontSize="small" />
        </IconButton>
      </Stack>

      {/* Body */}
      <Box ref={bodyRef} sx={{ flex: 1, overflowY: "auto", px: 2.5, pb: 2, overscrollBehavior: "contain" }}>
        {sent ? (
          <OrderSent order={sent} />
        ) : items.length === 0 ? (
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
            <Box
              aria-busy={sending}
              sx={{ borderTop: `1px solid ${tokens.border}`, opacity: sending ? 0.6 : 1, pointerEvents: sending ? "none" : "auto", transition: "opacity .2s ease" }}
            >
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
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ py: 1.75, borderBottom: `1px solid ${tokens.border}` }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 600, lineHeight: 1.3 }} noWrap>
                          {item.name}
                        </Typography>
                        <Typography sx={{ color: tokens.textDim, fontSize: "0.8rem" }}>{formatUSD(item.pricing.usd)} each</Typography>
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
                      <Typography sx={{ fontWeight: 700, minWidth: 56, textAlign: "right" }}>{formatUSD(item.pricing.usd * item.quantity)}</Typography>
                    </Stack>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Box>

            <Box
              component="form"
              id={formId}
              noValidate
              onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <Stack spacing={1.25} sx={{ mt: 2.5 }}>
                <Typography variant="overline" sx={{ color: tokens.textDim, lineHeight: 1 }}>
                  Your details
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Your name"
                  value={details.name}
                  onChange={(e) => update("name", e.target.value)}
                  required
                  autoComplete="name"
                  inputRef={nameRef}
                  error={showErrors && !!nameError}
                  helperText={showErrors ? nameError : undefined}
                  size="small"
                  slotProps={{ htmlInput: { "aria-label": "Your name", maxLength: 80, enterKeyHint: "next" } }}
                  sx={{ "& input": { fontSize: 16 } }}
                />
                <PhoneField
                  variant="menu"
                  size="small"
                  ariaLabel="Phone number"
                  value={details.phone}
                  onChange={(phone) => update("phone", phone)}
                  required
                  error={phoneShownError}
                  inputRef={phoneRef}
                  enterKeyHint="next"
                />
                <TextField
                  fullWidth
                  placeholder="Notes — e.g. PC 05, no sugar, extra ice"
                  value={details.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  multiline
                  minRows={2}
                  size="small"
                  slotProps={{ htmlInput: { "aria-label": "Notes (optional)", maxLength: 500 } }}
                  sx={{ "& textarea": { fontSize: 16 } }}
                />
              </Stack>
              {/* Honeypot: hidden from people, irresistible to bots */}
              <Box aria-hidden="true" sx={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
                <label>
                  Website
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" value={details.honeypot} onChange={(e) => update("honeypot", e.target.value)} />
                </label>
              </Box>
            </Box>
          </>
        )}
      </Box>

      {/* Footer */}
      {(sent || items.length > 0) && (
        <Box
          sx={{
            px: 2.5,
            pt: 2,
            pb: "calc(16px + env(safe-area-inset-bottom))",
            borderTop: `1px solid ${tokens.menuBorder}`,
            background: tokens.menuCard,
          }}
        >
          {sent ? (
            <>
              {/* A real link (not window.open) so it's never blocked as a popup */}
              <Button
                fullWidth
                variant="contained"
                startIcon={<WhatsApp />}
                href={orderWhatsappUrl(sent)}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ ...whatsappSx, height: 52 }}
              >
                Message us on WhatsApp
              </Button>
              <Button fullWidth variant="outlined" onClick={onClose} sx={{ mt: 1, height: 48, fontWeight: 700 }}>
                Done
              </Button>
            </>
          ) : (
            <>
              <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 0.25 }}>
                <Typography sx={{ color: tokens.textMuted, fontWeight: 500 }}>Total</Typography>
                <Typography sx={{ fontFamily: tokens.fontDisplay, fontWeight: 800, fontSize: "1.5rem" }}>{formatUSD(totals.usd)}</Typography>
              </Stack>
              <Typography sx={{ textAlign: "right", color: tokens.textDim, fontSize: "0.85rem", mb: 2 }}>{formatLBP(totals.lbp)}</Typography>
              {notice}
              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                form={formId}
                disabled={sending}
                startIcon={sending ? undefined : <SendRounded />}
                sx={{ fontWeight: 700, height: 54 }}
              >
                {sending ? <CircularProgress size={22} sx={{ color: "inherit" }} aria-label="Sending" /> : failure?.kind === "offline" ? "Try again" : "Send order"}
              </Button>
              {failure && failure.kind !== "phone" && (
                <Button fullWidth variant="contained" startIcon={<WhatsApp />} href={fallbackUrl} onClick={sendOnWhatsApp} sx={{ ...whatsappSx, mt: 1, height: 48 }}>
                  Send on WhatsApp instead
                </Button>
              )}
              <Button
                fullWidth
                variant="text"
                size="small"
                onClick={() => {
                  clearCart();
                  clearFailure();
                }}
                disabled={sending}
                sx={{ mt: 1, color: tokens.textMuted }}
              >
                Clear order
              </Button>
            </>
          )}
        </Box>
      )}
    </Drawer>
  );
};

export default CartDrawer;
