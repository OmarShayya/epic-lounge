import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { Box, Drawer, IconButton, InputAdornment, Popover, Stack, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Check, Close, Search } from "@mui/icons-material";
import { tokens } from "@theme/theme";
import { DEFAULT_COUNTRY, countryOptions, searchCountries } from "@utils/phone";
import type { CountryCode, CountryOption } from "@utils/phone";
import CountryFlag from "./CountryFlag";

/** Colours of the surface the picker opens over (booking window or menu). */
export interface PickerPalette {
  paper: string;
  border: string;
  field: string;
  hover: string;
  muted: string;
  dim: string;
}

interface CountryPickerProps {
  open: boolean;
  /** The phone field (desktop popover opens under it). */
  anchorEl: HTMLElement | null;
  value: CountryCode;
  palette: PickerPalette;
  onSelect: (country: CountryCode) => void;
  onClose: () => void;
}

/* Above the cart drawer (1400) and booking dialog (1300). */
const Z = 1500;

type CountryListProps = Omit<CountryPickerProps, "open" | "anchorEl" | "onClose"> & {
  maxHeight?: number | string;
  searchRef: React.Ref<HTMLInputElement>;
};

/** Search box + list. Arrow keys move, Enter picks, Esc closes. */
const CountryList: React.FC<CountryListProps> = ({ value, palette, onSelect, maxHeight, searchRef }) => {
  const [query, setQuery] = useState("");
  const listId = useId();

  const rows = useMemo(() => {
    if (query.trim()) return { pinned: [] as CountryOption[], rest: searchCountries(query) };
    const all = countryOptions();
    const pinnedCodes = value === DEFAULT_COUNTRY ? [DEFAULT_COUNTRY] : [value, DEFAULT_COUNTRY];
    const pinned = pinnedCodes.map((c) => all.find((o) => o.code === c)).filter(Boolean) as CountryOption[];
    return { pinned, rest: all.filter((o) => !pinnedCodes.includes(o.code)) };
  }, [query, value]);
  const flat = useMemo(() => [...rows.pinned, ...rows.rest], [rows]);

  const [active, setActive] = useState(0);
  const optionId = (i: number) => `${listId}-o${i}`;

  useEffect(() => {
    document.getElementById(optionId(active))?.scrollIntoView({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!flat.length) return;
    if (e.key === "ArrowDown") setActive((a) => Math.min(flat.length - 1, a + 1));
    else if (e.key === "ArrowUp") setActive((a) => Math.max(0, a - 1));
    else if (e.key === "Enter") onSelect(flat[active].code);
    else return;
    e.preventDefault();
  };

  const option = (o: CountryOption, i: number) => {
    const selected = o.code === value;
    return (
      <Box
        component="li"
        key={o.code}
        id={optionId(i)}
        role="option"
        aria-selected={selected}
        onClick={() => onSelect(o.code)}
        onMouseMove={() => active !== i && setActive(i)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          minHeight: 48,
          px: 1.5,
          borderRadius: "12px",
          cursor: "pointer",
          background: i === active ? palette.hover : "transparent",
          color: selected ? tokens.cyan : tokens.text,
          fontWeight: selected ? 700 : 500,
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <CountryFlag code={o.code} />
        <Box component="span" sx={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {o.name}
        </Box>
        <Box component="span" sx={{ color: selected ? tokens.cyan : palette.muted, fontVariantNumeric: "tabular-nums", fontSize: "0.92rem" }}>
          +{o.dial}
        </Box>
        <Check sx={{ fontSize: 18, visibility: selected ? "visible" : "hidden" }} />
      </Box>
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: 0, flex: 1 }}>
      <Box sx={{ p: 1.25, pb: 1 }}>
        <TextField
          fullWidth
          inputRef={searchRef}
          size="small"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Search country or code"
          slotProps={{
            htmlInput: {
              role: "combobox",
              "aria-label": "Search country or code",
              "aria-expanded": true,
              "aria-controls": listId,
              "aria-activedescendant": flat.length ? optionId(active) : undefined,
              autoComplete: "off",
              enterKeyHint: "go",
            },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: palette.dim, fontSize: 20 }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": { background: palette.field, borderRadius: "12px", height: 44 },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: palette.border },
            "& input": { fontSize: 16 },
          }}
        />
      </Box>
      <Box
        component="ul"
        id={listId}
        role="listbox"
        aria-label="Countries"
        sx={{ listStyle: "none", m: 0, px: 0.75, pb: 1, overflowY: "auto", overscrollBehavior: "contain", flex: 1, maxHeight }}
      >
        {flat.length === 0 && (
          <Typography component="li" sx={{ color: palette.muted, textAlign: "center", py: 3, fontSize: "0.92rem" }}>
            No country matches “{query.trim()}”
          </Typography>
        )}
        {rows.pinned.map((o, i) => option(o, i))}
        {rows.pinned.length > 0 && (
          <Box component="li" role="presentation" sx={{ borderTop: `1px solid ${palette.border}`, mx: 1, my: 0.75 }} />
        )}
        {rows.rest.map((o, i) => option(o, i + rows.pinned.length))}
      </Box>
    </Box>
  );
};

/** Country-code chooser: a popover under the field on desktop, a bottom sheet on phones. */
const CountryPicker: React.FC<CountryPickerProps> = ({ open, anchorEl, onClose, ...rest }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { palette } = rest;
  const searchRef = useRef<HTMLInputElement>(null);
  // Ready to type as soon as it opens (the modal would otherwise focus its own paper)
  const transition = { onEntering: () => searchRef.current?.focus() };

  if (isMobile) {
    return (
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        sx={{ zIndex: Z }}
        slotProps={{
          transition,
          paper: {
            role: "dialog",
            "aria-label": "Choose country",
            sx: {
              height: "min(640px, 86dvh)",
              borderTopLeftRadius: "24px",
              borderTopRightRadius: "24px",
              border: `1px solid ${palette.border}`,
              background: palette.paper,
              display: "flex",
              flexDirection: "column",
              pb: "env(safe-area-inset-bottom)",
            },
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", pt: 1.25 }}>
          <Box sx={{ width: 40, height: 4, borderRadius: 4, background: tokens.borderStrong }} />
        </Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, pt: 0.75 }}>
          <Typography sx={{ fontWeight: 700, fontSize: "1.05rem" }}>Choose country</Typography>
          <IconButton aria-label="Close" onClick={onClose} sx={{ mr: -1, color: palette.muted }}>
            <Close />
          </IconButton>
        </Stack>
        <CountryList {...rest} searchRef={searchRef} />
      </Drawer>
    );
  }

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      sx={{ zIndex: Z }}
      slotProps={{
        transition,
        paper: {
          role: "dialog",
          "aria-label": "Choose country",
          sx: {
            mt: 0.75,
            width: Math.min(420, Math.max(300, anchorEl?.offsetWidth ?? 340)),
            background: palette.paper,
            backgroundImage: "none",
            border: `1px solid ${palette.border}`,
            borderRadius: "16px",
            boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      <CountryList {...rest} searchRef={searchRef} maxHeight={300} />
    </Popover>
  );
};

export default CountryPicker;
