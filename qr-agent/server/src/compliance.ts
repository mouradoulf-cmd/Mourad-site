/** Country rules are a CHECKLIST, not legal advice. Nothing sends automatically unless the owner enabled that country on purpose (settings.autoSend)
 *  and, even then, every guard below still has to pass. When a rule is unclear the safe answer is "do not send". */
export type Basis = "opt_out_b2b" | "restricted" | "opt_in";
export interface CountryRule { name: string; basis: Basis; lang: string; notes: string }

export const COUNTRY_RULES: Record<string, CountryRule> = {
  FR: { name: "France", basis: "opt_out_b2b", lang: "fr", notes: "Prospection B2B par email possible sans consentement préalable si le message concerne l'activité du destinataire, si l'adresse est professionnelle et publiée à cet effet, avec identité de l'expéditeur et désinscription simple (CNIL / CPCE L34-5). Entrepreneurs individuels : à traiter avec prudence." },
  IT: { name: "Italia", basis: "restricted", lang: "it", notes: "Règles strictes (Garante privacy, D.Lgs 196/2003 + RGPD). À faire valider avant tout envoi automatique." },
  BE: { name: "Belgique", basis: "restricted", lang: "fr", notes: "Code de droit économique : l'email marketing exige en principe un consentement ; des exceptions B2B existent mais sont encadrées. À valider." },
  CH: { name: "Suisse", basis: "restricted", lang: "fr", notes: "LCD art. 3 al.1 let. o : consentement et mention « liste Robinson » exigés pour l'email marketing de masse. À valider." },
  LU: { name: "Luxembourg", basis: "restricted", lang: "fr", notes: "Loi du 30 mai 2005 : consentement préalable en principe pour les emails de prospection. À valider." },
  DE: { name: "Deutschland", basis: "opt_in", lang: "de", notes: "UWG §7 : même en B2B, un email publicitaire non sollicité est en principe interdit sans accord préalable. BLOQUÉ par défaut." },
  ES: { name: "España", basis: "restricted", lang: "es", notes: "LSSI art. 21 : communications commerciales par email non sollicitées interdites sans consentement ou relation préalable. À valider." },
  GB: { name: "United Kingdom", basis: "opt_out_b2b", lang: "en", notes: "PECR : allowed to corporate subscribers (companies) with sender identity and opt-out; sole traders and some partnerships are treated as individuals (consent). Check each establishment's legal form." },
  NL: { name: "Nederland", basis: "opt_out_b2b", lang: "en", notes: "Telecommunicatiewet 11.7 : B2B toegestaan mits relevant voor de functie van de ontvanger en met opt-out. À valider." },
  US: { name: "United States", basis: "opt_out_b2b", lang: "en", notes: "CAN-SPAM : opt-out model — truthful headers, physical postal address, working unsubscribe honoured within 10 business days." },
  CA: { name: "Canada", basis: "restricted", lang: "en", notes: "CASL : consentement requis ; exception « publication manifeste » seulement sous conditions strictes. À valider." },
  AU: { name: "Australia", basis: "restricted", lang: "en", notes: "Spam Act 2003 : consentement requis ; consentement présumé possible si l'adresse est publiée sans mention contraire ET le message est pertinent. À valider." },
};
export const countryLang = (c: string) => COUNTRY_RULES[c.toUpperCase()]?.lang ?? "en";

export interface GateInput {
  prospect: { country: string; email: string | null; email_valid: boolean | null; email_source: string | null; status: string };
  suppressedEmail: boolean; suppressedDomain: boolean;
  autoSend: boolean; // owner enabled auto-send for this country
  senderAddressSet: boolean;
}
export interface Gate { ok: boolean; reasons: string[] }

/** Can this prospect be e-mailed at all (even after human approval)? */
export function contactGate(g: GateInput): Gate {
  const r: string[] = [];
  const p = g.prospect;
  if (!p.email) r.push("no_published_business_email");
  else if (p.email_valid === false) r.push("email_failed_verification");
  if (p.email && !p.email_source) r.push("email_source_unknown");
  if (g.suppressedEmail) r.push("suppressed_email");
  if (g.suppressedDomain) r.push("suppressed_domain");
  if (p.status === "do_not_contact" || p.status === "client_lost_refused") r.push("do_not_contact");
  const rule = COUNTRY_RULES[p.country.toUpperCase()];
  if (!rule) r.push("country_rule_unknown");
  else if (rule.basis === "opt_in") r.push("country_requires_opt_in");
  if (!g.senderAddressSet) r.push("sender_postal_address_missing");
  return { ok: r.length === 0, reasons: r };
}
/** May the system send WITHOUT a human click? Only if the owner enabled that country AND the country is not opt-in. */
export function autoSendAllowed(country: string, autoSend: Record<string, boolean>): boolean {
  const rule = COUNTRY_RULES[country.toUpperCase()];
  return !!rule && rule.basis !== "opt_in" && autoSend[country.toUpperCase()] === true;
}

