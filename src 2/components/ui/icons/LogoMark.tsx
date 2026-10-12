import { Snowflake } from "lucide-react";

/**
 * Neutral placeholder brand mark (PRD §4.6/§15): charcoal tile with the
 * snowflake motif in the brand accent. NOT the real logo — replaced once
 * the owner supplies a transparent SVG/PNG in the brand palette (§19).
 */
export function LogoMark({
  className = "",
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "dark";
}) {
  const tones = {
    default: "bg-ink text-accent-bright",
    dark: "bg-bg text-accent",
  } as const;
  return (
    <span
      aria-hidden="true"
      className={`inline-flex size-10 shrink-0 items-center justify-center rounded-xl shadow-s1 ${tones[tone]} ${className}`}
    >
      <Snowflake className="size-6" strokeWidth={1.75} />
    </span>
  );
}
