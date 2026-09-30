/* NM Studio — micro-interactions, layered on top of main.js:
   cursor dot + light trail, button ripple and magnetism, scroll-driven
   marquees, price count-up and pointer-lit card borders.
   Only transform/opacity are animated; every loop sleeps when idle, and
   nothing here runs with prefers-reduced-motion. */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var t = function (k) { return (window.NMI18n && window.NMI18n.t(k)) || ""; };
  var P = window.NMPrice;

  if (reduce) return;

  /* ---------- price count-up: big prices run up from zero the first time they show ---------- */
  (function countUp() {
    if (!P || !("IntersectionObserver" in window)) return;
    var els = $$(".offer__price strong[data-thb], .pcard__price strong[data-thb]");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        run(en.target);
      });
    }, { threshold: 0.6 });
    function run(el) {
      var to = +el.getAttribute("data-thb"), t0 = performance.now(), dur = 1300;
      if (!to) return;
      (function step(now) {
        var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 4);
        var target = +el.getAttribute("data-thb"); // the billing toggle may change it mid-run
        el.textContent = P.thb(p < 1 ? Math.round(target * e / 10) * 10 : target);
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    }
    els.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- marquees: speed follows the scroll, direction follows its sign ---------- */
  (function marquees() {
    var tracks = $$("[data-marquee] .marquee__track");
    if (!tracks.length || !tracks[0].getAnimations) return;
    var anims = [], rate = 1, target = 1, hover = false, lastY = window.scrollY, running = false, visible = true;
    function collect() { anims = tracks.map(function (tr) { return tr.getAnimations()[0]; }).filter(Boolean); }
    collect();
    function loop() {
      var y = window.scrollY, v = y - lastY; lastY = y;
      var boost = Math.min(5, Math.abs(v) / 6);
      target = (hover ? 0.25 : 1) * (v < -1 ? -1 : 1) * (1 + boost);
      rate += (target - rate) * 0.08;
      if (!anims.length) collect();
      anims.forEach(function (a) { a.playbackRate = rate; });
      if (visible && (Math.abs(target - rate) > 0.01 || Math.abs(v) > 0)) requestAnimationFrame(loop);
      else running = false;
    }
    function wake() { if (!running && visible) { running = true; requestAnimationFrame(loop); } }
    window.addEventListener("scroll", wake, { passive: true });
    var aud = $(".audience");
    if (aud) {
      aud.addEventListener("pointerenter", function () { hover = true; wake(); });
      aud.addEventListener("pointerleave", function () { hover = false; wake(); });
      if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; wake(); }).observe(aud);
    }
  })();

  if (!fine) return;

  /* ---------- cursor: exact dot, trailing ring (main.js) and a fading light trail ---------- */
  (function cursorTrail() {
    var ring = $(".cursor");
    var dot = document.createElement("div"); dot.className = "cursor-dot"; dot.setAttribute("aria-hidden", "true");
    var canvas = document.createElement("canvas"); canvas.className = "cursor-trail"; canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas); document.body.appendChild(dot);
    var ctx = canvas.getContext("2d"), dpr = Math.min(window.devicePixelRatio || 1, 2);
    var pts = [], MAX = 22, x = -100, y = -100, running = false, lastMove = 0;
    function size() { canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    size(); window.addEventListener("resize", size);
    window.addEventListener("pointermove", function (e) {
      x = e.clientX; y = e.clientY; lastMove = performance.now();
      dot.style.transform = "translate3d(" + x + "px," + y + "px,0)";
      dot.classList.add("is-active");
      if (!running) { running = true; requestAnimationFrame(frame); }
    }, { passive: true });
    document.documentElement.addEventListener("pointerleave", function () { dot.classList.remove("is-active"); });
    function frame(now) {
      pts.push({ x: x, y: y });
      if (pts.length > MAX) pts.shift();
      if (now - lastMove > 90) pts.shift(); // the tail catches up once the pointer rests
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      if (pts.length > 1) {
        ctx.lineCap = "round"; ctx.lineJoin = "round";
        for (var i = 1; i < pts.length; i++) {
          var k = i / pts.length;
          ctx.beginPath();
          ctx.moveTo(pts[i - 1].x, pts[i - 1].y); ctx.lineTo(pts[i].x, pts[i].y);
          ctx.strokeStyle = "rgba(" + Math.round(123 + 107 * k) + "," + Math.round(97 + 97 * k) + "," + Math.round(255 - 133 * k) + "," + (k * 0.55).toFixed(3) + ")"; // violet tail → gold head
          ctx.lineWidth = 0.6 + k * 3.2;
          ctx.stroke();
        }
      }
      if (pts.length > 1) requestAnimationFrame(frame);
      else { running = false; pts.length = 0; ctx.clearRect(0, 0, innerWidth, innerHeight); }
    }
    if (!ring) return;
    // Ring states: grows over anything clickable, shows ▶ over offer cards.
    var label = $(".cursor__label", ring);
    document.addEventListener("pointerover", function (e) {
      var el = e.target.closest && e.target.closest("a, button, summary, label, [role='button'], input, select, textarea, .offer");
      ring.classList.toggle("is-link", !!el && !el.closest("[data-cursor]") && !el.classList.contains("offer"));
      if (el && el.classList.contains("offer") && !e.target.closest("button, a")) { label.textContent = "▶ " + t("v3.play"); ring.classList.add("is-view"); ring.classList.add("is-play"); }
      else if (ring.classList.contains("is-play")) { ring.classList.remove("is-view"); ring.classList.remove("is-play"); }
    });
    window.addEventListener("pointerdown", function () { ring.classList.add("is-down"); });
    window.addEventListener("pointerup", function () { ring.classList.remove("is-down"); });
  })();

  /* ---------- buttons: ripple from the click point, magnetism on the main ones ---------- */
  document.addEventListener("pointerdown", function (e) {
    var b = e.target.closest(".btn");
    if (!b || !b.animate) return;
    var r = b.getBoundingClientRect(), s = document.createElement("span");
    s.className = "btn__rp";
    s.style.left = (e.clientX - r.left) + "px"; s.style.top = (e.clientY - r.top) + "px";
    b.appendChild(s);
    var scale = Math.max(r.width, r.height) / 6;
    s.animate([{ transform: "scale(0)", opacity: 0.9 }, { transform: "scale(" + scale + ")", opacity: 0 }], { duration: 650, easing: "cubic-bezier(.2,.8,.2,1)" }).onfinish = function () { s.remove(); };
  });
  $$(".btn--sun:not(.magnetic):not(.btn--block), .btn--ghost:not(.magnetic):not(.btn--block), .btn--glass:not(.magnetic), .btn--light:not(.magnetic)").forEach(function (el) {
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      el.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1) + "px," + ((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1) + "px)";
    });
    el.addEventListener("pointerleave", function () { el.style.transform = ""; });
  });

  /* ---------- pricing cards and reasons: pointer-lit border ---------- */
  $$(".pcard, .why-card, .how-step").forEach(function (c) {
    c.addEventListener("pointermove", function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
      c.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
    });
  });
})();
