/* NM Academy — fond « aurore liquide » (un seul shader WebGL, lent et doux) pour les pages du site. Sans WebGL : le dégradé CSS reste. */
(function(){
 var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
 var cv=document.createElement('canvas');cv.id='fx';cv.setAttribute('aria-hidden','true');
 cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:-2;pointer-events:none';
 var gl;try{gl=cv.getContext('webgl',{antialias:false,alpha:false,powerPreference:'low-power'})}catch(e){}
 if(!gl)return;
 document.body.insertBefore(cv,document.body.firstChild);
 var vs='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
 var fs='precision mediump float;uniform vec2 R;uniform float T;uniform vec2 M;uniform vec3 K;'+
 'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}'+
 'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}'+
 'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return v;}'+
 'void main(){vec2 uv=(gl_FragCoord.xy-.5*R)/min(R.x,R.y);float t=T*.04;vec2 q=uv*1.1+(M-.5)*.2;'+
 'vec2 w=vec2(fbm(q+vec2(0.,t)),fbm(q+vec2(5.2,1.3)-t));float f=fbm(q+2.2*w+vec2(t*.6,-t*.4));'+
 'vec3 c1=vec3(.02,.03,.1),c2=mix(vec3(.12,.18,.68),K*.5,.4),c3=mix(vec3(.16,.40,.95),K,.35),c4=mix(vec3(.95,.30,.64),K,.2);'+
 'vec3 col=mix(c1,c2,smoothstep(.25,.7,f));col=mix(col,c3,smoothstep(.45,.95,w.x)*.5);col=mix(col,c4,smoothstep(.5,1.,w.y*f*1.6)*.42);'+
 'float rb=smoothstep(.0,.03,.03-abs(f-.52+sin(uv.x*1.6+T*.08)*.04));col+=rb*vec3(.35,.5,.9)*.16;'+
 'vec2 q2=uv*2.1+(M-.5)*.75+vec2(t*1.8,t*.7);float nf=fbm(q2+fbm(q2*.7+t));col+=smoothstep(.05,.0,abs(nf-.5))*mix(vec3(.45,.65,1.),K,.5)*.14;'+
 'col*=1.-.3*dot(uv,uv);gl_FragColor=vec4(col,1.);}';
 function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o}
 var pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);
 if(!gl.getProgramParameter(pr,gl.LINK_STATUS)){cv.remove();return}
 gl.useProgram(pr);var bf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,bf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
 var lp=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(lp);gl.vertexAttribPointer(lp,2,gl.FLOAT,false,0,0);
 var uR=gl.getUniformLocation(pr,'R'),uT=gl.getUniformLocation(pr,'T'),uM=gl.getUniformLocation(pr,'M'),uK=gl.getUniformLocation(pr,'K');
 var sc=innerWidth<700?.4:.5;function rs(){cv.width=Math.max(2,innerWidth*sc|0);cv.height=Math.max(2,innerHeight*sc|0);gl.viewport(0,0,cv.width,cv.height)}rs();addEventListener('resize',rs);
 var mx=.5,my=.5,sx=.5,sy=.5,t0=performance.now(),vis=true;
 addEventListener('pointermove',function(e){mx=e.clientX/innerWidth;my=1-e.clientY/innerHeight},{passive:true});
 document.addEventListener('visibilitychange',function(){vis=!document.hidden;if(vis)requestAnimationFrame(fr)});
 function fr(now){if(!vis)return;sx+=(mx-sx)*.03;sy+=(my-sy)*.03;
  gl.uniform2f(uR,cv.width,cv.height);gl.uniform1f(uT,reduce?20:(now-t0)/1000+20);gl.uniform2f(uM,sx,sy);gl.uniform3f(uK,.2,.35,.95);gl.drawArrays(gl.TRIANGLES,0,3);
  if(!reduce)requestAnimationFrame(fr)}
 requestAnimationFrame(fr);
})();
