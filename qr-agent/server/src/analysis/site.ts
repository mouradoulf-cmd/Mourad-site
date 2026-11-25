import * as cheerio from "cheerio";
import dns from "node:dns/promises";
import { getPage } from "../lib/http.js";
import { isEmail, normalizeDomain } from "../lib/util.js";
import { config } from "../config.js";

/** Facts are MEASURED with evidence. Nothing is guessed: unknown stays null. */
export interface Facts {
  checked_at: string; website: string | null; reachable: boolean | null; final_url?: string;
  has_website: boolean; has_digital_menu: boolean | null; menu_kind: "none" | "html" | "pdf" | "qr_platform" | "unknown";
  menu_urls: string[]; qr_platform: string | null;
  mobile_viewport: boolean | null; languages: string[]; multilingual: boolean | null; image_count: number | null; has_photos: boolean | null;
  copyright_year: number | null; outdated_signals: string[]; outdated: boolean | null;
  emails: { email: string; source: string; role: boolean; same_domain: boolean }[]; contact_form_url: string | null; evidence: string[];
}
export const QR_PLATFORMS = ["menu-tiger", "menutiger", "qr-code-generator", "menu.qr", "zenchef", "tabesto", "getsunday", "sunday.app", "menuviel", "carte-qr", "qrmenu", "yumzi", "flipdish", "orderyoyo", "menuqr", "scanmenu", "gloriafood", "mymenu", "menupixel", "tomorrow.menu", "menuwiz", "bistrochat", "qrcodechimp"];
const MENU_RX = /\b(menu|carte|la carte|nos plats|speisekarte|speisen|men[uú]|carta|cartes?|men[uú] del d[ií]a|drinks?|boissons|wine list|carta dei vini|weinkarte)\b/i;
const CONTACT_RX = /\b(contact|contatti|kontakt|contacto|nous contacter|contattaci|about|impressum|mentions l[ée]gales)\b/i;
const ROLE_RX = /^(info|contact|hello|hallo|bonjour|ciao|reservation|reservations|reservas|booking|bookings|prenotazioni|reception|accueil|restaurant|resto|office|mail|admin|direction|commercial)@/i;
const BAD_EMAIL = /(\.(png|jpe?g|gif|webp|svg|css|js)$|^(no-?reply|donotreply|noreply)@|@(sentry|wixpress|example|domain|email)\.|@.*\.(png|jpg)$)/i;

export function extractEmails(html: string, pageUrl: string, siteDomain: string | null) {
  const out = new Map<string, { email: string; source: string; role: boolean; same_domain: boolean }>();
  const add = (raw: string) => {
    const e = decodeURIComponent(raw).trim().toLowerCase().replace(/^mailto:/, "").split("?")[0]!.replace(/[.,;:)]+$/, "");
    if (!isEmail(e) || BAD_EMAIL.test(e)) return;
    const d = e.split("@")[1]!; const same = !!siteDomain && (d === siteDomain || d.endsWith("." + siteDomain) || siteDomain.endsWith("." + d));
    if (!out.has(e)) out.set(e, { email: e, source: pageUrl, role: ROLE_RX.test(e), same_domain: same });
  };
  const $ = cheerio.load(html);
  $("a[href^='mailto:' i]").each((_, a) => { const h = $(a).attr("href"); if (h) add(h); });
  const text = $("body").text() + " " + html.replace(/<[^>]+>/g, " ");
  for (const m of text.matchAll(/[a-z0-9._%+-]+\s?(?:@|\(at\)|\[at\])\s?[a-z0-9.-]+\.[a-z]{2,}/gi)) add(m[0].replace(/\s/g, "").replace(/\(at\)|\[at\]/gi, "@"));
  return [...out.values()];
}

export function analyzeHtml(html: string, pageUrl: string, now = new Date()): Partial<Facts> & { links: { href: string; text: string }[] } {
  const $ = cheerio.load(html);
  const links: { href: string; text: string }[] = [];
  $("a[href]").each((_, a) => { const href = $(a).attr("href")!; try { links.push({ href: new URL(href, pageUrl).toString(), text: $(a).text().trim().slice(0, 80) }); } catch {} });
  const viewport = $("meta[name='viewport' i]").attr("content") ?? "";
  const langs = new Set<string>(); const htmlLang = ($("html").attr("lang") ?? "").slice(0, 2).toLowerCase(); if (htmlLang) langs.add(htmlLang);
  $("link[rel='alternate'][hreflang]").each((_, l) => { const h = ($(l).attr("hreflang") ?? "").slice(0, 2).toLowerCase(); if (h && h !== "x-") langs.add(h); });
  $("a[hreflang]").each((_, l) => { const h = ($(l).attr("hreflang") ?? "").slice(0, 2).toLowerCase(); if (h) langs.add(h); });
  const imgs = $("img").filter((_, i) => { const s = $(i).attr("src") ?? $(i).attr("data-src") ?? ""; return !!s && !/logo|icon|sprite|pixel|blank|spacer|facebook|instagram/i.test(s); }).length;
  const outdated: string[] = [];
  if (/<(frameset|marquee|blink)\b/i.test(html)) outdated.push("balises HTML obsolètes (frameset/marquee/blink)");
  if (/swfobject|\.swf\b|flash/i.test(html) && /\.swf\b/i.test(html)) outdated.push("contenu Flash");
  if ($("table").length > 6 && $("div").length < 5) outdated.push("mise en page en tableaux");
  if (!viewport) outdated.push("pas de balise viewport mobile");
  const yrs = [...(($("footer").text() + " " + $("body").text().slice(-1500)).matchAll(/(?:©|&copy;|copyright)[^0-9]{0,12}((?:19|20)\d{2})/gi))].map((m) => +m[1]!);
  const copyright = yrs.length ? Math.max(...yrs) : null;
  if (copyright && copyright <= now.getFullYear() - 5) outdated.push(`copyright en pied de page ${copyright}`);
  const lower = html.toLowerCase();
  const qr = QR_PLATFORMS.find((p) => lower.includes(p) || links.some((l) => l.href.toLowerCase().includes(p))) ?? null;
  return { mobile_viewport: !!viewport && /width\s*=\s*device-width/i.test(viewport), languages: [...langs], image_count: imgs, copyright_year: copyright, outdated_signals: outdated, qr_platform: qr, links };
}

