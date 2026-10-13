# SOCAP — « La signature nature » (refonte de démonstration)

Refonte du site de **SOCAP**, paysagiste à Châtillon-sur-Chalaronne (Ain) — https://www.socap-paysage.com/.
Textes, coordonnées, réalisations et photographies proviennent du site actuel de l'entreprise (copie de démonstration, `noindex`).

- **Stack** : HTML / CSS / JS à plat, sans build. Three.js r160 auto-hébergé (`assets/vendor/`), Lenis pour le défilement doux.
- **Direction** : nuit forêt + émeraude/menthe (clin d'œil au vert du logo) + lime + ambre lanterne ; Unbounded (titres), Manrope (texte), Bodoni Moda italique (mots clés). Polices auto-hébergées.
- **Pièce maîtresse** : « le jardin suspendu » (`assets/js/scene.js`), un îlot de jardin procédural (terrain, ~34 000 touffes d'herbe animées par le vent, arbres, bassin, terrasse + pergola, lanternes, lucioles, ciel crépuscule → nuit).
  Le scroll pilote la caméra, le cycle jour/nuit et un **scan de construction** (plan filaire → jardin) : section « Du plan au jardin ».
- **Sections** : héros, bandeau de métiers, plan → jardin (scroll épinglé en 5 étapes), entreprise (chiffres + 6 engagements UNEP), 9 prestations (cartes 3D), 7 réalisations (défilement horizontal épinglé), zone d'intervention (carte radar à vraie projection), contact + devis, mentions légales (dialog).
- **Sécurité d'affichage** : contenus visibles par défaut ; révélations activées seulement une fois l'IntersectionObserver confirmé ; curseur additif (le curseur natif n'est jamais masqué) ; `prefers-reduced-motion` respecté ; sans WebGL (ou GPU logiciel / économie de données) → poster statique `assets/img/poster.jpg`.
- **Débogage** : `#gl=force` force la scène 3D (même sur GPU logiciel) ; `#lite` allège la scène ; `window.__scene` expose le pilotage.

## À renseigner avant mise en ligne
- `CONFIG.email` en tête de `assets/js/site.js` : adresse qui reçoit les devis (sinon le formulaire n'envoie rien et le dit clairement).
- Mentions légales : hébergeur / responsable de publication à confirmer par SOCAP.
- Photographies : celles du site actuel (1181 px, qualité moyenne). Un reportage photo (idéalement drone + lumière du soir) ferait passer le site à un autre niveau.
- Attribution des photos aux réalisations : déduite de l'ordre des pages du site actuel, à confirmer par SOCAP.
