import type { Db } from "../db/index.js";
import { config } from "../config.js";
import { ask, parseJson } from "../agents/ai.js";
import { FOOTER, TEMPLATES, normLang, type Lang, type Vars } from "./templates.js";
import { token } from "../lib/util.js";
import { contactGate, autoSendAllowed } from "../compliance.js";
import { isSuppressed } from "../prospects/service.js";
import { getSettings } from "../settings.js";
import { event, setStatus } from "../crm.js";
import type { Facts } from "../analysis/site.js";

const OBS: Record<Lang, Record<string, (n: string) => string>> = {
  fr: { pdf: (n) => `En consultant le site de ${n}, j'ai vu que la carte est proposée en PDF, ce qui est peu pratique à lire sur un téléphone.`, none: (n) => `En consultant le site de ${n}, je n'ai pas trouvé de carte consultable en ligne.`, nosite: (n) => `Je n'ai pas trouvé de carte consultable en ligne pour ${n}.`, single: (n) => `Le site de ${n} semble disponible dans une seule langue, alors que votre clientèle peut être internationale.`, generic: (n) => `Je vous écris au sujet de la carte de ${n}.` },
  it: { pdf: (n) => `Consultando il sito di ${n}, ho visto che il menu è disponibile in PDF, poco comodo da leggere su smartphone.`, none: (n) => `Consultando il sito di ${n}, non ho trovato un menu consultabile online.`, nosite: (n) => `Non ho trovato un menu consultabile online per ${n}.`, single: (n) => `Il sito di ${n} sembra disponibile in una sola lingua, mentre la clientela può essere internazionale.`, generic: (n) => `Vi scrivo a proposito del menu di ${n}.` },
  en: { pdf: (n) => `Looking at ${n}'s website, I noticed the menu is offered as a PDF, which is awkward to read on a phone.`, none: (n) => `Looking at ${n}'s website, I couldn't find a menu you can read online.`, nosite: (n) => `I couldn't find a menu you can read online for ${n}.`, single: (n) => `${n}'s website seems to be available in a single language, while your guests may be international.`, generic: (n) => `I'm writing about ${n}'s menu.` },
  de: { pdf: (n) => `Auf der Website von ${n} ist mir aufgefallen, dass die Speisekarte als PDF angeboten wird – am Smartphone unpraktisch.`, none: (n) => `Auf der Website von ${n} habe ich keine online lesbare Speisekarte gefunden.`, nosite: (n) => `Ich habe keine online lesbare Speisekarte für ${n} gefunden.`, single: (n) => `Die Website von ${n} scheint nur in einer Sprache verfügbar zu sein, Ihre Gäste können aber international sein.`, generic: (n) => `Ich schreibe Ihnen wegen der Speisekarte von ${n}.` },
  es: { pdf: (n) => `Al consultar la web de ${n}, vi que la carta se ofrece en PDF, poco práctico de leer en el móvil.`, none: (n) => `Al consultar la web de ${n}, no encontré una carta consultable en línea.`, nosite: (n) => `No encontré una carta consultable en línea para ${n}.`, single: (n) => `La web de ${n} parece estar disponible en un solo idioma, aunque sus clientes pueden ser internacionales.`, generic: (n) => `Les escribo por la carta de ${n}.` },
};
/** One sentence, built ONLY from a measured fact. No fact → neutral sentence, never an invented weakness. */
export function observation(lang: Lang, name: string, f: Facts | null): string {
  const o = OBS[lang]; if (!f) return o.generic!(name);
  if (!f.has_website) return o.nosite!(name);
  if (f.menu_kind === "pdf") return o.pdf!(name);
  if (f.menu_kind === "none" && f.reachable) return o.none!(name);
  if (f.multilingual === false && f.menu_kind !== "qr_platform") return o.single!(name);
  return o.generic!(name);
}
export const unsubUrl = (t: string) => `${config.PUBLIC_BASE_URL}/u/${t}`;
export const demoUrl = (t: string) => `${config.PUBLIC_BASE_URL}/d/${t}/`;

const URL_RX = /https?:\/\/[^\s)>\]]+/g;
/** Guard on any AI-written text: must carry the demo link, no foreign links, no invented-offer words, sane length. */
export function guardBody(body: string, demo: string): boolean {
  if (!body.includes(demo)) return false; if (body.length > 1600 || body.length < 120) return false;
  const urls = body.match(URL_RX) ?? []; if (urls.some((u) => !u.startsWith(demo.replace(/\/$/, "")))) return false;
  if (/(guarantee|garanti[et]?|100\s?%|gratuit à vie|free forever|\$\d|€\s?\d)/i.test(body)) return false;
  return true;
}

