import type { Db } from "../db/index.js";
import { config } from "../config.js";
import { getPage } from "../lib/http.js";
import { ask, parseJson } from "../agents/ai.js";
import { token, slug } from "../lib/util.js";
import { getSettings } from "../settings.js";
import { event, setStatus } from "../crm.js";
import * as cheerio from "cheerio";
import type { Facts } from "../analysis/site.js";

export type Lang5 = "fr" | "it" | "en" | "de" | "es";
export const DISCLAIMER: Record<Lang5, string> = {
  fr: "PROTOTYPE NON OFFICIEL réalisé par NM Studio pour présentation. Il n'a pas été validé par l'établissement : plats, prix, ingrédients et allergènes sont à confirmer.",
  it: "PROTOTIPO NON UFFICIALE realizzato da NM Studio a scopo dimostrativo. Non è stato convalidato dall'esercizio: piatti, prezzi, ingredienti e allergeni sono da confermare.",
  en: "UNOFFICIAL PROTOTYPE made by NM Studio for demonstration. It has not been validated by the venue: dishes, prices, ingredients and allergens are to be confirmed.",
  de: "INOFFIZIELLER PROTOTYP von NM Studio zu Demonstrationszwecken. Er wurde vom Betrieb nicht geprüft: Gerichte, Preise, Zutaten und Allergene sind zu bestätigen.",
  es: "PROTOTIPO NO OFICIAL creado por NM Studio con fines demostrativos. No ha sido validado por el establecimiento: platos, precios, ingredientes y alérgenos están por confirmar.",
};
const SAMPLE: Record<Lang5, { cats: [string, string][]; dish: string }> = {
  fr: { cats: [["Entrées", "Exemple d'entrée"], ["Plats", "Exemple de plat"], ["Desserts", "Exemple de dessert"], ["Boissons", "Exemple de boisson"]], dish: "Contenu d'exemple — à remplacer par votre vraie carte" },
  it: { cats: [["Antipasti", "Esempio di antipasto"], ["Piatti", "Esempio di piatto"], ["Dolci", "Esempio di dolce"], ["Bevande", "Esempio di bevanda"]], dish: "Contenuto di esempio — da sostituire con il vostro vero menu" },
  en: { cats: [["Starters", "Sample starter"], ["Mains", "Sample main"], ["Desserts", "Sample dessert"], ["Drinks", "Sample drink"]], dish: "Sample content — to be replaced with your real menu" },
  de: { cats: [["Vorspeisen", "Beispiel Vorspeise"], ["Hauptgerichte", "Beispiel Hauptgericht"], ["Desserts", "Beispiel Dessert"], ["Getränke", "Beispiel Getränk"]], dish: "Beispielinhalt — durch Ihre echte Karte zu ersetzen" },
  es: { cats: [["Entrantes", "Entrante de ejemplo"], ["Platos", "Plato de ejemplo"], ["Postres", "Postre de ejemplo"], ["Bebidas", "Bebida de ejemplo"]], dish: "Contenido de ejemplo — para sustituir por su carta real" },
};
const CURRENCY: Record<string, string> = { FR: "€", IT: "€", BE: "€", LU: "€", DE: "€", ES: "€", NL: "€", CH: "CHF", GB: "£", US: "$", CA: "CA$", AU: "A$" };
const THEME_BY_TYPE: [RegExp, string][] = [[/pizza|ital/, "trattoria"], [/french|bistro|brasserie/, "bistro"], [/asian|thai|japan|sushi/, "kaiseki"], [/beach|seafood/, "tropical"], [/hotel/, "ivoire"], [/steak|burger/, "noir"]];
export const themeFor = (type: string) => THEME_BY_TYPE.find(([r]) => r.test(type))?.[1] ?? "noir";

