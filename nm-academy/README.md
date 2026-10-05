# NM Academy — site de vente (Plan A : sites web · Plan B : vidéo IA)

Site statique FR / EN / TH, sans build. Futuriste : fond animé (grille en perspective + réseau),
écran d'entrée avec sons UI (frappes, clics — aucune musique), terminal animé, simulateur d'objectif.

## À régler avant de vendre (`assets/js/config.js`)
- `PLANS` : prix d'exemple (49 €/mois, 97 € une fois, 197 € pack) → mets les tiens.
- `LINKS` : liens de paiement (Stripe Payment Links…). Vide = le bouton ouvre WhatsApp / e-mail.
- `WHATSAPP`, `EMAIL`, `BRAND`, `REFUND_DAYS`.
- `OFFER_END` : fin d'offre RÉELLE (sinon aucun compte à rebours — jamais de fausse urgence).

## Mettre en ligne
Dépose le dossier sur Cloudflare Pages / Netlify (aucun build).

## Règles de contenu
Aucun revenu garanti, aucun faux témoignage, aucun faux chiffre : les chiffres du terminal sont
étiquetés « exemple » et le simulateur est un calcul, pas une promesse. Les programmes de
monétisation TikTok/YouTube ont des conditions propres : le site renvoie vers les règles officielles.

## Sons
`assets/js/sfx.js` (Web Audio, synthèse). Activés seulement après un clic (écran d'entrée) ; bouton SON on/off dans la barre.
