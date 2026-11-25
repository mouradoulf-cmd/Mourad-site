import type { Db } from "../db/index.js";
import { config } from "../config.js";
import { ask, parseJson } from "../agents/ai.js";
import { classifyRules, type Intent } from "../compliance.js";
import { setStatus, event } from "../crm.js";
import { suppress } from "../prospects/service.js";
import { FOOTER, normLang, type Lang } from "./templates.js";
import { unsubUrl } from "./compose.js";
import { getSettings } from "../settings.js";
import { token } from "../lib/util.js";

export interface InboundMsg { from: string; subject: string; text: string; messageId?: string; receivedAt?: Date }
const emailOf = (s: string) => (s.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? "").toLowerCase();

const REPLY: Record<Lang, { interested: string; pricing: (m: string, c: string) => string; demo: string }> = {
  fr: { interested: "Bonjour,\n\nMerci pour votre réponse ! Pour avancer simplement : envoyez-moi (par retour de mail) votre carte à jour et, si possible, quelques photos de vos plats. Je prépare la version définitive à valider avec vous, sans engagement pendant l'essai gratuit d'un mois.\n\nCordialement,", pricing: (m, c) => `Bonjour,\n\nMerci pour votre message. L'abonnement est de ${m} ${c} par mois, essai gratuit d'un mois, résiliable à tout moment. Je vous envoie volontiers un devis détaillé : dites-moi simplement si vous souhaitez une ou plusieurs langues.\n\nCordialement,`, demo: "Bonjour,\n\nVoici à nouveau le lien du prototype (non officiel) ; je peux l'adapter à votre identité visuelle et à votre vraie carte dès que vous me l'envoyez.\n\nCordialement," },
  it: { interested: "Buongiorno,\n\nGrazie per la risposta! Per procedere in modo semplice: inviatemi il menu aggiornato e, se possibile, qualche foto dei piatti. Preparo la versione definitiva da validare insieme, senza impegno durante la prova gratuita di un mese.\n\nCordiali saluti,", pricing: (m, c) => `Buongiorno,\n\nGrazie per il messaggio. L'abbonamento costa ${m} ${c} al mese, con un mese di prova gratuita e disdetta in qualsiasi momento. Vi invio volentieri un preventivo dettagliato: ditemi se desiderate una o più lingue.\n\nCordiali saluti,`, demo: "Buongiorno,\n\necco di nuovo il link del prototipo (non ufficiale); posso adattarlo alla vostra identità e al vostro vero menu non appena me lo inviate.\n\nCordiali saluti," },
  en: { interested: "Hello,\n\nThank you for your reply! To keep it simple: send me your current menu (just reply to this email) and, if possible, a few photos of your dishes. I'll prepare the final version for you to approve, with no commitment during the free one-month trial.\n\nBest regards,", pricing: (m, c) => `Hello,\n\nThank you for your message. The subscription is ${m} ${c} per month with a free first month, cancel anytime. Happy to send a detailed quote — just tell me whether you need one or several languages.\n\nBest regards,`, demo: "Hello,\n\nHere is the (unofficial) prototype link again; I can adapt it to your visual identity and your real menu as soon as you send it.\n\nBest regards," },
  de: { interested: "Guten Tag,\n\nvielen Dank für Ihre Antwort! Ganz einfach: Senden Sie mir Ihre aktuelle Speisekarte (einfach auf diese E-Mail antworten) und wenn möglich einige Fotos. Ich bereite die endgültige Version zur Freigabe vor – unverbindlich im kostenlosen ersten Monat.\n\nFreundliche Grüße", pricing: (m, c) => `Guten Tag,\n\nvielen Dank für Ihre Nachricht. Das Abonnement kostet ${m} ${c} pro Monat, erster Monat kostenlos, jederzeit kündbar. Gern sende ich ein detailliertes Angebot – sagen Sie mir, ob eine oder mehrere Sprachen gewünscht sind.\n\nFreundliche Grüße`, demo: "Guten Tag,\n\nhier nochmals der Link zum (inoffiziellen) Prototyp; ich passe ihn an Ihre Marke und Ihre echte Karte an, sobald Sie sie mir senden.\n\nFreundliche Grüße" },
  es: { interested: "Hola,\n\n¡Gracias por su respuesta! Para avanzar fácilmente: envíenme su carta actual (respondiendo a este correo) y, si es posible, algunas fotos de sus platos. Preparo la versión definitiva para que la valide, sin compromiso durante el mes de prueba gratuito.\n\nUn saludo,", pricing: (m, c) => `Hola,\n\nGracias por su mensaje. La suscripción cuesta ${m} ${c} al mes, primer mes gratis, cancelable en cualquier momento. Con gusto envío un presupuesto detallado: indíquenme si desean uno o varios idiomas.\n\nUn saludo,`, demo: "Hola,\n\nAquí tienen de nuevo el enlace del prototipo (no oficial); puedo adaptarlo a su identidad y a su carta real en cuanto me la envíen.\n\nUn saludo," },
};

