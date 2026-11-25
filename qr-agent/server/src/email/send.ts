import type { Db } from "../db/index.js";
import { config } from "../config.js";
import { activeProvider } from "./provider.js";
import { contactGate, autoSendAllowed } from "../compliance.js";
import { isSuppressed } from "../prospects/service.js";
import { getSettings } from "../settings.js";
import { event, setStatus } from "../crm.js";
import { unsubUrl } from "./compose.js";
import { today } from "../lib/util.js";

const COUNTRY_TZ: Record<string, string> = { FR: "Europe/Paris", IT: "Europe/Rome", BE: "Europe/Brussels", CH: "Europe/Zurich", LU: "Europe/Luxembourg", DE: "Europe/Berlin", ES: "Europe/Madrid", GB: "Europe/London", NL: "Europe/Amsterdam", US: "America/New_York", CA: "America/Toronto", AU: "Australia/Sydney" };
/** Business-hours check in the RECIPIENT's local time (Mon–Fri, within the configured window). */
export function inSendWindow(country: string, win: { from: string; to: string }, now = new Date()): boolean {
  const tz = COUNTRY_TZ[country.toUpperCase()] ?? "UTC";
  const f = new Intl.DateTimeFormat("en-GB", { timeZone: tz, weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(now);
  const wd = f.find((p) => p.type === "weekday")!.value; const hm = `${f.find((p) => p.type === "hour")!.value}:${f.find((p) => p.type === "minute")!.value}`;
  return !["Sat", "Sun"].includes(wd) && hm >= win.from && hm <= win.to;
}

export interface SendReport { sent: number; dryrun: number; blocked: number; failed: number; deferred: number; capped: boolean }
/** Sends approved emails. Safe against duplicated runs: a row is CLAIMED with a conditional UPDATE (approved→sending) before anything leaves; the provider call carries the row's idempotency key. */
export async function sendDue(db: Db, now = new Date(), opts: { ignoreWindow?: boolean } = {}): Promise<SendReport> {
  const rep: SendReport = { sent: 0, dryrun: 0, blocked: 0, failed: 0, deferred: 0, capped: false };
  const s = await getSettings(db); const prov = activeProvider();
  const used = (await db.query<{ n: string }>("SELECT count(*) n FROM emails WHERE status IN ('sent','dryrun','sending') AND sent_at::date = $1::date OR (status='sending' AND created_at::date=$1::date)", [today("UTC", now)])).rows[0]!.n;
  let remaining = Math.max(0, s.limits.emailsPerDay - Number(used)); if (remaining === 0) { rep.capped = true; return rep; }
  const due = (await db.query<any>("SELECT e.id FROM emails e WHERE e.status='approved' AND (e.scheduled_at IS NULL OR e.scheduled_at<=$1) ORDER BY e.created_at LIMIT 100", [now.toISOString()])).rows;
  for (const d of due) {
    if (remaining <= 0) { rep.capped = true; break; }
    const claimed = (await db.query<any>("UPDATE emails SET status='sending', attempts=attempts+1 WHERE id=$1 AND status='approved' RETURNING *", [d.id])).rows[0];
    if (!claimed) continue; // someone else (or a duplicated task) already took it
    const p = (await db.query<any>("SELECT * FROM prospects WHERE id=$1", [claimed.prospect_id])).rows[0];
    const sup = await isSuppressed(db.query, p?.email ?? claimed.to_email);
    const gate = p ? contactGate({ prospect: p, suppressedEmail: sup.email, suppressedDomain: sup.domain, autoSend: autoSendAllowed(p.country, s.autoSend), senderAddressSet: !!config.SENDER_POSTAL_ADDRESS }) : { ok: false, reasons: ["prospect_missing"] };
    if (!gate.ok) { await db.query("UPDATE emails SET status='blocked', error=$2 WHERE id=$1", [claimed.id, gate.reasons.join(",")]); rep.blocked++; await event(db.query, claimed.prospect_id, "email_blocked", { reasons: gate.reasons }); continue; }
    if (p.email?.toLowerCase() !== claimed.to_email.toLowerCase()) { await db.query("UPDATE emails SET status='blocked', error='recipient_changed' WHERE id=$1", [claimed.id]); rep.blocked++; continue; }
    if (!opts.ignoreWindow && !inSendWindow(p.country, s.sendWindow, now)) { await db.query("UPDATE emails SET status='approved', attempts=attempts-1 WHERE id=$1", [claimed.id]); rep.deferred++; continue; }
    try {
      const res = await prov.send({ to: claimed.to_email, from: config.EMAIL_FROM, replyTo: config.REPLY_TO, subject: claimed.subject, text: claimed.body_text, idempotencyKey: claimed.idempotency_key,
        headers: { "List-Unsubscribe": `<${unsubUrl(claimed.unsub_token)}>, <mailto:${(config.REPLY_TO ?? config.EMAIL_FROM).replace(/^.*<|>.*$/g, "")}?subject=unsubscribe>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } });
      await db.query("UPDATE emails SET status=$2, sent_at=$3, provider=$4, provider_id=$5, error=NULL WHERE id=$1", [claimed.id, prov.live ? "sent" : "dryrun", now.toISOString(), prov.id, res.id]);
      await event(db.query, claimed.prospect_id, prov.live ? "email_sent" : "email_dryrun", { step: claimed.step, provider: prov.id });
      if (prov.live && claimed.kind !== "reply") await setStatus(db, claimed.prospect_id, "email_sent", { why: "email sent" });
      prov.live ? rep.sent++ : rep.dryrun++; remaining--;
    } catch (e: any) {
      const give = e?.permanent || claimed.attempts >= 3;
      await db.query("UPDATE emails SET status=$2, error=$3 WHERE id=$1", [claimed.id, give ? "failed" : "approved", String(e?.message ?? e).slice(0, 300)]);
      if (give) rep.failed++; else rep.deferred++;
    }
  }
  return rep;
}
export async function approveEmail(db: Db, id: string, edits?: { subject?: string; body_text?: string }) {
  const r = (await db.query<any>("SELECT status FROM emails WHERE id=$1", [id])).rows[0]; if (!r) return { ok: false, error: "not_found" };
  if (r.status !== "draft") return { ok: false, error: `status_is_${r.status}` };
  if (edits?.subject || edits?.body_text) await db.query("UPDATE emails SET subject=COALESCE($2,subject), body_text=COALESCE($3,body_text) WHERE id=$1", [id, edits.subject ?? null, edits.body_text ?? null]);
  await db.query("UPDATE emails SET status='approved', approved_at=now(), scheduled_at=now() WHERE id=$1 AND status='draft'", [id]);
  return { ok: true };
}
