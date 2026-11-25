import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { memDb, mkProspect, mkDemo, facts } from "./helpers.js";
import { createDraft, guardBody, observation } from "../src/email/compose.js";
import { sendDue, approveEmail, inSendWindow } from "../src/email/send.js";
import { dryrunSent } from "../src/email/provider.js";
import { processInbound } from "../src/email/inbound.js";
import { suppress, upsertCandidate, parseCsv } from "../src/prospects/service.js";
import { saveSettings } from "../src/settings.js";
import { setAiOverride } from "../src/agents/ai.js";
import { runJob, followups } from "../src/scheduler/jobs.js";
import { setStatus } from "../src/crm.js";
import type { Db } from "../src/db/index.js";

let db: Db; const TUE_NOON_PARIS = new Date("2026-12-01T10:00:00Z"); // Tuesday 12:00 in Paris
beforeEach(async () => { db = await memDb(); dryrunSent.length = 0; setAiOverride(null); });
afterEach(async () => { await db.close(); });
const ready = async (o: any = {}) => { const id = await mkProspect(db, o); await mkDemo(db, id); await db.query("UPDATE analyses SET id=id"); await db.query("INSERT INTO analyses(prospect_id,facts) VALUES($1,$2::jsonb)", [id, JSON.stringify(facts())]); return id; };

