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
 var A=(CFG.PLANS||{}).a,B=(CFG.PLANS||{}).b,sv=$('#save');if(sv&&A&&B&&pk){var d=A.price+B.price-pk.price;if(d>0){sv.hidden=false;sv.textContent=T('s_save',{s:eur(d)})}else sv.hidden=true}
 var yr=$('#yr');if(yr)yr.textContent=new Date().getFullYear();var sd=$('#stDays');if(sd){sd.textContent=DAYS;sd.setAttribute('data-count',DAYS)}
 var parts=[];if(CFG.STUDENTS>0)parts.push(T('s_students',{n:CFG.STUDENTS}));if(CFG.RATING)parts.push(T('s_rating',{r:CFG.RATING}));
 if(parts.length){var pt=$('#proofTxt');pt.removeAttribute('data-t');pt.textContent=parts.join(' · ')}
 var urg=$('#urg'),end=CFG.OFFER_END&&new Date(CFG.OFFER_END);
 if(end&&end>new Date()){urg.removeAttribute('data-t');urg.textContent=T('s_urg1',{date:end.toLocaleDateString(I18N.lang==='fr'?'fr-FR':I18N.lang==='th'?'th-TH':'en-GB',{day:'numeric',month:'long'})})}
}
/* témoignages : vrais (config.js) ou emplacements explicites */
function esc(s){return String(s||'').replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function renderProof(){var box=$('#temoins'),real=CFG.TESTIMONIALS||[],l=I18N.lang,h='';var sec=$('#preuves');if(sec)sec.hidden=!real.length&&!CFG.SHOW_PLACEHOLDERS;
 if(real.length){real.slice(0,4).forEach(function(x){var tx=(x.text&&(x.text[l]||x.text.fr||x.text.en))||'';h+='<article class="card tilt rv in">'+(x.result?'<em class="k">'+esc(x.result)+'</em>':'')+'<q>'+esc(tx)+'</q><cite>'+esc(x.name)+(x.role?' · '+esc(x.role):'')+'</cite></article>'})}
 else{for(var i=1;i<=4;i++)h+='<article class="card ph tilt rv in"><em class="k">'+esc(T('s_ph_k'))+'</em><q>'+esc(T('s_ph',{n:i}))+'</q><cite>'+esc(T('s_ph_n'))+'</cite></article>'}
 box.innerHTML=h;bindTilt()}

/* ---------- titre : mots qui se révèlent (sauf thaï, sans espaces) ---------- */
function splitH1(){var h=$('#h1');if(!h)return;h.classList.remove('go','fade');
 if(reduce)return;
 if(I18N.lang==='th'||!HAS_IO){h.classList.add('fade');requestAnimationFrame(function(){requestAnimationFrame(function(){h.classList.add('go')})});return}
 var toks=[],i=0,gap=false;
 [].forEach.call(h.childNodes,function(n){var hl=n.nodeType===1&&n.classList.contains('hl'),txt=n.textContent,parts=txt.split(/\s+/).filter(Boolean);
  parts.forEach(function(w,k){var sp=k===0?(toks.length===0?false:(gap||/^\s/.test(txt))):true;toks.push({w:w,hl:hl,sp:sp,d:i++*55})});
  if(parts.length)gap=/\s$/.test(txt)});
 var out=toks.map(function(t){return(t.sp?' ':'')+'<span class="w"><span class="wi'+(t.hl?' hl':'')+'" style="transition-delay:'+t.d+'ms">'+esc(t.w)+'</span></span>'});
 h.innerHTML=out.join('');

 requestAnimationFrame(function(){requestAnimationFrame(function(){h.classList.add('go')})})}

/* ---------- vitrine : ordinateur + téléphone, vrais sites thaïlandais en vidéo (une scène à la fois) ---------- */
function blobSrc(v){if(v.dataset.ready||v.dataset.busy)return;v.dataset.busy='1';var src=v.dataset.src;
 fetch(src).then(function(r){if(!r.ok)throw 0;return r.blob()}).then(function(b){v.src=URL.createObjectURL(b);v.dataset.ready='1';v.load()}).catch(function(){v.src=src;v.dataset.ready='1';v.load()})}
(function(){var st=$('#stage');if(!st)return;
 var lap=$$('.lscreen video.sc',st),pho=$$('.pscreen video.sc',st),cap=$('#cap'),LAB=[['Malee','pf_m_t'],['ÔBlanc','pf_o_t'],['One Love','pf_l_t']],cur=0,timer=null,visible=true,DUR=12600;
 function setCap(i){cap.innerHTML='<b>'+LAB[i][0]+'</b> · '+esc(T(LAB[i][1]))}
 function scene(i){cur=i;setCap(i);[lap,pho].forEach(function(set){set.forEach(function(v,k){v.classList.toggle('on',k===i);if(k!==i)v.pause()})});
  var nxt=(i+1)%lap.length;lap[nxt]&&blobSrc(lap[nxt]);pho[nxt]&&blobSrc(pho[nxt]);
  [lap[i],pho[i]].forEach(function(v){blobSrc(v);try{v.currentTime=0}catch(e){}var go=function(){if(visible&&!reduce)v.play().catch(function(){})};if(v.readyState>=2)go();else v.addEventListener('canplay',go,{once:true})})}
 function loop(){clearInterval(timer);if(reduce)return;timer=setInterval(function(){if(visible)scene((cur+1)%lap.length)},DUR)}
 scene(0);loop();
 if(HAS_IO)new IntersectionObserver(function(es){visible=es[0].isIntersecting;var vs=[lap[cur],pho[cur]];if(visible){vs.forEach(function(v){v.play().catch(function(){})})}else vs.forEach(function(v){v.pause()})},{threshold:.15}).observe(st);
 if(fine&&!reduce){st.style.transition='transform .8s cubic-bezier(.32,.72,0,1)';st.addEventListener('pointermove',function(e){var r=st.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;st.style.transform='perspective(1400px) rotateY('+(x*5).toFixed(2)+'deg) rotateX('+(-y*4).toFixed(2)+'deg)'});st.addEventListener('pointerleave',function(){st.style.transform=''})}
 D.addEventListener('langchange',function(){setCap(cur)});
})();

/* ---------- réalisations : vidéos qui jouent quand la carte est visible ; le démo s'ouvre en thaï ---------- */
(function(){var cards=$$('.pcard');if(!cards.length)return;
 var vids=$$('.pcard video');
 if(HAS_IO&&!reduce){
  var near=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)blobSrc(e.target)})},{rootMargin:'400px 0px'});
  var play=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.isIntersecting&&v.dataset.ready)v.play().catch(function(){});else v.pause()})},{threshold:.4});
  vids.forEach(function(v){near.observe(v);play.observe(v);v.addEventListener('loadeddata',function(){var r=v.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)v.play().catch(function(){})})})}
 cards.forEach(function(c){c.addEventListener('click',function(){try{localStorage.setItem('mlLang','th');localStorage.setItem('obLang','th')}catch(e){}})})})();

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

