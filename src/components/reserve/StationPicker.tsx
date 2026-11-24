import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { tokens } from "@theme/theme";
import type { AvailabilityStation } from "@/services/api";
import { pillSx } from "./styles";

interface StationPickerProps {
  stations: AvailabilityStation[];
  count: number;
  mode: "any" | "pick";
  picked: string[];
  onModeChange: (m: "any" | "pick") => void;
  onPickedChange: (ids: string[]) => void;
}

/** "Any available" (default) or choose exact stations from the ones free at the chosen time. */
const StationPicker: React.FC<StationPickerProps> = ({ stations, count, mode, picked, onModeChange, onPickedChange }) => {
  const toggle = (id: string) => {
    if (picked.includes(id)) onPickedChange(picked.filter((p) => p !== id));
    else if (count === 1) onPickedChange([id]);
    else if (picked.length < count) onPickedChange([...picked, id]);
  };

  return (
    <Stack spacing={1.25}>
      <Box role="radiogroup" aria-label="Station choice" sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        <Box component="button" type="button" role="radio" aria-checked={mode === "any"} onClick={() => onModeChange("any")} sx={pillSx(mode === "any")}>
          Any available
        </Box>
        <Box component="button" type="button" role="radio" aria-checked={mode === "pick"} onClick={() => onModeChange("pick")} sx={pillSx(mode === "pick")}>
          Let me choose
        </Box>
      </Box>

      {mode === "pick" && (
        <>
          <Typography sx={{ color: tokens.menuText, fontSize: "0.88rem" }}>
            Pick {count} — {picked.length} selected
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {stations.map((s) => {
              const on = picked.includes(s.id);
              const blocked = !on && picked.length >= count && count > 1;
              return (
                <Box
                  key={s.id}
                  component="button"
                  type="button"
                  aria-pressed={on}
                  disabled={blocked}
                  onClick={() => toggle(s.id)}
                  sx={{ ...pillSx(on), px: 1.75, opacity: blocked ? 0.45 : 1, flexDirection: "column", height: 52, minWidth: 78 }}
                >
                  <Box component="span" sx={{ fontSize: "0.92rem", lineHeight: 1.1 }}>
                    {s.pcNumber}
                  </Box>
                  {s.name && s.name !== s.pcNumber && (
                    <Box component="span" sx={{ fontSize: "0.68rem", fontWeight: 600, opacity: 0.7, mt: 0.25 }}>
                      {s.name}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        </>
      )}
    </Stack>
  );
};

export default StationPicker;
