/* NM Studio explainer film — deterministic render(t), used both as an in-site overlay and for MP4 export (video/render.html). */
(function(){
var SRC=(document.currentScript&&document.currentScript.src)||location.href;
var URLB=function(p){return new URL(p,SRC).href};
var WA='https://wa.me/qr/PYPOVXTCVM74I1';
var clamp=function(x,a,b){a=a==null?0:a;b=b==null?1:b;return Math.min(b,Math.max(a,x))};
var ease=function(x){return 1-Math.pow(1-clamp(x),3)};
var T={
en:{watch:'Watch the 60s video',enter:'Enter the site',
 say:["Before they visit, your customers search online.","No website means you're invisible, and customers pick someone else.","NM Studio fixes that in days: a website, a QR menu and a Google profile.","Send us your photos. We build a real website for your business.","One scan opens your menu: always up to date, no reprinting.","Be found on Google and Maps, even by tourists who haven't landed yet.","It's simple: send your photos, we build everything, and you go live in days.","Simple pricing. Pick the plan that fits your business.","No contract. Cancel anytime, free. No surprise fees.","Ready? Message us on WhatsApp and let's get you found."],
 h1:'They search <em>first.</em>',q:'restaurant near me',where:'Where is your business?',
 h2:'No website? <em>Invisible.</em>',p:['Customers choose your competitor','Printed menus, out of date','No Google profile'],
 h3:'We fix it. <em>In days.</em>',cards:['Website','QR menu','Google profile'],
 h4:'A real website.<br/><em>From your photos.</em>',t4:'You send photos. We do the rest.',
 h5:'One scan.<br/><em>Always current.</em>',t5:'No reprinting. Unlimited menu edits.',
 h6:'Found on <em>Google &amp; Maps.</em>',t6:'Tourists see you before they land.',you:'You',
 h7:'How it <em>works</em>',steps:['Send your photos','We build everything','You\'re live in days'],
 h8:'Simple <em>pricing</em>',plans:['QR menu','Your own website','Full package'],setup:'setup',mo:'/ month',pop:'Most popular',
 h9:'No <em>contract.</em>',chips:['Cancel anytime, free','No surprise fees','Unlimited edits'],
 h10:'Let\'s get you <em>found.</em>',t10:'Message us on WhatsApp',wa:'Chat on WhatsApp',book:'Book an appointment',price:'See pricing',scan:'Scan to message us on WhatsApp',close:'Close'},
fr:{watch:'Voir la vidéo (1 min)',enter:'Entrer dans le site',
 say:["Avant de venir, vos clients cherchent en ligne.","Sans site web, vous êtes invisible : vos clients choisissent quelqu'un d'autre.","NM Studio règle ça en quelques jours : un site web, un menu QR et une fiche Google.","Envoyez-nous vos photos. On construit un vrai site pour votre établissement.","Un scan ouvre votre menu, toujours à jour, sans réimpression.","Soyez trouvé sur Google et Maps, même par les touristes qui ne sont pas encore arrivés.","C'est simple : vous envoyez vos photos, on s'occupe de tout, et vous êtes en ligne en quelques jours.","Des tarifs simples. Choisissez l'offre qui convient à votre activité.","Sans engagement. Résiliez quand vous voulez, gratuitement. Aucun frais caché.","Prêt ? Écrivez-nous sur WhatsApp et faisons-vous trouver."],
 h1:'Ils cherchent <em>d\'abord.</em>',q:'restaurant près de moi',where:'Où est votre établissement ?',
 h2:'Pas de site ? <em>Invisible.</em>',p:['Les clients choisissent le concurrent','Menus imprimés, périmés','Pas de fiche Google'],
 h3:'On règle ça. <em>En quelques jours.</em>',cards:['Site web','Menu QR','Fiche Google'],
 h4:'Un vrai site.<br/><em>À partir de vos photos.</em>',t4:'Vous envoyez les photos. On fait le reste.',
 h5:'Un scan.<br/><em>Toujours à jour.</em>',t5:'Sans réimpression. Modifications illimitées.',
 h6:'Trouvé sur <em>Google &amp; Maps.</em>',t6:'Les touristes vous voient avant d\'atterrir.',you:'Vous',
 h7:'Comment ça <em>marche</em>',steps:['Envoyez vos photos','On construit tout','En ligne en quelques jours'],
 h8:'Des tarifs <em>simples</em>',plans:['Menu QR','Votre propre site','Formule complète'],setup:'installation',mo:'/ mois',pop:'Le plus choisi',
 h9:'Sans <em>engagement.</em>',chips:['Résiliation gratuite','Aucun frais caché','Modifications illimitées'],
 h10:'Faisons-vous <em>trouver.</em>',t10:'Écrivez-nous sur WhatsApp',wa:'Écrire sur WhatsApp',book:'Prendre rendez-vous',price:'Voir les tarifs',scan:'Scannez pour nous écrire sur WhatsApp',close:'Fermer'},
it:{watch:'Guarda il video (1 min)',enter:'Entra nel sito',
 say:["Prima di venire, i tuoi clienti cercano online.","Senza sito web sei invisibile: i clienti scelgono qualcun altro.","NM Studio risolve tutto in pochi giorni: sito web, menu QR e profilo Google.","Mandaci le tue foto. Costruiamo un vero sito per la tua attività.","Una scansione apre il tuo menu, sempre aggiornato, senza ristampe.","Fatti trovare su Google e Maps, anche dai turisti che non sono ancora arrivati.","È semplice: invii le foto, noi facciamo tutto, e vai online in pochi giorni.","Prezzi semplici. Scegli il piano adatto alla tua attività.","Nessun contratto. Disdici quando vuoi, gratis. Nessun costo a sorpresa.","Pronto? Scrivici su WhatsApp e facciamoti trovare."],
 h1:'Cercano <em>prima.</em>',q:'ristorante vicino a me',where:'Dov\'è la tua attività?',
 h2:'Niente sito? <em>Invisibile.</em>',p:['I clienti scelgono il concorrente','Menu stampati, vecchi','Nessun profilo Google'],
 h3:'Lo risolviamo. <em>In pochi giorni.</em>',cards:['Sito web','Menu QR','Profilo Google'],
 h4:'Un vero sito.<br/><em>Dalle tue foto.</em>',t4:'Tu mandi le foto. Al resto pensiamo noi.',
 h5:'Una scansione.<br/><em>Sempre aggiornato.</em>',t5:'Niente ristampe. Modifiche illimitate.',
 h6:'Trovato su <em>Google e Maps.</em>',t6:'I turisti ti vedono prima di atterrare.',you:'Tu',
 h7:'Come <em>funziona</em>',steps:['Invia le foto','Costruiamo tutto','Online in pochi giorni'],
 h8:'Prezzi <em>semplici</em>',plans:['Menu QR','Il tuo sito','Pacchetto completo'],setup:'attivazione',mo:'/ mese',pop:'Il più scelto',
 h9:'Nessun <em>contratto.</em>',chips:['Disdici gratis','Nessun costo nascosto','Modifiche illimitate'],
 h10:'Facciamoti <em>trovare.</em>',t10:'Scrivici su WhatsApp',wa:'Scrivici su WhatsApp',book:'Prenota un appuntamento',price:'Vedi i prezzi',scan:'Inquadra per scriverci su WhatsApp',close:'Chiudi'},
th:{watch:'ดูวิดีโอ 1 นาที',enter:'เข้าสู่เว็บไซต์',
 say:["ก่อนมาที่ร้าน ลูกค้าค้นหาในอินเทอร์เน็ตก่อน","ไม่มีเว็บไซต์ ก็เหมือนมองไม่เห็นร้านคุณ ลูกค้าจึงไปเลือกร้านอื่น","NM Studio ช่วยคุณได้ในไม่กี่วัน ทั้งเว็บไซต์ เมนู QR และโปรไฟล์ Google","ส่งรูปมาให้เรา แล้วเราสร้างเว็บไซต์จริงให้ธุรกิจของคุณ","สแกนครั้งเดียวก็เปิดเมนูของคุณ อัปเดตเสมอ ไม่ต้องพิมพ์ใหม่","ให้ลูกค้าเจอคุณบน Google และแผนที่ แม้แต่นักท่องเที่ยวที่ยังไม่ถึงไทย","ง่ายมาก ส่งรูปมา เราทำให้ทุกอย่าง แล้วเว็บไซต์ของคุณก็ออนไลน์ในไม่กี่วัน","ราคาเข้าใจง่าย เลือกแพ็กเกจที่เหมาะกับธุรกิจของคุณ","ไม่มีสัญญาผูกมัด ยกเลิกเมื่อไรก็ได้ ฟรี ไม่มีค่าใช้จ่ายแอบแฝง","พร้อมแล้วใช่ไหม ทักเราทาง WhatsApp แล้วมาทำให้ลูกค้าเจอคุณกัน"],
 h1:'ลูกค้า<em>ค้นหาก่อน</em>',q:'ร้านอาหารใกล้ฉัน',where:'ธุรกิจของคุณอยู่ตรงไหน?',
 h2:'ไม่มีเว็บไซต์? <em>มองไม่เห็น</em>',p:['ลูกค้าเลือกคู่แข่ง','เมนูกระดาษ เก่าแล้ว','ไม่มีโปรไฟล์ Google'],
 h3:'เราแก้ให้ <em>ในไม่กี่วัน</em>',cards:['เว็บไซต์','เมนู QR','โปรไฟล์ Google'],
 h4:'เว็บไซต์จริง<br/><em>จากรูปของคุณ</em>',t4:'คุณส่งรูป เราทำที่เหลือให้',
 h5:'สแกนครั้งเดียว<br/><em>อัปเดตเสมอ</em>',t5:'ไม่ต้องพิมพ์ใหม่ แก้เมนูได้ไม่จำกัด',
 h6:'เจอบน <em>Google และแผนที่</em>',t6:'นักท่องเที่ยวเห็นคุณก่อนถึงไทย',you:'คุณ',
 h7:'ทำงาน<em>อย่างไร</em>',steps:['ส่งรูปให้เรา','เราสร้างให้ทั้งหมด','ออนไลน์ในไม่กี่วัน'],
 h8:'ราคา<em>เข้าใจง่าย</em>',plans:['เมนู QR','เว็บไซต์ของคุณเอง','แพ็กเกจเต็ม'],setup:'ค่าติดตั้ง',mo:'/ เดือน',pop:'ยอดนิยม',
 h9:'ไม่มี<em>สัญญาผูกมัด</em>',chips:['ยกเลิกได้ฟรี','ไม่มีค่าแอบแฝง','แก้ไขได้ไม่จำกัด'],
 h10:'มาทำให้ลูกค้า<em>เจอคุณ</em>',t10:'ทักเราทาง WhatsApp',wa:'แชทผ่าน WhatsApp',book:'นัดหมาย',price:'ดูราคา',scan:'สแกนเพื่อทักเราทาง WhatsApp',close:'ปิด'},
ar:{watch:'شاهد الفيديو (دقيقة)',enter:'ادخل الموقع',
 say:["قبل أن يزوروك، يبحث عملاؤك على الإنترنت.","من دون موقع إلكتروني أنت غير مرئي، والعملاء يختارون غيرك.","نحل هذا في أيام: موقع إلكتروني وقائمة QR وملف على Google.","أرسل لنا صورك، ونبني لنشاطك موقعاً حقيقياً.","مسحة واحدة تفتح قائمتك، محدّثة دائماً ومن دون إعادة طباعة.","ليجدك الناس على Google والخرائط، حتى السياح قبل وصولهم.","الأمر بسيط: ترسل صورك، نتولى كل شيء، وتصبح على الإنترنت خلال أيام.","أسعار بسيطة. اختر الباقة المناسبة لنشاطك.","بلا عقد. ألغِ في أي وقت مجاناً. بلا رسوم مفاجئة.","جاهز؟ راسلنا على واتساب ولنجعل الناس يجدونك."],
 h1:'يبحثون <em>أولاً</em>',q:'مطعم قريب مني',where:'أين نشاطك؟',
 h2:'بلا موقع؟ <em>غير مرئي</em>',p:['العملاء يختارون المنافس','قوائم مطبوعة قديمة','لا ملف على Google'],
 h3:'نحل ذلك. <em>في أيام</em>',cards:['موقع إلكتروني','قائمة QR','ملف Google'],
 h4:'موقع حقيقي<br/><em>من صورك</em>',t4:'أنت ترسل الصور ونحن نتولى الباقي',
 h5:'مسحة واحدة<br/><em>دائماً محدّث</em>',t5:'بلا إعادة طباعة. تعديلات غير محدودة',
 h6:'تجدك على <em>Google والخرائط</em>',t6:'السياح يرونك قبل وصولهم',you:'أنت',
 h7:'كيف <em>يعمل</em>',steps:['أرسل صورك','نبني كل شيء','تصبح على الإنترنت خلال أيام'],
 h8:'أسعار <em>بسيطة</em>',plans:['قائمة QR','موقعك الخاص','الباقة الكاملة'],setup:'تأسيس',mo:'/ شهر',pop:'الأكثر طلباً',
 h9:'بلا <em>عقد</em>',chips:['إلغاء مجاني','بلا رسوم مخفية','تعديلات غير محدودة'],
 h10:'لنجعلهم <em>يجدونك</em>',t10:'راسلنا على واتساب',wa:'تحدث عبر واتساب',book:'احجز موعداً',price:'شاهد الأسعار',scan:'امسح الرمز لمراسلتنا على واتساب',close:'إغلاق'}
};
var PRICES=[['500','300'],['1,999','599'],['7,000','2,000']];
var PIN='<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>';
var LOGO='<svg viewBox="0 0 24 24" fill="none"><path d="M2.5 9c2.5 0 2.5 4.2 5 4.2S10 9 12 9s2.5 4.2 5 4.2S19.5 9 21.5 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M2.5 15c2.5 0 2.5 4.2 5 4.2S10 15 12 15s2.5 4.2 5 4.2S19.5 15 21.5 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" opacity=".5"/></svg>';
function qrSvg(){try{var q=qrcode(0,'M');q.addData(WA);q.make();return q.createSvgTag({cellSize:6,margin:0,scalable:true})}catch(e){return ''}}

function build(root,lang,opts){
  opts=opts||{};var L=T[lang]||T.en;
  root.classList.add('nmf');root.setAttribute('dir',lang==='ar'?'rtl':'ltr');root.setAttribute('lang',lang);
  root.innerHTML='<div class="nmf-bg" style="background-image:url('+URLB('../video/hero-poster.jpg')+')"></div><div class="nmf-glow nmf-g1"></div><div class="nmf-glow nmf-g2"></div><div class="nmf-glow nmf-g3"></div><div class="nmf-brand">'+LOGO+'<span>NM Studio</span></div><div class="nmf-bar"></div><div class="nmf-cap"><span></span></div>';
  var capEl=root.querySelector('.nmf-cap span'),bar=root.querySelector('.nmf-bar'),g=root.querySelectorAll('.nmf-glow');
  var S=[];
  function sc(t,html,upd){var el=document.createElement('div');el.className='nmf-sc';el.innerHTML=html;root.insertBefore(el,root.querySelector('.nmf-cap'));S.push({t:t,el:el,upd:upd||function(){}});return el}
  var qs=function(el,s){return el.querySelector(s)},qa=function(el,s){return el.querySelectorAll(s)};
  /* 1 search */
  var comp=['Seaside Grill  ★ 4.8','Bella Pattaya  ★ 4.7','Thai Garden  ★ 4.6'];
  sc(6,'<h2>'+L.h1+'</h2><div class="sbar glass">🔍 <b></b><i></i></div>'+comp.map(function(c){var p=c.split('  ');return '<div class="res glass"><b>'+p[0]+'</b><span>'+p[1]+'</span></div>'}).join('')+'<div class="res glass ghost">'+L.where+'</div>',
   function(e,lt){var s=L.q,n=Math.floor(clamp((lt-.6)/2)*s.length);qs(e,'.sbar b').textContent=s.slice(0,n);qs(e,'.sbar i').style.opacity=(Math.floor(lt*2)%2)?0:1;
    qa(e,'.res').forEach(function(r,i){var p=ease((lt-2.8-i*.45)/.5);r.style.opacity=p;r.style.transform='translate3d(0,'+((1-p)*30)+'px,'+((1-p)*-200)+'px)';if(i===3)r.style.boxShadow='0 0 '+(14+Math.sin(lt*5)*10)+'px rgba(236,72,153,.55)'})});
  /* 2 problems */
  sc(8,'<h2>'+L.h2+'</h2>'+L.p.map(function(x){return '<div class="prob glass"><i>✕</i><span>'+x+'</span></div>'}).join(''),
   function(e,lt){qa(e,'.prob').forEach(function(c,i){var p=ease((lt-.9-i*.9)/.7);c.style.opacity=p;c.style.transform='translate3d('+((1-p)*-60)+'px,0,'+((1-p)*-500)+'px) rotateY('+((1-p)*40)+'deg)'})});
  /* 3 solution carousel */
  var ico=['🌐','📱','📍'];
  sc(7,'<h2>'+L.h3+'</h2><div class="car">'+L.cards.map(function(c,i){return '<div class="cd glass"><span>'+ico[i]+'</span>'+c+'</div>'}).join('')+'</div>',
   function(e,lt){var a=ease(lt/.9),vm=Math.min(root.clientWidth,root.clientHeight)/100,R=vm*26;qs(e,'.car').style.opacity=a;qs(e,'.car').style.transform='translateZ('+((1-a)*-600)+'px) rotateX(-10deg)';
    qa(e,'.cd').forEach(function(c,i){var ang=(i*120+lt*34)%360,front=(Math.cos(ang*Math.PI/180)+1)/2;c.style.transform='rotateY('+ang+'deg) translateZ('+R+'px)';c.style.opacity=.35+.65*front;c.style.backfaceVisibility='visible'})});
  /* 4 mockups */
  sc(7,'<h2>'+L.h4+'</h2><div class="mk"><img class="lap" src="'+URLB('../img/mock-laptop.jpg')+'" alt=""/><img class="ph" src="'+URLB('../img/mock-phone.jpg')+'" alt=""/></div><div class="tx">'+L.t4+'</div>',
   function(e,lt){var a=ease(lt/.9),b=ease((lt-.7)/.9);var m=qs(e,'.mk');qs(e,'.lap').style.transform='rotateY('+(-14+(1-a)*-40+Math.sin(lt)*3)+'deg) translateZ('+((1-a)*-300)+'px)';qs(e,'.lap').style.opacity=a;
    qs(e,'.ph').style.transform='rotateY('+(12+(1-b)*50)+'deg) translate3d(0,'+((1-b)*80)+'px,'+(60+(1-b)*-300)+'px)';qs(e,'.ph').style.opacity=b});
  /* 5 QR flip */
  sc(8,'<h2>'+L.h5+'</h2><div class="flip"><div class="fq">'+qrSvg()+'</div><div class="fm"><img src="'+URLB('../img/mock-phone.jpg')+'" alt=""/></div></div><div class="tx">'+L.t5+'</div>',
   function(e,lt){var f=qs(e,'.flip'),a=ease(lt/.8),r=ease((lt-4)/.9);f.style.opacity=a;f.style.transform='rotateY('+(r*180+Math.sin(lt*1.2)*(1-r)*8)+'deg) rotateX('+Math.cos(lt)*3+'deg) scale('+(.85+a*.15)+')';f.style.setProperty('--sy',((lt*60)%100)+'%')});
  /* 6 map */
  var pins=[[16,32],[30,62],[44,26],[58,70],[72,36],[84,64],[24,84],[66,16],[90,24],[50,52]];
  sc(7,'<h2>'+L.h6+'</h2><div class="map">'+pins.map(function(p){return '<div class="pin" style="left:'+p[0]+'%;top:'+p[1]+'%">'+PIN+'</div>'}).join('')+'<div class="pin me" style="left:50%;top:60%">'+PIN+'<b>'+L.you+' ★ 4.9</b></div><div class="ripple" style="left:50%;top:60%"></div><div class="ripple" style="left:50%;top:60%"></div></div><div class="tx">'+L.t6+'</div>',
   function(e,lt){qa(e,'.pin:not(.me)').forEach(function(p,i){var q=ease((lt-.5-i*.18)/.45);p.style.opacity=q*.9;p.style.transform='translateY('+((1-q)*-120)+'px)'});
    var me=qs(e,'.me'),q=ease((lt-2.6)/.6);me.style.opacity=q;me.style.transform='translateY('+((1-q)*-200)+'px) scale('+(1+Math.sin(lt*3)*.04)+')';
    qa(e,'.ripple').forEach(function(r,i){var k=((lt-3.1-i*.9)%1.8)/1.8;if(lt<3.1||k<0){r.style.opacity=0;return}var s=k*160;r.style.width=r.style.height=s+'px';r.style.opacity=(1-k)*.8})});
  /* 7 steps */
  var si=['📸','🛠️','🚀'];
  sc(8,'<h2>'+L.h7+'</h2><div class="stp">'+L.steps.map(function(s,i){return '<div class="s glass"><span>'+si[i]+'</span><b>'+s+'</b></div>'}).join('')+'</div>',
   function(e,lt){qa(e,'.s').forEach(function(c,i){var p=ease((lt-.8-i*1)/.7);c.style.opacity=p;c.style.transform='translate3d(0,'+((1-p)*50)+'px,'+((1-p)*-400)+'px) rotateX('+((1-p)*40)+'deg)'})});
  /* 8 pricing */
  sc(10,'<h2>'+L.h8+'</h2><div class="pls">'+L.plans.map(function(n,i){return '<div class="pl glass'+(i===1?' pro':'')+'">'+(i===1?'<div class="bd">'+L.pop+'</div>':'')+'<div class="l"><h3>'+['Basic','Pro','Elite'][i]+'</h3><small>'+n+'</small></div><div class="r"><div class="pr">฿'+PRICES[i][0]+'<small>'+L.setup+'</small></div><div class="mo">฿'+PRICES[i][1]+' '+L.mo+'</div></div></div>'}).join('')+'</div>',
   function(e,lt){qa(e,'.pl').forEach(function(c,i){var p=ease((lt-.9-i*1.1)/.7);c.style.opacity=p;c.style.transform='translate3d(0,'+((1-p)*60)+'px,'+((1-p)*-500)+'px) rotateY('+((1-p)*(i-1)*-40)+'deg)'})});
  /* 9 chips */
  sc(6,'<h2>'+L.h9+'</h2><div class="chips">'+L.chips.map(function(c){return '<span class="glass">'+c+'</span>'}).join('')+'</div>',
   function(e,lt){qa(e,'.chips span').forEach(function(c,i){var p=ease((lt-.8-i*.6)/.5);c.style.opacity=p;c.style.transform='scale('+(.8+.2*p)+')'})});
  /* 10 CTA */
  var ctaBody=opts.render?'<div class="qrw">'+qrSvg()+'</div><div class="tx">'+L.scan+'</div>':
   '<div class="cta"><a class="wa" href="'+WA+'" target="_blank" rel="noopener">'+L.wa+'</a><button type="button" data-nmf-book>'+L.book+'</button><button type="button" data-nmf-price>'+L.price+'</button></div>';
  sc(9,'<h2>'+L.h10+'</h2><div class="tx">'+L.t10+'</div>'+ctaBody,
   function(e,lt){var a=ease((lt-.4)/.7);qa(e,'.cta,.qrw').forEach(function(c){c.style.opacity=a;c.style.transform='translateY('+((1-a)*40)+'px)'})});
  var total=0,starts=[];S.forEach(function(s){starts.push(total);total+=s.t});
  var cur=-1;
  function idx(t){var i=0;while(i<S.length-1&&t>=starts[i]+S[i].t)i++;return i}
  function render(t){
    t=clamp(t,0,total);var i=idx(t);
    g[0].style.transform='translate('+Math.sin(t*.2)*12+'vmax,'+Math.cos(t*.17)*8+'vmax)';g[1].style.transform='translate('+Math.cos(t*.15)*14+'vmax,'+Math.sin(t*.21)*10+'vmax)';g[2].style.transform='translate('+Math.sin(t*.12+2)*16+'vmax,'+Math.cos(t*.1)*12+'vmax)';
    S.forEach(function(s,k){var lt=t-starts[k],last=k===S.length-1;var show=lt>=0&&(lt<s.t+.3||(last&&t>=starts[k]));
      if(!show){s.el.style.opacity=0;s.el.classList.remove('on');s.el.style.pointerEvents='none';return}
      var fin=ease(lt/.45),fout=last?1:clamp((s.t+.3-lt)/.3);s.el.style.opacity=fin*fout;s.el.classList.add('on');s.el.style.pointerEvents=(last&&fin>.6)?'auto':'none';s.upd(s.el,Math.max(lt,0))});
    bar.style.width=Math.min(t/total,1)*100+'%';
    if(i!==cur){cur=i;capEl.textContent=L.say[i];if(opts.onScene)opts.onScene(i,S.length)}
  }
  return {total:total,render:render,idx:idx,say:L.say,lang:lang,count:S.length,reset:function(){cur=-1}};
}

/* ---------- export / render mode ---------- */
function loadScript(src){return new Promise(function(res){if(window.qrcode)return res();var s=document.createElement('script');s.src=src;s.onload=res;s.onerror=res;document.head.appendChild(s)})}
function loadFonts(){var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&family=Noto+Sans+Thai:wght@400;500;600&family=Noto+Sans+Arabic:wght@400;500;600&display=swap';document.head.appendChild(l)}
var QRSRC=URLB('qrcode-svg.min.js');
if(window.NMF_RENDER){
  var q=new URLSearchParams(location.search),lg=q.get('lang')||'en';
  window.__nmReady=Promise.all([loadScript(QRSRC)]).then(function(){
    var root=document.getElementById('nmf-root');var F=build(root,lg,{render:true});window.__nmTotal=F.total;window.__nmRender=function(t){F.render(t)};F.render(0);
    return document.fonts.ready.then(function(){return Promise.all(Array.prototype.map.call(document.images,function(im){return im.decode?im.decode().catch(function(){}):0}))}).then(function(){F.render(0);return true});
  });
  loadFonts();
  return;
}
/* ---------- in-site overlay ---------- */
var F=null,t=0,playing=false,last=0,soundOn=true,aud=null,curLang='en',overlay;
try{if(localStorage.getItem('nmfMuted')==='1')soundOn=false}catch(e){}
function lang(){return (typeof currentLang!=='undefined'&&T[currentLang])?currentLang:'en'}
function ensure(){
  if(overlay)return;overlay=document.createElement('div');overlay.id='nmfOverlay';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('data-lenis-prevent','');
  overlay.innerHTML='<div class="nmf" id="nmfRoot"></div><button id="nmfClose" type="button"></button><div id="nmfCtl"><button id="nmfPlay" type="button" aria-label="Play / pause">❚❚</button><div id="nmfProg"><i></i></div><button id="nmfSound" type="button" aria-label="Sound"></button></div>';
  document.body.appendChild(overlay);loadFonts();
  document.getElementById('nmfClose').onclick=close;
  document.getElementById('nmfPlay').onclick=function(){playing?pause():play()};
  var sb=document.getElementById('nmfSound');sb.textContent=soundOn?'🔊':'🔇';sb.classList.toggle('on',soundOn);
  sb.onclick=function(){soundOn=!soundOn;this.textContent=soundOn?'🔊':'🔇';this.classList.toggle('on',soundOn);try{localStorage.setItem('nmfMuted',soundOn?'0':'1')}catch(e){}if(aud){if(soundOn&&playing){aud.currentTime=t;aud.play().catch(function(){})}else aud.pause()}};
  document.getElementById('nmfProg').addEventListener('click',function(e){var r=this.getBoundingClientRect();t=clamp((e.clientX-r.left)/r.width)*F.total;F.reset();F.render(t);if(aud)aud.currentTime=t});
  overlay.addEventListener('click',function(e){
    if(e.target.closest('[data-nmf-price]')){close();var p=document.getElementById('pricing');p&&p.scrollIntoView({behavior:'smooth'})}
    if(e.target.closest('[data-nmf-book]')){close();var b=document.getElementById('bookBtn');b&&b.click()}});
  document.addEventListener('keydown',function(e){if(!overlay.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key===' '&&e.target.tagName!=='A'&&e.target.tagName!=='BUTTON'){e.preventDefault();document.getElementById('nmfPlay').click()}});
}
function tick(n){if(!playing)return;var dt=Math.min((n-last)/1000,.1);last=n;t+=dt;if(t>=F.total){t=F.total-.001;playing=false;if(aud)aud.pause();document.getElementById('nmfPlay').textContent='↻'}else if(aud&&soundOn&&Math.abs(aud.currentTime-t)>.25)aud.currentTime=t;F.render(t);if(playing)requestAnimationFrame(tick)}
function play(){if(t>=F.total-.01){t=0;F.reset()}playing=true;last=performance.now();document.getElementById('nmfPlay').textContent='❚❚';if(aud&&soundOn){aud.currentTime=t;aud.play().catch(function(){})}requestAnimationFrame(tick)}
function pause(){playing=false;document.getElementById('nmfPlay').textContent='▶';if(aud)aud.pause()}
function open(){
  ensure();curLang=lang();loadScript(QRSRC).then(function(){
    var root=document.getElementById('nmfRoot');
    F=build(root,curLang,{onScene:function(i,n){overlay.classList.toggle('final',i===n-1)}});
    if(aud){aud.pause()}aud=new Audio(URLB('../audio/nm-soundtrack-'+curLang+'.mp3'));aud.preload='auto';
    document.getElementById('nmfClose').textContent='✕ '+T[curLang].close;
    overlay.setAttribute('dir',curLang==='ar'?'rtl':'ltr');overlay.classList.add('open');document.documentElement.style.overflow='hidden';
    t=0;F.render(0);play();document.getElementById('nmfClose').focus();window.__nmfSeek=function(x){t=x;F.reset();F.render(x)};
  });
}
function close(){pause();if(aud)aud.currentTime=0;if(overlay)overlay.classList.remove('open');document.documentElement.style.overflow=''}
document.addEventListener('click',function(e){var b=e.target.closest('[data-nmf-open]');if(b){e.preventDefault();open()}var en=e.target.closest('[data-nmf-enter]');if(en){e.preventDefault();var s=document.getElementById('stats')||document.getElementById('how-it-works');s&&s.scrollIntoView({behavior:'smooth'})}});
/* hero button labels follow the site language */
function labels(){var L=T[lang()];document.querySelectorAll('[data-nmf-watch]').forEach(function(el){el.textContent=L.watch});document.querySelectorAll('[data-nmf-enter]').forEach(function(el){el.textContent=L.enter+' ↓'})}
labels();var _al=window.applyLanguage;if(typeof _al==='function'){window.applyLanguage=function(l){var r=_al.apply(this,arguments);labels();return r}}
document.addEventListener('DOMContentLoaded',labels);
})();
