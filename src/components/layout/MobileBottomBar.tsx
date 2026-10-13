import { CalendarCheck, Phone } from "lucide-react";

import type { Lang } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { BUSINESS } from "@/lib/business";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons/WhatsAppIcon";

/**
 * Mobile bottom action bar (PRD §7.14/D12): CALL NOW (accent, strongest,
 * ~44% width) · WHATSAPP · BOOK SERVICE. Default 64px height, safe-area
 * aware; the layout adds matching bottom padding.
 */
export function MobileBottomBar({
  lang,
  dict,
}: {
  lang: Lang;
  dict: Dictionary;
}) {
  return (
    <nav
      aria-label={dict.a11y.mobileActions}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-[44%_28%_28%] gap-2 p-2">
        <Button
          variant="call"
          size="bar"
          href={BUSINESS.phoneHref}
          className="w-full"
        >
          <Phone className="size-4 shrink-0" />
          <span className="truncate">{dict.cta.callNow}</span>
        </Button>
        <Button
          variant="whatsapp"
          size="bar"
          href={BUSINESS.whatsappUrl}
          className="w-full"
        >
          <WhatsAppIcon className="size-4 shrink-0 text-wa" />
          <span className="truncate">{dict.cta.whatsapp}</span>
        </Button>
        <Button
          variant="book"
          size="bar"
          href={`/${lang}/book`}
          className="w-full"
        >
          <CalendarCheck className="size-4 shrink-0" />
          <span className="truncate">{dict.cta.bookService}</span>
        </Button>
      </div>
    </nav>
  );
}
