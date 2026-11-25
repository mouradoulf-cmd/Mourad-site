import crypto from "node:crypto";

export const token = (n = 24) => crypto.randomBytes(n).toString("base64url");
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function normalizeDomain(url?: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(/^https?:\/\//i.test(url) ? url : "https://" + url);
    return u.hostname.toLowerCase().replace(/^www\./, "");
  } catch { return null; }
}
export function slug(s: string): string {
  return s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
/** One establishment = one key: its website domain when it has one, otherwise country+city+name. Prevents contacting it twice. */
export function dedupeKey(p: { website?: string | null; name: string; country: string; city?: string }): string {
  const d = normalizeDomain(p.website);
  const social = d && /(facebook|instagram|tripadvisor|thefork|yelp|google|linktr\.ee|ubereats|booking)\./.test(d);
  if (d && !social) return "d:" + d;
  return `n:${p.country.toUpperCase()}:${slug(p.city ?? "")}:${slug(p.name)}`;
}
export const isEmail = (s: string) => /^[^\s@<>()]+@[^\s@<>()]+\.[a-z]{2,}$/i.test(s) && s.length <= 254;
export const today = (tz = "UTC", d = new Date()) => new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
export const hhmm = (tz = "UTC", d = new Date()) => new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false }).format(d);
export function chunk<T>(a: T[], n: number): T[][] { const o: T[][] = []; for (let i = 0; i < a.length; i += n) o.push(a.slice(i, i + n)); return o; }
