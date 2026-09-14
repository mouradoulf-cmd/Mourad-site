# Trench Town Rasta Bar — Demo site (EN + TH)

Site de démonstration pour Trench Town Rasta Bar (Soi LK Metro, Pattaya) —
pensé pour être montré au patron du bar sur place. Contenu construit à
partir d'informations publiques réelles (note Google, ambiance, musique
live) ; **les prix des boissons sont des exemples**, à remplacer par la
vraie carte avant tout usage réel.

Site statique en HTML / CSS / JS pur — aucune installation ni build
nécessaire. Deux pages : `index.html` (anglais) et `th.html` (thaï), reliées
par le sélecteur de langue dans la barre de navigation.

⚠️ Ce site utilise le vrai nom d'un établissement existant. Ne le publie
pas en ligne publiquement sans l'accord du propriétaire — c'est un support
de démonstration à montrer en personne (ou en capture d'écran), pas un
site à héberger sous leur nom sans autorisation.

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
fois sur la page (ça coupe aussi le son de la vidéo si elle en a un). Il
n'y a pas de musique intégrée : ni fichier audio séparé, ni morceau
utilisé sans droits — utilise soit le son de la vraie vidéo filmée sur
place (le plus simple, zéro souci de droits), soit une piste réellement
libre de droits si tu veux un fond sonore séparé.

## Structure du projet

```
index.html / th.html    → les deux langues (structure identique)
assets/css/style.css     → identité visuelle (palette rasta rouge/or/vert)
assets/js/main.js        → rendu des données (mosaïque, boissons), vidéo/son,
                           menu mobile — lit window.TRENCH_DATA défini dans
                           chaque page HTML
assets/video/            → dépose hero.mp4 ici
```

## Personnalisation rapide

- Couleurs : variables CSS en haut de `assets/css/style.css` (`--red`,
  `--gold`, `--green`, `--wood`)
- Boissons / zones du lieu : `window.TRENCH_DATA` en bas de `index.html`
  et `th.html` (à modifier dans les deux fichiers)
- Traduction thaïe : rédigée avec soin mais à faire relire par une
  personne native avant tout usage réel avec le client.
