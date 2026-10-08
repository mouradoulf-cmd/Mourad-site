/* NM Studio: the list behind demos.html (private). One line per business demo, any order (the page sorts A-Z).
 *   slug   — folder of the demo: the site lives at /Mourad-site/demos/<slug>/
 *   name   — business name as shown       type — Restaurant, Coiffeur, Spa...      city — town / area
 *   date   — "YYYY-MM-DD" the demo was made
 *   status — "prete" (ready) | "envoyee" (sent) | "discussion" | "client" | "non" (not interested)
 *   phone  — optional, WhatsApp of the business owner (digits, with country code), for the "WhatsApp" button
 *   note   — optional, anything worth remembering
 * Example:
 *   { slug: "chez-paolo", name: "Chez Paolo", type: "Restaurant", city: "Hua Hin", date: "2026-10-12", status: "envoyee", phone: "", note: "Rappeler jeudi" },
 */
window.NM_DEMOS = [
];

/* Every link the owner uses, grouped. Paths are relative to the site root (…/Mourad-site/). Claude keeps this up to date. */
window.NM_LINKS = [
  { group: "Mon site NM Studio", items: [
    { name: "NM Studio · Français", path: "nm/fr/", note: "Le site à montrer aux clients" },
    { name: "NM Studio · English", path: "nm/" },
    { name: "NM Studio · ไทย", path: "nm/th/" },
    { name: "NM Studio · Italiano", path: "nm/it/" },
    { name: "NM Studio · العربية", path: "nm/ar/" },
    { name: "Tarifs", path: "nm/fr/pricing.html" },
    { name: "Page de paiement", path: "nm/checkout.html" }
  ] },
  { group: "Ma formation", items: [
    { name: "NM Academy", path: "nm-academy/", note: "Page de vente" },
    { name: "NM Academy · inscription", path: "nm-academy/start.html" },
    { name: "NM Academy · espace élèves", path: "nm-academy/members.html" }
  ] },
  { group: "Mes outils", items: [
    { name: "Maquette pro", path: "nm/maquette.html", note: "Maquette rapide avec photos" },
    { name: "Statistiques", path: "nm/stats.html", note: "Visiteurs par jour" },
    { name: "Générateur de QR codes", path: "nm/qr-generator.html" },
    { name: "Carte de visite", path: "nm/business-card/card.html" },
    { name: "Espace client (abonnement)", path: "nm/account.html" }
  ] },
  { group: "Mes autres projets", items: [
    { name: "Studio Vidéo IA", path: "video-ia/" },
    { name: "Short Drama IA", path: "drama-ia/" },
    { name: "Story Studio", path: "story/" },
    { name: "Studio Universel", path: "studio/" },
    { name: "Remix Studio", path: "remix/" },
    { name: "English Easy (TH)", path: "english-easy-th/" },
    { name: "Cast & Render 3D", path: "cast-and-render/" }
  ] }
];
