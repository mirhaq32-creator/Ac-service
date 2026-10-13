import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/Reveal";

/** Shared section heading: title + optional subtitle, start-aligned. */
export function SectionHeading({
  title,
  subtitle,
  dark = false,
  children,
}: {
  title: string;
  subtitle?: string;
  /** Use on dark/charcoal bands. */
  dark?: boolean;
  children?: ReactNode;
}) {
  return (
    <Reveal>
      <h2
        className={`font-heading text-3xl font-bold md:text-4xl ${
          dark ? "text-bg" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={`mt-3 max-w-2xl text-lg ${
            dark ? "text-bg/75" : "text-muted"
          }`}
        >
          {subtitle}
        </p>
      ) : null}
      {children}
    </Reveal>
  );
}
