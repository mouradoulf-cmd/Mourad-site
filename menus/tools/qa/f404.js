const {chromium}=require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
for(const slug of ['fishermans-garden','mae-lek']){
const c=await b.newContext({viewport:{width:390,height:844},isMobile:true});const p=await c.newPage();const bad=new Set();
p.on('response',r=>{if(r.status()>=400)bad.add(r.url().replace(/.*\/menus\//,''))});
await p.goto(`http://localhost:8765/menus/${slug}/?x=${Date.now()}`,{waitUntil:'networkidle'});await p.waitForTimeout(1200);await p.click('[data-pick="en"]');await p.waitForTimeout(2000);
for(let y=0;y<30000;y+=700){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(60)}
await p.waitForTimeout(1500);
console.log(slug,[...bad].slice(0,8),bad.size);await c.close()}
await b.close()})();
