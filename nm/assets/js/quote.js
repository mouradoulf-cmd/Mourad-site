/* NM Studio — "Start a project" page (start.html).
 *
 * Four steps, no backend: every answer stays in the page and the last button
 * builds one complete WhatsApp message. The studio's WhatsApp link is a QR
 * contact link, which ignores pre-filled text, so the message is also copied
 * to the clipboard for a one-tap paste.
 *
 * Translations live here (data-q attributes) so this page never depends on
 * nm-dict.js being edited. i18n.js, when present, still drives the language
 * switcher, <html lang/dir>, the header, the footer and its own meta tags;
 * it announces every change with the nm:lang event we listen to.
 */
(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var WA = "https://wa.me/qr/PYPOVXTCVM74I1";
  var MAX_STEP = 4;
  var LANGS = ["en", "fr", "it", "th", "ar"];

  /* ------------------------------------------------------------------ i18n */

  var DICT = {
    en: {
      meta: {
        title: "Start a project: your quote in 4 steps | NM Studio",
        description: "Four quick steps and your project request is ready for WhatsApp: your business, what you need, your customers' languages. No contract."
      },
      hero: {
        eyebrow: "Start a project",
        title: "Four steps. <em>One message.</em> Done.",
        lead: "No form to email, no account to create. Answer four quick questions, press one button, and your request lands on our WhatsApp, already written for you.",
        fact1: "About 60 seconds", fact2: "No payment on this page", fact3: "We reply within minutes"
      },
      form: {
        title: "Your project request", bar: "of 4 steps",
        almost: "Almost done.", almostSub: "Fix the fields marked in red and carry on.",
        privacy: "Your answers stay in this page. Nothing is stored or sent until you open WhatsApp.",
        live: "Step 1 of 4", sent: "Your message is ready below. Open WhatsApp and paste it.",
        liveStep: "Step {n} of 4"
      },
      step1: { name: "Your business", title: "What kind of place is it?", sub: "Pick the closest one. It tells us what your customers look for." },
      step2: { name: "What you need", title: "What do you want us to build?", sub: "Choose as many as you like. A QR menu and a Google profile are the fastest wins." },
      step3: { name: "Languages", title: "Which languages do your customers speak?", sub: "Tick the ones you hear most. Your menu and your site will speak them too." },
      step4: { name: "Contact", title: "Where do we reach you?", sub: "Only what we need to answer you. Nothing is sent anywhere until you press the button." },
      opt: { restaurant: "Restaurant", cafe: "Café or bar", salon: "Salon or spa", hotel: "Hotel or guesthouse", shop: "Shop or boutique", rental: "Scooter rental", other: "Something else", google: "Google profile", qr: "QR menu", web: "Website" },
      note: { google: "Be found on Maps", qr: "Your menu on every phone", web: "Your home online" },
      lang: { en: "English", fr: "French", it: "Italian", th: "Thai", ar: "Arabic", de: "German", ru: "Russian", zh: "Chinese" },
      f: {
        business: "Business name", area: "Area of Pattaya", first: "Your first name",
        wa: "WhatsApp number", notes: "Anything we should know?", optional: "(optional)"
      },
      ph: { business: "e.g. Malee Restaurant", first: "Malee", wa: "+66 81 234 5678", notes: "A link to your Instagram, your opening hours, the dishes you're proud of…" },
      area: { none: "Choose an area", central: "Central Pattaya", beach: "Pattaya Beach Road", jomtien: "Jomtien", naklua: "Naklua", pratamnak: "Pratumnak", walking: "Walking Street", other: "Somewhere else" },
      nav: { back: "Back", next: "Next step", finish: "See my message" },
      sum: {
        title: "Your request", from: "From", total: "Total",
        month: "/ month", hint: "Paid once · we confirm the final price together on WhatsApp.",
        hintSub: "The total is what you pay once (setup). Then {price} a month for hosting and updates. We confirm everything together on WhatsApp.",
        thenMonthly: "+ {price} / month",
        paidOnce: "Due once (setup)", monthly: "Then every month",
        live: "We reply within minutes", send: "Open WhatsApp with my request",
        copy: "Copy the message", copiedShort: "Copied", copied: "Message copied, paste it into the WhatsApp chat.",
        copyFailed: "Copying failed, select the text below and copy it.",
        copyHint: "Our WhatsApp link opens the chat. The message is copied so you can paste and send it in one tap.",
        r1: "Business", r2: "What you need", r3: "Languages", r4: "Name", r5: "Area", r6: "WhatsApp", r7: "Notes"
      },
      sent: { eyebrow: "Your message", title: "Ready to send.", sub: "This is exactly what we receive. Change anything above and it updates here.", chars: "characters" },
      empty: "Not filled in yet", none: "Not specified",
      err: { type: "Please choose the kind of business.", business: "Please tell us your business name.", first: "Please tell us your first name.", wa: "Please add your WhatsApp number, at least 6 digits." },
      msg: {
        head: "🎯 New project | NM Studio",
        business: "Business", type: "Type", needs: "What I need", langs: "My customers' languages",
        name: "My name", area: "Area of Pattaya", wa: "My WhatsApp", notes: "Details",
        price: "Estimated price", total: "Total",
        foot: "Sent from the NM Studio website."
      }
    },
    fr: {
      meta: {
        title: "Démarrer un projet: votre devis en 4 étapes | NM Studio",
        description: "Quatre étapes rapides et votre demande part sur WhatsApp : activité, besoins, langues de vos clients. Sans engagement."
      },
      hero: {
        eyebrow: "Démarrer un projet",
        title: "Quatre étapes. <em>Un message.</em> C'est fait.",
        lead: "Aucun formulaire à envoyer, aucun compte à créer. Répondez à quatre questions, appuyez sur un bouton : votre demande arrive sur notre WhatsApp, déjà rédigée.",
        fact1: "Environ 60 secondes", fact2: "Aucun paiement sur cette page", fact3: "Nous répondons en quelques minutes"
      },
      form: {
        title: "Votre demande de projet", bar: "sur 4 étapes",
        almost: "Presque terminé.", almostSub: "Corrigez les champs en rouge, puis continuez.",
        privacy: "Vos réponses restent dans cette page, rien n'est enregistré ni envoyé avant l'ouverture de WhatsApp.",
        live: "Étape 1 sur 4", sent: "Votre message est prêt ci-dessous. Ouvrez WhatsApp et collez-le.",
        liveStep: "Étape {n} sur 4"
      },
      step1: { name: "Votre activité", title: "Quel genre d'endroit est-ce ?", sub: "Choisissez le plus proche, cela nous dit ce que vos clients cherchent." },
      step2: { name: "Ce qu'il vous faut", title: "Que voulez-vous que nous créions ?", sub: "Choisissez-en autant que vous voulez. Un menu QR et une fiche Google sont les gains les plus rapides." },
      step3: { name: "Les langues", title: "Quelles langues parlent vos clients ?", sub: "Cochez celles que vous entendez le plus. Votre menu et votre site les parleront aussi." },
      step4: { name: "Coordonnées", title: "Comment vous joindre ?", sub: "Seulement le nécessaire pour vous répondre. Rien n'est envoyé avant l'appui sur le bouton." },
      opt: { restaurant: "Restaurant", cafe: "Café ou bar", salon: "Salon ou spa", hotel: "Hôtel ou guesthouse", shop: "Boutique", rental: "Location de scooters", other: "Autre chose", google: "Fiche Google", qr: "Menu QR", web: "Site web" },
      note: { google: "Être trouvé sur Maps", qr: "Votre menu sur chaque téléphone", web: "Votre vitrine en ligne" },
      lang: { en: "Anglais", fr: "Français", it: "Italien", th: "Thaï", ar: "Arabe", de: "Allemand", ru: "Russe", zh: "Chinois" },
      f: {
        business: "Nom du commerce", area: "Quartier de Pattaya", first: "Votre prénom",
        wa: "Votre numéro WhatsApp", notes: "Quelque chose à nous dire ?", optional: "(facultatif)"
      },
      ph: { business: "ex. Malee Restaurant", first: "Malee", wa: "+66 81 234 5678", notes: "Un lien vers votre Instagram, vos horaires, les plats dont vous êtes fier…" },
      area: { none: "Choisir un quartier", central: "Pattaya centre", beach: "Pattaya Beach Road", jomtien: "Jomtien", naklua: "Naklua", pratamnak: "Pratumnak", walking: "Walking Street", other: "Ailleurs" },
      nav: { back: "Retour", next: "Étape suivante", finish: "Voir mon message" },
      sum: {
        title: "Votre demande", from: "À partir de", total: "Total",
        month: "/ mois", hint: "Paiement unique · nous confirmons le prix final ensemble sur WhatsApp.",
        hintSub: "Le total est ce que vous payez une fois (mise en place). Ensuite {price} par mois pour l'hébergement et les mises à jour. Nous confirmons tout ensemble sur WhatsApp.",
        thenMonthly: "+ {price} / mois",
        paidOnce: "À payer une fois (mise en place)", monthly: "Puis chaque mois",
        live: "Nous répondons en quelques minutes", send: "Ouvrir WhatsApp avec ma demande",
        copy: "Copier le message", copiedShort: "Copié", copied: "Message copié, collez-le dans la conversation WhatsApp.",
        copyFailed: "La copie a échoué, sélectionnez le texte ci-dessous et copiez-le.",
        copyHint: "Notre lien WhatsApp ouvre la discussion. Le message est copié pour que vous n'ayez plus qu'à coller.",
        r1: "Activité", r2: "Ce qu'il vous faut", r3: "Langues", r4: "Prénom", r5: "Quartier", r6: "WhatsApp", r7: "Précisions"
      },
      sent: { eyebrow: "Votre message", title: "Prêt à envoyer.", sub: "Voici exactement ce que nous recevons. Modifiez une réponse : le message se met à jour.", chars: "caractères" },
      empty: "Pas encore rempli", none: "Non précisé",
      err: { type: "Choisissez le type de commerce.", business: "Indiquez le nom de votre commerce.", first: "Indiquez votre prénom.", wa: "Ajoutez votre numéro WhatsApp, au moins 6 chiffres." },
      msg: {
        head: "🎯 Nouveau projet | NM Studio",
        business: "Commerce", type: "Type", needs: "Ce qu'il me faut", langs: "Langues de mes clients",
        name: "Mon prénom", area: "Quartier de Pattaya", wa: "Mon WhatsApp", notes: "Précisions",
        price: "Prix estimé", total: "Total",
        foot: "Envoyé depuis le site NM Studio."
      }
    },
    it: {
      meta: {
        title: "Avvia un progetto: il tuo preventivo in 4 passi | NM Studio",
        description: "Quattro passi rapidi e la tua richiesta è pronta per WhatsApp: attività, cosa ti serve, lingue dei clienti. Senza vincoli."
      },
      hero: {
        eyebrow: "Avvia un progetto",
        title: "Quattro passi. <em>Un messaggio.</em> Fatto.",
        lead: "Nessun modulo da inviare, nessun account da creare. Rispondi a quattro domande, premi un pulsante e la tua richiesta arriva sul nostro WhatsApp, già scritta.",
        fact1: "Circa 60 secondi", fact2: "Nessun pagamento in questa pagina", fact3: "Rispondiamo in pochi minuti"
      },
      form: {
        title: "La tua richiesta", bar: "di 4 passi",
        almost: "Quasi fatto.", almostSub: "Correggi i campi in rosso e continua.",
        privacy: "Le tue risposte restano in questa pagina, nulla viene salvato o inviato prima di aprire WhatsApp.",
        live: "Passo 1 di 4", sent: "Il tuo messaggio è pronto qui sotto, apri WhatsApp e incollalo.",
        liveStep: "Passo {n} di 4"
      },
      step1: { name: "La tua attività", title: "Che tipo di locale è?", sub: "Scegli quello più vicino, ci dice cosa cercano i tuoi clienti." },
      step2: { name: "Cosa ti serve", title: "Cosa vuoi che creiamo?", sub: "Scegline quanti vuoi. Un menù QR e una scheda Google sono i risultati più rapidi." },
      step3: { name: "Le lingue", title: "Quali lingue parlano i tuoi clienti?", sub: "Spunta quelle che senti di più. Anche il menù e il sito le parleranno." },
      step4: { name: "Contatti", title: "Come ti raggiungiamo?", sub: "Solo l'essenziale per risponderti. Nulla viene inviato finché non premi il pulsante." },
      opt: { restaurant: "Ristorante", cafe: "Caffè o bar", salon: "Salone o spa", hotel: "Hotel o guesthouse", shop: "Negozio o boutique", rental: "Noleggio scooter", other: "Altro", google: "Scheda Google", qr: "Menù QR", web: "Sito web" },
      note: { google: "Farsi trovare su Maps", qr: "Il menù su ogni telefono", web: "La tua vetrina online" },
      lang: { en: "Inglese", fr: "Francese", it: "Italiano", th: "Thailandese", ar: "Arabo", de: "Tedesco", ru: "Russo", zh: "Cinese" },
      f: {
        business: "Nome dell'attività", area: "Zona di Pattaya", first: "Il tuo nome",
        wa: "Il tuo numero WhatsApp", notes: "Qualcosa da farci sapere?", optional: "(facoltativo)"
      },
      ph: { business: "es. Malee Restaurant", first: "Malee", wa: "+66 81 234 5678", notes: "Un link al tuo Instagram, gli orari, i piatti di cui vai fiero…" },
      area: { none: "Scegli una zona", central: "Pattaya centro", beach: "Pattaya Beach Road", jomtien: "Jomtien", naklua: "Naklua", pratamnak: "Pratumnak", walking: "Walking Street", other: "Altrove" },
      nav: { back: "Indietro", next: "Passo successivo", finish: "Vedi il mio messaggio" },
      sum: {
        title: "La tua richiesta", from: "Da", total: "Totale",
        month: "/ mese", hint: "Pagamento unico · confermiamo il prezzo finale insieme su WhatsApp.",
        hintSub: "Il totale è quello che paghi una volta (attivazione). Poi {price} al mese per hosting e aggiornamenti, confermiamo tutto insieme su WhatsApp.",
        thenMonthly: "+ {price} / mese",
        paidOnce: "Da pagare una volta (attivazione)", monthly: "Poi ogni mese",
        live: "Rispondiamo in pochi minuti", send: "Apri WhatsApp con la mia richiesta",
        copy: "Copia il messaggio", copiedShort: "Copiato", copied: "Messaggio copiato, incollalo nella chat WhatsApp.",
        copyFailed: "Copia non riuscita, seleziona il testo qui sotto e copialo.",
        copyHint: "Il nostro link WhatsApp apre la chat. Il messaggio è copiato, devi solo incollarlo.",
        r1: "Attività", r2: "Cosa ti serve", r3: "Lingue", r4: "Nome", r5: "Zona", r6: "WhatsApp", r7: "Dettagli"
      },
      sent: { eyebrow: "Il tuo messaggio", title: "Pronto da inviare.", sub: "Ecco esattamente cosa riceviamo. Cambia una risposta e il messaggio si aggiorna.", chars: "caratteri" },
      empty: "Non ancora compilato", none: "Non specificato",
      err: { type: "Scegli il tipo di attività.", business: "Indica il nome della tua attività.", first: "Indica il tuo nome.", wa: "Aggiungi il tuo numero WhatsApp, almeno 6 cifre." },
      msg: {
        head: "🎯 Nuovo progetto | NM Studio",
        business: "Attività", type: "Tipo", needs: "Cosa mi serve", langs: "Lingue dei miei clienti",
        name: "Il mio nome", area: "Zona di Pattaya", wa: "Il mio WhatsApp", notes: "Dettagli",
        price: "Prezzo stimato", total: "Totale",
        foot: "Inviato dal sito NM Studio."
      }
    },
    th: {
      meta: {
        title: "เริ่มโปรเจกต์: ประเมินราคาใน 4 ขั้นตอน | NM Studio",
        description: "ตอบ 4 ขั้นตอนสั้น ๆ แล้วส่งคำขอทาง WhatsApp: ธุรกิจของคุณ ต้องการอะไร และลูกค้าพูดภาษาใด ไม่มีสัญญา"
      },
      hero: {
        eyebrow: "เริ่มโปรเจกต์",
        title: "สี่ขั้นตอน <em>ข้อความเดียว</em> เสร็จ",
        lead: "ไม่ต้องส่งฟอร์มทางอีเมล ไม่ต้องสร้างบัญชี ตอบคำถามสั้น ๆ สี่ข้อ กดปุ่มเดียว คำขอของคุณจะไปถึง WhatsApp ของเรา โดยเขียนไว้ให้แล้ว",
        fact1: "ใช้เวลาราว 60 วินาที", fact2: "หน้านี้ไม่มีการชำระเงิน", fact3: "เราตอบกลับภายในไม่กี่นาที"
      },
      form: {
        title: "คำขอโปรเจกต์ของคุณ", bar: "จาก 4 ขั้นตอน",
        almost: "เกือบเสร็จแล้ว", almostSub: "แก้ช่องที่ทำเครื่องหมายสีแดงแล้วไปต่อ",
        privacy: "คำตอบของคุณอยู่ในหน้านี้เท่านั้น ไม่มีการบันทึกหรือส่งข้อมูลจนกว่าจะเปิด WhatsApp",
        live: "ขั้นตอนที่ 1 จาก 4", sent: "ข้อความของคุณพร้อมแล้วด้านล่าง เปิด WhatsApp แล้ววางได้เลย",
        liveStep: "ขั้นตอนที่ {n} จาก 4"
      },
      step1: { name: "ธุรกิจของคุณ", title: "ร้านของคุณเป็นแบบไหน?", sub: "เลือกอันที่ใกล้ที่สุด ช่วยให้เรารู้ว่าลูกค้าของคุณมองหาอะไร" },
      step2: { name: "สิ่งที่คุณต้องการ", title: "อยากให้เราทำอะไรให้?", sub: "เลือกได้หลายอย่าง เมนู QR และโปรไฟล์ Google เห็นผลเร็วที่สุด" },
      step3: { name: "ภาษา", title: "ลูกค้าของคุณพูดภาษาใด?", sub: "เลือกภาษาที่ได้ยินบ่อยที่สุด เมนูและเว็บไซต์ของคุณจะพูดภาษาเหล่านั้นด้วย" },
      step4: { name: "ช่องทางติดต่อ", title: "ให้เราติดต่อคุณอย่างไร?", sub: "ถามเท่าที่จำเป็นเท่านั้น ไม่มีการส่งข้อมูลใด ๆ จนกว่าจะกดปุ่ม" },
      opt: { restaurant: "ร้านอาหาร", cafe: "คาเฟ่หรือบาร์", salon: "ร้านเสริมสวยหรือสปา", hotel: "โรงแรมหรือเกสต์เฮาส์", shop: "ร้านค้าหรือบูติก", rental: "ร้านเช่ามอเตอร์ไซค์", other: "อื่น ๆ", google: "โปรไฟล์ Google", qr: "เมนู QR", web: "เว็บไซต์" },
      note: { google: "ให้เจอบน Maps", qr: "เมนูบนมือถือทุกเครื่อง", web: "หน้าร้านออนไลน์ของคุณ" },
      lang: { en: "อังกฤษ", fr: "ฝรั่งเศส", it: "อิตาลี", th: "ไทย", ar: "อาหรับ", de: "เยอรมัน", ru: "รัสเซีย", zh: "จีน" },
      f: {
        business: "ชื่อร้านหรือธุรกิจ", area: "ย่านในพัทยา", first: "ชื่อเล่นของคุณ",
        wa: "เบอร์ WhatsApp ของคุณ", notes: "มีอะไรอยากบอกเราไหม?", optional: "(ไม่บังคับ)"
      },
      ph: { business: "เช่น ร้านมาลี", first: "มาลี", wa: "+66 81 234 5678", notes: "ลิงก์ Instagram เวลาทำการ หรือเมนูที่คุณภูมิใจ…" },
      area: { none: "เลือกย่าน", central: "พัทยากลาง", beach: "ถนนเลียบหาดพัทยา", jomtien: "จอมเทียน", naklua: "นาเกลือ", pratamnak: "พระตำหนัก", walking: "Walking Street", other: "ที่อื่น" },
      nav: { back: "ย้อนกลับ", next: "ขั้นตอนถัดไป", finish: "ดูข้อความของฉัน" },
      sum: {
        title: "คำขอของคุณ", from: "เริ่มต้นที่", total: "รวม",
        month: "/ เดือน", hint: "จ่ายครั้งเดียว · เรายืนยันราคาสุดท้ายร่วมกันทาง WhatsApp",
        hintSub: "ยอดรวมคือค่าติดตั้งที่จ่ายครั้งเดียว จากนั้นเดือนละ {price} สำหรับโฮสติ้งและอัปเดต เรายืนยันทุกอย่างร่วมกันทาง WhatsApp",
        thenMonthly: "+ {price} / เดือน",
        paidOnce: "จ่ายครั้งเดียว (ค่าติดตั้ง)", monthly: "จากนั้นทุกเดือน",
        live: "เราตอบกลับภายในไม่กี่นาที", send: "เปิด WhatsApp พร้อมคำขอของฉัน",
        copy: "คัดลอกข้อความ", copiedShort: "คัดลอกแล้ว", copied: "คัดลอกข้อความแล้ว วางในแชท WhatsApp ได้เลย",
        copyFailed: "คัดลอกไม่สำเร็จ เลือกข้อความด้านล่างแล้วคัดลอกเอง",
        copyHint: "ลิงก์ WhatsApp ของเราจะเปิดแชทขึ้นมา ข้อความถูกคัดลอกไว้ให้แล้วเพียงวาง",
        r1: "ธุรกิจ", r2: "สิ่งที่ต้องการ", r3: "ภาษา", r4: "ชื่อ", r5: "ย่าน", r6: "WhatsApp", r7: "รายละเอียด"
      },
      sent: { eyebrow: "ข้อความของคุณ", title: "พร้อมส่งแล้ว", sub: "นี่คือข้อความที่เราจะได้รับจริง ๆ แก้คำตอบด้านบนแล้วข้อความจะอัปเดตทันที", chars: "ตัวอักษร" },
      empty: "ยังไม่ได้กรอก", none: "ไม่ได้ระบุ",
      err: { type: "กรุณาเลือกประเภทธุรกิจ", business: "กรุณากรอกชื่อธุรกิจของคุณ", first: "กรุณากรอกชื่อเล่นของคุณ", wa: "กรุณากรอกเบอร์ WhatsApp อย่างน้อย 6 หลัก" },
      msg: {
        head: "🎯 โปรเจกต์ใหม่ NM Studio",
        business: "ธุรกิจ", type: "ประเภท", needs: "สิ่งที่ต้องการ", langs: "ภาษาของลูกค้า",
        name: "ชื่อของฉัน", area: "ย่านในพัทยา", wa: "WhatsApp ของฉัน", notes: "รายละเอียด",
        price: "ราคาประเมิน", total: "รวม",
        foot: "ส่งจากเว็บไซต์ NM Studio"
      }
    },
    ar: {
      meta: {
        title: "ابدأ مشروعًا: عرض السعر في 4 خطوات | NM Studio",
        description: "أربع خطوات سريعة ويصبح طلبك جاهزًا على واتساب: نشاطك وما تحتاجه ولغات عملائك. بلا التزام."
      },
      hero: {
        eyebrow: "ابدأ مشروعًا",
        title: "أربع خطوات. <em>رسالة واحدة.</em> انتهى.",
        lead: "لا نموذج يُرسل بالبريد ولا حساب تُنشئه. أجب عن أربعة أسئلة سريعة، واضغط زرًا واحدًا، فيصل طلبك إلى واتساب مكتوبًا بالكامل.",
        fact1: "نحو 60 ثانية", fact2: "لا دفع في هذه الصفحة", fact3: "نجيب خلال دقائق"
      },
      form: {
        title: "طلب مشروعك", bar: "من 4 خطوات",
        almost: "اقتربت من النهاية.", almostSub: "صحّح الحقول المعلّمة بالأحمر ثم تابع.",
        privacy: "إجاباتك تبقى في هذه الصفحة، لا شيء يُحفظ أو يُرسل قبل فتح واتساب.",
        live: "الخطوة 1 من 4", sent: "رسالتك جاهزة بالأسفل، افتح واتساب والصقها.",
        liveStep: "الخطوة {n} من 4"
      },
      step1: { name: "نشاطك", title: "ما نوع مكانك؟", sub: "اختر الأقرب، يخبرنا بما يبحث عنه عملاؤك." },
      step2: { name: "ما تحتاجه", title: "ماذا تريد أن ننشئ؟", sub: "اختر ما تشاء. قائمة QR وملف Google هما الأسرع نتيجة." },
      step3: { name: "اللغات", title: "ما اللغات التي يتحدثها عملاؤك؟", sub: "اختر الأكثر شيوعًا. ستتحدث قائمتك وموقعك بها أيضًا." },
      step4: { name: "بيانات التواصل", title: "كيف نصل إليك؟", sub: "فقط ما نحتاجه للرد عليك. لا يُرسل شيء قبل الضغط على الزر." },
      opt: { restaurant: "مطعم", cafe: "مقهى أو بار", salon: "صالون أو سبا", hotel: "فندق أو بيت ضيافة", shop: "متجر أو بوتيك", rental: "تأجير دراجات", other: "شيء آخر", google: "ملف Google", qr: "قائمة QR", web: "موقع إلكتروني" },
      note: { google: "ليجدك الناس على الخرائط", qr: "قائمتك على كل هاتف", web: "واجهتك على الإنترنت" },
      lang: { en: "الإنجليزية", fr: "الفرنسية", it: "الإيطالية", th: "التايلاندية", ar: "العربية", de: "الألمانية", ru: "الروسية", zh: "الصينية" },
      f: {
        business: "اسم النشاط", area: "المنطقة في باتايا", first: "اسمك الأول",
        wa: "رقم واتساب", notes: "هل هناك ما يجب أن نعرفه؟", optional: "(اختياري)"
      },
      ph: { business: "مثال: مطعم مالي", first: "مالي", wa: "+66 81 234 5678", notes: "رابط إنستغرام، ساعات العمل، الأطباق التي تفتخر بها…" },
      area: { none: "اختر منطقة", central: "وسط باتايا", beach: "شارع شاطئ باتايا", jomtien: "جومتين", naklua: "ناكوا", pratamnak: "براتومنك", walking: "ووكينغ ستريت", other: "مكان آخر" },
      nav: { back: "رجوع", next: "الخطوة التالية", finish: "أعرض رسالتي" },
      sum: {
        title: "طلبك", from: "ابتداءً من", total: "الإجمالي",
        month: "/ شهريًا", hint: "دفعة واحدة · نؤكد السعر النهائي معًا على واتساب.",
        hintSub: "المجموع هو ما تدفعه مرة واحدة (الإعداد). ثم {price} شهريًا للاستضافة والتحديثات، نؤكد كل شيء معًا على واتساب.",
        thenMonthly: "+ {price} / شهريًا",
        paidOnce: "يُدفع مرة واحدة (الإعداد)", monthly: "ثم شهريًا",
        live: "نجيب خلال دقائق", send: "افتح واتساب مع طلبي",
        copy: "انسخ الرسالة", copiedShort: "تم النسخ", copied: "تم نسخ الرسالة، الصقها في محادثة واتساب.",
        copyFailed: "فشل النسخ، حدّد النص بالأسفل وانسخه يدويًا.",
        copyHint: "رابط واتساب يفتح المحادثة، والرسالة منسوخة لتلصقها بلمسة واحدة.",
        r1: "النشاط", r2: "ما تحتاجه", r3: "اللغات", r4: "الاسم", r5: "المنطقة", r6: "واتساب", r7: "تفاصيل"
      },
      sent: { eyebrow: "رسالتك", title: "جاهزة للإرسال.", sub: "هذه بالضبط الرسالة التي نستلمها. عدّل أي إجابة وستتحدث الرسالة فورًا.", chars: "حرفًا" },
      empty: "لم يُعبأ بعد", none: "غير محدد",
      err: { type: "اختر نوع النشاط من فضلك.", business: "اكتب اسم نشاطك من فضلك.", first: "اكتب اسمك الأول من فضلك.", wa: "أضف رقم واتساب، 6 أرقام على الأقل." },
      msg: {
        head: "🎯 مشروع جديد، NM Studio",
        business: "النشاط", type: "النوع", needs: "ما أحتاجه", langs: "لغات عملائي",
        name: "اسمي", area: "المنطقة في باتايا", wa: "واتساب", notes: "تفاصيل",
        price: "السعر التقديري", total: "الإجمالي",
        foot: "أُرسلت من موقع NM Studio."
      }
    }
  };

  /* Language: same detection order as i18n.js (URL parameter, then the
     stored choice, then the browser) so the two never disagree. */
  var lang = (function () {
    var l = null;
    try {
      var q = new URLSearchParams(location.search).get("lang");
      if (q && LANGS.indexOf(q) > -1) l = q;
    } catch (e) {}
    if (!l) l = window.NM_LANG;
    if (!l) { try { l = localStorage.getItem("nmLang"); } catch (e) {} }
    if (!l) l = (navigator.language || "en").toLowerCase().slice(0, 2);
    return LANGS.indexOf(l) > -1 ? l : "en";
  })();

  function t(key) {
    var parts = key.split("."), node = DICT[lang] || DICT.en, i;
    for (i = 0; i < parts.length; i++) { if (node == null) break; node = node[parts[i]]; }
    if (node == null) {
      node = DICT.en;
      for (i = 0; i < parts.length; i++) { if (node == null) break; node = node[parts[i]]; }
    }
    return node == null ? "" : node;
  }

  /* ------------------------------------------------------------------ state */

  var state = { step: 1, type: "", needs: [], langs: [], business: "", area: "", first: "", wa: "", notes: "" };
  var showErrors = false;

  function reduce() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function fieldEls() {
    return { business: $("#qBusiness"), area: $("#qArea"), first: $("#qFirst"), wa: $("#qWa"), notes: $("#qNotes") };
  }

  /* Read the text fields back into the state (the step 1-3 choices are read
     from their inputs directly, on change). */
  function sync() {
    var f = fieldEls();
    state.business = f.business ? f.business.value : "";
    state.area = f.area ? f.area.value : "";
    state.first = f.first ? f.first.value : "";
    state.wa = f.wa ? f.wa.value : "";
    state.notes = f.notes ? f.notes.value : "";
  }

  /* Text on screen ------------------------------------------------------- */

  function apply() {
    var root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";

    $$("[data-q]").forEach(function (el) { el.innerHTML = t(el.getAttribute("data-q")); });
    $$("[data-q-ph]").forEach(function (el) { el.setAttribute("placeholder", t(el.getAttribute("data-q-ph"))); });
    $$("[data-q-aria]").forEach(function (el) { el.setAttribute("aria-label", t(el.getAttribute("data-q-aria"))); });

    document.title = t("meta.title");
    var desc = $('meta[name="description"]');
    if (desc) desc.setAttribute("content", t("meta.description"));

    paintErrors();
    render();
  }

  function setLang(next) {
    if (LANGS.indexOf(next) === -1) return;
    lang = next;
    try { localStorage.setItem("nmLang", next); } catch (e) {}
    if (window.NMI18n && window.NMI18n.apply) {
      // i18n.js owns the header, the footer and <html lang/dir>; it fires
      // nm:lang, which runs apply() again with this page's strings.
      window.NMI18n.apply(next);
    } else {
      window.NM_LANG = next;
      apply();
    }
  }

  document.addEventListener("nm:lang", function (e) {
    var next = e.detail && e.detail.lang ? e.detail.lang : window.NM_LANG;
    if (next && LANGS.indexOf(next) > -1) lang = next;
    apply();
  });

  /* Steps ---------------------------------------------------------------- */

  function panes() { return $$(".qpane"); }

  function updateNav() {
    var prev = $("#qPrev"), next = $("#qNextLabel"), bar = $("#barStep"), fill = $("#barFill");
    var live = $("#quoteLive");
    if (prev) prev.hidden = state.step === 1;
    if (next) next.innerHTML = t(state.step === MAX_STEP ? "nav.finish" : "nav.next");
    if (bar) bar.textContent = state.step < 10 ? "0" + state.step : "" + state.step;
    if (fill) fill.style.transform = "scaleX(" + (state.step / MAX_STEP) + ")";
    if (live && state.step < MAX_STEP) live.textContent = t("form.liveStep").replace("{n}", state.step);
    $$(".qstep").forEach(function (b) {
      var n = +b.getAttribute("data-goto");
      b.setAttribute("aria-current", n === state.step ? "step" : "false");
      b.classList.toggle("is-done", n < state.step);
    });
    var panel = $(".qwa");
    if (panel) panel.classList.toggle("is-final", state.step === MAX_STEP);
  }

  function show(step, focusPane) {
    state.step = Math.max(1, Math.min(MAX_STEP, step));
    panes().forEach(function (p) {
      var on = +p.getAttribute("data-step") === state.step;
      p.classList.toggle("is-current", on);
      if (on) p.removeAttribute("hidden"); else p.setAttribute("hidden", "");
    });
    updateNav();
    if (focusPane) {
      var pane = $('.qpane[data-step="' + state.step + '"]');
      var head = pane ? $(".qpane__title", pane) : null;
      if (head) head.focus({ preventScroll: true });
      var top = $("#quote");
      if (top) top.scrollIntoView({ behavior: reduce() ? "auto" : "smooth", block: "start" });
    }
    if (state.step === MAX_STEP) reveal();
  }

  /* Validation ----------------------------------------------------------- */

  function hasWa(v) { return (String(v).match(/\d/g) || []).length >= 6; }

  function problems() {
    var list = [];
    if (!state.type) list.push("type");
    if (!state.business.trim()) list.push("business");
    if (!state.first.trim()) list.push("first");
    if (!hasWa(state.wa)) list.push("wa");
    return list;
  }

  var ERR_NODE = { business: "qBusinessErr", first: "qFirstErr", wa: "qWaErr" };

  function paintErrors() {
    var bad = problems();
    ["business", "first", "wa"].forEach(function (k) {
      var input = fieldEls()[k], node = document.getElementById(ERR_NODE[k]);
      var invalid = showErrors && bad.indexOf(k) > -1;
      if (input) input.setAttribute("aria-invalid", invalid ? "true" : "false");
      if (node) node.textContent = invalid ? t("err." + k) : "";
    });

    var typeErr = $("#e1-type"), needsErr = $("#e2-needs");
    var typeBad = showErrors && bad.indexOf("type") > -1;
    if (typeErr) {
      typeErr.textContent = typeBad ? t("err.type") : "";
      if (typeBad) typeErr.removeAttribute("hidden"); else typeErr.setAttribute("hidden", "");
    }
    if (needsErr) { needsErr.textContent = ""; needsErr.setAttribute("hidden", ""); }

    var banner = $(".qm");
    if (banner) banner.hidden = !(showErrors && bad.length > 0);
    return bad;
  }

  /* Summary and price ---------------------------------------------------- */

  function optLabel(v) { return t("opt." + v); }
  function langLabel(v) { return t("lang." + v); }

  /* Which offer a set of needs points at. Only used to show a real price from
     window.NM_OFFERS — nothing is invented when the config is absent. */
  function priceMap() {
    var O = window.NM_OFFERS;
    if (!O || !O.price) return null;
    if (state.needs.indexOf("web") > -1 || state.needs.indexOf("qr") > -1) return (O.sub && O.sub.website) ? "website" : "pack";
    if (state.needs.indexOf("google") > -1) return "google";
    return null;
  }

  function offersFor(needs) {
    var out = [], map = { google: "google", qr: "website", web: "website" };   /* the QR menu is part of the website offer */
    needs.forEach(function (n) {
      var id = map[n];
      if (!id) return;
      // a website alone is its own offer; with Google or the QR menu it is the
      // Complete Pack, which is the offer that actually bundles them
      if (id === "website" && needs.indexOf("google") > -1) id = "pack";
      if (out.indexOf(id) === -1) out.push(id);
    });
    return out;
  }

  /* Is this offer "setup + subscription"? Then the summary says what is due
     once and what comes back every month. */
  function subscriptionOf(id) {
    var O = window.NM_OFFERS;
    return (O && O.sub && O.sub[id]) || null;
  }

  function thb(n) {
    if (window.NMPrice && window.NMPrice.thb) return window.NMPrice.thb(n);
    var grouped = Math.round(n).toLocaleString("en-US");
    return lang === "th" ? grouped + " บาท" : "฿" + grouped;
  }
  function approxText(n) {
    if (window.NMPrice && window.NMPrice.approx) return window.NMPrice.approx(n);
    return "";
  }
  function offerName(id) { return optLabel(id === "pack" || id === "website" ? "web" : id); }

  function rows() {
    return [
      { k: "sum.r1", v: state.type ? optLabel(state.type) : "" },
      { k: "sum.r2", v: state.needs.length ? state.needs.map(optLabel).join(" · ") : "" },
      { k: "sum.r3", v: state.langs.length ? state.langs.map(langLabel).join(" · ") : "" },
      { k: "sum.r4", v: state.first.trim() },
      { k: "sum.r5", v: state.area ? t("area." + state.area) : "" },
      { k: "sum.r6", v: state.wa.trim(), ltr: true },
      { k: "sum.r7", v: state.notes.trim(), clamp: true }
    ];
  }

  function render() {
    var list = $("#sumList");
    if (list) {
      list.innerHTML = "";
      rows().forEach(function (r) {
        var li = document.createElement("li");
        var on = !!String(r.v).trim();
        li.className = "qsum__row" + (on ? " is-on" : "");
        var k = document.createElement("span");
        k.className = "qsum__k";
        k.textContent = t(r.k);
        var v = document.createElement("b");
        v.className = "qsum__v" + (r.clamp ? " qsum__v--clamp" : "");
        v.textContent = on ? r.v : t("empty");
        if (r.ltr) v.setAttribute("dir", "ltr");
        li.appendChild(k); li.appendChild(v);
        list.appendChild(li);
      });
    }

    var box = $("#sumPrice"), rowsEl = $("#sumRows"), totalEl = $("#sumTotal"), approxEl = $("#sumApprox");
    var map = priceMap(), O = window.NM_OFFERS;
    if (box && rowsEl) {
      if (map && O && O.price && O.price[map] != null) {
        var ids = offersFor(state.needs), sum = 0;
        rowsEl.innerHTML = "";
        ids.forEach(function (id) {
          var price = O.price[id];
          if (price == null) return;
          sum += price;
          var li = document.createElement("li");
          var name = document.createElement("span");
          name.textContent = offerName(id);
          var amt = document.createElement("b");
          amt.setAttribute("dir", "ltr");
          amt.textContent = thb(price);
          li.appendChild(name); li.appendChild(amt);
          // A subscribed offer also says what it costs every month.
          var sub = subscriptionOf(id);
          if (sub) {
            var line = document.createElement("small");
            line.className = "qsum__per";
            line.setAttribute("dir", "ltr");
            line.textContent = t("sum.thenMonthly").replace("{price}", thb(sub.monthly));
            li.appendChild(line);
          }
          rowsEl.appendChild(li);
        });
        if (!sum) { sum = O.price[map]; ids = [map]; }
        if (totalEl) { totalEl.textContent = thb(sum); totalEl.setAttribute("dir", "ltr"); }
        // The total is what is due once. With the website or the Complete Pack
        // in the selection, say what comes back every month as well.
        var hintEl = $("#sumHint");
        if (hintEl) {
          var monthly = ids.reduce(function (n, id) {
            var s = subscriptionOf(id);
            return n + (s ? s.monthly : 0);
          }, 0);
          hintEl.setAttribute("data-q", monthly ? "sum.hintSub" : "sum.hint");
          hintEl.textContent = monthly
            ? t("sum.hintSub").replace("{price}", thb(monthly))
            : t("sum.hint");
        }
        if (approxEl) {
          // One offer selected: the plain equivalent of that offer's price.
          // Several: the equivalent of the sum, so it always matches the line above.
          var amount = ids.length === 1 && O.price[ids[0]] != null ? O.price[ids[0]] : sum;
          var ap = approxText(amount);
          approxEl.textContent = ap;
          approxEl.hidden = !ap;
        }
        box.hidden = false;
      } else {
        rowsEl.innerHTML = "";
        box.hidden = true;
      }
    }

    var msg = buildMessage();
    var pre = $("#qMsg"), count = $("#qCount");
    if (pre) pre.textContent = msg;
    if (count) count.textContent = String(msg.length);

    var link = $("#qWaSend");
    if (link) link.href = WA + "?text=" + encodeURIComponent(msg);

    updateNav();
  }

  /* The WhatsApp message ------------------------------------------------- */

  function buildMessage() {
    var parts = [];
    parts.push(t("msg.head"));
    parts.push("");
    if (state.business.trim()) parts.push("*" + t("msg.business") + ":* " + state.business.trim());
    parts.push("*" + t("msg.type") + ":* " + (state.type ? optLabel(state.type) : t("none")));
    parts.push("*" + t("msg.needs") + ":* " + (state.needs.length ? state.needs.map(optLabel).join(", ") : t("none")));
    parts.push("*" + t("msg.langs") + ":* " + (state.langs.length ? state.langs.map(langLabel).join(", ") : t("none")));
    parts.push("*" + t("msg.name") + ":* " + (state.first.trim() || t("none")));
    if (state.area) parts.push("*" + t("msg.area") + ":* " + t("area." + state.area));
    if (state.wa.trim()) parts.push("*" + t("msg.wa") + ":* " + state.wa.trim());
    if (state.notes.trim()) parts.push("*" + t("msg.notes") + ":* " + state.notes.trim());

    var map = priceMap(), O = window.NM_OFFERS;
    if (map && O && O.price && O.price[map] != null) {
      var ids = offersFor(state.needs), sum = 0, monthly = 0;
      parts.push("");
      parts.push("*" + t("msg.price") + ":*");
      ids.forEach(function (id) {
        var price = O.price[id];
        if (price == null) return;
        sum += price;
        var sub = subscriptionOf(id);
        if (sub) monthly += sub.monthly;
        parts.push("• " + offerName(id) + " — " + thb(price) + (sub ? " + " + thb(sub.monthly) + " " + t("sum.month") : ""));
      });
      if (!sum) { sum = O.price[map]; parts.push("• " + offerName(map) + " — " + thb(sum)); }
      else if (ids.length > 1) parts.push("*" + t("msg.total") + ":* " + thb(sum));
      // "due once" then "every month" — the same two lines the checkout prints
      if (monthly) {
        parts.push("*" + t("sum.paidOnce") + ":* " + thb(sum));
        parts.push("*" + t("sum.monthly") + ":* " + thb(monthly) + " " + t("sum.month"));
      }
    }
    parts.push("");
    parts.push(t("msg.foot"));
    return parts.join("\n");
  }

  function reveal() {
    var box = $("#qsent");
    if (box) box.hidden = false;
    var live = $("#quoteLive");
    if (live) live.textContent = t("form.sent");
    var details = $("#qsumMobile");
    if (details) details.open = true;
  }

  /* Actions -------------------------------------------------------------- */

  /* Clipboard, most reliable path first: some browsers expose
     navigator.clipboard but refuse it (permissions, insecure context, an
     unfocused headless window), so the execCommand fallback is tried
     whenever the modern call rejects — not only when it is missing. */
  function legacyCopy(text) {
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.top = "-1000px";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, text.length);
        var ok = document.execCommand("copy");
        document.body.removeChild(ta);
        if (ok) resolve(); else reject(new Error("copy"));
      } catch (e) { reject(e); }
    });
  }

  function copyText(text) {
    var modern = navigator.clipboard && navigator.clipboard.writeText
      ? navigator.clipboard.writeText(text)
      : Promise.reject(new Error("no clipboard api"));
    return modern.catch(function () { return legacyCopy(text); });
  }

  function doCopy() {
    copyText(buildMessage()).then(function () {
      DYN.toast(t("sum.copied"));
      var label = $("#qCopyLabel");
      if (label) {
        label.textContent = t("sum.copiedShort");
        clearTimeout(DYN._labelTimer);
        DYN._labelTimer = setTimeout(function () { label.innerHTML = t("sum.copy"); }, 2600);
      }
    }, function () { DYN.toast(t("sum.copyFailed")); });
  }

  function advance() {
    sync();
    if (state.step < MAX_STEP) { show(state.step + 1, true); return; }
    // Last step: a missing answer is the only thing that can stop the message.
    showErrors = true;
    var bad = paintErrors();
    if (bad.length) {
      // The text fields live on step 4, the activity on step 1.
      show(bad.length === 1 && bad[0] === "type" ? 1 : MAX_STEP, true);
      return;
    }
    reveal();
    var msg = buildMessage();
    doCopy();
    DYN.openWhatsApp(msg);
  }

  function clock() {
    var el = $("#localTime");
    if (!el) return;
    try {
      el.textContent = new Date().toLocaleTimeString("en-GB", {
        timeZone: "Asia/Bangkok", hour: "2-digit", minute: "2-digit"
      });
    } catch (e) { el.textContent = "--:--"; }
  }

  /* Helpers this page adds for itself (start.html ships no toast script). */
  var DYN = {
    toast: function (msg) {
      var el = document.getElementById("toast");
      if (!el) {
        el = document.createElement("div");
        el.id = "toast";
        el.className = "toast";
        el.setAttribute("role", "status");
        el.setAttribute("aria-live", "polite");
        document.body.appendChild(el);
      }
      el.style.visibility = "visible";
      el.textContent = msg;
      el.classList.add("is-visible");
      clearTimeout(DYN._toastTimer);
      DYN._toastTimer = setTimeout(function () {
        el.classList.remove("is-visible");
        el.style.visibility = "";
      }, 5200);
    },
    openWhatsApp: function (message) {
      window.open(WA + "?text=" + encodeURIComponent(message), "_blank", "noopener");
    }
  };

  /* Wiring --------------------------------------------------------------- */

  /* The site's flag sprite only covers EN/FR/IT/TH/AR, so the three extra
     language chips get a small lettered badge instead. Decorative only: the
     chip already carries its language name. */
  function languageBadges() {
    var code = {
      en: "EN", fr: "FR", it: "IT", th: "TH", ar: "AR",
      de: "DE", ru: "RU", zh: "中文"
    };
    $$(".qchip").forEach(function (chip) {
      if ($(".qchip__badge", chip)) return;
      var input = $("input[name=langs]", chip);
      var box = $(".qchip__box", chip);
      if (!input || !box) return;
      var flag = $(".flag", box);
      if (flag) flag.remove();
      var badge = document.createElement("span");
      badge.className = "qchip__badge";
      badge.setAttribute("aria-hidden", "true");
      badge.textContent = code[input.value] || "";
      box.insertBefore(badge, box.firstChild);
    });
  }

  function init() {
    var form = $("#quoteForm");

    if (form) {
      form.addEventListener("change", function (e) {
        if (e.target && e.target.name === "type") {
          state.type = ($("input[name=type]:checked") || {}).value || "";
        }
        state.needs = $$("input[name=needs]:checked").map(function (i) { return i.value; });
        state.langs = $$("input[name=langs]:checked").map(function (i) { return i.value; });
        sync();
        paintErrors();
        render();
      });
      form.addEventListener("input", function (e) {
        sync();
        if (showErrors || (e.target && e.target.getAttribute("aria-invalid") === "true")) paintErrors();
        render();
      });
      form.addEventListener("submit", function (e) { e.preventDefault(); advance(); });
    }

    var next = $("#qNext");
    if (next) next.addEventListener("click", advance);
    var prev = $("#qPrev");
    if (prev) prev.addEventListener("click", function () { show(state.step - 1, true); });

    $$(".qstep").forEach(function (b) {
      b.addEventListener("click", function () {
        var target = +b.getAttribute("data-goto");
        if (target < state.step) show(target, true); else advance();
      });
    });

    var copy = $("#qCopy");
    if (copy) copy.addEventListener("click", doCopy);

    // The site's language switcher: i18n.js normally handles it (it listens
    // for [data-lang] too), this is the fallback when i18n.js is absent.
    document.addEventListener("click", function (e) {
      var b = e.target.closest(".lang__list [data-lang], .flag-btn[data-lang]");
      if (b) setLang(b.getAttribute("data-lang"));
    });

    var burger = $("#burger"), menu = $("#menu");
    if (burger && menu) {
      burger.addEventListener("click", function () {
        var open = menu.hidden;
        menu.hidden = !open;
        burger.setAttribute("aria-expanded", String(open));
        if (open) { var first = $("a", menu); if (first) first.focus(); }
      });
      window.addEventListener("keydown", function (e) {
        if (e.key !== "Escape") return;
        if (!menu.hidden) { menu.hidden = true; burger.setAttribute("aria-expanded", "false"); burger.focus(); }
      });
    }

    var header = $("#header");
    if (header) {
      var onScroll = function () { header.classList.toggle("is-solid", window.scrollY > 24); };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    var quote = $("#quote"), bar = $("#quoteBar");
    if (bar && quote && "IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { bar.classList.toggle("is-stuck", !en.isIntersecting); });
      }, { threshold: 0 }).observe(quote);
    }

    clock();
    setInterval(clock, 30000);
  }

  init();
  languageBadges();
  // i18n.js may already have applied its own language (it runs after this
  // file): adopt whatever it chose, then paint this page's strings.
  if (window.NM_LANG && LANGS.indexOf(window.NM_LANG) > -1) lang = window.NM_LANG;
  apply();
  show(1, false);
})();
