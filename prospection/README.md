# Radar Menus QR — prospection internationale sans serveur

Assistant commercial pour trouver des restaurants qui ont besoin d'un menu QR multilingue, les noter, préparer les messages dans leur langue. **Il ne contacte personne** : Mourad relit, copie et envoie lui-même depuis son iPhone.

## Architecture (zéro serveur, zéro abonnement en plus)

| Pièce | Où | Coût |
|---|---|---|
| Moteur Python (stdlib, aucune installation) | `prospection/engine/` dans le dépôt, exécuté par une **session Claude Code cloud** | inclus dans l'abonnement Claude |
| Sources de prospects | OpenStreetMap / Overpass (gratuit, sans clé, via miroir `maps.mail.ru`) + page publique du restaurant | 0 € |
| Stockage durable des prospects | **base intégrée à l'artifact « Radar Menus QR »** (privé sur claude.ai, jamais dans le dépôt public) | 0 € |
| Tableau de bord iPhone | l'artifact `prospection/dashboard.html` (liste, scores, messages à copier, statuts, historique, entonnoir) | 0 € |
| Recherche quotidienne | tâche programmée Claude (session fraîche chaque jour) | voir « Automatisation » |

Les prospects ne sont **pas** commités dans le dépôt : il est public (GitHub Pages). Le dépôt contient seulement le code.

## Ce que fait le moteur (`engine/run.py`)
1. **Découvrir** : restaurants / cafés / bars d'une zone (centre-ville de ~50 villes de 20 pays, `engine/cities.py`) qui ont un site web ou une page sociale renseignée dans OpenStreetMap. Chaînes exclues.
2. **Dédoublonner** : par domaine du site (ou page sociale) et par nom + ville, contre la liste des prospects déjà connus.
3. **Analyser le site** (robots.txt respecté, 1 page d'accueil + au plus la page carte et la page contact, aucun formulaire, aucune connexion) : menu en PDF / image / page web, outil de menu ou QR déjà présent, langues du site, adapté au téléphone, HTTPS, année du copyright, emails **publiés**, Instagram, Facebook, WhatsApp, LINE.
4. **Noter sur 100** (explicable, `engine/score.py`) : besoin (≤ 62) + facilité de contact (≤ 28) + site actif (≤ 10). Déjà équipé d'un menu QR = plafonné à 25. Un site qui n'a pas pu être lu = « non analysé », jamais « mauvais ».
5. **Éliminer** : doublons, établissements sans aucune coordonnée publiée, score < 40.
6. **Préparer les messages** (`engine/messages.py`) : email, message Instagram/Facebook, proposition, dans la langue du pays (14 langues) + anglais. L'accroche (carte en PDF, carte introuvable…) n'est utilisée que si le fait a été mesuré. Prix jamais inventé : « à définir ensemble ».

## Règles respectées
- Jamais d'adresse devinée : uniquement celles publiées par l'établissement, source indiquée.
- Politique email par pays (`EMAIL_POLICY`) : Allemagne et Autriche = pas d'email à froid (message non généré) ; Espagne, Italie, Japon, Corée, Canada, Chine = prudence. **Information, pas un avis juridique.**
- Chaque message contient « répondez stop ». Un « stop » ou un refus = statut **Ne plus contacter**, définitif.
- Une relance maximum après 48 h. Jamais d'envoi en masse. Aucun contournement de Facebook / Instagram : le moteur ne les ouvre même pas.
- Les textes sont écrits par Claude : à faire relire par un natif avant d'en envoyer beaucoup.

## Lancer à la main (depuis l'iPhone)
Dans l'appli Claude → nouvelle session Code sur ce dépôt → écrire : **« Lance la prospection du jour »**. Claude exécute :
```
python3 prospection/engine/run.py --auto 3 --known prospection/out/known.txt --out prospection/out/run.json
```
puis écrit les nouveaux prospects dans la base de l'artifact « Radar Menus QR » (collection `prospects`, un document par prospect, identifiant `p_…`). `known.txt` est reconstruit chaque fois à partir de la base (identifiants + clés `nom|ville`).

Options : `--cities Nice,Kyoto` (villes précises), `--auto N` (N zones tournantes du jour), `--limit 25` (sites analysés par zone), `--min-score 40`.

## Automatisation quotidienne
Une tâche programmée Claude (session fraîche chaque jour, sans ordinateur allumé) lance le moteur et enregistre les résultats. Le texte de la tâche est dans `prospection/DAILY.md`. Elle consomme l'usage de l'abonnement Claude de Mourad : **ne l'activer qu'avec son accord**.

## Limites connues (honnêtes)
- OpenStreetMap ne connaît pas tous les restaurants : un restaurant sans site renseigné n'est pas trouvé.
- Certains sites bloquent les robots (403) ou chargent leur carte en JavaScript : ils sont marqués « non analysé ».
- Le moteur ne lit ni Instagram, ni Facebook, ni Google Maps (conditions d'utilisation) : il garde seulement les liens publiés sur le site du restaurant.
- Le Japon, la Corée et la Chine ont peu de sites indépendants dans OSM : prévoir des sources locales (annuaires dont l'usage est autorisé) si besoin.
