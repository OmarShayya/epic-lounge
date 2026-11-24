import type { AvailabilityStation, DaySchedule, PublicReservation, ReservationConfig, StationType } from "@/services/api";
import { CONTACT_INFO } from "@utils/constants";

export const TYPE_LABEL: Record<StationType, { one: string; many: string; unit: string }> = {
  pc: { one: "Gaming PC", many: "Gaming PCs", unit: "PC" },
  playstation: { one: "PS5 room", many: "PS5 rooms", unit: "room" },
};

/** "2026-11-25" + n days, done at UTC noon so DST never shifts the date. */
export const addDays = (date: string, days: number): string => {
  const t = new Date(`${date}T12:00:00Z`);
  t.setUTCDate(t.getUTCDate() + days);
  return t.toISOString().slice(0, 10);
};

export const weekdayOf = (date: string): number => new Date(`${date}T12:00:00Z`).getUTCDay();

const minutesOf = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Current local wall-clock minutes (0–1439) in the lounge's timezone. */
const nowMinutesIn = (tz: string): number => {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", hour: "2-digit", minute: "2-digit" })
    .formatToParts(new Date())
    .reduce<Record<string, string>>((acc, p) => ({ ...acc, [p.type]: p.value }), {});
  return (+parts.hour % 24) * 60 + +parts.minute;
};

const scheduleFor = (schedule: DaySchedule[], date: string): DaySchedule | undefined =>
  schedule.find((d) => d.day === weekdayOf(date));

export interface DateOption {
  date: string;
  label: string;
  sub: string;
  closed: boolean;
  hours?: string;
}

const formatHHMM = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m ? `${h12}:${String(m).padStart(2, "0")} ${suffix}` : `${h12} ${suffix}`;
};

export const describeHours = (d?: DaySchedule) => (d && !d.closed ? `${formatHHMM(d.open)} – ${formatHHMM(d.close)}` : "Closed");

/**
 * The bookable "nights" a customer can pick, in the lounge's timezone.
 * Just after midnight the previous night is still running, so it's offered first.
 */
export const buildDateOptions = (config: ReservationConfig): DateOption[] => {
  const { today, schedule, maxAdvanceDays, timezone } = config;
  const options: DateOption[] = [];

  const yesterday = addDays(today, -1);
  const prev = scheduleFor(schedule, yesterday);
  const nowMin = nowMinutesIn(timezone);
  const prevRunsOvernight = prev && !prev.closed && minutesOf(prev.close) <= minutesOf(prev.open);
  const lateNight = !!prevRunsOvernight && nowMin < minutesOf(prev!.close);
  if (lateNight) {
    options.push({ date: yesterday, label: "Late tonight", sub: `until ${formatHHMM(prev!.close)}`, closed: false, hours: describeHours(prev) });
  }

  for (let i = 0; i <= maxAdvanceDays; i++) {
    const date = addDays(today, i);
    const d = scheduleFor(schedule, date);
    const dt = new Date(`${date}T12:00:00Z`);
    const weekday = dt.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
    const monthDay = dt.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
    let label = weekday;
    if (i === 0) label = lateNight ? "Today" : "Tonight";
    else if (i === 1) label = "Tomorrow";
    options.push({ date, label, sub: monthDay, closed: !d || d.closed, hours: describeHours(d) });
  }
  return options;
};

/** 1h, 1.5h, 2h, 2.5h, 3h, then whole hours, within the allowed range. */
export const buildDurationOptions = (min: number, max: number): number[] => {
  const out: number[] = [];
  for (let m = min; m <= max; m += 30) {
    if (m <= 180 || m % 60 === 0) out.push(m);
  }
  if (!out.length) out.push(min);
  return out;
};

export const durationLabel = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} min`;
  if (!m) return `${h}h`;
  return m === 30 ? `${h}.5h` : `${h}h ${m}m`;
};

export const formatUSD = (value: number) => `$${Number.isInteger(value) ? value : value.toFixed(2)}`;

/** Price estimate for the stations the server would allocate (or the ones picked). */
export const estimatePrice = (stations: AvailabilityStation[], minutes: number) =>
  Math.round(stations.reduce((t, s) => t + (s.hourlyRate?.usd ?? 0), 0) * (minutes / 60) * 100) / 100;

/** "8:00 PM" in the lounge's timezone. */
export const formatTimeIn = (iso: string, tz: string) =>
  new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit" }).format(new Date(iso));

/* ---------------------------------------------------------------- sharing */

const icsDate = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const icsEscape = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

export const stationsText = (r: PublicReservation) => r.stations.map((s) => s.pcNumber).join(", ");

export const downloadIcs = (r: PublicReservation) => {
  const summary = `Epic Lounge — ${r.stations.length} × ${r.stations.length > 1 ? TYPE_LABEL[r.type].many : TYPE_LABEL[r.type].one}`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Epic Lounge//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${r.code}@epic-lounge`,
    `DTSTAMP:${icsDate(new Date().toISOString())}`,
    `DTSTART:${icsDate(r.startTime)}`,
    `DTEND:${icsDate(r.endTime)}`,
    `SUMMARY:${icsEscape(summary)}`,
    `LOCATION:${icsEscape(`Epic Lounge, ${CONTACT_INFO.address}`)}`,
    `DESCRIPTION:${icsEscape(`Booking code: ${r.code}\nStations: ${stationsText(r)}\nCall ${CONTACT_INFO.phone} if your plans change.`)}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT1H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Epic Lounge booking in 1 hour",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `epic-lounge-${r.code}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const whatsappShareUrl = (r: PublicReservation) => {
  const text =
    `🎮 Epic Lounge booking ${r.code}\n` +
    `${r.display.day}, ${r.display.start} – ${r.display.end}\n` +
    `${r.stations.length} × ${r.stations.length > 1 ? TYPE_LABEL[r.type].many : TYPE_LABEL[r.type].one} (${stationsText(r)})`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
};

export const LOUNGE_WHATSAPP = `https://wa.me/${CONTACT_INFO.phone.replace(/\D/g, "")}`;
