/* =====================================================================
   ตั้งค่าธุรกิจของคุณ — แก้เฉพาะบล็อกนี้ แล้วเว็บทั้งหมดจะอัปเดตเอง
   ===================================================================== */
const CONFIG={
  BRAND:"AI Skill",
  LINE_OA:"@yourlineoa",          // LINE Official Account (ใส่ @ นำหน้า)
  PROMPTPAY:"0812345678",         // เบอร์พร้อมเพย์ 10 หลัก หรือเลขบัตร ปชช. 13 หลัก
  ACCOUNT_NAME:"ชื่อบัญชีของคุณ",
  // ลิงก์ชำระด้วยบัตร (Stripe > Payment Links) — เว้นว่างถ้ายังไม่มี
  STRIPE:{p1:"",p2:"",p3:"",all:""},
  FORM_ENDPOINT:"",               // ฟอร์มเก็บอีเมล (formspree.io) — เว้นว่างได้
  PIXEL_ID:"",GA_ID:"",
  // รหัสเข้าห้องเรียน (ส่งให้ลูกค้าหลังได้รับสลิป) — เปลี่ยนได้ทุกเมื่อ
  CODES:{p1:"AISKILL-BASIC",p2:"AISKILL-WEB",p3:"AISKILL-VIDEO",all:"AISKILL-ALL"},
  // --- versions FR / EN (prix en euros, paiement par lien Stripe/PayPal ou WhatsApp) ---
  WHATSAPP:"33600000000",         // numéro international sans + (ex: 33612345678)
  EMAIL:"contact@example.com",
  PAY:{p1:"",p2:"",p3:"",all:""}, // liens Stripe/PayPal pour FR/EN — vide = bouton WhatsApp
  EUR:{p1:19,p2:39,p3:29,all:69},
  PLANS:{
    p1 :{name:"แพ็ก 1 · เริ่มใช้ AI",price:590},
    p2 :{name:"แพ็ก 2 · ทำเงินด้วย AI (รับทำเว็บไซต์)",price:1290},
    p3 :{name:"แพ็ก 3 · วิดีโอ AI ลง TikTok",price:990},
    all:{name:"แพ็กครบ 3 คอร์ส",price:1990}
  }
};
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
document.documentElement.classList.add('js');
const L=document.documentElement.lang||'th';
const IS_TH=L==='th';
const baht=n=>'฿'+n.toLocaleString('en-US');
const eur=n=>L==='fr'?n+' €':'€'+n;
const money=k=>IS_TH?baht(CONFIG.PLANS[k].price):eur(CONFIG.EUR[k]);
const STR={
  th:{pn:{p1:CONFIG.PLANS.p1.name,p2:CONFIG.PLANS.p2.name,p3:CONFIG.PLANS.p3.name,all:CONFIG.PLANS.all.name},prog:(n,m)=>`ทำแล้ว ${n} จาก ${m} บทเรียน`},
  fr:{pn:{p1:"Pack 1 · Maîtriser l'IA",p2:"Pack 2 · Gagner de l'argent avec l'IA (sites web)",p3:"Pack 3 · Vidéos IA pour TikTok",all:"Pack complet (3 formations)"},prog:(n,m)=>`${n} leçon(s) terminée(s) sur ${m}`,wa:n=>`Bonjour, je souhaite acheter : ${n}`},
  en:{pn:{p1:"Pack 1 · Master AI",p2:"Pack 2 · Make money with AI (websites)",p3:"Pack 3 · AI videos for TikTok",all:"Complete bundle (3 courses)"},prog:(n,m)=>`${n} of ${m} lessons done`,wa:n=>`Hello, I want to buy: ${n}`}
}[L]||{};

