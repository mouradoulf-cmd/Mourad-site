/* NM Academy — sons d'interface v3 « sérieux » (Web Audio, synthèse, aucun fichier, aucune musique).
   Sobres et courts, type produit professionnel : tap doux, frappe discrète, carillon posé en tierce majeure.
   Actifs par défaut ; l'audio démarre au premier geste (règle des navigateurs) ; coupure via le bouton SON, choix mémorisé. */
(function(){
var ctx=null,on=true,last={},bus=null,KEY='nm_sfx';
try{var _s=localStorage.getItem(KEY);if(_s!==null)on=_s==='1'}catch(e){}
function mk(c){
 var master=c.createGain();master.gain.value=1.1;
 var comp=c.createDynamicsCompressor();comp.threshold.value=-18;comp.ratio.value=3;comp.attack.value=.004;comp.release.value=.18;
 var dry=c.createGain(),wet=c.createGain();wet.gain.value=.28;
 var conv=c.createConvolver(),len=Math.floor(c.sampleRate*1.1),ir=c.createBuffer(2,len,c.sampleRate);
 for(var ch=0;ch<2;ch++){var d=ir.getChannelData(ch),p=0;for(var i=0;i<len;i++){p=p*.6+(Math.random()*2-1)*.4;d[i]=p*Math.pow(1-i/len,3.6)*(i<c.sampleRate*.01?i/(c.sampleRate*.01):1)}}
 conv.buffer=ir;var hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=260;
 dry.connect(comp);wet.connect(conv);conv.connect(hp);hp.connect(comp);comp.connect(master);master.connect(c.destination);
 return{dry:dry,wet:wet}}
function ac(){if(!ctx){var C=window.AudioContext||window.webkitAudioContext;if(!C)return null;ctx=new C();bus=mk(ctx)}if(ctx.state==='suspended')ctx.resume();return ctx}
function gate(n,ms){var t=performance.now();if(last[n]&&t-last[n]<ms)return false;last[n]=t;return true}
function R(a,b){return a+Math.random()*(b-a)}
function route(a,node,send,pan){var g=a.createGain();node.connect(g);var out=g;if(a.createStereoPanner&&pan){var p=a.createStereoPanner();p.pan.value=pan;g.connect(p);out=p}out.connect(bus.dry);if(send){var s=a.createGain();s.gain.value=send;out.connect(s);s.connect(bus.wet)}}
function tone(o){var a=ac();if(!a)return;var t=a.currentTime+(o.at||0),os=a.createOscillator(),g=a.createGain(),f=a.createBiquadFilter();
 os.type=o.type||'sine';os.frequency.setValueAtTime(o.f,t);if(o.f2)os.frequency.exponentialRampToValueAtTime(o.f2,t+o.d);
 f.type='lowpass';f.frequency.value=o.lp||2400;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(o.v,t+(o.a||.006));g.gain.exponentialRampToValueAtTime(.0001,t+o.d);
 os.connect(f);f.connect(g);route(a,g,o.send||0,o.pan);os.start(t);os.stop(t+o.d+.05)}
var nb=null;function nbuf(a){if(!nb||nb.sampleRate!==a.sampleRate){nb=a.createBuffer(1,a.sampleRate*2,a.sampleRate);var d=nb.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=Math.random()*2-1}return nb}
function burst(o){var a=ac();if(!a)return;var t=a.currentTime+(o.at||0),s=a.createBufferSource();s.buffer=nbuf(a);s.loop=true;
 var f=a.createBiquadFilter();f.type=o.ft||'bandpass';f.Q.value=o.q||1;f.frequency.setValueAtTime(o.f1,t);if(o.f2)f.frequency.exponentialRampToValueAtTime(o.f2,t+o.d);
 var g=a.createGain();g.gain.setValueAtTime(o.swell?.0001:o.v,t);if(o.swell)g.gain.exponentialRampToValueAtTime(o.v,t+o.d*o.swell);g.gain.exponentialRampToValueAtTime(.0001,t+o.d);
 s.connect(f);f.connect(g);route(a,g,o.send||0,o.pan);s.start(t,Math.random()*1.5);s.stop(t+o.d+.05)}
var S={
 get on(){return on},
 set:function(v){on=!!v;try{localStorage.setItem(KEY,on?'1':'0')}catch(e){}if(on){ac();S.ok()}},
 unlock:function(){if(on)ac()},
 /* tap doux : corps grave très court + léger souffle */
 click:function(at){if(!on||(at==null&&!gate('click',70)))return;tone({f:340,f2:200,d:.07,v:.075,type:'sine',lp:1800,send:.12,at:at});burst({f1:3200,q:1.2,d:.012,v:.02,at:at})},
 /* frappe discrète (texte qui se tape) */
 key:function(at){if(!on||(at==null&&!gate('key',28)))return;var p=R(-.2,.2);burst({f1:R(1300,2100),q:1.6,d:.02,v:.055,at:at,pan:p});tone({f:R(150,200),f2:95,d:.045,v:.05,type:'sine',lp:600,at:at,pan:p})},
 /* pip neutre */
 tick:function(at){if(!on||(at==null&&!gate('tick',40)))return;tone({f:R(700,820),d:.045,v:.028,type:'sine',lp:2600,send:.15,at:at})},
 hover:function(){},
 slide:function(v,at){if(!on||(at==null&&!gate('slide',45)))return;v=typeof v==='number'?v:.5;tone({f:380+v*320,d:.03,v:.022,type:'sine',lp:2200,at:at})},
 /* transition : souffle doux et grave */
 whoosh:function(at){if(!on||(at==null&&!gate('whoosh',300)))return;burst({f1:380,f2:2300,q:.8,d:.45,v:.05,swell:.5,send:.3,at:at,pan:-.2});tone({f:58,f2:42,d:.4,v:.035,type:'sine',lp:240,a:.12,at:at})},
 /* succès : tierce majeure posée */
 ok:function(at){if(!on)return;at=at||0;tone({f:523.25,d:.28,v:.05,send:.3,at:at});tone({f:659.25,d:.4,v:.05,send:.3,at:at+.08});tone({f:784,d:.55,v:.028,send:.35,at:at+.16})},
 deny:function(){if(!on)return;tone({f:196,f2:150,d:.16,v:.06,type:'triangle',lp:800,send:.1})},
 boot:function(){if(!on)return;tone({f:70,f2:48,d:.5,v:.08,type:'sine',lp:260,a:.15});burst({f1:500,f2:2600,q:.8,d:.5,v:.04,swell:.6,send:.3})}
};
['pointerdown','keydown','touchstart'].forEach(function(ev){addEventListener(ev,function h(){if(on){ac();if(ctx&&ctx.state==='running')removeEventListener(ev,h)}},{passive:true})});
S._use=function(c){ctx=c;bus=mk(c);on=true};
window.SFX=S;
})();
