# Atelier des Façadiers — direction artistique & motion (v3 « excellence »)

Site statique (HTML/CSS/JS, **aucun build**), 5 langues (FR/EN/DE/NL/ES). Cette passe n'enlève aucune
fonctionnalité : configurateur, estimation, formulaire, visionneuse photo, documents, langues, etc. sont intacts
(vérifié par tests automatisés desktop + mobile, dans les 5 langues).

## 1. Parti pris artistique

**Palette — clair épuré + sections sombres + un seul accent.** Recommandation retenue plutôt qu'un « tout sombre
néon » : le client vend de la façade (matière, lumière, précision) à des bardeurs et architectes ; la pierre claire
(`#f1efe9`) et l'encre (`#0d1116`) évoquent le plan d'architecte, le bleu logo (`#244760`) rassure, et l'orange
signal (`#ff5a1f`) n'apparaît que sur l'action (CTA, sélection, repère). Les sections « techniques » (façade
ventilée, chiffres, agences, hero) passent en sombre avec grille bleutée : c'est le contraste qui crée le rythme.
Orange en **texte sur fond clair** = `#b93a08` (AA, 4,5:1) ; l'orange vif est réservé aux fonds sombres et aux boutons.

**Typographie.** Archivo (largeur variable 62–125 %, titres larges et denses) + Instrument Sans (texte) + IBM Plex
Mono (annotations techniques). Pairing display/texte/mono « ingénierie » ; polices **auto-hébergées** (woff2
latin, `font-display: swap`, 1 préchargement critique) : pas de requête tierce, pas de saut de mise en page.

**Micro-détails.** Grille 12 colonnes stricte (titre = col. 1-7, texte = col. 8-12 sur toutes les sections),
échelle d'espacement unique, bordures fines `1px`, ombres douces, verre léger (header sticky), dégradés très
discrets. (Un grain de film plein écran avait été testé puis retiré : il coûtait des images/s au défilement.)

## 2. Animations — chacune a une justification

| Effet | Pourquoi | Garde-fous |
|---|---|---|
| **Loader d'entrée** : 6 panneaux de bardage qui se lèvent, compteur 0→100 | Signe l'identité (panneaux) et masque le chargement vidéo/poster ; ne dure que ce qu'il faut (1,3 s min, 3,2 s max) | 1 fois par session, accueil seulement, jamais si `prefers-reduced-motion`, échec → disparaît seul à 5 s |
| **Hero 3D (Three.js)** : panneaux qui arrivent, s'ancrent dans la grille, « explosent » au scroll, suivent le curseur | Raconte le métier : préparer, livrer, fixer des panneaux ; prépare l'« exploded view » plus bas | Chargé en lazy après le loader + idle ; desktop ≥ 1100 px, pointeur fin, ≥ 4 cœurs, pas de data-saver ; **refuse les rendus logiciels** ; régulateur de perf (baisse la résolution puis se retire au profit de la vidéo si < 40 fps) ; pause hors écran / onglet caché ; 12 meshes, DPR ≤ 1,5 |
| **Transition de page** : un panneau d'encre avec liseré orange | Continuité de marque entre pages, 0,45 s | Désactivée en reduced-motion ; navigation jamais bloquée |
| **Curseur personnalisé** (points + anneau, états lien / média « Voir » / champ / clic) | Annonce ce qui est cliquable, donne le contexte sur les photos | Additif : le curseur natif **n'est jamais masqué** ; absent sur tactile |
| **Tilt 3D** des cartes et du visuel configurateur (± 6°) | Profondeur sur les éléments d'action | Pointeur fin uniquement, `will-change` seulement pendant le survol |
| **Header** qui se cache en descendant, revient en remontant | Plus de place pour lire, accès immédiat à la nav en remontant | Toujours visible au focus clavier |
| **Menu plein écran** (mobile/tablette) : liens numérotés, apparition en cascade | Navigation éditoriale, grosses cibles tactiles, tel. des 2 agences | Fermeture claire, focus conservé |
| **Titres mot par mot, boutons magnétiques, parallaxe, scroll horizontal des réalisations** | Rythme de lecture, hiérarchie | Contenu visible sans JS (l'état caché n'est activé qu'une fois l'observer prêt) |
| **Son (désactivé par défaut)** : tick au survol, « snap » au clic, accord à la fin du loader | Retour sensoriel optionnel | Bouton haut-parleur dans le header, mémorisé ; synthèse WebAudio (aucun fichier), volume très bas |

## 3. Performance & accessibilité

- Défilement mesuré **60 fps** (CPU bridé ×4 desktop / ×6 mobile) sur l'accueil et la page Projets.
- Une seule boucle de scroll partagée (rAF), effets actifs seulement quand leur section est proche, vidéo en pause hors écran,
  `content-visibility` sur les sections lointaines, images WebP responsive, vidéo hero 3,4 Mo (1,3 Mo mobile), poster préchargé.
- Three.js (r160, auto-hébergé, ~670 Ko / ~170 Ko gzip) n'est téléchargé **que** si les conditions du hero 3D sont réunies.
- **WCAG 2.1 AA** : audit axe-core = 0 violation sur les 8 pages testées (contrastes, ordre des titres, noms
  accessibles). Navigation clavier complète, lien d'évitement, focus visibles, `prefers-reduced-motion` respecté
  partout (loader, 3D, curseur, tilt, transitions), boutons ≥ 40 px.
