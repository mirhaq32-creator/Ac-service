import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Image as ImageIcon, Snowflake } from "lucide-react";

import { isLang, type Lang } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getSiteContent } from "@/lib/content/repo";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/home/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

type Props = { params: Promise<{ lang: string }> };

type Filter = "all" | "ac" | "refrigerator" | "washing-machine" | "shop";

export async function generateStaticParams() {
  return [{ lang: "ar" }, { lang: "en" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMetadata(lang, {
    title: `${dict.pages.work.title} | للتبريد والتكييف`,
    description: dict.pages.work.subtitle,
    path: "work",
  });
}

/**
 * Work / Shop Photos (PRD §7.6): responsive gallery over published photos
 * from the CMS. With zero published photos the page shows its honest empty
 * state and stays out of the way (header hides the link automatically).
 */
export default async function WorkPage({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const dict = await getDictionary(lang);
  const { photos } = await getSiteContent();

  return (
    <Container className="py-14 md:py-20">
      <SectionHeading
        title={dict.pages.work.title}
        subtitle={dict.pages.work.subtitle}
      />

      {photos.length === 0 ? (
        <div className="mt-12 grid auto-rows-[140px] grid-cols-2 gap-4 sm:auto-rows-[160px] md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line bg-surface text-muted ${
                i === 0 ? "col-span-2 row-span-2" : i === 5 ? "max-md:col-span-2" : ""
              }`}
              role="img"
              aria-label={dict.home.gallery.placeholderNote}
            >
              {i % 2 === 0 ? (
                <Snowflake className="size-8 text-muted/50" strokeWidth={1.25} />
              ) : (
                <ImageIcon className="size-8 text-muted/50" strokeWidth={1.25} />
              )}
              <span className="text-xs">[CMS] work-0{i + 1}</span>
            </div>
          ))}
          <p className="col-span-full pt-4 text-center text-muted">
            {dict.pages.work.empty}
          </p>
        </div>
      ) : (
        <GalleryGrid lang={lang} dict={dict} photos={photos} />
      )}
    </Container>
  );
}

function GalleryGrid({
  lang,
  dict,
  photos,
}: {
  lang: Lang;
  dict: Awaited<ReturnType<typeof getDictionary>>;
  photos: Array<{ id: string; url: string; tag: string; caption: { ar: string; en: string } }>;
}) {
  return (
    <div className="mt-10 columns-2 gap-4 md:columns-3 [&>*]:mb-4">
      {photos.map((p, i) => (
        <Reveal key={p.id} delay={Math.min(i * 0.04, 0.24)}>
          <figure className="break-inside-avoid overflow-hidden rounded-2xl border border-line bg-bg shadow-s1">
            {/* Owner-approved work photo; alt from its bilingual caption (§4.6) */}
            <Image
              src={p.url}
              alt={p.caption[lang] || dict.pages.work.title}
              width={800}
              height={i % 3 === 0 ? 1000 : 600}
              loading={i < 2 ? "eager" : "lazy"}
              sizes="(max-width: 768px) 50vw, 30vw"
              className="h-auto w-full"
            />
            <figcaption className="flex items-center justify-between gap-2 px-4 py-3 text-sm">
              <span className="text-ink-2">{p.caption[lang]}</span>
              <span className="shrink-0 rounded-full bg-surface-2 px-2.5 py-0.5 text-xs text-muted">
                {dict.pages.work.filters[p.tag as Filter] ?? p.tag}
              </span>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}
