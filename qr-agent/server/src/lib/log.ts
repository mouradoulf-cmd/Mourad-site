type L = "debug" | "info" | "warn" | "error";
export function log(level: L, msg: string, data?: Record<string, unknown>) {
  const line = JSON.stringify({ t: new Date().toISOString(), level, msg, ...data });
  (level === "error" ? console.error : console.log)(line);
}
