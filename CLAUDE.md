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

## Avatar Cash funnel — reference template for course/info-product funnels

The user supplied two screen recordings of an app-style onboarding funnel
(arab-facile.com: splash → welcome → mascot chat questions → "analysing your
profile" → personalised plan → paywall with plan cards and Free/Premium table)
and asked to reuse that flow for **every** future course/formation.
Implemented in `avatar-cash-th/start.html`, `assets/css/app.css` and
`assets/js/funnel.js` (TH/FR/EN copy in the `FN` object, questions in `FLOW`,
theme tokens in `:root` of `app.css`; payment + contact config stays in
`assets/js/main.js` `CONFIG`). To make a new course: copy the folder, change
`FLOW`, `FN`, tokens, plans and the course content.
- Landing page (`index.html`) CTAs lead to the funnel, not straight to checkout.
- Do **not** copy the reference's fake social proof ("4,8/5, +20 000 learners"),
  fake discounts/strike-through prices or a fake countdown. The paywall timer
  only shows when `CONFIG.OFFER_END` is set to a real end date.
- Videos in `assets/video/` are rendered from `/tmp`-style HTML scenes with
  Playwright + ffmpeg (see git history); outputs are checked in.

## NM Academy — reference template for premium / "futuristic" course-selling sites

`nm-academy/` sells two courses (Plan A: build & resell websites, Plan B: AI video
monetisation on TikTok/YouTube) under the user's NM Studio brand (same `#04050c` base).
FR/EN/TH via `assets/js/i18n.js` (`[fr,en,th]` per key, `data-t` in HTML), all settings in
`assets/js/config.js`, UI sounds in `assets/js/sfx.js` (Web Audio, no music, only after a
user gesture), effects in `assets/js/fx.js`. Same honesty rules as Avatar Cash: no income
guarantees, no fake proof, illustrative numbers must be labelled as examples.

## NM Studio client demos (prospecting workflow)

The user scouts a business and sends name, type, city, photos and an old-site / Google Maps URL. Build a
personalised demo from the closest template (Giulivo, Noir, Mae Lek, ÔBlanc, Neon Tiger, Malee, Ride Siam,
Façadiers): copy it to `demos/<slug>/` on the published branch `claude/thai-app-mnw166`, swap in their photos,
name, copy and an adjusted palette, add `<meta name="robots" content="noindex">` and the "maquette gratuite"
label, then add one line to `nm/assets/js/demos-data.js` (slug, name, type, city, date, status). The private
page `nm/demos.html` ("Mon espace") lists them A–Z with status, QR code and WhatsApp share, and also holds
every link the owner uses (`window.NM_LINKS` in the same data file) — add any new public page/project there so
the owner never has to ask for URLs. Before handing over a demo, test it yourself (Playwright, mobile + desktop,
no console errors, no horizontal overflow, all photos load, brand name replaced everywhere) and fix issues
without waiting to be asked; then give the owner the hub link plus the demo link. Never invent reviews/ratings for a
real business — remove the template's sample reviews/star counts or label them clearly as placeholders.


## "Mon espace" — the owner's private hub (keep it up to date in EVERY conversation)

`nm/demos.html` on the published branch `claude/thai-app-mnw166` is the owner's home-screen app
(https://mouradoulf-cmd.github.io/Mourad-site/nm/demos.html). Home screen = three spaces: **Site web**
(client demos A–Z + NM Studio links + tools + templates), **Vidéo IA**, **Formation**. All content comes from
`nm/assets/js/demos-data.js`: `NM_DEMOS` (client demos) and `NM_LINKS` (groups with `space: "site" | "video" |
"formation"`). Whenever you publish a new page, project, demo or course in any conversation, add it to the right
space there and set `NM_UPDATED` to today's date — without being asked. When the owner says "ajoute ça dans
Vidéo IA / Formation / Site web", add the link to that space.
Pick the space by what the work is about — never dump everything in "Site web":
- **Vidéo IA** (`space: "video"`): AI video studios/tools, video projects, generated films, TikTok/YouTube video work.
- **Formation** (`space: "formation"`): courses and their pages (NM Academy, Avatar Cash, English Easy, members areas, funnels).
- **Site web** (`space: "site"`): NM Studio site, client demos (`NM_DEMOS`), website tools and templates.
At the end of any task that publishes or changes a page, tell the owner in one line which space it is in
("c'est dans Mon espace → Vidéo IA") along with the URL. The page fetches the data file fresh on every open.
