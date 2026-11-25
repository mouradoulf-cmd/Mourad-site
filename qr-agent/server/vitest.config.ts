import { defineConfig } from "vitest/config";
export default defineConfig({ test: { include: ["test/**/*.test.ts"], testTimeout: 30000, hookTimeout: 60000, pool: "forks", env: {
  ADMIN_EMAIL: "owner@test.dev", ADMIN_PASSWORD: "correct horse battery", SESSION_SECRET: "test-secret-test-secret-test-secret", SENDER_POSTAL_ADDRESS: "1 Test Street, Pattaya, Thailand", SENDER_NAME: "Mourad", SENDER_COMPANY: "NM Studio",
  PUBLIC_BASE_URL: "https://agent.test", INBOUND_WEBHOOK_SECRET: "whsec", EMAIL_PROVIDER: "dryrun", ENGINE_DIR: "/nonexistent", WEB_DIR: "/nonexistent", DISABLE_SCHEDULER: "true" } } });
