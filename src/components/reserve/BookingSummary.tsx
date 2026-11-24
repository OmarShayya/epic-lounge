import React from "react";
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { ArrowForward, EventAvailable } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { tokens } from "@theme/theme";

export interface SummaryLine {
  label: string;
  value: string | null;
}

interface SummaryProps {
  lines: SummaryLine[];
  price: string | null;
  ctaLabel: string;
  ready: boolean;
  submitting: boolean;
  onCta: () => void;
}

const CtaButton: React.FC<SummaryProps & { fullWidth?: boolean }> = ({ ctaLabel, ready, submitting, onCta, fullWidth }) => (
  <Button
    variant="contained"
    size="large"
    fullWidth={fullWidth}
    onClick={onCta}
    disabled={submitting}
    endIcon={submitting ? undefined : ready ? <EventAvailable /> : <ArrowForward />}
    sx={{ whiteSpace: "nowrap", fontWeight: 700, minHeight: 52 }}
  >
    {submitting ? <CircularProgress size={22} sx={{ color: "#000" }} /> : ctaLabel}
  </Button>
);

/** Desktop: sticky card next to the steps. */
export const SummaryPanel: React.FC<SummaryProps> = (props) => (
  <Box
    sx={{
      position: "sticky",
      top: 96,
      p: 2.5,
      borderRadius: "22px",
      background: "linear-gradient(160deg, #2E2558 0%, #1F2547 100%)",
      border: `1px solid ${tokens.menuBorder}`,
      boxShadow: "0 24px 60px rgba(5,5,20,0.45)",
    }}
  >
    <Typography variant="overline" sx={{ color: tokens.cyan, lineHeight: 1 }}>
      Your booking
    </Typography>
    <Stack spacing={1.25} sx={{ mt: 2 }}>
      {props.lines.map((l) => (
        <Stack key={l.label} direction="row" justifyContent="space-between" spacing={2}>
          <Typography sx={{ color: tokens.menuText, fontSize: "0.9rem" }}>{l.label}</Typography>
          <Typography sx={{ fontWeight: 600, fontSize: "0.92rem", textAlign: "right", color: l.value ? tokens.text : tokens.menuTextDim }}>
            {l.value ?? "—"}
          </Typography>
        </Stack>
      ))}
    </Stack>
    <Box sx={{ my: 2, height: 1, background: tokens.menuBorder }} />
    <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 0.5 }}>
      <Typography sx={{ color: tokens.menuText }}>Estimated</Typography>
      <Typography sx={{ fontFamily: tokens.fontDisplay, fontWeight: 800, fontSize: "1.6rem" }}>{props.price ?? "—"}</Typography>
    </Stack>
    <Typography sx={{ color: tokens.menuTextDim, fontSize: "0.78rem", mb: 2 }}>Pay at the lounge. No deposit needed.</Typography>
    <CtaButton {...props} fullWidth />
  </Box>
);

/** Mobile: fixed bar at the bottom, like the menu's cart bar. */
export const SummaryBar: React.FC<SummaryProps & { visible: boolean }> = ({ visible, ...props }) => {
  const filled = props.lines.filter((l) => l.value).map((l) => l.value);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 140 }}
          animate={{ y: 0 }}
          exit={{ y: 140 }}
          transition={{ type: "spring", stiffness: 380, damping: 34 }}
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1100,
            padding: "10px 12px calc(10px + env(safe-area-inset-bottom))",
            background: "rgba(24,28,52,0.94)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderTop: `1px solid ${tokens.menuBorder}`,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ maxWidth: 560, mx: "auto" }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.2 }} noWrap>
                {props.price ?? "Book a station"}
              </Typography>
              <Typography sx={{ color: tokens.menuText, fontSize: "0.76rem", lineHeight: 1.3 }} noWrap>
                {filled.length ? filled.slice(0, 3).join(" · ") : "Pick what, when and how long"}
              </Typography>
            </Box>
            <CtaButton {...props} />
          </Stack>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
