import type { PCStatus } from "@/services/api";
import { tokens } from "@theme/theme";

export type PCState = PCStatus["status"];

export const STATUS_META: Record<PCState, { label: string; color: string }> = {
  available: { label: "Available", color: tokens.green },
  occupied: { label: "Occupied", color: tokens.red },
  maintenance: { label: "Maintenance", color: tokens.amber },
};

export const statusColor = (status: PCState): string =>
  STATUS_META[status]?.color ?? tokens.textMuted;

/**
 * Normalises PC identifiers so "PC-005", "PC005", "pc5" and "005" all match.
 * Falls back to the upper-cased raw value when there is no number in it.
 */
export const normalizePcNumber = (value: string): string => {
  const match = value.match(/\d+/);
  return match ? String(parseInt(match[0], 10)) : value.trim().toUpperCase();
};

/** Short label for the 3D map: "PC-005" -> "05". */
export const shortPcLabel = (value: string): string => {
  const match = value.match(/\d+/);
  return match ? String(parseInt(match[0], 10)).padStart(2, "0") : value;
};

const numericPart = (value: string): number => {
  const match = value.match(/\d+/);
  return match ? parseInt(match[0], 10) : Number.MAX_SAFE_INTEGER;
};

export const sortPcs = (pcs: PCStatus[]): PCStatus[] =>
  [...pcs].sort(
    (a, b) =>
      numericPart(a.pcNumber) - numericPart(b.pcNumber) ||
      a.pcNumber.localeCompare(b.pcNumber)
  );
