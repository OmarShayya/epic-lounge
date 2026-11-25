import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { ButtonBase, InputAdornment, TextField } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { tokens } from "@theme/theme";
import { fieldSx as bookingFieldSx, ui } from "@components/booking/styles";
import { applyPhoneInput, countryName, dialCode, examplePhone, phoneError, switchCountry } from "@utils/phone";
import type { PhoneValue } from "@utils/phone";
import CountryPicker from "./CountryPicker";
import type { PickerPalette } from "./CountryPicker";
import CountryFlag from "./CountryFlag";

/**
 * "booking" matches the booking window's fields (components/booking/styles),
 * "menu" matches the cart's fields on the purple-navy menu.
 */
export type PhoneFieldVariant = "booking" | "menu";

const VARIANTS = {
  booking: {
    fieldSx: bookingFieldSx,
    divider: ui.border,
    picker: { paper: ui.paper, border: ui.border, field: ui.card, hover: ui.cardHover, muted: ui.muted, dim: ui.dim },
  },
  menu: {
    fieldSx: { "& input": { fontSize: 16 } },
    divider: tokens.border,
    picker: {
      paper: tokens.menuBg,
      border: tokens.menuBorder,
      field: tokens.menuCard,
      hover: tokens.menuCardHover,
      muted: tokens.menuText,
      dim: tokens.menuTextDim,
    },
  },
} satisfies Record<PhoneFieldVariant, { fieldSx: object; divider: string; picker: PickerPalette }>;

export interface PhoneFieldProps {
  value: PhoneValue;
  /** Gets the formatted input plus `e164`, `country` and `valid`. */
  onChange: (value: PhoneValue) => void;
  variant?: PhoneFieldVariant;
  label?: string;
  /** Accessible name when there's no visible label. */
  ariaLabel?: string;
  placeholder?: string;
  helperText?: React.ReactNode;
  /** Error to show now (e.g. after a submit attempt or from the server). */
  error?: string;
  required?: boolean;
  size?: "small" | "medium";
  inputRef?: React.Ref<HTMLInputElement>;
  enterKeyHint?: "next" | "done" | "go" | "send";
}

/**
 * Phone number with a searchable country-code dropdown (Lebanon by default).
 * Formats as you type and reports the number in E.164. Once the person leaves a
 * half-typed number, it says what's wrong with it.
 */
const PhoneField: React.FC<PhoneFieldProps> = ({
  value,
  onChange,
  variant = "booking",
  label,
  ariaLabel,
  placeholder,
  helperText,
  error,
  required,
  size = "medium",
  inputRef,
  enterKeyHint = "done",
}) => {
  const v = VARIANTS[variant];
  const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const input = useRef<HTMLInputElement | null>(null);
  const pendingCaret = useRef<number | null>(null);

  // Put the caret back where the person was typing after the number is re-formatted
  useLayoutEffect(() => {
    const el = input.current;
    const pos = pendingCaret.current;
    pendingCaret.current = null;
    if (el && pos !== null && document.activeElement === el) el.setSelectionRange(pos, pos);
  });

  const setInputRef = useCallback(
    (el: HTMLInputElement | null) => {
      input.current = el;
      if (typeof inputRef === "function") inputRef(el);
      else if (inputRef) (inputRef as React.RefObject<HTMLInputElement | null>).current = el;
    },
    [inputRef]
  );

  const shownError = error ?? (touched ? phoneError(value, false) : undefined);
  const dial = dialCode(value.country);
  const small = size === "small";

  return (
    <>
      <TextField
        fullWidth
        label={label}
        value={value.input}
        onChange={(e) => {
          const el = e.target as HTMLInputElement;
          const next = applyPhoneInput(value, el.value, el.selectionStart, (e.nativeEvent as InputEvent).inputType);
          pendingCaret.current = next.caret;
          onChange(next.value);
        }}
        onBlur={() => setTouched(!!value.input)}
        required={required}
        type="tel"
        autoComplete="tel"
        placeholder={placeholder ?? examplePhone(value.country)}
        error={!!shownError}
        helperText={shownError ?? helperText}
        size={size}
        inputRef={setInputRef}
        slotProps={{
          htmlInput: { inputMode: "tel", maxLength: 24, enterKeyHint, "aria-label": label ? undefined : ariaLabel },
          input: {
            ref: setAnchor,
            startAdornment: (
              <InputAdornment position="start" sx={{ height: "auto", maxHeight: "none", alignSelf: "stretch", mr: 0 }}>
                <ButtonBase
                  onClick={() => setPickerOpen(true)}
                  aria-label={`Country code: ${countryName(value.country)} +${dial}. Change country`}
                  aria-haspopup="dialog"
                  aria-expanded={pickerOpen}
                  sx={{
                    height: "100%",
                    gap: 0.75,
                    pl: small ? 1.5 : 1.75,
                    pr: 1,
                    borderRight: `1px solid ${v.divider}`,
                    borderRadius: "14px 0 0 14px",
                    color: tokens.text,
                    fontFamily: tokens.fontBody,
                    fontSize: small ? "0.95rem" : "1rem",
                    fontWeight: 600,
                    fontVariantNumeric: "tabular-nums",
                    transition: "background-color .18s ease",
                    "&:hover": { background: v.picker.hover },
                    "&.Mui-focusVisible": { outline: `2px solid ${tokens.cyan}`, outlineOffset: -2 },
                  }}
                >
                  <CountryFlag code={value.country} />
                  +{dial}
                  <ExpandMore sx={{ fontSize: 18, color: v.picker.muted, ml: -0.25 }} />
                </ButtonBase>
              </InputAdornment>
            ),
          },
        }}
        sx={[v.fieldSx, { "& .MuiOutlinedInput-root": { pl: 0 }, "& .MuiOutlinedInput-input": { pl: 1.5 } }]}
      />
      <CountryPicker
        open={pickerOpen}
        anchorEl={anchor}
        value={value.country}
        palette={v.picker}
        onClose={() => setPickerOpen(false)}
        onSelect={(country) => {
          onChange(switchCountry(value, country));
          setPickerOpen(false);
          // Straight back to typing the number
          window.setTimeout(() => input.current?.focus(), 0);
        }}
      />
    </>
  );
};

export default PhoneField;
