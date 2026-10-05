# Atelier des Façadiers — site (refonte)

Site statique (HTML/CSS/JS, sans build) pour l'Atelier des Façadiers, distributeur / transformateur / service technique du bardage de façade. Contenu, chiffres, coordonnées et photos viennent du site actuel https://atelierdesfacadiers.com/.

**Pages** : `index.html` (accueil) · `savoir-faire.html` · `bardage.html` · `ossature.html` · `projets.html` · `documentation.html` · `contact.html`.

**Ce qui est interactif**
- Hero : diaporama de chantiers + révélation « panneau par panneau ».
- Accueil : *façade ventilée* en 3D (5 couches qui se déconstruisent au scroll), **configurateur de façade** (famille de panneaux · pose · teinte → aperçu SVG, transmis au formulaire de devis) et estimateur de nombre de panneaux.
- Projets : galerie avec visionneuse (flèches, Échap).
- Contact : formulaire avec validation et préremplissage depuis le configurateur.

**À configurer** : le bloc `CONFIG` en haut de `assets/js/site.js` (`EMAIL` ou `FORM_ENDPOINT`). Vide = le visiteur obtient un récapitulatif à copier + boutons d'appel (aucun envoi).

**À vérifier avec le client** : mentions légales (liées au site actuel), actualités (copiées du site actuel), teintes du configurateur (indicatives), formats de l'estimateur (indicatifs). Polices hébergées dans `assets/fonts/` (Archivo, Instrument Sans, IBM Plex Mono — licence OFL).
