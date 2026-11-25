import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  getExampleNumber,
  isSupportedCountry,
  parsePhoneNumberFromString,
  validatePhoneNumberLength,
} from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js";
import examples from "libphonenumber-js/mobile/examples";

export type { CountryCode };

export const DEFAULT_COUNTRY: CountryCode = "LB";

/** What a phone field holds. `e164` + `country` are what we send to the server. */
export interface PhoneValue {
  /** ISO-3166 alpha-2 country picked in the dropdown, e.g. "LB". */
  country: CountryCode;
  /** The national number as shown in the box, e.g. "70 123 456". */
  input: string;
  /** "+96170123456" once valid; a best-effort "+961…" while typing; "" when empty. */
  e164: string;
  valid: boolean;
}

export interface CountryOption {
  code: CountryCode;
  name: string;
  /** Calling code without the plus, e.g. "961". */
  dial: string;
}

const digitsOf = (s: string) => s.replace(/\D/g, "");
/** E.164 allows at most 15 digits. */
const MAX_DIGITS = 15;

export const dialCode = (country: CountryCode) => getCountryCallingCode(country);

/** Builds a PhoneValue (with E.164 + validity) from a country and what's in the box. */
export const makePhone = (country: CountryCode, input: string): PhoneValue => {
  const digits = digitsOf(input);
  if (!digits) return { country, input, e164: "", valid: false };
  const international = input.trim().startsWith("+");
  const parsed = international ? parsePhoneNumberFromString(input) : parsePhoneNumberFromString(digits, country);
  if (parsed?.isValid()) {
    // A pasted +44… while "LB" is picked: follow the number. Shared codes (+1 US/CA) keep the user's pick.
    const owner = parsed.country && parsed.countryCallingCode !== dialCode(country) ? parsed.country : country;
    return { country: owner, input, e164: parsed.number, valid: true };
  }
  const e164 = international ? `+${digits}` : `+${dialCode(country)}${digits.replace(/^0/, "")}`;
  return { country, input, e164, valid: false };
};

export const emptyPhone = (country: CountryCode = DEFAULT_COUNTRY) => makePhone(country, "");

/** "70 123 456" for a national number, keeping the trunk "0" where the country uses one ("03 555 777"). */
const nationalDisplay = (nationalNumber: string, country: CountryCode) => {
  const parsed = parsePhoneNumberFromString(nationalNumber, country);
  return parsed?.isValid() ? parsed.formatNational() : new AsYouType(country).input(nationalNumber);
};

/** Re-formats the digits for another country (used when the dropdown changes). */
export const switchCountry = (value: PhoneValue, country: CountryCode): PhoneValue =>
  value.input.trim().startsWith("+")
    ? makePhone(country, value.input)
    : makePhone(country, new AsYouType(country).input(digitsOf(value.input)));

/** Position right after the n-th digit of `s` (0 → start). */
const caretAfterDigits = (s: string, n: number) => {
  if (n <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < s.length; i++) {
    if (/\d/.test(s[i]) && ++seen === n) return i + 1;
  }
  return s.length;
};

/**
 * Applies what the user typed/pasted to the field: formats as you type, keeps the caret
 * in place, understands "+961…" / "00961…" / "961…" (switches the country) and refuses
 * digits beyond the longest valid number.
 */
export const applyPhoneInput = (
  prev: PhoneValue,
  raw: string,
  caret: number | null,
  inputType?: string
): { value: PhoneValue; caret: number | null } => {
  const atEnd = caret === null || caret >= raw.length;
  let digits = digitsOf(raw).slice(0, MAX_DIGITS + 2);
  let caretDigits = digitsOf(raw.slice(0, caret ?? raw.length)).length;
  const prevDigits = digitsOf(prev.input);

  // Deleting a space or bracket alone would be undone by the formatter: delete the neighbouring digit instead.
  if (raw.length < prev.input.length && digits === prevDigits && digits.length) {
    const at = inputType === "deleteContentForward" ? caretDigits : caretDigits - 1;
    if (at >= 0 && at < digits.length) {
      digits = digits.slice(0, at) + digits.slice(at + 1);
      caretDigits = at;
    }
  }

  // International form: "+961 70…" or "00961 70…"
  const plus = raw.trim().startsWith("+");
  if (plus || (digits.startsWith("00") && digits.length > 2)) {
    const intl = (plus ? digits : digits.slice(2)).slice(0, MAX_DIGITS);
    const typer = new AsYouType();
    const formatted = typer.input(`+${intl}`);
    const detected = typer.getCountry();
    const national = typer.getNationalNumber();
    if (detected && national) {
      const country = typer.getCallingCode() === dialCode(prev.country) ? prev.country : detected;
      return { value: makePhone(country, nationalDisplay(national, country)), caret: null };
    }
    return { value: makePhone(prev.country, formatted), caret: atEnd ? null : caretAfterDigits(formatted, caretDigits) };
  }

  const { country } = prev;
  const growing = digits.length > prevDigits.length;
  if (growing && (digits.length > MAX_DIGITS || validatePhoneNumberLength(digits, country) === "TOO_LONG")) {
    // One digit too many: ignore the keystroke
    const back = caret === null ? null : Math.max(0, caret - (raw.length - prev.input.length));
    return { value: prev, caret: back };
  }

  // "961 70 123 456" typed without the plus while Lebanon is picked
  const dial = dialCode(country);
  const parsed = digits.startsWith(dial) ? parsePhoneNumberFromString(digits, country) : undefined;
  if (parsed?.isValid() && parsed.nationalNumber.length <= digits.length - dial.length) {
    return { value: makePhone(country, parsed.formatNational()), caret: null };
  }

  const input = new AsYouType(country).input(digits);
  return { value: makePhone(country, input), caret: atEnd ? null : caretAfterDigits(input, caretDigits) };
};

