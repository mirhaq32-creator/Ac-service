import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarCheck, Phone, Star } from "lucide-react";

import { isLang } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getSiteContent } from "@/lib/content/repo";
import { BUSINESS, whatsappLink } from "@/lib/business";
import { pageMetadata } from "@/lib/seo";
import { HERO_IMAGE, APPROVED_IMAGES } from "@/lib/content/images";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons/WhatsAppIcon";
import { Container } from "@/components/layout/Container";
import { QuickServices } from "@/components/home/QuickServices";
import { ServiceFinder } from "@/components/home/ServiceFinder";
import { EmergencyBand } from "@/components/home/EmergencyBand";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Gallery } from "@/components/home/Gallery";
import { AboutSection } from "@/components/home/AboutSection";
import { AreasSection } from "@/components/home/AreasSection";
import { FinalCta } from "@/components/home/FinalCta";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { SectionHeading } from "@/components/home/SectionHeading";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata(lang, {
    title: dict.meta.title,
    description: dict.meta.description,
  });
}

/**
 * Home (PRD §7.2): hero + full section stack. Reviews (H10) render only
 * when ≥1 real review is published; Blogs (H9) render only when posts
 * exist — nothing is invented (D5, golden rule 1).
 */
export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const dict = await getDictionary(lang);
  const content = await getSiteContent();
  const hero = dict.hero;

  const finderItems = content.subServices.map((s) => {
    const cat = content.categories.find((c) => c.slug === s.categorySlug);
    return {
      categorySlug: s.categorySlug,
      category: cat?.name[lang] ?? "",
      slug: s.slug,
      name: s.name[lang],
    };
  });

  return (
    <>
      {/* H1 — Hero */}
      <Container className="py-16 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <p className="inline-flex items-center rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink-2">
              {hero.pill}
            </p>
            <h1 className="mt-6 text-balance">
              {hero.h1.pre}
              <span className="text-accent">{hero.h1.accent}</span>
              {hero.h1.post}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink-2">{hero.sub}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button variant="call" size="lg" href={BUSINESS.phoneHref}>
                <Phone className="size-5 shrink-0" />
                {dict.cta.callNow}
              </Button>
              <Button
                variant="whatsapp"
                size="lg"
                href={whatsappLink(content.settings.defaultWhatsappMessage[lang])}
              >
                <WhatsAppIcon className="size-5 shrink-0 text-wa" />
                {dict.cta.whatsapp}
              </Button>
              <Button variant="book" size="lg" href={`/${lang}/book`}>
                <CalendarCheck className="size-5 shrink-0" />
                {dict.cta.bookService}
              </Button>
            </div>

            <p className="mt-8 text-sm text-muted">{dict.trust.join(" · ")}</p>
          </div>

          <div className="lg:col-span-6">
            {/* Hero work photo (slot `hero-main`, PRD §15): real business
                work photo, priority-loaded, no layout shift. */}
            <div className="relative mx-auto aspect-[4/5] w-full max-w-lg">
              <div
                className="absolute -top-3 -end-3 h-full w-full rounded-hero bg-accent-tint"
                aria-hidden="true"
              />
              <Image
                src={HERO_IMAGE.src}
                alt={HERO_IMAGE.alt[lang]}
                width={HERO_IMAGE.width}
                height={HERO_IMAGE.height}
                priority
                sizes="(max-width: 1024px) 100vw, 512px"
                className="relative h-full w-full rounded-hero border border-line object-cover shadow-s3"
              />
            </div>
          </div>
        </div>
      </Container>

      {/* H4 — Quick Service Cards (photo tops where approved photos exist) */}
      <Container className="pb-16 md:pb-24">
        <QuickServices
          lang={lang}
          dict={dict}
          images={{
            ac: APPROVED_IMAGES.acOutdoor,
            refrigerator: APPROVED_IMAGES.refrigerator,
          }}
        />
      </Container>

      {/* H2 — Smart Service Finder */}
      <div className="border-y border-line bg-surface py-16 md:py-24">
        <Container>
          <ServiceFinder lang={lang} dict={dict} items={finderItems} />
        </Container>
      </div>

      {/* Emergency band (calm, D14/D15) */}
      <Container className="py-16 md:py-24">
        <EmergencyBand lang={lang} dict={dict} />
      </Container>

      {/* H5 — Why Choose Us (charcoal band) */}
      <div className="bg-ink py-16 md:py-24">
        <Container>
          <WhyChooseUs dict={dict} />
        </Container>
      </div>

      {/* H6 — How It Works */}
      <Container className="py-16 md:py-24">
        <HowItWorks dict={dict} />
      </Container>

      {/* H7 — Work / Shop Photos bento (real approved work photos) */}
      <div className="border-y border-line bg-surface py-16 md:py-24">
        <Container>
          <Gallery dict={dict} photos={content.photos} lang={lang} />
        </Container>
      </div>

      {/* About */}
      <Container className="py-16 md:py-24">
        <AboutSection dict={dict} lang={lang} />
      </Container>

      {/* H8 — Service Areas + Map */}
      <div className="border-t border-line bg-surface py-16 md:py-24">
        <Container>
          <AreasSection lang={lang} dict={dict} areas={content.areas} />
        </Container>
      </div>

      {/* H9 — Blogs (hidden with zero published posts, §7.2 H9) */}
      {content.blogs.length > 0 ? (
        <Container className="py-16 md:py-24">
          <SectionHeading title={dict.pages.blog.title} />
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {content.blogs.slice(0, 3).map((post) => (
              <Link
                key={post.slug}
                href={`/${lang}/blog/${post.slug}`}
                className="rounded-2xl border border-line bg-bg p-5 shadow-s1 transition hover:-translate-y-1 hover:shadow-s2"
              >
                <h3 className="font-heading text-lg font-bold text-ink">
                  {post.title[lang]}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted">
                  {post.excerpt[lang]}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      ) : null}

      {/* H10 — Reviews: ONLY with ≥1 published real review (D5) */}
      {content.reviews.length > 0 ? (
        <div className="border-t border-line bg-surface py-16 md:py-24">
          <Container>
            <SectionHeading title={lang === "ar" ? "آراء العملاء" : "Reviews"} />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {content.reviews.slice(0, 6).map((r) => (
                <figure key={r.id} className="rounded-2xl border border-line bg-bg p-6 shadow-s1">
                  <div className="flex gap-0.5" aria-label={`${r.rating}/5`}>
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="size-4 fill-warn text-warn" aria-hidden="true" />
                    ))}
                  </div>
                  <blockquote className="mt-3 text-ink-2">{r.text[lang]}</blockquote>
                  <figcaption className="mt-3 text-sm font-semibold text-ink">
                    {r.customerName}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Container>
        </div>
      ) : null}

      {/* H11 — FAQ */}
      {content.faqs.filter((f) => !f.categorySlug).length > 0 ? (
        <Container className="py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading title={lang === "ar" ? "الأسئلة الشائعة" : "FAQ"} />
            </div>
            <div className="lg:col-span-8">
              <FaqAccordion
                items={content.faqs
                  .filter((f) => !f.categorySlug)
                  .map((f) => ({ question: f.question[lang], answer: f.answer[lang] }))}
              />
            </div>
          </div>
        </Container>
      ) : null}

      {/* H12 — Final CTA band */}
      <Container className="pb-16 md:pb-24">
        <FinalCta lang={lang} dict={dict} />
      </Container>
    </>
  );
}
