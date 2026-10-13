import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AirVent, ChevronLeft, Refrigerator, Siren, WashingMachine, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { isLang } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getSiteContent } from "@/lib/content/repo";
import { BUSINESS } from "@/lib/business";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

const icons: Record<string, LucideIcon> = {
  ac: AirVent,
  refrigerator: Refrigerator,
  "washing-machine": WashingMachine,
  emergency: Siren,
};

type Props = { params: Promise<{ lang: string }> };

export async function generateStaticParams() {
  return [{ lang: "ar" }, { lang: "en" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata(lang, {
    title: `${dict.pages.services.title} | ${BUSINESS.name}`,
    description: dict.pages.services.subtitle,
    path: "services",
  });
}

/** Services overview (PRD §7.3). */
export default async function ServicesPage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const dict = await getDictionary(lang);
  const { categories, subServices } = await getSiteContent();

  return (
    <>
      <Container className="py-14 md:py-20">
        <nav aria-label="breadcrumb" className="mb-6 text-sm text-muted">
          <Link href={`/${lang}`} className="hover:text-accent">
            {lang === "ar" ? "الرئيسية" : "Home"}
          </Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-ink">{dict.pages.services.title}</span>
        </nav>
        <SectionHeading
          title={dict.pages.services.title}
          subtitle={dict.pages.services.subtitle}
        />

        <div className="mt-12 space-y-8">
          {categories.map((cat, idx) => {
            const Icon = icons[cat.slug] ?? Wrench;
            const subs = subServices.filter((s) => s.categorySlug === cat.slug);
            return (
              <Reveal key={cat.slug} delay={Math.min(idx * 0.06, 0.24)}>
                <div className="rounded-2xl border border-line bg-bg p-6 shadow-s1 md:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <span
                        className={`inline-flex size-14 shrink-0 items-center justify-center rounded-2xl ${
                          cat.slug === "emergency"
                            ? "bg-accent-tint text-accent"
                            : "bg-surface-2 text-ink"
                        }`}
                      >
                        <Icon className="size-7" strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      <div>
                        <h2 className="font-heading text-2xl font-bold text-ink">
                          {cat.name[lang]}
                        </h2>
                        <p className="mt-1 max-w-xl text-muted">
                          {cat.shortDescription[lang]}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/${lang}/services/${cat.slug}`}
                      className="inline-flex min-h-12 items-center gap-1.5 rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-ink-2"
                    >
                      {dict.pages.services.viewCategory}
                      <ChevronLeft
                        className="size-4 rtl:rotate-180"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                  <ul className="mt-6 divide-y divide-line border-t border-line">
                    {subs.map((sub) => (
                      <li key={sub.slug}>
                        <Link
                          href={`/${lang}/services/${cat.slug}/${sub.slug}`}
                          className="group flex min-h-12 items-center justify-between gap-3 py-1 font-medium text-ink-2 transition hover:text-accent"
                        >
                          <span>{sub.name[lang]}</span>
                          <ChevronLeft
                            className="size-4 text-muted transition group-hover:-translate-x-0.5 group-hover:text-accent rtl:rotate-180 rtl:group-hover:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </>
  );
}
