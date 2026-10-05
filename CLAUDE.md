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

## Avatar Cash TH — reference template for info-product / online-course sites

`avatar-cash-th/` is a Thai-language sales site for an "AI avatar influencer"
course (copied from a TikTok video's Claude-built "Avatar Cash" idea): dark
palette with green/violet accents, `Noto Sans Thai`, sales page (`index.html`),
gated members area with the 5 modules (`members.html`), and `LAUNCH-KIT.md`.
Payment/contact are driven by the `CONFIG` block at the top of
`assets/js/main.js` (LINE OA + PromptPay) — placeholders until the client
fills them. No fake testimonials/income claims, keep disclaimers. Plain
HTML/CSS/JS, no build step.

## AI Skill FR — reference for "explainer film" course-sales sites

`ai-skill-fr/` (French only; `skill-ai-th/` is the older TH/FR/EN version with the
same checkout/members/free pages). One-page site where a big ▶ button opens a
fullscreen 3D explainer film (`assets/js/film.js`: deterministic `render(t)`
scenes, CSS 3D, canvas starfield, optional French voice-over via
`speechSynthesis`, captions, scrubber) that ends on the offers with buy
buttons. Prices/links/codes live in the `CONFIG` block of `assets/js/main.js`.
Keep the honesty rules: no income promises, "free" = free tiers with quotas.

## Atelier des Façadiers (refonte) — reference for B2B / industry sites with interactive product tools

`atelier-des-facadiers/` is a 7-page French rebuild of atelierdesfacadiers.com
(real content, photos and contacts from the client's site). Direction "plan
d'architecte": limestone + ink, logo navy `#244760`, signal orange, Archivo (wide)
+ Instrument Sans + IBM Plex Mono, self-hosted fonts. Signature pieces to reuse:
scroll-driven 3D exploded product cross-section (`.xv`), product configurator
rendering an SVG and prefilling the quote form (`#cfg`), photo-slideshow hero with
panel-reveal. `assets/js/site.js` has a `CONFIG` block for the form target.

**Multilingual (FR/EN/DE/NL/ES):** French pages at the root are the source of truth
(generated from a Python build — not in the repo); `en/ de/ nl/ es/` hold the same 7 pages
translated (assets via `../assets/`). Static text is baked per language; dynamic strings
(configurator, form, errors) live in `assets/js/i18n.js` (`window.I18N[lang]`, French is the
fallback in `site.js`). Language switcher = `.lang` in the header; the French pages only
*suggest* the visitor's language (never auto-redirect). Form recap sent to the client stays
in French. Keep "ça va barder !" and the word "bardillons" untranslated. Editing French copy
means updating the four translations too.

**v3 "excellence" layer (Atelier des Façadiers):** `assets/js/fx.js` (entrance loader, page-wipe
transition, contextual cursor — additive, native cursor never hidden —, 3D tilt, optional synthesised
sound OFF by default) and `assets/js/hero3d.js` (lazy Three.js scene, self-hosted in
`assets/vendor/`, skipped on touch / reduced-motion / software GL / weak devices, with a perf
governor). Orange text on light backgrounds must use `--signal-t` (AA). Design rationale, motion
justifications, a11y/perf results and before/after in `atelier-des-facadiers/DESIGN.md`.
Appending `#gl=force` to the home URL forces the 3D scene for debugging.
