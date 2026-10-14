"use client";

import { useEffect, useState } from "react";

/**
 * Intro curtain (PRD A01): ~1.6s brand intro, once per session. Skipped on
 * repeat visits (sessionStorage), reduced-motion, or slow page loads
 * (navigation timing > 3s). Content stays in the DOM beneath — the overlay
 * never blocks clicks after first paint (click to skip).
 */
export function IntroCurtain() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("intro-seen");
    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    const slow = nav ? nav.duration > 3000 : false;
    if (reduced || seen || slow) return;

    // Async mount so the initial client render matches the server output.
    const showTimer = setTimeout(() => {
      setShow(true);
      sessionStorage.setItem("intro-seen", "1");
    }, 0);
    const hideTimer = setTimeout(() => setShow(false), 1750);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center bg-bg"
      onClick={() => setShow(false)}
      aria-hidden="true"
      style={{ animation: "intro-fade .3s ease-out both" }}
    >
      <span
        className="inline-flex size-16 items-center justify-center rounded-2xl bg-ink text-accent-bright shadow-s3"
        style={{ animation: "intro-pop .5s cubic-bezier(.16,1,.3,1) both" }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          className="size-9"
        >
          <line x1="12" y1="3" x2="12" y2="21" />
          <line x1="5" y1="7.5" x2="19" y2="16.5" />
          <line x1="19" y1="7.5" x2="5" y2="16.5" />
        </svg>
      </span>
      <span
        lang="ar"
        dir="rtl"
        className="mt-5 font-heading text-2xl font-bold text-ink"
        style={{ animation: "intro-name .7s cubic-bezier(.16,1,.3,1) .3s both" }}
      >
        للتبريد والتكييف
      </span>
      <span
        className="mt-2 block h-0.5 w-24 overflow-hidden rounded-full bg-surface-2"
        aria-hidden="true"
      >
        <span
          className="block h-full w-full bg-accent"
          style={{ animation: "intro-line 1.2s ease-in-out .2s both" }}
        />
      </span>
      <style>{`
        @keyframes intro-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes intro-pop { from { opacity: 0; transform: scale(.8) } to { opacity: 1; transform: scale(1) } }
        @keyframes intro-name { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes intro-line { from { transform: translateX(-110%) } to { transform: translateX(110%) } }
        html[dir="rtl"] .intro-name-fix { transform: translateY(10px) }
      `}</style>
    </div>
  );
}
