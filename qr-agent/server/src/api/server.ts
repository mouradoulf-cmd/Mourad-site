import Fastify, { type FastifyInstance } from "fastify";
import cookie from "@fastify/cookie";
import fstatic from "@fastify/static";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import type { Db } from "../db/index.js";
import { config } from "../config.js";
import { checkSession, loginAllowed, loginFailed, makeSession, verifyPassword } from "./auth.js";
import { getSettings, saveSettings } from "../settings.js";
import { getStats, buildReport } from "../reports.js";
import { CONNECTORS } from "../connectors/index.js";
import { COUNTRY_RULES, contactGate, autoSendAllowed } from "../compliance.js";
import { STATUSES, setStatus, event, STATUS_LABEL, type Status } from "../crm.js";
import { upsertCandidate, suppress, parseCsv, isSuppressed } from "../prospects/service.js";
import { JOBS, runJob, type JobName } from "../scheduler/jobs.js";
import { buildDemo, renderDemoHtml } from "../demo/build.js";
import { createDraft } from "../email/compose.js";
import { approveEmail, sendDue } from "../email/send.js";
import { processInbound } from "../email/inbound.js";
import { providerStatus, dryrunSent } from "../email/provider.js";
import { aiConfigured, usageToday } from "../agents/ai.js";
import { token } from "../lib/util.js";
import { analyzeSite } from "../analysis/site.js";
import { scoreProspect } from "../analysis/score.js";

const page = (title: string, body: string) => `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><meta name=robots content="noindex"><title>${title}</title><body style="font:16px/1.5 system-ui;max-width:520px;margin:12vh auto;padding:0 20px;color:#222"><h1 style="font-size:1.3rem">${title}</h1><p>${body}</p>`;

