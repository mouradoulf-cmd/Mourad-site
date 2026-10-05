/* NM Studio — copywriting pass (home + offers), EN / FR / IT / TH / AR.
   Loaded after nm-dict.js and before i18n.js: it deep-merges over the base dictionary, so this file is the
   single place to edit the sales copy. Rules: no em dashes, no filler ("real people, real results"),
   talk about customers and revenue, baht only. */
(function () {
  "use strict";
  var C = {
    en: {
      meta: {
        title: "Website, QR menu & Google listing for Pattaya businesses | NM Studio",
        description: "NM Studio builds websites, QR menus and Google Business Profiles for restaurants, bars, salons and shops in Pattaya. Live in days, no contract. From ฿990."
      },
      meta2: {
        services: { description: "Three offers for Pattaya businesses: Google listing, website with QR menu, Complete Pack. Prices in Thai baht." },
        pricing: { description: "Prices in Thai baht: Google listing ฿990 once, website ฿5,800 then ฿1,140 a month, Complete Pack ฿13,300 then ฿3,800 a month." }
      },
      v4: {
        title: "<span class=\"h__slogan\">Be found. <em>Be chosen.</em></span> <span class=\"h__kw\">Website, QR menu and Google listing for Pattaya businesses</span>",
        sub: "Restaurants, bars, salons and shops: tourists find you on Google, open your menu in their language and message you on WhatsApp.",
        offersTitle: "3 offers. <em>Pick yours.</em>",
        finaleTitle: "Ready for more <em>customers?</em>"
      },
      prob: {
        eyebrow: "Sound familiar?",
        title: "Every customer who can't find you <em>walks into the shop next door.</em>",
        lead: "Three problems cost Pattaya businesses customers and money every day. Each one has a simple fix.",
        problem: "The problem", fix: "The fix",
        p1t: "Tourists can't find you", p1b: "They search on Google Maps, not in the street. No listing, wrong hours or dark photos, and they pick the place next door.",
        s1t: "A Google listing that gets you chosen", s1b: "We create and optimise your Google Business Profile: photos, hours, categories, WhatsApp. Live in 48 hours.",
        p2t: "Your menu is a blurry photo", p2b: "Paper menus go out of date. Foreign visitors can't read them, so they order less or leave.",
        s2t: "A QR menu in their language", s2b: "Scan, read, order. Up to 5 languages, with photos and prices. A dish to change? One message.",
        p3t: "No website, no trust", p3b: "Visitors check your website before they walk in. Without one, the competitor who has a site gets the booking.",
        s3t: "A website that fills your tables", s3b: "Your photos, your prices, a WhatsApp button on every page. Visitors become customers.",
        cta: "Fix it with us on WhatsApp",
        flip: "See the fix", flipBack: "Back to the problem"
      },
      work: { eyebrow: "Our work", title: "7 real sites, <em>live now.</em>", lead: "Tap a site to open it." },
      offers: {
        title: "3 offers. <em>Pick yours.</em>",
        lead: "Prices in Thai baht. The Google listing is paid once. The website and the Complete Pack are a setup fee plus a monthly subscription, with hosting, edits and updates included.",
        website: { benefit: "A website built from your photos, with your menu, a QR code for every table and WhatsApp booking. Live in days.", i3: "Your menu and prices in up to 5 languages, with a print-ready QR code for every table" },
        pack: { benefit: "Website, Google listing and QR menu together. Everything a tourist looks for." }
      },
      svc: { lead: "Three offers, one goal: more customers walking through your door. Pick one, or let us help you choose." },
      why2: {
        title: "Built to bring you <em>customers.</em>",
        r1t: "We come to your shop", r1b: "We meet you in Pattaya, take the photos and set everything up. You never touch the tech.",
        r2t: "Live in days, not months", r2b: "Send your photos today. Your listing, menu or website is online within days, so you get found sooner.",
        r3t: "One message to change anything", r3b: "A new price, a new dish, a new photo: send it on WhatsApp and it's done. Cancel the subscription whenever you want."
      },
      process: {
        title: "Three steps. <em>Online in days.</em>",
        lead: "No meetings to prepare, no jargon. You run your business, we handle the rest.",
        s1d: "Step 1 · Today", s1t: "Send your photos", s1b: "Photos, menu and opening hours, straight on WhatsApp. That's all we need.",
        s2d: "Step 2 · Days 2 to 4", s2t: "We build everything", s2b: "Design, text, QR menu, Google Maps and every language your customers speak. You approve it, we adjust it.",
        s3d: "Step 3 · Within days", s3t: "You're live and getting found", s3b: "Your site and listing go online. Customers find you, open your menu and message you."
      },
      faq: { lead: "Another question? Message us on WhatsApp, we usually reply within minutes." }
    },

    fr: {
      meta: {
        title: "Site web, menu QR et fiche Google pour les commerces de Pattaya | NM Studio",
        description: "NM Studio crée des sites web, des menus QR et des fiches Google pour les restaurants, bars, salons et boutiques de Pattaya. En ligne en quelques jours, sans contrat. Dès ฿990."
      },
      meta2: {
        services: { description: "Trois offres pour les commerces de Pattaya : fiche Google, site web avec menu QR, Pack complet. Prix en bahts." },
        pricing: { description: "Prix en bahts : fiche Google ฿990 une fois, site web ฿5,800 puis ฿1,140 par mois, Pack complet ฿13,300 puis ฿3,800 par mois." }
      },
      v4: {
        title: "<span class=\"h__slogan\">Soyez trouvé. <em>Soyez choisi.</em></span> <span class=\"h__kw\">Site web, menu QR et fiche Google pour les commerces de Pattaya</span>",
        sub: "Restaurants, bars, salons, boutiques : les touristes vous trouvent sur Google, ouvrent votre menu dans leur langue et vous écrivent sur WhatsApp.",
        offersTitle: "3 offres. <em>Choisissez la vôtre.</em>",
        finaleTitle: "Prêt à avoir plus <em>de clients ?</em>"
      },
      prob: {
        eyebrow: "Ça vous parle ?",
        title: "Chaque client qui ne vous trouve pas <em>entre chez le voisin.</em>",
        lead: "Trois problèmes coûtent chaque jour des clients et de l'argent aux commerces de Pattaya. Chacun a une solution simple.",
        problem: "Le problème", fix: "La solution",
        p1t: "Les touristes ne vous trouvent pas", p1b: "Ils cherchent sur Google Maps, pas dans la rue. Sans fiche, avec de mauvais horaires ou des photos sombres, ils choisissent le commerce d'à côté.",
        s1t: "Une fiche Google qui vous fait choisir", s1b: "On crée et on optimise votre fiche Google : photos, horaires, catégories, WhatsApp. En ligne en 48 h.",
        p2t: "Votre menu est une photo floue", p2b: "Les menus papier se périment. Les touristes étrangers ne les comprennent pas : ils commandent moins ou partent.",
        s2t: "Un menu QR dans leur langue", s2b: "Ils scannent, lisent, commandent. Jusqu'à 5 langues, avec photos et prix. Un plat à changer ? Un seul message.",
        p3t: "Pas de site, pas de confiance", p3b: "Les visiteurs regardent votre site avant d'entrer. Sans site, le concurrent qui en a un prend la réservation.",
        s3t: "Un site qui remplit vos tables", s3b: "Vos photos, vos prix, un bouton WhatsApp sur chaque page. Les visiteurs deviennent des clients.",
        cta: "On règle ça ensemble sur WhatsApp",
        flip: "Voir la solution", flipBack: "Revenir au problème"
      },
      work: { eyebrow: "Nos réalisations", title: "7 vrais sites, <em>en ligne maintenant.</em>", lead: "Touchez un site pour l'ouvrir." },
      offers: {
        title: "3 offres. <em>Choisissez la vôtre.</em>",
        lead: "Prix en bahts. La fiche Google se paie une seule fois. Le site web et le Pack complet : une mise en place puis un abonnement mensuel, hébergement, modifications et mises à jour compris.",
        website: { benefit: "Un site construit à partir de vos photos, avec votre menu, un QR code pour chaque table et la réservation WhatsApp. En ligne en quelques jours.", i3: "Votre menu et vos prix en jusqu'à 5 langues, avec un QR code prêt à imprimer pour chaque table" },
        pack: { benefit: "Site web, fiche Google et menu QR réunis. Tout ce qu'un touriste cherche." }
      },
      svc: { lead: "Trois offres, un seul objectif : plus de clients qui franchissent votre porte. Choisissez, ou laissez-nous vous aider." },
      why2: {
        title: "Conçu pour vous apporter <em>des clients.</em>",
        r1t: "On vient chez vous", r1b: "On vous rencontre à Pattaya, on prend les photos et on s'occupe de tout. Vous ne touchez jamais à la technique.",
        r2t: "En ligne en quelques jours, pas en quelques mois", r2b: "Envoyez vos photos aujourd'hui. Votre fiche, votre menu ou votre site est en ligne en quelques jours : on vous trouve plus vite.",
        r3t: "Un message pour tout changer", r3b: "Un nouveau prix, un nouveau plat, une nouvelle photo : envoyez-le sur WhatsApp, c'est fait. Résiliez l'abonnement quand vous voulez."
      },
      process: {
        title: "Trois étapes. <em>En ligne en quelques jours.</em>",
        lead: "Aucune réunion à préparer, aucun jargon. Vous gérez votre activité, on s'occupe du reste.",
        s1d: "Étape 1 · Aujourd'hui", s1t: "Envoyez vos photos", s1b: "Photos, menu, horaires, directement sur WhatsApp. C'est tout ce qu'il nous faut.",
        s2d: "Étape 2 · Jours 2 à 4", s2t: "On construit tout", s2b: "Design, textes, menu QR, Google Maps et toutes les langues de vos clients. Vous validez, on ajuste.",
        s3d: "Étape 3 · En quelques jours", s3t: "Vous êtes en ligne et on vous trouve", s3b: "Votre site et votre fiche sont publiés. Les clients vous trouvent, ouvrent votre menu et vous écrivent."
      },
      faq: { lead: "Une autre question ? Écrivez-nous sur WhatsApp, on répond en général en quelques minutes." }
    },

    it: {
      meta: {
        title: "Sito web, menù QR e scheda Google per le attività di Pattaya | NM Studio",
        description: "NM Studio crea siti web, menù QR e schede Google per ristoranti, bar, saloni e negozi di Pattaya. Online in pochi giorni, senza contratto. Da ฿990."
      },
      meta2: {
        services: { description: "Tre offerte per le attività di Pattaya: scheda Google, sito web con menù QR, Pack completo. Prezzi in baht." },
        pricing: { description: "Prezzi in baht: scheda Google ฿990 una tantum, sito web ฿5,800 poi ฿1,140 al mese, Pack completo ฿13,300 poi ฿3,800 al mese." }
      },
      v4: {
        title: "<span class=\"h__slogan\">Fatti trovare. <em>Fatti scegliere.</em></span> <span class=\"h__kw\">Sito web, menù QR e scheda Google per le attività di Pattaya</span>",
        sub: "Ristoranti, bar, saloni e negozi: i turisti vi trovano su Google, aprono il menù nella loro lingua e vi scrivono su WhatsApp.",
        offersTitle: "3 offerte. <em>Scegliete la vostra.</em>",
        finaleTitle: "Pronti ad avere più <em>clienti?</em>"
      },
      prob: {
        eyebrow: "Vi suona familiare?",
        title: "Ogni cliente che non vi trova <em>entra dal vicino.</em>",
        lead: "Tre problemi fanno perdere ogni giorno clienti e soldi alle attività di Pattaya. Ognuno ha una soluzione semplice.",
        problem: "Il problema", fix: "La soluzione",
        p1t: "I turisti non vi trovano", p1b: "Cercano su Google Maps, non per strada. Senza scheda, con orari sbagliati o foto scure, scelgono il locale accanto.",
        s1t: "Una scheda Google che vi fa scegliere", s1b: "Creiamo e ottimizziamo la vostra scheda Google: foto, orari, categorie, WhatsApp. Online in 48 ore.",
        p2t: "Il vostro menù è una foto sfocata", p2b: "I menù di carta invecchiano. I turisti stranieri non li capiscono: ordinano meno o se ne vanno.",
        s2t: "Un menù QR nella loro lingua", s2b: "Inquadrano, leggono, ordinano. Fino a 5 lingue, con foto e prezzi. Un piatto da cambiare? Un solo messaggio.",
        p3t: "Niente sito, niente fiducia", p3b: "I visitatori guardano il vostro sito prima di entrare. Senza, la prenotazione va al concorrente che ce l'ha.",
        s3t: "Un sito che riempie i tavoli", s3b: "Le vostre foto, i vostri prezzi, un pulsante WhatsApp in ogni pagina. I visitatori diventano clienti.",
        cta: "Risolviamolo insieme su WhatsApp",
        flip: "Vedi la soluzione", flipBack: "Torna al problema"
      },
      work: { eyebrow: "I nostri lavori", title: "7 siti veri, <em>online ora.</em>", lead: "Toccate un sito per aprirlo." },
      offers: {
        title: "3 offerte. <em>Scegliete la vostra.</em>",
        lead: "Prezzi in baht. La scheda Google si paga una volta sola. Sito web e Pack completo: costo di avvio più abbonamento mensile, con hosting, modifiche e aggiornamenti inclusi.",
        website: { benefit: "Un sito costruito dalle vostre foto, con il menù, un QR code per ogni tavolo e la prenotazione su WhatsApp. Online in pochi giorni.", i3: "Menù e prezzi in fino a 5 lingue, con un QR code pronto da stampare per ogni tavolo" },
        pack: { benefit: "Sito web, scheda Google e menù QR insieme. Tutto ciò che cerca un turista." }
      },
      svc: { lead: "Tre offerte, un solo obiettivo: più clienti che varcano la vostra porta. Scegliete, o lasciate che vi aiutiamo." },
      why2: {
        title: "Pensato per portarvi <em>clienti.</em>",
        r1t: "Veniamo da voi", r1b: "Ci incontriamo a Pattaya, facciamo le foto e pensiamo a tutto. Voi non toccate la tecnica.",
        r2t: "Online in giorni, non in mesi", r2b: "Inviate le foto oggi. Scheda, menù o sito vanno online in pochi giorni, così vi trovano prima.",
        r3t: "Un messaggio per cambiare tutto", r3b: "Un prezzo nuovo, un piatto nuovo, una foto nuova: scrivete su WhatsApp e fatto. Disdite l'abbonamento quando volete."
      },
      process: {
        title: "Tre passi. <em>Online in pochi giorni.</em>",
        lead: "Nessuna riunione da preparare, niente gergo. Voi gestite l'attività, al resto pensiamo noi.",
        s1d: "Passo 1 · Oggi", s1t: "Inviate le foto", s1b: "Foto, menù e orari, direttamente su WhatsApp. Ci serve solo questo.",
        s2d: "Passo 2 · Giorni 2-4", s2t: "Costruiamo tutto noi", s2b: "Design, testi, menù QR, Google Maps e tutte le lingue dei vostri clienti. Voi approvate, noi ritocchiamo.",
        s3d: "Passo 3 · In pochi giorni", s3t: "Siete online e vi trovano", s3b: "Sito e scheda vanno online. I clienti vi trovano, aprono il menù e vi scrivono."
      },
      faq: { lead: "Un'altra domanda? Scriveteci su WhatsApp, di solito rispondiamo in pochi minuti." }
    },

    th: {
      meta: {
        title: "รับทำเว็บไซต์ เมนู QR และ Google Business Profile สำหรับร้านค้าในพัทยา | NM Studio",
        description: "NM Studio ทำเว็บไซต์ เมนู QR และ Google Business Profile ให้ร้านอาหาร บาร์ ร้านเสริมสวย และร้านค้าในพัทยา ออนไลน์ในไม่กี่วัน ไม่มีสัญญาผูกมัด เริ่มต้น ฿990"
      },
      meta2: {
        services: { description: "3 แพ็กเกจสำหรับธุรกิจในพัทยา: โปรไฟล์ Google, เว็บไซต์พร้อมเมนู QR และแพ็กเกจครบวงจร ราคาเป็นเงินบาท" },
        pricing: { description: "ราคาเป็นเงินบาท: โปรไฟล์ Google ฿990 จ่ายครั้งเดียว เว็บไซต์ ฿5,800 แล้ว ฿1,140 ต่อเดือน แพ็กเกจครบวงจร ฿13,300 แล้ว ฿3,800 ต่อเดือน" }
      },
      v4: {
        title: "<span class=\"h__slogan\">ให้ลูกค้าหาเจอ <em>และเลือกคุณ</em></span> <span class=\"h__kw\">เว็บไซต์ เมนู QR และ Google Business Profile สำหรับร้านค้าในพัทยา</span>",
        sub: "ร้านอาหาร บาร์ ร้านเสริมสวย และร้านค้า: นักท่องเที่ยวหาเจอบน Google เปิดเมนูในภาษาของเขา และทักหาคุณทาง WhatsApp",
        offersTitle: "3 แพ็กเกจ <em>เลือกแบบที่ใช่</em>",
        finaleTitle: "พร้อมมี<em>ลูกค้าเพิ่ม</em>หรือยัง?"
      },
      prob: {
        eyebrow: "ฟังดูคุ้นไหม?",
        title: "ทุกครั้งที่ลูกค้าหาคุณไม่เจอ <em>เขาเดินเข้าร้านข้าง ๆ แทน</em>",
        lead: "ร้านค้าในพัทยาเสียลูกค้าและรายได้ทุกวันเพราะ 3 ปัญหานี้ แต่ละข้อมีวิธีแก้ที่ง่ายมาก",
        problem: "ปัญหา", fix: "วิธีแก้",
        p1t: "นักท่องเที่ยวหาคุณไม่เจอ", p1b: "เขาค้นหาใน Google Maps ไม่ได้เดินหาตามถนน ถ้าไม่มีข้อมูลร้าน เวลาเปิดปิดผิด หรือรูปมืด เขาก็เลือกร้านข้าง ๆ",
        s1t: "โปรไฟล์ Google ที่ทำให้ลูกค้าเลือกคุณ", s1b: "เราสร้างและปรับแต่ง Google Business Profile ให้ ทั้งรูป เวลาเปิดปิด หมวดหมู่ และ WhatsApp เสร็จใน 48 ชั่วโมง",
        p2t: "เมนูของคุณเป็นรูปเบลอ", p2b: "เมนูกระดาษล้าสมัยเร็ว นักท่องเที่ยวต่างชาติอ่านไม่ออก จึงสั่งน้อยลงหรือเดินออกไป",
        s2t: "เมนู QR ในภาษาของลูกค้า", s2b: "สแกน อ่าน สั่ง ได้สูงสุด 5 ภาษา พร้อมรูปและราคา อยากเปลี่ยนเมนู ส่งข้อความเดียวพอ",
        p3t: "ไม่มีเว็บไซต์ ลูกค้าก็ไม่มั่นใจ", p3b: "คนส่วนใหญ่เช็กเว็บไซต์ก่อนเดินเข้าร้าน ถ้าไม่มี การจองจะไปตกที่คู่แข่งที่มีเว็บไซต์",
        s3t: "เว็บไซต์ที่ทำให้โต๊ะเต็ม", s3b: "รูปของคุณ ราคาของคุณ และปุ่ม WhatsApp ทุกหน้า ผู้เข้าชมกลายเป็นลูกค้า",
        cta: "ให้เราช่วยแก้ ทักทาง WhatsApp",
        flip: "ดูวิธีแก้", flipBack: "กลับไปที่ปัญหา"
      },
      work: { eyebrow: "ผลงานของเรา", title: "7 เว็บไซต์จริง <em>ออนไลน์อยู่ตอนนี้</em>", lead: "แตะที่เว็บไซต์เพื่อเปิดดู" },
      offers: {
        title: "3 แพ็กเกจ <em>เลือกแบบที่ใช่</em>",
        lead: "ราคาเป็นเงินบาท โปรไฟล์ Google จ่ายครั้งเดียว ส่วนเว็บไซต์และแพ็กเกจครบวงจรเป็นค่าเริ่มต้นบวกค่าบริการรายเดือน รวมโฮสติ้ง การแก้ไข และการอัปเดต",
        website: { benefit: "เว็บไซต์ที่ทำจากรูปของคุณ พร้อมเมนู QR code ประจำโต๊ะ และการจองผ่าน WhatsApp ออนไลน์ในไม่กี่วัน", i3: "เมนูและราคาได้สูงสุด 5 ภาษา พร้อม QR code สำหรับพิมพ์วางทุกโต๊ะ" },
        pack: { benefit: "เว็บไซต์ โปรไฟล์ Google และเมนู QR ครบในแพ็กเกจเดียว ทุกอย่างที่นักท่องเที่ยวมองหา" }
      },
      svc: { lead: "3 แพ็กเกจ เป้าหมายเดียว: ให้มีลูกค้าเดินเข้าร้านมากขึ้น เลือกเองได้ หรือให้เราช่วยเลือก" },
      why2: {
        title: "ออกแบบมาเพื่อ<em>พาลูกค้าเข้าร้านคุณ</em>",
        r1t: "เราไปหาคุณที่ร้าน", r1b: "เรานัดเจอคุณที่พัทยา ถ่ายรูปและจัดการให้ทุกอย่าง คุณไม่ต้องยุ่งกับเทคนิคเลย",
        r2t: "ออนไลน์ในไม่กี่วัน ไม่ใช่หลายเดือน", r2b: "ส่งรูปวันนี้ ข้อมูลร้าน เมนู หรือเว็บไซต์ขึ้นออนไลน์ภายในไม่กี่วัน ลูกค้าจะหาคุณเจอเร็วขึ้น",
        r3t: "แก้อะไรก็แค่ส่งข้อความเดียว", r3b: "ราคาใหม่ เมนูใหม่ รูปใหม่ ส่งมาทาง WhatsApp แล้วเสร็จ ยกเลิกค่าบริการรายเดือนได้ทุกเมื่อ"
      },
      process: {
        title: "3 ขั้นตอน <em>ออนไลน์ในไม่กี่วัน</em>",
        lead: "ไม่ต้องเตรียมประชุม ไม่มีศัพท์เทคนิค คุณทำธุรกิจ ที่เหลือเราจัดการ",
        s1d: "ขั้นที่ 1 · วันนี้", s1t: "ส่งรูปมา", s1b: "รูป เมนู และเวลาเปิดปิด ส่งทาง WhatsApp ได้เลย แค่นี้เราก็เริ่มได้",
        s2d: "ขั้นที่ 2 · วันที่ 2 ถึง 4", s2t: "เราสร้างให้ทุกอย่าง", s2b: "ดีไซน์ ข้อความ เมนู QR Google Maps และทุกภาษาที่ลูกค้าของคุณใช้ คุณตรวจ เราปรับให้",
        s3d: "ขั้นที่ 3 · ภายในไม่กี่วัน", s3t: "ออนไลน์ และลูกค้าหาเจอ", s3b: "เว็บไซต์และโปรไฟล์ของคุณเผยแพร่ ลูกค้าหาเจอ เปิดเมนู และส่งข้อความหาคุณ"
      },
      faq: { lead: "มีคำถามอื่น? ทักมาทาง WhatsApp ปกติเราตอบภายในไม่กี่นาที" }
    },

    ar: {
      meta: {
        title: "موقع إلكتروني وقائمة QR وملف جوجل للمحلات في باتايا | NM Studio",
        description: "يصمم NM Studio مواقع إلكترونية وقوائم QR وملفات جوجل للمطاعم والبارات والصالونات والمحلات في باتايا. جاهز خلال أيام وبلا عقود. ابتداءً من ฿990."
      },
      meta2: {
        services: { description: "ثلاثة عروض لمحلات باتايا: ملف جوجل، موقع مع قائمة QR، والباقة الكاملة. الأسعار بالبات التايلاندي." },
        pricing: { description: "الأسعار بالبات: ملف جوجل ฿990 مرة واحدة، الموقع ฿5,800 ثم ฿1,140 شهريًا، والباقة الكاملة ฿13,300 ثم ฿3,800 شهريًا." }
      },
      v4: {
        title: "<span class=\"h__slogan\">كن حاضرًا. <em>كن الخيار الأول.</em></span> <span class=\"h__kw\">موقع إلكتروني وقائمة QR وملف جوجل للمحلات في باتايا</span>",
        sub: "مطاعم وبارات وصالونات ومحلات: يجدك السياح على جوجل ويفتحون قائمتك بلغتهم ويراسلونك على واتساب.",
        offersTitle: "3 عروض. <em>اختر عرضك.</em>",
        finaleTitle: "مستعد لزبائن <em>أكثر؟</em>"
      },
      prob: {
        eyebrow: "هل يبدو هذا مألوفًا؟",
        title: "كل زبون لا يجدك <em>يدخل المحل المجاور.</em>",
        lead: "ثلاث مشاكل تكلّف محلات باتايا زبائن ومالًا كل يوم. ولكل منها حل بسيط.",
        problem: "المشكلة", fix: "الحل",
        p1t: "السياح لا يجدونك", p1b: "يبحثون في خرائط جوجل، لا في الشارع. بلا ملف، أو بمواعيد خاطئة وصور مظلمة، يختارون المحل المجاور.",
        s1t: "ملف جوجل يجعلهم يختارونك", s1b: "ننشئ ملفك على جوجل ونحسّنه: الصور والمواعيد والتصنيفات وواتساب. جاهز خلال 48 ساعة.",
        p2t: "قائمتك صورة غير واضحة", p2b: "القوائم الورقية تتقادم، والسياح الأجانب لا يفهمونها، فيطلبون أقل أو يغادرون.",
        s2t: "قائمة QR بلغتهم", s2b: "يمسحون ويقرؤون ويطلبون. حتى 5 لغات مع الصور والأسعار. تغيير طبق؟ رسالة واحدة.",
        p3t: "بلا موقع، بلا ثقة", p3b: "الزوار يتفقدون موقعك قبل أن يدخلوا. وبدونه تذهب الحجوزات إلى منافس لديه موقع.",
        s3t: "موقع يملأ طاولاتك", s3b: "صورك وأسعارك وزر واتساب في كل صفحة. الزوار يتحولون إلى زبائن.",
        cta: "لنصلحها معًا على واتساب",
        flip: "اعرض الحل", flipBack: "العودة إلى المشكلة"
      },
      work: { eyebrow: "أعمالنا", title: "7 مواقع حقيقية، <em>على الإنترنت الآن.</em>", lead: "المس أي موقع لفتحه." },
      offers: {
        title: "3 عروض. <em>اختر عرضك.</em>",
        lead: "الأسعار بالبات التايلاندي. ملف جوجل يُدفع مرة واحدة. أما الموقع والباقة الكاملة فرسوم تأسيس واشتراك شهري يشمل الاستضافة والتعديلات والتحديثات.",
        website: { benefit: "موقع مبني من صورك مع قائمتك ورمز QR لكل طاولة وحجز عبر واتساب. جاهز خلال أيام.", i3: "قائمتك وأسعارك حتى 5 لغات مع رمز QR جاهز للطباعة لكل طاولة" },
        pack: { benefit: "موقع وملف جوجل وقائمة QR معًا. كل ما يبحث عنه السائح." }
      },
      svc: { lead: "ثلاثة عروض وهدف واحد: زبائن أكثر عند بابك. اختر عرضًا أو دعنا نساعدك." },
      why2: {
        title: "صُمّم ليجلب لك <em>الزبائن.</em>",
        r1t: "نأتي إلى محلك", r1b: "نلتقيك في باتايا، نلتقط الصور ونتولى كل شيء. لا تلمس الجانب التقني أبدًا.",
        r2t: "جاهز خلال أيام لا أشهر", r2b: "أرسل صورك اليوم. ملفك أو قائمتك أو موقعك يصبح على الإنترنت خلال أيام، فيجدك الزبائن أسرع.",
        r3t: "رسالة واحدة لتغيير أي شيء", r3b: "سعر جديد أو طبق جديد أو صورة جديدة: أرسلها على واتساب وننجزها. ألغِ الاشتراك متى شئت."
      },
      process: {
        title: "ثلاث خطوات. <em>على الإنترنت خلال أيام.</em>",
        lead: "لا اجتماعات تحضّرها ولا مصطلحات تقنية. أنت تدير عملك ونحن نتولى الباقي.",
        s1d: "الخطوة 1 · اليوم", s1t: "أرسل صورك", s1b: "الصور والقائمة ومواعيد العمل مباشرة على واتساب. هذا كل ما نحتاجه.",
        s2d: "الخطوة 2 · من اليوم 2 إلى 4", s2t: "نبني كل شيء", s2b: "التصميم والنصوص وقائمة QR وخرائط جوجل وكل لغات زبائنك. توافق أنت ونعدّل نحن.",
        s3d: "الخطوة 3 · خلال أيام", s3t: "تصبح على الإنترنت ويجدك الزبائن", s3b: "يُنشر موقعك وملفك. يجدك الزبائن ويفتحون قائمتك ويراسلونك."
      },
      faq: { lead: "سؤال آخر؟ راسلنا على واتساب ونرد عادة خلال دقائق." }
    }
  };

  function deep(t, s) {
    Object.keys(s).forEach(function (k) {
      if (s[k] && typeof s[k] === "object") { t[k] = t[k] || {}; deep(t[k], s[k]); } else t[k] = s[k];
    });
    return t;
  }
  window.NM_EXTRA_DICT = deep(window.NM_EXTRA_DICT || {}, C);
})();
