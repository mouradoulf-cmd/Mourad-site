import type { Db } from "../db/index.js";
import type { Candidate } from "../connectors/types.js";
import { dedupeKey, isEmail } from "../lib/util.js";
import { event } from "../crm.js";
import { countryLang } from "../compliance.js";

/** Insert-or-ignore on the dedupe key: the same establishment can never become two prospects. */
export async function upsertCandidate(db: Db, c: Candidate): Promise<{ id: string; created: boolean }> {
  const key = dedupeKey({ website: c.website, name: c.name, country: c.country, city: c.city });
  const email = c.email && isEmail(c.email) ? c.email.toLowerCase() : null;
  const ins = await db.query<{ id: string }>(
    `INSERT INTO prospects(name,country,city,type,website,email,email_source,email_found_at,phone,address,lat,lng,language,source,source_id,source_url,dedupe_key)
     VALUES($1,$2,$3,$4,$5,$6,$7,CASE WHEN $6::text IS NULL THEN NULL ELSE now() END,$8,$9,$10,$11,$12,$13,$14,$15,$16) ON CONFLICT (dedupe_key) DO NOTHING RETURNING id`,
    [c.name.trim(), c.country.toUpperCase(), c.city ?? "", c.type ?? "restaurant", c.website ?? null, email, email ? c.email_source ?? c.source_url ?? c.source : null, c.phone ?? null, c.address ?? null, c.lat ?? null, c.lng ?? null, c.language ?? countryLang(c.country), c.source, c.source_id ?? null, c.source_url ?? null, key]);
  if (ins.rows[0]) { await event(db.query, ins.rows[0].id, "discovered", { source: c.source }); return { id: ins.rows[0].id, created: true }; }
  const ex = await db.query<{ id: string }>("SELECT id FROM prospects WHERE dedupe_key=$1", [key]);
  return { id: ex.rows[0]!.id, created: false };
}
export async function isSuppressed(db: Db["query"], email: string | null) {
  if (!email) return { email: false, domain: false };
  const e = email.toLowerCase(); const d = e.split("@")[1] ?? "";
  const a = await db("SELECT 1 FROM suppression WHERE email=$1", [e]); const b = await db("SELECT 1 FROM suppression_domains WHERE domain=$1", [d]);
  return { email: a.rows.length > 0, domain: b.rows.length > 0 };
}
export async function suppress(db: Db, email: string, reason: string, source = "manual") {
  await db.query("INSERT INTO suppression(email,reason,source) VALUES($1,$2,$3) ON CONFLICT (email) DO NOTHING", [email.toLowerCase(), reason, source]);
}
/** Parse CSV (owner-supplied lists from authorised directories). Columns: name,country,city,type,website,email,phone,source,source_url */
export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = []; let cur: string[] = [], f = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += ch; }
    else if (ch === '"') q = true; else if (ch === "," || ch === ";") { cur.push(f); f = ""; }
    else if (ch === "\n" || ch === "\r") { if (ch === "\r" && text[i + 1] === "\n") i++; cur.push(f); f = ""; if (cur.some((x) => x.trim())) rows.push(cur); cur = []; } else f += ch;
  }
  cur.push(f); if (cur.some((x) => x.trim())) rows.push(cur);
  const head = (rows.shift() ?? []).map((h) => h.trim().toLowerCase());
  return rows.map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] ?? "").trim()])));
}
