# QR menu "Plus / Lux" (opt-in, per restaurant)

Files: `assets/menu-plus.js/.css` (search, 3D auto showcase, pairings, info card) and `assets/menu-plus-lux.js/.css`
(identities, WebGL photo, filters, currency chips). Load them after `assets/menu.js` in the restaurant's `index.html`, then add to its `menu.js`:

```js
"plus": {
  "theme": "noir",            // noir | ivoire | trattoria | kaiseki | bistro | tropical | modern   (omit = the restaurant's own colours)
  "styles": true,             // floating "Style" button for sales demos — REMOVE for a live client
  "hero3d": true,             // WebGL opening photo (parallax, light sweep, ripple, grain); falls back to the photo
  "fx": true,                 // "approx. prices in € $ £ ¥ ₩ ₹" with live ECB rates (menus priced in ฿ only)
  "featured": ["id1","id2"],  // dishes of the 3D showcase (≥3, with photos). Omit = first photo of each section
  "crops": ["id1"],           // non-HD menus: ids that have a 4:5 crop  <img>-sc.webp  (720×900) for the showcase
  "pairs": { "<sectionId>": ["drinkId1","drinkId2"] },   // "goes well with" in the dish sheet
  "info": { "hours":[sun..sat each ["11:00","22:00"] or null], "utc":7, "address":"", "instagram":"", "google":"", "maps":"", "phone":"" }
}
```
Item fields read when present (nothing is invented): `soldout:true`, `diet:["veg","vegan","gf","halal"]`, `hot:1-3`.
Menu level: `"thumbs": true` + a `<img>-t.webp` (288×288) per photo makes the dish list light (FG: 11.5 MB → 1.5 MB).
No data → that block is simply not shown (info card, diet chips, sold-out).
