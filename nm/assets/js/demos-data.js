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
  { space: "site", group: "🇹🇭 → 🇫🇷 Site web thaïlandais, traduit en français pour moi", items: [
    { name: "Site web thaïlandais · en français", icon: "🇹🇭🇫🇷", path: "nm/th-fr/", note: "Le site que voient les clients thaïs, traduit en français pour toi (copie privée, pas pour les clients)" },
    { name: "Les 2 offres", icon: "🇹🇭🇫🇷", path: "nm/th-fr/#offers", note: "Menu QR 390 ฿/mois, installation gratuite · Site web + menu QR 790 ฿/mois · bouton rendez-vous" },
    { name: "Avant / après", icon: "🇹🇭🇫🇷", path: "nm/th-fr/#menu-ba", note: "Simple et fixe (sans animation) : le vieux menu papier → QR code → le menu dans le téléphone, puis 3 étapes : scanner, choisir la langue, commander" },
    { name: "Prendre rendez-vous", icon: "🇹🇭🇫🇷", path: "nm/th-fr/#book", note: "Jour + heure, puis commerce, adresse, prénom → WhatsApp s'ouvre avec le message tout écrit" },
    { name: "Site web thaïlandais · version clients (ไทย)", icon: "🇹🇭", path: "nm/th/", note: "La vraie version en thaï, celle que tu montres aux patrons" },
    { name: "Kit de vente (pour ta femme)", icon: "🇹🇭🇫🇷", path: "nm/kit.html", note: "En visite : taper le nom du resto → QR à scanner → le patron voit un menu à son nom. + pitch 1 min, réponses aux objections, prix, liste de ce qu'il faut récupérer (thaï / FR)" }
  ] },
  { space: "site", group: "Menus QR · mes clients", items: [
    { name: "Tableau de bord des menus QR", path: "nm/menus.html", note: "3 onglets : Clients (qui a payé, QR, rappel WhatsApp) · Chiffres (abonnés, essais, abandons, visites) · + Nouveau client (photos à prendre, fiche à copier dans la discussion, étapes de chaque client)" },
    { name: "+ Nouveau client", path: "nm/menus.html#nouveau", note: "La fiche à remplir, puis tu m'envoies les photos dans la discussion" },
    { name: "Menu QR d'exemple · Mae Lek en français", icon: "🇫🇷", path: "menus/mae-lek/?lang=fr", note: "Le menu à montrer, ouvert en français : photos, piment, allergies, « montrer au serveur » en thaï" },
    { name: "Menu QR d'exemple · Mae Lek en thaï", icon: "🇹🇭", path: "menus/mae-lek/", note: "Photos HD retouchées · prix en baht, 6 langues dont 中文 / Русский / 한국어, piment, écran serveur en thaï" },
    { name: "Menu d'exemple v2 · filtres + bouton Réserver", path: "nm/demo-menu/", note: "Baan Suan (8 langues) : filtres Végétarien / Pas épicé / Épicé / Choix du chef, bouton fixe WhatsApp + LINE en bas. Pour un client : ?wa=66…&line=@sonid" },
    { name: "Chevalet QR à imprimer (A5)", path: "nm/print/chevalet-qr.html", note: "Nom du resto + lien du menu → panneau de table prêt à imprimer : « สแกนดูเมนู / Scan for the menu » + 6 langues, QR testé" }
  ] },
  { space: "site", group: "NM Studio · le site", items: [
    { name: "NM Studio · Français", path: "nm/fr/", note: "Le site à montrer aux clients" },
    { name: "NM Studio · English", path: "nm/" },
    { name: "NM Studio · ไทย", path: "nm/th/" },
    { name: "NM Studio · Italiano", path: "nm/it/" },
    { name: "NM Studio · العربية", path: "nm/ar/" },
    { name: "Tarifs", path: "nm/fr/pricing.html", note: "Prix Europe" },
    { name: "Offres Thaïlande · ไทย", path: "nm/th/#offers", note: "Copie en français : nm/th-fr/#offers" }
  ] },
  { space: "site", group: "NM Studio · outils", items: [
    { name: "Statistiques du site", path: "nm/stats.html", note: "Visiteurs et contacts, jour par jour" },
    { name: "Maquette express", path: "nm/maquette.html", note: "Montrer à un commerçant à quoi son site pourrait ressembler" },
    { name: "Générateur de QR code", path: "nm/qr-generator.html", note: "Un QR en PNG ou SVG pour n'importe quel lien" },
    { name: "Carte de visite (thaï)", path: "nm/print/carte-th.html", note: "À imprimer · 90 × 54 mm" },
    { name: "Avant / après à imprimer (A4)", path: "nm/print/avant-apres-th.html", note: "La feuille « vieux menu → QR → téléphone » en thaï" },
    { name: "Mes discussions", path: "nm/organisation.html", note: "Où en est chaque conversation + ce qui t'attend" }
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
