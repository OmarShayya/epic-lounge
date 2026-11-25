import { useCallback, useRef, useState } from "react";
import { describeApiError, menuApi } from "@/services/api";
import { useCart } from "../context/CartContext";
import { linesFromCart, summaryFromPlaced } from "@utils/order";
import type { OrderSummary } from "@utils/order";
import type { PhoneValue } from "@utils/phone";

export interface OrderDetails {
  name: string;
  phone: PhoneValue;
  notes: string;
  /** Honeypot — must stay empty. */
  honeypot: string;
}

/**
 * Why sending failed. The cart is always kept, and every kind except "phone"
 * offers sending the order on WhatsApp instead.
 * - phone: the server didn't accept the number (shown under the phone field)
 * - rejected: the server refused the order (e.g. an item is no longer available)
 * - rate: too many orders from this device
 * - offline: network error, server error or the endpoint isn't there
 */
export type OrderFailure = { kind: "phone" | "rejected" | "rate" | "offline"; message: string };

export interface SentOrder extends OrderSummary {
  orderNumber: string;
}

const OFFLINE_MESSAGE = "We couldn't send your order to the lounge right now. Your order is still here — try again or send it on WhatsApp.";

/** Sends the cart to the POS (`POST /sales/public`) and clears it once the counter has it. */
export const usePlaceOrder = () => {
  const { items, clearCart } = useCart();
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState<OrderFailure | null>(null);
  const [sent, setSent] = useState<SentOrder | null>(null);
  const inFlight = useRef(false);

  const send = useCallback(
    async (details: OrderDetails): Promise<SentOrder | null> => {
      if (inFlight.current || !items.length) return null;
      inFlight.current = true;
      setSending(true);
      setFailure(null);
      const cartLines = linesFromCart(items);
      const notes = details.notes.trim();
      try {
        const placed = await menuApi.placeOrder({
          items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
          customerName: details.name.trim(),
          customerPhone: details.phone.e164,
          phoneCountry: details.phone.country,
          ...(notes ? { notes } : {}),
          website: details.honeypot,
        });
        const order: SentOrder = {
          ...summaryFromPlaced(placed, cartLines, { customerName: details.name.trim(), phone: details.phone.e164, notes }),
          orderNumber: placed.invoiceNumber,
        };
        setSent(order);
        clearCart();
        return order;
      } catch (err) {
        const { status, message } = describeApiError(err);
        if (status === 429) setFailure({ kind: "rate", message });
        else if (status >= 400 && status < 500 && status !== 404) {
          setFailure({ kind: /phone/i.test(message) ? "phone" : "rejected", message });
        } else setFailure({ kind: "offline", message: OFFLINE_MESSAGE });
        return null;
      } finally {
        inFlight.current = false;
        setSending(false);
      }
    },
    [items, clearCart]
  );

  /** Back to a fresh cart view (after the confirmation is dismissed). */
  const reset = useCallback(() => {
    setSent(null);
    setFailure(null);
  }, []);

  const clearFailure = useCallback(() => setFailure(null), []);

  return { send, sending, failure, sent, reset, clearFailure };
};
