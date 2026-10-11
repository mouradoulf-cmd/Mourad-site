# Neon Tiger — Pattaya pool bar (demo template)

Plain HTML/CSS/JS, no build step. Open `index.html`.

- `assets/css/style.css` — night palette, neon glows, all sections
- `assets/js/i18n.js` — FR / TH / RU dictionaries (English is in the HTML) and prices
- `assets/js/main.js` — live status, happy-hour countdown, week, drinks, booking…
- `assets/fonts/` — Unbounded, Monoton, Manrope (SIL Open Font License), self-hosted
- `assets/img/` — photos, each as `.webp` + `.jpg`

## Adapting it for a client

Demo content to replace: bar name, address and Thai taxi card, phone /
WhatsApp (`WA` in `main.js` and the `tel:`/`wa.me` links), opening and
happy-hour times (`OPEN`, `CLOSE`, `HH_START`, `HH_END` in `main.js`), the
weekly events, drinks and prices, reviews and the hall of fame.

Prices are written in baht (`data-price` / `data-hh` on the menu) and shown
in the visitor's currency: EN → USD, FR → EUR (rounded guides, rate in
`RATE`), TH and RU → THB.

## Photo sources

Unsplash (Unsplash License), `images.unsplash.com/photo-<id>`:

| File | Unsplash id |
| --- | --- |
| hero-1 | 1566737236500-c8ac43014a67 |
| hero-2 | 1470225620780-dba8ba36b745 |
| hero-3 | 1566417713940-fe7c737a9ef2 |
| bar-gold | 1572116469696-31de0f17cc34 |
| bar-red | 1575444758702-4a6b9222336e |
| drink-beer | 1567696911980-2eed69a46042 |
| drink-cocktails | 1551024709-8f23befc6f87 |
| drink-bottles | 1525268323446-0505b6fe7778 |
| ev-band | 1506157786151-b8491531f063 |
| ev-party | 1492684223066-81342ee5ff30 |
| ev-crowd | 1533174072545-7a4b6ad7a6c3 |
| g-toast | 1485872299829-c673f5194813 |
| g-cheers | 1541532713592-79a0317b6b77 |
| g-beers | 1575037614876-c38a4d44f5b8 |
| g-pour | 1535958636474-b021ee887b13 |
| g-cocktail | 1514362545857-3bc16c4c7d1b |
| g-redneon | 1545128485-c400e7702796 |
| g-sign | 1508700115892-45ecd05ae2ad |
| g-street | 1508009603885-50cf7c579365 |
| g-market | 1587574293340-e0011c4e8ecf |
| g-twobeers | 1600788886242-5c96aabe3757 |

Pool photos are CC0 (public domain) from rawpixel via Openverse:
pool-shot (rawpixel 5919666) and pool-eight (6018571).
