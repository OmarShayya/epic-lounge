import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import { ArrowBack, CalendarMonth, EventBusy, Search } from "@mui/icons-material";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { tokens } from "@theme/theme";
import { describeApiError, reservationApi } from "@/services/api";
import type { PublicReservation } from "@/services/api";
import ReservationCard from "@components/reserve/ReservationCard";
import { downloadIcs } from "@utils/reservation";

const fieldSx = {
  "& .MuiOutlinedInput-root": { background: tokens.menuCard, borderRadius: "14px" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: tokens.menuBorder },
  "& input": { fontSize: 16 },
  "& .MuiInputLabel-root": { color: tokens.menuText },
} as const;

/** Look up a booking with its code + phone number, and cancel it if plans change. */
const ManageBookingPage: React.FC = () => {
  const [params] = useSearchParams();
  const [code, setCode] = useState((params.get("code") ?? "").toUpperCase());
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reservation, setReservation] = useState<PublicReservation | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [justCancelled, setJustCancelled] = useState(false);

  const canSearch = code.trim().length >= 4 && phone.replace(/\D/g, "").length >= 7;

  const lookup = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canSearch) return;
    setLoading(true);
    setError(null);
    setJustCancelled(false);
    try {
      setReservation(await reservationApi.lookup(code.trim(), phone.trim()));
    } catch (err) {
      setReservation(null);
      setError(describeApiError(err).message);
    } finally {
      setLoading(false);
    }
  };

  const cancel = async () => {
    if (!reservation) return;
    setCancelling(true);
    setError(null);
    try {
      setReservation(await reservationApi.cancel(reservation.code, phone.trim()));
      setJustCancelled(true);
      setConfirmOpen(false);
    } catch (err) {
      setError(describeApiError(err).message);
      setConfirmOpen(false);
    } finally {
      setCancelling(false);
    }
  };

  const cancellable = reservation?.status === "confirmed" && new Date(reservation.startTime).getTime() > Date.now();

  return (
    <Box
      sx={{
        mt: { xs: "-60px", md: "-72px" },
        pt: { xs: "60px", md: "72px" },
        pb: 10,
        minHeight: "100vh",
        background: tokens.menuPageBg,
      }}
    >
      <Container maxWidth="sm" sx={{ pt: { xs: 2.5, md: 6 }, px: { xs: 2, sm: 3 } }}>
        <Button component={RouterLink} to="/reserve" startIcon={<ArrowBack />} sx={{ color: tokens.menuText, mb: 1.5, px: 1, ml: -1 }}>
          Back to booking
        </Button>
        <Typography
          component="h1"
          sx={{ fontFamily: tokens.fontDisplay, fontWeight: 900, fontSize: { xs: "1.9rem", md: "2.6rem" }, textTransform: "uppercase", lineHeight: 1.05 }}
        >
          Your booking
        </Typography>
        <Typography sx={{ color: "#D3D5E6", mt: 1, mb: 3 }}>
          Enter the code from your confirmation and the phone number you booked with.
        </Typography>

        <Box
          component="form"
          onSubmit={lookup}
          sx={{ p: { xs: 2, md: 2.5 }, borderRadius: "22px", background: "rgba(255,255,255,0.035)", border: `1px solid ${tokens.menuBorder}` }}
        >
          <Stack spacing={1.5}>
            <TextField
              label="Booking code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              autoComplete="off"
              slotProps={{ htmlInput: { maxLength: 12, style: { letterSpacing: "0.15em", fontWeight: 700 } } }}
              sx={fieldSx}
            />
            <TextField
              label="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              autoComplete="tel"
              slotProps={{ htmlInput: { inputMode: "tel", maxLength: 30 } }}
              sx={fieldSx}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={!canSearch || loading}
              startIcon={loading ? undefined : <Search />}
              sx={{ minHeight: 52 }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: "#000" }} /> : "Find my booking"}
            </Button>
          </Stack>
        </Box>

        {error && (
          <Box
            role="alert"
            sx={{ mt: 2, px: 2, py: 1.5, borderRadius: "12px", background: alpha(tokens.red, 0.1), border: `1px solid ${alpha(tokens.red, 0.35)}`, fontSize: "0.92rem" }}
          >
            {error}
          </Box>
        )}

        {reservation && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Box sx={{ mt: 3 }}>
              {justCancelled && (
                <Box role="status" sx={{ mb: 1.5, px: 2, py: 1.25, borderRadius: "12px", background: alpha(tokens.green, 0.1), border: `1px solid ${alpha(tokens.green, 0.35)}`, fontSize: "0.92rem" }}>
                  Your booking is cancelled. Thanks for letting us know!
                </Box>
              )}
              <ReservationCard reservation={reservation} />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ mt: 2 }}>
                {reservation.status === "confirmed" && (
                  <Button fullWidth variant="outlined" startIcon={<CalendarMonth />} onClick={() => downloadIcs(reservation)}>
                    Add to calendar
                  </Button>
                )}
                {cancellable && (
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<EventBusy />}
                    onClick={() => setConfirmOpen(true)}
                    sx={{ color: tokens.red, borderColor: alpha(tokens.red, 0.5), "&:hover": { borderColor: tokens.red, background: alpha(tokens.red, 0.08) } }}
                  >
                    Cancel booking
                  </Button>
                )}
              </Stack>
            </Box>
          </motion.div>
        )}
      </Container>

      <Dialog
        open={confirmOpen}
        onClose={() => !cancelling && setConfirmOpen(false)}
        slotProps={{ paper: { sx: { background: tokens.menuBg, border: `1px solid ${tokens.menuBorder}`, borderRadius: "20px", m: 2 } } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Cancel this booking?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: tokens.menuText }}>
            {reservation && `${reservation.display.day} at ${reservation.display.start} will be released for other players. This can't be undone.`}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setConfirmOpen(false)} disabled={cancelling}>
            Keep it
          </Button>
          <Button
            variant="contained"
            onClick={cancel}
            disabled={cancelling}
            sx={{ background: tokens.red, color: "#fff", "&:hover": { background: "#ff6b85" } }}
          >
            {cancelling ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Yes, cancel"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageBookingPage;
