# NM Studio — vidéo explicative (film)

## Où elle apparaît sur le site (5 langues : EN, FR, IT, TH, AR)
1. **Hero** : bouton **▶ Watch the 1-min video** à côté de « Discover the offers » → ouvre la vidéo en plein écran. « Discover the offers » = entrer directement dans le site.
2. **Section « Video tour »** (juste avant « Selected work ») : lecteur intégré dans la page, qui se lance tout seul (muet, avec sous-titres) quand on arrive dessus et se met en pause quand on le quitte ou quand l'onglet est caché. Pas de fenêtre qui s'ouvre, rien de bloquant.
   - **4 chapitres cliquables** (style tutoriel) : 0:00 pourquoi les clients ne vous trouvent pas · 0:14 quatre offres, huit sites · 0:29 menu QR, Google et déroulé · 0:52 tarifs et prochaine étape.
   - Barre de progression cliquable, pause au clic, bouton « Watch full screen » (reprend à la seconde en cours), « See the offers ».
   - Respecte `prefers-reduced-motion` : pas de lecture automatique, image fixe + bouton lecture.
3. La section est **injectée par `nm-film.js`** : aucune modification des 5 pages HTML à part le bouton du hero et les 2 lignes (CSS + JS) d'inclusion.

## Fichiers
`assets/css/nm-film.css`, `assets/js/nm-film.js`, `assets/js/qrcode-svg.min.js`, `assets/img/film/menu-phone.jpg`, `film/render.html` (rendu image par image pour exporter les MP4), `assets/video/explainer/*.mp4`.
Les prix de la vidéo viennent de `assets/js/offers-config.js` (pas écrits en dur) ; les textes sont dans l'objet `T` de `nm-film.js` (une entrée par langue, y compris la section Video tour).

## Son
**Aucun son** : ni musique, ni voix, ni effets. Les vidéos sont sous-titrées (lisibles sans son) et les MP4 n'ont pas de piste audio : à ajouter ensuite dans CapCut / TikTok.

## MP4 (WhatsApp, TikTok, Reels, Facebook)
`assets/video/explainer/` — vertical 1080×1920, sous-titres incrustés, sans audio :
`nm-explainer-{en,fr,it,th,ar}.mp4` (77 s) · `nm-short-found-{lang}.mp4` (21 s, accroche) · `nm-short-offer-{lang}.mp4` (25 s, offres + QR WhatsApp).

## Régénérer
`film/render.html?lang=en` expose `window.__nmRender(t)` et `window.__nmTotal` (77 s). Capturer à 30 fps puis encoder avec ffmpeg. Les prix de la vidéo intégrée au site se mettent à jour tout seuls ; les MP4 sont à refaire si les offres changent.
