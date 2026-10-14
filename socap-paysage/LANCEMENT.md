# Mise en ligne du site SOCAP (prêt à l'emploi)

Le site est composé de fichiers simples (HTML / CSS / JS / images) : **aucune installation, aucun serveur spécial**. Il suffit de déposer le contenu du dossier `socap-paysage/` à la racine de l'hébergement du nom de domaine (par exemple en FTP chez OVH), puis de faire les 3 réglages ci-dessous.

## 1. Recevoir les demandes de devis (à faire)
Dans `assets/js/site.js`, en haut du fichier, renseigner :
```js
email: "adresse-qui-recoit-les-devis@exemple.fr"
```
Tant que ce champ est vide, le formulaire n'envoie rien (il le dit au visiteur et propose d'appeler). Une fois renseigné, le bouton « Envoyer ma demande » ouvre le logiciel de messagerie du visiteur avec sa demande déjà rédigée.
Pour un envoi automatique sans que le visiteur ait à valider dans sa messagerie, il faudra un service de formulaire (type Formspree / Getform) ou un petit script côté serveur : à brancher à la place du `mailto:` dans `site.js` (fonction du formulaire, section « formulaire »).

## 2. Autoriser Google (à faire le jour J)
Dans `index.html`, supprimer la ligne `<meta name="robots" content="noindex,nofollow">` (elle bloque Google tant que le site est une maquette). La balise `canonical` pointe déjà vers https://www.socap-paysage.com/.

## 3. Mentions légales (à compléter)
Dans `index.html` (fenêtre « Mentions légales », en bas du fichier) : renseigner l'hébergeur retenu (la ligne entre crochets) et vérifier les informations de la société (capital, SIRET, APE) avec SOCAP.

## Ce qui est déjà prêt
- Textes, 9 prestations, 7 réalisations, engagements UNEP, coordonnées (tél. 04 74 55 00 98, fax 04 74 55 27 56, Les Lazares, 01400 Châtillon-sur-Chalaronne) : repris du site actuel.
- Toutes les photographies sont celles de SOCAP (aucune photo de banque d'images).
- Adapté téléphone / tablette / ordinateur ; aucun cookie ; données du formulaire : usage limité à la réponse au devis (cf. mentions).
- Si le navigateur ne gère pas WebGL, la photo du haut de page reste affichée normalement.

## Mise à jour v3 — images
Les grandes images d'ambiance (hero, méthode, prestations, manifeste, contact) sont des **photos libres de droits (Pexels)**, signalées « Photo d'illustration ». Seule la section Réalisations contient de vraies photos SOCAP. Avant la mise en ligne réelle : remplacer ces images (`assets/img/hs*, pl*, sv*, mf*, ct`) par les photos du client, et renseigner `CONFIG.email` dans `assets/js/site.js`.
