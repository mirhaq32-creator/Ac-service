"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import type { ReactNode } from "react";

/**
 * Motion setup (PRD §3.1/§6): LazyMotion keeps the animation runtime out of
 * the initial bundle; `strict` forces `m.*` components; MotionConfig honors
 * the user's reduced-motion preference globally.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
