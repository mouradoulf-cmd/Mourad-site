/* NM Academy — accueil simplifié. Tout est optionnel : la page reste lisible sans JS. */
(function(){
'use strict';
var D=document,$=function(s,r){return(r||D).querySelector(s)},$$=function(s,r){return[].slice.call((r||D).querySelectorAll(s))};
var CFG=window.CONFIG||{PLANS:{}},T=function(k,v){return window.I18N?I18N.t(k,v):k};
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
D.documentElement.classList.add('js');
function sfx(n){try{window.SFX&&SFX[n]()}catch(e){}}

/* film d'introduction de 10 s (une fois par session, ignorable) */
(function(){
 var f=$('#film');if(!f)return;
 var seen=false;try{seen=sessionStorage.getItem('nm_film')==='1'}catch(e){}
 if(reduce||seen||/[?&]nofilm/.test(location.search)){f.remove();return}
 D.body.classList.add('filming');var done=false,timers=[];
 function close(){if(done)return;done=true;timers.forEach(clearTimeout);try{sessionStorage.setItem('nm_film','1')}catch(e){}sfx('whoosh');f.classList.add('out');D.body.classList.remove('filming');setTimeout(function(){f.remove()},800)}
 $('#fskip').onclick=close;$('#fgo').onclick=close;
 D.addEventListener('keydown',function(e){if(!done&&(e.key==='Escape'||e.key==='Enter'))close()});
 function at(ms,fn){timers.push(setTimeout(function(){if(!done)fn()},ms))}
 requestAnimationFrame(function(){requestAnimationFrame(function(){D.documentElement.classList.add('go')})});
 at(150,function(){sfx('boot')});at(300,function(){sfx('tick')});at(650,function(){sfx('tick')});
 at(2500,function(){sfx('whoosh')});at(5000,function(){sfx('whoosh')});
 [5400,6000,6600].forEach(function(t){at(t,function(){sfx('ok')})});
 at(7500,function(){sfx('whoosh')});[7800,8000,8200].forEach(function(t){at(t,function(){sfx('tick')})});
 at(8700,function(){sfx('click')});
 at(11200,close);
})();

/* fond animé : grille en perspective + noeuds reliés */
(function(){
 var cv=$('#bg');if(!cv)return;var c=cv.getContext('2d'),W,H,dpr=Math.min(2,devicePixelRatio||1),nodes=[],vis=true;
 function size(){W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;c.setTransform(dpr,0,0,dpr,0,0);var N=Math.round(Math.min(55,W/22));nodes=[];for(var i=0;i<N;i++)nodes.push({x:Math.random()*W,y:Math.random()*H*.75,vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22,r:Math.random()*1.4+.6})}
 size();addEventListener('resize',size);D.addEventListener('visibilitychange',function(){vis=!D.hidden});
 var t0=performance.now();
 function frame(now){if(vis){var t=(now-t0)/1000,hz=H*.62;c.clearRect(0,0,W,H);
  var g=c.createRadialGradient(W*.5,hz,10,W*.5,hz,W*.7);g.addColorStop(0,'rgba(0,229,255,.16)');g.addColorStop(.5,'rgba(123,92,255,.07)');g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,W,H);
  c.lineWidth=1;for(var i=-14;i<=14;i++){c.strokeStyle='rgba(0,229,255,'+(.2-Math.abs(i)*.011)+')';c.beginPath();c.moveTo(W/2+i*30,hz);c.lineTo(W/2+i*(W/7),H);c.stroke()}
  var off=(t*.3)%1;for(var k=0;k<14;k++){var p=(k+off)/14,y=hz+(H-hz)*Math.pow(p,2.2);c.strokeStyle='rgba(0,229,255,'+(.04+p*.18)+')';c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke()}
  for(var a=0;a<nodes.length;a++){var n=nodes[a];n.x+=n.vx;n.y+=n.vy;if(n.x<0||n.x>W)n.vx*=-1;if(n.y<0||n.y>H*.75)n.vy*=-1;c.fillStyle='rgba(180,230,255,.65)';c.beginPath();c.arc(n.x,n.y,n.r,0,6.3);c.fill();
   for(var b=a+1;b<nodes.length;b++){var m=nodes[b],dx=n.x-m.x,dy=n.y-m.y,d=dx*dx+dy*dy;if(d<12000){c.strokeStyle='rgba(123,92,255,'+(.2*(1-d/12000))+')';c.beginPath();c.moveTo(n.x,n.y);c.lineTo(m.x,m.y);c.stroke()}}}}
  if(!reduce)requestAnimationFrame(frame)}
 requestAnimationFrame(frame);if(reduce)frame(performance.now());
})();

/* révélations au scroll (le masquage ne s'active que si l'observateur existe) */
(function(){if(!('IntersectionObserver' in window)||reduce)return;
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
 $$('.path,.cb,.why article,.vf,.plan,.coach,.steps3 article,.faq details,main h2,.gf,.endcta').forEach(function(el,i){el.classList.add('rv','pre');if(el.parentElement){var k=[].indexOf.call(el.parentElement.children,el);if(k===1)el.classList.add('d1');if(k>=2)el.classList.add('d2')}io.observe(el)})})();

/* barre de progression + sticky + nav */
var sp=$('#sp'),stk=$('#stk'),nav=$('#nav'),lastY=0;
addEventListener('scroll',function(){var y=scrollY,h=D.documentElement;sp.style.width=(y/(h.scrollHeight-innerHeight||1)*100)+'%';if(stk)stk.classList.toggle('show',y>700);nav.style.transform=(y>lastY&&y>400)?'translateY(-100%)':'none';lastY=y},{passive:true});

/* bouton son (actif par défaut, mémorisé) */
function refreshSnd(){var b=$('#snd');if(!b)return;var on=window.SFX&&SFX.on;b.classList.toggle('on',!!on);b.textContent=T(on?'snd_on':'snd_off')}
$('#snd').onclick=function(){if(window.SFX){SFX.set(!SFX.on);refreshSnd()}};refreshSnd();
D.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('a.btn,button,summary,.path'))sfx('click')});
D.addEventListener('langchange',function(){refreshSnd();money();setVideos()});

