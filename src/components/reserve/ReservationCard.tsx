import React from "react";
import { Box, Stack, Typography, alpha } from "@mui/material";
import { tokens } from "@theme/theme";
import type { PublicReservation, ReservationStatus } from "@/services/api";
import { TYPE_LABEL, durationLabel, formatUSD, stationsText } from "@utils/reservation";

const STATUS: Record<ReservationStatus, { label: string; color: string }> = {
  confirmed: { label: "Confirmed", color: tokens.green },
  checked_in: { label: "Checked in", color: tokens.cyan },
  cancelled: { label: "Cancelled", color: tokens.red },
  no_show: { label: "Released (no-show)", color: tokens.amber },
};

/** Booking details block, used on the success screen and in "manage booking". */
const ReservationCard: React.FC<{ reservation: PublicReservation; showCode?: boolean }> = ({ reservation: r, showCode = true }) => {
  const st = STATUS[r.status];
  const rows = [
    { label: "When", value: `${r.display.day} · ${r.display.start} – ${r.display.end}` },
    { label: "Length", value: durationLabel(r.durationMinutes) },
    {
      label: r.stations.length > 1 ? TYPE_LABEL[r.type].many : TYPE_LABEL[r.type].one,
      value: `${r.stations.length} × ${stationsText(r)}`,
    },
    { label: "Name", value: r.customerName },
    { label: "Estimated", value: `${formatUSD(r.estimatedCost.usd)} · pay at the lounge` },
  ];

  return (
    <Box
      sx={{
        p: { xs: 2, md: 2.5 },
        borderRadius: "22px",
        background: "linear-gradient(160deg, #2E2558 0%, #1F2547 100%)",
        border: `1px solid ${tokens.menuBorder}`,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
        {showCode ? (
          <Box>
            <Typography sx={{ color: tokens.menuText, fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Booking code
            </Typography>
            <Typography
              sx={{ fontFamily: tokens.fontDisplay, fontWeight: 900, fontSize: { xs: "1.9rem", md: "2.3rem" }, letterSpacing: "0.12em", lineHeight: 1.1 }}
            >
              {r.code}
            </Typography>
          </Box>
        ) : (
          <span />
        )}
        <Box
          component="span"
          sx={{
            px: 1.25,
            py: 0.5,
            borderRadius: "999px",
            fontSize: "0.8rem",
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
      <Stack spacing={1}>
        {rows.map((row) => (
          <Stack key={row.label} direction="row" spacing={2} justifyContent="space-between">
            <Typography sx={{ color: tokens.menuText, fontSize: "0.9rem", flexShrink: 0 }}>{row.label}</Typography>
            <Typography sx={{ fontWeight: 600, fontSize: "0.92rem", textAlign: "right" }}>{row.value}</Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default ReservationCard;
