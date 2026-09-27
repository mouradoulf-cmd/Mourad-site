# Sabai House — massage/spa demo site

Fictional generic massage/spa demo — inspired by a real Pattaya spa
found via Google Maps early on, but **genericized** (like Trenchtown →
"One Love"): invented name, no real address, no real review numbers.
Built with the `editorial-service-booking` skill: warm ivory palette +
near-black chapters, serif Fraunces + sans-serif Inter, accessible
treatment selector (keyboard + screen reader), cinematic GSAP/Lenis
motion (preloader, fullscreen menu, custom cursor, scroll reveals,
tilt cards, animated counters).

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

## Photos: still a placeholder, on purpose

No real photos are used — the hero and treatment sections are honestly
labelled color-block placeholders. Several rounds of images sent for
this demo turned out to be non-free (a Klook-watermarked photo, an
Alamy-watermarked stock photo, and photos of real staff at two
unrelated real massage shops) — none of those are safe to use, fictional
demo or not, since using someone else's paid stock photo or a stranger's
photo without consent stays a problem regardless of the site's name.

To finish this properly:
- Photos genuinely licensed for reuse (e.g. downloaded from Unsplash,
  which is free to use) — drop them into `assets/img/` and reference
  them in `index.html` the way Giulivo does (`assets/js/vendor/` stays
  library code only).
- Or AI-generated original images (SYZEL, when connected in a Claude
  Code session) — fully original, no licensing question.

## Customization

- Name, copy: `index.html`.
- Palette / typography: CSS variables at the top of
  `assets/css/style.css`.
- Treatment selector (accessible, keyboard + tab/tabpanel ARIA):
  `assets/js/main.js`.
- Motion (preloader, cursor, menu, counters, tilt, contact form):
  `assets/js/premium.js` and `assets/js/animations.js`.
