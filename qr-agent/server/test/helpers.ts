import { openDb, migrate, type Db } from "../src/db/index.js";
import { upsertCandidate } from "../src/prospects/service.js";
import type { Facts } from "../src/analysis/site.js";

export async function memDb(): Promise<Db> { const db = await openDb(undefined, "", true); await migrate(db); return db; }
export const facts = (o: Partial<Facts> = {}): Facts => ({ checked_at: new Date().toISOString(), website: "https://x.test", reachable: true, has_website: true, has_digital_menu: false, menu_kind: "pdf", menu_urls: ["https://x.test/carte.pdf"], qr_platform: null, mobile_viewport: false, languages: ["fr"], multilingual: false, image_count: 2, has_photos: false, copyright_year: 2016, outdated_signals: ["pas de balise viewport mobile", "copyright en pied de page 2016"], outdated: true, emails: [], contact_form_url: null, evidence: [], ...o });
export async function mkProspect(db: Db, o: Partial<{ name: string; country: string; city: string; website: string | null; email: string | null; language: string }> = {}) {
  const r = await upsertCandidate(db, { name: o.name ?? "Chez Test", country: o.country ?? "FR", city: o.city ?? "Lyon", type: "french", website: o.website === undefined ? "https://cheztest.fr" : o.website, email: o.email === undefined ? "info@cheztest.fr" : o.email, email_source: "https://cheztest.fr/contact", source: "manual", language: o.language });
  await db.query("UPDATE prospects SET email_valid=true, score=80, status='analyzed' WHERE id=$1", [r.id]); return r.id;
}
export async function mkDemo(db: Db, prospectId: string) { await db.query("INSERT INTO demos(prospect_id,token,menu,content_mode,expires_at) VALUES($1::uuid,'tok-'||$1::text,'{}'::jsonb,'sample',now()+interval '10 days')", [prospectId]); }
