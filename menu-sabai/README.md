# Menu Sabai

Menu QR digital pour petits commerces (restaurants, bars, stands de rue), avec commande
directe et notification LINE au commerçant. Version réelle du concept prototypé dans
la démo Artifact — voir le fil de conversation pour le contexte produit et les offres
(Standard / Premium / Élite).

## Architecture

Pas de serveur à faire tourner soi-même : tout passe par des services hébergés.

- **Supabase** — base de données (Postgres), authentification des commerçants, stockage
  des photos de plats, et une Edge Function serverless pour la notification LINE.
- **Stripe Payment Links** — facturation récurrente des 3 offres, sans backend de paiement
  à écrire (un lien par offre, généré depuis le dashboard Stripe).
- **Frontend** — HTML/CSS/JS simple (pas d'étape de build), qui parle directement à
  Supabase depuis le navigateur via sa clé publique (`anon key`) ; la sécurité est
  assurée par les règles Row Level Security définies dans `supabase/schema.sql`.

## Mise en place

1. **Base de données** : dans Supabase → SQL Editor, exécute le contenu de
   `supabase/schema.sql`. Ça crée les tables (`merchants`, `dishes`, `orders`), les
   règles de sécurité, et le bucket de stockage des photos.
2. **Clés API** : copie `assets/js/config.js`, remplace `SUPABASE_URL` et
   `SUPABASE_ANON_KEY` par les valeurs de Project Settings → API. Ne jamais y mettre la
   clé `service_role`.
3. **Notification LINE** :
   - Crée un canal "Messaging API" sur developers.line.biz, récupère son
     `Channel access token`.
   - Dans Supabase → Edge Functions → Secrets, ajoute `LINE_CHANNEL_ACCESS_TOKEN`.
   - Déploie la fonction : `supabase functions deploy notify-order`.
   - Dans Supabase → Database → Webhooks, crée un webhook qui appelle `notify-order`
     sur chaque `INSERT` dans la table `orders`.
4. **Paiement** : crée 3 Payment Links dans Stripe (Standard 15€/mois, Premium 30€/mois,
   Élite 100€/mois + frais de mise en place 50€), un lien par offre.

## État actuel

- [x] Schéma de base de données + sécurité (RLS)
- [x] Fonction de notification LINE (à déployer une fois le compte LINE prêt)
- [ ] Page d'inscription / connexion commerçant
- [ ] Tableau de bord (menu, photos, prix) branché à la vraie base
- [ ] Page publique menu + commande, branchée à la vraie base
- [ ] Intégration des liens de paiement Stripe
