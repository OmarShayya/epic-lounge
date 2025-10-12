import axios from "axios";
import { Product } from "../types/index";

const API_BASE_URL = "http://localhost:3000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

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
};

export default api;
