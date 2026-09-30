/* NM Studio — hero scene. A stream of gold light flows in from the left and
   assembles, one after another, into what we build: a website on a phone,
   a Google Maps pin with five stars, a real QR code, and a shop with
   customers at the door. Ice-blue haze drifts around it and everything is
   mirrored on a dark glossy floor.
   Canvas 2D with pre-rendered glow sprites (one drawImage per particle),
   paused off screen; one still frame with prefers-reduced-motion. If a hero
   video is configured in offers-config.js, the video is used instead. */
(function () {
  "use strict";
  var hero = document.querySelector(".hero");
  var canvas = document.querySelector(".hero__scene");
  if (!hero || !canvas || !canvas.getContext) return;
  var cfg = window.NM_OFFERS && window.NM_OFFERS.hero;
  if (cfg && (cfg.mp4 || cfg.webm)) { canvas.remove(); return; }

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var ctx = canvas.getContext("2d");
  var cap = document.querySelector(".hero__scene-cap");
  var capText = cap && cap.querySelector("[data-i18n]");
  var capNum = cap && cap.querySelector(".hero__scene-n");
  var bars = Array.prototype.slice.call(document.querySelectorAll(".hero__reel i"));
  var SHAPE_MS = 4800, KEYS = ["v3.s1", "v3.s2", "v3.s3", "v3.s4"];

  /* ---------- glow sprites ---------- */
  function sprite(r, g, b, size) {
    var c = document.createElement("canvas"); c.width = c.height = size;
    var x = c.getContext("2d"), h = size / 2, gr = x.createRadialGradient(h, h, 0, h, h, h);
    gr.addColorStop(0, "rgba(255,255,255,1)");
    gr.addColorStop(0.18, "rgba(" + r + "," + g + "," + b + ",0.95)");
    gr.addColorStop(0.45, "rgba(" + r + "," + g + "," + b + ",0.28)");
    gr.addColorStop(1, "rgba(" + r + "," + g + "," + b + ",0)");
    x.fillStyle = gr; x.fillRect(0, 0, size, size);
    return c;
  }
  var GOLD = sprite(255, 190, 100, 32), AMBER = sprite(255, 150, 60, 32), ICE = sprite(140, 210, 255, 32);
  var HAZE = (function () {
    var c = document.createElement("canvas"); c.width = c.height = 128;
    var x = c.getContext("2d"), g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(120,200,255,0.55)"); g.addColorStop(0.5, "rgba(90,170,240,0.18)"); g.addColorStop(1, "rgba(80,160,230,0)");
    x.fillStyle = g; x.fillRect(0, 0, 128, 128); return c;
  })();

  /* ---------- shapes, in a unit box (x −0.5…0.5, y −0.6…0.6) ---------- */
  var seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  function line(out, x1, y1, x2, y2, step) {
    var d = Math.hypot(x2 - x1, y2 - y1), n = Math.max(1, Math.round(d / step));
    for (var i = 0; i <= n; i++) out.push([x1 + (x2 - x1) * i / n, y1 + (y2 - y1) * i / n]);
  }
  function arc(out, cx, cy, r, a1, a2, step) {
    var n = Math.max(2, Math.round(Math.abs(a2 - a1) * r / step));
    for (var i = 0; i <= n; i++) { var a = a1 + (a2 - a1) * i / n; out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
  }
  function rrect(out, x, y, w, h, r, step) {
    line(out, x + r, y, x + w - r, y, step); arc(out, x + w - r, y + r, r, -Math.PI / 2, 0, step);
    line(out, x + w, y + r, x + w, y + h - r, step); arc(out, x + w - r, y + h - r, r, 0, Math.PI / 2, step);
    line(out, x + w - r, y + h, x + r, y + h, step); arc(out, x + r, y + h - r, r, Math.PI / 2, Math.PI, step);
    line(out, x, y + h - r, x, y + r, step); arc(out, x + r, y + r, r, Math.PI, Math.PI * 1.5, step);
  }
  function fill(out, x, y, w, h, gap) {
    for (var yy = y; yy <= y + h; yy += gap) for (var xx = x; xx <= x + w; xx += gap) out.push([xx + (rnd() - .5) * gap * .5, yy + (rnd() - .5) * gap * .5]);
  }
  function star(out, cx, cy, r, step) {
    var pts = [];
    for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
    for (var k = 0; k < 10; k++) line(out, pts[k][0], pts[k][1], pts[(k + 1) % 10][0], pts[(k + 1) % 10][1], step);
  }
  var S = 0.011;
  function shapePhone() {
    var o = [];
    rrect(o, -.28, -.56, .56, 1.12, .08, S);
    line(o, -.06, -.51, .06, -.51, S);                        // speaker
    rrect(o, -.22, -.44, .44, .09, .02, S * 1.3);             // nav bar
    fill(o, -.2, -.3, .4, .26, .03);                          // hero photo
    line(o, -.2, .04, .14, .04, S); line(o, -.2, .1, .2, .1, S); line(o, -.2, .16, .06, .16, S);
    rrect(o, -.2, .26, .4, .09, .045, S);                     // button
    arc(o, 0, .46, .03, 0, Math.PI * 2, S * .6);              // home dot
    return o;
  }
  function shapePin() {
    var o = [], cy = -.12, r = .3;
    var a0 = Math.PI * .5 + 1.02, a1 = Math.PI * 2.5 - 1.02;  // leave the bottom open for the tip
    arc(o, 0, cy, r, a0, a1, S);
    var tip = [0, .42], p1 = [Math.cos(a0) * r, cy + Math.sin(a0) * r], p2 = [Math.cos(a1) * r, cy + Math.sin(a1) * r];
    line(o, p1[0], p1[1], tip[0], tip[1], S); line(o, p2[0], p2[1], tip[0], tip[1], S);
    arc(o, 0, cy, .11, 0, Math.PI * 2, S);
    for (var i = 0; i < 5; i++) star(o, -.28 + i * .14, -.56, .045, S * .7);
    for (var k = 0; k < 18; k++) { var a = k / 18 * Math.PI * 2; o.push([Math.cos(a) * .2, .5 + Math.sin(a) * .035]); }
    return o;
  }
  function shapeQR() {
    var o = [], Q = window.NMQR, mx = Q && Q.matrix(Q.MENU_URL, "L");
    if (!mx) { fill(o, -.45, -.45, .9, .9, .05); return o; }
    var n = mx.n, u = .92 / n, x0 = -.46, y0 = -.46;
    function finder(r, c) { rrect(o, x0 + c * u, y0 + r * u, 7 * u, 7 * u, u * 1.2, S * .8); fill(o, x0 + (c + 2) * u, y0 + (r + 2) * u, 3 * u, 3 * u, u * .7); }
    finder(0, 0); finder(0, n - 7); finder(n - 7, 0);
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) {
      if (!mx.dark[r][c] || (r < 8 && c < 8) || (r < 8 && c >= n - 8) || (r >= n - 8 && c < 8)) continue;
      o.push([x0 + (c + .5) * u, y0 + (r + .5) * u]);
    }
    return o;
  }
  function shapeShop() {
    var o = [];
    line(o, -.46, -.3, .46, -.3, S);                          // awning top
    for (var i = 0; i < 6; i++) arc(o, -.46 + .0767 + i * .1533, -.3, .0767, 0, Math.PI, S * .8); // scallops
    line(o, -.4, -.22, -.4, .34, S); line(o, .4, -.22, .4, .34, S); line(o, -.5, .34, .5, .34, S);
    rrect(o, -.32, -.1, .26, .18, .02, S);                    // window
    rrect(o, .06, -.12, .2, .46, .02, S);                     // door
    o.push([.22, .12]);
    rrect(o, -.22, -.5, .44, .12, .03, S);                    // sign
    line(o, -.14, -.44, .14, -.44, S * 1.2);
    // two customers walking in
    arc(o, -.2, .2, .035, 0, Math.PI * 2, S * .6); arc(o, -.2, .34, .07, Math.PI, Math.PI * 2, S * .7);
    arc(o, -.05, .21, .033, 0, Math.PI * 2, S * .6); arc(o, -.05, .34, .065, Math.PI, Math.PI * 2, S * .7);
    // hearts rising
    [[-.34, -.62, .03], [.3, -.66, .024]].forEach(function (h) { arc(o, h[0] - h[2] * .5, h[1], h[2] * .55, Math.PI, Math.PI * 2, S * .5); arc(o, h[0] + h[2] * .5, h[1], h[2] * .55, Math.PI, Math.PI * 2, S * .5); line(o, h[0] - h[2], h[1], h[0], h[1] + h[2] * 1.1, S * .5); line(o, h[0] + h[2], h[1], h[0], h[1] + h[2] * 1.1, S * .5); });
    return o;
  }

  /* ---------- state ---------- */
  var W = 0, H = 0, dpr = 1, cx = 0, cy = 0, sc = 0, hy = 0, N = 0, M = 0, ps = 1;
  var parts = [], stream = [], shapes = [], shapeIdx = 0, shapeT0 = 0;
  var mouse = { x: -9999, y: -9999 }, running = false, visible = true, raf = 0, last = 0;

  function resample(raw, n) {
    var a = raw.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    var out = [];
    for (var k = 0; k < n; k++) {
      var p = a[k % a.length];
      out.push(k < a.length ? p : [p[0] + (rnd() - .5) * .012, p[1] + (rnd() - .5) * .012]);
    }
    return out;
  }
  function layout() {
    W = hero.clientWidth; H = hero.clientHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 1.5); // soft glows: full retina buys nothing
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var phone = W < 700, wide = W >= 1080;
    // Desktop: the scene sits on the right, the copy on the left. Phones and
    // tablets: it sits on top and the copy starts underneath (--scene-space).
    var vh = window.innerHeight;
    sc = wide ? Math.min(H * .5, W * .27) : phone ? Math.min(W * .6, vh * .3) : Math.min(vh * .34, W * .4);
    cx = wide ? W * .745 : W * .5;
    cy = wide ? H * .44 : 72 + sc * .78;
    ps = Math.max(.55, Math.min(1, sc / 400)); // smaller scene → finer particles
    if (document.documentElement.dir === "rtl") cx = W - cx;
    hy = cy + sc * .66;
    var capTop = wide ? hy + sc * .16 : hy + sc * .06;
    hero.style.setProperty("--scene-space", wide ? "0px" : Math.round(capTop + 52) + "px");
    var n = phone ? 720 : wide ? 1150 : 900;
    M = phone ? 120 : wide ? 340 : 220;
    if (n !== N) {
      N = n; seed = 7;
      shapes = [shapePhone(), shapePin(), shapeQR(), shapeShop()].map(function (s) { return resample(s, N); });
      parts = [];
      for (var i = 0; i < N; i++) {
        var p = shapes[shapeIdx][i];
        parts.push({ x: cx + p[0] * sc + (rnd() - .5) * W * .6 - W * .3, y: cy + p[1] * sc + (rnd() - .5) * H * .4, vx: 0, vy: 0, i: i, d: 0, s: .6 + rnd() * 1.3, a: .55 + rnd() * .45, ph: rnd() * 6.28, ice: rnd() < .14, amber: rnd() < .3 });
      }
      stream = [];
      for (var k = 0; k < M; k++) stream.push(spawn({}, true));
    }
    if (cap) { cap.style.left = (cx / W * 100).toFixed(2) + "%"; cap.style.top = Math.round(capTop) + "px"; }
  }
  function spawn(s, anywhere) {
    var dist = (anywhere ? rnd() : .85 + rnd() * .15);
    var fromX = document.documentElement.dir === "rtl" ? W : 0;
    s.x = fromX + (cx - fromX) * (1 - dist);
    var spread = (.04 + dist * .5) * H;
    s.y = hy - sc * .15 + (rnd() - .6) * spread;
    s.v = .5 + rnd() * 1.3; s.s = .5 + rnd() * 1.4; s.a = 0; s.max = .45 + rnd() * .55; s.ice = rnd() < .1;
    return s;
  }
  function setShape(k, now) {
    shapeIdx = k; shapeT0 = now;
    var minX = cx - sc, span = sc * 2;
    parts.forEach(function (p) {
      p.d = now + Math.max(0, (p.x - minX) / span) * 450 + rnd() * 300; // peel off left to right
      var a = rnd() * 6.28, f = 1.5 + rnd() * 4;
      p.kx = Math.cos(a) * f; p.ky = Math.sin(a) * f;
    });
    if (capText) { capText.setAttribute("data-i18n", KEYS[k]); var t = window.NMI18n && window.NMI18n.t(KEYS[k]); if (t) capText.textContent = t; }
    if (capNum) capNum.textContent = "0" + (k + 1);
    if (cap) { cap.classList.remove("is-in"); void cap.offsetWidth; cap.classList.add("is-in"); }
    bars.forEach(function (b, i) { b.classList.remove("is-on"); b.classList.toggle("is-done", i < k); if (i === k) { void b.offsetWidth; b.classList.add("is-on"); } });
  }

  /* ---------- draw ---------- */
  function draw(now, step) {
    var t = now / 1000;
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";

    // ice haze orbiting the shape (and its reflection)
    for (var h = 0; h < 6; h++) {
      var a = t * (.18 + h * .03) + h * 1.05, rr = sc * (.95 + (h % 3) * .22);
      var hx = cx + Math.cos(a) * sc * .5, hyy = cy + Math.sin(a * 1.3) * sc * .34;
      ctx.globalAlpha = .13 + (h % 2) * .07;
      ctx.drawImage(HAZE, hx - rr / 2, hyy - rr / 2, rr, rr);
      ctx.globalAlpha *= .35;
      ctx.drawImage(HAZE, hx - rr / 2, 2 * hy - hyy - rr / 2, rr, rr * .7);
    }

    // floor glow
    ctx.globalAlpha = .55;
    var fg = ctx.createRadialGradient(cx, hy, 0, cx, hy, sc * 1.2);
    fg.addColorStop(0, "rgba(255,170,80,.22)"); fg.addColorStop(1, "rgba(255,170,80,0)");
    ctx.fillStyle = fg; ctx.save(); ctx.translate(cx, hy); ctx.scale(1, .16); ctx.translate(-cx, -hy); ctx.fillRect(cx - sc * 1.2, hy - sc * 1.2, sc * 2.4, sc * 2.4); ctx.restore();
    ctx.globalAlpha = .35;
    var lg = ctx.createLinearGradient(0, 0, W, 0);
    var edge = document.documentElement.dir === "rtl" ? [1, 0] : [0, 1];
    lg.addColorStop(edge[0], "rgba(255,190,110,0)"); lg.addColorStop(.5, "rgba(255,190,110,.35)"); lg.addColorStop(edge[1], "rgba(140,210,255,.2)");
    ctx.fillStyle = lg; ctx.fillRect(0, hy, W, 1);

    // incoming stream
    for (var k = 0; k < stream.length; k++) {
      var s = stream[k];
      var dx = cx - s.x, dy = (cy + sc * .1) - s.y, d = Math.hypot(dx, dy) || 1;
      var sp = s.v * (1 + (1 - Math.min(1, d / W)) * 2.2) * step;
      s.x += dx / d * sp; s.y += dy / d * sp * .55;
      s.a = Math.min(s.max, s.a + .015 * step);
      var fade = Math.min(1, d / (sc * .55));
      if (d < sc * .3) spawn(s, false);
      var al = s.a * fade, sz = s.s * 7 * ps;
      ctx.globalAlpha = al;
      ctx.drawImage(s.ice ? ICE : GOLD, s.x - sz / 2, s.y - sz / 2, sz, sz);
      var ry = 2 * hy - s.y;
      if (ry > hy && (k & 1)) { ctx.globalAlpha = al * .4; ctx.drawImage(GOLD, s.x - sz / 2, ry - sz / 2, sz, sz); }
    }

    // the shape
    var tgt = shapes[shapeIdx], mr = fine ? 110 : 0;
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i], q = tgt[i];
      if (now >= p.d && p.kx !== undefined) { p.vx += p.kx; p.vy += p.ky; p.kx = undefined; }
      var from = now < p.d ? shapes[(shapeIdx + 3) % 4][i] : q;
      var tx = cx + from[0] * sc + Math.sin(t * 1.3 + p.ph) * .9, ty = cy + from[1] * sc + Math.cos(t * 1.1 + p.ph * 1.7) * .9;
      p.vx += (tx - p.x) * .045 * step; p.vy += (ty - p.y) * .045 * step;
      if (mr) {
        var mx = p.x - mouse.x, my = p.y - mouse.y, md = mx * mx + my * my;
        if (md < mr * mr) { var m = Math.sqrt(md) || 1, f = (mr - m) / mr * 1.6 * step; p.vx += mx / m * f; p.vy += my / m * f; }
      }
      var damp = Math.pow(.84, step);
      p.vx *= damp; p.vy *= damp; p.x += p.vx * step; p.y += p.vy * step;
      var tw = .75 + Math.sin(t * 3 + p.ph * 3) * .25;
      var al2 = p.a * tw, sz2 = p.s * 6.5 * ps;
      ctx.globalAlpha = al2;
      ctx.drawImage(p.ice ? ICE : p.amber ? AMBER : GOLD, p.x - sz2 / 2, p.y - sz2 / 2, sz2, sz2);
      var ry2 = 2 * hy - p.y, depth = (ry2 - hy) / (sc * .9);
      if (depth > 0 && depth < 1 && (i & 1)) { ctx.globalAlpha = al2 * .45 * (1 - depth); ctx.drawImage(p.ice ? ICE : GOLD, p.x - sz2 / 2, ry2 - sz2 / 2, sz2, sz2 * .8); }
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
  }

  // Adaptive quality: if the first ~2 s run well under 50 fps, drop half
  // of the particles (weak phones, battery saver) and keep the motion smooth.
  var slowFrames = 0, counted = 0, degraded = false;
  function frame(now) {
    var step = last ? Math.min(3, (now - last) / 16.667) : 1; last = now;
    if (!degraded && counted < 120) {
      counted++; if (step > 1.25) slowFrames++;
      if (counted === 120 && slowFrames > 60) {
        degraded = true;
        parts = parts.filter(function (p, i) { p.s *= 1.25; return i % 2 === 0; });
        stream.length = Math.round(stream.length / 2);
      }
    }
    if (now - shapeT0 > SHAPE_MS) setShape((shapeIdx + 1) % 4, now);
    draw(now, step);
    raf = requestAnimationFrame(frame);
  }
  function play(on) {
    if (on && !running) { running = true; last = 0; raf = requestAnimationFrame(frame); }
    if (!on && running) { running = false; cancelAnimationFrame(raf); }
  }

  layout();
  hero.classList.add("has-scene");
  if (reduce) {
    // One still, fully assembled frame.
    parts.forEach(function (p) { var q = shapes[0][p.i]; p.x = cx + q[0] * sc; p.y = cy + q[1] * sc; });
    stream.length = 0; setShape(0, 0); shapeT0 = Infinity; draw(0, 0);
    return;
  }
  setShape(0, performance.now());
  var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { N = 0; layout(); }, 150); });
  if (fine) {
    hero.addEventListener("pointermove", function (e) { var r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    hero.addEventListener("pointerleave", function () { mouse.x = mouse.y = -9999; });
  }
  if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; play(visible && !document.hidden); }).observe(hero);
  else play(true);
  document.addEventListener("visibilitychange", function () { play(visible && !document.hidden); });
  document.addEventListener("nm:lang", function () { N = 0; layout(); setShape(shapeIdx, performance.now()); });
})();
