/* ============================================================
   MOTEUR SIAM — repris tel quel de « Siam Family » (version qui a
   marché). Seuls ajouts : téléchargement, cause d'échec visible,
   progression en %, galerie mémorisée.
   ============================================================ */
var API_BASE='https://apihub.agnes-ai.com/v1';
var POLL_BASE='https://apihub.agnes-ai.com/agnesapi';
var MODEL='agnes-video-v2.0';
var MODEL_25F='agnes-video-2.5-flash';
var ENGINE_STORAGE='siam_video_engine';
var KEY_STORAGE='siam_family_key';
var GAL_STORAGE='siam_video_gallery';

var EPISODES=[
{id:'cooking',em:'🍜',nm:'Cuisine',ds:'Repas thaï en famille',p:'Family cooking scene in a Thai kitchen. The boy helps his mother prepare traditional Thai food. Father chops vegetables. Dog watches. Steam rises from the wok. Warm golden light, Disney/Pixar premium animation. Preserve exact character identity, face, pose, clothing.'},
{id:'beach',em:'🏖️',nm:'Plage',ds:'Journée à la mer',p:'Family day at a Thai tropical beach. Turquoise water, white sand, palm trees. The boy plays with his dog in the waves. Elephant splashes happily. Warm sunset light, Disney/Pixar premium. Preserve exact character identity and pose.'},
{id:'temple',em:'🛕',nm:'Temple',ds:'Visite sacrée',p:'Family visit to a golden Thai temple. Ornate architecture, monks in orange robes, incense. The boy respectfully wai-s. Soft morning light, spiritual atmosphere, Disney/Pixar premium. Preserve exact character identity and pose.'},
{id:'jungle',em:'🌿',nm:'Jungle',ds:'Aventure tropicale',p:'Family jungle adventure in Thailand. Lush forest, waterfall, exotic birds. The boy leads with his dog. Elephant carries supplies. Dappled sunlight, Disney/Pixar premium. Preserve exact character identity and pose.'},
{id:'market',em:'🛶',nm:'Marché flottant',ds:'Balade en bateau',p:'Family boat ride at a Thai floating market. Colorful longtail boats, tropical fruits, vendors. The boy points excitedly. Warm daylight, Disney/Pixar premium. Preserve exact character identity and pose.'},
{id:'festival',em:'💦',nm:'Songkran',ds:'Fête de l\'eau',p:'Thai Songkran water festival. Family splashing water joyfully, colorful traditional clothing, bright sunlight, laughter. Elephant sprays water. Festive Disney/Pixar premium. Preserve exact character identity and pose.'},
{id:'muaythai',em:'🥊',nm:'Muay Thaï',ds:'Leçon de combat',p:'Father teaches the boy traditional Muay Thai in the family garden. Wai Kru respect, slow deliberate movement. Dog watches. Warm afternoon light, Disney/Pixar premium. Preserve exact character identity and pose.'},
{id:'farm',em:'🌾',nm:'Rizières',ds:'Travail aux champs',p:'Family working in a Thai rice paddy. Emerald fields, water buffalo, warm sun. The boy plants rice with parents. Elephant grazes. Golden hour, Disney/Pixar premium. Preserve exact character identity and pose.'},
{id:'night',em:'🌙',nm:'Veillée',ds:'Soirée étoilée',p:'Family evening under Thai stars. Lanterns, fireflies, warm blanket. The boy listens to grandmother stories. Dog sleeps at his feet. Elephant rests. Magical night, Disney/Pixar premium. Preserve exact character identity and pose.'},
{id:'rain',em:'🌧️',nm:'Mousson',ds:'Pluie tropicale',p:'Tropical monsoon rain in Thailand. Family sheltered on a wooden veranda watching rain. Warm tea, cozy. Boy jumps in puddles. Rainy Disney/Pixar premium. Preserve exact character identity and pose.'}
];

