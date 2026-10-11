/* Noir — EN / FR / TH.
   English is baked into index.html (SEO, no-JS) and captured from the DOM
   on load, so only FR and TH need dictionaries here. Elements carry
   data-i18n="key" (innerHTML) and/or data-i18n-attr="attr:key;attr:key".
   Strings built in JavaScript live in UI below, in all three languages. */
(function () {
  "use strict";

  var DICT = {
    fr: {
      "a11y.skip": "Aller au contenu", "a11y.language": "Langue", "a11y.menu": "Menu", "a11y.scroll": "Faire défiler",
      "a11y.close": "Fermer", "a11y.prevPhoto": "Photo précédente", "a11y.nextPhoto": "Photo suivante", "a11y.view": "Voir",
      "intro.line": "Salon de coiffure · Bangkok",
      "nav.services": "Prestations", "nav.studio": "Le salon", "nav.lookbook": "Lookbook", "nav.team": "L'équipe", "nav.contact": "Contact", "nav.book": "Réserver",
      "hero.eyebrow": "Salon de coiffure · Sukhumvit, Bangkok", "hero.t1": "Vos cheveux,", "hero.t2": "sous leur plus beau jour.",
      "hero.lead": "Coupes précises, couleurs naturelles et rituels qui ralentissent la ville. Sur rendez-vous, depuis 2014.",
      "hero.cta": "Réserver ma visite", "hero.cta2": "Voir la carte", "hero.rating": "· 380+ avis Google",
      "mq.1": "Coupes de précision", "mq.2": "Couleur naturelle", "mq.3": "Balayage", "mq.4": "Rituels kératine", "mq.5": "Barbier", "mq.6": "Coiffure de mariée", "mq.7": "Soin du cuir chevelu",
      "studio.eyebrow": "Le salon", "studio.title": "Une pièce calme <em>dans une ville bruyante.</em>",
      "studio.p1": "Noir, c'est neuf fauteuils, un long mur noir et une équipe qui préfère écouter dix minutes plutôt que deviner une seule. Nous coupons pour la façon dont vos cheveux tombent au vingtième jour, pas seulement le jour où vous partez.",
      "studio.p2": "Pas de précipitation, pas de vente forcée, pas de musique trop forte. Juste une belle lumière, un excellent café et des gens très, très doués.",
      "studio.s1": "ans sur la Soi 11", "studio.s2": "coiffeurs &amp; barbiers", "studio.s3": "note moyenne", "studio.s4": "rendez-vous",
      "studio.alt1": "Le salon Noir : murs noirs, miroirs ronds et fauteuils de coiffure", "studio.alt2": "Brosses, peignes et sèche-cheveux posés sur fond blanc",
      "svc.eyebrow": "La carte", "svc.title": "Tout ce dont vos cheveux ont besoin. <em>Rien de plus.</em>", "svc.tablist": "Catégories de prestations",
      "svc.cut": "Coupe &amp; coiffage", "svc.colour": "Couleur", "svc.barber": "Barbier", "svc.care": "Rituels", "svc.bridal": "Mariée",
      "svc.note": "Les prix varient selon la longueur et le niveau du coiffeur. La consultation est toujours offerte.",
      "svc.fx": "Prix indiqués en euros à titre indicatif — le règlement se fait en bahts au salon.", "book.price": "À partir de", "svc.cta": "Réserver cette prestation",
      "p.from": "dès", "p.m20": "20 min", "p.m30": "30 min", "p.m40": "40 min", "p.m45": "45 min", "p.m50": "50 min", "p.m60": "60 min", "p.m75": "75 min", "p.m90": "90 min", "p.h2": "2 h", "p.h25": "2 h 30", "p.h3": "3 h",
      "p.cut1": "Coupe &amp; coiffage signature", "p.cut1d": "Consultation, rituel de lavage, coupe de précision et brushing.",
      "p.cut2": "Changement de style", "p.cut2d": "Une nouvelle silhouette, avec une consultation approfondie.",
      "p.cut3": "Brushing &amp; finition", "p.cut3d": "Lisse, volume ou ondulations souples.",
      "p.cut4": "Frange &amp; retouche", "p.cut4d": "Entre deux coupes, sans rendez-vous en semaine.",
      "p.col1": "Balayage naturel", "p.col1d": "Peint à la main, repousse douce, patine incluse.",
      "p.col2": "Couleur complète", "p.col2d": "Une teinte des racines aux pointes, finition gloss.",
      "p.col3": "Retouche racines", "p.col3d": "Jusqu'à quatre semaines de repousse.",
      "p.col4": "Gloss &amp; patine", "p.col4d": "Brillance et couleur ravivée entre deux visites.",
      "p.bar1": "Coupe classique", "p.bar1d": "Ciseaux ou tondeuse, finition serviette chaude.",
      "p.bar2": "Dégradé à blanc", "p.bar2d": "Un dégradé net et parfaitement fondu, coiffé.",
      "p.bar3": "Taille de barbe", "p.bar3d": "Forme, contours, serviette chaude et huile.",
      "p.bar4": "Coupe &amp; barbe", "p.bar4d": "Le rituel complet, du début à la fin.",
      "p.car1": "Lissage à la kératine", "p.car1d": "Sans frisottis, résistant à l'humidité, jusqu'à quatre mois.",
      "p.car2": "Rituel spa du cuir chevelu", "p.car2d": "Exfoliation, massage des points de pression et vapeur.",
      "p.car3": "Réparation des liaisons", "p.car3d": "Reconstruit le cheveu après couleur, décoloration ou chaleur.",
      "p.car4": "Masque hydratation intense", "p.car4d": "Pour les longueurs sèches, fatiguées par le soleil.",
      "p.bri1": "Essai mariée", "p.bri1d": "On teste la coiffure ensemble, des semaines avant le jour J.",
      "p.bri2": "Coiffure de mariée", "p.bri2d": "Le jour J, au salon ou sur place.",
      "p.bri3": "Cortège", "p.bri3d": "Par invitée, coiffée le jour même.",
      "rit.eyebrow": "À chaque visite", "rit.title": "Le rituel <em>Noir.</em>",
      "rit.1t": "On écoute", "rit.1b": "Dix minutes sans hâte sur vos cheveux, votre routine et la vie dans laquelle ils doivent s'intégrer.",
      "rit.2t": "Le lavage", "rit.2b": "Eau tiède, massage lent du cuir chevelu, serviette chaude. La plupart des clients se taisent à ce moment-là.",
      "rit.3t": "Le travail", "rit.3b": "Coupe à sec ou mouillée, couleur peinte à la main, vérifiée à la lumière du jour près de la fenêtre.",
      "rit.4t": "La finition", "rit.4b": "Coiffé, photographié si vous le souhaitez, avec trois conseils honnêtes pour le refaire vous-même.",
      "look.eyebrow": "Lookbook", "look.title": "Réalisations récentes, <em>en lumière naturelle.</em>", "look.aside": "Touchez une photo pour l'afficher en plein écran.",
      "look.c0": "Ondulations lilas", "look.s0": "Couleur · Mali", "look.a0": "Longues ondulations lilas",
      "look.c1": "Rose, en mouvement", "look.s1": "Couleur · Mali", "look.a1": "Cheveux rose vif en mouvement",
      "look.c2": "Boucles naturelles", "look.s2": "Coupe boucles · Ploy", "look.a2": "Boucles naturelles serrées",
      "look.c3": "Balayage miel", "look.s3": "Balayage · Mali", "look.a3": "Long balayage miel vu de dos",
      "look.c4": "Chignon flou", "look.s4": "Coiffage · Anna", "look.a4": "Femme souriante avec un chignon flou",
      "look.c5": "Dégradé à blanc", "look.s5": "Barbier · Ton", "look.a5": "Barbier affinant un dégradé à blanc",
      "look.c6": "Ondulations brunes", "look.s6": "Coupe &amp; gloss · Ploy", "look.a6": "Ondulations brunes souples devant un mur rose",
      "look.c7": "Boucles au fer", "look.s7": "Coiffage · Anna", "look.a7": "Coiffeuse bouclant de longs cheveux bruns au fer",
      "team.eyebrow": "L'équipe", "team.title": "De beaux cheveux, <em>c'est un sport d'équipe.</em>",
      "team.r1": "Directrice artistique · couleur", "team.r2": "Coiffeuse senior · coupes de précision", "team.r3": "Coiffeuse · mariages &amp; événements", "team.r4": "Maître barbier",
      "team.more": "…et cinq autres coiffeurs et barbiers, tous formés chez nous.", "team.alt": "Trois coiffeuses de Noir riant avec leurs ciseaux et leurs brosses",
      "rev.eyebrow": "Clients", "rev.title": "Avec leurs <em>mots.</em>", "rev.prev": "Avis précédent", "rev.next": "Avis suivant", "rev.group": "Avis",
      "rev.q1": "« Le plus beau balayage en dix ans à Bangkok. Mali a écouté, puis a fait exactement ce que je n'arrivais pas à expliquer. »", "rev.w1": "Balayage naturel",
      "rev.q2": "« Calme, précis, zéro vente forcée. Le rituel du cuir chevelu vaut à lui seul la traversée de la ville. »", "rev.w2": "Rituel spa du cuir chevelu",
      "rev.q3": "« Le dégradé de Ton est chirurgical. J'ai réservé mes trois prochaines visites avant de partir. »", "rev.w3": "Dégradé à blanc",
      "rev.q4": "« Ils ont coiffé ma mère et moi pour mon mariage. On a pleuré toutes les deux — de bonheur. »", "rev.w4": "Coiffure de mariée",
      "rev.q5": "« Je suis arrivée avec des pointes abîmées par la décoloration, je suis repartie avec des cheveux qui bougent à nouveau. »", "rev.w5": "Réparation des liaisons",
      "book.eyebrow": "Réserver", "book.title": "Votre fauteuil <em>vous attend.</em>", "book.lead": "Choisissez une prestation, un coiffeur et un horaire. Nous confirmons sur WhatsApp, généralement dans l'heure.",
      "book.s1": "Prestation", "book.s2": "Coiffeur", "book.s3": "Jour &amp; heure", "book.s4": "Vos coordonnées",
      "book.o1": "Coupe &amp; coiffage", "book.o2": "Couleur", "book.o3": "Balayage", "book.o4": "Barbier", "book.o5": "Rituel de soin", "book.o6": "Mariée",
      "book.any": "Sans préférence", "book.prevM": "Mois précédent", "book.nextM": "Mois suivant", "book.closed": "Fermé le lundi", "book.pickDay": "Choisissez un jour pour voir les horaires",
      "book.name": "Nom", "book.phone": "Téléphone ou WhatsApp", "book.note": "Quelque chose à nous dire ? <i>(facultatif)</i>", "book.notePh": "Longueur des cheveux, une photo que vous aimez, allergies…",
      "book.send": "Envoyer ma demande sur WhatsApp", "book.hint": "Rien n'est débité en ligne. Annulation gratuite jusqu'à 24 h avant.",
      "book.summary": "Votre visite", "book.day": "Jour", "book.time": "Heure", "book.reply": "Une vraie personne vous répond — généralement dans l'heure.",
      "faq.eyebrow": "Bon à savoir", "faq.title": "Vos questions, <em>nos réponses.</em>",
      "faq.q1": "La consultation est-elle vraiment gratuite ?", "faq.a1": "Toujours, et sans obligation de réserver. Passez nous voir ou demandez dix minutes lors de votre réservation.",
      "faq.q2": "Et si je dois annuler ?", "faq.a2": "C'est gratuit jusqu'à 24 heures avant votre visite. Au-delà, nous demandons la moitié du prix de la prestation.",
      "faq.q3": "Travaillez-vous avec tous les types de cheveux ?", "faq.a3": "Oui, des cheveux très fins et raides aux cheveux épais et crépus. Parlez-nous de vos cheveux en réservant et nous vous associerons au bon coiffeur.",
      "faq.q4": "Quels produits utilisez-vous ?", "faq.a4": "Olaplex, Kérastase et Davines — et nous vous dirons honnêtement ce dont vous avez besoin à la maison, et ce dont vous n'avez pas besoin.",
      "faq.q5": "Comment venir ?", "faq.a5": "Nous sommes à quatre minutes à pied du BTS Nana (sortie 3), avec deux places de parking devant le salon.",
      "con.eyebrow": "Nous rendre visite", "con.title": "Retrouvez-nous <em>sur la Soi 11.</em>", "con.address": "Adresse", "con.directions": "Itinéraire",
      "con.hours": "Horaires", "con.d1": "Mardi – vendredi", "con.d2": "Samedi – dimanche", "con.d3": "Lundi", "con.closed": "Fermé", "con.talk": "Nous parler", "con.map": "Carte : Noir, Sukhumvit Soi 11, Bangkok",
      "final.title": "Venez comme vous êtes. <em>Repartez comme vous l'espériez.</em>", "footer.credit": "Site réalisé par"
    },
    th: {
      "a11y.skip": "ข้ามไปยังเนื้อหา", "a11y.language": "ภาษา", "a11y.menu": "เมนู", "a11y.scroll": "เลื่อนลง",
      "a11y.close": "ปิด", "a11y.prevPhoto": "รูปก่อนหน้า", "a11y.nextPhoto": "รูปถัดไป", "a11y.view": "ดู",
      "intro.line": "ร้านทำผม · กรุงเทพฯ",
      "nav.services": "บริการ", "nav.studio": "ร้านของเรา", "nav.lookbook": "ผลงาน", "nav.team": "ทีมงาน", "nav.contact": "ติดต่อ", "nav.book": "จองคิว",
      "hero.eyebrow": "ร้านทำผม · สุขุมวิท กรุงเทพฯ", "hero.t1": "เส้นผมของคุณ", "hero.t2": "ในแสงที่งามที่สุด",
      "hero.lead": "ตัดผมอย่างประณีต ทำสีผมอย่างเป็นธรรมชาติ และพิธีดูแลเส้นผมที่ทำให้เมืองช้าลง เปิดรับตามนัดหมายตั้งแต่ปี 2014",
      "hero.cta": "จองคิวของคุณ", "hero.cta2": "ดูเมนูบริการ", "hero.rating": "· รีวิว Google กว่า 380 รายการ",
      "mq.1": "ตัดผมอย่างประณีต", "mq.2": "ทำสีผมธรรมชาติ", "mq.3": "บาลายาจ", "mq.4": "ทรีตเมนต์เคราติน", "mq.5": "บาร์เบอร์", "mq.6": "ทำผมเจ้าสาว", "mq.7": "ดูแลหนังศีรษะ",
      "studio.eyebrow": "ร้านของเรา", "studio.title": "ห้องที่เงียบสงบ <em>ในเมืองที่วุ่นวาย</em>",
      "studio.p1": "Noir มีเก้าอี้เก้าตัว ผนังสีดำยาวหนึ่งด้าน และทีมงานที่ขอฟังคุณสิบนาทีดีกว่าเดาเอาเองแม้แต่นาทีเดียว เราตัดผมเพื่อให้ทรงยังสวยในวันที่ยี่สิบ ไม่ใช่แค่วันที่คุณเดินออกจากร้าน",
      "studio.p2": "ไม่เร่งรีบ ไม่ยัดเยียดขายของ ไม่มีเพลงดังรบกวน มีเพียงแสงสวย กาแฟดี และช่างที่เก่งเรื่องผมจริง ๆ",
      "studio.s1": "ปีบนซอย 11", "studio.s2": "ช่างทำผมและบาร์เบอร์", "studio.s3": "คะแนนเฉลี่ย", "studio.s4": "นัดหมาย",
      "studio.alt1": "ร้าน Noir: ผนังสีดำ กระจกทรงกลม และเก้าอี้ทำผม", "studio.alt2": "แปรง หวี และไดร์เป่าผมวางบนพื้นขาว",
      "svc.eyebrow": "เมนูบริการ", "svc.title": "ทุกสิ่งที่เส้นผมต้องการ <em>ไม่มีอะไรเกินจำเป็น</em>", "svc.tablist": "หมวดบริการ",
      "svc.cut": "ตัดและจัดแต่งทรง", "svc.colour": "ทำสีผม", "svc.barber": "บาร์เบอร์", "svc.care": "ทรีตเมนต์", "svc.bridal": "เจ้าสาว",
      "svc.note": "ราคาขึ้นอยู่กับความยาวผมและระดับของช่าง ปรึกษาฟรีทุกครั้ง",
      "svc.fx": "", "book.price": "ราคาเริ่มต้น", "svc.cta": "จองบริการนี้",
      "p.from": "เริ่มต้น", "p.m20": "20 นาที", "p.m30": "30 นาที", "p.m40": "40 นาที", "p.m45": "45 นาที", "p.m50": "50 นาที", "p.m60": "60 นาที", "p.m75": "75 นาที", "p.m90": "90 นาที", "p.h2": "2 ชม.", "p.h25": "2.5 ชม.", "p.h3": "3 ชม.",
      "p.cut1": "ตัดและจัดแต่งทรงซิกเนเจอร์", "p.cut1d": "ปรึกษา สระผม ตัดอย่างประณีต และไดร์",
      "p.cut2": "เปลี่ยนทรงใหม่", "p.cut2d": "ทรงใหม่ทั้งหมด พร้อมการปรึกษาอย่างละเอียด",
      "p.cut3": "ไดร์และจัดแต่ง", "p.cut3d": "ตรงเรียบ เพิ่มวอลุ่ม หรือลอนนุ่ม",
      "p.cut4": "ตัดหน้าม้าและเก็บทรง", "p.cut4d": "ระหว่างรอบตัด วันธรรมดาไม่ต้องจอง",
      "p.col1": "บาลายาจธรรมชาติ", "p.col1d": "ระบายสีด้วยมือ ผมยาวออกมาดูนุ่มนวล รวมโทนเนอร์",
      "p.col2": "ทำสีทั้งศีรษะ", "p.col2d": "สีเดียวจากโคนถึงปลาย พร้อมเคลือบเงา",
      "p.col3": "เติมสีโคนผม", "p.col3d": "สำหรับผมที่งอกใหม่ไม่เกินสี่สัปดาห์",
      "p.col4": "เคลือบเงาและปรับโทน", "p.col4d": "เพิ่มความเงาและรีเฟรชสีระหว่างรอบ",
      "p.bar1": "ตัดผมชายคลาสสิก", "p.bar1d": "กรรไกรหรือปัตตาเลี่ยน ปิดท้ายด้วยผ้าร้อน",
      "p.bar2": "สกินเฟด", "p.bar2d": "เฟดคมกริบ ไล่ระดับเนียน พร้อมจัดทรง",
      "p.bar3": "แต่งหนวดเครา", "p.bar3d": "เล็มทรง กันขอบ ผ้าร้อน และน้ำมันบำรุง",
      "p.bar4": "ตัดผมและแต่งเครา", "p.bar4d": "ครบทุกขั้นตอนตั้งแต่ต้นจนจบ",
      "p.car1": "ยืดเคราติน", "p.car1d": "ไม่ชี้ฟู ทนความชื้น อยู่ได้นานถึงสี่เดือน",
      "p.car2": "สปาหนังศีรษะ", "p.car2d": "ขัดผิว นวดกดจุด และอบไอน้ำ",
      "p.car3": "ทรีตเมนต์ซ่อมแกนผม", "p.car3d": "ฟื้นฟูผมหลังทำสี ฟอก หรือใช้ความร้อน",
      "p.car4": "มาสก์เติมความชุ่มชื้น", "p.car4d": "สำหรับปลายผมแห้งเสียจากแดด",
      "p.bri1": "ทดลองทรงเจ้าสาว", "p.bri1d": "ทดลองทรงด้วยกันล่วงหน้าหลายสัปดาห์",
      "p.bri2": "ทำผมเจ้าสาว", "p.bri2d": "ในวันงาน ที่ร้านหรือนอกสถานที่",
      "p.bri3": "ทำผมเพื่อนเจ้าสาว", "p.bri3d": "ราคาต่อท่าน ทำในวันงาน",
      "rit.eyebrow": "ทุกครั้งที่มา", "rit.title": "พิธีแบบ <em>Noir</em>",
      "rit.1t": "เราฟังก่อน", "rit.1b": "สิบนาทีที่ไม่เร่งรีบ เพื่อพูดคุยเรื่องผมของคุณ กิจวัตร และไลฟ์สไตล์",
      "rit.2t": "การสระผม", "rit.2b": "น้ำอุ่น นวดหนังศีรษะช้า ๆ และผ้าร้อน ลูกค้าส่วนใหญ่เคลิ้มหลับตรงนี้",
      "rit.3t": "ลงมือทำ", "rit.3b": "ตัดผมแห้งหรือเปียก ระบายสีด้วยมือ และตรวจสีในแสงธรรมชาติข้างหน้าต่าง",
      "rit.4t": "เก็บงาน", "rit.4b": "จัดแต่งทรง ถ่ายรูปให้ถ้าคุณต้องการ พร้อมเคล็ดลับสามข้อสำหรับทำเองที่บ้าน",
      "look.eyebrow": "ผลงาน", "look.title": "ผลงานล่าสุด <em>ในแสงธรรมชาติ</em>", "look.aside": "แตะที่รูปเพื่อดูแบบเต็มจอ",
      "look.c0": "ลอนสีม่วงไลแลค", "look.s0": "ทำสี · มะลิ", "look.a0": "ผมยาวลอนสีม่วงไลแลค",
      "look.c1": "สีชมพูพลิ้วไหว", "look.s1": "ทำสี · มะลิ", "look.a1": "ผมสีชมพูกำลังพลิ้วไหว",
      "look.c2": "ลอนธรรมชาติ", "look.s2": "ตัดผมลอน · พลอย", "look.a2": "ผมลอนหยิกธรรมชาติ",
      "look.c3": "บาลายาจสีน้ำผึ้ง", "look.s3": "บาลายาจ · มะลิ", "look.a3": "ผมยาวบาลายาจสีน้ำผึ้งมองจากด้านหลัง",
      "look.c4": "มวยผมสบาย ๆ", "look.s4": "จัดแต่งทรง · แอนนา", "look.a4": "ผู้หญิงยิ้มพร้อมมวยผมหลวม ๆ",
      "look.c5": "สกินเฟด", "look.s5": "บาร์เบอร์ · ต้น", "look.a5": "บาร์เบอร์กำลังเก็บรายละเอียดสกินเฟด",
      "look.c6": "ลอนสีน้ำตาลนุ่ม", "look.s6": "ตัดและเคลือบเงา · พลอย", "look.a6": "ผมลอนสีน้ำตาลนุ่มหน้าผนังสีชมพู",
      "look.c7": "ลอนม้วนด้วยแกนร้อน", "look.s7": "จัดแต่งทรง · แอนนา", "look.a7": "ช่างกำลังม้วนผมยาวสีน้ำตาลด้วยแกนร้อน",
      "team.eyebrow": "ทีมงาน", "team.title": "ผมสวยคือ <em>ผลงานของทีม</em>",
      "team.r1": "ครีเอทีฟไดเรกเตอร์ · ทำสี", "team.r2": "ช่างอาวุโส · ตัดผมประณีต", "team.r3": "ช่างทำผม · เจ้าสาวและงานอีเวนต์", "team.r4": "มาสเตอร์บาร์เบอร์",
      "team.more": "…และช่างทำผมและบาร์เบอร์อีกห้าคน ที่ผ่านการฝึกกับเราทั้งหมด", "team.alt": "ช่างทำผมของ Noir สามคนหัวเราะพร้อมกรรไกรและแปรง",
      "rev.eyebrow": "ลูกค้า", "rev.title": "จากคำพูด <em>ของพวกเขา</em>", "rev.prev": "รีวิวก่อนหน้า", "rev.next": "รีวิวถัดไป", "rev.group": "รีวิว",
      "rev.q1": "“บาลายาจที่ดีที่สุดในสิบปีที่อยู่กรุงเทพฯ มะลิฟังก่อน แล้วทำออกมาตรงกับสิ่งที่ฉันอธิบายไม่ได้”", "rev.w1": "บาลายาจธรรมชาติ",
      "rev.q2": "“สงบ แม่นยำ ไม่ยัดเยียดขายเลย แค่สปาหนังศีรษะก็คุ้มที่จะข้ามเมืองมาแล้ว”", "rev.w2": "สปาหนังศีรษะ",
      "rev.q3": "“สกินเฟดของต้นเนียนกริบ ผมจองอีกสามรอบก่อนออกจากร้าน”", "rev.w3": "สกินเฟด",
      "rev.q4": "“ทำผมให้ฉันและแม่ในวันแต่งงาน เราร้องไห้ทั้งคู่ — แบบมีความสุข”", "rev.w4": "ทำผมเจ้าสาว",
      "rev.q5": "“มาพร้อมปลายผมเสียจากการฟอก กลับไปพร้อมผมที่พลิ้วได้อีกครั้ง”", "rev.w5": "ทรีตเมนต์ซ่อมแกนผม",
      "book.eyebrow": "จองคิว", "book.title": "เก้าอี้ของคุณ <em>รออยู่</em>", "book.lead": "เลือกบริการ ช่าง และเวลา เรายืนยันทาง WhatsApp โดยปกติภายในหนึ่งชั่วโมง",
      "book.s1": "บริการ", "book.s2": "ช่าง", "book.s3": "วันและเวลา", "book.s4": "ข้อมูลของคุณ",
      "book.o1": "ตัดและจัดแต่งทรง", "book.o2": "ทำสีผม", "book.o3": "บาลายาจ", "book.o4": "บาร์เบอร์", "book.o5": "ทรีตเมนต์", "book.o6": "เจ้าสาว",
      "book.any": "ไม่ระบุ", "book.prevM": "เดือนก่อน", "book.nextM": "เดือนถัดไป", "book.closed": "ปิดทุกวันจันทร์", "book.pickDay": "เลือกวันเพื่อดูเวลาว่าง",
      "book.name": "ชื่อ", "book.phone": "เบอร์โทรหรือ WhatsApp", "book.note": "มีอะไรอยากบอกเราไหม <i>(ไม่บังคับ)</i>", "book.notePh": "ความยาวผม รูปทรงที่ชอบ อาการแพ้…",
      "book.send": "ส่งคำขอจองทาง WhatsApp", "book.hint": "ไม่มีการเก็บเงินออนไลน์ ยกเลิกฟรีก่อนเวลานัด 24 ชั่วโมง",
      "book.summary": "นัดหมายของคุณ", "book.day": "วัน", "book.time": "เวลา", "book.reply": "ตอบกลับโดยพนักงานจริง — โดยปกติภายในหนึ่งชั่วโมง",
      "faq.eyebrow": "ข้อควรรู้", "faq.title": "คำถาม <em>ที่พบบ่อย</em>",
      "faq.q1": "ปรึกษาฟรีจริงไหม", "faq.a1": "ฟรีเสมอ และไม่จำเป็นต้องจอง แวะมาได้เลยหรือขอเวลาสิบนาทีตอนจองคิว",
      "faq.q2": "ถ้าต้องยกเลิกนัดล่ะ", "faq.a2": "ยกเลิกฟรีก่อนเวลานัด 24 ชั่วโมง หากช้ากว่านั้นเราขอเก็บครึ่งหนึ่งของราคาบริการ",
      "faq.q3": "ทำได้กับผมทุกประเภทไหม", "faq.a3": "ได้ ตั้งแต่ผมเส้นเล็กตรงไปจนถึงผมหนาหยิก บอกเราเรื่องผมของคุณตอนจอง แล้วเราจะจับคู่กับช่างที่เหมาะที่สุด",
      "faq.q4": "ใช้ผลิตภัณฑ์อะไรบ้าง", "faq.a4": "Olaplex, Kérastase และ Davines — และเราจะบอกตรง ๆ ว่าที่บ้านคุณต้องใช้อะไร และอะไรไม่จำเป็น",
      "faq.q5": "เดินทางอย่างไร", "faq.a5": "เดินสี่นาทีจาก BTS นานา (ทางออก 3) มีที่จอดรถสองคันหน้าร้าน",
      "con.eyebrow": "มาหาเรา", "con.title": "พบกันที่ <em>ซอย 11</em>", "con.address": "ที่อยู่", "con.directions": "ดูเส้นทาง",
      "con.hours": "เวลาทำการ", "con.d1": "อังคาร – ศุกร์", "con.d2": "เสาร์ – อาทิตย์", "con.d3": "จันทร์", "con.closed": "ปิด", "con.talk": "ติดต่อเรา", "con.map": "แผนที่: Noir สุขุมวิท ซอย 11 กรุงเทพฯ",
      "final.title": "มาในแบบที่เป็นคุณ <em>กลับไปอย่างที่หวังไว้</em>", "footer.credit": "เว็บไซต์โดย"
    }
  };

  // Strings used by main.js (dates come from Intl in the page language).
  var UI = {
    en: { openNow: "Open now · until {t}", opensAt: "Closed · opens {d} at {t}", today: "today", tomorrow: "tomorrow",
          slotsFor: "Times for {d}", chooseDay: "Please choose a day.", chooseTime: "Please choose a time.",
          required: "Please fill this in.", phoneBad: "Please enter a phone number we can reach.", any: "No preference",
          sent: "WhatsApp is opening with your request — just press send.", waHello: "Hello Noir, I'd like to book:",
          waSvc: "Service", waSty: "Stylist", waDay: "Day", waTime: "Time", waName: "Name", waPhone: "Phone", waNote: "Note", waPrice: "Price from" },
    fr: { openNow: "Ouvert · jusqu'à {t}", opensAt: "Fermé · ouvre {d} à {t}", today: "aujourd'hui", tomorrow: "demain",
          slotsFor: "Horaires du {d}", chooseDay: "Merci de choisir un jour.", chooseTime: "Merci de choisir un horaire.",
          required: "Merci de remplir ce champ.", phoneBad: "Merci d'indiquer un numéro où vous joindre.", any: "Sans préférence",
          sent: "WhatsApp s'ouvre avec votre demande — il ne reste qu'à l'envoyer.", waHello: "Bonjour Noir, je souhaite réserver :",
          waSvc: "Prestation", waSty: "Coiffeur", waDay: "Jour", waTime: "Heure", waName: "Nom", waPhone: "Téléphone", waNote: "Note", waPrice: "À partir de" },
    th: { openNow: "เปิดอยู่ · ถึง {t} น.", opensAt: "ปิดอยู่ · เปิด{d} เวลา {t} น.", today: "วันนี้", tomorrow: "พรุ่งนี้",
          slotsFor: "เวลาว่างวันที่ {d}", chooseDay: "กรุณาเลือกวัน", chooseTime: "กรุณาเลือกเวลา",
          required: "กรุณากรอกข้อมูลนี้", phoneBad: "กรุณากรอกเบอร์ที่ติดต่อได้", any: "ไม่ระบุ",
          sent: "กำลังเปิด WhatsApp พร้อมคำขอของคุณ — กดส่งได้เลย", waHello: "สวัสดีค่ะ Noir ต้องการจองคิว:",
          waSvc: "บริการ", waSty: "ช่าง", waDay: "วัน", waTime: "เวลา", waName: "ชื่อ", waPhone: "เบอร์โทร", waNote: "หมายเหตุ", waPrice: "ราคาเริ่มต้น" }
  };
  var LOCALE = { en: "en-GB", fr: "fr-FR", th: "th-TH-u-ca-gregory" };

  // Prices follow the language: English in US dollars, French in euros,
  // Thai in baht (what is actually paid at the studio). Rounded by hand to
  // clean numbers rather than converted live.
  var CURRENCY = { en: "usd", fr: "eur", th: "thb" };
  var PRICES = {
    thb: { cut1: 1800, cut2: 2400, cut3: 900, cut4: 400, col1: 5500, col2: 3200, col3: 2200, col4: 1500, bar1: 900, bar2: 1100, bar3: 600, bar4: 1500, car1: 4800, car2: 1600, car3: 1400, car4: 900, bri1: 3500, bri2: 6500, bri3: 1800 },
    eur: { cut1: 45, cut2: 65, cut3: 25, cut4: 10, col1: 145, col2: 85, col3: 60, col4: 40, bar1: 25, bar2: 30, bar3: 15, bar4: 40, car1: 125, car2: 45, car3: 35, car4: 25, bri1: 90, bri2: 170, bri3: 45 },
    usd: { cut1: 50, cut2: 70, cut3: 25, cut4: 12, col1: 155, col2: 90, col3: 65, col4: 45, bar1: 25, bar2: 30, bar3: 18, bar4: 45, car1: 135, car2: 45, car3: 40, car4: 25, bri1: 100, bri2: 185, bri3: 50 }
  };
  function money(amount, cur) {
    if (cur === "eur") return amount.toLocaleString("fr-FR") + "\u00a0€";
    if (cur === "usd") return "$" + amount.toLocaleString("en-US");
    return "฿" + amount.toLocaleString("en-US");
  }

  // Capture the baked-in English once.
  var EN = {};
  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    var k = el.getAttribute("data-i18n");
    if (!(k in EN)) EN[k] = el.innerHTML;
  });
  document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
    el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
      var p = pair.split(":"), attr = p[0], k = p[1];
      if (k && !(k in EN)) EN[k] = el.getAttribute(attr) || "";
    });
  });
  DICT.en = EN;

  var current = "en";
  function t(key) { return (DICT[current] && DICT[current][key]) || EN[key] || ""; }
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
      l.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;500;600&family=Noto+Serif+Thai:wght@400;500&display=swap";
      document.head.appendChild(l);
    }
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n"));
      if (v && el.innerHTML !== v) el.innerHTML = v;
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var p = pair.split(":"); if (p[1]) el.setAttribute(p[0], t(p[1]));
      });
    });
    var cur = CURRENCY[lang];
    document.querySelectorAll("[data-price]").forEach(function (el) {
      var v = PRICES[cur][el.getAttribute("data-price")];
      if (v != null) el.textContent = money(v, cur);
    });
    // The "prices are a guide" note only makes sense outside baht.
    document.querySelectorAll("[data-fx]").forEach(function (el) { el.hidden = cur === "thb"; });
    document.querySelectorAll("[data-lang]").forEach(function (b) { b.setAttribute("aria-current", b.getAttribute("data-lang") === lang ? "true" : "false"); });
    var titles = { en: "Noir — Hair Studio, Bangkok", fr: "Noir — Salon de coiffure, Bangkok", th: "Noir — ร้านทำผม กรุงเทพฯ" };
    document.title = titles[lang];
    try { localStorage.setItem("noirLang", lang); } catch (e) {}
    document.dispatchEvent(new CustomEvent("noir:lang", { detail: { lang: lang } }));
  }

  var start = "en";
  try { start = localStorage.getItem("noirLang") || ""; } catch (e) {}
  if (!DICT[start]) { var nav = (navigator.language || "en").slice(0, 2).toLowerCase(); start = DICT[nav] ? nav : "en"; }

  window.NoirI18n = {
    apply: apply, t: t, ui: ui, lang: function () { return current; }, locale: function () { return LOCALE[current]; },
    price: function (key) { var c = CURRENCY[current]; return PRICES[c][key] != null ? money(PRICES[c][key], c) : ""; }
  };
  if (start !== "en") apply(start); else document.querySelectorAll("[data-lang]").forEach(function (b) { b.setAttribute("aria-current", b.getAttribute("data-lang") === "en" ? "true" : "false"); });
})();
