/* NM Studio — home page only: gold dust in the hero light, the hero devices
   cycling through the seven live sites, pointer depth on the stage, the
   pointer-lit work cards, key-figure icons and the "how it works" line.
   Every block skips quietly if its markup is missing; nothing moves with
   prefers-reduced-motion. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var t = function (k) { return (window.NMI18n && window.NMI18n.t(k)) || ""; };
  function onVisible(el, cb, opts) {
    if (!el || !("IntersectionObserver" in window)) { if (el) cb(true); return; }
    new IntersectionObserver(function (en) { cb(en[0].isIntersecting); }, opts || {}).observe(el);
  }

  /* ---------- key figures: icons start moving once on screen ---------- */
  $$(".st__item").forEach(function (el) {
    onVisible(el, function (v) { if (v) el.classList.add("is-in"); }, { threshold: 0.5 });
  });

  if (reduce) return;

  /* ---------- hero: gold and ivory dust drifting up through the light ---------- */
  (function dust() {
    var canvas = $(".h__dust");
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d"), dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var W = 0, H = 0, motes = [], running = false, raf = 0, visible = true;
    function mote(anywhere) {
      return { x: Math.random() * W, y: anywhere ? Math.random() * H : H + 10, r: 0.4 + Math.random() * 1.5, v: 0.1 + Math.random() * 0.35, a: Math.random() * 6.28, s: 0.004 + Math.random() * 0.01, o: 0.25 + Math.random() * 0.55, gold: Math.random() < 0.7 };
    }
    function size() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(64, W * H / 24000));
      motes = [];
      for (var k = 0; k < n; k++) motes.push(mote(true));
    }
    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (var k = 0; k < motes.length; k++) {
        var m = motes[k];
        m.y -= m.v; m.a += m.s; m.x += Math.sin(m.a) * 0.25;
        if (m.y < -10) motes[k] = m = mote(false);
        var o = (m.o * (0.65 + Math.sin(m.a * 3) * 0.35)).toFixed(3);
        ctx.beginPath();
        ctx.fillStyle = m.gold ? "rgba(243,214,150," + o + ")" : "rgba(245,237,214," + o + ")";
        ctx.shadowColor = m.gold ? "rgba(201,169,97,.9)" : "rgba(245,241,232,.75)";
        ctx.shadowBlur = m.r * 6;
        ctx.arc(m.x, m.y, m.r, 0, 6.2832); ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }
    function play(on) {
      if (on && !running) { running = true; raf = requestAnimationFrame(frame); }
      if (!on && running) { running = false; cancelAnimationFrame(raf); }
    }
    size();
    var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(size, 200); });
    onVisible(canvas, function (v) { visible = v; play(v && !document.hidden); });
    document.addEventListener("visibilitychange", function () { play(visible && !document.hidden); });
  })();

  /* ---------- hero: the MacBook + iPhone cycle through the seven live sites ---------- */
  (function showcase() {
    var mac = $(".dev--hero .mac__view"), phone = $(".dev--hero .iph__view");
    var nameEl = $("#nowName"), catEl = $("#nowCat"), dots = $$(".h__now-dots i");
    // `.h__visual` is display:none in site.css, so this mock-up is never
    // painted; offsetParent is null inside that subtree and the cross-fade
    // layers below would otherwise download 12 WebP files for nothing.
    if (!mac || !phone || !nameEl || !mac.offsetParent) return;
    var SITES = [
      { slug: "giulivo", name: "Giulivo", cat: "work.p1cat" },
      { slug: "malee", name: "Malee", cat: "work.p2cat" },
      { slug: "noir", name: "Noir", cat: "work.p3cat" },
      { slug: "neon-tiger", name: "Neon Tiger", cat: "work.p5cat" },
      { slug: "mae-lek", name: "Mae Lek", cat: "work.p6cat" },
      { slug: "ride-siam", name: "Ride Siam", cat: "work.p7cat" },
      { slug: "facadiers", name: "Atelier des Façadiers", cat: "work.p4cat" }
    ];
    var SWAP_MS = 4200, index = 0, timer = null, layers = null, visible = true, z = 1;
    document.documentElement.style.setProperty("--swap-ms", SWAP_MS + "ms");
    function layer(parent, src) {
      var img = new Image();
      img.className = "swap"; img.alt = ""; img.decoding = "async"; img.src = src;
      parent.appendChild(img);
      return img;
    }
    function build() {
      // The first site is already on screen (baked into the HTML); the others
      // get layers that cross-fade in on top of the current one.
      layers = SITES.map(function (s, i) {
        if (!i) return null;
        return { desk: layer(mac, "assets/img/work/" + s.slug + "-desk.webp"), mob: layer(phone, "assets/img/work/" + s.slug + "-mob-360.webp") };
      });
      schedule();
    }
    function show(i) {
      var prev = layers[index], next = layers[i];
      index = i;
      z += 1;
      if (next) {
        next.desk.style.zIndex = next.mob.style.zIndex = z;
        next.desk.classList.add("is-on"); next.mob.classList.add("is-on");
      } else {
        // back to the first site: fade every layer out over it
        layers.forEach(function (l) { if (l) { l.desk.classList.remove("is-on"); l.mob.classList.remove("is-on"); } });
      }
      if (prev && next) setTimeout(function () { if (layers[index] !== prev) { prev.desk.classList.remove("is-on"); prev.mob.classList.remove("is-on"); } }, 1100);
      nameEl.textContent = SITES[i].name;
      catEl.setAttribute("data-i18n", SITES[i].cat);
      catEl.textContent = t(SITES[i].cat) || catEl.textContent;
      dots.forEach(function (d, k) { d.classList.remove("is-on"); if (k === i) { void d.offsetWidth; d.classList.add("is-on"); } });
    }
    function schedule() {
      clearTimeout(timer);
      if (!layers || !visible || document.hidden) return;
      timer = setTimeout(function () { show((index + 1) % SITES.length); schedule(); }, SWAP_MS);
    }
    onVisible(mac, function (v) { visible = v; schedule(); });
    document.addEventListener("visibilitychange", schedule);
    // The other screenshots load only once the page itself has finished.
    if (document.readyState === "complete") setTimeout(build, 900);
    else window.addEventListener("load", function () { setTimeout(build, 900); });
  })();

  /* ---------- how it works: the line between the steps draws as you scroll ---------- */
  (function howLine() {
    var steps = $(".how__steps");
    if (!steps) return;
    var queued = false;
    function update() {
      queued = false;
      var r = steps.getBoundingClientRect(), vh = window.innerHeight;
      var p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height * 0.6)));
      steps.style.setProperty("--p", p.toFixed(3));
    }
    window.addEventListener("scroll", function () { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener("resize", update);
    update();
  })();

  if (!fine) return;

  /* ---------- hero stage: pointer-driven depth ---------- */
  (function stageDepth() {
    var hero = $(".h"), stage = $("#stage");
    if (!hero || !stage) return;
    var rx = 0, ry = 0, trx = 0, try_ = 0, running = false;
    function loop() {
      rx += (trx - rx) * 0.07; ry += (try_ - ry) * 0.07;
      stage.style.setProperty("--rx", rx.toFixed(2) + "deg");
      stage.style.setProperty("--ry", ry.toFixed(2) + "deg");
      if (Math.abs(trx - rx) > 0.01 || Math.abs(try_ - ry) > 0.01) requestAnimationFrame(loop);
      else running = false;
    }
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      try_ = ((e.clientX - r.left) / r.width - 0.5) * 12;
      trx = -((e.clientY - r.top) / r.height - 0.5) * 8;
      if (!running) { running = true; requestAnimationFrame(loop); }
    });
    hero.addEventListener("pointerleave", function () { trx = 0; try_ = 0; if (!running) { running = true; requestAnimationFrame(loop); } });
  })();

  /* ---------- work cards: gold light follows the pointer, the card tilts ---------- */
  $$(".wk-card").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
      card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      card.style.transform = "perspective(1400px) rotateY(" + ((px - 0.5) * 5).toFixed(2) + "deg) rotateX(" + ((0.5 - py) * 4).toFixed(2) + "deg) translateY(-4px)";
    });
    card.addEventListener("pointerleave", function () { card.style.transform = ""; });
  });
})();