- Responsive : de 320 px à 4K (au-delà de 1920 px, la taille racine augmente → toute la mise en page s'agrandit
  proportionnellement).
- Fallbacks vérifiés : sans WebGL → hero vidéo seul ; reduced-motion → aucun loader/curseur/3D ; sans JS → contenu complet.

## 4. Dépendances

Aucune à installer (pas de build). Une seule bibliothèque tierce, **auto-hébergée** :

- `assets/vendor/three.module.min.js` — Three.js r160 (MIT), uniquement pour le hero 3D.

Fichiers ajoutés : `assets/js/fx.js` (loader, transitions, curseur, tilt, son, chargement 3D),
`assets/js/hero3d.js` (scène 3D, module ES chargé à la demande). Les modules ES exigent un hébergement HTTP(S)
(GitHub Pages, aperçu Claude) — en ouvrant le fichier via `file://`, le hero 3D est simplement sauté.

Debug : ajouter `#gl=force` à l'URL de l'accueil force la 3D même sur rendu logiciel.

## 5. Avant / après

Voir `docs/avant-apres/` : `comparaison-hero-desktop.png`, `comparaison-cartes.png`,
`comparaison-configurateur.png`, `comparaison-footer.png`, `comparaison-hero-mobile.png`,
`comparaison-menu-mobile.png`.

| Section | Avant | Après |
|---|---|---|
| Hero | Vidéo + titre pleine largeur | Même vidéo, titre recadré sur 2/3, assemblage 3D de panneaux à droite, loader d'entrée |
| Menu mobile | Liste simple sous l'en-tête | Plein écran éditorial : numéros, cascade, CTA pilule, téléphones |
| Cartes | Cartes plates | Verre/bordure animée, icône dessinée, numéro filaire, tilt 3D |
| Configurateur | Boutons simples | Cartes matière, pastilles teinte, fiche récap sombre, cadre de visée |
| Navigation | Fondu | Panneau d'encre, header qui se cache, curseur contextuel, son optionnel |
| Accessibilité | Contrastes orange 2,7:1, ordre des titres | AA complet (axe : 0 violation) |

## 6. Pistes suivantes (non faites volontairement)

- `hreflang`/sitemap : demandent le domaine définitif.
- Un vrai modèle 3D (glTF) de la façade ventilée pour la section « exploded » : à envisager si le client fournit ses coupes DWG.
- Vidéo hero : repartir de l'original sans compression (4K) pour un encodage AV1/HEVC en plus du H.264.

## v4 — useful 3D viewers (`assets/js/lab3d.js`)

- **Bardage, "Matières en 3D"**: a 2×3 façade wall on aluminium rails; picking one of the six families flips the panels (staggered) to that material (procedural textures, no image weight). The six cards stay below.
- **Ossature, "Profils en 3D"**: the six profile tiles now drive a real extrusion (TE, cornière, oméga, zed, U, tube), turnable by drag / arrow keys.
- Justification: visitors compare materials and sections; volume + material answers that better than a flat icon. Motion is tied to a user choice, never decorative.
- Gating: real GPU only (software GL, reduced motion, data-saver, <4 cores skipped; `#gl=force` to debug). Render loop runs only while visible. If anything fails, pages are unchanged. Texts in 5 languages inside the module; shapes are schematic, no figures claimed.

- v4b: home nav cards (Bardage / Ossature / Documentation) are now photo-led (real project photos, icon chip overlapping the image, slow zoom on hover).

## v5 — finishing layer (`assets/css/premium.css`, `assets/js/premium.js`)

Loaded after site.css / site.js on every page and language; the site is complete without it.
- Typography: balanced headings (`text-wrap:balance`), calm paragraphs (`pretty`, 62ch measure), tabular figures for numbers.
- Buttons: shine sweep, press feedback, 4 px magnetic pull (desktop only); one consistent focus ring everywhere.
- Surfaces: single radius scale, layered shadows, finer focus states on fields, fine grain on dark sections.
- Hero: slow pointer + scroll depth on the media (a few px, desktop only, only while visible), warm/cool light wash, gradient on the accent word. The redundant "scroll" cue was removed (it overlapped the CTA).
- Process: real timeline whose line fills with scroll and lights each step; vertical version on mobile.
- Photos: soft clip reveal on card images (hidden state only once the observer exists).
- Fixed: stat figures colliding on mid widths, process steps merging on mobile.
- Not done on purpose: before/after slider and testimonials (no paired photos / no real quotes supplied; nothing invented).

- v5b: on phones (<=900px) the pinned scroll sections ("Cinq couches" exploded view, horizontal "Réalisations") no longer pin: static exploded view with tap-to-read layers, native swipe carousel. Cut ~1500 px and ~2600 px of empty scrolling.

- v5c: "Cinq couches" is pinned on phones too (sticky, 250svh runway): the picture stays on screen, layers separate by themselves as you scroll and each caption appears, then the page continues. Fixed a regression where premium.css set `position:relative` on the sticky stage (it un-pinned the section on desktop as well).
