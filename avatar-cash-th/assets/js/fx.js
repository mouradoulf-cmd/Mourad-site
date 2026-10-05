/* Avatar Cash v3 — visual effects (all optional; page works without JS) */
(function(){
var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
/* scroll progress + cursor glow */
var sp=$('#sp'),cg=$('#cg');
addEventListener('scroll',function(){var h=document.documentElement;if(sp)sp.style.width=(scrollY/(h.scrollHeight-innerHeight||1)*100)+'%'},{passive:true});
if(cg&&!reduce&&matchMedia('(hover:hover)').matches)addEventListener('pointermove',function(e){cg.style.opacity=1;cg.style.transform='translate('+(e.clientX-200)+'px,'+(e.clientY-200)+'px)'},{passive:true});
/* tilt cards */
if(!reduce&&matchMedia('(hover:hover)').matches)$$('.tilt').forEach(function(c){
 c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform='perspective(700px) rotateX('+(-y*6)+'deg) rotateY('+(x*8)+'deg) translateY(-4px)'});
 c.addEventListener('pointerleave',function(){c.style.transform=''})});
/* counters */
function count(el){var to=+el.getAttribute('data-count'),t0=null;function step(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/1100);el.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(step)}reduce?el.textContent=to:requestAnimationFrame(step)}
if('IntersectionObserver' in window){var co=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){count(e.target);co.unobserve(e.target)}})},{threshold:.6});$$('[data-count]').forEach(function(n){co.observe(n)});
 var to2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('on');to2.unobserve(e.target)}})},{threshold:.4});$$('.tl li').forEach(function(n){to2.observe(n)})}
else $$('[data-count]').forEach(function(n){n.textContent=n.getAttribute('data-count')});
/* tabs */
$$('.tab').forEach(function(b){b.addEventListener('click',function(){var w=b.getAttribute('data-w');$$('.tab').forEach(function(x){x.classList.toggle('on',x===b)});$$('.panel').forEach(function(p){p.classList.toggle('on',p.getAttribute('data-p')===w)})})});
/* accordion: one open at a time */
var acc=$('.acc');if(acc)acc.addEventListener('toggle',function(e){if(e.target.open)$$('details',acc).forEach(function(d){if(d!==e.target)d.open=false})},true);
/* hero avatar canvas */
var cv=$('#hero');if(!cv||!cv.getContext)return;
var c=cv.getContext('2d'),W=cv.width,H=cv.height,s=1.12,ox=W/2-150*s,oy=H/2-190*s+10;
function P(d){return new Path2D(d)}
var BP={shoulders:P('M12 380C12 296 78 272 150 272C222 272 288 296 288 380Z'),neck:P('M126 205L126 288Q150 312 174 288L174 205Z'),hairBack:P('M78 135C66 40 118 10 150 10C192 10 238 42 224 140C234 205 240 255 216 292L84 292C60 255 70 195 78 135Z'),face:P('M92 130C92 75 118 58 150 58C182 58 208 75 208 130C208 178 184 208 150 208C116 208 92 178 92 130Z'),bangs:P('M88 128C88 56 138 36 172 46C208 56 216 94 212 128C196 88 150 78 112 98C102 104 94 112 88 128Z')};
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
var sil=document.createElement('canvas');sil.width=300;sil.height=380;var sc=sil.getContext('2d');sc.fillStyle='#000';['shoulders','neck','hairBack','face','bangs'].forEach(function(k){sc.fill(BP[k])});
var d=sc.getImageData(0,0,300,380).data,R=rng(11),pts=[];
for(var y=0;y<380;y+=5)for(var x=0;x<300;x+=5)if(d[(y*300+x)*4+3]>128)pts.push({x:x+(R()-.5)*3,y:y+(R()-.5)*3,sx:R()*W,sy:R()*H,dl:R(),ph:R()*6.28,sz:1.5+R()*1.6});
function eo(x){return 1-Math.pow(1-Math.min(1,Math.max(0,x)),3)}
function solid(a,blink){c.save();c.globalAlpha=a;
 var g=c.createLinearGradient(0,270,0,380);g.addColorStop(0,'#8b7cff');g.addColorStop(1,'#4636c9');c.fillStyle=g;c.fill(BP.shoulders);
 g=c.createLinearGradient(0,0,0,300);g.addColorStop(0,'#3a2d6b');g.addColorStop(1,'#140f2a');c.fillStyle=g;c.fill(BP.hairBack);
 c.fillStyle='#d9a182';c.fill(BP.neck);c.fillStyle='rgba(60,30,40,.25)';c.beginPath();c.ellipse(150,226,34,14,0,0,7);c.fill();
 c.strokeStyle='#2ee6a6';c.lineWidth=4;c.shadowColor='#2ee6a6';c.shadowBlur=14;c.beginPath();c.moveTo(104,284);c.lineTo(150,336);c.lineTo(196,284);c.stroke();c.shadowBlur=0;
 g=c.createLinearGradient(100,60,200,210);g.addColorStop(0,'#ffe3cc');g.addColorStop(1,'#efb592');c.fillStyle=g;c.fill(BP.face);
 g=c.createLinearGradient(0,40,0,130);g.addColorStop(0,'#4a3b86');g.addColorStop(1,'#241b48');c.fillStyle=g;c.fill(BP.bangs);
 c.fillStyle='rgba(255,120,140,.22)';c.beginPath();c.ellipse(116,166,15,9,0,0,7);c.ellipse(184,166,15,9,0,0,7);c.fill();
 c.strokeStyle='#3a2d6b';c.lineWidth=3.2;c.lineCap='round';c.beginPath();c.moveTo(112,122);c.quadraticCurveTo(124,114,138,120);c.moveTo(162,120);c.quadraticCurveTo(176,114,188,122);c.stroke();
 var ey=Math.max(.08,1-blink);[125,175].forEach(function(ex){c.fillStyle='#fff';c.beginPath();c.ellipse(ex,141,12,11*ey,0,0,7);c.fill();c.fillStyle='#1d1640';c.beginPath();c.ellipse(ex,141,7.5,8.5*ey,0,0,7);c.fill();if(ey>.4){c.fillStyle='#2ee6a6';c.beginPath();c.arc(ex,141,3.1,0,7);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(ex-3,137,2.2,0,7);c.fill()}});
 c.strokeStyle='#c98f74';c.lineWidth=2.4;c.beginPath();c.moveTo(150,148);c.quadraticCurveTo(146,168,153,172);c.stroke();
 c.fillStyle='#e0647e';c.beginPath();c.moveTo(134,186);c.quadraticCurveTo(150,194,166,186);c.quadraticCurveTo(150,206,134,186);c.fill();c.restore()}
