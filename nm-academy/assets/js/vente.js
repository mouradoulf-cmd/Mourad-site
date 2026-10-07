/* NM Academy — page de vente unifiée. Tout est optionnel : sans JS la page reste complète et lisible. */
(function(){
'use strict';
var D=document,$=function(s,r){return(r||D).querySelector(s)},$$=function(s,r){return[].slice.call((r||D).querySelectorAll(s))};
var CFG=window.CONFIG||{PLANS:{},LINKS:{}},T=function(k,v){return window.I18N?I18N.t(k,v):k};
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
var HAS_IO='IntersectionObserver' in window;
function sfx(n){try{window.SFX&&SFX[n]()}catch(e){}}
D.documentElement.classList.add('js');
var DAYS=CFG.REFUND_DAYS||14;

/* ---------- prix, liens d'achat, textes pilotés par config.js ---------- */
function eur(n){var s=(Math.round(n*100)/100).toLocaleString(I18N.lang==='fr'?'fr-FR':'en-US',{minimumFractionDigits:n%1?2:0,maximumFractionDigits:2}),c=CFG.CURRENCY||'€';return I18N.lang==='en'?c+s:s+' '+c}
var NAMES={a:'pa_n',b:'pb_n',pack:'pk_n',coach:'pc_n'};
function render(){
 ['a','b','pack','coach'].forEach(function(k){var p=(CFG.PLANS||{})[k];if(!p)return;
  var b=$('[data-price="'+k+'"]'),m=$('[data-per="'+k+'"]');if(b)b.textContent=eur(p.price);
  if(m)m.textContent=T(k==='pack'?'s_o_life':(p.per==='mo'?'per_mo':'per_once'))});
 $$('[data-buy]').forEach(function(a){var k=a.getAttribute('data-buy'),l=CFG.LINKS&&CFG.LINKS[k];
  a.href=l||('https://wa.me/'+(CFG.WHATSAPP||'')+'?text='+encodeURIComponent(T('mo_msg',{p:T(NAMES[k])})))});
 var wa=$('#wa');if(wa)wa.href='https://wa.me/'+(CFG.WHATSAPP||'')+'?text='+encodeURIComponent(T('wa_msg'));
 var n=CFG.INSTALLMENTS,pk=(CFG.PLANS||{}).pack,ins=$('#instal');
 if(ins)ins.textContent=(n>1&&pk)?T('s_o_instal',{n:n,a:eur(pk.price/n)}):'';
 var parts=[];if(CFG.STUDENTS>0)parts.push(T('s_students',{n:CFG.STUDENTS}));if(CFG.RATING)parts.push(T('s_rating',{r:CFG.RATING}));
 if(parts.length){var pt=$('#proofTxt');pt.removeAttribute('data-t');pt.textContent=parts.join(' · ')}
 var urg=$('#urg'),end=CFG.OFFER_END&&new Date(CFG.OFFER_END);
 if(end&&end>new Date()){urg.removeAttribute('data-t');urg.textContent=T('s_urg1',{date:end.toLocaleDateString(I18N.lang==='fr'?'fr-FR':I18N.lang==='th'?'th-TH':'en-GB',{day:'numeric',month:'long'})})}
}
/* témoignages : vrais (config.js) ou emplacements explicites */
function esc(s){return String(s||'').replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function renderProof(){var box=$('#temoins'),real=CFG.TESTIMONIALS||[],l=I18N.lang,h='';
 if(real.length){real.slice(0,4).forEach(function(x){var tx=(x.text&&(x.text[l]||x.text.fr||x.text.en))||'';h+='<article class="card tilt rv in">'+(x.result?'<em class="k">'+esc(x.result)+'</em>':'')+'<q>'+esc(tx)+'</q><cite>'+esc(x.name)+(x.role?' · '+esc(x.role):'')+'</cite></article>'})}
 else{for(var i=1;i<=4;i++)h+='<article class="card ph tilt rv in"><em class="k">'+esc(T('s_ph_k'))+'</em><q>'+esc(T('s_ph',{n:i}))+'</q><cite>'+esc(T('s_ph_n'))+'</cite></article>'}
 box.innerHTML=h;bindTilt()}

/* ---------- titre : mots qui se révèlent (sauf thaï, sans espaces) ---------- */
function splitH1(){var h=$('#h1');if(!h)return;h.classList.remove('go','fade');
 if(reduce)return;
 if(I18N.lang==='th'||!HAS_IO){h.classList.add('fade');requestAnimationFrame(function(){requestAnimationFrame(function(){h.classList.add('go')})});return}
 var out=[],i=0;
 [].forEach.call(h.childNodes,function(n){var hl=n.nodeType===1&&n.classList.contains('hl'),txt=n.textContent;
  txt.split(/\s+/).filter(Boolean).forEach(function(w){out.push('<span class="w"><span class="wi'+(hl?' hl':'')+'" style="transition-delay:'+(i++*55)+'ms">'+esc(w)+'</span></span>')})});
 h.innerHTML=out.join(' ');
 requestAnimationFrame(function(){requestAnimationFrame(function(){h.classList.add('go')})})}

/* ---------- vitrine : ordinateur + téléphone, 2 vrais sites thaïlandais qui défilent lentement ---------- */
(function(){var st=$('#stage');if(!st)return;
 var lap=$$('.lscreen .sc',st),pho=$$('.pscreen .sc',st),cap=$('#cap'),LAB=[['Giulivo','rl_rest'],['One Love','rl_bar']],cur=0,anims=[],timer=null,visible=true,SCROLL=13000,HOLD=2200;
 function setCap(i){cap.innerHTML='<b>'+LAB[i][0]+'</b> · '+esc(T(LAB[i][1]))}
 function run(img,box,delay){var dist=img.offsetHeight-box.offsetHeight;if(dist<=0)return null;
  img.style.transform='translateY(0)';
  return img.animate([{transform:'translateY(0)',offset:0},{transform:'translateY(0)',offset:.06},{transform:'translateY(-'+dist+'px)',offset:1}],{duration:SCROLL,delay:delay||0,easing:'cubic-bezier(.45,.05,.4,.95)',fill:'forwards'})}
 function show(i){anims.forEach(function(a){a&&a.cancel()});anims=[];cur=i;setCap(i);
  lap.concat(pho).forEach(function(im,k){im.classList.toggle('on',(k%2)===i)});
  if(reduce)return;
  var l=lap[i],p=pho[i];
  [l,p].forEach(function(im){if(im.complete||im.naturalWidth)go(im);else im.addEventListener('load',function(){go(im)},{once:true})});
  function go(im){var box=im.parentElement;var a=run(im,box,im===p?500:0);a&&anims.push(a)}}
 function loop(){clearInterval(timer);if(reduce||!visible)return;timer=setInterval(function(){show((cur+1)%2)},SCROLL+HOLD+1200)}
 show(0);loop();
 if(HAS_IO)new IntersectionObserver(function(es){visible=es[0].isIntersecting;if(visible){anims.forEach(function(a){a&&a.play()});loop()}else{clearInterval(timer);anims.forEach(function(a){a&&a.pause()})}},{threshold:.15}).observe(st);
 /* légère parallaxe à la souris (rien sur mobile) */
 if(fine&&!reduce){st.style.transition='transform .8s cubic-bezier(.32,.72,0,1)';st.addEventListener('pointermove',function(e){var r=st.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;st.style.transform='perspective(1400px) rotateY('+(x*5).toFixed(2)+'deg) rotateX('+(-y*4).toFixed(2)+'deg)'});st.addEventListener('pointerleave',function(){st.style.transform=''})}
 D.addEventListener('langchange',function(){setCap(cur)});
})();

/* ---------- inclinaison très légère des cartes (souris uniquement) ---------- */
var tiltBound=new WeakSet();
function bindTilt(){if(!fine||reduce)return;$$('.tilt').forEach(function(c){if(tiltBound.has(c))return;tiltBound.add(c);
 c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform='perspective(900px) rotateX('+(-y*4).toFixed(2)+'deg) rotateY('+(x*5).toFixed(2)+'deg)'});
 c.addEventListener('pointerleave',function(){c.style.transform=''})})}
/* halo qui suit le curseur sur les cartes du kit */
if(fine)$$('.bc').forEach(function(c){c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')})});

/* ---------- apparitions au scroll (le masquage ne s'active que si l'observateur existe) ---------- */
if(HAS_IO&&!reduce){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -5% 0px'});$$('.rv:not(.in)').forEach(function(el){io.observe(el)})}
else $$('.rv').forEach(function(el){el.classList.add('in')});

/* ---------- programme : la ligne se remplit, les étapes s'allument ---------- */
(function(){var st=$('#steps');if(!st)return;var lis=$$('li',st),tk=false;
 function upd(){tk=false;var r=st.getBoundingClientRect(),vh=innerHeight,p=Math.min(1,Math.max(0,(vh*.6-r.top)/r.height));st.style.setProperty('--p',p.toFixed(3));
  lis.forEach(function(li){var t=li.getBoundingClientRect().top;li.classList.toggle('on',t<vh*.62)})}
 if(reduce){st.style.setProperty('--p',1);lis.forEach(function(l){l.classList.add('on')});return}
 addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});addEventListener('resize',upd);upd()})();

/* ---------- barre fine + barre d'action mobile ---------- */
var topb=$('#top-bar'),bar=$('#bar'),fin=$('#final'),past=false,onFinal=false;
function sb(){bar.classList.toggle('show',past&&!onFinal)}
addEventListener('scroll',function(){topb.classList.toggle('scrolled',scrollY>innerHeight*.55)},{passive:true});
if(HAS_IO){
 new IntersectionObserver(function(es){past=!es[0].isIntersecting&&es[0].boundingClientRect.top<0;sb()}).observe(hero);
 new IntersectionObserver(function(es){onFinal=es[0].isIntersecting;sb()},{threshold:.3}).observe(fin)}

/* ---------- vidéos de démonstration : fichier selon la langue, lecture quand visible ---------- */
function setVideos(){var l=I18N.lang;$$('video[data-vv]').forEach(function(v){var n=v.getAttribute('data-vv'),src='assets/video/'+n+'-'+l+'.mp4';if(v.getAttribute('data-cur')!==src){var was=!v.paused;v.setAttribute('data-cur',src);v.poster='assets/video/'+n+'-'+l+'.jpg';v.preload='none';v.src=src;if(was){v.load();v.play().catch(function(){})}}})}
if(HAS_IO){var vo=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)e.target.play().catch(function(){});else e.target.pause()})},{threshold:.6});$$('video[data-vv]').forEach(function(v){vo.observe(v)})}