describe("dedupe + import", () => {
  it("the same establishment (same domain / same name+city) is one prospect", async () => {
    const a = await upsertCandidate(db, { name: "Chez Paul", country: "FR", city: "Lyon", type: "french", website: "https://www.chezpaul.fr/menu", source: "osm" });
    const b = await upsertCandidate(db, { name: "CHEZ PAUL (autre source)", country: "FR", city: "Lyon", type: "french", website: "http://chezpaul.fr", source: "brave" });
    expect(b.created).toBe(false); expect(b.id).toBe(a.id);
    const c = await upsertCandidate(db, { name: "Da Mario", country: "IT", city: "Roma", type: "italian", source: "osm" }); const d = await upsertCandidate(db, { name: "da  mario", country: "IT", city: "Roma", type: "italian", source: "osm" }); expect(d.id).toBe(c.id);
  });
  it("never accepts a malformed email from a source", async () => { const r = await upsertCandidate(db, { name: "X", country: "FR", city: "Y", type: "french", email: "not an email", source: "osm" }); expect((await db.query<any>("SELECT email FROM prospects WHERE id=$1", [r.id])).rows[0].email).toBeNull(); });
  it("parses CSV with quotes and semicolons", () => { const r = parseCsv('name,country,city,website,email\n"Chez ""Paul""",FR,Lyon,chezpaul.fr,info@chezpaul.fr\n'); expect(r[0]!.name).toBe('Chez "Paul"'); expect(r[0]!.email).toBe("info@chezpaul.fr"); });
});
describe("drafts", () => {
  it("creates one draft per prospect+step (idempotent), in the restaurant's language, with unsubscribe footer + postal address + disclaimer", async () => {
    const id = await ready(); const a = await createDraft(db, id); expect(a.id).toBeTruthy(); const b = await createDraft(db, id); expect(b.skipped).toContain("already_drafted");
    const e = (await db.query<any>("SELECT * FROM emails")).rows; expect(e.length).toBe(1); expect(e[0].status).toBe("draft"); expect(e[0].body_text).toContain("/d/tok-"); expect(e[0].body_text).toContain("NON OFFICIEL"); expect(e[0].body_text).toContain("1 Test Street"); expect(e[0].body_text).toContain("/u/" + e[0].unsub_token);
    expect(e[0].body_text).toContain("carte est proposée en PDF"); expect((await db.query<any>("SELECT status FROM prospects")).rows[0].status).toBe("email_to_validate");
  });
  it("refuses prospects without a published email, without a demo, in DE, or suppressed", async () => {
    const noMail = await mkProspect(db, { name: "NoMail", website: "https://nomail.fr", email: null }); await mkDemo(db, noMail); expect((await createDraft(db, noMail)).skipped).toContain("no_published_business_email");
    const noDemo = await mkProspect(db, { name: "NoDemo", website: "https://nodemo.fr", email: "a@nodemo.fr" }); expect((await createDraft(db, noDemo)).skipped).toContain("no_demo_yet");
    const de = await mkProspect(db, { name: "Haus", country: "DE", website: "https://haus.de", email: "info@haus.de" }); await mkDemo(db, de); expect((await createDraft(db, de)).skipped).toContain("country_requires_opt_in");
    const sup = await ready({ name: "Sup", website: "https://sup.fr", email: "info@sup.fr" }); await suppress(db, "info@sup.fr", "test"); expect((await createDraft(db, sup)).skipped).toContain("suppressed_email");
  });
  it("AI text is used only if it passes the guard; a foreign link or a price promise falls back to the template", async () => {
    const id = await ready(); const demo = "https://agent.test/d/tok-" + id + "/";
    setAiOverride(async () => JSON.stringify({ subject: "Hello", body: `Hi, see https://evil.example/x and ${demo} — guaranteed 100% more customers. ` + "x".repeat(150) })); await createDraft(db, id);
    const e = (await db.query<any>("SELECT * FROM emails")).rows[0]; expect(e.ai_used).toBe(false); expect(e.body_text).not.toContain("evil.example");
    expect(guardBody(`Bonjour ${demo} ` + "mot ".repeat(40), demo)).toBe(true); expect(guardBody("pas de lien " + "mot ".repeat(40), demo)).toBe(false);
  });
  it("observation only states measured facts; unknown → neutral sentence", () => { expect(observation("en", "Z", facts({ menu_kind: "unknown", reachable: false, multilingual: null }))).toContain("writing about"); expect(observation("en", "Z", facts({ menu_kind: "pdf" }))).toContain("PDF"); });
});
describe("sending is safe", () => {
  it("nothing leaves without human approval; approval → dry-run send (provider is dryrun); status/CRM updated", async () => {
    const id = await ready(); await createDraft(db, id); const r0 = await sendDue(db, TUE_NOON_PARIS); expect(r0.sent + r0.dryrun).toBe(0); expect(dryrunSent.length).toBe(0);
    const eid = (await db.query<any>("SELECT id FROM emails")).rows[0].id; expect((await approveEmail(db, eid)).ok).toBe(true);
    const r = await sendDue(db, TUE_NOON_PARIS); expect(r.dryrun).toBe(1); expect(dryrunSent.length).toBe(1); expect(dryrunSent[0]!.headers!["List-Unsubscribe"]).toContain("/u/"); expect(dryrunSent[0]!.headers!["List-Unsubscribe-Post"]).toBe("List-Unsubscribe=One-Click");
  });
  it("a duplicated / concurrent task cannot double-send", async () => {
    const id = await ready(); await createDraft(db, id); const eid = (await db.query<any>("SELECT id FROM emails")).rows[0].id; await approveEmail(db, eid);
    await Promise.all([sendDue(db, TUE_NOON_PARIS), sendDue(db, TUE_NOON_PARIS), sendDue(db, TUE_NOON_PARIS)]); expect(dryrunSent.length).toBe(1);
    const k1 = await runJob(db, "report", "report:2026-06-02"); const k2 = await runJob(db, "report", "report:2026-06-02"); expect(k1).toBeTruthy(); expect(k2).toEqual({ skipped: "already_ran_or_running" });
  });
  it("re-checks suppression at send time (unsubscribe between approval and sending)", async () => {
    const id = await ready(); await createDraft(db, id); const eid = (await db.query<any>("SELECT id FROM emails")).rows[0].id; await approveEmail(db, eid); await suppress(db, "info@cheztest.fr", "late opt-out");
    const r = await sendDue(db, TUE_NOON_PARIS); expect(r.blocked).toBe(1); expect(dryrunSent.length).toBe(0); expect((await db.query<any>("SELECT status,error FROM emails")).rows[0]).toMatchObject({ status: "blocked" });
  });
  it("respects the daily cap and the recipient's business hours", async () => {
    await saveSettings(db, { limits: { discoverPerDay: 30, analyzePerRun: 40, demosPerDay: 15, emailsPerDay: 2, draftsPerRun: 20 } });
    for (let i = 0; i < 4; i++) { const id = await ready({ name: "R" + i, website: `https://r${i}.fr`, email: `info@r${i}.fr` }); await createDraft(db, id); }
    for (const r of (await db.query<any>("SELECT id FROM emails")).rows) await approveEmail(db, r.id);
    const night = new Date("2026-12-01T22:00:00Z"); expect((await sendDue(db, night)).deferred).toBe(4); expect(dryrunSent.length).toBe(0); expect(inSendWindow("FR", { from: "08:00", to: "19:00" }, new Date("2026-12-05T10:00:00Z"))).toBe(false);
    const r = await sendDue(db, TUE_NOON_PARIS); expect(r.dryrun).toBe(2); expect(r.capped).toBe(true);
  });
  it("auto-send needs the owner to enable the country AND turn off requireApproval", async () => {
    const id = await ready(); await createDraft(db, id); expect((await db.query<any>("SELECT status FROM emails")).rows[0].status).toBe("draft");
    await saveSettings(db, { requireApproval: false, autoSend: { FR: true } }); const id2 = await ready({ name: "Auto", website: "https://auto.fr", email: "info@auto.fr" }); await createDraft(db, id2);
    expect((await db.query<any>("SELECT status FROM emails WHERE prospect_id=$1", [id2])).rows[0].status).toBe("approved");
    const de = await mkProspect(db, { name: "H", country: "DE", website: "https://h.de", email: "info@h.de" }); await mkDemo(db, de); await saveSettings(db, { autoSend: { DE: true } }); expect((await createDraft(db, de)).skipped).toContain("country_requires_opt_in");
  });
});
describe("replies, opt-out and follow-ups", () => {
  const sendFirst = async (id: string) => { await createDraft(db, id); const e = (await db.query<any>("SELECT id FROM emails WHERE prospect_id=$1", [id])).rows[0]; await approveEmail(db, e.id); await db.query("UPDATE emails SET status='sent', sent_at=$2 WHERE id=$1", [e.id, "2026-05-20T10:00:00Z"]); await db.query("UPDATE prospects SET status='email_sent' WHERE id=$1", [id]); };
  it("an opt-out reply suppresses at once, stops everything pending and moves the prospect to do-not-contact", async () => {
    const id = await ready(); await sendFirst(id); await db.query("INSERT INTO emails(prospect_id,step,kind,to_email,subject,body_text,status,unsub_token,idempotency_key) VALUES($1,2,'followup','info@cheztest.fr','s','b','approved','ut2','k2')", [id]);
    const r = await processInbound(db, { from: "Paul <info@cheztest.fr>", subject: "Re: menu", text: "Merci de ne plus me contacter.", messageId: "m1" }); expect(r.intent).toBe("opt_out");
    expect((await db.query<any>("SELECT 1 FROM suppression WHERE email='info@cheztest.fr'")).rows.length).toBe(1); expect((await db.query<any>("SELECT status FROM prospects")).rows[0].status).toBe("do_not_contact"); expect((await db.query<any>("SELECT status FROM emails WHERE step=2")).rows[0].status).toBe("rejected");
    expect((await followups(db, { now: new Date("2026-07-01") }) as any).drafted).toBe(0); expect((await setStatus(db, id, "interested")) ).toBe(false);
  });
  it("a refusal is suppressed too (never chased)", async () => { const id = await ready(); await sendFirst(id); await processInbound(db, { from: "info@cheztest.fr", subject: "Re", text: "Not interested, thanks", messageId: "m2" }); expect((await db.query<any>("SELECT status FROM prospects")).rows[0].status).toBe("client_lost"); expect((await db.query<any>("SELECT 1 FROM suppression")).rows.length).toBe(1); });
  it("interested → CRM + a reply DRAFT (not sent); pricing → quote draft; duplicates ignored; auto-replies ignored", async () => {
    const id = await ready(); await sendFirst(id); const r = await processInbound(db, { from: "info@cheztest.fr", subject: "Re: menu", text: "Sounds good, how much does it cost?", messageId: "m3" }); expect(r.intent).toBe("pricing");
    expect((await db.query<any>("SELECT status FROM prospects")).rows[0].status).toBe("interested"); const d = (await db.query<any>("SELECT kind,status,body_text FROM emails WHERE step>=10")).rows; expect(d[0]).toMatchObject({ kind: "quote", status: "draft" }); expect(d[0].body_text).toContain("390"); expect((await db.query<any>("SELECT 1 FROM quotes")).rows.length).toBe(1);
    expect((await processInbound(db, { from: "info@cheztest.fr", subject: "Re: menu", text: "x", messageId: "m3" })).duplicate).toBe(true);
    const id2 = await ready({ name: "B", website: "https://b.fr", email: "info@b.fr" }); await sendFirst(id2); await processInbound(db, { from: "info@b.fr", subject: "Automatic reply", text: "I am out of office", messageId: "m4" }); expect((await db.query<any>("SELECT status FROM prospects WHERE id=$1", [id2])).rows[0].status).toBe("email_sent");
  });
  it("follow-ups: only when no reply, spaced by the configured days, max 2, as drafts", async () => {
    const id = await ready(); await sendFirst(id); const n = await followups(db, { now: new Date("2026-05-30T10:00:00Z") }) as any; expect(n.drafted).toBe(1); expect((await db.query<any>("SELECT status,step FROM emails WHERE step=2")).rows[0]).toMatchObject({ status: "draft" });
    expect((await followups(db, { now: new Date("2026-05-30T10:00:00Z") }) as any).drafted).toBe(0); // idempotent
    const early = await ready({ name: "E", website: "https://e.fr", email: "info@e.fr" }); await sendFirst(early); await db.query("UPDATE emails SET sent_at=$1 WHERE prospect_id=$2", ["2026-05-29T10:00:00Z", early]); expect((await followups(db, { now: new Date("2026-05-30T10:00:00Z") }) as any).drafted).toBe(0);
  });
});
