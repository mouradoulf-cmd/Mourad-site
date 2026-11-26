const {chromium}=require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:1280,height:900},locale:'en-US'});const p=await c.newPage();
const reqs=[];p.on('request',r=>{const u=r.url();if(/pdf|menu|json|\.png|\.jpe?g|\.webp/i.test(u)&&!/fonts|analytics/.test(u))reqs.push(u.slice(0,140))});
await p.goto('https://azurpattaya.com/',{waitUntil:'networkidle',timeout:60000});await p.waitForTimeout(2000);
const btn=p.locator('text=Food menu').first();
const [pop]=await Promise.all([c.waitForEvent('page',{timeout:6000}).catch(()=>null),btn.click({timeout:8000}).catch(e=>console.log('click err',e.message.split('\n')[0]))]);
await p.waitForTimeout(2500);
if(pop){await pop.waitForLoadState('domcontentloaded').catch(()=>{});console.log('POPUP',pop.url().slice(0,200))}
const txt=await p.evaluate(()=>document.body.innerText.length);
const modal=await p.evaluate(()=>{const m=[...document.querySelectorAll('[role=dialog],.modal,.lightbox,dialog,[class*=menu-open],[class*=overlay]')].map(e=>(e.innerText||'').slice(0,300));return m.slice(0,3)});
console.log('bodyTextLen',txt,'modal',JSON.stringify(modal));
console.log(reqs.slice(-12).join('\n'));
await p.screenshot({path:'/tmp/night/azur_click.png'});
await b.close()})();
