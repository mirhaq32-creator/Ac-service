import Image from "next/image";
import { Image as ImageIcon, Snowflake } from "lucide-react";

import type { Lang } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { WorkPhoto } from "@/lib/content/types";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

// Bento layout for 5–6 photos: large 2×2 feature tile in a 3×3 grid.
// For 3–4 photos the last tile spans the full width so no cell is empty.
const SPANS_MANY = [
  "col-span-2 row-span-2",
  "",
  "",
  "",
  "",
  "max-md:col-span-2",
];
const SPANS_FEW = ["col-span-2 row-span-2", "", "", "col-span-2 md:col-span-3"];

/**
 * Work / Shop Photos bento (PRD §7.2 H7, §15): renders real published
 * photos from the CMS when available; otherwise neutral placeholder frames
 * (the project assets contain third-party/AI material that must never be
 * published).
 */
export function Gallery({
  dict,
  photos = [],
  lang = "ar",
}: {
  dict: Dictionary;
  photos?: WorkPhoto[];
  lang?: Lang;
}) {
  const { title, subtitle, placeholderNote } = dict.home.gallery;
  const spans = photos.length >= 5 ? SPANS_MANY : SPANS_FEW;

  return (
    <div>
      <SectionHeading title={title} subtitle={subtitle} />
      {photos.length === 0 ? (
        <div className="mt-10 grid auto-rows-[140px] grid-cols-2 gap-4 sm:auto-rows-[160px] md:grid-cols-3">
          {spans.map((span, i) => (
            <Reveal key={i} delay={Math.min(i * 0.06, 0.3)} className={`${span} min-h-0`}>
              <div
                className="flex h-full min-h-32 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line bg-surface-2 text-muted"
                role="img"
                aria-label={`${placeholderNote} — work-0${i + 1}`}
              >
                {i % 2 === 0 ? (
                  <Snowflake className="size-8 text-muted/50" strokeWidth={1.25} />
                ) : (
                  <ImageIcon className="size-8 text-muted/50" strokeWidth={1.25} />
                )}
                <span className="text-xs">[CMS] work-0{i + 1}</span>
              </div>
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="mt-10 grid auto-rows-[140px] grid-cols-2 gap-4 sm:auto-rows-[160px] md:grid-cols-3">
          {photos.slice(0, 6).map((photo, i) => (
            <Reveal
              key={photo.id}
              delay={Math.min(i * 0.06, 0.3)}
              className={`${spans[i] ?? ""} min-h-0`}
            >
              <figure className="relative h-full min-h-32 overflow-hidden rounded-2xl border border-line shadow-s1">
                <Image
                  src={photo.url}
                  alt={photo.caption[lang] || title}
                  fill
                  loading={i < 2 ? "eager" : "lazy"}
                  sizes="(max-width: 768px) 50vw, 420px"
                  className="object-cover transition duration-300 hover:scale-[1.03]"
                />
              </figure>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
