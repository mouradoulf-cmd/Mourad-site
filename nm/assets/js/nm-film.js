/* NM Studio explainer film — deterministic render(t). Used as the in-site overlay (hero "Watch the video" button) and for the MP4 exports
   (film/render.html). Prices come from offers-config.js (window.NM_OFFERS) so the film never disagrees with the offers on the page. */
(function(){
var SRC=(document.currentScript&&document.currentScript.src)||location.href;
var URLB=function(p){return new URL(p,SRC).href};
var WA='https://wa.me/qr/PYPOVXTCVM74I1';
var clamp=function(x,a,b){a=a==null?0:a;b=b==null?1:b;return Math.min(b,Math.max(a,x))};
var ease=function(x){return 1-Math.pow(1-clamp(x),3)};
var T={
en:{watch:'Watch the 1-min video',
 say:["Before they visit, your customers search online.","No website means you're invisible, and customers pick someone else.","NM Studio fixes that in days, with four simple offers.","Eight live sites you can open today, each one built around its business.","A QR menu opens on every phone: always up to date, no reprinting.","Be found on Google and Maps, even by tourists who haven't landed yet.","It's simple: send your photos, we design everything, and you go live in days.","Four offers, priced in baht. Pick the one that fits your business.","We come to you, edits are unlimited on WhatsApp, and you're live in days.","Ready to be visible? Message us on WhatsApp."],
 h1:'They search <em>first.</em>',q:'restaurant near me',where:'Where is your business?',
 h2:'No website? <em>Invisible.</em>',p:['Customers choose your competitor','Printed menus, out of date','No Google profile'],
 h3:'Four offers. <em>One goal.</em>',names:['Google Profile','QR Menu','Website','Complete Pack'],words:['Found.','Instant.','Online.','Everything.'],
 h4:'8 live sites. <em>Open them today.</em>',t4:'Real clients and concepts, all online.',
 h5:'One scan. <em>Always current.</em>',t5:'No reprinting. Change your menu anytime.',
 h6:'Found on <em>Google &amp; Maps.</em>',t6:'Tourists see you before they land.',you:'You',
 h7:'From photos to <em>live.</em>',steps:[['Day 1','Send your photos'],['Days 2–4','We design your site'],['Launch','You\'re live']],
 h8:'Simple <em>pricing</em>',onetime:'one-time',setup:'setup',mo:'/ month',pop:'Most popular',
 h9:'We come <em>to you.</em>',chips:['We meet you in Pattaya','Unlimited edits on WhatsApp','Live in days'],
 h10:'Ready to be <em>visible?</em>',t10:'Message us on WhatsApp',wa:'Chat on WhatsApp',book:'Book a meeting',price:'See the offers',scan:'Scan to message us on WhatsApp',close:'Close',tEyebrow:"Video tour",tTitle:"See it all in <em>77 seconds.</em>",tLead:"No jargon: why customers can't find you, what we build, how it works and what it costs. Pick a chapter or just press play.",tCh:["Why customers can't find you", "Four offers, eight live sites", "QR menu, Google & how it works", "Prices & next step"],tFull:"Watch full screen",tOffers:"See the offers",tHint:"Captions on · no sound needed"},
fr:{watch:'Voir la vidéo (1 min)',
 say:["Avant de venir, vos clients cherchent en ligne.","Sans site web, vous êtes invisible : vos clients choisissent quelqu'un d'autre.","NM Studio règle ça en quelques jours, avec quatre offres simples.","Huit sites en ligne que vous pouvez ouvrir aujourd'hui, chacun construit autour de son activité.","Un menu QR s'ouvre sur tous les téléphones : toujours à jour, sans réimpression.","Soyez trouvé sur Google et Maps, même par les touristes qui ne sont pas encore arrivés.","C'est simple : vous envoyez vos photos, on conçoit tout, et vous êtes en ligne en quelques jours.","Quatre offres, en bahts. Choisissez celle qui convient à votre activité.","On vient chez vous, les modifications sont illimitées sur WhatsApp, et vous êtes en ligne en quelques jours.","Prêt à être visible ? Écrivez-nous sur WhatsApp."],
 h1:'Ils cherchent <em>d\'abord.</em>',q:'restaurant près de moi',where:'Où est votre établissement ?',
 h2:'Pas de site ? <em>Invisible.</em>',p:['Les clients choisissent le concurrent','Menus imprimés, périmés','Pas de fiche Google'],
 h3:'Quatre offres. <em>Un objectif.</em>',names:['Fiche Google','Menu QR','Site web','Pack complet'],words:['Trouvé.','Instantané.','En ligne.','Tout inclus.'],
 h4:'8 sites en ligne. <em>Ouvrez-les.</em>',t4:'De vrais clients et des concepts, tous en ligne.',
 h5:'Un scan. <em>Toujours à jour.</em>',t5:'Sans réimpression. Modifiable à tout moment.',
 h6:'Trouvé sur <em>Google &amp; Maps.</em>',t6:'Les touristes vous voient avant d\'atterrir.',you:'Vous',
 h7:'De vos photos à <em>la mise en ligne.</em>',steps:[['Jour 1','Envoyez vos photos'],['Jours 2–4','On conçoit votre site'],['Lancement','Vous êtes en ligne']],
 h8:'Des tarifs <em>simples</em>',onetime:'paiement unique',setup:'mise en place',mo:'/ mois',pop:'Le plus choisi',
 h9:'On vient <em>chez vous.</em>',chips:['Rencontre à Pattaya','Modifications illimitées sur WhatsApp','En ligne en quelques jours'],
 h10:'Prêt à être <em>visible ?</em>',t10:'Écrivez-nous sur WhatsApp',wa:'Écrire sur WhatsApp',book:'Prendre rendez-vous',price:'Voir les offres',scan:'Scannez pour nous écrire sur WhatsApp',close:'Fermer',tEyebrow:"Visite en vidéo",tTitle:"Tout comprendre en <em>77 secondes.</em>",tLead:"Sans jargon : pourquoi vos clients ne vous trouvent pas, ce que nous construisons, comment ça marche et combien ça coûte. Choisissez un chapitre ou lancez simplement la lecture.",tCh:["Pourquoi vos clients ne vous trouvent pas", "Quatre offres, huit sites en ligne", "Menu QR, Google et déroulé", "Tarifs et prochaine étape"],tFull:"Voir en plein écran",tOffers:"Voir les offres",tHint:"Sous-titres inclus · sans son"},
it:{watch:'Guarda il video (1 min)',
 say:["Prima di venire, i tuoi clienti cercano online.","Senza sito web sei invisibile: i clienti scelgono qualcun altro.","NM Studio risolve tutto in pochi giorni, con quattro offerte semplici.","Otto siti online che puoi aprire oggi, ognuno costruito attorno alla sua attività.","Un menù QR si apre su ogni telefono: sempre aggiornato, senza ristampe.","Fatti trovare su Google e Maps, anche dai turisti che non sono ancora arrivati.","È semplice: mandi le foto, progettiamo tutto noi, e vai online in pochi giorni.","Quattro offerte, in baht. Scegli quella adatta alla tua attività.","Veniamo da te, le modifiche sono illimitate su WhatsApp, e sei online in pochi giorni.","Pronto a farti vedere? Scrivici su WhatsApp."],
 h1:'Cercano <em>prima.</em>',q:'ristorante vicino a me',where:'Dov\'è la tua attività?',
 h2:'Niente sito? <em>Invisibile.</em>',p:['I clienti scelgono il concorrente','Menù stampati, vecchi','Nessun profilo Google'],
 h3:'Quattro offerte. <em>Un obiettivo.</em>',names:['Scheda Google','Menù QR','Sito web','Pacchetto completo'],words:['Trovato.','Istantaneo.','Online.','Tutto incluso.'],
 h4:'8 siti online. <em>Aprili oggi.</em>',t4:'Clienti reali e concept, tutti online.',
 h5:'Una scansione. <em>Sempre aggiornato.</em>',t5:'Niente ristampe. Modificabile in qualsiasi momento.',
 h6:'Trovato su <em>Google e Maps.</em>',t6:'I turisti ti vedono prima di atterrare.',you:'Tu',
 h7:'Dalle foto <em>al sito online.</em>',steps:[['Giorno 1','Invia le foto'],['Giorni 2–4','Progettiamo il tuo sito'],['Lancio','Sei online']],
 h8:'Prezzi <em>semplici</em>',onetime:'una tantum',setup:'attivazione',mo:'/ mese',pop:'Il più scelto',
 h9:'Veniamo <em>da te.</em>',chips:['Ti incontriamo a Pattaya','Modifiche illimitate su WhatsApp','Online in pochi giorni'],
 h10:'Pronto a farti <em>vedere?</em>',t10:'Scrivici su WhatsApp',wa:'Scrivici su WhatsApp',book:'Prenota un incontro',price:'Vedi le offerte',scan:'Inquadra per scriverci su WhatsApp',close:'Chiudi',tEyebrow:"Video tour",tTitle:"Tutto chiaro in <em>77 secondi.</em>",tLead:"Senza gergo: perché i clienti non ti trovano, cosa costruiamo, come funziona e quanto costa. Scegli un capitolo o premi play.",tCh:["Perché i clienti non ti trovano", "Quattro offerte, otto siti online", "Menù QR, Google e come funziona", "Prezzi e prossimo passo"],tFull:"Guarda a schermo intero",tOffers:"Vedi le offerte",tHint:"Sottotitoli inclusi · senza audio"},
th:{watch:'ดูวิดีโอ 1 นาที',
 say:["ก่อนมาที่ร้าน ลูกค้าค้นหาในอินเทอร์เน็ตก่อน","ไม่มีเว็บไซต์ ก็เหมือนมองไม่เห็นร้านคุณ ลูกค้าจึงไปเลือกร้านอื่น","NM Studio ช่วยคุณได้ในไม่กี่วัน ด้วยแพ็กเกจง่าย ๆ สี่แบบ","เว็บไซต์จริงแปดแห่งที่เปิดดูได้ทันที แต่ละแห่งสร้างให้เหมาะกับธุรกิจของเขา","เมนู QR เปิดได้บนทุกโทรศัพท์ อัปเดตเสมอ ไม่ต้องพิมพ์ใหม่","ให้ลูกค้าเจอคุณบน Google และแผนที่ แม้แต่นักท่องเที่ยวที่ยังไม่ถึงไทย","ง่ายมาก ส่งรูปมา เราออกแบบทุกอย่างให้ แล้วเว็บไซต์ของคุณก็ออนไลน์ในไม่กี่วัน","สี่แพ็กเกจ ราคาเป็นบาท เลือกแบบที่เหมาะกับธุรกิจของคุณ","เราไปหาคุณถึงที่ แก้ไขได้ไม่จำกัดผ่าน WhatsApp และออนไลน์ในไม่กี่วัน","พร้อมให้ลูกค้าเห็นคุณหรือยัง ทักเราทาง WhatsApp ได้เลย"],
 h1:'ลูกค้า<em>ค้นหาก่อน</em>',q:'ร้านอาหารใกล้ฉัน',where:'ธุรกิจของคุณอยู่ตรงไหน?',
 h2:'ไม่มีเว็บไซต์? <em>มองไม่เห็น</em>',p:['ลูกค้าเลือกคู่แข่ง','เมนูกระดาษ เก่าแล้ว','ไม่มีโปรไฟล์ Google'],
 h3:'สี่แพ็กเกจ <em>เป้าหมายเดียว</em>',names:['Google Business Profile','เมนู QR','เว็บไซต์','แพ็กเกจครบชุด'],words:['เจอง่าย','ทันใจ','ออนไลน์','ครบจบ'],
 h4:'เว็บไซต์จริง 8 แห่ง <em>เปิดดูได้เลย</em>',t4:'ลูกค้าจริงและงานตัวอย่าง ออนไลน์ทั้งหมด',
 h5:'สแกนครั้งเดียว <em>อัปเดตเสมอ</em>',t5:'ไม่ต้องพิมพ์ใหม่ แก้ได้ทุกเมื่อ',
 h6:'เจอบน <em>Google และแผนที่</em>',t6:'นักท่องเที่ยวเห็นคุณก่อนถึงไทย',you:'คุณ',
 h7:'จากรูปถ่าย <em>สู่เว็บไซต์ออนไลน์</em>',steps:[['วันที่ 1','ส่งรูปให้เรา'],['วันที่ 2–4','เราออกแบบเว็บไซต์ให้'],['เปิดตัว','ออนไลน์แล้ว']],
 h8:'ราคา<em>เข้าใจง่าย</em>',onetime:'จ่ายครั้งเดียว',setup:'ค่าติดตั้ง',mo:'/ เดือน',pop:'ยอดนิยม',
 h9:'เรา<em>ไปหาคุณ</em>',chips:['พบกันที่พัทยา','แก้ไขไม่จำกัดผ่าน WhatsApp','ออนไลน์ในไม่กี่วัน'],
 h10:'พร้อมให้ลูกค้า<em>เห็นคุณ</em>',t10:'ทักเราทาง WhatsApp',wa:'แชทผ่าน WhatsApp',book:'นัดพบ',price:'ดูแพ็กเกจ',scan:'สแกนเพื่อทักเราทาง WhatsApp',close:'ปิด',tEyebrow:"ทัวร์วิดีโอ",tTitle:"เข้าใจทุกอย่างใน <em>77 วินาที</em>",tLead:"ไม่ใช้ศัพท์ยาก: ทำไมลูกค้าหาคุณไม่เจอ เราสร้างอะไรให้ ทำงานอย่างไร และราคาเท่าไร เลือกบทที่สนใจหรือกดเล่นได้เลย",tCh:["ทำไมลูกค้าหาคุณไม่เจอ", "สี่แพ็กเกจ เว็บไซต์จริงแปดแห่ง", "เมนู QR, Google และขั้นตอน", "ราคาและขั้นตอนต่อไป"],tFull:"ดูแบบเต็มจอ",tOffers:"ดูแพ็กเกจ",tHint:"มีคำบรรยาย · ไม่ต้องเปิดเสียง"},
ar:{watch:'شاهد الفيديو (دقيقة)',
 say:["قبل أن يزوروك، يبحث عملاؤك على الإنترنت.","من دون موقع إلكتروني أنت غير مرئي، والعملاء يختارون غيرك.","نحل هذا في أيام، بأربعة عروض بسيطة.","ثمانية مواقع على الإنترنت يمكنك فتحها اليوم، كل منها مبني حول نشاطه.","قائمة QR تُفتح على كل هاتف: محدّثة دائماً ومن دون إعادة طباعة.","ليجدك الناس على Google والخرائط، حتى السياح قبل وصولهم.","الأمر بسيط: ترسل صورك، نصمم كل شيء، وتصبح على الإنترنت خلال أيام.","أربعة عروض بالبات التايلندي. اختر ما يناسب نشاطك.","نأتي إليك، والتعديلات غير محدودة عبر واتساب، وتصبح على الإنترنت خلال أيام.","جاهز لتكون مرئياً؟ راسلنا على واتساب."],
 h1:'يبحثون <em>أولاً</em>',q:'مطعم قريب مني',where:'أين نشاطك؟',
 h2:'بلا موقع؟ <em>غير مرئي</em>',p:['العملاء يختارون المنافس','قوائم مطبوعة قديمة','لا ملف على Google'],
 h3:'أربعة عروض. <em>هدف واحد</em>',names:['ملف Google','قائمة QR','موقع إلكتروني','الباقة الكاملة'],words:['ظاهر.','فوري.','على الإنترنت.','شامل.'],
 h4:'8 مواقع حية. <em>افتحها اليوم</em>',t4:'عملاء حقيقيون ونماذج، كلها على الإنترنت',
 h5:'مسحة واحدة. <em>دائماً محدّث</em>',t5:'بلا إعادة طباعة. عدّل في أي وقت',
 h6:'تجدك على <em>Google والخرائط</em>',t6:'السياح يرونك قبل وصولهم',you:'أنت',
 h7:'من صورك <em>إلى موقع حي</em>',steps:[['اليوم 1','أرسل صورك'],['الأيام 2–4','نصمم موقعك'],['الإطلاق','أنت على الإنترنت']],
 h8:'أسعار <em>بسيطة</em>',onetime:'مرة واحدة',setup:'تأسيس',mo:'/ شهر',pop:'الأكثر طلباً',
 h9:'نأتي <em>إليك</em>',chips:['نلتقيك في باتايا','تعديلات غير محدودة عبر واتساب','على الإنترنت خلال أيام'],
 h10:'جاهز لتكون <em>مرئياً؟</em>',t10:'راسلنا على واتساب',wa:'تحدث عبر واتساب',book:'احجز لقاءً',price:'شاهد العروض',scan:'امسح الرمز لمراسلتنا على واتساب',close:'إغلاق',tEyebrow:"جولة بالفيديو",tTitle:"افهم كل شيء في <em>77 ثانية</em>",tLead:"بلا مصطلحات: لماذا لا يجدك العملاء، وماذا نبني، وكيف يعمل، وكم يكلّف. اختر فصلاً أو اضغط تشغيل.",tCh:["لماذا لا يجدك العملاء", "أربعة عروض وثمانية مواقع حية", "قائمة QR وGoogle وطريقة العمل", "الأسعار والخطوة التالية"],tFull:"مشاهدة بملء الشاشة",tOffers:"شاهد العروض",tHint:"ترجمة مدمجة · بلا صوت"}
};
/* prices: single source = offers-config.js */
var DEF={price:{google:990,qr:1990,website:5800,pack:13300},sub:{website:{monthly:1140},pack:{monthly:3800}},approx:{}};
function offers(){return window.NM_OFFERS||DEF}
function g(n){return Math.round(n).toLocaleString('en-US')}
function approx(lang,n){var O=offers(),cur=O.currency&&O.currency[lang];if(!cur||cur==='thb'||!O.approx||!O.approx[cur]||O.approx[cur][n]==null)return '';var v=g(O.approx[cur][n]);return '≈ '+(cur==='gbp'?'£'+v:cur==='eur'?v+' €':v+' DH')}
var PIN='<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>';
var LOGO='<svg viewBox="0 0 24 24" fill="none"><path d="M2.5 9c2.5 0 2.5 4.2 5 4.2S10 9 12 9s2.5 4.2 5 4.2S19.5 9 21.5 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M2.5 15c2.5 0 2.5 4.2 5 4.2S10 15 12 15s2.5 4.2 5 4.2S19.5 15 21.5 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" opacity=".5"/></svg>';
var SITES=['giulivo','malee','noir','neon-tiger','mae-lek','ride-siam','facadiers','oblanc'];
function qrSvg(){try{var q=qrcode(0,'M');q.addData(WA);q.make();return q.createSvgTag({cellSize:6,margin:0,scalable:true})}catch(e){return ''}}

function build(root,lang,opts){
  opts=opts||{};var L=T[lang]||T.en,O=offers();
  root.classList.add('nmf');root.setAttribute('dir',lang==='ar'?'rtl':'ltr');root.setAttribute('lang',lang);
  root.innerHTML='<div class="nmf-bg" style="background-image:url('+URLB('../video/hero-poster.jpg')+')"></div><div class="nmf-glow nmf-g1"></div><div class="nmf-glow nmf-g2"></div><div class="nmf-glow nmf-g3"></div><div class="nmf-brand">'+LOGO+'<span>NM Studio</span></div><div class="nmf-bar"></div><div class="nmf-cap"><span></span></div>';
  var capEl=root.querySelector('.nmf-cap span'),bar=root.querySelector('.nmf-bar'),gl=root.querySelectorAll('.nmf-glow');
  var S=[];
  function sc(t,html,upd){var el=document.createElement('div');el.className='nmf-sc';el.innerHTML=html;root.insertBefore(el,root.querySelector('.nmf-cap'));S.push({t:t,el:el,upd:upd||function(){}});return el}
  var qs=function(el,s){return el.querySelector(s)},qa=function(el,s){return el.querySelectorAll(s)};
  /* 1 search */
  var comp=[['Seaside Grill','★ 4.8'],['Bella Pattaya','★ 4.7'],['Thai Garden','★ 4.6']];
  sc(6,'<h2>'+L.h1+'</h2><div class="sbar glass">🔍 <b></b><i></i></div>'+comp.map(function(c){return '<div class="res glass"><b>'+c[0]+'</b><span>'+c[1]+'</span></div>'}).join('')+'<div class="res glass ghost">'+L.where+'</div>',
   function(e,lt){var s=L.q,n=Math.floor(clamp((lt-.6)/2)*s.length);qs(e,'.sbar b').textContent=s.slice(0,n);qs(e,'.sbar i').style.opacity=(Math.floor(lt*2)%2)?0:1;
    qa(e,'.res').forEach(function(r,i){var p=ease((lt-2.8-i*.45)/.5);r.style.opacity=p;r.style.transform='translate3d(0,'+((1-p)*30)+'px,'+((1-p)*-200)+'px)';if(i===3)r.style.boxShadow='0 0 '+(14+Math.sin(lt*5)*10)+'px rgba(201,169,97,.5)'})});
  /* 2 problems */
  sc(8,'<h2>'+L.h2+'</h2>'+L.p.map(function(x){return '<div class="prob glass"><i>✕</i><span>'+x+'</span></div>'}).join(''),
   function(e,lt){qa(e,'.prob').forEach(function(c,i){var p=ease((lt-.9-i*.9)/.7);c.style.opacity=p;c.style.transform='translate3d('+((1-p)*-60)+'px,0,'+((1-p)*-500)+'px) rotateY('+((1-p)*40)+'deg)'})});
  /* 3 four offers carousel */
  sc(7,'<h2>'+L.h3+'</h2><div class="car">'+L.names.map(function(n,i){return '<div class="cd glass"><em>'+L.words[i]+'</em>'+n+'</div>'}).join('')+'</div>',
   function(e,lt){var a=ease(lt/.9),vm=Math.min(root.clientWidth,root.clientHeight)/100,R=vm*24;qs(e,'.car').style.opacity=a;qs(e,'.car').style.transform='translateZ('+((1-a)*-600)+'px) rotateX(-10deg)';
    qa(e,'.cd').forEach(function(c,i){var ang=(i*90+lt*30)%360,front=(Math.cos(ang*Math.PI/180)+1)/2;c.style.transform='rotateY('+ang+'deg) translateZ('+R+'px)';c.style.opacity=.3+.7*front})});
  /* 4 eight live sites */
  sc(8,'<h2>'+L.h4+'</h2><div class="g8">'+SITES.map(function(s){return '<img src="'+URLB('../img/work/'+s+'-desk.jpg')+'" alt=""/>'}).join('')+'</div><div class="tx">'+L.t4+'</div>',
   function(e,lt){qa(e,'.g8 img').forEach(function(im,i){var p=ease((lt-.6-i*.4)/.6);im.style.opacity=p;im.style.transform='translate3d(0,'+((1-p)*60)+'px,'+((1-p)*-500)+'px) rotateX('+((1-p)*50)+'deg)'})});
  /* 5 QR flip */
  sc(8,'<h2>'+L.h5+'</h2><div class="flip"><div class="fq">'+qrSvg()+'</div><div class="fm"><img src="'+URLB('../img/film/menu-phone.jpg')+'" alt=""/></div></div><div class="tx">'+L.t5+'</div>',
   function(e,lt){var f=qs(e,'.flip'),a=ease(lt/.8),r=ease((lt-4)/.9);f.style.opacity=a;f.style.transform='rotateY('+(r*180+Math.sin(lt*1.2)*(1-r)*8)+'deg) rotateX('+Math.cos(lt)*3+'deg) scale('+(.85+a*.15)+')';f.style.setProperty('--sy',((lt*60)%100)+'%')});
  /* 6 map */
  var pins=[[16,32],[30,62],[44,26],[58,70],[72,36],[84,64],[24,84],[66,16],[90,24],[50,52]];
  sc(7,'<h2>'+L.h6+'</h2><div class="map">'+pins.map(function(p){return '<div class="pin" style="left:'+p[0]+'%;top:'+p[1]+'%">'+PIN+'</div>'}).join('')+'<div class="pin me" style="left:50%;top:60%">'+PIN+'<b>'+L.you+' ★ 4.9</b></div><div class="ripple" style="left:50%;top:60%"></div><div class="ripple" style="left:50%;top:60%"></div></div><div class="tx">'+L.t6+'</div>',
   function(e,lt){qa(e,'.pin:not(.me)').forEach(function(p,i){var q=ease((lt-.5-i*.18)/.45);p.style.opacity=q*.9;p.style.transform='translateY('+((1-q)*-120)+'px)'});
    var me=qs(e,'.me'),q=ease((lt-2.6)/.6);me.style.opacity=q;me.style.transform='translateY('+((1-q)*-200)+'px) scale('+(1+Math.sin(lt*3)*.04)+')';
    qa(e,'.ripple').forEach(function(r,i){var k=((lt-3.1-i*.9)%1.8)/1.8;if(lt<3.1||k<0){r.style.opacity=0;return}var s=k*160;r.style.width=r.style.height=s+'px';r.style.opacity=(1-k)*.8})});
  /* 7 steps */
  var si=['📸','🎨','🚀'];
  sc(8,'<h2>'+L.h7+'</h2><div class="stp">'+L.steps.map(function(s,i){return '<div class="s glass"><span>'+si[i]+'</span><div><small>'+s[0]+'</small><b>'+s[1]+'</b></div></div>'}).join('')+'</div>',
   function(e,lt){qa(e,'.s').forEach(function(c,i){var p=ease((lt-.8-i*1)/.7);c.style.opacity=p;c.style.transform='translate3d(0,'+((1-p)*50)+'px,'+((1-p)*-400)+'px) rotateX('+((1-p)*40)+'deg)'})});
  /* 8 pricing: four offers, amounts from offers-config.js */
  var ids=['google','qr','website','pack'];
  sc(10,'<h2>'+L.h8+'</h2><div class="pls">'+ids.map(function(id,i){var pr=O.price[id],sub=O.sub&&O.sub[id],ap=approx(lang,pr);
    return '<div class="pl glass'+(id==='website'?' best':'')+'">'+(id==='website'?'<div class="bd">'+L.pop+'</div>':'')+'<div class="l"><em>'+L.words[i]+'</em><h3>'+L.names[i]+'</h3></div><div class="r"><div class="pr">฿'+g(pr)+'</div><small>'+(sub?L.setup+' · + ฿'+g(sub.monthly)+' '+L.mo:L.onetime)+'</small>'+(ap?'<small class="ap">'+ap+'</small>':'')+'</div></div>'}).join('')+'</div>',
   function(e,lt){qa(e,'.pl').forEach(function(c,i){var p=ease((lt-.9-i*.9)/.7);c.style.opacity=p;c.style.transform='translate3d(0,'+((1-p)*60)+'px,'+((1-p)*-500)+'px) rotateY('+((1-p)*(i-1.5)*-30)+'deg)'})});
  /* 9 chips */
  sc(6,'<h2>'+L.h9+'</h2><div class="chips">'+L.chips.map(function(c){return '<span class="glass">'+c+'</span>'}).join('')+'</div>',
   function(e,lt){qa(e,'.chips span').forEach(function(c,i){var p=ease((lt-.8-i*.6)/.5);c.style.opacity=p;c.style.transform='scale('+(.8+.2*p)+')'})});
  /* 10 CTA */
  var ctaBody=opts.render?'<div class="qrw">'+qrSvg()+'</div><div class="tx">'+L.scan+'</div>':
   '<div class="cta"><a class="wa" href="'+WA+'" target="_blank" rel="noopener">'+L.wa+'</a><button type="button" data-nmf-book data-open-booking>'+L.book+'</button><button type="button" data-nmf-price>'+L.price+'</button></div>';
  sc(9,'<h2>'+L.h10+'</h2><div class="tx">'+L.t10+'</div>'+ctaBody,
   function(e,lt){var a=ease((lt-.4)/.7);qa(e,'.cta,.qrw').forEach(function(c){c.style.opacity=a;c.style.transform='translateY('+((1-a)*40)+'px)'})});
  var total=0,starts=[];S.forEach(function(s){starts.push(total);total+=s.t});
  var cur=-1;
  function idx(t){var i=0;while(i<S.length-1&&t>=starts[i]+S[i].t)i++;return i}
  function render(t){
    t=clamp(t,0,total);var i=idx(t);
    gl[0].style.transform='translate('+Math.sin(t*.2)*12+'vmax,'+Math.cos(t*.17)*8+'vmax)';gl[1].style.transform='translate('+Math.cos(t*.15)*14+'vmax,'+Math.sin(t*.21)*10+'vmax)';gl[2].style.transform='translate('+Math.sin(t*.12+2)*16+'vmax,'+Math.cos(t*.1)*12+'vmax)';
    S.forEach(function(s,k){var lt=t-starts[k],last=k===S.length-1;var show=lt>=0&&(lt<s.t+.3||(last&&t>=starts[k]));
      if(!show){s.el.style.opacity=0;s.el.classList.remove('on');s.el.style.pointerEvents='none';return}
      var fin=ease(lt/.45),fout=last?1:clamp((s.t+.3-lt)/.3);s.el.style.opacity=fin*fout;s.el.classList.add('on');s.el.style.pointerEvents=(last&&fin>.6)?'auto':'none';s.upd(s.el,Math.max(lt,0))});
    bar.style.width=Math.min(t/total,1)*100+'%';
    if(i!==cur){cur=i;capEl.textContent=L.say[i];if(opts.onScene)opts.onScene(i,S.length)}
  }
  return {total:total,starts:starts,render:render,idx:idx,lang:lang,count:S.length,reset:function(){cur=-1}};
}

function loadScript(src,test){return new Promise(function(res){if(test&&window[test])return res();var s=document.createElement('script');s.src=src;s.onload=res;s.onerror=res;document.head.appendChild(s)})}
function loadFonts(){var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;500;700&family=Noto+Sans+Arabic:wght@400;500;700&display=swap';document.head.appendChild(l)}
var QRSRC=URLB('qrcode-svg.min.js'),OFFSRC=URLB('offers-config.js');
function needs(){return Promise.all([loadScript(QRSRC,'qrcode'),window.NM_OFFERS?0:loadScript(OFFSRC,'NM_OFFERS')])}

/* ---------- export / render mode ---------- */
if(window.NMF_RENDER){
  var q=new URLSearchParams(location.search),lg=q.get('lang')||'en';
  window.__nmReady=needs().then(function(){
    var root=document.getElementById('nmf-root');var F=build(root,lg,{render:true});window.__nmTotal=F.total;window.__nmStarts=F.starts;window.__nmRender=function(t){F.render(t)};F.render(0);
    return document.fonts.ready.then(function(){return Promise.all(Array.prototype.map.call(document.images,function(im){return im.decode?im.decode().catch(function(){}):0}))}).then(function(){F.render(0);return true});
  });
  loadFonts();
  return;
}
/* ---------- in-site overlay ---------- */
var F=null,t=0,playing=false,last=0,curLang='en',overlay;
function lang(){var l=(window.NM_LANG||document.documentElement.lang||'en').slice(0,2).toLowerCase();return T[l]?l:'en'}
function ensure(){
  if(overlay)return;overlay=document.createElement('div');overlay.id='nmfOverlay';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('data-lenis-prevent','');
  overlay.innerHTML='<div class="nmf" id="nmfRoot"></div><button id="nmfClose" type="button"></button><div id="nmfCtl"><button id="nmfPlay" type="button" aria-label="Play / pause">❚❚</button><div id="nmfProg"><i></i></div></div>';
  document.body.appendChild(overlay);loadFonts();
  document.getElementById('nmfClose').onclick=close;
  document.getElementById('nmfPlay').onclick=function(){playing?pause():play()};
  document.getElementById('nmfProg').addEventListener('click',function(e){var r=this.getBoundingClientRect();t=clamp((e.clientX-r.left)/r.width)*F.total;F.reset();F.render(t)});
  overlay.addEventListener('click',function(e){
    if(e.target.closest('[data-nmf-price]')){close();var p=document.getElementById('offers');p&&p.scrollIntoView({behavior:'smooth'})}
    if(e.target.closest('[data-nmf-book]'))close()});
  document.addEventListener('keydown',function(e){if(!overlay.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key===' '&&e.target.tagName!=='A'&&e.target.tagName!=='BUTTON'){e.preventDefault();document.getElementById('nmfPlay').click()}});
}
function tick(n){if(!playing)return;var dt=Math.min((n-last)/1000,.1);last=n;t+=dt;if(t>=F.total){t=F.total-.001;playing=false;document.getElementById('nmfPlay').textContent='↻'}F.render(t);if(playing)requestAnimationFrame(tick)}
function play(){if(t>=F.total-.01){t=0;F.reset()}playing=true;last=performance.now();document.getElementById('nmfPlay').textContent='❚❚';requestAnimationFrame(tick)}
function pause(){playing=false;document.getElementById('nmfPlay').textContent='▶'}
function open(startAt){
  ensure();curLang=lang();needs().then(function(){
    var root=document.getElementById('nmfRoot');
    F=build(root,curLang,{onScene:function(i,n){overlay.classList.toggle('final',i===n-1)}});
    document.getElementById('nmfClose').textContent='✕ '+T[curLang].close;
    overlay.setAttribute('dir',curLang==='ar'?'rtl':'ltr');overlay.classList.add('open');document.documentElement.style.overflow='hidden';
    t=clamp(startAt||0,0,F.total-1);F.reset();F.render(t);play();document.getElementById('nmfClose').focus();window.__nmfSeek=function(x){t=x;F.reset();F.render(x)};
  });
}
function close(){pause();if(overlay)overlay.classList.remove('open');document.documentElement.style.overflow=''}
document.addEventListener('click',function(e){var b=e.target.closest('[data-nmf-open]');if(b){e.preventDefault();open(0)}
  if(e.target.closest('[data-nmf-price]')){if(overlay&&overlay.classList.contains('open'))close();var p=document.getElementById('offers');p&&p.scrollIntoView({behavior:'smooth'})}});

/* ---------- inline "video tour" section (injected before "Selected work") ---------- */
var tour=null,tourBusy=false;
function fmt(x){x=Math.floor(x);return Math.floor(x/60)+':'+('0'+(x%60)).slice(-2)}
function tourHTML(L,total,starts){
  var cs=[0,2,4,7],i;
  return '<div class="container"><div class="tour__grid"><div class="tour__head">'+
   '<p class="eyebrow">'+L.tEyebrow+' · '+fmt(total)+'</p><h2 class="section-title" id="tourTitle">'+L.tTitle+'</h2><p class="section-lead">'+L.tLead+'</p></div>'+
   '<div class="tour__list"><ol class="tour__ch">'+cs.map(function(k,n){return '<li><button type="button" data-ch="'+starts[k]+'"><span class="tour__tc">'+fmt(starts[k])+'</span><b>'+L.tCh[n]+'</b></button></li>'}).join('')+'</ol>'+
   '<div class="tour__actions"><button type="button" class="btn btn--sun btn--lg magnetic" data-tour-full><span>▶ '+L.tFull+'</span></button><a class="btn btn--glass btn--lg" data-nmf-price href="#offers">'+L.tOffers+'</a></div></div>'+
   '<div class="tour__player"><div class="tour__stage" id="tourStage"><div class="nmf" id="tourRoot"></div>'+
   '<button type="button" class="tour__pp" aria-label="Play / pause"><i></i></button></div>'+
   '<div class="tour__ctl"><div class="tour__bar" role="slider" aria-label="Video position"><i></i></div><span class="tour__time">0:00 / '+fmt(total)+'</span></div>'+
   '<p class="tour__hint">'+L.tHint+'</p></div></div></div>';
}
function initTour(){
  if(tourBusy||(tour&&tour.lang===lang()))return;
  var work=document.getElementById('work');if(!work)return;tourBusy=true;
  var sec=document.getElementById('tour');
  if(!sec){sec=document.createElement('section');sec.id='tour';sec.className='tour';sec.setAttribute('aria-labelledby','tourTitle');work.parentNode.insertBefore(sec,work)}
  var lg=lang(),L=T[lg];
  needs().then(function(){
    var tmp=document.createElement('div');tmp.className='nmf';var probe=build(tmp,lg,{});
    sec.innerHTML=tourHTML(L,probe.total,probe.starts);
    var root=document.getElementById('tourRoot'),F2=build(root,lg,{}),st={t:0,playing:false,vis:false,last:0,manual:false};
    var bar=sec.querySelector('.tour__bar i'),time=sec.querySelector('.tour__time'),pp=sec.querySelector('.tour__pp'),chBtn=sec.querySelectorAll('.tour__ch button');
    var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    function paint(){F2.render(st.t);bar.style.width=(st.t/F2.total*100)+'%';time.textContent=fmt(st.t)+' / '+fmt(F2.total);
      var cur=0;[0,2,4,7].forEach(function(k,n){if(st.t>=F2.starts[k]-.01)cur=n});chBtn.forEach(function(b,n){b.classList.toggle('on',n===cur)});sec.classList.toggle('is-playing',st.playing)}
    function loop(n){if(!st.playing)return;var dt=Math.min((n-st.last)/1000,.1);st.last=n;st.t+=dt;if(st.t>=F2.total+2){st.t=0;F2.reset()}paint();requestAnimationFrame(loop)}
    function play(){if(st.playing)return;st.playing=true;st.last=performance.now();requestAnimationFrame(loop)}
    function pause(){st.playing=false;paint()}
    function sync(){if(st.vis&&!document.hidden&&!st.manual&&!reduce)play();else if(!st.vis||document.hidden)pause()}
    new IntersectionObserver(function(es){st.vis=es[0].intersectionRatio>=.35;sync()},{threshold:[0,.35,.6]}).observe(root);
    document.addEventListener('visibilitychange',sync);
    pp.onclick=function(){if(st.playing){st.manual=true;pause()}else{st.manual=false;play()}};
    document.getElementById('tourStage').addEventListener('click',function(e){if(e.target.closest('a,button'))return;pp.onclick()});
    sec.querySelector('.tour__bar').addEventListener('click',function(e){var r=this.getBoundingClientRect();var x=(e.clientX-r.left)/r.width;if(lg==='ar')x=1-x;st.t=clamp(x)*(F2.total-.5);F2.reset();paint()});
    chBtn.forEach(function(b){b.onclick=function(){st.t=+b.dataset.ch;F2.reset();st.manual=false;paint();play();document.getElementById('tourStage').scrollIntoView({behavior:'smooth',block:'center'})}});
    sec.querySelector('[data-tour-full]').onclick=function(){var at=st.t;pause();open(at)};
    // show a good still before the first autoplay (and for reduced motion)
    st.t=reduce?22:0;paint();tour={sec:sec,lang:lg,pause:pause};tourBusy=false;
    if(reduce){pp.classList.add('is-static')}
  });
}
function refreshTour(){if(tour&&tour.lang!==lang()){tour.pause&&tour.pause();initTour()}}
function labels(){var L=T[lang()];document.querySelectorAll('[data-nmf-watch]').forEach(function(el){el.textContent=L.watch});refreshTour()}
labels();document.addEventListener('DOMContentLoaded',function(){labels();initTour()});if(document.readyState!=='loading')initTour();
document.addEventListener('nm:lang',labels);
/* keep labels + tour in step with the language switcher (i18n.js changes <html lang>) */
new MutationObserver(labels).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
