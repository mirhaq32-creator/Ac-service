import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronLeft } from "lucide-react";

import { isLang } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  getCategory,
  getFaqsFor,
  getSiteContent,
  getSubService,
  getSubServicesOf,
} from "@/lib/content/repo";
import { BUSINESS, whatsappLink } from "@/lib/business";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { ServiceCtaCard } from "@/components/services/ServiceCtaCard";
import { HowItWorks } from "@/components/home/HowItWorks";
import { JsonLd } from "@/components/seo/JsonLd";

type Props = {
  params: Promise<{ lang: string; category: string; slug: string }>;
};

export async function generateStaticParams() {
  const { categories, subServices } = await getSiteContent();
  return categories.flatMap((c) =>
    subServices
      .filter((s) => s.categorySlug === c.slug)
      .flatMap((s) =>
        (["ar", "en"] as const).map((lang) => ({
          lang,
          category: c.slug,
          slug: s.slug,
        }))
      )
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, category, slug } = await params;
  if (!isLang(lang)) return {};
  const [cat, sub] = await Promise.all([
    getCategory(category),
    getSubService(slug, category),
  ]);
  if (!cat || !sub) return {};
  return pageMetadata(lang, {
    title: `${sub.name[lang]} — ${cat.name[lang]} | للتبريد والتكييف`,
    description: sub.shortDescription[lang],
    path: `services/${category}/${slug}`,
  });
}

/** Service / problem detail template (PRD §7.5). */
export default async function ServiceDetailPage({ params }: Props) {
  const { lang, category, slug } = await params;
  if (!isLang(lang)) notFound();
  const [cat, sub] = await Promise.all([
    getCategory(category),
    getSubService(slug, category),
  ]);
  if (!cat || !sub) notFound();

  const dict = await getDictionary(lang);
  const [related, faqs] = await Promise.all([
    getSubServicesOf(category),
    getFaqsFor(category),
  ]);
  const others = related.filter((s) => s.slug !== slug).slice(0, 3);

  const wa = whatsappLink(
    `${lang === "ar" ? "السلام عليكم، أحتاج خدمة:" : "Hello, I need:"} ${sub.name[lang]}`
  );

  const steps = cat.slug === "emergency" ? undefined : dict.home.howItWorks;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: `${sub.name[lang]} — ${cat.name[lang]}`,
          description: sub.shortDescription[lang],
          provider: { "@type": "HVACBusiness", name: BUSINESS.name },
          areaServed: { "@type": "City", name: "Riyadh" },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: dict.nav.services, item: `/${lang}/services` },
            { "@type": "ListItem", position: 2, name: cat.name[lang], item: `/${lang}/services/${cat.slug}` },
            { "@type": "ListItem", position: 3, name: sub.name[lang] },
          ],
        }}
      />

      {/* Hero */}
      <div className="border-b border-line bg-surface">
        <Container className="py-12 md:py-16">
          <nav aria-label="breadcrumb" className="mb-6 text-sm text-muted">
            <Link href={`/${lang}/services`} className="hover:text-accent">
              {dict.nav.services}
            </Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <Link href={`/${lang}/services/${category}`} className="hover:text-accent">
              {cat.name[lang]}
            </Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-ink">{sub.name[lang]}</span>
          </nav>
          <div className="grid items-start gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="inline-flex items-center rounded-full border border-line bg-bg px-4 py-1.5 text-sm font-medium text-ink-2">
                {cat.name[lang]}
              </p>
              <h1 className="mt-4 text-balance text-ink">{sub.name[lang]}</h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-2">
                {sub.shortDescription[lang]}
              </p>
            </div>
            <div className="lg:col-span-4">
              <ServiceCtaCard
                dict={dict}
                whatsappUrl={wa}
                bookUrl={`/${lang}/book?service=${category}&sub=${slug}`}
              />
            </div>
          </div>
        </Container>
      </div>

      {/* Problems covered */}
      <Container className="py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeading title={dict.pages.detail.problemsTitle} />
            <ul className="mt-8 space-y-3">
              {cat.problemsCovered.map((p) => (
                <li key={p.en} className="flex items-start gap-3">
                  <Check className="mt-1 size-5 shrink-0 text-success" aria-hidden="true" />
                  <span className="font-medium text-ink">{p[lang]}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5">
            <SectionHeading title={dict.pages.detail.checksTitle} />
            <ol className="mt-8 space-y-3">
              {cat.technicianChecks.map((c, i) => (
                <li key={c.en} className="flex items-start gap-3">
                  <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-tint font-heading text-sm font-bold text-accent">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 font-medium text-ink">{c[lang]}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>

      {/* Process */}
      {steps ? (
        <div className="border-y border-line bg-surface py-14 md:py-20">
          <Container>
            <HowItWorks dict={dict} />
          </Container>
        </div>
      ) : null}

      {/* Related problems */}
      {others.length > 0 ? (
        <Container className="py-14 md:py-20">
          <SectionHeading title={dict.pages.detail.relatedTitle} />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {others.map((s, i) => (
              <Reveal key={s.slug} delay={Math.min(i * 0.06, 0.2)}>
                <Link
                  href={`/${lang}/services/${category}/${s.slug}`}
                  className="group flex h-full min-h-12 flex-col rounded-2xl border border-line bg-bg p-5 transition duration-200 hover:-translate-y-1 hover:shadow-s2"
                >
                  <span className="font-heading text-lg font-bold text-ink">
                    {s.name[lang]}
                  </span>
                  <span className="mt-1 line-clamp-2 text-sm text-muted">
                    {s.shortDescription[lang]}
                  </span>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                    {dict.pages.blog.readMore}
                    <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      ) : null}

      {/* FAQ */}
      {faqs.length > 0 ? (
        <div className="border-t border-line bg-surface py-14 md:py-20">
          <Container className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading title={dict.pages.detail.faqTitle} />
            </div>
            <div className="lg:col-span-8">
              <FaqAccordion
                items={faqs.map((f) => ({
                  question: f.question[lang],
                  answer: f.answer[lang],
                }))}
              />
            </div>
          </Container>
        </div>
      ) : null}
    </>
  );
}
