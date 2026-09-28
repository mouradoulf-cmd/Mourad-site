/* Malee — EN / FR / TH / RU.
   English is baked into index.html and captured from the DOM on load, so
   only FR, TH and RU need dictionaries. data-i18n="key" sets innerHTML,
   data-i18n-attr="attr:key;…" sets attributes. Strings built in JS live in
   UI. Prices are stored in baht (data-price) and shown in the visitor's
   currency: EN → USD, FR → EUR, TH and RU → THB (Russian visitors in
   Pattaya count in baht). */
(function () {
  "use strict";

  var DICT = {
    fr: {
      "a11y.skip": "Aller au contenu", "a11y.language": "Langue", "a11y.menu": "Menu", "a11y.close": "Fermer", "a11y.prev": "Photo précédente", "a11y.next": "Photo suivante",
      "intro.sub": "Massage thaï &amp; spa · Pattaya",
      "nav.treatments": "Soins", "nav.sanctuary": "Le lieu", "nav.gifts": "Cartes cadeaux", "nav.visit": "Venir", "nav.book": "Réserver", "nav.feel": "Comment vous sentez-vous ?", "nav.bookFull": "Réserver un soin",
      "hero.eyebrow": "Massage thaï &amp; spa · Centre de Pattaya", "hero.t1": "Des mains lentes.", "hero.t2": "Une huile tiède.", "hero.t3": "Une heure rien qu'à vous.",
      "hero.lead": "Massage thaï traditionnel, aromathérapie et pierres chaudes par des thérapeutes formées à Wat Pho — dans un jardin calme, à deux minutes de Second Road.",
      "hero.cta": "Réserver un soin", "hero.cta2": "Aidez-moi à choisir", "hero.rating": "· plus de 1 200 avis", "hero.from": "Massage thaï dès",
      "mq.1": "Massage thaï traditionnel", "mq.2": "Huiles aromatiques", "mq.3": "Pierres chaudes", "mq.4": "Réflexologie plantaire", "mq.5": "Pochons d'herbes", "mq.6": "Suite duo",
      "tr.eyebrow": "La carte", "tr.title": "Six façons de <em>lâcher prise.</em>", "tr.aside": "Choisissez une durée — le prix se met à jour. Chaque soin commence par un bain de pieds et se termine par un thé au gingembre.",
      "tr.popular": "Le plus réservé", "tr.sig": "Signature", "tr.length": "Durée", "tr.book": "Réserver ce soin",
      "tr.thai": "Thaï traditionnel", "tr.thaiD": "Acupression, compressions rythmées et étirements façon yoga sur un matelas au sol. Sans huile, tenue ample fournie.", "tr.thaiAlt": "Une thérapeute travaille en profondeur le long de la jambe",
      "tr.oil": "Huile aromatique", "tr.oilD": "De longs mouvements enveloppants à l'huile tiède — citronnelle, jasmin ou coco. Le soin idéal après un long vol.", "tr.oilAlt": "De l'huile tiède versée dans la paume au-dessus du dos",
      "tr.stone": "Rituel pierres chaudes", "tr.stoneD": "Des pierres de basalte chauffées dissolvent les tensions profondes pendant que le massage à l'huile délie les muscles. Notre soin le plus demandé.", "tr.stoneAlt": "Des pierres de basalte noires le long du dos, orchidées blanches à côté",
      "tr.foot": "Réflexologie plantaire", "tr.footD": "Un bain de pieds aux fleurs, puis une pression ferme sur les points reliés à tout le corps. Parfait après une journée de marche.", "tr.footAlt": "Des pieds dans l'eau tiède avec frangipanier et orchidées",
      "tr.herbal": "Pochons d'herbes", "tr.herbalD": "Des pochons d'herbes thaïes cuits à la vapeur — plai, curcuma, combava — pressés sur le corps après un massage thaï.", "tr.herbalAlt": "Les mains d'une thérapeute pressent le bas du dos",
      "tr.face": "Soin éclat visage", "tr.faceD": "Nettoyage, gommage doux, masque frais aloe et concombre, massage du visage et du cuir chevelu. La peau fatiguée par le soleil, réparée.", "tr.faceAlt": "Une cliente se détend pendant un soin visage au masque rafraîchissant",
      "tr.fx": "Prix en euros donnés à titre indicatif — le règlement se fait en bahts au spa. Espèces, cartes et QR thaï.",
      "feel.eyebrow": "Vous hésitez ?", "feel.title": "Comment va votre corps <em>aujourd'hui ?</em>",
      "feel.stiff": "Raide &amp; courbaturé", "feel.tired": "Décalage horaire", "feel.stressed": "Stressé", "feel.walked": "Marché toute la journée", "feel.sun": "Trop de soleil", "feel.treat": "Juste envie de me faire plaisir",
      "feel.empty": "Dites-nous comment vous vous sentez — on vous dit ce que nos thérapeutes choisiraient.", "feel.we": "On vous réserverait", "feel.book": "Réserver ce soin pour moi",
      "feel.stiffW": "L'acupression profonde et les étirements libèrent hanches, épaules et dos. Dites à votre thérapeute la pression que vous aimez.",
      "feel.tiredW": "De longs mouvements lents à l'huile relancent la circulation après un vol — et vous dormirez bien ce soir.",
      "feel.stressedW": "La chaleur fait ce que les mots ne font pas : pierres chaudes et huile mettent votre système nerveux sur pause.",
      "feel.walkedW": "Un bain de pieds aux fleurs et de la réflexologie — vos jambes vous remercieront demain.",
      "feel.sunW": "L'aloe et le concombre apaisent la peau fatiguée par le soleil, avec un massage du cuir chevelu pour finir.",
      "feel.treatW": "Un massage thaï suivi de pochons d'herbes chauds — l'expérience thaïe complète.",
      "san.eyebrow": "Le lieu", "san.title": "Un jardin caché <em>près de Second Road.</em>",
      "san.p1": "Passez la porte en teck et la ville se tait : frangipaniers dans la cour, parfum de citronnelle, huit cabines privées et une suite duo avec sa propre baignoire.",
      "san.p2": "Nos thérapeutes sont formées à l'école de Wat Pho à Bangkok, où le massage thaï s'enseigne depuis deux siècles. Chacune a au moins huit ans de pratique.",
      "san.s1": "thérapeutes", "san.s2": "cabines privées", "san.s3": "note des clients", "san.s4": "massages donnés",
      "san.alt1": "Une cabine avec parquet en teck, linge blanc et lumière du jardin", "san.alt2": "Une théière blanche et une tasse de thé au gingembre sur un plateau en bois",
      "rit.eyebrow": "À chaque visite", "rit.title": "Le rituel <em>Malee.</em>",
      "rit.1t": "Accueil", "rit.1b": "Une serviette fraîche, un thé au pois papillon, et une minute pour nous dire où ça fait mal et la pression que vous aimez.",
      "rit.2t": "Bain de pieds", "rit.2b": "Eau tiède, citron vert et frangipanier. Un petit geste thaï de bienvenue avant chaque soin.",
      "rit.3t": "Le soin", "rit.3b": "Une cabine privée, une lumière douce, pas de téléphone. Votre thérapeute vérifie la pression — puis se tait.",
      "rit.4t": "Thé au gingembre", "rit.4b": "Retour au jardin avec un thé au gingembre et des fruits frais. Restez aussi longtemps que vous voulez.",
      "gal.eyebrow": "Chez Malee", "gal.title": "Lumière douce, <em>mains chaudes.</em>", "gal.aside": "Touchez une photo pour l'afficher en plein écran.",
      "gal.c0": "Citronnelle &amp; jasmin", "gal.c1": "Épaules dénouées", "gal.c2": "Huiles pressées à froid", "gal.c3": "Le moment calme", "gal.c4": "Prêt pour vous", "gal.c5": "Là où poussent nos herbes", "gal.c6": "Deux siècles de tradition", "gal.c7": "La suite duo",
      "gal.a0": "Bougies et diffuseur à côté de serviettes blanches roulées", "gal.a1": "Les mains d'une thérapeute massent une épaule", "gal.a2": "Une goutte d'huile dorée tombe sur la peau", "gal.a3": "Photo noir et blanc d'une cliente détendue pendant un massage du dos", "gal.a4": "Une serviette roulée, une bougie, un flacon d'huile et des tulipes roses", "gal.a5": "Une rivière turquoise entre les palmiers vue du ciel", "gal.a6": "Un temple thaï doré sous un ciel bleu", "gal.a7": "Une cliente dans une baignoire en pierre près d'une grande fenêtre",
      "rev.eyebrow": "Nos clients", "rev.title": "Paroles <em>de table de massage.</em>", "rev.prev": "Avis précédent", "rev.next": "Avis suivant",
      "rev.q1": "« Le meilleur massage thaï de mon voyage — et j'en ai fait un chaque jour. Des mains puissantes, la pression parfaite. »",
      "rev.q2": "« Arrivé après 14 heures de vol, reparti comme neuf. Les pierres chaudes sont incroyables. »",
      "rev.q3": "« Si calme et si propre. On oublie qu'on est à cinq minutes de Walking Street. »",
      "rev.q4": "« On a réservé la suite duo pour notre anniversaire de mariage. Le bain de pieds aux fleurs, le thé, le calme — parfait. »",
      "rev.q5": "« Prix honnêtes, aucune vente forcée, et la meilleure réflexologie que j'aie eue en Thaïlande. »",
      "gift.eyebrow": "Cartes cadeaux", "gift.title": "Offrez <em>une heure de calme.</em>",
      "gift.lead": "Choisissez un montant, ajoutez un mot, et on vous envoie une jolie carte cadeau par WhatsApp — prête à transférer. Valable douze mois sur tous les soins.",
      "gift.amount": "Montant", "gift.to": "Pour", "gift.toPh": "Son prénom", "gift.from": "De la part de", "gift.fromPh": "Votre prénom", "gift.msg": "Message <i>(facultatif)</i>", "gift.msgPh": "Joyeux anniversaire — va te détendre !",
      "gift.send": "Demander cette carte cadeau", "gift.card": "Carte cadeau", "gift.valid": "valable 12 mois",
      "book.eyebrow": "Réserver", "book.title": "Votre cabine <em>vous attend.</em>", "book.lead": "Choisissez votre soin et un horaire. On confirme sur WhatsApp en quelques minutes — sans acompte, sans carte.",
      "book.s1": "Soin", "book.s2": "Durée", "book.s3": "Jour", "book.s4": "Heure", "book.s5": "Personnes", "book.s6": "Vos coordonnées",
      "book.fewer": "Moins de personnes", "book.more": "Plus de personnes", "book.couple": "💞 Deux personnes ? Vous aurez la suite duo, côte à côte.",
      "book.name": "Nom", "book.phone": "WhatsApp ou téléphone", "book.pressure": "Pression", "book.note": "Quelque chose à nous dire ? <i>(facultatif)</i>", "book.notePh": "Blessure, grossesse, une thérapeute femme…",
      "book.send": "Envoyer ma réservation sur WhatsApp", "book.hint": "Annulation gratuite jusqu'à 2 heures avant. Merci d'arriver dix minutes en avance.",
      "book.summary": "Votre visite", "book.total": "Total", "book.incl": "Bain de pieds, thé au gingembre et fruits frais inclus.",
      "book.p1": "Douce", "book.p2": "Moyenne", "book.p3": "Forte",
      "faq.eyebrow": "Bon à savoir", "faq.title": "Avant <em>de venir.</em>",
      "faq.q1": "Que dois-je porter ?", "faq.a1": "Rien de spécial. Pour le massage thaï, on vous prête une tenue ample en coton ; pour les soins à l'huile, un sous-vêtement jetable et une serviette. Vous êtes toujours couvert.",
      "faq.q2": "Puis-je choisir une thérapeute femme ou un homme ?", "faq.a2": "Bien sûr — indiquez-le dans la note de réservation et on s'en occupe.",
      "faq.q3": "Le massage thaï fait-il mal ?", "faq.a3": "Il peut être ferme, mais jamais plus que vous ne le souhaitez. Votre thérapeute vérifie la pression au début et vous pouvez dire « bao bao » (doucement) à tout moment.",
      "faq.q4": "Je suis enceinte — puis-je réserver ?", "faq.a4": "À partir du deuxième trimestre, oui : un massage doux sur le côté, par des thérapeutes formées à la grossesse. Prévenez-nous à la réservation.",
      "faq.q5": "Acceptez-vous les clients sans rendez-vous ?", "faq.a5": "Toujours, quand une cabine est libre. Les soirs et week-ends se remplissent vite : réserver quelques heures avant est plus sûr.",
      "visit.eyebrow": "Venir", "visit.title": "Trouvez <em>la porte en teck.</em>", "visit.where": "Où", "visit.hint": "En face du 7-Eleven, cherchez le frangipanier.", "visit.maps": "Ouvrir dans Google Maps",
      "visit.when": "Quand", "visit.daily": "Tous les jours", "visit.last": "Dernière réservation", "visit.talk": "Nous écrire",
      "visit.taxi": "Montrez ceci à votre chauffeur de taxi ou de baht-bus", "visit.taxiBtn": "Plein écran", "visit.map": "Carte : Malee, Soi 13, Second Road, Pattaya",
      "final.title": "Expirez. <em>On s'occupe du reste.</em>", "footer.credit": "Site réalisé par", "dur.min": "min"
    },

    th: {
      "a11y.skip": "ข้ามไปยังเนื้อหา", "a11y.language": "ภาษา", "a11y.menu": "เมนู", "a11y.close": "ปิด", "a11y.prev": "รูปก่อนหน้า", "a11y.next": "รูปถัดไป",
      "intro.sub": "นวดแผนไทยและสปา · พัทยา",
      "nav.treatments": "ทรีตเมนต์", "nav.sanctuary": "สถานที่", "nav.gifts": "บัตรของขวัญ", "nav.visit": "การเดินทาง", "nav.book": "จอง", "nav.feel": "วันนี้รู้สึกอย่างไร?", "nav.bookFull": "จองทรีตเมนต์",
      "hero.eyebrow": "นวดแผนไทยและสปา · ใจกลางพัทยา", "hero.t1": "มือที่อ่อนโยน", "hero.t2": "น้ำมันอุ่นๆ", "hero.t3": "หนึ่งชั่วโมงที่เป็นของคุณ",
      "hero.lead": "นวดแผนไทย อโรมาเทอราพี และหินร้อน โดยหมอนวดที่ผ่านการอบรมจากวัดโพธิ์ ในสวนอันเงียบสงบ ห่างจากพัทยาสายสองเพียงสองนาที",
      "hero.cta": "จองทรีตเมนต์", "hero.cta2": "ช่วยเลือกให้หน่อย", "hero.rating": "· รีวิวกว่า 1,200 รายการ", "hero.from": "นวดแผนไทยเริ่มต้น",
      "mq.1": "นวดแผนไทยโบราณ", "mq.2": "น้ำมันหอมระเหย", "mq.3": "หินร้อน", "mq.4": "นวดกดจุดฝ่าเท้า", "mq.5": "ประคบสมุนไพร", "mq.6": "ห้องคู่รัก",
      "tr.eyebrow": "เมนู", "tr.title": "หกวิธี <em>ให้ได้ผ่อนคลาย</em>", "tr.aside": "เลือกระยะเวลา ราคาจะเปลี่ยนตาม ทุกทรีตเมนต์เริ่มด้วยการแช่เท้า และจบด้วยชาขิงอุ่นๆ",
      "tr.popular": "ยอดนิยม", "tr.sig": "ซิกเนเจอร์", "tr.length": "ระยะเวลา", "tr.book": "จองทรีตเมนต์นี้",
      "tr.thai": "นวดแผนไทย", "tr.thaiD": "กดจุด บีบคลายเป็นจังหวะ และยืดเส้นแบบโยคะบนฟูก ไม่ใช้น้ำมัน มีชุดผ้าหลวมให้เปลี่ยน", "tr.thaiAlt": "หมอนวดกดลึกตามแนวขาของลูกค้า",
      "tr.oil": "นวดน้ำมันอโรมา", "tr.oilD": "ลูบไล้ยาวต่อเนื่องด้วยน้ำมันอุ่น ตะไคร้ มะลิ หรือมะพร้าว เหมาะมากหลังเที่ยวบินยาว", "tr.oilAlt": "น้ำมันอุ่นรินลงบนฝ่ามือหมอนวดเหนือแผ่นหลัง",
      "tr.stone": "พิธีหินร้อน", "tr.stoneD": "หินบะซอลต์อุ่นช่วยคลายความตึงลึกๆ ขณะนวดน้ำมันคลายกล้ามเนื้อ ทรีตเมนต์ที่ถูกขอมากที่สุด", "tr.stoneAlt": "หินบะซอลต์สีดำวางเรียงบนแผ่นหลัง ข้างๆ มีกล้วยไม้สีขาว",
      "tr.foot": "นวดกดจุดฝ่าเท้า", "tr.footD": "แช่เท้าในน้ำดอกไม้ แล้วกดจุดสะท้อนที่เชื่อมโยงทั่วร่างกาย เหมาะหลังเดินมาทั้งวัน", "tr.footAlt": "เท้าแช่น้ำอุ่นกับดอกลีลาวดีและกล้วยไม้",
      "tr.herbal": "ประคบสมุนไพร", "tr.herbalD": "ลูกประคบสมุนไพรไทยนึ่งร้อน ไพล ขมิ้น มะกรูด กดประคบตามตัวหลังนวดแผนไทย", "tr.herbalAlt": "มือหมอนวดกดบริเวณหลังส่วนล่าง",
      "tr.face": "ทรีตเมนต์หน้าใส", "tr.faceD": "ทำความสะอาด ขัดผิวอ่อนโยน มาส์กว่านหางจระเข้และแตงกวา พร้อมนวดหน้าและศีรษะ ฟื้นผิวที่โดนแดด", "tr.faceAlt": "ลูกค้าผ่อนคลายระหว่างทำทรีตเมนต์หน้าด้วยมาส์กเย็นๆ",
      "tr.fx": "",
      "feel.eyebrow": "ยังเลือกไม่ได้?", "feel.title": "วันนี้ร่างกาย <em>รู้สึกอย่างไร?</em>",
      "feel.stiff": "ปวดเมื่อย ตึง", "feel.tired": "เจ็ตแล็ก", "feel.stressed": "เครียด", "feel.walked": "เดินมาทั้งวัน", "feel.sun": "โดนแดดมาก", "feel.treat": "อยากให้รางวัลตัวเอง",
      "feel.empty": "แตะเลือกความรู้สึกของคุณ แล้วเราจะบอกว่าหมอนวดของเราแนะนำอะไร", "feel.we": "เราแนะนำ", "feel.book": "จองอันนี้ให้ฉัน",
      "feel.stiffW": "การกดจุดลึกและยืดเส้นช่วยคลายสะโพก ไหล่ และหลัง บอกหมอนวดได้เลยว่าชอบน้ำหนักแค่ไหน",
      "feel.tiredW": "การลูบไล้ช้าๆ ด้วยน้ำมันช่วยให้เลือดไหลเวียนหลังเที่ยวบิน และคืนนี้จะหลับสบาย",
      "feel.stressedW": "ความอุ่นทำในสิ่งที่คำพูดทำไม่ได้ หินร้อนและน้ำมันช่วยให้ระบบประสาทได้พัก",
      "feel.walkedW": "แช่เท้าน้ำดอกไม้และกดจุดฝ่าเท้า พรุ่งนี้ขาจะขอบคุณคุณ",
      "feel.sunW": "ว่านหางจระเข้และแตงกวาช่วยปลอบผิวที่โดนแดด ปิดท้ายด้วยนวดศีรษะ",
      "feel.treatW": "นวดแผนไทยต่อด้วยลูกประคบสมุนไพรอุ่นๆ ประสบการณ์ไทยแบบเต็มรูปแบบ",
      "san.eyebrow": "สถานที่", "san.title": "สวนลับ <em>ใกล้พัทยาสายสอง</em>",
      "san.p1": "ก้าวผ่านประตูไม้สัก เมืองก็เงียบลงทันที ลีลาวดีในลานบ้าน กลิ่นตะไคร้ในอากาศ ห้องส่วนตัวแปดห้อง และห้องคู่พร้อมอ่างอาบน้ำ",
      "san.p2": "หมอนวดของเราผ่านการอบรมจากโรงเรียนวัดโพธิ์ กรุงเทพฯ ที่สอนนวดแผนไทยมากว่าสองศตวรรษ ทุกคนมีประสบการณ์อย่างน้อยแปดปี",
      "san.s1": "หมอนวด", "san.s2": "ห้องส่วนตัว", "san.s3": "คะแนนจากลูกค้า", "san.s4": "ครั้งที่นวดมาแล้ว",
      "san.alt1": "ห้องทรีตเมนต์พื้นไม้สัก ผ้าปูสีขาว และแสงจากสวน", "san.alt2": "กาน้ำชาสีขาวและชาขิงอุ่นบนถาดไม้",
      "rit.eyebrow": "ทุกครั้งที่มา", "rit.title": "พิธีกรรม <em>แห่งมะลิ</em>",
      "rit.1t": "ต้อนรับ", "rit.1b": "ผ้าเย็น ชาอัญชัน และเวลาสักนาทีให้บอกเราว่าปวดตรงไหน ชอบน้ำหนักแค่ไหน",
      "rit.2t": "แช่เท้า", "rit.2b": "น้ำอุ่น มะนาว และดอกลีลาวดี การต้อนรับแบบไทยก่อนทุกทรีตเมนต์",
      "rit.3t": "ทรีตเมนต์", "rit.3b": "ห้องส่วนตัว แสงนวลๆ ไม่มีโทรศัพท์ หมอนวดถามน้ำหนัก แล้วปล่อยให้คุณได้พักอย่างเงียบๆ",
      "rit.4t": "ชาขิง", "rit.4b": "กลับมานั่งในสวนกับชาขิงอุ่นและผลไม้สด อยู่ได้นานเท่าที่ต้องการ",
      "gal.eyebrow": "ภายในมะลิ", "gal.title": "แสงนวล <em>มืออุ่น</em>", "gal.aside": "แตะรูปเพื่อดูแบบเต็มจอ",
      "gal.c0": "ตะไคร้และมะลิ", "gal.c1": "คลายไหล่ที่ตึง", "gal.c2": "น้ำมันสกัดเย็น", "gal.c3": "ช่วงเวลาเงียบสงบ", "gal.c4": "พร้อมต้อนรับคุณ", "gal.c5": "บ้านของสมุนไพรเรา", "gal.c6": "ประเพณีสองศตวรรษ", "gal.c7": "ห้องคู่รัก",
      "gal.a0": "เทียนและก้านไม้หอมข้างผ้าขนหนูม้วนสีขาว", "gal.a1": "มือหมอนวดนวดไหล่ลูกค้า", "gal.a2": "หยดน้ำมันสีทองหยดลงบนผิว", "gal.a3": "ภาพขาวดำของลูกค้าที่ผ่อนคลายระหว่างนวดหลัง", "gal.a4": "ผ้าขนหนูม้วน เทียน ขวดน้ำมัน และดอกทิวลิปสีชมพู", "gal.a5": "แม่น้ำสีเทอร์ควอยซ์ระหว่างต้นปาล์มมองจากมุมสูง", "gal.a6": "วัดไทยสีทองใต้ท้องฟ้าสีคราม", "gal.a7": "ลูกค้าในอ่างหินข้างหน้าต่างบานใหญ่",
      "rev.eyebrow": "ลูกค้า", "rev.title": "เสียงจาก <em>เตียงนวด</em>", "rev.prev": "รีวิวก่อนหน้า", "rev.next": "รีวิวถัดไป",
      "rev.q1": "“นวดไทยที่ดีที่สุดของทริปนี้ และฉันนวดทุกวัน มือหนัก น้ำหนักพอดีมาก”",
      "rev.q2": "“มาถึงหลังบินมา 14 ชั่วโมง กลับไปเหมือนคนใหม่ หินร้อนสุดยอดมาก”",
      "rev.q3": "“สงบและสะอาดมาก ลืมไปเลยว่าอยู่ห่างวอล์กกิ้งสตรีทแค่ห้านาที”",
      "rev.q4": "“เราจองห้องคู่ในวันครบรอบแต่งงาน แช่เท้าดอกไม้ ชา ความเงียบ สมบูรณ์แบบ”",
      "rev.q5": "“ราคาตรงไปตรงมา ไม่ขายของ และนวดเท้าดีที่สุดที่เคยเจอในไทย”",
      "gift.eyebrow": "บัตรของขวัญ", "gift.title": "มอบ <em>เวลาพักผ่อนให้ใครสักคน</em>",
      "gift.lead": "เลือกมูลค่า เขียนข้อความ แล้วเราจะส่งบัตรของขวัญสวยๆ ทาง WhatsApp พร้อมส่งต่อ ใช้ได้ 12 เดือนกับทุกทรีตเมนต์",
      "gift.amount": "มูลค่า", "gift.to": "ถึง", "gift.toPh": "ชื่อผู้รับ", "gift.from": "จาก", "gift.fromPh": "ชื่อของคุณ", "gift.msg": "ข้อความ <i>(ไม่บังคับ)</i>", "gift.msgPh": "สุขสันต์วันเกิด ไปพักผ่อนนะ!",
      "gift.send": "ขอบัตรของขวัญใบนี้", "gift.card": "บัตรของขวัญ", "gift.valid": "ใช้ได้ 12 เดือน",
      "book.eyebrow": "จอง", "book.title": "ห้องของคุณ <em>พร้อมแล้ว</em>", "book.lead": "เลือกทรีตเมนต์และเวลา เรายืนยันทาง WhatsApp ภายในไม่กี่นาที ไม่ต้องมัดจำ ไม่ต้องใช้บัตร",
      "book.s1": "ทรีตเมนต์", "book.s2": "ระยะเวลา", "book.s3": "วัน", "book.s4": "เวลา", "book.s5": "จำนวนคน", "book.s6": "ข้อมูลของคุณ",
      "book.fewer": "ลดจำนวนคน", "book.more": "เพิ่มจำนวนคน", "book.couple": "💞 มาสองคน? ได้ห้องคู่ นวดเคียงข้างกัน",
      "book.name": "ชื่อ", "book.phone": "WhatsApp หรือเบอร์โทร", "book.pressure": "น้ำหนักมือ", "book.note": "มีอะไรที่ควรรู้ไหม? <i>(ไม่บังคับ)</i>", "book.notePh": "อาการบาดเจ็บ ตั้งครรภ์ ต้องการหมอนวดผู้หญิง…",
      "book.send": "ส่งการจองทาง WhatsApp", "book.hint": "ยกเลิกฟรีก่อน 2 ชั่วโมง กรุณามาก่อนเวลาสิบนาที",
      "book.summary": "การมาของคุณ", "book.total": "รวม", "book.incl": "รวมแช่เท้า ชาขิง และผลไม้สด",
      "book.p1": "เบา", "book.p2": "กลาง", "book.p3": "หนัก",
      "faq.eyebrow": "ควรรู้", "faq.title": "ก่อน <em>มาใช้บริการ</em>",
      "faq.q1": "ต้องใส่อะไรมา?", "faq.a1": "ไม่ต้องเตรียมอะไร นวดแผนไทยเรามีชุดผ้าฝ้ายหลวมให้ ส่วนทรีตเมนต์น้ำมันมีกางเกงชั้นในแบบใช้แล้วทิ้งและผ้าขนหนู ร่างกายจะถูกคลุมไว้เสมอ",
      "faq.q2": "เลือกหมอนวดผู้หญิงหรือผู้ชายได้ไหม?", "faq.a2": "ได้แน่นอน เขียนไว้ในหมายเหตุการจอง แล้วเราจะจัดให้",
      "faq.q3": "นวดแผนไทยเจ็บไหม?", "faq.a3": "อาจจะหนักมือบ้าง แต่ไม่เกินที่คุณต้องการ หมอนวดจะถามน้ำหนักตั้งแต่เริ่ม และบอก “เบาๆ” ได้ตลอดเวลา",
      "faq.q4": "ตั้งครรภ์อยู่ จองได้ไหม?", "faq.a4": "ตั้งแต่ไตรมาสที่สองได้ค่ะ เรามีนวดท่านอนตะแคงแบบอ่อนโยน โดยหมอนวดที่ผ่านการอบรม กรุณาแจ้งตอนจอง",
      "faq.q5": "walk-in ได้ไหม?", "faq.a5": "ได้เสมอเมื่อมีห้องว่าง ช่วงค่ำและวันหยุดคนเยอะ จองล่วงหน้าสักสองสามชั่วโมงจะชัวร์กว่า",
      "visit.eyebrow": "การเดินทาง", "visit.title": "ตามหา <em>ประตูไม้สัก</em>", "visit.where": "ที่อยู่", "visit.hint": "ตรงข้ามเซเว่น สังเกตต้นลีลาวดี", "visit.maps": "เปิดใน Google Maps",
      "visit.when": "เวลาเปิด", "visit.daily": "ทุกวัน", "visit.last": "รับจองรอบสุดท้าย", "visit.talk": "ติดต่อเรา",
      "visit.taxi": "ยื่นให้คนขับแท็กซี่หรือรถสองแถวดู", "visit.taxiBtn": "เต็มจอ", "visit.map": "แผนที่: มะลิ ซอย 13 พัทยาสาย 2",
      "final.title": "หายใจออก <em>ที่เหลือเราดูแลเอง</em>", "footer.credit": "เว็บไซต์โดย", "dur.min": "นาที"
    },

    ru: {
      "a11y.skip": "Перейти к содержанию", "a11y.language": "Язык", "a11y.menu": "Меню", "a11y.close": "Закрыть", "a11y.prev": "Предыдущее фото", "a11y.next": "Следующее фото",
      "intro.sub": "Тайский массаж и спа · Паттайя",
      "nav.treatments": "Процедуры", "nav.sanctuary": "О нас", "nav.gifts": "Сертификаты", "nav.visit": "Как добраться", "nav.book": "Записаться", "nav.feel": "Как вы себя чувствуете?", "nav.bookFull": "Записаться на процедуру",
      "hero.eyebrow": "Тайский массаж и спа · Центр Паттайи", "hero.t1": "Медленные руки.", "hero.t2": "Тёплое масло.", "hero.t3": "Час только для вас.",
      "hero.lead": "Традиционный тайский массаж, ароматерапия и горячие камни от мастеров, обученных в Ват Пхо, — в тихом саду в двух минутах от Second Road.",
      "hero.cta": "Записаться", "hero.cta2": "Помогите выбрать", "hero.rating": "· более 1 200 отзывов", "hero.from": "Тайский массаж от",
      "mq.1": "Традиционный тайский массаж", "mq.2": "Ароматические масла", "mq.3": "Горячие камни", "mq.4": "Рефлексология стоп", "mq.5": "Травяные мешочки", "mq.6": "Комната для пар",
      "tr.eyebrow": "Меню", "tr.title": "Шесть способов <em>расслабиться.</em>", "tr.aside": "Выберите длительность — цена обновится. Каждая процедура начинается с ванночки для ног и заканчивается имбирным чаем.",
      "tr.popular": "Хит", "tr.sig": "Фирменный", "tr.length": "Длительность", "tr.book": "Записаться",
      "tr.thai": "Тайский традиционный", "tr.thaiD": "Акупрессура, ритмичные надавливания и растяжки в стиле йоги на мате. Без масла, свободная одежда выдаётся.", "tr.thaiAlt": "Мастер глубоко прорабатывает ногу гостя",
      "tr.oil": "Ароматическое масло", "tr.oilD": "Длинные плавные движения с тёплым маслом — лемонграсс, жасмин или кокос. Идеально после долгого перелёта.", "tr.oilAlt": "Тёплое масло льётся в ладонь мастера над спиной гостя",
      "tr.stone": "Ритуал горячих камней", "tr.stoneD": "Нагретые базальтовые камни снимают глубокое напряжение, а масляный массаж расслабляет мышцы. Самая популярная процедура.", "tr.stoneAlt": "Чёрные базальтовые камни на спине, рядом белые орхидеи",
      "tr.foot": "Рефлексология стоп", "tr.footD": "Цветочная ванночка для ног, затем сильное давление на точки, связанные со всем телом. После дня прогулок — то, что нужно.", "tr.footAlt": "Ноги в тёплой воде с франжипани и орхидеями",
      "tr.herbal": "Травяные мешочки", "tr.herbalD": "Распаренные мешочки с тайскими травами — плай, куркума, каффир-лайм — прижимаются к телу после тайского массажа.", "tr.herbalAlt": "Руки мастера надавливают на поясницу",
      "tr.face": "Сияние лица", "tr.faceD": "Очищение, мягкий пилинг, охлаждающая маска с алоэ и огурцом, массаж лица и головы. Кожа после солнца — восстановлена.", "tr.faceAlt": "Гостья отдыхает во время ухода за лицом с охлаждающей маской",
      "tr.fx": "",
      "feel.eyebrow": "Не знаете, что выбрать?", "feel.title": "Как ваше тело <em>сегодня?</em>",
      "feel.stiff": "Скованность и боль", "feel.tired": "Джетлаг", "feel.stressed": "Стресс", "feel.walked": "Весь день на ногах", "feel.sun": "Перегрелся на солнце", "feel.treat": "Просто хочу побаловать себя",
      "feel.empty": "Выберите, как вы себя чувствуете, — и мы скажем, что посоветовали бы наши мастера.", "feel.we": "Мы бы выбрали", "feel.book": "Записаться на это",
      "feel.stiffW": "Глубокая акупрессура и растяжка раскрепощают бёдра, плечи и спину. Скажите мастеру, какое давление вам нравится.",
      "feel.tiredW": "Долгие медленные движения с маслом разгоняют кровь после перелёта — и ночью вы будете спать крепко.",
      "feel.stressedW": "Тепло делает то, что не под силу словам: камни и масло выключают нервную систему.",
      "feel.walkedW": "Цветочная ванночка и рефлексология — завтра ноги скажут спасибо.",
      "feel.sunW": "Алоэ и огурец успокаивают кожу после солнца, а в конце — массаж головы.",
      "feel.treatW": "Тайский массаж и тёплые травяные мешочки — полное тайское погружение.",
      "san.eyebrow": "О нас", "san.title": "Сад, спрятанный <em>у Second Road.</em>",
      "san.p1": "Шаг за тиковую дверь — и город стихает: франжипани во дворе, аромат лемонграсса, восемь отдельных кабинетов и сьют для пар с собственной ванной.",
      "san.p2": "Наши мастера учились в школе Ват Пхо в Бангкоке, где тайский массаж преподают уже два века. У каждого — не менее восьми лет практики.",
      "san.s1": "мастеров", "san.s2": "кабинетов", "san.s3": "рейтинг гостей", "san.s4": "массажей",
      "san.alt1": "Кабинет с тиковым полом, белым бельём и светом из сада", "san.alt2": "Белый чайник и чашка имбирного чая на деревянном подносе",
      "rit.eyebrow": "Каждый визит", "rit.title": "Ритуал <em>Malee.</em>",
      "rit.1t": "Встреча", "rit.1b": "Холодное полотенце, чай из анчана и минута, чтобы рассказать, что болит и какое давление вы любите.",
      "rit.2t": "Ванночка для ног", "rit.2b": "Тёплая вода, лайм и франжипани. Тайский жест гостеприимства перед каждой процедурой.",
      "rit.3t": "Процедура", "rit.3b": "Отдельный кабинет, мягкий свет, без телефонов. Мастер уточнит давление — и дальше тишина.",
      "rit.4t": "Имбирный чай", "rit.4b": "Снова в саду — с имбирным чаем и свежими фруктами. Оставайтесь сколько хотите.",
      "gal.eyebrow": "Внутри Malee", "gal.title": "Мягкий свет, <em>тёплые руки.</em>", "gal.aside": "Нажмите на фото, чтобы открыть на весь экран.",
      "gal.c0": "Лемонграсс и жасмин", "gal.c1": "Плечи без узлов", "gal.c2": "Масла холодного отжима", "gal.c3": "Тихий момент", "gal.c4": "Всё готово для вас", "gal.c5": "Родина наших трав", "gal.c6": "Два века традиции", "gal.c7": "Сьют для пар",
      "gal.a0": "Свечи и диффузор рядом со свёрнутыми белыми полотенцами", "gal.a1": "Руки мастера разминают плечо гостя", "gal.a2": "Капля золотистого масла падает на кожу", "gal.a3": "Чёрно-белое фото гостьи во время массажа спины", "gal.a4": "Свёрнутое полотенце, свеча, флакон масла и розовые тюльпаны", "gal.a5": "Бирюзовая река среди пальм с высоты", "gal.a6": "Золотой тайский храм под голубым небом", "gal.a7": "Гостья в каменной ванне у большого окна",
      "rev.eyebrow": "Гости", "rev.title": "Слова <em>с массажного стола.</em>", "rev.prev": "Предыдущий отзыв", "rev.next": "Следующий отзыв",
      "rev.q1": "«Лучший тайский массаж за всю поездку — а я ходила каждый день. Сильные руки, идеальное давление.»",
      "rev.q2": "«Пришёл после 14 часов полёта, вышел другим человеком. Горячие камни — это что-то.»",
      "rev.q3": "«Так спокойно и чисто. Забываешь, что в пяти минутах Walking Street.»",
      "rev.q4": "«Бронировали сьют для пар на годовщину. Цветочная ванночка, чай, тишина — идеально.»",
      "rev.q5": "«Честные цены, никаких навязанных услуг и лучшая рефлексология стоп в Таиланде.»",
      "gift.eyebrow": "Сертификаты", "gift.title": "Подарите <em>час отдыха.</em>",
      "gift.lead": "Выберите сумму, добавьте пожелание — и мы пришлём красивый сертификат в WhatsApp, готовый к пересылке. Действует двенадцать месяцев на все процедуры.",
      "gift.amount": "Сумма", "gift.to": "Кому", "gift.toPh": "Имя получателя", "gift.from": "От кого", "gift.fromPh": "Ваше имя", "gift.msg": "Пожелание <i>(необязательно)</i>", "gift.msgPh": "С днём рождения — отдохни!",
      "gift.send": "Заказать сертификат", "gift.card": "Сертификат", "gift.valid": "действует 12 месяцев",
      "book.eyebrow": "Запись", "book.title": "Ваш кабинет <em>готов.</em>", "book.lead": "Выберите процедуру и время. Подтвердим в WhatsApp за несколько минут — без предоплаты и без карты.",
      "book.s1": "Процедура", "book.s2": "Длительность", "book.s3": "День", "book.s4": "Время", "book.s5": "Гостей", "book.s6": "Ваши данные",
      "book.fewer": "Меньше гостей", "book.more": "Больше гостей", "book.couple": "💞 Вас двое? Вам достанется сьют для пар — рядом друг с другом.",
      "book.name": "Имя", "book.phone": "WhatsApp или телефон", "book.pressure": "Давление", "book.note": "Что нам стоит знать? <i>(необязательно)</i>", "book.notePh": "Травмы, беременность, мастер-женщина…",
      "book.send": "Отправить запись в WhatsApp", "book.hint": "Бесплатная отмена за 2 часа. Пожалуйста, приходите за десять минут.",
      "book.summary": "Ваш визит", "book.total": "Итого", "book.incl": "Ванночка для ног, имбирный чай и свежие фрукты включены.",
      "book.p1": "Мягкое", "book.p2": "Среднее", "book.p3": "Сильное",
      "faq.eyebrow": "Полезно знать", "faq.title": "Перед <em>визитом.</em>",
      "faq.q1": "Что надеть?", "faq.a1": "Ничего особенного. Для тайского массажа мы выдаём свободную хлопковую одежду, для масляных процедур — одноразовое бельё и полотенце. Вы всегда укрыты.",
      "faq.q2": "Можно выбрать мастера — женщину или мужчину?", "faq.a2": "Конечно — напишите в комментарии к записи, и мы всё устроим.",
      "faq.q3": "Тайский массаж — это больно?", "faq.a3": "Он может быть сильным, но не сильнее, чем вы хотите. Мастер уточнит давление в начале, а сказать «бао бао» (мягче) можно в любой момент.",
      "faq.q4": "Я беременна — можно записаться?", "faq.a4": "Со второго триместра — да: мягкий массаж в положении на боку от мастеров со специальной подготовкой. Сообщите при записи.",
      "faq.q5": "Можно прийти без записи?", "faq.a5": "Всегда, если есть свободный кабинет. Вечера и выходные быстро заполняются, поэтому лучше записаться за пару часов.",
      "visit.eyebrow": "Как добраться", "visit.title": "Найдите <em>тиковую дверь.</em>", "visit.where": "Где", "visit.hint": "Напротив 7-Eleven, ищите дерево франжипани.", "visit.maps": "Открыть в Google Maps",
      "visit.when": "Когда", "visit.daily": "Каждый день", "visit.last": "Последняя запись", "visit.talk": "Связаться",
      "visit.taxi": "Покажите это водителю такси или сонгтэо", "visit.taxiBtn": "На весь экран", "visit.map": "Карта: Malee, Soi 13, Second Road, Паттайя",
      "final.title": "Выдохните. <em>Остальное — наша забота.</em>", "footer.credit": "Сайт создан", "dur.min": "мин"
    }
  };

  var UI = {
    en: { open: "Open now · until 23:00", closing: "Open · last booking 21:30", opens: "Closed · opens at 11:00", today: "Today", tomorrow: "Tomorrow",
          chooseTime: "Please choose a time.", required: "Please fill this in.", phoneBad: "Please enter a number we can reach on WhatsApp.", noSlots: "No times left today — pick another day.",
          sent: "WhatsApp is opening with your booking — just press send.", giftSent: "WhatsApp is opening with your gift card request.",
          waHello: "Hello Malee! I'd like to book:", waTreat: "Treatment", waDay: "Day", waTime: "Time", waGuests: "Guests", waPressure: "Pressure", waName: "Name", waPhone: "Phone", waNote: "Note", waTotal: "Total",
          waGift: "Hello Malee! I'd like a gift card:", waAmount: "Amount", waFor: "For", waFrom: "From", waMsg: "Message", guest: "guest", guests: "guests" },
    fr: { open: "Ouvert · jusqu'à 23 h", closing: "Ouvert · dernière réservation 21 h 30", opens: "Fermé · ouvre à 11 h", today: "Aujourd'hui", tomorrow: "Demain",
          chooseTime: "Choisissez un horaire.", required: "Merci de remplir ce champ.", phoneBad: "Indiquez un numéro joignable sur WhatsApp.", noSlots: "Plus d'horaires aujourd'hui — choisissez un autre jour.",
          sent: "WhatsApp s'ouvre avec votre réservation — il ne reste qu'à envoyer.", giftSent: "WhatsApp s'ouvre avec votre demande de carte cadeau.",
          waHello: "Bonjour Malee ! Je voudrais réserver :", waTreat: "Soin", waDay: "Jour", waTime: "Heure", waGuests: "Personnes", waPressure: "Pression", waName: "Nom", waPhone: "Téléphone", waNote: "Note", waTotal: "Total",
          waGift: "Bonjour Malee ! Je voudrais une carte cadeau :", waAmount: "Montant", waFor: "Pour", waFrom: "De la part de", waMsg: "Message", guest: "personne", guests: "personnes" },
    th: { open: "เปิดอยู่ · ถึง 23:00 น.", closing: "เปิดอยู่ · รับจองรอบสุดท้าย 21:30 น.", opens: "ปิดแล้ว · เปิด 11:00 น.", today: "วันนี้", tomorrow: "พรุ่งนี้",
          chooseTime: "กรุณาเลือกเวลา", required: "กรุณากรอกข้อมูลนี้", phoneBad: "กรุณากรอกเบอร์ที่ติดต่อทาง WhatsApp ได้", noSlots: "วันนี้ไม่มีเวลาว่างแล้ว กรุณาเลือกวันอื่น",
          sent: "กำลังเปิด WhatsApp พร้อมรายละเอียดการจอง กดส่งได้เลย", giftSent: "กำลังเปิด WhatsApp พร้อมคำขอบัตรของขวัญ",
          waHello: "สวัสดีค่ะ มะลิ ขอจองค่ะ:", waTreat: "ทรีตเมนต์", waDay: "วัน", waTime: "เวลา", waGuests: "จำนวน", waPressure: "น้ำหนักมือ", waName: "ชื่อ", waPhone: "เบอร์โทร", waNote: "หมายเหตุ", waTotal: "รวม",
          waGift: "สวัสดีค่ะ มะลิ ขอบัตรของขวัญค่ะ:", waAmount: "มูลค่า", waFor: "ถึง", waFrom: "จาก", waMsg: "ข้อความ", guest: "คน", guests: "คน" },
    ru: { open: "Открыто · до 23:00", closing: "Открыто · последняя запись 21:30", opens: "Закрыто · откроемся в 11:00", today: "Сегодня", tomorrow: "Завтра",
          chooseTime: "Выберите время.", required: "Заполните это поле.", phoneBad: "Укажите номер, доступный в WhatsApp.", noSlots: "На сегодня мест нет — выберите другой день.",
          sent: "Открываем WhatsApp с вашей записью — осталось нажать «Отправить».", giftSent: "Открываем WhatsApp с заказом сертификата.",
          waHello: "Здравствуйте, Malee! Хочу записаться:", waTreat: "Процедура", waDay: "День", waTime: "Время", waGuests: "Гостей", waPressure: "Давление", waName: "Имя", waPhone: "Телефон", waNote: "Комментарий", waTotal: "Итого",
          waGift: "Здравствуйте, Malee! Хочу сертификат:", waAmount: "Сумма", waFor: "Кому", waFrom: "От кого", waMsg: "Пожелание", guest: "гость", guests: "гостей" }
  };
  var LOCALE = { en: "en-GB", fr: "fr-FR", th: "th-TH-u-ca-gregory", ru: "ru-RU" };
  var CURRENCY = { en: "usd", fr: "eur", th: "thb", ru: "thb" };
  var RATE = { usd: 35, eur: 38 };
  // Baht is what's charged at the spa; USD/EUR are rounded guides
  // (to the half unit under 20, to the unit above).
  function money(thb, cur) {
    if (cur === "thb") return "฿" + thb.toLocaleString("en-US");
    var v = thb / RATE[cur];
    v = v < 20 ? Math.round(v * 2) / 2 : Math.round(v);
    var s = v % 1 ? v.toFixed(2) : String(v);
    return cur === "eur" ? s.replace(".", ",") + " €" : "$" + s;
  }

  var EN = {};
  document.querySelectorAll("[data-i18n]").forEach(function (el) { var k = el.getAttribute("data-i18n"); if (!(k in EN)) EN[k] = el.innerHTML; });
  document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
    el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) { var p = pair.split(":"); if (p[1] && !(p[1] in EN)) EN[p[1]] = el.getAttribute(p[0]) || ""; });
  });
  DICT.en = EN;

  var current = "en";
  function t(key) { var d = DICT[current]; return (d && key in d && d[key] !== "") ? d[key] : (EN[key] || ""); }
  function ui(key) { return (UI[current] && UI[current][key]) || UI.en[key] || ""; }
  var thaiFont = false;

  function apply(lang) {
    if (!DICT[lang]) lang = "en";
    current = lang;
    document.documentElement.lang = lang;
    if (lang === "th" && !thaiFont) {
      thaiFont = true;
      var l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Noto+Serif+Thai:wght@400;500;600&family=Noto+Sans+Thai:wght@300;400;500;600&display=swap";
      document.head.appendChild(l);
    }
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n"));
      if (el.innerHTML !== v) el.innerHTML = v;
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) { var p = pair.split(":"); if (p[1]) el.setAttribute(p[0], t(p[1])); });
    });
    document.querySelectorAll("[data-price]").forEach(function (el) { el.textContent = money(Number(el.getAttribute("data-price")), CURRENCY[lang]); });
    document.querySelectorAll("[data-fx]").forEach(function (el) { el.hidden = CURRENCY[lang] === "thb"; });
    document.querySelectorAll("[data-lang]").forEach(function (b) { b.setAttribute("aria-current", b.getAttribute("data-lang") === lang ? "true" : "false"); });
    document.title = { en: "Malee — Thai Massage & Spa, Pattaya", fr: "Malee — Massage thaï & spa, Pattaya", th: "มะลิ — นวดแผนไทยและสปา พัทยา", ru: "Malee — тайский массаж и спа, Паттайя" }[lang];
    try { localStorage.setItem("mlLang", lang); } catch (e) {}
    document.dispatchEvent(new CustomEvent("ml:lang", { detail: { lang: lang } }));
  }

  var start = "";
  try { start = localStorage.getItem("mlLang") || ""; } catch (e) {}
  if (!DICT[start]) { var nav = (navigator.language || "en").slice(0, 2).toLowerCase(); start = DICT[nav] ? nav : "en"; }

  window.MLI18n = {
    apply: apply, t: t, ui: ui,
    lang: function () { return current; }, locale: function () { return LOCALE[current]; },
    money: function (thb) { return money(thb, CURRENCY[current]); }
  };
  apply(start);
})();
