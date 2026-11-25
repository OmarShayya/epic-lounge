import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { flagUri, loadFlags, loadedFlags } from "@utils/flags";

const useFlags = () => {
  const [set, setSet] = useState(loadedFlags);
  useEffect(() => {
    if (set) return;
    let alive = true;
    loadFlags()
      .then((s) => alive && setSet(s))
      .catch(() => {
        /* offline: the placeholder stays */
      });
    return () => {
      alive = false;
    };
  }, [set]);
  return set;
};

interface CountryFlagProps {
  /** ISO-3166 alpha-2, e.g. "LB". */
  code: string;
  width?: number;
}

/** A small rectangular country flag (decorative: always pair it with the country name or code). */
const CountryFlag: React.FC<CountryFlagProps> = ({ code, width = 22 }) => {
  const set = useFlags();
  const src = set ? flagUri(set, code) : undefined;
  const sx = {
    width,
    height: Math.round((width * 2) / 3),
    flexShrink: 0,
    borderRadius: "3px",
    boxShadow: "0 0 0 1px rgba(255,255,255,0.14)",
    display: "block",
  } as const;
  return src ? (
    <Box component="img" src={src} alt="" aria-hidden="true" draggable={false} sx={{ ...sx, objectFit: "cover" }} />
  ) : (
    <Box component="span" aria-hidden="true" sx={{ ...sx, background: "rgba(255,255,255,0.1)" }} />
  );
};

export default CountryFlag;
