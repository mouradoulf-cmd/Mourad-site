/* NM Academy — effets (fond animé, entrée avec son, machine à écrire, simulateur, achat). Tout est optionnel : la page fonctionne sans JS. */
(function(){
'use strict';
var D=document,$=function(s,r){return(r||D).querySelector(s)},$$=function(s,r){return[].slice.call((r||D).querySelectorAll(s))};
var CFG=window.CONFIG||{PLANS:{}},T=function(k,v){return window.I18N?I18N.t(k,v):k};
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
D.documentElement.classList.add('js');
function s(fn){try{fn()}catch(e){}}
function sfx(n){if(window.SFX)s(function(){SFX[n]()})}

/* ---------- background: perspective grid + linked nodes ---------- */
(function(){
 var cv=$('#bg'),c=cv.getContext('2d'),W,H,dpr=Math.min(2,devicePixelRatio||1),N,nodes=[],mx=0,my=0,vis=true;
 function size(){W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;c.setTransform(dpr,0,0,dpr,0,0);N=Math.round(Math.min(70,W/18));nodes=[];for(var i=0;i<N;i++)nodes.push({x:Math.random()*W,y:Math.random()*H*.75,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*1.5+.6})}
 size();addEventListener('resize',size);
 addEventListener('pointermove',function(e){mx=e.clientX/W-.5;my=e.clientY/H-.5},{passive:true});
 D.addEventListener('visibilitychange',function(){vis=!D.hidden});
 var t0=performance.now();
 function frame(now){
  if(vis){var t=(now-t0)/1000;c.clearRect(0,0,W,H);
   var hz=H*.62;
   // sky glow
   var g=c.createRadialGradient(W*.5+mx*60,hz,10,W*.5,hz,W*.7);g.addColorStop(0,'rgba(0,229,255,.18)');g.addColorStop(.5,'rgba(123,92,255,.08)');g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,W,H);
   // floor grid
   c.lineWidth=1;
   for(var i=-14;i<=14;i++){var x0=W/2+i*30+mx*40,x1=W/2+i*(W/7)+mx*160;c.strokeStyle='rgba(0,229,255,'+(.22-Math.abs(i)*.012)+')';c.beginPath();c.moveTo(x0,hz);c.lineTo(x1,H);c.stroke()}
   var off=(t*.35)%1;for(var k=0;k<14;k++){var p=(k+off)/14,y=hz+(H-hz)*Math.pow(p,2.2);c.strokeStyle='rgba(0,229,255,'+(.04+p*.2)+')';c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke()}
   // nodes
   for(var a=0;a<nodes.length;a++){var n=nodes[a];n.x+=n.vx;n.y+=n.vy;if(n.x<0||n.x>W)n.vx*=-1;if(n.y<0||n.y>H*.75)n.vy*=-1;
    var px=n.x+mx*20*n.r,py=n.y+my*14*n.r;c.fillStyle='rgba(180,230,255,.7)';c.beginPath();c.arc(px,py,n.r,0,6.3);c.fill();
    for(var b=a+1;b<nodes.length;b++){var m=nodes[b],dx=n.x-m.x,dy=n.y-m.y,d=dx*dx+dy*dy;if(d<14000){c.strokeStyle='rgba(123,92,255,'+(.22*(1-d/14000))+')';c.beginPath();c.moveTo(px,py);c.lineTo(m.x+mx*20*m.r,m.y+my*14*m.r);c.stroke()}}}
  }
  if(!reduce)requestAnimationFrame(frame)}
 requestAnimationFrame(frame);if(reduce)frame(performance.now());
})();

/* ---------- reveal on scroll (hidden only once observer exists) ---------- */
var io=null;
if('IntersectionObserver' in window){io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});}
function armReveal(){if(!io)return;$$('.rv').forEach(function(el){if(!el.classList.contains('in')){el.classList.add('pre');io.observe(el)}})}

/* ---------- typewriter helper (with key sounds) ---------- */
function typeInto(el,html,speed,done){
 var plain=html.replace(/<[^>]+>/g,'');if(reduce){el.innerHTML=html;done&&done();return}
 var i=0;(function tick(){i+=1;el.textContent=plain.slice(0,i);if(i%2===0)sfx('key');if(i<plain.length)setTimeout(tick,speed);else{el.innerHTML=html;done&&done()}})()}