var STYLES=[
{id:'disney',em:'✨',nm:'Disney Premium',ds:'3D cinématique',p:'Premium Disney animated feature film style, high-end 3D computer animation, cinematic lighting, expressive characters, luxurious color grading, feature-film quality. Characters must remain IDENTICAL to source image.'},
{id:'pixar',em:'🎬',nm:'Pixar Premium',ds:'3D Pixar',p:'Premium Pixar animated feature film style, high-end 3D rendering, cinematic depth of field, dramatic lighting, award-winning animation. Characters must remain IDENTICAL to source image.'},
{id:'ghibli',em:'🌿',nm:'Ghibli',ds:'Anime poétique',p:'Studio Ghibli hand-painted anime style, warm nostalgic atmosphere, lush natural backgrounds, feature-film quality. Characters must remain IDENTICAL to source image.'},
{id:'dreamworks',em:'🐉',nm:'DreamWorks',ds:'Grande aventure',p:'DreamWorks animated feature style, epic adventure atmosphere, dynamic lighting, feature-film quality. Characters must remain IDENTICAL to source image.'},
{id:'illumination',em:'🎈',nm:'Illumination',ds:'Coloré joyeux',p:'Illumination Entertainment animated style, bright cheerful colors, playful atmosphere, feature-film quality. Characters must remain IDENTICAL to source image.'},
{id:'thai',em:'🇹🇭',nm:'Siam Premium',ds:'Fusion thaï premium',p:'Thai animated feature premium style, fusion of Disney quality with Thai cultural aesthetics, golden temples, tropical colors, cinematic lighting. Characters must remain IDENTICAL to source image.'},
{id:'claymation',em:'🧱',nm:'Claymation',ds:'Pâte à modeler',p:'Aardman claymation stop-motion style, plasticine texture, warm studio lighting, charming handmade quality. Characters must remain IDENTICAL to source image.'},
{id:'watercolor',em:'🎨',nm:'Aquarelle',ds:'Peinture douce',p:'Delicate watercolor painting animation, soft bleeding colors, textured paper, poetic atmosphere. Characters must remain IDENTICAL to source image.'},
{id:'bw',em:'⚫',nm:'Noir & Blanc',ds:'Classique élégant',p:'Elegant black and white animated film, high contrast monochrome, classic cinema quality. Characters must remain IDENTICAL to source image.'},
{id:'magic',em:'🌟',nm:'Magie Douce',ds:'Ambiance féérique',p:'Magical fairy-tale animated film, soft glowing particles, enchanted atmosphere, warm dreamy light. Characters must remain IDENTICAL to source image.'}
];

var S={imgs:[],running:false,stop:false,queue:[],done:0,failed:0,style:'disney',ep:'cooking',prompt:'',frame:'wide',intensity:'subtle',frames:153,engine:'v2',mode:'single'};
var MODE_STORAGE='siam_video_mode';
try{var _m=localStorage.getItem(MODE_STORAGE);if(_m==='single'||_m==='sequence')S.mode=_m}catch(e){}
try{var _e=localStorage.getItem(ENGINE_STORAGE);if(_e==='25f'||_e==='v2')S.engine=_e}catch(e){}

function $(id){return document.getElementById(id)}
function getKey(){try{return (localStorage.getItem(KEY_STORAGE)||'').trim()}catch(e){return ''}}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}

var toastTimer;
function toast(m,t){t=t||'ok';var el=$('toast');el.className='toast '+t;el.textContent=m;requestAnimationFrame(function(){el.classList.add('on')});clearTimeout(toastTimer);toastTimer=setTimeout(function(){el.classList.remove('on')},3200)}

function updateApi(){var k=getKey();var p=$('apiPanel');var st=$('apiStatus');var tx=$('apiText');var inp=$('apiKey');
if(k){p.classList.add('ok');st.classList.add('ok');tx.textContent='Clé active · '+k.slice(0,8)+'…'+k.slice(-4);inp.value=k}
else{p.classList.remove('ok');st.classList.remove('ok');tx.textContent='Aucune clé API';inp.value=''}
updateGenBtn()}

