/* SOCAP — héros photographique : une vraie photo, donnée en « 2,5D ».
   WebGL brut (aucune bibliothèque) : la photo est décalée selon une profondeur estimée (sol et ombres plus proches, ciel et lumière plus loin),
   pilotée par la souris / la dérive lente, plus une balayette de lumière chaude et un grain léger.
   + une couche de poussière lumineuse (canvas 2D). Si WebGL est indisponible, la photo reste affichée (zoom lent en CSS).
   Rendu en pause dès que le héros n'est plus visible. */
(function () {
  "use strict";
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var media = document.getElementById("heroMedia"), img = document.getElementById("heroImg"), cv = document.getElementById("heroGL"), mo = document.getElementById("motes");
  if (!media || !img) return;
  var visible = true, mx = 0, my = 0, smx = 0, smy = 0, scrollK = 0, t0 = performance.now(), DPR = Math.min(window.devicePixelRatio || 1, 1.6);
  if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; if (visible) loop(); }, { threshold: 0 }).observe(media);
  addEventListener("pointermove", function (e) { mx = (e.clientX / innerWidth - 0.5) * 2; my = (e.clientY / innerHeight - 0.5) * 2; }, { passive: true });
  addEventListener("scroll", function () { scrollK = Math.min(1, (window.pageYOffset || 0) / Math.max(1, media.offsetHeight)); media.style.setProperty("--sk", scrollK.toFixed(3)); }, { passive: true });

  /* ------------------------------------------------------------ WebGL : photo 2,5D */
  var gl = null, prog, uni = {}, tex, texAspect = 1.5, ready = false;
  function initGL() {
    if (!cv) return;
    try { gl = cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" }) || cv.getContext("experimental-webgl"); } catch (e) { gl = null; }
    if (!gl) return;
    var vs = "attribute vec2 p; varying vec2 vUv; void main(){ vUv = p*.5+.5; gl_Position = vec4(p,0.,1.); }";
    var fs = "precision mediump float; varying vec2 vUv; uniform sampler2D uTex; uniform vec2 uMouse; uniform float uTime, uSa, uTa, uZoom;" +
      "float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }" +
      "void main(){" +
      " vec2 s = uSa > uTa ? vec2(1., uTa/uSa) : vec2(uSa/uTa, 1.);" +
      " vec2 uv = (vUv-.5)*s+.5; vec2 b = vec2(uv.x, 1.-uv.y);" +
      " vec3 c0 = texture2D(uTex, b).rgb; float lum = dot(c0, vec3(.299,.587,.114));" +
      " float depth = clamp(b.y*.8 + (1.-lum)*.5 - .25, 0., 1.);" +
      " vec2 off = (uMouse*.016 + vec2(sin(uTime*.23)*.0045, cos(uTime*.19)*.0035)) * (depth-.42);" +
      " float z = 1.05 + uZoom*.1; vec2 p = (b-.5)/z + .5 + off;" +
      " vec3 col = texture2D(uTex, p).rgb;" +
      " float sw = smoothstep(0., 1., 1. - abs(vUv.x - (fract(uTime*.035)*1.7 - .35)) * 2.4);" +
      " col += vec3(1.,.78,.48) * sw * .06 * (1.-depth*.3);" +
      " float l2 = dot(col, vec3(.299,.587,.114));" +
      " col = mix(col*vec3(.9,1.01,1.05), col*vec3(1.05,1.0,.94), smoothstep(.25,.85,l2));" +
      " col = pow(col, vec3(1.05)) * 1.04;" +
      " col += (h(vUv*vec2(1731.,911.) + fract(uTime)) - .5) * .035;" +
      " gl_FragColor = vec4(col, 1.); }";
    function sh(t, src) { var s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
    try {
      prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error("link"); gl.useProgram(prog);
    } catch (e) { gl = null; return; }
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    ["uTex", "uMouse", "uTime", "uSa", "uTa", "uZoom"].forEach(function (n) { uni[n] = gl.getUniformLocation(prog, n); });
    tex = gl.createTexture();
    var im = new Image(); im.crossOrigin = "anonymous";
    im.onload = function () {
      try {
        gl.bindTexture(gl.TEXTURE_2D, tex); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, im);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        texAspect = im.naturalWidth / im.naturalHeight; ready = true; media.classList.add("gl-on"); resize(); loop();
      } catch (e) { gl = null; }
    };
    im.src = img.currentSrc || img.src;
  }
  function resize() {
    if (!cv) return; var w = media.clientWidth, h = media.clientHeight; cv.width = Math.round(w * DPR); cv.height = Math.round(h * DPR);
    if (gl) gl.viewport(0, 0, cv.width, cv.height);
    if (mo) { mo.width = Math.round(w * Math.min(DPR, 1.25)); mo.height = Math.round(h * Math.min(DPR, 1.25)); }
  }
  addEventListener("resize", resize);

  /* ------------------------------------------------------------ poussière lumineuse (canvas 2D) */
  var motes = [], mctx = mo && mo.getContext("2d");
  function makeMotes() { motes = []; var n = innerWidth < 700 ? 34 : 70; for (var i = 0; i < n; i++) motes.push({ x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 2.2, vx: (Math.random() - 0.3) * 0.00005, vy: -0.00002 - Math.random() * 0.00006, ph: Math.random() * 6.28, a: 0.25 + Math.random() * 0.55 }); }
  makeMotes();
  function drawMotes(t) {
    if (!mctx) return; var w = mo.width, h = mo.height; mctx.clearRect(0, 0, w, h); mctx.globalCompositeOperation = "lighter";
    for (var i = 0; i < motes.length; i++) {
      var m = motes[i]; m.x += m.vx * 16 + Math.sin(t * 0.0004 + m.ph) * 0.00012; m.y += m.vy * 16; if (m.y < -0.05) { m.y = 1.05; m.x = Math.random(); } if (m.x > 1.05) m.x = -0.05; if (m.x < -0.05) m.x = 1.05;
      var px = (m.x + smx * 0.01 * m.r) * w, py = m.y * h, rad = m.r * 5 * (w / 1400 + 0.6), tw = 0.5 + 0.5 * Math.sin(t * 0.0013 + m.ph);
      var g = mctx.createRadialGradient(px, py, 0, px, py, rad); g.addColorStop(0, "rgba(255,236,190," + (m.a * tw).toFixed(3) + ")"); g.addColorStop(1, "rgba(255,210,140,0)");
      mctx.fillStyle = g; mctx.beginPath(); mctx.arc(px, py, rad, 0, 6.2832); mctx.fill();
    }
  }

  var raf = 0;
  function loop() {
    if (raf || !visible) return;
    raf = requestAnimationFrame(function frame(now) {
      raf = 0; if (!visible) return;
      var t = (now - t0) / 1000; smx += (mx - smx) * 0.06; smy += (my - smy) * 0.06;
      if (gl && ready) {
        gl.uniform1i(uni.uTex, 0); gl.uniform2f(uni.uMouse, reduce ? 0 : smx, reduce ? 0 : smy); gl.uniform1f(uni.uTime, reduce ? 0 : t);
        gl.uniform1f(uni.uSa, cv.width / cv.height); gl.uniform1f(uni.uTa, texAspect); gl.uniform1f(uni.uZoom, scrollK);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      if (!reduce) { drawMotes(now); loop(); }
    });
  }
  function start() { resize(); initGL(); if (!reduce) loop(); }
  if (img.complete) start(); else img.addEventListener("load", start, { once: true });
})();