/* ---------- vidéos de démonstration ----------
   Le fichier est téléchargé en entier (blob) quand la section approche : lecture fiable sur iPhone / webview,
   même si le serveur ne gère pas les requêtes partielles (Range). Repli : lien direct vers la vidéo. */
function srcOf(v){return'assets/video/'+v.getAttribute('data-vv')+'-'+I18N.lang+'.mp4'}
function fetchVideo(v){var src=srcOf(v);if(v.dataset.loaded===src)return;v.dataset.loaded=src;
 fetch(src).then(function(r){if(!r.ok)throw 0;return r.blob()}).then(function(b){if(v.dataset.cur!==src)return;v.src=URL.createObjectURL(b);v.load();if(v.dataset.vis==='1')v.play().catch(function(){})})
 .catch(function(){if(v.dataset.cur!==src)return;v.src=src;v.load();if(v.dataset.vis==='1')v.play().catch(function(){})})}
function setVideos(){$$('video[data-vv]').forEach(function(v){var src=srcOf(v);if(v.dataset.cur===src)return;v.dataset.cur=src;v.dataset.loaded='';v.poster=src.replace('.mp4','.jpg');v.removeAttribute('src');v.load();
 var a=v.parentElement.querySelector('.vopen');if(a){a.href=src;a.hidden=true}if(v.dataset.near==='1')fetchVideo(v)})}