function updateGenBtn(){var b=$('genBtn');var hasI=S.imgs.length>0;var hasK=!!getKey();
var seq=S.mode==='sequence';var n=seq?Math.max(0,S.imgs.length-1):S.imgs.length;
b.disabled=!n||!hasK||S.running;
if(S.running){b.textContent='Création… ('+(S.done+S.failed)+'/'+S.queue.length+')'}
else if(!hasK){b.textContent='Ajoutez votre clé API'}
else if(!hasI){b.textContent='Ajoutez des images'}
else if(seq&&S.imgs.length<2){b.textContent='Ajoutez au moins 2 images (plan séquence)'}
else if(seq){b.textContent='🎬 Créer '+n+' clip'+(n>1?'s':'')+' · plan séquence'}
else{b.textContent='✨ Créer '+n+' plan'+(n>1?'s':'')}
var mn=$('modeNote');if(mn)mn.textContent=seq?(S.imgs.length>=2?S.imgs.length+' images → '+n+' clips enchaînés : chaque image est la fin d\'un clip et le début du suivant.':'Chaque image est la fin d\'un clip et le début du suivant. Il faut au moins 2 images, dans l\'ordre.'):'Chaque image devient un plan séparé.'}

function fileUri(f){return new Promise(function(ok,ko){var r=new FileReader();r.onload=function(e){ok(e.target.result)};r.onerror=ko;r.readAsDataURL(f)})}
function thumb(u){return new Promise(function(ok){var i=new Image();i.onload=function(){try{var c=document.createElement('canvas');c.width=200;c.height=Math.round(200*i.height/i.width);c.getContext('2d').drawImage(i,0,0,c.width,c.height);ok(c.toDataURL('image/jpeg',.7))}catch(e){ok(u)}};i.onerror=function(){ok(u)};i.src=u})}

async function addFiles(fs){var arr=Array.prototype.slice.call(fs).filter(function(f){return f.type.indexOf('image/')===0});
var skipped=0;
for(var i=0;i<arr.length;i++){if(arr[i].size>12*1024*1024){skipped++;continue}
var u=await fileUri(arr[i]);var t=await thumb(u);S.imgs.push({dataUri:u,thumbnail:t,id:Date.now()+Math.random()})}
renderImgs();updateGenBtn();
if(skipped)toast(skipped+' image(s) trop lourde(s) (> 12 Mo) ignorée(s)','wn');
else toast(S.imgs.length+' image'+(S.imgs.length>1?'s':''),'ok')}

function renderImgs(){var g=$('imagesGrid');var h='';
for(var i=0;i<S.imgs.length;i++){var im=S.imgs[i];
h+='<div class="card"><div class="num">'+(i+1)+'</div><img src="'+(im.thumbnail||im.dataUri)+'" alt="">'+
'<button class="rm" data-rm="'+im.id+'" aria-label="Retirer">✕</button></div>'}
g.innerHTML=h;
g.querySelectorAll('[data-rm]').forEach(function(b){b.onclick=function(e){e.stopPropagation();
if(S.running){toast('Attends la fin de la création','wn');return}
S.imgs=S.imgs.filter(function(i){return i.id!==parseFloat(b.dataset.rm)});renderImgs();updateGenBtn()}});
var c=$('imgCount');if(c)c.textContent=S.imgs.length?S.imgs.length+' image'+(S.imgs.length>1?'s':''):''}

function renderOpts(){var ep=$('epGrid');var st=$('stGrid');var h='',h2='';
for(var i=0;i<EPISODES.length;i++){var e=EPISODES[i];
h+='<div class="opt '+(S.ep===e.id?'sel':'')+'" data-ep="'+e.id+'" role="button" tabindex="0"><div class="em">'+e.em+'</div><div><div class="nm">'+e.nm+'</div><div class="ds">'+e.ds+'</div></div></div>'}
for(var j=0;j<STYLES.length;j++){var s=STYLES[j];
h2+='<div class="opt '+(S.style===s.id?'sel':'')+'" data-st="'+s.id+'" role="button" tabindex="0"><div class="em">'+s.em+'</div><div><div class="nm">'+s.nm+'</div><div class="ds">'+s.ds+'</div></div></div>'}
ep.innerHTML=h;st.innerHTML=h2;
ep.querySelectorAll('[data-ep]').forEach(function(b){b.onclick=function(){S.ep=b.dataset.ep;renderOpts()}});
st.querySelectorAll('[data-st]').forEach(function(b){b.onclick=function(){S.style=b.dataset.st;renderOpts()}});
var epN=$('epName'),stN=$('stName');
if(epN){var ee=EPISODES.filter(function(e){return e.id===S.ep})[0];epN.textContent=ee?ee.em+' '+ee.nm:''}
if(stN){var ss=STYLES.filter(function(s){return s.id===S.style})[0];stN.textContent=ss?ss.em+' '+ss.nm:''}}

