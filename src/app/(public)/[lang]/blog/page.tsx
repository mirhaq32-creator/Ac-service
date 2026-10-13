import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { isLang, type Lang } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getSiteContent } from "@/lib/content/repo";
import { BUSINESS } from "@/lib/business";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

type Props = { params: Promise<{ lang: string }> };

function formatDate(iso: string, lang: Lang) {
  try {
    return new Intl.DateTimeFormat(lang === "ar" ? "ar-SA-u-ca-gregory-nu-latn" : "en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

export async function generateStaticParams() {
  return [{ lang: "ar" }, { lang: "en" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata(lang, {
    title: `${dict.pages.blog.title} | ${BUSINESS.name}`,
    description: dict.pages.blog.subtitle,
    path: "blog",
  });
}

/** Blog list (PRD §7.7): no categories; empty state until posts publish. */
export default async function BlogPage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const dict = await getDictionary(lang);
  const { blogs } = await getSiteContent();

  return (
    <Container className="py-14 md:py-20">
      <SectionHeading title={dict.pages.blog.title} subtitle={dict.pages.blog.subtitle} />
      {blogs.length === 0 ? (
        <p className="mt-12 rounded-2xl border border-dashed border-line bg-surface p-8 text-center text-muted">
          {dict.pages.blog.empty}
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((post, i) => (
            <Reveal key={post.slug} delay={Math.min(i * 0.06, 0.24)}>
              <Link
                href={`/${lang}/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-bg shadow-s1 transition duration-200 hover:-translate-y-1 hover:shadow-s2"
              >
                {post.mainImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.mainImageUrl}
                    alt={post.title[lang]}
                    loading="lazy"
                    width={640}
                    height={360}
                    className="aspect-video w-full object-cover"
                  />
                ) : (
                  <div className="aspect-video w-full bg-surface-2" aria-hidden="true" />
                )}
                <div className="flex flex-1 flex-col p-5">
                  <time className="text-xs text-muted">{formatDate(post.publishedAt, lang)}</time>
                  <h2 className="mt-2 font-heading text-lg font-bold text-ink">
                    {post.title[lang]}
                  </h2>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
                    {post.excerpt[lang]}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                    {dict.pages.blog.readMore}
                    <ChevronLeft className="size-4 transition group-hover:-translate-x-0.5 rtl:rotate-180 rtl:group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </Container>
  );
}
