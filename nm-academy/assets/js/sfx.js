/* Sons UI discrets (Web Audio, aucun fichier, aucune musique). Activés seulement après un geste de l'utilisateur. */
(function(){
var ctx=null,on=false,last={};
try{on=localStorage.getItem('nm_sfx')==='1'}catch(e){}
function ac(){if(!ctx){var C=window.AudioContext||window.webkitAudioContext;if(!C)return null;ctx=new C()}if(ctx.state==='suspended')ctx.resume();return ctx}
function gate(name,ms){var n=performance.now();if(last[name]&&n-last[name]<ms)return false;last[name]=n;return true}
function blip(o){if(!on)return;var a=ac();if(!a)return;var t=a.currentTime,os=a.createOscillator(),g=a.createGain(),f=a.createBiquadFilter();
 os.type=o.type||'square';os.frequency.setValueAtTime(o.f,t);if(o.f2)os.frequency.exponentialRampToValueAtTime(o.f2,t+o.d);
 f.type='lowpass';f.frequency.value=o.lp||5200;g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(o.v,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+o.d);
 os.connect(f);f.connect(g);g.connect(a.destination);os.start(t);os.stop(t+o.d+.02)}
function noise(d,v,f1,f2){if(!on)return;var a=ac();if(!a)return;var t=a.currentTime,n=a.sampleRate*d,b=a.createBuffer(1,n,a.sampleRate),x=b.getChannelData(0);for(var i=0;i<n;i++)x[i]=(Math.random()*2-1)*(1-i/n);
 var s=a.createBufferSource();s.buffer=b;var bp=a.createBiquadFilter();bp.type='bandpass';bp.Q.value=1.2;bp.frequency.setValueAtTime(f1,t);bp.frequency.exponentialRampToValueAtTime(f2,t+d);
 var g=a.createGain();g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(bp);bp.connect(g);g.connect(a.destination);s.start(t)}
window.SFX={
 get on(){return on},
 set(v){on=!!v;try{localStorage.setItem('nm_sfx',on?'1':'0')}catch(e){}if(on){ac();SFX.ok()}},
 tick(){if(gate('tick',28))blip({f:1500+Math.random()*700,d:.035,v:.05,type:'square',lp:4200})},
 key(){if(gate('key',22))blip({f:700+Math.random()*500,d:.03,v:.06,type:'triangle',lp:3000})},
 click(){if(gate('click',60))blip({f:520,f2:300,d:.07,v:.08,type:'triangle'})},
 hover(){if(gate('hover',90))blip({f:1900,d:.025,v:.018,type:'sine'})},
 slide(){if(gate('slide',45))blip({f:900+Math.random()*300,d:.02,v:.035,type:'square',lp:3000})},
 whoosh(){if(gate('whoosh',300))noise(.45,.07,300,3200)},
 ok(){blip({f:660,d:.12,v:.07,type:'sine'});setTimeout(function(){blip({f:990,d:.18,v:.07,type:'sine'})},90)},
 boot(){blip({f:110,f2:60,d:.5,v:.12,type:'sawtooth',lp:600})}
};
})();
