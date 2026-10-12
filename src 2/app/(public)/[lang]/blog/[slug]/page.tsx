import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { isLang, type Lang } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getSiteContent } from "@/lib/content/repo";
import { parseRichText } from "@/lib/content/richtext";
import { BUSINESS, whatsappLink } from "@/lib/business";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteUrl } from "@/lib/seo";

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateStaticParams() {
  const { blogs } = await getSiteContent();
  return blogs.flatMap((b) =>
    (["ar", "en"] as const).map((lang) => ({ lang, slug: b.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLang(lang)) return {};
  const { blogs } = await getSiteContent();
  const post = blogs.find((b) => b.slug === slug);
  if (!post) return {};
  return pageMetadata(lang, {
    title: `${post.seo?.title[lang] ?? post.title[lang]} | ${BUSINESS.name}`,
    description: post.seo?.description[lang] ?? post.excerpt[lang],
    path: `blog/${slug}`,
  });
}

/** Blog detail (PRD §7.7): bilingual article with prev/next + CTA trio. */
export default async function BlogPostPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLang(lang)) notFound();
  const dict = await getDictionary(lang);
  const { blogs } = await getSiteContent();
  const index = blogs.findIndex((b) => b.slug === slug);
  if (index === -1) notFound();
  const post = blogs[index];
  const prev = blogs[index + 1];
  const next = blogs[index - 1];

  // Language fallback notice (PRD §9): if this language is missing, show the other.
  const hasAr = post.content.ar.trim().length > 0;
  const hasEn = post.content.en.trim().length > 0;
  const contentLang: Lang = hasAr && hasEn ? lang : hasAr ? "ar" : "en";
  const showFallbackNotice = contentLang !== lang;
  const dir = contentLang === "ar" ? "rtl" : "ltr";

  const blocks = parseRichText(post.content[contentLang]);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title[contentLang],
          datePublished: post.publishedAt,
          author: { "@type": "Organization", name: BUSINESS.name },
          url: `${getSiteUrl()}/${lang}/blog/${post.slug}`,
        }}
      />
      <Container className="py-12 md:py-16">
        <nav aria-label="breadcrumb" className="mb-6 text-sm text-muted">
          <Link href={`/${lang}/blog`} className="hover:text-accent">
            {dict.pages.blog.title}
          </Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-ink">{post.title[contentLang]}</span>
        </nav>

        <article className="mx-auto max-w-3xl" dir={dir} lang={contentLang}>
          <h1 className="text-balance text-ink">{post.title[contentLang]}</h1>
          {showFallbackNotice ? (
            <p className="mt-4 rounded-xl bg-surface px-4 py-3 text-sm text-muted">
              {dict.pages.blog.fallbackNotice}
            </p>
          ) : null}
          {post.mainImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.mainImageUrl}
              alt={post.title[contentLang]}
              width={1200}
              height={630}
              className="mt-8 w-full rounded-2xl object-cover shadow-s2"
            />
          ) : null}
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink-2">
            {blocks.map((b, i) =>
              b.type === "h" ? (
                <h2 key={i} className="font-heading text-2xl font-bold text-ink">
                  {b.text}
                </h2>
              ) : b.type === "li" ? (
                <li key={i} className="ms-5 list-disc">
                  {b.text}
                </li>
              ) : (
                <p key={i}>{b.text}</p>
              )
            )}
          </div>
        </article>

        {/* Prev / next */}
        <nav
          className="mx-auto mt-12 flex max-w-3xl items-center justify-between gap-4 border-t border-line pt-6 text-sm"
          aria-label={lang === "ar" ? "تنقل المقالات" : "Post navigation"}
        >
          {prev ? (
            <Link href={`/${lang}/blog/${prev.slug}`} className="inline-flex min-h-12 items-center gap-1 font-semibold text-accent">
              <ChevronLeft className="size-4 rotate-180 rtl:rotate-0" aria-hidden="true" />
              {dict.pages.blog.prev}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/${lang}/blog/${next.slug}`} className="inline-flex min-h-12 items-center gap-1 font-semibold text-accent">
              {dict.pages.blog.next}
              <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          ) : null}
        </nav>

        {/* CTA trio */}
        <Reveal className="mx-auto mt-12 max-w-3xl">
          <div className="flex flex-col items-center gap-3 rounded-hero bg-surface p-8 sm:flex-row sm:justify-center">
            <Button variant="call" size="lg" href={BUSINESS.phoneHref}>
              {dict.cta.callNow}
            </Button>
            <Button
              variant="whatsapp"
              size="lg"
              href={whatsappLink(
                `${lang === "ar" ? "السلام عليكم، قرأت مقال:" : "Hello, I read the article:"} ${post.title[lang]}`
              )}
            >
              {dict.cta.whatsapp}
            </Button>
            <Button variant="book" size="lg" href={`/${lang}/book`}>
              {dict.cta.bookService}
            </Button>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
