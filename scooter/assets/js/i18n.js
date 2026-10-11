/* Ride Siam — EN / FR / TH / RU.
   English is baked into index.html and captured from the DOM on load, so
   only FR, TH and RU need dictionaries. data-i18n="key" sets innerHTML,
   data-i18n-attr="attr:key;…" sets attributes. Strings built in JS live in
   UI. Prices are stored in baht and shown in the visitor's currency:
   EN → USD, FR → EUR, TH and RU → THB. */
(function () {
  "use strict";

  var DICT = {
    fr: {
      "a11y.skip": "Aller au contenu", "a11y.language": "Langue", "a11y.menu": "Menu",
      "nav.fleet": "Flotte", "nav.prices": "Tarifs", "nav.routes": "Balades", "nav.how": "Comment ça marche", "nav.faq": "FAQ", "nav.book": "Réserver", "nav.bookFull": "Réserver un scooter",
      "hero.t1": "Pattaya,", "hero.t2": "sur deux roues.",
      "hero.lead": "Des scooters premium livrés à votre hôtel — révisés après chaque location, deux casques, assurance complète et assistance 24 h/24. Et on ne garde jamais votre passeport.",
      "hero.p1": "plus de 2 300 locations", "hero.p2": "Livraison gratuite à l'hôtel", "hero.p3": "Pas de passeport en caution",
      "quick.title": "Calculez votre prix", "quick.cat": "Scooter", "quick.from": "Départ", "quick.to": "Retour", "quick.go": "Continuer la réservation",
      "why.aria": "Pourquoi Ride Siam",
      "why.1t": "Livré à votre hôtel", "why.1b": "Gratuit à Pattaya et Jomtien, récupéré à la fin.",
      "why.2t": "Deux casques propres", "why.2b": "Homologués, désinfectés, avec charlottes neuves.",
      "why.3t": "Assuré, sans surprise", "why.3b": "Responsabilité civile incluse, franchise zéro en option.",
      "why.4t": "Assistance 24 h/24", "why.4b": "Crevaison à minuit ? Un scooter de remplacement en moins d'une heure.",
      "why.5t": "Votre passeport reste avec vous", "why.5b": "Une caution en espèces, rendue sur place.",
      "fleet.tag": "La flotte", "fleet.title": "Six scooters. <em>Tous de moins de deux ans.</em>", "fleet.aside": "Révisés après chaque location, lavés avant chaque livraison, plein compris. Plus vous roulez longtemps, moins vous payez par jour.",
      "fleet.cat": "Catégorie", "fleet.period": "Prix affiché", "fleet.hot": "Le plus loué", "fleet.choose": "Choisir",
      "fleet.fx": "Prix en euros à titre indicatif — le paiement se fait en bahts (espèces, carte ou QR thaï).",
      "cat.all": "Tous", "cat.city": "Ville", "cat.premium": "Premium", "cat.maxi": "Maxi", "cat.electric": "Électrique",
      "per.day": "Jour", "per.week": "Semaine", "per.month": "Mois",
      "f.scoopy": "Léger, facile et très thaï. Idéal pour débuter et se garer n'importe où.", "f.scoopyA": "Un scooter Honda Scoopy bleu et blanc garé dans une rue au crépuscule",
      "f.pcx": "Le choix malin à deux : doux, sans clé, ABS, et une selle assez grande pour un road-trip jusqu'à Sattahip.", "f.pcxA": "Un Honda PCX 160 gris mat devant une porte en bois sculpté",
      "f.electric": "Silencieux et instantané. Une batterie amovible qui se recharge dans votre chambre — ni station-service, ni bruit.", "f.electricA": "Un scooter électrique vert citron garé dans une allée",
      "f.primavera": "Carrosserie en acier italien, chromes, couleurs qui font tourner les têtes. Beach Road ne sera plus jamais la même.", "f.primaveraA": "Une Vespa vert d'eau garée sur une promenade en bord de mer avec des palmiers",
      "f.xmax": "Le confort du grand tourisme : antipatinage, ABS et deux casques sous la selle. Taillé pour les excursions.", "f.xmaxA": "Un casque posé sur la selle d'un Yamaha XMAX au-dessus d'une côte vallonnée",
      "f.gts": "Le vaisseau amiral. Stabilité des grandes roues, 300 cm³ de couple et la plus belle façon de rejoindre Bang Saray.", "f.gtsA": "Une Vespa GTS orange avec porte-bagages chromé au soleil",
      "spec.trunk": "L coffre", "spec.charge": "h de charge",
      "book.tag": "Réservé en deux minutes", "book.title": "Composez votre location. <em>Voyez le vrai prix.</em>", "book.lead": "Pas de frais cachés, aucune pression. Envoyez la demande sur WhatsApp, on confirme en 15 minutes et on vous apporte le scooter.",
      "book.s1": "Votre scooter", "book.s2": "Vos dates", "book.s3": "Livraison", "book.s4": "Options", "book.s5": "Vos coordonnées",
      "book.prevM": "Mois précédent", "book.nextM": "Mois suivant", "book.pickT": "Heure de départ", "book.retT": "Heure de retour",
      "book.d1": "À mon hôtel — Pattaya / Jomtien", "book.d2": "Retrait à notre boutique de Jomtien", "book.d3": "Plus loin — Naklua, Bang Saray, aéroport", "book.free": "Gratuit",
      "book.hotel": "Hôtel ou adresse", "book.hotelPh": "ex. Hilton Pattaya, pas besoin du numéro de chambre",
      "book.name": "Nom", "book.phone": "WhatsApp ou téléphone", "book.licence": "J'ai un permis moto (ou un permis international avec la catégorie moto).",
      "book.licHint": "Pas encore de permis ? Vous pouvez louer l'E-City ou le Scoopy pour rouler tranquillement — mais la police verbalise aux contrôles et l'assurance ne vous couvrira pas. Parlons-en.",
      "ex.ins": "Assurance franchise zéro", "ex.insD": "Rayures, vol, accident : vous ne payez rien.", "ex.perDay": "/ jour",
      "ex.phone": "Support téléphone + chargeur USB", "ex.phoneD": "Google Maps sous les yeux, batterie toujours pleine.",
      "ex.box": "Top case", "ex.boxD": "Coffre verrouillable de 40 L — courses, sacs de plage, un second casque.",
      "ex.kid": "Casque enfant", "ex.kidD": "Tailles de 4 à 12 ans.",
      "ex.incl": "Toujours inclus : 2 casques, ponchos de pluie, plein d'essence, antivol, responsabilité civile, assistance 24 h/24.",
      "sum.title": "Votre location", "sum.dates": "Dates", "sum.rate": "Tarif", "sum.extras": "Options", "sum.deliv": "Livraison", "sum.total": "Total", "sum.deposit": "Caution remboursable", "sum.send": "Demander sur WhatsApp", "sum.foot": "Rien à payer maintenant. Paiement à la livraison — espèces, carte ou QR thaï.",
      "how.tag": "Comment ça marche", "how.title": "De votre téléphone <em>à la route.</em>",
      "how.1t": "Réservez en ligne", "how.1b": "Choisissez un scooter et vos dates. On confirme sur WhatsApp en 15 minutes, 7 jours sur 7.",
      "how.2t": "On livre", "how.2b": "À votre hôtel, à l'heure choisie. 5 minutes de tour du scooter, photos ensemble, clés en main.",
      "how.3t": "Vous roulez", "how.3b": "Plages, temples, points de vue. Un souci ? Appelez-nous, de jour comme de nuit.",
      "how.4t": "On récupère", "how.4b": "Laissez-le à l'hôtel, on vient le chercher. Caution rendue en espèces, sur place.",
      "routes.tag": "Où rouler", "routes.title": "Six balades <em>que l'équipe adore.</em>", "routes.aside": "Distances depuis notre boutique de Jomtien. Faites défiler — chaque balade a son lien Google Maps.",
      "r.easy": "Facile", "r.medium": "Moyen", "r.map": "Ouvrir dans Maps", "r.ferry": "+ ferry",
      "r.view": "Point de vue de Khao Pattaya", "r.viewD": "Toute la baie à vos pieds. Venez à 18 h et regardez la ville s'illuminer.", "r.viewA": "La baie de Pattaya illuminée la nuit, vue de la colline",
      "r.sanctuary": "Sanctuaire de la Vérité", "r.sanctuaryD": "Un temple de 105 mètres entièrement sculpté dans le teck, sur la mer à Naklua.", "r.sanctuaryA": "Les flèches en bois sculpté du Sanctuaire de la Vérité",
      "r.buddha": "Colline du Grand Bouddha", "r.buddhaD": "Le Wat Phra Yai sur la colline de Pratumnak : Bouddha doré, temple paisible, brise marine.", "r.buddhaA": "Une immense statue de Bouddha doré parmi les arbres",
      "r.bay": "La boucle côtière", "r.bayD": "Beach Road → Jomtien → Na Jomtien. Palmiers, stands de fruits de mer, coucher de soleil sur la gauche.", "r.bayA": "La longue courbe de la plage de Jomtien et la ville vues du ciel",
      "r.hills": "Khao Chi Chan &amp; les collines", "r.hillsD": "Un Bouddha de 109 mètres dessiné à l'or sur une falaise, puis des virages tranquilles dans la campagne.", "r.hillsA": "Une route sinueuse à travers des collines boisées",
      "r.larn": "L'île de Koh Larn", "r.larnD": "Garez-vous au quai de Bali Hai (on vous montre où), 30 minutes de ferry jusqu'aux eaux turquoise.", "r.larnA": "Une plage turquoise bordée de forêt sur l'île de Koh Larn",
      "safe.tag": "Rouler prudent, rouler en règle", "safe.title": "La check-list <em>honnête.</em>", "safe.alt": "Un motard avec un casque intégral noir et une visière orange",
      "safe.1t": "Permis", "safe.1b": "La Thaïlande exige un permis moto — le vôtre, ou un permis international avec la catégorie « A ».",
      "safe.2t": "Casque, toujours", "safe.2b": "Conducteur et passager, à chaque trajet. C'est la loi, l'amende est de 500 bahts — mais ce n'est pas pour ça.",
      "safe.3t": "Roulez à gauche", "safe.3b": "En Thaïlande, on roule à gauche. Les demi-tours sont fréquents, les chiens aussi — roulez comme si tout le monde pouvait vous surprendre.",
      "safe.4t": "Photos à la remise", "safe.4b": "On photographie le scooter ensemble à la livraison. Plus jamais de discussion sur de vieilles rayures.",
      "rev.tag": "4,9 sur 640 avis", "rev.title": "Nos clients <em>en parlent mieux.</em>",
      "rev.q1": "« Le PCX est arrivé impeccable à notre hôtel, avec deux casques à la bonne taille. Caution rendue en cinq minutes. C'est comme ça que ça devrait être. »",
      "rev.q2": "« Crevaison près de Bang Saray à 21 h. Ils sont venus avec un autre scooter en 40 minutes. Service incroyable. »",
      "rev.q3": "« Loué au mois pour l'hiver. Moins cher que les loueurs de rue, et ils ne m'ont jamais demandé mon passeport. »",
      "faq.tag": "FAQ", "faq.title": "Bonnes <em>questions.</em>", "faq.more": "Autre chose ?", "faq.ask": "Demandez-nous sur WhatsApp",
      "faq.q1": "Pourquoi ne gardez-vous pas les passeports ?", "faq.a1": "Parce que c'est votre document le plus important et que les hôtels, l'immigration ou les banques peuvent le demander. On prend à la place une caution en espèces remboursable (3 000 à 15 000 bahts selon le scooter) et une photo de votre passeport.",
      "faq.q2": "Qu'est-ce qui est inclus ?", "faq.a2": "Livraison et reprise à Pattaya et Jomtien, deux casques, ponchos de pluie, plein d'essence, antivol, assurance responsabilité civile obligatoire et assistance 24 h/24. Aucun frais caché.",
      "faq.q3": "Comment fonctionnent les tarifs semaine et mois ?", "faq.a3": "À partir de 7 jours, le tarif semaine s'applique à chaque jour ; à partir de 28 jours, le tarif mois. Le simulateur ci-dessus affiche toujours le tarif le plus avantageux pour vos dates.",
      "faq.q4": "Et en cas d'accident ou de vol ?", "faq.a4": "Appelez-nous d'abord — on vient à vous. Avec l'assurance franchise zéro, vous ne payez rien. Sans elle, les réparations sont facturées au tarif de notre atelier, plafonnées au montant de la caution pour les dégâts.",
      "faq.q5": "Puis-je annuler ?", "faq.a5": "Oui, gratuitement jusqu'à 12 heures avant la livraison. Rien n'est payé à l'avance, donc rien à rembourser.",
      "faq.q6": "Puis-je sortir de Pattaya ?", "faq.a6": "Partout dans les provinces de Chonburi et Rayong — Sattahip, Bang Saray, les plages de Rayong. Prévenez-nous simplement pour que notre équipe d'assistance sache où vous êtes.",
      "visit.tag": "La boutique", "visit.title": "Jomtien <em>Second Road.</em>", "visit.hours": "Horaires", "visit.daily": "Tous les jours", "visit.help": "Assistance routière 24 h/24", "visit.contact": "Contact", "visit.maps": "Google Maps", "visit.map": "Carte : Ride Siam, Jomtien Second Road, Pattaya",
      "final.title": "Le coucher de soleil n'attend pas. <em>Vous non plus.</em>", "footer.credit": "Site réalisé par",
      "t.day": "jour", "t.days": "jours"
    },

    th: {
      "a11y.skip": "ข้ามไปยังเนื้อหา", "a11y.language": "ภาษา", "a11y.menu": "เมนู",
      "nav.fleet": "รถของเรา", "nav.prices": "ราคา", "nav.routes": "เส้นทาง", "nav.how": "ขั้นตอน", "nav.faq": "คำถาม", "nav.book": "จอง", "nav.bookFull": "จองสกู๊ตเตอร์",
      "hero.t1": "พัทยา", "hero.t2": "บนสองล้อ",
      "hero.lead": "สกู๊ตเตอร์พรีเมียมส่งถึงโรงแรม เช็กสภาพทุกครั้งหลังเช่า หมวกกันน็อกสองใบ ประกันครบ และช่วยเหลือฉุกเฉิน 24 ชั่วโมง ที่สำคัญ เราไม่เก็บพาสปอร์ตของคุณ",
      "hero.p1": "เช่าแล้วกว่า 2,300 ครั้ง", "hero.p2": "ส่งถึงโรงแรมฟรี", "hero.p3": "ไม่ต้องทิ้งพาสปอร์ต",
      "quick.title": "เช็กราคา", "quick.cat": "รุ่นรถ", "quick.from": "วันรับรถ", "quick.to": "วันคืนรถ", "quick.go": "จองต่อ",
      "why.aria": "ทำไมต้อง Ride Siam",
      "why.1t": "ส่งถึงโรงแรม", "why.1b": "ฟรีในพัทยาและจอมเทียน รับคืนถึงที่",
      "why.2t": "หมวกกันน็อกสะอาดสองใบ", "why.2b": "ได้มาตรฐาน ฆ่าเชื้อ พร้อมผ้าคลุมผมใหม่",
      "why.3t": "มีประกัน ไม่มีเซอร์ไพรส์", "why.3b": "รวมประกันบุคคลที่สาม เลือกประกันไม่มีค่าเสียหายส่วนแรกได้",
      "why.4t": "ช่วยเหลือ 24 ชม.", "why.4b": "ยางแตกตอนเที่ยงคืน? ส่งคันใหม่ให้ภายในหนึ่งชั่วโมง",
      "why.5t": "พาสปอร์ตอยู่กับคุณ", "why.5b": "วางเงินมัดจำ คืนให้ทันทีเมื่อคืนรถ",
      "fleet.tag": "รถของเรา", "fleet.title": "สกู๊ตเตอร์หกรุ่น <em>อายุไม่เกินสองปีทุกคัน</em>", "fleet.aside": "เช็กสภาพหลังเช่าทุกครั้ง ล้างก่อนส่งทุกครั้ง เติมน้ำมันเต็มถัง ยิ่งเช่านาน ยิ่งถูกลงต่อวัน",
      "fleet.cat": "ประเภท", "fleet.period": "แสดงราคา", "fleet.hot": "ยอดนิยม", "fleet.choose": "เลือก",
      "fleet.fx": "",
      "cat.all": "ทั้งหมด", "cat.city": "ในเมือง", "cat.premium": "พรีเมียม", "cat.maxi": "แม็กซี่", "cat.electric": "ไฟฟ้า",
      "per.day": "วัน", "per.week": "สัปดาห์", "per.month": "เดือน",
      "f.scoopy": "เบา ขับง่าย สไตล์ไทยแท้ เหมาะกับมือใหม่ จอดได้ทุกที่", "f.scoopyA": "ฮอนด้าสกู๊ปปี้สีน้ำเงินขาวจอดริมถนนยามพลบค่ำ",
      "f.pcx": "ตัวเลือกที่ลงตัวสำหรับสองคน นุ่มนวล กุญแจรีโมท ABS เบาะกว้างขี่ไปสัตหีบสบายๆ", "f.pcxA": "ฮอนด้า PCX 160 สีเทาด้านหน้าประตูไม้แกะสลัก",
      "f.electric": "เงียบและแรงทันใจ แบตเตอรี่ถอดชาร์จในห้องได้ ไม่ต้องเติมน้ำมัน ไม่มีเสียงดัง", "f.electricA": "สกู๊ตเตอร์ไฟฟ้าสีเขียวมะนาวจอดหน้าบ้าน",
      "f.primavera": "ตัวถังเหล็กอิตาลี รายละเอียดโครเมียม สีสันสะดุดตา ขี่เลียบบีชโรดแล้วทุกคนต้องหันมอง", "f.primaveraA": "เวสป้าสีเขียวมิ้นต์จอดริมทางเดินเลียบทะเลกับต้นปาล์ม",
      "f.xmax": "นั่งสบายแบบทัวริ่ง มีระบบควบคุมการลื่นไถล ABS และใส่หมวกได้สองใบใต้เบาะ เหมาะกับทริปไกล", "f.xmaxA": "หมวกกันน็อกวางบนเบาะยามาฮ่า XMAX เหนือชายฝั่งที่มีเนินเขา",
      "f.gts": "รุ่นท็อป ล้อใหญ่มั่นคง แรงบิด 300 ซีซี วิธีที่สวยที่สุดในการไปบางเสร่", "f.gtsA": "เวสป้า GTS สีส้มพร้อมแร็คโครเมียมกลางแดด",
      "spec.trunk": "ลิตร ใต้เบาะ", "spec.charge": "ชม. ชาร์จ",
      "book.tag": "จองเสร็จในสองนาที", "book.title": "เลือกเอง <em>เห็นราคาจริง</em>", "book.lead": "ไม่มีค่าใช้จ่ายแอบแฝง ส่งคำขอทาง WhatsApp เรายืนยันภายใน 15 นาที แล้วนำรถไปส่งให้",
      "book.s1": "เลือกรถ", "book.s2": "วันที่เช่า", "book.s3": "การรับรถ", "book.s4": "อุปกรณ์เสริม", "book.s5": "ข้อมูลของคุณ",
      "book.prevM": "เดือนก่อน", "book.nextM": "เดือนถัดไป", "book.pickT": "เวลารับรถ", "book.retT": "เวลาคืนรถ",
      "book.d1": "ส่งที่โรงแรม พัทยา / จอมเทียน", "book.d2": "รับที่ร้านจอมเทียน", "book.d3": "นอกเขต นาเกลือ บางเสร่ สนามบิน", "book.free": "ฟรี",
      "book.hotel": "โรงแรมหรือที่อยู่", "book.hotelPh": "เช่น ฮิลตัน พัทยา ไม่ต้องใส่เลขห้อง",
      "book.name": "ชื่อ", "book.phone": "WhatsApp หรือเบอร์โทร", "book.licence": "ฉันมีใบขับขี่รถจักรยานยนต์ (หรือใบขับขี่สากลประเภทรถจักรยานยนต์)",
      "book.licHint": "ยังไม่มีใบขับขี่? เช่า E-City หรือสกู๊ปปี้ขี่เบาๆ ได้ แต่ตำรวจตั้งด่านปรับ และประกันจะไม่คุ้มครอง สอบถามเราได้",
      "ex.ins": "ประกันไม่มีค่าเสียหายส่วนแรก", "ex.insD": "รอยขีดข่วน ถูกขโมย อุบัติเหตุ ไม่ต้องจ่ายเพิ่ม", "ex.perDay": "/ วัน",
      "ex.phone": "ที่จับมือถือ + ที่ชาร์จ USB", "ex.phoneD": "ดู Google Maps ได้สะดวก แบตเต็มตลอด",
      "ex.box": "กล่องท้าย", "ex.boxD": "กล่องล็อกได้ 40 ลิตร ใส่ของ กระเป๋าไปทะเล หรือหมวกใบที่สอง",
      "ex.kid": "หมวกกันน็อกเด็ก", "ex.kidD": "สำหรับอายุ 4 ถึง 12 ปี",
      "ex.incl": "รวมทุกครั้ง: หมวกกันน็อก 2 ใบ เสื้อกันฝน น้ำมันเต็มถัง กุญแจล็อก ประกันภาคบังคับ ช่วยเหลือ 24 ชม.",
      "sum.title": "สรุปการเช่า", "sum.dates": "วันที่", "sum.rate": "อัตรา", "sum.extras": "อุปกรณ์เสริม", "sum.deliv": "การรับรถ", "sum.total": "รวม", "sum.deposit": "เงินมัดจำ (คืนเต็มจำนวน)", "sum.send": "ส่งคำขอทาง WhatsApp", "sum.foot": "ยังไม่ต้องจ่ายตอนนี้ ชำระตอนรับรถ เงินสด บัตร หรือสแกน QR",
      "how.tag": "ขั้นตอน", "how.title": "จากมือถือ <em>สู่ถนน</em>",
      "how.1t": "จองออนไลน์", "how.1b": "เลือกรถและวันที่ เรายืนยันทาง WhatsApp ภายใน 15 นาที ทุกวัน",
      "how.2t": "เราไปส่ง", "how.2b": "ที่โรงแรมตามเวลาที่เลือก ตรวจรถด้วยกัน 5 นาที ถ่ายรูปไว้ แล้วรับกุญแจ",
      "how.3t": "ออกเดินทาง", "how.3b": "ทะเล วัด จุดชมวิว มีปัญหาอะไรโทรหาเราได้ทั้งกลางวันกลางคืน",
      "how.4t": "เรารับคืน", "how.4b": "จอดไว้ที่โรงแรม เราไปรับเอง คืนเงินมัดจำเป็นเงินสดทันที",
      "routes.tag": "ไปไหนดี", "routes.title": "หกเส้นทาง <em>ที่ทีมเราชอบ</em>", "routes.aside": "ระยะทางจากร้านที่จอมเทียน เลื่อนดูเพิ่มเติม ทุกเส้นทางมีลิงก์ Google Maps",
      "r.easy": "ง่าย", "r.medium": "ปานกลาง", "r.map": "เปิดในแผนที่", "r.ferry": "+ เรือข้ามฟาก",
      "r.view": "จุดชมวิวเขาพัทยา", "r.viewD": "เห็นอ่าวพัทยาทั้งอ่าว มาตอนหกโมงเย็น ดูเมืองเปิดไฟ", "r.viewA": "อ่าวพัทยายามค่ำคืนมองจากบนเขา",
      "r.sanctuary": "ปราสาทสัจธรรม", "r.sanctuaryD": "ปราสาทไม้สักแกะสลักทั้งหลัง สูง 105 เมตร ริมทะเลนาเกลือ", "r.sanctuaryA": "ยอดปราสาทไม้แกะสลักของปราสาทสัจธรรม",
      "r.buddha": "วัดพระใหญ่ เขาพระตำหนัก", "r.buddhaD": "พระพุทธรูปสีทองบนเขาพระตำหนัก วัดเงียบสงบ ลมทะเลเย็นสบาย", "r.buddhaA": "พระพุทธรูปองค์ใหญ่สีทองท่ามกลางต้นไม้",
      "r.bay": "เลียบชายฝั่ง", "r.bayD": "บีชโรด → จอมเทียน → นาจอมเทียน ต้นปาล์ม ร้านอาหารทะเล พระอาทิตย์ตกทางซ้ายมือ", "r.bayA": "หาดจอมเทียนโค้งยาวและตัวเมืองมองจากมุมสูง",
      "r.hills": "เขาชีจรรย์และเนินเขา", "r.hillsD": "พระพุทธรูปลายเส้นทองบนหน้าผาสูง 109 เมตร แล้วขี่ชิลผ่านชนบท", "r.hillsA": "ถนนคดเคี้ยวผ่านเนินเขาเขียวขจี",
      "r.larn": "เกาะล้าน", "r.larnD": "จอดรถที่ท่าเรือแหลมบาลีฮาย (เราบอกจุดให้) นั่งเรือ 30 นาทีไปน้ำทะเลสีฟ้าใส", "r.larnA": "หาดน้ำใสสีฟ้าและป่าเขียวบนเกาะล้าน",
      "safe.tag": "ขี่ปลอดภัย ถูกกฎหมาย", "safe.title": "เช็กลิสต์ <em>แบบตรงไปตรงมา</em>", "safe.alt": "ผู้ขับขี่สวมหมวกเต็มใบสีดำ กระจกหน้าสีส้ม",
      "safe.1t": "ใบขับขี่", "safe.1b": "ประเทศไทยกำหนดให้มีใบขับขี่รถจักรยานยนต์ ของประเทศคุณ หรือใบขับขี่สากลประเภท “A”",
      "safe.2t": "สวมหมวกทุกครั้ง", "safe.2b": "ทั้งคนขับและคนซ้อน ทุกครั้ง เป็นกฎหมาย ค่าปรับ 500 บาท แต่นั่นไม่ใช่เหตุผลหลัก",
      "safe.3t": "ชิดซ้าย", "safe.3b": "ไทยขับรถชิดซ้าย การกลับรถและสุนัขข้ามถนนเป็นเรื่องปกติ ขี่อย่างระมัดระวังเสมอ",
      "safe.4t": "ถ่ายรูปตอนส่งมอบ", "safe.4b": "เราถ่ายรูปรถด้วยกันตอนส่งมอบ ไม่มีปัญหาเรื่องรอยเก่าแน่นอน",
      "rev.tag": "4.9 จาก 640 รีวิว", "rev.title": "ฟังจาก <em>ลูกค้าของเรา</em>",
      "rev.q1": "“PCX มาถึงโรงแรมสะอาดมาก หมวกสองใบพอดีหัว คืนมัดจำในห้านาที แบบนี้แหละที่ควรเป็น”",
      "rev.q2": "“ยางแตกแถวบางเสร่ตอนสามทุ่ม เขานำคันใหม่มาให้ใน 40 นาที บริการยอดเยี่ยม”",
      "rev.q3": "“เช่ารายเดือนช่วงหน้าหนาว ถูกกว่าร้านริมถนน และไม่เคยขอพาสปอร์ตเลย”",
      "faq.tag": "คำถาม", "faq.title": "คำถาม <em>ที่พบบ่อย</em>", "faq.more": "มีคำถามอื่น?", "faq.ask": "ถามเราทาง WhatsApp",
      "faq.q1": "ทำไมไม่เก็บพาสปอร์ต?", "faq.a1": "เพราะเป็นเอกสารสำคัญที่สุดของคุณ โรงแรม ตม. หรือธนาคารอาจขอดู เราจึงเก็บเงินมัดจำแทน (3,000–15,000 บาทตามรุ่น) และถ่ายรูปพาสปอร์ตไว้",
      "faq.q2": "ราคารวมอะไรบ้าง?", "faq.a2": "ส่งและรับรถในพัทยาและจอมเทียน หมวกกันน็อกสองใบ เสื้อกันฝน น้ำมันเต็มถัง กุญแจล็อก ประกันภาคบังคับ และช่วยเหลือ 24 ชั่วโมง ไม่มีค่าใช้จ่ายแอบแฝง",
      "faq.q3": "ราคารายสัปดาห์และรายเดือนคิดอย่างไร?", "faq.a3": "ตั้งแต่ 7 วันใช้อัตรารายสัปดาห์ ตั้งแต่ 28 วันใช้อัตรารายเดือน ระบบคำนวณด้านบนจะแสดงราคาที่ถูกที่สุดให้เสมอ",
      "faq.q4": "ถ้าเกิดอุบัติเหตุหรือรถหาย?", "faq.a4": "โทรหาเราก่อน เราจะไปหา ถ้ามีประกันไม่มีค่าเสียหายส่วนแรก ไม่ต้องจ่าย ถ้าไม่มี คิดค่าซ่อมตามราคาศูนย์ของเรา ไม่เกินเงินมัดจำ",
      "faq.q5": "ยกเลิกได้ไหม?", "faq.a5": "ได้ ฟรีก่อนส่งรถ 12 ชั่วโมง ไม่ต้องจ่ายล่วงหน้า จึงไม่มีอะไรต้องคืน",
      "faq.q6": "ขี่ออกนอกพัทยาได้ไหม?", "faq.a6": "ได้ทั่วชลบุรีและระยอง สัตหีบ บางเสร่ ชายหาดระยอง แค่แจ้งเราไว้ ทีมช่วยเหลือจะได้รู้ว่าคุณอยู่แถวไหน",
      "visit.tag": "ร้านของเรา", "visit.title": "ถนนจอมเทียน <em>สาย 2</em>", "visit.hours": "เวลาเปิด", "visit.daily": "ทุกวัน", "visit.help": "ช่วยเหลือบนถนน 24 ชม.", "visit.contact": "ติดต่อ", "visit.maps": "Google Maps", "visit.map": "แผนที่: Ride Siam ถนนจอมเทียนสาย 2 พัทยา",
      "final.title": "พระอาทิตย์ตกไม่รอใคร <em>คุณก็ไม่ควรรอ</em>", "footer.credit": "เว็บไซต์โดย",
      "t.day": "วัน", "t.days": "วัน"
    },

    ru: {
      "a11y.skip": "Перейти к содержанию", "a11y.language": "Язык", "a11y.menu": "Меню",
      "nav.fleet": "Автопарк", "nav.prices": "Цены", "nav.routes": "Маршруты", "nav.how": "Как это работает", "nav.faq": "Вопросы", "nav.book": "Бронь", "nav.bookFull": "Забронировать скутер",
      "hero.t1": "Паттайя", "hero.t2": "на двух колёсах.",
      "hero.lead": "Премиальные скутеры с доставкой в отель — ТО после каждой аренды, два шлема, полная страховка и помощь на дороге 24/7. И мы никогда не забираем ваш паспорт.",
      "hero.p1": "более 2 300 аренд", "hero.p2": "Бесплатная доставка в отель", "hero.p3": "Без паспорта в залог",
      "quick.title": "Узнайте цену", "quick.cat": "Скутер", "quick.from": "Получение", "quick.to": "Возврат", "quick.go": "Продолжить бронирование",
      "why.aria": "Почему Ride Siam",
      "why.1t": "Доставка в отель", "why.1b": "Бесплатно в Паттайе и Джомтьене, заберём в конце.",
      "why.2t": "Два чистых шлема", "why.2b": "Сертифицированные, продезинфицированные, с новыми подшлемниками.",
      "why.3t": "Страховка без сюрпризов", "why.3b": "ОСАГО включено, страховка без франшизы — по желанию.",
      "why.4t": "Помощь 24/7", "why.4b": "Прокол в полночь? Замена меньше чем за час.",
      "why.5t": "Паспорт остаётся у вас", "why.5b": "Возвратный залог наличными — отдаём сразу.",
      "fleet.tag": "Автопарк", "fleet.title": "Шесть скутеров. <em>Все младше двух лет.</em>", "fleet.aside": "ТО после каждой аренды, мойка перед каждой доставкой, полный бак. Чем дольше аренда — тем дешевле день.",
      "fleet.cat": "Категория", "fleet.period": "Показывать цену", "fleet.hot": "Хит аренды", "fleet.choose": "Выбрать",
      "fleet.fx": "",
      "cat.all": "Все", "cat.city": "Городские", "cat.premium": "Премиум", "cat.maxi": "Макси", "cat.electric": "Электро",
      "per.day": "День", "per.week": "Неделя", "per.month": "Месяц",
      "f.scoopy": "Лёгкий, простой и очень тайский. Для первого опыта и парковки где угодно.", "f.scoopyA": "Сине-белый Honda Scoopy на улице в сумерках",
      "f.pcx": "Умный выбор для двоих: плавный, бесключевой, с ABS и сиденьем для поездки до Саттахипа.", "f.pcxA": "Матово-серый Honda PCX 160 у резной деревянной двери",
      "f.electric": "Тихий и резвый. Съёмная батарея заряжается в номере — ни заправок, ни шума.", "f.electricA": "Салатовый электроскутер на подъездной дорожке",
      "f.primavera": "Итальянский стальной кузов, хром и яркие цвета. Бич-роуд уже не будет прежней.", "f.primaveraA": "Мятная Vespa на набережной с пальмами",
      "f.xmax": "Туристический комфорт: трекшн-контроль, ABS и два шлема под сиденьем. Для дальних поездок.", "f.xmaxA": "Шлем на сиденье Yamaha XMAX над холмистым побережьем",
      "f.gts": "Флагман. Устойчивость больших колёс, 300 кубов тяги и самый красивый способ добраться до Банг Сарая.", "f.gtsA": "Оранжевая Vespa GTS с хромированным багажником на солнце",
      "spec.trunk": "л багажник", "spec.charge": "ч зарядка",
      "book.tag": "Бронь за две минуты", "book.title": "Соберите аренду. <em>Узнайте честную цену.</em>", "book.lead": "Никаких скрытых платежей. Отправьте запрос в WhatsApp — подтвердим за 15 минут и привезём скутер.",
      "book.s1": "Скутер", "book.s2": "Даты", "book.s3": "Доставка", "book.s4": "Дополнительно", "book.s5": "Ваши данные",
      "book.prevM": "Предыдущий месяц", "book.nextM": "Следующий месяц", "book.pickT": "Время получения", "book.retT": "Время возврата",
      "book.d1": "В отель — Паттайя / Джомтьен", "book.d2": "Забрать в нашем офисе в Джомтьене", "book.d3": "Дальше — Наклуа, Банг Сарай, аэропорт", "book.free": "Бесплатно",
      "book.hotel": "Отель или адрес", "book.hotelPh": "напр. Hilton Pattaya, номер комнаты не нужен",
      "book.name": "Имя", "book.phone": "WhatsApp или телефон", "book.licence": "У меня есть права на мотоцикл (или международные с категорией «А»).",
      "book.licHint": "Нет прав? Можно взять E-City или Scoopy для спокойной езды — но полиция штрафует на постах, а страховка не покроет. Спросите нас.",
      "ex.ins": "Страховка без франшизы", "ex.insD": "Царапины, угон, ДТП — вы ничего не платите.", "ex.perDay": "/ день",
      "ex.phone": "Держатель телефона + USB-зарядка", "ex.phoneD": "Навигатор перед глазами, батарея всегда полная.",
      "ex.box": "Кофр", "ex.boxD": "Запирающийся кофр на 40 л — покупки, пляжные сумки, второй шлем.",
      "ex.kid": "Детский шлем", "ex.kidD": "Размеры от 4 до 12 лет.",
      "ex.incl": "Всегда включено: 2 шлема, дождевики, полный бак, замок, ОСАГО, помощь 24/7.",
      "sum.title": "Ваша аренда", "sum.dates": "Даты", "sum.rate": "Тариф", "sum.extras": "Дополнительно", "sum.deliv": "Доставка", "sum.total": "Итого", "sum.deposit": "Возвратный залог", "sum.send": "Запросить в WhatsApp", "sum.foot": "Сейчас ничего платить не нужно. Оплата при получении — наличные, карта или тайский QR.",
      "how.tag": "Как это работает", "how.title": "От телефона <em>до дороги.</em>",
      "how.1t": "Бронируете онлайн", "how.1b": "Выберите скутер и даты. Подтвердим в WhatsApp за 15 минут, без выходных.",
      "how.2t": "Мы привозим", "how.2b": "В отель к выбранному времени. Пять минут осмотра, фото вместе, ключи в руки.",
      "how.3t": "Вы катаетесь", "how.3b": "Пляжи, храмы, смотровые. Что-то случилось — звоните днём и ночью.",
      "how.4t": "Мы забираем", "how.4b": "Оставьте скутер у отеля — заберём сами. Залог возвращаем наличными на месте.",
      "routes.tag": "Куда поехать", "routes.title": "Шесть маршрутов, <em>которые мы любим.</em>", "routes.aside": "Расстояния от нашего офиса в Джомтьене. Листайте — у каждого есть ссылка на Google Maps.",
      "r.easy": "Легко", "r.medium": "Средне", "r.map": "Открыть в картах", "r.ferry": "+ паром",
      "r.view": "Смотровая Кхао Паттайя", "r.viewD": "Весь залив у ваших ног. Приезжайте к 18:00 — город зажигает огни.", "r.viewA": "Залив Паттайи ночью с холма",
      "r.sanctuary": "Святилище Истины", "r.sanctuaryD": "105-метровый храм, целиком вырезанный из тика, на берегу в Наклуа.", "r.sanctuaryA": "Резные деревянные шпили Святилища Истины",
      "r.buddha": "Холм Большого Будды", "r.buddhaD": "Ват Пра Яй на холме Пратамнак: золотой Будда, тихий храм, морской бриз.", "r.buddhaA": "Огромная золотая статуя Будды среди деревьев",
      "r.bay": "Прибрежная петля", "r.bayD": "Бич-роуд → Джомтьен → На Джомтьен. Пальмы, морепродукты, закат по левую руку.", "r.bayA": "Длинная дуга пляжа Джомтьен и город с высоты",
      "r.hills": "Кхао Чи Чан и холмы", "r.hillsD": "109-метровый Будда, нарисованный золотом на скале, и спокойные повороты по сельской местности.", "r.hillsA": "Извилистая дорога через зелёные холмы",
      "r.larn": "Остров Ко Лан", "r.larnD": "Паркуйтесь у пирса Бали Хай (покажем где) — 30 минут на пароме до бирюзовой воды.", "r.larnA": "Бирюзовый пляж и лес на острове Ко Лан",
      "safe.tag": "Безопасно и законно", "safe.title": "Честный <em>чек-лист.</em>", "safe.alt": "Мотоциклист в чёрном интеграле с оранжевым визором",
      "safe.1t": "Права", "safe.1b": "В Таиланде нужны права на мотоцикл — ваши национальные или международные с категорией «А».",
      "safe.2t": "Шлем всегда", "safe.2b": "Водитель и пассажир, в каждой поездке. Это закон, штраф 500 бат — но дело не в этом.",
      "safe.3t": "Держитесь левее", "safe.3b": "В Таиланде левостороннее движение. Развороты и собаки на дороге — обычное дело, будьте готовы ко всему.",
      "safe.4t": "Фото при передаче", "safe.4b": "Фотографируем скутер вместе при доставке. Никаких споров о старых царапинах.",
      "rev.tag": "4,9 по 640 отзывам", "rev.title": "Лучше всего <em>скажут клиенты.</em>",
      "rev.q1": "«PCX приехал в отель идеально чистым, с двумя шлемами по размеру. Залог вернули за пять минут. Так и должно быть.»",
      "rev.q2": "«Прокол у Банг Сарая в девять вечера. Привезли другой скутер за 40 минут. Невероятный сервис.»",
      "rev.q3": "«Брал на месяц на зиму. Дешевле уличных прокатов, и паспорт ни разу не просили.»",
      "faq.tag": "Вопросы", "faq.title": "Хорошие <em>вопросы.</em>", "faq.more": "Что-то ещё?", "faq.ask": "Спросите в WhatsApp",
      "faq.q1": "Почему вы не берёте паспорт?", "faq.a1": "Это ваш главный документ: его могут спросить отель, иммиграция или банк. Вместо него — возвратный залог наличными (3 000–15 000 бат в зависимости от скутера) и фото паспорта.",
      "faq.q2": "Что входит в цену?", "faq.a2": "Доставка и возврат в Паттайе и Джомтьене, два шлема, дождевики, полный бак, замок, обязательное ОСАГО и помощь на дороге 24/7. Без скрытых платежей.",
      "faq.q3": "Как работают недельные и месячные цены?", "faq.a3": "От 7 дней каждый день считается по недельному тарифу, от 28 — по месячному. Калькулятор выше всегда показывает самый выгодный вариант.",
      "faq.q4": "Что если ДТП или угон?", "faq.a4": "Сначала позвоните нам — мы приедем. Со страховкой без франшизы вы ничего не платите. Без неё ремонт по прайсу нашей мастерской, но не больше суммы залога.",
      "faq.q5": "Можно отменить?", "faq.a5": "Да, бесплатно за 12 часов до доставки. Предоплаты нет — возвращать нечего.",
      "faq.q6": "Можно выезжать за пределы Паттайи?", "faq.a6": "По всей провинции Чонбури и Районг — Саттахип, Банг Сарай, пляжи Районга. Просто предупредите нас, чтобы команда помощи знала, где вы.",
      "visit.tag": "Офис", "visit.title": "Джомтьен <em>Second Road.</em>", "visit.hours": "Часы работы", "visit.daily": "Каждый день", "visit.help": "Помощь на дороге 24/7", "visit.contact": "Контакты", "visit.maps": "Google Maps", "visit.map": "Карта: Ride Siam, Jomtien Second Road, Паттайя",
      "final.title": "Закат не ждёт. <em>И вам не стоит.</em>", "footer.credit": "Сайт создан",
      "t.day": "день", "t.days": "дн."
    }
  };

  var UI = {
    en: { open: "Open now · until 20:00", closed: "Closed · opens 08:00 · help 24/7", perDay: "/ day", perWeek: "/ week", perMonth: "/ month",
          hintStart: "Tap your pick-up day", hintEnd: "Now tap your return day", hintDone: "{n} · tap a date to start again",
          rateDay: "Daily rate", rateWeek: "Weekly rate", rateMonth: "Monthly rate", save: "You save {x} with the long-rental rate", none: "None", perDayShort: "day",
          delivHotel: "Hotel delivery", delivShop: "At the shop", delivFar: "Outside the zone", free: "free",
          chooseDates: "Please choose your dates in the calendar.", required: "Please fill this in.", phoneBad: "Please enter a number we can reach on WhatsApp.", hotelReq: "Tell us where to deliver.", badRange: "The return date must be after the pick-up date.",
          sent: "WhatsApp is opening with your request — just press send.",
          waHello: "Hello Ride Siam! I'd like to rent:", waDates: "Dates", waTimes: "Times", waDeliv: "Delivery", waExtras: "Extras", waLic: "Licence", waYes: "yes", waNo: "no", waName: "Name", waPhone: "Phone", waTotal: "Total", waDep: "Deposit" },
    fr: { open: "Ouvert · jusqu'à 20 h", closed: "Fermé · ouvre à 8 h · assistance 24 h/24", perDay: "/ jour", perWeek: "/ semaine", perMonth: "/ mois",
          hintStart: "Touchez le jour de départ", hintEnd: "Touchez maintenant le jour de retour", hintDone: "{n} · touchez une date pour recommencer",
          rateDay: "Tarif jour", rateWeek: "Tarif semaine", rateMonth: "Tarif mois", save: "Vous économisez {x} grâce au tarif longue durée", none: "Aucune", perDayShort: "jour",
          delivHotel: "Livraison à l'hôtel", delivShop: "À la boutique", delivFar: "Hors zone", free: "gratuit",
          chooseDates: "Choisissez vos dates dans le calendrier.", required: "Merci de remplir ce champ.", phoneBad: "Indiquez un numéro joignable sur WhatsApp.", hotelReq: "Indiquez-nous où livrer.", badRange: "La date de retour doit être après la date de départ.",
          sent: "WhatsApp s'ouvre avec votre demande — il ne reste qu'à envoyer.",
          waHello: "Bonjour Ride Siam ! Je voudrais louer :", waDates: "Dates", waTimes: "Horaires", waDeliv: "Livraison", waExtras: "Options", waLic: "Permis", waYes: "oui", waNo: "non", waName: "Nom", waPhone: "Téléphone", waTotal: "Total", waDep: "Caution" },
    th: { open: "เปิดอยู่ · ถึง 20:00 น.", closed: "ปิดแล้ว · เปิด 08:00 น. · ช่วยเหลือ 24 ชม.", perDay: "/ วัน", perWeek: "/ สัปดาห์", perMonth: "/ เดือน",
          hintStart: "แตะเลือกวันรับรถ", hintEnd: "แตะเลือกวันคืนรถ", hintDone: "{n} · แตะวันที่เพื่อเลือกใหม่",
          rateDay: "อัตรารายวัน", rateWeek: "อัตรารายสัปดาห์", rateMonth: "อัตรารายเดือน", save: "ประหยัด {x} ด้วยอัตราเช่านาน", none: "ไม่มี", perDayShort: "วัน",
          delivHotel: "ส่งที่โรงแรม", delivShop: "รับที่ร้าน", delivFar: "นอกเขต", free: "ฟรี",
          chooseDates: "กรุณาเลือกวันที่ในปฏิทิน", required: "กรุณากรอกข้อมูลนี้", phoneBad: "กรุณากรอกเบอร์ที่ติดต่อทาง WhatsApp ได้", hotelReq: "กรุณาระบุสถานที่ส่งรถ", badRange: "วันคืนรถต้องอยู่หลังวันรับรถ",
          sent: "กำลังเปิด WhatsApp พร้อมคำขอ กดส่งได้เลย",
          waHello: "สวัสดีครับ Ride Siam ขอเช่ารถครับ:", waDates: "วันที่", waTimes: "เวลา", waDeliv: "การรับรถ", waExtras: "อุปกรณ์เสริม", waLic: "ใบขับขี่", waYes: "มี", waNo: "ไม่มี", waName: "ชื่อ", waPhone: "เบอร์โทร", waTotal: "รวม", waDep: "มัดจำ" },
    ru: { open: "Открыто · до 20:00", closed: "Закрыто · откроемся в 08:00 · помощь 24/7", perDay: "/ день", perWeek: "/ неделя", perMonth: "/ месяц",
          hintStart: "Выберите день получения", hintEnd: "Теперь выберите день возврата", hintDone: "{n} · нажмите на дату, чтобы начать заново",
          rateDay: "Дневной тариф", rateWeek: "Недельный тариф", rateMonth: "Месячный тариф", save: "Экономия {x} по тарифу долгой аренды", none: "Нет", perDayShort: "день",
          delivHotel: "Доставка в отель", delivShop: "В офисе", delivFar: "За пределами зоны", free: "бесплатно",
          chooseDates: "Выберите даты в календаре.", required: "Заполните это поле.", phoneBad: "Укажите номер, доступный в WhatsApp.", hotelReq: "Укажите, куда доставить.", badRange: "Дата возврата должна быть позже даты получения.",
          sent: "Открываем WhatsApp с вашим запросом — осталось нажать «Отправить».",
          waHello: "Здравствуйте, Ride Siam! Хочу арендовать:", waDates: "Даты", waTimes: "Время", waDeliv: "Доставка", waExtras: "Дополнительно", waLic: "Права", waYes: "есть", waNo: "нет", waName: "Имя", waPhone: "Телефон", waTotal: "Итого", waDep: "Залог" }
  };
  var LOCALE = { en: "en-GB", fr: "fr-FR", th: "th-TH-u-ca-gregory", ru: "ru-RU" };
  var CURRENCY = { en: "usd", fr: "eur", th: "thb", ru: "thb" };
  var RATE = { usd: 35, eur: 38 };
  // Baht is what's paid on delivery; USD/EUR are rounded guides.
  function money(thb, cur) {
    if (cur === "thb") return "฿" + Math.round(thb).toLocaleString("en-US");
    var v = thb / RATE[cur];
    v = v < 10 ? Math.round(v * 10) / 10 : v < 20 ? Math.round(v * 2) / 2 : Math.round(v);
    var s = v % 1 ? v.toFixed(2) : v.toLocaleString("en-US");
    return cur === "eur" ? s.replace(".", ",").replace(/,(\d{3})/g, " $1") + " €" : "$" + s;
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
      l.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;500;700&display=swap";
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
    document.title = { en: "Ride Siam — Premium Scooter Rental, Pattaya & Jomtien", fr: "Ride Siam — Location de scooters premium, Pattaya & Jomtien", th: "Ride Siam — เช่าสกู๊ตเตอร์พรีเมียม พัทยา จอมเทียน", ru: "Ride Siam — премиальная аренда скутеров, Паттайя и Джомтьен" }[lang];
    try { localStorage.setItem("rsLang", lang); } catch (e) {}
    document.dispatchEvent(new CustomEvent("rs:lang", { detail: { lang: lang } }));
  }

  var start = "";
  try { start = localStorage.getItem("rsLang") || ""; } catch (e) {}
  if (!DICT[start]) { var nav = (navigator.language || "en").slice(0, 2).toLowerCase(); start = DICT[nav] ? nav : "en"; }

  window.RSI18n = {
    apply: apply, t: t, ui: ui,
    lang: function () { return current; }, locale: function () { return LOCALE[current]; },
    money: function (thb) { return money(thb, CURRENCY[current]); }
  };
  apply(start);
})();
