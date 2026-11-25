/* The ~250 SVG country flags live in their own chunk, fetched the first time one is needed. */
type FlagSet = Record<string, string>;

let flags: FlagSet | null = null;
let loading: Promise<FlagSet> | null = null;

export const loadedFlags = () => flags;

export const loadFlags = (): Promise<FlagSet> =>
  (loading ??= import("country-flag-icons/string/3x2").then(
    (m) => (flags = m as unknown as FlagSet),
    (err) => {
      loading = null; // offline: try again next time
      throw err;
    }
  ));

/** Start fetching the flags early (e.g. once the cart has items) so they're ready when a phone field shows. */
export const preloadFlags = () => {
  loadFlags().catch(() => {});
};

const uriCache = new Map<string, string>();

/** The flag as a data: URI for an <img> (inline SVGs would clash on their internal ids). */
export const flagUri = (set: FlagSet, code: string): string | undefined => {
  let uri = uriCache.get(code);
  if (!uri && set[code]) {
    uri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(set[code])}`;
    uriCache.set(code, uri);
  }
  return uri;
};
