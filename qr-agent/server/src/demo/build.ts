import type { Db } from "../db/index.js";
import { config } from "../config.js";
import { getPage } from "../lib/http.js";
import { ask, parseJson } from "../agents/ai.js";
import { token, slug } from "../lib/util.js";
import { getSettings } from "../settings.js";
import { event, setStatus } from "../crm.js";
import * as cheerio from "cheerio";
import { log } from "../lib/log.js";
import type { Facts } from "../analysis/site.js";
import { findDishPhoto, findHero } from "./photos.js";

export type Lang5 = "fr" | "it" | "en" | "de" | "es";
export const DISCLAIMER: Record<Lang5, string> = {
  fr: "PROTOTYPE NON OFFICIEL réalisé par NM Studio pour présentation. Il n'a pas été validé par l'établissement : plats, prix, ingrédients et allergènes sont à confirmer.",
  it: "PROTOTIPO NON UFFICIALE realizzato da NM Studio a scopo dimostrativo. Non è stato convalidato dall'esercizio: piatti, prezzi, ingredienti e allergeni sono da confermare.",
  en: "UNOFFICIAL PROTOTYPE made by NM Studio for demonstration. It has not been validated by the venue: dishes, prices, ingredients and allergens are to be confirmed.",
  de: "INOFFIZIELLER PROTOTYP von NM Studio zu Demonstrationszwecken. Er wurde vom Betrieb nicht geprüft: Gerichte, Preise, Zutaten und Allergene sind zu bestätigen.",
  es: "PROTOTIPO NO OFICIAL creado por NM Studio con fines demostrativos. No ha sido validado por el establecimiento: platos, precios, ingredientes y alérgenos están por confirmar.",
};
const PHOTO_NOTE: Record<Lang5, string> = { fr: " Photos d'illustration libres de droits : ce ne sont pas celles de l'établissement.", it: " Foto di illustrazione libere da diritti: non sono quelle dell'esercizio.", en: " Illustrative royalty-free photos: they are not the venue's own.", de: " Lizenzfreie Illustrationsfotos: nicht die des Betriebs.", es: " Fotos de ilustración libres de derechos: no son las del establecimiento." };
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
  const junk = (n: string) => /\d[.,]\d{2}|[€$£]/.test(n) || n.length > 80; // a name that swallowed a price/other lines is a bad parse, not a dish
  return { sections: ex.sections.map((s) => ({ title: s.title, items: s.items.filter((i) => !junk(i.name) && src.includes(norm(i.name)) && (!i.price || raw.includes(i.price) || raw.includes(i.price.replace(".", ",")))) })).filter((s) => s.items.length) };
}

