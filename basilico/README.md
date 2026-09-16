# Basilico

Site de démonstration pour un restaurant gastronomique fictif "Basilico" —
HTML/CSS/JS pur, sans étape de build. Même approche que Giulivo (`../index.html`) :
tu peux ouvrir/modifier `index.html`, `assets/css/style.css` et `assets/js/main.js`
directement, à la main.

⚠️ Ce dossier a été converti depuis une ancienne version Next.js
(`../basilico-app/`, conservé pour historique mais qui n'est plus la source de
vérité — ne pas relancer `npm run build` là-bas et recopier par-dessus ce
dossier, ça écraserait ce code).

## Structure

```
index.html            → toute la page
assets/css/style.css  → tous les styles
assets/js/main.js     → toutes les interactions (GSAP, Lenis, curseur, carrousel, modale menu, réservation WhatsApp...)
assets/img/           → photos (actuellement les photos de Giulivo, à remplacer par de vraies photos du restaurant)
```

## Personnalisation pour un vrai client

- Nom, textes, prix : directement dans `index.html`
- Couleurs : `assets/css/style.css`, variables `--color-gold`, `--color-ink`, etc.
- Numéro WhatsApp/téléphone : cherche `+15551234567` dans `index.html` et `assets/js/main.js`
- Images : remplace les fichiers dans `assets/img/` par de vraies photos du restaurant
  (jamais de photos prises par d'autres personnes sans leur accord)

⚠️ Comme pour les autres démos : si tu adaptes ce site au nom d'un vrai
restaurant existant, ne le publie pas en ligne sans l'accord du propriétaire.

Voir en ligne : `https://mouradoulf-cmd.github.io/Mourad-site/basilico/`
