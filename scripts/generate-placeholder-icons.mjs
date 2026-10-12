/**
 * Generates neutral placeholder PWA icons + favicon (PRD §15/§19):
 * warm-white tile + snowflake motif in the brand accent — palette-compliant,
 * NOT the discarded blue logo. Re-run with `npm run icons` after dropping
 * the real logo asset in, and swap the glyph accordingly.
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const ROOT = process.cwd();
const ICONS_DIR = path.join(ROOT, "public", "icons");
const APP_DIR = path.join(ROOT, "src", "app");

const BG = "#FFFBF7";
const ACCENT = "#F2531F";

/** Three crossing lines (a calm snowflake/airflow motif). */
function glyphSvg({ scale = 1 }) {
  const transform =
    scale === 1
      ? ""
      : `transform="translate(256 256) scale(${scale}) translate(-256 -256)"`;
  return `
  <g stroke="${ACCENT}" stroke-width="30" stroke-linecap="round" ${transform}>
    <line x1="256" y1="96" x2="256" y2="416"/>
    <line x1="117" y1="176" x2="395" y2="336"/>
    <line x1="395" y1="176" x2="117" y2="336"/>
  </g>`;
}

function iconSvg({ scale = 1 }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${BG}"/>
  ${glyphSvg({ scale })}
</svg>`;
}

async function writeIcon(file, size, scale) {
  const svg = Buffer.from(iconSvg({ scale }));
  await sharp(svg).resize(size, size).png().toFile(file);
  console.log(`wrote ${path.relative(ROOT, file)} (${size}x${size})`);
}

await mkdir(ICONS_DIR, { recursive: true });

// Regular icons (glyph at full span)
await writeIcon(path.join(ICONS_DIR, "icon-192.png"), 192, 1);
await writeIcon(path.join(ICONS_DIR, "icon-512.png"), 512, 1);

// Maskable icons (glyph shrunk into the ~80% safe zone)
await writeIcon(path.join(ICONS_DIR, "maskable-192.png"), 192, 0.55);
await writeIcon(path.join(ICONS_DIR, "maskable-512.png"), 512, 0.55);

// Favicon via the app icon convention
await writeIcon(path.join(APP_DIR, "icon.png"), 64, 1);
