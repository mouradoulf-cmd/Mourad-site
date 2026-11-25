import { config } from "../config.js";
import { countryLang } from "../compliance.js";
import type { Candidate, Connector } from "./types.js";

/** Google Places API (New). WARNING: Google Maps Platform terms restrict caching Places content and forbid using it to build lead lists;
 *  this connector is OFF by default (GOOGLE_PLACES_ENABLED=true) and only keeps what the owner decides to keep. Read the current terms before enabling. */
export const places: Connector = {
  id: "places", label: "Google Places API", configured: () => !!config.GOOGLE_PLACES_API_KEY && config.GOOGLE_PLACES_ENABLED,
  note: "Désactivé par défaut. Nécessite GOOGLE_PLACES_API_KEY + GOOGLE_PLACES_ENABLED=true. Attention : les conditions de Google limitent le stockage et interdisent la génération de leads — vérifiez-les avant activation.",
  async discover({ country, city, types, limit }) {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST", headers: { "content-type": "application/json", "X-Goog-Api-Key": config.GOOGLE_PLACES_API_KEY!, "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.websiteUri,places.internationalPhoneNumber,places.location,places.primaryType" },
      body: JSON.stringify({ textQuery: `${(types ?? ["restaurant"]).join(" ")} restaurant in ${city}, ${country}`, pageSize: Math.min(limit, 20) }), signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) throw new Error(`places ${res.status}`);
    const j: any = await res.json();
    return (j.places ?? []).map((p: any): Candidate => ({ name: p.displayName?.text ?? "", country: country.toUpperCase(), city, type: /pizza/.test(p.primaryType ?? "") ? "pizzeria" : "restaurant", website: p.websiteUri ?? null, phone: p.internationalPhoneNumber ?? null, address: p.formattedAddress ?? null, lat: p.location?.latitude ?? null, lng: p.location?.longitude ?? null, source: "places", source_id: p.id, source_url: `https://www.google.com/maps/place/?q=place_id:${p.id}`, language: countryLang(country) })).filter((c: Candidate) => c.name);
  },
};
