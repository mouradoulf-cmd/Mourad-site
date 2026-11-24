const {chromium}=require('/opt/node-tools/node_modules/playwright');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const LANGS=["th","en","zh","zt","ru","ko","ja","hi","ms","id","lo","de","fr","it","vi","km","fil","ar","he","es"];
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const rows=[];
for(const slug of ['mae-lek','fishermans-garden']){
 const errs=[];
 for(const lang of LANGS){
  const c=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const p=await c.newPage();p.on('pageerror',e=>errs.push(lang+':'+e.message));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))errs.push(lang+':'+m.text())});
  const bad=[];p.on('response',r=>{if(r.status()>=400)bad.push(lang+' '+r.url().replace(/.*\//,''))});
  await p.goto(`http://localhost:8765/menus/${slug}/?lang=${lang}&x=${Date.now()}`,{waitUntil:'networkidle'});await sleep(900);
  await p.click('.open__go');await sleep(2200);
  const y=await p.evaluate(()=>Math.round(document.querySelector('.ch').getBoundingClientRect().top+scrollY)-100);
  await p.evaluate(y=>scrollTo(0,y),y);await sleep(1500);
  const info=await p.evaluate(()=>{
    const d=document.documentElement;
    const keyLeak=[...document.querySelectorAll('main *,#bag,.pl-top *')].filter(e=>e.children.length===0&&/^(addshort|less|viewlarge|viewgrid|search|rec|pause|see|choose|menu)$/.test((e.textContent||'').trim())).length;
    const empties=[...document.querySelectorAll('.dish__n')].filter(e=>!e.textContent.trim()).length;
    const first=document.querySelector('.dish__n');
    return {lang:d.lang,dir:d.dir,overflow:d.scrollWidth-innerWidth,broken:[...document.querySelectorAll('img')].filter(i=>i.complete&&i.naturalWidth===0&&i.src.indexOf('data:')<0).length,keyLeak,empties,name:first&&first.textContent.trim().slice(0,38),add:(document.querySelector('.pl-first span')||{}).textContent,search:(document.querySelector('.pl-search input')||{}).placeholder};
  });
  rows.push([slug,lang,info.overflow,info.broken,info.keyLeak,info.empties,info.dir,info.add,info.search,info.name,bad.length]);
  await p.screenshot({path:`/tmp/f20-${slug}-${lang}.png`});
  await c.close();
 }
 console.log(slug,'errors:',errs.slice(0,6));
}
for(const r of rows) console.log(r.join(' | '));
await b.close()})();
