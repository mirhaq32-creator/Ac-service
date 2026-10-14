/**
 * Middleware (edge runtime — kept as middleware.ts so it deploys on Cloudflare Workers via OpenNext) — language routing (PRD §3.3, §9).
 *
 * `/` redirects to the saved language (cookie) → else the default (Arabic).
 * `/admin`, `/api`, Next internals, and dotted file paths are never
 * language-redirected.
 */
import { NextResponse, type NextRequest } from "next/server";

import { DEFAULT_LANG, LANG_COOKIE, isLang } from "@/i18n/config";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale =
    pathname === "/ar" ||
    pathname === "/en" ||
    pathname.startsWith("/ar/") ||
    pathname.startsWith("/en/");
  if (hasLocale) return NextResponse.next();

  const saved = request.cookies.get(LANG_COOKIE)?.value;
  const lang = isLang(saved) ? saved : DEFAULT_LANG;

  request.nextUrl.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skip Next internals, API routes, /admin, the offline fallback, and any
  // path containing a dot (static files and metadata routes).
  matcher: ["/((?!_next|api|admin|offline|.*\\.).*)"],
};
