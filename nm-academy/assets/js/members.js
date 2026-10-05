(function(){
'use strict';
var D=document,$=function(s,r){return(r||D).querySelector(s)};
Object.assign(I18N.D,{
 mm_k:['ACCÈS MEMBRES','MEMBERS ACCESS','สำหรับสมาชิก'],mm_t:['Espace membres','Members area','พื้นที่สมาชิก'],mm_s:['Entre le code reçu après ton inscription.','Enter the code you received after registering.','ใส่รหัสที่ได้รับหลังสมัคร'],
 mm_ph:['CODE','CODE','รหัส'],mm_go:['Entrer','Enter','เข้าสู่ระบบ'],mm_err:['Code incorrect','Wrong code','รหัสไม่ถูกต้อง'],
 mm_w:['Bienvenue dans NM Academy','Welcome to NM Academy','ยินดีต้อนรับสู่ NM Academy'],mm_ta:['Plan A · Sites web','Plan A · Websites','แผน A · เว็บไซต์'],mm_tb:['Plan B · Vidéo IA','Plan B · AI Video','แผน B · วิดีโอ AI'],mm_tk:['Kit : scripts & modèles','Kit: scripts & templates','ชุดเครื่องมือ'],
 mm_th:['Le contenu des cours est disponible en français et en anglais (affichage en anglais).','Course content is available in French and English (shown in English).','เนื้อหาคอร์สมีเป็นภาษาฝรั่งเศสและอังกฤษ (แสดงเป็นภาษาอังกฤษ)'],
 mm_done:['{n}/{m} leçons terminées','{n}/{m} lessons completed','เรียนแล้ว {n}/{m} บทเรียน'],mm_mark:['Terminé','Done','เสร็จแล้ว'],mm_copy:['Copier','Copy','คัดลอก'],mm_copied:['Copié ✓','Copied ✓','คัดลอกแล้ว ✓'],
 mm_dl:['Télécharger le gabarit de site','Download the starter site template','ดาวน์โหลดเทมเพลตเว็บไซต์เริ่มต้น'],mm_dld:['Gabarit HTML/CSS d\'une page pour commerce local, avec des {marqueurs} à remplacer.','One-page HTML/CSS template for a local business, with {placeholders} to replace.','เทมเพลต HTML/CSS หน้าเดียวสำหรับธุรกิจท้องถิ่น พร้อม {ตัวแทน} ให้แก้'],
 mm_mod:['Module','Module','โมดูล'],mm_kit:['Kit : scripts, modèles et prompts','Kit: scripts, templates and prompts','ชุดเครื่องมือ: สคริปต์ เทมเพลต และพรอมต์']});
var C=window.COURSE,view='a',done={};
try{done=JSON.parse(localStorage.getItem('nm_prog')||'{}')}catch(e){}
function li(){return I18N.lang==='fr'?0:1}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function allIds(){var r=[];['a','b'].forEach(function(k){C[k].modules.forEach(function(m,i){m.lessons.forEach(function(l,j){r.push(k+i+'-'+j)})})});return r}
function prog(){var ids=allIds(),n=ids.filter(function(i){return done[i]}).length;$('#ptxt').textContent=I18N.t('mm_done',{n:n,m:ids.length});$('#pbar').style.width=(n/ids.length*100)+'%'}
function render(){
 var h='',L=li(),v=$('#view');$('#thnote').hidden=I18N.lang!=='th';
 if(view==='kit'){
  h+='<div class="card dl"><div><h3>'+esc(I18N.t('mm_dl'))+'</h3><p>'+esc(I18N.t('mm_dld'))+'</p></div><a class="btn pri" href="kit/starter-site.html" download="starter-site.html">↓ starter-site.html</a></div><div class="kit">';
  C.kit.forEach(function(k,i){h+='<article class="card spot"><h3>'+esc(k.t[L])+'</h3><pre class="mono">'+esc(k.c[L])+'</pre><button class="btn ghost sm cp" data-i="'+i+'" type="button">'+esc(I18N.t('mm_copy'))+'</button></article>'});
  h+='</div>';
 }else{
  var P=C[view];h+='<h2 class="mt2">'+esc(P.name[L])+'</h2><div class="acc">';
  P.modules.forEach(function(m,i){h+='<details'+(i===0?' open':'')+'><summary><span class="mn mono">'+String(i+1).padStart(2,'0')+'</span><span>'+esc(m.t[L])+'</span></summary><div class="lessons">';
   m.lessons.forEach(function(l,j){var id=view+i+'-'+j;h+='<div class="lesson'+(done[id]?' ok':'')+'"><div><h4>'+esc(l.t[L])+'</h4><p>'+esc(l.d[L])+'</p></div><button class="mk" data-id="'+id+'" type="button" aria-pressed="'+(!!done[id])+'">'+esc(I18N.t('mm_mark'))+'</button></div>'});
   h+='</div></details>'});
  h+='</div>';
 }
 v.innerHTML=h;prog();
 [].forEach.call(v.querySelectorAll('.cp'),function(b){b.onclick=function(){var t=C.kit[+b.dataset.i].c[li()];(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).catch(function(){var ta=D.createElement('textarea');ta.value=t;D.body.appendChild(ta);ta.select();try{D.execCommand('copy')}catch(e){}ta.remove()});b.textContent=I18N.t('mm_copied');if(window.SFX)SFX.ok();setTimeout(function(){b.textContent=I18N.t('mm_copy')},1600)}});
 [].forEach.call(v.querySelectorAll('.mk'),function(b){b.onclick=function(){var id=b.dataset.id;done[id]=!done[id];try{localStorage.setItem('nm_prog',JSON.stringify(done))}catch(e){}b.parentNode.classList.toggle('ok',!!done[id]);b.setAttribute('aria-pressed',!!done[id]);prog();if(window.SFX)SFX.click()}});
 [].forEach.call(v.querySelectorAll('.spot'),function(c){c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')})});
}
[].forEach.call(D.querySelectorAll('.tab'),function(b){b.onclick=function(){view=b.dataset.v;[].forEach.call(D.querySelectorAll('.tab'),function(x){x.classList.toggle('on',x===b)});render();if(window.SFX)SFX.whoosh()}});
D.addEventListener('langchange',function(){if(!$('#content').hidden)render()});
function unlock(){$('#gate2').hidden=true;$('#content').hidden=false;render()}
try{if(localStorage.getItem('nm_member')==='1')D.addEventListener('DOMContentLoaded',unlock)}catch(e){}
$('#gf').onsubmit=function(e){e.preventDefault();var v=$('#code').value.trim().toUpperCase();if(v&&v===String(CONFIG.MEMBER_CODE||'').toUpperCase()){try{localStorage.setItem('nm_member','1')}catch(e){}if(window.SFX)SFX.ok();unlock()}else{$('#err').hidden=false;if(window.SFX)SFX.boot()}};
var sn=$('#snd');function rs(){var on=window.SFX&&SFX.on;sn.classList.toggle('on',!!on);sn.textContent=on?'SON ON':'SON OFF'}sn.onclick=function(){SFX.set(!SFX.on);rs()};rs();
})();
