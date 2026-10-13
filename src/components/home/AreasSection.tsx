import { MapPin, Navigation } from "lucide-react";

import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Lang2Code, ServiceArea } from "@/lib/content/types";
import { BUSINESS } from "@/lib/business";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

/** Google Maps URLs built from the real business address (plus code) — no API key. */
const MAPS_QUERY = encodeURIComponent("RQFP+H7C Al Munsiyah Riyadh");
const MAPS_EMBED = `https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`;
const MAPS_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${MAPS_QUERY}`;

/**
 * Service Areas + Map (PRD §7.2 H8, §7.8): all-Riyadh message + published
 * area chips from the CMS + real address + Google Maps embed. No invented
 * neighborhoods.
 */
export function AreasSection({
  lang,
  dict,
  areas = [],
}: {
  lang: Lang2Code;
  dict: Dictionary;
  areas?: ServiceArea[];
}) {
  const { title, text, allRiyadh, addressLabel, getDirections, mapTitle } =
    dict.home.areas;

  return (
    <div>
      <SectionHeading title={title} />
      <div className="mt-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="text-lg leading-relaxed text-ink-2">{text}</p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="inline-flex min-h-12 items-center gap-2 rounded-full bg-accent-tint px-5 font-semibold text-accent">
              <MapPin className="size-5" aria-hidden="true" />
              {allRiyadh}
            </span>
            {areas.map((a) => (
              <span
                key={a.id}
                className="inline-flex min-h-10 items-center rounded-full border border-line bg-bg px-4 text-sm font-medium text-ink"
              >
                {a.name[lang]}
              </span>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-line bg-bg p-6 shadow-s1">
            <h3 className="text-sm font-semibold text-muted">
              {addressLabel}
            </h3>
            <p className="mt-2 leading-relaxed text-ink">
              {BUSINESS.address[lang]}
            </p>
            <div className="mt-4">
              <Button variant="book" href={MAPS_DIRECTIONS}>
                <Navigation className="size-4 shrink-0" />
                {getDirections}
              </Button>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-2xl border border-line shadow-s2">
            <iframe
              title={mapTitle}
              src={MAPS_EMBED}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-72 w-full md:h-96"
            />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
