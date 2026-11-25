import type { Db } from "./db/index.js";
export const STATUSES = ["new", "analyzed", "demo_ready", "email_to_validate", "email_sent", "replied", "interested", "quote_sent", "client_won", "client_lost", "do_not_contact", "not_contactable"] as const;
export type Status = (typeof STATUSES)[number];
export const STATUS_LABEL: Record<Status, string> = {
  new: "Nouveau prospect", analyzed: "Analysé", demo_ready: "Démonstration préparée", email_to_validate: "Email à valider", email_sent: "Email envoyé",
  replied: "Réponse reçue", interested: "Intéressé", quote_sent: "Devis envoyé", client_won: "Client gagné", client_lost: "Client perdu", do_not_contact: "Ne plus contacter", not_contactable: "Non contactable",
};
const RANK: Record<string, number> = Object.fromEntries(["new", "analyzed", "demo_ready", "email_to_validate", "email_sent", "replied", "interested", "quote_sent", "client_won"].map((s, i) => [s, i]));
const TERMINAL = new Set(["client_won", "client_lost", "do_not_contact"]);

export async function event(db: Db["query"], prospectId: string | null, type: string, data: Record<string, unknown> = {}) {
  await db("INSERT INTO events(prospect_id,type,data) VALUES($1,$2,$3::jsonb)", [prospectId, type, JSON.stringify(data)]);
}
/** Move forward only (never back down the funnel by accident) unless forced; do_not_contact always wins. */
export async function setStatus(db: Db, id: string, next: Status, opts: { force?: boolean; why?: string } = {}) {
  const { rows } = await db.query<{ status: string }>("SELECT status FROM prospects WHERE id=$1", [id]);
  const cur = rows[0]?.status; if (!cur) return false;
  if (cur === next) return true;
  if (cur === "do_not_contact" && next !== "do_not_contact" && !opts.force) return false;
  if (!opts.force && next !== "do_not_contact" && next !== "client_lost" && next !== "not_contactable") {
    if (TERMINAL.has(cur)) return false;
    if ((RANK[next] ?? -1) < (RANK[cur] ?? -1)) return false;
  }
  await db.query("UPDATE prospects SET status=$2, updated_at=now() WHERE id=$1", [id, next]);
  await event(db.query, id, "status", { from: cur, to: next, why: opts.why });
  return true;
}