/* prix + achat */
function fmt(n){var cur=CFG.CURRENCY||'€';return I18N.lang==='en'?cur+n:n+' '+cur}
function money(){['a','b','pack','coach'].forEach(function(k){var p=CFG.PLANS[k];if(!p)return;var b=$('[data-price="'+k+'"]'),m=$('[data-per="'+k+'"]');if(b)b.textContent=fmt(p.price);if(m)m.textContent=T(p.per==='mo'?'per_mo':'per_once')});
 $$('[data-buy]').forEach(function(a){var k=a.getAttribute('data-buy'),l=CFG.LINKS&&CFG.LINKS[k];if(l){a.href=l;a.target='_blank';a.rel='noopener'}else{a.href='#';a.removeAttribute('target')}})}
money();
var names={a:'pa_n',b:'pb_n',pack:'pk_n',coach:'pc_n'};
D.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-buy]');if(!a)return;var k=a.getAttribute('data-buy');if(CFG.LINKS&&CFG.LINKS[k])return;e.preventDefault();
 var m=$('#modal');$('#mwa').href='https://wa.me/'+(CFG.WHATSAPP||'')+'?text='+encodeURIComponent(T('mo_msg',{p:T(names[k])}));$('#mem').textContent=CFG.EMAIL||'';m.hidden=false;sfx('ok')});
$('#mcl').onclick=function(){$('#modal').hidden=true};$('#modal').addEventListener('click',function(e){if(e.target.id==='modal')e.target.hidden=true});
D.addEventListener('keydown',function(e){if(e.key==='Escape')$('#modal').hidden=true});

/* offre à durée réelle (uniquement si CONFIG.OFFER_END) */
if(CFG.OFFER_END){var end=new Date(CFG.OFFER_END).getTime(),o=$('#offer');if(end>Date.now()){o.hidden=false;var up=function(){var x=Math.max(0,Math.floor((end-Date.now())/1000)),d=Math.floor(x/86400),h=Math.floor(x%86400/3600),m=Math.floor(x%3600/60),sc=x%60,p=function(n){return String(n).padStart(2,'0')};o.textContent=(d?d+'j ':'')+p(h)+':'+p(m)+':'+p(sc)};up();setInterval(up,1000);nav.style.top='28px'}}

/* vidéos : fichier selon la langue, lecture muette quand visible */
function setVideos(){var l=I18N.lang;$$('video[data-vv]').forEach(function(v){var n=v.getAttribute('data-vv'),src='assets/video/'+n+'-'+l+'.mp4';if(v.getAttribute('data-cur')!==src){var was=!v.paused;v.setAttribute('data-cur',src);v.poster='assets/video/'+n+'-'+l+'.jpg';v.preload='none';v.src=src;if(was){v.load();v.play().catch(function(){})}}})}
setVideos();
if('IntersectionObserver' in window){var vo=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)e.target.play().catch(function(){});else e.target.pause()})},{threshold:.6});$$('video[data-vv]').forEach(function(v){vo.observe(v)})}

/* analytics facultatif */
(function(){if(CFG.GA_ID){var g=D.createElement('script');g.async=1;g.src='https://www.googletagmanager.com/gtag/js?id='+CFG.GA_ID;D.head.appendChild(g);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',CFG.GA_ID)}
 if(CFG.PIXEL_ID){!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,D,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',CFG.PIXEL_ID);fbq('track','PageView')}})();
function track(n,d){try{window.fbq&&fbq('track',n,d);window.gtag&&gtag('event',n,d)}catch(e){}}
D.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-buy]');if(a)track('InitiateCheckout',{plan:a.getAttribute('data-buy')});if(e.target.closest&&e.target.closest('a[href="start.html"]'))track('StartQuiz')});

/* cadeau gratuit */
(function(){var f=$('#lead');if(!f)return;f.addEventListener('submit',function(e){e.preventDefault();var em=$('#lem').value.trim();if(!em)return;
 function done(){f.hidden=true;$('#lok').hidden=false;sfx('ok');track('Lead')}
 if(CFG.FORM_ENDPOINT){var fd=new FormData();fd.append('email',em);fd.append('source','nm-academy-gift');fetch(CFG.FORM_ENDPOINT,{method:'POST',body:fd,headers:{Accept:'application/json'}}).catch(function(){}).then(done)}else done()})})();

/* WhatsApp flottant */
(function(){var a=$('#wa');if(!a)return;function u(){a.href='https://wa.me/'+(CFG.WHATSAPP||'')+'?text='+encodeURIComponent(T('wa_msg'))}u();D.addEventListener('langchange',u)})();
})();
