/* Avatar Cash — app-style funnel (splash → welcome → chat questions → analysis → plan → paywall).
   Template: for a new course, change FLOW (questions), FN (copy per language) and the CSS tokens in app.css. */
(function(){
'use strict';
var D=document,app=D.getElementById('app');
function $(s,r){return(r||D).querySelector(s)}
var CFG=window.CONFIG||{PLANS:{life:{price:4990},month:{price:990}}};
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- copy (TH / FR / EN) ---------- */
var FN={
th:{say_t:'อวตารของคุณกำลังจะเกิดขึ้น',say_b:'ลองนึกภาพใบหน้านิช {niche} ที่พูดแทนคุณทุกวัน โดยที่คุณไม่ต้องออกกล้อง',q_src:'คุณรู้จัก Avatar Cash จากที่ไหน?',ph_src:'เช่น TikTok เพื่อน Instagram...',src_note:'ไม่บังคับ — ช่วยให้เรารู้ว่าอะไรได้ผล',skip:'ข้าม',
 q_line:'อีกขั้นเดียว {n}! เพิ่มเพื่อนใน LINE เพื่อรับแผนของคุณและพรอมต์ฟรี 20 ข้อ',line_btn:'เพิ่มเพื่อนใน LINE',line_skip:'ต่อโดยไม่ใช้ LINE',
 calc1:'กำลังคำนวณโปรแกรมที่เหมาะกับคุณ...',calc2:'กำลังเลือกเครื่องมือและพรอมต์...',calc3:'ใกล้เสร็จแล้ว...',badge:'คืนเงิน 7 วัน',st1:'5 โมดูล',st2:'20 พรอมต์',st3:'แผน 30 วัน',pw_a:'เข้าร่วม',loading:'กำลังโหลด...',wt:'ยินดีต้อนรับสู่ <em>Avatar Cash</em>!',ws:'สร้างอินฟลูเอนเซอร์ AI ของคุณเอง ใช้เวลา 2 นาที เราจะปรับเส้นทางให้เหมาะกับคุณ',start:'เริ่มเลย 🚀',member:'เป็นสมาชิกแล้ว?',enter:'เข้าห้องเรียน',cont:'ต่อไป →',
 q_name:'สวัสดี! คุณชื่ออะไร? เราจะปรับเส้นทางให้เหมาะกับคุณ',ph_name:'ชื่อของคุณ...',
 q_goal:'เยี่ยมเลย {n}! เป้าหมายของคุณคืออะไร?',g1:'รายได้เสริม',g2:'อยากออกจากงานประจำในอนาคต',g3:'สร้างแบรนด์โดยไม่เปิดหน้า',g4:'อวตารสำหรับธุรกิจของฉัน',g5:'อยากรู้เฉยๆ',
 q_age:'{n} อายุเท่าไหร่?',a1:'18–24 ปี',a2:'25–34 ปี',a3:'35–44 ปี',a4:'45–54 ปี',a5:'55 ปีขึ้นไป',age_note:'สำหรับผู้มีอายุ 18 ปีขึ้นไป',
 q_lvl:'โอเค {n}! เคยใช้เครื่องมือ AI (ภาพ วิดีโอ เสียง) ไหม?',l1:'ยังไม่เคย',l1s:'เหมาะสำหรับเริ่มต้น',l2:'เคยลองนิดหน่อย',l2s:'รู้จักพื้นฐานแล้ว',l3:'ใช้เป็นแล้ว',l3s:'อยากไปให้ไกลกว่านี้',
 q_niche:'คุณเห็นตัวเองในนิชไหน?',n1:'ความงาม',n2:'การเงินส่วนบุคคล',n3:'สุขภาพ & ออกกำลังกาย',n4:'ท่องเที่ยว',n5:'เครื่องมือ AI',n6:'อื่นๆ',
 q_time:'ทุ่มเวลาให้ได้วันละเท่าไหร่?',t1:'15 นาที',t2:'30–60 นาที',t3:'มากกว่า 1 ชั่วโมง',
 q_plat:'อยากโพสต์ที่ไหนก่อน?',p1:'TikTok',p2:'Instagram Reels',p3:'Facebook Reels',p4:'YouTube Shorts',
 ld1:'กำลังวิเคราะห์โปรไฟล์ของคุณ...',ld2:'กำลังปรับเส้นทางให้เหมาะกับคุณ...',ld3:'กำลังสร้างแผนของคุณ...',
 r_t:'แผนของคุณพร้อมแล้ว {n}!',r_s:'นี่คือสิ่งที่เราเตรียมไว้ให้คุณ',
 b1a:'สัปดาห์ 1: เรียนรู้เครื่องมือ AI ทีละขั้น และสร้างอวตารนิช {niche}',b1b:'สัปดาห์ 1: สร้างอวตารนิช {niche} ด้วยรูปอ้างอิงหลัก',
 b2a:'สัปดาห์ 2: โพสต์ 3 คลิปต่อสัปดาห์บน {plat} ใช้เวลาคลิปละราว 15 นาที',b2b:'สัปดาห์ 2: โพสต์วันละ 1 คลิปบน {plat}',b2c:'สัปดาห์ 2: โพสต์วันละ 1–2 คลิปบน {plat}',
 b3:'สัปดาห์ 3: อ่านตัวเลขและปรับสูตรของคุณ',
 b4_g1:'สัปดาห์ 4: เปิดช่องทางรายได้แรก (Affiliate, สปอนเซอร์)',b4_g2:'สัปดาห์ 4: วางระบบรายได้ที่ยั่งยืน',b4_g3:'สัปดาห์ 4: เปิดตัวแบรนด์แบบไม่เปิดหน้า',b4_g4:'สัปดาห์ 4: สร้างพรีเซนเตอร์ AI ให้ธุรกิจของคุณ',b4_g5:'สัปดาห์ 4: เลือกวิธีสร้างรายได้ที่เหมาะกับคุณ',
 r_note:'แผนนี้เป็นการประเมินจากคำตอบของคุณ ไม่ใช่คำสัญญาว่าจะได้ผลลัพธ์',r_cta:'ดูข้อเสนอของฉัน →',
 pw_t:'เข้าร่วม <em>Avatar Cash</em>',pw_s:'แผนนิช {niche} บน {plat}',offer:'โปรโมชันเปิดตัวสิ้นสุดใน',
 pl_life:'ตลอดชีพ',pl_lifes:'จ่ายครั้งเดียว • เท่ากับ 5 เดือนของรายเดือน',pl_month:'รายเดือน',pl_months:'ยกเลิกเมื่อไรก็ได้',pop:'คุ้มที่สุด',per:'ต่อเดือน',once:'ครั้งเดียว',
 ft:'ฟีเจอร์',free:'ฟรี',full:'เต็ม',f1:'พรอมต์ 20 ข้อ',f2:'5 โมดูลเต็ม',f3:'แผน 30 วัน',f4:'คอมมูนิตี้ LINE',f5:'สคริปต์ปิดการขาย',
 pay:'เข้าร่วม — {price}',guar:'🛡 รับประกันคืนเงิน 7 วัน',disc:'ไม่รับประกันรายได้ ผลลัพธ์ขึ้นกับการลงมือทำ',nothanks:'ไม่เป็นไร ขอแค่พรอมต์ฟรี',terms:'เงื่อนไข',back:'กลับ'},
fr:{say_t:'Ton avatar va naître',say_b:'Imagine un visage {niche} qui parle à ta place chaque jour, sans que tu apparaisses à l’écran.',q_src:'Comment as-tu découvert Avatar Cash ?',ph_src:'Ex : TikTok, un ami, Instagram...',src_note:'Facultatif — ça nous aide à savoir ce qui marche',skip:'Passer',
 q_line:'Plus qu’une étape {n} ! Ajoute-nous sur LINE pour recevoir ton plan et les 20 prompts gratuits.',line_btn:'Ajouter sur LINE',line_skip:'Continuer sans LINE',
 calc1:'Calcul de ton programme personnalisé...',calc2:'Sélection des outils et des prompts...',calc3:'Presque terminé...',badge:'7 j remboursé',st1:'5 modules',st2:'20 prompts',st3:'Plan 30 jours',pw_a:'Rejoins',loading:'Chargement...',wt:'Bienvenue sur <em>Avatar Cash</em> !',ws:'Crée ton influenceur IA. En 2 minutes, on personnalise ton parcours.',start:'Commencer 🚀',member:'Déjà membre ?',enter:'Entrer',cont:'Continuer →',
 q_name:'Salut ! Comment tu t’appelles ? Je vais personnaliser ton parcours.',ph_name:'Ton prénom...',
 q_goal:'Super {n} ! Quel est ton objectif ?',g1:'Un revenu complémentaire',g2:'Quitter mon travail à terme',g3:'Créer une marque sans montrer mon visage',g4:'Un avatar pour mon entreprise',g5:'Par curiosité',
 q_age:'{n}, quel âge as-tu ?',a1:'18–24 ans',a2:'25–34 ans',a3:'35–44 ans',a4:'45–54 ans',a5:'55 ans et plus',age_note:'Réservé aux personnes de 18 ans et plus',
 q_lvl:'Ok {n} ! Tu as déjà utilisé des outils IA (images, vidéos, voix) ?',l1:'Jamais',l1s:'Parfait pour commencer',l2:'Un peu',l2s:'J’ai déjà essayé',l3:'Je me débrouille',l3s:'Je veux aller plus loin',
 q_niche:'Dans quelle niche tu te vois ?',n1:'Beauté',n2:'Finances perso',n3:'Santé & sport',n4:'Voyage',n5:'Outils IA',n6:'Autre',
 q_time:'Combien de temps par jour peux-tu y consacrer ?',t1:'15 minutes',t2:'30 à 60 minutes',t3:'Plus d’une heure',
 q_plat:'Où veux-tu publier en premier ?',p1:'TikTok',p2:'Instagram Reels',p3:'Facebook Reels',p4:'YouTube Shorts',
 ld1:'Analyse de ton profil...',ld2:'Optimisation de ton parcours...',ld3:'Création de ton plan...',
 r_t:'Ton plan est prêt, {n} !',r_s:'Voici ce qu’on a préparé pour toi',
 b1a:'Semaine 1 : prise en main des outils IA pas à pas et création de ton avatar {niche}',b1b:'Semaine 1 : création de ton avatar {niche} avec une image de référence',
 b2a:'Semaine 2 : 3 vidéos par semaine sur {plat}, environ 15 min chacune',b2b:'Semaine 2 : 1 vidéo par jour sur {plat}',b2c:'Semaine 2 : 1 à 2 vidéos par jour sur {plat}',
 b3:'Semaine 3 : lire tes chiffres et ajuster ta formule',
 b4_g1:'Semaine 4 : ouvrir ta première source de revenus (affiliation, sponsors)',b4_g2:'Semaine 4 : bâtir un système de revenus durable',b4_g3:'Semaine 4 : lancer ta marque sans montrer ton visage',b4_g4:'Semaine 4 : créer le présentateur IA de ton entreprise',b4_g5:'Semaine 4 : choisir comment monétiser',
 r_note:'Ce plan est une estimation basée sur tes réponses, pas une promesse de résultats.',r_cta:'Voir mon offre →',
 pw_t:'Rejoins <em>Avatar Cash</em>',pw_s:'Ton plan {niche} sur {plat}',offer:'L’offre de lancement se termine dans',
 pl_life:'À vie',pl_lifes:'Paiement unique • équivaut à 5 mois d’abonnement',pl_month:'Mensuel',pl_months:'Résiliable à tout moment',pop:'Le plus avantageux',per:'par mois',once:'une fois',
 ft:'Fonctionnalités',free:'Gratuit',full:'Complet',f1:'20 prompts',f2:'5 modules complets',f3:'Plan 30 jours',f4:'Communauté LINE',f5:'Scripts de vente',
 pay:'Rejoindre — {price}',guar:'🛡 Remboursé sous 7 jours',disc:'Aucun revenu garanti. Les résultats dépendent de ton action.',nothanks:'Non merci, juste les prompts gratuits',terms:'Conditions',back:'Retour'},
en:{say_t:'Your avatar is about to be born',say_b:'Picture a {niche} face that speaks for you every day, without you ever appearing on screen.',q_src:'How did you discover Avatar Cash?',ph_src:'E.g. TikTok, a friend, Instagram...',src_note:'Optional — it helps us know what works',skip:'Skip',
 q_line:'One more step {n}! Add us on LINE to get your plan and the 20 free prompts.',line_btn:'Add us on LINE',line_skip:'Continue without LINE',
 calc1:'Calculating your personalised programme...',calc2:'Selecting tools and prompts...',calc3:'Almost done...',badge:'7-day refund',st1:'5 modules',st2:'20 prompts',st3:'30-day plan',pw_a:'Join',loading:'Loading...',wt:'Welcome to <em>Avatar Cash</em>!',ws:'Build your own AI influencer. In 2 minutes we personalise your path.',start:'Start 🚀',member:'Already a member?',enter:'Enter',cont:'Continue →',
 q_name:'Hi! What’s your name? I’ll personalise your path.',ph_name:'Your first name...',
 q_goal:'Great {n}! What’s your goal?',g1:'Extra income',g2:'Eventually leave my job',g3:'Build a brand without showing my face',g4:'An avatar for my business',g5:'Just curious',
 q_age:'{n}, how old are you?',a1:'18–24',a2:'25–34',a3:'35–44',a4:'45–54',a5:'55+',age_note:'For people aged 18 and over',
 q_lvl:'Ok {n}! Have you used AI tools (images, video, voice) before?',l1:'Never',l1s:'Perfect for starting',l2:'A little',l2s:'I’ve tried a bit',l3:'I manage fine',l3s:'I want to go further',
 q_niche:'Which niche can you see yourself in?',n1:'Beauty',n2:'Personal finance',n3:'Health & fitness',n4:'Travel',n5:'AI tools',n6:'Other',
 q_time:'How much time per day can you give it?',t1:'15 minutes',t2:'30–60 minutes',t3:'More than an hour',
 q_plat:'Where do you want to post first?',p1:'TikTok',p2:'Instagram Reels',p3:'Facebook Reels',p4:'YouTube Shorts',
 ld1:'Analysing your profile...',ld2:'Optimising your path...',ld3:'Creating your plan...',
 r_t:'Your plan is ready, {n}!',r_s:'Here is what we prepared for you',
 b1a:'Week 1: learn the AI tools step by step and create your {niche} avatar',b1b:'Week 1: create your {niche} avatar from a master reference image',
 b2a:'Week 2: 3 clips a week on {plat}, about 15 min each',b2b:'Week 2: 1 clip a day on {plat}',b2c:'Week 2: 1–2 clips a day on {plat}',
 b3:'Week 3: read your numbers and adjust your formula',
 b4_g1:'Week 4: open your first income stream (affiliate, sponsors)',b4_g2:'Week 4: build a lasting income system',b4_g3:'Week 4: launch your brand without showing your face',b4_g4:'Week 4: create the AI presenter for your business',b4_g5:'Week 4: choose how to monetise',
 r_note:'This plan is an estimate based on your answers, not a promise of results.',r_cta:'See my offer →',
 pw_t:'Join <em>Avatar Cash</em>',pw_s:'Your {niche} plan on {plat}',offer:'Launch offer ends in',
 pl_life:'Lifetime',pl_lifes:'One-time payment • equals 5 months of monthly',pl_month:'Monthly',pl_months:'Cancel anytime',pop:'Best value',per:'per month',once:'one-time',
 ft:'Features',free:'Free',full:'Full',f1:'20 prompts',f2:'5 full modules',f3:'30-day plan',f4:'LINE community',f5:'Sales scripts',
 pay:'Join — {price}',guar:'🛡 7-day money-back guarantee',disc:'No income guaranteed. Results depend on your effort.',nothanks:'No thanks, just the free prompts',terms:'Terms',back:'Back'}
};
function lang(){return(window.I18N&&I18N.lang)||'th'}
function t(k,v){var s=(FN[lang()]&&FN[lang()][k])||FN.th[k]||k;if(v)for(var x in v)s=s.split('{'+x+'}').join(v[x]);return s}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

/* ---------- questions ---------- */
var FLOW=[
 {id:'name',type:'input',q:'q_name'},
 {id:'goal',type:'choice',q:'q_goal',opts:[['g1','💸'],['g2','🚪'],['g3','🎭'],['g4','🏪'],['g5','🧪']]},
 {id:'age',type:'choice',q:'q_age',cols:2,note:'age_note',opts:[['a1','🎓'],['a2','💼'],['a3','🏡'],['a4','🌿'],['a5','⭐']]},
 {id:'lvl',type:'choice',q:'q_lvl',opts:[['l1','🐣','l1s'],['l2','🌱','l2s'],['l3','🔥','l3s']]},
 {id:'niche',type:'choice',q:'q_niche',cols:2,opts:[['n1','💄'],['n2','💰'],['n3','🏋️'],['n4','✈️'],['n5','🤖'],['n6','✨']]},
 {id:'say',type:'say',q:'say_b',title:'say_t'},
 {id:'time',type:'choice',q:'q_time',opts:[['t1','⏱️'],['t2','🕐'],['t3','🚀']]},
 {id:'plat',type:'choice',q:'q_plat',cols:2,opts:[['p1','🎵'],['p2','📸'],['p3','👍'],['p4','▶️']]},
 {id:'src',type:'text',q:'q_src',ph:'ph_src',note:'src_note'},
 {id:'line',type:'line',q:'q_line'}
];

var S={step:'splash',i:0,a:{},plan:'life'};
try{var sv=JSON.parse(localStorage.getItem('ac_funnel')||'null');if(sv&&sv.a){S.a=sv.a}}catch(e){}
function save(){try{localStorage.setItem('ac_funnel',JSON.stringify({a:S.a}))}catch(e){}}

/* ---------- mascot (bust drawn once, exported as image) ---------- */
function P(d){return new Path2D(d)}
var BP={shoulders:P('M12 380C12 296 78 272 150 272C222 272 288 296 288 380Z'),neck:P('M126 205L126 288Q150 312 174 288L174 205Z'),hairBack:P('M78 135C66 40 118 10 150 10C192 10 238 42 224 140C234 205 240 255 216 292L84 292C60 255 70 195 78 135Z'),face:P('M92 130C92 75 118 58 150 58C182 58 208 75 208 130C208 178 184 208 150 208C116 208 92 178 92 130Z'),bangs:P('M88 128C88 56 138 36 172 46C208 56 216 94 212 128C196 88 150 78 112 98C102 104 94 112 88 128Z')};
function solid(c,blink){
 var g=c.createLinearGradient(0,270,0,380);g.addColorStop(0,'#8b7cff');g.addColorStop(1,'#4636c9');c.fillStyle=g;c.fill(BP.shoulders);
 g=c.createLinearGradient(0,0,0,300);g.addColorStop(0,'#3a2d6b');g.addColorStop(1,'#140f2a');c.fillStyle=g;c.fill(BP.hairBack);
 c.fillStyle='#d9a182';c.fill(BP.neck);c.fillStyle='rgba(60,30,40,.25)';c.beginPath();c.ellipse(150,226,34,14,0,0,7);c.fill();
 c.strokeStyle='#facc15';c.lineWidth=4;c.beginPath();c.moveTo(104,284);c.lineTo(150,336);c.lineTo(196,284);c.stroke();
 g=c.createLinearGradient(100,60,200,210);g.addColorStop(0,'#ffe3cc');g.addColorStop(1,'#efb592');c.fillStyle=g;c.fill(BP.face);
 g=c.createLinearGradient(0,40,0,130);g.addColorStop(0,'#4a3b86');g.addColorStop(1,'#241b48');c.fillStyle=g;c.fill(BP.bangs);
 c.fillStyle='rgba(255,120,140,.22)';c.beginPath();c.ellipse(116,166,15,9,0,0,7);c.ellipse(184,166,15,9,0,0,7);c.fill();
 c.strokeStyle='#3a2d6b';c.lineWidth=3.2;c.lineCap='round';c.beginPath();c.moveTo(112,122);c.quadraticCurveTo(124,114,138,120);c.moveTo(162,120);c.quadraticCurveTo(176,114,188,122);c.stroke();
 var ey=Math.max(.08,1-(blink||0));[125,175].forEach(function(ex){c.fillStyle='#fff';c.beginPath();c.ellipse(ex,141,12,11*ey,0,0,7);c.fill();c.fillStyle='#1d1640';c.beginPath();c.ellipse(ex,141,7.5,8.5*ey,0,0,7);c.fill();if(ey>.4){c.fillStyle='#a855f7';c.beginPath();c.arc(ex,141,3.1,0,7);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(ex-3,137,2.2,0,7);c.fill()}});
 c.strokeStyle='#c98f74';c.lineWidth=2.4;c.beginPath();c.moveTo(150,148);c.quadraticCurveTo(146,168,153,172);c.stroke();
 c.fillStyle='#e0647e';c.beginPath();c.moveTo(134,186);c.quadraticCurveTo(150,194,166,186);c.quadraticCurveTo(150,206,134,186);c.fill();
}
var MASCOT=(function(){var cv=D.createElement('canvas');cv.width=cv.height=240;var c=cv.getContext('2d');
 var g=c.createRadialGradient(120,100,10,120,120,170);g.addColorStop(0,'#d8a4ff');g.addColorStop(1,'#a855f7');c.fillStyle=g;c.fillRect(0,0,240,240);
 c.save();c.translate(120-150*.8,128-150*.8);c.scale(.8,.8);solid(c,0);c.restore();return cv.toDataURL('image/png')})();

/* ---------- helpers ---------- */
function go(fn){var sc=$('.screen');if(sc&&!reduce){sc.classList.add('out');setTimeout(fn,260)}else fn()}
function mount(html){app.innerHTML='<section class="screen '+(arguments[1]||'')+'">'+html+'</section>';return $('.screen')}
function typeInto(el,text,done){
 if(reduce||el.dataset.skip){el.textContent=text;if(done)done();return}
 var i=0;el.classList.add('typing');(function tick(){i++;el.textContent=text.slice(0,i);if(i<text.length)S.timer=setTimeout(tick,22);else{el.classList.remove('typing');if(done)done()}})()}
function clearTimers(){clearTimeout(S.timer);clearInterval(S.int);cancelAnimationFrame(S.raf)}

/* ---------- screens ---------- */
function mascotHtml(cls){return'<div class="mascot '+(cls||'')+'"><img src="'+MASCOT+'" alt=""><div class="br"><b></b></div></div>'}
function splash(){
 clearTimers();S.step='splash';mount(mascotHtml()+'<div class="logo">AVATAR<br>CASH</div><div class="uline"><i></i></div><div class="loading">'+esc(t('loading'))+'</div>','center');
 S.timer=setTimeout(function(){go(welcome)},reduce?200:2300)}
function welcome(){
 clearTimers();S.step='welcome';
 mount(mascotHtml('')+'<h1>'+t('wt')+'</h1><p class="sub">'+esc(t('ws'))+'</p><div style="width:100%;margin-top:18px"><button class="cta" id="go">'+esc(t('start'))+'</button><p class="note" style="margin-top:12px">'+esc(t('member'))+' <a href="members.html" style="color:#c9adff;text-decoration:underline">'+esc(t('enter'))+'</a></p></div>','center');
 $('#go').onclick=function(){S.i=0;go(chat)}}
function chat(){
 clearTimers();var st=FLOW[S.i];S.step='chat';
 var v={n:S.a.name||'',niche:t(S.a.niche||'n6')},prog=Math.round((S.i+1)/(FLOW.length+2)*100);
 var mid=(st.type==='input'||st.type==='say'||st.type==='text'||st.type==='line')?' mid':'';
 var big=st.type==='say'?'<div class="big">'+mascotHtml()+'<h2>'+esc(t(st.title))+'</h2></div>':'';
 mount('<div class="top"><button class="back" id="bk" aria-label="'+esc(t('back'))+'"'+(S.i===0?' hidden':'')+'>←</button><div class="bar"><i id="pg"></i></div></div>'+big+
  '<div class="'+mid.trim()+'"><div class="chat"><img src="'+MASCOT+'" alt=""><div class="bubble" id="bb"></div></div><div id="ans"></div></div>');
 setTimeout(function(){var p=$('#pg');if(p)p.style.width=prog+'%'},60);
 var bb=$('#bb'),ans=$('#ans');if(S.noType)bb.dataset.skip='1';
 typeInto(bb,t(st.q,v),showAns);
 function foot(inner){return'<div class="foot">'+inner+'</div>'}
 function showAns(){
  if(st.type==='input'){
   ans.innerHTML='<input class="field" id="in" maxlength="24" autocomplete="given-name" placeholder="'+esc(t('ph_name'))+'" value="'+esc(S.a.name||'')+'">'+foot('<button class="cta" id="ct" disabled>'+esc(t('cont'))+'</button>');
   var inp=$('#in'),ct=$('#ct');function chk(){ct.disabled=!inp.value.trim()}chk();inp.oninput=chk;
   function ok(){var n=inp.value.trim();if(!n)return;S.a.name=n;save();next()}
   ct.onclick=ok;inp.onkeydown=function(e){if(e.key==='Enter')ok()};if(!S.noType)setTimeout(function(){try{inp.focus()}catch(e){}},50);
  }else if(st.type==='text'){
   ans.innerHTML='<textarea class="field" id="tx" maxlength="120" placeholder="'+esc(t(st.ph))+'">'+esc(S.a[st.id]||'')+'</textarea><p class="note" style="margin-top:8px">'+esc(t(st.note))+'</p>'+foot('<button class="cta" id="ct">'+esc(t('skip'))+'</button>');
   var tx=$('#tx'),c2=$('#ct');tx.oninput=function(){c2.textContent=t(tx.value.trim()?'cont':'skip')};c2.onclick=function(){S.a[st.id]=tx.value.trim();save();next()};
  }else if(st.type==='say'){
   ans.innerHTML=foot('<button class="cta" id="ct">'+esc(t('cont'))+'</button>');$('#ct').onclick=next;
  }else if(st.type==='line'){
   ans.innerHTML=foot('<a class="cta" id="ln" data-line href="#" target="_blank" rel="noopener">💬 '+esc(t('line_btn'))+'</a><button class="link" id="sk">'+esc(t('line_skip'))+'</button>');
   var la=$('#ln');la.href='https://line.me/R/ti/p/'+encodeURIComponent(CFG.LINE_OA||'');la.onclick=function(){S.a.line=1;save();setTimeout(next,600)};$('#sk').onclick=next;
  }else{
   var h='<div class="opts'+(st.cols===2?' two':'')+'">';
   st.opts.forEach(function(o,idx){h+='<button class="opt'+(S.a[st.id]===o[0]?' sel':'')+'" data-k="'+o[0]+'" style="animation-delay:'+(idx*90)+'ms"><span class="ico">'+o[1]+'</span><span>'+esc(t(o[0]))+(o[2]?'<small>'+esc(t(o[2]))+'</small>':'')+'</span></button>'});
   h+='</div>'+(st.note?'<p class="note" style="margin-top:12px">'+esc(t(st.note))+'</p>':'');
   ans.innerHTML=h;
   [].forEach.call(ans.querySelectorAll('.opt'),function(b){b.onclick=function(){
    [].forEach.call(ans.querySelectorAll('.opt'),function(x){x.classList.remove('sel')});b.classList.add('sel');
    S.a[st.id]=b.getAttribute('data-k');save();setTimeout(next,reduce?0:450)}})}
 }
 $('#bk').onclick=function(){if(S.i>0){S.i--;S.noType=true;go(chat)}};
 function next(){S.noType=false;if(S.i<FLOW.length-1){S.i++;go(chat)}else go(analysis)}
 S.noType=false}
/* analysis: mascot + one progress bar + rotating status lines (as in the reference) */
function analysis(){
 clearTimers();S.step='analysis';
 mount(mascotHtml()+'<div class="calc"><div class="bar" style="width:100%"><i id="pg"></i></div><p id="cp"></p></div>','center');
 var lines=['calc1','calc2','calc3'],pg=$('#pg'),cp=$('#cp'),T=reduce?400:4200,t0=Date.now(),li=-1;
 S.int=setInterval(function(){var p=Math.min(1,(Date.now()-t0)/T);pg.style.width=(p*100)+'%';var k=Math.min(2,Math.floor(p*3));if(k!==li){li=k;cp.style.opacity=0;setTimeout(function(){cp.textContent=t(lines[k]);cp.style.opacity=1},reduce?0:160)}
  if(p>=1){clearInterval(S.int);S.timer=setTimeout(function(){go(result)},400)}},60);
 cp.style.transition='opacity .3s'}
function plan(){var a=S.a,niche=t(a.niche||'n6'),plat=t(a.plat||'p1'),lv=a.lvl||'l1',tm=a.time||'t2',g=a.goal||'g1',v={niche:niche,plat:plat};
 return {v:v,items:[t(lv==='l1'?'b1a':'b1b',v),t(tm==='t1'?'b2a':tm==='t2'?'b2b':'b2c',v),t('b3'),t('b4_'+g)]}}
function result(){
 clearTimers();S.step='result';var a=S.a,pl=plan(),n=a.name||'';
 var chips=['niche','goal','lvl','time','plat'].map(function(k){return a[k]?'<span class="chip">'+esc(t(a[k]))+'</span>':''}).join('');
 mount('<div class="pw-h" style="margin-top:10px">'+mascotHtml('sm')+'<h1>'+esc(t('r_t',{n:n}))+'</h1><p class="sub">'+esc(t('r_s'))+'</p></div><div class="card"><div class="chips">'+chips+'</div><ul class="plan-l">'+pl.items.map(function(x,i){return'<li style="animation-delay:'+(250+i*300)+'ms">'+esc(x)+'</li>'}).join('')+'</ul></div><p class="note" style="margin-top:12px">'+esc(t('r_note'))+'</p><div class="foot"><button class="cta gold" id="go">'+esc(t('r_cta'))+'</button></div>');
 $('#go').onclick=function(){go(paywall)}}
function paywall(){
 clearTimers();S.step='paywall';var a=S.a,pl=plan(),P2=CFG.PLANS||{};
 function money(k){return'฿'+(P2[k]?P2[k].price:0).toLocaleString('en-US')}
 var end=CFG.OFFER_END?new Date(CFG.OFFER_END).getTime():0,showT=end&&end>Date.now();
 var rows=['f1','f2','f3','f4','f5'].map(function(k,i){return'<tr><td>'+esc(t(k))+'</td><td class="'+(i===0?'y':'n')+'">'+(i===0?'✓':'—')+'</td><td class="y">✓</td></tr>'}).join('');
 var sc=mount('<div class="pw-h"><div class="mascot"><img src="'+MASCOT+'" alt=""><span class="badge">'+esc(t('badge'))+'</span></div><h1><span>'+esc(t('pw_a'))+'</span><em>Avatar Cash</em></h1><div class="stats"><span><b>5</b> '+esc(t('st1').replace(/^\d+\s*/,''))+'</span><span><b>20</b> '+esc(t('st2').replace(/^\d+\s*/,''))+'</span><span>'+esc(t('st3'))+'</span></div><p class="sub" style="font-size:.78rem">'+esc(t('pw_s',pl.v))+'</p>'+(showT?'<p class="note">'+esc(t('offer'))+'</p><div class="timer" id="tm"></div>':'')+'</div>'+
  '<div class="plans"><button class="pl" data-k="life"><span class="tag">'+esc(t('pop'))+'</span><i class="ck">✓</i><span><span class="nm">'+esc(t('pl_life'))+'</span><span class="sm">'+esc(t('pl_lifes'))+'</span></span><span class="pr">'+money('life')+'<small>'+esc(t('once'))+'</small></span></button>'+
  '<button class="pl" data-k="month"><i class="ck">✓</i><span><span class="nm">'+esc(t('pl_month'))+'</span><span class="sm">'+esc(t('pl_months'))+'</span></span><span class="pr">'+money('month')+'<small>'+esc(t('per'))+'</small></span></button></div>'+
  '<table class="tbl"><tr><th>'+esc(t('ft'))+'</th><th>'+esc(t('free'))+'</th><th class="pm">'+esc(t('full'))+'</th></tr>'+rows+'</table>'+
  '<div class="sticky"><button class="cta gold" id="pay"></button><div class="guar">'+esc(t('guar'))+'</div><p class="note" style="margin-top:6px">'+esc(t('disc'))+' • <a href="terms.html">'+esc(t('terms'))+'</a></p><div style="text-align:center"><a class="link" href="free.html">'+esc(t('nothanks'))+'</a></div></div>');
 function sel(k){S.plan=k;[].forEach.call(sc.querySelectorAll('.pl'),function(b){b.classList.toggle('sel',b.getAttribute('data-k')===k)});$('#pay').textContent='✦ '+t('pay',{price:money(k)})}
 [].forEach.call(sc.querySelectorAll('.pl'),function(b){b.onclick=function(){sel(b.getAttribute('data-k'))}});sel(S.plan);
 $('#pay').onclick=function(){var ctx=[t(a.niche||'n6'),t(a.plat||'p1'),t(a.goal||'g1')].join(' • ')+(a.src?' • '+a.src:'');
  try{window.fbq&&fbq('track','InitiateCheckout')}catch(e){}
  location.href='checkout.html?plan='+S.plan+'&name='+encodeURIComponent(a.name||'')+'&ctx='+encodeURIComponent(ctx)};
 if(showT){var tm=$('#tm');var upd=function(){var s=Math.max(0,Math.floor((end-Date.now())/1000)),h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60,p=function(n){return String(n).padStart(2,'0')};tm.innerHTML='<b>'+p(h)+'</b>:<b>'+p(m)+'</b>:<b>'+p(x)+'</b>'};upd();S.int=setInterval(upd,1000)}}

/* re-render current screen when the language changes (no re-typing) */
D.addEventListener('langchange',function(){S.noType=true;var m={splash:splash,welcome:welcome,chat:chat,analysis:result,result:result,paywall:paywall}[S.step];if(m)m();S.noType=false});
/* deep links: ?step=paywall|result to jump (useful for testing / ads) */
var q=new URLSearchParams(location.search).get('step');
function demo(){S.a={name:S.a.name||'Mali',goal:S.a.goal||'g1',lvl:S.a.lvl||'l1',niche:S.a.niche||'n1',time:S.a.time||'t2',plat:S.a.plat||'p1'}}
var qi=new URLSearchParams(location.search).get('i');
if(q==='paywall'){demo();paywall()}else if(q==='result'){demo();result()}else if(q==='analysis'){demo();analysis()}else if(qi!==null){demo();S.i=Math.min(FLOW.length-1,Math.max(0,+qi||0));chat()}else splash();
})();
