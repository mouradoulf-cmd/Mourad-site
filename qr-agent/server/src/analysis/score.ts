import type { Facts } from "./site.js";
export interface ScorePart { key: string; points: number; max: number; reason: string }
export interface Score { score: number; parts: ScorePart[]; contactable: boolean }

/** 0–100 commercial opportunity. Built ONLY from measured facts; unknown facts earn no points (we never assume a weakness). */
export function scoreProspect(f: Facts, p: { hasEmail: boolean; type?: string }): Score {
  const parts: ScorePart[] = []; const add = (key: string, points: number, max: number, reason: string) => parts.push({ key, points, max, reason });
  // 1) menu gap (40)
  if (f.menu_kind === "qr_platform") add("menu", 0, 40, "utilise déjà une plateforme de menu QR / numérique");
  else if (!f.has_website) add("menu", 32, 40, "pas de site web : aucune carte consultable en ligne");
  else if (f.menu_kind === "pdf") add("menu", 36, 40, "la carte est un PDF (peu pratique sur téléphone)");
  else if (f.menu_kind === "none") add("menu", 30, 40, "aucun lien vers la carte sur la page d'accueil");
  else if (f.menu_kind === "html") add("menu", 14, 40, "carte en page web (modernisation possible)");
  else add("menu", 0, 40, "carte inconnue (site inaccessible ou robots.txt)");
  // 2) mobile (15)
  if (f.mobile_viewport === false) add("mobile", 15, 15, "page d'accueil non adaptée au mobile"); else if (f.mobile_viewport === true) add("mobile", 2, 15, "page d'accueil adaptée au mobile"); else add("mobile", 0, 15, "adaptation mobile inconnue");
  // 3) languages (10)
  if (f.multilingual === false) add("languages", 10, 10, `site dans une seule langue (${f.languages.join(", ") || "?"})`); else if (f.multilingual === true) add("languages", 2, 10, `déjà multilingue (${f.languages.join(", ")})`); else add("languages", 0, 10, "langues inconnues");
  // 4) photos (10)
  if (f.has_photos === false) add("photos", 10, 10, `peu d'images sur la page d'accueil (${f.image_count})`); else if (f.has_photos === true) add("photos", 3, 10, "photos présentes"); else add("photos", 0, 10, "photos inconnues");
  // 5) design (10)
  if (f.outdated === true) add("design", 10, 10, `signes de vieillissement : ${f.outdated_signals.join("; ")}`); else if (f.outdated === null && f.outdated_signals.length) add("design", 4, 10, `quelques signes de vieillissement : ${f.outdated_signals.join("; ")}`); else add("design", 0, 10, "aucun signe de vieillissement mesuré");
  // 6) fit (10): types that live from tourists / have a printed carte
  const tourist = /(italian|pizza|french|brasserie|beach|tourist|hotel|asian|thai|japanese|steak|seafood|bistro)/i.test(p.type ?? "");
  add("fit", tourist ? 10 : 5, 10, tourist ? "type de lieu accueillant souvent une clientèle internationale" : "type de lieu générique");
  // 7) reach (5)
  add("reach", p.hasEmail ? 5 : 0, 5, p.hasEmail ? "un email professionnel publié a été trouvé" : "aucun email professionnel publié");
  const score = Math.min(100, parts.reduce((s, x) => s + x.points, 0));
  return { score, parts, contactable: p.hasEmail };
}
