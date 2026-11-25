import crypto from "node:crypto";
import { config } from "../config.js";

export function hashPassword(pw: string): string {
  const salt = crypto.randomBytes(16); const h = crypto.scryptSync(pw, salt, 64);
  return `scrypt:${salt.toString("hex")}:${h.toString("hex")}`;
}
export function verifyPassword(pw: string): boolean {
  if (config.ADMIN_PASSWORD_HASH) {
    const [, salt, hash] = config.ADMIN_PASSWORD_HASH.split(":"); if (!salt || !hash) return false;
    const h = crypto.scryptSync(pw, Buffer.from(salt, "hex"), 64); return crypto.timingSafeEqual(h, Buffer.from(hash, "hex"));
  }
  if (config.ADMIN_PASSWORD) { const a = Buffer.from(pw), b = Buffer.from(config.ADMIN_PASSWORD); return a.length === b.length && crypto.timingSafeEqual(a, b); }
  return false;
}
const sign = (p: string) => crypto.createHmac("sha256", config.SESSION_SECRET).update(p).digest("base64url");
export function makeSession(ttlMs = 7 * 86400_000): string { const p = Buffer.from(JSON.stringify({ e: Date.now() + ttlMs })).toString("base64url"); return `${p}.${sign(p)}`; }
export function checkSession(v?: string): boolean {
  if (!v) return false; const [p, s] = v.split("."); if (!p || !s) return false;
  const good = sign(p); if (good.length !== s.length || !crypto.timingSafeEqual(Buffer.from(good), Buffer.from(s))) return false;
  try { return JSON.parse(Buffer.from(p, "base64url").toString()).e > Date.now(); } catch { return false; }
}
const attempts = new Map<string, { n: number; t: number }>();
export function loginAllowed(ip: string): boolean { const a = attempts.get(ip); if (!a || Date.now() - a.t > 15 * 60_000) return true; return a.n < 6; }
export function loginFailed(ip: string) { const a = attempts.get(ip); if (!a || Date.now() - a.t > 15 * 60_000) attempts.set(ip, { n: 1, t: Date.now() }); else a.n++; }
export const _resetLogin = () => attempts.clear();
