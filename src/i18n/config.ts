/**
 * Language configuration — PRD §2 (D3), §9.
 * Languages: Arabic (RTL, DEFAULT) and English (LTR).
 */
export const LANGS = ["ar", "en"] as const;

export type Lang = (typeof LANGS)[number];

/** Default language is Arabic (PRD locked decision D3). */
export const DEFAULT_LANG: Lang = "ar";

/** Cookie that remembers the visitor's language choice (PRD §9). */
export const LANG_COOKIE = "lang";

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && (LANGS as readonly string[]).includes(value);
}

export function getDir(lang: Lang): "rtl" | "ltr" {
  return lang === "ar" ? "rtl" : "ltr";
}

export function otherLang(lang: Lang): Lang {
  return lang === "ar" ? "en" : "ar";
}
