# Projets de Mourad : mémoire de travail

Mis à jour le 19 octobre 2026. Ce fichier garde l'état de tous les projets discutés avec Claude, pour reprendre sans rien perdre. (Les documents personnels, comme l'attestation, ne sont volontairement pas gardés ici.)

## 1. NM Academy : site de vente des formations
- **Dossier :** `nm-academy/` — lien à jour : https://claude.ai/artifact/8nSXmvuVbzfwtwMEkdeBjh (privé au départ ; la page indiquait « toute personne avec le lien » à la dernière publication).
- **Formations :** Plan A (créer et vendre des sites, 100 €), Plan B (vidéo IA, 150 €), Pack A+B (200 €), coaching 1:1 (297 €), garantie 14 jours. Prix d'exemple dans `nm-academy/assets/js/config.js`.
- **Pages :** langues (`langues.html`, fond aurore), vente, formations (+ détail sites / vidéo), réalisations (galerie 3D), tarifs, contact, inscription (`paiement.html`). Trois langues : FR / EN / TH. Palette bleu et rose.
- **Honnêteté :** pas de promesse de revenus, pas de faux avis, pas de faux compte à rebours.
- **À faire :** vrais liens de paiement (`LINKS` vide), vrai numéro WhatsApp (valeur actuelle = faux `33600000000`), vrais avis/élèves, relecture du thaï par un natif, décider si `vente.html` devient la page d'entrée (`index.html` appartient à une autre session).
- Lien ajouté dans le hub « Mon espace » (branche `claude/thai-app-mnw166`, fichier `nm/assets/js/demos-data.js`).

## 2. Diagnostic pour petits commerces (Pattaya)
- **Dossier :** `diagnostic/` (notes détaillées dans `diagnostic/NOTES.md`) — modèle : https://claude.ai/artifact/T19n9QyvTCDtnhynfcCNHT
- 5 questions d'un clic, animation de réflexion (~13 s), 3 solutions avec bénéfices, **sans prix**. Carnet de visites sur le téléphone (5 touches sur le logo).
- Solutions proposées : site vitrine, fiche Google Maps, menu QR multilingue, bouton LINE/WhatsApp, page promos, réservation simple, carte de fidélité.
- **Prochaine étape :** carte de fidélité avec deux QR codes (table = menu, caisse = point), anti-triche (1 point / 12 h + écran de confirmation), puis version avec base de données et tableau de bord pour le gérant.
- Guide de visite en français (PDF, 3 pages : questions, outils, devis type) envoyé à Mourad ; version thaï puis anglaise à faire. Les prix du guide sont des estimations non vérifiées ; Mourad préfère discuter le prix en direct.

## 3. Business en Thaïlande (objectif 20 à 30 €/jour)
- Piste retenue : sites + outils sur mesure pour commerces locaux, avec abonnement mensuel de maintenance. Routine : prospecter ~10 commerces par jour.
- Plan « revenus passifs » (sites/modèles, formations, packs de prompts, contenu TikTok/YouTube) donné en conversation.
- À vérifier : permis de travail et impôts en Thaïlande, règles PDPA si on garde des numéros de téléphone.

## 4. Rappels automatiques (dans cette conversation)
- OmniRoute : tous les jours à 17h59 (Paris) — `trig_01DRZMbNW2CVtLW5kS1GgKk4`.
- Reverse engineering : 17h48, 18h08, 18h28 — `trig_01Y3Qf5UTw9qbAe9bhvbXDXN`, `trig_012zixFSfwwwwi8auhs9nmWz`, `trig_01B4P6pvvZSG8Mf22MJj5t3C`.
- Pour arrêter : demander à Claude de supprimer le rappel.

## 5. OmniRoute (passerelle d'IA)
- Installé seulement dans le conteneur temporaire de Claude (effacé en fin de session). Pour l'avoir : installer Node.js puis `npm install -g omniroute` sur le PC de Mourad.
- Il ne donne pas « 7 milliards de tokens » : il regroupe des offres gratuites d'autres services (≈1,62 milliard/mois annoncé, estimation, avec ses propres comptes). Ne remplace pas Claude Code.

## 6. Autres travaux faits
- Sous-titres français d'une vidéo traduits en thaï (vidéo remontée et livrée) ; textes d'une seconde vidéo traduits en thaï (texte seulement).
- Aide au dépannage d'un PC de jeu (mémoire réglée en XMP, câbles d'alimentation à vérifier, températures à mesurer avec HWiNFO) : plantage en jeu non résolu.

## 7. Menus QR par abonnement (Thaïlande, 2026-10-25)

Offre : menu QR traduit (ไทย, English, 中文, Русский, Français, Italiano) donné gratuitement 1 mois, puis 390 ฿/mois.
- Tableau de bord privé : https://mouradoulf-cmd.github.io/Mourad-site/nm/menus.html (vert = payé, orange = à relancer, rouge = en pause, QR à imprimer, rappel WhatsApp).
- Exemple : https://mouradoulf-cmd.github.io/Mourad-site/menus/giulivo/
- Fichiers (branche publiée `claude/thai-app-mnw166`) : `menus/abonnements.json` (date « payé jusqu'au » par restaurant, pause auto après 4 jours de retard), `menus/<slug>/menu.js` (contenu), `menus/assets/` (affichage commun).
- Quand Mourad dit « X a payé » : repousser `paidUntil` d'un mois. Nouveau restaurant : copier `menus/giulivo/`, remplir `menu.js`, ajouter une ligne dans `abonnements.json`.
- À faire : premiers vrais restaurants pendant son séjour en Thaïlande.

## Règles de travail avec Mourad
- Réponses en français, courtes, avec le lien à jour quand une page change.
- Honnêteté d'abord : dire ce qui n'est pas vérifié ; ne pas promettre de revenus.
- Quand Mourad dit « fais rien encore, on parle », ne rien construire avant son « go ».

## Skills installés (2026-10-19, vidéo « 10 repos GitHub pour Claude »)
- `hallmark` (Nutlope, MIT) : design sans look « IA ».
- `rea` (morluto, MIT) : rétro-ingénierie d'apps ; l'installation de son serveur reste à faire et à approuver (Hopper/Ghidra requis pour le natif).
- `last30days` (mvanhorn, MIT) : recherche des 30 derniers jours (Reddit, TikTok, YouTube…) ; certaines sources demandent une clé API.
- Déjà présents : ponytail, superpowers, impeccable, ui-ux-pro-max.
