/* NM Academy — parcours en questions → recommandation → accès. Modèle réutilisable pour d'autres formations (change FLOW, textes z_*, PLANS). */
(function(){
'use strict';
var D=document,$=function(s,r){return(r||D).querySelector(s)},CFG=window.CONFIG||{PLANS:{}};
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
Object.assign(I18N.D,{
z_wt:['Trouve ton <em>parcours</em> en 1 minute','Find your <em>path</em> in 1 minute','หา<em>เส้นทาง</em>ของคุณใน 1 นาที'],
z_ws:['6 questions. On te recommande la formation adaptée et un plan de départ.','6 questions. We recommend the right course and a starting plan.','6 คำถาม เราจะแนะนำคอร์สที่เหมาะและแผนเริ่มต้น'],
z_start:['Commencer','Start','เริ่มเลย'],z_member:['Déjà membre ?','Already a member?','เป็นสมาชิกแล้ว?'],z_enter:['Entrer','Enter','เข้าสู่ระบบ'],z_cont:['Continuer →','Continue →','ต่อไป →'],z_back:['Retour','Back','กลับ'],
z_q1:['Salut ! Comment tu t\'appelles ?','Hi! What\'s your name?','สวัสดี! คุณชื่ออะไร?'],z_ph:['Ton prénom…','Your first name…','ชื่อของคุณ…'],
z_q2:['Enchanté {n} ! Quel est ton objectif principal ?','Nice to meet you {n}! What\'s your main goal?','ยินดีที่ได้รู้จัก {n}! เป้าหมายหลักของคุณคืออะไร?'],
o2a:['Un revenu complémentaire','Extra income','รายได้เสริม'],o2b:['Remplacer mon salaire à terme','Eventually replace my salary','ทดแทนเงินเดือนในอนาคต'],o2c:['Lancer une activité de freelance ou d\'agence','Start a freelance or agency business','เริ่มงานฟรีแลนซ์หรือเอเจนซี่'],o2d:['Développer mon audience en ligne','Grow my online audience','สร้างผู้ติดตามออนไลน์'],
z_q3:['Qu\'est-ce qui t\'attire le plus ?','What attracts you most?','อะไรที่ดึงดูดคุณมากที่สุด?'],
o3a:['Créer et vendre des sites web','Build and sell websites','สร้างและขายเว็บไซต์'],o3as:['Plan A','Plan A','แผน A'],o3b:['Produire des vidéos IA et les monétiser','Make AI videos and monetise them','ผลิตวิดีโอ AI และสร้างรายได้'],o3bs:['Plan B','Plan B','แผน B'],o3c:['Les deux / je ne sais pas encore','Both / not sure yet','ทั้งสองอย่าง / ยังไม่แน่ใจ'],o3cs:['Pack A + B','Pack A + B','แพ็ก A + B'],
z_q4:['Ton niveau avec les outils numériques ?','Your level with digital tools?','ระดับการใช้เครื่องมือดิจิทัลของคุณ?'],
o4a:['Débutant complet','Complete beginner','มือใหม่เลย'],o4b:['Je me débrouille','I manage','พอใช้ได้'],o4c:['À l\'aise','Comfortable','คล่องแล้ว'],
z_q5:['Combien d\'heures par semaine peux-tu y consacrer ?','How many hours a week can you give it?','ทุ่มเวลาได้สัปดาห์ละกี่ชั่วโมง?'],
o5a:['Moins de 3 h','Under 3 h','น้อยกว่า 3 ชม.'],o5b:['3 à 7 h','3 to 7 h','3–7 ชม.'],o5c:['8 h ou plus','8 h or more','8 ชม. ขึ้นไป'],
z_q6:['Sur quel appareil vas-tu surtout travailler ?','Which device will you mostly work on?','จะทำงานบนอุปกรณ์ไหนเป็นหลัก?'],
o6a:['Ordinateur','Computer','คอมพิวเตอร์'],o6b:['Téléphone surtout','Mostly phone','โทรศัพท์เป็นหลัก'],o6c:['Les deux','Both','ทั้งสองอย่าง'],
z_l1:['Analyse de tes réponses…','Analysing your answers…','กำลังวิเคราะห์คำตอบ…'],z_l2:['Choix du parcours…','Choosing your path…','กำลังเลือกเส้นทาง…'],z_l3:['Préparation de ton plan…','Preparing your plan…','กำลังเตรียมแผน…'],
z_rt:['Ton parcours est prêt, {n} !','Your path is ready, {n}!','เส้นทางของคุณพร้อมแล้ว {n}!'],z_rec:['Recommandé pour toi','Recommended for you','แนะนำสำหรับคุณ'],
z_wa1:['Semaine 1 : choisir ta niche locale et lister 30 prospects.','Week 1: pick your local niche and list 30 prospects.','สัปดาห์ 1: เลือกนิชท้องถิ่นและรวบรวมลูกค้าเป้าหมาย 30 ราย'],
z_wa2:['Semaine 2 : personnaliser un template et préparer 3 maquettes.','Week 2: customise a template and prepare 3 mockups.','สัปดาห์ 2: ปรับเทมเพลตและเตรียมแบบร่าง 3 แบบ'],
z_wa3:['Semaine 3 : contacter 20 prospects et présenter tes démos.','Week 3: contact 20 prospects and present your demos.','สัปดาห์ 3: ติดต่อลูกค้า 20 ราย และนำเสนอเดโม'],
z_wa4:['Semaine 4 : envoyer tes premiers devis et proposer la maintenance.','Week 4: send your first quotes and offer maintenance.','สัปดาห์ 4: ส่งใบเสนอราคาแรก และเสนอแพ็กเกจดูแล'],
z_wb1:['Semaine 1 : choisir ta niche, tester 3 outils gratuits, publier une vidéo.','Week 1: pick your niche, test 3 free tools, publish a video.','สัปดาห์ 1: เลือกนิช ทดลองเครื่องมือฟรี 3 ตัว และโพสต์วิดีโอแรก'],
z_wb2:['Semaine 2 : produire 1 vidéo par jour.','Week 2: produce 1 video a day.','สัปดาห์ 2: ผลิตวิดีโอวันละ 1 คลิป'],
z_wb3:['Semaine 3 : analyser la rétention et garder les 3 meilleurs formats.','Week 3: analyse retention and keep the 3 best formats.','สัปดาห์ 3: วิเคราะห์การรับชมและเก็บ 3 รูปแบบที่ดีที่สุด'],
z_wb4:['Semaine 4 : ouvrir une source de revenus (affiliation, UGC ou offre à un commerce).','Week 4: open an income source (affiliate, UGC or an offer to a business).','สัปดาห์ 4: เปิดช่องทางรายได้ (Affiliate, UGC หรือเสนอบริการให้ธุรกิจ)'],
z_wp1:['Semaine 1 : fondations des deux plans (niche, outils, première vidéo).','Week 1: foundations of both plans (niche, tools, first video).','สัปดาห์ 1: พื้นฐานทั้งสองแผน (นิช เครื่องมือ วิดีโอแรก)'],
z_wp2:['Semaine 2 : maquettes de sites + 1 vidéo par jour.','Week 2: site mockups + 1 video a day.','สัปดาห์ 2: แบบร่างเว็บไซต์ + วิดีโอวันละ 1 คลิป'],
z_wp3:['Semaine 3 : démarchage des commerces + analyse des chiffres vidéo.','Week 3: outreach to businesses + analysis of video numbers.','สัปดาห์ 3: ติดต่อธุรกิจ + วิเคราะห์ตัวเลขวิดีโอ'],
z_wp4:['Semaine 4 : premiers devis + première source de revenus vidéo.','Week 4: first quotes + first video income source.','สัปดาห์ 4: ใบเสนอราคาแรก + ช่องทางรายได้จากวิดีโอแรก'],
z_pace0:['Avec moins de 3 h par semaine, étale le plan sur 8 semaines.','With under 3 h a week, spread the plan over 8 weeks.','ถ้าน้อยกว่า 3 ชม./สัปดาห์ ให้ขยายแผนเป็น 8 สัปดาห์'],
z_pace1:['Avec 3 à 7 h par semaine, le plan de 4 semaines est réaliste.','With 3 to 7 h a week, the 4-week plan is realistic.','ถ้า 3–7 ชม./สัปดาห์ แผน 4 สัปดาห์ทำได้จริง'],
z_pace2:['Avec 8 h ou plus, tu peux viser le plan en 3 semaines.','With 8 h or more, you can aim to complete the plan in 3 weeks.','ถ้า 8 ชม. ขึ้นไป คุณอาจทำแผนให้เสร็จใน 3 สัปดาห์'],
z_beg:['Débutant : commence par les templates et le kit de scripts.','Beginner: start with the templates and the scripts kit.','มือใหม่: เริ่มจากเทมเพลตและชุดสคริปต์'],
z_phone:['Sur téléphone : le plan B se fait presque entièrement sur mobile.','On a phone: Plan B can be done almost entirely on mobile.','ใช้มือถือ: แผน B ทำได้เกือบทั้งหมดบนมือถือ'],
z_note:['Parcours indicatif basé sur tes réponses, pas une promesse de résultats.','Indicative path based on your answers, not a promise of results.','เส้นทางโดยประมาณจากคำตอบของคุณ ไม่ใช่คำสัญญาถึงผลลัพธ์'],
z_cta:['Voir mon accès →','See my access →','ดูสิทธิ์ของฉัน →'],
z_pt:['Choisis ton accès','Choose your access','เลือกการเข้าถึงของคุณ'],z_tag:['RECOMMANDÉ POUR TOI','RECOMMENDED FOR YOU','แนะนำสำหรับคุณ'],
z_ft:['Contenu','Content','เนื้อหา'],z_free:['Aperçu','Preview','ตัวอย่าง'],z_full:['Complet','Full','เต็ม'],
z_f1:['Programme détaillé','Detailed programme','โปรแกรมโดยละเอียด'],z_f2:['Leçons complètes','Full lessons','บทเรียนครบ'],z_f3:['Kit : scripts et modèles','Kit: scripts and templates','ชุดสคริปต์และเทมเพลต'],z_f4:['Gabarit de site','Starter site template','เทมเพลตเว็บไซต์'],z_f5:['Mises à jour et communauté','Updates and community','อัปเดตและชุมชน'],
z_pay:['Rejoindre — {price}','Join — {price}','เข้าร่วม — {price}'],z_site:['Revoir le site','Back to the site','กลับไปดูเว็บไซต์']
});
var T=function(k,v){return I18N.t(k,v)};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function sfx(n){if(window.SFX)try{SFX[n]()}catch(e){}}
var app=$('#app'),S={i:-1,a:{},step:'welcome',plan:null},tm=null,iv=null;
try{var sv=JSON.parse(localStorage.getItem('nm_quiz')||'null');if(sv&&sv.a)S.a=sv.a}catch(e){}
function save(){try{localStorage.setItem('nm_quiz',JSON.stringify({a:S.a}))}catch(e){}}
var FLOW=[
 {id:'name',type:'input',q:'z_q1'},
 {id:'goal',type:'choice',q:'z_q2',opts:[['o2a','💸'],['o2b','🚀'],['o2c','🧭'],['o2d','📈']]},
 {id:'path',type:'choice',q:'z_q3',opts:[['o3a','🌐','o3as'],['o3b','🎬','o3bs'],['o3c','⚡','o3cs']]},
 {id:'lvl',type:'choice',q:'z_q4',opts:[['o4a','🐣'],['o4b','🛠️'],['o4c','🔥']]},
 {id:'time',type:'choice',q:'z_q5',opts:[['o5a','⏱️'],['o5b','🕐'],['o5c','🧠']]},
 {id:'dev',type:'choice',q:'z_q6',cols:2,opts:[['o6a','💻'],['o6b','📱'],['o6c','🔀']]}
];
function out(fn){var s=$('.scr');sfx('whoosh');if(s&&!reduce){s.classList.add('out');setTimeout(fn,250)}else fn()}
function mount(h,c){app.innerHTML='<section class="scr '+(c||'')+'">'+h+'</section>';return $('.scr')}
function clear(){clearTimeout(tm);clearInterval(iv)}
function typeInto(el,text,done){if(reduce||S.nt){el.textContent=text;done&&done();return}var i=0;el.classList.add('ty');(function t(){i++;el.textContent=text.slice(0,i);if(i%2===0)sfx('key');if(i<text.length)tm=setTimeout(t,22);else{el.classList.remove('ty');done&&done()}})()}
function orb(c){return'<div class="orb '+(c||'')+'">NM</div>'}
function welcome(){clear();S.step='welcome';
 mount(orb()+'<h1 class="qh1">'+T('z_wt')+'</h1><p class="qs">'+esc(T('z_ws'))+'</p><div style="width:100%;margin-top:14px"><button class="cta2" id="go">'+esc(T('z_start'))+'</button><p class="qn" style="margin-top:12px">'+esc(T('z_member'))+' <a href="members.html" style="color:var(--c1);text-decoration:underline">'+esc(T('z_enter'))+'</a></p></div>','ctr');
 $('#go').onclick=function(){if(window.SFX&&!SFX.on&&!S.muted)SFX.set(true);rs();sfx('click');S.i=0;out(chat)}}
function chat(){
 clear();var st=FLOW[S.i];S.step='chat';var v={n:S.a.name||''},prog=Math.round((S.i+1)/(FLOW.length+1)*100);
 var mid=st.type==='input'?' qmid':'';
 mount('<div class="qtop"><button class="qback" id="bk"'+(S.i===0?' hidden':'')+' aria-label="'+esc(T('z_back'))+'">←</button><div class="qbar"><i id="pg"></i></div></div><div class="'+mid.trim()+'"><div class="chat">'+orb('sm')+'<div class="bub" id="bb"></div></div><div id="ans"></div></div>');
 setTimeout(function(){var p=$('#pg');if(p)p.style.width=prog+'%'},60);
 var bb=$('#bb'),ans=$('#ans');
 typeInto(bb,T(st.q,v),show);
 function show(){
  if(st.type==='input'){
   ans.innerHTML='<input class="fld" id="in" maxlength="24" autocomplete="given-name" placeholder="'+esc(T('z_ph'))+'" value="'+esc(S.a.name||'')+'"><div class="qft"><button class="cta2" id="ct" disabled>'+esc(T('z_cont'))+'</button></div>';
   var inp=$('#in'),ct=$('#ct');function ck(){ct.disabled=!inp.value.trim()}ck();inp.oninput=function(){ck();sfx('key')};
   function ok(){var n=inp.value.trim();if(!n)return;S.a.name=n;save();sfx('click');nx()}ct.onclick=ok;inp.onkeydown=function(e){if(e.key==='Enter')ok()};
  }else{
   var h='<div class="opts'+(st.cols===2?' two':'')+'">';
   st.opts.forEach(function(o,i){h+='<button class="op'+(S.a[st.id]===o[0]?' sel':'')+'" data-k="'+o[0]+'" style="animation-delay:'+(i*90)+'ms"><span class="ic">'+o[1]+'</span><span>'+esc(T(o[0]))+(o[2]?'<small>'+esc(T(o[2]))+'</small>':'')+'</span></button>'});
   ans.innerHTML=h+'</div>';
   [].forEach.call(ans.querySelectorAll('.op'),function(b){b.onclick=function(){[].forEach.call(ans.querySelectorAll('.op'),function(x){x.classList.remove('sel')});b.classList.add('sel');S.a[st.id]=b.dataset.k;save();sfx('click');setTimeout(nx,reduce?0:430)}})}
 }
 $('#bk').onclick=function(){if(S.i>0){S.i--;S.nt=true;out(chat)}};
 function nx(){S.nt=false;if(S.i<FLOW.length-1){S.i++;out(chat)}else out(analyse)}
 S.nt=false}
function analyse(){
 clear();S.step='analyse';
 mount(orb()+'<div class="ld" id="ld"></div>','ctr');
 var L=['z_l1','z_l2','z_l3'];$('#ld').innerHTML=L.map(function(k,i){return'<div class="st" id="s'+i+'"><span>'+esc(T(k))+'</span><div class="qbar"><i></i></div></div>'}).join('');
 var t0=Date.now(),TT=reduce?300:3600,last=-1;
 iv=setInterval(function(){var p=Math.min(1,(Date.now()-t0)/TT);for(var s=0;s<3;s++){var seg=Math.min(1,Math.max(0,p*3-s)),el=$('#s'+s);if(!el)return;el.classList.toggle('on',seg>0);el.classList.toggle('dn',seg>=1);el.querySelector('i').style.width=(seg*100)+'%';if(seg>=1&&last<s){last=s;sfx('ok')}}
  if(p>=1){clearInterval(iv);tm=setTimeout(function(){out(result)},350)}},50)}
function recommend(){var a=S.a,p=a.path==='o3a'?'a':a.path==='o3b'?'b':'pack';if(p==='a'&&a.dev==='o6b')p='pack';return p}
var PN={a:'pa_n',b:'pb_n',pack:'pk_n'};
function roadmap(p){var k=p==='a'?'z_wa':p==='b'?'z_wb':'z_wp',r=[1,2,3,4].map(function(i){return T(k+i)});var tm=S.a.time==='o5a'?0:S.a.time==='o5b'?1:2;r.push(T('z_pace'+tm));if(S.a.lvl==='o4a')r.push(T('z_beg'));if(S.a.dev==='o6b'&&p!=='a')r.push(T('z_phone'));return r}
function result(){
 clear();S.step='result';var p=recommend();S.plan=S.plan||p;var a=S.a;
 var chips=['goal','path','lvl','time','dev'].map(function(k){return a[k]?'<span class="chip">'+esc(T(a[k]))+'</span>':''}).join('');
 mount('<div class="rec">'+orb('sm')+'<div><div class="mono" style="color:var(--c3);font-size:.68rem">'+esc(T('z_rec'))+'</div><h2>'+esc(T(PN[p]))+'</h2></div></div><h1 class="qh1" style="font-size:1.4rem;margin-bottom:14px">'+esc(T('z_rt',{n:a.name||''}))+'</h1><div class="card2"><div class="chips">'+chips+'</div><ul class="rl">'+roadmap(p).map(function(x,i){return'<li style="animation-delay:'+(200+i*260)+'ms">'+esc(x)+'</li>'}).join('')+'</ul></div><p class="qn" style="margin-top:12px">'+esc(T('z_note'))+'</p><div class="qft"><button class="cta2" id="go">'+esc(T('z_cta'))+'</button></div>');
 sfx('ok');$('#go').onclick=function(){out(paywall)}}
function money(k){var p=CFG.PLANS[k];if(!p)return'';var c=CFG.CURRENCY||'€';return I18N.lang==='en'?c+p.price:p.price+' '+c}
function per(k){var p=CFG.PLANS[k];return p&&p.per==='mo'?T('per_mo'):T('per_once')}
function paywall(){
 clear();S.step='paywall';var rec=recommend();S.plan=S.plan||rec;
 var rows=['z_f1','z_f2','z_f3','z_f4','z_f5'].map(function(k,i){return'<tr><td>'+esc(T(k))+'</td><td class="'+(i===0?'y':'n')+'">'+(i===0?'✓':'—')+'</td><td class="y">✓</td></tr>'}).join('');
 var cards=[['pack','pk_n','pk_d'],['a','pa_n','pa_d'],['b','pb_n','pb_d']].map(function(c){return'<button class="pl" data-k="'+c[0]+'">'+(c[0]===rec?'<span class="tg">'+esc(T('z_tag'))+'</span>':'')+'<i class="ck">✓</i><span><span class="nm">'+esc(T(c[1]))+'</span><span class="sm">'+esc(T(c[2]))+'</span></span><span class="pr">'+esc(money(c[0]))+'<small>'+esc(per(c[0]))+'</small></span></button>'}).join('');
 var sc=mount('<div class="rec" style="margin-top:6px">'+orb('sm')+'<h2>'+esc(T('z_pt'))+'</h2></div><div class="pls">'+cards+'</div><table class="tbl"><tr><th>'+esc(T('z_ft'))+'</th><th>'+esc(T('z_free'))+'</th><th class="pm">'+esc(T('z_full'))+'</th></tr>'+rows+'</table><div class="stk"><button class="cta2" id="pay"></button><div class="gr">'+esc(T('p_ref',{d:CFG.REFUND_DAYS||7}))+'</div><div style="text-align:center"><a class="lnk" href="index.html">'+esc(T('z_site'))+'</a></div></div>');
 function sel(k){S.plan=k;[].forEach.call(sc.querySelectorAll('.pl'),function(b){b.classList.toggle('sel',b.dataset.k===k)});$('#pay').textContent=T('z_pay',{price:money(k)})}
 [].forEach.call(sc.querySelectorAll('.pl'),function(b){b.onclick=function(){sel(b.dataset.k);sfx('click')}});sel(S.plan);
 $('#pay').onclick=function(){buy(S.plan)}}
function buy(k){sfx('ok');var l=CFG.LINKS&&CFG.LINKS[k];if(l){window.open(l,'_blank','noopener');return}
 var a=S.a,summary=[a.name||'',T(a.goal||''),T(a.path||''),T(a.time||'')].filter(Boolean).join(' · ');
 var msg=T('mo_msg',{p:T(PN[k])})+(summary?' ('+summary+')':'');$('#mwa').href='https://wa.me/'+(CFG.WHATSAPP||'')+'?text='+encodeURIComponent(msg);$('#mem').textContent=CFG.EMAIL||'';$('#modal').hidden=false}
$('#mcl').onclick=function(){$('#modal').hidden=true};$('#modal').addEventListener('click',function(e){if(e.target.id==='modal')e.target.hidden=true});D.addEventListener('keydown',function(e){if(e.key==='Escape')$('#modal').hidden=true});
D.addEventListener('langchange',function(){S.nt=true;var m={welcome:welcome,chat:chat,analyse:result,result:result,paywall:paywall}[S.step];if(m)m();S.nt=false;rs()});
var sn=$('#snd');function rs(){var on=window.SFX&&SFX.on;sn.classList.toggle('on',!!on);sn.textContent=on?'SON ON':'SON OFF'}sn.onclick=function(){S.muted=SFX.on;SFX.set(!SFX.on);rs()};
/* fond : réseau de points + grille */
(function(){var cv=$('#bg'),c=cv.getContext('2d'),W,H,N=[],dpr=Math.min(2,devicePixelRatio||1),mx=0,my=0;function sz(){W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;c.setTransform(dpr,0,0,dpr,0,0);N=[];for(var i=0;i<Math.min(50,W/16);i++)N.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25})}sz();addEventListener('resize',sz);addEventListener('pointermove',function(e){mx=e.clientX/W-.5;my=e.clientY/H-.5},{passive:true});
 function f(t){c.clearRect(0,0,W,H);var hz=H*.68,g=c.createRadialGradient(W/2,hz,10,W/2,hz,W*.7);g.addColorStop(0,'rgba(0,229,255,.16)');g.addColorStop(.6,'rgba(123,92,255,.07)');g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,W,H);
  c.lineWidth=1;for(var i=-12;i<=12;i++){c.strokeStyle='rgba(0,229,255,'+(.2-Math.abs(i)*.012)+')';c.beginPath();c.moveTo(W/2+i*26+mx*30,hz);c.lineTo(W/2+i*(W/6)+mx*120,H);c.stroke()}
  var off=(t/2800)%1;for(var k=0;k<12;k++){var p=(k+off)/12,y=hz+(H-hz)*Math.pow(p,2.2);c.strokeStyle='rgba(0,229,255,'+(.04+p*.18)+')';c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke()}
  for(var a=0;a<N.length;a++){var n=N[a];n.x+=n.vx;n.y+=n.vy;if(n.x<0||n.x>W)n.vx*=-1;if(n.y<0||n.y>H)n.vy*=-1;c.fillStyle='rgba(180,230,255,.6)';c.fillRect(n.x+mx*14,n.y+my*10,1.6,1.6);for(var b=a+1;b<N.length;b++){var m=N[b],dx=n.x-m.x,dy=n.y-m.y,d=dx*dx+dy*dy;if(d<11000){c.strokeStyle='rgba(123,92,255,'+(.2*(1-d/11000))+')';c.beginPath();c.moveTo(n.x+mx*14,n.y+my*10);c.lineTo(m.x+mx*14,m.y+my*10);c.stroke()}}}
  if(!reduce)requestAnimationFrame(f)}requestAnimationFrame(f)})();
/* liens directs de test : ?step=result|paywall */
var q=new URLSearchParams(location.search).get('step');
function demo(){S.a={name:S.a.name||'Alex',goal:S.a.goal||'o2c',path:S.a.path||'o3c',lvl:S.a.lvl||'o4a',time:S.a.time||'o5b',dev:S.a.dev||'o6a'}}
D.addEventListener('DOMContentLoaded',function(){rs();if(q==='result'){demo();result()}else if(q==='paywall'){demo();paywall()}else if(q==='analyse'){demo();analyse()}else if(q&&/^chat/.test(q)){demo();S.i=+q.slice(4)||0;chat()}else welcome()});
})();
