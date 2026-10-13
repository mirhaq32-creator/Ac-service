"use client";

import { m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * Scroll reveal (PRD A11): fade + translateY 24→0 over 600ms with the
 * ease-out curve, triggered once when the element enters the viewport.
 * Only transform/opacity are animated (§6.4).
 *
 * Fallback: if the element is already at/above the viewport when it mounts
 * (anchor jumps, restored scroll), it renders visible immediately — content
 * can never be skipped into invisibility.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [alreadyInView, setAlreadyInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight) setAlreadyInView(true);
  }, []);

  if (alreadyInView) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <m.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </m.div>
  );
}
