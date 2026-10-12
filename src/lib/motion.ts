/**
 * Motion tokens (PRD §6.2) for use with the Motion library.
 * Animations may only touch transform / opacity / clip-path (§6.4).
 */
export const durations = {
  instant: 0.1,
  fast: 0.18,
  base: 0.32,
  slow: 0.6,
  hero: 0.9,
} as const;

export const easings = {
  out: [0.16, 1, 0.3, 1], // ease-out (default)
  inOut: [0.65, 0, 0.35, 1], // ease-in-out
} as const;

export const spring = { stiffness: 260, damping: 24 } as const;

/** Stagger per item (ms) — total stagger must stay ≤ 600ms (§6.2). */
export const staggerMs = 60;
