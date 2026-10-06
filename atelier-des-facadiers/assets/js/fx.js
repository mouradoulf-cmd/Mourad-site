/* ==========================================================================
   Atelier des Façadiers — fx.js  (premium motion layer)
   Loaded with `defer` after site.js. Nothing here is required to read or use
   the site: every effect is additive, and each one is skipped when the user
   asks for reduced motion, uses a touch screen, or the device is low-powered.

   1. Entrance loader   – six cladding panels lift away once the hero is ready
   2. Page transition   – one ink panel wipes between pages
   3. Custom cursor     – dot + ring with contextual states (native cursor stays)
   4. 3D tilt           – cards lean toward the pointer (depth, not decoration)
   5. Optional sound    – synthesised (WebAudio), OFF by default, no audio files
   6. Hero 3D           – lazy-loaded Three.js scene of installing cladding panels
   ========================================================================== */
(function () {
"use strict";
var D = document, H = D.documentElement;
var $ = function (s, r) { return (r || D).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || D).querySelectorAll(s)); };
var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
var fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
var LANG = H.lang || "fr", TX = (window.I18N && window.I18N[LANG]) || {};
var t = function (k, fb) { return TX[k] != null ? TX[k] : fb; };
var clamp = function (x, a, b) { return Math.min(b, Math.max(a, x)); };

/* ------------------------------------------------------------------ 5. sound */
/* Tiny synth: a soft tick on hover, a "snap" on click, a chime when the
   loader ends. Volumes stay very low; nothing plays until the visitor opts in. */
var Snd = (function () {
  var ctx = null, on = false;
  try { on = localStorage.getItem("adf-snd") === "1"; } catch (e) {}
  function ac() { if (!ctx) { var C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ctx = new C(); } if (ctx.state === "suspended") ctx.resume(); return ctx; }
  function tone(f, d, type, vol, slide) {
    if (!on) return; var c = ac(); if (!c) return;
    var o = c.createOscillator(), g = c.createGain(), n = c.currentTime;
    o.type = type || "sine"; o.frequency.setValueAtTime(f, n); if (slide) o.frequency.exponentialRampToValueAtTime(slide, n + d);
    g.gain.setValueAtTime(0.0001, n); g.gain.exponentialRampToValueAtTime(vol || 0.03, n + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, n + d);
    o.connect(g); g.connect(c.destination); o.start(n); o.stop(n + d + 0.02);
  }
  return {
    get on() { return on; },
    set: function (v) { on = v; try { localStorage.setItem("adf-snd", v ? "1" : "0"); } catch (e) {} if (v) { ac(); tone(660, .12, "sine", .04, 990); } },
    tick: function () { tone(1500, .035, "triangle", .012); },
    snap: function () { tone(180, .09, "square", .018, 70); tone(2400, .02, "triangle", .01); },
    pick: function () { tone(520, .09, "sine", .03); setTimeout(function () { tone(780, .12, "sine", .026); }, 70); },
    chime: function () { [523, 659, 784].forEach(function (f, i) { setTimeout(function () { tone(f, .5, "sine", .02); }, i * 90); }); }
  };
})();
window.__snd = Snd;

/* toggle button, injected in the header (aria-label comes from the i18n dictionary) */
(function () {
  var box = $(".hdr__cta"); if (!box) return;
  var b = D.createElement("button"); b.type = "button"; b.className = "snd";
  b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path class="on" d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/><path class="off" d="M16 9.5l4 5m0-5l-4 5"/></svg>';
  var upd = function () { b.setAttribute("aria-pressed", String(Snd.on)); b.setAttribute("aria-label", Snd.on ? t("sound_off", "Couper le son") : t("sound_on", "Activer le son")); };
  b.addEventListener("click", function () { Snd.set(!Snd.on); upd(); });
  upd(); var lang = $(".lang", box); box.insertBefore(b, lang || $(".burger", box));
})();
/* sound hooks: hover tick on interactive elements, snap on press, pick on configurator choices */
if (fine) D.addEventListener("pointerover", (function () { var last = 0; return function (e) { if (!Snd.on) return; var el = e.target.closest && e.target.closest("a,button,.chip,.sw label"); if (!el) return; var n = performance.now(); if (n - last < 70) return; last = n; Snd.tick(); }; })());
D.addEventListener("pointerdown", function (e) { if (Snd.on && e.target.closest && e.target.closest("a,button,.chip,.sw label")) Snd.snap(); });
D.addEventListener("change", function (e) { if (Snd.on && e.target.closest && e.target.closest("#cfg")) Snd.pick(); });