export async function buildApp(db: Db): Promise<FastifyInstance> {
  const app = Fastify({ logger: false, bodyLimit: 4_000_000, trustProxy: true });
  await app.register(cookie);
  const secure = config.PUBLIC_BASE_URL.startsWith("https");
  // ── public routes ────────────────────────────────────────────────────────────
  app.get("/api/health", async () => ({ ok: true, db: db.kind }));
  app.get("/api/session", async (req) => ({ auth: checkSession(req.cookies.sid) }));
  app.post("/api/login", async (req, reply) => {
    const ip = req.ip; if (!loginAllowed(ip)) return reply.code(429).send({ error: "too_many_attempts" });
    const b = z.object({ email: z.string(), password: z.string() }).safeParse(req.body); if (!b.success) return reply.code(400).send({ error: "bad_request" });
    if (b.data.email.toLowerCase() !== config.ADMIN_EMAIL.toLowerCase() || !verifyPassword(b.data.password)) { loginFailed(ip); return reply.code(401).send({ error: "invalid_credentials" }); }
    reply.setCookie("sid", makeSession(), { httpOnly: true, sameSite: "strict", secure, path: "/", maxAge: 7 * 86400 }); return { ok: true };
  });
  app.post("/api/logout", async (_r, reply) => { reply.clearCookie("sid", { path: "/" }); return { ok: true }; });
  // unsubscribe: GET (human link) and POST (RFC 8058 one-click) both suppress immediately
  const unsub = async (t: string) => {
    const e = (await db.query<any>("SELECT e.id, e.prospect_id, e.to_email FROM emails e WHERE e.unsub_token=$1", [t])).rows[0]; if (!e) return false;
    await suppress(db, e.to_email, "unsubscribed", "unsubscribe_link"); await setStatus(db, e.prospect_id, "do_not_contact", { force: true, why: "unsubscribe link" });
    await db.query("UPDATE emails SET status='rejected', error='unsubscribed' WHERE prospect_id=$1 AND status IN ('draft','approved')", [e.prospect_id]); await event(db.query, e.prospect_id, "unsubscribed", {}); return true;
  };
  app.get("/u/:t", async (req, reply) => { const ok = await unsub((req.params as any).t); reply.type("text/html").code(ok ? 200 : 404); return page(ok ? "You are unsubscribed · Vous êtes désinscrit" : "Link not found", ok ? "You will not receive any further message from us. · Vous ne recevrez plus aucun message de notre part." : "This link is not valid."); });
  app.post("/u/:t", async (req, reply) => { const ok = await unsub((req.params as any).t); return reply.code(ok ? 200 : 404).send({ ok }); });
  // private demo URLs: unguessable token, expiry, noindex
  app.get("/d/:t/", async (req, reply) => {
    const d = (await db.query<any>("SELECT * FROM demos WHERE token=$1", [(req.params as any).t])).rows[0];
    if (!d) return reply.code(404).type("text/html").send(page("Not found", "This link does not exist."));
    if (new Date(d.expires_at) < new Date()) return reply.code(410).type("text/html").send(page("Prototype expired · Prototype expiré", "This unofficial prototype is no longer available."));
    await db.query("UPDATE demos SET views=views+1, last_view_at=now() WHERE id=$1", [d.id]);
    await event(db.query, d.prospect_id, "demo_viewed", {});
    reply.header("x-robots-tag", "noindex, nofollow, noarchive").header("cache-control", "no-store").type("text/html"); return renderDemoHtml(d.menu, d.token);
  });
  app.get("/d/abonnements.json", async (_r, reply) => { reply.header("cache-control", "no-store").header("x-robots-tag", "noindex"); return { restaurants: [] }; }); // the engine looks for a subscription list; demos have none
  app.get("/d/:t/menu.js", async (req, reply) => {
    const d = (await db.query<any>("SELECT menu, expires_at FROM demos WHERE token=$1", [(req.params as any).t])).rows[0]; if (!d || new Date(d.expires_at) < new Date()) return reply.code(404).send("");
    reply.header("x-robots-tag", "noindex").header("cache-control", "no-store").type("application/javascript"); return `window.NM_MENU = ${JSON.stringify(d.menu).replace(/</g, "\\u003c")};`;
  });
  if (fs.existsSync(config.ENGINE_DIR)) await app.register(fstatic, { root: config.ENGINE_DIR, prefix: "/engine/", decorateReply: false, maxAge: "1h" });
  app.post("/api/inbound/email", async (req, reply) => { // webhook for the mail provider's inbound route
    if (!config.INBOUND_WEBHOOK_SECRET || req.headers["x-webhook-secret"] !== config.INBOUND_WEBHOOK_SECRET) return reply.code(401).send({ error: "unauthorized" });
    const b = z.object({ from: z.string(), subject: z.string().default(""), text: z.string().default(""), messageId: z.string().optional() }).safeParse(req.body); if (!b.success) return reply.code(400).send({ error: "bad_request" });
    return processInbound(db, b.data);
  });
  // ── authenticated API ───────────────────────────────────────────────────────
  app.addHook("onRequest", async (req, reply) => {
    const u = req.url.split("?")[0]!; if (!u.startsWith("/api/") || u === "/api/login" || u === "/api/session" || u === "/api/health" || u === "/api/inbound/email") return;
    if (!checkSession(req.cookies.sid)) return reply.code(401).send({ error: "unauthorized" });
    if (req.method !== "GET" && req.headers["x-requested-with"] !== "qr-agent") return reply.code(403).send({ error: "csrf" });
  });
  app.get("/api/me", async () => ({ email: config.ADMIN_EMAIL }));
  app.get("/api/stats", async () => getStats(db));
  const QS = z.object({ country: z.string().optional(), city: z.string().optional(), type: z.string().optional(), status: z.string().optional(), q: z.string().optional(), minScore: z.coerce.number().optional(), limit: z.coerce.number().max(200).default(50), offset: z.coerce.number().default(0), sort: z.enum(["score", "recent", "name"]).default("score") });
  app.get("/api/prospects", async (req) => {
    const q = QS.parse(req.query); const w: string[] = []; const p: any[] = []; const add = (sql: string, v: any) => { p.push(v); w.push(sql.replace("?", "$" + p.length)); };
    if (q.country) add("country=?", q.country.toUpperCase()); if (q.city) add("city ILIKE ?", q.city); if (q.type) add("type=?", q.type); if (q.status) add("status=?", q.status); if (q.minScore != null) add("score>=?", q.minScore);
    if (q.q) add("(name ILIKE ? OR website ILIKE $" + (p.length + 1) + ")", `%${q.q}%`);
    const where = w.length ? "WHERE " + w.join(" AND ") : ""; const order = q.sort === "score" ? "score DESC NULLS LAST, discovered_at DESC" : q.sort === "recent" ? "discovered_at DESC" : "name";
    const total = Number((await db.query<{ n: string }>(`SELECT count(*) n FROM prospects ${where}`, p)).rows[0]!.n);
    const rows = (await db.query<any>(`SELECT id,name,country,city,type,website,email,email_valid,phone,language,source,score,status,discovered_at,analyzed_at FROM prospects ${where} ORDER BY ${order} LIMIT ${q.limit} OFFSET ${q.offset}`, p)).rows;
    const facets = { countries: (await db.query<any>("SELECT DISTINCT country FROM prospects ORDER BY 1")).rows.map((r) => r.country), cities: (await db.query<any>("SELECT DISTINCT city FROM prospects WHERE city<>'' ORDER BY 1 LIMIT 200")).rows.map((r) => r.city), types: (await db.query<any>("SELECT DISTINCT type FROM prospects ORDER BY 1")).rows.map((r) => r.type) };
    return { total, rows, facets, statuses: STATUSES.map((s) => ({ id: s, label: STATUS_LABEL[s] })) };
  });
  app.get("/api/prospects/:id", async (req, reply) => {
    const id = (req.params as any).id; if (!/^[0-9a-f-]{36}$/.test(id)) return reply.code(404).send({ error: "not_found" });
    const p = (await db.query<any>("SELECT * FROM prospects WHERE id=$1", [id])).rows[0]; if (!p) return reply.code(404).send({ error: "not_found" });
    const s = await getSettings(db); const sup = await isSuppressed(db.query, p.email);
    const gate = contactGate({ prospect: p, suppressedEmail: sup.email, suppressedDomain: sup.domain, autoSend: autoSendAllowed(p.country, s.autoSend), senderAddressSet: !!config.SENDER_POSTAL_ADDRESS });
    return { prospect: p, gate, rule: COUNTRY_RULES[p.country] ?? null,
      analysis: (await db.query<any>("SELECT * FROM analyses WHERE prospect_id=$1 ORDER BY created_at DESC LIMIT 1", [id])).rows[0] ?? null,
      demos: (await db.query<any>("SELECT id,token,content_mode,expires_at,views,created_at FROM demos WHERE prospect_id=$1 ORDER BY created_at DESC", [id])).rows,
      emails: (await db.query<any>("SELECT id,step,kind,subject,body_text,status,lang,ai_used,sent_at,error,created_at FROM emails WHERE prospect_id=$1 ORDER BY created_at", [id])).rows,
      inbound: (await db.query<any>("SELECT id,subject,body,intent,received_at FROM inbound WHERE prospect_id=$1 ORDER BY received_at DESC", [id])).rows,
      events: (await db.query<any>("SELECT type,data,at FROM events WHERE prospect_id=$1 ORDER BY at DESC LIMIT 50", [id])).rows,
      quotes: (await db.query<any>("SELECT * FROM quotes WHERE prospect_id=$1 ORDER BY created_at DESC", [id])).rows };
  });
  const Patch = z.object({ status: z.enum(STATUSES).optional(), notes: z.string().max(5000).optional(), email: z.string().email().nullable().optional(), phone: z.string().max(60).nullable().optional() });
  app.patch("/api/prospects/:id", async (req, reply) => {
    const id = (req.params as any).id; const b = Patch.safeParse(req.body); if (!b.success) return reply.code(400).send({ error: "bad_request" });
    if (b.data.notes !== undefined) await db.query("UPDATE prospects SET notes=$2, updated_at=now() WHERE id=$1", [id, b.data.notes]);
    if (b.data.phone !== undefined) await db.query("UPDATE prospects SET phone=$2, updated_at=now() WHERE id=$1", [id, b.data.phone]);
    if (b.data.email !== undefined) { await db.query("UPDATE prospects SET email=$2, email_source=CASE WHEN $2::text IS NULL THEN NULL ELSE 'entered by the owner (verify it is a published business address)' END, email_found_at=now(), email_valid=NULL, updated_at=now() WHERE id=$1", [id, b.data.email?.toLowerCase() ?? null]); await event(db.query, id, "email_set_by_owner", {}); }
    if (b.data.status) { const ok = await setStatus(db, id, b.data.status as Status, { force: true, why: "owner" }); if (!ok) return reply.code(404).send({ error: "not_found" }); }
    return { ok: true };
  });
  app.post("/api/prospects", async (req, reply) => {
    const b = z.object({ name: z.string().min(1), country: z.string().length(2), city: z.string().default(""), type: z.string().default("restaurant"), website: z.string().optional(), email: z.string().email().optional(), phone: z.string().optional() }).safeParse(req.body); if (!b.success) return reply.code(400).send({ error: "bad_request", details: b.error.issues });
    return upsertCandidate(db, { ...b.data, email: b.data.email ?? null, email_source: b.data.email ? "entered by the owner (verify it is a published business address)" : null, source: "manual" });
  });
  app.post("/api/prospects/import", async (req, reply) => {
    const b = z.object({ csv: z.string().min(5).max(2_000_000), source: z.string().default("import") }).safeParse(req.body); if (!b.success) return reply.code(400).send({ error: "bad_request" });
    let added = 0, dup = 0, bad = 0; for (const r of parseCsv(b.data.csv)) { if (!r.name || !/^[a-z]{2}$/i.test(r.country ?? "")) { bad++; continue; }
      const x = await upsertCandidate(db, { name: r.name, country: r.country!, city: r.city ?? "", type: r.type || "restaurant", website: r.website || null, email: r.email || null, email_source: r.email ? r.source_url || `imported list: ${r.source || b.data.source}` : null, phone: r.phone || null, source: "import", source_url: r.source_url || null }); x.created ? added++ : dup++; }
    return { added, duplicates: dup, rejected: bad };
  });
  app.post("/api/prospects/:id/analyze", async (req, reply) => {
    const id = (req.params as any).id; const p = (await db.query<any>("SELECT * FROM prospects WHERE id=$1", [id])).rows[0]; if (!p) return reply.code(404).send({ error: "not_found" });
    const facts = await analyzeSite(p.website); let email = p.email; let src = p.email_source; if (!email && facts.emails[0]) { email = facts.emails[0].email; src = facts.emails[0].source; }
    const sc = scoreProspect(facts, { hasEmail: !!email, type: p.type });
    await db.query("INSERT INTO analyses(prospect_id,facts,summary) VALUES($1,$2::jsonb,$3)", [id, JSON.stringify(facts), `${sc.score}/100`]);
    await db.query("UPDATE prospects SET score=$2, score_detail=$3::jsonb, email=$4, email_source=$5, email_valid=CASE WHEN email IS DISTINCT FROM $4 THEN NULL ELSE email_valid END, analyzed_at=now() WHERE id=$1", [id, sc.score, JSON.stringify(sc.parts), email, src]);
    await setStatus(db, id, email ? "analyzed" : "not_contactable", { force: true, why: "manual analysis" }); return { score: sc.score, facts };
  });
  app.post("/api/prospects/:id/demo", async (req, reply) => { try { return await buildDemo(db, (req.params as any).id); } catch (e: any) { return reply.code(400).send({ error: e.message }); } });
  app.post("/api/prospects/:id/draft", async (req) => createDraft(db, (req.params as any).id));
  app.get("/api/emails", async (req) => {
    const st = (req.query as any).status as string | undefined; const w = st ? "WHERE e.status=$1" : ""; const rows = (await db.query<any>(`SELECT e.id,e.prospect_id,e.step,e.kind,e.to_email,e.subject,e.body_text,e.status,e.lang,e.ai_used,e.sent_at,e.error,e.created_at,p.name,p.city,p.country FROM emails e JOIN prospects p ON p.id=e.prospect_id ${w} ORDER BY e.created_at DESC LIMIT 200`, st ? [st] : [])).rows;
    return { rows, dryrunOutbox: dryrunSent.length };
  });
  app.patch("/api/emails/:id", async (req, reply) => { const b = z.object({ subject: z.string().min(3).max(200), body_text: z.string().min(50).max(6000) }).safeParse(req.body); if (!b.success) return reply.code(400).send({ error: "bad_request" });
    const r = await db.query("UPDATE emails SET subject=$2, body_text=$3 WHERE id=$1 AND status='draft'", [(req.params as any).id, b.data.subject, b.data.body_text]); return { ok: r.rowCount > 0 }; });
  app.post("/api/emails/:id/approve", async (req) => approveEmail(db, (req.params as any).id));
  app.post("/api/emails/:id/reject", async (req) => { const r = await db.query("UPDATE emails SET status='rejected' WHERE id=$1 AND status IN ('draft','approved')", [(req.params as any).id]); return { ok: r.rowCount > 0 }; });
  app.post("/api/emails/send-now", async () => sendDue(db));
  app.get("/api/demos", async () => ({ rows: (await db.query<any>("SELECT d.id,d.token,d.content_mode,d.expires_at,d.views,d.last_view_at,d.created_at,p.id AS prospect_id,p.name,p.city,p.country FROM demos d JOIN prospects p ON p.id=d.prospect_id ORDER BY d.created_at DESC LIMIT 200")).rows, base: config.PUBLIC_BASE_URL }));
  app.get("/api/quotes", async () => ({ rows: (await db.query<any>("SELECT q.*, p.name FROM quotes q JOIN prospects p ON p.id=q.prospect_id ORDER BY q.created_at DESC LIMIT 100")).rows }));
  app.post("/api/revenue", async (req, reply) => { const b = z.object({ prospect_id: z.string().uuid(), amount: z.number().positive(), currency: z.string().default("EUR"), note: z.string().default("") }).safeParse(req.body); if (!b.success) return reply.code(400).send({ error: "bad_request" });
    await db.query("INSERT INTO revenue(prospect_id,amount,currency,note) VALUES($1,$2,$3,$4)", [b.data.prospect_id, b.data.amount, b.data.currency, b.data.note]); await setStatus(db, b.data.prospect_id, "client_won", { force: true, why: "revenue recorded" }); return { ok: true }; });
  app.get("/api/settings", async () => getSettings(db));
  const SettingsPatch = z.object({ tz: z.string().optional(), minScore: z.number().min(0).max(100).optional(), limits: z.record(z.number().min(0).max(1000)).optional(), schedule: z.array(z.object({ time: z.string().regex(/^\d\d:\d\d$/), job: z.enum(JOBS as [string, ...string[]]), enabled: z.boolean() })).optional(), targets: z.array(z.object({ country: z.string().length(2), city: z.string().min(1), types: z.array(z.string()).optional() })).optional(), requireApproval: z.boolean().optional(), autoSend: z.record(z.boolean()).optional(), followups: z.object({ enabled: z.boolean(), afterDays: z.array(z.number().min(1).max(60)).max(3) }).optional(), demo: z.object({ expiresDays: z.number().min(1).max(90) }).optional(), reportEmail: z.boolean().optional(), sendWindow: z.object({ from: z.string(), to: z.string() }).optional(), agent: z.object({ tone: z.string().max(300), offer: z.string().max(500), extraRules: z.string().max(800) }).optional(), pricing: z.object({ setup: z.number(), monthly: z.number(), currency: z.string().max(5) }).optional() }).strict();
  app.put("/api/settings", async (req, reply) => { const b = SettingsPatch.safeParse(req.body); if (!b.success) return reply.code(400).send({ error: "bad_request", details: b.error.issues });
    const cur = await getSettings(db); const patch: any = { ...b.data }; if (patch.limits) patch.limits = { ...cur.limits, ...patch.limits };
    if (patch.autoSend) for (const [c, on] of Object.entries(patch.autoSend)) if (on && COUNTRY_RULES[c]?.basis === "opt_in") return reply.code(400).send({ error: "country_requires_opt_in", country: c });
    await saveSettings(db, patch); return getSettings(db); });
  app.get("/api/connectors", async () => ({ connectors: CONNECTORS.map((c) => ({ id: c.id, label: c.label, configured: c.configured(), note: c.note, usageToday: 0 })) }));
  app.get("/api/system", async () => ({ db: db.kind, ai: { configured: aiConfigured(), model: config.AI_MODEL, callsToday: await usageToday(db, "ai"), dailyLimit: config.AI_DAILY_CALL_LIMIT, mode: aiConfigured() ? "claude" : "templates (no ANTHROPIC_API_KEY)" }, email: { ...providerStatus(), from: config.EMAIL_FROM, dryrunOutbox: dryrunSent.length, imap: !!config.IMAP_HOST, inboundWebhook: !!config.INBOUND_WEBHOOK_SECRET }, scheduler: !config.DISABLE_SCHEDULER, publicBaseUrl: config.PUBLIC_BASE_URL, senderAddressSet: !!config.SENDER_POSTAL_ADDRESS, engine: fs.existsSync(config.ENGINE_DIR), time: new Date().toISOString() }));
  app.get("/api/compliance", async () => { const s = await getSettings(db); return { countries: Object.entries(COUNTRY_RULES).map(([code, r]) => ({ code, ...r, autoSend: s.autoSend[code] === true })), requireApproval: s.requireApproval }; });
  app.get("/api/suppression", async () => ({ emails: (await db.query<any>("SELECT * FROM suppression ORDER BY created_at DESC LIMIT 500")).rows, domains: (await db.query<any>("SELECT * FROM suppression_domains ORDER BY created_at DESC")).rows }));
  app.post("/api/suppression", async (req, reply) => { const b = z.object({ email: z.string().email().optional(), domain: z.string().min(3).optional(), reason: z.string().default("owner") }).safeParse(req.body); if (!b.success || (!b.data.email && !b.data.domain)) return reply.code(400).send({ error: "bad_request" });
    if (b.data.email) { await suppress(db, b.data.email, b.data.reason, "owner"); await db.query("UPDATE emails SET status='rejected', error='suppressed' WHERE lower(to_email)=$1 AND status IN ('draft','approved')", [b.data.email.toLowerCase()]); }
    if (b.data.domain) await db.query("INSERT INTO suppression_domains(domain,reason) VALUES($1,$2) ON CONFLICT DO NOTHING", [b.data.domain.toLowerCase(), b.data.reason]); return { ok: true }; });
  app.delete("/api/suppression/:email", async () => ({ error: "suppression_entries_are_permanent" }));
  app.get("/api/jobs", async () => ({ jobs: JOBS, runs: (await db.query<any>("SELECT id,job,run_key,started_at,finished_at,status,result,error FROM job_runs ORDER BY id DESC LIMIT 60")).rows }));
  app.post("/api/jobs/:name/run", async (req, reply) => { const n = (req.params as any).name as JobName; if (!JOBS.includes(n)) return reply.code(404).send({ error: "unknown_job" });
    try { return { result: await runJob(db, n, `manual:${n}:${token(6)}`) }; } catch (e: any) { return reply.code(500).send({ error: e.message }); } });
  app.get("/api/reports", async () => ({ rows: (await db.query<any>("SELECT day,data,text_body FROM reports ORDER BY day DESC LIMIT 60")).rows }));
  app.post("/api/reports/generate", async () => { const { data, text } = await buildReport(db); await db.query("INSERT INTO reports(day,data,text_body) VALUES($1,$2::jsonb,$3) ON CONFLICT (day) DO UPDATE SET data=EXCLUDED.data,text_body=EXCLUDED.text_body,created_at=now()", [data.day, JSON.stringify(data), text]); return { data, text }; });
  // ── dashboard (static SPA) ──────────────────────────────────────────────────
  if (fs.existsSync(config.WEB_DIR)) {
    await app.register(fstatic, { root: config.WEB_DIR, prefix: "/", wildcard: false, maxAge: "1h" });
    app.setNotFoundHandler((req, reply) => { if (req.url.startsWith("/api/") || req.url.startsWith("/d/") || req.url.startsWith("/u/") || req.url.startsWith("/engine/")) return reply.code(404).send({ error: "not_found" }); return reply.type("text/html").send(fs.readFileSync(path.join(config.WEB_DIR, "index.html"))); });
  }
  return app;
}
