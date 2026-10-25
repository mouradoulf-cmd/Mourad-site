/* NM Studio — the Thailand offers (Oct 2026): QR menu 390 baht/month (free setup) and Website + QR menu 790 baht/month.
 * THAI ONLY: the Thai site (and its private French reading copy /nm/th-fr/) drops the Google listing and the old Thai
 * price list; every other language keeps its regular offers and prices, untouched (asked by Mourad).
 * Loaded before i18n.js, after every other dictionary file.
 * The offer cards themselves are built by thai-offers.js from O below (window.NM_OFFERS2). */
(function () {
  "use strict";
  var C = {
    en: {
      v4: { offersTitle: "Two offers. <em>Simple, monthly.</em>", proof1: "QR menu · ฿390/month", proof2: "Free setup",
        title: "<span class=\"h__slogan\">Be found. <em>Be chosen.</em></span> <span class=\"h__kw\">Website and QR menu for restaurants and local businesses</span>" },
      offers: { lead: "Prices in Thai baht. A monthly subscription with hosting, changes and updates included. Every business is different: let's meet and talk about yours.", eyebrow: "Offers" },
      prob: { cap5: "Website and QR menu: we handle it all, every month. You just cook." },
      process: { s2b: "Design, text, QR menu and every language your customers speak. You approve it, we adjust it.", s3b: "Your website and QR menu go online. Customers find you, open your menu and message you." },
      promise: { a2: "Two clear prices: QR menu ฿390 a month, website ฿790 a month. No surprises.", a5: "QR menu ready in 48 hours. Website live in days, not weeks." },
      free: { a_k: "QR menu offered", a_t: "Your QR menu, first month free", a_b: "I turn your menu into a QR menu in your customers' languages. Free setup, first month free: you only pay if you keep it (฿390 a month).", a_btn: "Get my free QR menu", msgA: "Hello NM Studio, I would like my free QR menu." },
      book: { b1: "We look at your business and your menu together", b2: "You see examples of websites and QR menus for your trade" }
    },
    fr: {
      v4: { offersTitle: "Deux offres. <em>Simples, au mois.</em>", proof1: "Menu QR · 390 ฿/mois", proof2: "Installation gratuite",
        title: "<span class=\"h__slogan\">Soyez trouvé. <em>Soyez choisi.</em></span> <span class=\"h__kw\">Site web et menu QR pour les restaurants et commerces</span>" },
      offers: { lead: "Prix en bahts thaïlandais. Un abonnement mensuel, hébergement, modifications et mises à jour compris. Chaque commerce est différent : rencontrons-nous pour parler du vôtre.", eyebrow: "Offres" },
      prob: { cap5: "Site web et menu QR : on s'occupe de tout, chaque mois. Vous, vous cuisinez." },
      process: { s2b: "Design, textes, menu QR et toutes les langues de vos clients. Vous validez, on ajuste.", s3b: "Votre site et votre menu QR sont en ligne. Les clients vous trouvent, ouvrent votre menu et vous écrivent." },
      promise: { a2: "Deux prix clairs : menu QR 390 ฿ par mois, site web 790 ฿ par mois. Pas de surprise.", a5: "Menu QR prêt en 48 h. Site en ligne en quelques jours, pas en semaines." },
      free: { a_k: "Menu QR offert", a_t: "Votre menu QR, 1er mois offert", a_b: "Je transforme votre carte en menu QR dans les langues de vos clients. Installation gratuite, 1er mois offert : vous ne payez que si vous le gardez (390 ฿ par mois).", a_btn: "Recevoir mon menu QR", msgA: "Bonjour NM Studio, je voudrais mon menu QR gratuit." },
      book: { msg: "Bonjour NM Studio, je voudrais prendre rendez-vous pour un menu QR / un site web.", b1: "On regarde ensemble votre commerce et votre carte", b2: "Vous voyez des exemples de sites et de menus QR pour votre activité" }
    },
    it: {
      v4: { offersTitle: "Due offerte. <em>Semplici, al mese.</em>", proof1: "Menù QR · 390 ฿/mese", proof2: "Installazione gratuita",
        title: "<span class=\"h__slogan\">Fatti trovare. <em>Fatti scegliere.</em></span> <span class=\"h__kw\">Sito web e menù QR per ristoranti e attività locali</span>" },
      offers: { lead: "Prezzi in baht thailandesi. Un abbonamento mensile con hosting, modifiche e aggiornamenti inclusi. Ogni attività è diversa: incontriamoci per parlare della vostra.", eyebrow: "Offerte" },
      prob: { cap5: "Sito web e menù QR: ci pensiamo noi, ogni mese. Voi pensate a cucinare." },
      process: { s2b: "Design, testi, menù QR e tutte le lingue dei vostri clienti. Voi approvate, noi ritocchiamo.", s3b: "Sito e menù QR vanno online. I clienti vi trovano, aprono il menù e vi scrivono." },
      promise: { a2: "Due prezzi chiari: menù QR 390 ฿ al mese, sito web 790 ฿ al mese. Nessuna sorpresa.", a5: "Menù QR pronto in 48 ore. Sito online in pochi giorni, non settimane." },
      free: { a_k: "Menù QR in regalo", a_t: "Il vostro menù QR, primo mese gratis", a_b: "Trasformo il vostro menù in un menù QR nelle lingue dei vostri clienti. Installazione gratuita, primo mese gratis: pagate solo se lo tenete (390 ฿ al mese).", a_btn: "Ricevere il mio menù QR", msgA: "Buongiorno NM Studio, vorrei il mio menù QR gratuito." },
      book: { b1: "Guardiamo insieme la vostra attività e il vostro menù", b2: "Vedete esempi di siti e menù QR per la vostra attività" }
    },
    th: {
      v4: { offersTitle: "2 แพ็กเกจ <em>จ่ายรายเดือน</em>", proof1: "เมนู QR · 390 บาท/เดือน", proof2: "ติดตั้งฟรี",
        title: "<span class=\"h__slogan\">ให้ลูกค้าหาเจอ <em>และเลือกคุณ</em></span> <span class=\"h__kw\">เว็บไซต์และเมนู QR สำหรับร้านอาหารและธุรกิจท้องถิ่น</span>" },
      offers: { lead: "ราคาเป็นเงินบาท จ่ายรายเดือน รวมโฮสติ้ง การแก้ไข และการอัปเดต แต่ละร้านไม่เหมือนกัน นัดคุยกันเรื่องร้านของคุณได้เลย", eyebrow: "แพ็กเกจ" },
      prob: { cap5: "เว็บไซต์และเมนู QR เราดูแลให้ทุกเดือน คุณแค่ทำอาหาร" },
      process: { s2b: "ดีไซน์ ข้อความ เมนู QR และทุกภาษาที่ลูกค้าของคุณใช้ คุณตรวจ เราปรับให้", s3b: "เว็บไซต์และเมนู QR ของคุณออนไลน์แล้ว ลูกค้าหาเจอ เปิดเมนู และส่งข้อความหาคุณ" },
      promise: { a2: "ราคาชัดเจน 2 แบบ: เมนู QR 390 บาท/เดือน เว็บไซต์ 790 บาท/เดือน ไม่มีค่าใช้จ่ายแอบแฝง", a5: "เมนู QR พร้อมใน 48 ชั่วโมง เว็บไซต์ออนไลน์ในไม่กี่วัน ไม่ใช่หลายสัปดาห์" },
      free: { a_k: "เมนู QR ฟรี", a_t: "เมนู QR ของคุณ ใช้ฟรีเดือนแรก", a_b: "ผมเปลี่ยนเมนูของคุณเป็นเมนู QR หลายภาษาตามลูกค้าของคุณ ติดตั้งฟรี ใช้ฟรีเดือนแรก จ่ายเฉพาะเมื่ออยากใช้ต่อ (390 บาท/เดือน)", a_btn: "รับเมนู QR ฟรี", msgA: "สวัสดีค่ะ NM Studio อยากได้เมนู QR ฟรีค่ะ" },
      book: { msg: "สวัสดีครับ NM Studio อยากนัดคุยเรื่องเมนู QR / เว็บไซต์ครับ", b1: "ผมกับคุณดูร้านและเมนูของคุณไปด้วยกัน", b2: "ดูตัวอย่างเว็บไซต์และเมนู QR ที่เหมาะกับร้านของคุณ" },
      founder: { body: "ผมทำงานด้านเว็บไซต์และเมนู QR มานานหลายปี ภรรยาของผมเข้าใจเจ้าของร้านชาวไทย ส่วนผมเป็นชาวต่างชาติ จึงเข้าใจลูกค้าต่างชาติ เมื่อรวมกัน เราจึงเข้าใจทั้งสองฝั่ง" }
    },
    ar: {
      v4: { offersTitle: "عرضان. <em>بسيطان وشهريان.</em>", proof1: "قائمة QR · ‏390 ฿ شهريًا", proof2: "تركيب مجاني",
        title: "<span class=\"h__slogan\">كن حاضرًا. <em>كن الخيار الأول.</em></span> <span class=\"h__kw\">موقع إلكتروني وقائمة QR للمطاعم والمحلات</span>" },
      offers: { lead: "الأسعار بالبات التايلاندي. اشتراك شهري يشمل الاستضافة والتعديلات والتحديثات. لكل نشاط ظروفه: لنلتقِ ونتحدث عن نشاطك.", eyebrow: "العروض" },
      prob: { cap5: "موقع إلكتروني وقائمة QR: نتولّى كل شيء كل شهر. وأنت تطبخ فقط." },
      process: { s2b: "التصميم والنصوص وقائمة QR وكل لغات زبائنك. توافق أنت ونعدّل نحن.", s3b: "يُنشر موقعك وقائمة QR. يجدك الزبائن ويفتحون قائمتك ويراسلونك." },
      promise: { a2: "سعران واضحان: قائمة QR ‏390 ฿ شهريًا، والموقع ‏790 ฿ شهريًا. بلا مفاجآت.", a5: "قائمة QR جاهزة خلال 48 ساعة. موقعك على الإنترنت في أيام، لا في أسابيع." },
      free: { a_k: "قائمة QR مجانًا", a_t: "قائمة QR الخاصة بك، الشهر الأول مجانًا", a_b: "أحوّل قائمتك إلى قائمة QR بلغات زبائنك. تركيب مجاني والشهر الأول مجانًا: لا تدفع إلا إذا احتفظت بها (‏390 ฿ شهريًا).", a_btn: "احصل على قائمتي المجانية", msgA: "مرحبًا NM Studio، أريد قائمة QR المجانية." },
      book: { b1: "نراجع معًا محلك وقائمتك", b2: "ترى أمثلة لمواقع وقوائم QR تناسب نشاطك" }
    }
  };
  // founder.body: same text, without the Google listing
  var CUT = {
    en: ["every website, QR menu and Google listing", "every website and QR menu"],
    fr: ["chaque site, chaque menu QR et chaque fiche Google", "chaque site et chaque menu QR"],
    it: ["ogni sito, ogni menù QR e ogni scheda Google", "ogni sito e ogni menù QR"],
    ar: ["كل موقع وكل قائمة QR وكل ملف على جوجل", "كل موقع وكل قائمة QR"]
  };

  // The two offer cards (thai-offers.js renders them in every language).
  window.NM_OFFERS2 = {
    price: { menu: 390, site: 790 },
    en: { per: "/ month", cur: "฿", book: "Book a meeting", demo: "See a QR menu example", free: "Free setup",
      meetK: "Free meeting · 20 min", meetT: "Every business is different.", note: "We meet at your place or by video call, and work out together what you need. No commitment.",
      menu: { kicker: "The easiest way to start", name: "QR menu", benefit: "Your menu translated into your customers' languages, with photos and a waiter screen in Thai.",
        list: ["Menu in 6 languages with photos", "“Show the waiter” screen in Thai", "Prices and dishes changed whenever you want", "QR code ready to print for your tables"] },
      site: { kicker: "The complete solution", badge: "Most complete", name: "Website + QR menu", benefit: "A website in your image, built from your photos, that helps customers find you on Google. Your QR menu is included.",
        list: ["Website in your customers' languages", "QR menu included", "WhatsApp / LINE button to book", "Hosting, changes and updates included"] } },
    fr: { per: "/ mois", cur: "฿", book: "Prendre rendez-vous", demo: "Voir un exemple de menu QR", free: "Installation gratuite",
      meetK: "Rendez-vous gratuit · 20 min", meetT: "Chaque commerce est différent.", note: "On se voit chez vous ou en visio, et on regarde ensemble ce qu'il vous faut. Sans engagement.",
      menu: { kicker: "Le plus simple pour commencer", name: "Menu QR", benefit: "Votre carte traduite dans les langues de vos clients, avec photos et un écran serveur en thaï.",
        list: ["Menu en 6 langues avec photos", "Écran « montrer au serveur » en thaï", "Prix et plats modifiés quand vous voulez", "QR code prêt à imprimer pour vos tables"] },
      site: { kicker: "La solution complète", badge: "Le plus complet", name: "Site web + menu QR", benefit: "Un site à votre image, construit avec vos photos, qui aide vos clients à vous trouver sur Google. Votre menu QR est inclus.",
        list: ["Site dans les langues de vos clients", "Menu QR inclus", "Bouton WhatsApp / LINE pour réserver", "Hébergement, modifications et mises à jour compris"] } },
    it: { per: "/ mese", cur: "฿", book: "Prendere appuntamento", demo: "Vedere un esempio di menù QR", free: "Installazione gratuita",
      meetK: "Appuntamento gratuito · 20 min", meetT: "Ogni attività è diversa.", note: "Ci vediamo da voi o in videochiamata e capiamo insieme cosa vi serve. Senza impegno.",
      menu: { kicker: "Il modo più semplice per iniziare", name: "Menù QR", benefit: "Il vostro menù tradotto nelle lingue dei vostri clienti, con foto e una schermata per il cameriere in thailandese.",
        list: ["Menù in 6 lingue con foto", "Schermata « mostra al cameriere » in thailandese", "Prezzi e piatti modificati quando volete", "Codice QR pronto da stampare per i tavoli"] },
      site: { kicker: "La soluzione completa", badge: "Il più completo", name: "Sito web + menù QR", benefit: "Un sito a vostra immagine, costruito con le vostre foto, che aiuta i clienti a trovarvi su Google. Il menù QR è incluso.",
        list: ["Sito nelle lingue dei vostri clienti", "Menù QR incluso", "Pulsante WhatsApp / LINE per prenotare", "Hosting, modifiche e aggiornamenti inclusi"] } },
    th: { per: "/ เดือน", cur: "บาท", book: "นัดพูดคุย", demo: "ดูตัวอย่างเมนู QR", free: "ติดตั้งฟรี",
      meetK: "นัดคุยฟรี · 20 นาที", meetT: "แต่ละร้านไม่เหมือนกัน", note: "เราไปคุยที่ร้านของคุณหรือทางวิดีโอคอล แล้วดูด้วยกันว่าร้านของคุณต้องการอะไร ไม่มีข้อผูกมัด",
      menu: { kicker: "เริ่มต้นง่ายที่สุด", name: "เมนู QR", benefit: "เมนูของคุณแปลเป็นภาษาของลูกค้า พร้อมรูปอาหาร และหน้าจอสำหรับพนักงานเป็นภาษาไทย",
        list: ["เมนู 6 ภาษา พร้อมรูปอาหาร", "หน้าจอ «แสดงให้พนักงานดู» เป็นภาษาไทย", "เปลี่ยนราคาและรายการอาหารได้ตลอด", "QR code พร้อมพิมพ์วางบนโต๊ะ"] },
      site: { kicker: "เว็บไซต์ของร้านคุณเอง", badge: "แนะนำ", name: "เว็บไซต์ + เมนู QR", benefit: "เว็บไซต์ในสไตล์ของร้านคุณ ใช้รูปของร้านคุณเอง ช่วยให้ลูกค้าหาร้านคุณเจอบน Google รวมเมนู QR แล้ว",
        list: ["เว็บไซต์หลายภาษาตามลูกค้าของคุณ", "รวมเมนู QR", "ปุ่ม WhatsApp / LINE สำหรับจอง", "รวมโฮสติ้ง การแก้ไข และการอัปเดต"] } },
    ar: { per: "/ شهريًا", cur: "฿", book: "حجز موعد", demo: "مشاهدة مثال لقائمة QR", free: "تركيب مجاني",
      meetK: "موعد مجاني · 20 دقيقة", meetT: "لكل نشاط ظروفه.", note: "نلتقي في محلك أو عبر مكالمة فيديو، ونرى معًا ما تحتاجه. بلا التزام.",
      menu: { kicker: "أسهل بداية", name: "قائمة QR", benefit: "قائمتك مترجمة إلى لغات زبائنك، مع الصور وشاشة للنادل بالتايلاندية.",
        list: ["قائمة بـ 6 لغات مع الصور", "شاشة «اعرضها على النادل» بالتايلاندية", "تعديل الأسعار والأطباق متى شئت", "رمز QR جاهز للطباعة على الطاولات"] },
      site: { kicker: "الحل الكامل", badge: "الأكثر اكتمالًا", name: "موقع إلكتروني + قائمة QR", benefit: "موقع يشبهك، مبني من صورك، يساعد زبائنك على إيجادك في جوجل. قائمة QR مشمولة.",
        list: ["موقع بلغات زبائنك", "قائمة QR مشمولة", "زر واتساب / لاين للحجز", "الاستضافة والتعديلات والتحديثات مشمولة"] } }
  };

  function deep(t, s) { Object.keys(s).forEach(function (k) { if (s[k] && typeof s[k] === "object" && !Array.isArray(s[k])) { t[k] = t[k] || {}; deep(t[k], s[k]); } else t[k] = s[k]; }); return t; }
  var D = window.NM_EXTRA_DICT = window.NM_EXTRA_DICT || {};
  var thFr = /\/th-fr\//.test((typeof location !== "undefined" && location.pathname) || "");
  var only = thFr ? ["th", "fr"] : ["th"];
  window.NM_OFFERS2.langs = only;
  only.forEach(function (l) {
    var f = D[l] && D[l].founder; if (CUT[l] && f && typeof f.body === "string") f.body = f.body.replace(CUT[l][0], CUT[l][1]);
    var o = {}; o[l] = C[l]; deep(D, o);
  });
  if (typeof module !== "undefined") module.exports = { C: C, CUT: CUT, O: window.NM_OFFERS2 };
})();
