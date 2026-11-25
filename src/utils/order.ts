import type { Money, PlacedOrder } from "@/services/api";
import type { CartItem } from "../context/CartContext";
import { LOUNGE_WHATSAPP } from "@utils/constants";
import { formatInternational } from "@utils/phone";

export interface OrderLine {
  name: string;
  quantity: number;
  unitPrice: Money;
  total: Money;
}

export interface OrderSummary {
  lines: OrderLine[];
  totals: Money;
  customerName?: string;
  /** E.164 */
  phone?: string;
  notes?: string;
  /** Set once the counter has the order. */
  orderNumber?: string;
}

const times = (m: Money, n: number): Money => ({ usd: m.usd * n, lbp: m.lbp * n });
const sum = (lines: OrderLine[]): Money =>
  lines.reduce((t, l) => ({ usd: t.usd + l.total.usd, lbp: t.lbp + l.total.lbp }), { usd: 0, lbp: 0 });

export const linesFromCart = (items: CartItem[]): OrderLine[] =>
  items.map((i) => ({ name: i.name, quantity: i.quantity, unitPrice: i.pricing, total: times(i.pricing, i.quantity) }));

/** What the server charged (its prices win). Falls back to the cart for anything it left out. */
export const summaryFromPlaced = (placed: PlacedOrder, cart: OrderLine[], extra: Omit<OrderSummary, "lines" | "totals">): OrderSummary => {
  const lines: OrderLine[] = placed.items?.length
    ? placed.items.map((it) => {
        const unitPrice = it.unitPrice ?? (it.finalAmount ? { usd: it.finalAmount.usd / it.quantity, lbp: it.finalAmount.lbp / it.quantity } : { usd: 0, lbp: 0 });
        return { name: it.productName, quantity: it.quantity, unitPrice, total: it.finalAmount ?? it.subtotal ?? times(unitPrice, it.quantity) };
      })
    : cart;
  return { ...extra, lines, totals: placed.totals ?? sum(lines) };
};

const usd = (n: number) => `$${n.toFixed(2)}`;
const lbp = (n: number) => Math.round(n).toLocaleString("en-US");

/** The WhatsApp message the lounge has always received, plus the order number and phone. */
export const buildOrderMessage = (o: OrderSummary): string => {
  let message = `🎮 *EPIC LOUNGE ORDER*\n`;
  if (o.orderNumber) message += `🧾 *Order:* ${o.orderNumber}\n`;
  message += `\n`;
  const name = o.customerName?.trim();
  if (name) message += `👤 *Customer:* ${name}\n`;
  if (o.phone) message += `📞 *Phone:* ${formatInternational(o.phone)}\n`;
  if (name || o.phone) message += `\n`;
  message += `📋 *Order Details:*\n`;
  message += `━━━━━━━━━━━━━━━━\n\n`;
  o.lines.forEach((line, index) => {
    message += `${index + 1}. *${line.name}*\n`;
    message += `   • Quantity: ${line.quantity}\n`;
    message += `   • Price: ${usd(line.unitPrice.usd)} / ${lbp(line.unitPrice.lbp)} LBP\n`;
    message += `   • Subtotal: ${usd(line.total.usd)} / ${lbp(line.total.lbp)} LBP\n\n`;
  });
  message += `━━━━━━━━━━━━━━━━\n`;
  message += `💰 *TOTAL:*\n`;
  message += `   • USD: ${usd(o.totals.usd)}\n`;
  message += `   • LBP: ${lbp(o.totals.lbp)}\n\n`;
  const notes = o.notes?.trim();
  if (notes) message += `📝 *Notes:* ${notes}\n\n`;
  message += `📍 Epic Lounge - Sidon, Lebanon`;
  return message;
};

export const orderWhatsappUrl = (o: OrderSummary) => `${LOUNGE_WHATSAPP}?text=${encodeURIComponent(buildOrderMessage(o))}`;
