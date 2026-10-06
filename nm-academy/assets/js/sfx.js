/* NM Academy — design sonore UI (Web Audio, synthèse, aucun fichier, aucune musique).
   v2 : chaîne master (réverbération + compresseur), frappes « clavier mécanique » douces, taps « verre », whoosh stéréo,
   carillons FM, montée de démarrage avec sub. Activé seulement après un geste de l'utilisateur. */
(function(){
var ctx=null,on=false,last={},bus=null,rev=null,MUTE_KEY='nm_sfx';
on=true;try{var _s=localStorage.getItem(MUTE_KEY);if(_s!==null)on=_s==='1'}catch(e){}
var PENT=[1046.5,1174.7,1318.5,1568,1760,2093,2349.3,2637];
function mk(c){
 var master=c.createGain();master.gain.value=1.3;
 var comp=c.createDynamicsCompressor();comp.threshold.value=-16;comp.ratio.value=4;comp.attack.value=.003;comp.release.value=.2;
 var dry=c.createGain();dry.gain.value=1;var wet=c.createGain();wet.gain.value=.42;
 var conv=c.createConvolver();
 // réponse impulsionnelle générée : bruit stéréo décroissant, lissé (réverb douce type "hall" court)
 var len=Math.floor(c.sampleRate*1.5),ir=c.createBuffer(2,len,c.sampleRate);
 for(var ch=0;ch<2;ch++){var d=ir.getChannelData(ch),prev=0;for(var i=0;i<len;i++){var n=Math.random()*2-1;prev=prev*.55+n*.45;d[i]=prev*Math.pow(1-i/len,3.2)*(i<c.sampleRate*.012?i/(c.sampleRate*.012):1)}}
 conv.buffer=ir;
 var hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=220;
 dry.connect(comp);wet.connect(conv);conv.connect(hp);hp.connect(comp);comp.connect(master);master.connect(c.destination);
 return{dry:dry,wet:wet,master:master};
}
function ac(){if(!ctx){var C=window.AudioContext||window.webkitAudioContext;if(!C)return null;ctx=new C();bus=mk(ctx)}if(ctx.state==='suspended')ctx.resume();return ctx}
function gate(name,ms){var n=performance.now();if(last[name]&&n-last[name]<ms)return false;last[name]=n;return true}
function R(a,b){return a+Math.random()*(b-a)}
function route(a,node,send,pan){var g=a.createGain();g.gain.value=1;var out=g;if(a.createStereoPanner&&pan){var p=a.createStereoPanner();p.pan.value=pan;g.connect(p);out=p}
 node.connect(g);out.connect(bus.dry);if(send){var s=a.createGain();s.gain.value=send;out.connect(s);s.connect(bus.wet)}}
function tone(o){var a=ac();if(!a)return;var t=a.currentTime+(o.at||0);
 var os=a.createOscillator(),g=a.createGain(),f=a.createBiquadFilter();os.type=o.type||'sine';os.frequency.setValueAtTime(o.f,t);if(o.f2)os.frequency.exponentialRampToValueAtTime(o.f2,t+(o.fd||o.d));
 f.type='lowpass';f.frequency.value=o.lp||8000;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(o.v,t+(o.a||.004));g.gain.exponentialRampToValueAtTime(.0001,t+o.d);
 os.connect(f);f.connect(g);route(a,g,o.send||0,o.pan);os.start(t);os.stop(t+o.d+.05)}
function fm(o){var a=ac();if(!a)return;var t=a.currentTime+(o.at||0);
 var c=a.createOscillator(),m=a.createOscillator(),mg=a.createGain(),g=a.createGain();c.type='sine';m.type='sine';c.frequency.value=o.f;m.frequency.value=o.f*(o.ratio||2.01);
 mg.gain.setValueAtTime(o.f*(o.idx||1.6),t);mg.gain.exponentialRampToValueAtTime(.01,t+o.d*.8);m.connect(mg);mg.connect(c.frequency);
 g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(o.v,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+o.d);c.connect(g);route(a,g,o.send==null?.5:o.send,o.pan);
 c.start(t);m.start(t);c.stop(t+o.d+.05);m.stop(t+o.d+.05)}
var nbuf=null;
function noiseBuf(a){if(!nbuf||nbuf.sampleRate!==a.sampleRate){nbuf=a.createBuffer(1,a.sampleRate*2,a.sampleRate);var d=nbuf.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=Math.random()*2-1}return nbuf}
function burst(o){var a=ac();if(!a)return;var t=a.currentTime+(o.at||0),s=a.createBufferSource();s.buffer=noiseBuf(a);s.loop=true;
 var f=a.createBiquadFilter();f.type=o.ft||'bandpass';f.Q.value=o.q||1.4;f.frequency.setValueAtTime(o.f1,t);if(o.f2)f.frequency.exponentialRampToValueAtTime(o.f2,t+o.d);
 var g=a.createGain();var sw=o.swell;g.gain.setValueAtTime(sw?.0001:o.v,t);if(sw){g.gain.exponentialRampToValueAtTime(o.v,t+o.d*sw)}g.gain.exponentialRampToValueAtTime(.0001,t+o.d);
 s.connect(f);f.connect(g);route(a,g,o.send||0,o.pan);s.start(t,Math.random()*1.5);s.stop(t+o.d+.05)}
var S={
 get on(){return on},
 set:function(v){on=!!v;try{localStorage.setItem(MUTE_KEY,on?'1':'0')}catch(e){}if(on){ac();S.ok()}},
 /* frappe de clavier mécanique douce : clic bruité + « thock » grave */
 key:function(at){if(!on||(at==null&&!gate('key',24)))return;var p=R(-.28,.28),f=R(1700,3100);
  burst({f1:f,q:2.2,d:.022,v:.1,ft:'bandpass',at:at,pan:p,send:.1});tone({f:R(170,250),f2:90,d:.05,v:.075,type:'sine',lp:700,at:at,pan:p})},
 /* blip de données : pentatonique cristalline */
 tick:function(at){if(!on||(at==null&&!gate('tick',34)))return;var f=PENT[Math.floor(Math.random()*PENT.length)];tone({f:f,d:.07,v:.05,type:'triangle',lp:7000,send:.45,at:at,pan:R(-.4,.4)});tone({f:f*2,d:.03,v:.012,type:'sine',at:at})},
 /* tap « verre » : impact net + corps grave */
 click:function(at){if(!on||(at==null&&!gate('click',60)))return;burst({f1:5200,q:.8,d:.018,v:.06,ft:'highpass',at:at});tone({f:1250,f2:640,d:.07,v:.08,type:'sine',send:.35,at:at});tone({f:130,f2:70,d:.09,v:.1,type:'sine',lp:500,at:at})},
 /* survol : souffle aérien très discret */
 hover:function(at){if(!on||(at==null&&!gate('hover',110)))return;burst({f1:6500,f2:9000,q:.7,d:.06,v:.014,ft:'highpass',at:at,send:.25,pan:R(-.5,.5)});tone({f:3100,d:.02,v:.006,type:'sine',at:at})},
 /* curseur : hauteur liée à la valeur (0..1) */
 slide:function(v,at){if(!on||(at==null&&!gate('slide',40)))return;v=typeof v==='number'?v:Math.random();tone({f:520+v*900,d:.05,v:.04,type:'triangle',lp:5000,send:.3,at:at})},
 /* whoosh stéréo : souffle filtré + swell grave */
 whoosh:function(at){if(!on||(at==null&&!gate('whoosh',280)))return;var d=.55;burst({f1:300,f2:5200,q:.9,d:d,v:.11,swell:.55,send:.5,at:at,pan:-.4});burst({f1:5200,f2:260,q:.9,d:d*1.1,v:.06,swell:.4,send:.5,at:at,pan:.4});tone({f:60,f2:34,d:d,v:.07,type:'sine',lp:300,a:.18,at:at})},
 /* succès : carillon FM à deux notes + réverb */
 ok:function(at){if(!on)return;at=at||0;fm({f:880,d:.32,v:.07,idx:1.4,at:at});fm({f:1318.5,d:.5,v:.065,idx:1.2,at:at+.09});fm({f:1760,d:.7,v:.03,idx:.9,at:at+.18})},
 deny:function(){if(!on)return;tone({f:220,f2:150,d:.18,v:.09,type:'sawtooth',lp:900,send:.2});tone({f:165,f2:110,d:.22,v:.07,type:'sawtooth',lp:700,at:.07})},
 /* démarrage : montée filtrée + impact sub + éclat */
 boot:function(){if(!on)return;var a=ac();if(!a)return;
  var t=a.currentTime,os=a.createOscillator(),os2=a.createOscillator(),f=a.createBiquadFilter(),g=a.createGain();
  os.type='sawtooth';os2.type='sawtooth';os.frequency.setValueAtTime(55,t);os.frequency.exponentialRampToValueAtTime(330,t+1.25);os2.frequency.setValueAtTime(55.6,t);os2.frequency.exponentialRampToValueAtTime(332,t+1.25);
  f.type='lowpass';f.Q.value=6;f.frequency.setValueAtTime(180,t);f.frequency.exponentialRampToValueAtTime(5200,t+1.25);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.07,t+.9);g.gain.exponentialRampToValueAtTime(.0001,t+1.4);
  os.connect(f);os2.connect(f);f.connect(g);route(a,g,.5,0);os.start(t);os2.start(t);os.stop(t+1.5);os2.stop(t+1.5);
  tone({f:62,f2:32,d:.9,v:.22,type:'sine',lp:240,a:.01,at:1.22});burst({f1:2200,f2:9000,q:.6,d:.5,v:.09,ft:'highpass',send:.6,at:1.22});fm({f:1318.5,d:.9,v:.05,idx:1.6,at:1.26});fm({f:1976,d:1.1,v:.035,idx:1.2,at:1.34})}
};
/* déverrouillage : le navigateur n'autorise l'audio qu'après un geste → au premier clic/touche/tap on prépare le contexte */
S.unlock=function(){if(on)ac()};
['pointerdown','keydown','touchstart'].forEach(function(ev){addEventListener(ev,function h(){if(on){ac();if(ctx&&ctx.state==='running'){removeEventListener(ev,h)}}},{passive:true})});
/* pour les tests hors ligne (OfflineAudioContext) */
S._use=function(c){ctx=c;bus=mk(c);on=true};
window.SFX=S;
})();
