/* Démo : maquette de site en direct (niche + nom + couleur + thème) */
(function(){
var D=document,$=function(s){return D.querySelector(s)};if(!$('#dn'))return;
var N={rest:['dr_s','dr_1','dr_2','dr_3','dr_c'],hair:['dh_s','dh_1','dh_2','dh_3','dh_c'],plumb:['dp_s','dp_1','dp_2','dp_3','dp_c'],coach:['dc_s','dc_1','dc_2','dc_3','dc_c']};
function slug(s){return(s||'site').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'site'}
function up(){var k=$('#dn').value,n=($('#dnm').value||'').trim()||'—',a=N[k],T=function(x){return I18N.t(x)};
 $('#mname').textContent=n;$('#mh').textContent=n;$('#mp').textContent=T(a[0]);$('#ms1').textContent=T(a[1]);$('#ms2').textContent=T(a[2]);$('#ms3').textContent=T(a[3]);$('#mcta').textContent=T(a[4]);$('#mcta2').textContent=T(a[4]);$('#durl').textContent=slug(n)+'.com'}
$('#dn').onchange=function(){up();if(window.SFX)SFX.click()};
$('#dnm').oninput=function(){up();if(window.SFX)SFX.key()};
[].forEach.call(D.querySelectorAll('#dsw button'),function(b){b.onclick=function(){$('#ms').style.setProperty('--ac',b.dataset.c);if(window.SFX)SFX.click()}});
[].forEach.call(D.querySelectorAll('#dth button'),function(b){b.onclick=function(){$('#ms').dataset.th=b.dataset.th;[].forEach.call(D.querySelectorAll('#dth button'),function(x){x.classList.toggle('on',x===b)});if(window.SFX)SFX.click()}});
D.addEventListener('langchange',up);D.addEventListener('DOMContentLoaded',function(){setTimeout(up,0)});up();
})();
