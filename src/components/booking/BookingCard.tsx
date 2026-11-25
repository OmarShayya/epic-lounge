import React from "react";
import { Box, Stack, Typography, alpha } from "@mui/material";
import { tokens } from "@theme/theme";
import type { PublicReservation, ReservationStatus } from "@/services/api";
import { TYPE_LABEL, durationLabel, formatUSD, stationsText } from "@utils/reservation";
import { ui } from "./styles";

const STATUS: Record<ReservationStatus, { label: string; color: string }> = {
  confirmed: { label: "Confirmed", color: tokens.green },
  checked_in: { label: "Checked in", color: tokens.cyan },
  cancelled: { label: "Cancelled", color: tokens.red },
  no_show: { label: "Released (no-show)", color: tokens.amber },
};

/** Booking code + details, used after booking and in "Manage booking". */
const BookingCard: React.FC<{ reservation: PublicReservation }> = ({ reservation: r }) => {
  const st = STATUS[r.status];
  const rows = [
    { label: "When", value: `${r.display.day} · ${r.display.start} – ${r.display.end}` },
    { label: "Length", value: durationLabel(r.durationMinutes) },
    { label: r.stations.length > 1 ? TYPE_LABEL[r.type].many : TYPE_LABEL[r.type].one, value: stationsText(r) },
    { label: "Name", value: r.customerName },
    { label: "Estimated", value: `${formatUSD(r.estimatedCost.usd)} · pay at the lounge` },
  ];

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 2.25 },
        borderRadius: "18px",
        background: `linear-gradient(160deg, ${alpha(tokens.cyan, 0.1)} 0%, ${alpha(tokens.purple, 0.12)} 100%), ${ui.paper}`,
        border: `1px solid ${ui.border}`,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ mb: 1.75 }}>
        <Box>
          <Typography sx={{ color: ui.muted, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Booking code
          </Typography>
          <Typography
            data-testid="booking-code"
            sx={{ fontFamily: tokens.fontDisplay, fontWeight: 900, fontSize: { xs: "1.75rem", sm: "2rem" }, letterSpacing: "0.12em", lineHeight: 1.1 }}
          >
            {r.code}
          </Typography>
        </Box>
        <Box
          component="span"
          sx={{
            px: 1.25,
            py: 0.5,
            borderRadius: "999px",
            fontSize: "0.78rem",
            fontWeight: 700,
            color: st.color,
            background: alpha(st.color, 0.14),
            border: `1px solid ${alpha(st.color, 0.35)}`,
            whiteSpace: "nowrap",
          }}
        >
          {st.label}
        </Box>
      </Stack>
      <Stack spacing={0.9}>
        {rows.map((row) => (
          <Stack key={row.label} direction="row" spacing={2} justifyContent="space-between">
            <Typography sx={{ color: ui.muted, fontSize: "0.88rem", flexShrink: 0 }}>{row.label}</Typography>
            <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", textAlign: "right" }}>{row.value}</Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default BookingCard;