function buildPrompt(){var ep=EPISODES.filter(function(e){return e.id===S.ep})[0];
var st=STYLES.filter(function(s){return s.id===S.style})[0];var p=[];
if(S.mode==='sequence')p.push('The first image is the EXACT first frame and the second image is the EXACT last frame of this shot of a premium Thai animated series. Animate a smooth, continuous, natural transition between them: one continuous camera move, no cut, no fade. Characters must remain IDENTICAL: same faces, clothing and identity.');
else p.push('Animate this exact image as the starting frame of a premium Thai animated series. The subject must remain IDENTICAL: same face, expression, clothing, pose, identity. Preserve exact composition.');
if(ep)p.push(ep.p);
if(st)p.push(st.p);
if(S.prompt&&S.prompt.trim())p.push('Artistic direction: '+S.prompt.trim());
if(S.frame==='close')p.push('extreme close-up framing');
else if(S.frame==='medium')p.push('medium shot, subject from waist up');
else if(S.frame==='wide')p.push('wide shot, environment visible');
if(S.intensity==='subtle')p.push('very subtle movement, gentle animation');
else if(S.intensity==='moderate')p.push('moderate movement, balanced energy');
else if(S.intensity==='strong')p.push('strong dynamic movement, energetic');
p.push('Portrait 9:16 vertical, 24fps, no text, no watermarks, consistent character design');
return p.join('. ')}

/* --- Appels Agnes : identiques à Siam Family --- */
/* Le moteur 2.5 renvoie parfois un identifiant « emballé » (video_ + base64) : on extrait le vrai. */
function realVideoId(id){if(!id||id.indexOf('video_')!==0)return id;var b=id.slice(6);if(b.length<50)return id;
try{var std=b.replace(/-/g,'+').replace(/_/g,'/');while(std.length%4)std+='=';var m=atob(std).match(/video_id:(video_[A-Za-z0-9]+)/);return m?m[1]:id}catch(e){return id}}

/* Envoi avec nouvel essai automatique si la file Agnes est pleine (toutes les 60 s, ~1 h max). */
async function postVideo(body,onQueueWait){var r,e,tries=0;
while(true){
r=await fetch(API_BASE+'/videos',{method:'POST',headers:{'Authorization':'Bearer '+getKey(),'Content-Type':'application/json'},body:JSON.stringify(body)});
if(r.ok)return r.json();
e=await r.text();
if((r.status===503||r.status===429)&&/queue_full|queue is full|busy|overload|rate/i.test(e)&&tries<60){tries++;
for(var w=60;w>0;w--){if(S.stop)throw new Error('Arrêt');onQueueWait&&onQueueWait(tries,w);await sleep(1000)}continue}
throw new Error('HTTP '+r.status+' '+e.slice(0,140))}}

/* uri = photo de départ ; uri2 = photo de fin (mode Plan séquence) */
async function createTask(uri,prompt,onQueueWait,uri2){
var d;
if(S.engine==='25f'){
var secs=S.frames>=241?'10':(S.frames<=121?'5':'6');
var b25={model:MODEL_25F,prompt:prompt,mode:'keyframe',first_frame:uri,seconds:secs,size:'720P',aspect_ratio:'9:16'};
if(uri2)b25.last_frame=uri2;
d=await postVideo(b25,onQueueWait);
var id5=d.video_id||d.id||d.task_id;if(!id5)throw new Error('Pas de video_id');return realVideoId(id5)}
var body;
if(uri2){/* v2.0 keyframes : image de début + image de fin (comme l'app « Plan Séquence » de référence) */
body={model:MODEL,prompt:prompt,num_frames:S.frames,frame_rate:24,extra_body:{image:[uri,uri2],mode:'keyframes'}}}
else{body={model:MODEL,prompt:prompt,image:uri,num_frames:S.frames,frame_rate:24}}
d=await postVideo(body,onQueueWait);
var id=d.video_id||d.id||d.task_id;
if(!id)throw new Error('Pas de video_id');return id}

