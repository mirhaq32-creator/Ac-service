import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Navigation } from "lucide-react";

import { isLang } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getSiteContent } from "@/lib/content/repo";
import { BUSINESS } from "@/lib/business";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";

type Props = { params: Promise<{ lang: string }> };

export async function generateStaticParams() {
  return [{ lang: "ar" }, { lang: "en" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata(lang, {
    title: `${dict.pages.areas.title} | للتبريد والتكييف`,
    description: dict.pages.areas.subtitle,
    path: "areas",
  });
}

/** Service Areas (PRD §7.8): all-Riyadh coverage + CMS area cards. */
export default async function AreasPage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const dict = await getDictionary(lang);
  const { areas } = await getSiteContent();

  return (
    <Container className="py-14 md:py-20">
      <SectionHeading title={dict.pages.areas.title} subtitle={dict.pages.areas.subtitle} />

      {areas.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-line bg-surface p-6 text-muted">
          {dict.pages.areas.empty}
        </p>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area, i) => (
            <Reveal key={area.id} delay={Math.min(i * 0.04, 0.2)}>
              <div className="flex h-full flex-col rounded-2xl border border-line bg-bg p-5 shadow-s1">
                <h2 className="font-heading text-lg font-bold text-ink">
                  {area.name[lang]}
                </h2>
                {area.info ? (
                  <p className="mt-1 flex-1 text-sm text-muted">{area.info[lang]}</p>
                ) : (
                  <div className="flex-1" />
                )}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${area.name.en} Riyadh`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent"
                >
                  <Navigation className="size-4" aria-hidden="true" />
                  {dict.home.areas.getDirections}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {/* Shop address + map */}
      <div className="mt-14 grid items-center gap-10 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-bg p-6 shadow-s1">
          <span className="inline-flex min-h-12 items-center gap-2 rounded-full bg-accent-tint px-5 font-semibold text-accent">
            <MapPin className="size-5" aria-hidden="true" />
            {dict.home.areas.allRiyadh}
          </span>
          <h2 className="mt-5 text-sm font-semibold text-muted">
            {dict.home.areas.addressLabel}
          </h2>
          <p className="mt-2 leading-relaxed text-ink">{BUSINESS.address[lang]}</p>
          <div className="mt-4">
            <Button variant="book" href={BUSINESS.mapsLink}>
              <Navigation className="size-4 shrink-0" />
              {dict.home.areas.getDirections}
            </Button>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-line shadow-s2">
          <iframe
            title={dict.home.areas.mapTitle}
            src="https://www.google.com/maps?q=RQFP%2BH7C%20Al%20Munsiyah%20Riyadh&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-72 w-full md:h-96"
          />
        </div>
      </div>
    </Container>
  );
}
