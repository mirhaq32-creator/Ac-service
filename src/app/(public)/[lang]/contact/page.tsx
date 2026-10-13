import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronLeft, Clock, MapPin, Navigation, Phone, Siren } from "lucide-react";

import { isLang } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getSiteContent } from "@/lib/content/repo";
import { BUSINESS } from "@/lib/business";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { CopyButton } from "@/components/contact/CopyButton";
import { WhatsAppIcon } from "@/components/ui/icons/WhatsAppIcon";

type Props = { params: Promise<{ lang: string }> };

export async function generateStaticParams() {
  return [{ lang: "ar" }, { lang: "en" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata(lang, {
    title: `${dict.pages.contact.title} | ${BUSINESS.name}`,
    description: dict.pages.contact.subtitle,
    path: "contact",
  });
}

/** Contact page (PRD §7.10): Call strongest, desktop copy button. */
export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const dict = await getDictionary(lang);
  const { categories } = await getSiteContent();

  return (
    <Container className="py-14 md:py-20">
      <h1>{dict.pages.contact.title}</h1>
      <p className="mt-3 text-lg text-muted">{dict.pages.contact.subtitle}</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {/* Call card — strongest */}
        <section className="rounded-hero bg-accent p-8 text-white shadow-glow">
          <h2 className="font-heading text-xl font-bold">{dict.pages.contact.callTitle}</h2>
          <a
            href={BUSINESS.phoneHref}
            dir="ltr"
            className="mt-4 block font-heading text-4xl font-bold tracking-wide transition hover:opacity-90 md:text-5xl"
          >
            {BUSINESS.phoneDisplay}
          </a>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={BUSINESS.phoneHref}
              className="inline-flex min-h-14 items-center gap-2 rounded-full bg-white px-8 font-semibold text-accent shadow-s2 transition hover:bg-accent-tint active:scale-[0.97]"
            >
              <Phone className="size-5" />
              {dict.cta.callNow}
            </a>
            <CopyButton
              value={BUSINESS.phoneDisplay}
              label={dict.pages.contact.copyNumber}
              copiedLabel={dict.pages.contact.copied}
            />
          </div>
        </section>

        {/* WhatsApp + emergency */}
        <div className="flex flex-col gap-6">
          <section className="rounded-2xl border border-line bg-bg p-8 shadow-s1">
            <h2 className="font-heading text-xl font-bold text-ink">
              {lang === "ar" ? "راسلنا واتساب" : "WhatsApp us"}
            </h2>
            <a
              href={BUSINESS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-14 items-center gap-2 rounded-full border-[1.5px] border-ink bg-bg px-8 font-semibold text-ink transition hover:bg-surface active:scale-[0.97]"
            >
              <WhatsAppIcon className="size-5 text-wa" />
              {dict.cta.whatsapp}
              <span dir="ltr" className="text-muted">
                {BUSINESS.phoneDisplay}
              </span>
            </a>
          </section>
          <section className="rounded-2xl border border-line bg-ink p-8 text-surface">
            <h2 className="flex items-center gap-2 font-heading text-xl font-bold">
              <Siren className="size-6 text-accent-bright" aria-hidden="true" />
              {dict.pages.contact.emergencyTitle}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-surface/80">
              {dict.pages.contact.emergencyText}
            </p>
            <a
              href={BUSINESS.phoneHref}
              className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-6 font-semibold text-white shadow-glow transition hover:bg-accent-hover"
            >
              <Phone className="size-4" />
              {dict.cta.callNow}
            </a>
          </section>
        </div>
      </div>

      {/* Info grid */}
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <section className="rounded-2xl border border-line bg-bg p-6 shadow-s1">
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-ink">
            <Clock className="size-5 text-accent" aria-hidden="true" />
            {dict.pages.contact.hoursTitle}
          </h2>
          <p className="mt-2 text-ink-2">{dict.pages.contact.hoursValue}</p>
        </section>
        <section className="rounded-2xl border border-line bg-bg p-6 shadow-s1">
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-ink">
            <MapPin className="size-5 text-accent" aria-hidden="true" />
            {dict.pages.contact.addressTitle}
          </h2>
          <p className="mt-2 leading-relaxed text-ink-2">{BUSINESS.address[lang]}</p>
          <a
            href={BUSINESS.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent"
          >
            <Navigation className="size-4" aria-hidden="true" />
            {dict.home.areas.getDirections}
          </a>
        </section>
        <section className="rounded-2xl border border-line bg-bg p-6 shadow-s1">
          <h2 className="font-heading text-lg font-bold text-ink">
            {dict.pages.contact.servicesTitle}
          </h2>
          <ul className="mt-2 space-y-1">
            {categories.map((c) => (
              <li key={c.slug} className="text-ink-2">
                {c.name[lang]}
              </li>
            ))}
          </ul>
          <a
            href={`/${lang}/book`}
            className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent"
          >
            {dict.cta.bookService}
            <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
          </a>
        </section>
      </div>

      {/* Map */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-line shadow-s2">
        <iframe
          title={dict.home.areas.mapTitle}
          src="https://www.google.com/maps?q=RQFP%2BH7C%20Al%20Munsiyah%20Riyadh&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-80 w-full"
        />
      </div>
    </Container>
  );
}
