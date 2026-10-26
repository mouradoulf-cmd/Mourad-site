/* NM Studio — data behind "Mon espace" (demos.html, private). Claude keeps this file up to date in every
 * conversation on this repo: any new demo, page or project goes here, and NM_UPDATED gets today's date.
 *
 * NM_DEMOS — one line per client demo (the site lives at /Mourad-site/demos/<slug>/), any order (sorted A-Z):
 *   { slug: "chez-paolo", name: "Chez Paolo", type: "Restaurant", city: "Hua Hin", date: "2026-10-12",
 *     status: "prete" | "envoyee" | "discussion" | "client" | "non", phone: "", note: "" }
 * NM_LINKS — every link, grouped; `space` puts the group in one of the three spaces:
 *   "site" (Site web) · "video" (Vidéo IA) · "formation" (Formation). `path` is relative to /Mourad-site/,
 *   or a full https:// URL for something hosted elsewhere.
 */
window.NM_UPDATED = "2026-10-27";

window.NM_DEMOS = [
];

window.NM_LINKS = [
  { space: "site", group: "🇹🇭 🇫🇷 Site web thaïlandais · en français pour moi", items: [
    { name: "Site web thaïlandais · en français", icon: "🇹🇭🇫🇷", path: "nm/th-fr/", note: "Le site que voient les clients thaïs, traduit en français pour toi (copie privée, pas pour les clients)" },
    { name: "Les 2 offres", icon: "🇹🇭🇫🇷", path: "nm/th-fr/#offers", note: "Menu QR 390 ฿/mois, installation gratuite · Site web + menu QR 790 ฿/mois · bouton rendez-vous" },
    { name: "Avant / après", icon: "🇹🇭🇫🇷", path: "nm/th-fr/#menu-ba", note: "Le vieux menu papier tout en thaï → le QR sur la table → le menu dans le téléphone" },
    { name: "Prendre rendez-vous", icon: "🇹🇭🇫🇷", path: "nm/th-fr/#book", note: "Jour + heure, puis commerce, adresse, prénom → WhatsApp s'ouvre avec le message tout écrit" },
    { name: "Menu QR d'exemple · Mae Lek en français", icon: "🇫🇷", path: "menus/mae-lek/?lang=fr", note: "Le menu à montrer, ouvert en français : photos, piment, allergies, « montrer au serveur » en thaï" },
    { name: "Kit de vente (pour ta femme)", icon: "🇹🇭🇫🇷", path: "nm/kit.html", note: "En visite : taper le nom du resto → QR à scanner → le patron voit un menu à son nom. + pitch 1 min, réponses aux objections, prix, liste de ce qu'il faut récupérer (thaï / FR)" },
    { name: "Mes menus QR (tableau de bord)", path: "nm/menus.html", note: "Qui a payé (vert), à relancer (orange), en pause (rouge), cartes QR à imprimer" },
    { name: "Site web thaïlandais · version clients (ไทย)", icon: "🇹🇭", path: "nm/th/", note: "La vraie version en thaï, celle que tu montres aux patrons" }
  ] },
  { space: "site", group: "NM Studio", items: [
    { name: "NM Studio · Français", path: "nm/fr/", note: "Le site à montrer aux clients" },
    { name: "NM Studio · English", path: "nm/" },
    { name: "NM Studio · ไทย", path: "nm/th/" },
    { name: "NM Studio · Italiano", path: "nm/it/" },
    { name: "NM Studio · العربية", path: "nm/ar/" },
    { name: "Tarifs", path: "nm/fr/pricing.html", note: "Prix Europe" },
    { name: "Mes discussions", path: "nm/organisation.html", note: "Où en est chaque conversation + ce qui t'attend" },
    { name: "Offres Thaïlande · ไทย", path: "nm/th/#offers", note: "Menu QR 390 ฿/mois (installation gratuite) · Site web + menu QR 790 ฿/mois · bouton rendez-vous. Copie en français : nm/th-fr/#offers" }
  ] },
  { space: "site", group: "Menus QR (abonnements)", items: [
    { name: "Mes menus QR", path: "nm/menus.html", note: "Tableau de bord : revenu du mois, à faire, calendrier des paiements, fiche de chaque restaurant, carte QR, rappel WhatsApp" },
    { name: "Kit de vente · démo au nom du resto", path: "nm/kit.html", note: "Nom du restaurant → QR → menu d'exemple à son nom (lien ?shop=…)" },
    { name: "Menu QR · Mae Lek (exemple thaï)", path: "menus/mae-lek/", note: "Photos HD retouchées · À montrer aux restaurants : prix en baht, 6 langues dont 中文 / Русский / 한국어, piment, écran serveur en thaï" }
  ] },
  { space: "site", group: "Démos clients", items: [
    { name: "SOCAP Paysage", path: "socap-paysage/", note: "Paysagiste (Ain) · démo premium" },
    { name: "Giulivo", path: "giulivo/", note: "Restaurant (Vicopisano) · version actuelle : carte à feuilleter, lumières qui s’allument, textes grande maison" }
  ] },
  { space: "formation", group: "NM Academy", items: [
    { name: "NM Academy (à jour)", path: "https://claude.ai/artifact/8nSXmvuVbzfwtwMEkdeBjh", note: "La formation : page de vente, formations, réalisations, tarifs, inscription" }
  ] },
  { space: "video", group: "Mon site", items: [
    { name: "Story Studio", path: "story/", note: "Dessin animé en plusieurs épisodes" }
  ] },
  { space: "video", group: "Pub NM Studio", items: [
    { name: "Pub NM Studio · Français", path: "nm/assets/video/pub/nm-studio-pub-fr.mp4?v=5", note: "Film complet 63 s · site Giulivo sur le téléphone · TikTok / Reels avec sous-titres" },
    { name: "Pub NM Studio · English", path: "nm/assets/video/pub/nm-studio-pub-en.mp4?v=5" },
    { name: "Pub NM Studio · ไทย", path: "nm/assets/video/pub/nm-studio-pub-th.mp4?v=5" }
  ] }
];
