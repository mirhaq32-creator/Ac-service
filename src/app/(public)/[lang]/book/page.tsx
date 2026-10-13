import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { isLang, type Lang } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getSiteContent } from "@/lib/content/repo";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { BookingFlow } from "@/components/booking/BookingFlow";

type Props = { params: Promise<{ lang: string }> };

const titles: Record<Lang, string> = {
  en: "Book a Service in Riyadh | للتبريد والتكييف",
  ar: "احجز الخدمة في الرياض | للتبريد والتكييف",
};

const descriptions: Record<Lang, string> = {
  en: "Book a home service across Riyadh — AC, refrigerator or washing machine. The form sends your details straight to WhatsApp. Call or WhatsApp us now.",
  ar: "احجز خدمة منزلية في جميع أحياء الرياض — مكيفات وثلاجات وغسالات. يرسل النموذج بياناتك مباشرة عبر واتساب. اتصل أو راسلنا الآن.",
};

export async function generateStaticParams() {
  return [{ lang: "ar" }, { lang: "en" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return pageMetadata(lang, {
    title: titles[lang],
    description: descriptions[lang],
    path: "book",
  });
}

/**
 * Booking page (PRD §8): client flow → wa.me, nothing stored (D1).
 * Force-dynamic: reads searchParams prefill at request time.
 */
export const dynamic = "force-dynamic";

export default async function BookPage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const dict = await getDictionary(lang);
  const { categories, subServices } = await getSiteContent();

  return (
    <Container className="py-12 md:py-20">
      <h1 className="text-center">{dict.book.title}</h1>
      <p className="mx-auto mt-3 max-w-md text-center text-muted">
        {lang === "ar"
          ? "تُرسل بياناتك مباشرة إلى واتساب — لا يُخزَّن أي شيء في الموقع."
          : "Your details go straight to WhatsApp — nothing is stored on the site."}
      </p>
      <div className="mt-10">
        <Suspense fallback={<div className="min-h-96 animate-pulse rounded-2xl bg-surface" />}>
          <BookingFlow
            lang={lang}
            dict={dict}
            categories={categories.map((c) => ({ slug: c.slug, name: c.name[lang] }))}
            subs={subServices.map((s) => ({
              categorySlug: s.categorySlug,
              slug: s.slug,
              name: s.name[lang],
            }))}
          />
        </Suspense>
      </div>
    </Container>
  );
}
