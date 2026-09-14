# Monsoon — Nightlife demo site (bar / pub / discothèque)

Site de démonstration pour le pitch commercial auprès des bars, pubs et
discothèques de Pattaya — pensé pour être ouvert sur un ordinateur portable
devant le commerçant. Vitrine complémentaire au style Giulivo (restaurant) :
identité visuelle néon/tropicale distincte, pensée pour les établissements
de nuit.

Site statique en HTML / CSS / JS pur — aucune installation ni build nécessaire.

## Voir le site en local

```bash
python3 -m http.server 8000
```

puis ouvrez http://localhost:8000/monsoon/

## Structure du projet

```
index.html              → toute la page (nav, ticker, hero, programme,
                           ambiance, boissons, VIP, contact)
assets/css/style.css     → identité visuelle, couleurs, animations
assets/js/main.js        → données (programme, boissons), ticker défilant,
                           réservation VIP (lien LINE), menu mobile
```

## Identité visuelle

- Palette : `--noir` (fond quasi noir à dominante verte), `--bougainvillea`
  (magenta néon), `--lagoon` (turquoise), `--amber` (chaud, style guirlande
  lumineuse) — inspirée des enseignes lumineuses et de l'ambiance tropicale
  nocturne thaïe plutôt que du cyberpunk générique.
- Polices : `Unbounded` (titres, effet néon) et `Sora` (texte courant),
  chargées depuis Google Fonts.
- Un seul moment d'animation marqué : le nom "Monsoon" s'allume comme un
  tube néon à l'ouverture de la page. Le reste (ticker du programme,
  révélation de la mosaïque au scroll) reste sobre.

## Contenu à adapter pour un vrai client

- `LINEUP`, `MOSAIC`, `DRINKS` dans `assets/js/main.js` — programme de la
  semaine, zones du lieu, carte des boissons
- Coordonnées (téléphone, LINE, Instagram, adresse) dans `index.html`
  (section `<footer>` et boutons de réservation)
- Le formulaire VIP ouvre une conversation LINE pré-remplie ; à remplacer
  par le vrai identifiant LINE du client.

## Personnalisation rapide

- Couleurs : variables CSS en haut de `assets/css/style.css`
- Programme / boissons / zones du lieu : tableaux en haut de
  `assets/js/main.js`