export async function buildDemo(db: Db, prospectId: string, opts: { photos?: boolean } = {}): Promise<{ id: string; token: string; mode: "extracted" | "sample"; photos: number; hero: boolean }> {
  const p = (await db.query<any>("SELECT * FROM prospects WHERE id=$1", [prospectId])).rows[0]; if (!p) throw new Error("prospect_not_found");
  const facts: Facts | null = (await db.query<any>("SELECT facts FROM analyses WHERE prospect_id=$1 ORDER BY created_at DESC LIMIT 1", [prospectId])).rows[0]?.facts ?? null;
  const s = await getSettings(db); const lang = (["fr", "it", "en", "de", "es"].includes(p.language) ? p.language : "en") as Lang5;
  let ex: Extracted | null = null; let source = "";
  const htmlMenu = facts?.menu_urls.find((u) => !/\.pdf(\?|#|$)/i.test(u));
  if (htmlMenu) {
    const pg = await getPage(htmlMenu);
    if (pg?.html) { const $ = cheerio.load(pg.html); $("script,style,nav,footer,header,noscript").remove(); $("p,li,div,tr,td,h1,h2,h3,h4,h5,h6,section,article,dd,dt,br").after("\n"); source = $("body").text().replace(/ /g, " ").split(/\n/).map((x) => x.trim()).filter(Boolean).join("\n").slice(0, 20000);
      const aiRaw = parseJson<Extracted>(await ask(db, "Extrait la carte d'un restaurant depuis le texte. N'invente rien : uniquement ce qui est écrit. JSON {\"sections\":[{\"title\":\"\",\"items\":[{\"name\":\"\",\"price\":\"12.50\",\"desc\":\"\"}]}]}. Prix en nombre sans devise, vide si absent.", source.slice(0, 9000), 1800));
      ex = verifyAgainstSource(aiRaw?.sections ? aiRaw : extractMenuFromText(source), source); }
  }
  const extracted = !!ex && ex.sections.reduce((n, x) => n + x.items.length, 0) >= 4;
  const mode: "extracted" | "sample" = extracted ? "extracted" : "sample";
  const unconfirmed: string[] = [];
  const sections = (extracted ? ex!.sections.slice(0, 8) : SAMPLE[lang].cats.map(([t, d]) => ({ title: t, items: [{ name: d, price: "", desc: SAMPLE[lang].dish }] }))).map((sec, si) => ({
    id: `s${si + 1}`, t: { [lang]: sec.title, en: sec.title }, items: sec.items.slice(0, 30).map((it, ii) => { const id = `s${si + 1}i${ii + 1}`; unconfirmed.push(id); return { id, n: it.name, p: it.price ?? "", d: it.desc ? { [lang]: it.desc, en: it.desc } : undefined }; }) }));
  const tok = token(18);
  const expires = new Date(Date.now() + s.demo.expiresDays * 86400_000).toISOString();
  const ins = await db.query<{ id: string }>("INSERT INTO demos(prospect_id,token,menu,theme,content_mode,unconfirmed,expires_at) VALUES($1,$2,'{}'::jsonb,$3,$4,$5::jsonb,$6) RETURNING id", [prospectId, tok, themeFor(p.type), mode, JSON.stringify(unconfirmed), expires]);
  const demoId = ins.rows[0]!.id; const credits: string[] = []; let hero = false; let nPhotos = 0;
  const save = async (key: string, f: { bytes: Uint8Array; mime: string; title: string; author: string; license: string; url: string }) => { await db.query("INSERT INTO demo_assets(demo_id,key,mime,data,title,author,license,source_url) VALUES($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT DO NOTHING", [demoId, key, f.mime, Buffer.from(f.bytes), f.title, f.author, f.license, f.url]); credits.push(`${f.title} — ${f.author || "?"} — ${f.license} — ${f.url}`); };
  if (opts.photos !== false) {
    try { const h = await findHero(p.type); if (h) { await save("hero", h); hero = true; } } catch (e: any) { log("warn", "hero search failed", { err: e.message }); }
    if (mode === "extracted") for (const sec of sections) for (const it of sec.items) {
      if (nPhotos >= 14) break;
      try { const ph = await findDishPhoto(it.n); if (ph) { const key = `p${++nPhotos}`; await save(key, ph); (it as any).img = key; } } catch (e: any) { log("warn", "dish photo failed", { dish: it.n, err: e.message }); }
    }
  }
  const menu = {
    slug: `demo-${slug(p.name)}`, name: p.name, wordmark: p.name, wordmarkSub: "", demo: true, currency: CURRENCY[p.country] ?? "€", langs: [...new Set([lang, "en", "fr", "it", "de", "es"])], defaultLang: lang, origLang: lang, staffLang: lang, localTitles: false,
    photoOne: true, thumbs: true, cards: true, tapHint: false, spice: false,  tagline: { [lang]: DISCLAIMER[lang].split(".")[0], en: "Unofficial prototype" }, footnote: Object.fromEntries((Object.keys(DISCLAIMER) as Lang5[]).map((l) => [l, DISCLAIMER[l]])),
    plus: { cards: true, layout: "large", depth: true, hero3d: false, theme: themeFor(p.type), styles: false }, sections,
  };
  (menu as any).footnote = Object.fromEntries((Object.keys(DISCLAIMER) as Lang5[]).map((l) => [l, DISCLAIMER[l] + (nPhotos ? PHOTO_NOTE[l] : "")]));
  await db.query("UPDATE demos SET menu=$2::jsonb, credits=$3, hero_state=$4 WHERE id=$1", [demoId, JSON.stringify(menu), credits.join("\n"), hero ? "pending" : "none"]);
  await event(db.query, prospectId, "demo_built", { mode, items: unconfirmed.length, photos: nPhotos, hero });
  await setStatus(db, prospectId, "demo_ready", { why: `demo (${mode})` });
  return { id: demoId, token: tok, mode, photos: nPhotos, hero };
}
export function renderDemoHtml(menu: any, token: string): string {
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
  const base = `/engine`;
  return `<!doctype html><html translate="no" lang="${esc(menu.defaultLang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="google" content="notranslate"><meta name="robots" content="noindex,nofollow,noarchive"><meta name="referrer" content="no-referrer"><title>${esc(menu.name)} · prototype</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..700,0..100,0..1;1,9..144,300..700,0..100,0..1&family=Jost:wght@400;500;600;700&display=swap" rel="stylesheet">
${["menu", "menu-plus", "menu-plus-lux", "menu-plus-cards", "menu-plus-depth"].map((f) => `<link rel="stylesheet" href="${base}/${f}.css">`).join("")}</head><body><div id="menu"></div>
<script src="${base}/i18n-extra.js"></script><script src="/d/${token}/menu.js"></script>${["menu", "menu-plus", "menu-plus-lux", "menu-plus-cards", "menu-plus-depth"].map((f) => `<script src="${base}/${f}.js"></script>`).join("")}</body></html>`;
}

/** The hero photograph is a generic venue picture from Commons and may show people: it is NEVER used until the owner looks at it and says yes. */
export async function setHero(db: Db, demoId: string, on: boolean) {
  const d = (await db.query<any>("SELECT menu, hero_state FROM demos WHERE id=$1", [demoId])).rows[0]; if (!d) return { ok: false, error: "not_found" };
  if (on && d.hero_state === "none") return { ok: false, error: "no_hero_found" };
  const m = d.menu; if (on) { m.heroMobile = "hero-m.webp"; m.heroWide = "hero.webp"; m.plus.hero3d = true; } else { delete m.heroMobile; delete m.heroWide; m.plus.hero3d = false; }
  await db.query("UPDATE demos SET menu=$2::jsonb, hero_state=$3 WHERE id=$1", [demoId, JSON.stringify(m), on ? "on" : d.hero_state === "none" ? "none" : "pending"]);
  return { ok: true };
}
