/* Giulivo — "Quando si accendono le luci": the real photo of the terrace at dusk; when the scene scrolls
   into view, night falls and the real lanterns light up (raw WebGL, no library). A packed map
   (R = lantern glow, G = warm light pool on the tables, B = estimated depth) was made from the same photo,
   so every glow sits on a real lamp. Pointer / scroll move the scene in depth. It plays again each time
   the scene comes back into view. Without WebGL the plain photo stays. Paused when off-screen. */
(function () {
  "use strict";
  var media = document.getElementById("lightsMedia"), img = document.getElementById("lightsImg"), cv = document.getElementById("lightsGL");
  if (!media || !img || !cv) return;
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch = matchMedia("(hover: none)").matches;
  var DPR = Math.min(window.devicePixelRatio || 1, touch ? 1.25 : 1.75);
  var gl, prog, U = {}, texImg, texMap, imgAspect = 4 / 3, ok = false, visible = true, raf = 0;
  var mx = 0, my = 0, smx = 0, smy = 0, night = 0, t0 = performance.now(), onAt = 0;

  function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
  function tex(unit, el) {
    var t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, el);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }
  function init(map) {
    try { gl = cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" }); } catch (e) { gl = null; }
    if (!gl) return false;
    var vs = "attribute vec2 p; varying vec2 v; void main(){ v = p*.5+.5; gl_Position = vec4(p,0.,1.); }";
    var fs = [
      "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nvarying vec2 v; uniform sampler2D uI, uM; uniform float uN, uT, uSa, uIa, uSc; uniform vec2 uP, uFoc;",
      "float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }",
      "vec2 cover(vec2 uv){ bool port = uSa < uIa; vec2 s = port ? vec2(uSa/uIa, 1.) : vec2(1., uIa/uSa); float z = port ? .78 : .94; vec2 c = port ? uFoc : vec2(.5); uv = (uv-.5)*s*z + c; return vec2(uv.x, 1.-uv.y); }",
      "void main(){",
      "  vec2 uv = cover(v);",
      "  float d = texture2D(uM, uv).b;",
      "  vec2 off = (uP * .016 + vec2(0., uSc * .035)) * (d - .35);",
      "  uv = clamp(uv + off, .001, .999);",
      "  vec3 c = texture2D(uI, uv).rgb; vec3 m = texture2D(uM, uv).rgb;",
      "  float on = smoothstep(.15, .75, uN);",
      "  float fl = .965 + .035 * sin(uT * 2.1) * sin(uT * 3.7 + 1.3);",
      "  float L = m.r * on * fl; float pool = m.g * smoothstep(.35, 1., uN);",
      "  vec3 night = c * vec3(.25, .29, .42) * (1. - .25 * d) + c * L * 1.3 + L * vec3(1., .58, .26) * .6 + pow(L, 3.) * vec3(1., .82, .55) * .5 + c * pool * vec3(1., .72, .45) * .6;",
      "  vec3 dusk = c * vec3(.92, .86, .8);",
      "  vec3 col = mix(dusk, night, smoothstep(0., .55, uN));",
      "  gl_FragColor = vec4(col, 1.);",
      "}"].join("\n");
    try {
      prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error("link"); gl.useProgram(prog);
      var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      ["uI", "uM", "uN", "uT", "uSa", "uIa", "uSc", "uP", "uFoc"].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });
      texImg = tex(0, img); texMap = tex(1, map);
      gl.uniform1i(U.uI, 0); gl.uniform1i(U.uM, 1);
    } catch (e) { gl = null; return false; }
    imgAspect = img.naturalWidth / img.naturalHeight;
    return true;
  }
  function resize() { var w = media.clientWidth, h = media.clientHeight; cv.width = Math.max(2, Math.round(w * DPR)); cv.height = Math.max(2, Math.round(h * DPR)); if (gl) gl.viewport(0, 0, cv.width, cv.height); }
  addEventListener("resize", resize);
  addEventListener("pointermove", function (e) { if (e.pointerType === "touch") return; mx = (e.clientX / innerWidth - .5) * 2; my = (e.clientY / innerHeight - .5) * 2; }, { passive: true });
  addEventListener("deviceorientation", function (e) { if (e.gamma == null) return; mx = Math.max(-1, Math.min(1, e.gamma / 25)); my = Math.max(-1, Math.min(1, (e.beta - 45) / 30)); }, { passive: true });

  function frame(now) {
    raf = 0; if (!visible || document.hidden) return;
    var t = (now - t0) / 1000;
    smx += (mx - smx) * .05; smy += (my - smy) * .05;
    if (!onAt) night = 0; else { var k = Math.min(1, Math.max(0, (now - onAt) / 3800)); night = reduce ? (onAt ? 1 : 0) : k * k * (3 - 2 * k); }
    var r = media.getBoundingClientRect(), sc = Math.min(1, Math.max(-1, (r.top + r.height / 2 - innerHeight / 2) / innerHeight));
    gl.uniform1f(U.uN, night); gl.uniform1f(U.uT, reduce ? 0 : t);
    gl.uniform1f(U.uSa, cv.width / cv.height); gl.uniform1f(U.uIa, imgAspect); gl.uniform1f(U.uSc, sc);
    gl.uniform2f(U.uP, reduce ? 0 : smx, reduce ? 0 : -smy); gl.uniform2f(U.uFoc, .66, .47);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    loop();
  }
  function loop() { if (!raf && visible) raf = requestAnimationFrame(frame); }

  function start() {
    var map = new Image(); map.decoding = "async";
    map.onload = function () {
      resize(); if (!init(map)) return;
      ok = true; media.classList.add("gl-on");
      if ("IntersectionObserver" in window) new IntersectionObserver(function (en) {
        var x = en[0]; visible = x.isIntersecting;
        if (!visible) onAt = 0;                                                   // replays next time
        else if (!onAt && x.intersectionRatio >= .4) onAt = performance.now() + (reduce ? 0 : 350);
        if (visible) loop();
      }, { threshold: [0, .4, .7] }).observe(media);
      else onAt = performance.now();
      document.addEventListener("visibilitychange", function () { if (!document.hidden) loop(); });
      loop();
    };
    map.src = "assets/img/hero-maps.png";
  }
  if (img.complete && img.naturalWidth) start(); else img.addEventListener("load", start, { once: true });
})();
