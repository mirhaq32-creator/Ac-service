import type { Dictionary } from "@/i18n/dictionaries/en";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

/**
 * How It Works (PRD §7.2 H6, §14.4): 4 steps with a connecting line on
 * desktop, vertical timeline on mobile.
 */
export function HowItWorks({ dict }: { dict: Dictionary }) {
  const { title, steps } = dict.home.howItWorks;

  return (
    <div>
      <SectionHeading title={title} />
      <ol className="mt-12 grid gap-10 md:grid-cols-4 md:gap-6">
        {steps.map((step, i) => (
          <li key={step.title} className="relative">
            <Reveal delay={Math.min(i * 0.12, 0.4)}>
              {/* Connecting line (desktop): drawn between step circles */}
              {i < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute top-6 hidden h-0.5 w-full bg-line md:block"
                />
              ) : null}
              <div className="relative flex items-center gap-4 md:flex-col md:items-start">
                <span className="z-10 inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-accent font-heading text-lg font-bold text-white shadow-glow">
                  {i + 1}
                </span>
                <div className="md:mt-4">
                  <h3 className="font-heading text-lg font-bold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {step.text}
                  </p>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
