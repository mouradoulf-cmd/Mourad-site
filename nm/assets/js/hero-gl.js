/* NM Studio — hero light field.
   A single full-screen fragment shader (no library): slow domain-warped
   noise tinted with the brand colours, plus a soft light that follows the
   pointer. Rendered at reduced resolution, paused when off-screen or when
   the tab is hidden, and drawn as a single still frame for reduced motion.
   If WebGL is unavailable the CSS gradient behind the canvas remains. */
(function () {
  "use strict";
  var canvas = document.querySelector(".hero__gl");
  if (!canvas) return;
  var gl = canvas.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: false, powerPreference: "low-power" });
  if (!gl) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coarse = window.matchMedia("(pointer: coarse)").matches;

  var vert = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
  var frag = [
    "precision mediump float;",
    "uniform vec2 r;uniform float t;uniform vec2 m;",
    "float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}",
    "float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);",
    "return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}",
    "float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return v;}",
    "void main(){",
    " vec2 uv=gl_FragCoord.xy/r;vec2 p=uv;p.x*=r.x/r.y;",
    " float T=t*.045;",
    " vec2 q=vec2(fbm(p*1.6+T),fbm(p*1.6-T+4.3));",
    " vec2 w=vec2(fbm(p*1.3+q*1.8+vec2(1.7,9.2)+T*.7),fbm(p*1.3+q*1.8+vec2(8.3,2.8)-T*.6));",
    " float f=fbm(p*1.2+w*2.2);",
    " vec3 ink=vec3(.027,.031,.047);",
    " vec3 cy=vec3(.13,.91,1.);vec3 vi=vec3(.66,.33,.97);vec3 pk=vec3(.93,.28,.6);",
    " vec3 c=mix(vi,cy,smoothstep(.25,.75,q.x));c=mix(c,pk,smoothstep(.55,.95,w.y)*.7);",
    " float glow=smoothstep(.35,1.05,f)*.62;",
    " vec2 mp=m;mp.x*=r.x/r.y;float d=distance(p,mp);",
    " glow+=exp(-d*d*6.)*.22;",
    " float vig=smoothstep(1.35,.2,distance(uv,vec2(.62,.45)));",
    " vec3 col=ink+c*glow*vig;",
    " col+=(h(gl_FragCoord.xy+t)-.5)*.018;",
    " gl_FragColor=vec4(col,1.);",
    "}"
  ].join("\n");

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  }
  var vs = compile(gl.VERTEX_SHADER, vert);
  var fs = compile(gl.FRAGMENT_SHADER, frag);
  if (!vs || !fs) return;
  var prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  var uR = gl.getUniformLocation(prog, "r");
  var uT = gl.getUniformLocation(prog, "t");
  var uM = gl.getUniformLocation(prog, "m");

  var scale = coarse ? 0.35 : 0.5;
  function resize() {
    var w = Math.max(1, Math.round(canvas.clientWidth * scale));
    var h = Math.max(1, Math.round(canvas.clientHeight * scale));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }

  var mouse = { x: 0.7, y: 0.55 }, target = { x: 0.7, y: 0.55 };
  if (!coarse) {
    window.addEventListener("pointermove", function (e) {
      var rect = canvas.getBoundingClientRect();
      target.x = (e.clientX - rect.left) / rect.width;
      target.y = 1 - (e.clientY - rect.top) / rect.height;
    }, { passive: true });
  }

  var visible = true, running = false, start = performance.now(), last = 0;
  function frame(now) {
    if (!visible || document.hidden) { running = false; return; }
    running = true;
    // ~40fps cap: the motion is slow, so this saves battery with no visible cost.
    if (now - last > 24) {
      last = now;
      resize();
      mouse.x += (target.x - mouse.x) * 0.04;
      mouse.y += (target.y - mouse.y) * 0.04;
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform1f(uT, (now - start) / 1000 + 20);
      gl.uniform2f(uM, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    requestAnimationFrame(frame);
  }
  function kick() { if (!running && visible && !document.hidden) requestAnimationFrame(frame); }

  if (reduce) {
    resize();
    gl.uniform2f(uR, canvas.width, canvas.height);
    gl.uniform1f(uT, 42);
    gl.uniform2f(uM, 0.7, 0.55);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    window.addEventListener("resize", function () {
      resize(); gl.uniform2f(uR, canvas.width, canvas.height); gl.drawArrays(gl.TRIANGLES, 0, 3);
    });
  } else {
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; kick(); }).observe(canvas);
    }
    document.addEventListener("visibilitychange", kick);
    kick();
  }
  requestAnimationFrame(function () { canvas.classList.add("is-ready"); });
})();
