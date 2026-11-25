/** Deterministic multilingual templates (used when no AI key is configured, and as the safe baseline). Plain, short, human; always identify the sender,
 *  state that the demo is an UNOFFICIAL prototype, and give a one-click way out. */
export type Lang = "fr" | "it" | "en" | "de" | "es";
export const LANGS: Lang[] = ["fr", "it", "en", "de", "es"];
export interface Vars { restaurant: string; observation: string; demoUrl: string; sender: string; company: string; step: number }

type T = { subject: (v: Vars) => string; body: (v: Vars) => string; follow: (v: Vars) => string; follow2: (v: Vars) => string };
export const TEMPLATES: Record<Lang, T> = {
  fr: {
    subject: (v) => `Une version « menu QR » de la carte de ${v.restaurant}`,
    body: (v) => `Bonjour,\n\n${v.observation}\n\nJe propose aux restaurants des menus QR multilingues (photos, allergènes, panier) qui s'ouvrent dans le navigateur, sans application. J'ai préparé pour ${v.restaurant} un prototype NON OFFICIEL, uniquement pour vous montrer ce que cela pourrait donner — les plats et prix qui y figurent restent à confirmer par vous :\n${v.demoUrl}\n\nSi cela vous intéresse, répondez simplement à ce message : l'essai est gratuit pendant un mois. Sinon, aucun souci.\n\nCordialement,\n${v.sender} — ${v.company}`,
    follow: (v) => `Bonjour,\n\nJe me permets un court rappel au sujet du prototype de menu QR préparé pour ${v.restaurant} (non officiel, à titre d'exemple) :\n${v.demoUrl}\n\nSi ce n'est pas le bon moment, vous pouvez ignorer ce message — je ne vous relancerai plus.\n\nCordialement,\n${v.sender} — ${v.company}`,
    follow2: (v) => `Bonjour,\n\nDernier message de ma part : le lien du prototype pour ${v.restaurant} expirera bientôt (${v.demoUrl}). Si vous souhaitez en discuter, répondez-moi ; sinon je clos le sujet.\n\nCordialement,\n${v.sender} — ${v.company}`,
  },
  it: {
    subject: (v) => `Una versione « menu QR » del menu di ${v.restaurant}`,
    body: (v) => `Buongiorno,\n\n${v.observation}\n\nPropongo ai ristoranti menu QR multilingue (foto, allergeni, ordine al tavolo) che si aprono nel browser, senza app. Per ${v.restaurant} ho preparato un prototipo NON UFFICIALE, solo per mostrarvi un esempio — piatti e prezzi indicati sono da confermare da parte vostra:\n${v.demoUrl}\n\nSe vi interessa, rispondete semplicemente a questo messaggio: la prova è gratuita per un mese. In caso contrario, nessun problema.\n\nCordiali saluti,\n${v.sender} — ${v.company}`,
    follow: (v) => `Buongiorno,\n\nun breve promemoria sul prototipo di menu QR preparato per ${v.restaurant} (non ufficiale, a titolo di esempio):\n${v.demoUrl}\n\nSe non è il momento giusto, ignorate pure questo messaggio — non vi scriverò più.\n\nCordiali saluti,\n${v.sender} — ${v.company}`,
    follow2: (v) => `Buongiorno,\n\nultimo messaggio da parte mia: il link del prototipo per ${v.restaurant} scadrà a breve (${v.demoUrl}). Se volete parlarne, rispondetemi; altrimenti chiudo qui.\n\nCordiali saluti,\n${v.sender} — ${v.company}`,
  },
  en: {
    subject: (v) => `A QR-menu version of ${v.restaurant}'s menu`,
    body: (v) => `Hello,\n\n${v.observation}\n\nI build multilingual QR menus for restaurants (photos, allergens, ordering list) that open in the browser — no app. I prepared an UNOFFICIAL prototype for ${v.restaurant}, only to show what it could look like; any dishes and prices in it are placeholders for you to confirm:\n${v.demoUrl}\n\nIf you're interested, just reply to this email — the first month is a free trial. If not, no problem at all.\n\nBest regards,\n${v.sender} — ${v.company}`,
    follow: (v) => `Hello,\n\nA short reminder about the unofficial QR-menu prototype prepared for ${v.restaurant}:\n${v.demoUrl}\n\nIf the timing isn't right, feel free to ignore this — I won't follow up again after the next message.\n\nBest regards,\n${v.sender} — ${v.company}`,
    follow2: (v) => `Hello,\n\nMy last message: the prototype link for ${v.restaurant} will expire soon (${v.demoUrl}). If you'd like to talk, reply here; otherwise I'll close the topic.\n\nBest regards,\n${v.sender} — ${v.company}`,
  },
  de: {
    subject: (v) => `Eine QR-Menü-Version der Speisekarte von ${v.restaurant}`,
    body: (v) => `Guten Tag,\n\n${v.observation}\n\nIch erstelle mehrsprachige QR-Menüs für Restaurants (Fotos, Allergene, Bestellliste), die ohne App im Browser laufen. Für ${v.restaurant} habe ich einen INOFFIZIELLEN Prototyp erstellt, nur als Beispiel — enthaltene Gerichte und Preise sind Platzhalter und von Ihnen zu bestätigen:\n${v.demoUrl}\n\nBei Interesse antworten Sie einfach auf diese E-Mail: Der erste Monat ist ein kostenloser Test. Falls nicht, ist das völlig in Ordnung.\n\nFreundliche Grüße\n${v.sender} — ${v.company}`,
    follow: (v) => `Guten Tag,\n\nkurze Erinnerung an den inoffiziellen QR-Menü-Prototyp für ${v.restaurant}:\n${v.demoUrl}\n\nWenn der Zeitpunkt nicht passt, ignorieren Sie diese Nachricht bitte.\n\nFreundliche Grüße\n${v.sender} — ${v.company}`,
    follow2: (v) => `Guten Tag,\n\nmeine letzte Nachricht: Der Prototyp-Link für ${v.restaurant} läuft bald ab (${v.demoUrl}). Wenn Sie sprechen möchten, antworten Sie mir; sonst schließe ich das Thema.\n\nFreundliche Grüße\n${v.sender} — ${v.company}`,
  },
  es: {
    subject: (v) => `Una versión « menú QR » de la carta de ${v.restaurant}`,
    body: (v) => `Hola,\n\n${v.observation}\n\nCreo menús QR multilingües para restaurantes (fotos, alérgenos, lista de pedido) que se abren en el navegador, sin aplicación. He preparado un prototipo NO OFICIAL para ${v.restaurant}, solo como ejemplo — los platos y precios que aparecen son marcadores que deberían confirmar ustedes:\n${v.demoUrl}\n\nSi les interesa, respondan a este mensaje: el primer mes es una prueba gratuita. Si no, ningún problema.\n\nUn saludo,\n${v.sender} — ${v.company}`,
    follow: (v) => `Hola,\n\nUn breve recordatorio sobre el prototipo no oficial de menú QR preparado para ${v.restaurant}:\n${v.demoUrl}\n\nSi no es buen momento, pueden ignorar este mensaje.\n\nUn saludo,\n${v.sender} — ${v.company}`,
    follow2: (v) => `Hola,\n\nMi último mensaje: el enlace del prototipo para ${v.restaurant} caducará pronto (${v.demoUrl}). Si desean hablar, respondan aquí; si no, cierro el tema.\n\nUn saludo,\n${v.sender} — ${v.company}`,
  },
};
export const FOOTER: Record<Lang, (o: { company: string; address: string; unsubUrl: string }) => string> = {
  fr: (o) => `\n--\n${o.company} · ${o.address}\nVous ne souhaitez plus recevoir de messages de ma part ? Un clic : ${o.unsubUrl} (ou répondez « stop »).`,
  it: (o) => `\n--\n${o.company} · ${o.address}\nNon volete più ricevere messaggi? Un clic: ${o.unsubUrl} (o rispondete « stop »).`,
  en: (o) => `\n--\n${o.company} · ${o.address}\nDon't want to hear from me again? One click: ${o.unsubUrl} (or reply "stop").`,
  de: (o) => `\n--\n${o.company} · ${o.address}\nKeine weiteren Nachrichten mehr? Ein Klick: ${o.unsubUrl} (oder antworten Sie „stop“).`,
  es: (o) => `\n--\n${o.company} · ${o.address}\n¿No desean recibir más mensajes? Un clic: ${o.unsubUrl} (o respondan « stop »).`,
};
export const normLang = (l: string): Lang => (LANGS.includes(l as Lang) ? (l as Lang) : "en");
