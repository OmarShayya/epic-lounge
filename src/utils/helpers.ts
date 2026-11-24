/** $2.50 — drops the cents when the price is a whole number ($3). */
export const formatUSD = (value: number): string =>
  `$${Number.isInteger(value) ? value : value.toFixed(2)}`;

/** 223,750 LBP */
export const formatLBP = (value: number): string =>
  `${Math.round(value).toLocaleString("en-US")} LBP`;

/** Light haptic tap on phones that support it. */
export const haptic = (ms = 8) => {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* not supported */
  }
};

/** DOM id of a menu category section (used by the category chips to jump/scroll-spy). */
export const sectionDomId = (categoryId: string) => `menu-cat-${categoryId}`;
