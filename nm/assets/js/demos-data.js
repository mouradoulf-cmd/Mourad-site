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
  { space: "video", group: "Mon site", items: [
    { name: "Story Studio", path: "story/", note: "Dessin animé en plusieurs épisodes" }
  ] }
];
