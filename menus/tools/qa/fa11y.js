const {chromium}=require('/opt/node-tools/node_modules/playwright');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});const errs=[];
for(const slug of ['mae-lek','fishermans-garden']){
const c=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto(`http://localhost:8765/menus/${slug}/?x=${Date.now()}`,{waitUntil:'networkidle'});await sleep(1200);await p.click('[data-pick="en"]');await sleep(2200);
const r=await p.evaluate(()=>{
  const small=[...document.querySelectorAll('button,a,input,[role=button]')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&(r.width<24||r.height<24)&&getComputedStyle(e).visibility!=='hidden'&&!e.closest('.sr,.pl-sr')}).map(e=>e.className||e.tagName).slice(0,6);
  const unnamed=[...document.querySelectorAll('button')].filter(b=>!(b.textContent.trim()||b.getAttribute('aria-label'))).length;
  const imgNoAlt=[...document.querySelectorAll('img:not([alt])')].length;
  return {small,unnamed,imgNoAlt,lang:document.documentElement.lang,h1:document.querySelectorAll('h1').length};
});
console.log(slug,JSON.stringify(r));
// selection flow end-to-end: add 2 dishes, open selection, waiter view
await p.evaluate(()=>{document.querySelectorAll('.pl-first')[0].click();document.querySelectorAll('.pl-first')[1].click()});await sleep(900);
await p.evaluate(()=>document.querySelector('.bag__go').click());await sleep(900);
console.log(' selection sheet rows',await p.evaluate(()=>document.querySelectorAll('.sel li').length),'total',await p.evaluate(()=>(document.querySelector('.tot b')||{}).textContent));
await p.evaluate(()=>document.querySelector('[data-show]').click());await sleep(1200);
console.log(' waiter screen',await p.evaluate(()=>document.getElementById('waiter').classList.contains('on')));
await c.close()}
console.log('errs',errs);await b.close()})();
