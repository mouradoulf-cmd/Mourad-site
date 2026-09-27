# V6 Thai Massage And Spa — demo site

Site premium pour un vrai établissement trouvé sur Google Maps
(Pattaya, 4,7★, 277 avis) — construit avec le skill
`editorial-service-booking` : palette ivoire chaude + chapitres
near-black, serif Fraunces + sans-serif Inter, sélecteur de soins
accessible (clavier + lecteur d'écran), infos vérifiables uniquement
(note Google réelle, adresse réelle, horaires réels).

Site statique en HTML / CSS / JS pur, aucune installation ni build.

## Voir le site en local

```bash
python3 -m http.server 8000
```

puis ouvrez http://localhost:8000/v6-thai-spa/

## Ce qui est honnête ici (et ce qui ne l'est pas encore)

- **Nom, adresse, horaires, note Google, liste de soins** : réels,
  repris de leur fiche Google Maps et de leur page Facebook
  (facebook.com/v6thaispa).
- **Photos** : aucune photo réelle utilisée — ce sont des blocs
  couleur en placeholder, honnêtement labellisés. Les vraies photos
  du salon remplaceront ça une fois l'accord du propriétaire obtenu.
- **Durées et prix des soins** : pas affichés, volontairement — on ne
  les connaît pas, donc le site dit "confirmé à la réservation" plutôt
  que d'inventer des chiffres.
- **Réservation** : pas de vrai système de réservation en ligne (site
  statique) — les CTA renvoient vers leur page Facebook, seul canal de
  contact vérifié qu'on a.

⚠️ Comme les autres démos du repo, ne pas publier cette page en ligne
publiquement sans l'accord du propriétaire de V6 Thai Massage And Spa —
c'est un support à montrer en personne pour leur proposer le site.

## Personnalisation

- Nom, adresse, textes : `index.html`.
- Palette / typographie : variables CSS en haut de
  `assets/css/style.css`.
- Sélecteur de soins (accessible, clavier + tab/tabpanel ARIA) :
  `assets/js/main.js`.
