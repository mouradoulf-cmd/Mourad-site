/* Giulivo — interactions.
   Desktop (fine pointer, ≥ 1000px): Lenis smooth scroll + GSAP ScrollTrigger pins (html.pin).
   Touch / small screens: native scroll, no pins, same content (the 3D menu turns with buttons / swipe).
   Everything stays readable without JavaScript. */
(function () {
  "use strict";
  var root = document.documentElement;
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  var big = matchMedia("(min-width: 1000px)").matches;
  var G = window.gsap, ST = window.ScrollTrigger;
  var PIN = fine && big && !reduce && G && ST;
  if (PIN) root.classList.add("pin");
  var I = window.GiuI18n || { t: function () { return ""; }, lang: "it" };
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (x, a, b) { return Math.min(b, Math.max(a, x)); };
  var ease = function (x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };

  /* ---------------------------------------------------------------- intro → ready */
  var seen = root.classList.contains("seen");
  try { sessionStorage.setItem("giu-intro", "1"); } catch (e) {}
  ["hero__place", "hero__lead", "hero__ctas", "hero__proof"].forEach(function (c, i) { var el = $("." + c); if (el) { el.setAttribute("data-in", ""); el.style.setProperty("--d", i + (i ? 2 : 0)); } });
  setTimeout(function () { root.classList.add("ready"); }, seen || reduce ? 60 : 1500);

  /* ---------------------------------------------------------------- smooth scroll */
  var lenis = null;
  if (PIN && window.Lenis) {
    lenis = new Lenis({ lerp: .09, wheelMultiplier: 1, smoothWheel: true });
    lenis.on("scroll", ST.update);
    G.ticker.add(function (t) { lenis.raf(t * 1000); }); G.ticker.lagSmoothing(0);
  }
  if (G && ST) G.registerPlugin(ST);
  function goTo(target, off) {
    var el = typeof target === "string" ? $(target) : target; if (!el && typeof target !== "number") return;
    if (lenis) lenis.scrollTo(el || target, { offset: off || 0, duration: 1.4 });
    else if (typeof target === "number") scrollTo({ top: target, behavior: reduce ? "auto" : "smooth" });
    else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute("href"); if (id.length < 2) return; var el = $(id); if (!el) return;
    e.preventDefault(); closeDrawer(); goTo(el, id === "#top" ? 0 : -10);
  });

  /* ---------------------------------------------------------------- nav, drawer, bottom bar */
  var nav = $("#nav"), burger = $(".nav__burger"), drawer = $("#drawer"), bar = $(".bar");
  function closeDrawer() { if (!drawer || drawer.hidden) return; drawer.hidden = true; burger.setAttribute("aria-expanded", "false"); if (lenis) lenis.start(); document.body.style.overflow = ""; }
  if (burger) burger.addEventListener("click", function () { var open = drawer.hidden; drawer.hidden = !open; burger.setAttribute("aria-expanded", String(open)); document.body.style.overflow = open ? "hidden" : ""; if (lenis) open ? lenis.stop() : lenis.start(); });
  addEventListener("keydown", function (e) { if (e.key === "Escape") closeDrawer(); });
  var bookSec = $("#prenota"), foot = $(".foot"), bookIn = false, footIn = false;
  function onScroll() {
    var y = scrollY;
    nav.classList.toggle("is-solid", y > 40);
    if (bar) bar.classList.toggle("on", y > innerHeight * .8 && !bookIn && !footIn);
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.target === bookSec) bookIn = x.isIntersecting; else footIn = x.isIntersecting; }); onScroll(); }, { threshold: .15 }).observe(bookSec);
    new IntersectionObserver(function (en) { footIn = en[0].isIntersecting; onScroll(); }).observe(foot);
  }

  /* ---------------------------------------------------------------- reveals */
  var rvSel = ".mani__facts li, .ring__head > *, .rev__in > *, .book__copy > *, .bk, .find__grid > div, .foot .wrap > *, .carta__intro > *";
  if ("IntersectionObserver" in window && !reduce) {
    root.classList.add("reveal-ready");
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
    $$(rvSel).forEach(function (el, i) { el.setAttribute("data-rv", ""); el.style.setProperty("--d", i % 4); io.observe(el); });
  }

  /* ---------------------------------------------------------------- manifesto: words light up as you read */
  var mani = $("[data-words]");
  function splitWords() {
    if (!mani) return;
    var txt = mani.textContent.trim(), th = root.lang === "th";
    var parts = th ? txt.split(/(\s+)/) : txt.split(/(\s+)/);
    mani.innerHTML = parts.map(function (w) { return /^\s+$/.test(w) ? w : '<span class="w">' + w.replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }) + "</span>"; }).join("");
    paintWords();
  }
  function paintWords() {
    if (!mani) return; var ws = mani.querySelectorAll(".w"); if (!ws.length) return;
    var r = mani.getBoundingClientRect(), vh = innerHeight;
    var p = reduce ? 1 : clamp((vh * .85 - r.top) / (r.height + vh * .35), 0, 1);
    var n = Math.round(p * ws.length);
    for (var i = 0; i < ws.length; i++) ws[i].classList.toggle("on", i < n);
  }
  splitWords(); addEventListener("scroll", paintWords, { passive: true });
  document.addEventListener("giu:lang", splitWords);

  /* ---------------------------------------------------------------- LA CARTA: real menu pages turning in 3D */
  var sheets = $$(".sheet"), N = sheets.length, deck = $("#cartaDeck"), num = $("#cartaNum"), tabs = $$(".tabs__b");
  var cartaP = 0, cartaTarget = 0, cartaRaf = 0, cartaST = null;
  function renderCarta(p) {
    for (var i = 0; i < N; i++) {
      var s = sheets[i], f = clamp(p - i, 0, 1), e = ease(f), k = i - p;
      var tr;
      if (f > 0) {
        var lift = Math.sin(f * Math.PI);
        tr = "translateZ(" + (lift * 70 + (p - i) * 1.5).toFixed(1) + "px) rotateY(" + (-178 * e).toFixed(2) + "deg) rotateZ(" + (lift * -1.5).toFixed(2) + "deg)";
      } else {
        var kk = Math.max(0, k);
        tr = "translate3d(" + (kk * 5).toFixed(1) + "px," + (kk * 6).toFixed(1) + "px," + (-kk * 4).toFixed(1) + "px) rotateZ(" + (kk * .8).toFixed(2) + "deg)";
      }
      s.style.transform = tr;
      s.style.zIndex = f > .5 ? String(100 + i) : String(100 - i);
      var sh = s.querySelectorAll(".sheet__shade");
      if (sh[0]) sh[0].style.opacity = (Math.sin(f * Math.PI) * .9).toFixed(3);
      if (sh[1]) sh[1].style.opacity = (Math.sin(f * Math.PI) * .6).toFixed(3);
      s.setAttribute("aria-hidden", String(Math.round(p) !== i));
    }
    var cur = clamp(Math.round(p), 0, N - 1);
    if (num) num.textContent = cur + 1;
    var tab = sheets[cur] && sheets[cur].getAttribute("data-tab");
    tabs.forEach(function (b) { b.setAttribute("aria-selected", String(b.getAttribute("data-tab") === tab)); });
  }
  var cartaLast = 0;
  function animCarta(now) {
    cartaRaf = 0; var d = cartaTarget - cartaP, dt = Math.min(.1, ((now || performance.now()) - (cartaLast || now || 0)) / 1000) || .016; cartaLast = now;
    cartaP += d * (reduce ? 1 : 1 - Math.exp(-dt * 5.5)); if (Math.abs(d) < .002) cartaP = cartaTarget;
    renderCarta(cartaP); if (cartaP !== cartaTarget) cartaRaf = requestAnimationFrame(animCarta);
  }
  function setCarta(p) { cartaTarget = clamp(p, 0, N - 1); if (!cartaRaf) { cartaLast = performance.now(); cartaRaf = requestAnimationFrame(animCarta); } }
  function cartaGo(i) {
    i = clamp(i, 0, N - 1);
    if (cartaST) { var st = cartaST; goTo(st.start + (st.end - st.start) * (i / (N - 1)) + 2); }
    else setCarta(i);
  }
  if (N) {
    renderCarta(0);
    $$("[data-carta]").forEach(function (b) { b.addEventListener("click", function () { cartaGo(Math.round(cartaTarget) + (b.getAttribute("data-carta") === "next" ? 1 : -1)); }); });
    tabs.forEach(function (b) { b.addEventListener("click", function () { var t = b.getAttribute("data-tab"); for (var i = 0; i < N; i++) if (sheets[i].getAttribute("data-tab") === t) return cartaGo(i); }); });
    // swipe on the deck (touch)
    var sx = null, sy = null;
    deck.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    deck.addEventListener("touchend", function (e) {
      if (sx == null) return; var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; sx = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) cartaGo(Math.round(cartaTarget) + (dx < 0 ? 1 : -1));
    }, { passive: true });
    deck.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") cartaGo(Math.round(cartaTarget) + 1); if (e.key === "ArrowLeft") cartaGo(Math.round(cartaTarget) - 1); });
    deck.tabIndex = 0;
    if (PIN) {
      cartaST = ST.create({ trigger: ".carta__pin", start: "top top", refreshPriority: 2, end: "+=" + (N - 1) * 85 + "%", pin: true, scrub: true, anticipatePin: 1,
        onUpdate: function (self) { setCarta(self.progress * (N - 1)); } });
    }
  }

  /* ---------------------------------------------------------------- DALLA CUCINA: the ring turns by itself (pure CSS).
     JS only reads the animation clock a few times a second to show the name of the dish in front,
     pauses while a finger holds the ring, and stops the animation when the ring is off-screen. */
  var scene = $("#ringScene"), spin = $("#ringSpin"), items = $$(".ring__item"), RN = items.length;
  if (scene && RN) {
    var ringName = $("#ringName"), ringNum = $("#ringNum"), plates = (window.GIU_I18N || {}).plates || {}, front = 0, timer = 0;
    var T = parseFloat(getComputedStyle(scene.closest(".ring")).getPropertyValue("--T")) * 1000 || 35000;
    items.forEach(function (it, i) { it.style.setProperty("--i", i); });
    function nameOf(i) { var p = plates[items[i].getAttribute("data-dish")] || {}; return p[I.lang] || p.it || ""; }
    function show(i, force) {
      if (i === front && !force) return; front = i;
      ringName.classList.add("swap");
      setTimeout(function () { ringNum.textContent = String(i + 1).padStart(2, "0"); ringName.textContent = nameOf(i); ringName.classList.remove("swap"); }, 220);
    }
    function sync() {
      var an = spin.getAnimations ? spin.getAnimations()[0] : null; if (!an || an.currentTime == null) return;
      var p = (an.currentTime % T) / T;                       // 0..1 of a full turn
      show(Math.round(p * RN) % RN);
    }
    function run(on) { clearInterval(timer); if (on) timer = setInterval(sync, 250); }
    var hold = function (on) { scene.classList.toggle("is-paused", on); };
    scene.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") hold(true); });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (ev) { scene.addEventListener(ev, function () { hold(false); }); });
    scene.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { var v = en[0].isIntersecting; scene.classList.toggle("is-off", !v); run(v); }, { rootMargin: "100px" }).observe(scene);
    else run(true);
    document.addEventListener("giu:lang", function () { show(front, true); var h = $(".ring__how"); if (h) h.textContent = I.t(fine ? "cucina.tilt" : "cucina.tiltTouch"); });
    if (!fine) { var how = $(".ring__how"); if (how) how.textContent = I.t("cucina.tiltTouch"); }
  }

  /* ---------------------------------------------------------------- LA TERRAZZA: scroll-driven sequence */
  var terr = $(".terr"), frames = $$(".terr__f"), dots = $$(".terr__dots li");
  function paintTerr() {
    if (!PIN || !terr) return;
    var r = terr.getBoundingClientRect(), total = r.height - innerHeight;
    var p = clamp(-r.top / total, 0, 1) * (frames.length - 1);
    frames.forEach(function (f, i) {
      var o = clamp(1 - Math.abs(p - i) * 1.25, 0, 1);
      if (i === 0 && p < 0) o = 1;
      f.style.opacity = o.toFixed(3);
      f.style.setProperty("--s", (1.14 - .1 * clamp(p - i + 1, 0, 2) / 2).toFixed(4));
      f.style.zIndex = o > .5 ? 2 : 1;
    });
    dots.forEach(function (d, i) { d.style.setProperty("--p", clamp(p - i + 1, 0, 1).toFixed(3)); });
  }
  if (PIN) { addEventListener("scroll", function () { requestAnimationFrame(paintTerr); }, { passive: true }); paintTerr(); }

  /* ---------------------------------------------------------------- reviews: count-up */
  var rev = $(".rev"), revNum = $(".rev__num");
  if (rev && "IntersectionObserver" in window) {
    new IntersectionObserver(function (en, o) {
      if (!en[0].isIntersecting) return; o.disconnect(); rev.classList.add("in");
      if (reduce) return; var t0 = performance.now();
      (function step(now) { var k = clamp((now - t0) / 1400, 0, 1), v = 4.7 * ease(k); revNum.textContent = (I.lang === "it" || I.lang === "de" ? v.toFixed(1).replace(".", ",") : v.toFixed(1)); if (k < 1) requestAnimationFrame(step); })(t0);
    }, { threshold: .4 }).observe(rev);
  }
  document.addEventListener("giu:lang", function () { if (revNum) revNum.textContent = (I.lang === "it" || I.lang === "de") ? "4,7" : "4.7"; });

  /* ---------------------------------------------------------------- booking → WhatsApp */
  var WA = "393888566367";
  var bk = $("#bk"), daysEl = $("#bkDays"), timesEl = $("#bkTimes"), peopleEl = $("#bkPeople"), sumEl = $("#bkSummary"), errEl = $(".bk__err");
  var state = { day: 0, time: "20:00", people: 2, where: "terrace" };
  var LOC = { it: "it-IT", en: "en-GB", de: "de-DE", th: "th-TH" };
  var TIMES = ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"];
  function dayDate(i) { var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + i); return d; }
  function dayLabel(i, long) {
    var d = dayDate(i), loc = LOC[I.lang] || "it-IT";
    if (!long) return d.toLocaleDateString(loc, { weekday: "short" });
    return d.toLocaleDateString(loc, { weekday: "long", day: "numeric", month: "long" });
  }
  function radio(el, on) { el.setAttribute("aria-checked", String(on)); el.tabIndex = on ? 0 : -1; }
  function buildBooking() {
    if (!bk) return;
    daysEl.innerHTML = "";
    for (var i = 0; i < 14; i++) {
      var b = document.createElement("button"); b.type = "button"; b.className = "day"; b.setAttribute("role", "radio"); b.dataset.i = i;
      var small = i === 0 ? I.t("book.today") : i === 1 ? I.t("book.tomorrow") : dayLabel(i);
      b.innerHTML = "<small>" + small + "</small><b>" + dayDate(i).getDate() + "</b><small>" + dayDate(i).toLocaleDateString(LOC[I.lang] || "it-IT", { month: "short" }) + "</small>";
      radio(b, i === state.day); daysEl.appendChild(b);
    }
    timesEl.innerHTML = "";
    TIMES.forEach(function (t) { var b = document.createElement("button"); b.type = "button"; b.className = "slot"; b.setAttribute("role", "radio"); b.textContent = t; b.dataset.t = t; radio(b, t === state.time); timesEl.appendChild(b); });
    summary();
  }
  function summary() {
    if (!sumEl) return;
    var where = state.where === "terrace" ? I.t("book.terrace") : I.t("book.inside");
    sumEl.textContent = dayLabel(state.day, true) + " · " + state.time + " · " + state.people + " " + I.t("book.people").toLowerCase() + " · " + where;
  }
  if (bk) {
    buildBooking();
    document.addEventListener("giu:lang", buildBooking);
    daysEl.addEventListener("click", function (e) { var b = e.target.closest(".day"); if (!b) return; state.day = +b.dataset.i; $$(".day", daysEl).forEach(function (x) { radio(x, x === b); }); summary(); });
    timesEl.addEventListener("click", function (e) { var b = e.target.closest(".slot"); if (!b) return; state.time = b.dataset.t; $$(".slot", timesEl).forEach(function (x) { radio(x, x === b); }); summary(); });
    $$("[data-step]", bk).forEach(function (b) { b.addEventListener("click", function () { state.people = clamp(state.people + +b.dataset.step, 1, 30); peopleEl.textContent = state.people; summary(); }); });
    $$("[data-where]", bk).forEach(function (b) { b.addEventListener("click", function () { state.where = b.dataset.where; $$("[data-where]", bk).forEach(function (x) { x.setAttribute("aria-checked", String(x === b)); }); summary(); }); });
    bk.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("#bkName").value.trim(), notes = $("#bkNotes").value.trim();
      if (!name) { errEl.textContent = I.t("book.needName"); $("#bkName").focus(); return; }
      errEl.textContent = "";
      var where = state.where === "terrace" ? I.t("book.terrace") : I.t("book.inside");
      var msg = I.t("book.msg") + "\n\n" + "📅 " + dayLabel(state.day, true) + "\n🕗 " + state.time + "\n👥 " + state.people + "\n📍 " + where + "\n🙂 " + name + (notes ? "\n📝 " + notes : "");
      window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
    });
  }
  var cb = $("[data-cb]");
  if (cb) cb.addEventListener("submit", function (e) {
    e.preventDefault(); var v = $("#cbTel").value.trim(), err = $(".cb__err", cb);
    if (v.replace(/\D/g, "").length < 6) { err.textContent = I.t("book.cbErr"); return; }
    err.textContent = ""; window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(I.t("book.cbMsg") + " " + v), "_blank", "noopener");
  });

  /* ---------------------------------------------------------------- map: load Google only on demand */
  var mapBtn = $("#mapBtn");
  if (mapBtn) mapBtn.addEventListener("click", function () {
    var f = document.createElement("iframe"); f.title = "Google Maps · Giulivo"; f.loading = "lazy"; f.referrerPolicy = "no-referrer-when-downgrade";
    f.src = "https://maps.google.com/maps?q=" + encodeURIComponent("Giulivo Cucina e Buonumore, Località Luchetta 7, Vicopisano") + "&z=14&output=embed";
    $("#map").appendChild(f); mapBtn.parentNode.remove();
  });

  if (ST) { if (ST.sort) ST.sort(); ST.refresh(); addEventListener("load", function () { ST.refresh(); }); document.addEventListener("giu:lang", function () { setTimeout(function () { ST.refresh(); }, 50); }); }
})();
