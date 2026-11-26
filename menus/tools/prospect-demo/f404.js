const {chromium}=require('/opt/node-tools/node_modules/playwright');
(async()=>{const slug=process.argv[2];const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:800}});
const bad=new Set();p.on('requestfailed',r=>bad.add(r.url().split('/').pop()));p.on('response',r=>{if(r.status()>=400)bad.add(r.url().split('/').pop())});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///tmp/hub/menus/'+slug+'/index.html?enter=1',{waitUntil:'load'});await p.waitForTimeout(2500);
const h=await p.evaluate(()=>document.documentElement.scrollHeight);
for(let y=0;y<h;y+=700){await p.evaluate(y=>window.scrollTo(0,y),y);await p.waitForTimeout(120)}
await p.waitForTimeout(1500);
console.log(slug,'failed:',[...bad].slice(0,15),'errors:',errs.slice(0,3));await b.close()})();
