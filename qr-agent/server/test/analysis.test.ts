import { describe, it, expect, beforeEach } from "vitest";
import { analyzeSite, analyzeHtml, extractEmails } from "../src/analysis/site.js";
import { scoreProspect } from "../src/analysis/score.js";
import { setFetcher, _resetHttpCaches } from "../src/lib/http.js";
import { extractMenuFromText, verifyAgainstSource } from "../src/demo/build.js";
import { facts } from "./helpers.js";

const html = (b: string, head = "") => `<!doctype html><html lang="fr"><head>${head}<title>Chez Test</title></head><body>${b}</body></html>`;
function mockSite(pages: Record<string, { body: string; type?: string; status?: number }>, robots = "") {
  _resetHttpCaches();
  setFetcher((async (u: any) => { const url = String(u); const path = new URL(url).pathname; if (path === "/robots.txt") return new Response(robots, { status: robots ? 200 : 404 });
    const p = pages[path]; if (!p) return new Response("nf", { status: 404, headers: { "content-type": "text/html" } }); return new Response(p.body, { status: p.status ?? 200, headers: { "content-type": p.type ?? "text/html" } }); }) as any);
}
beforeEach(() => _resetHttpCaches());
describe("site analysis (measured facts only)", () => {
  it("detects a PDF-only menu, missing viewport, single language and a published email", async () => {
    mockSite({ "/": { body: html(`<a href="/carte.pdf">Notre carte</a><a href="/contact">Contact</a><img src="/a.jpg">`) }, "/contact": { body: html(`<p>Écrivez-nous : <a href="mailto:Info@Chez-Test.fr">Info@Chez-Test.fr</a></p>`) } });
    const f = await analyzeSite("https://chez-test.fr");
    expect(f.menu_kind).toBe("pdf"); expect(f.has_digital_menu).toBe(false); expect(f.mobile_viewport).toBe(false); expect(f.multilingual).toBe(false);
    expect(f.emails[0]).toMatchObject({ email: "info@chez-test.fr", role: true, same_domain: true }); expect(f.emails[0]!.source).toContain("/contact");
  });
  it("recognises an HTML menu and a QR-menu platform", async () => {
    mockSite({ "/": { body: html(`<a href="/menu">Menu</a>`, `<meta name="viewport" content="width=device-width, initial-scale=1">`) } });
    expect((await analyzeSite("https://a.test")).menu_kind).toBe("html");
    mockSite({ "/": { body: html(`<a href="https://qrmenu.example/r/1">Menu QR</a>menu-tiger`) } }); const q = await analyzeSite("https://b.test"); expect(q.menu_kind).toBe("qr_platform"); expect(q.has_digital_menu).toBe(true);
  });
  it("obeys robots.txt (no page fetched → unknown, never a made-up weakness)", async () => {
    mockSite({ "/": { body: html("<a href='/carte.pdf'>carte</a>") } }, "User-agent: *\nDisallow: /");
    const f = await analyzeSite("https://blocked.test"); expect(f.menu_kind).toBe("unknown"); expect(f.has_digital_menu).toBeNull(); expect(f.emails).toEqual([]);
  });
  it("no website → no_website facts", async () => { const f = await analyzeSite(null); expect(f.has_website).toBe(false); expect(f.menu_kind).toBe("none"); });
  it("never extracts junk or image-like emails", () => { const e = extractEmails(`<p>logo@2x.png noreply@x.com contact@resto.com</p>`, "https://resto.com", "resto.com"); expect(e.map((x) => x.email)).toEqual(["contact@resto.com"]); });
  it("analyzeHtml flags legacy markup", () => { const a = analyzeHtml(`<html><body><marquee>hi</marquee>© 2012</body></html>`, "https://x.test", new Date("2026-06-01")); expect(a.outdated_signals!.length).toBeGreaterThanOrEqual(2); });
});
describe("scoring", () => {
  it("PDF menu + no viewport + single language = high", () => expect(scoreProspect(facts(), { hasEmail: true, type: "italian" }).score).toBeGreaterThanOrEqual(80));
  it("already on a QR platform = low", () => expect(scoreProspect(facts({ menu_kind: "qr_platform", has_digital_menu: true, mobile_viewport: true, multilingual: true, has_photos: true, outdated: false, outdated_signals: [] }), { hasEmail: true }).score).toBeLessThan(25));
  it("unknown facts earn no points (nothing is assumed)", () => { const s = scoreProspect(facts({ menu_kind: "unknown", has_digital_menu: null, mobile_viewport: null, multilingual: null, has_photos: null, outdated: null, outdated_signals: [] }), { hasEmail: false }); expect(s.parts.filter((p) => p.key !== "fit").every((p) => p.points === 0)).toBe(true); expect(s.contactable).toBe(false); });
});
describe("menu extraction never invents", () => {
  const text = "ENTRÉES\nSalade lyonnaise ........ 9,50 €\nSoupe du jour 7 €\nPLATS\nQuenelle sauce Nantua 18,00 €\nTablier de sapeur 16 €\nNos produits sont frais.";
  it("reads name+price lines under headings", () => { const ex = extractMenuFromText(text); expect(ex.sections.map((s) => s.title)).toEqual(["ENTRÉES", "PLATS"]); expect(ex.sections[0]!.items[0]).toEqual({ name: "Salade lyonnaise", price: "9.50" }); });
  it("drops items that are not literally in the source", () => { const fake = { sections: [{ title: "X", items: [{ name: "Homard bleu", price: "55" }, { name: "Soupe du jour", price: "7" }] }] }; const v = verifyAgainstSource(fake, text); expect(v.sections[0]!.items.map((i) => i.name)).toEqual(["Soupe du jour"]); });
});
