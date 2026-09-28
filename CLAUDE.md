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
Façadiers for B2B). Built with no real photos supplied — the "lookbook"
section uses editorial color-block cards instead of photography, honestly
labeled as placeholder ("your own photos would replace these on launch").
Swap those for real client photos once available; everything else
(services, pricing, copy) adapts per client same as the other templates.

- Design language: near-black warm palette (`--ink`, `--cream`, `--bronze`
  in `assets/css/style.css`), `Bodoni Moda` italic display serif +
  `Manrope` sans-serif body, thin gold hairline accents, editorial/
  fashion-magazine feel rather than Giulivo's rustic warmth or Façadiers'
  corporate brightness.
- Sections: hero (with decorative animated SVG "hair strand" lines, no
  photo), services marquee, services grid (price list), about/philosophy
  with count-up stats, lookbook (color-block cards), reviews carousel,
  booking (WhatsApp deep link), contact (address/hours/map), footer.
- Interactions: vanilla JS only (no GSAP/Lenis) — IntersectionObserver
  scroll reveals, count-up stats, testimonial carousel, mobile burger
  menu. Same "visible by default, hidden state only switched on right
  before a confirmed-working observer" safety pattern as the other
  templates use for GSAP — keep it if you add reveals elsewhere.
- Plain HTML/CSS/JS, no build step, same as the other templates.
- Booking/phone CTAs use `tel:`/`wa.me` links — always add
  `target="_blank" rel="noopener"` to them, same reason as above.

## NM Studio — the studio's own site (`nm/`)

Plain HTML/CSS/JS, no build step, split into:
`nm/index.html` (English baked in for SEO/no-JS), `nm/assets/css/nm.css`,
`nm/assets/js/i18n.js` (EN/FR/IT/TH/AR dictionaries, per-language currency
€/฿/DH, RTL for Arabic — every new string needs all five languages),
`nm/assets/js/main.js` (Lenis + GSAP/ScrollTrigger choreography, vendored in
`assets/js/vendor/`), `nm/assets/js/hero-gl.js` (raw WebGL light field).
Showcase screenshots live in `nm/assets/img/work/` and are captured from
the live demos with Playwright; the Façadiers one uses a people-free frame
of its own hero video (the video carries a clideo.com watermark — crop
above it). Content is visible by default; motion is only layered on once
GSAP has loaded. `nm/checkout.html` is the plan checkout (`assets/js/checkout.js`,
`assets/css/checkout.css`, strings in `assets/js/checkout-i18n.js` merged via
`window.NM_EXTRA_DICT`). Payment methods are configured in
`nm/assets/js/payment-config.js` (Stripe Payment Links per currency/plan,
PromptPay ID — the QR payload is generated client-side — and bank details);
anything left empty falls back to finishing the order on WhatsApp. Never
add card-number fields to the site. Deployed via the `claude/thai-app-mnw166` branch, which is
the GitHub Pages source (not `gh-pages`).
