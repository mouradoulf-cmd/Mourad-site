// node render_ep.js <frameStart> <frameEnd> <out.mp4>   (frames at 30 fps, end exclusive)
const {chromium}=require(process.env.PW);const {spawn}=require('child_process');
const [,,f0,f1,out]=process.argv;const FPS=30;
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 b.on('disconnected',()=>process.stderr.write('BROWSER DISCONNECTED\n'));const p=await b.newPage({viewport:{width:1920,height:1080}});p.on('crash',()=>process.stderr.write('PAGE CRASH\n'));p.on('pageerror',e=>{process.stderr.write('PAGEERR '+e.message+'\n');process.exit(2);});
 process.stderr.write('launched\n');await p.goto('file://'+__dirname+'/web/index.html');process.stderr.write('loaded\n');await p.waitForFunction('window.READY===true',{timeout:30000});process.stderr.write('ready\n');
 const ff=spawn(process.env.FF,['-y','-loglevel','error','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','medium','-tune','animation','-crf','19','-pix_fmt','yuv420p','-g','60',out],{stdio:['pipe','inherit','inherit']});
 const t0=Date.now();
 for(let i=+f0;i<+f1;i++){await p.evaluate(t=>{seek(t);},i/FPS);const buf=await p.screenshot({type:'jpeg',quality:94});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));
  if((i-f0)%300===0)process.stderr.write(`${out} ${i-f0}/${f1-f0} ${((Date.now()-t0)/1000).toFixed(0)}s\n`);}
 ff.stdin.end();await new Promise(r=>ff.on('close',r));process.stderr.write('done '+out+'\n');process.exit(0);})();
