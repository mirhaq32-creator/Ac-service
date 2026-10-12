import {
  Award,
  CalendarDays,
  Clock,
  House,
  MapPin,
  MessageCircle,
  Siren,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { Dictionary } from "@/i18n/dictionaries/en";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

const icons: Record<string, LucideIcon> = {
  clock: Clock,
  award: Award,
  map: MapPin,
  house: House,
  siren: Siren,
  zap: Zap,
  message: MessageCircle,
  calendar: CalendarDays,
};

/**
 * Why Choose Us (PRD §7.2 H5): charcoal band, 8 factual items (§14.3 plus
 * the owner-confirmed experience line). No invented statistics.
 */
export function WhyChooseUs({ dict }: { dict: Dictionary }) {
  const { title, items } = dict.home.whyUs;

  return (
    <div>
      <SectionHeading title={title} dark />
      <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => {
          const Icon = icons[item.icon] ?? Clock;
          return (
            <Reveal key={item.title} delay={Math.min(i * 0.06, 0.3)}>
              <div className="flex items-start gap-4">
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-accent-bright">
                  <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-heading text-lg font-bold text-bg">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-bg/70">
                    {item.text}
                  </p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
