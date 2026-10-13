import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Button with the PRD §4.2 hierarchy:
 * - call:        solid accent, white bold text, glow (strongest)
 * - book:        solid charcoal, white text
 * - whatsapp:    white surface + 1.5px ink border (green icon supplied by caller)
 * - ghost:       quiet text action
 * - inverse:     solid white surface + accent text (Call on accent bands)
 * - outlineWhite: white outline on accent/dark bands
 * All variants keep a ≥48px tap target (min-h-12).
 */
type ButtonVariant =
  | "call"
  | "book"
  | "whatsapp"
  | "ghost"
  | "inverse"
  | "outlineWhite";
type ButtonSize = "md" | "lg" | "bar";

const base =
  "inline-flex min-h-12 cursor-pointer select-none items-center justify-center gap-2 rounded-full font-semibold transition duration-200 ease-out active:scale-[0.97]";

const variants: Record<ButtonVariant, string> = {
  call: "bg-accent text-white shadow-glow hover:bg-accent-hover",
  book: "bg-ink text-white hover:bg-ink-2",
  whatsapp: "border-[1.5px] border-ink bg-bg text-ink hover:bg-surface",
  ghost: "text-ink hover:bg-surface",
  inverse: "bg-bg text-accent shadow-s2 hover:bg-accent-tint",
  outlineWhite:
    "border-[1.5px] border-white bg-transparent text-white hover:bg-white/10",
};

const sizes: Record<ButtonSize, string> = {
  md: "px-5 text-sm md:text-[15px]",
  lg: "px-6 py-3 text-base md:text-lg",
  bar: "px-2.5 text-xs gap-1.5",
};

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** External (tel:/https:) anchors render plain <a>; internal paths use next/link. */
  href?: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

const isExternalHref = (href: string) => /^(tel:|mailto:|https?:)/i.test(href);

export function Button({
  variant = "call",
  size = "md",
  href,
  children,
  className = "",
  ariaLabel,
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href && isExternalHref(href)) {
    return (
      <a href={href} className={cls} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href} className={cls} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
