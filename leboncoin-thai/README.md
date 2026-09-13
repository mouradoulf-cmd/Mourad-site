# TalatThai — Démo de marketplace de petites annonces

Prototype front-end façon "Leboncoin" pour la Thaïlande : recherche, filtres par
catégorie/ville, fiche annonce et dépôt d'annonce.

Site statique en HTML / CSS / JS pur — aucune installation ni build nécessaire.

## Voir le site en local

```bash
python3 -m http.server 8000
```

puis ouvrez http://localhost:8000/leboncoin-thai/

## Ce que fait la démo

- Annonces de démonstration (`assets/js/main.js`, tableau `SEED_LISTINGS`)
  réparties sur 8 catégories et 9 villes thaïlandaises.
- Recherche texte + filtre ville/catégorie + tri (récent / prix).
- "Déposer une annonce" : le formulaire enregistre l'annonce dans le
  `localStorage` du navigateur (clé `talatthai_listings_v1`) — elle apparaît
  aussitôt dans la grille, avec un bouton de suppression sur les annonces
  postées localement. Aucune donnée n'est envoyée à un serveur.
- Contact acheteur via téléphone (`tel:`) ou LINE, ouverts dans un nouvel
  onglet (`target="_blank" rel="noopener"`).

## Limites (c'est un prototype)

Pas de compte utilisateur, pas de backend, pas de vraie modération ni de
messagerie interne. Pour une vraie marketplace en production il faudrait une
API + base de données (auth, upload d'images, recherche serveur, anti-fraude).

## Personnalisation rapide

- Couleurs : variables CSS en haut de `assets/css/style.css` (`--navy`,
  `--gold`, `--jade`, `--cream`).
- Catégories / villes : tableaux `CATEGORIES` et `CITIES` dans
  `assets/js/main.js`.
- Annonces de démo : tableau `SEED_LISTINGS` dans `assets/js/main.js`.
