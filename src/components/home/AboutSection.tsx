import Image from "next/image";

import type { Lang } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { APPROVED_IMAGES } from "@/lib/content/images";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

/**
 * About (PRD §7.2/§7.9): factual story only — no team, certifications or
 * awards. Two real work photos in a layered frame.
 */
export function AboutSection({ dict, lang }: { dict: Dictionary; lang: Lang }) {
  const { title, paragraphs } = dict.home.about;
  const main = APPROVED_IMAGES.acTeam;
  const second = APPROVED_IMAGES.acOutdoor;

  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div>
        <SectionHeading title={title} />
        {paragraphs.map((p) => (
          <p key={p.slice(0, 24)} className="mt-5 text-lg leading-relaxed text-ink-2">
            {p}
          </p>
        ))}
      </div>
      <Reveal delay={0.1}>
        <div className="relative mx-auto max-w-md">
          <div className="absolute -bottom-5 end-[-20px] hidden aspect-[4/3] w-2/3 overflow-hidden rounded-2xl border border-line shadow-s2 sm:block">
            <Image
              src={second.src}
              alt={second.alt[lang]}
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 60vw, 280px"
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line shadow-s3">
            <Image
              src={main.src}
              alt={main.alt[lang]}
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 420px"
              className="object-cover"
            />
          </div>
        </div>
      </Reveal>
    </div>
  );
}