if(CONFIG.GA_ID){const s=document.createElement('script');s.async=1;s.src='https://www.googletagmanager.com/gtag/js?id='+CONFIG.GA_ID;document.head.appendChild(s);
  window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',CONFIG.GA_ID)}
if(CONFIG.PIXEL_ID){!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',CONFIG.PIXEL_ID);fbq('track','PageView')}
const track=(n,d)=>{try{window.fbq&&fbq('track',n,d);window.gtag&&gtag('event',n,d)}catch(e){}};

if('IntersectionObserver' in window){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
  $$('.reveal').forEach(el=>{el.classList.add('pre');io.observe(el)});
}

/* fill config */
const lineUrl=`https://line.me/R/ti/p/${encodeURIComponent(CONFIG.LINE_OA)}`;
$$('[data-pp]').forEach(e=>e.textContent=CONFIG.PROMPTPAY);
$$('[data-acc]').forEach(e=>e.textContent=CONFIG.ACCOUNT_NAME);
$$('[data-brand]').forEach(e=>e.textContent=CONFIG.BRAND);
$$('[data-line]').forEach(a=>{a.href=lineUrl;a.target='_blank';a.rel='noopener'});
$$('[data-price]').forEach(e=>{if(CONFIG.PLANS[e.dataset.price])e.textContent=money(e.dataset.price)});

/* PromptPay EMV payload (Thai QR Payment) */
function crc16(s){let c=0xFFFF;for(let i=0;i<s.length;i++){c^=s.charCodeAt(i)<<8;for(let j=0;j<8;j++)c=(c&0x8000)?((c<<1)^0x1021)&0xFFFF:(c<<1)&0xFFFF}return c.toString(16).toUpperCase().padStart(4,'0')}
function tlv(id,v){return id+String(v.length).padStart(2,'0')+v}
function promptPayPayload(id,amount){
  id=String(id).replace(/\D/g,'');const isPhone=id.length<=10;
  const target=isPhone?('0066'+id.replace(/^0/,'')):id;
  const acct=tlv('00','A000000677010111')+tlv(isPhone?'01':'02',target);
  let p=tlv('00','01')+tlv('01',amount?'12':'11')+tlv('29',acct)+tlv('53','764');
  if(amount)p+=tlv('54',Number(amount).toFixed(2));
  p+=tlv('58','TH');p+='6304';return p+crc16(p);
}

/* checkout */
if($('#checkout')){
  const q=new URLSearchParams(location.search);
  let key=CONFIG.PLANS[q.get('plan')]?q.get('plan'):'all';
  const render=()=>{
    const p=CONFIG.PLANS[key];
    if(!IS_TH){
      $$('.pick').forEach(b=>b.classList.toggle('on',b.dataset.k===key));
      $('#sum').textContent=STR.pn[key];$('#amt').textContent=money(key);
      const pay=$('#pay'),link=CONFIG.PAY[key];
      pay.href=link||`https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(STR.wa(STR.pn[key]))}`;
      $('#wa').href=`https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(STR.wa(STR.pn[key]+' — '+($('#nm').value||'')))}`;
      return;
    }
    $$('.pick').forEach(b=>b.classList.toggle('on',b.dataset.k===key));
    $('#sum').textContent=p.name;$('#amt').textContent=baht(p.price);
    const box=$('#qr');box.innerHTML='';
    if(window.qrcode){const qr=qrcode(0,'M');qr.addData(promptPayPayload(CONFIG.PROMPTPAY,p.price));qr.make();box.innerHTML=qr.createSvgTag({cellSize:6,margin:2,scalable:true})}
    else box.innerHTML='<p class="note">โหลด QR ไม่สำเร็จ โอนเข้าพร้อมเพย์ตามเลขด้านล่างได้เลย</p>';
    const card=$('#card'),link=CONFIG.STRIPE[key];card.hidden=!link;if(link)card.href=link;
    const msg=`สวัสดีครับ/ค่ะ โอนเงินแล้ว\nคอร์ส: ${p.name}\nยอด: ${baht(p.price)}\nชื่อ: ${$('#nm').value||'-'}\n(แนบสลิปด้านล่าง)`;
    $('#slip').href=`https://line.me/R/oaMessage/${encodeURIComponent(CONFIG.LINE_OA)}/?${encodeURIComponent(msg)}`;
  };
  $$('.pick').forEach(b=>b.addEventListener('click',()=>{key=b.dataset.k;render();track('InitiateCheckout',{value:IS_TH?CONFIG.PLANS[key].price:CONFIG.EUR[key],currency:IS_TH?'THB':'EUR'})}));
  $('#nm').addEventListener('input',render);
  [$('#slip'),$('#pay')].forEach(el=>el&&el.addEventListener('click',()=>track('Purchase',{value:IS_TH?CONFIG.PLANS[key].price:CONFIG.EUR[key],currency:IS_TH?'THB':'EUR'})));
  const dl=$('#dlqr');if(dl&&IS_TH)dl.addEventListener('click',()=>{const s=$('#qr svg');if(!s)return;const a=document.createElement('a');a.href='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s.outerHTML);a.download='promptpay-qr.svg';a.click()});
  render();
}

/* lead capture */
const lf=$('#lead');
if(lf)lf.addEventListener('submit',async e=>{
  e.preventDefault();const d=new FormData(lf);track('Lead');
  if(CONFIG.FORM_ENDPOINT){try{await fetch(CONFIG.FORM_ENDPOINT,{method:'POST',body:d,headers:{Accept:'application/json'}})}catch(_){}}
  try{localStorage.setItem('as_lead','1')}catch(_){}
  location.href=(L==='th'?'':'')+'free.html?ok=1';
});
if($('#guide')){const ok=new URLSearchParams(location.search).get('ok')==='1';let seen=false;try{seen=localStorage.getItem('as_lead')==='1'}catch(_){}
  if(ok||seen){$('#guide').hidden=false;$('#lead-box').hidden=true}}

/* members gate: each code unlocks its pack(s) */
const gate=$('#gate');
if(gate){
  const apply=u=>{
    $('#content').hidden=false;gate.hidden=true;
    $$('[data-pack]').forEach(s=>{const k=s.dataset.pack;s.hidden=!(u.all||u[k])});
    $$('[data-tocpack]').forEach(a=>{const k=a.dataset.tocpack;a.hidden=!(u.all||u[k])});
    initProgress();
  };
  const load=()=>{try{return JSON.parse(localStorage.getItem('as_unlock')||'{}')}catch(_){return{}}};
  const u0=load();if(u0.all||u0.p1||u0.p2||u0.p3)apply(u0);
  $('#gf').addEventListener('submit',e=>{e.preventDefault();
    const c=$('#code').value.trim().toUpperCase();
    const k=Object.keys(CONFIG.CODES).find(x=>CONFIG.CODES[x].toUpperCase()===c);
    if(!k){$('#err').hidden=false;return}
    const u=load();u[k]=true;try{localStorage.setItem('as_unlock',JSON.stringify(u))}catch(_){}
    apply(u);
  });
}
function initProgress(){
  const boxes=$$('.chk');let s={};try{s=JSON.parse(localStorage.getItem('as_prog')||'{}')}catch(_){}
  const upd=()=>{const vis=boxes.filter(b=>!b.closest('[hidden]'));const n=vis.filter(b=>b.checked).length;$('#pbar').style.width=(vis.length?n/vis.length*100:0)+'%';$('#ptxt').textContent=STR.prog(n,vis.length)};
  boxes.forEach((b,i)=>{b.checked=!!s[i];b.addEventListener('change',()=>{s[i]=b.checked;try{localStorage.setItem('as_prog',JSON.stringify(s))}catch(_){}upd()})});upd();
}
$$('[data-print]').forEach(b=>b.addEventListener('click',()=>print()));
try{if(window.self!==window.top)$$('[data-print],#dlqr').forEach(b=>b.hidden=true)}catch(e){$$('[data-print],#dlqr').forEach(b=>b.hidden=true)}
