/* Mes discussions — tableau de bord privé (nm/organisation.html).
 * Chaque discussion Claude met à jour SA fiche ici quand elle finit une étape importante :
 * etat ("cours" | "attente" | "pause" | "fini"), maj (date), fait, attend (ce que Mourad doit faire), liens.
 */
window.DISC_UPDATED = "2026-10-15";

window.DISC_TODO = [
  { t: "Acheter le domaine nmstudiothai.com sur cloudflare.com (≈10 $/an), puis créer la clé limitée", d: "VG" },
  { t: "Créer le compte LINE Official Account (manager.line.biz) et envoyer le lien", d: "VG", why: "pour le 2e QR de la carte de visite" },
  { t: "Créer la micro-entreprise sur formalites.entreprises.gouv.fr", d: "VG", why: "obligatoire avant de facturer" },
  { t: "Faire relire les textes thaï (carte, vidéo) par ta femme", d: "VG" },
  { t: "Répondre « oui » ou « non » pour ajouter 4 liens dans Mon espace", d: "Vidéo IA" }
];

window.DISC = [
  { name: "VG", etat: "cours", maj: "2026-10-15",
    sujet: "Sites clients, NM Studio (domaine, carte de visite), entreprise, prospection",
    fait: [
      "Site démo SOCAP Paysage v3 (mobile fluide, studio d'ambiance)",
      "NM Studio prêt pour nmstudiothai.com (build-nm.sh)",
      "Carte de visite v5 « Monogramme » (PDF d'impression + vernis)",
      "Vidéo traduite en thaï, scripts d'appel, stratégie Thaïlande"
    ],
    attend: ["Domaine nmstudiothai.com", "Lien LINE", "Micro-entreprise"],
    liens: [
      { n: "Site SOCAP Paysage", u: "https://mouradoulf-cmd.github.io/Mourad-site/socap-paysage/" },
      { n: "Carte de visite (fichiers)", u: "https://github.com/mouradoulf-cmd/Mourad-site/tree/claude/thai-app-mnw166/nm/business-card/v5" }
    ],
    pour: "Nouveaux sites clients, NM Studio, domaine, cartes, questions entreprise/admin" },
  { name: "Vidéo IA", etat: "attente", maj: "2026-10-08",
    sujet: "Studios vidéo IA : Studio Universel, Remix, Story Studio",
    fait: ["Studio Universel (séries, téléchargement groupé)", "Remix Studio (vidéo TikTok → nouvelle version)"],
    attend: ["Répondre oui/non pour ajouter 4 liens dans Mon espace"],
    note: "Problème connu : le Remix invente parfois des personnages ou du son ; pas encore corrigé.",
    liens: [{ n: "Story Studio", u: "https://mouradoulf-cmd.github.io/Mourad-site/story/" }],
    pour: "Tout ce qui est vidéo IA" },
  { name: "Formation automatisée", etat: "pause", maj: "2026-10-11",
    sujet: "NM Academy (formation), Mon espace, réservation Jong-ngai",
    fait: ["NM Academy", "Appli « Mon espace » sur l'iPhone"],
    attend: ["Installation de REA : reportée (« on fera ça plus tard »)"],
    liens: [
      { n: "NM Academy", u: "https://claude.ai/artifact/8nSXmvuVbzfwtwMEkdeBjh" },
      { n: "Mon espace", u: "https://mouradoulf-cmd.github.io/Mourad-site/nm/demos.html" }
    ],
    pour: "La formation NM Academy et l'appli Mon espace" },
  { name: "Business plan Thai", etat: "pause", maj: "2026-10-13",
    sujet: "Business plan Thaïlande, Avatar Cash, NM Academy vente ; dernièrement : réparation PC",
    fait: ["Avatar Cash", "Page de vente NM Academy"],
    attend: ["Limite hebdomadaire atteinte : reprendre plus tard (la réparation PC était en cours)"],
    liens: [{ n: "Avatar Cash", u: "https://claude.ai/artifact/34nPeKyCopuG256DRmkBd8" }],
    pour: "Plan d'affaires Thaïlande et questions perso" },
  { name: "Terminées (archivées)", etat: "fini", maj: "",
    sujet: "NM STUDIO (le gros du site NM), Site massage Malee, Refonte Giulivo / Façadiers, Site restaurant, Portiva, Vidéos 3D Sabai, DJs, Gagner 20 €/jour, Vérif. MCP 21st",
    fait: [], attend: [], liens: [], pour: "Rien à faire : le travail est déjà dans le dépôt et dans Mon espace" }
];
