/**
 * Self-hosted fonts via next/font (PRD §4.3):
 * - English display: Barlow Condensed 700–800
 * - English body:    Inter 400/500/600
 * - Arabic (display + body): IBM Plex Sans Arabic 400/500/700
 *
 * Layouts apply only the variables the current language needs, so Arabic
 * pages never download the Latin display fonts and vice versa.
 */
import { Barlow_Condensed, IBM_Plex_Sans_Arabic, Inter } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-en-body",
  display: "swap",
});

export const barlowCondensed = Barlow_Condensed({
  weight: ["700", "800"],
  subsets: ["latin"],
  variable: "--font-en-display",
  display: "swap",
});

export const plexArabic = IBM_Plex_Sans_Arabic({
  weight: ["400", "500", "700"],
  subsets: ["arabic", "latin"],
  variable: "--font-ar",
  display: "swap",
});
