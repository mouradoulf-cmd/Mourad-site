/* Giulivo — instant client-side language switch (IT / EN / DE).
   No page reload: every translatable string lives in the dictionaries
   below, and applyLanguage() swaps the live DOM. The HTML each file
   ships with is that file's own language, baked in for no-JS / SEO —
   the dictionary is simply the single source of truth once JS runs. */
(function () {
  "use strict";

  var translations = {
    it: {
      meta: {
        description: "Giulivo Cucina e Buonumore — cucina toscana autentica e fatta in casa nel cuore di Vicopisano. Pasta fresca, carne e pesce di stagione e dolci fatti in casa, in un'atmosfera calorosa e conviviale."
      },
      nav: {
        home: "Home",
        story: "La nostra storia",
        menu: "Menu",
        gallery: "Galleria",
        reviews: "Recensioni",
        contact: "Contatti",
        book: "Prenota",
        burgerLabel: "Apri il menu"
      },
      hero: {
        eyebrow: "Località Luchetta · Vicopisano · Toscana",
        text: "Una cucina toscana autentica, genuina e fatta in casa — pasta fresca, carne e pesce di stagione, serviti in un'atmosfera semplice, calorosa e gioiosa, proprio come a casa.",
        bookBtn: "Prenota un tavolo",
        menuBtn: "Scopri il menu",
        scrollLabel: "Scorri verso il basso",
        ratingHtml: "<strong>4,7</strong> su Google · <span>91 recensioni</span>"
      },
      stats: {
        rating: "Voto Google",
        reviews: "Recensioni clienti",
        homemade: "Fatto in casa",
        openUntil: "Aperto fino alle"
      },
      marquee: { cuisine: "Cucina Toscana", homemade: "Fatto in casa" },
      story: {
        badgeSub: "ogni giorno",
        imgAlt: "Tartare rivisitato, presentazione curata su ardesia da Giulivo",
        eyebrow: "La nostra storia",
        titleHtml: "Una nuova vita, la stessa passione&nbsp;: accogliere bene",
        p1: "Giulivo nasce dal desiderio di Guidino di puntare tutto sulla sua vera passione : la cucina toscana, generosa e sincera. Dopo un percorso di vita intenso, ha scelto di ripartire da zero e aprire la sua tavola a Vicopisano, nel rispetto delle ricette tradizionali e dei prodotti di stagione.",
        p2Html: "Qui tutto è fatto in casa&nbsp;: la pasta è lavorata a mano, la carne e il pesce cucinati con cura, i dolci preparati sul posto. Si viene per mangiare bene, ma anche per il <em>buonumore</em> — che dà il nome alla casa.",
        point1: "Pasta fresca fatta a mano",
        point2: "Carne & pesce di stagione",
        point3: "Dolci fatti in casa",
        point4: "Atmosfera semplice, calorosa e conviviale"
      },
      motto: {
        text: "« È la nostra passione per il buon cibo, il buon vino e soprattutto la convivialità ad averci spinto in questa avventura, dove valorizziamo i piatti della tradizione toscana con un tocco di buonumore. Una filosofia semplice, perché semplice è la ricetta della felicità: mangiare, bere, stare in compagnia, condividere piaceri ed emozioni. »"
      },
      menu: {
        eyebrow: "Il menu",
        title: "Una cucina toscana, generosa e di stagione",
        lead: "Il menu cambia con le stagioni e con il mercato. Ecco lo spirito della carta, con un assaggio dei piatti che la compongono.",
        fullBtn: "Vedi il menu completo",
        card1Title: "Antipasti",
        card1Text: "Antipasti toscani con prodotti freschi e di stagione, presentati con cura.",
        card1Alt: "Tartare di carne su ardesia, antipasto di Giulivo",
        card2Title: "Pasta fatta a mano",
        card2Text: "Pasta fresca lavorata a mano ogni giorno, secondo la tradizione toscana.",
        card2Alt: "Linguine ai frutti di mare, gamberi e cozze",
        card3Title: "Carne & Pesce",
        card3Text: "Carne e pesce cucinati con passione, selezionati in base alla disponibilità del giorno.",
        card3Alt: "Tonno in crosta di pistacchio affettato, servito con insalata",
        card4Title: "Dolci fatti in casa",
        card4Text: "Dolci fatti in casa, per chiudere il pasto in dolcezza, nel rispetto dei classici italiani.",
        card4Alt: "Panna cotta ai frutti di bosco, dolce fatto in casa",
        originAria: "Filtra il menu per Terra o Mare",
        originAll: "Tutto",
        originLand: "Terra",
        originSea: "Mare",
        tabsAria: "Categorie del menu",
        tabAntipasti: "Antipasti",
        tabPrimi: "Primi",
        tabSecondi: "Secondi",
        tabContorni: "Contorni",
        tabDessert: "Dessert",
        tabBevande: "Bevande",
        prevLabel: "Categoria precedente",
        nextLabel: "Categoria successiva",
        panelAntipasti: "Antipasti",
        panelPrimi: "Primi piatti",
        panelSecondi: "Secondi piatti",
        panelContorni: "Contorni",
        panelDessert: "Dessert",
        panelBevande: "Bevande & Caffè",
        note: "La pasta fresca è fatta a mano, prodotta dal pastificio artigianale \"La Castellana\".",
        hint: "Sfoglia il menu come un libro — usa le frecce o le schede qui sopra",
        footnoteHtml: "Coperto 2,50&nbsp;€ a persona · Carta soggetta a variazioni stagionali · Allergeni disponibili su richiesta.",
        ctaBtn: "Prenota il tuo tavolo"
      },
      gallery: {
        eyebrow: "Galleria",
        title: "Uno sguardo sulla tavola",
        lead: "Un assaggio dei piatti e dell'atmosfera da Giulivo.",
        items: [
          { alt: "Un angolo sotto l'ulivo secolare, la nostra terrazza", caption: "Sotto il vecchio ulivo" },
          { alt: "Tartare su ardesia, cucina di Giulivo", caption: "Tartare della casa" },
          { alt: "Linguine ai frutti di mare", caption: "Linguine ai frutti di mare" },
          { alt: "Tonno in crosta di pistacchio", caption: "Tonno in crosta di pistacchio" },
          { alt: "Panna cotta ai frutti di bosco", caption: "Panna cotta ai frutti di bosco" },
          { alt: "Antipasto misto, tartare di tonno e pesce impanato", caption: "Antipasto misto" },
          { alt: "Tortellini fatti in casa, panna e speck croccante", caption: "Tortellini, panna e speck" },
          { alt: "Piatto signature, presentazione naturale", caption: "Un piatto firmato Giulivo" },
          { alt: "Panna cotta e calice di vino bianco in terrazza", caption: "Dolce e un calice in terrazza" },
          { alt: "Tavoli pronti in terrazza sotto il pergolato", caption: "Tavoli pronti in terrazza" },
          { alt: "La veranda di Giulivo al tramonto", caption: "La nostra veranda" },
          { alt: "Il pergolato della terrazza di Giulivo", caption: "Il nostro pergolato" }
        ]
      },
      experience: {
        eyebrow: "L'atmosfera",
        title: "Un'esperienza da vivere, non solo un pasto",
        text: "Tra le colline di Vicopisano, in un ambiente semplice e curato, ogni cena da Giulivo è un momento da condividere — buona tavola, buona compagnia, buonumore."
      },
      reviews: {
        number: "4,7",
        count: "91 recensioni verificate su Google",
        readBtn: "Leggi le recensioni su Google",
        slide1: "« Si viene per mangiare bene, e si torna a casa con il sorriso. »",
        slide2: "« Cucina toscana sincera, in un'atmosfera che sa di casa. »",
        slide3: "« Buonumore garantito, ad ogni tavolo. »",
        note: "Lo spirito di Giulivo, in poche parole — cucina toscana sincera e accoglienza calorosa.",
        chip1: "Genuino",
        chip2: "Accogliente",
        chip3: "Fatto in casa",
        chip4: "Come a casa",
        chip5: "Buonumore garantito"
      },
      contact: {
        bookEyebrow: "Prenota",
        bookTitle: "Richiedi un tavolo",
        bookText: "Compila i dettagli: si apre WhatsApp con il messaggio già pronto da inviarci. La prenotazione è confermata solo dopo la nostra risposta.",
        labelDate: "Data",
        labelTime: "Ora",
        labelGuests: "Persone",
        labelNotes: "Note (opzionale)",
        notesPlaceholder: "Es. allergie, seggiolone, tavolo esterno…",
        submitBtn: "Richiedi su WhatsApp",
        findEyebrow: "Dove siamo",
        findTitle: "Vieni a condividere un buon momento",
        addressLabel: "Indirizzo",
        addressHtml: "Località Luchetta, 7<br>56010 Vicopisano PI, Italia",
        hoursLabel: "Orari",
        hoursHtml: "Servizio serale, fino alle 23:00<br><small>Vi invitiamo a chiamare per confermare i giorni di apertura e prenotare.</small>",
        phoneLabel: "Telefono",
        callBtn: "Chiama per prenotare",
        whatsappBtn: "WhatsApp",
        mapTitle: "Posizione di Giulivo Cucina e Buonumore"
      },
      footer: {
        backTop: "Torna su ↑",
        country: "Italia"
      },
      modal: {
        title: "La carta completa",
        closeLabel: "Chiudi il menu",
        panelLabel: "Il menu completo"
      }
    },

    en: {
      meta: {
        description: "Giulivo Cucina e Buonumore — authentic, homemade Tuscan cuisine in the heart of Vicopisano. Fresh pasta, seasonal meat and fish and homemade desserts, in a warm and welcoming atmosphere."
      },
      nav: {
        home: "Home",
        story: "Our Story",
        menu: "Menu",
        gallery: "Gallery",
        reviews: "Reviews",
        contact: "Contact",
        book: "Book",
        burgerLabel: "Open menu"
      },
      hero: {
        eyebrow: "Località Luchetta · Vicopisano · Tuscany",
        text: "Authentic, genuine, homemade Tuscan cuisine — fresh pasta, seasonal meat and fish, served in a simple, warm and joyful atmosphere, just like home.",
        bookBtn: "Book a table",
        menuBtn: "See the menu",
        scrollLabel: "Scroll down",
        ratingHtml: "<strong>4.7</strong> on Google · <span>91 reviews</span>"
      },
      stats: {
        rating: "Google Rating",
        reviews: "Customer Reviews",
        homemade: "Homemade",
        openUntil: "Open until"
      },
      marquee: { cuisine: "Tuscan Cuisine", homemade: "Homemade" },
      story: {
        badgeSub: "every day",
        imgAlt: "Reinvented tartare, carefully plated on slate at Giulivo",
        eyebrow: "Our story",
        titleHtml: "A new life, the same passion&nbsp;: a warm welcome",
        p1: "Giulivo was born from Guidino's desire to bet everything on his true passion : generous, sincere Tuscan cuisine. After an eventful life, he chose to start from scratch and open his own table in Vicopisano, honouring traditional recipes and seasonal produce.",
        p2Html: "Here everything is homemade&nbsp;: the pasta is worked by hand, the meat and fish cooked with care, the desserts prepared on site. People come to eat well, but also for the <em>buonumore</em> — good mood — that gives the house its name.",
        point1: "Handmade fresh pasta",
        point2: "Seasonal meat & fish",
        point3: "Homemade desserts",
        point4: "Simple, warm and welcoming atmosphere"
      },
      motto: {
        text: "« It's our passion for good food, good wine and above all conviviality that pushed us into this adventure, where we bring out the dishes of Tuscan tradition with a touch of buonumore. A simple philosophy, because happiness has a simple recipe: eating, drinking, spending time together, sharing pleasures and emotions. »"
      },
      menu: {
        eyebrow: "Menu",
        title: "A generous, seasonal Tuscan cuisine",
        lead: "The menu changes with the seasons and the market. Here's the spirit of it, with a taste of the dishes that make it up.",
        fullBtn: "See the full menu",
        card1Title: "Starters",
        card1Text: "Tuscan starters with fresh, seasonal ingredients, carefully presented.",
        card1Alt: "Meat tartare on slate, a Giulivo starter",
        card2Title: "Handmade Pasta",
        card2Text: "Fresh pasta hand-worked every day, following Tuscan tradition.",
        card2Alt: "Seafood linguine, shrimp and mussels",
        card3Title: "Meat & Fish",
        card3Text: "Meat and fish cooked with passion, selected according to daily availability.",
        card3Alt: "Sliced pistachio-crusted tuna, served with salad",
        card4Title: "Homemade Desserts",
        card4Text: "Homemade desserts, to end the meal on a sweet note, honouring Italian classics.",
        card4Alt: "Mixed berry panna cotta, a homemade dessert",
        originAria: "Filter the menu by Land or Sea",
        originAll: "All",
        originLand: "Land",
        originSea: "Sea",
        tabsAria: "Menu categories",
        tabAntipasti: "Starters",
        tabPrimi: "First Courses",
        tabSecondi: "Main Courses",
        tabContorni: "Sides",
        tabDessert: "Desserts",
        tabBevande: "Drinks",
        prevLabel: "Previous category",
        nextLabel: "Next category",
        panelAntipasti: "Starters",
        panelPrimi: "First Courses",
        panelSecondi: "Main Courses",
        panelContorni: "Sides",
        panelDessert: "Desserts",
        panelBevande: "Drinks & Coffee",
        note: "Our fresh pasta is handmade, produced by the artisan pasta-maker \"La Castellana\".",
        hint: "Flip through the menu like a book — use the arrows or the tabs above",
        footnoteHtml: "Cover charge €2.50 per person · Menu subject to seasonal changes · Allergen information available on request.",
        ctaBtn: "Book your table"
      },
      gallery: {
        eyebrow: "Gallery",
        title: "A look at the table",
        lead: "A taste of the dishes and the atmosphere at Giulivo.",
        items: [
          { alt: "A corner beneath the old olive tree, our terrace", caption: "Beneath the old olive tree" },
          { alt: "Tartare on slate, Giulivo's cuisine", caption: "House tartare" },
          { alt: "Seafood linguine", caption: "Seafood linguine" },
          { alt: "Pistachio-crusted tuna", caption: "Pistachio-crusted tuna" },
          { alt: "Mixed berry panna cotta", caption: "Mixed berry panna cotta" },
          { alt: "Mixed starter, tuna tartare and breaded fish", caption: "Mixed starters" },
          { alt: "Homemade tortellini, cream and crispy speck", caption: "Tortellini, cream and speck" },
          { alt: "Signature dish, natural plating", caption: "A Giulivo signature dish" },
          { alt: "Panna cotta and a glass of white wine on the terrace", caption: "Dessert and a glass on the terrace" },
          { alt: "Tables set on the terrace under the pergola", caption: "Tables ready on the terrace" },
          { alt: "Giulivo's veranda at sunset", caption: "Our veranda" },
          { alt: "The pergola on Giulivo's terrace", caption: "Our pergola" }
        ]
      },
      experience: {
        eyebrow: "The atmosphere",
        title: "An experience to live, not just a meal",
        text: "Amid the hills of Vicopisano, in a simple and well-kept setting, every dinner at Giulivo is a moment to share — good food, good company, buonumore."
      },
      reviews: {
        number: "4.7",
        count: "91 verified reviews on Google",
        readBtn: "Read reviews on Google",
        slide1: "« You come to eat well, and you go home with a smile. »",
        slide2: "« Sincere Tuscan cooking, in an atmosphere that feels like home. »",
        slide3: "« Buonumore guaranteed, at every table. »",
        note: "The spirit of Giulivo, in a few words — sincere Tuscan cuisine and a warm welcome.",
        chip1: "Genuine",
        chip2: "Welcoming",
        chip3: "Homemade",
        chip4: "Just like home",
        chip5: "Buonumore guaranteed"
      },
      contact: {
        bookEyebrow: "Book",
        bookTitle: "Request a table",
        bookText: "Fill in the details: WhatsApp will open with the message ready to send us. Your booking is confirmed only after our reply.",
        labelDate: "Date",
        labelTime: "Time",
        labelGuests: "Guests",
        labelNotes: "Notes (optional)",
        notesPlaceholder: "E.g. allergies, high chair, outdoor table…",
        submitBtn: "Request via WhatsApp",
        findEyebrow: "Find us",
        findTitle: "Come share a good moment",
        addressLabel: "Address",
        addressHtml: "Località Luchetta, 7<br>56010 Vicopisano PI, Italy",
        hoursLabel: "Hours",
        hoursHtml: "Evening service, until 11:00 PM<br><small>Please call to confirm opening days and to book.</small>",
        phoneLabel: "Phone",
        callBtn: "Call to book",
        whatsappBtn: "WhatsApp",
        mapTitle: "Location of Giulivo Cucina e Buonumore"
      },
      footer: {
        backTop: "Back to top ↑",
        country: "Italy"
      },
      modal: {
        title: "The full menu",
        closeLabel: "Close menu",
        panelLabel: "The full menu"
      }
    },

    de: {
      meta: {
        description: "Giulivo Cucina e Buonumore — authentische, hausgemachte toskanische Küche im Herzen von Vicopisano. Frische Pasta, Fleisch und Fisch der Saison und hausgemachte Desserts in herzlicher, geselliger Atmosphäre."
      },
      nav: {
        home: "Home",
        story: "Unsere Geschichte",
        menu: "Speisekarte",
        gallery: "Galerie",
        reviews: "Bewertungen",
        contact: "Kontakt",
        book: "Reservieren",
        burgerLabel: "Menü öffnen"
      },
      hero: {
        eyebrow: "Località Luchetta · Vicopisano · Toskana",
        text: "Eine authentische, hausgemachte toskanische Küche — frische Pasta, Fleisch und Fisch der Saison, serviert in einer einfachen, herzlichen und fröhlichen Atmosphäre, ganz wie zu Hause.",
        bookBtn: "Tisch reservieren",
        menuBtn: "Speisekarte entdecken",
        scrollLabel: "Nach unten scrollen",
        ratingHtml: "<strong>4,7</strong> auf Google · <span>91 Bewertungen</span>"
      },
      stats: {
        rating: "Google-Bewertung",
        reviews: "Kundenbewertungen",
        homemade: "Hausgemacht",
        openUntil: "Geöffnet bis"
      },
      marquee: { cuisine: "Toskanische Küche", homemade: "Hausgemacht" },
      story: {
        badgeSub: "jeden Tag",
        imgAlt: "Neu interpretiertes Tatar, sorgfältig auf Schiefer angerichtet bei Giulivo",
        eyebrow: "Unsere Geschichte",
        titleHtml: "Ein neues Leben, dieselbe Leidenschaft&nbsp;: ein herzlicher Empfang",
        p1: "Giulivo entstand aus Guidinos Wunsch, alles auf seine wahre Leidenschaft zu setzen : die toskanische Küche, großzügig und ehrlich. Nach einem bewegten Lebensweg entschied er sich, von vorne anzufangen und seinen eigenen Tisch in Vicopisano zu eröffnen, im Einklang mit traditionellen Rezepten und saisonalen Produkten.",
        p2Html: "Hier ist alles hausgemacht&nbsp;: die Pasta wird von Hand verarbeitet, Fleisch und Fisch mit Sorgfalt zubereitet, die Desserts vor Ort hergestellt. Man kommt, um gut zu essen, aber auch für den <em>buonumore</em> — die gute Laune —, die dem Haus seinen Namen gibt.",
        point1: "Hausgemachte frische Pasta",
        point2: "Fleisch & Fisch der Saison",
        point3: "Hausgemachte Desserts",
        point4: "Einfache, herzliche und gesellige Atmosphäre"
      },
      motto: {
        text: "« Es ist unsere Leidenschaft für gutes Essen, guten Wein und vor allem Geselligkeit, die uns zu diesem Abenteuer bewegt hat, bei dem wir die Gerichte der toskanischen Tradition mit einer Prise buonumore veredeln. Eine einfache Philosophie, denn das Rezept für Glück ist einfach: essen, trinken, zusammen sein, Freude und Emotionen teilen. »"
      },
      menu: {
        eyebrow: "Speisekarte",
        title: "Eine großzügige, saisonale toskanische Küche",
        lead: "Die Speisekarte ändert sich mit den Jahreszeiten und dem Markt. Hier der Geist der Karte, mit einem Vorgeschmack auf die Gerichte, aus denen sie besteht.",
        fullBtn: "Die ganze Speisekarte ansehen",
        card1Title: "Vorspeisen",
        card1Text: "Toskanische Vorspeisen mit frischen, saisonalen Zutaten, sorgfältig präsentiert.",
        card1Alt: "Fleischtatar auf Schiefer, eine Vorspeise von Giulivo",
        card2Title: "Hausgemachte Pasta",
        card2Text: "Frische Pasta, jeden Tag von Hand verarbeitet, nach toskanischer Tradition.",
        card2Alt: "Meeresfrüchte-Linguine mit Garnelen und Muscheln",
        card3Title: "Fleisch & Fisch",
        card3Text: "Fleisch und Fisch mit Leidenschaft zubereitet, je nach Tagesverfügbarkeit ausgewählt.",
        card3Alt: "Aufgeschnittener Thunfisch in Pistazienkruste, mit Salat serviert",
        card4Title: "Hausgemachte Desserts",
        card4Text: "Hausgemachte Desserts, um die Mahlzeit süß ausklingen zu lassen, ganz im Sinne italienischer Klassiker.",
        card4Alt: "Panna Cotta mit Waldbeeren, ein hausgemachtes Dessert",
        originAria: "Speisekarte nach Land oder Meer filtern",
        originAll: "Alle",
        originLand: "Land",
        originSea: "Meer",
        tabsAria: "Menükategorien",
        tabAntipasti: "Vorspeisen",
        tabPrimi: "Erste Gänge",
        tabSecondi: "Hauptgänge",
        tabContorni: "Beilagen",
        tabDessert: "Dessert",
        tabBevande: "Getränke",
        prevLabel: "Vorherige Kategorie",
        nextLabel: "Nächste Kategorie",
        panelAntipasti: "Vorspeisen",
        panelPrimi: "Erste Gänge",
        panelSecondi: "Hauptgänge",
        panelContorni: "Beilagen",
        panelDessert: "Dessert",
        panelBevande: "Getränke & Kaffee",
        note: "Unsere frische Pasta wird von Hand hergestellt, produziert von der handwerklichen Pastamanufaktur „La Castellana\".",
        hint: "Blättern Sie durch die Speisekarte wie in einem Buch — nutzen Sie die Pfeile oder die Reiter oben",
        footnoteHtml: "Gedeck 2,50 € pro Person · Speisekarte kann sich je nach Saison ändern · Allergeninformationen auf Anfrage.",
        ctaBtn: "Tisch reservieren"
      },
      gallery: {
        eyebrow: "Galerie",
        title: "Ein Blick auf den Tisch",
        lead: "Ein Vorgeschmack auf die Gerichte und die Atmosphäre bei Giulivo.",
        items: [
          { alt: "Eine Ecke unter dem alten Olivenbaum, unsere Terrasse", caption: "Unter dem alten Olivenbaum" },
          { alt: "Tatar auf Schiefer, die Küche von Giulivo", caption: "Hausgemachtes Tatar" },
          { alt: "Meeresfrüchte-Linguine", caption: "Meeresfrüchte-Linguine" },
          { alt: "Thunfisch in Pistazienkruste", caption: "Thunfisch in Pistazienkruste" },
          { alt: "Panna Cotta mit Waldbeeren", caption: "Panna Cotta mit Waldbeeren" },
          { alt: "Gemischte Vorspeise, Thunfischtatar und paniertes Fisch", caption: "Gemischte Vorspeisen" },
          { alt: "Hausgemachte Tortellini, Sahne und knuspriger Speck", caption: "Tortellini mit Sahne und Speck" },
          { alt: "Signature-Gericht, natürliche Präsentation", caption: "Ein Signature-Gericht von Giulivo" },
          { alt: "Panna Cotta und ein Glas Weißwein auf der Terrasse", caption: "Dessert und ein Glas auf der Terrasse" },
          { alt: "Gedeckte Tische auf der Terrasse unter der Pergola", caption: "Tische bereit auf der Terrasse" },
          { alt: "Die Veranda von Giulivo bei Sonnenuntergang", caption: "Unsere Veranda" },
          { alt: "Der Pergola-Bereich auf der Terrasse von Giulivo", caption: "Unser Pergola-Bereich" }
        ]
      },
      experience: {
        eyebrow: "Die Atmosphäre",
        title: "Ein Erlebnis zum Genießen, nicht nur ein Essen",
        text: "Zwischen den Hügeln von Vicopisano, in einer einfachen und gepflegten Umgebung, ist jedes Abendessen bei Giulivo ein Moment zum Teilen — gutes Essen, gute Gesellschaft, buonumore."
      },
      reviews: {
        number: "4,7",
        count: "91 verifizierte Bewertungen auf Google",
        readBtn: "Bewertungen auf Google lesen",
        slide1: "« Man kommt, um gut zu essen, und geht mit einem Lächeln nach Hause. »",
        slide2: "« Ehrliche toskanische Küche, in einer Atmosphäre, die sich wie zu Hause anfühlt. »",
        slide3: "« Gute Laune garantiert, an jedem Tisch. »",
        note: "Der Geist von Giulivo, in wenigen Worten — ehrliche toskanische Küche und herzlicher Empfang.",
        chip1: "Echt",
        chip2: "Herzlich",
        chip3: "Hausgemacht",
        chip4: "Wie zu Hause",
        chip5: "Gute Laune garantiert"
      },
      contact: {
        bookEyebrow: "Reservieren",
        bookTitle: "Tisch anfragen",
        bookText: "Füllen Sie die Details aus: WhatsApp öffnet sich mit der bereits fertigen Nachricht an uns. Die Reservierung ist erst nach unserer Antwort bestätigt.",
        labelDate: "Datum",
        labelTime: "Uhrzeit",
        labelGuests: "Personen",
        labelNotes: "Anmerkungen (optional)",
        notesPlaceholder: "Z. B. Allergien, Kindersitz, Tisch draußen…",
        submitBtn: "Über WhatsApp anfragen",
        findEyebrow: "So finden Sie uns",
        findTitle: "Kommen Sie und teilen Sie einen schönen Moment",
        addressLabel: "Adresse",
        addressHtml: "Località Luchetta, 7<br>56010 Vicopisano PI, Italien",
        hoursLabel: "Öffnungszeiten",
        hoursHtml: "Abendservice, bis 23:00 Uhr<br><small>Bitte rufen Sie an, um die Öffnungstage zu bestätigen und zu reservieren.</small>",
        phoneLabel: "Telefon",
        callBtn: "Anrufen zum Reservieren",
        whatsappBtn: "WhatsApp",
        mapTitle: "Standort von Giulivo Cucina e Buonumore"
      },
      footer: {
        backTop: "Zurück nach oben ↑",
        country: "Italien"
      },
      modal: {
        title: "Die vollständige Speisekarte",
        closeLabel: "Speisekarte schließen",
        panelLabel: "Die vollständige Speisekarte"
      }
    }
  };

  /* Menu dish descriptions, keyed by category then item index (0-based,
     in DOM order). Dish names themselves are identical in all three
     languages (kept in Italian), only the <small> subtitle changes —
     an empty string means "no subtitle in this language". */
  var menuDescriptions = {
    antipasti: [
      { it: "Su crema di pomodori gialli, melanzana fumè e olive disidratate", en: "On a cream of yellow tomatoes, smoked eggplant and dried olives", de: "Auf Creme von gelben Tomaten, geräucherter Aubergine und getrockneten Oliven" },
      { it: "Con asparagi, crema di pecorino semistagionato e crumble di mais", en: "Poached egg with asparagus, semi-aged pecorino cream and corn crumble", de: "Pochiertes Ei mit Spargel, Creme von mittelaltem Pecorino und Maiscrumble" },
      { it: "Affettati, formaggi, polentina e crostino ai fegatini", en: "Cured meats, cheeses, soft polenta and chicken liver crostino", de: "Aufschnitt, Käse, Polenta und Crostino mit Hühnerleber" },
      { it: "Cipolle in agrodolce, tuorlo marinato, crema di burrata e senape in grani", en: "Piedmontese beef tartare, sweet-and-sour onions, marinated egg yolk, burrata cream and mustard seeds", de: "Piemonteser Rindertatar, süß-saure Zwiebeln, mariniertes Eigelb, Burratacreme und Senfkörner" },
      { it: "", en: "Iberian Patanegra ham", de: "Iberischer Patanegra-Schinken" },
      { it: "", en: "Peppered mussels", de: "Gepfefferte Miesmuscheln" },
      { it: "Seppie alla griglia con finocchio croccante e pomodorini, tonno marinato alla curcuma, alici dorate con maionese d'aglio", en: "Grilled cuttlefish with crunchy fennel and cherry tomatoes, turmeric-marinated tuna, golden anchovies with garlic mayonnaise", de: "Gegrillter Tintenfisch mit knackigem Fenchel und Kirschtomaten, in Kurkuma marinierter Thunfisch, goldene Sardellen mit Knoblauchmayonnaise" }
    ],
    primi: [
      { it: "Con caprino fresco, granella di nocciole tostate e polvere di speck", en: "Aromatic herb risotto with fresh goat cheese, toasted hazelnuts and speck powder", de: "Kräuterrisotto mit frischem Ziegenkäse, gerösteten Haselnüssen und Speckpulver" },
      { it: "Con stracciatella e pesto", en: "Fresh tomato rigatoncini with stracciatella and pesto", de: "Rigatoncini mit frischer Tomate, Stracciatella und Pesto" },
      { it: "Ragù di ossobuco, olive taggiasche e zafferano", en: "Oxtail ragù with Taggiasca olives and saffron", de: "Ossobuco-Ragù mit Taggiasca-Oliven und Safran" },
      { it: "Su crema di porcini, fonduta di pecorino e guanciale croccante", en: "Potato cappellacci, porcini cream, pecorino fonduta and crispy guanciale", de: "Kartoffel-Cappellacci, Steinpilzcreme, Pecorino-Fonduta und knuspriger Guanciale" },
      { it: "", en: "Rigatoncini, Taranto style", de: "Rigatoncini nach Art von Taranto" },
      { it: "", en: "Chitarrini with mixed seafood", de: "Chitarrini mit gemischten Meeresfrüchten" }
    ],
    secondi: [
      { it: "Cipolle al vino rosso, soia e fonduta di pecorino semistagionato", en: "Pork fillet, red wine onions, soy and semi-aged pecorino fonduta", de: "Schweinefilet, Zwiebeln in Rotwein, Sojasauce und Fonduta aus mittelaltem Pecorino" },
      { it: "", en: "Duck breast in Chianti Classico", de: "Entenbrust in Chianti Classico" },
      { it: "", en: "Traditional Tuscan peppered beef stew", de: "Traditioneller toskanischer Pfeffer-Rindereintopf" },
      { it: "Con crudaiola di pomodori e rucola", en: "Beef rib, raw tomato and rocket salsa", de: "Rinderhochrippe mit Tomaten-Rucola-Salsa" },
      { it: "", en: "Fried squid and king prawns", de: "Frittierter Tintenfisch und Riesengarnelen" },
      { it: "Con riduzione di aceto balsamico", en: "Pistachio-crusted tuna, balsamic vinegar reduction", de: "Thunfisch in Pistazienkruste, Balsamico-Reduktion" }
    ],
    contorni: [
      { it: "", en: "Fries", de: "Pommes frites" },
      { it: "", en: "Roast potatoes", de: "Bratkartoffeln" },
      { it: "Secondo stagione", en: "Sautéed vegetables, seasonal", de: "Gebratenes Gemüse, je nach Saison" },
      { it: "", en: "Cannellini beans", de: "Weiße Bohnen" }
    ],
    dessert: [
      { it: "", en: "", de: "" },
      { it: "Frutti di bosco o cioccolata", en: "Mixed berries or chocolate", de: "Waldbeeren oder Schokolade" },
      { it: "Con coulis di fragole", en: "With strawberry coulis", de: "Mit Erdbeer-Coulis" },
      { it: "", en: "Almond biscuits with sweet wine", de: "Mandelkekse mit Süßwein" },
      { it: "", en: "Strawberries and cream", de: "Erdbeeren mit Sahne" },
      { it: "", en: "Ice cream", de: "Eis" }
    ],
    bevande: [
      { it: "", en: "Coffee", de: "Kaffee" },
      { it: "", en: "Spiked or macchiato coffee", de: "Kaffee mit Schuss oder Macchiato" },
      { it: "", en: "Canned soft drink", de: "Dose Softdrink" },
      { it: "", en: "Tuscan spiced coffee liqueur", de: "Toskanischer Kaffeelikör" },
      { it: "", en: "Amaro or grappa", de: "Amaro oder Grappa" },
      { it: "", en: "", de: "" },
      { it: "", en: "", de: "" }
    ]
  };

  function t(lang, key) {
    var dict = translations[lang] || translations.it;
    var parts = key.split(".");
    var node = dict;
    for (var i = 0; i < parts.length; i++) {
      if (node == null) return null;
      node = node[parts[i]];
    }
    return node;
  }

  function applyLanguage(lang) {
    if (!translations[lang]) lang = "it";
    document.documentElement.setAttribute("lang", lang);

    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", t(lang, "meta.description"));

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var val = t(lang, el.getAttribute("data-i18n"));
      if (val != null) el.textContent = val;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var val = t(lang, el.getAttribute("data-i18n-html"));
      if (val != null) el.innerHTML = val;
    });
    ["alt", "placeholder", "aria-label", "title"].forEach(function (attr) {
      document.querySelectorAll("[data-i18n-" + attr + "]").forEach(function (el) {
        var val = t(lang, el.getAttribute("data-i18n-" + attr));
        if (val != null) el.setAttribute(attr, val);
      });
    });
    document.querySelectorAll("[data-i18n-label]").forEach(function (el) {
      var val = t(lang, el.getAttribute("data-i18n-label"));
      if (val != null) el.setAttribute("data-label", val);
    });

    /* Gallery items, keyed by their position in the grid */
    document.querySelectorAll(".gallery__item").forEach(function (fig, i) {
      var item = translations[lang].gallery.items[i];
      if (!item) return;
      var img = fig.querySelector("img");
      var caption = fig.querySelector("figcaption");
      if (img) img.setAttribute("alt", item.alt);
      if (caption) caption.textContent = item.caption;
    });

    /* Menu dish subtitles: add/remove <small> so an empty translation
       never leaves a stray blank line. */
    document.querySelectorAll(".menu-list__name[data-desc]").forEach(function (nameEl) {
      var parts = nameEl.getAttribute("data-desc").split(".");
      var list = menuDescriptions[parts[0]];
      var item = list && list[parseInt(parts[1], 10)];
      var text = item ? item[lang] : "";
      var small = nameEl.querySelector("small");
      if (text) {
        if (!small) { small = document.createElement("small"); nameEl.appendChild(small); }
        small.textContent = text;
      } else if (small) {
        small.remove();
      }
    });

    document.querySelectorAll(".lang-link[data-lang]").forEach(function (a) {
      a.classList.toggle("is-active", a.getAttribute("data-lang") === lang);
    });

    try { localStorage.setItem("giulivoLang", lang); } catch (e) {}

    if (window.GiulivoRefreshCursor) window.GiulivoRefreshCursor();
  }

  function init(defaultLang) {
    var stored = null;
    try { stored = localStorage.getItem("giulivoLang"); } catch (e) {}
    applyLanguage(stored || defaultLang);

    document.querySelectorAll(".lang-link[data-lang]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        applyLanguage(a.getAttribute("data-lang"));
      });
    });
  }

  window.GiulivoI18n = { init: init, applyLanguage: applyLanguage, t: t };
})();
