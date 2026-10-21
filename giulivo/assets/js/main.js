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
  ["hero__place", "hero__tag", "hero__lead", "hero__ctas", "hero__proof"].forEach(function (c, i) { var el = $("." + c); if (el) { el.setAttribute("data-in", ""); el.style.setProperty("--d", i + (i ? 2 : 0)); } });
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
  var rvSel = ".mani__facts li, .rev__in > *, .book__copy > *, .bk, .find__grid > div, .foot .wrap > *, .carta__intro > *";
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
    $$('[data-carta="prev"]').forEach(function (b) { b.disabled = cur === 0; }); $$('[data-carta="next"]').forEach(function (b) { b.disabled = cur === N - 1; });
    if (cur > 0) { var sw = $(".carta__swipe"); if (sw) sw.classList.add("used"); }
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
    var stageEl = $("#cartaStage") || deck;
    stageEl.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    stageEl.addEventListener("touchend", function (e) {
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

  /* ---------------------------------------------------------------- DALLA CUCINA: mosaic reveal + full-screen viewer */
  var gGrid = $(".gal__grid"), gBtns = $$(".gal__btn"), lb = $("#lb"), lbImg = $("#lbImg"), lbName = $("#lbName"), lbN = $("#lbN"), lbI = 0;
  if (gGrid) {
    $$(".gal__it").forEach(function (it, k) { it.style.setProperty("--k", k); });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en, o) { if (en[0].isIntersecting) { gGrid.classList.add("in"); o.disconnect(); } }, { threshold: .12 }).observe(gGrid);
    else gGrid.classList.add("in");
  }
  function lbShow(i, anim) {
    lbI = (i + gBtns.length) % gBtns.length; var b = gBtns[lbI], nm = b.querySelector(".gal__name"), name = nm.getAttribute("data-full") || nm.textContent;
    var go = function () { lbImg.src = b.getAttribute("data-full"); lbImg.alt = name; lbName.textContent = name; lbN.textContent = String(lbI + 1).padStart(2, "0") + " / " + String(gBtns.length).padStart(2, "0"); lbImg.classList.remove("swap"); };
    if (anim) { lbImg.classList.add("swap"); setTimeout(go, 180); } else go();
  }
  if (lb && gBtns.length && lb.showModal) {
    gBtns.forEach(function (b, i) { b.addEventListener("click", function () { lbShow(i); lb.showModal(); if (lenis) lenis.stop(); }); });
    lb.addEventListener("close", function () { if (lenis) lenis.start(); });
    lb.addEventListener("click", function (e) { var t = e.target.closest("[data-lb]"); if (!t) { if (e.target === lb) lb.close(); return; } var v = t.getAttribute("data-lb"); if (v === "close") lb.close(); else lbShow(lbI + +v, true); });
    lb.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") lbShow(lbI + 1, true); if (e.key === "ArrowLeft") lbShow(lbI - 1, true); });
    var lx = null, ly = null;
    lb.addEventListener("touchstart", function (e) { lx = e.touches[0].clientX; ly = e.touches[0].clientY; }, { passive: true });
    lb.addEventListener("touchend", function (e) { if (lx == null) return; var dx = e.changedTouches[0].clientX - lx, dy = e.changedTouches[0].clientY - ly; lx = null; if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) lbShow(lbI + (dx < 0 ? 1 : -1), true); else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) lb.close(); }, { passive: true });
  }

  /* ---------------------------------------------------------------- photo reveals + gentle parallax (desktop) */
  if ("IntersectionObserver" in window) {
    var pio = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); pio.unobserve(x.target); } }); }, { rootMargin: "0px 0px -12% 0px" });
    $$(".terr__f, .mani__media, .sun__media").forEach(function (el) { pio.observe(el); });
  } else $$(".terr__f, .mani__media, .sun__media").forEach(function (el) { el.classList.add("in"); });
  var pars = $$("[data-par]");
  function paintPar() {
    var vh = innerHeight;
    pars.forEach(function (el) {
      var r = el.getBoundingClientRect(); if (r.bottom < -100 || r.top > vh + 100) return;
      var k = ((r.top + r.height / 2) - vh / 2) / (vh / 2 + r.height / 2), dir = +(el.getAttribute("data-par") || 1);
      var img = el.querySelector("img"); if (img) img.style.setProperty("--py", (clamp(k, -1, 1) * -0.06 * r.height * dir).toFixed(1) + "px");
    });
  }
  if (PIN && !reduce && pars.length) { var parQ = false; addEventListener("scroll", function () { if (!parQ) { parQ = true; requestAnimationFrame(function () { parQ = false; paintPar(); }); } }, { passive: true }); paintPar(); }

  /* "View" disc follows the pointer over the dishes */
  var gCur = $(".gal__cursor");
  if (gCur && gGrid && matchMedia("(hover: hover) and (pointer: fine)").matches) {
    gGrid.addEventListener("pointermove", function (e) { gCur.style.left = e.clientX + "px"; gCur.style.top = e.clientY + "px"; gCur.classList.toggle("on", !!e.target.closest(".gal__btn")); });
    gGrid.addEventListener("pointerleave", function () { gCur.classList.remove("on"); });
    addEventListener("scroll", function () { gCur.classList.remove("on"); }, { passive: true });
  }

  /* ---------------------------------------------------------------- reviews: count-up */
  var rev = $(".rev"), revNum = $(".rev__num");
  if (rev && "IntersectionObserver" in window) {
    new IntersectionObserver(function (en, o) {
      if (!en[0].isIntersecting) return; o.disconnect(); rev.classList.add("in");
      if (reduce) return; var t0 = performance.now();
      (function step(now) { var k = clamp((now - t0) / 1400, 0, 1), v = 4.7 * ease(k); revNum.textContent = (I.lang === "en" ? v.toFixed(1) : v.toFixed(1).replace(".", ",")); if (k < 1) requestAnimationFrame(step); })(t0);
    }, { threshold: .4 }).observe(rev);
  }
  document.addEventListener("giu:lang", function () { if (revNum) revNum.textContent = (I.lang === "en") ? "4.7" : "4,7"; });

  /* ---------------------------------------------------------------- booking → WhatsApp */
  var WA = "393888566367";
  var bk = $("#bk"), daysEl = $("#bkDays"), timesEl = $("#bkTimes"), peopleEl = $("#bkPeople"), sumEl = $("#bkSummary"), errEl = $(".bk__err");
  var state = { day: 0, time: "20:00", people: 2, where: "terrace" };
  var LOC = { it: "it-IT", en: "en-GB", de: "de-DE", nl: "nl-NL" };
  var TIMES = ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"];
  var LUNCH = ["12:30", "13:00", "13:30"];   // Sunday lunch (the restaurant confirms every request)
  function isSunday(i) { return dayDate(i).getDay() === 0; }
  function renderTimes() {
    var sun = isSunday(state.day), all = (sun ? LUNCH : []).concat(TIMES);
    if (all.indexOf(state.time) < 0) state.time = "20:00";
    timesEl.innerHTML = "";
    function group(label, list) {
      if (sun) { var g = document.createElement("p"); g.className = "bk__group"; g.textContent = label; timesEl.appendChild(g); }
      list.forEach(function (t) { var b = document.createElement("button"); b.type = "button"; b.className = "slot"; b.setAttribute("role", "radio"); b.textContent = t; b.dataset.t = t; radio(b, t === state.time); timesEl.appendChild(b); });
    }
    if (sun) group(I.t("book.lunch"), LUNCH);
    group(I.t("book.dinner"), TIMES);
  }
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
    renderTimes();
    summary();
  }
  function summary() {
    if (!sumEl) return;
    var where = state.where === "terrace" ? I.t("book.terrace") : I.t("book.inside");
    sumEl.textContent = dayLabel(state.day, true) + " · " + state.time + " · " + state.people + " " + I.t("book.guests") + " · " + where;
  }
  if (bk) {
    buildBooking();
    document.addEventListener("giu:lang", buildBooking);
    daysEl.addEventListener("click", function (e) { var b = e.target.closest(".day"); if (!b) return; state.day = +b.dataset.i; $$(".day", daysEl).forEach(function (x) { radio(x, x === b); }); renderTimes(); summary(); });
    timesEl.addEventListener("click", function (e) { var b = e.target.closest(".slot"); if (!b) return; state.time = b.dataset.t; $$(".slot", timesEl).forEach(function (x) { radio(x, x === b); }); summary(); });
    $$("[data-step]", bk).forEach(function (b) { b.addEventListener("click", function () { state.people = clamp(state.people + +b.dataset.step, 1, 30); peopleEl.textContent = state.people; summary(); }); });
    $$("[data-where]", bk).forEach(function (b) { b.addEventListener("click", function () { state.where = b.dataset.where; $$("[data-where]", bk).forEach(function (x) { x.setAttribute("aria-checked", String(x === b)); }); summary(); }); });
    // "Book Sunday lunch": pick the next Sunday at 13:00, then the anchor scrolls to the form
    $$("[data-sunday]").forEach(function (a) { a.addEventListener("click", function () {
      for (var i = 0; i < 7; i++) if (isSunday(i)) { state.day = i; break; }
      state.time = "13:00"; buildBooking();
      var on = daysEl.querySelector('[aria-checked="true"]'); if (on) daysEl.scrollLeft = on.offsetLeft - daysEl.offsetLeft - 12;
    }); });
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
