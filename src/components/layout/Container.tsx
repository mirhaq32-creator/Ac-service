import type { ReactNode } from "react";

/**
 * Page container — PRD §4.4: max 1280px (1440px on large screens),
 * side padding 20/32/48px.
 */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12 2xl:max-w-[1440px] ${className}`}
    >
      {children}
    </div>
  );
}