export async function verifyEmail(email: string): Promise<boolean> {
  if (!isEmail(email)) return false;
  if (!config.VERIFY_MX) return true; // dev only
  try { const mx = await dns.resolveMx(email.split("@")[1]!); return mx.length > 0; }
  catch (e: any) { if (e?.code === "ENOTFOUND" || e?.code === "ENODATA") return false; try { const a = await dns.resolve4(email.split("@")[1]!); return a.length > 0; } catch { return false; } }
}

/** Fetch homepage (+ at most one menu page and one contact page), obeying robots.txt. */
export async function analyzeSite(website: string | null, now = new Date()): Promise<Facts> {
  const facts: Facts = { checked_at: now.toISOString(), website, reachable: null, has_website: !!website, has_digital_menu: null, menu_kind: "none", menu_urls: [], qr_platform: null, mobile_viewport: null, languages: [], multilingual: null, image_count: null, has_photos: null, copyright_year: null, outdated_signals: [], outdated: null, emails: [], contact_form_url: null, evidence: [] };
  if (!website) return facts;
  const url = /^https?:\/\//i.test(website) ? website : "https://" + website;
  const domain = normalizeDomain(url);
  const home = await getPage(url);
  if (!home || !home.html) { facts.reachable = home ? home.status < 400 : null; facts.menu_kind = "unknown"; facts.evidence.push(home ? `la page d'accueil a répondu ${home.status} (${home.contentType || "pas de html"})` : "page d'accueil inaccessible ou interdite par robots.txt"); return facts; }
  facts.reachable = home.status < 400; facts.final_url = home.url;
  const a = analyzeHtml(home.html, home.url, now);
  Object.assign(facts, { mobile_viewport: a.mobile_viewport ?? null, languages: a.languages ?? [], image_count: a.image_count ?? null, copyright_year: a.copyright_year ?? null, outdated_signals: a.outdated_signals ?? [], qr_platform: a.qr_platform ?? null });
  facts.multilingual = facts.languages.length > 1 ? true : facts.languages.length === 1 ? false : null;
  facts.has_photos = facts.image_count == null ? null : facts.image_count >= 4;
  facts.outdated = facts.outdated_signals.length >= 2 ? true : facts.outdated_signals.length === 0 ? false : null;
  const same = (h: string) => { const d = normalizeDomain(h); return !!d && !!domain && (d === domain || d.endsWith("." + domain)); };
  const menuLinks = a.links.filter((l) => MENU_RX.test(l.text) || /\/(menu|carte|speisekarte|carta)\b/i.test(l.href));
  const pdfs = [...new Set(menuLinks.filter((l) => /\.pdf(\?|#|$)/i.test(l.href)).map((l) => l.href))];
  const htmlMenus = [...new Set(menuLinks.filter((l) => !/\.pdf(\?|#|$)/i.test(l.href) && same(l.href)).map((l) => l.href))];
  const external = menuLinks.filter((l) => !same(l.href) && QR_PLATFORMS.some((p) => l.href.toLowerCase().includes(p)));
  facts.menu_urls = [...pdfs, ...htmlMenus].slice(0, 6);
  let emails = extractEmails(home.html, home.url, domain);
  if (facts.qr_platform || external.length) { facts.menu_kind = "qr_platform"; facts.has_digital_menu = true; facts.evidence.push(`plateforme de menu QR détectée : ${facts.qr_platform ?? external[0]!.href}`); }
  else if (htmlMenus.length) { facts.menu_kind = "html"; facts.has_digital_menu = true; facts.evidence.push(`page carte HTML : ${htmlMenus[0]}`); }
  else if (pdfs.length) { facts.menu_kind = "pdf"; facts.has_digital_menu = false; facts.evidence.push(`carte disponible seulement en PDF : ${pdfs[0]}`); }
  else { facts.menu_kind = "none"; facts.has_digital_menu = false; facts.evidence.push("aucun lien vers la carte sur la page d'accueil"); }
  // one contact page for the published business email
  const contact = a.links.find((l) => same(l.href) && CONTACT_RX.test(l.text + " " + l.href) && !/\.pdf/i.test(l.href));
  if (contact && contact.href !== home.url) { const cp = await getPage(contact.href); if (cp?.html) { emails = [...emails, ...extractEmails(cp.html, cp.url, domain)]; if (/<form\b/i.test(cp.html)) facts.contact_form_url = cp.url; } }
  if (!facts.contact_form_url && /<form\b/i.test(home.html)) facts.contact_form_url = home.url;
  const seen = new Set<string>(); facts.emails = emails.filter((e) => !seen.has(e.email) && (seen.add(e.email), true)).sort((x, y) => Number(y.same_domain) - Number(x.same_domain) || Number(y.role) - Number(x.role)).slice(0, 5);
  return facts;
}