$$('video[data-vv]').forEach(function(v){v.setAttribute('webkit-playsinline','');v.addEventListener('error',function(){var a=v.parentElement.querySelector('.vopen');if(a&&v.getAttribute('src'))a.hidden=false})});
if(HAS_IO){
 var near=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.dataset.near='1';fetchVideo(e.target)}})},{rootMargin:'500px 0px'});
 var vo=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;v.dataset.vis=e.isIntersecting?'1':'0';if(e.isIntersecting){if(v.getAttribute('src'))v.play().catch(function(){})}else v.pause()})},{threshold:.6});
 $$('video[data-vv]').forEach(function(v){near.observe(v);vo.observe(v)})}else{$$('video[data-vv]').forEach(function(v){v.dataset.near='1';fetchVideo(v)})}

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

/* ---------- finitions : progression, chiffres qui comptent, bouton magnétique, données structurées ---------- */
(function(){
 var pg=$('#prog'),tk=false;
 if(pg)addEventListener('scroll',function(){if(tk)return;tk=true;requestAnimationFrame(function(){tk=false;var h=D.documentElement;pg.style.transform='scaleX('+Math.min(1,scrollY/Math.max(1,h.scrollHeight-innerHeight)).toFixed(4)+')'})},{passive:true});
 /* chiffres : comptent une fois, quand ils apparaissent */
 var bs=$$('.statband b');
 function count(b){var to=+b.getAttribute('data-count'),t0=null;if(reduce){b.textContent=to;return}b.textContent='0';(function st(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/1300);b.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(st)})(performance.now())}
 if(HAS_IO&&bs.length){var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){count(e.target);cio.unobserve(e.target)}})},{threshold:.6});bs.forEach(function(b){cio.observe(b)})}
 /* bouton magnétique (souris uniquement) */
 if(fine&&!reduce)$$('.cta').forEach(function(b){b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.08).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*.16).toFixed(1)+'px)'});b.addEventListener('pointerleave',function(){b.style.transform=''})});
 /* données structurées pour Google (prix lus dans config.js) */
 try{var P=CFG.PLANS||{},mk=function(n,d,k){return{'@type':'Course','name':n,'description':d,'provider':{'@type':'Organization','name':CFG.BRAND||'NM Academy'},'offers':{'@type':'Offer','price':String(P[k].price),'priceCurrency':'EUR','availability':'https://schema.org/InStock'}}};
  var s=D.createElement('script');s.type='application/ld+json';s.textContent=JSON.stringify({'@context':'https://schema.org','@graph':[mk('Sites web : créer et vendre','Créer des sites web professionnels pour des commerces et les vendre.','a'),mk('Vidéos IA','Créer des vidéos IA et les monétiser.','b')]});D.head.appendChild(s)}catch(e){}
 /* garde-fou : bouton sans lien de paiement ni vrai numéro WhatsApp */
 if(!(CFG.LINKS&&CFG.LINKS.pack)&&(!CFG.WHATSAPP||/^33600000000$/.test(CFG.WHATSAPP)))try{console.warn('[NM Academy] Renseigne LINKS.pack (paiement) ou un vrai WHATSAPP dans assets/js/config.js : les boutons « Je m\'inscris » n\'ont pas encore de destination réelle.')}catch(e){}
})();

/* ---------- init + changement de langue ---------- */
function all(){render();renderProof();snd();setVideos();splitH1()}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',all);else all();
D.addEventListener('langchange',function(){all()});
})();
