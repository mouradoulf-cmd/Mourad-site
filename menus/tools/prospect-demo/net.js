const {chromium}=require('/opt/node-tools/node_modules/playwright');
const [,, url]=process.argv;
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:1280,height:900}});const p=await c.newPage();
p.on('response',async r=>{const u=r.url();const ct=r.headers()['content-type']||'';if(/json|javascript|csv|text\/plain/.test(ct)||/menu|api|json|sheet/i.test(u))console.log(r.status(),ct.split(';')[0],u.slice(0,200))});
await p.goto(url,{waitUntil:'networkidle',timeout:45000}).catch(e=>console.log(e.message.split('\n')[0]));await p.waitForTimeout(3000);await b.close()})();
