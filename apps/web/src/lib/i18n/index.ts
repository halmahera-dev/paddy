import { en } from "./en";
import { id } from "./id";
import { defaultLocale, hasLocale, type Locale } from "./locales";

export type { Dictionary } from "./en";
export { defaultLocale, hasLocale, locales, type Locale } from "./locales";

export function getDictionary(locale: Locale) {
  return locale === "en" ? en : id;
}

export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, function replaceKey(match, key: string) {
    return key in values ? String(values[key]) : match;
  });
}

export function formatDate(locale: Locale, date: string | Date) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

// dynamicParams is false on the locale layout, so a bad value never reaches a page.
export function toLocale(value: string): Locale {
  return hasLocale(value) ? value : defaultLocale;
}
