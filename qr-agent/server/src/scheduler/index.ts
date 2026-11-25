import type { Db } from "../db/index.js";
import { getSettings } from "../settings.js";
import { hhmm, today } from "../lib/util.js";
import { runJob, recoverJobs, type JobName, JOBS } from "./jobs.js";
import { log } from "../lib/log.js";

/** Every minute: for each enabled schedule entry whose time has been reached today (owner timezone), run it once. The unique run_key makes it safe with several processes. */
export async function tick(db: Db, now = new Date()) {
  const s = await getSettings(db); const hm = hhmm(s.tz, now); const day = today(s.tz, now); const ran: string[] = [];
  for (const e of s.schedule) {
    if (!e.enabled || !(JOBS as string[]).includes(e.job) || hm < e.time) continue;
    const key = `${e.job}:${day}:${e.time}`;
    const exists = (await db.query("SELECT 1 FROM job_runs WHERE run_key=$1", [key])).rows.length; if (exists) continue;
    try { await runJob(db, e.job as JobName, key, now); ran.push(e.job); } catch { /* recorded in job_runs */ }
  }
  return ran;
}
export function startScheduler(db: Db) {
  recoverJobs(db).catch(() => {});
  let busy = false;
  const t = setInterval(async () => { if (busy) return; busy = true; try { const r = await tick(db); if (r.length) log("info", "scheduler ran", { jobs: r }); } catch (e: any) { log("error", "scheduler tick", { err: e.message }); } finally { busy = false; } }, 60_000);
  return () => clearInterval(t);
}
