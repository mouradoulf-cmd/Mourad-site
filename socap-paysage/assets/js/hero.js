/* SOCAP — héros : diaporama photographique en WebGL brut (aucune bibliothèque).
   5 photographies (jour → crépuscule → nuit) enchaînées par une transition « balayage liquide » :
   masque bruité, déplacement, séparation chromatique et liseré lumineux menthe au passage du front.
   Zoom lent (Ken Burns), parallaxe souris, halo de lumière qui suit le pointeur, grain de pellicule.
   + poussière lumineuse (canvas 2D). Sans WebGL : fondu enchaîné CSS entre deux <img>.
   API : window.SocapHero = { go(i), next(), prev(), index, on(fn) } ; fn(i, slide) à chaque changement.
   Le rendu est en pause quand le héros n'est plus visible ou quand l'onglet est masqué. */
(function () {
  "use strict";
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var media = document.getElementById("heroMedia"), img = document.getElementById("heroImg"), cv = document.getElementById("heroGL"), mo = document.getElementById("motes");
  if (!media || !img) return;

  var SLIDES = [
    { d: "assets/img/hs1.webp", m: "assets/img/hs1-m.webp", t: "Terrasse bois & pergola", l: "Inspiration · jour" },
    { d: "assets/img/hs2.webp", m: "assets/img/hs2-m.webp", t: "Piscine & platelage", l: "Inspiration · crépuscule" },
    { d: "assets/img/hs3.webp", m: "assets/img/hs3-m.webp", t: "Jardin d’eau & pavillon", l: "Inspiration · lumière du jour" },
    { d: "assets/img/hs4.webp", m: "assets/img/hs4-m.webp", t: "Pierre, eau & végétaux", l: "Inspiration · jardin d’inspiration japonaise" },
    { d: "assets/img/hs5.webp", m: "assets/img/hs5-m.webp", t: "Éclairage paysager", l: "Inspiration · nuit" }
  ];
  var DUR = 7200, TR = 1700;
  var portrait = function () { return innerWidth < 701 || innerWidth / innerHeight < 0.85; };
  var urlOf = function (s) { return portrait() ? s.m : s.d; };

  var listeners = [], cur = 0, prev = 0, tStart = 0, trStart = -1, trTo = 0, auto = true, visible = true, loaded = [], mx = 0, my = 0, smx = 0, smy = 0, ready = false, gl = null, raf = 0, t0 = performance.now(), DPR = Math.min(window.devicePixelRatio || 1, (innerWidth < 900 || matchMedia('(hover: none)').matches) ? 1.15 : 1.6);

  /* ---------------------------------------------------------------- API */
  var API = window.SocapHero = {
    slides: SLIDES, index: 0,
    on: function (fn) { listeners.push(fn); fn(cur, SLIDES[cur]); },
    go: function (i, user) {
      i = (i + SLIDES.length) % SLIDES.length; if (i === cur || trStart >= 0) return; if (user) auto = false;
      ensure(i, function () { prev = cur; cur = i; API.index = i; trStart = performance.now(); tStart = trStart; fallbackSwap(); listeners.forEach(function (fn) { fn(cur, SLIDES[cur]); }); wake(); });
    },
    next: function (user) { API.go(cur + 1, user); }, prev: function (user) { API.go(cur - 1, user); }
  };

  /* ---------------------------------------------------------------- chargement des images (la 1re tout de suite, le reste au repos) */
  var imgs = [];
  function ensure(i, cb) {
    if (imgs[i] && imgs[i].complete && imgs[i].naturalWidth) return cb();
    var im = imgs[i] || (imgs[i] = new Image()); im.onload = function () { if (gl) upload(i); cb(); }; im.onerror = function () { cb(); }; if (!im.src) im.src = urlOf(SLIDES[i]);
    if (im.complete && im.naturalWidth) { if (gl) upload(i); cb(); }
  }
  function preloadRest() { var i = 1; (function step() { if (i >= SLIDES.length) return; ensure(i, function () { i++; (window.requestIdleCallback || function (f) { setTimeout(f, 250); })(step); }); })(); }

  /* ---------------------------------------------------------------- WebGL */
  var prog, U = {}, texs = [], texAspect = 16 / 9, texOK = [];
  function initGL() {
    try { gl = cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" }) || cv.getContext("experimental-webgl"); } catch (e) { gl = null; }
    if (!gl) return false;
    var vs = "attribute vec2 p; varying vec2 vUv; void main(){ vUv = p*.5+.5; gl_Position = vec4(p,0.,1.); }";
    var fs = "precision mediump float; varying vec2 vUv; uniform sampler2D uA, uB; uniform float uP, uT, uSa, uTa, uZa, uZb; uniform vec2 uM;" +
      "float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }" +
      "float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }" +
      "vec2 cover(vec2 uv, float z, vec2 sh){ vec2 s = uSa > uTa ? vec2(1., uTa/uSa) : vec2(uSa/uTa, 1.); uv = (uv-.5)*s/z + .5 + sh; return vec2(uv.x, 1.-uv.y); }" +
      "void main(){" +
      " float nz = n(vUv*vec2(4.,3.) + uT*.04) * .6 + n(vUv*vec2(9.,7.) - uT*.03) * .4;" +
      " float wipe = vUv.x*.55 + (1.-vUv.y)*.18 + nz*.55;" +
      " float t = uP*1.75 - .38;" +
      " float mask = 1. - smoothstep(t-.16, t+.16, wipe);" +
      " float edge = smoothstep(.02,.5,mask) * (1. - smoothstep(.5,.98,mask));" +
      " vec2 par = uM * .007;" +
      " vec2 dA = vec2(1.,.18) * mask * .055; vec2 dB = -vec2(1.,.18) * (1.-mask) * .055;" +
      " float ca = .0075 * sin(3.14159*uP);" +
      " vec2 ua = cover(vUv, uZa, par) + dA; vec2 ub = cover(vUv, uZb, par*1.3) + dB;" +
      " vec3 a = vec3(texture2D(uA, ua + vec2(ca,0.)).r, texture2D(uA, ua).g, texture2D(uA, ua - vec2(ca,0.)).b);" +
      " vec3 b = vec3(texture2D(uB, ub + vec2(ca,0.)).r, texture2D(uB, ub).g, texture2D(uB, ub - vec2(ca,0.)).b);" +
      " vec3 col = mix(a, b, mask);" +
      " col += vec3(.35,1.,.72) * edge * .22;" +
      " float aspect = uSa; vec2 q = (vUv - (uM*.5+.5)*vec2(1.,1.)) * vec2(aspect,1.);" +
      " col += vec3(1.,.9,.72) * exp(-dot(q,q)*5.) * .05;" +
      " col += (h(vUv*vec2(1731.,911.) + fract(uT)) - .5) * .028;" +
      " gl_FragColor = vec4(col, 1.); }";
    function sh(tp, src) { var s = gl.createShader(tp); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
    try { prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(prog); if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error("link"); gl.useProgram(prog); } catch (e) { gl = null; return false; }
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    ["uA", "uB", "uP", "uT", "uSa", "uTa", "uZa", "uZb", "uM"].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });
    return true;
  }
  function upload(i) {
    if (texOK[i] || !gl) return; var im = imgs[i]; if (!im || !im.naturalWidth) return;
    var t = texs[i] = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, im); } catch (e) { gl = null; return; }
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    texOK[i] = true; texAspect = im.naturalWidth / im.naturalHeight;
  }
  function resize() { var w = media.clientWidth, h = media.clientHeight; cv.width = Math.round(w * DPR); cv.height = Math.round(h * DPR); if (gl) gl.viewport(0, 0, cv.width, cv.height); if (mo) { mo.width = Math.round(w * 1.1); mo.height = Math.round(h * 1.1); } }
  addEventListener("resize", resize);
  addEventListener("pointermove", function (e) { mx = (e.clientX / innerWidth - .5) * 2; my = (e.clientY / innerHeight - .5) * 2; }, { passive: true });

  /* ---------------------------------------------------------------- repli sans WebGL : fondu entre deux <img> */
  var img2 = null;
  function fallbackSwap() { if (gl || !img2) return; var s = urlOf(SLIDES[cur]); img2.src = s; img2.classList.add("in"); setTimeout(function () { img.src = s; img2.classList.remove("in"); }, 900); }

  /* ---------------------------------------------------------------- poussière lumineuse */
  var motes = [], mctx = mo && mo.getContext("2d");
  (function () { var n = innerWidth < 700 ? 30 : 64; for (var i = 0; i < n; i++) motes.push({ x: Math.random(), y: Math.random(), r: .6 + Math.random() * 2.2, vx: (Math.random() - .3) * .00005, vy: -.00002 - Math.random() * .00006, ph: Math.random() * 6.28, a: .25 + Math.random() * .55 }); })();
  function drawMotes(t) {
    if (!mctx) return; var w = mo.width, h = mo.height; mctx.clearRect(0, 0, w, h); mctx.globalCompositeOperation = "lighter";
    for (var i = 0; i < motes.length; i++) {
      var m = motes[i]; m.x += m.vx * 16 + Math.sin(t * .0004 + m.ph) * .00012; m.y += m.vy * 16; if (m.y < -.05) { m.y = 1.05; m.x = Math.random(); } if (m.x > 1.05) m.x = -.05; if (m.x < -.05) m.x = 1.05;
      var px = (m.x + smx * .01 * m.r) * w, py = m.y * h, rad = m.r * 5 * (w / 1400 + .6), tw = .5 + .5 * Math.sin(t * .0013 + m.ph);
      var g = mctx.createRadialGradient(px, py, 0, px, py, rad); g.addColorStop(0, "rgba(255,236,190," + (m.a * tw).toFixed(3) + ")"); g.addColorStop(1, "rgba(255,210,140,0)"); mctx.fillStyle = g; mctx.beginPath(); mctx.arc(px, py, rad, 0, 6.2832); mctx.fill();
    }
  }

  /* ---------------------------------------------------------------- boucle */
  function ease(x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  function wake() { if (!raf && visible) loop(); }
  function loop() {
    raf = requestAnimationFrame(function frame(now) {
      raf = 0; if (!visible || document.hidden) return;
      var t = (now - t0) / 1000; smx += (mx - smx) * .06; smy += (my - smy) * .06;
      var p = 0;
      if (trStart >= 0) { p = Math.min(1, (now - trStart) / TR); if (p >= 1) { trStart = -1; p = 0; prev = cur; } else p = ease(p); }
      if (trStart < 0 && auto && !reduce && now - tStart > DUR) API.next();
      if (gl && ready) {
        var A = trStart >= 0 ? prev : cur, B = cur, age = (now - tStart) / 1000;
        if (texOK[A] && texOK[B]) {
          gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texs[A]); gl.uniform1i(U.uA, 0);
          gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, texs[trStart >= 0 ? B : A]); gl.uniform1i(U.uB, 1);
          gl.uniform1f(U.uP, trStart >= 0 ? p : 0); gl.uniform1f(U.uT, reduce ? 0 : t); gl.uniform1f(U.uSa, cv.width / cv.height); gl.uniform1f(U.uTa, texAspect);
          gl.uniform1f(U.uZa, 1.05 + Math.min(.08, (reduce ? 0 : (trStart >= 0 ? (now - tStart + DUR) / 1000 : age)) * .011)); gl.uniform1f(U.uZb, 1.05 + Math.min(.08, Math.max(0, age) * .011));
          gl.uniform2f(U.uM, reduce ? 0 : smx, reduce ? 0 : smy); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
      }
      if (!reduce) drawMotes(now);
      if (!reduce || trStart >= 0) loop();
    });
  }
  if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; if (visible) { tStart = performance.now(); wake(); } }, { threshold: 0 }).observe(media);
  document.addEventListener("visibilitychange", function () { if (!document.hidden) wake(); });

  /* ---------------------------------------------------------------- démarrage */
  function start() {
    resize();
    imgs[0] = img; texAspect = img.naturalWidth / img.naturalHeight || 16 / 9;
    if (initGL()) { upload(0); if (gl) { ready = true; media.classList.add("gl-on"); } }
    if (!gl) { img2 = document.createElement("img"); img2.className = "hero__img hero__img2"; img2.alt = ""; media.insertBefore(img2, cv); }
    tStart = performance.now(); preloadRest(); wake();
    listeners.forEach(function (fn) { fn(cur, SLIDES[cur]); });
  }
  if (img.complete && img.naturalWidth) start(); else img.addEventListener("load", start, { once: true });
})();