/* ------------------------------------------------------------------ 1. loader */
var ldr = $(".ldr");
function finishLoader() {
  H.classList.remove("ldr-on"); H.classList.add("ldr-done");
  try { sessionStorage.setItem("adf-ldr", "1"); } catch (e) {}
  if (ldr) setTimeout(function () { ldr.remove(); }, 1400);
}
var loaderDone = Promise.resolve();
if (ldr && H.classList.contains("ldr-on")) {
  loaderDone = new Promise(function (res) {
    var n = $(".ldr__n", ldr), bar = $(".ldr__bar", ldr), t0 = performance.now(), MIN = 1300, MAX = 3200, ready = false, closing = false;
    /* "ready" = the page and the hero poster/video have something to show */
    var hv = $(".hero__video");
    var mark = function () { ready = true; };
    if (D.readyState === "complete") mark(); else addEventListener("load", mark, { once: true });
    if (hv && hv.readyState < 2) hv.addEventListener("loadeddata", mark, { once: true });
    setTimeout(mark, MAX - 600);
    (function tick(now) {
      var el = now - t0, target = ready ? 100 : Math.min(88, 100 * (1 - Math.exp(-el / 900)));
      var shown = ready ? clamp(el / MIN * 100, 0, 100) : Math.min(target, el / MIN * 100);
      n.textContent = Math.round(shown); bar.style.setProperty("--p", (shown / 100).toFixed(3));
      if (shown >= 100 && !closing) {
        closing = true; Snd.chime();
        ldr.classList.add("out");
        setTimeout(function () { finishLoader(); res(); }, 520);   /* hero text starts while panels lift */
        return;
      }
      if (!closing) requestAnimationFrame(tick);
    })(t0);
  });
}

/* ------------------------------------------------------------------ 2. page transition */
if (!reduce) {
  D.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a"); if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || a.target) return;
    var h = a.getAttribute("href"); if (!h || /^(#|tel:|mailto:|https?:|javascript:)/.test(h)) return;
    var u = new URL(a.href, location.href); if (u.pathname === location.pathname && u.search === location.search) return;
    e.preventDefault(); try { sessionStorage.setItem("adf-wipe", "1"); } catch (x) {}
    D.body.classList.add("leave"); setTimeout(function () { location.href = a.href; }, 430);
  });
  addEventListener("pageshow", function (e) { if (e.persisted) D.body.classList.remove("leave"); });
}

/* ------------------------------------------------------------------ 3. cursor */
/* States: default (ring) · link (ring grows, accent) · media (filled, label) · field (text caret) · down (press) */
if (fine && !reduce) {
  var cur = D.createElement("div"); cur.className = "cur"; cur.setAttribute("aria-hidden", "true");
  cur.innerHTML = '<i class="cur__dot"></i><div class="cur__ring"><i></i><span class="cur__t"></span></div>';
  D.body.appendChild(cur);
  var dot = $(".cur__dot", cur), ring = $(".cur__ring", cur), lab = $(".cur__t", cur);
  var mx = -100, my = -100, rx = -100, ry = -100, shown = false, raf = 0;
  var set = function (s, txt) { if (cur.dataset.s !== s) cur.dataset.s = s; if (txt !== undefined && lab.textContent !== txt) lab.textContent = txt; };
  var loop = function () {
    rx += (mx - rx) * .2; ry += (my - ry) * .2;
    dot.style.transform = "translate3d(" + mx + "px," + my + "px,0)"; ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0)";
    raf = (Math.abs(mx - rx) > .1 || Math.abs(my - ry) > .1) ? requestAnimationFrame(loop) : 0;
  };
  addEventListener("pointermove", function (e) {
    mx = e.clientX; my = e.clientY; if (!shown) { shown = true; rx = mx; ry = my; cur.classList.add("on"); }
    var el = e.target.closest ? e.target : null;
    if (el && el.closest(".hz__it:not(.hz__end),.mason a")) set("media", el.closest(".mason") ? "+" : t("cursor", "Voir"));
    else if (el && el.closest("input,textarea,select")) set("field", "");
    else if (el && el.closest("a,button,label,summary,.chip")) set("link", "");
    else set("", "");
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });
  D.addEventListener("pointerdown", function () { cur.dataset.prev = cur.dataset.s || ""; set("down"); });
  D.addEventListener("pointerup", function () { set(cur.dataset.prev || ""); });
  D.addEventListener("mouseleave", function () { cur.classList.remove("on"); shown = false; });
}

