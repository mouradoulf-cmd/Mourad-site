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
