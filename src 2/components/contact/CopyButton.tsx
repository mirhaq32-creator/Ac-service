"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

/** Copy-to-clipboard button with transient success state (Contact page). */
export function CopyButton({
  value,
  label,
  copiedLabel,
}: {
  value: string;
  label: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          setCopied(false);
        }
      }}
      className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-ink px-5 text-sm font-semibold text-ink transition hover:bg-surface active:scale-[0.97]"
    >
      {copied ? (
        <Check className="size-4 text-success" aria-hidden="true" />
      ) : (
        <Copy className="size-4" aria-hidden="true" />
      )}
      {copied ? copiedLabel : label}
    </button>
  );
}