var mx=0,my=0,t0=null,vis=true;
cv.addEventListener('pointermove',function(e){var r=cv.getBoundingClientRect();mx=(e.clientX-r.left)/r.width-.5;my=(e.clientY-r.top)/r.height-.5});
if('IntersectionObserver' in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting}).observe(cv);
function frame(ts){if(!t0)t0=ts;var t=(ts-t0)/1000;if(vis){
 c.clearRect(0,0,W,H);
 var asm=reduce?1:Math.min(1,t/3.2),sol=reduce?1:eo((t-2.7)/1.1);
 c.save();c.translate(ox+mx*10,oy+my*8+Math.sin(t*1.2)*5);c.scale(s,s);
 var gl=c.createRadialGradient(150,190,20,150,190,260);gl.addColorStop(0,'rgba(139,124,255,'+(.4*sol)+')');gl.addColorStop(1,'rgba(139,124,255,0)');c.fillStyle=gl;c.fillRect(-160,-120,620,640);
 if(sol>0){var m=((t%3.4)-3.28);var b=Math.max(0,1-Math.abs(m)/.08);solid(sol,b)}
 if(sol<1){c.globalCompositeOperation='lighter';
  for(var i=0;i<pts.length;i++){var p=pts[i],q=eo((asm-p.dl*.55)/.45),w=(1-q)*30,
   px=(p.sx-ox)/s+(p.x-(p.sx-ox)/s)*q+Math.sin(t*3+p.ph)*w*.2,py=(p.sy-oy)/s+(p.y-(p.sy-oy)/s)*q+Math.cos(t*2.6+p.ph)*w*.2,k=p.y/380;
   c.fillStyle='rgba('+Math.round(46+93*k)+','+Math.round(230-106*k)+','+Math.round(166+89*k)+','+((1-sol)*(.35+.65*q))+')';c.fillRect(px,py,p.sz,p.sz)}
  c.globalCompositeOperation='source-over';
  if(asm<1){var sy=380*asm;c.fillStyle='rgba(46,230,166,.9)';c.fillRect(10,sy,280,2)}}
 c.restore()}
 if(!reduce||t<.1)requestAnimationFrame(frame)}
requestAnimationFrame(frame);
})();