async function pollTask(id,onProg){var withModel=!(S.mode==='sequence'&&S.engine!=='25f');for(var i=0;i<100;i++){if(S.stop)throw new Error('Arrêt');
if(i>0)for(var w=8;w>0;w--){if(S.stop)throw new Error('Arrêt');await sleep(1000)}
var u=POLL_BASE+'?video_id='+encodeURIComponent(id)+(withModel?'&model_name='+encodeURIComponent(S.engine==='25f'?MODEL_25F:MODEL):'');
var r=await fetch(u,{headers:{'Authorization':'Bearer '+getKey()}});
if(!r.ok&&r.status!==429){withModel=!withModel;continue}
var d={};try{d=await r.json()}catch(e){}
var st=d.status||'';
var pr=d.progress||0;onProg(pr,st);
if(st==='completed'||st==='succeeded'||st==='done'){var url=(d.metadata&&d.metadata.url)||d.url||(d.output&&d.output.url)||d.remixed_from_video_id;if(!url)throw new Error('Terminé mais pas de lien vidéo');return url}
if(st==='failed'||st==='error'){var why=(d.error&&(d.error.message||d.error))||d.message||st;throw new Error('Agnes : '+(typeof why==='string'?why:JSON.stringify(why)).slice(0,140))}}
throw new Error('Délai dépassé (13 min)')}

function sleep(ms){return new Promise(function(r){setTimeout(r,ms)})}

function renderQueue(){var q=$('queue');if(!S.queue.length){q.style.display='none';return}
q.style.display='block';var h='';var done=S.done+S.failed;var total=S.queue.length;
h+='<div class="qhead"><span>Progression</span><strong>'+done+'/'+total+'</strong></div>';
for(var i=0;i<S.queue.length;i++){var it=S.queue[i];var ic='○',tx='En attente',cls='',pct=0;
if(it.status==='proc'){ic='◐';tx=it.progress||'En cours';cls='proc';pct=it.pct||5}
else if(it.status==='done'){ic='●';tx='Terminé ✓';cls='done';pct=100}
else if(it.status==='fail'){ic='✕';tx=it.progress||'Échec';cls='fail'}
else if(it.status==='create'){ic='◐';tx=it.progress||'Envoi à Agnes…';cls='proc';pct=2}
h+='<div class="qi '+cls+'"><img class="qth" src="'+it.img.thumbnail+'" alt="">'+(it.img2?'<span class="qarrow">→</span><img class="qth" src="'+it.img2.thumbnail+'" alt="">':'')+'<div class="qmain"><div class="qrow"><span class="qn">'+(it.img2?'Clip '+(i+1)+' · image '+(i+1)+' → '+(i+2):'Plan '+(i+1))+'</span><span class="qic">'+ic+'</span></div>'+
'<div class="qbar"><i style="width:'+pct+'%"></i></div><div class="qs">'+esc(tx)+'</div></div></div>'}
q.innerHTML=h}

/* --- Galerie : construite une seule fois par vidéo (jamais rafraîchie) --- */
function loadGal(){try{var g=JSON.parse(localStorage.getItem(GAL_STORAGE)||'[]');return Array.isArray(g)?g:[]}catch(e){return []}}
function saveGal(list){try{localStorage.setItem(GAL_STORAGE,JSON.stringify(list.slice(0,50)))}catch(e){}}

function addGallery(url,label,persist){var g=$('gallery');var gg=$('galGrid');
g.style.display='block';var d=document.createElement('div');d.className='gi';
d.innerHTML='<video controls preload="metadata" playsinline><source src="'+esc(url)+'" type="video/mp4"></video>'+
'<div class="cap"><span>'+esc(label)+'</span></div>'+
'<div class="gact"><button type="button" class="dl">⬇️ Télécharger</button><button type="button" class="lk">🔗 Lien</button></div>';
d.querySelector('.dl').onclick=function(){downloadVideo(url,this)};
d.querySelector('.lk').onclick=function(){copyLink(url)};
gg.insertBefore(d,gg.firstChild);
if(persist){var list=loadGal();list.unshift({url:url,label:label,t:Date.now()});saveGal(list)}
var c=$('galCount');if(c)c.textContent=gg.children.length+' vidéo'+(gg.children.length>1?'s':'')}