/* ---------- gate + boot ---------- */
var gate=$('#gate'),entered=false;
try{entered=sessionStorage.getItem('nm_in')==='1'}catch(e){}
function enter(sound){
 s(function(){sessionStorage.setItem('nm_in','1')});
 if(sound)SFX.set(true);else if(window.SFX)SFX.set(false);
 refreshSnd();
 var boot=$('#boot'),lines=['b1','b2','b3','b4'].map(function(k){return T(k)}),btns=$('#gbtns');btns.style.visibility='hidden';
 if(window.SFX&&SFX.on)SFX.boot();
 var li=0;function next(){
  if(li>=lines.length){setTimeout(function(){sfx('whoosh');gate.classList.add('out');D.body.classList.remove('locked');setTimeout(function(){gate.hidden=true},900);start()},350);return}
  var row=D.createElement('span');boot.appendChild(row);boot.appendChild(D.createTextNode('\n'));
  var txt=lines[li++],j=0;(function ch(){j++;row.textContent=txt.slice(0,j);if(j%2===0)sfx('key');if(j<txt.length)setTimeout(ch,reduce?0:22);else setTimeout(next,reduce?0:140)})()}
 next()}
if(gate&&!entered){gate.hidden=false;D.body.classList.add('locked');
 $('#g-snd').onclick=function(){enter(true)};$('#g-mute').onclick=function(){enter(false)}}
else{if(gate)gate.hidden=true;setTimeout(start,60)}

/* ---------- after entry: hero typing + terminal ---------- */
var started=false;
function start(){
 if(started)return;started=true;armReveal();
 var sub=$('#sub');if(sub){var html=T('h_sub');sub.style.minHeight=sub.offsetHeight+'px';setTimeout(function(){typeInto(sub,html,reduce?0:14,function(){sub.style.minHeight=''})},700)}
 setTimeout(runTerm,1400);counters();
}
function runTerm(){
 var b=$('#termb');if(!b||b.dataset.ran)return;b.dataset.ran='1';
 var rows=[['$ ','t1','cm'],['✓ ','t2','ok'],['$ ','t3','cm'],['✓ ','t4','ok'],['$ ','t5','cm'],['✓ ','t6','ok']];
 var i=0;(function row(){if(i>=rows.length)return;var r=rows[i++],d=D.createElement('div');d.className=r[2];b.appendChild(d);var txt=r[0]+T(r[1]),j=0;
  (function ch(){j++;d.textContent=txt.slice(0,j);if(j%2===0)sfx('key');if(j<txt.length)setTimeout(ch,reduce?0:18);else{if(r[2]==='ok')sfx('ok');setTimeout(row,reduce?0:320)}})()})()}
D.addEventListener('langchange',function(){var b=$('#termb');if(b&&b.dataset.ran){b.innerHTML='';delete b.dataset.ran;runTerm()}var sub=$('#sub');if(sub)sub.innerHTML=T('h_sub');refreshSnd();money();sim()});

/* ---------- counters ---------- */
function counters(){$$('[data-count]').forEach(function(el){var to=+el.getAttribute('data-count'),t0=null;if(reduce){el.textContent=to;return}(function st(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/1200);el.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(st)})(performance.now())})}

/* ---------- nav / progress / sticky ---------- */
var sp=$('#sp'),stk=$('#stk'),nav=$('#nav'),lastY=0;
addEventListener('scroll',function(){var y=scrollY,h=D.documentElement;sp.style.width=(y/(h.scrollHeight-innerHeight||1)*100)+'%';if(stk)stk.classList.toggle('show',y>800);nav.style.transform=(y>lastY&&y>400)?'translateY(-100%)':'none';lastY=y},{passive:true});

/* ---------- sound toggle ---------- */
function refreshSnd(){var b=$('#snd');if(!b)return;var on=window.SFX&&SFX.on;b.classList.toggle('on',!!on);b.textContent=T(on?'snd_on':'snd_off')}
$('#snd').onclick=function(){if(window.SFX){SFX.set(!SFX.on);refreshSnd()}};refreshSnd();
D.addEventListener('pointerover',function(e){if(e.target.closest&&e.target.closest('a,button,.mod,.spot,summary'))sfx('hover')},{passive:true});
D.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('a.btn,button,summary'))sfx('click')});

/* ---------- cursor ring + spotlight + magnetic ---------- */
var cur=$('#cur');
if(fine&&!reduce){addEventListener('pointermove',function(e){cur.style.opacity=1;cur.style.transform='translate('+e.clientX+'px,'+e.clientY+'px)';cur.classList.toggle('h',!!(e.target.closest&&e.target.closest('a,button,summary,.tab')))},{passive:true})}
$$('.spot').forEach(function(c){c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')})});
if(fine&&!reduce)$$('.btn.pri').forEach(function(b){b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.14)+'px,'+((e.clientY-r.top-r.height/2)*.22)+'px)'});b.addEventListener('pointerleave',function(){b.style.transform=''})});

