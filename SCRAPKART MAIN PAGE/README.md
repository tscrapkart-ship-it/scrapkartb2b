# SCRAPKART MAIN PAGE

The static landing site for `https://scrapkart.app` — the brand-led entry point that routes visitors to either the B2B platform (`b2b.scrapkart.app`) or the B2C site (`b2c.scrapkart.app`).

## Stack

Plain HTML, CSS, and a small vanilla JS file. No build step. No dependencies. Deploys as a static folder.

- **Inter Tight** + **Fraunces** + **JetBrains Mono** loaded from Google Fonts CDN
- Design tokens from the Refined Premium B2B aesthetic (`--paper`, `--ink`, `--forest`, etc.)
- One small extra accent token, `--cream-2`, used only for the B2C card

## Files

```
SCRAPKART MAIN PAGE/
├── index.html        ← single-page everything
├── styles.css        ← design tokens + section styles + reveal/no-JS fallback
├── script.js         ← IntersectionObserver reveals, stat counters, hero parallax, nav scroll
├── assets/
│   ├── logos/        ← copied from /Logos in parent project
│   └── images/       ← (empty by default — hero/closing band use Unsplash CDN URLs in HTML)
└── README.md         ← this file
```

## Run locally

Just open `index.html` in a browser, or serve the folder over any static server:

```bash
# from inside SCRAPKART MAIN PAGE/
python -m http.server 4000
# then visit http://localhost:4000
```

## Deploy

Drag the folder into a Vercel project, or:

```bash
cd "SCRAPKART MAIN PAGE"
vercel deploy --prod
```

No build command needed. Once deployed, point the `scrapkart.app` apex domain at the new Vercel project and the existing B2B Vercel project's domain at `b2b.scrapkart.app`.

## Editing copy

- **Hero tagline**: `index.html` → `<h1 class="hero-title display reveal">`
- **Manifesto paragraph**: `index.html` → `<p class="about-manifesto reveal">`
- **Stat numbers**: `index.html` → `<div class="stat-value" data-target="...">` — three of them; the JS animates from 0 to `data-target` on scroll-in
- **B2B / B2C card text**: `index.html` → `.world-b2b` and `.world-b2c` blocks
- **Footer links**: `index.html` → `.footer-grid`

## Notes

- The current page is **branded exclusively for the umbrella entry surface** — it intentionally does NOT mimic the B2C visual style (which lives separately on `b2c.scrapkart.app`).
- The "Sign in" link in the nav points at `https://b2b.scrapkart.app/login` — the B2B platform is the only authenticated surface today.
- Stat values are placeholders. Update the `data-target` attributes with real numbers when available.
- The hero photo uses an Unsplash CDN URL; swap in `assets/images/hero.jpg` for a permanent local asset when you have one.
