# NM Studio — vidéo explicative (film) + bande-son

## Sur le site
Sur chaque page d'accueil (EN, FR, IT, TH, AR), le hero a un bouton **▶ Watch the 1-min video** à côté de « Discover the offers » :
- **▶ Vidéo** → ouvre la vidéo explicative en plein écran (langue de la page) ; elle finit sur WhatsApp / rendez-vous / offres.
- **Discover the offers** → entre directement dans le site.

Fichiers : `assets/css/nm-film.css`, `assets/js/nm-film.js`, `assets/js/qrcode-svg.min.js`, `assets/audio/nm-sfx-{lang}.mp3`.
Les prix de la vidéo viennent de `assets/js/offers-config.js` (jamais en dur) ; les textes sont dans l'objet `T` de `nm-film.js` (une entrée par langue).
Le menu QR de la vidéo et le QR final pointent vers le WhatsApp du site (`wa.me/qr/PYPOVXTCVM74I1`).

## Son
**Aucune musique, aucune voix** : uniquement des effets sonores synchronisés avec l'image (clavier mécanique pendant la recherche, pops, whooshes, impacts, ticks de scan, carillons, sons de pins sur la carte, étincelles à la fin). Synthétisés par programmation : aucun sample, aucun droit à payer. Bouton 🔊/🔇 dans le lecteur (choix mémorisé).

## Fichiers MP4 (WhatsApp, TikTok, Reels, Facebook)
`assets/video/explainer/` — vertical 1080×1920, sous-titres incrustés, son inclus (~-14 LUFS) :
`nm-explainer-{en,fr,it,th,ar}.mp4` (77 s) · `nm-short-found-{lang}.mp4` (21 s, accroche) · `nm-short-offer-{lang}.mp4` (25 s, offres + QR WhatsApp).

## Régénérer
`film/render.html?lang=en` affiche le film image par image (`window.__nmRender(t)`, `window.__nmTotal`). Si les prix, offres ou textes changent, régénérer les MP4 (capture à 30 fps → ffmpeg) ; la vidéo dans le site, elle, se met à jour toute seule pour les prix.
