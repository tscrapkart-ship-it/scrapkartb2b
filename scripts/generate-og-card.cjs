/**
 * Generate the 1200×630 social-share card (Open Graph / Twitter image).
 *
 * Run from the b2b side root:
 *   node scripts/generate-og-card.cjs
 *
 * Outputs:
 *   - b2b side/public/og-card.png
 *   - main page/assets/og-card.png  (sibling project on disk)
 *
 * Design: forest gradient + soft mint/amber glows + white wordmark logo +
 * tagline + URL footer. Brand-tuned so chat previews look on-brand instead
 * of like a default screenshot.
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const W = 1200;
const H = 630;

const LOGO_PATH = path.join(__dirname, "..", "public", "logos", "ScrapKart White Logo.png");
const OUT_B2B = path.join(__dirname, "..", "public", "og-card.png");
const OUT_MAIN = path.join(__dirname, "..", "..", "main page", "assets", "og-card.png");

async function build() {
  // --- Layer 1: gradient background + decorative glows -------------------
  const bgSvg = `
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stop-color="#082B19"/>
          <stop offset="55%"  stop-color="#0F4D2A"/>
          <stop offset="100%" stop-color="#1B6B3D"/>
        </linearGradient>
        <radialGradient id="mintGlow" cx="0.85" cy="0.18" r="0.55">
          <stop offset="0%"   stop-color="#34D399" stop-opacity="0.32"/>
          <stop offset="100%" stop-color="#34D399" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="amberGlow" cx="0.12" cy="0.85" r="0.5">
          <stop offset="0%"   stop-color="#F59E0B" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#F59E0B" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#bg)"/>
      <rect width="${W}" height="${H}" fill="url(#mintGlow)"/>
      <rect width="${W}" height="${H}" fill="url(#amberGlow)"/>
      <!-- thin top hairline for depth -->
      <rect x="0" y="0" width="${W}" height="1" fill="rgba(255,255,255,0.10)"/>
    </svg>
  `;

  // --- Layer 2: text overlay (eyebrow, tagline, URL) ---------------------
  // Use widely-available Windows/Linux/macOS sans + mono fallbacks so the
  // card renders the same on any machine that runs this script.
  const textSvg = `
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .eyebrow { font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
                   font-size: 18px; letter-spacing: 4px; fill: rgba(255,255,255,0.62); }
        .tagline { font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
                   font-size: 36px; font-weight: 500; letter-spacing: -0.5px;
                   fill: rgba(255,255,255,0.92); }
        .url     { font-family: 'Consolas', 'Courier New', monospace;
                   font-size: 16px; letter-spacing: 3px; fill: rgba(255,255,255,0.55); }
        .sub     { font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
                   font-size: 17px; font-style: italic; fill: rgba(255,255,255,0.58); }
      </style>
      <text x="64" y="78" class="eyebrow">EST. 2024 · MADE IN INDIA</text>
      <text x="${W / 2}" y="510" class="tagline" text-anchor="middle">Trade. Recycle. Repeat.</text>
      <text x="64" y="${H - 48}" class="sub">India's industrial scrap exchange</text>
      <text x="${W - 64}" y="${H - 48}" class="url" text-anchor="end">SCRAPKART.APP</text>
    </svg>
  `;

  // --- Layer 3: logo ------------------------------------------------------
  // Native: 3508x2480 (1.41 aspect). Render at 540 wide → 382 tall, centered.
  const LOGO_W = 540;
  const LOGO_H = Math.round((2480 / 3508) * LOGO_W); // ~382
  const LOGO_X = Math.round((W - LOGO_W) / 2);
  const LOGO_Y = 110;

  const logoBuf = await sharp(LOGO_PATH).resize(LOGO_W, LOGO_H).png().toBuffer();

  const card = await sharp(Buffer.from(bgSvg))
    .composite([
      { input: logoBuf, left: LOGO_X, top: LOGO_Y },
      { input: Buffer.from(textSvg), left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(OUT_B2B, card);
  fs.writeFileSync(OUT_MAIN, card);

  const sizeKB = (card.length / 1024).toFixed(1);
  console.log(`Wrote ${OUT_B2B}`);
  console.log(`Wrote ${OUT_MAIN}`);
  console.log(`Size: ${sizeKB} KB (target: <600 KB so WhatsApp fetches it cleanly)`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
