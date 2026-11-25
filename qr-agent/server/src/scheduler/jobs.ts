import type { Db } from "../db/index.js";
import { config } from "../config.js";
import { CONNECTORS } from "../connectors/index.js";
import { upsertCandidate } from "../prospects/service.js";
import { analyzeSite, verifyEmail } from "../analysis/site.js";
import { scoreProspect } from "../analysis/score.js";
import { aiConfigured, ask, bump, usageToday } from "../agents/ai.js";
import { buildDemo } from "../demo/build.js";
import { createDraft } from "../email/compose.js";
import { sendDue } from "../email/send.js";
import { processInbound } from "../email/inbound.js";
import { buildReport } from "../reports.js";
import { getSettings } from "../settings.js";
import { setStatus, event } from "../crm.js";
import { activeProvider } from "../email/provider.js";
import { today } from "../lib/util.js";
import { log } from "../lib/log.js";

export type JobName = "discover" | "analyze" | "verify" | "demos" | "drafts" | "send" | "inbound" | "followups" | "report";
export const JOBS: JobName[] = ["discover", "analyze", "verify", "demos", "drafts", "send", "inbound", "followups", "report"];
type Ctx = { now: Date };

export async function discover(db: Db, ctx: Ctx) {
  const s = await getSettings(db); const done = Number((await db.query<{ n: string }>("SELECT count(*) n FROM prospects WHERE source IN ('osm','places','brave') AND discovered_at::date=$1::date", [today("UTC", ctx.now)])).rows[0]!.n);
  let budget = s.limits.discoverPerDay - done; const res = { added: 0, seen: 0, errors: [] as string[], targets: [] as string[] };
  if (budget <= 0 || !s.targets.length) return res;
  const day = Math.floor(ctx.now.getTime() / 86400_000); const conns = CONNECTORS.filter((c) => c.configured());
  for (let i = 0; i < s.targets.length && budget > 0; i++) {
    const t = s.targets[(day + i) % s.targets.length]!; res.targets.push(`${t.city},${t.country}`);
    for (const c of conns) {
      if (budget <= 0) break;
      try { await bump(db, c.id); const found = await c.discover({ country: t.country, city: t.city, types: t.types, limit: Math.min(budget + 10, 50) });
        for (const cand of found) { res.seen++; if (budget <= 0) break; const r = await upsertCandidate(db, cand); if (r.created) { res.added++; budget--; } } }
      catch (e: any) { res.errors.push(`${c.id}/${t.city}: ${e.message}`); }
    }
  }
  return res;
}
export async function analyze(db: Db, ctx: Ctx) {
  const s = await getSettings(db); const rows = (await db.query<any>("SELECT * FROM prospects WHERE analyzed_at IS NULL AND status IN ('new','not_contactable') ORDER BY discovered_at LIMIT $1", [s.limits.analyzePerRun])).rows; let ok = 0;
  for (const p of rows) {
    try {
      const facts = await analyzeSite(p.website, ctx.now);
      let email = p.email as string | null; let src = p.email_source as string | null;
      if (!email) { const best = facts.emails[0]; if (best) { email = best.email; src = best.source; } }
      const sc = scoreProspect(facts, { hasEmail: !!email, type: p.type });
      let summary = `${sc.score}/100 — ` + sc.parts.filter((x) => x.points > 0).map((x) => x.reason).join("; "); let ai = false;
      const t = await ask(db, "Tu résumes en 2 phrases factuelles (français) une analyse de site de restaurant. N'ajoute AUCUN fait absent des données.", JSON.stringify({ name: p.name, facts: { menu_kind: facts.menu_kind, multilingual: facts.multilingual, mobile: facts.mobile_viewport, outdated: facts.outdated_signals, evidence: facts.evidence } }), 200);
      if (t) { summary = t.trim(); ai = true; }
      await db.query("INSERT INTO analyses(prospect_id,facts,summary,ai_used) VALUES($1,$2::jsonb,$3,$4)", [p.id, JSON.stringify(facts), summary, ai]);
      await db.query("UPDATE prospects SET score=$2, score_detail=$3::jsonb, email=$4, email_source=$5, email_found_at=CASE WHEN email IS NULL AND $4::text IS NOT NULL THEN now() ELSE email_found_at END, contact_form_url=COALESCE($6,contact_form_url), analyzed_at=now(), updated_at=now() WHERE id=$1",
        [p.id, sc.score, JSON.stringify(sc.parts), email, src, facts.contact_form_url]);
      await setStatus(db, p.id, email ? "analyzed" : "not_contactable", { force: p.status === "not_contactable", why: email ? "analyzed" : "no published business email" }); ok++;
    } catch (e: any) { log("warn", "analyze failed", { id: p.id, err: e.message }); }
  }
  return { analyzed: ok, picked: rows.length };
}
export async function verify(db: Db, _ctx: Ctx) {
  const rows = (await db.query<any>("SELECT id,email FROM prospects WHERE email IS NOT NULL AND email_valid IS NULL LIMIT 100")).rows; let bad = 0;
  for (const r of rows) { const v = await verifyEmail(r.email); await db.query("UPDATE prospects SET email_valid=$2 WHERE id=$1", [r.id, v]); if (!v) { bad++; await setStatus(db, r.id, "not_contactable", { why: "email failed MX verification" }); } }
  return { checked: rows.length, invalid: bad };
}
export async function demos(db: Db, ctx: Ctx) {
  const s = await getSettings(db); const made = Number((await db.query<{ n: string }>("SELECT count(*) n FROM demos WHERE created_at::date=$1::date", [today("UTC", ctx.now)])).rows[0]!.n);
  const left = Math.max(0, s.limits.demosPerDay - made);
  const rows = (await db.query<any>("SELECT id FROM prospects WHERE status='analyzed' AND email IS NOT NULL AND email_valid IS NOT FALSE AND score>=$1 AND NOT EXISTS (SELECT 1 FROM demos d WHERE d.prospect_id=prospects.id) ORDER BY score DESC LIMIT $2", [s.minScore, left])).rows; let n = 0;
  for (const r of rows) { try { await buildDemo(db, r.id); n++; } catch (e: any) { log("warn", "demo failed", { id: r.id, err: e.message }); } }
  return { built: n };
}
export async function drafts(db: Db, _ctx: Ctx) {
  const s = await getSettings(db);
  const rows = (await db.query<any>("SELECT id FROM prospects WHERE status='demo_ready' AND NOT EXISTS (SELECT 1 FROM emails e WHERE e.prospect_id=prospects.id AND e.kind='outreach') ORDER BY score DESC LIMIT $1", [s.limits.draftsPerRun])).rows; let n = 0; const skipped: Record<string, number> = {};
  for (const r of rows) { const d = await createDraft(db, r.id); if (d.id) n++; else for (const x of d.skipped ?? []) skipped[x] = (skipped[x] ?? 0) + 1; }
  return { drafted: n, skipped };
}
export async function send(db: Db, ctx: Ctx) { return sendDue(db, ctx.now); }
export async function followups(db: Db, ctx: Ctx) {
  const s = await getSettings(db); if (!s.followups.enabled) return { drafted: 0 }; let n = 0;
  for (let i = 0; i < s.followups.afterDays.length; i++) {
    const step = i + 2; const days = s.followups.afterDays[i]!;
    const rows = (await db.query<any>(`SELECT p.id FROM prospects p WHERE p.status='email_sent'
      AND EXISTS (SELECT 1 FROM emails e WHERE e.prospect_id=p.id AND e.kind='outreach' AND e.status='sent' AND e.sent_at <= $1::timestamptz - ($2 || ' days')::interval)
      AND NOT EXISTS (SELECT 1 FROM inbound i WHERE i.prospect_id=p.id)
      AND NOT EXISTS (SELECT 1 FROM emails e2 WHERE e2.prospect_id=p.id AND e2.step=$3)
      ${step > 2 ? "AND EXISTS (SELECT 1 FROM emails e3 WHERE e3.prospect_id=p.id AND e3.step=$3 - 1 AND e3.status='sent')" : ""} LIMIT 50`, [ctx.now.toISOString(), String(days), step])).rows;
    for (const r of rows) { const d = await createDraft(db, r.id, { kind: "followup", step }); if (d.id) n++; }
  }
  return { drafted: n };
}
export async function inbound(db: Db, _ctx: Ctx) {
  if (!config.IMAP_HOST || !config.IMAP_USER || !config.IMAP_PASS) return { skipped: "IMAP not configured (use the inbound webhook or set IMAP_*)" };
  const { ImapFlow } = await import("imapflow"); const { simpleParser } = await import("mailparser");
  const c = new ImapFlow({ host: config.IMAP_HOST, port: config.IMAP_PORT, secure: true, auth: { user: config.IMAP_USER, pass: config.IMAP_PASS }, logger: false }); let n = 0;
  await c.connect(); const lock = await c.getMailboxLock("INBOX");
  try { for await (const m of c.fetch({ seen: false }, { source: true, envelope: true })) { const mail = await simpleParser(m.source as Buffer); const from = mail.from?.value[0]?.address ?? ""; if (from) { await processInbound(db, { from, subject: mail.subject ?? "", text: mail.text ?? "", messageId: mail.messageId, receivedAt: mail.date ?? new Date() }); n++; } await c.messageFlagsAdd(m.uid, ["\\Seen"], { uid: true }); } }
  finally { lock.release(); await c.logout(); }
  return { processed: n };
}
export async function report(db: Db, ctx: Ctx) {
  const { data, text } = await buildReport(db, today("UTC", ctx.now));
  await db.query("INSERT INTO reports(day,data,text_body) VALUES($1,$2::jsonb,$3) ON CONFLICT (day) DO UPDATE SET data=EXCLUDED.data,text_body=EXCLUDED.text_body,created_at=now()", [data.day, JSON.stringify(data), text]);
  const s = await getSettings(db); let mailed = false;
  if (s.reportEmail) { try { await activeProvider().send({ to: config.ADMIN_EMAIL, from: config.EMAIL_FROM, subject: `QR Business — rapport du ${data.day}`, text, idempotencyKey: `report:${data.day}` }); mailed = true; } catch (e: any) { log("warn", "report mail failed", { err: e.message }); } }
  return { day: data.day, mailed };
}
const TABLE: Record<JobName, (db: Db, ctx: Ctx) => Promise<unknown>> = { discover, analyze, verify, demos, drafts, send, inbound, followups, report };
export async function runJob(db: Db, name: JobName, runKey: string, now = new Date()) {
  const ins = await db.query<{ id: number }>("INSERT INTO job_runs(job,run_key) VALUES($1,$2) ON CONFLICT (run_key) DO NOTHING RETURNING id", [name, runKey]);
  if (!ins.rows[0]) return { skipped: "already_ran_or_running" }; // a duplicated task / second worker does nothing
  try { const result = await TABLE[name](db, { now }); await db.query("UPDATE job_runs SET status='ok', finished_at=now(), result=$2::jsonb WHERE id=$1", [ins.rows[0].id, JSON.stringify(result ?? {})]); return result; }
  catch (e: any) { await db.query("UPDATE job_runs SET status='error', finished_at=now(), error=$2 WHERE id=$1", [ins.rows[0].id, String(e?.message ?? e).slice(0, 500)]); log("error", "job failed", { job: name, err: e?.message }); throw e; }
}
/** Crash recovery: runs left 'running' by a killed process are closed so they can run again at the next slot. */
export async function recoverJobs(db: Db) { await db.query("UPDATE job_runs SET status='interrupted', finished_at=now() WHERE status='running' AND started_at < now() - interval '30 minutes'"); await db.query("UPDATE emails SET status='approved' WHERE status='sending' AND created_at < now() - interval '30 minutes' AND sent_at IS NULL AND provider_id IS NULL AND attempts < 3"); }
export { aiConfigured, usageToday };
