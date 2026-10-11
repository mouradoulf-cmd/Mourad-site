# Meridian — visa/immigration consultancy demo

Site de démonstration d'une agence de visas fictive en Thaïlande —
nouveau template, différent de Giulivo (restaurant), Façadiers (B2B
brillant) et Noir (salon) : palette sombre cobalt/onyx, typographie
géométrique, esprit "fintech premium".

Construit à partir des design tokens exacts du vrai site Mercury.com
(`--onyx-canvas`, `--cobalt`, l'échelle typographique, les espacements)
— voir `assets/css/style.css` pour les variables. La police "Arcadia"
de Mercury étant une police propriétaire non disponible publiquement,
elle est remplacée ici par **Plus Jakarta Sans** (Google Fonts), qui a
un rendu géométrique proche.

Site statique en HTML / CSS / JS pur, aucune installation ni build.

## Voir le site en local

```bash
python3 -m http.server 8000
```

puis ouvrez http://localhost:8000/meridian/

## Personnalisation pour un vrai client

- Nom, tarifs et services : `index.html` (sections `#services`, hero,
  footer).
- Palette/espacements/rayons : variables CSS en haut de
  `assets/css/style.css`.

⚠️ Comme les autres démos fictives du repo (Trenchtown, etc.), ne pas
publier cette page avec le nom d'un vrai cabinet/agence sans son
accord — elle reste un support de démonstration.
