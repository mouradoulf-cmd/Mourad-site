const {chromium}=require('/opt/node-tools/node_modules/playwright');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
for(const slug of (process.env.QA_SLUGS?process.env.QA_SLUGS.split(','):['mae-lek','fishermans-garden'])){
const c=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true});
const p=await c.newPage();let bytes=0;const files=[];
p.on('response',async r=>{try{const bd=await r.body();bytes+=bd.length;files.push([bd.length,r.url().replace(/.*\/menus\//,'')])}catch(e){}});
await p.addInitScript(()=>{window.__m={cls:0,lcp:0};new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__m.cls+=e.value}).observe({type:'layout-shift',buffered:true});new PerformanceObserver(l=>{window.__m.lcp=l.getEntries().pop().startTime}).observe({type:'largest-contentful-paint',buffered:true})});
await p.goto(`http://localhost:8765/menus/${slug}/?x=${Date.now()}`,{waitUntil:'networkidle'});await sleep(1500);
const k1=Math.round(bytes/1024);
await p.click('[data-pick="en"]');await sleep(2500);
const y=await p.evaluate(()=>Math.round(document.querySelector('.ch').getBoundingClientRect().top+scrollY)-100);await p.evaluate(y=>scrollTo(0,y),y);await sleep(2500);
const k2=Math.round(bytes/1024);
const js=files.filter(f=>/\.(js|css)/.test(f[1])).reduce((a,f)=>a+f[0],0);
console.log(slug,'opening KB',k1,'| at first dishes KB',k2,'| js+css KB',Math.round(js/1024),'| LCP',Math.round(await p.evaluate(()=>window.__m.lcp)),'ms CLS',(await p.evaluate(()=>window.__m.cls)).toFixed(3));
await c.close()}
await b.close()})();
