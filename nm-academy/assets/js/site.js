/* NM Academy — comportement commun des pages du site : navigation, pied de page, prix, liens d'achat, langue, vidéos, contact, inscription. */
(function(){
var D=document,CFG=window.CONFIG||{},$=function(s,r){return(r||D).querySelector(s)},$$=function(s,r){return[].slice.call((r||D).querySelectorAll(s))};
D.documentElement.classList.add('js');
var T=function(k,v){return I18N.t(k,v)};
var PAGES=[['vente.html','x_home'],['formations.html','x_courses'],['realisations.html','x_work'],['tarifs.html','x_price'],['contact.html','x_contact']];
var NAMES={a:'pa_n',b:'pb_n',pack:'pk_n',coach:'pc_n'};
function eur(n){var s=(Math.round(n*100)/100).toLocaleString(I18N.lang==='fr'?'fr-FR':'en-US',{minimumFractionDigits:n%1?2:0,maximumFractionDigits:2}),c=CFG.CURRENCY||'€';return I18N.lang==='en'?c+s:s+' '+c}
function wa(text){return'https://wa.me/'+(CFG.WHATSAPP||'')+'?text='+encodeURIComponent(text)}

/* --- barre de navigation (desktop : liens ; mobile : menu) --- */
function nav(){
 var top=$('.top');if(!top||$('.nl',top))return;
 var here=(location.pathname.split('/').pop()||'vente.html');
 var links=PAGES.map(function(p){return'<a href="'+p[0]+'"'+(p[0]===here?' class="on" aria-current="page"':'')+' data-t="'+p[1]+'"></a>'}).join('');
 var brand=$('.brand',top);
 if(brand&&brand.tagName!=='A'){var a=D.createElement('a');a.className='brand';a.href='vente.html';a.innerHTML=brand.innerHTML;brand.replaceWith(a);brand=a}
 var n=D.createElement('nav');n.className='nl';n.setAttribute('aria-label','Navigation');n.innerHTML=links;
 brand.after(n);
 var tr=$('.tr',top),b=D.createElement('button');b.className='burger';b.type='button';b.setAttribute('aria-label','Menu');b.setAttribute('aria-expanded','false');b.innerHTML='<i></i><i></i>';tr.appendChild(b);
 var dr=D.createElement('div');dr.className='drawer';dr.id='drawer';dr.innerHTML='<nav>'+links+'</nav><a class="cta" data-buy="pack" href="paiement.html?plan=pack"><span data-t="x_join"></span><i aria-hidden="true">→</i></a>';
 D.body.appendChild(dr);
 b.addEventListener('click',function(){var o=!D.body.classList.contains('menu');D.body.classList.toggle('menu',o);b.setAttribute('aria-expanded',o)});
 dr.addEventListener('click',function(e){if(e.target.closest('a'))D.body.classList.remove('menu')});
 D.addEventListener('keydown',function(e){if(e.key==='Escape')D.body.classList.remove('menu')});
 var cta=$('.cta.mini',top);if(!cta){cta=D.createElement('a');cta.className='cta mini show';cta.setAttribute('data-buy','pack');cta.href='paiement.html?plan=pack';cta.innerHTML='<span data-t="x_join"></span>';tr.insertBefore(cta,$('.lang',tr)?$('.lang',tr).nextSibling:b)}
 cta.removeAttribute('target');cta.removeAttribute('rel');
 if(!$('#top-bar'))top.classList.add('scrolled');
}
/* --- pied de page --- */
function foot(){
 var f=$('#sfoot');if(!f)return;
 f.className='sfoot';
 f.innerHTML='<div class="wrap wide fg"><div><a class="brand big" href="vente.html">NM <b>Academy</b></a><p data-t="x_f_tag"></p></div>'+
 '<div><h4 data-t="x_f_nav"></h4>'+PAGES.map(function(p){return'<a href="'+p[0]+'" data-t="'+p[1]+'"></a>'}).join('')+'</div>'+
 '<div><h4 data-t="x_f_more"></h4><a href="paiement.html?plan=pack" data-t="x_join"></a><a href="legal.html" data-t="foot_legal"></a><a href="members.html" data-t="s_mem"></a><a href="langues.html" data-t="x_lang"></a></div></div>'+
 '<div class="wrap wide fine"><p data-t="foot_disc"></p><p>© '+new Date().getFullYear()+' NM Academy</p></div>';
}
/* --- prix + liens d'achat : un vrai lien de paiement s'il existe, sinon la vraie page d'inscription --- */
function prices(){
 ['a','b','pack','coach'].forEach(function(k){var p=(CFG.PLANS||{})[k];if(!p)return;
  $$('[data-price="'+k+'"]').forEach(function(b){b.textContent=eur(p.price)});
  $$('[data-per="'+k+'"]').forEach(function(m){m.textContent=T(k==='pack'?'s_o_life':'per_once')})});
 $$('[data-buy]').forEach(function(a){var k=a.getAttribute('data-buy');a.href='paiement.html?plan='+k;a.removeAttribute('target');a.removeAttribute('rel')});
 var sv=$('#save'),A=(CFG.PLANS||{}).a,B=(CFG.PLANS||{}).b,P=(CFG.PLANS||{}).pack;
 if(sv&&A&&B&&P){var d=A.price+B.price-P.price;if(d>0){sv.hidden=false;sv.textContent=T('s_save',{s:eur(d)})}else sv.hidden=true}
 var w=$('#wa');if(w)w.href=wa(T('wa_msg'));
}
/* --- la langue suit le visiteur d'une page à l'autre --- */
D.addEventListener('click',function(e){
 var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;
 var h=a.getAttribute('href');if(!h||/^(https?:|mailto:|tel:|#|javascript:)/.test(h)||!/\.html/.test(h)||/[?&]lang=/.test(h))return;
 a.setAttribute('href',h+(h.indexOf('?')>-1?'&':'?')+'lang='+I18N.lang);
},true);
/* --- apparitions au défilement --- */
function reveal(){
 var els=$$('.rv');if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});return}
 var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
 els.forEach(function(e){io.observe(e)});
 setTimeout(function(){els.forEach(function(e){e.classList.add('in')})},4000);
}
/* --- vidéos : chargées seulement quand visibles, via blob (fiable sur iPhone) --- */
function videos(){
 var vs=$$('video[data-src]');if(!vs.length)return;
 function load(v){if(v._l)return;v._l=1;var s=v.getAttribute('data-src');
  fetch(s).then(function(r){return r.blob()}).then(function(b){v.src=URL.createObjectURL(b);v.play().catch(function(){})}).catch(function(){v.src=s;v.play().catch(function(){})})}
 if(!('IntersectionObserver' in window)){vs.forEach(load);return}
 var io=new IntersectionObserver(function(es){es.forEach(function(x){var v=x.target;if(x.isIntersecting){load(v);if(v.src)v.play().catch(function(){})}else v.pause()})},{threshold:.25});
 vs.forEach(function(v){io.observe(v)});
}
function vsrc(){$$('video[data-vv]').forEach(function(v){var s='assets/video/'+v.getAttribute('data-vv')+'-'+I18N.lang;v.poster=s+'.jpg';v.setAttribute('data-src',s+'.mp4');if(v._l){v._l=0;v.removeAttribute('src');}})}
/* --- les démos s'ouvrent dans la bonne langue --- */
function demos(){D.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-site]');if(!a)return;try{['mlLang','obLang','ntLang','giulivoLang'].forEach(function(k){localStorage.setItem(k,'th')})}catch(_){}})}
/* --- message type à copier --- */
function copy(){var b=$('#copyMsg');if(!b)return;b.addEventListener('click',function(){var t=[$('#bub1'),$('#bub3')].map(function(x){return x.textContent}).join('\n\n');(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).catch(function(){var r=D.createElement('textarea');r.value=t;D.body.appendChild(r);r.select();try{D.execCommand('copy')}catch(_){}r.remove()});var o=b.textContent;b.textContent='✓';setTimeout(function(){b.textContent=T('pt_copy')},1500)})}
/* --- contact --- */
function contact(){
 var f=$('#cform');if(!f)return;
 var e=$('#cmail');if(e)e.href='mailto:'+(CFG.EMAIL||'')+'?subject='+encodeURIComponent('NM Academy');
 var w=$('#cwa');if(w)w.href=wa(T('wa_msg'));
 f.addEventListener('submit',function(ev){ev.preventDefault();
  var n=($('#cn').value||'').trim()||'—',sel=$('#ct'),t=sel.options[sel.selectedIndex].text,m=($('#cm').value||'').trim();
  window.open(wa(T('x_ct_hi',{n:n,t:t})+(m?'\n\n'+m:'')),'_blank','noopener')});
}
/* --- inscription (paiement bientôt) --- */
function pay(){
 var box=$('#plans');if(!box)return;
 var q=(location.search.match(/[?&]plan=(a|b|pack|coach)/)||[])[1]||'pack',cur=q;
 function draw(){
  var P=CFG.PLANS||{};
  $$('.pl',box).forEach(function(l){var k=l.getAttribute('data-k');l.classList.toggle('on',k===cur);$('input',l).checked=k===cur;$('.pp',l).textContent=eur((P[k]||{}).price||0)});
  var p=P[cur]||{price:0};$('#tot').textContent=eur(p.price);$('#totn').textContent=T(NAMES[cur]);
  var link=CFG.LINKS&&CFG.LINKS[cur],btn=$('#paybtn'),soon=$('#soon');
  if(link){btn.querySelector('span').setAttribute('data-t','x_pay_go');soon.hidden=true}else{btn.querySelector('span').setAttribute('data-t','x_pay_reserve');soon.hidden=false}
  btn.querySelector('span').textContent=T(link?'x_pay_go':'x_pay_reserve');
 }
 $$('.pl',box).forEach(function(l){l.addEventListener('click',function(){cur=l.getAttribute('data-k');draw()})});
 D.addEventListener('langchange',draw);draw();
 $('#payf').addEventListener('submit',function(ev){ev.preventDefault();
  var n=($('#pn').value||'').trim(),m=($('#pm').value||'').trim(),er=$('#perr');
  if(!n){er.textContent=T('x_pay_need');$('#pn').focus();return}er.textContent='';
  var link=CFG.LINKS&&CFG.LINKS[cur];
  if(link){location.href=link;return}
  var p=(CFG.PLANS||{})[cur]||{price:0};
  window.open(wa(T('x_pay_msg',{n:n,e:m||'—',p:T(NAMES[cur]),a:eur(p.price)})),'_blank','noopener')});
}
function all(){prices();vsrc();videos();pay();}
D.addEventListener('DOMContentLoaded',function(){
 nav();foot();I18N.apply();prices();reveal();vsrc();videos();demos();copy();contact();pay();
 var yr=$('#yr');if(yr)yr.textContent=new Date().getFullYear();
});
D.addEventListener('langchange',function(){prices();vsrc();videos()});
})();
