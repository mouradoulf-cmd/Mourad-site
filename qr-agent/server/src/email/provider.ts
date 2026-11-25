import nodemailer from "nodemailer";
import { config } from "../config.js";

export interface OutMail { to: string; from: string; replyTo?: string; subject: string; text: string; headers?: Record<string, string>; idempotencyKey: string }
export interface Provider { id: string; live: boolean; send(m: OutMail): Promise<{ id: string }> }

export const dryrunSent: OutMail[] = []; // inspected by tests / shown in the dashboard when EMAIL_LIVE is off
const dryrun: Provider = { id: "dryrun", live: false, async send(m) { dryrunSent.push(m); return { id: "dryrun-" + m.idempotencyKey }; } };
const resend: Provider = {
  id: "resend", live: true,
  async send(m) {
    const res = await fetch("https://api.resend.com/emails", { method: "POST", headers: { authorization: `Bearer ${config.RESEND_API_KEY}`, "content-type": "application/json", "Idempotency-Key": m.idempotencyKey },
      body: JSON.stringify({ from: m.from, to: [m.to], reply_to: m.replyTo, subject: m.subject, text: m.text, headers: m.headers }), signal: AbortSignal.timeout(20000) });
    const j: any = await res.json().catch(() => ({})); if (!res.ok) { const e: any = new Error(`resend ${res.status} ${JSON.stringify(j).slice(0, 160)}`); e.permanent = res.status >= 400 && res.status < 500 && res.status !== 429; throw e; }
    return { id: j.id ?? "" };
  },
};
const smtp: Provider = {
  id: "smtp", live: true,
  async send(m) {
    const t = nodemailer.createTransport({ host: config.SMTP_HOST, port: config.SMTP_PORT, secure: config.SMTP_SECURE, auth: config.SMTP_USER ? { user: config.SMTP_USER, pass: config.SMTP_PASS } : undefined });
    const r = await t.sendMail({ from: m.from, to: m.to, replyTo: m.replyTo, subject: m.subject, text: m.text, headers: { ...m.headers, "X-Idempotency-Key": m.idempotencyKey } });
    return { id: r.messageId };
  },
};
export function providerStatus() {
  const id = config.EMAIL_PROVIDER;
  const keyOk = id === "resend" ? !!config.RESEND_API_KEY : id === "smtp" ? !!config.SMTP_HOST : true;
  const live = config.EMAIL_LIVE && id !== "dryrun" && keyOk && !!config.SENDER_POSTAL_ADDRESS;
  return { provider: id, keyOk, live, emailLiveFlag: config.EMAIL_LIVE, senderAddressSet: !!config.SENDER_POSTAL_ADDRESS };
}
/** Real sending requires: provider key + EMAIL_LIVE=true + a postal address in the footer. Otherwise everything goes to the dry-run sink (nothing leaves the machine). */
export function activeProvider(): Provider { return providerStatus().live ? (config.EMAIL_PROVIDER === "resend" ? resend : smtp) : dryrun; }
