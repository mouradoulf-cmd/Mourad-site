import { UA, setFetcherForPhotos, politeJson } from "./photos-http.js";
export { setFetcherForPhotos };

/** Free-licence photos from Wikimedia Commons. Conservative on purpose: a photo is kept ONLY if its own title names the dish (or the venue type for the hero),
 *  it is large enough and its licence allows reuse. No match → no photo (the card stays typographic). Never a "close enough" picture of another dish. */
export interface Found { bytes: Uint8Array; mime: string; title: string; author: string; license: string; url: string }
const STOP = new Set(["avec", "sans", "aux", "des", "les", "une", "the", "and", "with", "von", "und", "mit", "con", "del", "della", "alla", "alle", "dei", "para", "por", "sauce", "salade", "salad", "plat", "menu", "carte", "maison", "jour", "du"]);
const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
export function keywords(name: string): string[] { return norm(name).split(" ").filter((w) => w.length >= 4 && !STOP.has(w)); }
/** Title must contain the dish's FULL distinctive phrase for short names, or at least 2 keywords (1 if the name only has one) for longer ones. */
export function titleMatches(title: string, dish: string): boolean {
  const t = norm(title.replace(/^file:/i, "")); const kw = keywords(dish); if (!kw.length) return false;
  const hit = kw.filter((w) => t.includes(w)).length; return kw.length === 1 ? hit === 1 : hit >= Math.min(2, kw.length);
}
const BAD_TITLE = /(menu board|carte|map|logo|poster|flag|map of|stamp|sign|plaque|coat of arms|diagram|schematic|portrait|statue)/i;
const OK_LICENSE = /^(cc0|public domain|pd|cc by(-sa)? \d)/i;
async function search(q: string): Promise<{ title: string; w: number; h: number }[]> {
  const u = "https://commons.wikimedia.org/w/api.php?" + new URLSearchParams({ action: "query", format: "json", generator: "search", gsrnamespace: "6", gsrsearch: `${q} filetype:bitmap`, gsrlimit: "12", prop: "imageinfo", iiprop: "size|mime" });
  const j: any = await politeJson(u); const pages = Object.values(j?.query?.pages ?? {}) as any[];
  return pages.map((p) => ({ title: p.title as string, w: p.imageinfo?.[0]?.width ?? 0, h: p.imageinfo?.[0]?.height ?? 0, mime: p.imageinfo?.[0]?.mime })).filter((p: any) => /image\/(jpeg|png)/.test(p.mime ?? "image/jpeg") && Math.min(p.w, p.h) >= 800);
}
async function meta(title: string) {
  const u = "https://commons.wikimedia.org/w/api.php?" + new URLSearchParams({ action: "query", format: "json", prop: "imageinfo", iiprop: "extmetadata|url", titles: title });
  const j: any = await politeJson(u); const p: any = Object.values(j?.query?.pages ?? {})[0]; const em = p?.imageinfo?.[0]?.extmetadata ?? {};
  const g = (k: string) => String(em[k]?.value ?? "").replace(/<[^>]+>/g, "").trim();
  return { license: g("LicenseShortName"), author: g("Artist").slice(0, 120), url: p?.imageinfo?.[0]?.descriptionurl ?? "" };
}
async function download(title: string, width: number): Promise<{ bytes: Uint8Array; mime: string } | null> {
  const u = "https://commons.wikimedia.org/wiki/Special:FilePath/" + encodeURIComponent(title.replace(/^File:/i, "").replace(/ /g, "_")) + `?width=${width}`;
  const r = await politeBinary(u); return r && r.bytes.length > 8_000 && r.bytes.length < 4_000_000 ? r : null;
}
import { politeBinary } from "./photos-http.js";
export async function findDishPhoto(dish: string, width = 1000): Promise<Found | null> {
  for (const c of await search(dish)) {
    if (BAD_TITLE.test(c.title) || !titleMatches(c.title, dish)) continue;
    const m = await meta(c.title); if (!OK_LICENSE.test(m.license)) continue;
    const d = await download(c.title, width); if (d) return { ...d, title: c.title.replace(/^File:/i, ""), author: m.author, license: m.license, url: m.url };
  }
  return null;
}
const HERO_Q: [RegExp, string[]][] = [[/pizza|ital/, ["trattoria interior", "italian restaurant terrace"]], [/french|bistro|brasserie/, ["bistro terrace Paris", "brasserie interior"]], [/asian|thai|japan|sushi/, ["asian restaurant interior"]], [/beach|seafood/, ["beach restaurant"]], [/hotel/, ["hotel restaurant interior"]], [/cafe/, ["cafe terrace"]]];
/** Hero = a generic venue-type photograph, clearly credited; its title must contain a venue word. Landscape, ≥1600 px wide. */
export async function findHero(type: string): Promise<Found | null> {
  const qs = HERO_Q.find(([r]) => r.test(type))?.[1] ?? ["restaurant terrace", "restaurant interior"];
  for (const q of qs) for (const c of await search(q)) {
    if (BAD_TITLE.test(c.title) || c.w < 1600 || c.w < c.h * 1.2 || !/(restaurant|terrace|trattoria|bistro|brasserie|cafe|interior|dining|beach)/i.test(c.title)) continue;
    const m = await meta(c.title); if (!OK_LICENSE.test(m.license)) continue;
    const d = await download(c.title, 1600); if (d) return { ...d, title: c.title.replace(/^File:/i, ""), author: m.author, license: m.license, url: m.url };
  }
  return null;
}
