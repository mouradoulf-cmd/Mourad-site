# One Love Bar — Demo site (EN + TH)

Site de démonstration d'un bar reggae/rasta fictif à Pattaya — un exemple
réutilisable de ce style (dark rasta rouge/or/vert, ambiance nocturne,
carte de boissons) pour pitcher des bars/pubs sur place, sans être lié à
un établissement réel précis.

Site statique en HTML / CSS / JS pur — aucune installation ni build
nécessaire. Deux pages : `index.html` (anglais) et `th.html` (thaï), reliées
par le sélecteur de langue dans la barre de navigation.

## Voir le site en local

```bash
python3 -m http.server 8000
```

puis ouvrez http://localhost:8000/trenchtown/

## Vidéo et son en hero

Le hero est prêt à recevoir une vraie vidéo : dépose un fichier à
`assets/video/hero.mp4` (idéal : filmé sur place, un soir de concert,
format paysage, 15-30 secondes, en boucle). Tant qu'il n'y a pas de fichier,
un fond animé (dégradé rouge/or/vert) prend le relais automatiquement — le
site reste beau sans vidéo.

Aucun navigateur n'autorise une vidéo à jouer automatiquement **avec le
son** — c'est bloqué partout par design. Le bouton "🔊 Tap for sound" en
haut à droite du hero permet au visiteur d'activer le son lui-même une
fois sur la page. Il n'y a pas de musique intégrée : utilise soit le son
de la vraie vidéo filmée sur place (le plus simple, zéro souci de droits),
soit une piste réellement libre de droits si tu veux un fond sonore séparé.

## Démo 3D (Three.js)

`gallery-3d-demo.html` est une variante de `index.html` où la section
galerie devient une vraie scène 3D pilotée par le scroll : les 5
illustrations flottent comme des photos suspendues dans l'espace, la
caméra "vole" à travers en scrollant, avec un léger parallax à la souris
et un anneau néon animé au centre. Technique : Three.js + GSAP
ScrollTrigger, chargés par CDN (aucune installation).

Si Three.js ne charge pas (pas de connexion, navigateur trop ancien) ou
si le visiteur a activé "réduire les animations", la page retombe
automatiquement sur la grille d'illustrations statique de `index.html` —
jamais de page cassée.

C'est une démo technique pour montrer la capacité, pas la version à
utiliser pour un vrai client tant qu'il n'y a que des illustrations —
l'effet sera bien plus impressionnant une fois de vraies photos du lieu
utilisées comme textures (remplacer `window.TILE_ART` dans
`assets/js/main.js`).

## Structure du projet

```
index.html / th.html    → les deux langues (structure identique)
assets/css/style.css     → identité visuelle (palette rasta rouge/or/vert)
assets/js/main.js        → rendu des données (mosaïque, boissons), vidéo/son,
                           menu mobile — lit window.BAR_DATA défini dans
                           chaque page HTML
assets/video/            → dépose hero.mp4 ici
```

## Personnalisation pour un vrai client

Pour adapter cette démo à un vrai bar (nom, adresse, note Google, vraie
carte de boissons, vraies photos) :

- Nom / titre / meta description en haut de `index.html` et `th.html`
- `window.BAR_DATA` en bas de chaque page (programme, boissons)
- Coordonnées (adresse, lien Google Maps, Facebook) dans le `<footer>` et
  les boutons "Get directions"
- Mosaïque de la galerie : remplace les blocs de couleur par de vraies
  photos du lieu une fois disponibles (jamais de photos prises par
  d'autres personnes sans leur accord — uniquement des photos prises sur
  place avec l'accord du propriétaire)

⚠️ Si tu personnalises cette démo avec le nom d'un vrai commerce existant,
ne la publie pas en ligne publiquement sans l'accord du propriétaire —
garde-la comme support de démonstration à montrer en personne.

## Personnalisation rapide

- Couleurs : variables CSS en haut de `assets/css/style.css` (`--red`,
  `--gold`, `--green`, `--wood`)
- Traduction thaïe : rédigée avec soin mais à faire relire par une
  personne native avant tout usage réel avec un client.
