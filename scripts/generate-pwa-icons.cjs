/**
 * Generate the PWA + iOS home-screen icons from the brand's white logo
 * on a forest-gradient square.
 *
 * Run from the b2b side root:
 *   node scripts/generate-pwa-icons.cjs
 *
 * Outputs:
 *   public/icons/icon-192x192.png   (Android home-screen, manifest)
 *   public/icons/icon-512x512.png   (Android splash, manifest)
 *   public/icons/apple-touch-icon.png  (iOS home-screen, 180x180)
 *
 * Replaces the earlier placeholders (which were just copies of the
 * full white-bg logo and looked stretched at small sizes).
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const LOGO_PATH = path.join(__dirname, "..", "public", "logos", "ScrapKart White Logo.png");
const OUT_DIR = path.join(__dirname, "..", "public", "icons");

// Sizes to generate. Keep keys URL-safe — they become file names.
const SIZES = {
  "icon-192x192.png": 192,
  "icon-512x512.png": 512,
  "apple-touch-icon.png": 180,
};

async function buildOne(size) {
  // Forest-gradient background as an SVG (matches the OG card colors).
  const bgSvg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stop-color="#082B19"/>
          <stop offset="55%"  stop-color="#0F4D2A"/>
          <stop offset="100%" stop-color="#1B6B3D"/>
        </linearGradient>
        <radialGradient id="glow" cx="0.78" cy="0.22" r="0.55">
          <stop offset="0%"   stop-color="#34D399" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="#34D399" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#g)"/>
      <rect width="${size}" height="${size}" fill="url(#glow)"/>
    </svg>
  `;

  // The logo file is now a wide banner (glyph + wordmark, ~6.5:1 aspect).
  // For a square PWA icon, crop just the leftmost square portion (the glyph).
  // The glyph occupies roughly the leftmost height-equal region of the file.
  const meta = await sharp(LOGO_PATH).metadata();
  const cropSize = Math.min(meta.width || 0, meta.height || 0);

  const glyphBuf = await sharp(LOGO_PATH)
    .extract({ left: 0, top: 0, width: cropSize, height: cropSize })
    .toBuffer();

  // Fit glyph inside ~65% of the icon for safe-zone padding (Android adaptive
  // icons crop to a circle/squircle — keep margin so it isn't clipped).
  const target = Math.round(size * 0.65);
  const sizedGlyph = await sharp(glyphBuf).resize(target, target).png().toBuffer();

  return sharp(Buffer.from(bgSvg))
    .composite([
      {
        input: sizedGlyph,
        left: Math.round((size - target) / 2),
        top: Math.round((size - target) / 2),
      },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const [name, size] of Object.entries(SIZES)) {
    const buf = await buildOne(size);
    const outPath = path.join(OUT_DIR, name);
    fs.writeFileSync(outPath, buf);
    console.log(`Wrote ${outPath} (${size}x${size}, ${(buf.length / 1024).toFixed(1)} KB)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
