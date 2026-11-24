import type { PCStatus } from "@/services/api";
import { tokens } from "@theme/theme";

export type PCState = PCStatus["status"];

export const STATUS_META: Record<PCState, { label: string; color: string }> = {
  available: { label: "Available", color: tokens.green },
  occupied: { label: "Occupied", color: tokens.red },
  maintenance: { label: "Maintenance", color: tokens.amber },
  reserved: { label: "Reserved", color: tokens.purpleBright },
};

/** The lounge's local time zone (all reservation times are shown in it). */
export const LOUNGE_TZ = "Asia/Beirut";

const timeFmt = new Intl.DateTimeFormat("en-US", { timeZone: LOUNGE_TZ, hour: "numeric", minute: "2-digit" });

/**
 * Badge text for a station's next booked slot, e.g. "Reserved 8:00 PM" or
 * "Reserved until 9:30 PM" while the slot is running. Null when nothing is booked.
 */
export const reservationBadge = (pc: PCStatus, now = Date.now()): string | null => {
  const r = pc.nextReservation;
  if (!r) return null;
  const start = new Date(r.startTime).getTime();
  const end = new Date(r.endTime).getTime();
  if (end <= now) return null;
  return start <= now ? `Reserved until ${timeFmt.format(end)}` : `Reserved ${timeFmt.format(start)}`;
};

export const isPlayStation = (pc: PCStatus) => pc.type === "playstation";

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
