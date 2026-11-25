import robotsParser from "robots-parser";
import { config } from "../config.js";
import { sleep } from "./util.js";

export const UA = () => `QRBusinessAgent/1.0 (+${config.USER_AGENT_CONTACT})`;
const lastHit = new Map<string, number>();
const robotsCache = new Map<string, { at: number; r: ReturnType<typeof robotsParser> | null }>();
export type Fetcher = typeof fetch;
let fetcher: Fetcher = (...a) => fetch(...a);
export const setFetcher = (f: Fetcher) => { fetcher = f; }; // tests

async function politeWait(host: string, gapMs: number) {
  const last = lastHit.get(host) ?? 0; const wait = last + gapMs - Date.now();
  if (wait > 0) await sleep(wait);
  lastHit.set(host, Date.now());
}
export async function robotsAllows(url: string): Promise<boolean> {
  const u = new URL(url); const origin = u.origin;
  let c = robotsCache.get(origin);
  if (!c || Date.now() - c.at > 3600_000) {
    let r: ReturnType<typeof robotsParser> | null = null;
    try {
      const res = await fetcher(origin + "/robots.txt", { headers: { "user-agent": UA() }, signal: AbortSignal.timeout(8000), redirect: "follow" });
      if (res.ok) r = robotsParser(origin + "/robots.txt", await res.text());
      else if (res.status >= 500) r = robotsParser(origin + "/robots.txt", "User-agent: *\nDisallow: /"); // site in trouble: stay away
    } catch { r = null; }
    c = { at: Date.now(), r }; robotsCache.set(origin, c);
  }
  return c.r ? c.r.isAllowed(url, "QRBusinessAgent") !== false : true;
}
export interface Page { url: string; status: number; contentType: string; html: string }
/** Polite GET: identifies itself, obeys robots.txt, one request per host per 1.5 s, no auth walls / captcha handling, size-capped. Returns null when blocked or failing. */
export async function getPage(url: string, gapMs = 1500): Promise<Page | null> {
  try {
    if (!/^https?:/i.test(url)) return null;
    if (!(await robotsAllows(url))) return null;
    await politeWait(new URL(url).host, gapMs);
    const res = await fetcher(url, { headers: { "user-agent": UA(), accept: "text/html,application/xhtml+xml", "accept-language": "en,fr;q=0.8" }, signal: AbortSignal.timeout(12000), redirect: "follow" });
    const ct = res.headers.get("content-type") ?? "";
    if (!/html|xml|text/i.test(ct)) return { url: res.url || url, status: res.status, contentType: ct, html: "" };
    const buf = await res.arrayBuffer();
    if (buf.byteLength > 2_500_000) return null;
    return { url: res.url || url, status: res.status, contentType: ct, html: new TextDecoder("utf-8", { fatal: false }).decode(buf) };
  } catch { return null; }
}
export const _resetHttpCaches = () => { lastHit.clear(); robotsCache.clear(); };
