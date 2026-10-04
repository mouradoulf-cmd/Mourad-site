/* ===== ตั้งค่าของคุณที่นี่ (แก้ 4 ค่านี้ก่อนเปิดขายจริง) ===== */
const CONFIG={
  LINE_OA:"@yourlineoa",          // LINE Official Account ของคุณ (ใส่ @ นำหน้า)
  PROMPTPAY:"0812345678",         // เบอร์/เลขพร้อมเพย์สำหรับรับเงิน
  ACCOUNT_NAME:"ชื่อ-นามสกุลบัญชีของคุณ",
  MEMBER_CODE:"AVATAR2026"        // รหัสเข้าห้องเรียน (ส่งให้ลูกค้าหลังชำระเงิน)
};
document.documentElement.classList.add('js');
// reveal
if('IntersectionObserver' in window){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>{el.classList.add('pre');io.observe(el)});
}
// sticky CTA
const st=document.querySelector('.sticky');
if(st)addEventListener('scroll',()=>st.classList.toggle('show',scrollY>700),{passive:true});
// order form -> LINE OA message
const f=document.getElementById('order');
if(f)f.addEventListener('submit',e=>{
  e.preventDefault();
  const d=new FormData(f);
  const msg=`สวัสดีครับ/ค่ะ สนใจสมัคร Avatar Cash\nชื่อ: ${d.get('name')}\nแพ็กเกจ: ${d.get('plan')}\nเบอร์/LINE: ${d.get('contact')}\nขอรายละเอียดการชำระเงินด้วยครับ/ค่ะ`;
  const url=`https://line.me/R/oaMessage/${encodeURIComponent(CONFIG.LINE_OA)}/?${encodeURIComponent(msg)}`;
  window.open(url,'_blank','noopener');
  const ok=document.getElementById('ok');if(ok)ok.hidden=false;
});
// payment info
document.querySelectorAll('[data-pp]').forEach(el=>el.textContent=CONFIG.PROMPTPAY);
document.querySelectorAll('[data-acc]').forEach(el=>el.textContent=CONFIG.ACCOUNT_NAME);
document.querySelectorAll('[data-line]').forEach(el=>{el.href=`https://line.me/R/ti/p/${encodeURIComponent(CONFIG.LINE_OA)}`;el.target='_blank';el.rel='noopener'});
// members gate (ป้องกันเบาๆ — ดู README)
const gate=document.getElementById('gate');
if(gate){
  const unlock=()=>{document.getElementById('content').hidden=false;gate.hidden=true};
  try{if(localStorage.getItem('ac_ok')==='1')unlock()}catch(e){}
  document.getElementById('gf').addEventListener('submit',e=>{
    e.preventDefault();
    if(document.getElementById('code').value.trim().toUpperCase()===CONFIG.MEMBER_CODE){try{localStorage.setItem('ac_ok','1')}catch(e){}unlock()}
    else document.getElementById('err').hidden=false;
  });
}
