# Giulivo v2 · Cucina e Buonumore (`giulivo/`)

Premium rebuild of the Giulivo site (the original stays at the repo root until Mourad approves the swap).
Plain HTML/CSS/JS, no build step on the server. Night-in-Tuscany art direction, palette kept from the
original (ink, cream, terracotta, olive, gold) + the cream-yellow paper and sage sun of the real menu.

## Real content only
- **Menu**: transcribed from the restaurant's 5 printed menu pages (Terra primi / secondi, Mare,
  Contorni, Bevande & Caffè, coperto 2,50 €), with allergen numbers as printed. Translations EN/DE/NL
  are descriptions only; dish names stay in Italian. Allergen legend = EU Reg. 1169/2011 order.
- **Photos**: the restaurant's own photos (same as the old site), lightly enhanced (CLAHE, warmth,
  sharpening), exported 640/1280/2000 webp + jpg fallback.
- **Logo**: vectorised (potrace) from the logo printed on the menu → `assets/img/logo.svg`, and the
  sun + olive mark alone → `assets/img/mark.svg` (used flat, in the favicon, and in 3D).
- **Info**: phone +39 388 856 6367, Località Luchetta 7 Vicopisano, Google 4,7 / 91 reviews, dinner
  service until 23:00 (days to confirm by phone). No invented reviews or quotes.

## Signature pieces
- **Dalla cucina** (right after the hero): all 7 real dish photos at once in a magazine mosaic (desktop
  5×2 grid fitting one screen, star dish 2×2; phone 3-column mosaic in about one screen), hover zoom,
  tap → full-screen viewer (swipe / arrows / Esc). No pinning or scroll-jacking: Mourad found it
  annoying to scroll through dishes one by one. He refused a 3D brass logo and a 3D ring of small
  photos. Dish photos must be the star, visible at once. Mourad asked to put the
  dish photos forward and **refused the 3D extruded brass logo** — never add 3D logo objects again.
- `assets/js/hero.js` — raw WebGL hero: the real terrace photo, night falls and the real lanterns
  light up one by one. `assets/img/hero-maps.png` packs R = lantern glow (hand-placed on each real
  lamp), G = warm light pool on the tables, B = estimated depth (pointer/gyro/scroll parallax).
- `assets/js/main.js` — "La Carta": the menu pages as 3D paper sheets turned like a book (pinned
  scroll on desktop, buttons/swipe/tabs on touch); "Dalla cucina" 3D coverflow + tilt + glare on the
  dish photos (replaced by the ring below); scroll-driven terrace sequence; Google rating count-up; booking (day → time → guests →
  where → name) to WhatsApp; one-field call-back; Google map loaded only on click.
- `assets/js/i18n.js` + `i18n-data.js` — IT baked in the HTML, EN/DE/NL switched client-side (NL replaced TH at Mourad's request) (`?lang=`).
- Desktop (fine pointer ≥1000px): Lenis + GSAP ScrollTrigger pins (`html.pin`). Touch: native scroll.
  Mobile action bar: Chiama · WhatsApp · Prenota (all `tel:`/`wa.me` links `target="_blank" rel="noopener"`).

Vendor (MIT): GSAP + ScrollTrigger, Lenis.

Hero copy: tagline « La Toscana vera, nel piatto. » + promise line (handmade pasta, slow-cooked boar,
the best of the sea, the terrace). Mourad disliked « Sotto gli ulivi, fino alle 23 » as a hook.

## Pass « ultra-premium » (2026-10-20)

- **Photos**: same real photos, re-graded from the originals (`grade.py`/`export.py` in the authoring
  scratchpad): HDR halos softened, greens pulled toward olive, amber highlights, gentle vignette, plates
  recropped (piatto della casa fills the frame). Served as AVIF → WebP → JPG with real width descriptors.
- **Dalla cucina**: bigger 4-column bento that still fits one screen on desktop, numbered captions,
  curtain reveal, light sheen + gold hairline on hover, a "Guarda" disc following the pointer.
- **Manifesto**: two real photos (table, panna cotta) beside the words, curtain reveal + parallax.
- **Terrazza**: editorial collage (no pinning, no scroll-jacking), the hero photo is no longer repeated;
  closes on a full-bleed "Tra gli ulivi". Parallax only on desktop with a fine pointer.
- **Recensioni**: real 4,7 inside a slowly turning ring of type. Fixed film grain layer (inert).

## Hero = la table, les lumières = la terrasse (2026-10-20)

Asked by Mourad: the table photo (`table-partage`) is now the hero (split layout: photo right, name and
booking on the dark side; phones: photo on top). The "night falls, lanterns light up" WebGL moved to
`assets/js/lights.js` and closes the terrace section on the pergola photo ("Quando si accendono le luci");
it starts when the scene is 40% in view and replays each time it comes back. `terrazza-tavoli` (same view
as the pergola) now illustrates the manifesto instead of the table photo.

## Moins de photos d'extérieur (2026-10-20)

Mourad found the outdoor photos repetitive: the terrace section is now its title + the single
"lights" scene (full-screen, night falls on the pergola). Manifesto keeps one photo (panna cotta);
the map placeholder is a drawn card (pin + pulsing rings) instead of a garden photo.

## Textes « restaurant étoilé » (2026-10-21)

Copy pass on every visible string (IT/EN/DE/NL, overrides in the authoring `copy2.py`): restrained,
factual tone, formal address (voi / Sie / u). The manifesto no longer implies the pasta is made in-house
(it is handmade by La Castellana); its three facts are all about the kitchen (pasta, land & sea, seasons).
Nav order follows the page (Cucina, La Carta, Terrazza, Dove siamo).

## Réécriture éditoriale complète (2026-10-21)

Every visible string rewritten for a high-end, warm, formal voice in IT/EN/DE/NL (authoring `copy3.py`):
hero "Dove la Toscana si siede a tavola.", dishes "Prima ancora di sedervi", manifesto built on real menu
facts (handmade pasta by La Castellana, slow-cooked wild boar, cacciucco without bones), menu "Da
sfogliare con calma", terrace "Quando scende la sera" → "Si accendono le luci", reviews, booking "Vi
teniamo un posto", practical info, buttons, footer, meta. Nothing invented (no chef, awards or history).
Booking summary uses `book.guests` (keeps German nouns capitalised).

## Retours du client (2026-10-21)
- Manifesto : photo des cèpes (porcini) du client à la place de la panna cotta.
- Nouvelle section « La domenica, anche a pranzo » (#domenica, section claire « lumière du jour ») avec
  l'affiche du client, la caisse de porcini et le magret de canard ; bouton qui présélectionne le dimanche
  suivant à 13:00. Créneaux du dimanche midi 12:30 / 13:00 / 13:30 (à confirmer par le restaurant).
- Réservation : « In terrazza » / « In sala » au lieu de « Senza preferenze ».
- Scène des lumières : 3 lueurs qui flottaient dans le ciel (sans lampe réelle) retirées de `hero-maps.png`.
- Horaires : « la domenica anche a pranzo » dans le héros et dans « Dove siamo ».

## Netteté des photos (2026-10-21)
Hero (`table-partage`) and the 7 dish photos were upscaled ×2 with EDSR (OpenCV dnn_superres, run
locally, free), then graded/cropped as before and exported with a 2000w size (AVIF/WebP). The viewer
opens the 2000w file; the hero `sizes` reflect its real cover width (200vw phone / 95vw desktop) so
retina screens get the sharp file. Porcini photo: crate edges cropped, no inner frame or zoom.
Desktop manifesto back to two columns (text | photo).
