# Projet : diagnostic pour petits commerces (Pattaya)

Notes de la discussion avec Mourad (conservées ici pour ne rien perdre).

## L'idée
Mourad va dans les petits commerces de Pattaya (coiffeur, restaurant, pub, café…). Il tend son téléphone au commerçant, qui répond à 5 questions d'un clic. Une animation de réflexion (≈13 s), puis le résultat : 3 solutions faciles à mettre en place, avec les bénéfices. **Aucun prix dans l'outil** : le prix se discute ensuite, en direct.

## Décisions
- Langues : thaï, anglais, français (le français sert à Mourad pour comprendre). Thaï rédigé par Claude : **à faire relire par un natif**.
- Pas de promesse impossible : uniquement des solutions faciles (site vitrine, fiche Google Maps, menu QR multilingue, bouton LINE/WhatsApp, page promos, réservation simple, carte de fidélité).
- Les réponses sont gardées sur le téléphone de Mourad (carnet de visites : 5 touches sur le logo, ou `#visites`). Rien n'est envoyé nulle part.
- Marque affichée : « NM Studio » (à confirmer).

## Fichiers
- `diagnostic-src.html` : source (sans balises html/head/body, pour le publier comme artifact).
- `index.html` : même page, autonome (à ouvrir directement ou à mettre en ligne).

## Les 5 questions
1. Type de commerce 2. Comment les clients le trouvent 3. Comment il prend réservations/commandes 4. Qui sont ses clients 5. Ce qui le gêne le plus (2 max).
Règles : chaque réponse ajoute des points aux solutions ; les 3 meilleures s'affichent (voir `score()` dans le code).

## Carte de fidélité (étape suivante, pas encore construite)
- Deux QR codes : **table** = menu seulement ; **caisse** = point de fidélité (le client scanne après avoir payé). Coiffeur / spa : un seul QR à la caisse.
- Anti-triche, version 1 sans serveur : 1 point par téléphone toutes les ~12 h + écran de confirmation que le caissier regarde.
- Où sont enregistrés les points ? Version 1 : sur le téléphone du client (stockage du navigateur) → le gérant ne voit pas les chiffres. Version 2 : base de données + tableau de bord pour le gérant (hébergement nécessaire, coût mensuel possible).
- Données personnelles : si on garde un numéro de téléphone, la loi thaïlandaise PDPA peut s'appliquer (à vérifier).
- Fidélité surtout utile pour coiffeur, café, restaurant de quartier ; moins pour les touristes de passage.

## Points ouverts
- Valider les prix avec les premiers commerçants (aucun prix vérifié pour Pattaya).
- Permis de travail et impôts en Thaïlande pour facturer des clients locaux : à vérifier auprès d'un cabinet.
- Faire relire le thaï par un natif.
