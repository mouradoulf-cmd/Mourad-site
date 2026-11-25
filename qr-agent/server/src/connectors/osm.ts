import { config } from "../config.js";
import { countryLang } from "../compliance.js";
import { UA } from "../lib/http.js";
import { isEmail, sleep } from "../lib/util.js";
import type { Candidate, Connector } from "./types.js";

const CUISINE_TYPE: [RegExp, string][] = [[/pizza/, "pizzeria"], [/ital/, "italian"], [/french|bistro|brasserie/, "french"], [/thai|japanese|chinese|asian|vietnam|korean|indian|sushi/, "asian"], [/steak|burger|bbq/, "steak"], [/seafood|fish/, "seafood"]];
export function typeFromTags(tags: Record<string, string>): string {
  const c = (tags.cuisine ?? "").toLowerCase();
  for (const [rx, t] of CUISINE_TYPE) if (rx.test(c)) return t;
  if (tags.amenity === "cafe") return "cafe"; if (tags.tourism === "hotel" || tags.tourism === "guest_house") return "hotel";
  if (tags.amenity === "pub" || tags.amenity === "bar") return "brasserie"; return "restaurant";
}
export function queryFor(country: string, city: string, types: string[] | undefined, limit: number): string {
  const esc = (s: string) => s.replace(/["\\]/g, "");
  const cuisine = types?.length ? `["cuisine"~"${esc(types.join("|"))}"]` : "";
  return `[out:json][timeout:60];area["ISO3166-1"="${esc(country.toUpperCase())}"]->.c;area(area.c)["name"="${esc(city)}"]["boundary"="administrative"]->.a;(nwr["amenity"~"^(restaurant|cafe)$"]${cuisine}["name"]["website"](area.a););out tags center ${Math.max(1, Math.min(limit * 3, 300))};`;
}
export function parseOverpass(json: any, country: string, city: string): Candidate[] {
  const out: Candidate[] = [];
  for (const el of json?.elements ?? []) {
    const t: Record<string, string> = el.tags ?? {}; if (!t.name) continue;
    const website = t.website ?? t["contact:website"] ?? null; const emailRaw = (t.email ?? t["contact:email"] ?? "").split(";")[0]!.trim().toLowerCase();
    const email = isEmail(emailRaw) ? emailRaw : null;
    const addr = [t["addr:housenumber"], t["addr:street"], t["addr:postcode"], t["addr:city"] ?? city].filter(Boolean).join(" ");
    out.push({ name: t.name, country: country.toUpperCase(), city: t["addr:city"] ?? city, type: typeFromTags(t), website, email, email_source: email ? `https://www.openstreetmap.org/${el.type}/${el.id} (published by the establishment/contributors)` : null,
      phone: t.phone ?? t["contact:phone"] ?? null, address: addr || null, lat: el.lat ?? el.center?.lat ?? null, lng: el.lon ?? el.center?.lon ?? null, source: "osm", source_id: `${el.type}/${el.id}`, source_url: `https://www.openstreetmap.org/${el.type}/${el.id}`, language: countryLang(country) });
  }
  return out;
}
/** OpenStreetMap via Overpass: free, open data (ODbL — keep the attribution "© OpenStreetMap contributors"). Fair use only; the public server asks for modest volumes. */
export const osm: Connector = {
  id: "osm", label: "OpenStreetMap (Overpass)", configured: () => true,
  note: "Gratuit, sans clé. Données ouvertes ODbL (© OpenStreetMap contributors). Volume modéré ; utilisez votre propre instance Overpass pour de gros volumes (OVERPASS_URL).",
  async discover({ country, city, types, limit }) {
    const body = new URLSearchParams({ data: queryFor(country, city, types, limit) });
    let res: Response | null = null;
    for (let i = 0; i < 2; i++) { // one polite retry on 429/504
      res = await fetch(config.OVERPASS_URL, { method: "POST", body, headers: { "user-agent": UA(), "content-type": "application/x-www-form-urlencoded" }, signal: AbortSignal.timeout(90_000) });
      if (res.status !== 429 && res.status !== 504) break; await sleep(8000);
    }
    if (!res || !res.ok) throw new Error(`overpass ${res?.status}`);
    return parseOverpass(await res.json(), country, city).slice(0, limit);
  },
};
