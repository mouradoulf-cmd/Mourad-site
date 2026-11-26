const {chromium}=require('/opt/node-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch();const c=await b.newContext({viewport:{width:1280,height:900},locale:'en-US'});const p=await c.newPage();
await p.goto('https://chezmony.com/menu',{waitUntil:'networkidle',timeout:45000});await p.waitForTimeout(2500);
const tabs=['Breakfast','Starters','Salads','Sandwiches & Kebabs','Mains','Pizza','Pasta','Thai Food','Desserts','Café & Co','Soft Drinks','Beers & Spirits','French Wine Exclusive'];
const out={};
for(const t of tabs){
  const loc=p.locator('button, [role=tab], a, div').filter({hasText:new RegExp('^\\s*(🍷\\s*)?'+t.replace(/[.*+?^${}()|[\]\\&]/g,'\\$&')+'\\s*$')}).first();
  try{await loc.click({timeout:5000});await p.waitForTimeout(700);}catch(e){out[t]='CLICK FAIL';continue}
  out[t]=await p.evaluate(()=>{const s=document.body.innerText;const a=s.indexOf('Our Menu');const e=s.indexOf('Ready to enjoy');return s.slice(a,e)});
}
require('fs').writeFileSync('/tmp/night/mony_raw.json',JSON.stringify(out,null,1));
console.log(Object.entries(out).map(([k,v])=>k+': '+(typeof v==='string'?v.length:'')).join('\n'));await b.close()})();
