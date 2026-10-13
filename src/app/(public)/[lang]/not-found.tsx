import Link from "next/link";

import { BUSINESS } from "@/lib/business";
import { Phone } from "lucide-react";

/**
 * Custom 404 (PRD §7.13): bilingual, noindex, Home / Services / Call Now.
 * Rendered for any unmatched path inside /ar and /en.
 */
export default function LangNotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center md:py-32">
      <p className="font-heading text-7xl font-extrabold text-accent md:text-8xl">404</p>
      <h1 className="mt-4 font-heading text-2xl font-bold text-ink" lang="ar" dir="rtl">
        الصفحة غير موجودة
      </h1>
      <p className="mt-2 font-heading text-2xl font-bold text-ink" lang="en" dir="ltr">
        Page not found
      </p>
      <p className="mt-3 text-muted" lang="ar" dir="rtl">
        الرابط الذي فتحته غير صحيح أو تم نقل الصفحة.
      </p>
      <p className="mt-1 text-muted" lang="en" dir="ltr">
        The link is incorrect or the page has moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/ar"
          className="inline-flex min-h-12 items-center rounded-full bg-ink px-6 font-semibold text-white transition hover:bg-ink-2"
          lang="ar"
          dir="rtl"
        >
          الرئيسية
        </Link>
        <Link
          href="/en"
          className="inline-flex min-h-12 items-center rounded-full bg-ink px-6 font-semibold text-white transition hover:bg-ink-2"
          lang="en"
          dir="ltr"
        >
          Home
        </Link>
        <Link
          href="/ar/services"
          className="inline-flex min-h-12 items-center rounded-full border-[1.5px] border-ink px-6 font-semibold text-ink transition hover:bg-surface"
          lang="ar"
          dir="rtl"
        >
          الخدمات
        </Link>
        <Link
          href="/en/services"
          className="inline-flex min-h-12 items-center rounded-full border-[1.5px] border-ink px-6 font-semibold text-ink transition hover:bg-surface"
          lang="en"
          dir="ltr"
        >
          Services
        </Link>
        <a
          href={BUSINESS.phoneHref}
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-6 font-semibold text-white shadow-glow transition hover:bg-accent-hover"
        >
          <Phone className="size-4" />
          <span lang="ar" dir="rtl">اتصل الآن</span>
          <span dir="ltr">{BUSINESS.phoneDisplay}</span>
        </a>
      </div>
    </div>
  );
}