/** Handle one inbound message: match prospect, classify (opt-out is rule-based and immediate), update CRM, prepare a reply DRAFT (always human-approved). */
export async function processInbound(db: Db, m: InboundMsg): Promise<{ intent: Intent; prospectId: string | null; duplicate?: boolean }> {
  const from = emailOf(m.from);
  if (m.messageId && (await db.query("SELECT 1 FROM inbound WHERE message_id=$1", [m.messageId])).rows.length) return { intent: "other", prospectId: null, duplicate: true };
  const p = (await db.query<any>("SELECT p.* FROM prospects p WHERE lower(p.email)=$1 OR EXISTS (SELECT 1 FROM emails e WHERE e.prospect_id=p.id AND lower(e.to_email)=$1) ORDER BY p.created_at LIMIT 1", [from])).rows[0] ?? null;
  let intent = classifyRules(m.subject, m.text);
  if (intent === "other") { // let the model refine only the non-critical cases
    const j = parseJson<{ intent: string }>(await ask(db, 'Classe la réponse d\'un restaurant à un email de prospection. Réponds en JSON {"intent":"interested|pricing|demo_request|not_interested|auto_reply|other"}. Si la personne demande à ne plus être contactée, réponds "not_interested".', `${m.subject}\n\n${m.text.slice(0, 1500)}`, 60));
    if (j?.intent && ["interested", "pricing", "demo_request", "not_interested", "auto_reply", "other"].includes(j.intent)) intent = j.intent as Intent;
  }
  await db.query("INSERT INTO inbound(prospect_id,from_email,subject,body,message_id,intent,received_at) VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (message_id) DO NOTHING", [p?.id ?? null, from, m.subject.slice(0, 300), m.text.slice(0, 20000), m.messageId ?? null, intent, (m.receivedAt ?? new Date()).toISOString()]);
  if (!p) return { intent, prospectId: null };
  await event(db.query, p.id, "inbound", { intent });
  const stopPending = () => db.query("UPDATE emails SET status='rejected', error='stopped: prospect replied' WHERE prospect_id=$1 AND status IN ('draft','approved')", [p.id]);
  if (intent === "opt_out") { await suppress(db, from, "asked_to_stop", "inbound"); if (p.email) await suppress(db, p.email, "asked_to_stop", "inbound"); await setStatus(db, p.id, "do_not_contact", { force: true, why: "opt-out request" }); await stopPending(); return { intent, prospectId: p.id }; }
  if (intent === "not_interested") { await suppress(db, from, "declined", "inbound"); await setStatus(db, p.id, "client_lost", { force: true, why: "declined" }); await stopPending(); return { intent, prospectId: p.id }; }
  if (intent === "auto_reply") return { intent, prospectId: p.id };
  await stopPending(); // they answered: no more automatic follow-ups
  await setStatus(db, p.id, intent === "other" ? "replied" : "interested", { why: intent });
  if (intent === "other") return { intent, prospectId: p.id };
  const lang = normLang(p.language); const s = await getSettings(db);
  const demo = (await db.query<any>("SELECT token FROM demos WHERE prospect_id=$1 ORDER BY created_at DESC LIMIT 1", [p.id])).rows[0];
  const R = REPLY[lang]; const sig = `\n${config.SENDER_NAME} — ${config.SENDER_COMPANY}`;
  const kind = intent === "pricing" ? "quote" : "reply";
  const body = (intent === "pricing" ? R.pricing(String(s.pricing.monthly), s.pricing.currency) : intent === "demo_request" ? R.demo : R.interested) + sig;
  const ut = token(18); const seq = (await db.query<{ n: string }>("SELECT count(*) n FROM emails WHERE prospect_id=$1 AND step>=10", [p.id])).rows[0]!.n;
  const full = body + FOOTER[lang]({ company: config.SENDER_COMPANY, address: config.SENDER_POSTAL_ADDRESS, unsubUrl: unsubUrl(ut) }) + (demo && intent === "demo_request" ? "" : "");
  await db.query("INSERT INTO emails(prospect_id,step,kind,to_email,subject,body_text,lang,status,unsub_token,idempotency_key) VALUES($1,$2,$3,$4,$5,$6,$7,'draft',$8,$9) ON CONFLICT (idempotency_key) DO NOTHING",
    [p.id, 10 + Number(seq), kind, p.email ?? from, /^re:/i.test(m.subject) ? m.subject : "Re: " + m.subject, full, lang, ut, `${p.id}:${kind}:${10 + Number(seq)}`]);
  if (intent === "pricing") await db.query("INSERT INTO quotes(prospect_id,plan,amount,currency,body) VALUES($1,'QR menu premium (monthly)',$2,$3,$4)", [p.id, s.pricing.monthly, s.pricing.currency, `Abonnement mensuel — essai gratuit 1 mois. À valider avant envoi.`]);
  return { intent, prospectId: p.id };
}
