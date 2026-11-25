import crypto from "node:crypto";
const pw = process.argv[2]; if (!pw) { console.error("usage: node scripts-hash.mjs <password>"); process.exit(1); }
const salt = crypto.randomBytes(16); console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt.toString("hex")}:${crypto.scryptSync(pw, salt, 64).toString("hex")}`);
