/* AI Skill — explainer film (real-time, deterministic render(t)). Scenes are built once, then updated from the clock. */
(function(){
const $=(s,r=document)=>r.querySelector(s);
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const ease=x=>1-Math.pow(1-clamp(x),3);
const film=$('#film');if(!film)return;
const price=k=>(typeof eur==='function'&&typeof CONFIG!=='undefined')?eur(CONFIG.EUR[k]):'';
const stage=$('#fstage'),cap=$('#cap span'),bar=$('#prog i');
const S=[]; // {t, say, el, upd(lt)}
function scene(t,say,html,upd){const el=document.createElement('div');el.className='sc';el.innerHTML=html;stage.appendChild(el);S.push({t,say,el,upd:upd||(()=>{})});return el}

/* 0 intro: 3D cube */
scene(6,"Salut ! En une minute, on t'explique ce qu'on fait et comment ça marche.",
`<div class="k">Bienvenue</div><div class="ring" style="width:120px;height:120px;margin:34px auto 44px"><div id="cube" style="position:absolute;inset:0;transform-style:preserve-3d">${['🧠','🌐','🎬','💬','🛠️','✨'].map((e,i)=>`<div style="position:absolute;inset:0;display:grid;place-items:center;font-size:3rem;background:rgba(139,124,255,.25);border:1px solid rgba(255,255,255,.3);border-radius:14px;transform:${['rotateY(0)','rotateY(90deg)','rotateY(180deg)','rotateY(270deg)','rotateX(90deg)','rotateX(-90deg)'][i]} translateZ(60px)">${e}</div>`).join('')}</div></div><h2>Tout comprendre<br/>en <em>1 minute</em></h2><p class="t">AI Skill : apprends l'IA, crée des sites, fais des vidéos.</p>`,
(el,lt)=>{$('#cube',el).style.transform=`rotateX(${-20+lt*30}deg) rotateY(${lt*70}deg)`});

/* 1 problem: prices */
scene(10.5,"Les outils de vidéo IA payants coûtent souvent trente, cent, voire deux cents euros par mois, pour une trentaine de clips de dix secondes.",
`<div class="k">Le problème</div><h2>Tu paies <em>30 €, 100 €, 200 €</em> par mois ?</h2><p class="t">…pour ~30 clips de 10 secondes (tarifs indicatifs)</p><div class="row3">${['30 €','100 €','200 €'].map(p=>`<div class="pc"><b>${p}</b><small>par mois</small><div class="x"></div></div>`).join('')}</div>`,
(el,lt)=>{el.querySelectorAll('.pc').forEach((c,i)=>{const p=ease((lt-.8-i*.7)/.8);c.style.opacity=p;c.style.transform=`translate3d(0,${(1-p)*-160}px,${(1-p)*-900}px) rotateX(${(1-p)*55}deg) rotateY(${(i-1)*(8-8*p)}deg)`;c.querySelector('.x').style.width=ease((lt-4.6-i*.5)/.6)*84+'%'})});

/* 2 solution: carousel of free tools */
const tools=['ChatGPT','Claude','Gemini','CapCut','Images IA','Voix IA','Vidéo IA','Site web'];
scene(9.5,"Ici, tu apprends une méthode avec des outils gratuits, pour viser jusqu'à cinquante clips par jour, selon les quotas gratuits.",
`<div class="k">Ma méthode</div><div class="big">Jusqu'à <em style="font-style:normal;color:var(--green)">~50 clips</em><br/>par jour</div><p class="t" style="margin-top:12px">avec des outils gratuits · selon leurs quotas*</p><div class="ring" id="ring" style="margin-top:78px">${tools.map(t=>`<i>${t}</i>`).join('')}</div><p class="foot" style="margin-top:70px">*Les offres gratuites changent : la formation est mise à jour.</p>`,
(el,lt)=>{const r=$('#ring',el);r.style.transform=`rotateX(-12deg) rotateY(${lt*28}deg)`;const R=clamp(innerWidth*.34,120,300);r.querySelectorAll('i').forEach((it,i)=>{it.style.transform=`rotateY(${i*45}deg) translateZ(${R}px)`});r.style.opacity=ease(lt/1)});

/* 3-5 packs */
const packs=[
 ['PACK 1','Maîtriser l\'IA',['Des prompts qui marchent','Automatiser tes tâches','Textes, images, idées en minutes'],'p1',"Pack un : maîtriser l'IA. Les bons prompts, l'automatisation, et créer textes, images et idées en quelques minutes.",9],
 ['PACK 2','Créer et vendre des sites web avec l\'IA',['Un site pro sans coder','Trouver tes premiers clients','Devis, livraison, facturation'],'p2',"Pack deux : créer et vendre des sites web avec l'IA, sans coder. Tu apprends à trouver des clients, faire un devis et livrer.",9.5],
 ['PACK 3','Des vidéos IA pour TikTok',['Outils gratuits','Script, voix, montage','Publier et lire tes stats'],'p3',"Pack trois : des vidéos IA pour TikTok avec des outils gratuits : script, voix, montage et publication.",9]];
packs.forEach((p,pi)=>{
 scene(p[5],p[4],`<div class="pk"><div class="n">${p[0]}</div><h3>${p[1]}</h3><ul>${p[2].map(x=>`<li>${x}</li>`).join('')}</ul><div class="pr">${price(p[3])} <span style="font-size:.9rem;color:var(--mute);font-weight:500">paiement unique</span></div></div>`,
 (el,lt)=>{const c=$('.pk',el),a=ease(lt/.9);c.style.transform=`rotateY(${(1-a)*-75+Math.sin(lt*.9)*4}deg) rotateX(${Math.cos(lt*.7)*2}deg) translateZ(${(1-a)*-300}px)`;c.style.opacity=a;
  el.querySelectorAll('li').forEach((li,i)=>{const q=ease((lt-1.2-i*.9)/.5);li.style.opacity=q;li.style.transform=`translateX(${(1-q)*40}px)`})});
});

/* 6 steps */
scene(9,"Comment ça marche ? Tu choisis ton pack, tu reçois ton code, tu suis les leçons, et tu passes à l'action.",
`<div class="k">Comment ça marche</div><h2>4 étapes, <em>simple et pratique</em></h2><div class="steps4">${[['1','Tu choisis ton pack'],['2','Tu reçois ton code'],['3','Tu suis les leçons'],['4','Tu passes à l\'action']].map(s=>`<div class="st"><i>${s[0]}</i><b>${s[1]}</b></div>`).join('')}</div>`,
(el,lt)=>{el.querySelectorAll('.st').forEach((c,i)=>{const p=ease((lt-.6-i*.9)/.7);c.style.opacity=p;c.style.transform=`translate3d(0,${(1-p)*60}px,${(1-p)*-500}px) rotateY(${(1-p)*-50}deg)`})});

/* 7 honest */
scene(8.5,"Un mot d'honnêteté : aucun revenu n'est garanti. On te donne la méthode, c'est ton travail qui fait le résultat.",
`<div class="k">En toute transparence</div><div class="big">Aucun revenu<br/><em style="font-style:normal;color:var(--warn)">garanti.</em></div><p class="t" style="margin-top:16px">On te donne la méthode et les outils.<br/>Le résultat dépend de ton travail.</p>`,
(el,lt)=>{const b=$('.big',el);b.style.transform=`translateZ(${Math.sin(lt*1.2)*30}px) rotateX(${Math.sin(lt)*4}deg)`});

/* 8 final: offers (stays on screen) */
const off=[['PACK 1','Maîtriser l\'IA','p1'],['PACK 2','Créer et vendre des sites web','p2'],['PACK 3','Vidéos IA pour TikTok','p3'],['COMPLET','Les 3 formations','all']];
scene(8,"Prêt ? Choisis ta formation ci-dessous, ou commence par les quinze prompts gratuits.",
`<div class="k">À toi de jouer</div><h2>Choisis ta <em>formation</em></h2><div class="offers">${off.map(o=>`<div class="of${o[2]==='p2'?' best':''}"><small>${o[0]}</small><b>${o[1]}</b><div class="pr">${price(o[2])}</div><a href="checkout.html?plan=${o[2]}">Je rejoins</a></div>`).join('')}</div><div class="after"><a class="btn ghost" href="free.html">🎁 15 prompts gratuits</a><button class="btn ghost" id="seeSite" type="button">Voir le site ↓</button><button class="btn ghost" id="replay" type="button">↻ Revoir la vidéo</button></div><p class="foot">Paiement unique · aucun revenu garanti · tarifs et quotas d'outils indicatifs.</p>`,
(el,lt)=>{el.querySelectorAll('.of').forEach((c,i)=>{const p=ease((lt-.5-i*.35)/.6);c.style.opacity=p;c.style.transform=`translate3d(0,${(1-p)*50}px,${(1-p)*-400}px) rotateX(${(1-p)*35}deg)`})});

let total=0;const starts=[];S.forEach(s=>{starts.push(total);total+=s.t});
/* ---- state / clock ---- */
let t=0,playing=false,last=0,cur=-1,voiceOn=('speechSynthesis' in window),raf=0;
const bPlay=$('#fplay'),bVoice=$('#fvoice');
function say(i){if(!voiceOn||!('speechSynthesis' in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(S[i].say);u.lang='fr-FR';u.rate=1;const v=speechSynthesis.getVoices().find(v=>/^fr/i.test(v.lang));if(v)u.voice=v;speechSynthesis.speak(u)}
function idx(tt){let i=0;for(;i<S.length-1&&tt>=starts[i]+S[i].t;i++);return i}
function render(){
  const i=idx(t);
  S.forEach((s,k)=>{const lt=t-starts[k];const show=lt>=0&&(lt<s.t+.3||k===S.length-1&&t>=starts[k]);
    if(!show){s.el.style.opacity=0;s.el.classList.remove('on');return}
    const fin=ease(lt/.45),fout=k===S.length-1?1:clamp((s.t+.3-lt)/.3);
    s.el.style.opacity=fin*fout;s.el.classList.add('on');
    if(k!==S.length-1)s.el.style.pointerEvents='none';else s.el.style.pointerEvents=fin>.6?'auto':'none';
    s.upd(s.el,Math.max(lt,0))});
  bar.style.width=Math.min(t/total,1)*100+'%';film.classList.toggle('final',i===S.length-1);
  if(i!==cur){cur=i;cap.textContent=S[i].say;if(playing)say(i)}
}
function loop(n){if(!playing){return}const dt=Math.min((n-last)/1000,.1);last=n;t+=dt;if(t>=total){t=total-.001;playing=false;speechSynthesis&&speechSynthesis.cancel&&0;bPlay.textContent='↻'}render();if(playing)raf=requestAnimationFrame(loop)}
function play(){if(t>=total-.01){t=0;cur=-1}playing=true;last=performance.now();bPlay.textContent='❚❚';if(voiceOn)say(idx(t));raf=requestAnimationFrame(loop)}
function pause(){playing=false;bPlay.textContent='▶';if('speechSynthesis' in window)speechSynthesis.cancel()}
function open(){film.classList.add('open');document.body.style.overflow='hidden';t=0;cur=-1;stars.start();render();play();$('#fclose').focus()}
function close(){pause();film.classList.remove('open');document.body.style.overflow='';stars.stop()}
bPlay.onclick=()=>playing?pause():play();
$('#fclose').onclick=close;
bVoice.hidden=!voiceOn;bVoice.classList.toggle('on',voiceOn);
bVoice.onclick=()=>{voiceOn=!voiceOn;bVoice.classList.toggle('on',voiceOn);if(voiceOn&&playing)say(idx(t));else if('speechSynthesis' in window)speechSynthesis.cancel()};
$('#prog').addEventListener('click',e=>{const r=e.currentTarget.getBoundingClientRect();t=clamp((e.clientX-r.left)/r.width)*total;cur=-1;render();if(playing&&voiceOn)say(idx(t))});
document.addEventListener('keydown',e=>{if(!film.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key===' '&&e.target.tagName!=='A'&&e.target.tagName!=='BUTTON'){e.preventDefault();bPlay.click()}});
document.addEventListener('click',e=>{
  if(e.target.closest('[data-openfilm]')){e.preventDefault();open()}
  if(e.target.id==='replay'){t=0;cur=-1;render();play()}
  if(e.target.id==='seeSite'){close();const c=document.getElementById('courses');c&&c.scrollIntoView({behavior:'smooth'})}
});
/* ---- starfield ---- */
const cv=$('#fbg'),cx=cv.getContext('2d');let pts=[],sraf=0,sOn=false;
const stars={start(){sOn=true;resize();pts=Array.from({length:110},()=>({x:Math.random(),y:Math.random(),z:Math.random()*.9+.1}));draw()},stop(){sOn=false;cancelAnimationFrame(sraf)}};
function resize(){cv.width=innerWidth;cv.height=innerHeight}addEventListener('resize',()=>sOn&&resize());
function draw(){if(!sOn)return;cx.clearRect(0,0,cv.width,cv.height);const k=performance.now()/1000;
  pts.forEach(p=>{const y=(p.y+k*.02*p.z)%1,x=p.x+Math.sin(k*.2+p.y*6)*.01;cx.fillStyle=`rgba(${p.z>.6?'46,230,166':'139,124,255'},${.2+p.z*.5})`;cx.beginPath();cx.arc(x*cv.width,y*cv.height,p.z*2.2,0,7);cx.fill()});
  sraf=requestAnimationFrame(draw)}
render();
window.__filmSeek=x=>{t=x;cur=-1;render()};window.__filmTotal=total;
/* hero 3D tilt */
const hs=$('.stage3d');if(hs){const st=$('.stack',hs);hs.addEventListener('mousemove',e=>{const r=hs.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;st.style.transform=`rotateY(${x*30}deg) rotateX(${-y*20}deg)`});hs.addEventListener('mouseleave',()=>st.style.transform='')}
})();
