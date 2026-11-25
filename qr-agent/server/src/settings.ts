import type { Db } from "./db/index.js";

export interface Target { country: string; city: string; types?: string[] }
export interface Settings {
  tz: string;
  minScore: number; // below this score no demo / email is prepared
  limits: { discoverPerDay: number; analyzePerRun: number; demosPerDay: number; emailsPerDay: number; draftsPerRun: number };
  schedule: { time: string; job: string; enabled: boolean }[];
  targets: Target[];
  /** Human validation first. Auto-send is OFF everywhere until the owner enables it country by country after checking the local rules. */
  requireApproval: boolean;
  autoSend: Record<string, boolean>;
  followups: { enabled: boolean; afterDays: number[] };
  demo: { expiresDays: number };
  reportEmail: boolean;
  sendWindow: { from: string; to: string }; // local hour window in the RECIPIENT country is approximated by tz below
  agent: { tone: string; offer: string; extraRules: string };
  pricing: { setup: number; monthly: number; currency: string };
}
export const DEFAULT_SETTINGS: Settings = {
  tz: "Asia/Bangkok",
  minScore: 50,
  limits: { discoverPerDay: 30, analyzePerRun: 40, demosPerDay: 15, emailsPerDay: 10, draftsPerRun: 20 },
  schedule: [
    { time: "08:00", job: "discover", enabled: true },
    { time: "09:00", job: "analyze", enabled: true },
    { time: "10:00", job: "verify", enabled: true },
    { time: "11:00", job: "demos", enabled: true },
    { time: "12:00", job: "drafts", enabled: true },
    { time: "13:00", job: "send", enabled: true },
    { time: "15:00", job: "inbound", enabled: true },
    { time: "17:00", job: "followups", enabled: true },
    { time: "18:00", job: "report", enabled: true },
  ],
  targets: [
    { country: "FR", city: "Lyon" }, { country: "FR", city: "Nice" }, { country: "IT", city: "Roma" }, { country: "IT", city: "Firenze" },
    { country: "BE", city: "Bruxelles" }, { country: "CH", city: "Genève" }, { country: "LU", city: "Luxembourg" }, { country: "ES", city: "Barcelona" },
    { country: "GB", city: "Edinburgh" }, { country: "NL", city: "Amsterdam" }, { country: "AU", city: "Sydney" }, { country: "CA", city: "Montréal" }, { country: "US", city: "Austin" },
  ],
  requireApproval: true,
  autoSend: {},
  followups: { enabled: true, afterDays: [5, 12] },
  demo: { expiresDays: 14 },
  reportEmail: false,
  sendWindow: { from: "08:00", to: "19:00" },
  agent: {
    tone: "humain, professionnel, court, sans pression",
    offer: "menus QR premium multilingues (design haut de gamme, photos, allergènes, panier) — essai gratuit d'un mois",
    extraRules: "",
  },
  pricing: { setup: 0, monthly: 390, currency: "THB" },
};

export async function getSettings(db: Db): Promise<Settings> {
  const { rows } = await db.query<{ key: string; value: any }>("SELECT key, value FROM settings");
  const o: any = structuredClone(DEFAULT_SETTINGS);
  for (const r of rows) o[r.key] = Array.isArray(r.value) || typeof r.value !== "object" ? r.value : { ...(o[r.key] ?? {}), ...r.value };
  return o as Settings;
}
export async function saveSettings(db: Db, patch: Partial<Settings>) {
  for (const [k, v] of Object.entries(patch)) await db.query("INSERT INTO settings(key,value,updated_at) VALUES($1,$2::jsonb,now()) ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value, updated_at=now()", [k, JSON.stringify(v)]);
}
