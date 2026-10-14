import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarCheck, House, MapPin, Siren } from "lucide-react";

import { isLang } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPageContent } from "@/lib/content/repo";
import { parseRichText } from "@/lib/content/richtext";
import { BUSINESS } from "@/lib/business";
import { pageMetadata } from "@/lib/seo";
import { APPROVED_IMAGES } from "@/lib/content/images";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

type Props = { params: Promise<{ lang: string }> };

export async function generateStaticParams() {
  return [{ lang: "ar" }, { lang: "en" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const page = await getPageContent("about");
  return pageMetadata(lang, {
    title: `${dictTitle(lang, page)} | ${BUSINESS.name}`,
    description:
      lang === "ar"
        ? "للتبريد والتكييف — خدمة منزلية في الرياض منذ 2013 بخبرة تتجاوز 16 عامًا: مكيفات وثلاجات وغسالات."
        : "للتبريد والتكييف — Riyadh home service since 2013 with 16+ years of experience: AC, refrigerators and washing machines.",
    path: "about",
  });
}

function dictTitle(lang: "ar" | "en", page?: { title: { ar: string; en: string } }) {
  return page?.title[lang] ?? (lang === "ar" ? "من نحن" : "About Us");
}

/** About page (PRD §7.9): story + facts only, no team/certs/awards. */
export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const page = await getPageContent("about");
  const dict = await getDictionary(lang);
  const blocks = page
    ? parseRichText(page.content[lang]).map((b) => b.text)
    : [];

  const facts = [
    { icon: CalendarCheck, label: lang === "ar" ? "منذ 2013" : "Since 2013" },
    { icon: Siren, label: lang === "ar" ? "خبرة تفوق 16 عامًا" : "16+ years experience" },
    { icon: MapPin, label: lang === "ar" ? "جميع أحياء الرياض" : "All Riyadh areas" },
    { icon: House, label: lang === "ar" ? "خدمة منزلية + طوارئ" : "Home + emergency service" },
  ];

  return (
    <Container className="py-14 md:py-20">
      <div className="grid items-start gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h1>{dictTitle(lang, page)}</h1>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-2">
            {blocks.map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {facts.map((f) => (
              <li
                key={f.label}
                className="flex min-h-12 items-center gap-3 rounded-xl border border-line bg-surface px-4"
              >
                <f.icon className="size-5 shrink-0 text-accent" aria-hidden="true" />
                <span className="font-medium text-ink">{f.label}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="call" size="lg" href={BUSINESS.phoneHref}>
              {dict.cta.callNow}
            </Button>
            <Button variant="book" size="lg" href={`/${lang}/book`}>
              {dict.cta.bookService}
            </Button>
          </div>
        </div>
        <Reveal className="lg:col-span-5">
          {/* Layered frames (R7 style): two real work photos */}
          <div className="relative mx-auto max-w-sm">
            <div className="absolute -bottom-5 -end-4 hidden aspect-[4/3] w-2/3 overflow-hidden rounded-2xl border border-line shadow-s2 sm:block">
              <Image
                src={APPROVED_IMAGES.acTeam.src}
                alt={APPROVED_IMAGES.acTeam.alt[lang]}
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 60vw, 280px"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line shadow-s3">
              <Image
                src={APPROVED_IMAGES.acOutdoor.src}
                alt={APPROVED_IMAGES.acOutdoor.alt[lang]}
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </Container>
  );
}
