# SOCAP — « La signature nature » (refonte de démonstration)

Refonte du site de **SOCAP**, paysagiste à Châtillon-sur-Chalaronne (Ain) — https://www.socap-paysage.com/.
Textes, coordonnées, réalisations et logo proviennent du site actuel de l'entreprise (copie de démonstration, `noindex`).

- **Stack** : HTML / CSS / JS à plat, sans build ni bibliothèque 3D. Lenis (défilement doux) auto-hébergé ; polices auto-hébergées (Unbounded, Manrope, Bodoni Moda italique).
- **Direction** : photographie réelle + interface futuriste (nuit forêt, menthe/lime, ambre), verre dépoli, grain de pellicule, HUD de plan.
- **Héros** (`assets/js/hero.js`) : vraie photo en « 2,5D » — WebGL brut, décalage selon une profondeur estimée (souris + dérive lente), balayette de lumière chaude, grain, poussière lumineuse (canvas 2D). Sans WebGL : la photo s'affiche avec un zoom lent en CSS. Rendu en pause hors écran.
- **« Du plan au jardin »** : section épinglée en 5 étapes ; pour chaque étape, le scroll fait glisser un trait de scan qui révèle la vraie photo derrière son **tracé filaire** (`bp-*.webp`, calculé par détection de contours à partir de la photo).
- **Sections** : héros, bandeau de métiers, plan → jardin, entreprise (chiffres + 6 engagements UNEP), 9 prestations (cartes inclinables), 7 réalisations (défilement horizontal épinglé), zone d'intervention (carte radar, vraie projection), contact + devis, mentions légales (dialog).
- **Sécurité d'affichage** : contenus visibles par défaut ; révélations activées seulement une fois l'IntersectionObserver confirmé ; curseur additif (le curseur natif n'est jamais masqué) ; `prefers-reduced-motion` respecté.

## Photographies : ce qui est vrai et ce qui est d'ambiance
- **Réalisations (7)** + photos « grands sujets » / « mur » : photographies **réelles de SOCAP**, issues de son site actuel (1 181 px, qualité moyenne). L'attribution à chaque chantier est déduite de l'ordre des pages du site actuel, à confirmer par SOCAP.
- **Héros, plan → jardin, cartes de prestations, ambiance** : photographies de banque d'images libres de droits (**Pexels**, licence Pexels : usage commercial autorisé, attribution non obligatoire). **Ce ne sont pas des chantiers de SOCAP** : à remplacer par les vraies photos de l'entreprise (idéalement un reportage professionnel, drone + lumière du soir) avant mise en ligne.
  Pexels (ids) : 7587879 (héros), 38296761, 34581778, 39009170, 7174103, 9056671 (plan → jardin), 8583822, 36713682, 31534350, 34845955, 36866669, 13871294 (prestations), 32172798 (entreprise), 33897208 (contact).

## À renseigner avant mise en ligne
- `CONFIG.email` en tête de `assets/js/site.js` : adresse qui reçoit les devis (sinon le formulaire n'envoie rien et le dit clairement).
- Mentions légales : hébergeur / responsable de publication à confirmer par SOCAP.
