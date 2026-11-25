import type { Db } from "./db/index.js";
import { getSettings } from "./settings.js";
import { today } from "./lib/util.js";
import { STATUS_LABEL, type Status } from "./crm.js";

const n = async (db: Db, sql: string, p: any[] = []) => Number((await db.query<{ n: string }>(sql, p)).rows[0]?.n ?? 0);
export async function getStats(db: Db) {
  const s = await getSettings(db);
  const discovered = await n(db, "SELECT count(*) n FROM prospects");
  const qualified = await n(db, "SELECT count(*) n FROM prospects WHERE score>=$1 AND email IS NOT NULL AND status NOT IN ('do_not_contact','not_contactable','client_lost')", [s.minScore]);
  const demos = await n(db, "SELECT count(*) n FROM demos");
  const sent = await n(db, "SELECT count(*) n FROM emails WHERE status='sent' AND kind IN ('outreach','followup')");
  const dry = await n(db, "SELECT count(*) n FROM emails WHERE status='dryrun'");
  const toValidate = await n(db, "SELECT count(*) n FROM emails WHERE status='draft'");
  const replies = await n(db, "SELECT count(*) n FROM inbound WHERE intent IS DISTINCT FROM 'auto_reply'");
  const interested = await n(db, "SELECT count(*) n FROM prospects WHERE status IN ('interested','quote_sent')");
  const won = await n(db, "SELECT count(*) n FROM prospects WHERE status='client_won'");
  const revenue = (await db.query<{ cur: string; t: string }>("SELECT currency cur, sum(amount) t FROM revenue GROUP BY currency")).rows;
  const byStatus = (await db.query<{ status: Status; n: string }>("SELECT status, count(*) n FROM prospects GROUP BY status")).rows.map((r) => ({ status: r.status, label: STATUS_LABEL[r.status] ?? r.status, n: Number(r.n) }));
  const byCountry = (await db.query<{ country: string; n: string }>("SELECT country, count(*) n FROM prospects GROUP BY country ORDER BY count(*) DESC")).rows.map((r) => ({ country: r.country, n: Number(r.n) }));
  const series = (await db.query<any>(`SELECT d::date AS day,
      (SELECT count(*) FROM prospects WHERE discovered_at::date=d::date) AS discovered,
      (SELECT count(*) FROM emails WHERE sent_at::date=d::date AND status IN ('sent','dryrun')) AS sent,
      (SELECT count(*) FROM inbound WHERE received_at::date=d::date) AS replies
    FROM generate_series(now()::date - interval '29 day', now()::date, interval '1 day') d ORDER BY d`)).rows.map((r) => ({ day: String(r.day).slice(0, 10), discovered: Number(r.discovered), sent: Number(r.sent), replies: Number(r.replies) }));
  return { discovered, qualified, demos, sent, dry, toValidate, replies, interested, won, revenue, byStatus, byCountry, series };
}
export interface Report { day: string; discovered: number; qualified: number; demos: number; sent: number; dry: number; replies: number; interested: number; actions: string[]; top: { id: string; name: string; city: string; country: string; score: number; status: string }[] }
export async function buildReport(db: Db, day = today("UTC")): Promise<{ data: Report; text: string }> {
  const s = await getSettings(db);
  const discovered = await n(db, "SELECT count(*) n FROM prospects WHERE discovered_at::date=$1::date", [day]);
  const qualified = await n(db, "SELECT count(*) n FROM prospects WHERE analyzed_at::date=$1::date AND score>=$2 AND email IS NOT NULL", [day, s.minScore]);
  const demos = await n(db, "SELECT count(*) n FROM demos WHERE created_at::date=$1::date", [day]);
  const sent = await n(db, "SELECT count(*) n FROM emails WHERE sent_at::date=$1::date AND status='sent'", [day]);
  const dry = await n(db, "SELECT count(*) n FROM emails WHERE sent_at::date=$1::date AND status='dryrun'", [day]);
  const replies = await n(db, "SELECT count(*) n FROM inbound WHERE received_at::date=$1::date AND intent IS DISTINCT FROM 'auto_reply'", [day]);
  const interested = await n(db, "SELECT count(DISTINCT prospect_id) n FROM inbound WHERE received_at::date=$1::date AND intent IN ('interested','pricing','demo_request')", [day]);
  const toValidate = await n(db, "SELECT count(*) n FROM emails WHERE status='draft'");
  const replyDrafts = await n(db, "SELECT count(*) n FROM emails WHERE status='draft' AND step>=10");
  const top = (await db.query<any>("SELECT id,name,city,country,score,status FROM prospects WHERE status IN ('interested','demo_ready','email_to_validate','replied','quote_sent') ORDER BY (status='interested') DESC, score DESC NULLS LAST LIMIT 5")).rows;
  const actions: string[] = [];
  if (replyDrafts) actions.push(`${replyDrafts} réponse(s) à des prospects à valider`);
  if (toValidate - replyDrafts > 0) actions.push(`${toValidate - replyDrafts} email(s) de prospection à valider`);
  if (interested) actions.push(`${interested} prospect(s) intéressé(s) à rappeler aujourd'hui`);
  if (!actions.length) actions.push("Rien d'urgent : le système continue la recherche et l'analyse.");
  const data: Report = { day, discovered, qualified, demos, sent, dry, replies, interested, actions, top };
  const text = [`Rapport du ${day}`, "", `Nouveaux restaurants trouvés : ${discovered}`, `Prospects qualifiés (score ≥ ${s.minScore}, email publié) : ${qualified}`, `Démonstrations générées : ${demos}`, `Emails envoyés : ${sent}${dry ? ` (+${dry} simulés, mode test)` : ""}`, `Réponses : ${replies}`, `Prospects intéressés : ${interested}`, "", "Actions à effectuer :", ...actions.map((a) => `  • ${a}`), "", "Opportunités prioritaires :", ...(top.length ? top.map((t: any) => `  • ${t.name} (${t.city}, ${t.country}) — score ${t.score ?? "?"} — ${STATUS_LABEL[t.status as Status] ?? t.status}`) : ["  (aucune pour l'instant)"])].join("\n");
  return { data, text };
}
