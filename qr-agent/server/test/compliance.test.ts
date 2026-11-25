import { describe, it, expect } from "vitest";
import { contactGate, classifyRules, isOptOut, autoSendAllowed } from "../src/compliance.js";

const base = { prospect: { country: "FR", email: "info@x.fr", email_valid: true, email_source: "https://x.fr/contact", status: "analyzed" }, suppressedEmail: false, suppressedDomain: false, autoSend: false, senderAddressSet: true };
describe("contactGate", () => {
  it("passes a published, verified business email in an opt-out country", () => expect(contactGate(base).ok).toBe(true));
  it("refuses without an email, with an unverified one, without a source", () => {
    expect(contactGate({ ...base, prospect: { ...base.prospect, email: null } }).reasons).toContain("no_published_business_email");
    expect(contactGate({ ...base, prospect: { ...base.prospect, email_valid: false } }).reasons).toContain("email_failed_verification");
    expect(contactGate({ ...base, prospect: { ...base.prospect, email_source: null } }).reasons).toContain("email_source_unknown");
  });
  it("blocks opt-in countries (DE) and unknown countries", () => {
    expect(contactGate({ ...base, prospect: { ...base.prospect, country: "DE" } }).reasons).toContain("country_requires_opt_in");
    expect(contactGate({ ...base, prospect: { ...base.prospect, country: "ZZ" } }).reasons).toContain("country_rule_unknown");
  });
  it("blocks suppressed addresses/domains, do-not-contact and a missing postal address", () => {
    expect(contactGate({ ...base, suppressedEmail: true }).ok).toBe(false); expect(contactGate({ ...base, suppressedDomain: true }).ok).toBe(false);
    expect(contactGate({ ...base, prospect: { ...base.prospect, status: "do_not_contact" } }).ok).toBe(false); expect(contactGate({ ...base, senderAddressSet: false }).reasons).toContain("sender_postal_address_missing");
  });
  it("auto-send is never allowed for opt-in countries, and off unless enabled", () => {
    expect(autoSendAllowed("DE", { DE: true })).toBe(false); expect(autoSendAllowed("FR", {})).toBe(false); expect(autoSendAllowed("FR", { FR: true })).toBe(true);
  });
});
describe("opt-out + intent detection (multilingual)", () => {
  it.each([["Please unsubscribe me"], ["Merci de ne plus me contacter"], ["Désinscrivez-nous"], ["Non contattarci più"], ["Bitte nicht mehr kontaktieren"], ["Por favor, no me contacten"], ["stop"], ["REMOVE ME from your list"]])("detects opt-out: %s", (t) => expect(isOptOut(t)).toBe(true));
  it("does not flag normal replies", () => { expect(isOptOut("Hello, we would like to see the demo")).toBe(false); expect(isOptOut("Bonjour, ça m'intéresse, pouvez-vous m'appeler ?")).toBe(false); });
  it("classifies", () => {
    expect(classifyRules("Re: menu", "How much does it cost?")).toBe("pricing"); expect(classifyRules("Re", "Quel est le prix ?")).toBe("pricing");
    expect(classifyRules("Re", "Sounds good, tell me more")).toBe("interested"); expect(classifyRules("Re", "Not interested, thanks")).toBe("not_interested");
    expect(classifyRules("Automatic reply", "I am out of office")).toBe("auto_reply"); expect(classifyRules("Re", "Please stop emailing me")).toBe("opt_out");
  });
  it("opt-out always wins over a positive phrase", () => expect(classifyRules("Re", "Interesting but please unsubscribe me, thanks")).toBe("opt_out"));
});
