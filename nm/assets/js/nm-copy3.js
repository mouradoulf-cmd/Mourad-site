/* NM Studio: copy for the "free first step" section (free mock-up + free Google listing check) and the founder section.
   Loaded after nm-copy2.js, deep-merged into the same dictionary. EN / FR / IT / TH / AR. */
(function () {
  "use strict";
  var C = {
    en: {
      free: {
        hero: "Get a free mock-up",
        eyebrow: "Free, no commitment",
        title: "Get your website <em>for free.</em>",
        lead: "The mock-up is free, with no commitment. Your website goes live as soon as you subscribe, and it stays online for as long as your subscription is active.",
        m_k: "Free mock-up", m_t: "Your future website in 48 hours",
        m_b: "Tell us the name of your business. We send you a mock-up of your site, with your name and your style. Then you decide, no pressure.",
        a_k: "Free check", a_t: "Your Google listing, reviewed",
        a_b: "We look at your Google listing the way a customer sees it: photos, opening hours, reviews, categories. You get 3 concrete tips, even if you never work with us.",
        f_name: "Business name", f_type: "Type of business", f_city: "City", f_first: "Your first name", f_maps: "City or Google Maps link",
        t_choose: "Choose", t_rest: "Restaurant", t_bar: "Bar or pub", t_cafe: "Café", t_beauty: "Salon or spa", t_shop: "Shop", t_company: "Company", t_other: "Other",
        m_btn: "Get my free mock-up", a_btn: "Get my free check",
        note: "We reply on WhatsApp, usually the same day.",
        req: "Please fill in the name of your business.",
        copied: "Message copied: paste it in WhatsApp and send.",
        msgM: "Hello NM Studio, I would like a free mock-up of my website.", msgA: "Hello NM Studio, I would like a free check of my Google listing.",
        l_name: "Business", l_type: "Type", l_city: "City", l_first: "First name", l_maps: "City or Maps",
        badge: "100% FREE", chip: "Free", s1: "Ask for your mock-up", s1b: "Free, takes 1 minute", s2: "Receive your website", s2b: "In 48 hours, with your name. Still free, no commitment", s3: "Love it? Subscribe", s3b: "Setup fee, then a monthly plan. We put your site online and email you the link", s4: "Your site stays online, every month", s4b: "Renews automatically while your subscription is active. Hosting, updates and changes included. Cancel anytime"
      },
      book: {
        k: "Video call", t: "Rather talk it through? Book 20 minutes", b: "A free video call to see together what your business needs. Pick a free slot.", tz: "Thailand time", local: "your time: {t}", taken: "Booked", pick: "Pick a slot first", btn: "Book this slot", sel: "Selected: {s}", msg: "Hello NM Studio, I would like to book a free video call.", l_slot: "Slot", none: "No free slot in the coming days: message us on WhatsApp.", copied: "Booking request copied: paste it in WhatsApp and send.",
        call: "Video call", dur: "20 min", b1: "We look at your business and your Google listing together", b2: "You see website examples for your type of business", b3: "You leave with a clear plan, even if you don't order", clock: "It is {t} in Thailand", step1: "Choose a day", step2: "Choose a time", step3: "Your details", sum: "Your appointment", sumNone: "Pick a day and a time", confirm: "Confirm my appointment", host: "with {name}, founder"
      },
      founder: {
        eyebrow: "Who is behind NM Studio",
        title: "One person, <em>not a call centre.</em>",
        body: "My name is {name}. I build the websites, QR menus and Google listings myself, and I am the one who answers you on WhatsApp. One contact, from the first message to the launch, and after.",
        p1: "Direct answers on WhatsApp", p2: "You approve everything before it goes live", p3: "Cancel the subscription anytime",
        sign: "{name}, founder of NM Studio"
      }
    },
    fr: {
      free: {
        hero: "Ma maquette gratuite",
        eyebrow: "Gratuit, sans engagement",
        title: "Recevez votre site <em>gratuitement.</em>",
        lead: "La maquette est gratuite et sans engagement. Votre site est mis en ligne dès que vous souscrivez l'abonnement, et il reste en ligne tant que l'abonnement est actif.",
        m_k: "Maquette offerte", m_t: "Votre futur site en 48 h",
        m_b: "Donnez-nous le nom de votre commerce. On vous envoie une maquette de votre site, avec votre nom et votre style. Vous décidez ensuite, sans pression.",
        a_k: "Audit offert", a_t: "Votre fiche Google, vérifiée",
        a_b: "On regarde votre fiche Google comme un client la voit : photos, horaires, avis, catégories. Vous recevez 3 conseils concrets, même si vous ne travaillez jamais avec nous.",
        f_name: "Nom du commerce", f_type: "Type de commerce", f_city: "Ville", f_first: "Votre prénom", f_maps: "Ville ou lien Google Maps",
        t_choose: "Choisir", t_rest: "Restaurant", t_bar: "Bar ou pub", t_cafe: "Café", t_beauty: "Salon ou spa", t_shop: "Boutique", t_company: "Entreprise", t_other: "Autre",
        m_btn: "Recevoir ma maquette", a_btn: "Recevoir mon audit",
        note: "On vous répond sur WhatsApp, en général dans la journée.",
        req: "Indiquez le nom de votre commerce.",
        copied: "Message copié : collez-le dans WhatsApp et envoyez.",
        msgM: "Bonjour NM Studio, je voudrais une maquette gratuite de mon site.", msgA: "Bonjour NM Studio, je voudrais un audit gratuit de ma fiche Google.",
        l_name: "Commerce", l_type: "Type", l_city: "Ville", l_first: "Prénom", l_maps: "Ville ou Maps",
        badge: "100 % GRATUIT", chip: "Gratuit", s1: "Vous demandez votre maquette", s1b: "Gratuit, en 1 minute", s2: "Vous recevez votre site", s2b: "En 48 h, à votre nom. Toujours gratuit, sans engagement", s3: "Il vous plaît ? Vous souscrivez l'abonnement", s3b: "Mise en place puis mensualité. On met votre site en ligne et vous recevez le lien par email", s4: "Votre site reste en ligne, chaque mois", s4b: "Renouvellement automatique tant que l'abonnement est actif. Hébergement, mises à jour et modifications inclus. Résiliable à tout moment"
      },
      book: {
        k: "Rendez-vous visio", t: "Préférez en parler ? Réservez 20 minutes", b: "Un appel vidéo gratuit pour voir ensemble ce dont votre commerce a besoin. Choisissez un créneau libre.", tz: "Heure de Thaïlande", local: "chez vous : {t}", taken: "Réservé", pick: "Choisissez d'abord un créneau", btn: "Réserver ce créneau", sel: "Créneau choisi : {s}", msg: "Bonjour NM Studio, je voudrais réserver un appel vidéo gratuit.", l_slot: "Créneau", none: "Plus de créneau libre ces jours-ci : écrivez-nous sur WhatsApp.", copied: "Demande copiée : collez-la dans WhatsApp et envoyez.",
        call: "Appel vidéo", dur: "20 min", b1: "On regarde ensemble votre commerce et votre fiche Google", b2: "Vous voyez des exemples de sites pour votre activité", b3: "Vous repartez avec un plan clair, même sans commander", clock: "Il est {t} en Thaïlande", step1: "Choisissez un jour", step2: "Choisissez une heure", step3: "Vos coordonnées", sum: "Votre rendez-vous", sumNone: "Choisissez un jour et une heure", confirm: "Confirmer mon rendez-vous", host: "avec {name}, fondateur"
      },
      founder: {
        eyebrow: "Qui est derrière NM Studio",
        title: "Une personne, <em>pas un centre d'appels.</em>",
        body: "Je m'appelle {name}. Je crée moi-même les sites, les menus QR et les fiches Google, et c'est moi qui vous réponds sur WhatsApp. Un seul interlocuteur, du premier message à la mise en ligne, et après.",
        p1: "Réponse directe sur WhatsApp", p2: "Vous validez tout avant la mise en ligne", p3: "Abonnement résiliable à tout moment",
        sign: "{name}, fondateur de NM Studio"
      }
    },
    it: {
      free: {
        hero: "La mia bozza gratuita",
        eyebrow: "Gratis, senza impegno",
        title: "Ricevete il vostro sito <em>gratis.</em>",
        lead: "La bozza è gratuita e senza impegno. Il vostro sito va online appena sottoscrivete l'abbonamento, e resta online finché l'abbonamento è attivo.",
        m_k: "Bozza gratuita", m_t: "Il vostro futuro sito in 48 ore",
        m_b: "Diteci il nome della vostra attività. Vi mandiamo una bozza del sito, con il vostro nome e il vostro stile. Poi decidete voi, senza pressioni.",
        a_k: "Verifica gratuita", a_t: "La vostra scheda Google, controllata",
        a_b: "Guardiamo la vostra scheda Google come la vede un cliente: foto, orari, recensioni, categorie. Ricevete 3 consigli concreti, anche se non lavorerete mai con noi.",
        f_name: "Nome dell'attività", f_type: "Tipo di attività", f_city: "Città", f_first: "Il vostro nome", f_maps: "Città o link Google Maps",
        t_choose: "Scegliete", t_rest: "Ristorante", t_bar: "Bar o pub", t_cafe: "Caffè", t_beauty: "Salone o spa", t_shop: "Negozio", t_company: "Azienda", t_other: "Altro",
        m_btn: "Ricevi la mia bozza", a_btn: "Ricevi la mia verifica",
        note: "Vi rispondiamo su WhatsApp, di solito in giornata.",
        req: "Indicate il nome della vostra attività.",
        copied: "Messaggio copiato: incollatelo su WhatsApp e inviate.",
        msgM: "Buongiorno NM Studio, vorrei una bozza gratuita del mio sito.", msgA: "Buongiorno NM Studio, vorrei una verifica gratuita della mia scheda Google.",
        l_name: "Attività", l_type: "Tipo", l_city: "Città", l_first: "Nome", l_maps: "Città o Maps",
        badge: "100% GRATIS", chip: "Gratis", s1: "Chiedete la vostra bozza", s1b: "Gratis, in 1 minuto", s2: "Ricevete il vostro sito", s2b: "In 48 ore, con il vostro nome. Sempre gratis, senza impegno", s3: "Vi piace? Sottoscrivete l'abbonamento", s3b: "Attivazione poi canone mensile. Mettiamo online il sito e vi inviamo il link via email", s4: "Il sito resta online, ogni mese", s4b: "Rinnovo automatico finché l'abbonamento è attivo. Hosting, aggiornamenti e modifiche inclusi. Disdicibile in qualsiasi momento"
      },
      book: {
        k: "Videochiamata", t: "Preferite parlarne? Prenotate 20 minuti", b: "Una videochiamata gratuita per capire insieme di cosa ha bisogno la vostra attività. Scegliete uno slot libero.", tz: "Ora della Thailandia", local: "da voi: {t}", taken: "Prenotato", pick: "Scegliete prima uno slot", btn: "Prenota questo slot", sel: "Slot scelto: {s}", msg: "Buongiorno NM Studio, vorrei prenotare una videochiamata gratuita.", l_slot: "Slot", none: "Nessuno slot libero nei prossimi giorni: scriveteci su WhatsApp.", copied: "Richiesta copiata: incollatela su WhatsApp e inviate.",
        call: "Videochiamata", dur: "20 min", b1: "Guardiamo insieme la vostra attività e la vostra scheda Google", b2: "Vedete esempi di siti per il vostro settore", b3: "Ripartite con un piano chiaro, anche senza ordinare", clock: "Sono le {t} in Thailandia", step1: "Scegliete un giorno", step2: "Scegliete un orario", step3: "I vostri dati", sum: "Il vostro appuntamento", sumNone: "Scegliete un giorno e un orario", confirm: "Conferma l'appuntamento", host: "con {name}, fondatore"
      },
      founder: {
        eyebrow: "Chi c'è dietro NM Studio",
        title: "Una persona, <em>non un call center.</em>",
        body: "Mi chiamo {name}. Creo io stesso i siti, i menù QR e le schede Google, e sono io a rispondervi su WhatsApp. Un solo interlocutore, dal primo messaggio alla messa online, e anche dopo.",
        p1: "Risposte dirette su WhatsApp", p2: "Approvate tutto prima della messa online", p3: "Abbonamento disdicibile in qualsiasi momento",
        sign: "{name}, fondatore di NM Studio"
      }
    },
    th: {
      free: {
        hero: "รับแบบร่างฟรี",
        eyebrow: "ฟรี ไม่มีข้อผูกมัด",
        title: "รับเว็บไซต์ของคุณ <em>ฟรี</em>",
        lead: "แบบร่างฟรี ไม่มีข้อผูกมัด เว็บไซต์ของคุณจะออนไลน์ทันทีที่คุณสมัครแพ็กเกจรายเดือน และจะออนไลน์ต่อไปตราบเท่าที่แพ็กเกจยังใช้งานอยู่",
        m_k: "แบบร่างฟรี", m_t: "เว็บไซต์ของคุณภายใน 48 ชั่วโมง",
        m_b: "บอกชื่อร้านของคุณมา เราจะส่งแบบร่างเว็บไซต์ที่มีชื่อร้านและสไตล์ของคุณให้ดู แล้วคุณค่อยตัดสินใจ ไม่มีการกดดัน",
        a_k: "ตรวจฟรี", a_t: "ตรวจโปรไฟล์ Google ของคุณ",
        a_b: "เราดูโปรไฟล์ Google ของคุณแบบที่ลูกค้าเห็น ทั้งรูป เวลาเปิดปิด รีวิว และหมวดหมู่ คุณจะได้คำแนะนำที่ใช้ได้จริง 3 ข้อ แม้จะไม่ได้ใช้บริการเราก็ตาม",
        f_name: "ชื่อร้าน", f_type: "ประเภทร้าน", f_city: "เมือง", f_first: "ชื่อของคุณ", f_maps: "เมือง หรือลิงก์ Google Maps",
        t_choose: "เลือก", t_rest: "ร้านอาหาร", t_bar: "บาร์หรือผับ", t_cafe: "คาเฟ่", t_beauty: "ร้านเสริมสวยหรือสปา", t_shop: "ร้านค้า", t_company: "บริษัท", t_other: "อื่น ๆ",
        m_btn: "รับแบบร่างของฉัน", a_btn: "รับผลตรวจของฉัน",
        note: "เราตอบทาง WhatsApp ปกติภายในวันเดียวกัน",
        req: "กรุณากรอกชื่อร้านของคุณ",
        copied: "คัดลอกข้อความแล้ว วางใน WhatsApp แล้วกดส่ง",
        msgM: "สวัสดีครับ NM Studio อยากได้แบบร่างเว็บไซต์ฟรีครับ", msgA: "สวัสดีครับ NM Studio อยากให้ช่วยตรวจโปรไฟล์ Google ฟรีครับ",
        l_name: "ร้าน", l_type: "ประเภท", l_city: "เมือง", l_first: "ชื่อ", l_maps: "เมือง หรือ Maps",
        badge: "ฟรี 100%", chip: "ฟรี", s1: "ขอแบบร่างของคุณ", s1b: "ฟรี ใช้เวลาแค่ 1 นาที", s2: "รับเว็บไซต์ของคุณ", s2b: "ภายใน 48 ชั่วโมง พร้อมชื่อร้านคุณ ยังฟรีและไม่มีข้อผูกมัด", s3: "ชอบไหม? สมัครแพ็กเกจรายเดือน", s3b: "ค่าติดตั้ง แล้วต่อด้วยค่าบริการรายเดือน เราเปิดเว็บไซต์ให้ออนไลน์ และส่งลิงก์ให้ทางอีเมล", s4: "เว็บไซต์ออนไลน์ต่อเนื่องทุกเดือน", s4b: "ต่ออายุอัตโนมัติตราบเท่าที่แพ็กเกจยังใช้งานอยู่ รวมโฮสติ้ง การอัปเดต และการแก้ไข ยกเลิกได้ทุกเมื่อ"
      },
      book: {
        k: "นัดคุยทางวิดีโอ", t: "อยากคุยก่อนไหม? จองเวลา 20 นาที", b: "วิดีโอคอลฟรี เพื่อดูด้วยกันว่าร้านของคุณต้องการอะไร เลือกช่วงเวลาที่ว่างได้เลย", tz: "เวลาประเทศไทย", local: "เวลาของคุณ: {t}", taken: "จองแล้ว", pick: "กรุณาเลือกช่วงเวลาก่อน", btn: "จองช่วงเวลานี้", sel: "เวลาที่เลือก: {s}", msg: "สวัสดีครับ NM Studio อยากจองวิดีโอคอลฟรีครับ", l_slot: "ช่วงเวลา", none: "ช่วงนี้ไม่มีเวลาว่าง ทักหาเราทาง WhatsApp ได้เลย", copied: "คัดลอกคำขอจองแล้ว วางใน WhatsApp แล้วกดส่ง",
        call: "วิดีโอคอล", dur: "20 นาที", b1: "เราดูร้านและโปรไฟล์ Google ของคุณไปด้วยกัน", b2: "คุณได้เห็นตัวอย่างเว็บไซต์สำหรับธุรกิจแบบคุณ", b3: "คุณได้แผนที่ชัดเจนกลับไป แม้จะยังไม่สั่ง", clock: "ตอนนี้ {t} ที่ประเทศไทย", step1: "เลือกวัน", step2: "เลือกเวลา", step3: "ข้อมูลของคุณ", sum: "นัดหมายของคุณ", sumNone: "เลือกวันและเวลา", confirm: "ยืนยันการนัดหมาย", host: "กับ {name} ผู้ก่อตั้ง"
      },
      founder: {
        eyebrow: "ใครอยู่เบื้องหลัง NM Studio",
        title: "คนจริง ๆ <em>ไม่ใช่คอลเซ็นเตอร์</em>",
        body: "ผมชื่อ {name} ผมทำเว็บไซต์ เมนู QR และโปรไฟล์ Google ด้วยตัวเอง และผมเป็นคนตอบคุณทาง WhatsApp เอง คุยกับคนเดียวตั้งแต่ข้อความแรกจนเว็บออนไลน์ และหลังจากนั้นด้วย",
        p1: "ตอบตรงทาง WhatsApp", p2: "คุณตรวจทุกอย่างก่อนออนไลน์", p3: "ยกเลิกค่าบริการรายเดือนได้ทุกเมื่อ",
        sign: "{name} ผู้ก่อตั้ง NM Studio"
      }
    },
    ar: {
      free: {
        hero: "احصل على نموذج مجاني",
        eyebrow: "مجانًا، بلا التزام",
        title: "احصل على موقعك <em>مجانًا.</em>",
        lead: "النموذج مجاني وبلا التزام. يُنشر موقعك على الإنترنت فور اشتراكك، ويبقى متاحًا طالما الاشتراك فعّال.",
        m_k: "نموذج مجاني", m_t: "موقعك المستقبلي خلال 48 ساعة",
        m_b: "أخبرنا باسم محلك، وسنرسل لك نموذجًا لموقعك باسمك وأسلوبك. ثم تقرر أنت، دون أي ضغط.",
        a_k: "فحص مجاني", a_t: "ملفك على جوجل، تحت المراجعة",
        a_b: "نراجع ملفك على جوجل كما يراه الزبون: الصور، ومواعيد العمل، والتقييمات، والفئات. تحصل على 3 نصائح عملية، حتى لو لم تعمل معنا أبدًا.",
        f_name: "اسم المحل", f_type: "نوع النشاط", f_city: "المدينة", f_first: "اسمك الأول", f_maps: "المدينة أو رابط خرائط جوجل",
        t_choose: "اختر", t_rest: "مطعم", t_bar: "بار أو حانة", t_cafe: "مقهى", t_beauty: "صالون أو سبا", t_shop: "متجر", t_company: "شركة", t_other: "آخر",
        m_btn: "أريد نموذجي المجاني", a_btn: "أريد الفحص المجاني",
        note: "نرد عليك عبر واتساب، عادةً في اليوم نفسه.",
        req: "يرجى كتابة اسم محلك.",
        copied: "تم نسخ الرسالة: الصقها في واتساب ثم أرسلها.",
        msgM: "مرحبًا NM Studio، أود الحصول على نموذج مجاني لموقعي.", msgA: "مرحبًا NM Studio، أود فحصًا مجانيًا لملفي على جوجل.",
        l_name: "المحل", l_type: "النوع", l_city: "المدينة", l_first: "الاسم", l_maps: "المدينة أو الخرائط",
        badge: "مجاني 100%", chip: "مجاني", s1: "اطلب نموذجك", s1b: "مجانًا، في دقيقة واحدة", s2: "استلم موقعك", s2b: "خلال 48 ساعة، باسم محلك. ما زال مجانيًا وبلا التزام", s3: "أعجبك؟ اشترك", s3b: "رسوم إعداد ثم اشتراك شهري. ننشر موقعك على الإنترنت ونرسل لك الرابط بالبريد الإلكتروني", s4: "موقعك يبقى على الإنترنت كل شهر", s4b: "يتجدد تلقائيًا طالما الاشتراك فعّال. الاستضافة والتحديثات والتعديلات مشمولة. يمكنك الإلغاء في أي وقت"
      },
      book: {
        k: "مكالمة فيديو", t: "تفضّل الحديث أولًا؟ احجز 20 دقيقة", b: "مكالمة فيديو مجانية لنرى معًا ما يحتاجه محلك. اختر موعدًا متاحًا.", tz: "بتوقيت تايلاند", local: "بتوقيتك: {t}", taken: "محجوز", pick: "اختر موعدًا أولًا", btn: "احجز هذا الموعد", sel: "الموعد المختار: {s}", msg: "مرحبًا NM Studio، أود حجز مكالمة فيديو مجانية.", l_slot: "الموعد", none: "لا مواعيد متاحة في الأيام القادمة: راسلنا عبر واتساب.", copied: "تم نسخ طلب الحجز: الصقه في واتساب ثم أرسله.",
        call: "مكالمة فيديو", dur: "20 دقيقة", b1: "نراجع معًا محلك وملفك على جوجل", b2: "تشاهد أمثلة مواقع لنشاطك", b3: "تخرج بخطة واضحة، حتى دون أن تطلب", clock: "الساعة الآن {t} في تايلاند", step1: "اختر يومًا", step2: "اختر وقتًا", step3: "بياناتك", sum: "موعدك", sumNone: "اختر يومًا ووقتًا", confirm: "تأكيد موعدي", host: "مع {name}، المؤسس"
      },
      founder: {
        eyebrow: "من وراء NM Studio",
        title: "شخص حقيقي، <em>لا مركز اتصال.</em>",
        body: "اسمي {name}. أصمم المواقع وقوائم QR وملفات جوجل بنفسي، وأنا من يرد عليك عبر واتساب. شخص واحد تتعامل معه، من أول رسالة حتى إطلاق الموقع، وبعده أيضًا.",
        p1: "ردود مباشرة عبر واتساب", p2: "توافق على كل شيء قبل النشر", p3: "يمكنك إلغاء الاشتراك في أي وقت",
        sign: "{name}، مؤسس NM Studio"
      }
    }
  };
  function deep(t, s) { Object.keys(s).forEach(function (k) { if (s[k] && typeof s[k] === "object") { t[k] = t[k] || {}; deep(t[k], s[k]); } else t[k] = s[k]; }); return t; }
  window.NM_EXTRA_DICT = deep(window.NM_EXTRA_DICT || {}, C);
})();
