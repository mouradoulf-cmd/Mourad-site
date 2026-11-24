const {chromium}=require('/opt/node-tools/node_modules/playwright');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function still(p){let last=-1,n=0;for(let i=0;i<60;i++){const y=await p.evaluate(()=>Math.round(scrollY));if(y===last){if(++n>=3)return}else{n=0;last=y}await sleep(120)}}
(async()=>{const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});let bad=0,checked=0;const errs=[];
for(const slug of ['mae-lek','fishermans-garden']){
 for(const lang of ['en','ar','th']){
  const c=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));
  await p.goto(`http://localhost:8765/menus/${slug}/?lang=${lang}&x=${Date.now()}`,{waitUntil:'networkidle'});await sleep(900);await p.click('.open__go');await sleep(2200);
  const H=await p.evaluate(()=>document.documentElement.scrollHeight);
  // 1. scroll-spy: tab == chapter under the header line
  for(let y=900;y<H-900;y+=Math.max(380,Math.round(H/40))){
    await p.evaluate(y=>window.scrollTo(0,y),y);await still(p);await sleep(250);
    const r=await p.evaluate(()=>{
      const hd=document.getElementById('hd').getBoundingClientRect().bottom;
      let cur=null;document.querySelectorAll('main .ch').forEach(s=>{const r=s.getBoundingClientRect();if(r.top<=hd+24&&r.bottom>hd+24)cur=s.id});
      const on=document.querySelector('#tabs button.on'),ind=document.querySelector('#tabs .pl-ind');
      let aligned=true;if(on&&ind){const a=on.getBoundingClientRect(),i=ind.getBoundingClientRect();aligned=Math.abs(a.left-i.left)<3&&Math.abs(a.width-i.width)<3}
      return {cur,tab:on&&on.getAttribute('data-go'),aligned};
    });
    checked++;if(r.cur&&r.cur!==r.tab){bad++;console.log('MISMATCH',slug,lang,'y',y,r)}
    if(!r.aligned){bad++;console.log('INDICATOR OFF',slug,lang,'y',y)}
  }
  // 2. clicking every tab lands on its section, heading visible below the header
  const ids=await p.evaluate(()=>[...document.querySelectorAll('#tabs button[data-go]')].map(b=>b.getAttribute('data-go')));
  for(const id of ids){
    await p.evaluate(id=>document.querySelector(`#tabs button[data-go="${id}"]`).click(),id);await sleep(300);await still(p);await sleep(300);
    const r=await p.evaluate(id=>{const hd=document.getElementById('hd').getBoundingClientRect().bottom;const h=document.getElementById(id).querySelector('.ch__h').getBoundingClientRect();const on=document.querySelector('#tabs button.on');return {headTop:Math.round(h.top),hd:Math.round(hd),tab:on&&on.getAttribute('data-go')}},id);
    checked++;if(r.tab!==id||r.headTop<r.hd-2||r.headTop>r.hd+60){bad++;console.log('TAB CLICK',slug,lang,id,r)}
  }
  // 3. language change from the header keeps the category
  const mid=ids[Math.min(2,ids.length-1)];
  await p.evaluate(id=>document.querySelector(`#tabs button[data-go="${id}"]`).click(),mid);await sleep(1400);
  await p.evaluate(()=>document.querySelector('.hd__r .lb').click());await sleep(700);
  await p.evaluate(()=>document.querySelector('.lgrid button[data-lang="fr"]').click());await sleep(1500);
  const kept=await p.evaluate(()=>{const on=document.querySelector('#tabs button.on');return {tab:on&&on.getAttribute('data-go'),lang:document.documentElement.lang}});
  checked++;if(kept.tab!==mid||kept.lang!=='fr'){bad++;console.log('LANG SWITCH',slug,lang,mid,kept)}
  await c.close()}
}
console.log('checks',checked,'problems',bad,'errs',errs);await b.close()})();
