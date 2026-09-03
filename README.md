# Giulivo — Cucina e Buonumore

Site vitrine one-page moderne pour le restaurant **Giulivo Cucina e Buonumore**
(Località Luchetta, 7, Vicopisano PI, Italie).

Site statique en HTML / CSS / JS pur — aucune installation ni build nécessaire.

## Voir le site en local

Ouvrez simplement `index.html` dans un navigateur, ou lancez un petit serveur local :

```bash
python3 -m http.server 8000
```

puis ouvrez http://localhost:8000

## Structure du projet

```
index.html              → toute la page (sections : hero, histoire, menu, galerie, avis, contact)
assets/css/style.css     → design, couleurs, animations
assets/js/main.js        → animations au scroll, menu mobile, compteurs, barre de progression
assets/img/              → images du site
```

## Photos

Le site utilise 5 photos réelles des plats du restaurant, dans `assets/img/` :
`tartare.jpg`, `linguine-frutti-di-mare.jpg`, `tonno-pistacchio.jpg`,
`panna-cotta.jpg` et `table-partage.jpg` (fond du hero et grande vignette de
la galerie). Elles sont utilisées dans le hero, la section "Notre histoire",
les cartes du menu et la galerie.

Pour ajouter ou remplacer une photo :

1. Déposez le fichier dans `assets/img/` (`.jpg` ou `.webp`, idéalement
   compressé — 1600 px de large maximum pour rester léger).
2. Remplacez le `src="assets/img/…"` correspondant dans `index.html`.

Une photo portrait du chef / de l'équipe peut aussi être ajoutée dans la
section "Notre histoire" (`.story__frame`), et d'autres plats peuvent
s'ajouter facilement à la galerie (`#galerie`) en dupliquant un bloc
`<figure class="gallery__item">…</figure>`.

## Informations affichées

Les informations (adresse, téléphone, note Google 4,7/5, 91 avis, horaires)
proviennent de la fiche Google du restaurant. Pensez à vérifier / mettre à
jour les horaires exacts et le contenu du menu avec le patron avant mise en
ligne définitive.

## Mise en ligne (déploiement)

Ce site est 100% statique, il peut être déployé gratuitement en quelques
minutes sur :

- **GitHub Pages** : Settings → Pages → déployer depuis la branche du dépôt.
- **Netlify** ou **Vercel** : glisser-déposer le dossier, ou connecter le dépôt Git.
- Ou hébergé sur n'importe quel hébergement mutualisé classique (envoi par FTP).

## Personnalisation rapide

- Couleurs : variables CSS en haut de `assets/css/style.css` (`--terracotta`,
  `--olive`, `--gold`, `--cream`, `--ink`).
- Polices : `Fraunces` (titres) et `Jost` (texte), chargées depuis Google Fonts.
- Texte du menu : section `#menu` dans `index.html` — à ajuster avec la vraie
  carte et, si souhaité, les prix.
