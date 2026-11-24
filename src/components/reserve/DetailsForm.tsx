import React from "react";
import { Box, Stack, TextField } from "@mui/material";
import { tokens } from "@theme/theme";

interface DetailsFormProps {
  name: string;
  phone: string;
  notes: string;
  honeypot: string;
  onChange: (field: "name" | "phone" | "notes" | "honeypot", value: string) => void;
  errors: { name?: string; phone?: string };
  nameRef?: React.Ref<HTMLInputElement>;
}

const fieldSx = {
  "& .MuiOutlinedInput-root": { background: tokens.menuCard, borderRadius: "14px" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: tokens.menuBorder },
  "& input, & textarea": { fontSize: 16 },
  "& .MuiInputLabel-root": { color: tokens.menuText },
} as const;

const DetailsForm: React.FC<DetailsFormProps> = ({ name, phone, notes, honeypot, onChange, errors, nameRef }) => (
  <Stack spacing={1.5}>
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
      <TextField
        label="Your name"
        value={name}
        onChange={(e) => onChange("name", e.target.value)}
        required
        autoComplete="name"
        inputRef={nameRef}
        error={!!errors.name}
        helperText={errors.name}
        slotProps={{ htmlInput: { maxLength: 80 } }}
        sx={fieldSx}
      />
      <TextField
        label="Phone (WhatsApp)"
        value={phone}
        onChange={(e) => onChange("phone", e.target.value)}
        required
        type="tel"
        autoComplete="tel"
        placeholder="70 123 456"
        error={!!errors.phone}
        helperText={errors.phone ?? "We'll only use it about this booking."}
        slotProps={{ htmlInput: { inputMode: "tel", maxLength: 30 } }}
        sx={fieldSx}
      />
    </Box>
    <TextField
      label="Notes (optional)"
      value={notes}
      onChange={(e) => onChange("notes", e.target.value)}
      multiline
      minRows={2}
      placeholder="Birthday, tournament practice, need seats together…"
      slotProps={{ htmlInput: { maxLength: 500 } }}
      sx={fieldSx}
    />
    {/* Honeypot: hidden from people, irresistible to bots */}
    <Box
      aria-hidden="true"
      sx={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}
    >
      <label>
        Website
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => onChange("honeypot", e.target.value)}
        />
      </label>
    </Box>
  </Stack>
);

export default DetailsForm;