/** Reads a saved/legacy phone ("+96170123456", "70 123 456", "03-555777"…) back into a field value. */
export const phoneFromStored = (phone?: string | null, country?: string | null): PhoneValue => {
  const hint: CountryCode = country && isSupportedCountry(country) ? (country as CountryCode) : DEFAULT_COUNTRY;
  if (!phone) return emptyPhone(hint);
  const parsed = parsePhoneNumberFromString(phone, hint);
  if (parsed?.isValid()) {
    const owner = parsed.countryCallingCode === dialCode(hint) ? hint : (parsed.country ?? hint);
    return makePhone(owner, parsed.formatNational());
  }
  return applyPhoneInput(emptyPhone(hint), phone, null).value;
};

/** Validation message for a phone field, or undefined when it's fine. */
export const phoneError = (value: PhoneValue, required = true): string | undefined => {
  if (!digitsOf(value.input)) return required ? "Please enter your phone number" : undefined;
  if (value.valid) return undefined;
  const international = value.input.trim().startsWith("+");
  const length = international ? validatePhoneNumberLength(value.input) : validatePhoneNumberLength(value.input, value.country);
  if (length === "TOO_SHORT") return "This number is too short";
  return "Please enter a valid phone number";
};

/** "+961 70 123 456" — for messages and read-only display. */
export const formatInternational = (e164: string) => parsePhoneNumberFromString(e164)?.formatInternational() ?? e164;

/** An example number in the country's format, for the placeholder ("71 123 456"). */
export const examplePhone = (country: CountryCode) => getExampleNumber(country, examples)?.formatNational() ?? "";

const ALIASES: Partial<Record<CountryCode, string>> = {
  AE: "uae emirates dubai",
  GB: "uk england britain",
  US: "usa america",
  SA: "ksa saudi",
  LB: "liban lubnan",
};

let countryCache: CountryOption[] | null = null;

/** Every country libphonenumber knows, named in English and sorted by name. */
export const countryOptions = (): CountryOption[] => {
  if (countryCache) return countryCache;
  let names: Intl.DisplayNames | null = null;
  try {
    names = new Intl.DisplayNames(["en"], { type: "region" });
  } catch {
    names = null;
  }
  countryCache = getCountries()
    .map((code) => {
      let name: string = code;
      try {
        name = names?.of(code) ?? code;
      } catch {
        /* unknown region */
      }
      return { code, name, dial: dialCode(code) };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  return countryCache;
};

export const countryName = (code: CountryCode) => countryOptions().find((c) => c.code === code)?.name ?? code;

const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/** Search by name, ISO code, common nickname ("UAE", "KSA") or calling code ("961", "+33"). */
export const searchCountries = (query: string, list = countryOptions()): CountryOption[] => {
  const q = fold(query.trim());
  if (!q) return list;
  const dial = q.replace(/^\+|\s/g, "");
  const isDial = /^\d+$/.test(dial);
  const scored = list
    .map((c) => {
      const name = fold(c.name);
      let score = -1;
      if (isDial) {
        if (c.dial === dial) score = 0;
        else if (c.dial.startsWith(dial)) score = 1;
      } else if (c.code.toLowerCase() === q) score = 0;
      else if (name.startsWith(q)) score = 1;
      else if (name.split(/[\s-]+/).some((w) => w.startsWith(q))) score = 2;
      else if (ALIASES[c.code]?.split(" ").some((a) => a.startsWith(q))) score = 2;
      else if (name.includes(q)) score = 3;
      return { c, score };
    })
    .filter((x) => x.score >= 0);
  return scored.sort((a, b) => a.score - b.score || a.c.name.localeCompare(b.c.name)).map((x) => x.c);
};
