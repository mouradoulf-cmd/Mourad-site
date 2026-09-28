/* Neon Tiger — EN / FR / TH / RU.
   English is baked into index.html and captured from the DOM on load, so
   only FR, TH and RU need dictionaries. data-i18n="key" sets innerHTML,
   data-i18n-attr="attr:key;…" sets attributes. Strings built in JS live in
   UI. Prices are stored in baht (data-price / data-hh) and shown in the
   visitor's currency: EN → USD, FR → EUR, TH and RU → THB (Russian visitors
   in Pattaya count in baht). */
(function () {
  "use strict";

  var DICT = {
    fr: {
      "a11y.skip": "Aller au contenu", "a11y.language": "Langue", "a11y.menu": "Menu", "a11y.close": "Fermer", "a11y.prev": "Photo précédente", "a11y.next": "Photo suivante",
      "intro.sub": "Bar billard · Pattaya",
      "nav.tonight": "Ce soir", "nav.drinks": "Boissons", "nav.pool": "Billard", "nav.gallery": "Photos", "nav.find": "Nous trouver", "nav.book": "Réserver",
      "hero.eyebrow": "Bar billard · Soi 7 · Pattaya", "hero.t1": "Bière fraîche.", "hero.t2": "Nuits chaudes.", "hero.t3": "Billard jusqu'à 3 h.",
      "hero.lead": "Six billards gratuits, quarante boissons, le happy hour le plus bruyant de Beach Road — et une équipe qui retient ton prénom. Ouvert tous les soirs dès 16 h.",
      "hero.cta": "Réserver une table", "hero.cta2": "Au programme ce soir",
      "live.label": "Ce soir au Neon Tiger", "live.hh": "Happy hour · 16:00–20:00", "live.hhDeal": "Chang pression à prix happy hour · cocktails à moitié prix", "live.tonight": "Ce soir",
      "mq.1": "Happy hour 16 h–20 h", "mq.2": "Billard gratuit. Toujours.", "mq.3": "Foot en direct sur 6 écrans", "mq.4": "DJ chaque vendredi et samedi", "mq.5": "Buckets dès <span data-price=\"390\">฿390</span>", "mq.6": "Ouvert jusqu'à 3 h",
      "vibe.eyebrow": "Le bar", "vibe.title": "Là où Pattaya <em class=\"glow\">s'échauffe.</em>",
      "vibe.p1": "Grand ouvert sur la rue, ventilos qui tournent, musique juste assez forte. Le Neon Tiger, c'est le bar de la Soi 7 devant lequel on passe une fois — puis où l'on revient chaque soir du séjour.",
      "vibe.p2": "Touristes, expats et locaux aux mêmes tables. Une équipe de douze derrière le bar et en salle, rapide pour servir une bière fraîche, encore plus avec une queue de billard. Pas d'entrée payante, pas de dress code, pas de chichis.",
      "vibe.s1": "billards gratuits", "vibe.s2": "bières &amp; cocktails", "vibe.s3": "grands écrans", "vibe.s4": "soirs par an",
      "vibe.alt1": "Le long bar éclairé par des ampoules suspendues", "vibe.alt2": "Des amis au bar sous un néon rouge", "vibe.sticker": "Entrée", "vibe.sticker2": "gratuite",
      "week.eyebrow": "Tous les soirs", "week.title": "Sept soirs. <em class=\"glow\">Sept raisons.</em>", "week.aside": "Ce soir est en surbrillance — touche un jour.", "week.days": "Jour de la semaine", "week.today": "Ce soir", "week.cta": "Réserver pour ce soir-là",
      "ev.1t": "Tournoi de billard", "ev.1b": "Seize joueurs, une table, aucune pitié. Inscription <span data-price=\"200\">฿200</span>, le gagnant rafle la cagnotte et un bucket offert.", "ev.1g": "Inscription au bar",
      "ev.2t": "Beer pong du mardi", "ev.2b": "Équipes de deux, gobelets de Chang, tableau sur l'ardoise. Les gagnants boivent gratuitement le reste de la soirée.", "ev.2g": "Entrée libre",
      "ev.3t": "Concert live", "ev.3b": "Rock thaï, tubes des années 90 et tout ce que vous criez assez fort. Deux sets, un rappel, zéro silence.", "ev.3g": "Demandes bienvenues",
      "ev.4t": "Neon Quiz", "ev.4b": "Six manches, dont une musicale. L'équipe gagnante remporte une bouteille de Sang Som — la dernière paie les shots.", "ev.4g": "Équipes jusqu'à 6",
      "ev.5t": "Soirée DJ", "ev.5b": "House, hip-hop et tubes thaïs jusqu'à la fermeture. Vers minuit, les billards se transforment en piste de danse.", "ev.5g": "Entrée libre",
      "ev.6t": "Neon Party", "ev.6b": "Lumières UV, peinture fluo à l'entrée, confettis à minuit et un DJ qui ne fait jamais de pause.", "ev.6g": "La plus grosse soirée de la semaine",
      "ev.0time": "Toute la journée", "ev.0t": "Dimanche foot", "ev.0b": "Tous les grands matchs en direct sur six écrans, avec le son. Buckets de bière pour la table, ailes de poulet jusqu'au coup de sifflet final.", "ev.0g": "Premier League · Ligue des champions",
      "dr.eyebrow": "La carte", "dr.title": "Des boissons. <em class=\"glow glow--amber\">Beaucoup.</em>", "dr.hhNow": "C'est le happy hour", "dr.lead": "Taxes comprises. Prix happy hour en néon.", "dr.tablist": "Boissons",
      "dr.beer": "Bières", "dr.cocktails": "Cocktails", "dr.buckets": "Buckets", "dr.bottles": "Bouteilles", "dr.food": "À grignoter", "dr.draft": "pression",
      "dr.b1": "Le classique de Pattaya, glacé, direct du fût.", "dr.b2": "Légère, fraîche, le choix des locaux.", "dr.b3": "La lager thaïe d'origine, depuis 1933.", "dr.b4": "En bouteille, servie dans un verre givré.", "dr.b5": "Bière blanche belge avec une tranche d'orange.", "dr.b6t": "Tour de Chang · 3 L", "dr.b6": "Pour la table. Avec son propre robinet.",
      "dr.sig": "signature", "dr.c1": "Vodka, litchi, fruit de la passion et pois papillon — il passe du bleu au rose.", "dr.c2": "Rhum Sang Som, ginger beer, citron vert frais.", "dr.c3": "Rhum blanc, menthe du marché, beaucoup de glace pilée.", "dr.c4": "Deux rhums, orange, amande. Un goût de vacances.", "dr.c5": "Cinq alcools, un verre. Doucement.", "dr.c6": "Tequila, citron vert, bord salé — frozen ou on the rocks.",
      "dr.k1t": "Bucket Sang Som", "dr.k1": "Rhum thaï, Coca, Red Bull, citron vert. L'original de la Soi 7.", "dr.k2t": "Bucket vodka Red Bull", "dr.k2": "Pour quand le DJ commence.", "dr.k3t": "Bucket Neon", "dr.k3": "Notre bucket signature, avec bâtons lumineux et six pailles.", "dr.k4t": "Seau de bières · 5 bouteilles", "dr.k4": "Chang, Leo ou Singha dans la glace. Au choix.",
      "dr.o1t": "Set Sang Som 70 cl", "dr.o1": "Avec soda, Coca, glace et citron vert pour la table.", "dr.o2t": "Set vodka Absolut", "dr.o2": "70 cl, softs et glace compris.", "dr.o3t": "Set Johnnie Walker Black", "dr.o3": "70 cl, soda, glace. Un classique.", "dr.o4t": "Shots de Jägermeister × 6", "dr.o4": "Glacés, pour toute la bande.",
      "dr.f1t": "Ailes de poulet", "dr.f1": "Huit ailes, sauce chili douce ou façon larb épicé.", "dr.f2t": "Pad thaï", "dr.f2": "Du stand de rue d'à côté, directement à ta table.", "dr.f3t": "Frites garnies", "dr.f3": "Fromage, bacon, jalapeños. À partager.", "dr.f4t": "Softs · eau", "dr.f4": "Coca, Sprite, soda, Red Bull, eau.",
      "dr.fx": "Prix indiqués en euros à titre indicatif — on règle en bahts au bar. Espèces, cartes et QR thaï.",
      "sig.eyebrow": "Signature de la maison", "sig.title": "Le Neon Tiger <em class=\"glow\">change de couleur.</em>", "sig.body": "La fleur de pois papillon le rend bleu électrique. On y presse le citron vert et il vire au rose néon sous tes yeux — le cocktail le plus photographié de la Soi 7.", "sig.btn": "Presser le citron", "sig.btn2": "Encore une fois",
      "pool.eyebrow": "Billard", "pool.title": "Six tables. <em class=\"glow glow--green\">Toujours gratuites.</em>", "pool.lead": "Prends un verre, prends une queue, inscris ton nom au tableau. Nos tables sont de niveau, le tapis est neuf et l'équipe joue bien — bats l'un de nous et ta prochaine tournée est offerte.",
      "pool.p1": "Jeu gratuit toute la soirée avec une boisson", "pool.p2": "Tournoi à élimination chaque lundi · <span data-price=\"200\">฿200</span>", "pool.p3": "Queues, craie et un pro du triangle", "pool.p4": "Bats l'équipe, la tournée est pour nous", "pool.fame": "Palmarès · tournoi du lundi",
      "pool.alt1": "Un joueur prépare son coup sur un billard bleu, écrans derrière", "pool.alt2": "La boule 8 noire sur le tapis vert",
      "gal.eyebrow": "Le week-end dernier", "gal.title": "Fallait <em class=\"glow\">être là.</em>", "gal.aside": "Touche une photo pour l'afficher en plein écran.",
      "gal.c0": "Samedi, 1 h du matin", "gal.c1": "Neon Party", "gal.c2": "Pression, toujours fraîche", "gal.c3": "Anniversaire entre potes", "gal.c4": "Derrière le bar", "gal.c5": "La nuit dehors", "gal.c6": "Dimanche foot", "gal.c7": "Notre mur",
      "gal.a0": "Des amis trinquent sur la piste de danse", "gal.a1": "Une foule danse sous un néon rouge", "gal.a2": "Bière pression qui coule du robinet", "gal.a3": "Des amis trinquent", "gal.a4": "Un cocktail ambré aux herbes fraîches sur un bar sombre", "gal.a5": "Une rue thaïe la nuit, néons et tuk-tuks", "gal.a6": "Un groupe lève bières et cocktails", "gal.a7": "Un néon rose sur un mur de briques",
      "rev.eyebrow": "Les habitués", "rev.title": "Venu pour une bière. <em class=\"glow\">Resté jusqu'à 3 h.</em>", "rev.prev": "Avis précédent", "rev.next": "Avis suivant",
      "rev.q1": "« Le meilleur bar billard de Beach Road. Les tables sont vraiment de niveau et la bière vraiment fraîche. »",
      "rev.q2": "« Venu pour une bière, resté pour le DJ, reparti à 3 h. Et j'ai recommencé le lendemain. »",
      "rev.q3": "« Équipe sympa, super musique, prix honnêtes. Notre premier arrêt à chaque voyage. »",
      "rev.q4": "« Le cocktail Neon Tiger change vraiment de couleur. Rien que pour la vidéo, ça vaut le coup. »",
      "rev.q5": "« J'ai regardé le derby sur grand écran avec soixante inconnus. La meilleure ambiance de Pattaya. »",
      "book.eyebrow": "Réserver une table", "book.title": "Garde ta place. <em class=\"glow\">On garde la bière au frais.</em>", "book.lead": "On t'accueille toujours sans réservation — mais le vendredi, le samedi et les soirs de match, une table réservée t'évite d'attendre. On confirme sur WhatsApp en quelques minutes.",
      "book.s1": "Quel soir ?", "book.s2": "À quelle heure ?", "book.s3": "Combien ?", "book.s4": "Où veux-tu être ?", "book.s5": "Tes coordonnées",
      "book.fewer": "Moins de personnes", "book.more": "Plus de personnes", "book.people": "personnes", "book.perk": "🎉 Groupes de 6 et plus : un bucket Neon offert à l'arrivée.",
      "book.o1": "🎱 Table de billard", "book.o2": "🛋️ Box", "book.o3": "🍺 Au bar", "book.o4": "⚽ Près du grand écran", "book.o5": "🎂 Anniversaire / fête",
      "book.name": "Nom", "book.phone": "WhatsApp ou téléphone", "book.note": "Autre chose ? <i>(facultatif)</i>", "book.notePh": "Gâteau d'anniversaire, gros match, une queue pour gaucher…",
      "book.send": "Envoyer sur WhatsApp", "book.hint": "Pas d'acompte, pas de carte. La table est gardée 30 minutes.",
      "book.ticket": "Ta soirée", "book.tNight": "Soir", "book.tTime": "Heure", "book.tPeople": "Groupe", "book.tSpot": "Place", "book.tEvent": "Ce soir-là", "book.tFoot": "À montrer à l'entrée · 20 ans et plus",
      "faq.eyebrow": "Avant de venir", "faq.title": "Bon <em class=\"glow\">à savoir.</em>",
      "faq.q1": "Y a-t-il une entrée payante ou un dress code ?", "faq.a1": "Aucune entrée payante, jamais. Short et tongs, pas de souci — c'est Pattaya.",
      "faq.q2": "Quel âge faut-il avoir ?", "faq.a2": "20 ans et plus, comme l'exige la loi thaïlandaise. Apporte une pièce d'identité ou une photo de ton passeport.",
      "faq.q3": "Le billard est vraiment gratuit ?", "faq.a3": "Vraiment. Commande une boisson et les tables sont à toi. Seul le tournoi du lundi coûte <span data-price=\"200\">฿200</span>, et tout va dans la cagnotte.",
      "faq.q4": "Comment payer ?", "faq.a4": "En espèces (bahts), par Visa et Mastercard, ou avec n'importe quelle appli bancaire thaïe via le QR au bar.",
      "faq.q5": "Peut-on privatiser le bar ?", "faq.a5": "Oui — anniversaires, enterrements de vie de garçon ou soirées d'entreprise, jusqu'à 120 personnes, avec DJ et votre playlist. Écris-nous sur WhatsApp.",
      "find.eyebrow": "Nous trouver", "find.title": "Soi 7, <em class=\"glow\">suis les néons.</em>", "find.where": "Où", "find.hint": "À deux minutes de Beach Road — cherche le tigre rose.", "find.maps": "Ouvrir dans Google Maps",
      "find.when": "Quand", "find.daily": "Tous les jours", "find.hhours": "Happy hour", "find.talk": "Nous écrire", "find.taxi": "Montre ceci à ton taxi ou au chauffeur de baht bus", "find.taxiBtn": "Plein écran", "find.map": "Carte : Neon Tiger, Soi 7, Pattaya",
      "final.title": "La soirée commence. <em class=\"glow\">Tu viens ?</em>", "footer.law": "20 ans et plus · À consommer avec modération", "footer.credit": "Site réalisé par"
    },
    th: {
      "a11y.skip": "ข้ามไปยังเนื้อหา", "a11y.language": "ภาษา", "a11y.menu": "เมนู", "a11y.close": "ปิด", "a11y.prev": "รูปก่อนหน้า", "a11y.next": "รูปถัดไป",
      "intro.sub": "บาร์พูล · พัทยา",
      "nav.tonight": "คืนนี้", "nav.drinks": "เครื่องดื่ม", "nav.pool": "พูล", "nav.gallery": "แกลเลอรี", "nav.find": "แผนที่", "nav.book": "จองโต๊ะ",
      "hero.eyebrow": "บาร์พูล · ซอย 7 · พัทยา", "hero.t1": "เบียร์เย็น ๆ", "hero.t2": "ค่ำคืนสุดมันส์", "hero.t3": "พูลยันตีสาม",
      "hero.lead": "โต๊ะพูลฟรีหกโต๊ะ เครื่องดื่มกว่าสี่สิบรายการ แฮปปี้อาวร์ที่คึกคักที่สุดบนถนนเลียบชายหาด และทีมงานที่จำชื่อคุณได้ เปิดทุกคืนตั้งแต่สี่โมงเย็น",
      "hero.cta": "จองโต๊ะ", "hero.cta2": "คืนนี้มีอะไร",
      "live.label": "คืนนี้ที่ Neon Tiger", "live.hh": "แฮปปี้อาวร์ · 16:00–20:00", "live.hhDeal": "ช้างสดราคาพิเศษ · ค็อกเทลลดครึ่งราคา", "live.tonight": "คืนนี้",
      "mq.1": "แฮปปี้อาวร์ 16–20 น.", "mq.2": "เล่นพูลฟรี ตลอดไป", "mq.3": "ถ่ายทอดสดฟุตบอล 6 จอ", "mq.4": "ดีเจทุกศุกร์และเสาร์", "mq.5": "บัคเก็ตเริ่ม <span data-price=\"390\">฿390</span>", "mq.6": "เปิดถึงตีสาม",
      "vibe.eyebrow": "ร้านของเรา", "vibe.title": "ที่ที่พัทยา <em class=\"glow\">เริ่มคึกคัก</em>",
      "vibe.p1": "เปิดโล่งรับลม พัดลมหมุน เพลงดังกำลังดี Neon Tiger คือบาร์ในซอย 7 ที่คุณเดินผ่านครั้งเดียว แล้วกลับมาทุกคืนตลอดทริป",
      "vibe.p2": "นักท่องเที่ยว ชาวต่างชาติ และคนท้องถิ่นนั่งโต๊ะเดียวกัน ทีมงานสิบสองคนทั้งหลังบาร์และในร้าน เสิร์ฟเบียร์เย็นไว และเล่นพูลเก่งยิ่งกว่า ไม่มีค่าเข้า ไม่มีการแต่งกาย ไม่มีพิธีรีตอง",
      "vibe.s1": "โต๊ะพูลฟรี", "vibe.s2": "เบียร์และค็อกเทล", "vibe.s3": "จอใหญ่", "vibe.s4": "คืนต่อปี",
      "vibe.alt1": "บาร์ยาวที่ส่องสว่างด้วยหลอดไฟห้อย", "vibe.alt2": "เพื่อน ๆ ที่บาร์ใต้แสงนีออนสีแดง", "vibe.sticker": "ไม่มี", "vibe.sticker2": "ค่าเข้า",
      "week.eyebrow": "ทุกคืน", "week.title": "เจ็ดคืน <em class=\"glow\">เจ็ดเหตุผล</em>", "week.aside": "คืนนี้ถูกไฮไลต์ไว้ แตะเพื่อดูวันอื่น", "week.days": "วันในสัปดาห์", "week.today": "คืนนี้", "week.cta": "จองคืนนี้",
      "ev.1t": "แข่งพูลน็อกเอาต์", "ev.1b": "ผู้เล่นสิบหกคน โต๊ะเดียว ไม่มีการออมมือ ค่าสมัคร <span data-price=\"200\">฿200</span> ผู้ชนะรับเงินรางวัลทั้งหมดพร้อมบัคเก็ตฟรี", "ev.1g": "สมัครที่บาร์",
      "ev.2t": "เบียร์ปองวันอังคาร", "ev.2b": "ทีมละสองคน แก้วเบียร์ช้าง ตารางแข่งบนกระดานดำ ทีมชนะดื่มฟรีตลอดคืน", "ev.2g": "เข้าฟรี",
      "ev.3t": "ดนตรีสด", "ev.3b": "ร็อกไทย เพลงฮิตยุค 90 และทุกเพลงที่คุณตะโกนขอดังพอ สองเซ็ต หนึ่งอังกอร์ ไม่มีเงียบ", "ev.3g": "ขอเพลงได้",
      "ev.4t": "นีออนควิซ", "ev.4b": "หกรอบ รวมรอบเพลง ทีมชนะรับเซ็ตแสงโสม ทีมสุดท้ายเลี้ยงช็อต", "ev.4g": "ทีมละไม่เกิน 6 คน",
      "ev.5t": "ดีเจไนท์", "ev.5b": "เฮาส์ ฮิปฮอป และเพลงฮิตไทยจนไฟเปิด โต๊ะพูลกลายเป็นฟลอร์เต้นรำตอนเที่ยงคืน", "ev.5g": "เข้าฟรี",
      "ev.6t": "นีออนปาร์ตี้", "ev.6b": "ไฟ UV สีเรืองแสงที่หน้าประตู คอนเฟตตีตอนเที่ยงคืน และดีเจที่ไม่มีพัก", "ev.6g": "คืนที่ใหญ่ที่สุดของสัปดาห์",
      "ev.0time": "ตลอดวัน", "ev.0t": "ฟุตบอลวันอาทิตย์", "ev.0b": "ถ่ายทอดสดทุกแมตช์ใหญ่บนหกจอพร้อมเสียง บัคเก็ตเบียร์สำหรับโต๊ะ และปีกไก่จนจบเกม", "ev.0g": "พรีเมียร์ลีก · แชมเปียนส์ลีก",
      "dr.eyebrow": "เมนู", "dr.title": "เครื่องดื่ม <em class=\"glow glow--amber\">จัดเต็ม</em>", "dr.hhNow": "ตอนนี้แฮปปี้อาวร์", "dr.lead": "ราคารวมภาษีแล้ว ราคาแฮปปี้อาวร์แสดงเป็นสีนีออน", "dr.tablist": "เครื่องดื่ม",
      "dr.beer": "เบียร์", "dr.cocktails": "ค็อกเทล", "dr.buckets": "บัคเก็ต", "dr.bottles": "ขวด", "dr.food": "ของกินเล่น", "dr.draft": "สด",
      "dr.b1": "คลาสสิกของพัทยา เย็นเจี๊ยบจากถัง", "dr.b2": "เบา สดชื่น ขวัญใจคนท้องถิ่น", "dr.b3": "ลาเกอร์ไทยต้นตำรับตั้งแต่ปี 1933", "dr.b4": "แบบขวด เสิร์ฟในแก้วแช่เย็น", "dr.b5": "เบียร์ข้าวสาลีเบลเยียมพร้อมส้มหนึ่งชิ้น", "dr.b6t": "ทาวเวอร์ช้าง · 3 ลิตร", "dr.b6": "สำหรับทั้งโต๊ะ มีก๊อกในตัว",
      "dr.sig": "ซิกเนเจอร์", "dr.c1": "วอดก้า ลิ้นจี่ เสาวรส และอัญชัน เปลี่ยนจากสีฟ้าเป็นสีชมพู", "dr.c2": "เหล้าแสงโสม จินเจอร์เบียร์ มะนาวสด", "dr.c3": "เหล้ารัมขาว สะระแหน่จากตลาด น้ำแข็งบดเต็มแก้ว", "dr.c4": "รัมสองชนิด ส้ม อัลมอนด์ รสชาติวันหยุด", "dr.c5": "เหล้าห้าชนิดในแก้วเดียว ค่อย ๆ ดื่ม", "dr.c6": "เตกีลา มะนาว ขอบเกลือ แบบปั่นหรือออนเดอะร็อก",
      "dr.k1t": "บัคเก็ตแสงโสม", "dr.k1": "เหล้าไทย โค้ก กระทิงแดง มะนาว ต้นตำรับซอย 7", "dr.k2t": "บัคเก็ตวอดก้ากระทิงแดง", "dr.k2": "สำหรับตอนดีเจเริ่ม", "dr.k3t": "นีออนบัคเก็ต", "dr.k3": "บัคเก็ตซิกเนเจอร์ พร้อมแท่งเรืองแสงและหลอดหกอัน", "dr.k4t": "ถังเบียร์ · 5 ขวด", "dr.k4": "ช้าง ลีโอ หรือสิงห์ในถังน้ำแข็ง เลือกผสมได้",
      "dr.o1t": "เซ็ตแสงโสม 70 ซล.", "dr.o1": "พร้อมโซดา โค้ก น้ำแข็ง และมะนาวสำหรับโต๊ะ", "dr.o2t": "เซ็ตวอดก้าแอบโซลูท", "dr.o2": "70 ซล. รวมมิกเซอร์และน้ำแข็ง", "dr.o3t": "เซ็ตจอห์นนี่วอล์กเกอร์แบล็ก", "dr.o3": "70 ซล. โซดา น้ำแข็ง คลาสสิก", "dr.o4t": "ช็อตเยเกอร์ไมสเตอร์ × 6", "dr.o4": "เย็นเฉียบ สำหรับทั้งแก๊ง",
      "dr.f1t": "ปีกไก่ทอด", "dr.f1": "ปีกไก่แปดชิ้น ซอสพริกหวานหรือแซ่บสไตล์ลาบ", "dr.f2t": "ผัดไทย", "dr.f2": "จากรถเข็นข้าง ๆ ตรงถึงโต๊ะคุณ", "dr.f3t": "เฟรนช์ฟรายส์จัดเต็ม", "dr.f3": "ชีส เบคอน ฮาลาปิโน สำหรับแชร์", "dr.f4t": "น้ำอัดลม · น้ำเปล่า", "dr.f4": "โค้ก สไปรท์ โซดา กระทิงแดง น้ำเปล่า",
      "dr.fx": "",
      "sig.eyebrow": "ซิกเนเจอร์ของร้าน", "sig.title": "Neon Tiger <em class=\"glow\">เปลี่ยนสีได้</em>", "sig.body": "ดอกอัญชันทำให้เป็นสีฟ้าสด บีบมะนาวลงไปแล้วจะกลายเป็นสีชมพูนีออนต่อหน้าคุณ ค็อกเทลที่ถูกถ่ายรูปมากที่สุดในซอย 7", "sig.btn": "บีบมะนาว", "sig.btn2": "อีกครั้ง",
      "pool.eyebrow": "พูล", "pool.title": "หกโต๊ะ <em class=\"glow glow--green\">ฟรีตลอด</em>", "pool.lead": "สั่งเครื่องดื่ม หยิบไม้คิว เขียนชื่อบนกระดาน โต๊ะของเราได้ระดับ ผ้าใหม่ และทีมงานเล่นเก่ง ชนะพวกเราได้ รอบถัดไปร้านเลี้ยง",
      "pool.p1": "เล่นฟรีทั้งคืนเมื่อสั่งเครื่องดื่ม", "pool.p2": "แข่งน็อกเอาต์ทุกวันจันทร์ · <span data-price=\"200\">฿200</span>", "pool.p3": "ไม้คิว ชอล์ก และคนจัดลูกให้", "pool.p4": "ชนะทีมงาน ร้านเลี้ยงรอบนั้น", "pool.fame": "หอเกียรติยศ · แข่งวันจันทร์",
      "pool.alt1": "ผู้เล่นกำลังเล็งบนโต๊ะพูลสีฟ้า มีจอด้านหลัง", "pool.alt2": "ลูกแปดสีดำบนผ้าสีเขียว",
      "gal.eyebrow": "สุดสัปดาห์ที่แล้ว", "gal.title": "ต้อง <em class=\"glow\">มาเห็นเอง</em>", "gal.aside": "แตะที่รูปเพื่อดูแบบเต็มจอ",
      "gal.c0": "วันเสาร์ ตีหนึ่ง", "gal.c1": "นีออนปาร์ตี้", "gal.c2": "เบียร์สด เย็นเสมอ", "gal.c3": "ปาร์ตี้วันเกิด", "gal.c4": "หลังบาร์", "gal.c5": "ค่ำคืนข้างนอก", "gal.c6": "ฟุตบอลวันอาทิตย์", "gal.c7": "ผนังของเรา",
      "gal.a0": "เพื่อน ๆ ชนแก้วค็อกเทลบนฟลอร์", "gal.a1": "ผู้คนเต้นใต้แสงนีออนสีแดง", "gal.a2": "เบียร์สดไหลจากก๊อก", "gal.a3": "เพื่อน ๆ ชนแก้ว", "gal.a4": "ค็อกเทลสีอำพันกับสมุนไพรสดบนบาร์มืด", "gal.a5": "ถนนในไทยยามค่ำคืนกับป้ายนีออนและรถตุ๊กตุ๊ก", "gal.a6": "กลุ่มเพื่อนยกเบียร์และค็อกเทล", "gal.a7": "ป้ายนีออนสีชมพูบนผนังอิฐ",
      "rev.eyebrow": "ขาประจำ", "rev.title": "มาแค่เบียร์ขวดเดียว <em class=\"glow\">อยู่ยันตีสาม</em>", "rev.prev": "รีวิวก่อนหน้า", "rev.next": "รีวิวถัดไป",
      "rev.q1": "“บาร์พูลที่ดีที่สุดบนถนนเลียบชายหาด โต๊ะได้ระดับจริง เบียร์เย็นจริง”",
      "rev.q2": "“มาแค่เบียร์ขวดเดียว อยู่ฟังดีเจ กลับตีสาม แล้วคืนต่อมาก็ทำแบบเดิมอีก”",
      "rev.q3": "“ทีมงานเป็นกันเอง เพลงดี ราคายุติธรรม เป็นที่แรกที่เราแวะทุกทริป”",
      "rev.q4": "“ค็อกเทล Neon Tiger เปลี่ยนสีได้จริง ๆ แค่ถ่ายวิดีโอก็คุ้มแล้ว”",
      "rev.q5": "“ดูดาร์บี้แมตช์บนจอใหญ่กับคนแปลกหน้าหกสิบคน บรรยากาศดีที่สุดในพัทยา”",
      "book.eyebrow": "จองโต๊ะ", "book.title": "จองที่ไว้ก่อน <em class=\"glow\">เบียร์รอเย็น ๆ</em>", "book.lead": "วอล์กอินได้เสมอ แต่คืนวันศุกร์ เสาร์ และวันที่มีแมตช์ใหญ่ การจองโต๊ะช่วยให้ไม่ต้องรอ เรายืนยันทาง WhatsApp ภายในไม่กี่นาที",
      "book.s1": "คืนไหน", "book.s2": "กี่โมง", "book.s3": "กี่คน", "book.s4": "อยากนั่งตรงไหน", "book.s5": "ข้อมูลของคุณ",
      "book.fewer": "ลดจำนวนคน", "book.more": "เพิ่มจำนวนคน", "book.people": "คน", "book.perk": "🎉 มา 6 คนขึ้นไป รับนีออนบัคเก็ตฟรีเมื่อมาถึง",
      "book.o1": "🎱 โต๊ะพูล", "book.o2": "🛋️ บูธ", "book.o3": "🍺 ที่บาร์", "book.o4": "⚽ ใกล้จอใหญ่", "book.o5": "🎂 วันเกิด / ปาร์ตี้",
      "book.name": "ชื่อ", "book.phone": "WhatsApp หรือเบอร์โทร", "book.note": "มีอะไรเพิ่มเติมไหม <i>(ไม่บังคับ)</i>", "book.notePh": "เค้กวันเกิด แมตช์ใหญ่ ไม้คิวสำหรับคนถนัดซ้าย…",
      "book.send": "ส่งทาง WhatsApp", "book.hint": "ไม่ต้องวางมัดจำ ไม่ต้องใช้บัตร เราเก็บโต๊ะไว้ให้ 30 นาที",
      "book.ticket": "ค่ำคืนของคุณ", "book.tNight": "คืน", "book.tTime": "เวลา", "book.tPeople": "จำนวน", "book.tSpot": "ที่นั่ง", "book.tEvent": "คืนนั้นมี", "book.tFoot": "แสดงที่หน้าประตู · อายุ 20 ปีขึ้นไป",
      "faq.eyebrow": "ก่อนมา", "faq.title": "ข้อควร <em class=\"glow\">รู้</em>",
      "faq.q1": "มีค่าเข้าหรือการแต่งกายไหม", "faq.a1": "ไม่มีค่าเข้าเลย กางเกงขาสั้นกับรองเท้าแตะก็ได้ นี่พัทยา",
      "faq.q2": "ต้องอายุเท่าไร", "faq.a2": "20 ปีขึ้นไปตามกฎหมายไทย กรุณานำบัตรประชาชนหรือรูปพาสปอร์ตมาด้วย",
      "faq.q3": "เล่นพูลฟรีจริงไหม", "faq.a3": "จริง สั่งเครื่องดื่มแล้วโต๊ะเป็นของคุณ มีเพียงการแข่งวันจันทร์ที่ค่าสมัคร <span data-price=\"200\">฿200</span> และทั้งหมดเข้าเงินรางวัล",
      "faq.q4": "จ่ายเงินอย่างไร", "faq.a4": "เงินสด บัตรวีซ่าและมาสเตอร์การ์ด หรือสแกน QR ที่บาร์ด้วยแอปธนาคารไทยทุกแอป",
      "faq.q5": "เหมาร้านได้ไหม", "faq.a5": "ได้ ทั้งวันเกิด ปาร์ตี้สละโสด หรืองานบริษัท สูงสุด 120 คน พร้อมดีเจและเพลย์ลิสต์ของคุณ ทักเรามาทาง WhatsApp",
      "find.eyebrow": "แผนที่", "find.title": "ซอย 7 <em class=\"glow\">ตามแสงนีออนมา</em>", "find.where": "ที่ตั้ง", "find.hint": "สองนาทีจากถนนเลียบชายหาด มองหาเสือสีชมพู", "find.maps": "เปิดใน Google Maps",
      "find.when": "เวลา", "find.daily": "ทุกวัน", "find.hhours": "แฮปปี้อาวร์", "find.talk": "ติดต่อเรา", "find.taxi": "ยื่นให้คนขับแท็กซี่หรือรถสองแถวดู", "find.taxiBtn": "เต็มจอ", "find.map": "แผนที่: Neon Tiger ซอย 7 พัทยา",
      "final.title": "คืนนี้เริ่มแล้ว <em class=\"glow\">มาไหม</em>", "footer.law": "อายุ 20 ปีขึ้นไป · ดื่มอย่างรับผิดชอบ", "footer.credit": "เว็บไซต์โดย"
    },
    ru: {
      "a11y.skip": "Перейти к содержанию", "a11y.language": "Язык", "a11y.menu": "Меню", "a11y.close": "Закрыть", "a11y.prev": "Предыдущее фото", "a11y.next": "Следующее фото",
      "intro.sub": "Бильярд-бар · Паттайя",
      "nav.tonight": "Сегодня", "nav.drinks": "Напитки", "nav.pool": "Бильярд", "nav.gallery": "Фото", "nav.find": "Как найти", "nav.book": "Бронь",
      "hero.eyebrow": "Бильярд-бар · Сои 7 · Паттайя", "hero.t1": "Холодное пиво.", "hero.t2": "Жаркие ночи.", "hero.t3": "Бильярд до 3 утра.",
      "hero.lead": "Шесть бесплатных бильярдных столов, сорок напитков, самый громкий хэппи-ауэр на Бич-роуд — и команда, которая помнит ваше имя. Открыто каждый вечер с 16:00.",
      "hero.cta": "Забронировать стол", "hero.cta2": "Что сегодня",
      "live.label": "Сегодня в Neon Tiger", "live.hh": "Хэппи-ауэр · 16:00–20:00", "live.hhDeal": "Разливной Chang по спеццене · коктейли за полцены", "live.tonight": "Сегодня",
      "mq.1": "Хэппи-ауэр 16–20", "mq.2": "Бильярд бесплатно. Всегда.", "mq.3": "Футбол на 6 экранах", "mq.4": "DJ каждую пятницу и субботу", "mq.5": "Бакеты от <span data-price=\"390\">฿390</span>", "mq.6": "Открыто до 3 утра",
      "vibe.eyebrow": "Бар", "vibe.title": "Здесь Паттайя <em class=\"glow\">разогревается.</em>",
      "vibe.p1": "Открытый фасад, крутятся вентиляторы, музыка ровно настолько громкая, насколько нужно. Neon Tiger — тот самый бар на Сои 7, мимо которого проходишь один раз, а потом возвращаешься каждый вечер отпуска.",
      "vibe.p2": "Туристы, экспаты и местные за одними столами. Команда из двенадцати человек за стойкой и в зале: быстро нальют холодного и ещё быстрее сыграют партию. Без платы за вход, без дресс-кода, без понтов.",
      "vibe.s1": "бесплатных стола", "vibe.s2": "видов пива и коктейлей", "vibe.s3": "больших экранов", "vibe.s4": "вечеров в году",
      "vibe.alt1": "Длинная барная стойка в свете подвесных ламп", "vibe.alt2": "Друзья у стойки под красным неоном", "vibe.sticker": "Вход", "vibe.sticker2": "свободный",
      "week.eyebrow": "Каждый вечер", "week.title": "Семь вечеров. <em class=\"glow\">Семь поводов.</em>", "week.aside": "Сегодняшний вечер выделен — выберите любой день.", "week.days": "День недели", "week.today": "Сегодня", "week.cta": "Забронировать на этот вечер",
      "ev.1t": "Турнир по бильярду", "ev.1b": "Шестнадцать игроков, один стол, никакой пощады. Взнос <span data-price=\"200\">฿200</span>, победитель забирает банк и бесплатный бакет.", "ev.1g": "Запись у стойки",
      "ev.2t": "Бир-понг по вторникам", "ev.2b": "Команды по двое, стаканы с Chang, сетка на меловой доске. Победители пьют бесплатно до конца вечера.", "ev.2g": "Вход свободный",
      "ev.3t": "Живая музыка", "ev.3b": "Тайский рок, хиты 90-х и всё, что вы крикнете достаточно громко. Два сета, один бис, ноль тишины.", "ev.3g": "Заказы песен приветствуются",
      "ev.4t": "Неон-квиз", "ev.4b": "Шесть раундов, включая музыкальный. Лучшая команда получает сет Sang Som — последняя угощает шотами.", "ev.4g": "Команды до 6 человек",
      "ev.5t": "DJ-вечер", "ev.5b": "Хаус, хип-хоп и тайские хиты до закрытия. К полуночи бильярдные столы превращаются в танцпол.", "ev.5g": "Вход свободный",
      "ev.6t": "Неон-пати", "ev.6b": "UV-свет, светящаяся краска на входе, конфетти в полночь и DJ без перерывов.", "ev.6g": "Главная ночь недели",
      "ev.0time": "Весь день", "ev.0t": "Футбольное воскресенье", "ev.0b": "Все большие матчи в прямом эфире на шести экранах со звуком. Бакеты пива на стол и крылышки до финального свистка.", "ev.0g": "АПЛ · Лига чемпионов",
      "dr.eyebrow": "Меню", "dr.title": "Напитки. <em class=\"glow glow--amber\">Много.</em>", "dr.hhNow": "Сейчас хэппи-ауэр", "dr.lead": "Цены с налогом. Цены хэппи-ауэра — неоном.", "dr.tablist": "Напитки",
      "dr.beer": "Пиво", "dr.cocktails": "Коктейли", "dr.buckets": "Бакеты", "dr.bottles": "Бутылки", "dr.food": "Закуски", "dr.draft": "разливное",
      "dr.b1": "Классика Паттайи, ледяное, прямо из крана.", "dr.b2": "Лёгкое, освежающее, выбор местных.", "dr.b3": "Оригинальный тайский лагер с 1933 года.", "dr.b4": "В бутылке, подаётся в замороженном бокале.", "dr.b5": "Бельгийское пшеничное с долькой апельсина.", "dr.b6t": "Башня Chang · 3 л", "dr.b6": "На весь стол. Со своим краном.",
      "dr.sig": "фирменный", "dr.c1": "Водка, личи, маракуйя и анчан — меняет цвет с синего на розовый.", "dr.c2": "Ром Sang Som, имбирное пиво, свежий лайм.", "dr.c3": "Белый ром, мята с рынка, много колотого льда.", "dr.c4": "Два рома, апельсин, миндаль. Вкус отпуска.", "dr.c5": "Пять крепких в одном бокале. Не торопитесь.", "dr.c6": "Текила, лайм, солёный край — фроузен или со льдом.",
      "dr.k1t": "Бакет Sang Som", "dr.k1": "Тайский ром, кола, Red Bull, лайм. Оригинал Сои 7.", "dr.k2t": "Бакет водка–Red Bull", "dr.k2": "Для момента, когда начинает DJ.", "dr.k3t": "Неон-бакет", "dr.k3": "Наш фирменный бакет со светящимися палочками и шестью трубочками.", "dr.k4t": "Ведро пива · 5 бутылок", "dr.k4": "Chang, Leo или Singha во льду. Можно смешать.",
      "dr.o1t": "Сет Sang Som 0,7 л", "dr.o1": "С содовой, колой, льдом и лаймом на стол.", "dr.o2t": "Сет водки Absolut", "dr.o2": "0,7 л, миксеры и лёд включены.", "dr.o3t": "Сет Johnnie Walker Black", "dr.o3": "0,7 л, содовая, лёд. Классика.", "dr.o4t": "Шоты Jägermeister × 6", "dr.o4": "Ледяные, на всю компанию.",
      "dr.f1t": "Куриные крылышки", "dr.f1": "Восемь крылышек, сладкий чили или острые в стиле ларб.", "dr.f2t": "Пад-тай", "dr.f2": "С уличной тележки по соседству прямо к вашему столу.", "dr.f3t": "Картофель фри с начинкой", "dr.f3": "Сыр, бекон, халапеньо. На компанию.", "dr.f4t": "Безалкогольное · вода", "dr.f4": "Кола, спрайт, содовая, Red Bull, вода.",
      "dr.fx": "",
      "sig.eyebrow": "Фирменный коктейль", "sig.title": "Neon Tiger <em class=\"glow\">меняет цвет.</em>", "sig.body": "Цветок анчана делает его ярко-синим. Выжмите лайм — и он становится неоново-розовым прямо у вас на глазах. Самый фотографируемый коктейль на Сои 7.", "sig.btn": "Выжать лайм", "sig.btn2": "Ещё раз",
      "pool.eyebrow": "Бильярд", "pool.title": "Шесть столов. <em class=\"glow glow--green\">Всегда бесплатно.</em>", "pool.lead": "Берите напиток, берите кий, пишите имя на доске. Столы ровные, сукно новое, а наша команда играет хорошо — обыграете кого-то из нас, и следующий раунд за счёт заведения.",
      "pool.p1": "Бесплатная игра весь вечер с любым напитком", "pool.p2": "Турнир на выбывание каждый понедельник · <span data-price=\"200\">฿200</span>", "pool.p3": "Кии, мел и человек, который расставит шары", "pool.p4": "Обыграйте команду — раунд за нами", "pool.fame": "Зал славы · турнир по понедельникам",
      "pool.alt1": "Игрок целится на синем бильярдном столе, позади экраны", "pool.alt2": "Чёрный шар номер восемь на зелёном сукне",
      "gal.eyebrow": "Прошлые выходные", "gal.title": "Надо было <em class=\"glow\">быть здесь.</em>", "gal.aside": "Нажмите на фото, чтобы открыть его на весь экран.",
      "gal.c0": "Суббота, час ночи", "gal.c1": "Неон-пати", "gal.c2": "Разливное, всегда холодное", "gal.c3": "День рождения", "gal.c4": "За стойкой", "gal.c5": "Ночь снаружи", "gal.c6": "Футбольное воскресенье", "gal.c7": "Наша стена",
      "gal.a0": "Друзья чокаются коктейлями на танцполе", "gal.a1": "Толпа танцует под красным неоном", "gal.a2": "Разливное пиво льётся из крана", "gal.a3": "Друзья поднимают бокалы", "gal.a4": "Янтарный коктейль со свежими травами на тёмной стойке", "gal.a5": "Тайская улица ночью, неон и тук-туки", "gal.a6": "Компания поднимает пиво и коктейли", "gal.a7": "Розовая неоновая вывеска на кирпичной стене",
      "rev.eyebrow": "Постоянные гости", "rev.title": "Зашёл на одно пиво. <em class=\"glow\">Остался до трёх.</em>", "rev.prev": "Предыдущий отзыв", "rev.next": "Следующий отзыв",
      "rev.q1": "«Лучший бильярд-бар на Бич-роуд. Столы действительно ровные, пиво действительно холодное.»",
      "rev.q2": "«Зашёл на одно пиво, остался ради DJ, ушёл в три. На следующий вечер — то же самое.»",
      "rev.q3": "«Дружелюбная команда, отличная музыка, честные цены. Наша первая остановка в каждой поездке.»",
      "rev.q4": "«Коктейль Neon Tiger правда меняет цвет. Ради одного видео стоит прийти.»",
      "rev.q5": "«Смотрел дерби на большом экране с шестьюдесятью незнакомцами. Лучшая атмосфера в Паттайе.»",
      "book.eyebrow": "Бронь стола", "book.title": "Займите место. <em class=\"glow\">Пиво остудим.</em>", "book.lead": "Без брони мы тоже всегда рады — но в пятницу, субботу и в дни больших матчей забронированный стол избавит от ожидания. Подтверждаем в WhatsApp за пару минут.",
      "book.s1": "Какой вечер?", "book.s2": "Во сколько?", "book.s3": "Сколько человек?", "book.s4": "Где хотите сидеть?", "book.s5": "Ваши данные",
      "book.fewer": "Меньше гостей", "book.more": "Больше гостей", "book.people": "чел.", "book.perk": "🎉 Компаниям от 6 человек — неон-бакет в подарок.",
      "book.o1": "🎱 Бильярдный стол", "book.o2": "🛋️ Диванная зона", "book.o3": "🍺 У стойки", "book.o4": "⚽ У большого экрана", "book.o5": "🎂 День рождения / вечеринка",
      "book.name": "Имя", "book.phone": "WhatsApp или телефон", "book.note": "Что-то ещё? <i>(необязательно)</i>", "book.notePh": "Торт на день рождения, большой матч, кий для левши…",
      "book.send": "Отправить в WhatsApp", "book.hint": "Без депозита и без карты. Стол держим 30 минут.",
      "book.ticket": "Ваш вечер", "book.tNight": "Вечер", "book.tTime": "Время", "book.tPeople": "Компания", "book.tSpot": "Место", "book.tEvent": "В этот вечер", "book.tFoot": "Покажите на входе · 20+",
      "faq.eyebrow": "Перед визитом", "faq.title": "Полезно <em class=\"glow\">знать.</em>",
      "faq.q1": "Есть ли плата за вход или дресс-код?", "faq.a1": "Платы за вход нет и не будет. Шорты и шлёпки — пожалуйста, это Паттайя.",
      "faq.q2": "С какого возраста можно?", "faq.a2": "С 20 лет, как требует тайский закон. Возьмите документ или фото паспорта.",
      "faq.q3": "Бильярд правда бесплатный?", "faq.a3": "Правда. Закажите напиток — и столы ваши. Платный только турнир по понедельникам, <span data-price=\"200\">฿200</span>, и всё уходит в призовой фонд.",
      "faq.q4": "Как можно оплатить?", "faq.a4": "Наличными в батах, картами Visa и Mastercard или через любое тайское банковское приложение по QR у стойки.",
      "faq.q5": "Можно арендовать бар целиком?", "faq.a5": "Да — дни рождения, мальчишники, корпоративы, до 120 гостей, с DJ и вашим плейлистом. Напишите нам в WhatsApp.",
      "find.eyebrow": "Как найти", "find.title": "Сои 7, <em class=\"glow\">идите на неон.</em>", "find.where": "Где", "find.hint": "Две минуты от Бич-роуд — ищите розового тигра.", "find.maps": "Открыть в Google Картах",
      "find.when": "Когда", "find.daily": "Каждый день", "find.hhours": "Хэппи-ауэр", "find.talk": "Связаться", "find.taxi": "Покажите это таксисту или водителю сонгтео", "find.taxiBtn": "На весь экран", "find.map": "Карта: Neon Tiger, Сои 7, Паттайя",
      "final.title": "Вечер начался. <em class=\"glow\">Вы с нами?</em>", "footer.law": "20+ · Пейте ответственно", "footer.credit": "Сайт сделан"
    }
  };

  var UI = {
    en: { openNow: "Open now · until 03:00", opensAt: "Opens today at 16:00", hhLeft: "ends in", hhStarts: "starts in", hhOff: "Every day 16:00–20:00", tonight: "Tonight", tomorrow: "Tomorrow",
          chooseNight: "Please choose a night.", required: "Please fill this in.", phoneBad: "Please enter a number we can reach on WhatsApp.",
          sent: "WhatsApp is opening with your booking — just press send.", waHello: "Hi Neon Tiger! I'd like to book a table:", waNight: "Night", waTime: "Time", waPeople: "People", waSpot: "Spot", waName: "Name", waPhone: "Phone", waNote: "Note",
          hh: "HH", people: "people" },
    fr: { openNow: "Ouvert · jusqu'à 3 h", opensAt: "Ouvre aujourd'hui à 16 h", hhLeft: "se termine dans", hhStarts: "commence dans", hhOff: "Tous les jours 16 h–20 h", tonight: "Ce soir", tomorrow: "Demain",
          chooseNight: "Choisis un soir.", required: "Merci de remplir ce champ.", phoneBad: "Indique un numéro joignable sur WhatsApp.",
          sent: "WhatsApp s'ouvre avec ta réservation — il ne reste qu'à l'envoyer.", waHello: "Salut Neon Tiger ! Je voudrais réserver une table :", waNight: "Soir", waTime: "Heure", waPeople: "Personnes", waSpot: "Place", waName: "Nom", waPhone: "Téléphone", waNote: "Note",
          hh: "HH", people: "personnes" },
    th: { openNow: "เปิดอยู่ · ถึงตีสาม", opensAt: "วันนี้เปิด 16:00 น.", hhLeft: "เหลืออีก", hhStarts: "เริ่มในอีก", hhOff: "ทุกวัน 16:00–20:00 น.", tonight: "คืนนี้", tomorrow: "พรุ่งนี้",
          chooseNight: "กรุณาเลือกคืน", required: "กรุณากรอกข้อมูลนี้", phoneBad: "กรุณากรอกเบอร์ที่ติดต่อทาง WhatsApp ได้",
          sent: "กำลังเปิด WhatsApp พร้อมรายละเอียดการจอง กดส่งได้เลย", waHello: "สวัสดีครับ Neon Tiger ขอจองโต๊ะครับ:", waNight: "คืน", waTime: "เวลา", waPeople: "จำนวน", waSpot: "ที่นั่ง", waName: "ชื่อ", waPhone: "เบอร์โทร", waNote: "หมายเหตุ",
          hh: "HH", people: "คน" },
    ru: { openNow: "Открыто · до 03:00", opensAt: "Сегодня открываемся в 16:00", hhLeft: "закончится через", hhStarts: "начнётся через", hhOff: "Каждый день 16:00–20:00", tonight: "Сегодня", tomorrow: "Завтра",
          chooseNight: "Выберите вечер.", required: "Заполните это поле.", phoneBad: "Укажите номер, доступный в WhatsApp.",
          sent: "Открываем WhatsApp с вашей бронью — осталось нажать «Отправить».", waHello: "Привет, Neon Tiger! Хочу забронировать стол:", waNight: "Вечер", waTime: "Время", waPeople: "Гостей", waSpot: "Место", waName: "Имя", waPhone: "Телефон", waNote: "Комментарий",
          hh: "HH", people: "чел." }
  };
  var LOCALE = { en: "en-GB", fr: "fr-FR", th: "th-TH-u-ca-gregory", ru: "ru-RU" };
  var CURRENCY = { en: "usd", fr: "eur", th: "thb", ru: "thb" };
  var RATE = { usd: 35, eur: 38 };
  // Baht is what's charged at the bar; USD/EUR are rounded guides
  // (to the half unit under 20, to the unit above).
  function money(thb, cur) {
    if (cur === "thb") return "฿" + thb.toLocaleString("en-US");
    var v = thb / RATE[cur];
    v = v < 20 ? Math.round(v * 2) / 2 : Math.round(v);
    var s = v % 1 ? v.toFixed(2) : String(v);
    return cur === "eur" ? s.replace(".", ",") + " €" : "$" + s;
  }

  var EN = {};
  document.querySelectorAll("[data-i18n]").forEach(function (el) { var k = el.getAttribute("data-i18n"); if (!(k in EN)) EN[k] = el.innerHTML; });
  document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
    el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) { var p = pair.split(":"); if (p[1] && !(p[1] in EN)) EN[p[1]] = el.getAttribute(p[0]) || ""; });
  });
  DICT.en = EN;

  var current = "en";
  function t(key) { var d = DICT[current]; return (d && key in d) ? d[key] : (EN[key] || ""); }
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
      l.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;600;700;800&display=swap";
      document.head.appendChild(l);
    }
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n"));
      if (el.innerHTML !== v) el.innerHTML = v;
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) { var p = pair.split(":"); if (p[1]) el.setAttribute(p[0], t(p[1])); });
    });
    // Weekday and month labels straight from Intl, in the page language.
    document.querySelectorAll("[data-wd]").forEach(function (el) {
      el.textContent = new Intl.DateTimeFormat(LOCALE[lang], { weekday: "short" }).format(new Date(Date.UTC(2024, 0, 7 + Number(el.getAttribute("data-wd")), 12))).replace(".", "");
    });
    document.querySelectorAll("[data-month]").forEach(function (el) {
      el.textContent = new Intl.DateTimeFormat(LOCALE[lang], { month: "short" }).format(new Date(Date.UTC(2026, Number(el.getAttribute("data-month")), 15))).replace(".", "");
    });
    document.querySelectorAll("[data-fx]").forEach(function (el) { el.hidden = CURRENCY[lang] === "thb"; });
    document.querySelectorAll("[data-lang]").forEach(function (b) { b.setAttribute("aria-current", b.getAttribute("data-lang") === lang ? "true" : "false"); });
    document.title = { en: "Neon Tiger — Pool Bar, Pattaya", fr: "Neon Tiger — Bar billard, Pattaya", th: "Neon Tiger — บาร์พูล พัทยา", ru: "Neon Tiger — бильярд-бар, Паттайя" }[lang];
    try { localStorage.setItem("ntLang", lang); } catch (e) {}
    document.dispatchEvent(new CustomEvent("nt:lang", { detail: { lang: lang } }));
  }

  var start = "";
  try { start = localStorage.getItem("ntLang") || ""; } catch (e) {}
  if (!DICT[start]) { var nav = (navigator.language || "en").slice(0, 2).toLowerCase(); start = DICT[nav] ? nav : "en"; }

  window.NTI18n = {
    apply: apply, t: t, ui: ui,
    lang: function () { return current; }, locale: function () { return LOCALE[current]; },
    money: function (thb) { return money(thb, CURRENCY[current]); }
  };
  apply(start);
})();
