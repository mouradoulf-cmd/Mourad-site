# NM Academy — site de vente (Plan A : sites web · Plan B : vidéo IA)

Site statique FR / EN / TH, sans build. Futuriste : fond animé (grille en perspective + réseau),
écran d'entrée avec sons UI (frappes, clics — aucune musique), terminal animé, simulateur d'objectif.

## Pages
- `index.html` : page de vente (entrée avec son, démo de maquette en direct, simulateur, tarifs, FAQ)
- `start.html` : parcours en 6 questions → recommandation personnalisée → choix de l'accès
- `members.html` : espace membres protégé par code (`MEMBER_CODE`) — 13 modules, 49 leçons, kit de scripts/modèles, progression
- `kit/starter-site.html` : gabarit de site une page pour commerce local
- `legal.html` : avertissement revenus, monétisation, remboursement, usage

## À régler avant de vendre (`assets/js/config.js`)
- `PLANS` : prix d'exemple (49 €/mois, 97 € une fois, 197 € pack) → mets les tiens.
- `LINKS` : liens de paiement (Stripe Payment Links…). Vide = le bouton ouvre WhatsApp / e-mail.
- `MEMBER_CODE` : code d'accès aux cours (envoie-le après paiement ; change-le régulièrement). Protection légère côté navigateur : pour beaucoup d'élèves, héberge les cours sur une plateforme de cours.
- `WHATSAPP`, `EMAIL`, `BRAND`, `REFUND_DAYS`.
- `TESTIMONIALS` : avis clients RÉELS (avec accord). Vide = la section reste cachée.
- `FORM_ENDPOINT` : formulaire du cadeau gratuit (formspree.io…). Sans lien, les e-mails ne sont pas collectés.
- `GA_ID` / `PIXEL_ID` : mesure (Google Analytics / Meta Pixel). Si tu actives ça, ajoute un bandeau de consentement cookies.
- `OFFER_END` : fin d'offre RÉELLE (sinon aucun compte à rebours — jamais de fausse urgence).

## Mettre en ligne
Dépose le dossier sur Cloudflare Pages / Netlify (aucun build).

## Règles de contenu
Aucun revenu garanti, aucun faux témoignage, aucun faux chiffre : les chiffres du terminal sont
étiquetés « exemple » et le simulateur est un calcul, pas une promesse. Les programmes de
monétisation TikTok/YouTube ont des conditions propres : le site renvoie vers les règles officielles.

## Sons
Son actif par défaut (un seul bouton « Entrer » qui débloque l'audio) ; l'utilisateur le coupe avec le bouton SON et son choix est mémorisé.
`assets/js/sfx.js` (Web Audio, synthèse). Activés seulement après un clic (écran d'entrée) ; bouton SON on/off dans la barre.
