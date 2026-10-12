"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  CalendarCheck,
  ChevronDown,
  Menu,
  Phone,
  X,
} from "lucide-react";

import type { Lang } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { BUSINESS } from "@/lib/business";
import { LogoMark } from "@/components/ui/icons/LogoMark";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Container } from "./Container";

export interface NavCategory {
  slug: string;
  name: string;
  subs: Array<{ slug: string; name: string }>;
}

/**
 * Header (PRD §7.1): sticky, desktop mega menu for services, full-height
 * mobile drawer with expandable service groups and pinned CTAs. On mobile
 * it hides on scroll-down and returns on scroll-up (A07).
 */
export function Header({
  lang,
  dict,
  categories,
  showBlogs,
  showWork,
}: {
  lang: Lang;
  dict: Dictionary;
  categories: NavCategory[];
  showBlogs: boolean;
  showWork: boolean;
}) {
  const [megaOpen, setMegaOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const lastY = useRef(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setHidden(y > 96 && y > lastY.current);
      lastY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMegaOpen(false);
        setDrawerOpen(false);
      }
    }
    function onClick(e: MouseEvent) {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  const links = [
    { href: `/${lang}`, label: lang === "ar" ? "الرئيسية" : "Home" },
    { href: `/${lang}/work`, label: dict.nav.work, hidden: !showWork },
    { href: `/${lang}/blog`, label: dict.nav.blogs, hidden: !showBlogs },
    { href: `/${lang}/areas`, label: dict.nav.areas },
    { href: `/${lang}/about`, label: dict.nav.about },
    { href: `/${lang}/contact`, label: dict.nav.contact },
  ].filter((l) => !l.hidden);

  return (
    <header
      className={`sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur transition-transform duration-200 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <Container className="flex h-16 items-center justify-between gap-3">
        {/* Brand */}
        <Link href={`/${lang}`} className="flex min-h-12 items-center gap-3">
          <LogoMark />
          <span
            lang="ar"
            dir="rtl"
            className="font-heading text-base font-bold whitespace-nowrap text-ink sm:text-lg"
          >
            {BUSINESS.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          <div className="relative" ref={megaRef}>
            <button
              type="button"
              aria-expanded={megaOpen}
              onClick={() => setMegaOpen((v) => !v)}
              className="flex min-h-12 cursor-pointer items-center gap-1 rounded-full px-3.5 text-[15px] font-medium text-ink-2 transition hover:bg-surface hover:text-ink"
            >
              {dict.nav.services}
              <ChevronDown
                className={`size-4 transition-transform duration-200 ${
                  megaOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>
            {megaOpen ? (
              <div className="absolute start-0 top-full z-50 mt-2 w-[880px] max-w-[calc(100vw-3rem)] rounded-2xl border border-line bg-bg p-6 shadow-s3">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {categories.map((cat) => (
                    <div key={cat.slug}>
                      <Link
                        href={`/${lang}/services/${cat.slug}`}
                        onClick={() => setMegaOpen(false)}
                        className="font-heading text-base font-bold text-ink transition hover:text-accent"
                      >
                        {cat.name}
                      </Link>
                      <ul className="mt-3 space-y-0.5">
                        {cat.subs.slice(0, 6).map((sub) => (
                          <li key={sub.slug}>
                            <Link
                              href={`/${lang}/services/${cat.slug}/${sub.slug}`}
                              onClick={() => setMegaOpen(false)}
                              className="inline-flex min-h-9 items-center text-sm text-ink-2 transition hover:text-accent"
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={`/${lang}/services/${cat.slug}`}
                        onClick={() => setMegaOpen(false)}
                        className="mt-2 inline-flex min-h-9 items-center gap-1 text-sm font-semibold text-accent"
                      >
                        {dict.pages.services.viewCategory}
                        <ChevronDown
                          className="size-4 -rotate-90 rtl:rotate-90"
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="inline-flex min-h-12 items-center rounded-full px-3.5 text-[15px] font-medium text-ink-2 transition hover:bg-surface hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher
            lang={lang}
            label={dict.a11y.switchLabel}
            ariaLabel={dict.a11y.switchAria}
          />
          <div className="hidden xl:block">
            <a
              href={BUSINESS.phoneHref}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-5 font-semibold text-white shadow-glow transition hover:bg-accent-hover active:scale-[0.97]"
            >
              <Phone className="size-4" />
              <span dir="ltr">{BUSINESS.phoneDisplay}</span>
            </a>
          </div>
          <Link
            href={`/${lang}/book`}
            className="hidden min-h-12 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-ink-2 sm:inline-flex"
          >
            <CalendarCheck className="size-4" />
            {dict.cta.bookService}
          </Link>
          {/* Mobile menu button */}
          <button
            type="button"
            aria-expanded={drawerOpen}
            aria-label={dict.nav.services}
            onClick={() => setDrawerOpen(true)}
            className="inline-flex size-12 cursor-pointer items-center justify-center rounded-full text-ink transition hover:bg-surface lg:hidden"
          >
            <Menu className="size-6" aria-hidden="true" />
          </button>
        </div>
      </Container>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 end-0 flex w-[86%] max-w-sm flex-col bg-bg shadow-s3">
            <div className="flex items-center justify-between border-b border-line p-4">
              <span
                lang="ar"
                dir="rtl"
                className="font-heading text-lg font-bold text-ink"
              >
                {BUSINESS.name}
              </span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label={lang === "ar" ? "إغلاق" : "Close"}
                className="inline-flex size-12 cursor-pointer items-center justify-center rounded-full text-ink transition hover:bg-surface"
              >
                <X className="size-6" aria-hidden="true" />
              </button>
            </div>
            <nav
              className="flex-1 overflow-y-auto p-4"
              aria-label={lang === "ar" ? "القائمة" : "Menu"}
            >
              <ul className="space-y-1">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setDrawerOpen(false)}
                      className="flex min-h-12 items-center rounded-xl px-3 font-medium text-ink transition hover:bg-surface"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t border-line pt-4">
                {categories.map((cat) => (
                  <details key={cat.slug} className="group">
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between rounded-xl px-3 font-medium text-ink transition hover:bg-surface [&::-webkit-details-marker]:hidden">
                      {cat.name}
                      <ChevronDown
                        className="size-4 transition-transform group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </summary>
                    <ul className="pb-1 ps-3">
                      <li>
                        <Link
                          href={`/${lang}/services/${cat.slug}`}
                          onClick={() => setDrawerOpen(false)}
                          className="flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-accent"
                        >
                          {cat.name}
                        </Link>
                      </li>
                      {cat.subs.map((sub) => (
                        <li key={sub.slug}>
                          <Link
                            href={`/${lang}/services/${cat.slug}/${sub.slug}`}
                            onClick={() => setDrawerOpen(false)}
                            className="flex min-h-11 items-center rounded-lg px-3 text-sm text-ink-2"
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </nav>
            <div className="grid grid-cols-2 gap-2 border-t border-line p-4">
              <a
                href={BUSINESS.phoneHref}
                className="col-span-2 flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent font-semibold text-white shadow-glow"
              >
                <Phone className="size-4" />
                {dict.cta.callNow}
              </a>
              <a
                href={BUSINESS.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 items-center justify-center rounded-full border-[1.5px] border-ink font-semibold text-ink"
              >
                {dict.cta.whatsapp}
              </a>
              <Link
                href={`/${lang}/book`}
                onClick={() => setDrawerOpen(false)}
                className="flex min-h-12 items-center justify-center rounded-full bg-ink font-semibold text-white"
              >
                {dict.cta.bookService}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
