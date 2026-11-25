import { config } from "../config.js";
import { countryLang } from "../compliance.js";
import { normalizeDomain } from "../lib/util.js";
import type { Candidate, Connector } from "./types.js";

/** Brave Search API (official, key required). Finds restaurant websites; the site analysis then reads them politely. */
export const brave: Connector = {
  id: "brave", label: "Recherche web (Brave Search API)", configured: () => !!config.BRAVE_SEARCH_API_KEY,
  note: "Clé BRAVE_SEARCH_API_KEY (api.search.brave.com). Cherche des sites de restaurants, jamais d'annuaires protégés.",
  async discover({ country, city, types, limit }) {
    const q = `${(types ?? ["restaurant"]).join(" ")} restaurant ${city} menu`;
    const res = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(q)}&count=${Math.min(limit, 20)}&country=${country}`, { headers: { "X-Subscription-Token": config.BRAVE_SEARCH_API_KEY!, accept: "application/json" }, signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`brave ${res.status}`);
    const j: any = await res.json(); const out: Candidate[] = [];
    for (const r of j.web?.results ?? []) {
      const d = normalizeDomain(r.url); if (!d || /(tripadvisor|thefork|yelp|facebook|instagram|google|booking|ubereats|wikipedia|lonelyplanet|michelin|guide)\./.test(d)) continue;
      out.push({ name: String(r.title ?? d).split(/[|–—-]/)[0]!.trim().slice(0, 80), country: country.toUpperCase(), city, type: "restaurant", website: `https://${d}`, source: "brave", source_id: d, source_url: r.url, language: countryLang(country) });
    }
    return out.slice(0, limit);
  },
};
