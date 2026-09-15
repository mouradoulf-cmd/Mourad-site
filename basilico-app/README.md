# Basilico — code source (Next.js)

Site de démonstration pour un restaurant gastronomique fictif "Basilico" —
construit à partir d'un prompt movento.dev, avec Next.js, Tailwind v4,
GSAP, Framer Motion et Lenis.

⚠️ **Ce dossier est le code source.** Le site réellement en ligne (servi par
GitHub Pages) se trouve dans `../basilico/` — c'est un export statique
généré à partir de ce code, à régénérer après chaque modification (voir
plus bas). Ne modifie jamais directement les fichiers dans `../basilico/`,
ils seraient écrasés au prochain export.

## Développer en local

```bash
cd basilico-app
npm install
npm run dev
```
puis ouvre http://localhost:3000

## Générer le site statique (après une modification)

```bash
npm run build
```

Ça génère un dossier `out/` avec le site complet. Ensuite, remplace le
contenu de `../basilico/` par celui de `out/` :

```bash
rm -rf ../basilico/*
cp -r out/* ../basilico/
```

Puis commit + push les deux dossiers (`basilico-app/` pour le code,
`basilico/` pour le site généré).

## Pourquoi deux dossiers ?

Tous les autres sites du repo (Giulivo, Monsoon, Trench Town...) sont du
HTML/CSS/JS pur qu'on peut ouvrir/héberger directement. Next.js a besoin
d'être "compilé" (`npm run build`) pour produire des fichiers HTML/JS
statiques que GitHub Pages peut servir. `basilico-app/` = le code qu'on
édite, `basilico/` = le résultat compilé, prêt à héberger.

## Structure

```
app/                  → pages (App Router) : layout, page, styles globaux
components/           → tous les composants (Hero, Navbar, Gallery, etc.)
next.config.ts        → export statique + basePath GitHub Pages
```

## Personnalisation pour un vrai client

- Nom, textes, prix : directement dans les composants (`components/*.tsx`)
- Couleurs : `app/globals.css`, variables `--color-gold`, `--color-burnt`, etc.
- Images : actuellement des photos Unsplash génériques + une vidéo/image de
  démo — à remplacer par de vraies photos du restaurant une fois disponibles
  (jamais de photos prises par d'autres personnes sans leur accord).

⚠️ Comme pour les autres démos : si tu adaptes ce site au nom d'un vrai
restaurant existant, ne le publie pas en ligne sans l'accord du propriétaire.
