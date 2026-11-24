
## Prix NM Studio Thaïlande (décision de Mourad, 2026-11-20)
- Menu QR : 3 000 ฿ une seule fois (mise en place) + 390 ฿/mois (hébergement, entretien, modifications).
- Site web : 10 000 ฿ une seule fois + 790 ฿/mois (reste en ligne, entretien, modifications).
- Remplace l'ancien « installation gratuite » et « site + menu QR 790 ฿ ». À confirmer avec Mourad : le menu QR est-il inclus dans le site à 10 000 ฿ ? (le site ne le promet plus pour l'instant).
- Mis à jour : th/ et th-fr/ (cartes d'offres, hero, barre mobile, FAQ, mentions légales), kit de vente. Les pages fr/en/it/ar gardent leurs prix en euros.

## Menu QR « Thai Foods » (brouillon, 2026-11-21)
- Nouveau commerce (cuisine thaïe, fruits de mer, steaks). Accord du patron pour utiliser ses photos. Menu : `menus/thai-seafood/`, 77 plats, 9 langues, prix lus sur ses panneaux. Pas de vidéo reçue (seulement les 10 photos).
- À confirmer : le nom du commerce (nom provisoire), prix du poulet aux noix de cajou (illisible), ส้มตำ (sans prix), plats 1-10 du panneau fruits de mer (non photographiés), boissons, nom du « mixed vegetables with rice » (nom partiel), contact LINE/WhatsApp.
- Ensuite : panneau QR A5 avec le vrai nom, et test du menu avec le patron.

## Menu QR « Fisherman's Garden Restaurant and Bar » (démo prospect, 2026-11-22)
- Lien : `menus/fishermans-garden/`. 200 articles en 9 langues : 8 rubriques de nourriture (sandwichs/européen, fritures, sashimi, salades épicées/grillades, poissons et fruits de mer, sautés, riz et œufs, soupes et currys) + 5 rubriques de boissons. Photos de plats découpées dans les photos du menu papier (qualité moyenne).
- À confirmer avec le patron : bratwurst (autocollant X sur la photo), prix du curry de la jungle (coupé sur la photo, plat non ajouté), icône du prix 400 ฿ du curry en poudre (non ajouté), riz vapeur grande portion à 100 ฿, taille « S » des huîtres, noms/orthographe, contact, nom de domaine.

## Interrupteur de démo des QR (2026-11-22)
- `menus/demo-switch.json` : tant que `active` est vrai et que `until` n'est pas passé (6 h par défaut), le QR imprimé de Steak Dek Naew ouvre le menu du restaurant `slug` (ex. fishermans-garden). Ensuite, le vrai menu de Steak Dek Naew revient tout seul. Pour arrêter plus tôt : mettre `"active": false`.

## Fisherman's Garden : photos partout (2026-11-22)
- Menu : 187 articles sur 200 ont une photo (plats découpés dans les photos du menu papier ; chaque variante de prix reprend la photo du plat). Boissons : 38 photos libres (Openverse, CC0/CC BY) utilisées comme illustration, crédits dans `menus/fishermans-garden/CREDITS.md`. Sans photo : jus de pomme, B52, Coke Zero, électrolyte, M-150, suppléments, bratwurst, quelques plats flous.
- À remplacer par les vraies photos du restaurant dès qu'il en a.

- 2026-11-22 : Fisherman's Garden — photos floues du menu papier remplacées par des photos HD (bibliothèque Mae Lek + Openverse/Wikimedia, crédits dans CREDITS.md) ; 170/200 plats avec photo, photos = illustrations, à remplacer par les vraies du resto.

- 2026-11-24 : carte de présentation animée `nm/card/` (thaï, traduction FR en dernier écran). Prix affiché : 150 ฿ la carte QR de table — À CONFIRMER avec Mourad (sens exact). Pas de photo de lui (à fournir, vraie photo).