const OPT_OUT = [
  /\bun-?subscribe\b/i, /\bremove me\b/i, /\bstop\b(?!.*(?:by|at))/i, /do not (?:contact|email|mail)/i, /don'?t (?:contact|email|mail)/i, /take me off/i, /no (?:more|further) (?:emails?|messages?)/i, /leave me alone/i,
  /d[ée]sinscri/i, /ne (?:plus )?(?:me )?contacter/i, /ne m'?[ée]crivez plus/i, /supprimez? (?:mon|mes|notre)/i, /retirez? (?:mon|notre) (?:adresse|email)/i, /arr[êe]tez (?:de )?(?:m'?[ée]crire|nous (?:contacter|écrire))/i,
  /non (?:contattarci|contattarmi|inviate|scrivete)/i, /cancellat?(?:e|i|a) (?:la |il )?(?:mia|nostra|mio|nostro)/i, /rimuov/i, /disiscri/i,
  /abmelden/i, /nicht mehr (?:kontaktieren|anschreiben|schreiben)/i, /keine (?:weiteren )?(?:e-?mails?|werbung|nachrichten)/i, /austragen/i,
  /darse de baja|d[ée]jen de (?:escribir|contactar)|no (?:me )?(?:contacten|escriban|env[ií]en)|eliminen? (?:mi|nuestro) (?:correo|email)/i,
  /afmelden|geen (?:mails?|berichten) meer|verwijder mijn/i, /cancel(?:ar)? (?:subscription|suscripci[óo]n)/i,
];
/** A refusal or opt-out request in any of the supported languages → immediate suppression. */
export function isOptOut(text: string): boolean { const t = text.slice(0, 4000); return OPT_OUT.some((r) => r.test(t)); }

const NOT_INTERESTED = [/not interested|no thank|no, thank|we are all set|already (?:have|use)/i, /pas int[ée]ress|non merci|nous avons d[ée]j[àa]|d[ée]j[àa] (?:un|une|en place)/i, /non (?:siamo )?interessat|abbiamo gi[àa]/i, /kein interesse|nicht interessiert|haben bereits/i, /no (?:estamos )?interesad|ya tenemos|no nos interesa/i];
const POSITIVE = [/interested|sounds good|tell me more|send (?:me )?(?:details|more)|let'?s talk|call me|yes please|love it/i, /int[ée]ress[ée]|pouvez-vous|envoyez-moi|parlons-en|appelez-moi|ça m'int[ée]resse|oui,? (?:volontiers|merci)/i, /interessat[oi]|mi interessa|mandatemi|parliamone|chiamatemi/i, /interessiert|schicken sie|erz[äa]hlen sie mehr|rufen sie|gerne/i, /me interesa|env[ií]enme|cu[ée]nteme m[áa]s|ll[áa]menme|hablemos/i];
const PRICE = [/\b(?:price|prices|pricing|cost|how much|quote|rates?)\b/i, /\b(?:prix|tarifs?|co[uû]t|combien|devis)\b/i, /\b(?:prezzo|prezzi|costo|quanto costa|preventivo)\b/i, /\b(?:preis|kosten|angebot|was kostet)\b/i, /\b(?:precio|precios|cu[áa]nto cuesta|presupuesto|tarifa)\b/i];
const AUTO = [/out of office|automatic reply|auto-?reply|vacation|on leave/i, /absent|r[ée]ponse automatique|cong[ée]s/i, /fuori ufficio|risposta automatica/i, /abwesend|automatische antwort|abwesenheitsnotiz/i, /fuera de la oficina|respuesta autom[áa]tica/i];
const DEMO = [/\b(?:demo|demonstration|preview|mock-?up)\b/i, /\b(?:d[ée]mo|d[ée]monstration|aper[çc]u|maquette)\b/i, /\b(?:dimostrazione|anteprima)\b/i, /\b(?:vorf[üu]hrung|vorschau)\b/i, /\b(?:demostraci[óo]n|muestra)\b/i];
export type Intent = "opt_out" | "not_interested" | "auto_reply" | "pricing" | "demo_request" | "interested" | "other";
/** Rule-based classifier (fallback when no AI key is configured). Opt-out ALWAYS wins and is never left to a model. */
export function classifyRules(subject: string, body: string): Intent {
  const t = `${subject}\n${body}`;
  if (isOptOut(t)) return "opt_out";
  if (AUTO.some((r) => r.test(t))) return "auto_reply";
  if (NOT_INTERESTED.some((r) => r.test(t))) return "not_interested";
  if (PRICE.some((r) => r.test(t))) return "pricing";
  if (DEMO.some((r) => r.test(t))) return "demo_request";
  if (POSITIVE.some((r) => r.test(t))) return "interested";
  return "other";
}
