import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Wrench } from "lucide-react";

import { isLang } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  getCategory,
  getFaqsFor,
  getSiteContent,
  getSubServicesOf,
} from "@/lib/content/repo";
import { APPROVED_IMAGES, type ApprovedImageKey } from "@/lib/content/images";
import { whatsappLink } from "@/lib/business";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { ServiceCtaCard } from "@/components/services/ServiceCtaCard";
import { HowItWorks } from "@/components/home/HowItWorks";
import { JsonLd } from "@/components/seo/JsonLd";

type Props = { params: Promise<{ lang: string; category: string }> };

export async function generateStaticParams() {
  const { categories } = await getSiteContent();
  return categories.flatMap((c) =>
    (["ar", "en"] as const).map((lang) => ({ lang, category: c.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, category } = await params;
  if (!isLang(lang)) return {};
  const cat = await getCategory(category);
  if (!cat) return {};
  return pageMetadata(lang, {
    title: `${cat.seo.title[lang]} | للتبريد والتكييف`,
    description: cat.seo.description[lang],
    path: `services/${category}`,
  });
}

/** Category hero photo per slug (only where a suitable approved photo exists). */
const CATEGORY_IMAGES: Partial<Record<string, ApprovedImageKey>> = {
  ac: "acTeam",
  refrigerator: "refrigerator",
  emergency: "acOutdoor",
};

/** Category page (PRD §7.4): AC · Refrigerator · Washing Machine · Emergency. */
export default async function CategoryPage({ params }: Props) {
  const { lang, category } = await params;
  if (!isLang(lang)) notFound();
  const cat = await getCategory(category);
  if (!cat) notFound();

  const dict = await getDictionary(lang);
  const [subs, faqs] = await Promise.all([
    getSubServicesOf(category),
    getFaqsFor(category),
  ]);

  const emergency = category === "emergency";
  const imageKey = CATEGORY_IMAGES[category];
  const categoryImage = imageKey ? APPROVED_IMAGES[imageKey] : null;
  const wa = whatsappLink(
    emergency
      ? `${dict.cta.whatsapp} — ${cat.name[lang]}`
      : `${lang === "ar" ? "السلام عليكم، أحتاج خدمة:" : "Hello, I need:"} ${cat.name[lang]}`
  );

  const faqItems = faqs.map((f) => ({
    question: f.question[lang],
    answer: f.answer[lang],
  }));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: cat.name[lang],
          description: cat.shortDescription[lang],
          provider: { "@type": "HVACBusiness", name: "للتبريد والتكييف" },
          areaServed: { "@type": "City", name: "Riyadh" },
        }}
      />
      {faqItems.length > 0 ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          }}
        />
      ) : null}

      {/* Hero */}
      <div
        className={
          emergency
            ? "bg-accent text-white"
            : "border-b border-line bg-surface"
        }
      >
        <Container className="py-14 md:py-20">
          <nav aria-label="breadcrumb" className="mb-6 text-sm opacity-80">
            <Link
              href={`/${lang}`}
              className={emergency ? "hover:text-white" : "hover:text-accent"}
            >
              {lang === "ar" ? "الرئيسية" : "Home"}
            </Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <Link
              href={`/${lang}/services`}
              className={emergency ? "hover:text-white" : "hover:text-accent"}
            >
              {dict.nav.services}
            </Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span>{cat.name[lang]}</span>
          </nav>
          <div className="grid items-start gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h1
                className={`text-balance ${
                  emergency ? "text-white" : "text-ink"
                }`}
              >
                {cat.name[lang]}
              </h1>
              <p
                className={`mt-4 max-w-2xl text-lg leading-relaxed ${
                  emergency ? "text-white/90" : "text-ink-2"
                }`}
              >
                {cat.longDescription[lang]}
              </p>
              {emergency ? (
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="tel:+966535757650"
                    className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 font-semibold text-accent shadow-s2 transition hover:bg-accent-tint active:scale-[0.97]"
                  >
                    {lang === "ar" ? "اتصال طوارئ" : "Emergency Call"}
                  </a>
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center gap-2 rounded-full border-[1.5px] border-white px-6 font-semibold text-white transition hover:bg-white/10 active:scale-[0.97]"
                  >
                    {lang === "ar" ? "واتساب طوارئ" : "Emergency WhatsApp"}
                  </a>
                </div>
              ) : null}
            </div>
            <div className="lg:col-span-4">
              {categoryImage ? (
                <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-hero border border-line shadow-s3">
                  <Image
                    src={categoryImage.src}
                    alt={categoryImage.alt[lang]}
                    width={categoryImage.width}
                    height={categoryImage.height}
                    priority
                    sizes="(max-width: 1024px) 100vw, 380px"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}
              <ServiceCtaCard
                dict={dict}
                whatsappUrl={wa}
                bookUrl={`/${lang}/book?service=${category}`}
              />
            </div>
          </div>
        </Container>
      </div>

      {/* Sub-services */}
      <Container className="py-14 md:py-20">
        <SectionHeading title={dict.pages.category.subServicesTitle} />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subs.map((sub, i) => (
            <Reveal key={sub.slug} delay={Math.min(i * 0.05, 0.25)}>
              <Link
                href={`/${lang}/services/${category}/${sub.slug}`}
                className="flex h-full min-h-12 flex-col rounded-2xl border border-line bg-bg p-5 transition duration-200 hover:-translate-y-1 hover:border-accent/40 hover:shadow-s2"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-surface-2 text-accent">
                  <Wrench className="size-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span className="mt-3 font-heading text-lg font-bold text-ink">
                  {sub.name[lang]}
                </span>
                <span className="mt-1 text-sm leading-relaxed text-muted">
                  {sub.shortDescription[lang]}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>

      {/* Problems covered */}
      <div className="border-y border-line bg-surface py-14 md:py-20">
        <Container>
          <SectionHeading title={dict.pages.category.problemsTitle} />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {cat.problemsCovered.map((p, i) => (
              <Reveal key={p.en} delay={Math.min(i * 0.04, 0.2)}>
                <li className="flex min-h-12 items-center gap-3 rounded-xl border border-line bg-bg px-4">
                  <Check className="size-5 shrink-0 text-success" aria-hidden="true" />
                  <span className="font-medium text-ink">{p[lang]}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </Container>
      </div>

      {/* Process */}
      <Container className="py-14 md:py-20">
        <HowItWorks dict={dict} />
      </Container>

      {/* FAQ */}
      {faqItems.length > 0 ? (
        <div className="border-t border-line bg-surface py-14 md:py-20">
          <Container className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading title={dict.pages.category.faqTitle} />
            </div>
            <div className="lg:col-span-8">
              <FaqAccordion items={faqItems} />
            </div>
          </Container>
        </div>
      ) : null}
    </>
  );
}
