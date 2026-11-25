import { z } from "zod";
import path from "node:path";

const bool = z.enum(["true", "false", "1", "0", ""]).optional().transform((v) => v === "true" || v === "1");
const Env = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(8787),
  PUBLIC_BASE_URL: z.string().default("http://localhost:8787"),
  DATABASE_URL: z.string().optional(), // empty → embedded PGlite (real Postgres engine) in DATA_DIR
  DATA_DIR: z.string().default(path.resolve(process.cwd(), "data")),
  ADMIN_EMAIL: z.string().default("owner@example.com"),
  ADMIN_PASSWORD: z.string().optional(), // dev only; production: ADMIN_PASSWORD_HASH
  ADMIN_PASSWORD_HASH: z.string().optional(), // "scrypt:<saltHex>:<hashHex>" from `npm run hash-password`
  SESSION_SECRET: z.string().default("dev-only-change-me-dev-only-change-me"),
  INBOUND_WEBHOOK_SECRET: z.string().default(""),
  // AI
  ANTHROPIC_API_KEY: z.string().optional(),
  AI_MODEL: z.string().default("claude-sonnet-5-5"),
  AI_BASE_URL: z.string().default("https://api.anthropic.com"),
  AI_DAILY_CALL_LIMIT: z.coerce.number().default(200),
  // prospect sources
  OVERPASS_URL: z.string().default("https://overpass-api.de/api/interpreter"),
  GOOGLE_PLACES_API_KEY: z.string().optional(),
  GOOGLE_PLACES_ENABLED: bool,
  BRAVE_SEARCH_API_KEY: z.string().optional(),
  // email
  EMAIL_PROVIDER: z.enum(["dryrun", "resend", "smtp"]).default("dryrun"),
  EMAIL_LIVE: bool, // real sending only when true AND a provider is configured
  EMAIL_FROM: z.string().default("QR Business <hello@example.com>"),
  REPLY_TO: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  SMTP_HOST: z.string().optional(), SMTP_PORT: z.coerce.number().default(587), SMTP_USER: z.string().optional(), SMTP_PASS: z.string().optional(), SMTP_SECURE: bool,
  IMAP_HOST: z.string().optional(), IMAP_PORT: z.coerce.number().default(993), IMAP_USER: z.string().optional(), IMAP_PASS: z.string().optional(),
  SENDER_NAME: z.string().default("Mourad"),
  SENDER_COMPANY: z.string().default("NM Studio"),
  SENDER_POSTAL_ADDRESS: z.string().default(""), // required by most B2B email rules: set it before enabling any live send
  USER_AGENT_CONTACT: z.string().default("mailto:hello@example.com"),
  DISABLE_SCHEDULER: bool,
  VERIFY_MX: z.enum(["true", "false"]).default("true").transform((v) => v === "true"), // "false" = DEV ONLY (sandboxes without DNS): skips the MX check
  ENGINE_DIR: z.string().default(path.resolve(process.cwd(), "engine")),
  WEB_DIR: z.string().default(path.resolve(process.cwd(), "../web/dist")),
});
export type Config = z.infer<typeof Env>;
export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config { return Env.parse(env); }
export const config: Config = loadConfig();
