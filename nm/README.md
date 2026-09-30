# NM Studio — site, offers & payments

Plain HTML/CSS/JS, no build step. Hosted on GitHub Pages
(`claude/thai-app-mnw166` is the Pages source branch).

| Page | What it does |
|---|---|
| `index.html` | Home: cinematic hero, 3-screen story, the 4 offers (+ detail dialog), why us, before/after, "customers lost" calculator, live work previews, process, QR demo, Pattaya map, FAQ, WhatsApp CTA |
| `services.html` | The 4 offers in depth, "which offer is right for you", comparison table, service FAQ |
| `pricing.html` | Prices, care plan with Monthly / Yearly toggle, comparison table, pricing FAQ |
| `checkout.html` | 4-step checkout: offer + care plan → details → payment → review (promo code) → confirmation |
| `success.html` / `cancel.html` | After Stripe: payment received (confetti + order recap) / payment failed (retry, PromptPay) |
| `account.html` | "My account": opens the Stripe customer portal (invoices PDF, card, billing period, cancellation) |
| `legal.html` | Legal notice, terms of sale, privacy (PDPA + GDPR), cookies |

Languages: EN (baked into the HTML), FR, IT, TH, AR (RTL). New strings live in
`assets/js/nm-dict.js`; the original ones in `assets/js/i18n.js`; checkout ones
in `assets/js/checkout-i18n.js`. Every new string needs all five languages.

## Offers and prices

Everything is in **`assets/js/offers-config.js`**:

| Offer | One-time | Care plan (optional) |
|---|---|---|
| Google Business Profile | ฿990 | — |
| QR Menu | ฿1,990 | ฿290 / month |
| Complete Pack | ฿4,990 | ฿590 / month |
| Ultimate + Social | ฿9,990 | ฿1,490 / month |

Yearly care plan = 10 months (2 months free). Visitors reading in another
language see an approximate amount in € (or DH in Arabic), hand-rounded.

### Hero video (16:9, ≤ 2 MB)

Put the files in `assets/video/` and fill `hero` in `offers-config.js`:
`mp4` (H.264, required), `webm` (optional, lighter), `mp4Mobile` (optional
720p for phones) and `poster` (a still frame shown instantly). The video
autoplays muted and looping behind a dark veil, pauses off screen, and is
skipped with reduced motion or data saver. Left empty, the photo reel plays.
Encode with: `ffmpeg -i in.mov -t 10 -vf scale=1920:-2 -c:v libx264 -crf 26 -preset slow -an -movflags +faststart hero.mp4`
(and `-c:v libvpx-vp9 -crf 36 -b:v 0 hero.webm`).

### Offer videos (15–20 s, ≤ 2 MB each)

Put the MP4 files in `assets/video/` and fill `videos` (and optionally
`posters`) in `offers-config.js`. Until then each offer shows its animated
illustration (pure SVG + CSS, `assets/js/offer-icons.js`).
Encode with: `ffmpeg -i in.mov -vf scale=1280:-2 -c:v libx264 -crf 28 -preset slow -an -movflags +faststart out.mp4`.

## Payments — how it works (no server needed)

Card data never touches this site. Payments go through **Stripe-hosted pages**
(PCI-DSS handled by Stripe, 3-D Secure/SCA automatic, fraud screening by
Stripe Radar), plus Thai QR PromptPay generated in the browser.

```
Offer card ─► checkout.html (offer, care plan, details, method, review, promo)
               ├─ Card / Apple Pay / Google Pay ─► Stripe Payment Link ─► success.html
               ├─ PromptPay ─► QR with the exact amount + slip ─► WhatsApp
               ├─ Bank transfer ─► bank details ─► WhatsApp
               └─ Pay at the meeting ─► WhatsApp
Care plan renewals, invoices, failed-payment retries, card updates,
cancellation ─► Stripe Billing + Customer portal (account.html)
```

### Setting up Stripe (test mode first)

1. Create a Stripe account for your business (country: Thailand), and switch
   the dashboard to **Test mode**.
2. **Products** → create the 4 offers with a one-time price in THB, and the 3
   care plans with two recurring prices each (monthly, and yearly = 10×).
