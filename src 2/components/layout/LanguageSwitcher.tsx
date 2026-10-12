"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LANG_COOKIE, otherLang, type Lang } from "@/i18n/config";

/**
 * EN | العربية switcher (PRD §9): navigates to the equivalent page in the
 * other language and remembers the choice in cookie + localStorage.
 */
export function LanguageSwitcher({
  lang,
  label,
  ariaLabel,
}: {
  lang: Lang;
  label: string;
  ariaLabel: string;
}) {
  const pathname = usePathname() ?? `/${lang}`;
  const other = otherLang(lang);
  const target = pathname.replace(/^\/(ar|en)(?=\/|$)/, `/${other}`);

  function rememberChoice() {
    document.cookie = `${LANG_COOKIE}=${other}; path=/; max-age=31536000; samesite=lax`;
    try {
      localStorage.setItem(LANG_COOKIE, other);
    } catch {
      // Storage may be unavailable (private mode); the cookie still works.
    }
  }

  return (
    <Link
      href={target}
      onClick={rememberChoice}
      aria-label={ariaLabel}
      className="inline-flex min-h-12 items-center rounded-full border border-line bg-surface px-4 text-sm font-semibold text-ink transition hover:bg-surface-2"
    >
      {label}
    </Link>
  );
}
