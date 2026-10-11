# Malee — Thai massage & spa demo (Pattaya)

Premium rebuild. Fictional business: name, address (Soi 13, Second Road),
phone, reviews and prices are demo content to swap per client. Never use
a real business's name, sign or review counts here (an earlier version
started from a real Google Maps listing and was genericized).

Plain HTML/CSS/JS, no build step, no dependencies. Run it with
`python3 -m http.server` from the repo root and open `/v6-thai-spa/`.

## Design
- Palette: deep jungle green (`--ink`, `--forest`), ivory/sand, warm gold
  (`--gold`; `--gold-ink` for gold text on light backgrounds, AA contrast).
- Type: Cormorant Garamond (italic for emphasis) + Inter Tight, self-hosted
  variable woff2 (latin + cyrillic). Thai falls back to Noto Serif/Sans Thai.

## Sections
Intro lotus (once per session) · hero crossfade slideshow with live
Bangkok-time open status · marquee · six treatment cards (duration pills
update the price) · "How does your body feel today?" recommender ·
sanctuary + count-up stats · ritual steps · bento gallery + lightbox ·
reviews carousel · gift card builder (live 3D voucher, sent via WhatsApp) ·
booking (treatment → length → day → time slots → guests → pressure →
WhatsApp, live summary / sticky mobile recap) · FAQ · visit (map, hours,
Thai taxi card) · final CTA.

## i18n and prices
EN is baked into the HTML; FR/TH/RU live in `assets/js/i18n.js`, JS-built
strings in its `UI` table. Prices are stored in baht (`data-price`,
`data-prices` on the cards) and shown EN → USD, FR → EUR, TH/RU → THB.
WhatsApp messages always carry the baht total.

## Photos (Unsplash License)
All in `assets/img/` as WebP + JPG. Unsplash photo IDs:
calm 1600618528240-fb9fc964b853 · g-bath 1532926381893-7542290edf1d ·
g-bw 1591343395082-e120087004b4 · g-candles 1620733723572-11c53f73a416 ·
g-dropper 1573461160327-b450ce3d8e7f · g-hands 1519824145371-296894a0daa9 ·
g-jungle 1470058869958-2a77ade41c02 · g-oil 1515377905703-c4788e51af15 ·
g-river 1552733407-5d5c46c3bb3b · g-temple 1528181304800-259b08848526 ·
g-towels 1540555700478-4be289fbecef · hero-candle 1598901986949-f593ff2a31a6 ·
hero-room 1560750588-73207b1ef5b8 · hero-stones 1600334129128-685c5582fd35 ·
room-thai 1582719478250-c89cae4dc85b · t-back 1519823551278-64ac92734fb1 ·
t-face 1616394584738-fc6e612e71b9 · t-foot 1519415510236-718bdfcd89c8 ·
t-oil 1544161515-4ab6ce6db874 · t-stone 1600334089648-b0d9d3028eb2 ·
t-thai 1617952986600-802f965dcdbc · tea 1564890369478-c89ca6d9cde9
