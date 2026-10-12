import { Clock, MapPin, Phone } from "lucide-react";

import type { Lang } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { BUSINESS } from "@/lib/business";
import { LogoMark } from "@/components/ui/icons/LogoMark";
import { WhatsAppIcon } from "@/components/ui/icons/WhatsAppIcon";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Container } from "./Container";

/**
 * Charcoal footer (PRD §7.2 H13): brand, contact, nav, legal.
 * No social icons (D13).
 */
export function Footer({ lang, dict }: { lang: Lang; dict: Dictionary }) {
  const navItems: Array<{ label: string; href: string }> = [
    { label: dict.nav.services, href: `/${lang}/services` },
    { label: dict.nav.work, href: `/${lang}/work` },
    { label: dict.nav.blogs, href: `/${lang}/blog` },
    { label: dict.nav.areas, href: `/${lang}/areas` },
    { label: dict.nav.about, href: `/${lang}/about` },
    { label: dict.nav.contact, href: `/${lang}/contact` },
    { label: dict.cta.bookService, href: `/${lang}/book` },
  ];

  return (
    <footer className="bg-ink text-surface">
      <Container className="grid gap-10 py-12 md:grid-cols-3 md:py-16">
        <div>
          <div className="flex items-center gap-3">
            <LogoMark tone="dark" />
            <span
              lang="ar"
              dir="rtl"
              className="font-heading text-xl font-bold"
            >
              {BUSINESS.name}
            </span>
          </div>
          <ul className="mt-5 space-y-3 text-sm text-surface/80">
            <li>
              <a
                href={BUSINESS.phoneHref}
                dir="ltr"
                className="inline-flex min-h-12 items-center gap-2 hover:text-surface"
              >
                <Phone className="size-4 shrink-0" />
                {BUSINESS.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={BUSINESS.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-2 hover:text-surface"
              >
                <WhatsAppIcon className="size-4 shrink-0 text-wa" />
                {dict.cta.whatsapp}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="size-4 shrink-0" aria-hidden="true" />
              {dict.footer.hours}
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-1 size-4 shrink-0" aria-hidden="true" />
              {BUSINESS.address[lang]}
            </li>
          </ul>
        </div>

        <nav aria-label={dict.footer.navTitle}>
          <h2 className="text-sm font-semibold text-surface/60">
            {dict.footer.navTitle}
          </h2>
          <ul className="mt-4 space-y-1 text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex min-h-10 items-center hover:text-surface"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={dict.footer.contactTitle}>
          <h2 className="text-sm font-semibold text-surface/60">
            {dict.footer.contactTitle}
          </h2>
          <ul className="mt-4 space-y-1 text-sm">
            <li>
              <a
                href={`/${lang}/privacy`}
                className="inline-flex min-h-10 items-center hover:text-surface"
              >
                {dict.legal.privacy}
              </a>
            </li>
            <li>
              <a
                href={`/${lang}/terms`}
                className="inline-flex min-h-10 items-center hover:text-surface"
              >
                {dict.legal.terms}
              </a>
            </li>
          </ul>
          {/* EN | العربية (PRD §9) */}
          <div className="mt-6">
            <LanguageSwitcher
              lang={lang}
              label={dict.a11y.switchLabel}
              ariaLabel={dict.a11y.switchAria}
            />
          </div>
        </nav>
      </Container>
      <div className="border-t border-white/10 py-4 text-center text-xs text-surface/60">
        <span lang="ar" dir="rtl">
          {BUSINESS.name} — {BUSINESS.city.ar}
        </span>
      </div>
    </footer>
  );
}