/* ------------------------------------------------------------------ 4. 3D tilt */
if (fine && !reduce) {
  $$(".card,.bc,.hz__img,.cfg__view").forEach(function (el) {
    var box = el.classList.contains("hz__img") ? el.parentElement : el;
    box.classList.add("tilt");
    var max = box.classList.contains("cfg__view") ? 2.2 : 6;
    box.addEventListener("pointerenter", function () { box.classList.add("is-tilting"); });
    box.addEventListener("pointermove", function (e) {
      var r = box.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      box.style.setProperty("--ry", (px * max * 2).toFixed(2) + "deg"); box.style.setProperty("--rx", (-py * max * 2).toFixed(2) + "deg"); box.style.setProperty("--ty", "-3px");
    });
    box.addEventListener("pointerleave", function () { box.classList.remove("is-tilting"); box.style.setProperty("--ry", "0deg"); box.style.setProperty("--rx", "0deg"); box.style.setProperty("--ty", "0px"); });
  });
}

/* ------------------------------------------------------------------ 6. hero 3D */
/* Conditions: wide screen, fine pointer, no reduced motion, no data-saver, enough CPU
   cores, WebGL available. Loaded after the loader and an idle moment, so it can never
   delay first paint; if anything fails the video hero is simply left as is. */
var hero = $(".hero");
if (hero && fine && !reduce && matchMedia("(min-width:1100px)").matches && !(navigator.connection && navigator.connection.saveData) && (navigator.hardwareConcurrency || 8) >= 4) {
  var probe = D.createElement("canvas"), gl = null;
  try { gl = probe.getContext("webgl2") || probe.getContext("webgl"); } catch (e) {}
  /* refuse software renderers (no GPU): the video hero is better than a slow 3D scene */
  if (gl) { try { var dbg = gl.getExtension("WEBGL_debug_renderer_info"), rn = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : ""; if (/swiftshader|llvmpipe|software|basic render/i.test(rn) && !/gl=force/.test(location.href)) gl = null; } catch (e) {} }
  if (gl) {
    var idle = window.requestIdleCallback || function (f) { setTimeout(f, 400); };
    Promise.all([loaderDone, new Promise(function (r) { if (D.readyState === "complete") r(); else addEventListener("load", r, { once: true }); })]).then(function () {
      idle(function () {
        import("./hero3d.js?v=10").then(function (m) { m.start(hero); }).catch(function () { /* silent fallback: video hero */ });
      }, { timeout: 2500 });
    });
  }
}

/* ------------------------------------------------------------------ 7. 3D viewers (bardage, ossature) */
/* Lazy, same gating spirit as the hero: the module itself refuses software GL, reduced motion, data-saver. */
var labPage = /\/(bardage|ossature)\.html$/.exec(location.pathname) || (/\/(bardage|ossature)\/?$/.exec(location.pathname));
if (labPage) {
  var idle2 = window.requestIdleCallback || function (f) { setTimeout(f, 300); };
  Promise.all([loaderDone, new Promise(function (r) { if (D.readyState === "complete") r(); else addEventListener("load", r, { once: true }); })]).then(function () {
    idle2(function () {
      import("./lab3d.js?v=3").then(function (m) { m.init(labPage[1]); }).catch(function () { /* page stays as is */ });
    }, { timeout: 2500 });
  });
}
})();
