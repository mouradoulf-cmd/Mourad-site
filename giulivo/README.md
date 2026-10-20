# Giulivo v2 · Cucina e Buonumore (`giulivo/`)

Premium rebuild of the Giulivo site (the original stays at the repo root until Mourad approves the swap).
Plain HTML/CSS/JS, no build step on the server. Night-in-Tuscany art direction, palette kept from the
original (ink, cream, terracotta, olive, gold) + the cream-yellow paper and sage sun of the real menu.

## Real content only
- **Menu**: transcribed from the restaurant's 5 printed menu pages (Terra primi / secondi, Mare,
  Contorni, Bevande & Caffè, coperto 2,50 €), with allergen numbers as printed. Translations EN/DE/TH
  are descriptions only; dish names stay in Italian. Allergen legend = EU Reg. 1169/2011 order.
- **Photos**: the restaurant's own photos (same as the old site), lightly enhanced (CLAHE, warmth,
  sharpening), exported 640/1280/2000 webp + jpg fallback.
- **Logo**: vectorised (potrace) from the logo printed on the menu → `assets/img/logo.svg`, and the
  sun + olive mark alone → `assets/img/mark.svg` (used flat, in the favicon, and in 3D).
- **Info**: phone +39 388 856 6367, Località Luchetta 7 Vicopisano, Google 4,7 / 91 reviews, dinner
  service until 23:00 (days to confirm by phone). No invented reviews or quotes.

## Signature pieces
- `assets/js/hero.js` — raw WebGL hero: the real terrace photo, night falls and the real lanterns
  light up one by one. `assets/img/hero-maps.png` packs R = lantern glow (hand-placed on each real
  lamp), G = warm light pool on the tables, B = estimated depth (pointer/gyro/scroll parallax).
- `assets/js/main.js` — "La Carta": the menu pages as 3D paper sheets turned like a book (pinned
  scroll on desktop, buttons/swipe/tabs on touch); "Dalla cucina" 3D coverflow + tilt + glare on the
  dish photos; scroll-driven terrace sequence; Google rating count-up; booking (day → time → guests →
  where → name) to WhatsApp; one-field call-back; Google map loaded only on click.
- `assets/js/mark3d.js` — three.js: the logo mark extruded in brass, lit warm, follows pointer and scroll.
- `assets/js/i18n.js` + `i18n-data.js` — IT baked in the HTML, EN/DE/TH switched client-side (`?lang=`).
- Desktop (fine pointer ≥1000px): Lenis + GSAP ScrollTrigger pins (`html.pin`). Touch: native scroll.
  Mobile action bar: Chiama · WhatsApp · Prenota (all `tel:`/`wa.me` links `target="_blank" rel="noopener"`).

Vendor (MIT): three r160 + SVGLoader + RoomEnvironment, GSAP + ScrollTrigger, Lenis.
