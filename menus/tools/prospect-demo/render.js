// usage: node render.js <url> <out-prefix>  -> renders the page like a visitor sees it, dumps visible text + links + a full-page screenshot
const {chromium}=require('/opt/node-tools/node_modules/playwright');
const [,, url, out]=process.argv;
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:1280,height:900},locale:'en-US'});const p=await c.newPage();
try{await p.goto(url,{waitUntil:'networkidle',timeout:45000})}catch(e){console.log('goto:',e.message.split('\n')[0])}
await p.waitForTimeout(3000);
for(let y=0;y<60000;y+=700){const h=await p.evaluate(()=>document.documentElement.scrollHeight);if(y>h)break;await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(120)}
await p.waitForTimeout(1500);
const txt=await p.evaluate(()=>document.body.innerText);
const links=await p.evaluate(()=>[...document.querySelectorAll('a[href]')].map(a=>a.href+' | '+(a.innerText||'').trim().slice(0,40)).filter(x=>/wa\.me|whatsapp|line\.me|lin\.ee|facebook|instagram|maps|tel:|menu|pdf/i.test(x)));
require('fs').writeFileSync(out+'.txt',txt);require('fs').writeFileSync(out+'.links.txt',[...new Set(links)].join('\n'));
await p.screenshot({path:out+'.png',fullPage:true}).catch(()=>{});
console.log('chars',txt.length,'links',links.length);await b.close()})();
