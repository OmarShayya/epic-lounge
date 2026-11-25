import React, { useState } from "react";
import { Box, Button, CircularProgress, Dialog, IconButton, Stack, TextField, Typography, alpha, useMediaQuery, useTheme } from "@mui/material";
import { CalendarMonth, Close, EventBusy, Search } from "@mui/icons-material";
import { tokens } from "@theme/theme";
import { describeApiError, reservationApi } from "@/services/api";
import type { PublicReservation } from "@/services/api";
import { downloadIcs, loadLastBooking } from "@utils/reservation";
import { emptyPhone } from "@utils/phone";
import type { PhoneValue } from "@utils/phone";
import PhoneField from "@components/common/PhoneField";
import BookingCard from "./BookingCard";
import { fieldSx, ui } from "./styles";

interface ManageBookingDialogProps {
  open: boolean;
  initialCode?: string;
  onClose: () => void;
  onChanged?: () => void;
}

/** Find a booking with its code + phone number, and cancel it if plans change. */
const ManageFlow: React.FC<Omit<ManageBookingDialogProps, "open">> = ({ initialCode, onClose, onChanged }) => {
  const [code, setCode] = useState(() => (initialCode || loadLastBooking()?.code || "").toUpperCase());
  const [phone, setPhone] = useState<PhoneValue>(() => {
    const last = loadLastBooking();
    // The saved number only belongs to the saved code
    return last && (!initialCode || initialCode.toUpperCase() === last.code.toUpperCase()) ? last.phone : emptyPhone();
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reservation, setReservation] = useState<PublicReservation | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Old bookings may hold numbers the formatter doesn't know, so 7+ digits is enough to try
  const canSearch = code.trim().length >= 4 && phone.input.replace(/\D/g, "").length >= 7;
  const cancellable = reservation?.status === "confirmed" && new Date(reservation.startTime).getTime() > Date.now();

  const lookup = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canSearch) return;
    setLoading(true);
    setError(null);
    try {
      setReservation(await reservationApi.lookup(code.trim(), phone.e164));
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
      setReservation(await reservationApi.cancel(reservation.code, phone.e164));
      setConfirming(false);
      onChanged?.();
    } catch (err) {
      setError(describeApiError(err).message);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography id="manage-title" component="h2" sx={{ fontFamily: tokens.fontDisplay, fontWeight: 800, fontSize: "1.2rem" }}>
          Manage booking
        </Typography>
        <IconButton aria-label="Close" onClick={onClose} sx={{ mr: -1, color: ui.muted }}>
          <Close />
        </IconButton>
      </Stack>

      {!reservation ? (
        <Box component="form" onSubmit={lookup} noValidate>
          <Typography sx={{ color: ui.muted, mb: 2, fontSize: "0.92rem" }}>Enter the code from your confirmation and the phone number you booked with.</Typography>
          <Stack spacing={1.5}>
            <TextField
              label="Booking code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
              autoComplete="off"
              slotProps={{ htmlInput: { maxLength: 10, style: { letterSpacing: "0.15em", fontWeight: 700 } } }}
              sx={fieldSx}
            />
            <PhoneField variant="booking" label="Phone number" value={phone} onChange={setPhone} enterKeyHint="go" />
            {error && (
              <Box role="alert" sx={{ px: 1.75, py: 1.25, borderRadius: "12px", background: alpha(tokens.red, 0.1), border: `1px solid ${alpha(tokens.red, 0.35)}`, fontSize: "0.9rem" }}>
                {error}
              </Box>
            )}
            <Button type="submit" variant="contained" size="large" disabled={!canSearch || loading} startIcon={loading ? undefined : <Search />} sx={{ height: 48, fontWeight: 700 }}>
              {loading ? <CircularProgress size={22} sx={{ color: "inherit" }} /> : "Find my booking"}
            </Button>
          </Stack>
        </Box>
      ) : (
        <Stack spacing={1.75}>
          <BookingCard reservation={reservation} />
          {error && (
            <Box role="alert" sx={{ px: 1.75, py: 1.25, borderRadius: "12px", background: alpha(tokens.red, 0.1), border: `1px solid ${alpha(tokens.red, 0.35)}`, fontSize: "0.9rem" }}>
              {error}
            </Box>
          )}
          {reservation.status === "cancelled" ? (
            <Typography sx={{ color: ui.muted, textAlign: "center", fontSize: "0.92rem" }}>This booking is cancelled. The time is free for others again.</Typography>
          ) : confirming ? (
            <Box sx={{ p: 2, borderRadius: "14px", background: alpha(tokens.red, 0.08), border: `1px solid ${alpha(tokens.red, 0.3)}` }}>
              <Typography sx={{ fontWeight: 700 }}>Cancel this booking?</Typography>
              <Typography sx={{ color: ui.muted, fontSize: "0.9rem", mt: 0.5 }}>
                {reservation.display.day} · {reservation.display.start}. This can't be undone.
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                <Button fullWidth variant="outlined" onClick={() => setConfirming(false)} disabled={cancelling}>
                  Keep it
                </Button>
                <Button fullWidth variant="contained" color="error" onClick={cancel} disabled={cancelling}>
                  {cancelling ? <CircularProgress size={20} sx={{ color: "inherit" }} /> : "Yes, cancel"}
                </Button>
              </Stack>
            </Box>
          ) : (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              {reservation.status === "confirmed" && (
                <Button fullWidth variant="outlined" startIcon={<CalendarMonth />} onClick={() => downloadIcs(reservation)}>
                  Add to calendar
                </Button>
              )}
              {cancellable && (
                <Button fullWidth variant="outlined" color="error" startIcon={<EventBusy />} onClick={() => setConfirming(true)}>
                  Cancel booking
                </Button>
              )}
            </Stack>
          )}
          <Button
            variant="text"
            onClick={() => {
              setReservation(null);
              setError(null);
              setConfirming(false);
            }}
            sx={{ color: ui.muted, alignSelf: "center" }}
          >
            Look up another booking
          </Button>
        </Stack>
      )}
    </Box>
  );
};

const ManageBookingDialog: React.FC<ManageBookingDialogProps> = ({ open, onClose, ...rest }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="manage-title"
      slotProps={{
        paper: {
          sx: {
            m: isMobile ? 1.5 : 4,
            width: isMobile ? "calc(100% - 24px)" : undefined,
            background: ui.paper,
            backgroundImage: "none",
            border: `1px solid ${ui.border}`,
            borderRadius: "22px",
          },
        },
        backdrop: { sx: { background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" } },
      }}
    >
      <ManageFlow onClose={onClose} {...rest} />
    </Dialog>
  );
};

export default ManageBookingDialog;
