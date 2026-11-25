import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { CheckRounded } from "@mui/icons-material";
import { motion } from "framer-motion";
import { tokens } from "@theme/theme";
import { formatLBP, formatUSD } from "@utils/helpers";
import { formatInternational } from "@utils/phone";
import type { SentOrder } from "@hooks/usePlaceOrder";

/** "The counter has your order": order number, what was ordered and the total the server charged. */
const OrderSent: React.FC<{ order: SentOrder }> = ({ order }) => (
  <Box sx={{ textAlign: "center", pt: 1 }} role="status" aria-live="polite">
    <motion.div initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16 }}>
      <Box
        sx={{
          width: 68,
          height: 68,
          mx: "auto",
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          background: tokens.green,
          color: "#000",
          boxShadow: "0 0 0 10px rgba(46,229,157,0.14), 0 0 50px rgba(46,229,157,0.45)",
        }}
      >
        <CheckRounded sx={{ fontSize: 42 }} />
      </Box>
    </motion.div>

    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.4 }}>
      <Typography component="h3" sx={{ fontFamily: tokens.fontDisplay, fontWeight: 900, fontSize: "1.6rem", textTransform: "uppercase", mt: 2.5 }}>
        Order sent!
      </Typography>
      <Typography sx={{ color: tokens.menuText, mt: 0.75 }}>We have your order and will get it ready. Pay at the counter.</Typography>
    </motion.div>

    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.4 }}>
      <Box sx={{ mt: 2.5, p: 2, textAlign: "left", borderRadius: "18px", background: tokens.menuCard, border: `1px solid ${tokens.menuBorder}` }}>
        <Typography sx={{ color: tokens.menuTextDim, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Order number
        </Typography>
        <Typography
          data-testid="order-number"
          sx={{ fontFamily: tokens.fontDisplay, fontWeight: 800, fontSize: { xs: "1.3rem", sm: "1.45rem" }, letterSpacing: "0.06em", lineHeight: 1.25, wordBreak: "break-all" }}
        >
          {order.orderNumber}
        </Typography>

        <Stack spacing={0.75} sx={{ mt: 1.75, pt: 1.5, borderTop: `1px solid ${tokens.menuBorder}` }}>
          {order.lines.map((line, i) => (
            <Stack key={`${line.name}-${i}`} direction="row" spacing={1.5} justifyContent="space-between" sx={{ fontSize: "0.92rem" }}>
              <Box component="span" sx={{ color: tokens.menuText, minWidth: 0 }}>
                <Box component="span" sx={{ color: tokens.text, fontWeight: 700 }}>
                  {line.quantity} ×
                </Box>{" "}
                {line.name}
              </Box>
              <Box component="span" sx={{ fontWeight: 600, flexShrink: 0 }}>
                {formatUSD(line.total.usd)}
              </Box>
            </Stack>
          ))}
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mt: 1.5, pt: 1.5, borderTop: `1px solid ${tokens.menuBorder}` }}>
          <Typography sx={{ color: tokens.menuText, fontWeight: 500 }}>Total</Typography>
          <Box sx={{ textAlign: "right" }}>
            <Typography data-testid="order-total" sx={{ fontFamily: tokens.fontDisplay, fontWeight: 800, fontSize: "1.3rem" }}>
              {formatUSD(order.totals.usd)}
            </Typography>
            <Typography sx={{ color: tokens.menuTextDim, fontSize: "0.85rem" }}>{formatLBP(order.totals.lbp)}</Typography>
          </Box>
        </Stack>
      </Box>

      {order.phone && (
        <Typography sx={{ color: tokens.menuTextDim, fontSize: "0.85rem", mt: 1.75 }}>
          If something isn't available, we'll call you on {formatInternational(order.phone)}.
        </Typography>
      )}
    </motion.div>
  </Box>
);

export default OrderSent;