/* ---------- tabs ---------- */
$$('.tab').forEach(function(b){b.addEventListener('click',function(){var p=b.getAttribute('data-p');$$('.tab').forEach(function(x){x.classList.toggle('on',x===b)});$$('.panel').forEach(function(x){x.classList.toggle('on',x.id==='p'+p)});sfx('whoosh')})});

/* ---------- prices + checkout ---------- */
function fmt(n){var cur=CFG.CURRENCY||'€';return I18N.lang==='en'?cur+n:n+' '+cur}
function money(){['a','b','pack'].forEach(function(k){var p=CFG.PLANS[k];if(!p)return;var b=$('[data-price="'+k+'"]'),m=$('[data-per="'+k+'"]');if(b)b.textContent=fmt(p.price);if(m)m.textContent=T(p.per==='mo'?'per_mo':'per_once')});
 $$('[data-buy]').forEach(function(a){var k=a.getAttribute('data-buy'),l=CFG.LINKS&&CFG.LINKS[k];if(l){a.href=l;a.target='_blank';a.rel='noopener'}else{a.href='#';a.removeAttribute('target')}})}
money();
var names={a:'pa_n',b:'pb_n',pack:'pk_n'};
D.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-buy]');if(!a)return;var k=a.getAttribute('data-buy');if(CFG.LINKS&&CFG.LINKS[k])return;e.preventDefault();
 var msg=T('mo_msg',{p:T(names[k])}),m=$('#modal');$('#mwa').href='https://wa.me/'+(CFG.WHATSAPP||'')+'?text='+encodeURIComponent(msg);$('#mem').textContent=CFG.EMAIL||'';m.hidden=false;sfx('ok')});
$('#mcl').onclick=function(){$('#modal').hidden=true};$('#modal').addEventListener('click',function(e){if(e.target.id==='modal')e.target.hidden=true});
D.addEventListener('keydown',function(e){if(e.key==='Escape')$('#modal').hidden=true});

/* ---------- simulator ---------- */
function sim(){var p=+$('#r1').value,n=+$('#r2').value,m=+$('#r3').value;$('#o1').textContent=fmt(p);$('#o2').textContent=n;$('#o3').textContent=fmt(m);
 var a=p*n,b=m*n*6;$('#x1').textContent=fmt(a.toLocaleString('en-US'));$('#x2').textContent=fmt(b.toLocaleString('en-US'));$('#x3').textContent=fmt((a+b).toLocaleString('en-US'))}
['r1','r2','r3'].forEach(function(id){$('#'+id).addEventListener('input',function(){sim();if(window.SFX)SFX.slide((+this.value-this.min)/(this.max-this.min))})});sim();

/* ---------- optional real countdown ---------- */
if(CFG.OFFER_END){var end=new Date(CFG.OFFER_END).getTime(),o=$('#offer');if(end>Date.now()){o.hidden=false;var up=function(){var x=Math.max(0,Math.floor((end-Date.now())/1000)),d=Math.floor(x/86400),h=Math.floor(x%86400/3600),m=Math.floor(x%3600/60),sc=x%60,p=function(n){return String(n).padStart(2,'0')};o.textContent=(d?d+'j ':'')+p(h)+':'+p(m)+':'+p(sc)};up();setInterval(up,1000);nav.style.top='28px'}}

/* ---------- vidéos : fichier selon la langue, lecture muette quand visible ---------- */
function setVideos(){var l=I18N.lang;$$('video[data-vv]').forEach(function(v){var n=v.getAttribute('data-vv'),src='assets/video/'+n+'-'+l+'.mp4';if(v.getAttribute('data-cur')!==src){var was=!v.paused;v.setAttribute('data-cur',src);v.poster='assets/video/'+n+'-'+l+'.jpg';v.src=src;v.load();if(was)v.play().catch(function(){})}})}
setVideos();D.addEventListener('langchange',setVideos);
if('IntersectionObserver' in window){var vo=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.isIntersecting)v.play().catch(function(){});else v.pause()})},{threshold:.6});$$('video[data-vv]').forEach(function(v){vo.observe(v)})}

/* if the gate is skipped (already entered) make sure reveal still works */
if(!gate||gate.hidden){armReveal()}
})();
