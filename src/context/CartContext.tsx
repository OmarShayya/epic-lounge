import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "../types/index";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getQuantity: (productId: string) => number;
  getTotalItems: () => number;
  getTotalPrice: () => { usd: number; lbp: number };
  /** Increments every time something is added — handy for "bump" animations. */
  addCount: number;
}

const STORAGE_KEY = "epicLoungeCart";

const CartContext = createContext<CartContextType | undefined>(undefined);

const loadCart = (): CartItem[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Lazy init so the saved cart is never overwritten by an empty one on first render
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [addCount, setAddCount] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable (private mode) — cart still works in memory */
    }
  }, [items]);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
      return [...prev, { ...product, quantity: 1 }];
    });
    setAddCount((c) => c + 1);
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.id !== productId)
        : prev.map((i) => (i.id === productId ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextType>(() => {
    const totalItems = items.reduce((t, i) => t + i.quantity, 0);
    const totals = items.reduce(
      (t, i) => ({ usd: t.usd + i.pricing.usd * i.quantity, lbp: t.lbp + i.pricing.lbp * i.quantity }),
      { usd: 0, lbp: 0 }
    );
    return {
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getQuantity: (id) => items.find((i) => i.id === id)?.quantity ?? 0,
      getTotalItems: () => totalItems,
      getTotalPrice: () => totals,
      addCount,
    };
  }, [items, addCount, addItem, removeItem, updateQuantity, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error("useCart must be used within a CartProvider");
  return context;
};