function copyLink(url){if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(url).then(function(){toast('Lien copié ✓','ok')},function(){prompt('Copie ce lien :',url)})}else{prompt('Copie ce lien :',url)}}

async function downloadVideo(url,btn){var old=btn.textContent;btn.disabled=true;btn.textContent='⏳ …';
var name='siam-video-'+Date.now()+'.mp4';
try{var r=await fetch(url);if(!r.ok)throw new Error('HTTP '+r.status);var b=await r.blob();
var f=new File([b],name,{type:'video/mp4'});
if(navigator.canShare&&navigator.share&&navigator.canShare({files:[f]})){
try{await navigator.share({files:[f],title:name});toast('Choisis « Enregistrer la vidéo »','ok');return}catch(e){if(e&&e.name==='AbortError')return}}
var o=URL.createObjectURL(b);var a=document.createElement('a');a.href=o;a.download=name;document.body.appendChild(a);a.click();a.remove();
setTimeout(function(){URL.revokeObjectURL(o)},60000);toast('Téléchargement lancé ✓','ok')}
catch(e){var w=null;try{w=window.open(url,'_blank')}catch(x){}
if(!w){location.href=url}
toast('Vidéo ouverte : appuie sur Partager → Enregistrer la vidéo (ou clic droit → Enregistrer)','wn')}
finally{btn.disabled=false;btn.textContent=old}}

function setStatus(t){var b=$('statusBar');var x=$('statusTxt');
if(t){b.classList.add('on');x.textContent=t}else{b.classList.remove('on')}}

/* --- Anti-veille (garde l'écran allumé pendant la création) --- */
var wakeLock=null;
async function keepAwake(){try{if('wakeLock' in navigator)wakeLock=await navigator.wakeLock.request('screen')}catch(e){}}
function releaseAwake(){try{if(wakeLock)wakeLock.release()}catch(e){}wakeLock=null}
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'&&S.running&&!wakeLock)keepAwake()});

async function processOne(item,idx){try{item.status='create';item.progress='Envoi à Agnes…';renderQueue();
var p=buildPrompt();var id=await createTask(item.img.dataUri,p,function(n,w){item.progress='File Agnes pleine · nouvel essai n°'+n+' dans '+w+' s';renderQueue();setStatus('File Agnes pleine (serveurs saturés) · Plan '+(idx+1)+' : nouvel essai dans '+w+' s')},item.img2&&item.img2.dataUri);item.taskId=id;
item.status='proc';item.progress='Animation en cours…';item.start=Date.now();renderQueue();
var url=await pollTask(id,function(pr,st){item.pct=Math.max(5,Math.min(99,pr||0));var m=Math.floor((Date.now()-item.start)/60000);
item.progress=(st==='queued'?'Dans la file Agnes':'Animation')+'… '+(pr||0)+'%'+(m?' · '+m+' min':'');renderQueue()});
item.status='done';S.done++;renderQueue();updateGenBtn();
addGallery(url,(item.img2?'Clip ':'Plan ')+(idx+1)+' · '+new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}),true);
toast('Plan '+(idx+1)+' terminé ✓','ok');
}catch(e){if(e.message==='Arrêt'){item.status='fail';item.progress='Arrêté'}else{item.status='fail';item.progress=e.message||'Échec';S.failed++;toast('Plan '+(idx+1)+' : '+(e.message||'échec'),'err')}
renderQueue();updateGenBtn()}}

