/* NM Studio — translations.
   The HTML ships in English (for no-JS visitors and search engines); this
   file swaps every [data-i18n], [data-i18n-html], [data-i18n-placeholder]
   and [data-i18n-aria-label] node instantly on language change. */
(function () {
  "use strict";

  var DICT = {
    en: {
      meta: {
        title: "NM Studio — Websites & QR menus for restaurants and local businesses",
        description: "NM Studio designs fast, beautiful websites and QR menus for restaurants, salons, spas and local businesses. Send your photos — you're live in days. No contract."
      },
      a11y: { skip: "Skip to content", language: "Language", menu: "Menu", whatsapp: "Message us on WhatsApp" },
      nav: { work: "Work", process: "Process", pricing: "Pricing", faq: "FAQ", cta: "Start a project" },
      hero: {
        eyebrow: "Web studio for restaurants & local businesses",
        title: "Websites that bring customers <em>to your door.</em>",
        sub: "Send us your photos. We design your website and QR menu in your customers' languages — and you're live in days.",
        ctaPrimary: "Start your project",
        ctaSecondary: "See our work",
        chipLive: "Live in days",
        chipQr: "QR menu included"
      },
      audience: {
        i1: "Restaurants", i2: "Cafés", i3: "Hair salons", i4: "Spas & massage", i5: "Bars", i6: "Street food", i7: "Local companies",
        sr: "We work with restaurants, cafés, hair salons, spas and massage salons, bars, street food vendors and local companies."
      },
      why: {
        eyebrow: "Why it matters",
        manifesto: "Your next customers are already searching. <em>We make sure they find you — and choose you.</em>",
        r1t: "Found on Google & Maps",
        r1b: "Travellers choose where to eat and unwind before they even land. With a real website, they find you — not the place next door.",
        r2t: "A first impression that earns trust",
        r2b: "A beautiful site shows you take your business seriously. It reassures new customers far more than a social media page on its own.",
        r3t: "A menu that's always up to date",
        r3b: "One QR code on the table, always current. Change a price or a dish in minutes — no reprinting, ever again."
      },
      diff: {"eyebrow": "The difference", "title": "Same place. <em>Two very different first impressions.</em>", "query": "Italian restaurant near me", "you": "Your restaurant", "meta": "Restaurant · 0.2 km", "directions": "Directions", "call": "Call", "noSite": "No website", "noMenu": "No menu · no prices · no photos of the dishes", "keepScrolling": "They keep scrolling…", "book": "Book a table", "badBadge": "Customer lost", "goodBadge": "New customer", "s1t": "They search", "s1b": "New city, phone in hand: “Italian restaurant near me”. Dozens of pins appear — yours is one of them.", "s2t": "Without a website", "s2b": "A pin, a few blurry photos, no menu, no prices. They can't tell if it's right for them — so they move on to the next one.", "s3t": "With NM Studio", "s3b": "Your photos, your menu in their language, directions and booking in one tap. They choose you — before they've even arrived."},
      tryit: {"eyebrow": "Try it now", "title": "Don't take our word for it. <em>Scan it.</em>", "body": "Take out your phone and point the camera at the code. That's a real QR menu we built — exactly what your customers see at the table.", "open": "Open the live menu", "qrAlt": "QR code that opens Giulivo's live QR menu", "caption": "Giulivo · live QR menu"},
      work: {
        eyebrow: "Selected work",
        title: "Real sites. <em>Live right now.</em>",
        lead: "Each one is built around the business — its photos, its customers, its languages. Open any of them: they're all online.",
        realClient: "Real client", concept: "Concept", visit: "Visit live site", cursor: "Visit",
        p1cat: "Restaurant · Tuscany",
        p1desc: "A warm, photo-led site for a family trattoria: the full menu, reservations, and a QR menu on every table — in Italian, English, German and Thai.",
        p2cat: "Massage & spa · Pattaya",
        p2desc: "A premium spa site with real photography: treatments priced live by duration, a “how do you feel?” recommender, a gift-card builder and WhatsApp booking — in four languages.",
        p3cat: "Hair salon · Bangkok",
        p3desc: "A fashion-magazine feel for a hair and beauty studio: a clear price list, client reviews and one-tap booking on WhatsApp.",
        p4cat: "B2B supplier · France",
        p4desc: "A confident corporate site for a cladding supplier: a video hero, services, partner brands, projects and quote requests.",
        tMulti: "4 languages", tQr: "QR menu", tBooking: "Online booking", tTreat: "Treatment picker", tMobile: "Mobile-first",
        tPrices: "Price list", tReviews: "Reviews", tWhatsapp: "WhatsApp booking", tVideo: "Video hero", tProjects: "Projects", tQuote: "Quote requests",
        p5cat: "Bar & nightlife · Pattaya", p5desc: "A neon-lit site for a pool bar: tonight's event and a live happy-hour countdown, the drinks menu, pool nights and table booking on WhatsApp — in four languages.", tLive: "Live happy hour", tEvents: "Weekly events",
        p6cat: "Street food · Pattaya", p6desc: "A lively, simple site for a street kitchen: a filterable menu, a takeaway bag sent to WhatsApp, a spice meter, tonight's chalkboard special and phrase cards to show the cook.", tOrder: "Takeaway ordering", tSpice: "Spice meter", p7cat: "Scooter rental · Pattaya", p7desc: "A premium rental site: fleet with day, week and month prices, a range calendar with live pricing and extras, hotel delivery and requests on WhatsApp.", tFleet: "Fleet & prices", tCalendar: "Booking calendar",
        soon: "Coming soon", soonList: "Hotels · Real estate"
      },
      process: {
        v3toastT: "New booking",
        v3toastB: "Table for 4 · tonight 20:00",
        v1online: "online",
        v1hello: "Hi! Send us your photos and menu 👋",
        v3live: "Live",
        v3google: "On Google Maps",
        v3qr: "QR menu",
        v3dir: "Directions",
        s1d: "Day 1",
        s1l1: "A 10-minute chat, no forms",
        s1l2: "Photos straight from your phone",
        s1l3: "Your menu, even handwritten",
        s2d: "Days 2–4",
        s2l1: "Custom design, never a template",
        s2l2: "Texts written in every language",
        s2l3: "You review it before it goes live",
        s3d: "Launch",
        s3l1: "Hosting and domain handled",
        s3l2: "QR codes ready to print",
        s3l3: "Unlimited edits, on WhatsApp",
        eyebrow: "How it works",
        title: "From your photos to a live site, <em>in days.</em>",
        lead: "No meetings to prepare, no technical jargon. You run your business — we take care of everything else.",
        s1t: "Send your photos", s1b: "Photos, menu, opening hours — straight from WhatsApp. That's all we need to start.",
        s2t: "We design your site", s2b: "Design, copy, QR menu, Google Maps and every language your customers speak — done for you.",
        s3t: "You're live", s3b: "Your site goes online in days. Want to change something later? Just send a message — edits are unlimited."
      },
      pricing: {
        eyebrow: "Pricing",
        title: "Simple plans. <em>No surprises.</em>",
        lead: "Every plan includes a QR menu. Start small and upgrade whenever your business is ready.",
        setup: "one-time setup", monthly: "per month", popular: "Most popular",
        note: "No contract, no hidden fees. Cancel anytime, free of charge.",
        basic: { title: "Basic", tagline: "Your menu, one scan away.", f1: "QR code menu, always up to date", f2: "Unlimited menu edits", f3: "Works on any phone — no app needed", cta: "Choose Basic", demo: "See a real QR menu →" },
        pro: { title: "Pro", tagline: "Your own website, done for you.", f1: "Everything in Basic", f2: "A custom website built from your photos", f3: "Multilingual, with Google Maps & WhatsApp", f4: "Live in days, not months", cta: "Choose Pro" },
        elite: { title: "Elite", tagline: "The complete package, zero effort.", f1: "Everything in Pro", f2: "Social media set up & managed", f3: "Priority support", cta: "Choose Elite" }
      },
      faq: {
        eyebrow: "Questions",
        title: "Everything you <em>want to know.</em>",
        lead: "Still unsure about something? Ask us directly — we usually reply within minutes.",
        ask: "Ask on WhatsApp",
        q1: "I'm not good with technology — is that a problem?", a1: "Not at all. You send us your photos and we take care of everything else — design, text, hosting and updates.",
        q2: "How long until my site is online?", a2: "A few days after we receive your photos and information — not weeks.",
        q3: "Can I change my photos or menu later?", a3: "Yes. Edits are unlimited and free — just send us a message whenever something changes.",
        q4: "How does the QR menu work?", a4: "Your customers scan the code with their phone camera — no app needed — and instantly see your latest menu.",
        q5: "I already have Instagram. Why do I need a website?", a5: "Instagram depends on an algorithm you don't control. A website is your own storefront: it shows up on Google, it's open 24/7, and it belongs to you.",
        q6: "Is the website really mine?", a6: "Yes — your name, your photos, your content. We build it for your business, not for us.",
        q7: "What if I want to stop?", a7: "There's no commitment. You can cancel anytime, free of charge.",
        q8: "Have you worked with businesses like mine?", a8: "Yes — restaurants, salons, spas and companies.", a8link: "See the live sites →"
      },
      finale: {
        orbit: "START A PROJECT · START A PROJECT · ",
        eyebrow: "Let's talk",
        title: "Your next customer is searching <em>right now.</em>",
        sub: "Tell us about your business. We'll come and meet you, show you what your site could look like, and get it online in days.",
        book: "Book a meeting", whatsapp: "Message us on WhatsApp"
      },
      footer: {
        local: "Pattaya, Thailand",
        tagline: "Websites and QR menus for restaurants and local businesses.",
        explore: "Explore", contact: "Contact", book: "Book a meeting", language: "Language",
        rights: "© 2026 NM Studio. Built to get you found.", backTop: "Back to top"
      },
      booking: {
        eyebrow: "Book a meeting", title: "Let's meet in person",
        lead: "Tell us where and when. We'll come to you and talk it through — no obligation.",
        business: "Business name", businessPh: "e.g. Giulivo", phone: "Phone number", date: "Preferred date", time: "Preferred time",
        submit: "Send on WhatsApp", close: "Close",
        hint: "Your message is copied automatically — just paste it into the WhatsApp chat that opens.",
        required: "Please fill in this field.", pastDate: "Please choose today or a later date.",
        toast: "Message copied — paste it into WhatsApp to send.",
        waMessage: "Hi! I'd like to book a meeting.\nBusiness: {business}\nPhone: {phone}\nPreferred date: {date} at {time}"
      }
    },

    fr: {
      meta: {
        title: "NM Studio — Sites web et menus QR pour restaurants et commerces",
        description: "Sites web, menus QR et fiches Google pour les commerces de Pattaya. Envoyez vos photos, on s'occupe de tout : en ligne en quelques jours, sans contrat."
      },
      a11y: { skip: "Aller au contenu", language: "Langue", menu: "Menu", whatsapp: "Nous écrire sur WhatsApp" },
      nav: { work: "Réalisations", process: "Méthode", pricing: "Tarifs", faq: "FAQ", cta: "Lancer mon projet" },
      hero: {
        eyebrow: "Studio web pour restaurants et commerces",
        title: "Des sites qui amènent les clients <em>jusqu'à votre porte.</em>",
        sub: "Envoyez-nous vos photos. Nous créons votre site et votre menu QR dans les langues de vos clients — en ligne en quelques jours.",
        ctaPrimary: "Lancer mon projet",
        ctaSecondary: "Voir nos réalisations",
        chipLive: "En ligne en quelques jours",
        chipQr: "Menu QR inclus"
      },
      audience: {
        i1: "Restaurants", i2: "Cafés", i3: "Salons de coiffure", i4: "Spas & massages", i5: "Bars", i6: "Street food", i7: "Entreprises locales",
        sr: "Nous travaillons avec des restaurants, cafés, salons de coiffure, spas et salons de massage, bars, vendeurs de street food et entreprises locales."
      },
      why: {
        eyebrow: "Pourquoi c'est important",
        manifesto: "Vos prochains clients vous cherchent déjà. <em>Nous faisons en sorte qu'ils vous trouvent — et vous choisissent.</em>",
        r1t: "Visible sur Google et Maps",
        r1b: "Les voyageurs choisissent où manger et se détendre avant même d'atterrir. Avec un vrai site, c'est vous qu'ils trouvent — pas le voisin.",
        r2t: "Une première impression qui inspire confiance",
        r2b: "Un beau site montre que vous prenez votre activité au sérieux. Il rassure bien plus qu'une simple page sur les réseaux sociaux.",
        r3t: "Un menu toujours à jour",
        r3b: "Un seul QR code sur la table, toujours à jour. Changez un prix ou un plat en quelques minutes — plus jamais de réimpression."
      },
      diff: {"eyebrow": "La différence", "title": "Le même commerce. <em>Deux premières impressions opposées.</em>", "query": "Restaurant italien près de moi", "you": "Votre restaurant", "meta": "Restaurant · 0,2 km", "directions": "Itinéraire", "call": "Appeler", "noSite": "Pas de site", "noMenu": "Pas de menu · pas de prix · aucune photo des plats", "keepScrolling": "Ils continuent de chercher…", "book": "Réserver une table", "badBadge": "Client perdu", "goodBadge": "Nouveau client", "s1t": "Ils cherchent", "s1b": "Nouvelle ville, téléphone en main : « restaurant italien près de moi ». Des dizaines d'épingles s'affichent — la vôtre en fait partie.", "s2t": "Sans site web", "s2b": "Une épingle, quelques photos floues, pas de menu, pas de prix. Impossible de savoir si c'est pour eux — alors ils passent au suivant.", "s3t": "Avec NM Studio", "s3b": "Vos photos, votre menu dans leur langue, l'itinéraire et la réservation en un geste. Ils vous choisissent — avant même d'être arrivés."},
      tryit: {"eyebrow": "Essayez maintenant", "title": "Ne nous croyez pas sur parole. <em>Scannez.</em>", "body": "Sortez votre téléphone et visez le code avec l'appareil photo. C'est un vrai menu QR que nous avons créé — exactement ce que vos clients voient à table.", "open": "Ouvrir le menu en ligne", "qrAlt": "QR code qui ouvre le vrai menu QR de Giulivo", "caption": "Giulivo · menu QR en ligne"},
      work: {
        eyebrow: "Réalisations",
        title: "De vrais sites. <em>En ligne dès maintenant.</em>",
        lead: "Chacun est pensé pour son activité — ses photos, ses clients, ses langues. Ouvrez-les : ils sont tous en ligne.",
        realClient: "Client réel", concept: "Concept", visit: "Voir le site", cursor: "Voir",
        p1cat: "Restaurant · Toscane",
        p1desc: "Un site chaleureux, porté par la photo, pour une trattoria familiale : la carte complète, les réservations et un menu QR sur chaque table — en italien, anglais, allemand et thaï.",
        p2cat: "Massage & spa · Pattaya",
        p2desc: "Un site de spa premium aux vraies photos : soins au prix mis à jour selon la durée, un conseiller « comment vous sentez-vous ? », des cartes cadeaux et la réservation WhatsApp — en quatre langues.",
        p3cat: "Salon de coiffure · Bangkok",
        p3desc: "L'élégance d'un magazine de mode pour un salon de coiffure et beauté : grille tarifaire claire, avis clients et réservation en un geste sur WhatsApp.",
        p4cat: "Fournisseur B2B · France",
        p4desc: "Un site d'entreprise affirmé pour un fournisseur de bardage : vidéo en ouverture, services, marques partenaires, réalisations et demandes de devis.",
        tMulti: "4 langues", tQr: "Menu QR", tBooking: "Réservation en ligne", tTreat: "Choix des soins", tMobile: "Pensé mobile",
        tPrices: "Grille tarifaire", tReviews: "Avis clients", tWhatsapp: "Réservation WhatsApp", tVideo: "Vidéo d'ouverture", tProjects: "Réalisations", tQuote: "Demande de devis",
        p5cat: "Bar & vie nocturne · Pattaya", p5desc: "Un site aux néons pour un bar billard : la soirée du jour et le happy hour en direct, la carte des boissons, les soirées billard et la réservation de table sur WhatsApp — en quatre langues.", tLive: "Happy hour en direct", tEvents: "Soirées de la semaine",
        p6cat: "Street food · Pattaya", p6desc: "Un site simple et vivant pour une cuisine de rue : carte filtrable, commande à emporter envoyée sur WhatsApp, jauge de piment, spécial du soir à l'ardoise et cartes de phrases à montrer au cuisinier.", tOrder: "Commande à emporter", tSpice: "Jauge de piment", p7cat: "Location de scooters · Pattaya", p7desc: "Un site de location premium : flotte avec prix au jour, à la semaine et au mois, calendrier de dates avec prix en direct et options, livraison à l'hôtel et demande sur WhatsApp.", tFleet: "Flotte & tarifs", tCalendar: "Calendrier de réservation",
        soon: "Bientôt", soonList: "Hôtels · Immobilier"
      },
      process: {
        v3toastT: "Nouvelle réservation",
        v3toastB: "Table pour 4 · ce soir 20h00",
        v1online: "en ligne",
        v1hello: "Bonjour ! Envoyez-nous vos photos et votre menu 👋",
        v3live: "En ligne",
        v3google: "Sur Google Maps",
        v3qr: "Menu QR",
        v3dir: "Itinéraire",
        s1d: "Jour 1",
        s1l1: "Un échange de 10 minutes, sans formulaire",
        s1l2: "Les photos de votre téléphone suffisent",
        s1l3: "Votre menu, même écrit à la main",
        s2d: "Jours 2–4",
        s2l1: "Un design sur mesure, jamais un modèle",
        s2l2: "Les textes rédigés dans chaque langue",
        s2l3: "Vous validez avant la mise en ligne",
        s3d: "Mise en ligne",
        s3l1: "Hébergement et nom de domaine inclus",
        s3l2: "QR codes prêts à imprimer",
        s3l3: "Modifications illimitées sur WhatsApp",
        eyebrow: "Notre méthode",
        title: "De vos photos à un site en ligne, <em>en quelques jours.</em>",
        lead: "Aucune réunion à préparer, aucun jargon technique. Vous gérez votre activité — nous nous occupons du reste.",
        s1t: "Envoyez vos photos", s1b: "Photos, menu, horaires — directement sur WhatsApp. C'est tout ce qu'il nous faut pour commencer.",
        s2t: "Nous créons votre site", s2b: "Design, textes, menu QR, Google Maps et toutes les langues de vos clients — on s'occupe de tout.",
        s3t: "Vous êtes en ligne", s3b: "Votre site est en ligne en quelques jours. Un changement plus tard ? Un simple message suffit — modifications illimitées."
      },
      pricing: {
        eyebrow: "Tarifs",
        title: "Des formules simples. <em>Aucune surprise.</em>",
        lead: "Chaque formule inclut un menu QR. Commencez petit et évoluez quand votre activité est prête.",
        setup: "mise en place unique", monthly: "par mois", popular: "Le plus choisi",
        note: "Sans engagement ni frais cachés. Résiliable à tout moment, gratuitement.",
        basic: { title: "Basic", tagline: "Votre menu, à un scan.", f1: "Menu QR code, toujours à jour", f2: "Modifications du menu illimitées", f3: "Fonctionne sur tous les téléphones, sans appli", cta: "Choisir Basic", demo: "Voir un vrai menu QR →" },
        pro: { title: "Pro", tagline: "Votre site web, clé en main.", f1: "Tout le contenu de Basic", f2: "Un site sur mesure, créé à partir de vos photos", f3: "Multilingue, avec Google Maps et WhatsApp", f4: "En ligne en quelques jours, pas en mois", cta: "Choisir Pro" },
        elite: { title: "Elite", tagline: "La formule complète, zéro effort.", f1: "Tout le contenu de Pro", f2: "Réseaux sociaux créés et gérés", f3: "Support prioritaire", cta: "Choisir Elite" }
      },
      faq: {
        eyebrow: "Questions",
        title: "Tout ce que vous <em>voulez savoir.</em>",
        lead: "Un doute ? Posez-nous directement la question — nous répondons généralement en quelques minutes.",
        ask: "Poser une question sur WhatsApp",
        q1: "Je ne suis pas à l'aise avec l'informatique, c'est un problème ?", a1: "Pas du tout. Vous nous envoyez vos photos, nous nous occupons de tout le reste — design, textes, hébergement et mises à jour.",
        q2: "Combien de temps avant que mon site soit en ligne ?", a2: "Quelques jours après réception de vos photos et informations — pas des semaines.",
        q3: "Puis-je changer mes photos ou mon menu plus tard ?", a3: "Oui. Les modifications sont illimitées et gratuites — envoyez-nous simplement un message.",
        q4: "Comment fonctionne le menu QR ?", a4: "Vos clients scannent le code avec l'appareil photo de leur téléphone — sans appli — et voient immédiatement votre menu à jour.",
        q5: "J'ai déjà Instagram. Pourquoi un site web ?", a5: "Instagram dépend d'un algorithme que vous ne contrôlez pas. Un site, c'est votre propre vitrine : visible sur Google, ouverte 24h/24, et elle vous appartient.",
        q6: "Le site m'appartient vraiment ?", a6: "Oui — votre nom, vos photos, votre contenu. Nous le créons pour votre activité, pas pour nous.",
        q7: "Et si je veux arrêter ?", a7: "Aucun engagement. Vous pouvez résilier à tout moment, gratuitement.",
        q8: "Avez-vous déjà travaillé avec des commerces comme le mien ?", a8: "Oui — restaurants, salons, spas et entreprises.", a8link: "Voir les sites en ligne →"
      },
      finale: {
        orbit: "LANCER MON PROJET · LANCER MON PROJET · ",
        eyebrow: "Parlons-en",
        title: "Votre prochain client vous cherche <em>en ce moment.</em>",
        sub: "Parlez-nous de votre activité. Nous venons vous rencontrer, vous montrons à quoi pourrait ressembler votre site, et le mettons en ligne en quelques jours.",
        book: "Prendre rendez-vous", whatsapp: "Nous écrire sur WhatsApp"
      },
      footer: {
        local: "Pattaya, Thaïlande",
        tagline: "Sites web et menus QR pour restaurants et commerces locaux.",
        explore: "Explorer", contact: "Contact", book: "Prendre rendez-vous", language: "Langue",
        rights: "© 2026 NM Studio. Conçu pour être trouvé.", backTop: "Haut de page"
      },
      booking: {
        eyebrow: "Prendre rendez-vous", title: "Rencontrons-nous",
        lead: "Dites-nous où et quand. Nous venons vous voir pour en parler — sans engagement.",
        business: "Nom de votre commerce", businessPh: "ex. Giulivo", phone: "Numéro de téléphone", date: "Date souhaitée", time: "Heure souhaitée",
        submit: "Envoyer sur WhatsApp", close: "Fermer",
        hint: "Votre message est copié automatiquement — collez-le simplement dans la conversation WhatsApp qui s'ouvre.",
        required: "Merci de remplir ce champ.", pastDate: "Choisissez aujourd'hui ou une date ultérieure.",
        toast: "Message copié — collez-le dans WhatsApp pour l'envoyer.",
        waMessage: "Bonjour ! Je souhaite prendre rendez-vous.\nCommerce : {business}\nTéléphone : {phone}\nDate souhaitée : {date} à {time}"
      }
    },

    it: {
      meta: {
        title: "NM Studio — Siti web e menù QR per ristoranti e attività locali",
        description: "Siti web, menù QR e schede Google per le attività di Pattaya. Invia le tue foto: siamo online in pochi giorni, senza contratto."
      },
      a11y: { skip: "Vai al contenuto", language: "Lingua", menu: "Menù", whatsapp: "Scrivici su WhatsApp" },
      nav: { work: "Progetti", process: "Metodo", pricing: "Prezzi", faq: "FAQ", cta: "Inizia un progetto" },
      hero: {
        eyebrow: "Studio web per ristoranti e attività locali",
        title: "Siti che portano i clienti <em>fino alla tua porta.</em>",
        sub: "Inviaci le tue foto. Creiamo il tuo sito e il tuo menù QR nelle lingue dei tuoi clienti — e sei online in pochi giorni.",
        ctaPrimary: "Inizia il tuo progetto",
        ctaSecondary: "Guarda i progetti",
        chipLive: "Online in pochi giorni",
        chipQr: "Menù QR incluso"
      },
      audience: {
        i1: "Ristoranti", i2: "Caffè", i3: "Parrucchieri", i4: "Spa e massaggi", i5: "Bar", i6: "Street food", i7: "Aziende locali",
        sr: "Lavoriamo con ristoranti, caffè, parrucchieri, spa e centri massaggi, bar, street food e aziende locali."
      },
      why: {
        eyebrow: "Perché conta",
        manifesto: "I tuoi prossimi clienti ti stanno già cercando. <em>Noi facciamo in modo che ti trovino — e che scelgano te.</em>",
        r1t: "Visibile su Google e Maps",
        r1b: "I viaggiatori scelgono dove mangiare e rilassarsi prima ancora di atterrare. Con un vero sito trovano te — non il locale accanto.",
        r2t: "Una prima impressione che ispira fiducia",
        r2b: "Un bel sito dimostra che prendi sul serio la tua attività. Rassicura i nuovi clienti molto più di una semplice pagina social.",
        r3t: "Un menù sempre aggiornato",
        r3b: "Un solo QR code sul tavolo, sempre aggiornato. Cambia un prezzo o un piatto in pochi minuti — niente più ristampe."
      },
      diff: {"eyebrow": "La differenza", "title": "Lo stesso locale. <em>Due prime impressioni opposte.</em>", "query": "Ristorante italiano vicino a me", "you": "Il tuo ristorante", "meta": "Ristorante · 0,2 km", "directions": "Indicazioni", "call": "Chiama", "noSite": "Nessun sito", "noMenu": "Nessun menù · nessun prezzo · nessuna foto dei piatti", "keepScrolling": "Continuano a cercare…", "book": "Prenota un tavolo", "badBadge": "Cliente perso", "goodBadge": "Nuovo cliente", "s1t": "Cercano", "s1b": "Città nuova, telefono in mano: “ristorante italiano vicino a me”. Compaiono decine di segnaposto — il tuo è uno di questi.", "s2t": "Senza un sito", "s2b": "Un segnaposto, qualche foto sfocata, niente menù, niente prezzi. Non capiscono se fa per loro — e passano al prossimo.", "s3t": "Con NM Studio", "s3b": "Le tue foto, il tuo menù nella loro lingua, indicazioni e prenotazione con un tocco. Scelgono te — prima ancora di arrivare."},
      tryit: {"eyebrow": "Provalo ora", "title": "Non fidarti solo delle parole. <em>Scansiona.</em>", "body": "Prendi il telefono e inquadra il codice con la fotocamera. È un vero menù QR che abbiamo creato — esattamente ciò che i tuoi clienti vedono al tavolo.", "open": "Apri il menù online", "qrAlt": "Codice QR che apre il vero menù QR di Giulivo", "caption": "Giulivo · menù QR online"},
      work: {
        eyebrow: "Progetti selezionati",
        title: "Siti veri. <em>Online adesso.</em>",
        lead: "Ognuno è costruito attorno all'attività — le sue foto, i suoi clienti, le sue lingue. Aprili pure: sono tutti online.",
        realClient: "Cliente reale", concept: "Concept", visit: "Visita il sito", cursor: "Apri",
        p1cat: "Ristorante · Toscana",
        p1desc: "Un sito caldo e fotografico per una trattoria di famiglia: il menù completo, le prenotazioni e un menù QR su ogni tavolo — in italiano, inglese, tedesco e thai.",
        p2cat: "Massaggi e spa · Pattaya",
        p2desc: "Un sito spa premium con vere fotografie: trattamenti con prezzo aggiornato in base alla durata, un consulente “come ti senti?”, buoni regalo e prenotazione su WhatsApp — in quattro lingue.",
        p3cat: "Parrucchiere · Bangkok",
        p3desc: "L'eleganza di una rivista di moda per un salone di bellezza: listino chiaro, recensioni dei clienti e prenotazione con un tocco su WhatsApp.",
        p4cat: "Fornitore B2B · Francia",
        p4desc: "Un sito aziendale deciso per un fornitore di rivestimenti: video in apertura, servizi, marchi partner, progetti e richieste di preventivo.",
        tMulti: "4 lingue", tQr: "Menù QR", tBooking: "Prenotazione online", tTreat: "Scelta trattamenti", tMobile: "Pensato per mobile",
        tPrices: "Listino prezzi", tReviews: "Recensioni", tWhatsapp: "Prenotazione WhatsApp", tVideo: "Video in apertura", tProjects: "Progetti", tQuote: "Preventivi",
        p5cat: "Bar e vita notturna · Pattaya", p5desc: "Un sito al neon per un bar con biliardo: l'evento della serata e l'happy hour in diretta, la carta dei drink, le serate di biliardo e la prenotazione del tavolo su WhatsApp — in quattro lingue.", tLive: "Happy hour in diretta", tEvents: "Eventi settimanali",
        p6cat: "Street food · Pattaya", p6desc: "Un sito semplice e vivace per una cucina di strada: menù filtrabile, ordine da asporto inviato su WhatsApp, misuratore di piccantezza, speciale della sera alla lavagna e frasi da mostrare al cuoco.", tOrder: "Ordini da asporto", tSpice: "Livello di piccante", p7cat: "Noleggio scooter · Pattaya", p7desc: "Un sito di noleggio premium: flotta con prezzi al giorno, alla settimana e al mese, calendario con prezzo in diretta ed extra, consegna in hotel e richieste su WhatsApp.", tFleet: "Flotta e prezzi", tCalendar: "Calendario prenotazioni",
        soon: "In arrivo", soonList: "Hotel · Immobiliare"
      },
      process: {
        v3toastT: "Nuova prenotazione",
        v3toastB: "Tavolo per 4 · stasera alle 20:00",
        v1online: "online",
        v1hello: "Ciao! Inviaci le tue foto e il menù 👋",
        v3live: "Online",
        v3google: "Su Google Maps",
        v3qr: "Menù QR",
        v3dir: "Indicazioni",
        s1d: "Giorno 1",
        s1l1: "Una chiacchierata di 10 minuti, nessun modulo",
        s1l2: "Bastano le foto del tuo telefono",
        s1l3: "Il tuo menù, anche scritto a mano",
        s2d: "Giorni 2–4",
        s2l1: "Design su misura, mai un modello",
        s2l2: "Testi scritti in ogni lingua",
        s2l3: "Lo approvi prima che vada online",
        s3d: "Lancio",
        s3l1: "Hosting e dominio inclusi",
        s3l2: "QR code pronti da stampare",
        s3l3: "Modifiche illimitate su WhatsApp",
        eyebrow: "Come funziona",
        title: "Dalle tue foto al sito online, <em>in pochi giorni.</em>",
        lead: "Nessuna riunione da preparare, nessun linguaggio tecnico. Tu pensi alla tua attività — al resto pensiamo noi.",
        s1t: "Inviaci le tue foto", s1b: "Foto, menù, orari — direttamente su WhatsApp. Non ci serve altro per iniziare.",
        s2t: "Creiamo il tuo sito", s2b: "Design, testi, menù QR, Google Maps e tutte le lingue dei tuoi clienti — pensiamo a tutto noi.",
        s3t: "Sei online", s3b: "Il tuo sito va online in pochi giorni. Vuoi cambiare qualcosa? Basta un messaggio — le modifiche sono illimitate."
      },
      pricing: {
        eyebrow: "Prezzi",
        title: "Piani semplici. <em>Nessuna sorpresa.</em>",
        lead: "Ogni piano include un menù QR. Inizia in piccolo e passa al livello successivo quando vuoi.",
        setup: "attivazione una tantum", monthly: "al mese", popular: "Il più scelto",
        note: "Nessun contratto, nessun costo nascosto. Disdici quando vuoi, gratis.",
        basic: { title: "Basic", tagline: "Il tuo menù, a portata di scansione.", f1: "Menù con QR code, sempre aggiornato", f2: "Modifiche al menù illimitate", f3: "Funziona su ogni telefono, senza app", cta: "Scegli Basic", demo: "Guarda un vero menù QR →" },
        pro: { title: "Pro", tagline: "Il tuo sito, chiavi in mano.", f1: "Tutto ciò che include Basic", f2: "Un sito su misura, creato con le tue foto", f3: "Multilingue, con Google Maps e WhatsApp", f4: "Online in giorni, non in mesi", cta: "Scegli Pro" },
        elite: { title: "Elite", tagline: "Il pacchetto completo, zero pensieri.", f1: "Tutto ciò che include Pro", f2: "Social media creati e gestiti", f3: "Assistenza prioritaria", cta: "Scegli Elite" }
      },
      faq: {
        eyebrow: "Domande",
        title: "Tutto quello che <em>vuoi sapere.</em>",
        lead: "Hai ancora un dubbio? Chiedici direttamente — di solito rispondiamo in pochi minuti.",
        ask: "Chiedi su WhatsApp",
        q1: "Non sono pratico di tecnologia: è un problema?", a1: "Per niente. Ci invii le tue foto e pensiamo noi a tutto il resto — design, testi, hosting e aggiornamenti.",
        q2: "Quanto tempo serve per andare online?", a2: "Pochi giorni dopo aver ricevuto le tue foto e informazioni — non settimane.",
        q3: "Posso cambiare foto o menù in seguito?", a3: "Sì. Le modifiche sono illimitate e gratuite — basta mandarci un messaggio.",
        q4: "Come funziona il menù QR?", a4: "I tuoi clienti inquadrano il codice con la fotocamera del telefono — senza app — e vedono subito il tuo menù aggiornato.",
        q5: "Ho già Instagram. Perché mi serve un sito?", a5: "Instagram dipende da un algoritmo che non controlli. Un sito è la tua vetrina: compare su Google, è aperto 24 ore su 24 ed è tuo.",
        q6: "Il sito è davvero mio?", a6: "Sì — il tuo nome, le tue foto, i tuoi contenuti. Lo costruiamo per la tua attività, non per noi.",
        q7: "E se voglio smettere?", a7: "Nessun vincolo. Puoi disdire quando vuoi, gratuitamente.",
        q8: "Avete già lavorato con attività come la mia?", a8: "Sì — ristoranti, saloni, spa e aziende.", a8link: "Guarda i siti online →"
      },
      finale: {
        orbit: "INIZIA UN PROGETTO · INIZIA UN PROGETTO · ",
        eyebrow: "Parliamone",
        title: "Il tuo prossimo cliente ti sta cercando <em>proprio ora.</em>",
        sub: "Raccontaci della tua attività. Veniamo a conoscerti, ti mostriamo come potrebbe essere il tuo sito e lo mettiamo online in pochi giorni.",
        book: "Prenota un incontro", whatsapp: "Scrivici su WhatsApp"
      },
      footer: {
        local: "Pattaya, Thailandia",
        tagline: "Siti web e menù QR per ristoranti e attività locali.",
        explore: "Esplora", contact: "Contatti", book: "Prenota un incontro", language: "Lingua",
        rights: "© 2026 NM Studio. Fatto per farti trovare.", backTop: "Torna su"
      },
      booking: {
        eyebrow: "Prenota un incontro", title: "Incontriamoci di persona",
        lead: "Dicci dove e quando. Veniamo da te a parlarne — senza impegno.",
        business: "Nome dell'attività", businessPh: "es. Giulivo", phone: "Numero di telefono", date: "Data preferita", time: "Ora preferita",
        submit: "Invia su WhatsApp", close: "Chiudi",
        hint: "Il messaggio viene copiato automaticamente — incollalo nella chat WhatsApp che si apre.",
        required: "Compila questo campo.", pastDate: "Scegli oggi o una data successiva.",
        toast: "Messaggio copiato — incollalo su WhatsApp per inviarlo.",
        waMessage: "Ciao! Vorrei prenotare un incontro.\nAttività: {business}\nTelefono: {phone}\nData preferita: {date} alle {time}"
      }
    },

    th: {
      meta: {
        title: "NM Studio — เว็บไซต์และเมนู QR สำหรับร้านอาหารและธุรกิจท้องถิ่น",
        description: "เว็บไซต์ เมนู QR และโปรไฟล์ Google สำหรับธุรกิจในพัทยา ส่งรูปมา แล้วเราจัดทำให้ ออนไลน์ในไม่กี่วัน ไม่มีสัญญาผูกมัด"
      },
      a11y: { skip: "ข้ามไปยังเนื้อหา", language: "ภาษา", menu: "เมนู", whatsapp: "ส่งข้อความหาเราทาง WhatsApp" },
      nav: { work: "ผลงาน", process: "ขั้นตอน", pricing: "ราคา", faq: "คำถาม", cta: "เริ่มโปรเจกต์" },
      hero: {
        eyebrow: "สตูดิโอเว็บสำหรับร้านอาหารและธุรกิจท้องถิ่น",
        title: "เว็บไซต์ที่พาลูกค้า <em>มาถึงหน้าร้านคุณ</em>",
        sub: "ส่งรูปของคุณมา เราออกแบบเว็บไซต์และเมนู QR ในภาษาของลูกค้าคุณ — และพร้อมออนไลน์ภายในไม่กี่วัน",
        ctaPrimary: "เริ่มโปรเจกต์ของคุณ",
        ctaSecondary: "ดูผลงานของเรา",
        chipLive: "ออนไลน์ในไม่กี่วัน",
        chipQr: "รวมเมนู QR แล้ว"
      },
      audience: {
        i1: "ร้านอาหาร", i2: "คาเฟ่", i3: "ร้านทำผม", i4: "สปาและร้านนวด", i5: "บาร์", i6: "สตรีทฟู้ด", i7: "บริษัทท้องถิ่น",
        sr: "เราทำงานกับร้านอาหาร คาเฟ่ ร้านทำผม สปาและร้านนวด บาร์ ร้านสตรีทฟู้ด และบริษัทท้องถิ่น"
      },
      why: {
        eyebrow: "ทำไมถึงสำคัญ",
        manifesto: "ลูกค้าคนต่อไปของคุณกำลังค้นหาอยู่แล้ว <em>เราทำให้พวกเขาเจอคุณ — และเลือกคุณ</em>",
        r1t: "ค้นเจอบน Google และ Maps",
        r1b: "นักท่องเที่ยวเลือกที่กินและที่พักผ่อนตั้งแต่ก่อนเครื่องลง เมื่อมีเว็บไซต์จริง พวกเขาจะเจอคุณ — ไม่ใช่ร้านข้าง ๆ",
        r2t: "ความประทับใจแรกที่สร้างความเชื่อมั่น",
        r2b: "เว็บไซต์ที่สวยงามแสดงว่าคุณจริงจังกับธุรกิจ และสร้างความมั่นใจให้ลูกค้าใหม่ได้มากกว่าเพจโซเชียลเพียงอย่างเดียว",
        r3t: "เมนูที่อัปเดตอยู่เสมอ",
        r3b: "QR โค้ดเดียวบนโต๊ะ อัปเดตตลอด เปลี่ยนราคาหรือเมนูได้ในไม่กี่นาที — ไม่ต้องพิมพ์ใหม่อีกเลย"
      },
      diff: {"eyebrow": "ความแตกต่าง", "title": "ร้านเดียวกัน <em>แต่ความประทับใจแรกต่างกันลิบลับ</em>", "query": "ร้านอาหารอิตาเลียนใกล้ฉัน", "you": "ร้านของคุณ", "meta": "ร้านอาหาร · 0.2 กม.", "directions": "เส้นทาง", "call": "โทร", "noSite": "ไม่มีเว็บไซต์", "noMenu": "ไม่มีเมนู · ไม่มีราคา · ไม่มีรูปอาหาร", "keepScrolling": "พวกเขาเลื่อนผ่านไป…", "book": "จองโต๊ะ", "badBadge": "เสียลูกค้า", "goodBadge": "ได้ลูกค้าใหม่", "s1t": "พวกเขาค้นหา", "s1b": "เมืองใหม่ โทรศัพท์ในมือ: “ร้านอาหารอิตาเลียนใกล้ฉัน” หมุดนับสิบปรากฏขึ้น — หนึ่งในนั้นคือร้านของคุณ", "s2t": "ถ้าไม่มีเว็บไซต์", "s2b": "แค่หมุด รูปเบลอไม่กี่รูป ไม่มีเมนู ไม่มีราคา พวกเขาไม่รู้ว่าร้านนี้ใช่ไหม — เลยไปดูร้านถัดไป", "s3t": "เมื่อมี NM Studio", "s3b": "รูปของคุณ เมนูในภาษาของพวกเขา เส้นทางและการจองในแตะเดียว พวกเขาเลือกคุณ — ตั้งแต่ก่อนมาถึง"},
      tryit: {"eyebrow": "ลองเลย", "title": "ไม่ต้องเชื่อเรา <em>ลองสแกนดู</em>", "body": "หยิบโทรศัพท์แล้วส่องกล้องไปที่โค้ด นี่คือเมนู QR จริงที่เราทำ — เหมือนที่ลูกค้าของคุณจะเห็นบนโต๊ะ", "open": "เปิดเมนูออนไลน์", "qrAlt": "QR โค้ดที่เปิดเมนู QR จริงของ Giulivo", "caption": "Giulivo · เมนู QR จริง"},
      work: {
        eyebrow: "ผลงานที่คัดสรร",
        title: "เว็บไซต์จริง <em>ออนไลน์อยู่ตอนนี้</em>",
        lead: "แต่ละเว็บสร้างขึ้นจากตัวธุรกิจ — รูปภาพ ลูกค้า และภาษาของพวกเขา เปิดดูได้เลย ทุกเว็บออนไลน์อยู่",
        realClient: "ลูกค้าจริง", concept: "คอนเซปต์", visit: "เข้าชมเว็บไซต์", cursor: "เปิดดู",
        p1cat: "ร้านอาหาร · ทัสคานี",
        p1desc: "เว็บไซต์อบอุ่นที่เล่าเรื่องด้วยภาพสำหรับร้านอาหารครอบครัว: เมนูครบ การจองโต๊ะ และเมนู QR บนทุกโต๊ะ — ในภาษาอิตาลี อังกฤษ เยอรมัน และไทย",
        p2cat: "นวดและสปา · พัทยา",
        p2desc: "เว็บไซต์สปาพรีเมียมพร้อมภาพถ่ายสวยงาม ราคาทรีตเมนต์เปลี่ยนตามระยะเวลา ระบบแนะนำ “วันนี้รู้สึกอย่างไร” สร้างบัตรของขวัญ และจองทาง WhatsApp — สี่ภาษา",
        p3cat: "ร้านทำผม · กรุงเทพฯ",
        p3desc: "ความหรูแบบนิตยสารแฟชั่นสำหรับร้านทำผมและความงาม: ราคาบริการชัดเจน รีวิวจากลูกค้า และจองได้ในแตะเดียวผ่าน WhatsApp",
        p4cat: "ซัพพลายเออร์ B2B · ฝรั่งเศส",
        p4desc: "เว็บไซต์องค์กรที่มั่นใจสำหรับผู้จำหน่ายวัสดุผนังภายนอก: วิดีโอเปิดหน้า บริการ แบรนด์พาร์ทเนอร์ ผลงาน และการขอใบเสนอราคา",
        tMulti: "4 ภาษา", tQr: "เมนู QR", tBooking: "จองออนไลน์", tTreat: "เลือกทรีตเมนต์", tMobile: "ออกแบบเพื่อมือถือ",
        tPrices: "ราคาบริการ", tReviews: "รีวิว", tWhatsapp: "จองผ่าน WhatsApp", tVideo: "วิดีโอเปิดหน้า", tProjects: "ผลงาน", tQuote: "ขอใบเสนอราคา",
        p5cat: "บาร์และไนท์ไลฟ์ · พัทยา", p5desc: "เว็บไซต์แสงนีออนสำหรับบาร์พูล: อีเวนต์คืนนี้และนับถอยหลังแฮปปี้อาวร์แบบเรียลไทม์ เมนูเครื่องดื่ม คืนแข่งพูล และจองโต๊ะทาง WhatsApp — สี่ภาษา", tLive: "แฮปปี้อาวร์เรียลไทม์", tEvents: "อีเวนต์ทุกสัปดาห์",
        p6cat: "สตรีทฟู้ด · พัทยา", p6desc: "เว็บไซต์เรียบง่ายแต่มีชีวิตชีวาสำหรับร้านอาหารริมทาง เมนูกรองได้ สั่งกลับบ้านส่งทาง WhatsApp ตัววัดความเผ็ด เมนูพิเศษประจำคืน และการ์ดประโยคไว้ยื่นให้แม่ครัว", tOrder: "สั่งกลับบ้าน", tSpice: "ระดับความเผ็ด", p7cat: "เช่าสกู๊ตเตอร์ · พัทยา", p7desc: "เว็บไซต์เช่ารถพรีเมียม รถพร้อมราคารายวัน รายสัปดาห์ รายเดือน ปฏิทินเลือกวันพร้อมคำนวณราคาและอุปกรณ์เสริม ส่งถึงโรงแรม และส่งคำขอทาง WhatsApp", tFleet: "รถและราคา", tCalendar: "ปฏิทินการจอง",
        soon: "เร็ว ๆ นี้", soonList: "โรงแรม · อสังหาริมทรัพย์"
      },
      process: {
        v3toastT: "มีการจองใหม่",
        v3toastB: "โต๊ะ 4 ที่ · คืนนี้ 20:00",
        v1online: "ออนไลน์",
        v1hello: "สวัสดี! ส่งรูปและเมนูมาได้เลย 👋",
        v3live: "ออนไลน์",
        v3google: "บน Google Maps",
        v3qr: "เมนู QR",
        v3dir: "เส้นทาง",
        s1d: "วันที่ 1",
        s1l1: "คุยกัน 10 นาที ไม่ต้องกรอกฟอร์ม",
        s1l2: "ใช้รูปจากโทรศัพท์ของคุณได้เลย",
        s1l3: "เมนูของคุณ แม้จะเขียนด้วยมือ",
        s2d: "วันที่ 2–4",
        s2l1: "ออกแบบเฉพาะ ไม่ใช่เทมเพลต",
        s2l2: "เขียนข้อความให้ทุกภาษา",
        s2l3: "คุณตรวจดูก่อนเปิดใช้งาน",
        s3d: "เปิดตัว",
        s3l1: "ดูแลโฮสติ้งและโดเมนให้",
        s3l2: "QR โค้ดพร้อมพิมพ์",
        s3l3: "แก้ไขได้ไม่จำกัดผ่าน WhatsApp",
        eyebrow: "ขั้นตอนการทำงาน",
        title: "จากรูปของคุณสู่เว็บไซต์ออนไลน์ <em>ในไม่กี่วัน</em>",
        lead: "ไม่ต้องเตรียมประชุม ไม่มีศัพท์เทคนิค คุณดูแลธุรกิจของคุณ — ที่เหลือเราจัดการให้",
        s1t: "ส่งรูปของคุณมา", s1b: "รูปภาพ เมนู เวลาเปิด-ปิด — ส่งมาทาง WhatsApp ได้เลย แค่นี้ก็เริ่มได้แล้ว",
        s2t: "เราออกแบบเว็บให้", s2b: "ดีไซน์ ข้อความ เมนู QR Google Maps และทุกภาษาที่ลูกค้าของคุณใช้ — เราทำให้ทั้งหมด",
        s3t: "เว็บของคุณออนไลน์แล้ว", s3b: "เว็บไซต์ออนไลน์ได้ในไม่กี่วัน อยากเปลี่ยนอะไรภายหลัง? แค่ส่งข้อความมา — แก้ไขได้ไม่จำกัด"
      },
      pricing: {
        eyebrow: "ราคา",
        title: "แพ็กเกจเรียบง่าย <em>ไม่มีค่าใช้จ่ายแอบแฝง</em>",
        lead: "ทุกแพ็กเกจรวมเมนู QR เริ่มจากเล็ก ๆ แล้วอัปเกรดได้เมื่อธุรกิจของคุณพร้อม",
        setup: "ค่าติดตั้งครั้งเดียว", monthly: "ต่อเดือน", popular: "ยอดนิยม",
        note: "ไม่มีสัญญา ไม่มีค่าใช้จ่ายแอบแฝง ยกเลิกได้ทุกเมื่อ ฟรี",
        basic: { title: "Basic", tagline: "เมนูของคุณ แค่สแกนเดียว", f1: "เมนู QR โค้ด อัปเดตอยู่เสมอ", f2: "แก้ไขเมนูได้ไม่จำกัด", f3: "ใช้ได้กับทุกโทรศัพท์ ไม่ต้องโหลดแอป", cta: "เลือก Basic", demo: "ดูตัวอย่างเมนู QR จริง →" },
        pro: { title: "Pro", tagline: "เว็บไซต์ของคุณเอง เราทำให้ครบ", f1: "ทุกอย่างในแพ็กเกจ Basic", f2: "เว็บไซต์ออกแบบเฉพาะจากรูปของคุณ", f3: "หลายภาษา พร้อม Google Maps และ WhatsApp", f4: "ออนไลน์ในไม่กี่วัน ไม่ใช่หลายเดือน", cta: "เลือก Pro" },
        elite: { title: "Elite", tagline: "แพ็กเกจครบวงจร ไม่ต้องทำอะไรเลย", f1: "ทุกอย่างในแพ็กเกจ Pro", f2: "ตั้งค่าและดูแลโซเชียลมีเดียให้", f3: "บริการช่วยเหลือแบบเร่งด่วน", cta: "เลือก Elite" }
      },
      faq: {
        eyebrow: "คำถามที่พบบ่อย",
        title: "ทุกอย่างที่คุณ <em>อยากรู้</em>",
        lead: "ยังสงสัยอะไรอยู่ไหม? ถามเราได้โดยตรง — ปกติเราตอบภายในไม่กี่นาที",
        ask: "ถามทาง WhatsApp",
        q1: "ไม่ค่อยถนัดเรื่องเทคโนโลยี จะมีปัญหาไหม?", a1: "ไม่มีปัญหาเลย แค่ส่งรูปมา ที่เหลือเราดูแลให้ทั้งหมด — ดีไซน์ ข้อความ โฮสติ้ง และการอัปเดต",
        q2: "ใช้เวลานานแค่ไหนกว่าเว็บจะออนไลน์?", a2: "ไม่กี่วันหลังจากที่เราได้รับรูปและข้อมูลของคุณ — ไม่ใช่หลายสัปดาห์",
        q3: "เปลี่ยนรูปหรือเมนูภายหลังได้ไหม?", a3: "ได้ แก้ไขได้ไม่จำกัดและฟรี — แค่ส่งข้อความมาเมื่อมีอะไรเปลี่ยน",
        q4: "เมนู QR ทำงานอย่างไร?", a4: "ลูกค้าสแกนโค้ดด้วยกล้องโทรศัพท์ — ไม่ต้องโหลดแอป — แล้วเห็นเมนูล่าสุดของคุณทันที",
        q5: "มี Instagram อยู่แล้ว ทำไมต้องมีเว็บไซต์?", a5: "Instagram ขึ้นอยู่กับอัลกอริทึมที่คุณควบคุมไม่ได้ เว็บไซต์คือหน้าร้านของคุณเอง: ค้นเจอบน Google เปิดตลอด 24 ชั่วโมง และเป็นของคุณ",
        q6: "เว็บไซต์เป็นของฉันจริงไหม?", a6: "จริง — ชื่อของคุณ รูปของคุณ เนื้อหาของคุณ เราสร้างเพื่อธุรกิจของคุณ ไม่ใช่เพื่อเรา",
        q7: "ถ้าอยากเลิกใช้บริการล่ะ?", a7: "ไม่มีข้อผูกมัด ยกเลิกได้ทุกเมื่อ ไม่มีค่าใช้จ่าย",
        q8: "เคยทำงานกับธุรกิจแบบของฉันไหม?", a8: "เคย — ร้านอาหาร ร้านทำผม สปา และบริษัท", a8link: "ดูเว็บไซต์จริง →"
      },
      finale: {
        orbit: "เริ่มโปรเจกต์ · เริ่มโปรเจกต์ · เริ่มโปรเจกต์ · ",
        eyebrow: "มาคุยกัน",
        title: "ลูกค้าคนต่อไปของคุณกำลังค้นหา <em>อยู่ตอนนี้</em>",
        sub: "เล่าเรื่องธุรกิจของคุณให้เราฟัง เราจะไปพบคุณ แสดงให้เห็นว่าเว็บไซต์ของคุณจะออกมาเป็นอย่างไร และทำให้ออนไลน์ภายในไม่กี่วัน",
        book: "นัดพบ", whatsapp: "ส่งข้อความทาง WhatsApp"
      },
      footer: {
        local: "พัทยา ประเทศไทย",
        tagline: "เว็บไซต์และเมนู QR สำหรับร้านอาหารและธุรกิจท้องถิ่น",
        explore: "สำรวจ", contact: "ติดต่อ", book: "นัดพบ", language: "ภาษา",
        rights: "© 2026 NM Studio. สร้างมาเพื่อให้คุณถูกค้นเจอ", backTop: "กลับขึ้นด้านบน"
      },
      booking: {
        eyebrow: "นัดพบ", title: "มาพบกันแบบตัวต่อตัว",
        lead: "บอกเราว่าที่ไหนและเมื่อไหร่ เราจะไปหาคุณเพื่อพูดคุย — ไม่มีข้อผูกมัด",
        business: "ชื่อร้าน / ธุรกิจ", businessPh: "เช่น Giulivo", phone: "เบอร์โทรศัพท์", date: "วันที่สะดวก", time: "เวลาที่สะดวก",
        submit: "ส่งทาง WhatsApp", close: "ปิด",
        hint: "ข้อความจะถูกคัดลอกให้อัตโนมัติ — แค่วางในแชท WhatsApp ที่เปิดขึ้นมา",
        required: "กรุณากรอกช่องนี้", pastDate: "กรุณาเลือกวันนี้หรือวันถัดไป",
        toast: "คัดลอกข้อความแล้ว — วางใน WhatsApp เพื่อส่ง",
        waMessage: "สวัสดี ต้องการนัดพบเพื่อพูดคุยเรื่องเว็บไซต์\nร้าน/ธุรกิจ: {business}\nเบอร์โทร: {phone}\nวันที่สะดวก: {date} เวลา {time}"
      }
    },

    ar: {
      meta: {
        title: "NM Studio — مواقع إلكترونية وقوائم QR للمطاعم والمحلات المحلية",
        description: "يصمم NM Studio مواقع إلكترونية وقوائم QR سريعة وأنيقة للمطاعم والصالونات ومراكز السبا والمحلات المحلية. أرسل صورك ويصبح موقعك متاحاً خلال أيام. بلا عقود."
      },
      a11y: { skip: "انتقل إلى المحتوى", language: "اللغة", menu: "القائمة", whatsapp: "راسلنا على واتساب" },
      nav: { work: "أعمالنا", process: "طريقة العمل", pricing: "الأسعار", faq: "الأسئلة", cta: "ابدأ مشروعك" },
      hero: {
        eyebrow: "استوديو مواقع للمطاعم والمحلات المحلية",
        title: "مواقع تجلب الزبائن <em>إلى باب محلك.</em>",
        sub: "أرسل لنا صورك. نصمم موقعك وقائمة QR بلغات زبائنك — ويصبح موقعك متاحاً خلال أيام.",
        ctaPrimary: "ابدأ مشروعك",
        ctaSecondary: "شاهد أعمالنا",
        chipLive: "متاح خلال أيام",
        chipQr: "قائمة QR مشمولة"
      },
      audience: {
        i1: "مطاعم", i2: "مقاهٍ", i3: "صالونات حلاقة", i4: "سبا ومراكز تدليك", i5: "بارات", i6: "أكل الشارع", i7: "شركات محلية",
        sr: "نعمل مع المطاعم والمقاهي وصالونات الحلاقة ومراكز السبا والتدليك والبارات وباعة أكل الشارع والشركات المحلية."
      },
      why: {
        eyebrow: "لماذا يهم ذلك",
        manifesto: "زبائنك القادمون يبحثون عنك الآن. <em>نحن نضمن أن يجدوك — وأن يختاروك.</em>",
        r1t: "ظهور على Google والخرائط",
        r1b: "يختار المسافرون أين يأكلون ويسترخون قبل أن تهبط طائرتهم. مع موقع حقيقي، سيجدونك أنت — لا المحل المجاور.",
        r2t: "انطباع أول يبني الثقة",
        r2b: "الموقع الجميل يُظهر أنك تأخذ عملك بجدية، ويطمئن الزبائن الجدد أكثر بكثير من صفحة على وسائل التواصل وحدها.",
        r3t: "قائمة محدّثة دائماً",
        r3b: "رمز QR واحد على الطاولة، محدّث دائماً. غيّر سعراً أو طبقاً في دقائق — دون إعادة طباعة بعد اليوم."
      },
      diff: {"eyebrow": "الفرق", "title": "المحل نفسه. <em>وانطباعان أولان مختلفان تماماً.</em>", "query": "مطعم إيطالي بالقرب مني", "you": "مطعمك", "meta": "مطعم · 0.2 كم", "directions": "الاتجاهات", "call": "اتصال", "noSite": "لا يوجد موقع", "noMenu": "لا قائمة · لا أسعار · لا صور للأطباق", "keepScrolling": "يواصلون البحث…", "book": "احجز طاولة", "badBadge": "زبون ضائع", "goodBadge": "زبون جديد", "s1t": "يبحثون", "s1b": "مدينة جديدة والهاتف في اليد: «مطعم إيطالي بالقرب مني». تظهر عشرات الدبابيس — ومحلك واحد منها.", "s2t": "بدون موقع", "s2b": "دبوس وبضع صور ضبابية، بلا قائمة ولا أسعار. لا يعرفون إن كان المكان يناسبهم — فينتقلون إلى التالي.", "s3t": "مع NM Studio", "s3b": "صورك، وقائمتك بلغتهم، والاتجاهات والحجز بلمسة واحدة. يختارونك — قبل أن يصلوا حتى."},
      tryit: {"eyebrow": "جرّبها الآن", "title": "لا تكتفِ بكلامنا. <em>امسح الرمز.</em>", "body": "أخرج هاتفك ووجّه الكاميرا نحو الرمز. هذه قائمة QR حقيقية صممناها — تماماً ما يراه زبائنك على الطاولة.", "open": "افتح القائمة المباشرة", "qrAlt": "رمز QR يفتح قائمة Giulivo الحقيقية", "caption": "Giulivo · قائمة QR مباشرة"},
      work: {
        eyebrow: "أعمال مختارة",
        title: "مواقع حقيقية. <em>متاحة الآن.</em>",
        lead: "كل موقع مبني حول نشاطه — صوره وزبائنه ولغاته. افتح أياً منها: جميعها متاحة على الإنترنت.",
        realClient: "عميل حقيقي", concept: "نموذج", visit: "زيارة الموقع", cursor: "افتح",
        p1cat: "مطعم · توسكانا",
        p1desc: "موقع دافئ تقوده الصور لمطعم عائلي: القائمة كاملة، والحجوزات، وقائمة QR على كل طاولة — بالإيطالية والإنجليزية والألمانية والتايلاندية.",
        p2cat: "تدليك وسبا · باتايا",
        p2desc: "موقع سبا فاخر بصور حقيقية: أسعار العلاجات تتغيّر حسب المدة، ومساعد «كيف تشعر اليوم؟»، وبطاقات هدايا، وحجز عبر واتساب — بأربع لغات.",
        p3cat: "صالون شعر · بانكوك",
        p3desc: "أناقة مجلات الموضة لصالون شعر وتجميل: قائمة أسعار واضحة، وآراء العملاء، وحجز بلمسة واحدة عبر واتساب.",
        p4cat: "مورد للشركات · فرنسا",
        p4desc: "موقع مؤسسي واثق لمورد مواد الواجهات: فيديو افتتاحي، والخدمات، والعلامات الشريكة، والمشاريع، وطلبات عروض الأسعار.",
        tMulti: "4 لغات", tQr: "قائمة QR", tBooking: "حجز عبر الإنترنت", tTreat: "اختيار العلاجات", tMobile: "مصمم للهاتف",
        tPrices: "قائمة الأسعار", tReviews: "آراء العملاء", tWhatsapp: "حجز عبر واتساب", tVideo: "فيديو افتتاحي", tProjects: "المشاريع", tQuote: "طلب عرض سعر",
        p5cat: "بار وحياة ليلية · باتايا", p5desc: "موقع بأضواء النيون لبار بلياردو: فعالية الليلة وعدّ تنازلي مباشر لساعة التخفيضات، وقائمة المشروبات، وليالي البلياردو، وحجز الطاولات عبر واتساب — بأربع لغات.", tLive: "ساعة التخفيضات مباشرة", tEvents: "فعاليات أسبوعية",
        p6cat: "أكل الشارع · باتايا", p6desc: "موقع بسيط ونابض لمطبخ شارع: قائمة قابلة للتصفية، وطلبات سفري تُرسل عبر واتساب، ومقياس للحرارة، وطبق الليلة على السبورة، وبطاقات عبارات تُعرض على الطاهية.", tOrder: "طلبات سفري", tSpice: "مقياس الحرارة", p7cat: "تأجير سكوتر · باتايا", p7desc: "موقع تأجير فاخر: أسطول بأسعار يومية وأسبوعية وشهرية، وتقويم حجز بسعر مباشر وإضافات، وتوصيل إلى الفندق وطلبات عبر واتساب.", tFleet: "الأسطول والأسعار", tCalendar: "تقويم الحجز",
        soon: "قريباً", soonList: "فنادق · عقارات"
      },
      process: {
        v3toastT: "حجز جديد",
        v3toastB: "طاولة لـ4 · الليلة 20:00",
        v1online: "متصل",
        v1hello: "مرحباً! أرسل لنا صورك وقائمتك 👋",
        v3live: "متاح",
        v3google: "على خرائط Google",
        v3qr: "قائمة QR",
        v3dir: "الاتجاهات",
        s1d: "اليوم 1",
        s1l1: "محادثة من 10 دقائق، بلا استمارات",
        s1l2: "صور هاتفك تكفي",
        s1l3: "قائمتك، ولو مكتوبة بخط اليد",
        s2d: "الأيام 2–4",
        s2l1: "تصميم مخصص، لا قوالب جاهزة",
        s2l2: "نصوص مكتوبة بكل لغة",
        s2l3: "تراجعه قبل إطلاقه",
        s3d: "الإطلاق",
        s3l1: "الاستضافة والنطاق علينا",
        s3l2: "رموز QR جاهزة للطباعة",
        s3l3: "تعديلات بلا حدود عبر واتساب",
        eyebrow: "طريقة العمل",
        title: "من صورك إلى موقع متاح على الإنترنت، <em>خلال أيام.</em>",
        lead: "لا اجتماعات للتحضير ولا مصطلحات تقنية. أنت تدير عملك — ونحن نتكفل بالباقي.",
        s1t: "أرسل صورك", s1b: "الصور، القائمة، أوقات العمل — مباشرة عبر واتساب. هذا كل ما نحتاجه للبدء.",
        s2t: "نصمم موقعك", s2b: "التصميم، والنصوص، وقائمة QR، وخرائط Google، وكل لغات زبائنك — نتكفل بكل شيء.",
        s3t: "موقعك متاح", s3b: "يصبح موقعك متاحاً خلال أيام. تريد تغيير شيء لاحقاً؟ أرسل رسالة فقط — التعديلات بلا حدود."
      },
      pricing: {
        eyebrow: "الأسعار",
        title: "باقات بسيطة. <em>بلا مفاجآت.</em>",
        lead: "كل باقة تتضمن قائمة QR. ابدأ بالبسيط وقم بالترقية متى أصبح عملك مستعداً.",
        setup: "رسوم إعداد لمرة واحدة", monthly: "شهرياً", popular: "الأكثر اختياراً",
        note: "بلا عقود ولا رسوم خفية. ألغِ في أي وقت، مجاناً.",
        basic: { title: "Basic", tagline: "قائمتك على بُعد مسحة واحدة.", f1: "قائمة برمز QR، محدّثة دائماً", f2: "تعديلات غير محدودة على القائمة", f3: "تعمل على أي هاتف — بلا تطبيق", cta: "اختر Basic", demo: "شاهد قائمة QR حقيقية ←" },
        pro: { title: "Pro", tagline: "موقعك الخاص، جاهز بالكامل.", f1: "كل ما في باقة Basic", f2: "موقع مخصص مبني من صورك", f3: "متعدد اللغات، مع خرائط Google وواتساب", f4: "متاح خلال أيام، لا أشهر", cta: "اختر Pro" },
        elite: { title: "Elite", tagline: "الباقة الكاملة، بلا أي مجهود.", f1: "كل ما في باقة Pro", f2: "إعداد وإدارة وسائل التواصل الاجتماعي", f3: "دعم ذو أولوية", cta: "اختر Elite" }
      },
      faq: {
        eyebrow: "الأسئلة الشائعة",
        title: "كل ما <em>تريد معرفته.</em>",
        lead: "ما زال لديك سؤال؟ اسألنا مباشرة — نرد عادةً خلال دقائق.",
        ask: "اسأل عبر واتساب",
        q1: "لست بارعاً في التكنولوجيا — هل هذه مشكلة؟", a1: "إطلاقاً. ترسل لنا صورك ونتكفل نحن بكل شيء آخر — التصميم والنصوص والاستضافة والتحديثات.",
        q2: "كم يستغرق حتى يصبح موقعي متاحاً؟", a2: "بضعة أيام بعد استلام صورك ومعلوماتك — لا أسابيع.",
        q3: "هل يمكنني تغيير الصور أو القائمة لاحقاً؟", a3: "نعم. التعديلات غير محدودة ومجانية — فقط أرسل لنا رسالة عند أي تغيير.",
        q4: "كيف تعمل قائمة QR؟", a4: "يمسح زبائنك الرمز بكاميرا الهاتف — دون أي تطبيق — ويرون قائمتك المحدّثة فوراً.",
        q5: "لدي إنستغرام بالفعل. لماذا أحتاج موقعاً؟", a5: "إنستغرام يعتمد على خوارزمية لا تتحكم بها. الموقع هو واجهة محلك الخاصة: يظهر على Google، ومتاح على مدار الساعة، وملك لك.",
        q6: "هل الموقع ملكي حقاً؟", a6: "نعم — اسمك وصورك ومحتواك. نبنيه لعملك، لا لنا.",
        q7: "ماذا لو أردت التوقف؟", a7: "بلا أي التزام. يمكنك الإلغاء في أي وقت، مجاناً.",
        q8: "هل عملتم مع أنشطة مثل نشاطي؟", a8: "نعم — مطاعم وصالونات ومراكز سبا وشركات.", a8link: "شاهد المواقع المباشرة ←"
      },
      finale: {
        orbit: "ابدأ مشروعك · ابدأ مشروعك · ابدأ مشروعك · ",
        eyebrow: "لنتحدث",
        title: "زبونك القادم يبحث عنك <em>في هذه اللحظة.</em>",
        sub: "حدثنا عن نشاطك. سنأتي لمقابلتك، ونريك كيف يمكن أن يبدو موقعك، ونطلقه خلال أيام.",
        book: "احجز موعداً", whatsapp: "راسلنا على واتساب"
      },
      footer: {
        local: "باتايا، تايلاند",
        tagline: "مواقع إلكترونية وقوائم QR للمطاعم والمحلات المحلية.",
        explore: "استكشف", contact: "تواصل", book: "احجز موعداً", language: "اللغة",
        rights: "© 2026 NM Studio. صُمم ليجدك الزبائن.", backTop: "العودة للأعلى"
      },
      booking: {
        eyebrow: "احجز موعداً", title: "لنلتقِ شخصياً",
        lead: "أخبرنا أين ومتى. سنأتي إليك للحديث — دون أي التزام.",
        business: "اسم النشاط التجاري", businessPh: "مثال: Giulivo", phone: "رقم الهاتف", date: "التاريخ المفضل", time: "الوقت المفضل",
        submit: "إرسال عبر واتساب", close: "إغلاق",
        hint: "تُنسخ رسالتك تلقائياً — الصقها فقط في محادثة واتساب التي ستُفتح.",
        required: "يرجى ملء هذا الحقل.", pastDate: "يرجى اختيار تاريخ اليوم أو تاريخ لاحق.",
        toast: "تم نسخ الرسالة — الصقها في واتساب لإرسالها.",
        waMessage: "مرحباً! أود حجز موعد.\nالنشاط التجاري: {business}\nرقم الهاتف: {phone}\nالتاريخ المفضل: {date} الساعة {time}"
      }
    }
  };

  /* Pricing per language — deliberate price points per currency rather than
     a literal FX conversion (which would land on odd numbers). */
  var CURRENCY = { en: "eur", fr: "eur", it: "eur", th: "thb", ar: "mad" };
  var PRICES = {
    eur: { basicSetup: 50, basicMonthly: 15, proSetup: 100, proMonthly: 30, eliteSetup: 300, eliteMonthly: 100 },
    thb: { basicSetup: 500, basicMonthly: 300, proSetup: 1999, proMonthly: 599, eliteSetup: 7000, eliteMonthly: 2000 },
    mad: { basicSetup: 500, basicMonthly: 150, proSetup: 1200, proMonthly: 350, eliteSetup: 3500, eliteMonthly: 1000 }
  };
  var SYMBOL = { eur: " €", thb: " ฿", mad: " DH" };
  var LABEL = { en: "EN", fr: "FR", it: "IT", th: "TH", ar: "AR" };

  // A page can ship extra strings (e.g. the checkout) by defining
  // window.NM_EXTRA_DICT = { en: {...}, fr: {...} } before this script runs.
  (function mergeExtra(extra) {
    if (!extra) return;
    function deep(target, src) {
      Object.keys(src).forEach(function (k) {
        if (src[k] && typeof src[k] === "object" && !Array.isArray(src[k])) { target[k] = target[k] || {}; deep(target[k], src[k]); }
        else target[k] = src[k];
      });
    }
    Object.keys(extra).forEach(function (lang) { if (DICT[lang]) deep(DICT[lang], extra[lang]); });
  })(window.NM_EXTRA_DICT);

  function get(lang, path) {
    var node = DICT[lang] || DICT.en;
    var parts = path.split(".");
    for (var i = 0; i < parts.length; i++) {
      if (node == null) return null;
      node = node[parts[i]];
    }
    return node == null && lang !== "en" ? get("en", path) : node;
  }

  function formatPrice(currency, amount) {
    return amount.toLocaleString("en-US") + SYMBOL[currency];
  }

  // Latin fonts are self-hosted; Thai and Arabic faces are only fetched
  // when someone actually switches to those languages.
  var SCRIPT_FONTS = {
    th: "https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600&display=swap",
    ar: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600&display=swap"
  };
  function loadScriptFont(lang) {
    var href = SCRIPT_FONTS[lang];
    if (!href || document.querySelector('link[data-font="' + lang + '"]')) return;
    var link = document.createElement("link");
    link.rel = "stylesheet"; link.href = href; link.setAttribute("data-font", lang);
    document.head.appendChild(link);
  }

  function apply(lang) {
    if (!DICT[lang]) lang = "en";
    loadScriptFont(lang);
    var root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = get(lang, el.getAttribute("data-i18n"));
      if (typeof v === "string") el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var v = get(lang, el.getAttribute("data-i18n-html"));
      if (typeof v === "string") el.innerHTML = v;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var v = get(lang, el.getAttribute("data-i18n-placeholder"));
      if (typeof v === "string") el.setAttribute("placeholder", v);
    });
    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      var v = get(lang, el.getAttribute("data-i18n-alt"));
      if (typeof v === "string") el.setAttribute("alt", v);
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach(function (el) {
      var v = get(lang, el.getAttribute("data-i18n-aria-label"));
      if (typeof v === "string") el.setAttribute("aria-label", v);
    });

    var metaKey = document.body.getAttribute("data-meta") || "meta";
    document.title = get(lang, metaKey + ".title");
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", get(lang, metaKey + ".description"));

    var currency = CURRENCY[lang];
    document.querySelectorAll("[data-price]").forEach(function (el) {
      var amount = PRICES[currency][el.getAttribute("data-price")];
      if (amount != null) el.textContent = formatPrice(currency, amount);
    });

    document.querySelectorAll(".lang__current").forEach(function (el) { el.textContent = LABEL[lang]; });
    document.querySelectorAll(".lang__flag").forEach(function (el) { el.setAttribute("data-flag", lang); });
    document.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.setAttribute("aria-current", btn.getAttribute("data-lang") === lang ? "true" : "false");
    });

    try { localStorage.setItem("nmLang", lang); } catch (e) {}
    window.NM_LANG = lang;
    document.dispatchEvent(new CustomEvent("nm:lang", { detail: { lang: lang } }));
  }

  function detect() {
    var stored = null;
    try { var q = new URLSearchParams(location.search).get("lang"); if (q && DICT[q]) return q; } catch (e) {}
    try { stored = localStorage.getItem("nmLang"); } catch (e) {}
    if (stored && DICT[stored]) return stored;
    var nav = (navigator.language || "en").toLowerCase().slice(0, 2);
    return DICT[nav] ? nav : "en";
  }

  window.NMI18n = {
    apply: apply,
    t: function (path) { return get(window.NM_LANG || "en", path); },
    currency: function () { return CURRENCY[window.NM_LANG || "en"]; },
    price: function (key, currency) { return PRICES[currency || CURRENCY[window.NM_LANG || "en"]][key]; },
    format: function (amount) { return formatPrice(CURRENCY[window.NM_LANG || "en"], amount); }
  };

  // Waving flags: cut each flag into strips that ripple out of phase.
  // Each flag starts at its own point in the wave so a row never moves
  // in lockstep.
  function waveFlags() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.querySelectorAll(".flag").forEach(function (f, k) {
      // ~2px strips, a whole number of pixels each so edges stay sharp.
      var w = f.offsetWidth || 24, strips = Math.max(6, Math.round(w / 2)), sw = Math.round(w / strips);
      strips = Math.ceil(w / sw);
      f.style.setProperty("--sw", sw + "px");
      f.style.setProperty("--d", (k * -0.37).toFixed(2) + "s");
      for (var i = 0; i < strips; i++) {
        var s = document.createElement("i");
        s.style.setProperty("--i", i);
        if (i === strips - 1) s.style.width = (w - sw * i) + "px";
        f.appendChild(s);
      }
      f.classList.add("is-waving");
    });
  }
  waveFlags();

  // Loaded with defer ahead of main.js: the markup is parsed and the
  // language is applied before the animation code splits any headings.
  apply(detect());
})();
