import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { CalendarMonth, CheckRounded, ManageSearch, Replay, WhatsApp } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { tokens } from "@theme/theme";
import type { PublicReservation } from "@/services/api";
import { downloadIcs, whatsappShareUrl } from "@utils/reservation";
import ReservationCard from "./ReservationCard";

interface BookingSuccessProps {
  reservation: PublicReservation;
  graceMinutes: number;
  onBookAnother: () => void;
}

const BookingSuccess: React.FC<BookingSuccessProps> = ({ reservation, graceMinutes, onBookAnother }) => (
  <Box sx={{ maxWidth: 560, mx: "auto", textAlign: "center" }}>
    <motion.div initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16 }}>
      <Box
        sx={{
          width: 76,
          height: 76,
          mx: "auto",
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          background: tokens.green,
          color: "#000",
          boxShadow: `0 0 0 10px rgba(46,229,157,0.15), 0 0 60px rgba(46,229,157,0.45)`,
        }}
      >
        <CheckRounded sx={{ fontSize: 46 }} />
      </Box>
    </motion.div>

    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}>
      <Typography
        component="h1"
        sx={{ fontFamily: tokens.fontDisplay, fontWeight: 900, fontSize: { xs: "1.8rem", md: "2.4rem" }, textTransform: "uppercase", mt: 3 }}
      >
        You're booked!
      </Typography>
      <Typography sx={{ color: tokens.menuText, mt: 1 }}>
        See you {reservation.display.day} at {reservation.display.start}. Show this code at the counter.
      </Typography>
    </motion.div>

    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }}>
      <Box sx={{ mt: 3, textAlign: "left" }}>
        <ReservationCard reservation={reservation} />
      </Box>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ mt: 2.5 }}>
        <Button fullWidth variant="contained" startIcon={<CalendarMonth />} onClick={() => downloadIcs(reservation)}>
          Add to calendar
        </Button>
        <Button
          fullWidth
          variant="contained"
          startIcon={<WhatsApp />}
          href={whatsappShareUrl(reservation)}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ background: tokens.whatsapp, color: "#000", "&:hover": { background: "#3BE07A" } }}
        >
          Share on WhatsApp
        </Button>
      </Stack>

      <Box
        sx={{
          mt: 2.5,
          px: 2,
          py: 1.5,
          borderRadius: "14px",
          background: "rgba(255,179,71,0.1)",
          border: "1px solid rgba(255,179,71,0.3)",
          color: "#FFD9A3",
          fontSize: "0.88rem",
          textAlign: "left",
        }}
      >
        Running late? Your {reservation.stations.length > 1 ? "stations are" : "station is"} held for {graceMinutes} minutes after the start
        time, then released for other players.
      </Box>

      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2.5, flexWrap: "wrap", rowGap: 1 }}>
        <Button
          component={RouterLink}
          to={`/reserve/manage?code=${reservation.code}`}
          variant="outlined"
          startIcon={<ManageSearch />}
        >
          Manage booking
        </Button>
        <Button variant="text" startIcon={<Replay />} onClick={onBookAnother}>
          Book another
        </Button>
      </Stack>
    </motion.div>
  </Box>
);

export default BookingSuccess;