export interface Extracted { sections: { title: string; items: { name: string; price: string; desc?: string }[] }[] }
const PRICE = /(?:^|\s)((?:€|\$|£|CHF)?\s?\d{1,3}(?:[.,]\d{1,2})?\s?(?:€|\$|£|CHF|eur|euros?)?)\s*$/i;
/** Heuristic menu reader: "Name ........ 12,50 €" lines under headings. Only what is literally on the page. */
export function extractMenuFromText(text: string): Extracted {
  const lines = text.split(/\n+/).map((l) => l.replace(/\s+/g, " ").trim()).filter((l) => l.length > 2 && l.length < 160);
  const out: Extracted = { sections: [] }; let cur: Extracted["sections"][number] | null = null;
  for (const l of lines) {
    const m = l.match(PRICE);
    if (m && /\d/.test(m[1]!) && l.replace(m[0], "").trim().length >= 3) {
      const name = l.slice(0, l.length - m[0].length).replace(/[.·…\-–—\s]+$/g, "").trim(); const price = m[1]!.replace(/[€$£]|CHF|eur(?:os?)?/gi, "").trim().replace(",", ".");
      if (!/[a-zà-ÿ]/i.test(name) || name.length > 90) continue; if (!cur) { cur = { title: "", items: [] }; out.sections.push(cur); }
      cur.items.push({ name, price });
    } else if (l.length <= 40 && !/[.!?]$/.test(l) && /^[A-ZÀ-Ý0-9][^a-z]{0,3}|^[A-ZÀ-Ý][A-ZÀ-Ý '’&/-]{3,}$/.test(l)) { cur = { title: l.replace(/[:\-–—]+$/, "").trim(), items: [] }; out.sections.push(cur); }
  }
  out.sections = out.sections.filter((s) => s.items.length > 0); if (out.sections.length) out.sections.forEach((s, i) => { if (!s.title) s.title = i === 0 ? "Menu" : `Menu ${i + 1}`; });
  return out;
}
/** Anti-hallucination: keep only items whose name AND price literally occur in the source text. */
export function verifyAgainstSource(ex: Extracted, source: string): Extracted {
  const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim(); const src = norm(source); const raw = source.replace(/,/g, ".");
  return { sections: ex.sections.map((s) => ({ title: s.title, items: s.items.filter((i) => src.includes(norm(i.name)) && (!i.price || raw.includes(i.price) || raw.includes(i.price.replace(".", ",")))) })).filter((s) => s.items.length) };
}

export async function buildDemo(db: Db, prospectId: string): Promise<{ id: string; token: string; mode: "extracted" | "sample" }> {
  const p = (await db.query<any>("SELECT * FROM prospects WHERE id=$1", [prospectId])).rows[0]; if (!p) throw new Error("prospect_not_found");
  const facts: Facts | null = (await db.query<any>("SELECT facts FROM analyses WHERE prospect_id=$1 ORDER BY created_at DESC LIMIT 1", [prospectId])).rows[0]?.facts ?? null;
  const s = await getSettings(db); const lang = (["fr", "it", "en", "de", "es"].includes(p.language) ? p.language : "en") as Lang5;
  let ex: Extracted | null = null; let source = "";
  const htmlMenu = facts?.menu_urls.find((u) => !/\.pdf(\?|#|$)/i.test(u));
  if (htmlMenu) {
    const pg = await getPage(htmlMenu);
    if (pg?.html) { const $ = cheerio.load(pg.html); $("script,style,nav,footer,header,noscript").remove(); source = $("body").text().replace(/ /g, " ").split(/\n/).map((x) => x.trim()).filter(Boolean).join("\n").slice(0, 20000);
      const aiRaw = parseJson<Extracted>(await ask(db, "Extrait la carte d'un restaurant depuis le texte. N'invente rien : uniquement ce qui est écrit. JSON {\"sections\":[{\"title\":\"\",\"items\":[{\"name\":\"\",\"price\":\"12.50\",\"desc\":\"\"}]}]}. Prix en nombre sans devise, vide si absent.", source.slice(0, 9000), 1800));
      ex = verifyAgainstSource(aiRaw?.sections ? aiRaw : extractMenuFromText(source), source); }
  }
  const extracted = !!ex && ex.sections.reduce((n, x) => n + x.items.length, 0) >= 4;
  const mode: "extracted" | "sample" = extracted ? "extracted" : "sample";
  const unconfirmed: string[] = [];
  const sections = (extracted ? ex!.sections.slice(0, 8) : SAMPLE[lang].cats.map(([t, d]) => ({ title: t, items: [{ name: d, price: "", desc: SAMPLE[lang].dish }] }))).map((sec, si) => ({
    id: `s${si + 1}`, t: { [lang]: sec.title, en: sec.title }, items: sec.items.slice(0, 30).map((it, ii) => { const id = `s${si + 1}i${ii + 1}`; unconfirmed.push(id); return { id, n: it.name, p: it.price ?? "", d: it.desc ? { [lang]: it.desc, en: it.desc } : undefined }; }) }));
  const tok = token(18);
  const menu = {
    slug: `demo-${slug(p.name)}`, name: p.name, wordmark: p.name, wordmarkSub: "", demo: true, currency: CURRENCY[p.country] ?? "€", langs: [...new Set([lang, "en", "fr", "it", "de", "es"])], defaultLang: lang, origLang: lang, staffLang: lang, localTitles: false,
    photoOne: true, thumbs: true, cards: true, tapHint: false, spice: false, tagline: { [lang]: DISCLAIMER[lang].split(".")[0], en: "Unofficial prototype" }, footnote: Object.fromEntries((Object.keys(DISCLAIMER) as Lang5[]).map((l) => [l, DISCLAIMER[l]])),
    plus: { cards: true, layout: "large", depth: true, theme: themeFor(p.type), styles: false }, sections,
  };
  const expires = new Date(Date.now() + s.demo.expiresDays * 86400_000).toISOString();
  const ins = await db.query<{ id: string }>("INSERT INTO demos(prospect_id,token,menu,theme,content_mode,unconfirmed,expires_at) VALUES($1,$2,$3::jsonb,$4,$5,$6::jsonb,$7) RETURNING id", [prospectId, tok, JSON.stringify(menu), themeFor(p.type), mode, JSON.stringify(unconfirmed), expires]);
  await event(db.query, prospectId, "demo_built", { mode, items: unconfirmed.length });
  await setStatus(db, prospectId, "demo_ready", { why: `demo (${mode})` });
  return { id: ins.rows[0]!.id, token: tok, mode };
}
export function renderDemoHtml(menu: any, token: string): string {
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
  const base = `/engine`;
  return `<!doctype html><html translate="no" lang="${esc(menu.defaultLang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="google" content="notranslate"><meta name="robots" content="noindex,nofollow,noarchive"><meta name="referrer" content="no-referrer"><title>${esc(menu.name)} · prototype</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..700,0..100,0..1;1,9..144,300..700,0..100,0..1&family=Jost:wght@400;500;600;700&display=swap" rel="stylesheet">
${["menu", "menu-plus", "menu-plus-lux", "menu-plus-cards", "menu-plus-depth"].map((f) => `<link rel="stylesheet" href="${base}/${f}.css">`).join("")}</head><body><div id="menu"></div>
<script src="${base}/i18n-extra.js"></script><script src="/d/${token}/menu.js"></script>${["menu", "menu-plus", "menu-plus-lux", "menu-plus-cards", "menu-plus-depth"].map((f) => `<script src="${base}/${f}.js"></script>`).join("")}</body></html>`;
}
