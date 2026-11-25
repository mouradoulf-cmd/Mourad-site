import { config } from "./config.js";
import { openDb, migrate } from "./db/index.js";
import { buildApp } from "./api/server.js";
import { startScheduler } from "./scheduler/index.js";
import { log } from "./lib/log.js";

const db = await openDb(); await migrate(db);
if (config.NODE_ENV === "production" && (!config.ADMIN_PASSWORD_HASH || config.SESSION_SECRET.startsWith("dev-only"))) { log("error", "Refusing to start in production without ADMIN_PASSWORD_HASH and a real SESSION_SECRET"); process.exit(1); }
const app = await buildApp(db);
await app.listen({ port: config.PORT, host: "0.0.0.0" });
log("info", "QR Business AI Agent started", { port: config.PORT, db: db.kind, scheduler: !config.DISABLE_SCHEDULER });
if (!config.DISABLE_SCHEDULER) startScheduler(db);
for (const sig of ["SIGINT", "SIGTERM"] as const) process.on(sig, async () => { await app.close(); await db.close(); process.exit(0); });
