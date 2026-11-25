# QR BUSINESS AI AGENT

Votre commercial IA pour vendre des menus QR premium aux restaurants : **découverte → analyse → démonstration privée → email supervisé → réponses → relances → CRM → rapport**, piloté depuis un seul tableau de bord.
Stack : Node 22 + Fastify + TypeScript · PostgreSQL (embarqué PGlite en local, PostgreSQL hébergé via `DATABASE_URL`) · React + Tailwind · moteur de menus du dossier `menus/`.

## Ce qui fonctionne réellement (et ce qui demande vos comptes)

| Fonction | État |
|---|---|
| Base, CRM (12 statuts), doublons, historique, tableau de bord, filtres pays/ville/type/statut/score | ✅ fonctionne, testé |
| Analyse de site (page d'accueil + carte + contact, robots.txt respecté), faits mesurés, score 0–100 | ✅ testé sur sites simulés ; ✅ vrai fetch vérifié (example.com) |
| Emails **publiés** par l'établissement (jamais devinés), vérification MX, source enregistrée | ✅ |
| Démos privées au design premium (cartes photo, 3D, thème selon le type) : lien non devinable, noindex, expiration, « prototype non officiel ». Carte extraite vérifiée mot à mot ou exemples marqués ; **photos de plats libres de droits** (Wikimedia Commons) acceptées seulement si le titre de la photo nomme le plat (pas de photo plutôt qu’une mauvaise) ; **héros** proposé mais jamais utilisé sans votre accord (il peut montrer des personnes) ; crédits sur /d/…/credits | ✅ testé (Commons réel vérifié) |
| Emails FR/IT/EN/DE/ES, validation humaine, désinscription 1 clic + List-Unsubscribe, liste de suppression, plafonds, fenêtre horaire locale, anti-double envoi | ✅ testé (62 tests) |
| Réponses : détection stop/refus/intérêt/prix en 5 langues, brouillon de réponse et de devis | ✅ testé (webhook ou IMAP) |
| Planificateur (horaires, limites, reprise après arrêt, un créneau = une exécution), rapport quotidien | ✅ testé |
| **Découverte OpenStreetMap** | ⚠️ codée + parseur testé ; **non vérifiée en réel** (le serveur Overpass n'était pas joignable depuis l'environnement de développement) |
| **Brave Search, Google Places** | ⚠️ codés, **non testés** (clés requises) ; Google désactivé par défaut (conditions) |
| **IA Claude** | ⚠️ codée, garde-fous testés avec un faux modèle ; **non testée en réel** (clé requise) |
| **Envoi réel Resend / SMTP, relève IMAP** | ⚠️ codés ; **non testés en réel** (comptes requis). Tant que `EMAIL_LIVE` n'est pas `true`, tout est simulé |
| Hébergement 24 h/24 | ❌ à faire : il faut un serveur Node (voir « Déployer »). GitHub Pages ne peut pas l'héberger |

## Démarrer en local
```bash
npm install
npm run sync-engine          # copie le moteur de menus (menus/assets) dans server/engine
npm run build
cp .env.example .env         # remplissez au minimum ADMIN_EMAIL, ADMIN_PASSWORD (dev) ou ADMIN_PASSWORD_HASH, SESSION_SECRET
npm start                    # http://localhost:8787
npm test                     # 62 tests
```
Dev interface : `npm run dev:server` + `npm run dev:web` (http://localhost:5173).

## Brancher vos comptes (tout se règle par variables d'environnement ; voir `.env.example` et l'onglet « Connexions API »)
1. **Mot de passe** : `npm run hash-password -- "votre mot de passe"` → collez `ADMIN_PASSWORD_HASH`. `SESSION_SECRET` : `openssl rand -base64 48`.
2. **IA** : clé sur console.anthropic.com → `ANTHROPIC_API_KEY`. Plafond d'appels : `AI_DAILY_CALL_LIMIT`.
3. **Email** (le plus important) : domaine à vous avec SPF/DKIM. Resend : `EMAIL_PROVIDER=resend`, `RESEND_API_KEY`, `EMAIL_FROM`. Ou SMTP. Renseignez `SENDER_POSTAL_ADDRESS`. Essayez d'abord avec **votre propre adresse** comme prospect, puis seulement `EMAIL_LIVE=true`.
4. **Réponses** : `IMAP_*` (la tâche « Relever les réponses ») ou webhook `POST /api/inbound/email` avec l'en-tête `x-webhook-secret`.
5. **Prospects** : OpenStreetMap marche sans clé ; ajoutez `BRAVE_SEARCH_API_KEY` ; import CSV depuis des annuaires dont vous avez le droit d'utiliser les données.
6. **Zones** : onglet Automatisations → « Zones de prospection » (une ville par ligne, orthographe OpenStreetMap).

## Règles de sécurité et de conformité intégrées (ne se contournent pas depuis l'interface)
- Validation humaine par défaut. L'envoi automatique est **par pays**, désactivé par défaut, **impossible** pour les pays « accord préalable » (ex. Allemagne) ; aide-mémoire par pays dans l'onglet Conformité (**pas un avis juridique** : faites valider avant d'activer).
- Aucun email deviné ; une adresse n'est utilisée que si elle a une **source publiée** enregistrée et passe la vérification.
- Désinscription : lien d'un clic dans chaque message, en-têtes List-Unsubscribe (RFC 8058), « stop » dans les réponses (5 langues). La liste de suppression est permanente et **revérifiée à la seconde de l'envoi**.
- Un seul email de prospection par établissement ; 2 relances maximum, jamais après une réponse, un refus ou une désinscription.
- Aucun envoi sans adresse postale d'expéditeur ; semaine et heures de bureau du pays du destinataire ; plafond quotidien.
- Sites analysés : robots.txt respecté, identifiés par un User-Agent, 1 requête / 1,5 s / site, aucune contournement d'anti-bot ni de connexion.
- Les démos sont des **prototypes non officiels** ; plats/prix extraits seulement s'ils figurent mot à mot sur leur page carte, sinon contenu d'exemple marqué.

## Déployer 24 h/24
Un petit serveur suffit (Fly.io, Render, Railway, VPS). `docker build -t qr-agent . && docker run -d -p 8787:8787 --env-file .env -v qr-data:/data qr-agent`, derrière HTTPS (le cookie de session devient `secure` si `PUBLIC_BASE_URL` commence par https). Sauvegardes : `npm run backup` (cron quotidien). Les logs sont en JSON sur la sortie standard.
Le planificateur vit dans le serveur : s'il est arrêté, les tâches reprennent au créneau suivant ; les tâches interrompues sont marquées et jamais rejouées en double.

## Architecture
`server/src` : `api/` (Fastify, auth, routes) · `db/` (migrations SQL) · `connectors/` (OSM, Places, Brave) · `analysis/` (site, score) · `demo/` (génération + page privée) · `email/` (templates 5 langues, composition, envoi, réponses) · `agents/ai.ts` (appel IA avec quota) · `scheduler/` (tâches + planning) · `compliance.ts` · `crm.ts` · `reports.ts` · `web/` : tableau de bord React/Tailwind.
