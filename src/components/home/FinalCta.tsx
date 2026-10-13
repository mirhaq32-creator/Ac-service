import { CalendarCheck, Phone } from "lucide-react";

import type { Lang } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { BUSINESS } from "@/lib/business";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons/WhatsAppIcon";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Final CTA band (PRD §7.2 H12): accent gradient, full CTA trio with Call
 * as the strongest action.
 */
export function FinalCta({ lang, dict }: { lang: Lang; dict: Dictionary }) {
  const { title, text } = dict.home.finalCta;

  return (
    <Reveal>
      <div className="rounded-hero bg-gradient-to-l from-accent to-accent-bright p-8 text-center text-white shadow-glow md:p-14">
        <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-white/90">{text}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button variant="inverse" size="lg" href={BUSINESS.phoneHref}>
            <Phone className="size-5 shrink-0" />
            {dict.cta.callNow}
          </Button>
          <Button
            variant="outlineWhite"
            size="lg"
            href={BUSINESS.whatsappUrl}
          >
            <WhatsAppIcon className="size-5 shrink-0" />
            {dict.cta.whatsapp}
          </Button>
          <Button
            variant="book"
            size="lg"
            href={`/${lang}/book`}
            className="shadow-s2"
          >
            <CalendarCheck className="size-5 shrink-0" />
            {dict.cta.bookService}
          </Button>
        </div>
      </div>
    </Reveal>
  );
}
