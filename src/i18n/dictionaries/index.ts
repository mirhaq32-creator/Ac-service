import "server-only";

import type { Lang } from "@/i18n/config";
import type { Dictionary } from "./en";

const dictionaries: Record<Lang, () => Promise<Dictionary>> = {
  en: () => import("./en").then((m) => m.default),
  ar: () => import("./ar").then((m) => m.default),
};

/** Load the UI dictionary for a language (server-side only). */
export async function getDictionary(lang: Lang): Promise<Dictionary> {
  return dictionaries[lang]();
}
