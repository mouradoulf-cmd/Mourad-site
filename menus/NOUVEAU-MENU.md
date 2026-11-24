# New QR menu = the "Premium" template (Fisherman's Garden / Mae Lek)  — always

Mourad's decision (2026-11-24): every QR menu built from now on starts from `menus/fishermans-garden/` (real restaurant,
200 dishes) or `menus/mae-lek/` (demo, HD photos) — never from an older menu (giulivo, steak-dek-naew, thai-seafood are legacy).

## What the template gives (all in the shared engine, nothing to rebuild)
20 languages with flags (compact flag pill + flag sheet), photo-led dish cards with price + add on the photo, quantity stepper,
animated selection bar, photo category tabs, large/grid views, 3D auto showcase ("recommended"), search, spice/diet filters,
sold-out dishes, allergens, "goes well with", WebGL opening photo, 7 identities (`theme`, or `?styles=1` in sales mode).
Prices stay in the menu's own currency (no conversion). Details: `menus/PLUS.md`.

## Recipe (≈ 1 h when the photos and the menu are legible)
1. `cp -r menus/fishermans-garden menus/<slug>`; delete the dish photos/`menu.js` content, keep `index.html` wiring
   (i18n-extra.js BEFORE menu.js data, engine, menu-plus, menu-plus-lux, menu-plus-cards + their CSS) — bump the `?v=` numbers.
2. `menu.js`: `slug`, `name`, `wordmark`, `langs` = the 20 codes in the order of `NM_I18N_X.order`, `origLang` (th), `defaultLang` (en),
   `photoOne:true`, `thumbs:true`, `cards:true`, `plus:{cards:true, hero3d:true, layout:"grid"|"large", featured:[≥3 ids with photos],
   crops:[same ids], pairs:{<sectionId>:[drink ids]}}`. Optional: `theme` (identity), `info` (ONLY real hours/address/links).
3. Content = what the photos of the paper menu really say (prices in baht, never invented). Every dish `sn` (name) in the 20 languages
   (th en zh zt ru ko ja hi ms id lo de fr it vi km fil ar he es); `d` (description) only if the menu has one. Missing language → English fallback.
4. Photos: only the restaurant's real photos (or clearly labelled illustration photos). `python3 menus/tools/prep-images.py menus/<slug> id1,id2,id3…`
   makes the `-m`, `-t` and (featured) `-sc` files the cards/showcase need. Hero: `hero.webp` + `hero-m.webp`.
5. QA before showing (scripts in `menus/tools/qa/`, run with the local server on :8765 and Playwright from /opt/node-tools): `ftabs.js` (tab = category on
   screen, tab click lands, language switch keeps category), `f20.js` (20 languages × overflow/images/missing strings), `fa11y.js`, `f404.js`, `fperf.js`.
   Then LOOK at screenshots on 390 px (phone) and 1280 px, in fr + th + ar. Zero errors, zero 404, zero overflow, or it is not done.
6. Subscription line in `menus/abonnements.json`, QR panel PDF, PROJETS.md — as in the "nouveau client menu QR" procedure.

## Never
- Photos/dishes/prices/reviews/hours that the restaurant did not supply. Machine translations go to a native for proofreading before the client pays.
- Currency chips, decorative 3D objects, a "Style" button visible to a client's customers (it is `?styles=1` only).
