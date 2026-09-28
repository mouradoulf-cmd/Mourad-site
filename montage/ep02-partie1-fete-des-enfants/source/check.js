const {chromium}=require(process.env.PW);
const log=s=>process.stderr.write(s+'\n');
const race=(pr,ms,label)=>Promise.race([pr,new Promise(r=>setTimeout(()=>r('TIMEOUT '+label),ms))]);
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p=await b.newPage({viewport:{width:1920,height:1080}});p.on('pageerror',e=>log('PAGEERR '+e.message));
await p.goto('file://'+__dirname+'/web/index.html');
log('ready '+await race(p.waitForFunction('window.READY===true').then(()=>'yes'),20000,'ready'));
const scenes=JSON.parse(await p.evaluate(()=>JSON.stringify(TIMELINE.scenes.map(s=>({id:s.id,start:s.start,dur:s.dur})))));
const only=process.argv[2]&&process.argv[2]!=='all'?process.argv[2].split(','):null;const N=+(process.argv[3]||8);
const times=process.argv[4]?process.argv[4].split(',').map(Number):null;
const shot=async(t,name)=>{const r=await race(p.evaluate(t=>{seek(t);return 'ok'},t),8000,'seek');if(r!=='ok'){log(r+' at '+t);process.exit(1);}const r2=await race(p.screenshot({path:`${__dirname}/chk/${name}.jpg`,type:'jpeg',quality:70}).then(()=>'ok'),15000,'shot');if(r2!=='ok'){log(r2+' at '+t);process.exit(1);}};
if(times){for(const t of times)await shot(t,'t_'+t);process.exit(0);}
for(const s of scenes){if(only&&!only.includes(s.id))continue;for(let k=0;k<N;k++){const t=s.start+0.05+(s.dur-0.1)*k/(N-1);await shot(t,`${s.id}_${String(k).padStart(2,'0')}`);}log('done '+s.id);}
process.exit(0);})();
