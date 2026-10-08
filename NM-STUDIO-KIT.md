# NM Studio : kit de lancement

Tout ce qu'il faut pour trouver tes premiers clients. Copie-colle, adapte le nom, envoie.

---

## 1. Ce qui est déjà en place sur le site

| Quoi | Où | Ce que ça fait |
|---|---|---|
| **Maquette gratuite en 48 h** | Bouton principal en haut du site + section « Voyez votre site avant de payer » | Le commerçant tape son nom, son type, sa ville : le message arrive sur ton WhatsApp |
| **Audit gratuit de la fiche Google** | Même section, carte de droite | Le commerçant tape son nom et sa ville ou son lien Maps : message sur ton WhatsApp |
| **Qui est derrière NM Studio** | Avant la FAQ | Ton prénom, 3 engagements, ta signature. Ta photo s'affiche dès que tu me l'envoies |
| **Maquette express** (outil pour toi) | `…/nm/maquette.html` (page cachée, pas sur Google) | Tu tapes le nom d'un prospect, tu choisis un modèle, tu obtiens un lien vers « son » site + le message prêt à envoyer |
| **Statistiques** | `assets/js/contact-config.js` | Prêtes : il suffit d'ajouter le code Cloudflare (voir plus bas) |

Réglages (un seul fichier, `nm/assets/js/contact-config.js`) :
- `whatsappNumber` : ton numéro au format international, sans + ni espaces (ex. `66812345678`). Avec ce numéro, les formulaires ouvrent WhatsApp avec le message déjà écrit. Sans numéro, le message est copié et le client le colle.
- `founderName` : ton prénom affiché sur le site.
- `founderPhoto` : ta photo (carrée, bien éclairée, souriante, fond neutre).
- `analyticsToken` : le code Cloudflare Web Analytics.

---

## 2. Trouver des prospects en 20 minutes (Google Maps)

1. Ouvre Google Maps, cherche **« restaurant »**, **« coiffeur »**, **« bar »**, **« boulangerie »** + une ville.
2. Ouvre chaque fiche et regarde :
   - **pas de site web** ou un lien Facebook à la place → prospect parfait ;
   - **peu de photos, photos sombres, horaires manquants, pas de réponses aux avis** → prospect pour la fiche Google ;
   - **bonnes notes (4,3+)** mais présence en ligne pauvre → ils ont des clients, ils peuvent payer.
3. Note dans un tableau : nom, ville, téléphone ou WhatsApp, Instagram, ce qui manque.
4. Vise **10 prospects par jour**. Le volume fait le résultat.

---

## 3. Les messages à envoyer

**Règle d'or :** jamais un message générique. Toujours le nom du commerce + une maquette faite avec l'outil **Maquette express** + une capture d'écran.

### Premier message (WhatsApp ou Instagram)
> Bonjour [Prénom], je suis Mourad de NM Studio. J'ai vu [Nom du commerce] sur Google Maps : vos avis sont super, mais vous n'avez pas encore de site. Je me suis permis de préparer une idée de site pour vous, gratuitement : [lien de la maquette]
> Ça vous plaît ? Si oui, je l'adapte avec vos photos et votre menu. Aucun engagement.

### Version fiche Google
> Bonjour [Prénom], je suis Mourad de NM Studio. J'ai regardé la fiche Google de [Nom du commerce] : il manque [les horaires / des photos récentes / des réponses aux avis]. Ça fait perdre des clients qui cherchent sur Maps. Je peux vous envoyer 3 conseils gratuits pour l'améliorer, ça vous intéresse ?

### Relance (3 à 4 jours après, une seule fois)
> Bonjour [Prénom], je me permets de revenir vers vous pour la maquette de [Nom du commerce]. Vous avez eu le temps d'y jeter un œil ? Je peux vous la montrer en 10 minutes en visio si vous voulez.

### Quand le client dit « c'est combien ? »
> Le site complet, c'est [prix] de mise en place, puis [prix] par mois. Ça comprend l'hébergement, votre nom de domaine, et toutes les modifications sur WhatsApp. Pas de contrat longue durée : vous arrêtez quand vous voulez. Et vous voyez le site terminé avant qu'il soit en ligne.

### Quand le client dit « je vais réfléchir »
> Bien sûr. Je vous laisse la maquette, elle reste en ligne. Une question : qu'est-ce qui vous ferait dire oui ? Le prix, le délai, ou autre chose ?

---

## 4. Tes réseaux (à créer, je réactive les icônes du site ensuite)

**Instagram / TikTok, nom :** `nmstudio.web` (ou proche s'il est pris)

**Bio (FR) :**
> Sites web, menus QR et fiches Google pour restaurants et commerces 🍽️
> Maquette gratuite en 48 h 👇

**Bio (EN) :**
> Websites, QR menus & Google listings for restaurants and local businesses
> Free mock-up in 48h 👇

**Idées de publications (une par jour au début) :**
- la vidéo du restaurant (celle de Gemini) ;
- un « avant / après » d'une fiche Google ;
- défilement d'un site de démo sur iPhone (enregistrement d'écran) ;
- « 3 erreurs sur votre fiche Google qui vous font perdre des clients » ;
- une maquette faite pour un vrai commerce (avec son accord).

---

## 5. La fiche Google « NM Studio » (ta propre vitrine)

- **Nom :** NM Studio
- **Catégorie principale :** Concepteur de sites Web ; secondaire : Agence de marketing
- **Zone desservie :** ta ville + « service en ligne »
- **Description (≤ 750 caractères) :**
> NM Studio crée des sites web, des menus QR et des fiches Google pour les restaurants, bars, salons et commerces. Vous envoyez vos photos, on s'occupe de tout : design, textes, mise en ligne et mises à jour. Vous voyez une maquette gratuite avant de payer, et vous validez tout avant la mise en ligne. Abonnement mensuel tout compris, sans contrat longue durée, modifications sur WhatsApp.
- **Photos :** ton logo, des captures des 8 sites de démo, ta photo.
- **Avis :** demande un avis à chaque client content, dès la mise en ligne.

---

## 6. Ton nom de domaine (à choisir ensemble)

Idées (vérifier la disponibilité) : `nm-studio.fr`, `nmstudio.fr`, `nmstudio.co`, `nm-studio.com`, `studionm.fr`
Prix : environ 10 à 15 € par an. Hébergement gratuit sur Cloudflare Pages, je m'occupe de la migration.

---

## 7. Ce qu'il reste à faire ensemble

- [ ] Vérifier la micro-entreprise (annuaire-entreprises.data.gouv.fr) → la réactiver ou en recréer une
- [ ] M'envoyer : ton **numéro WhatsApp** (pour les messages pré-remplis) et **ta photo**
- [ ] Choisir et acheter le **nom de domaine** → je migre le site
- [ ] Créer un compte **Cloudflare** (gratuit) → je branche l'hébergement et les statistiques
- [ ] Créer **Instagram / TikTok** → m'envoyer les liens
- [ ] Créer ta **fiche Google NM Studio**
- [ ] Ajouter ton **SIRET** dans les mentions légales dès qu'il existe
- [ ] Prospecter : **10 commerces par jour** avec la Maquette express
