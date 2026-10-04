# NM Studio — vidéos explicatives

## Sur le site (`nm/index.html`)
Sur la page d'accueil (hero), deux nouveaux choix :
- **▶ Watch the 60s video** (gros bouton verre dépoli) → ouvre la vidéo explicative en plein écran, dans la langue choisie (EN / FR / IT / TH / AR).
- **Enter the site ↓** → descend directement dans le site.

La vidéo se termine sur trois boutons : WhatsApp, prendre rendez-vous (ouvre le formulaire existant) et voir les tarifs.
Les textes sont dans `assets/js/nm-film.js` (objet `T`, une entrée par langue) ; les prix y sont dans `PRICES` — ils doivent rester identiques à ceux de la section Pricing.
Fichiers : `assets/css/nm-film.css`, `assets/js/nm-film.js`, `assets/js/qrcode-svg.min.js` (pour le QR WhatsApp).

## Fichiers MP4 (WhatsApp, TikTok, Reels, Facebook)
Dans `assets/video/explainer/` (vertical 1080×1920, sous-titres incrustés, **avec bande-son** : petite musique + bruitages — clics de clavier quand la recherche se tape, pops, carillons, whoosh ; aucune voix) :

| Fichier | Durée | Usage |
|---|---|---|
| `nm-explainer-{en,fr,it,th,ar}.mp4` | ~76 s | présentation complète |
| `nm-short-found-{lang}.mp4` | ~21 s | accroche : « vos clients cherchent d'abord » |
| `nm-short-offer-{lang}.mp4` | ~25 s | offre : tarifs + sans engagement + QR WhatsApp |

La dernière scène affiche un QR code qui ouvre la conversation WhatsApp NM Studio.

## Régénérer les vidéos
`nm/video/render.html?lang=en` affiche le film image par image (`window.__nmRender(t)`), voir le script de rendu décrit dans l'historique git du dossier.

## Bande-son
Générée par programmation (synthèse v2 : nappe chaude, piano électrique avec écho, basse douce, kick avec sidechain, clavier mécanique réaliste, pops et carillons ; normalisée à ~-15 LUFS ; synthèse, aucun sample ni musique protégée → utilisable librement). Une version par langue car le nombre de lettres tapées change :
`assets/audio/nm-soundtrack-{lang}.mp3` — jouée en synchro avec la vidéo dans le site (bouton 🔊/🔇, mémorisé). Les MP4 contiennent la même piste.
La voix de synthèse a été retirée.
