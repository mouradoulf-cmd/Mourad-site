/* =====================================================================
   ตั้งค่าธุรกิจของคุณ — แก้เฉพาะบล็อกนี้ แล้วเว็บทั้งหมดจะอัปเดตเอง
   ===================================================================== */
const CONFIG={
  BRAND:"Avatar Cash",
  LINE_OA:"@yourlineoa",            // LINE Official Account (ใส่ @ นำหน้า)
  PROMPTPAY:"0812345678",           // เบอร์พร้อมเพย์ 10 หลัก (หรือเลขบัตร ปชช. 13 หลัก)
  ACCOUNT_NAME:"ชื่อบัญชีของคุณ",
  MEMBER_CODE:"AVATAR2026",         // รหัสเข้าห้องเรียน (เปลี่ยนทุกรอบที่ต้องการ)
  // ลิงก์ชำระเงินด้วยบัตร (สร้างฟรีใน Stripe > Payment Links) — เว้นว่างถ้ายังไม่มี
  STRIPE:{ life:"", month:"" },
  // ฟอร์มเก็บอีเมล (สร้างฟรีที่ formspree.io แล้ววาง URL) — เว้นว่างได้
  FORM_ENDPOINT:"",
  // วันที่สิ้นสุดโปรโมชันจริง (ISO เช่น "2026-12-31T23:59:00+07:00") — เว้นว่าง = ไม่แสดงนับถอยหลัง ห้ามใส่วันที่ปลอม
  OFFER_END:"",
  PIXEL_ID:"", GA_ID:"",            // Meta Pixel / Google Analytics (ไม่บังคับ)
  PLANS:{
    life :{name:"ตลอดชีพ",  price:4990, label:"฿4,990 จ่ายครั้งเดียว"},
    month:{name:"รายเดือน", price:990,  label:"฿990 / เดือน"},
    one  :{name:"รีวิวอวตาร 1:1", price:1990, label:"฿1,990"}
  }
};
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
document.documentElement.classList.add('js');

