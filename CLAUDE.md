# Repo notes

Multi-project repo of demo/showcase websites (one static site per client type).

## Giulivo — reference template for restaurant / fast-food sites

The user has explicitly asked to reuse **Giulivo** (`index.html`, `en.html`,
`de.html`, `th.html`, `assets/`) as the base style/reference for any future
restaurant or fast-food site built in this repo. When starting a new
restaurant/fast-food project, start from Giulivo's structure and adapt
rather than designing from scratch:

- Design language: dark warm palette (`--terracotta`, `--olive`, `--gold`,
  `--cream`, `--ink` in `assets/css/style.css`), `Fraunces` display serif +
  `Jost` sans-serif body, ambient glow blobs, glassmorphism navbar.
- Sections: hero, stats, story, motto, menu (with modal for full menu),
  gallery, reviews, reservation form (WhatsApp deep link), contact
  (address/hours/map), footer.
- Interactions: scroll-triggered GSAP/ScrollTrigger + Lenis smooth scroll,
  optional decorative custom cursor dot (never hide the native cursor —
  keep it additive, see git history for the bug this caused), scroll
  progress bar, mobile burger menu, language switcher (IT/EN/DE/TH,
  instant client-side switch via `assets/js/i18n.js` — one dictionary per
  language, `data-i18n*` attributes on the DOM; each `.html` file also
  ships its own language baked in for no-JS/SEO). Adding a new language
  means: a new dictionary block in `i18n.js`, a new baked `.html` file,
  the switcher link added to *all* existing language files, and a Google
  Fonts fallback in `--font-display`/`--font-body` if the script needs one
  Jost/Fraunces don't cover (see `Noto Sans Thai` for Thai).
- Plain HTML/CSS/JS, no build step — keep new restaurant sites the same way
  unless asked otherwise.
- Booking/phone CTAs use `tel:` links — always add `target="_blank"
  rel="noopener"` to them (needed for the Claude artifact demo sandbox,
  harmless on a real deployed site).

## Façadiers — reference template for company / B2B sites

The user has asked to reuse **Façadiers** (`facadiers/index.html`,
`facadiers/assets/`) as the base style/reference for any future company,
trade, or B2B/professional-services site built in this repo (as opposed to
Giulivo, which covers restaurants/fast-food). `atelier-facadiers/` is the
original React/Vite/TypeScript source this was converted from — kept only
as historical reference, not edited directly (same relationship as
`basilico-app/` to `basilico/`).

- Design language: bright corporate palette on white/off-white
  (`--navy`, `--slate`, `--teal`, `--yellow`, `--pink`, `--blue`, `--purple`
  as accent colors in `assets/css/style.css`), `Playfair Display` serif for
  emphasis (`<em>`) + `Inter` sans-serif for everything else, large radii
  (`--radius-lg/md/sm`), pill-shaped buttons.
- Sections: header with pill CTA + burger menu, hero (full-bleed photo,
  headline, single CTA), brand/logo marquee band, pillars/services grid,
  about, projects/portfolio, CTA band (phone + contact), footer.
- Plain HTML/CSS/JS, no build step — keep new company sites the same way
  unless asked otherwise.
- Phone CTAs use `tel:` links — always add `target="_blank" rel="noopener"`
  to them, same reason as Giulivo above.

