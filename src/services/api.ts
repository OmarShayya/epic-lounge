import axios from "axios";
import { Product } from "../types/index";

const API_BASE_URL = "https://simple-pos-6be8.onrender.com/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface PCStatus {
  pcNumber: string;
  name: string;
  status: "available" | "occupied" | "maintenance";
  location?: string;
}

export interface PCStats {
  total: number;
  available: number;
  occupied: number;
  maintenance: number;
}

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

  // Get PC availability status
  getPCStatus: async (): Promise<{ pcs: PCStatus[]; stats: PCStats }> => {
    const response = await api.get("/gaming/pcs/status");
    return response.data.data;
  },
};

export default api;
