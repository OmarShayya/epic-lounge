import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { CalendarMonth, CheckRounded, WhatsApp } from "@mui/icons-material";
import { motion } from "framer-motion";
import { tokens } from "@theme/theme";
import type { PublicReservation } from "@/services/api";
import { downloadIcs, whatsappShareUrl } from "@utils/reservation";
import BookingCard from "./BookingCard";

const BookingConfirmed: React.FC<{ reservation: PublicReservation; graceMinutes: number }> = ({ reservation, graceMinutes }) => (
  <Box sx={{ textAlign: "center", pt: { xs: 1, sm: 0.5 } }}>
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
      <Typography
        component="h2"
        sx={{ fontFamily: tokens.fontDisplay, fontWeight: 900, fontSize: { xs: "1.6rem", sm: "1.9rem" }, textTransform: "uppercase", mt: 2.5 }}
      >
        You're booked!
      </Typography>
      <Typography sx={{ color: tokens.textMuted, mt: 0.75 }}>
        See you {reservation.display.day} at {reservation.display.start}. Show this code at the counter.
      </Typography>
    </motion.div>

    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.4 }}>
      <Box sx={{ mt: 2.5, textAlign: "left" }}>
        <BookingCard reservation={reservation} />
      </Box>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ mt: 2 }}>
        <Button fullWidth variant="outlined" startIcon={<CalendarMonth />} onClick={() => downloadIcs(reservation)} sx={{ height: 46 }}>
          Add to calendar
        </Button>
        <Button
          fullWidth
          variant="contained"
          startIcon={<WhatsApp />}
          href={whatsappShareUrl(reservation)}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ height: 46, background: tokens.whatsapp, color: "#000", "&:hover": { background: "#3BE07A" } }}
        >
          Share with friends
        </Button>
      </Stack>

      <Box
        sx={{
          mt: 2,
          px: 2,
          py: 1.25,
          borderRadius: "14px",
          background: "rgba(255,179,71,0.08)",
          border: "1px solid rgba(255,179,71,0.28)",
          color: "#FFD9A3",
          fontSize: "0.86rem",
          textAlign: "left",
        }}
      >
        Running late? Your {reservation.stations.length > 1 ? "stations are" : "station is"} held for {graceMinutes} minutes after the start time. Need
        to cancel? Use “Manage booking” on this page with your code and phone number.
      </Box>
    </motion.div>
  </Box>
);

export default BookingConfirmed;
