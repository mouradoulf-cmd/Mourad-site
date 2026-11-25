// Copies the menu engine (menus/assets) next to the server so the app is self-contained when deployed alone.
import fs from "node:fs"; import path from "node:path"; import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.resolve(root, "../menus/assets"), dst = path.join(root, "server/engine");
if (!fs.existsSync(src)) { console.error("menus/assets not found next to qr-agent/"); process.exit(1); }
fs.rmSync(dst, { recursive: true, force: true }); fs.mkdirSync(dst, { recursive: true });
for (const f of fs.readdirSync(src)) { if (f === "dishes") continue; fs.cpSync(path.join(src, f), path.join(dst, f), { recursive: true }); }
console.log("engine synced →", dst);
