import type { Metadata } from "next";
import { Phone } from "lucide-react";

import { BUSINESS } from "@/lib/business";
import { WhatsAppIcon } from "@/components/ui/icons/WhatsAppIcon";

export const metadata: Metadata = {
  title: "Offline | للتبريد والتكييف",
  robots: { index: false, follow: false },
};

/** Offline fallback (PRD §10): Call and WhatsApp still work offline. */
export default function OfflinePage() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <h1 className="font-heading text-3xl font-bold text-ink" lang="ar" dir="rtl">
        للتبريد والتكييف
      </h1>
      <p className="mt-3 text-ink-2" lang="ar" dir="rtl">
        لا يوجد اتصال بالإنترنت الآن — لكن يمكنك الاتصال بنا مباشرة.
      </p>
      <p className="mt-1 text-ink-2" lang="en" dir="ltr">
        You are offline — but calling us still works.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href={BUSINESS.phoneHref}
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-accent px-8 font-semibold text-white shadow-glow"
        >
          <Phone className="size-5" />
          <span dir="ltr">{BUSINESS.phoneDisplay}</span>
        </a>
        <a
          href={BUSINESS.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border-[1.5px] border-ink bg-bg px-8 font-semibold text-ink"
        >
          <WhatsAppIcon className="size-5 text-wa" />
          WhatsApp
        </a>
      </div>
    </main>
  );
}
