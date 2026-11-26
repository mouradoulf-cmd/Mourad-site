const {chromium}=require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:1280,height:900},locale:'en-US'});const p=await c.newPage();
await p.goto('https://azurpattaya.com/',{waitUntil:'networkidle',timeout:60000});await p.waitForTimeout(2500);
const info=await p.evaluate(()=>{
 const sec=document.querySelector('#menus')||document.querySelector('#menu');
 const btns=[...document.querySelectorAll('button,a,[role=tab],summary')].map(e=>(e.innerText||'').trim().slice(0,40)).filter(t=>/menu|food|breakfast|wine|меню|kids/i.test(t));
 return {hasMenus:!!document.querySelector('#menus'),menuText:sec?sec.innerText.length:0,btns:[...new Set(btns)].slice(0,30),imgs:document.querySelectorAll('#menus img, #menu img').length}});
console.log(JSON.stringify(info));
const imgs=await p.evaluate(()=>[...document.querySelectorAll('img')].map(i=>({s:(i.currentSrc||i.src).slice(0,70),a:i.alt,w:i.naturalWidth,h:i.naturalHeight})).filter(i=>i.w>600).slice(0,40));
console.log(JSON.stringify(imgs,null,0).slice(0,2500));
await b.close()})();
