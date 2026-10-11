/* NM Academy v2 — prices, buy modal, language-aware videos, nav, reveals. Page works without JS. */
(function(){
'use strict';
var D=document,$=function(s){return D.querySelector(s)},$$=function(s){return[].slice.call(D.querySelectorAll(s))};
var CFG=window.CONFIG||{PLANS:{}},T=function(k,v){return window.I18N?I18N.t(k,v):k};
var nav=$('#nav');
var sen=D.getElementById('topsentinel');
if(sen&&'IntersectionObserver' in window){new IntersectionObserver(function(es){nav.classList.toggle('solid',!es[0].isIntersecting)}).observe(sen)}else{nav.classList.add('solid')}

function fmt(n){var cur=CFG.CURRENCY||'€';return (window.I18N&&I18N.lang==='en')?cur+n:n+' '+cur}
function money(){['a','b','pack','coach'].forEach(function(k){var p=CFG.PLANS&&CFG.PLANS[k];if(!p)return;
  $$('[data-price="'+k+'"]').forEach(function(b){b.textContent=fmt(p.price)});
  $$('[data-per="'+k+'"]').forEach(function(m){m.textContent=T(p.per==='mo'?'per_mo':'per_once')})});
 $$('[data-buy]').forEach(function(a){var l=CFG.LINKS&&CFG.LINKS[a.getAttribute('data-buy')];if(l){a.href=l;a.target='_blank';a.rel='noopener'}})}
var names={a:'pa_n',b:'pb_n',pack:'pk_n',coach:'pc_n'};
D.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-buy]');if(!a)return;var k=a.getAttribute('data-buy');if(CFG.LINKS&&CFG.LINKS[k])return;e.preventDefault();
 $('#mwa').href='https://wa.me/'+(CFG.WHATSAPP||'')+'?text='+encodeURIComponent(T('mo_msg',{p:T(names[k])}));$('#mem').textContent=CFG.EMAIL||'';$('#modal').hidden=false});
$('#mcl').onclick=function(){$('#modal').hidden=true};
$('#modal').addEventListener('click',function(e){if(e.target.id==='modal')e.target.hidden=true});
D.addEventListener('keydown',function(e){if(e.key==='Escape')$('#modal').hidden=true});

function setVideos(){var l=(window.I18N&&I18N.lang)||'fr';$$('video[data-vv]').forEach(function(v){var n=v.getAttribute('data-vv'),src='assets/video/'+n+'-'+l+'.mp4';
 if(v.getAttribute('data-cur')!==src){var was=!v.paused;v.setAttribute('data-cur',src);v.poster='assets/video/'+n+'-'+l+'.jpg';v.src=src;if(was){v.play().catch(function(){})}}})}
D.addEventListener('langchange',function(){money();setVideos()});
money();setVideos();

if('IntersectionObserver' in window){
 var vo=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)e.target.play().catch(function(){});else e.target.pause()})},{threshold:.6});
 $$('video[data-vv]').forEach(function(v){vo.observe(v)});
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
  var ro=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  D.documentElement.classList.add('js');$$('.rv').forEach(function(el){ro.observe(el)});
 }
}
})();
