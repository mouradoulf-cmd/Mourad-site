const {chromium}=require(process.env.PW);
const {spawn}=require('child_process');
const [,,start='0',end='60',out='frames.mp4',step='1']=process.argv;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const p=await b.newPage({viewport:{width:1920,height:1080}});
 await p.goto('file://'+__dirname+'/web/index.html');await p.waitForFunction('window.READY===true');
 const FPS=30,s=+start,e=+end,st=+step;
 if(out.endsWith('.jpg')){for(let t=s;t<=e;t+=st){await p.evaluate(t=>seek(t),t);await p.screenshot({path:out.replace('.jpg','_'+t+'.jpg'),type:'jpeg',quality:80});}await b.close();return;}
 const ff=spawn(process.env.FF,['-y','-loglevel','error','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p',out],{stdio:['pipe','inherit','inherit']});
 const n=Math.round((e-s)*FPS);const t0=Date.now();
 for(let i=0;i<n;i++){const t=s+i/FPS;await p.evaluate(t=>seek(t),t);const buf=await p.screenshot({type:'jpeg',quality:93});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));if(i%150==0)console.log('frame',i,'/',n,((Date.now()-t0)/1000).toFixed(0)+'s');}
 ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();console.log('done',out);
})();
