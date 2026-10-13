import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLang } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPageContent } from "@/lib/content/repo";
import { parseRichText } from "@/lib/content/richtext";
import { BUSINESS } from "@/lib/business";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/layout/Container";

type Props = { params: Promise<{ lang: string; legal: "privacy" | "terms" }> };

function meta(lang: "ar" | "en", legal: "privacy" | "terms") {
  return legal === "privacy"
    ? {
        title: { ar: "سياسة الخصوصية", en: "Privacy Policy" },
        description: {
          ar: "سياسة خصوصية موقع للتبريد والتكييف — لا نخزّن بيانات الحجز ولا نستخدم ملفات تتبع.",
          en: "Privacy policy of the للتبريد والتكييف website — no booking storage, no tracking cookies.",
        },
      }
    : {
        title: { ar: "الشروط والأحكام", en: "Terms & Conditions" },
        description: {
          ar: "شروط استخدام موقع للتبريد والتكييف.",
          en: "Terms of use of the للتبريد والتكييف website.",
        },
      };
}

export async function generateStaticParams() {
  return (["ar", "en"] as const).flatMap((lang) =>
    (["privacy", "terms"] as const).map((legal) => ({ lang, legal }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, legal } = await params;
  if (!isLang(lang)) return {};
  const m = meta(lang, legal);
  return pageMetadata(lang, {
    title: `${m.title[lang]} | ${BUSINESS.name}`,
    description: m.description[lang],
    path: legal,
  });
}

/** Legal pages (PRD §7.12/§14.7): single-column, readable, seeded content. */
export default async function LegalPage({ params }: Props) {
  const { lang, legal } = await params;
  if (!isLang(lang)) notFound();
  const dict = await getDictionary(lang);
  const page = await getPageContent(legal);
  if (!page) notFound();

  const blocks = parseRichText(page.content[lang]);

  return (
    <Container className="py-14 md:py-20">
      <article className="mx-auto max-w-3xl">
        <h1>{page.title[lang]}</h1>
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink-2">
          {blocks.map((b, i) => (
            <p key={i}>{b.text}</p>
          ))}
        </div>
        <p className="mt-10 border-t border-line pt-6 text-sm text-muted">
          {BUSINESS.name} — {dict.footer.hours}
        </p>
      </article>
    </Container>
  );
}
