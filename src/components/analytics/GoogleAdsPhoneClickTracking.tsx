
"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function GoogleAdsPhoneClickTracking() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>(
        'a[href^="tel:"]'
      );

      if (!link) return;

      const phoneUrl = link.href;

      // If Google tag is unavailable, allow the phone link normally.
      if (typeof window.gtag !== "function") return;

      event.preventDefault();

      let navigated = false;

      const openPhone = () => {
        if (navigated) return;

        navigated = true;
        window.location.href = phoneUrl;
      };

      // Open the phone link even if Google does not call back.
      const fallback = window.setTimeout(openPhone, 1000);

      window.gtag("event", "conversion", {
        send_to: "AW-18518996935/RczBCMuktKodEMfvxf5E",
        event_callback: () => {
          window.clearTimeout(fallback);
          openPhone();
        },
        event_timeout: 800,
      });
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
}
