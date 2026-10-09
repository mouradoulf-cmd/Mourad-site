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
window.NM_UPDATED = "2026-10-09";

window.NM_DEMOS = [
];

window.NM_LINKS = [
  { space: "site", group: "NM Studio", items: [
    { name: "NM Studio · Français", path: "nm/fr/", note: "Le site à montrer aux clients" },
    { name: "NM Studio · English", path: "nm/" },
    { name: "NM Studio · ไทย", path: "nm/th/" },
    { name: "NM Studio · Italiano", path: "nm/it/" },
    { name: "NM Studio · العربية", path: "nm/ar/" },
    { name: "Tarifs", path: "nm/fr/pricing.html" }
  ] },
  { space: "formation", group: "NM Academy", items: [
    { name: "NM Academy (à jour)", path: "https://claude.ai/artifact/8nSXmvuVbzfwtwMEkdeBjh", note: "La formation : page de vente, formations, réalisations, tarifs, inscription" }
  ] },
  { space: "video", group: "Mon site", items: [
    { name: "Story Studio", path: "story/", note: "Dessin animé en plusieurs épisodes" }
  ] },
  { space: "video", group: "Pub NM Studio", items: [
    { name: "Pub NM Studio · Français", path: "nm/assets/video/pub/nm-studio-pub-fr.mp4", note: "Version TikTok / Reels avec sous-titres" },
    { name: "Pub NM Studio · English", path: "nm/assets/video/pub/nm-studio-pub-en.mp4" },
    { name: "Pub NM Studio · ไทย", path: "nm/assets/video/pub/nm-studio-pub-th.mp4" }
  ] }
];
