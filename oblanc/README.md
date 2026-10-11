# ÔBlanc — demo site (café · restaurant · glacier, Mohammédia)

Plain HTML/CSS/JS, no build step at runtime (`index.html`, `assets/`). Built on
the Neon Tiger structure (neon-sign intro, live hero panel, tilted ribbons,
tabs, bento + lightbox, booking ticket, find-us card), re-coloured for ÔBlanc:
milk white + navy ink + the blue neon of the facade sign, gold for prices.
Fonts self-hosted: Fraunces (display) + Manrope (text); Noto Kufi Arabic is
loaded from Google Fonts only when Arabic is selected.

Real business data (from its Google listing and the house menu photos):
numéro 04, boulevard Hassan II, Résidence Sun Palace 01, 28820 Mohammédia ·
05 23 32 44 54 · 06:00–00:00 · delivery · 4.0 on Google (1,423 reviews),
3.5 on Tripadvisor (25) · Google highlights: terrace, excellent cocktails,
good for watching sport · Facebook facebook.com/oblanc.restaurant ·
Instagram @oblanc___ · GPS 33.7043942, -7.3691879 · Friday couscous 69 dhs.
Review quotes are real public excerpts (Google / Tripadvisor), quoted as
written; full opening hours per day are not published — only 06:00–00:00. Menu items and prices are copied from photos of the
menu (several versions exist — check with the owner before going live).

- i18n: FR baked into the HTML; EN + AR (RTL) in `assets/js/i18n.js`,
  generated from one string table by an authoring script (not in the repo).
  Dish names and descriptions stay in French, as on the real menu.
- Live panel uses Africa/Casablanca time (open status, moment of the day,
  days until Friday couscous); hours table highlights today.
- "Ma sélection": add dishes, show it to the waiter, call or copy it.
- Booking builds a request ticket, confirmed by phone (no WhatsApp number
  known yet — add one and switch the CTA to `wa.me` when available).
- Photos: ÔBlanc and its guests, from the public Google listing — to be
  replaced by the owner's own photos when the site goes live.
- `tel:` links keep `target="_blank" rel="noopener"`.
