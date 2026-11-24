import axios from "axios";
import type { Product } from "../types/index";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://simple-pos-6be8.onrender.com/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export type StationType = "pc" | "playstation";

export interface PCStatus {
  pcNumber: string;
  name: string;
  type?: StationType;
  status: "available" | "occupied" | "maintenance" | "reserved";
  location?: string;
  /** Next booked time slot within ~12h (no customer data). */
  nextReservation?: { startTime: string; endTime: string };
}

export interface PCStats {
  total: number;
  available: number;
  occupied: number;
  maintenance: number;
}

export interface PCStatusResponse {
  pcs: PCStatus[];
  stats: PCStats;
  statsByType?: Record<StationType, PCStats>;
}

/* ------------------------------------------------------------------ */
/* Reservations                                                        */
/* ------------------------------------------------------------------ */

export interface DaySchedule {
  day: number; // 0 = Sunday
  closed: boolean;
  open: string; // "HH:mm"
  close: string; // "HH:mm", <= open means next morning
}

export interface ReservationConfig {
  enabled: boolean;
  timezone: string;
  schedule: DaySchedule[];
  slotMinutes: number;
  minDurationMinutes: number;
  maxDurationMinutes: number;
  maxAdvanceDays: number;
  minLeadMinutes: number;
  noShowGraceMinutes: number;
  maxStationsPerBooking: number;
  bookableTypes: StationType[];
  stationCounts: Record<StationType, number>;
  /** Today's date (YYYY-MM-DD) in the lounge's timezone. */
  today: string;
}

export interface AvailabilityStation {
  id: string;
  pcNumber: string;
  name: string;
  type: StationType;
  location?: string;
  hourlyRate: { usd: number; lbp: number };
}

export interface AvailabilitySlot {
  start: string;
  end: string;
  label: string;
  endLabel: string;
  nextDay: boolean;
  status: "available" | "full" | "past";
  availableCount: number;
  availableStationIds: string[];
}

export interface Availability {
  date: string;
  type: StationType;
  durationMinutes: number;
  timezone: string;
  open: string;
  close: string;
  closed: boolean;
  enabled: boolean;
  typeEnabled: boolean;
  stations: AvailabilityStation[];
  slots: AvailabilitySlot[];
}

export interface CreateReservationPayload {
  type: StationType;
  start: string;
  durationMinutes: number;
  stationIds?: string[];
  stationCount?: number;
  customerName: string;
  customerPhone: string;
  notes?: string;
  /** Honeypot — must stay empty. */
  website?: string;
}

export type ReservationStatus = "confirmed" | "checked_in" | "cancelled" | "no_show";

export interface PublicReservation {
  code: string;
  type: StationType;
  status: ReservationStatus;
  stations: { pcNumber: string; name: string; type: StationType }[];
  startTime: string;
  endTime: string;
  durationMinutes: number;
  customerName: string;
  estimatedCost: { usd: number; lbp: number };
  display: { day: string; start: string; end: string };
}

/** Turns an axios error into a status + human message the UI can show. */
export const describeApiError = (err: unknown): { status: number; message: string } => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status ?? 0;
    const serverMessage = (err.response?.data as { message?: string } | undefined)?.message;
    if (!err.response) return { status: 0, message: "We couldn't reach the lounge. Check your connection and try again." };
    if (status === 429) return { status, message: serverMessage || "Too many attempts. Please wait a bit or call us." };
    return { status, message: serverMessage || "Something went wrong. Please try again." };
  }
  return { status: 0, message: "Something went wrong. Please try again." };
};

export const reservationApi = {
  getConfig: async (): Promise<ReservationConfig> => {
    const response = await api.get("/reservations/public/config");
    return response.data.data;
  },

  getAvailability: async (params: { type: StationType; date: string; duration: number }): Promise<Availability> => {
    const response = await api.get("/reservations/public/availability", { params });
    return response.data.data;
  },

  create: async (payload: CreateReservationPayload): Promise<PublicReservation> => {
    const response = await api.post("/reservations/public", payload);
    return response.data.data;
  },

  lookup: async (code: string, phone: string): Promise<PublicReservation> => {
    const response = await api.post("/reservations/public/lookup", { code, phone });
    return response.data.data;
  },

  cancel: async (code: string, phone: string): Promise<PublicReservation> => {
    const response = await api.post("/reservations/public/cancel", { code, phone });
    return response.data.data;
  },
};

export const menuApi = {
  // Get all menu products (public endpoint)
  getMenuProducts: async (): Promise<Product[]> => {
    const response = await api.get("/products/menu");
    return response.data.data;
  },

  // Get exchange rate
  getExchangeRate: async (): Promise<{ rate: number; lastUpdated: string }> => {
    const response = await api.get("/exchange-rate/current");
    return response.data.data;
  },

  // Get gaming station availability (PCs + PlayStations)
  getPCStatus: async (): Promise<PCStatusResponse> => {
    const response = await api.get("/gaming/pcs/status");
    return response.data.data;
  },
};

export default api;