When starting a new company/B2B project, start from Façadiers' structure
and adapt (new palette, new copy/photos, keep or drop sections as the
client's business needs) rather than designing from scratch.

## Noir — reference template for hair salon / beauty sites

The user has asked to reuse **Noir** (`noir/index.html`, `noir/assets/`) as
the base style/reference for any future hair salon, barbershop, or beauty
site built in this repo (as opposed to Giulivo for restaurants and
Façadiers for B2B). Rebuilt as a premium site with real photography
(Unsplash License, sources in `noir/README.md`); the studio, team names,
reviews and phone number are demo content to swap per client.

- Design language: near-black warm palette (`--ink`, `--cream`, `--bronze`
  in `assets/css/style.css`), `Bodoni Moda` (italic for emphasis) +
  `Manrope`, both self-hosted variable woff2 in `assets/fonts/` (small serif
  headings pin `font-variation-settings: "opsz" 14` so hairlines stay
  sturdy). Editorial/fashion-magazine feel.
- Sections: intro curtain (once per session), full-bleed photo hero with
  live Bangkok-time "open now" status, marquee, studio + count-up stats,
  services menu (ARIA tabs, photo per category), ritual steps, lookbook
  bento (explicit `grid-template-areas`, no holes) + lightbox, team,
  reviews carousel, booking (service → stylist → calendar → time slots →
  WhatsApp message; mobile shows a compact recap instead of the summary
  card), FAQ, contact (hours with today highlighted, map), final CTA.
- The bento/lightbox and the calendar+slots are vanilla ports of 21st.dev
  patterns ("Interactive Bento Gallery", "Preset Time Selection Calendar").
- i18n EN/FR/TH in `assets/js/i18n.js`: English is baked into the HTML and
  captured from the DOM, so only FR/TH dictionaries exist; strings built
  in JS live in its `UI` table (all three languages). Prices follow the
  language (`CURRENCY`/`PRICES` in `i18n.js`: EN → USD, FR → EUR, TH → THB,
  hand-rounded, not live-converted); menu prices carry `data-price="key"`,
  and a "guide price, paid in baht" note shows outside THB.
- Interactions: vanilla JS only (no GSAP/Lenis). Reveals only hide content
  after IntersectionObserver is confirmed (`html.reveal-ready`); clip
  reveals put the `clip-path` on the inner `<picture>`, never on the
  observed element (a fully clipped element never intersects).
- Plain HTML/CSS/JS, no build step, same as the other templates.
- Booking/phone CTAs use `tel:`/`wa.me` links — always add
  `target="_blank" rel="noopener"` to them, same reason as above.

## Neon Tiger — reference template for bars / pubs / nightlife

The user asked for a festive Pattaya bar site (pool, beer, parties);
**Neon Tiger** (`neon-tiger/`) is the reference for future bar, pub or
nightlife sites. Photos: Unsplash + CC0 pool shots (sources in
`neon-tiger/README.md`); bar name, events, prices and reviews are demo.

- Design language: night palette (`--night`, neon `--pink`/`--cyan`/
  `--violet`, `--amber` for beer and happy hour, `--green` for pool) with
  text-shadow neon glows (`.glow`, `.glow--amber`, `.glow--green`);
  `--pink-btn` is the darker pink used under white text (AA contrast).
  Fonts self-hosted: `Unbounded` (display, uppercase), `Monoton` (neon
  sign logo), `Manrope` (body).
- Sections: neon-sign intro, hero slideshow + live panel (open status,
  happy-hour countdown, tonight's event — Bangkok time, a night after
  midnight still counts as the previous evening), tilted marquee, the bar,
  weekly events tabs (today highlighted), drinks tabs with happy-hour
  prices switching live, colour-changing signature cocktail, pool (free
  tables, hall of fame), bento gallery + lightbox, reviews, booking
  (night → time → people → spot → WhatsApp, ticket-style summary), FAQ,
  find us with a Thai address card for taxi drivers, final CTA.
- EN/FR/TH/RU in `assets/js/i18n.js` (English baked into the HTML). Prices
  are stored in baht and shown as EN → USD, FR → EUR, TH/RU → THB.
- The site does not market staff as an attraction: the team is presented
  as a friendly crew (keeps it usable for Google/Meta ads).
- Plain HTML/CSS/JS, no build step; `tel:`/`wa.me` links keep
  `target="_blank" rel="noopener"`.

## Malee — reference for massage / spa / wellness (`v6-thai-spa/`)

Premium rebuild (folder name kept because NM Studio links to it). Jungle
green + ivory + gold, Cormorant Garamond + Inter Tight self-hosted,
vanilla JS like Noir/Neon Tiger (`MLI18n`, EN baked + FR/TH/RU, baht →
USD/EUR/THB). Treatment cards with duration pills, a mood recommender, a
gift-card builder and a WhatsApp booking flow. Photos are Unsplash (IDs in
its README); business details are fictional demo content.

## Mae Lek — reference for street food / casual eateries (`street-food/`)

Simple but polished: paper + chili + turmeric "sticker" cards (hard ink
shadow), Rubik + Manrope + Caveat. Filterable 15-dish menu, takeaway bag →
WhatsApp order drawer, spice meter, nightly chalkboard special, phrase cards
to show the cook. `SFI18n` EN/FR/TH/RU, baht → USD/EUR/THB. Careful: i18n
rewrites the text of every `[data-price]`, so containers use `data-thb`.

## Ride Siam — reference for rentals / premium services (`scooter/`)

Premium scooter rental: graphite + off-white + tangerine, Geologica +
Inter. Fleet cards carry `data-day/-week/-month/-deposit`; a period toggle
switches displayed prices. Booking builder with a vanilla range calendar
(2 months desktop / 1 mobile), tiered pricing (7+ days weekly, 28+ monthly),
extras, delivery and a WhatsApp request; `RSI18n` EN/FR/TH/RU.

## ÔBlanc — café-restaurant demo for a real business (`oblanc/`)

Built for a real café in Mohammédia (Morocco) on the Neon Tiger structure,
recoloured to its identity (white + navy + blue neon sign, gold prices),
Fraunces + Manrope. Real address, phone, hours, Google rating and menu
prices (from menu photos); real photos from its Google listing. FR baked +
EN/AR (RTL) via `OBI18n` in `assets/js/i18n.js`. Details in `oblanc/README.md`.

## NM Studio — the studio's own site (`nm/`)

Plain HTML/CSS/JS, no build step. v4 "Night future, touch of gold"
(user-approved plan, full restructure): night `#07060c`, violet `#7b61ff` →
blue `#4f7bff` light, gold `#e6c27a` details, one stylesheet
`assets/css/site.css`. Satoshi (display) + Fraunces italic gold key word +
Inter, self-hosted. Home order: 50/50 hero « Be found. Be chosen. » (MacBook
+ iPhone cycling the 8 live demos, gold dust, orb), key figures + sectors
marquee, the 8 demos in device mockups (live preview `.pv`), 4 offers +
morphing dialog `.om`, why us (3 photos), how it works (3 steps), FAQ (8),
« Ready to be visible? » giant WhatsApp finale, footer. No testimonials
until real ones exist. Every logo must be the real brand mark (Simple Icons
paths, official Google G, PromptPay image in `assets/img/logos/`); footer
social icons stay hidden until `social` links are filled in
`offers-config.js`. Other pages: `services.html`, `pricing.html` (care plan
Monthly/Yearly toggle, comparison table), `checkout.html`, `success.html`,
`cancel.html`, `account.html`, `legal.html`. `nm/README.md` documents
everything (Stripe setup, going live).

- Offers/prices: `assets/js/offers-config.js` (`NM_OFFERS` + `NMPrice`):
  Google ฿990, QR ฿1,990, Complete ฿4,990, Ultimate ฿9,990 one-time; optional
  care plan 0/290/590/1,490 ฿/month, yearly = 10 months. Baht is always the
  real price; `data-thb` renders it, `data-approx` shows ≈ €/DH.
  `videos` slots for the 4 offer videos (animated SVG `offer-icons.js` until
  then — CSS animations override SVG `transform` attributes, so animate
  inner elements, never ones carrying `transform="…"`).
- i18n EN/FR/IT/TH/AR (RTL): original strings in `assets/js/i18n.js`, new
  ones in `assets/js/nm-dict.js` (merged via `NM_EXTRA_DICT`, loaded before
  i18n.js), checkout ones in `checkout-i18n.js` (merges too). Every new
  string needs all five languages.
- Payments stay static: Stripe Payment Links per offer / offer+care
  (`payment-config.js`: `google…ultimate`, `qr_monthly…ultimate_yearly`,
  `portal` = customer-portal login link), redirect to `success.html`;
  PromptPay QR generated client-side; anything empty falls back to WhatsApp.
  Never add card-number fields. Thai visitors get the Thai QR flow (order
  ref, 15-min validity, save-as-image, slip upload → WhatsApp);
  `checkout.html?demo=1` previews it with a sample QR.
- Pages share partials generated by an authoring script (not in the repo):
  when editing header/footer/offer cards, update every page.
- GSAP gotcha: elements with a CSS `transition: transform` must use
  `fromTo` + `clearProps` (and `transition:none` during the tween), or GSAP
  reads a mid-transition value as the resting state and cards stay offset.
- QR codes are always real (`nm-qr.js` → SVG modules, `data-qr`); never
  draw a fake QR. Motion lives in `main.js` (GSAP), `home.js` (home only:
  dust, hero device carousel, tilt) and `fx.js` (cursor trail, ripple,
  marquee speed, count-up).
- Showcase screenshots in `nm/assets/img/work/` are captured from the live
  demos with Playwright (1280×800 and 390×780 @1.5 → jpg + webp + 360w).
  Deployed via the `claude/thai-app-mnw166` branch (GitHub Pages source).
- The user wants the live link sent at the end of every finished change:
  https://mouradoulf-cmd.github.io/Mourad-site/nm/ (plus the page changed).