export interface DraftResult { id?: string; skipped?: string[]; ai: boolean }
/** Create (never send) a draft for a prospect. Idempotent: one row per prospect+kind+step. */
export async function createDraft(db: Db, prospectId: string, o: { kind?: "outreach" | "followup"; step?: number } = {}): Promise<DraftResult> {
  const kind = o.kind ?? "outreach"; const step = o.step ?? 1;
  const p = (await db.query<any>("SELECT * FROM prospects WHERE id=$1", [prospectId])).rows[0]; if (!p) return { skipped: ["prospect_not_found"], ai: false };
  const s = await getSettings(db); const sup = await isSuppressed(db.query, p.email);
  const gate = contactGate({ prospect: p, suppressedEmail: sup.email, suppressedDomain: sup.domain, autoSend: autoSendAllowed(p.country, s.autoSend), senderAddressSet: !!config.SENDER_POSTAL_ADDRESS });
  if (!gate.ok) return { skipped: gate.reasons, ai: false };
  const demo = (await db.query<any>("SELECT * FROM demos WHERE prospect_id=$1 AND expires_at>now() ORDER BY created_at DESC LIMIT 1", [prospectId])).rows[0];
  if (!demo) return { skipped: ["no_demo_yet"], ai: false };
  const key = `${prospectId}:${kind}:${step}`;
  if ((await db.query("SELECT 1 FROM emails WHERE idempotency_key=$1", [key])).rows.length) return { skipped: ["already_drafted"], ai: false };
  const facts: Facts | null = (await db.query<any>("SELECT facts FROM analyses WHERE prospect_id=$1 ORDER BY created_at DESC LIMIT 1", [prospectId])).rows[0]?.facts ?? null;
  const lang = normLang(p.language); const v: Vars = { restaurant: p.name, observation: observation(lang, p.name, facts), demoUrl: demoUrl(demo.token), sender: config.SENDER_NAME, company: config.SENDER_COMPANY, step };
  const T = TEMPLATES[lang];
  let subject = T.subject(v); let body = step <= 1 ? T.body(v) : step === 2 ? T.follow(v) : T.follow2(v); let ai = false;
  if (kind === "outreach") { // optional AI rewrite, strictly constrained and validated; otherwise the template stands
    const out = parseJson<{ subject: string; body: string }>(await ask(db,
      `Tu rédiges un email de prospection B2B court (moins de 120 mots), humain, ${s.agent.tone}, en langue "${lang}". Offre: ${s.agent.offer}. Règles: n'invente AUCUN fait sur le restaurant (utilise seulement les faits fournis), ne promets pas de prix ni de résultat, dis clairement que la démonstration est un prototype NON OFFICIEL dont les plats/prix sont à confirmer, inclus le lien exact fourni, signe ${config.SENDER_NAME} (${config.SENDER_COMPANY}), pas de pièce jointe, pas d'autre lien. ${s.agent.extraRules} Réponds en JSON: {"subject":"...","body":"..."}.`,
      `Restaurant: ${p.name} (${p.city}, ${p.country}, type ${p.type}). Fait mesuré à mentionner: ${v.observation} Lien de démonstration: ${v.demoUrl}`, 500));
    if (out?.subject && out?.body && guardBody(out.body, v.demoUrl) && out.subject.length < 120) { subject = out.subject; body = out.body; ai = true; }
  }
  const ut = token(18);
  const full = body.trimEnd() + FOOTER[lang]({ company: config.SENDER_COMPANY, address: config.SENDER_POSTAL_ADDRESS, unsubUrl: unsubUrl(ut) });
  const auto = !s.requireApproval && autoSendAllowed(p.country, s.autoSend);
  const ins = await db.query<{ id: string }>(
    `INSERT INTO emails(prospect_id,step,kind,to_email,subject,body_text,lang,ai_used,status,approved_at,scheduled_at,unsub_token,idempotency_key) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,${auto ? "now()" : "NULL"},${auto ? "now()" : "NULL"},$10,$11) ON CONFLICT (idempotency_key) DO NOTHING RETURNING id`,
    [prospectId, step, kind, p.email, subject, full, lang, ai, auto ? "approved" : "draft", ut, key]);
  if (!ins.rows[0]) return { skipped: ["already_drafted"], ai: false };
  await event(db.query, prospectId, "email_drafted", { step, kind, ai, auto });
  if (kind === "outreach") await setStatus(db, prospectId, "email_to_validate", { why: "draft created" });
  return { id: ins.rows[0].id, ai };
}
