# Malee — massage/spa demo site

Fictional generic massage/spa demo — inspired by a real Pattaya spa
found via Google Maps early on, but **genericized** (like Trenchtown →
"One Love"): invented name, no real address, no real review numbers.
Built with the `editorial-service-booking` skill: warm ivory palette +
near-black chapters, serif Fraunces + sans-serif Inter, accessible
treatment selector (keyboard + screen reader), cinematic GSAP/Lenis
motion (preloader, fullscreen menu, custom cursor, scroll reveals,
animated counters).

Static HTML / CSS / JS, no install, no build step.

## Run it locally

```bash
python3 -m http.server 8000
```

then open http://localhost:8000/v6-thai-spa/

## Why it's fictional

This started as a demo built from a real business's public Google
Maps listing. Once photos entered the picture, it became clear the
honest path was to genericize rather than publish someone else's real
identity without consent — same rule the repo already applies to
Trenchtown. All real-world specifics (name, exact address, Google
review count, Facebook page) have been removed or replaced with
generic/illustrative copy.

## Redesign with 21st.dev references

The page was redone using components found through the 21st.dev MCP
catalog as layout references, re-implemented in plain HTML/CSS/JS (no
React, no build step — same as every other site in this repo):

- Hero — "Editorial Image Hero": full-width photo band fading into the
  paper, with a split tagline / large serif headline below.
- About — "Editorial Collage Hero": two layered photos + count-up stats.
- Treatments — "Hover Expand Gallery": hairline panels with vertical
  labels; the open one expands to photo + details. Accessible accordion
  (buttons with `aria-expanded`, arrow/Home/End keys, tap to open, no
  hover dependency). Below 1024px it becomes a vertical accordion.
- Booking — "Appointment Intake Match": 4-step request (treatment,
  length, preferred time, details) with a live summary card. Choices are
  kept in `sessionStorage`, and it sends an email *request* — it never
  claims a slot is booked.

## Photos

`hero-treatment.jpg` and `hero-hot-stone.jpg` are genuine Unsplash
downloads (free license). Foot reflexology and skin treatments still use
labelled color-block placeholders. `hero-storefront.jpg` is **not used**:
it shows a real business's sign ("Once Upon a Thai"), which contradicts
the fictional Malee identity.

## Customization

- Name, copy: `index.html`.
- Palette / typography: CSS variables at the top of
  `assets/css/style.css`.
- Treatment panels, booking steps, scroll progress: `assets/js/main.js`.
- Motion (preloader, cursor, menu, counters):
  `assets/js/premium.js` and `assets/js/animations.js`.
