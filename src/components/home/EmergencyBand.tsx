import { Phone } from "lucide-react";

import type { Lang } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { BUSINESS } from "@/lib/business";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons/WhatsAppIcon";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Emergency band (PRD D14/§7.4): calm, solid accent surface, strong Call
 * CTA + WhatsApp. Never flashing; never promises round-the-clock (D15) —
 * hours are stated as 10 AM–11 PM.
 */
export function EmergencyBand({ lang, dict }: { lang: Lang; dict: Dictionary }) {
  const { title, text, call } = dict.home.emergency;

  return (
    <Reveal>
      <div className="flex flex-col items-start gap-6 rounded-hero bg-accent p-8 text-white shadow-glow md:flex-row md:items-center md:justify-between md:p-12">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold">
            {dict.nav.services} · {BUSINESS.city[lang]}
          </p>
          <h2 className="mt-4 font-heading text-3xl font-bold text-white md:text-4xl">
            {title}
          </h2>
          <p className="mt-3 leading-relaxed text-white/90">{text}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row md:flex-col lg:flex-row">
          <Button variant="inverse" size="lg" href={BUSINESS.phoneHref}>
            <Phone className="size-5 shrink-0" />
            {call}
          </Button>
          <Button
            variant="outlineWhite"
            size="lg"
            href={BUSINESS.whatsappUrl}
          >
            <WhatsAppIcon className="size-5 shrink-0 text-wa" />
            {dict.cta.whatsapp}
          </Button>
        </div>
      </div>
    </Reveal>
  );
}
