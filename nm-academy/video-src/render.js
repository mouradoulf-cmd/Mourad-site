/* Rend les frames d'une vidéo (Playwright + Chromium). Usage : node render.js <ai|web> <fr|en|th> [fps] [t1,t2,...]
   Puis encoder avec ffmpeg (voir README.md). */
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{
 const [v,l,fpsS,only]=process.argv.slice(2);const fps=+fpsS||24,outRoot=process.env.OUT||'/tmp/nmv/frames';
 const b=await chromium.launch({executablePath:process.env.CHROMIUM||'/opt/pw-browsers/chromium'}).catch(()=>chromium.launch());
 const p=await b.newPage({viewport:{width:540,height:960},deviceScaleFactor:4/3});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+path.resolve(__dirname,process.env.SCENE||'scene.html')+`?v=${v}&l=${l}&p=${process.env.P||'a'}&m=${process.env.M||0}`);await p.waitForFunction('window.READY');
 const dur=await p.evaluate('DUR'),out=`${outRoot}/${v}${v==='lesson'?'-'+(process.env.P||'a')+(process.env.M||0):''}-${l}`;fs.mkdirSync(out,{recursive:true});
 if(only){for(const t of only.split(',')){await p.evaluate(t=>render(t),+t);await p.screenshot({path:`${out}/t${t}.jpg`,type:'jpeg',quality:90})}}
 else{const n=Math.round(dur*fps);for(let i=0;i<n;i++){await p.evaluate(t=>render(t),i/fps);await p.screenshot({path:`${out}/f${String(i).padStart(4,'0')}.jpg`,type:'jpeg',quality:90})}}
 console.log(v,l,'errors',errs.slice(0,5));await b.close();
})();
