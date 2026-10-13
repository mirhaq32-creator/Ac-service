import { CalendarCheck, Clock, Phone } from "lucide-react";

import type { Dictionary } from "@/i18n/dictionaries/en";
import { BUSINESS } from "@/lib/business";

/**
 * CTA card used on service pages (PRD §7.5): sticky on desktop beside the
 * content; on mobile the global bottom action bar covers the same trio.
 */
export function ServiceCtaCard({
  dict,
  whatsappUrl,
  bookUrl,
}: {
  dict: Dictionary;
  whatsappUrl: string;
  bookUrl: string;
}) {
  return (
    <aside className="rounded-2xl border border-line bg-bg p-6 shadow-s2 lg:sticky lg:top-24">
      <a
        href={BUSINESS.phoneHref}
        className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-accent px-6 font-semibold text-white shadow-glow transition hover:bg-accent-hover active:scale-[0.97]"
      >
        <Phone className="size-5 shrink-0" />
        {dict.cta.callNow}
      </a>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 items-center justify-center gap-2 rounded-full border-[1.5px] border-ink bg-bg px-4 text-sm font-semibold text-ink transition hover:bg-surface active:scale-[0.97]"
        >
          {dict.cta.whatsapp}
        </a>
        <a
          href={bookUrl}
          className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white transition hover:bg-ink-2 active:scale-[0.97]"
        >
          <CalendarCheck className="size-4 shrink-0" />
          {dict.cta.bookService}
        </a>
      </div>
      <p className="mt-5 flex items-center justify-center gap-2 text-sm text-muted">
        <Clock className="size-4" aria-hidden="true" />
        {dict.footer.hours}
      </p>
    </aside>
  );
}
