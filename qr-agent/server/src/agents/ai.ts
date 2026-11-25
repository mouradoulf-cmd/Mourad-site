import type { Db } from "../db/index.js";
import { config } from "../config.js";
import { today } from "../lib/util.js";

export const aiConfigured = () => !!config.ANTHROPIC_API_KEY;
export async function usageToday(db: Db, provider: string) {
  const r = await db.query<{ count: number }>("SELECT count FROM api_usage WHERE day=$1 AND provider=$2", [today(), provider]); return r.rows[0]?.count ?? 0;
}
export async function bump(db: Db, provider: string) {
  await db.query("INSERT INTO api_usage(day,provider,count) VALUES($1,$2,1) ON CONFLICT (day,provider) DO UPDATE SET count=api_usage.count+1", [today(), provider]);
}
let override: ((system: string, user: string) => Promise<string>) | null = null;
export const setAiOverride = (f: typeof override) => { override = f; }; // tests only

/** One quota-guarded call to the Claude Messages API. Returns null when AI is not configured or the daily budget is spent → callers fall back to templates and say so. */
export async function ask(db: Db, system: string, user: string, maxTokens = 900): Promise<string | null> {
  if (override) return override(system, user);
  if (!aiConfigured()) return null;
  if ((await usageToday(db, "ai")) >= config.AI_DAILY_CALL_LIMIT) return null;
  await bump(db, "ai");
  const res = await fetch(`${config.AI_BASE_URL}/v1/messages`, {
    method: "POST", headers: { "content-type": "application/json", "x-api-key": config.ANTHROPIC_API_KEY!, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: config.AI_MODEL, max_tokens: maxTokens, system, messages: [{ role: "user", content: user }] }), signal: AbortSignal.timeout(60000),
  });
  if (!res.ok) throw new Error(`ai ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const j: any = await res.json();
  return (j.content ?? []).filter((b: any) => b.type === "text").map((b: any) => b.text).join("");
}
export function parseJson<T = any>(s: string | null): T | null {
  if (!s) return null; const m = s.match(/\{[\s\S]*\}/); if (!m) return null; try { return JSON.parse(m[0]) as T; } catch { return null; }
}
