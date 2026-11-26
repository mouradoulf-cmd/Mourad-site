// usage: node shot.js <slug> [lang] [scrollSelector] -> mobile screenshots + error/404/dup report
const {chromium}=require('/opt/node-tools/node_modules/playwright');
const slug=process.argv[2],lang=process.argv[3]||'en';
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});const p=await c.newPage();
const errs=[],bad=[];p.on('pageerror',e=>errs.push(e.message));p.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url().split('/').pop())});
await p.goto(`file:///tmp/hub/menus/${slug}/index.html?lang=${lang}&enter=1`,{waitUntil:'networkidle'});await p.waitForTimeout(1500);
await p.screenshot({path:`/tmp/night/shot_${slug}_1.png`});
for(let y=0;y<80000;y+=800){const h=await p.evaluate(()=>document.documentElement.scrollHeight);if(y>h)break;await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(60)}
const r=await p.evaluate(()=>({dishes:document.querySelectorAll('.dish').length,photos:document.querySelectorAll('.dish.has-ph').length,broken:[...document.querySelectorAll('.dish img')].filter(i=>i.complete&&!i.naturalWidth).length,tabs:[...document.querySelectorAll('#tabs button[data-go]')].map(b=>b.textContent.trim()),ovf:document.documentElement.scrollWidth-innerWidth}));
await p.evaluate(()=>{const e=document.querySelectorAll('.dish.has-ph')[10];e&&e.scrollIntoView({block:'center'})});await p.waitForTimeout(900);await p.screenshot({path:`/tmp/night/shot_${slug}_2.png`});
console.log(JSON.stringify(r),'errs',errs.slice(0,3),'bad',bad.slice(0,6));await b.close()})();
