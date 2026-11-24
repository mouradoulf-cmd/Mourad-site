# QR menu "Plus / Lux" (opt-in, per restaurant)

Files: `assets/menu-plus.js/.css` (search, 3D auto showcase, pairings, info card) and `assets/menu-plus-lux.js/.css`
(identities, WebGL photo, filters, currency chips). Load them after `assets/menu.js` in the restaurant's `index.html`, then add to its `menu.js`:

```js
"plus": {
  "theme": "noir",            // noir | ivoire | trattoria | kaiseki | bistro | tropical | modern   (omit = the restaurant's own colours)
  "styles": true,             // floating "Style" button for sales demos — REMOVE for a live client
  "hero3d": true,             // WebGL opening photo (parallax, light sweep, ripple, grain); falls back to the photo
  "cards": true,              // photo-led dish cards + quantity stepper + animated selection bar + photo category tabs + large/grid switch
  "layout": "large",          // default view: "large" (1 column) or "grid" (2 columns); the guest can switch
  "featured": ["id1","id2"],  // dishes of the 3D showcase (≥3, with photos). Omit = first photo of each section
  "crops": ["id1"],           // non-HD menus: ids that have a 4:5 crop  <img>-sc.webp  (720×900) for the showcase
  "pairs": { "<sectionId>": ["drinkId1","drinkId2"] },   // "goes well with" in the dish sheet
  "info": { "hours":[sun..sat each ["11:00","22:00"] or null], "utc":7, "address":"", "instagram":"", "google":"", "maps":"", "phone":"" }
}
```
Item fields read when present (nothing is invented): `soldout:true`, `diet:["veg","vegan","gf","halal"]`, `hot:1-3`.
Menu level: `"thumbs": true` + a `<img>-t.webp` (288×288) per photo makes the dish list light (FG: 11.5 MB → 1.5 MB).
No data → that block is simply not shown (info card, diet chips, sold-out).

## Cards layer (`menu-plus-cards.js/.css`) and 20 languages (`i18n-extra.js`)
- Menu level: `"cards": true` and one `<img>-m.webp` (4:3, ~720×540) + one `<img>-t.webp` (tiny placeholder) per photo.
- Cards: price and add control sit on the photograph; dishes without a photo become a quiet one-line card. Every +/− goes through the engine (`window.__nmMenu`), so the selection, waiter screen and totals are unchanged.
- No currency conversion any more: prices stay in the menu's own currency (baht).
- 20 languages: th en zh zt(繁體) ru ko ja hi ms id lo de fr it vi km fil ar he es. Load `i18n-extra.js` BEFORE `menu.js` data; list the codes in `langs`. A language missing from a dish falls back to English. All new strings are machine translations: have a native speaker proofread them before a restaurant goes live.