/* ---------- son (discret, activé par défaut, coupable) ---------- */
function snd(){var b=$('#snd'),on=window.SFX&&SFX.on;b.classList.toggle('on',!!on);b.textContent=T(on?'snd_on':'snd_off')}
$('#snd').onclick=function(){if(window.SFX){SFX.set(!SFX.on);snd()}};
D.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('.cta,.btn2,summary');if(t)sfx('click')});

/* ---------- cadeau gratuit ---------- */
(function(){var f=$('#lead');if(!f)return;f.addEventListener('submit',function(e){e.preventDefault();var em=$('#lem').value.trim();if(!em)return;
 function done(){f.hidden=true;$('#lok').hidden=false;sfx('ok');track('Lead')}
 if(CFG.FORM_ENDPOINT){var fd=new FormData();fd.append('email',em);fd.append('source','nm-academy-gift');fetch(CFG.FORM_ENDPOINT,{method:'POST',body:fd,headers:{Accept:'application/json'}}).catch(function(){}).then(done)}else done()})})();

/* ---------- analytics facultatif ---------- */
(function(){if(CFG.GA_ID){var g=D.createElement('script');g.async=1;g.src='https://www.googletagmanager.com/gtag/js?id='+CFG.GA_ID;D.head.appendChild(g);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',CFG.GA_ID)}
 if(CFG.PIXEL_ID){!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,D,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',CFG.PIXEL_ID);fbq('track','PageView')}})();
function track(n,d){try{window.fbq&&fbq('track',n,d);window.gtag&&gtag('event',n,d)}catch(e){}}
D.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-buy]');if(a)track('InitiateCheckout',{plan:a.getAttribute('data-buy')})});

/* ---------- init + changement de langue ---------- */
function all(){render();renderProof();snd();setVideos();splitH1()}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',all);else all();
D.addEventListener('langchange',function(){all()});
})();
