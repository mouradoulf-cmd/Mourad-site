/* Mae Lek — EN / FR / TH / RU.
   English is baked into index.html and captured from the DOM on load, so
   only FR, TH and RU need dictionaries. data-i18n="key" sets innerHTML,
   data-i18n-attr="attr:key;…" sets attributes. Strings built in JS live in
   UI. Prices are stored in baht (data-price) and shown in the visitor's
   currency: EN → USD, FR → EUR, TH and RU → THB. */
(function () {
  "use strict";

  var DICT = {
    fr: {
      "a11y.skip": "Aller au contenu", "a11y.language": "Langue", "a11y.menu": "Menu", "a11y.close": "Fermer", "a11y.prev": "Photo précédente", "a11y.next": "Photo suivante",
      "nav.menu": "La carte", "nav.tonight": "Ce soir", "nav.story": "Notre histoire", "nav.find": "Nous trouver", "nav.local": "Manger comme un local",
      "hours.short": "Mar–dim 17 h–1 h",
      "hero.t1": "Feu de wok.", "hero.t2": "Tabourets en plastique.", "hero.t3": "Vraie cuisine thaïe.",
      "hero.lead": "Mae Lek cuisine à ce coin de Soi Buakhao depuis 1998 — un wok, quinze plats et le meilleur pad kra pao de Pattaya. Prenez un tabouret, ou commandez à l'avance et récupérez-le bien chaud.",
      "hero.cta": "Voir la carte", "hero.cta2": "Comment venir", "hero.stickerTop": "Pad kra pao + œuf", "hero.stickerBot": "depuis 1998",
      "tk.1": "Pas de réservation — asseyez-vous", "tk.2": "Espèces &amp; QR thaï", "tk.3": "Vous choisissez le piment", "tk.4": "Commande à l'avance sur WhatsApp", "tk.5": "Végétarien sur demande",
      "board.tag": "Le panneau", "board.title": "Montrez le panneau du doigt. <em>C'est la carte.</em>", "board.aside": "Comme les panneaux accrochés sous notre bâche — touchez un plat pour le mettre dans votre sac. Prix en bahts, tels que peints.", "board.g1": "Riz &amp; wok", "board.g2": "Nouilles &amp; soupes", "board.g3": "Salade, grill &amp; desserts",
      "menu.tag": "La carte", "menu.title": "Quinze plats. <em>Tous délicieux.</em>", "menu.lead": "On montre du doigt, on commande, on mange. Touchez <b>+</b> pour préparer une commande à emporter — elle sera chaude à votre arrivée.",
      "menu.cat": "Catégorie", "menu.veg": "Végétarien", "menu.best": "Le plus vendu", "menu.vegOpt": "option végé", "menu.vegYes": "végétarien", "menu.empty": "Rien ici — essayez une autre catégorie.",
      "menu.fx": "Prix en euros à titre indicatif — le paiement se fait en bahts. Espèces ou QR thaï.",
      "cat.all": "Tout", "cat.wok": "Wok &amp; riz", "cat.noodle": "Nouilles", "cat.soup": "Soupes &amp; salades", "cat.grill": "Grillades", "cat.sweet": "Desserts &amp; boissons",
      "d.krapao": "Porc haché, basilic sacré et piment oiseau, saisis à feu vif. Avec du riz et un œuf frit croustillant.", "d.krapaoA": "Porc haché sauté au basilic sacré, œuf frit croustillant et riz",
      "d.padthai": "Nouilles de riz sauce tamarin, crevettes fraîches, œuf, tofu, pousses de soja et cacahuètes concassées.", "d.padthaiA": "Pad thaï aux crevettes, pousses de soja, cacahuètes et citron vert",
      "d.somtam": "Papaye verte pilée au mortier avec citron vert, sucre de palme, tomates, haricots kilomètre et cacahuètes.", "d.somtamA": "Salade de papaye verte aux tomates et cacahuètes sur une assiette bleue",
      "d.boat": "Nouilles « des bateaux » : un petit bouillon sombre et épicé, bœuf, boulettes et liseron d'eau. Les Thaïs en commandent deux.", "d.boatA": "Deux bols de soupe de nouilles aux boulettes et herbes",
      "d.tomyum": "Soupe aigre-piquante aux crevettes, citronnelle, galanga, combava et un trait de lait concentré.", "d.tomyumA": "Soupe tom yum aux crevettes de rivière et accompagnements",
      "d.moo": "Trois brochettes de porc à l'ail et au lait de coco, grillées au charbon, avec un sachet de riz gluant.", "d.mooA": "Rangées de brochettes de porc grillé sur feuilles de bananier",
      "d.seeew": "Les « nouilles de l'ivrogne » : larges nouilles de riz, fruits de mer, basilic, piment frais et poivre vert. Fumé et généreux.", "d.seeewA": "Larges nouilles sautées aux fruits de mer et basilic",
      "d.rice": "Riz sauté au wok avec œuf, oignon nouveau et poulet, porc ou crevettes au choix. Citron vert et concombre.", "d.riceA": "Riz sauté dans un wok noir au-dessus des flammes",
      "d.curry": "Curry vert au poulet, aubergine thaïe et basilic dans du lait de coco. Riz à côté.", "d.curryA": "Curry au lait de coco, légumes verts et citron vert dans un bol noir",
      "d.chicken": "Poulet frit du Sud, mariné à la racine de coriandre et au poivre, sous une montagne d'échalotes croustillantes.", "d.chickenA": "Poulet frit croustillant aux échalotes frites, avec du riz gluant",
      "d.noodle": "Fines nouilles de riz dans un bouillon aigre-piquant, porc, boulettes de poisson, cacahuètes et citron vert.", "d.noodleA": "Un bol de soupe de nouilles épicée au porc et aux herbes",
      "d.glory": "Liseron d'eau sauté à l'ail, au piment et à la pâte de soja — la flamme monte à un mètre.", "d.gloryA": "Liseron d'eau sauté à l'ail et au piment",
      "d.grill": "Un demi-poulet mariné à la citronnelle, grillé lentement au charbon, sauce tamarin.", "d.grillA": "Viande grillée sur un barbecue au charbon",
      "d.mango": "Riz gluant tiède, crème de coco salée et une mangue nam dok mai entière. Tant qu'il y a des mangues.", "d.mangoA": "Riz gluant et tranches de mangue jaune bien mûre",
      "d.tea": "Thé glacé thaï, fort, orange et très sucré, versé sur glace pilée avec du lait concentré.", "d.teaA": "Deux verres de thé glacé thaï au lait, couleur orange",
      "spice.tag": "Avant de commander", "spice.title": "Jusqu'où <em>osez-vous le piment ?</em>", "spice.lead": "Le piquant thaï n'est pas le piquant « touriste ». Choisissez votre niveau — il s'ajoute à votre commande et Mae Lek cuisinera en conséquence.", "spice.aria": "Niveau de piment",
      "ton.title": "Le spécial de Mae", "ton.add": "Ajouter le spécial du soir", "ton.closed": "Le lundi, Mae se repose. À mardi, 17 h !", "ton.week": "Cette semaine", "ton.cap": "tout juste sorti du wok ↑",
      "ton.n2": "Crevettes de rivière du marché de ce matin.", "ton.n3": "Le mercredi, c'est soirée nouilles.", "ton.n4": "Charbon allumé à 16 h — le poulet vous attend.", "ton.n5": "Soirée brochettes — le moo ping le moins cher de la ville.", "ton.n6": "La pâte de curry maison de Mae, pilée cet après-midi.", "ton.n0": "Douceur du dimanche : les mangues les plus sucrées de la semaine.",
      "story.tag": "Notre histoire", "story.title": "Un coin de rue. <em>Un wok. Depuis 1998.</em>",
      "story.p1": "Mae Lek — « petite maman » — est arrivée de l'Isan avec les recettes de sa mère et un wok d'occasion. Un soir de 1998, elle a poussé sa charrette jusqu'à ce coin de Soi Buakhao et n'en est jamais repartie.",
      "story.p2": "Aujourd'hui, son fils tient le grill, sa nièce pile la som tam, et Mae prépare encore elle-même chaque assiette de kra pao. Douze tables, des tabourets rouges, pas de clim — et une file de chauffeurs de taxi, c'est bon signe.",
      "story.s1": "ans à ce coin de rue", "story.s2": "assiettes par soir", "story.s3": "petites tables", "story.s4": "le plat le moins cher",
      "story.cap": "Mae Lek, 27 ans au même wok", "story.alt1": "Une cuisinière thaïe âgée sert une soupe à son stand, la nuit", "story.alt2": "Des clients sur des tabourets orange à des tables dehors, la nuit",
      "local.tag": "Première fois ?", "local.title": "Mangez comme <em>un local.</em>",
      "local.1t": "Prenez un tabouret", "local.1b": "Toute table libre est à vous. On partage avec des inconnus — c'est la moitié du plaisir.",
      "local.2t": "Montrez &amp; commandez", "local.2b": "Montrez la carte sur votre téléphone ou utilisez les cartes ci-dessous. Mae comprend très bien le doigt pointé.",
      "local.3t": "Assaisonnez vous-même", "local.3b": "Les quatre pots sur chaque table : piment en flocons, sucre, sauce poisson pimentée et vinaigre.",
      "local.4t": "Payez au stand", "local.4b": "Dites « check bin », payez en espèces ou par QR thaï. Pas de pourboire attendu — un sourire suffit.",
      "local.phrases": "Touchez une carte et montrez-la à Mae",
      "ph.1": "Pas épicé, s'il vous plaît", "ph.2": "Juste un peu épicé", "ph.3": "Sans coriandre", "ph.4": "Je suis végétarien — sans viande, sans sauce poisson", "ph.5": "À emporter", "ph.6": "Très bon !",
      "gal.tag": "Dans la rue", "gal.title": "Fumée, grésillements <em>&amp; néons.</em>", "gal.aside": "Touchez une photo pour l'agrandir.",
      "gal.c0": "Le coup de feu de 18 h", "gal.c1": "Le mur de brochettes", "gal.c2": "Soi Buakhao à la nuit tombée", "gal.c3": "Pok pok pok — la som tam", "gal.c4": "Kra pao, peint à la main", "gal.c5": "On commande tout, on partage tout", "gal.c6": "La charrette des débuts", "gal.c7": "Sous la bâche bleue",
      "gal.a0": "Un cuisinier fait frire des en-cas à un stand animé", "gal.a1": "Brochettes de poulet et de calamar grillés sous des panneaux de prix", "gal.a2": "Un stand de street food thaï éclairé la nuit au bord de la route", "gal.a3": "Une cuisinière pile une salade de papaye dans un mortier en bois", "gal.a4": "Un vieux cuisinier à son stand sous un panneau kra pao peint à la main", "gal.a5": "Une table couverte de plats thaïs vue du dessus", "gal.a6": "Une charrette de street food illuminée au crépuscule", "gal.a7": "Un stand sous une bâche bleue avec des brochettes et un panneau de prix",
      "rev.tag": "Les habitués", "rev.title": "« Aroi mak ! » <em>— tout le monde.</em>",
      "rev.q1": "« Le meilleur kra pao de ma vie pour 50 bahts. J'y ai mangé six soirs sur sept — le septième, c'était lundi. »",
      "rev.q2": "« Tabourets en plastique, zéro déco, cuisine incroyable. Mae a ri de mon thaï et m'a donné plus de mangue. »",
      "rev.q3": "« Commandé à l'avance sur WhatsApp, c'était prêt et chaud à mon arrivée. Les nouilles des bateaux sont authentiques. »",
      "rev.q4": "« La som tam est exactement comme celle de ma grand-mère à Khon Kaen. Prix honnêtes, vrai goût. »",
      "find.tag": "Nous trouver", "find.title": "Cherchez les <em>tabourets rouges.</em>", "find.lead": "Au coin de Soi Buakhao, en face du marché Tree Town, sous la guirlande d'ampoules jaunes. Si ça sent le basilic et qu'il y a de la fumée, vous y êtes.",
      "find.hours": "Horaires", "find.closed": "Fermé", "find.where": "Adresse", "find.maps": "Google Maps", "find.taxi": "Carte pour le chauffeur", "find.map": "Carte : Mae Lek, Soi Buakhao, Pattaya", "find.taxiMean": "Mae Lek, cuisine de rue, Soi Buakhao, Pattaya",
      "faq.tag": "Questions", "faq.title": "Bon <em>à savoir.</em>",
      "faq.q1": "Peut-on réserver une table ?", "faq.a1": "Pas besoin — c'est une cuisine de rue, les tables tournent vite. Pour les groupes de huit ou plus, envoyez-nous un WhatsApp et on rapproche des tables.",
      "faq.q2": "La nourriture est-elle sûre pour les touristes ?", "faq.a2": "Tout est cuit à la commande sur une flamme très vive, la glace vient d'un sac scellé d'usine, et la licence sanitaire municipale est affichée au stand.",
      "faq.q3": "Avez-vous des plats végétariens ?", "faq.a3": "Oui. La plupart des plats au wok se font au tofu, sans sauce poisson ni sauce huître — dites « gin jay » ou utilisez la carte ci-dessus.",
      "faq.q4": "Comment fonctionne la commande à l'avance ?", "faq.a4": "Ajoutez des plats avec +, choisissez une heure de retrait et envoyez la commande sur WhatsApp. On répond avec un pouce levé et on lance la cuisson pour que ce soit chaud à votre arrivée. Vous payez sur place.",
      "faq.q5": "Peut-on payer par carte ?", "faq.a5": "Espèces ou QR thaï (PromptPay) uniquement — il y a un distributeur au 7-Eleven à trente mètres.",
      "final.title": "Une petite faim ? <em>Le wok est allumé.</em>", "final.cta": "Préparer ma commande",
      "footer.tag": "Cuisine de rue thaïe depuis 1998", "footer.credit": "Site réalisé par",
      "order.view": "Voir ma commande", "order.title": "Votre commande", "order.empty": "Votre sac est vide — ajoutez quelque chose de bon.", "order.spice": "Niveau de piment", "order.pickup": "Heure de retrait",
      "order.name": "Nom", "order.phone": "WhatsApp ou téléphone", "order.note": "Un mot pour Mae <i>(facultatif)</i>", "order.notePh": "Sans coriandre, œuf en plus…", "order.total": "Total", "order.fx": "Vous payez en bahts au retrait.", "order.send": "Envoyer la commande sur WhatsApp",
      "order.asap": "Dès que possible", "order.min": "≈ 20 min"
    },

    th: {
      "a11y.skip": "ข้ามไปยังเนื้อหา", "a11y.language": "ภาษา", "a11y.menu": "เมนู", "a11y.close": "ปิด", "a11y.prev": "รูปก่อนหน้า", "a11y.next": "รูปถัดไป",
      "nav.menu": "เมนู", "nav.tonight": "คืนนี้", "nav.story": "เรื่องของเรา", "nav.find": "ที่ตั้งร้าน", "nav.local": "กินแบบคนท้องถิ่น",
      "hours.short": "อังคาร–อาทิตย์ 17:00–01:00",
      "hero.t1": "ไฟแรง กระทะร้อน", "hero.t2": "เก้าอี้พลาสติก", "hero.t3": "อาหารไทยแท้ๆ",
      "hero.lead": "แม่เล็กทำอาหารอยู่หัวมุมซอยบัวขาวมาตั้งแต่ปี 2541 กระทะใบเดียว สิบห้าเมนู และกะเพราที่อร่อยที่สุดในพัทยา นั่งกินที่ร้าน หรือสั่งล่วงหน้าแล้วมารับร้อนๆ",
      "hero.cta": "ดูเมนู", "hero.cta2": "วิธีเดินทางมาร้าน", "hero.stickerTop": "กะเพรา + ไข่ดาว", "hero.stickerBot": "ตั้งแต่ปี 2541",
      "tk.1": "ไม่ต้องจอง มานั่งได้เลย", "tk.2": "เงินสดและสแกน QR", "tk.3": "เลือกความเผ็ดเองได้", "tk.4": "สั่งล่วงหน้าทาง WhatsApp", "tk.5": "มีอาหารเจตามสั่ง",
      "board.tag": "ป้ายเมนู", "board.title": "ชี้ที่ป้าย <em>นั่นแหละเมนู</em>", "board.aside": "เหมือนป้ายที่แขวนใต้ผ้าใบของร้าน แตะเมนูเพื่อใส่ถุง ราคาเป็นบาทตามป้ายเลย", "board.g1": "อาหารจานเดียว", "board.g2": "ก๋วยเตี๋ยวและต้ม", "board.g3": "ส้มตำ ปิ้งย่าง ของหวาน",
      "menu.tag": "เมนู", "menu.title": "สิบห้าเมนู <em>อร่อยทุกจาน</em>", "menu.lead": "ชี้ สั่ง กิน กด <b>+</b> เพื่อสั่งกลับบ้าน มาถึงก็ได้กินร้อนๆ",
      "menu.cat": "หมวดหมู่", "menu.veg": "มังสวิรัติ", "menu.best": "ขายดี", "menu.vegOpt": "ทำเจได้", "menu.vegYes": "มังสวิรัติ", "menu.empty": "ยังไม่มีเมนูในหมวดนี้ ลองหมวดอื่นดูนะ",
      "menu.fx": "",
      "cat.all": "ทั้งหมด", "cat.wok": "อาหารจานเดียว", "cat.noodle": "ก๋วยเตี๋ยว", "cat.soup": "ต้ม แกง ยำ", "cat.grill": "ปิ้งย่าง", "cat.sweet": "ของหวานและเครื่องดื่ม",
      "d.krapao": "หมูสับผัดกะเพรากับพริกขี้หนู ไฟแรงๆ เสิร์ฟพร้อมข้าวสวยและไข่ดาวกรอบ", "d.krapaoA": "ผัดกะเพราหมูสับ ไข่ดาวกรอบ และข้าวสวย",
      "d.padthai": "เส้นจันท์ผัดซอสมะขาม กุ้งสด ไข่ เต้าหู้ ถั่วงอก และถั่วลิสงคั่ว", "d.padthaiA": "ผัดไทยกุ้ง ถั่วงอก ถั่วลิสง และมะนาว",
      "d.somtam": "มะละกอดิบตำในครกดินกับมะนาว น้ำตาลปี๊บ มะเขือเทศ ถั่วฝักยาว และถั่วลิสง", "d.somtamA": "ส้มตำไทยกับมะเขือเทศและถั่วลิสงในจานสีฟ้า",
      "d.boat": "น้ำซุปเข้มข้นเครื่องเทศ เนื้อ ลูกชิ้น ผักบุ้ง ชามเล็ก คนไทยสั่งทีละสองชาม", "d.boatA": "ก๋วยเตี๋ยวสองชามกับลูกชิ้นและผักสมุนไพร",
      "d.tomyum": "ต้มยำกุ้งรสจัด ตะไคร้ ข่า ใบมะกรูด ใส่นมข้นจืดเล็กน้อย", "d.tomyumA": "ต้มยำกุ้งแม่น้ำและเครื่องเคียง",
      "d.moo": "หมูปิ้งหมักกระเทียมและกะทิสามไม้ ย่างเตาถ่าน พร้อมข้าวเหนียวหนึ่งห่อ", "d.mooA": "หมูปิ้งเรียงบนใบตอง",
      "d.seeew": "เส้นใหญ่ผัดขี้เมาทะเล ใบกะเพรา พริกสด และพริกไทยอ่อน หอมกลิ่นกระทะ", "d.seeewA": "ผัดขี้เมาเส้นใหญ่ทะเลกับใบกะเพรา",
      "d.rice": "ข้าวผัดไข่ ต้นหอม เลือกไก่ หมู หรือกุ้ง เสิร์ฟพร้อมมะนาวและแตงกวา", "d.riceA": "ข้าวผัดในกระทะเหล็กบนไฟแรง",
      "d.curry": "แกงเขียวหวานไก่ มะเขือเปราะ โหระพา ในน้ำกะทิ เสิร์ฟพร้อมข้าวสวย", "d.curryA": "แกงกะทิกับผักและมะนาวในชามสีดำ",
      "d.chicken": "ไก่ทอดสไตล์ใต้ หมักรากผักชีและพริกไทย โรยหอมเจียวกรอบๆ", "d.chickenA": "ไก่ทอดกรอบโรยหอมเจียว กับข้าวเหนียว",
      "d.noodle": "เส้นเล็กในน้ำซุปต้มยำ หมู ลูกชิ้นปลา ถั่วป่น และมะนาว", "d.noodleA": "ก๋วยเตี๋ยวต้มยำหมูกับผักสมุนไพร",
      "d.glory": "ผักบุ้งผัดไฟแดงกับกระเทียม พริก และเต้าเจี้ยว ไฟพุ่งสูงเป็นเมตร", "d.gloryA": "ผัดผักบุ้งกระเทียมพริก",
      "d.grill": "ไก่ย่างครึ่งตัวหมักตะไคร้ ย่างเตาถ่านช้าๆ พร้อมน้ำจิ้มแจ่ว", "d.grillA": "เนื้อย่างบนเตาถ่าน",
      "d.mango": "ข้าวเหนียวอุ่นๆ ราดกะทิ กับมะม่วงน้ำดอกไม้ทั้งลูก หมดแล้วหมดเลย", "d.mangoA": "ข้าวเหนียวกับมะม่วงสุกสีเหลือง",
      "d.tea": "ชาเย็นเข้มข้น สีส้ม หวานฉ่ำ ราดนมข้นบนน้ำแข็งบด", "d.teaA": "ชาเย็นสีส้มสองแก้ว",
      "spice.tag": "ก่อนสั่ง", "spice.title": "กินเผ็ด <em>ได้แค่ไหน?</em>", "spice.lead": "เผ็ดแบบไทยไม่ใช่เผ็ดแบบนักท่องเที่ยว เลือกระดับความเผ็ด ระบบจะใส่ในออเดอร์ให้ แล้วแม่เล็กจะทำตามนั้น", "spice.aria": "ระดับความเผ็ด",
      "ton.title": "เมนูพิเศษของแม่", "ton.add": "เพิ่มเมนูพิเศษคืนนี้", "ton.closed": "วันจันทร์แม่หยุดพัก เจอกันวันอังคารห้าโมงเย็นนะ!", "ton.week": "สัปดาห์นี้", "ton.cap": "ร้อนๆ จากกระทะ ↑",
      "ton.n2": "กุ้งแม่น้ำสดจากตลาดเช้านี้", "ton.n3": "วันพุธคืนก๋วยเตี๋ยว", "ton.n4": "จุดเตาถ่านตั้งแต่สี่โมง ไก่รออยู่แล้ว", "ton.n5": "คืนวันศุกร์ หมูปิ้งถูกที่สุดในเมือง", "ton.n6": "พริกแกงที่แม่ตำเองเมื่อบ่ายนี้", "ton.n0": "วันอาทิตย์ มะม่วงหวานที่สุดของสัปดาห์",
      "story.tag": "เรื่องของเรา", "story.title": "หัวมุมเดียว <em>กระทะเดียว ตั้งแต่ปี 2541</em>",
      "story.p1": "แม่เล็กมาจากอีสานพร้อมสูตรของแม่และกระทะมือสองหนึ่งใบ เย็นวันหนึ่งในปี 2541 แม่เข็นรถเข็นมาตั้งที่หัวมุมซอยบัวขาว และไม่เคยย้ายไปไหนอีกเลย",
      "story.p2": "วันนี้ลูกชายดูแลเตาย่าง หลานสาวตำส้มตำ และแม่ยังผัดกะเพราทุกจานด้วยตัวเอง สิบสองโต๊ะ เก้าอี้พลาสติกสีแดง ไม่มีแอร์ และมีพี่ๆ แท็กซี่ต่อคิว นั่นแหละคือการันตี",
      "story.s1": "ปีที่หัวมุมนี้", "story.s2": "จานต่อคืน", "story.s3": "โต๊ะเล็กๆ", "story.s4": "เมนูที่ถูกที่สุด",
      "story.cap": "แม่เล็ก 27 ปีกับกระทะใบเดิม", "story.alt1": "แม่ครัวสูงวัยกำลังตักน้ำซุปที่ร้านริมทางยามค่ำคืน", "story.alt2": "ลูกค้านั่งเก้าอี้พลาสติกสีส้มที่โต๊ะริมทางยามค่ำ",
      "local.tag": "มาครั้งแรก?", "local.title": "กินแบบ <em>คนท้องถิ่น</em>",
      "local.1t": "หาเก้าอี้นั่ง", "local.1b": "โต๊ะไหนว่างนั่งได้เลย นั่งร่วมกับคนอื่นก็สนุกดี",
      "local.2t": "ชี้แล้วสั่ง", "local.2b": "เปิดเมนูในมือถือ หรือใช้การ์ดด้านล่าง แม่เข้าใจการชี้นิ้วดีมาก",
      "local.3t": "ปรุงเอง", "local.3b": "เครื่องปรุงสี่อย่างบนโต๊ะ พริกป่น น้ำตาล น้ำปลาพริก และน้ำส้มสายชู",
      "local.4t": "จ่ายที่ร้าน", "local.4b": "บอกว่า “เช็คบิล” จ่ายเงินสดหรือสแกน QR ไม่ต้องให้ทิป ยิ้มให้ก็พอ",
      "local.phrases": "แตะการ์ดแล้วยื่นให้แม่ดู",
      "ph.1": "ไม่เผ็ดนะคะ", "ph.2": "เผ็ดนิดหน่อย", "ph.3": "ไม่ใส่ผักชี", "ph.4": "กินเจ ไม่ใส่เนื้อสัตว์ ไม่ใส่น้ำปลา", "ph.5": "ใส่ถุงกลับบ้าน", "ph.6": "อร่อยมาก!",
      "gal.tag": "บรรยากาศริมถนน", "gal.title": "ควัน เสียงฉ่า <em>และแสงไฟ</em>", "gal.aside": "แตะรูปเพื่อดูแบบเต็มจอ",
      "gal.c0": "ช่วงคนแน่นหกโมงเย็น", "gal.c1": "กำแพงไม้เสียบ", "gal.c2": "ซอยบัวขาวยามค่ำ", "gal.c3": "โป๊ก โป๊ก โป๊ก ส้มตำ", "gal.c4": "กะเพรา ป้ายเขียนมือ", "gal.c5": "สั่งทุกอย่าง แบ่งกันกิน", "gal.c6": "รถเข็นคันแรก", "gal.c7": "ใต้ผ้าใบสีฟ้า",
      "gal.a0": "แม่ครัวทอดของว่างที่ร้านริมทางที่คึกคัก", "gal.a1": "ไก่และปลาหมึกย่างเสียบไม้ใต้ป้ายราคา", "gal.a2": "ร้านอาหารริมทางเปิดไฟสว่างข้างถนนยามค่ำคืน", "gal.a3": "แม่ครัวตำส้มตำในครกไม้", "gal.a4": "คุณลุงแม่ครัวที่ร้านริมทางใต้ป้ายกะเพราเขียนมือ", "gal.a5": "โต๊ะเต็มไปด้วยอาหารไทยมองจากด้านบน", "gal.a6": "รถเข็นขายอาหารเปิดไฟยามพลบค่ำ", "gal.a7": "ร้านใต้ผ้าใบสีฟ้ามีไม้เสียบและป้ายราคา",
      "rev.tag": "ขาประจำ", "rev.title": "“อร่อยมาก!” <em>ใครๆ ก็ว่า</em>",
      "rev.q1": "“กะเพราที่อร่อยที่สุดในชีวิตในราคา 50 บาท กินที่นี่หกคืนจากเจ็ด คืนที่เจ็ดคือวันจันทร์”",
      "rev.q2": "“เก้าอี้พลาสติก ไม่มีการตกแต่ง แต่อาหารสุดยอด แม่หัวเราะภาษาไทยของฉัน แล้วแถมมะม่วงให้”",
      "rev.q3": "“สั่งล่วงหน้าทาง WhatsApp มาถึงก็พร้อมและร้อน ก๋วยเตี๋ยวเรือของแท้”",
      "rev.q4": "“ส้มตำรสชาติเหมือนของยายที่ขอนแก่นเป๊ะ ราคาซื่อสัตย์ รสชาติจริง”",
      "find.tag": "ที่ตั้งร้าน", "find.title": "มองหา <em>เก้าอี้สีแดง</em>", "find.lead": "หัวมุมซอยบัวขาว ตรงข้ามตลาดทรีทาวน์ ใต้หลอดไฟสีเหลือง ถ้าได้กลิ่นกะเพราและเห็นควัน แปลว่ามาถูกแล้ว",
      "find.hours": "เวลาเปิด", "find.closed": "ปิด", "find.where": "ที่อยู่", "find.maps": "Google Maps", "find.taxi": "การ์ดสำหรับคนขับ", "find.map": "แผนที่: แม่เล็ก ซอยบัวขาว พัทยา", "find.taxiMean": "ร้านแม่เล็ก ซอยบัวขาว พัทยา",
      "faq.tag": "คำถาม", "faq.title": "ข้อควร <em>รู้</em>",
      "faq.q1": "จองโต๊ะได้ไหม?", "faq.a1": "ไม่ต้องจอง ร้านริมทางโต๊ะหมุนเร็ว ถ้ามาแปดคนขึ้นไป ส่ง WhatsApp มา เราจะต่อโต๊ะให้",
      "faq.q2": "อาหารสะอาดปลอดภัยไหม?", "faq.a2": "ทุกจานปรุงสดบนไฟแรง น้ำแข็งจากโรงงานบรรจุถุงปิดสนิท และมีใบอนุญาตจำหน่ายอาหารของเทศบาลติดที่ร้าน",
      "faq.q3": "มีอาหารมังสวิรัติไหม?", "faq.a3": "มี เมนูผัดส่วนใหญ่ทำกับเต้าหู้ได้ ไม่ใส่น้ำปลาและน้ำมันหอย บอกว่า “กินเจ” หรือใช้การ์ดด้านบน",
      "faq.q4": "สั่งล่วงหน้าทำอย่างไร?", "faq.a4": "กด + เลือกเมนู เลือกเวลารับ แล้วส่งออเดอร์ทาง WhatsApp เราตอบกลับแล้วเริ่มทำให้ร้อนพอดีตอนคุณมาถึง จ่ายเงินตอนรับ",
      "faq.q5": "จ่ายด้วยบัตรได้ไหม?", "faq.a5": "รับเงินสดหรือสแกน QR พร้อมเพย์เท่านั้น มีตู้ ATM ที่เซเว่นห่างไปสามสิบเมตร",
      "final.title": "หิวแล้วใช่ไหม? <em>กระทะร้อนแล้ว</em>", "final.cta": "เริ่มสั่งอาหาร",
      "footer.tag": "ร้านอาหารริมทางตั้งแต่ปี 2541", "footer.credit": "เว็บไซต์โดย",
      "order.view": "ดูออเดอร์", "order.title": "ออเดอร์ของคุณ", "order.empty": "ยังไม่มีรายการ เลือกเมนูอร่อยๆ ได้เลย", "order.spice": "ระดับความเผ็ด", "order.pickup": "เวลารับอาหาร",
      "order.name": "ชื่อ", "order.phone": "WhatsApp หรือเบอร์โทร", "order.note": "ฝากบอกแม่ <i>(ไม่บังคับ)</i>", "order.notePh": "ไม่ใส่ผักชี เพิ่มไข่…", "order.total": "รวม", "order.fx": "", "order.send": "ส่งออเดอร์ทาง WhatsApp",
      "order.asap": "เร็วที่สุด", "order.min": "≈ 20 นาที"
    },

    ru: {
      "a11y.skip": "Перейти к содержанию", "a11y.language": "Язык", "a11y.menu": "Меню", "a11y.close": "Закрыть", "a11y.prev": "Предыдущее фото", "a11y.next": "Следующее фото",
      "nav.menu": "Меню", "nav.tonight": "Сегодня", "nav.story": "Наша история", "nav.find": "Как найти", "nav.local": "Ешьте как местные",
      "hours.short": "Вт–Вс 17:00–01:00",
      "hero.t1": "Огонь вока.", "hero.t2": "Пластиковые стулья.", "hero.t3": "Настоящая тайская еда.",
      "hero.lead": "Мэ Лек готовит на этом углу Сои Буакхао с 1998 года — один вок, пятнадцать блюд и лучший пад кра пао в Паттайе. Садитесь за столик или закажите заранее и заберите горячим.",
      "hero.cta": "Смотреть меню", "hero.cta2": "Как нас найти", "hero.stickerTop": "Пад кра пао + яйцо", "hero.stickerBot": "с 1998 года",
      "tk.1": "Без брони — просто садитесь", "tk.2": "Наличные и тайский QR", "tk.3": "Остроту выбираете вы", "tk.4": "Заказ заранее в WhatsApp", "tk.5": "Вегетарианское по запросу",
      "board.tag": "Вывеска", "board.title": "Покажите на вывеску. <em>Это и есть меню.</em>", "board.aside": "Как вывески под нашим тентом — нажмите на блюдо, чтобы положить его в пакет. Цены в батах, как на табличке.", "board.g1": "Рис и вок", "board.g2": "Лапша и супы", "board.g3": "Салат, гриль и сладкое",
      "menu.tag": "Меню", "menu.title": "Пятнадцать блюд. <em>Все вкусные.</em>", "menu.lead": "Показали пальцем, заказали, поели. Нажмите <b>+</b>, чтобы собрать заказ навынос — к вашему приходу всё будет горячим.",
      "menu.cat": "Категория", "menu.veg": "Вегетарианское", "menu.best": "Хит продаж", "menu.vegOpt": "есть вег-вариант", "menu.vegYes": "вегетарианское", "menu.empty": "Здесь пока пусто — попробуйте другую категорию.",
      "menu.fx": "",
      "cat.all": "Всё", "cat.wok": "Вок и рис", "cat.noodle": "Лапша", "cat.soup": "Супы и салаты", "cat.grill": "Гриль", "cat.sweet": "Десерты и напитки",
      "d.krapao": "Свиной фарш, священный базилик и перец чили, обжаренные на сильном огне. С рисом и хрустящей глазуньей.", "d.krapaoA": "Свиной фарш с базиликом, хрустящая глазунья и рис",
      "d.padthai": "Рисовая лапша в соусе из тамаринда с креветками, яйцом, тофу, ростками сои и дроблёным арахисом.", "d.padthaiA": "Пад тай с креветками, ростками сои, арахисом и лаймом",
      "d.somtam": "Зелёная папайя, растолчённая в глиняной ступке с лаймом, пальмовым сахаром, помидорами, стручковой фасолью и арахисом.", "d.somtamA": "Салат из зелёной папайи с помидорами и арахисом на синей тарелке",
      "d.boat": "«Лодочная» лапша: небольшая порция тёмного пряного бульона с говядиной, фрикадельками и водяным шпинатом. Тайцы берут две.", "d.boatA": "Две миски супа с лапшой, фрикадельками и зеленью",
      "d.tomyum": "Кисло-острый суп с креветками, лемонграссом, галангалом, каффир-лаймом и каплей сгущённого молока.", "d.tomyumA": "Суп том ям с речными креветками и закусками",
      "d.moo": "Три шпажки свинины в чесноке и кокосовом молоке на углях, с пакетиком клейкого риса.", "d.mooA": "Ряды шпажек жареной свинины на банановых листьях",
      "d.seeew": "«Пьяная лапша»: широкая рисовая лапша, морепродукты, базилик, свежий чили и зелёный перец. Громко и с дымком.", "d.seeewA": "Широкая жареная лапша с морепродуктами и базиликом",
      "d.rice": "Жареный рис с яйцом, зелёным луком и курицей, свининой или креветками на выбор. Лайм и огурец рядом.", "d.riceA": "Жареный рис в чёрном воке над огнём",
      "d.curry": "Зелёное карри с курицей, тайскими баклажанами и базиликом на кокосовом молоке. С рисом.", "d.curryA": "Кокосовое карри с зеленью и лаймом в чёрной миске",
      "d.chicken": "Жареная курица по-южному, маринованная в корне кинзы и перце, под горой хрустящего лука-шалота.", "d.chickenA": "Хрустящая жареная курица с жареным шалотом и клейким рисом",
      "d.noodle": "Тонкая рисовая лапша в кисло-остром бульоне со свининой, рыбными шариками, арахисом и лаймом.", "d.noodleA": "Миска острого супа с лапшой, свининой и зеленью",
      "d.glory": "Водяной шпинат, обжаренный с чесноком, чили и соевой пастой — пламя взлетает на метр.", "d.gloryA": "Водяной шпинат с чесноком и чили",
      "d.grill": "Половина курицы в маринаде из лемонграсса, медленно на углях, с соусом из тамаринда.", "d.grillA": "Мясо на угольном гриле",
      "d.mango": "Тёплый клейкий рис, солоноватые кокосовые сливки и целый спелый манго нам док май. Пока манго не закончились.", "d.mangoA": "Клейкий рис с дольками спелого жёлтого манго",
      "d.tea": "Тайский чай со льдом — крепкий, оранжевый и очень сладкий, со сгущёнкой на колотом льду.", "d.teaA": "Два стакана оранжевого тайского чая с молоком",
      "spice.tag": "Перед заказом", "spice.title": "Насколько остро <em>вы готовы?</em>", "spice.lead": "Тайская острота — это не «туристическая». Выберите уровень — он добавится к заказу, и Мэ Лек приготовит именно так.", "spice.aria": "Уровень остроты",
      "ton.title": "Спецпредложение Мэ", "ton.add": "Добавить блюдо дня", "ton.closed": "В понедельник у Мэ выходной. Ждём во вторник в пять!", "ton.week": "На этой неделе", "ton.cap": "прямо из вока ↑",
      "ton.n2": "Речные креветки с утреннего рынка.", "ton.n3": "Среда — вечер лапши.", "ton.n4": "Угли разожгли в четыре — курица уже ждёт.", "ton.n5": "Пятница шпажек — самый дешёвый му пинг в городе.", "ton.n6": "Паста карри от Мэ, растолчённая сегодня днём.", "ton.n0": "Воскресное лакомство: самые сладкие манго недели.",
      "story.tag": "Наша история", "story.title": "Один угол. <em>Один вок. С 1998 года.</em>",
      "story.p1": "Мэ Лек — «маленькая мама» — приехала в Паттайю из Исана с рецептами своей матери и подержанным воком. Однажды вечером в 1998 году она поставила тележку на этом углу Сои Буакхао и больше не уходила.",
      "story.p2": "Сегодня её сын стоит у гриля, племянница толчёт сом там, а Мэ по-прежнему сама готовит каждую тарелку кра пао. Двенадцать столиков, красные пластиковые стулья, без кондиционера — и очередь из таксистов, а это лучший знак.",
      "story.s1": "лет на этом углу", "story.s2": "тарелок за вечер", "story.s3": "столиков", "story.s4": "самое дешёвое блюдо",
      "story.cap": "Мэ Лек, 27 лет у одного вока", "story.alt1": "Пожилая тайская повариха наливает суп у своего уличного прилавка ночью", "story.alt2": "Гости на оранжевых пластиковых стульях за уличными столиками ночью",
      "local.tag": "Впервые?", "local.title": "Ешьте как <em>местные.</em>",
      "local.1t": "Займите стул", "local.1b": "Любой свободный столик ваш. Сесть с незнакомцами — половина удовольствия.",
      "local.2t": "Покажите и закажите", "local.2b": "Покажите меню на телефоне или карточки ниже. Мэ отлично понимает жесты.",
      "local.3t": "Приправьте сами", "local.3b": "Четыре баночки на каждом столе: хлопья чили, сахар, рыбный соус с чили и уксус.",
      "local.4t": "Оплата у тележки", "local.4b": "Скажите «чек бин», платите наличными или по тайскому QR. Чаевые не ждут — достаточно улыбки.",
      "local.phrases": "Нажмите на карточку и покажите Мэ",
      "ph.1": "Не остро, пожалуйста", "ph.2": "Чуть-чуть остро", "ph.3": "Без кинзы", "ph.4": "Я вегетарианец — без мяса и рыбного соуса", "ph.5": "С собой", "ph.6": "Очень вкусно!",
      "gal.tag": "На улице", "gal.title": "Дым, шипение <em>и неон.</em>", "gal.aside": "Нажмите на фото, чтобы открыть на весь экран.",
      "gal.c0": "Час пик в 18:00", "gal.c1": "Стена шпажек", "gal.c2": "Сои Буакхао после заката", "gal.c3": "Пок-пок-пок — сом там", "gal.c4": "Кра пао, вывеска от руки", "gal.c5": "Заказываем всё, делим всё", "gal.c6": "Тележка, с которой всё началось", "gal.c7": "Под синим тентом",
      "gal.a0": "Повар жарит закуски у оживлённого уличного прилавка", "gal.a1": "Шпажки с курицей и кальмаром под ценниками", "gal.a2": "Уличный тайский прилавок, освещённый ночью у дороги", "gal.a3": "Повариха толчёт салат из папайи в деревянной ступке", "gal.a4": "Пожилой повар у прилавка под нарисованной от руки вывеской кра пао", "gal.a5": "Стол, заставленный тайскими блюдами, вид сверху", "gal.a6": "Тележка с уличной едой светится в сумерках", "gal.a7": "Прилавок под синим тентом со шпажками и табличкой цен",
      "rev.tag": "Постоянные гости", "rev.title": "«Арой мак!» <em>— говорят все.</em>",
      "rev.q1": "«Лучший кра пао в моей жизни за 50 бат. Ел здесь шесть вечеров из семи — седьмой был понедельник.»",
      "rev.q2": "«Пластиковые стулья, никакого декора, невероятная еда. Мэ посмеялась над моим тайским и положила больше манго.»",
      "rev.q3": "«Заказал заранее в WhatsApp — всё было готово и горячее. Лодочная лапша — настоящая.»",
      "rev.q4": "«Сом там точно как у моей бабушки в Кхонкэне. Честные цены, настоящий вкус.»",
      "find.tag": "Как найти", "find.title": "Ищите <em>красные стулья.</em>", "find.lead": "На углу Сои Буакхао, напротив рынка Tree Town, под гирляндой жёлтых лампочек. Пахнет базиликом и идёт дым — значит, вы на месте.",
      "find.hours": "Часы работы", "find.closed": "Закрыто", "find.where": "Адрес", "find.maps": "Google Maps", "find.taxi": "Карточка для водителя", "find.map": "Карта: Mae Lek, Сои Буакхао, Паттайя", "find.taxiMean": "Уличная кухня Mae Lek, Сои Буакхао, Паттайя",
      "faq.tag": "Вопросы", "faq.title": "Полезно <em>знать.</em>",
      "faq.q1": "Можно забронировать стол?", "faq.a1": "Не нужно — это уличная кухня, столики освобождаются быстро. Для групп от восьми человек напишите в WhatsApp, и мы сдвинем столы.",
      "faq.q2": "Еда безопасна для туристов?", "faq.a2": "Всё готовится на заказ на очень сильном огне, лёд — из запечатанных заводских пакетов, а муниципальная лицензия висит на прилавке.",
      "faq.q3": "Есть вегетарианские блюда?", "faq.a3": "Да. Большинство блюд из вока можно приготовить с тофу, без рыбного и устричного соуса — скажите «гин джей» или покажите карточку выше.",
      "faq.q4": "Как работает заказ заранее?", "faq.a4": "Добавьте блюда кнопкой +, выберите время и отправьте заказ в WhatsApp. Мы ответим и начнём готовить, чтобы к вашему приходу всё было горячим. Оплата при получении.",
      "faq.q5": "Можно оплатить картой?", "faq.a5": "Только наличные или тайский QR (PromptPay) — банкомат есть в 7-Eleven в тридцати метрах.",
      "final.title": "Проголодались? <em>Вок уже горит.</em>", "final.cta": "Собрать заказ",
      "footer.tag": "Тайская уличная кухня с 1998 года", "footer.credit": "Сайт создан",
      "order.view": "Мой заказ", "order.title": "Ваш заказ", "order.empty": "Пакет пуст — добавьте что-нибудь вкусное.", "order.spice": "Острота", "order.pickup": "Время получения",
      "order.name": "Имя", "order.phone": "WhatsApp или телефон", "order.note": "Для Мэ <i>(необязательно)</i>", "order.notePh": "Без кинзы, лишнее яйцо…", "order.total": "Итого", "order.fx": "", "order.send": "Отправить заказ в WhatsApp",
      "order.asap": "Как можно скорее", "order.min": "≈ 20 мин"
    }
  };

  var UI = {
    en: { open: "Cooking now · until 01:00", opens: "Opens tonight at 17:00", monday: "Closed Mondays · back Tuesday 17:00", tonight: "Tonight", tomorrow: "Tomorrow",
          spice: [["ไม่เผ็ด", "Not spicy", "Zero chili. Nobody will judge you."], ["เผ็ดนิดหน่อย", "A little spicy", "The safe choice for a first visit."], ["เผ็ดกลาง", "Medium", "A pleasant burn. Keep the iced tea close."], ["เผ็ด", "Spicy", "How Mae eats it. Sweating is normal."], ["เผ็ดมาก", "Thai spicy", "Ten bird's-eye chilies. You have been warned. 🔥"]],
          added: "Added to your order:", chooseTime: "Please choose a pick-up time.", required: "Please fill this in.", phoneBad: "Please enter a number we can reach on WhatsApp.", emptyBag: "Add at least one dish first.",
          sent: "WhatsApp is opening with your order — just press send.", special: "special", remove: "Remove one", addOne: "Add one", closedNow: "We're closed right now — choose a time for our next evening.",
          waHello: "Hello Mae Lek! Takeaway order:", waSpice: "Spice", waPickup: "Pick-up", waName: "Name", waPhone: "Phone", waNote: "Note", waTotal: "Total", waAsap: "as soon as possible" },
    fr: { open: "En cuisine · jusqu'à 1 h", opens: "Ouvre ce soir à 17 h", monday: "Fermé le lundi · retour mardi 17 h", tonight: "Ce soir", tomorrow: "Demain",
          spice: [["ไม่เผ็ด", "Pas épicé", "Zéro piment. Personne ne vous jugera."], ["เผ็ดนิดหน่อย", "Un peu épicé", "Le bon choix pour une première fois."], ["เผ็ดกลาง", "Moyen", "Une brûlure agréable. Gardez le thé glacé à portée."], ["เผ็ด", "Épicé", "Comme Mae le mange. Transpirer est normal."], ["เผ็ดมาก", "Piquant thaï", "Dix piments oiseau. Vous êtes prévenu. 🔥"]],
          added: "Ajouté à votre commande :", chooseTime: "Choisissez une heure de retrait.", required: "Merci de remplir ce champ.", phoneBad: "Indiquez un numéro joignable sur WhatsApp.", emptyBag: "Ajoutez d'abord au moins un plat.",
          sent: "WhatsApp s'ouvre avec votre commande — il ne reste qu'à envoyer.", special: "spécial", remove: "Retirer un", addOne: "Ajouter un", closedNow: "Nous sommes fermés — choisissez une heure pour notre prochaine soirée.",
          waHello: "Bonjour Mae Lek ! Commande à emporter :", waSpice: "Piment", waPickup: "Retrait", waName: "Nom", waPhone: "Téléphone", waNote: "Note", waTotal: "Total", waAsap: "dès que possible" },
    th: { open: "กำลังทำอาหาร · ถึงตีหนึ่ง", opens: "คืนนี้เปิด 17:00 น.", monday: "ปิดวันจันทร์ · เปิดวันอังคาร 17:00 น.", tonight: "คืนนี้", tomorrow: "พรุ่งนี้",
          spice: [["ไม่เผ็ด", "ไม่เผ็ด", "ไม่ใส่พริกเลย ไม่มีใครว่า"], ["เผ็ดนิดหน่อย", "เผ็ดนิดหน่อย", "เหมาะสำหรับมาครั้งแรก"], ["เผ็ดกลาง", "เผ็ดกลาง", "เผ็ดกำลังดี มีชาเย็นไว้ใกล้ๆ"], ["เผ็ด", "เผ็ด", "แบบที่แม่กิน เหงื่อออกเป็นเรื่องปกติ"], ["เผ็ดมาก", "เผ็ดแบบไทย", "พริกขี้หนูสิบเม็ด เตือนแล้วนะ 🔥"]],
          added: "เพิ่มในออเดอร์แล้ว:", chooseTime: "กรุณาเลือกเวลารับ", required: "กรุณากรอกข้อมูลนี้", phoneBad: "กรุณากรอกเบอร์ที่ติดต่อทาง WhatsApp ได้", emptyBag: "กรุณาเลือกอาหารอย่างน้อยหนึ่งจาน",
          sent: "กำลังเปิด WhatsApp พร้อมออเดอร์ กดส่งได้เลย", special: "พิเศษ", remove: "ลดหนึ่ง", addOne: "เพิ่มหนึ่ง", closedNow: "ตอนนี้ร้านปิดอยู่ เลือกเวลาสำหรับรอบถัดไป",
          waHello: "สวัสดีค่ะแม่เล็ก ขอสั่งกลับบ้านค่ะ:", waSpice: "ความเผ็ด", waPickup: "เวลารับ", waName: "ชื่อ", waPhone: "เบอร์โทร", waNote: "หมายเหตุ", waTotal: "รวม", waAsap: "เร็วที่สุด" },
    ru: { open: "Готовим · до 01:00", opens: "Сегодня открываемся в 17:00", monday: "По понедельникам закрыто · ждём во вторник в 17:00", tonight: "Сегодня", tomorrow: "Завтра",
          spice: [["ไม่เผ็ด", "Не остро", "Ноль перца. Никто не осудит."], ["เผ็ดนิดหน่อย", "Чуть-чуть остро", "Безопасный выбор для первого раза."], ["เผ็ดกลาง", "Средне", "Приятное жжение. Держите чай со льдом рядом."], ["เผ็ด", "Остро", "Как ест сама Мэ. Потеть — нормально."], ["เผ็ดมาก", "По-тайски", "Десять перцев чили. Вас предупредили. 🔥"]],
          added: "Добавлено в заказ:", chooseTime: "Выберите время получения.", required: "Заполните это поле.", phoneBad: "Укажите номер, доступный в WhatsApp.", emptyBag: "Сначала добавьте хотя бы одно блюдо.",
          sent: "Открываем WhatsApp с вашим заказом — осталось нажать «Отправить».", special: "спец", remove: "Убрать одно", addOne: "Добавить одно", closedNow: "Сейчас мы закрыты — выберите время на следующий вечер.",
          waHello: "Здравствуйте, Mae Lek! Заказ навынос:", waSpice: "Острота", waPickup: "Получение", waName: "Имя", waPhone: "Телефон", waNote: "Комментарий", waTotal: "Итого", waAsap: "как можно скорее" }
  };
  var LOCALE = { en: "en-GB", fr: "fr-FR", th: "th-TH-u-ca-gregory", ru: "ru-RU" };
  var CURRENCY = { en: "usd", fr: "eur", th: "thb", ru: "thb" };
  var RATE = { usd: 35, eur: 38 };
  // Baht is what's paid at the cart; USD/EUR are rounded guides
  // (to 10 cents under 10, to the half unit under 20, to the unit above).
  function money(thb, cur) {
    if (cur === "thb") return "฿" + thb.toLocaleString("en-US");
    var v = thb / RATE[cur];
    v = v < 10 ? Math.round(v * 10) / 10 : v < 20 ? Math.round(v * 2) / 2 : Math.round(v);
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
      l.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;600;800&display=swap";
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
    document.querySelectorAll("[data-wd]").forEach(function (el) {
      el.textContent = new Intl.DateTimeFormat(LOCALE[lang], { weekday: "long" }).format(new Date(Date.UTC(2024, 0, 7 + Number(el.getAttribute("data-wd")), 12)));
    });
    document.querySelectorAll("[data-fx]").forEach(function (el) { el.hidden = CURRENCY[lang] === "thb"; });
    document.querySelectorAll("[data-lang]").forEach(function (b) { b.setAttribute("aria-current", b.getAttribute("data-lang") === lang ? "true" : "false"); });
    document.title = { en: "Mae Lek — Thai Street Kitchen, Pattaya", fr: "Mae Lek — Cuisine de rue thaïe, Pattaya", th: "แม่เล็ก — ร้านอาหารริมทาง พัทยา", ru: "Mae Lek — тайская уличная кухня, Паттайя" }[lang];
    try { localStorage.setItem("mlkLang", lang); } catch (e) {}
    document.dispatchEvent(new CustomEvent("sf:lang", { detail: { lang: lang } }));
  }

  var start = "";
  try { start = localStorage.getItem("mlkLang") || ""; } catch (e) {}
  if (!DICT[start]) { var nav = (navigator.language || "en").slice(0, 2).toLowerCase(); start = DICT[nav] ? nav : "en"; }

  window.SFI18n = {
    apply: apply, t: t, ui: ui,
    lang: function () { return current; }, locale: function () { return LOCALE[current]; },
    money: function (thb) { return money(thb, CURRENCY[current]); }
  };
  apply(start);
})();
