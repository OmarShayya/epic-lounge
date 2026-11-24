import React from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Close, Search } from "@mui/icons-material";
import { tokens } from "@theme/theme";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => (
  <TextField
    fullWidth
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder="Search drinks, snacks…"
    slotProps={{
      htmlInput: { "aria-label": "Search the menu", enterKeyHint: "search" },
      input: {
        startAdornment: (
          <InputAdornment position="start">
            <Search sx={{ color: tokens.textDim }} />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton aria-label="Clear search" size="small" onClick={() => onChange("")} edge="end">
              <Close fontSize="small" />
            </IconButton>
          </InputAdornment>
        ) : undefined,
      },
    }}
    sx={{
      "& .MuiOutlinedInput-root": { height: 52, fontSize: "1rem", borderRadius: 999 },
      // 16px+ font prevents iOS zoom-on-focus
      "& input": { fontSize: 16 },
    }}
  />
);

export default SearchBar;
