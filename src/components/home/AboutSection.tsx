import { Snowflake } from "lucide-react";

import type { Dictionary } from "@/i18n/dictionaries/en";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

/**
 * About (PRD §7.2/§7.9): factual story only — no team, certifications or
 * awards. Photo slots about-1/about-2 [CMS] as layered placeholder frames.
 */
export function AboutSection({ dict }: { dict: Dictionary }) {
  const { title, paragraphs, frameNote } = dict.home.about;

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
          {/* Layered placeholder frames (R7 style) — real photos via CMS */}
          <div
            className="absolute -bottom-5 end-[-20px] hidden aspect-[4/3] w-2/3 items-center justify-center rounded-2xl border border-line bg-surface-2 text-muted shadow-s2 sm:flex"
            role="img"
            aria-label={`${frameNote} — about-2`}
          >
            <span className="text-xs">[CMS] about-2</span>
          </div>
          <div
            className="relative flex aspect-[4/3] items-center justify-center rounded-2xl border border-line bg-surface-2 text-muted shadow-s3"
            role="img"
            aria-label={`${frameNote} — about-1`}
          >
            <Snowflake className="size-12 text-muted/40" strokeWidth={1.25} />
            <span className="absolute bottom-4 text-xs">[CMS] about-1</span>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
