import React, { useState } from "react";
import { Box, Button, Collapse, Stack, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
import { fieldSx, ui } from "./styles";

export interface ContactValues {
  name: string;
  phone: string;
  notes: string;
  honeypot: string;
}

interface ContactFormProps {
  values: ContactValues;
  onChange: (field: keyof ContactValues, value: string) => void;
  errors: { name?: string; phone?: string };
  nameRef?: React.Ref<HTMLInputElement>;
  onSubmit: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ values, onChange, errors, nameRef, onSubmit }) => {
  const [showNotes, setShowNotes] = useState(!!values.notes);
  return (
    <Box
      component="form"
      noValidate
      onSubmit={(e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Stack spacing={1.5}>
        <TextField
          label="Your name"
          value={values.name}
          onChange={(e) => onChange("name", e.target.value)}
          required
          autoComplete="name"
          inputRef={nameRef}
          error={!!errors.name}
          helperText={errors.name}
          slotProps={{ htmlInput: { maxLength: 80, enterKeyHint: "next" } }}
          sx={fieldSx}
        />
        <TextField
          label="Phone (WhatsApp)"
          value={values.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          required
          type="tel"
          autoComplete="tel"
          placeholder="70 123 456"
          error={!!errors.phone}
          helperText={errors.phone ?? "Only used for this booking. You'll need it to cancel."}
          slotProps={{ htmlInput: { inputMode: "tel", maxLength: 30, enterKeyHint: "done" } }}
          sx={fieldSx}
        />
        <Collapse in={showNotes} unmountOnExit>
          <TextField
            fullWidth
            label="Note for the lounge (optional)"
            value={values.notes}
            onChange={(e) => onChange("notes", e.target.value)}
            multiline
            minRows={2}
            placeholder="Birthday, tournament practice, seats together…"
            slotProps={{ htmlInput: { maxLength: 500 } }}
            sx={fieldSx}
          />
        </Collapse>
        {!showNotes && (
          <Button size="small" startIcon={<Add />} onClick={() => setShowNotes(true)} sx={{ alignSelf: "flex-start", color: ui.muted, px: 1 }}>
            Add a note
          </Button>
        )}
      </Stack>
      {/* Honeypot: hidden from people, irresistible to bots */}
      <Box aria-hidden="true" sx={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={values.honeypot} onChange={(e) => onChange("honeypot", e.target.value)} />
        </label>
      </Box>
      {/* Lets the keyboard's Go/Enter submit */}
      <button type="submit" hidden aria-hidden="true" tabIndex={-1} />
    </Box>
  );
};

export default ContactForm;
