import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { FastifyInstance } from "fastify";
import { memDb, mkProspect, mkDemo, facts } from "./helpers.js";
import { buildApp } from "../src/api/server.js";
import { createDraft } from "../src/email/compose.js";
import { buildDemo, renderDemoHtml } from "../src/demo/build.js";
import { _resetLogin } from "../src/api/auth.js";
import { setFetcherForPhotos } from "../src/demo/photos.js";
import type { Db } from "../src/db/index.js";

let db: Db, app: FastifyInstance, cookie = "";
const H = () => ({ cookie, "x-requested-with": "qr-agent" });
beforeAll(async () => { setFetcherForPhotos((async () => new Response("{}")) as any); db = await memDb(); app = await buildApp(db); });
afterAll(async () => { await app.close(); await db.close(); });

describe("auth", () => {
  it("API is closed without a session; login rejects wrong credentials; rate-limits brute force", async () => {
    expect((await app.inject({ url: "/api/stats" })).statusCode).toBe(401);
    expect((await app.inject({ method: "POST", url: "/api/login", payload: { email: "owner@test.dev", password: "nope" } })).statusCode).toBe(401);
    _resetLogin(); for (let i = 0; i < 6; i++) await app.inject({ method: "POST", url: "/api/login", payload: { email: "owner@test.dev", password: "bad" + i } });
    expect((await app.inject({ method: "POST", url: "/api/login", payload: { email: "owner@test.dev", password: "correct horse battery" } })).statusCode).toBe(429); _resetLogin();
  });
  it("logs in with the right password (httpOnly, strict cookie) and then needs the CSRF header for writes", async () => {
    const r = await app.inject({ method: "POST", url: "/api/login", payload: { email: "owner@test.dev", password: "correct horse battery" } }); expect(r.statusCode).toBe(200);
    const sc = String(r.headers["set-cookie"]); expect(sc).toMatch(/HttpOnly/i); expect(sc).toMatch(/SameSite=Strict/i); cookie = sc.split(";")[0]!;
    expect((await app.inject({ url: "/api/stats", headers: { cookie } })).statusCode).toBe(200);
    expect((await app.inject({ method: "POST", url: "/api/prospects", headers: { cookie }, payload: { name: "X", country: "FR" } })).statusCode).toBe(403);
    expect((await app.inject({ method: "POST", url: "/api/prospects", headers: H(), payload: { name: "Chez API", country: "FR", city: "Lyon", website: "https://chezapi.fr", email: "info@chezapi.fr" } })).statusCode).toBe(200);
  });
  it("a forged session cookie is refused", async () => expect((await app.inject({ url: "/api/stats", headers: { cookie: "sid=abc.def" } })).statusCode).toBe(401));
});
describe("prospects, settings, compliance", () => {
  it("lists with filters + facets and validates input", async () => {
    const r = (await app.inject({ url: "/api/prospects?country=FR&q=api", headers: H() })).json(); expect(r.total).toBe(1); expect(r.facets.countries).toContain("FR");
    expect((await app.inject({ method: "POST", url: "/api/prospects", headers: H(), payload: { name: "", country: "XXX" } })).statusCode).toBe(400);
    const imp = (await app.inject({ method: "POST", url: "/api/prospects/import", headers: H(), payload: { csv: "name,country,city,website,email\nCafé Un,FR,Nice,cafe-un.fr,contact@cafe-un.fr\nCafé Un,FR,Nice,cafe-un.fr,\n,FR,,," } })).json(); expect(imp).toEqual({ added: 1, duplicates: 1, rejected: 1 });
  });
  it("refuses to enable auto-send for an opt-in country (DE) and validates the schedule", async () => {
    expect((await app.inject({ method: "PUT", url: "/api/settings", headers: H(), payload: { autoSend: { DE: true } } })).statusCode).toBe(400);
    expect((await app.inject({ method: "PUT", url: "/api/settings", headers: H(), payload: { schedule: [{ time: "25:00", job: "x", enabled: true }] } })).statusCode).toBe(400);
    const ok = (await app.inject({ method: "PUT", url: "/api/settings", headers: H(), payload: { limits: { emailsPerDay: 7 } } })).json(); expect(ok.limits.emailsPerDay).toBe(7); expect(ok.limits.discoverPerDay).toBe(30);
  });
  it("system status is honest: AI off, email dry-run, connectors listed", async () => {
    const s = (await app.inject({ url: "/api/system", headers: H() })).json(); expect(s.ai.configured).toBe(false); expect(s.ai.mode).toContain("templates"); expect(s.email.live).toBe(false); expect(s.db).toBe("pglite");
    const c = (await app.inject({ url: "/api/connectors", headers: H() })).json().connectors; expect(c.find((x: any) => x.id === "osm").configured).toBe(true); expect(c.find((x: any) => x.id === "places").configured).toBe(false);
  });
});
describe("approval flow, unsubscribe, demo pages, inbound webhook", () => {
  let pid = "", eid = "", utoken = "", dtoken = "";
  it("draft → edit → approve through the API", async () => {
    pid = await mkProspect(db, { name: "Flow", website: "https://flow.fr", email: "info@flow.fr" }); await db.query("INSERT INTO analyses(prospect_id,facts) VALUES($1,$2::jsonb)", [pid, JSON.stringify(facts())]);
    const d = await buildDemo(db, pid); dtoken = d.token; expect(d.mode).toBe("sample");
    expect((await app.inject({ method: "POST", url: `/api/prospects/${pid}/draft`, headers: H() })).json().id).toBeTruthy();
    const list = (await app.inject({ url: "/api/emails?status=draft", headers: H() })).json().rows.filter((e: any) => e.prospect_id === pid); eid = list[0].id;
    expect((await app.inject({ method: "PATCH", url: `/api/emails/${eid}`, headers: H(), payload: { subject: "Sujet édité", body_text: list[0].body_text } })).json().ok).toBe(true);
    expect((await app.inject({ method: "POST", url: `/api/emails/${eid}/approve`, headers: H() })).json().ok).toBe(true);
    expect((await app.inject({ method: "POST", url: `/api/emails/${eid}/approve`, headers: H() })).json().ok).toBe(false); // can't approve twice
    utoken = (await db.query<any>("SELECT unsub_token FROM emails WHERE id=$1", [eid])).rows[0].unsub_token;
  });
  it("the demo page is private (noindex, unguessable), shows the unofficial disclaimer, and expires with 410", async () => {
    const page = await app.inject({ url: `/d/${dtoken}/` }); expect(page.statusCode).toBe(200); expect(page.headers["x-robots-tag"]).toContain("noindex"); expect(page.body).toContain('name="robots" content="noindex'); expect(page.body).not.toContain("Flow</"); 
    const js = (await app.inject({ url: `/d/${dtoken}/menu.js` })).body; expect(js).toContain("PROTOTYPE NON OFFICIEL"); expect(js).toContain('"demo":true'); expect(js).toContain("Contenu d'exemple");
    expect((await app.inject({ url: "/d/does-not-exist/" })).statusCode).toBe(404);
    await db.query("UPDATE demos SET expires_at=now()-interval '1 day' WHERE token=$1", [dtoken]); expect((await app.inject({ url: `/d/${dtoken}/` })).statusCode).toBe(410); expect((await app.inject({ url: `/d/${dtoken}/menu.js` })).statusCode).toBe(404);
  });
  it("one-click unsubscribe (GET and POST) suppresses, stops pending mail and marks do-not-contact", async () => {
    const r = await app.inject({ url: `/u/${utoken}` }); expect(r.statusCode).toBe(200); expect(r.body).toContain("unsubscribed");
    expect((await db.query<any>("SELECT 1 FROM suppression WHERE email='info@flow.fr'")).rows.length).toBe(1); expect((await db.query<any>("SELECT status FROM prospects WHERE id=$1", [pid])).rows[0].status).toBe("do_not_contact");
    expect((await db.query<any>("SELECT status FROM emails WHERE id=$1", [eid])).rows[0].status).toBe("rejected");
    expect((await app.inject({ method: "POST", url: `/u/${utoken}` })).statusCode).toBe(200); expect((await app.inject({ url: "/u/nope" })).statusCode).toBe(404);
  });
  it("inbound webhook needs its secret; an opt-out mail through it suppresses", async () => {
    const id = await mkProspect(db, { name: "Hook", website: "https://hook.fr", email: "info@hook.fr" });
    expect((await app.inject({ method: "POST", url: "/api/inbound/email", payload: { from: "info@hook.fr", subject: "x", text: "stop" } })).statusCode).toBe(401);
    const r = await app.inject({ method: "POST", url: "/api/inbound/email", headers: { "x-webhook-secret": "whsec" }, payload: { from: "Hook <info@hook.fr>", subject: "Re", text: "Please unsubscribe me", messageId: "w1" } }); expect(r.json().intent).toBe("opt_out");
    expect((await db.query<any>("SELECT status FROM prospects WHERE id=$1", [id])).rows[0].status).toBe("do_not_contact");
  });
  it("jobs endpoint runs a job once per key and the stats/report endpoints answer", async () => {
    expect((await app.inject({ method: "POST", url: "/api/jobs/report/run", headers: H() })).statusCode).toBe(200); expect((await app.inject({ method: "POST", url: "/api/jobs/hack/run", headers: H() })).statusCode).toBe(404);
    const st = (await app.inject({ url: "/api/stats", headers: H() })).json(); expect(st.discovered).toBeGreaterThan(0); expect(st.series.length).toBe(30);
    expect((await app.inject({ method: "POST", url: "/api/reports/generate", headers: H() })).json().text).toContain("Rapport du");
  });
  it("an auto-found hero stays OFF until the owner approves it", async () => {
    const pid2 = await mkProspect(db, { name: "Hero", website: "https://hero.fr", email: "info@hero.fr" }); const d = await buildDemo(db, pid2, { photos: false }); const id = (await db.query<any>("SELECT id FROM demos WHERE token=$1", [d.token])).rows[0].id;
    expect((await app.inject({ method: "POST", url: `/api/demos/${id}/hero`, headers: H(), payload: { on: true } })).json()).toMatchObject({ ok: false, error: "no_hero_found" });
    await db.query("UPDATE demos SET hero_state='pending' WHERE id=$1", [id]);
    expect((await app.inject({ url: `/d/${d.token}/menu.js` })).body).not.toContain("heroWide");
    expect((await app.inject({ method: "POST", url: `/api/demos/${id}/hero`, headers: H(), payload: { on: true } })).json().ok).toBe(true); expect((await app.inject({ url: `/d/${d.token}/menu.js` })).body).toContain("heroWide");
    await app.inject({ method: "POST", url: `/api/demos/${id}/hero`, headers: H(), payload: { on: false } }); expect((await app.inject({ url: `/d/${d.token}/menu.js` })).body).not.toContain("heroWide");
  });
  it("renderDemoHtml escapes the title", () => { const h = renderDemoHtml({ name: '<script>alert(1)</script>', defaultLang: "fr" }, "t"); expect(h).not.toContain("<script>alert"); });
});
