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

## Réseau (environnement cloud)
Le téléchargement direct demande que `unsplash.com`, `images.unsplash.com`, `pexels.com` et `images.pexels.com`
soient dans les domaines autorisés de l'environnement. S'ils sont bloqués : le dire à Mourad (réglages de
l'environnement → Network access → Allowed domains), et en attendant utiliser la bibliothèque existante ou donner
les liens des pages Unsplash pour téléchargement manuel.

## Réponse à Mourad
Montrer la photo choisie (capture ou fichier), dire pourquoi elle est la meilleure en une ligne, et où elle est rangée.