3. **Payment Links** → create one link per combination (10 links):
   `google, qr, pack, ultimate` (offer only) and `qr_monthly, qr_yearly,
   pack_monthly, pack_yearly, ultimate_monthly, ultimate_yearly` (offer
   one-time price + the care recurring price in the same link). In every link:
   - allow promotion codes (the checkout's promo field pre-fills them);
   - collect phone number (optional);
   - after payment → redirect to `https://mouradoulf-cmd.github.io/Mourad-site/nm/success.html`.
4. Paste the 10 URLs into `card` in **`assets/js/payment-config.js`**.
5. **Settings → Billing → Customer portal** → enable invoices history,
   payment-method update, switching between monthly/yearly, and cancellation
   (at period end). Copy the **login link** into `portal`.
6. **Settings → Customer emails** → turn on: successful payments (receipts),
   invoice emails with PDF, upcoming renewal reminders, failed-payment emails
   and cancellations. **Settings → Billing → Revenue recovery** → Smart
   Retries (e.g. 3 retries), then mark the subscription unpaid.
7. Test with card `4242 4242 4242 4242`, any future date, any CVC; try
   `4000 0027 6000 3184` for 3-D Secure.

The admin dashboard (revenue, MRR, subscribers, payments, refunds, CSV/PDF
exports, charts) is **Stripe's own dashboard** and mobile app — nothing to
host or secure yourself.

### Going live

Recreate the products and Payment Links in **Live mode** (or copy them from
test mode), replace the 10 URLs and the portal link in `payment-config.js`,
and push. Also fill `promptpay` (+ `promptpayName`) and, if you want, `bank`.

### About PayPal and a custom back end

A Thai Stripe account offers cards, Apple Pay, Google Pay and PromptPay, but
not PayPal. Accounts, webhooks, a custom admin and Resend emails would need a
server (e.g. Next.js on Vercel + Supabase + Resend); this static setup was
chosen so there's nothing to host, patch or secure, and Stripe already sends
receipts, invoices and dunning emails.

## To complete before promoting the site

- **Legal page**: add the street address in Pattaya and the tax ID once
  issued (refund rule confirmed by the owner).
- **Testimonials**: intentionally none until there are real ones.

## Design system — v3.2 "Violet Night"

- Colours (`assets/css/nm.css` `:root`), tuned to the hero video: night
  `#030305`, surface `#0a0a10`, text `#ffffff`, muted `#a9a9b8`; signature
  violet `#8a63f8` (token still named `--jade`; soft `#c9b8ff`, deep
  `#5c43fa`), electric blue `#5a8cff` (`--ice`), text/price gradient
  `#9c7afa → #5a8cff` (`--brand`, `--lux`), CTA gradient `#7a55f0 → #5c43fa`
  with white text (`--accent-grad`, AA), neon green `#00ff88` live dots.
- Hero: the video in `assets/video/` (`hero.webm` VP8 1080p, `hero.mp4`
  H.264 1080p, `hero-m.mp4` 960p for phones; 5 s city → penthouse → studio
  desk), set in `NM_OFFERS.hero` with `loop: false`: it plays once and rests
  on its last frame; `assets/img/hero-video-end.*` is that frame, shown with
  reduced motion, data saver or without JavaScript. On desktop the video is
  118 % wide so the desk sits right of the headline, under a left-to-right
  dark veil. Replace the files (same names) to change the hero.
  The video was supplied by the owner as a demo from a third-party design
  prompt: swap it for footage the studio owns before promoting the site.
- Type: Bricolage Grotesque (display headings), Newsreader italic (the key
  word of each heading), Geist (text), Geist Mono (prices, labels) — all
  self-hosted; Noto Sans Thai / IBM Plex Sans Arabic loaded on demand.
- Components: glass cards with layered shadows and a pointer-lit border
  (`.offer`, `.pcard`, `.reason--card`), `.btn--sun / --glass / --ghost`
  with sweep fill + ripple, `.lift` sections (overlap the previous one),
  `.om` offer dialog (grows out of the clicked card), `.pv` live preview.
- Motion (`main.js` + `fx.js`, GSAP + ScrollTrigger + Lenis): intro curtain
  once per session, letter-by-letter hero title, hero closing into a card on
  scroll, two marquees whose speed/direction follow the scroll, story image
  masks, offer tilt + count-up prices, slot-machine calculator, pinned
  horizontal work gallery (desktop, LTR), QR codes assembling module by
  module, footer reveal, cursor dot + ring + light trail (native cursor kept),
  magnetic buttons, animated underlines. Everything has a
  `prefers-reduced-motion` fallback; content is visible without JavaScript.
- QR codes are real: `assets/js/nm-qr.js` computes them (vendored
  qrcode.min.js) and draws SVG modules — `data-qr="menu"` (live demo menu),
  `data-qr="whatsapp"` or any URL. The offer illustration, the "Scan it"
  card and the finale's "On a computer?" card all scan.

## Photos

Unsplash License. Hero: 1716638298765 (Bangkok neon street),
1785011070032-e7c04afab462 (street-food wok), 1667038408487 (lantern
restaurant). Story: 1779365340849 (visitor with phone), 1779540174821 (empty
restaurant), 1695606453510 (full restaurant). All colour-graded warm.