/* ---------- analytics (optional) ---------- */
if(CONFIG.GA_ID){const s=document.createElement('script');s.async=1;s.src='https://www.googletagmanager.com/gtag/js?id='+CONFIG.GA_ID;document.head.appendChild(s);
  window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',CONFIG.GA_ID)}
if(CONFIG.PIXEL_ID){!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',CONFIG.PIXEL_ID);fbq('track','PageView')}
const track=(n,d)=>{try{window.fbq&&fbq('track',n,d);window.gtag&&gtag('event',n,d)}catch(e){}};

/* ---------- reveal ---------- */
if('IntersectionObserver' in window){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
  $$('.reveal').forEach(el=>{el.classList.add('pre');io.observe(el)});
}
const st=$('.sticky');if(st)addEventListener('scroll',()=>st.classList.toggle('show',scrollY>700),{passive:true});

/* ---------- fill config into DOM ---------- */
const lineUrl=`https://line.me/R/ti/p/${encodeURIComponent(CONFIG.LINE_OA)}`;
const t=(k,v)=>window.I18N?I18N.t(k,v):k;
function fill(){
  $$('[data-pp]').forEach(e=>e.textContent=CONFIG.PROMPTPAY);
  $$('[data-acc]').forEach(e=>e.textContent=CONFIG.ACCOUNT_NAME);
  $$('[data-brand]').forEach(e=>e.textContent=CONFIG.BRAND);
  $$('[data-line]').forEach(a=>{a.href=lineUrl;a.target='_blank';a.rel='noopener'});
  $$('[data-price]').forEach(e=>{const p=CONFIG.PLANS[e.dataset.price];if(p)e.textContent='฿'+p.price.toLocaleString('en-US')});
}
fill();document.addEventListener('langchange',fill);

/* ---------- PromptPay EMV payload (มาตรฐาน Thai QR Payment) ---------- */
function crc16(s){let c=0xFFFF;for(let i=0;i<s.length;i++){c^=s.charCodeAt(i)<<8;for(let j=0;j<8;j++)c=(c&0x8000)?((c<<1)^0x1021)&0xFFFF:(c<<1)&0xFFFF}return c.toString(16).toUpperCase().padStart(4,'0')}
function tlv(id,v){return id+String(v.length).padStart(2,'0')+v}
function promptPayPayload(id,amount){
  id=String(id).replace(/\D/g,'');
  const isPhone=id.length<=10;
  const target=isPhone?('0066'+id.replace(/^0/,'')):id;
  const acct=tlv('00','A000000677010111')+tlv(isPhone?'01':'02',target);
  let p=tlv('00','01')+tlv('01',amount?'12':'11')+tlv('29',acct)+tlv('53','764');
  if(amount)p+=tlv('54',Number(amount).toFixed(2));
  p+=tlv('58','TH');
  p+='6304';return p+crc16(p);
}

/* ---------- checkout page ---------- */
const co=$('#checkout');
if(co){
  const q=new URLSearchParams(location.search);
  if(q.get('name')){const n=$('#nm');if(n)n.value=q.get('name')}
  let key=CONFIG.PLANS[q.get('plan')]?q.get('plan'):'life';
  const render=()=>{
    const p=CONFIG.PLANS[key];
    $$('.pick').forEach(b=>b.classList.toggle('on',b.dataset.k===key));
    $('#sum').textContent=`${t('plan_'+key)} — ${t('lbl_'+key)}`;
    $('#amt').textContent='฿'+p.price.toLocaleString('en-US');
    const payload=promptPayPayload(CONFIG.PROMPTPAY,p.price);
    const box=$('#qr');box.innerHTML='';
    if(window.qrcode){const qr=qrcode(0,'M');qr.addData(payload);qr.make();box.innerHTML=qr.createSvgTag({cellSize:6,margin:2,scalable:true})}
    else box.innerHTML='<p class="note">'+t('noqr')+'</p>';
    const card=$('#card'),link=CONFIG.STRIPE[key];
    card.hidden=!link;if(link)card.href=link;
    const slip=t('slip',{plan:t('plan_'+key),price:p.price,name:$('#nm').value||'-'})+(q.get('ctx')?'\n'+q.get('ctx'):'');
    $('#slip').href=`https://line.me/R/oaMessage/${encodeURIComponent(CONFIG.LINE_OA)}/?${encodeURIComponent(slip)}`;
  };
  $$('.pick').forEach(b=>b.addEventListener('click',()=>{key=b.dataset.k;render();track('InitiateCheckout',{value:CONFIG.PLANS[key].price,currency:'THB'})}));
  $('#nm').addEventListener('input',render);
  $('#slip').addEventListener('click',()=>track('Purchase',{value:CONFIG.PLANS[key].price,currency:'THB'}));
  const dl=$('#dlqr');if(dl)dl.addEventListener('click',()=>{const s=$('#qr svg');if(!s)return;const a=document.createElement('a');a.href='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s.outerHTML);a.download='promptpay-qr.svg';a.click()});
  window.addEventListener('load',render);document.addEventListener('langchange',render);render();
}

/* ---------- lead capture (free guide) ---------- */
const lf=$('#lead');
if(lf)lf.addEventListener('submit',async e=>{
  e.preventDefault();const d=new FormData(lf);track('Lead');
  if(CONFIG.FORM_ENDPOINT){try{await fetch(CONFIG.FORM_ENDPOINT,{method:'POST',body:d,headers:{Accept:'application/json'}})}catch(_){}}
  try{localStorage.setItem('ac_lead','1')}catch(_){}
  location.href='free.html?ok=1';
});
if($('#guide')){const ok=new URLSearchParams(location.search).get('ok')==='1';let seen=false;try{seen=localStorage.getItem('ac_lead')==='1'}catch(_){}
  if(ok||seen){$('#guide').hidden=false;$('#lead-box').hidden=true}}

/* ---------- members gate + progress ---------- */
const gate=$('#gate');
if(gate){
  const unlock=()=>{$('#content').hidden=false;gate.hidden=true;initProgress()};
  try{if(localStorage.getItem('ac_ok')==='1')unlock()}catch(e){}
  $('#gf').addEventListener('submit',e=>{e.preventDefault();
    if($('#code').value.trim().toUpperCase()===CONFIG.MEMBER_CODE.toUpperCase()){try{localStorage.setItem('ac_ok','1')}catch(e){}unlock()}else $('#err').hidden=false});
}
function initProgress(){
  const boxes=$$('.chk');let s={};try{s=JSON.parse(localStorage.getItem('ac_prog')||'{}')}catch(_){}
  const upd=()=>{const n=boxes.filter(b=>b.checked).length;$('#pbar').style.width=(n/boxes.length*100)+'%';$('#ptxt').textContent=t('prog',{n:n,m:boxes.length})};document.addEventListener('langchange',upd);
  boxes.forEach((b,i)=>{b.checked=!!s[i];b.addEventListener('change',()=>{s[i]=b.checked;try{localStorage.setItem('ac_prog',JSON.stringify(s))}catch(_){}upd()})});upd();
}
/* ---------- print button ---------- */
$$('[data-print]').forEach(b=>b.addEventListener('click',()=>print()));
/* hide print/save buttons when the site is shown inside a sandboxed frame (they cannot work there) */
try{if(window.self!==window.top){$$('[data-print],#dlqr').forEach(b=>b.hidden=true)}}catch(e){$$('[data-print],#dlqr').forEach(b=>b.hidden=true)}

/* videos: language-specific files, autoplay (muted) while visible */
function setVideos(){const l=(window.I18N&&I18N.lang)||'th';
  $$('video[data-v]').forEach(v=>{const n=v.dataset.v,src=`assets/video/${n}-${l}.mp4`;
    if(v.dataset.cur!==src){const was=!v.paused;v.dataset.cur=src;v.poster=`assets/video/${n}-${l}.jpg`;v.src=src;v.load();if(was)v.play().catch(()=>{})}});
  $$('[data-vt]').forEach(e=>e.textContent=t('vc_'+e.dataset.vt))}
setVideos();document.addEventListener('langchange',setVideos);
if('IntersectionObserver' in window){const vo=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target;if(e.isIntersecting){v.play().catch(()=>{})}else v.pause()}),{threshold:.55});$$('video[data-v]').forEach(v=>vo.observe(v))}
