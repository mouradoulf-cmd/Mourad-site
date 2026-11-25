import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "../config.js";

export interface Db {
  query<T = any>(sql: string, params?: any[]): Promise<{ rows: T[]; rowCount: number }>;
  tx<T>(fn: (q: Db["query"]) => Promise<T>): Promise<T>;
  exec(sql: string): Promise<void>; // multi-statement scripts (migrations)
  close(): Promise<void>;
  kind: "pg" | "pglite";
}

export async function openDb(url = config.DATABASE_URL, dataDir = config.DATA_DIR, memory = false): Promise<Db> {
  if (url) {
    const pg = (await import("pg")).default;
    const pool = new pg.Pool({ connectionString: url, max: 8 });
    return {
      kind: "pg",
      async query(sql, params) { const r = await pool.query(sql, params); return { rows: r.rows, rowCount: r.rowCount ?? 0 }; },
      async tx(fn) {
        const c = await pool.connect();
        try { await c.query("BEGIN"); const out = await fn(async (s, p) => { const r = await c.query(s, p); return { rows: r.rows, rowCount: r.rowCount ?? 0 }; }); await c.query("COMMIT"); return out; }
        catch (e) { await c.query("ROLLBACK"); throw e; } finally { c.release(); }
      },
      async exec(sql) { await pool.query(sql); },
      close: () => pool.end(),
    };
  }
  // Embedded Postgres (WASM). Real PostgreSQL semantics; for a single small server. Use DATABASE_URL for hosted Postgres.
  const { PGlite } = await import("@electric-sql/pglite");
  if (!memory) fs.mkdirSync(dataDir, { recursive: true });
  const db = new PGlite(memory ? undefined : path.join(dataDir, "pgdata"));
  await db.waitReady;
  let chain: Promise<unknown> = Promise.resolve(); // PGlite is single-connection: serialise
  const run = <T,>(f: () => Promise<T>) => { const p = chain.then(f, f); chain = p.catch(() => {}); return p; };
  return {
    kind: "pglite",
    query: (sql, params) => run(async () => { const r = await db.query(sql, params); return { rows: r.rows as any[], rowCount: r.affectedRows ?? r.rows.length }; }),
    tx: (fn) => run(async () => db.transaction(async (t) => fn(async (s, p) => { const r = await t.query(s, p); return { rows: r.rows as any[], rowCount: r.affectedRows ?? r.rows.length }; }))),
    exec: (sql) => run(async () => { await db.exec(sql); }),
    close: () => db.close(),
  };
}

export async function migrate(db: Db) {
  const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "migrations");
  await db.query("CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())");
  const done = new Set((await db.query<{ name: string }>("SELECT name FROM schema_migrations")).rows.map((r) => r.name));
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".sql")).sort()) {
    if (done.has(f)) continue;
    const sql = fs.readFileSync(path.join(dir, f), "utf8");
    await db.exec(sql); await db.query("INSERT INTO schema_migrations(name) VALUES ($1)", [f]);
  }
}
