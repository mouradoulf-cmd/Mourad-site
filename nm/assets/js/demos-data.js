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
window.NM_UPDATED = "2026-10-08";

window.NM_DEMOS = [
];

window.NM_LINKS = [
  { space: "site", group: "Mon site NM Studio", items: [
    { name: "NM Studio · Français", path: "nm/fr/", note: "Le site à montrer aux clients" },
    { name: "NM Studio · English", path: "nm/" },
    { name: "NM Studio · ไทย", path: "nm/th/" },
    { name: "NM Studio · Italiano", path: "nm/it/" },
    { name: "NM Studio · العربية", path: "nm/ar/" },
    { name: "Tarifs", path: "nm/fr/pricing.html" },
    { name: "Page de paiement", path: "nm/checkout.html" }
  ] },
  { space: "site", group: "Mes outils", items: [
    { name: "Maquette pro", path: "nm/maquette.html", note: "Maquette rapide avec photos" },
    { name: "Statistiques", path: "nm/stats.html", note: "Visiteurs par jour" },
    { name: "Générateur de QR codes", path: "nm/qr-generator.html" },
    { name: "Carte de visite", path: "nm/business-card/card.html" },
    { name: "Espace client (abonnement)", path: "nm/account.html" }
  ] },
  { space: "video", group: "Mes studios vidéo IA", items: [
    { name: "Studio Vidéo IA", path: "video-ia/", note: "Créer des vidéos IA" },
    { name: "Short Drama IA", path: "drama-ia/" },
    { name: "Story Studio", path: "story/" },
    { name: "Studio Universel", path: "studio/" },
    { name: "Remix Studio", path: "remix/" },
    { name: "Cast & Render 3D", path: "cast-and-render/" }
  ] },
  { space: "formation", group: "NM Academy", items: [
    { name: "NM Academy", path: "nm-academy/", note: "Ma formation · page de vente" },
    { name: "Inscription", path: "nm-academy/start.html" },
    { name: "Espace élèves", path: "nm-academy/members.html" }
  ] },
  { space: "formation", group: "Autres formations", items: [
    { name: "English Easy (TH)", path: "english-easy-th/", note: "Anglais facile pour les Thaïs" }
  ] }
];
