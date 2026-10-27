---
name: photo-plat
description: Trouver la photo parfaite et appétissante d'un plat (pad thaï, som tam, soupe de nouilles…) pour les menus QR NM Studio. Utiliser dès que Mourad nomme un plat, ou quand un menu QR a des plats sans photo.
---

# Photo de plat parfaite (menus QR NM Studio)

Mourad veut, pour chaque plat qu'il cite, **une photo qui donne envie de le manger**. Objectif : une seule image,
la meilleure, prête pour le menu.

## Où chercher (photos libres de droits uniquement)
1. **La bibliothèque existante d'abord** : `menus/assets/dishes/` (branche `claude/thai-app-mnw166`) puis
   `street-food/assets/img/d-*.webp` (15 plats thaïs Unsplash : krapao, padthai, somtam, tomyum, curry, noodle, boat,
   moo, grill, rice, chicken, mango, tea, seeew, glory). Si le plat y est, le réutiliser.
2. **Unsplash** (unsplash.com, licence Unsplash, éviter « Unsplash+ ») puis **Pexels** (pexels.com). Chercher en
   anglais + nom thaï (ex. « pad thai », « ผัดไทย », « thai beef noodle soup », « kuay teow nuea »).
3. **Jamais** une image prise au hasard sur Google Images, un autre restaurant, Facebook ou Wongnai (droits d'auteur).
4. Pas d'image générée par IA sans le « oui » de Mourad (payant, voir Higgsfield) ; si oui, la marquer illustration.

## Critères de la photo parfaite (noter chaque candidate, garder la meilleure)
- Le plat est **reconnaissable tout de suite** et correspond vraiment au plat (pas un autre plat qui ressemble).
- **Lumière naturelle**, couleurs chaudes et vives, pas de flash, pas surexposée.
- **Vue de dessus ou 45°**, le plat occupe 60–80 % du cadre, une seule assiette en vedette.
- Fond propre (bois, pierre, nappe), **pas de texte, logo, filigrane, main ou visage**.
- Net, haute résolution (≥ 1600 px de large), format paysage ou carré recadrable en **4:3**.
- Vapeur, sauce brillante, herbes fraîches = bonus « donne envie ».

## Préparation
- Recadrer en **4:3**, exporter `nom-plat-1280.webp` et `nom-plat-640.webp` (qualité ~80), légère retouche
  (lumière, contraste, saturation +5 à +10 %, jamais changer le plat).
- Ranger dans `menus/assets/dishes/` avec une ligne dans `menus/assets/dishes/CREDITS.md` :
  `nom-plat · URL de la page Unsplash/Pexels · photographe · licence`.
- Dans le menu, ces photos portent la mention **« ภาพประกอบ / Photo d'illustration »** (le vrai plat peut varier).
  Les spécialités de la maison : préférer une vraie photo prise sur place.

## Qualité premium « 4K » (méthode validée 2026-10-27, menu Mae Lek)
Mourad veut des photos niveau restaurant étoilé. Le secret : **partir de l'original haute définition**, jamais d'une
petite image agrandie.
1. **Original 4000 px** : quand on connaît l'ID Unsplash (ex. ceux listés dans `street-food/README.md`), le CDN
   officiel donne l'original : `https://images.unsplash.com/photo-<ID>?w=4000&q=92&fm=jpg`. (Ne pas contourner la
   protection anti-robot de la recherche Unsplash : si la recherche est bloquée, demander les liens à Mourad ou
   utiliser Openverse / Wikimedia, `api.openverse.org`.)
2. **Retouche + recadrage** avec `grade.py` (dans ce dossier, Python + `opencv-python-headless`) :
   `python3 -I grade.py <dossier_src> crops.json <dossier_sortie>` — niveaux doux (sans brûler les blancs),
   balance chaude, courbe en S légère, vibrance, clarté, vignette discrète, netteté de sortie.
   `crops.json` : `{"plat": {"x":…, "y":…, "side":…}}` = carré qui cadre l'assiette dans l'original ;
   options `wcx`/`wcy`/`wside` pour recadrer à part la version paysage.
3. Sorties : `plat-c-800/-c-1200.webp` (portrait 4:5, cartes du menu), `plat-w-1280/-w-2048.webp` (paysage 4:3,
   fiche du plat), `plat.webp` (carré 720). Mettre `"photoHD": true` dans `menus/<slug>/menu.js`.
4. **Toujours regarder** une planche avant/après de tous les plats (blancs brûlés, objets parasites en haut du
   cadre, assiette coupée) et recadrer plat par plat avant de publier.
5. Les photos de téléphone d'un vrai client passent aussi par `grade.py` (mais sans miracle : une photo floue
   reste floue ; mieux vaut lui faire refaire la photo en lumière du jour).

## Réseau (environnement cloud)
Le téléchargement direct demande que `unsplash.com`, `images.unsplash.com`, `pexels.com` et `images.pexels.com`
soient dans les domaines autorisés de l'environnement. S'ils sont bloqués : le dire à Mourad (réglages de
l'environnement → Network access → Allowed domains), et en attendant utiliser la bibliothèque existante ou donner
les liens des pages Unsplash pour téléchargement manuel.

## Réponse à Mourad
Montrer la photo choisie (capture ou fichier), dire pourquoi elle est la meilleure en une ligne, et où elle est rangée.