async function startGen(){if(S.running||!S.imgs.length)return;if(!getKey()){toast('Ajoutez une clé API','err');return}
S.running=true;S.stop=false;S.done=0;S.failed=0;
S.prompt=$('mainPrompt').value.trim();
if(S.mode==='sequence'){S.queue=[];for(var k=0;k<S.imgs.length-1;k++)S.queue.push({img:S.imgs[k],img2:S.imgs[k+1],status:'pending',progress:null,taskId:null})}
else S.queue=S.imgs.map(function(im,i){return{img:im,status:'pending',progress:null,taskId:null}});
if(!S.queue.length){S.running=false;toast('Ajoute au moins 2 images pour un plan séquence','wn');updateGenBtn();return}
$('stopBtn').style.display='block';$('stopBtn').onclick=function(){S.stop=true;toast('Arrêt demandé','wn')};
$('genBtn').disabled=true;renderQueue();updateGenBtn();keepAwake();
var qa=$('queueAnchor');if(qa&&qa.scrollIntoView)qa.scrollIntoView({behavior:'smooth',block:'start'});
var tasks=[];
for(var i=0;i<S.queue.length;i++){if(S.stop)break;
var t=processOne(S.queue[i],i);tasks.push(t);
if(i<S.queue.length-1&&!S.stop){for(var w=62;w>0;w--){if(S.stop)break;setStatus('Pause Agnes (1 plan / min) · Plan '+(i+2)+'/'+S.queue.length+' dans '+w+' s');await sleep(1000)}}}
setStatus('Animation en cours… garde la page ouverte');
await Promise.all(tasks);
setStatus('✦ '+(S.done)+'/'+S.queue.length+' plans créés ✦');
await sleep(3000);setStatus(null);
S.running=false;S.stop=false;releaseAwake();
$('stopBtn').style.display='none';updateGenBtn();
toast(S.done+' plan'+(S.done>1?'s':'')+' créé'+(S.done>1?'s':''),S.done?'ok':'err')}

$('apiSave').onclick=function(){var k=$('apiKey').value.trim().replace(/^Bearer\s+/i,'');
if(!k){try{localStorage.removeItem(KEY_STORAGE)}catch(e){}updateApi();toast('Clé supprimée','wn');return}
try{localStorage.setItem(KEY_STORAGE,k);updateApi();toast('Clé enregistrée ✓','ok')}catch(e){toast('Erreur','err')}};
$('apiKey').onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();$('apiSave').click()}};

$('uploadZone').onclick=function(e){if(e.target.id!=='fileInput')$('fileInput').click()};
$('fileInput').onchange=function(e){addFiles(e.target.files);e.target.value=''};
var uz=$('uploadZone');
['dragenter','dragover'].forEach(function(ev){uz.addEventListener(ev,function(e){e.preventDefault();uz.classList.add('over')})});
['dragleave','drop'].forEach(function(ev){uz.addEventListener(ev,function(e){e.preventDefault();uz.classList.remove('over')})});
uz.addEventListener('drop',function(e){if(e.dataTransfer&&e.dataTransfer.files)addFiles(e.dataTransfer.files)});

$('mainPrompt').oninput=function(e){S.prompt=e.target.value};
$('durSel').onchange=function(e){S.frames=parseInt(e.target.value,10)};
$('frSel').onchange=function(e){S.frame=e.target.value};
$('inSel').onchange=function(e){S.intensity=e.target.value};
var ms=$('modeSel');if(ms){ms.value=S.mode;ms.onchange=function(e){if(S.running){e.target.value=S.mode;toast('Attends la fin de la création','wn');return}S.mode=e.target.value;try{localStorage.setItem(MODE_STORAGE,S.mode)}catch(x){}updateGenBtn()}}
var eng=$('engSel');if(eng){eng.value=S.engine;eng.onchange=function(e){if(S.running){e.target.value=S.engine;toast('Attends la fin de la création','wn');return}S.engine=e.target.value;try{localStorage.setItem(ENGINE_STORAGE,S.engine)}catch(x){}
toast(S.engine==='25f'?'Moteur 2.5 Flash : vertical + son':'Moteur v2.0 classique','ok')}}
$('genBtn').onclick=startGen;
var cg=$('clearGal');if(cg)cg.onclick=function(){if(!confirm('Vider la galerie ?'))return;saveGal([]);$('galGrid').innerHTML='';$('gallery').style.display='none';var c=$('galCount');if(c)c.textContent=''};

updateApi();renderOpts();renderImgs();
loadGal().slice().reverse().forEach(function(v){addGallery(v.url,v.label,false)});
