# AI Skill — Kit de lancement (pour toi, en français)

Site : `skill-ai-th/` — vente de 3 formations en thaï, paiement PromptPay (QR généré automatiquement) + carte (Stripe, optionnel), accès via codes.

## 1. À configurer (bloc `CONFIG` en haut de `assets/js/main.js`)
| Champ | Quoi mettre |
|---|---|
| `LINE_OA` | ton LINE Official Account (gratuit sur manager.line.biz) |
| `PROMPTPAY` | numéro de téléphone ou n° carte d'identité lié à PromptPay |
| `ACCOUNT_NAME` | nom du compte (affiché sous le QR) |
| `STRIPE` | liens Stripe Payment Links par pack (optionnel) |
| `CODES` | les 4 codes d'accès ; change-les quand tu veux |
| `PLANS` | prix en THB (590 / 1 290 / 990 / 1 990 par défaut — à ajuster) |
| `FORM_ENDPOINT` | URL Formspree pour collecter les e-mails du lead magnet |
| `PIXEL_ID` / `GA_ID` | Meta Pixel / Google Analytics, si tu fais de la pub |

## 2. Mise en ligne gratuite
GitHub Pages, Netlify ou Cloudflare Pages sur le dossier `skill-ai-th/`. Achète un nom de domaine (`.com`/`.co.th`) quand les ventes démarrent.

## 3. Parcours client
1. Il arrive (TikTok / Facebook / LINE) → page de vente → **ou** ressource gratuite (`free.html`, 15 prompts) pour capter l'e-mail.
2. Il choisit un pack → `checkout.html` → scanne le QR PromptPay → envoie le slip sur LINE.
3. Tu vérifies le virement → tu lui envoies le code du pack → `members.html`.

⚠️ Vérification manuelle des virements = tu dois répondre vite (idéalement < 24 h). Plus tard : Stripe/Omise pour l'automatiser.
⚠️ Les codes sont côté navigateur (site statique) : ce n'est pas un vrai contrôle d'accès. Suffisant pour démarrer ; si les codes fuitent, change-les. Pour du sérieux, passe sur une plateforme de cours (Teachable, Podia, Kajabi) ou ajoute un backend.

## 4. Trouver des clients (gratuit d'abord)
- **TikTok** (ton propre sujet !) : 1 vidéo/jour montrant des résultats réels de l'IA (sites faits en 10 min, vidéos IA). CTA : « lien en bio » → free.html.
- **Facebook** : groupes thaïs sur AI / business en ligne / freelance — apporte de la valeur d'abord, ne spamme pas (bannissement).
- **LINE OA** : message de bienvenue + envoi du lead magnet + relances.
- **Preuve** : fais 2-3 vrais sites pour des commerces (même gratuits) → captures dans la page de vente. Aucun faux témoignage, c'est illégal et ça détruit la confiance.

## 5. Règles légales / confiance (important)
- Ne promets **aucun revenu**. Pas de « millions », pas de captures de revenus truquées. La loi thaïe (et TikTok/Meta en pub) sanctionne les promesses trompeuses ; le site contient déjà les disclaimers.
- « Gratuit » = versions gratuites des outils, qui ont quotas/filigranes ; c'est dit sur le site. Vérifie leurs conditions d'usage commercial.
- La garantie 7 jours est un choix commercial : retire-la (page d'accueil + `terms.html`) si tu ne veux pas la proposer.
- Fais relire `terms.html`/`privacy.html` par un juriste avant gros volume. Enregistre ton activité (impôts, DBD/e-commerce) selon ton statut en Thaïlande.

## 6. Objectifs réalistes (pas de promesse)
Les ventes dépendent de ton audience. Ordre de grandeur utile pour piloter : visiteurs → inscriptions gratuites (≈ 10-30 %) → achats (≈ 1-5 % des inscrits). Mesure avec Meta Pixel / GA et améliore la page chaque semaine.

## 7. Prochaines étapes possibles
- Vidéos de cours enregistrées (YouTube non répertorié) intégrées dans `members.html`.
- Page de capture dédiée pub TikTok/Meta, e-mails de relance, upsell (consulting 1:1).
