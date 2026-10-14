import Image from "next/image";

/**
 * Real brand mark (the owner's circular emblem). The emblem has a
 * transparent interior, so it always sits on a white rounded tile to stay
 * legible on both the light header and the dark footer.
 */
export function LogoMark({
  className = "",
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "dark";
}) {
  const ring = tone === "dark" ? "ring-1 ring-white/20" : "ring-1 ring-line";
  return (
    <span
      aria-hidden="true"
      className={`inline-flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-s1 ${ring} ${className}`}
    >
      <Image
        src="/brand/logo-mark.webp"
        alt=""
        width={384}
        height={384}
        className="size-10 object-contain"
        priority
      />
    </span>
  );
}
