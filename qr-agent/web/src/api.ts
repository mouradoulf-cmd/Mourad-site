export class ApiError extends Error { constructor(public status: number, public body: any) { super(body?.error ?? `HTTP ${status}`); } }
export async function api<T = any>(path: string, opts: { method?: string; body?: unknown } = {}): Promise<T> {
  const r = await fetch(path, { method: opts.method ?? "GET", credentials: "same-origin", headers: { "content-type": "application/json", "x-requested-with": "qr-agent" }, body: opts.body === undefined ? undefined : JSON.stringify(opts.body) });
  const j = await r.json().catch(() => ({})); if (!r.ok) throw new ApiError(r.status, j); return j as T;
}
export const fmt = (n: number | string | null | undefined) => new Intl.NumberFormat("fr-FR").format(Number(n ?? 0));
export const dt = (s?: string | null) => (s ? new Date(s).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }) : "—");
export const FLAG = (c: string) => String.fromCodePoint(...[...c.toUpperCase()].map((x) => 127397 + x.charCodeAt(0)));
