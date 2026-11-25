import { config } from "../config.js";
import { sleep } from "../lib/util.js";
export const UA = () => `QRBusinessAgent/1.0 (+${config.USER_AGENT_CONTACT}; menu prototype illustrations)`;
let f: typeof fetch = (...a) => fetch(...a); export const setFetcherForPhotos = (x: typeof fetch) => { f = x; };
let last = 0;
async function gap() { const w = last + 1200 - Date.now(); if (w > 0) await sleep(w); last = Date.now(); }
export async function politeJson(url: string): Promise<any> {
  for (let i = 0; i < 3; i++) { await gap(); try { const r = await f(url, { headers: { "user-agent": UA() }, signal: AbortSignal.timeout(20000) }); if (r.status === 429) { await sleep(15000); continue; } if (!r.ok) return null; return await r.json(); } catch { /* retry */ } }
  return null;
}
export async function politeBinary(url: string): Promise<{ bytes: Uint8Array; mime: string } | null> {
  for (let i = 0; i < 3; i++) { await gap(); try { const r = await f(url, { headers: { "user-agent": UA() }, signal: AbortSignal.timeout(30000) }); if (r.status === 429) { await sleep(15000); continue; } const mime = r.headers.get("content-type") ?? ""; if (!r.ok || !/image\/(jpeg|png|webp)/.test(mime)) return null; return { bytes: new Uint8Array(await r.arrayBuffer()), mime }; } catch { /* retry */ } }
  return null;
}
