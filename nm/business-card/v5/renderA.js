const {chromium}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch({args:['--allow-file-access-from-files']});
const c=await b.newContext({viewport:{width:363,height:227},deviceScaleFactor:6.25});const p=await c.newPage();
await p.goto('file:///tmp/claude-0/card/cardA.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(500);
for(const id of ['front','back'])await (await p.$('#'+id)).screenshot({path:`/tmp/claude-0/card/A_${id}.png`});
await p.pdf({path:'/tmp/claude-0/card/A.pdf',width:'96mm',height:'60mm',printBackground:true,preferCSSPageSize:true});
await p.goto('file:///tmp/claude-0/card/foil.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);
await p.pdf({path:'/tmp/claude-0/card/foil.pdf',width:'96mm',height:'60mm',printBackground:true,preferCSSPageSize:true});
await (await p.$('#front')).screenshot({path:'/tmp/claude-0/card/foil.png'});
await b.close()})()
