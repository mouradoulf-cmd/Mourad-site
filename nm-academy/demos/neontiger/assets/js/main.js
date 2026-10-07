/* Neon Tiger — interactions (vanilla JS, no dependencies).
   The page is complete without this file; hidden "before" states only
   switch on once the observer that reveals them is confirmed to work. */
(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;
  var WA = "66812345678";
  var OPEN = 16, CLOSE = 3, HH_START = 16, HH_END = 20; // Bangkok time

  // If i18n.js failed to load, keep everything working in English.
  var I = window.NTI18n || {
    apply: function () {}, lang: function () { return "en"; }, locale: function () { return "en-GB"; },
    t: function (k) { var el = document.querySelector('[data-i18n="' + k + '"]'); return el ? el.textContent : ""; },
    ui: function (k) { return ({ openNow: "Open now · until 03:00", opensAt: "Opens today at 16:00", hhLeft: "ends in", hhStarts: "starts in", hhOff: "Every day 16:00–20:00", tonight: "Tonight", tomorrow: "Tomorrow", chooseNight: "Please choose a night.", required: "Please fill this in.", phoneBad: "Please enter a number we can reach on WhatsApp.", sent: "WhatsApp is opening with your booking — just press send.", waHello: "Hi Neon Tiger! I'd like to book a table:", waNight: "Night", waTime: "Time", waPeople: "People", waSpot: "Spot", waName: "Name", waPhone: "Phone", waNote: "Note", hh: "HH", people: "people" })[k] || ""; },
    money: function (thb) { return "฿" + thb.toLocaleString("en-US"); }
  };

  /* ---------- intro (once per visit) ---------- */
  var intro = $(".intro");
  try { sessionStorage.setItem("ntIntro", "1"); } catch (e) {}
  if (intro) setTimeout(function () { intro.classList.add("is-done"); }, reduce || root.classList.contains("no-intro") ? 0 : 2700);

  /* ---------- Bangkok clock ---------- */
  function bkk() {
    var p = {};
    new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Bangkok", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, weekday: "short" })
      .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    return { y: +p.year, m: +p.month - 1, d: +p.day, h: +p.hour % 24, min: +p.minute, s: +p.second, wd: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday) };
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  // A night belongs to the evening it started: 1 a.m. Saturday is Friday night.
  function nightDay(n) { return n.h < 5 ? (n.wd + 6) % 7 : n.wd; }
  function isOpen(n) { return n.h >= OPEN || n.h < CLOSE; }
  function isHH(n) { return n.h >= HH_START && n.h < HH_END; }

  /* ---------- header, progress, menu ---------- */
  var header = $("#header"), bar = $(".progress span"), hero = $(".hero"), lastY = window.scrollY, ticking = false, menuOpen = false;
  var navLinks = $$(".nav a"), sections = navLinks.map(function (a) { return $(a.getAttribute("href")); });
  function onScroll() {
    ticking = false;
    var y = window.scrollY, heroH = hero.offsetHeight;
    header.classList.toggle("is-solid", y > 40);
    if (!menuOpen) {
      if (y > heroH * 0.6 && y > lastY + 4) header.classList.add("is-hidden");
      else if (y < lastY - 4 || y < heroH * 0.6) header.classList.remove("is-hidden");
    }
    if (Math.abs(y - lastY) > 4) lastY = y;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
    var mid = y + window.innerHeight * 0.35, cur = -1;
    sections.forEach(function (s, i) { if (s && s.offsetTop <= mid) cur = i; });
    navLinks.forEach(function (a, i) { a.classList.toggle("is-current", i === cur); });
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  var burger = $("#burger"), menu = $("#menu");
  function setMenu(open) {
    menuOpen = open;
    burger.setAttribute("aria-expanded", String(open));
    header.classList.remove("is-hidden");
    menu.hidden = !open;
    menu.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  burger.addEventListener("click", function () { setMenu(!menuOpen); });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  window.matchMedia("(min-width: 1060px)").addEventListener("change", function (m) { if (m.matches && menuOpen) setMenu(false); });
  document.addEventListener("click", function (e) { var b = e.target.closest("[data-lang]"); if (b) I.apply(b.getAttribute("data-lang")); });

  /* ---------- reveals + counters ---------- */
  if ("IntersectionObserver" in window && !reduce) {
    var items = $$("[data-reveal]");
    items.forEach(function (el) {
      var sibs = $$(":scope > [data-reveal]", el.parentNode), i = sibs.indexOf(el);
      if (i > 0) el.style.setProperty("--d", Math.min(i * 0.07, 0.42) + "s");
    });
    root.classList.add("reveal-ready");
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); rio.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
    items.forEach(function (el) { rio.observe(el); });
    setTimeout(function () { items.forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-in"); }); }, 60);

    var counters = $$("[data-count]");
    counters.forEach(function (c) { c.textContent = "0"; });
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        cio.unobserve(en.target);
        var el = en.target, to = Number(el.getAttribute("data-count")), t0 = null;
        (function step(ts) { if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / 1500); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(step); })(performance.now());
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  // Once the title lines have risen, the neon glow may spill out of the mask.
  setTimeout(function () { $(".hero__title").classList.add("is-lit"); }, reduce ? 0 : (root.classList.contains("no-intro") ? 1800 : 3700));

  /* ---------- hero slideshow ---------- */
  var slides = $$(".hero__slide"), heroDots = $$(".hero__dots i"), slide = 0;
  function nextSlide() {
    slides[slide].classList.remove("is-on"); heroDots[slide].classList.remove("is-on");
    slide = (slide + 1) % slides.length;
    var img = $("img", slides[slide]); img.loading = "eager";
    slides[slide].classList.add("is-on"); heroDots[slide].classList.add("is-on");
  }
  if (!reduce && slides.length > 1) {
    slides.forEach(function (s) { $("img", s).loading = "eager"; });
    setInterval(function () { if (!document.hidden && window.scrollY < hero.offsetHeight) nextSlide(); }, 6000);
  }

  /* ---------- prices (baht → visitor currency, happy hour live) ---------- */
  var hhNow = false;
  function renderPrices() {
    $$("[data-price]").forEach(function (el) {
      var base = I.money(Number(el.getAttribute("data-price"))), hh = el.getAttribute("data-hh");
      if (!el.closest(".list")) { el.textContent = base; return; }
      el.classList.toggle("is-hh", !!(hh && hhNow));
      if (hh && hhNow) el.innerHTML = '<span class="was"></span><span class="now"></span>';
      else if (hh) el.innerHTML = '<span class="now"></span><span class="hh"></span>';
      else { el.textContent = base; return; }
      if (hhNow) { $(".was", el).textContent = base; $(".now", el).textContent = I.money(Number(hh)); }
      else { $(".now", el).textContent = base; $(".hh", el).textContent = I.ui("hh") + " " + I.money(Number(hh)); }
    });
  }

  /* ---------- live panel: open status, happy hour countdown, tonight ---------- */
  var hhBox = $("#hh"), hhClock = $("#hhClock"), hhSub = $("#hhSub"), hhFlag = $("#hhFlag");
  function countdown(n, targetH) {
    var left = ((targetH * 3600) - (n.h * 3600 + n.min * 60 + n.s) + 86400) % 86400;
    return pad(Math.floor(left / 3600)) + ":" + pad(Math.floor(left % 3600 / 60)) + ":" + pad(left % 60);
  }
  function tick() {
    var n = bkk(), open = isOpen(n), hh = isHH(n);
    $$("[data-status]").forEach(function (el) { el.textContent = I.ui(open ? "openNow" : "opensAt"); el.closest(".live__status, .status").classList.toggle("is-closed", !open); });
    hhBox.classList.toggle("is-on", hh);
    if (hh) { hhClock.textContent = countdown(n, HH_END); hhSub.textContent = I.ui("hhLeft") + " · " + I.t("live.hhDeal"); }
    else if (n.h >= CLOSE && n.h < HH_START) { hhClock.textContent = countdown(n, HH_START); hhSub.textContent = I.ui("hhStarts") + " · " + I.t("live.hhDeal"); }
    else { hhClock.textContent = "16:00–20:00"; hhSub.textContent = I.t("live.hhDeal"); }
    hhFlag.hidden = !hh;
    if (hh !== hhNow) { hhNow = hh; renderPrices(); }
    var nd = nightDay(n), item = $('.ev__item[data-ev="' + nd + '"]');
    $("#liveEvent").textContent = $("h3", item).textContent;
    $("#liveTime").textContent = $(".ev__time", item).textContent.split(" ")[0];
  }

  /* ---------- the week ---------- */
  var days = $$(".days [role=tab]"), evPics = $$(".ev__media picture"), evItems = $$(".ev__item"), evToday = $("#evToday");
  var todayNight = nightDay(bkk());
  function selectDay(btn, focus) {
    var d = btn.getAttribute("data-day");
    days.forEach(function (b) { var on = b === btn; b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1; });
    $("#ev").setAttribute("aria-labelledby", btn.id);
    evPics.forEach(function (p) { var on = p.getAttribute("data-ev") === d; p.classList.toggle("is-on", on); if (on) $("img", p).loading = "eager"; });
    evItems.forEach(function (it) { it.classList.toggle("is-on", it.getAttribute("data-ev") === d); });
    evToday.hidden = Number(d) !== todayNight;
    if (focus) btn.focus();
  }
  days.forEach(function (b, i) {
    if (Number(b.getAttribute("data-day")) === todayNight) b.classList.add("is-today");
    b.addEventListener("click", function () { selectDay(b); });
    b.addEventListener("keydown", function (e) {
      var dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (dir) { e.preventDefault(); selectDay(days[(i + dir + days.length) % days.length], true); }
    });
  });
  selectDay(days.filter(function (b) { return Number(b.getAttribute("data-day")) === todayNight; })[0]);
  $(".ev__cta").addEventListener("click", function () {
    var d = Number($(".days [aria-selected=true]").getAttribute("data-day"));
    var k = nights.findIndex(function (x) { return x.getDay() === d; });
    if (k > -1) pickNight(k);
  });

  /* ---------- drinks tabs ---------- */
  var tabs = $$(".tabs [role=tab]"), menuPics = $$(".menu-grid__media picture");
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab, panel = document.getElementById(t.getAttribute("aria-controls"));
      t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; panel.hidden = !on;
      if (on && !reduce) { panel.classList.remove("is-entering"); void panel.offsetWidth; panel.classList.add("is-entering"); }
    });
    var key = tab.id.replace("t-", "");
    menuPics.forEach(function (p) { var on = p.getAttribute("data-for") === key; p.classList.toggle("is-on", on); if (on) $("img", p).loading = "eager"; });
    if (focus) tab.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { selectTab(t); });
    t.addEventListener("keydown", function (e) {
      var dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (dir) { e.preventDefault(); selectTab(tabs[(i + dir + tabs.length) % tabs.length], true); }
    });
  });

  /* ---------- signature cocktail: squeeze the lime ---------- */
  var sig = $(".sig"), sigBtn = $("#sigBtn");
  function sigLabel() { $("span[data-i18n]", sigBtn).textContent = I.t(sig.classList.contains("is-pink") ? "sig.btn2" : "sig.btn"); }
  sigBtn.addEventListener("click", function () {
    var pink = !sig.classList.contains("is-pink");
    sig.classList.toggle("is-pink", pink);
    sigBtn.setAttribute("aria-pressed", String(pink));
    sigLabel();
  });

  /* ---------- gallery lightbox ---------- */
  var tiles = $$(".bento__item"), lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap"), dock = $("#lbDock"), lbIndex = 0, lastFocus = null;
  tiles.forEach(function (tile, i) {
    var b = document.createElement("button");
    b.type = "button"; b.innerHTML = "<img alt='' loading='lazy'>";
    b.firstChild.src = $("img", tile).getAttribute("src");
    b.addEventListener("click", function () { showPhoto(i); });
    dock.appendChild(b);
    tile.addEventListener("click", function () { openBox(lb, function () { showPhoto(i); }); });
  });
  function showPhoto(i) {
    lbIndex = (i + tiles.length) % tiles.length;
    var img = $("img", tiles[lbIndex]);
    lbImg.src = img.currentSrc || img.src; lbImg.alt = img.alt;
    lbImg.style.animation = "none"; void lbImg.offsetWidth; lbImg.style.animation = "";
    lbCap.textContent = $(".bento__cap", tiles[lbIndex]).textContent;
    $$("button", dock).forEach(function (d, k) { d.setAttribute("aria-current", k === lbIndex ? "true" : "false"); d.setAttribute("aria-label", $(".bento__cap", tiles[k]).textContent); });
  }
  $$(".lightbox__arrow", lb).forEach(function (a) { a.addEventListener("click", function () { showPhoto(lbIndex + Number(a.getAttribute("data-dir"))); }); });
  lb.addEventListener("click", function (e) { if (e.target === lb || e.target.classList.contains("lightbox__stage")) closeBox(lb); });
  swipe(lb, function (dir) { showPhoto(lbIndex + dir); });

  /* ---------- dialogs (lightbox, taxi card) ---------- */
  var openDialog = null;
  function openBox(box, init) {
    lastFocus = document.activeElement; openDialog = box;
    box.hidden = false; box.classList.add("is-open"); document.body.style.overflow = "hidden";
    if (init) init();
    $(".lightbox__close", box).focus();
  }
  function closeBox(box) {
    box.hidden = true; box.classList.remove("is-open"); document.body.style.overflow = ""; openDialog = null;
    if (lastFocus) lastFocus.focus();
  }
  $$(".lightbox__close").forEach(function (b) { b.addEventListener("click", function () { closeBox(b.closest(".lightbox, .taxicard")); }); });
  $("#taxiBtn").addEventListener("click", function () { openBox($("#taxiCard")); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { if (openDialog) closeBox(openDialog); else if (menuOpen) { setMenu(false); burger.focus(); } }
    if (openDialog === lb) { if (e.key === "ArrowRight") showPhoto(lbIndex + 1); if (e.key === "ArrowLeft") showPhoto(lbIndex - 1); }
    if (openDialog && e.key === "Tab") {
      var f = $$("button", openDialog).filter(function (b) { return b.offsetParent !== null; });
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  /* ---------- reviews ---------- */
  var quotes = $$(".quote"), qDots = $(".quotes__dots"), qIndex = 0, qTimer = 0;
  quotes.forEach(function (q, i) {
    var d = document.createElement("button"); d.type = "button"; d.setAttribute("aria-label", (i + 1) + " / " + quotes.length);
    d.addEventListener("click", function () { showQuote(i, true); }); qDots.appendChild(d);
  });
  function showQuote(i, user) {
    qIndex = (i + quotes.length) % quotes.length;
    quotes.forEach(function (q, k) { q.classList.toggle("is-on", k === qIndex); q.setAttribute("aria-hidden", k === qIndex ? "false" : "true"); });
    $$("button", qDots).forEach(function (d, k) { d.setAttribute("aria-current", k === qIndex ? "true" : "false"); });
    if (user) restartQ();
  }
  function restartQ() { clearInterval(qTimer); if (!reduce) qTimer = setInterval(function () { showQuote(qIndex + 1); }, 6000); }
  $$(".quotes__arrow").forEach(function (a) { a.addEventListener("click", function () { showQuote(qIndex + Number(a.getAttribute("data-dir")), true); }); });
  var qWrap = $(".quotes");
  qWrap.addEventListener("mouseenter", function () { clearInterval(qTimer); });
  qWrap.addEventListener("mouseleave", restartQ);
  swipe(qWrap, function (dir) { showQuote(qIndex + dir, true); });
  showQuote(0); restartQ();

  /* ---------- booking ---------- */
  var form = $("#bookForm"), nightsEl = $("#nights"), timesEl = $("#times"), peopleEl = $("#people");
  var nights = [], nightIdx = -1, time = "", people = 4;
  var TIMES = ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "00:00", "01:00"];
  function fmt(d, o) { return new Intl.DateTimeFormat(I.locale(), o).format(d); }
  function buildNights() {
    var n = bkk(), base = new Date(n.y, n.m, n.d - (n.h < 5 ? 1 : 0));
    nights = [];
    for (var i = 0; i < 7; i++) nights.push(new Date(base.getFullYear(), base.getMonth(), base.getDate() + i));
    nightsEl.innerHTML = "";
    nights.forEach(function (d, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "night";
      var name = i === 0 ? I.ui("tonight") : i === 1 ? I.ui("tomorrow") : fmt(d, { weekday: "short" }).replace(".", "");
      var evName = $("h3", $('.ev__item[data-ev="' + d.getDay() + '"]')).textContent;
      b.innerHTML = "<b></b><small></small><em></em>";
      b.children[0].textContent = name; b.children[1].textContent = fmt(d, { day: "numeric", month: "short" }); b.children[2].textContent = evName;
      b.setAttribute("aria-pressed", i === nightIdx ? "true" : "false");
      b.addEventListener("click", function () { pickNight(i); });
      nightsEl.appendChild(b);
    });
  }
  function pickNight(i) {
    nightIdx = i;
    $$(".night", nightsEl).forEach(function (b, k) { b.setAttribute("aria-pressed", k === i ? "true" : "false"); });
    $("#nightErr").textContent = "";
    buildTimes(); update();
  }
  function buildTimes() {
    var n = bkk(), tonight = nightIdx === 0;
    timesEl.innerHTML = "";
    var firstOk = "";
    TIMES.forEach(function (tm) {
      var h = Number(tm.slice(0, 2)), hh = h < 5 ? h + 24 : h, nowH = n.h < 5 ? n.h + 24 : n.h;
      var past = tonight && hh <= nowH;
      var b = document.createElement("button");
      b.type = "button"; b.className = "night"; b.textContent = tm; b.disabled = past;
      if (past) b.style.opacity = ".3";
      if (!past && !firstOk) firstOk = tm;
      b.addEventListener("click", function () { time = tm; $$(".night", timesEl).forEach(function (x) { x.setAttribute("aria-pressed", x.textContent === tm ? "true" : "false"); }); update(); });
      timesEl.appendChild(b);
    });
    var still = $$(".night", timesEl).some(function (x) { return x.textContent === time && !x.disabled; });
    if (!still) time = TIMES.indexOf("20:00") > -1 && !tonight ? "20:00" : firstOk || TIMES[0];
    $$(".night", timesEl).forEach(function (x) { x.setAttribute("aria-pressed", x.textContent === time ? "true" : "false"); });
  }
  $$(".stepper__btn").forEach(function (b) {
    b.addEventListener("click", function () { people = Math.max(1, Math.min(30, people + Number(b.getAttribute("data-step")))); update(); });
  });
  var prev = {};
  function spotLabel() { var r = $('input[name="spot"]:checked'); return r ? r.nextElementSibling.textContent : "—"; }
  function update() {
    peopleEl.textContent = people;
    $$(".stepper__btn")[0].disabled = people <= 1; $$(".stepper__btn")[1].disabled = people >= 30;
    $("#groupPerk").hidden = people < 6;
    var d = nights[nightIdx];
    var v = {
      tkNight: d ? fmt(d, { weekday: "long", day: "numeric", month: "long" }) : "—",
      tkTime: d ? time : "—",
      tkPeople: people + " " + I.ui("people"),
      tkSpot: spotLabel(),
      tkEvent: d ? $("h3", $('.ev__item[data-ev="' + d.getDay() + '"]')).textContent : "—"
    };
    Object.keys(v).forEach(function (id) {
      var el = document.getElementById(id);
      if (el.textContent !== v[id]) { el.textContent = v[id]; if (prev[id] !== undefined && !reduce) { el.classList.remove("is-new"); void el.offsetWidth; el.classList.add("is-new"); } }
      prev[id] = v[id];
    });
    var recap = $("#recap"); recap.innerHTML = "";
    [d ? fmt(d, { weekday: "short", day: "numeric", month: "short" }) : I.ui("waNight"), d ? time : I.ui("waTime"), v.tkPeople, v.tkSpot].forEach(function (txt, i) {
      var s = document.createElement("span"); s.textContent = txt; if (i > 1 || d) s.classList.add("is-set"); recap.appendChild(s);
    });
  }
  form.addEventListener("change", update);
  function fieldErr(input, msg) { input.setAttribute("aria-invalid", msg ? "true" : "false"); document.getElementById(input.id + "Err").textContent = msg || ""; return !msg; }
  ["fName", "fPhone"].forEach(function (id) { var el = document.getElementById(id); el.addEventListener("input", function () { if (el.getAttribute("aria-invalid") === "true") fieldErr(el, ""); }); });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true, name = $("#fName"), phone = $("#fPhone");
    $("#nightErr").textContent = nightIdx < 0 ? I.ui("chooseNight") : "";
    if (nightIdx < 0) ok = false;
    if (!fieldErr(name, name.value.trim() ? "" : I.ui("required"))) ok = false;
    var digits = phone.value.replace(/\D/g, "");
    if (!fieldErr(phone, !phone.value.trim() ? I.ui("required") : digits.length < 8 ? I.ui("phoneBad") : "")) ok = false;
    if (!ok) {
      var bad = nightIdx < 0 ? nightsEl : form.querySelector('[aria-invalid="true"]');
      bad.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
      if (bad.focus && bad.tagName === "INPUT") bad.focus({ preventScroll: true });
      return;
    }
    var note = form.elements.note.value.trim(), d = nights[nightIdx];
    var msg = [I.ui("waHello"), "",
      "🍻 " + I.ui("waNight") + ": " + fmt(d, { weekday: "long", day: "numeric", month: "long" }) + " (" + $("#tkEvent").textContent + ")",
      "🕘 " + I.ui("waTime") + ": " + time,
      "👥 " + I.ui("waPeople") + ": " + people,
      "📍 " + I.ui("waSpot") + ": " + spotLabel(),
      "🙋 " + I.ui("waName") + ": " + name.value.trim(),
      "📱 " + I.ui("waPhone") + ": " + phone.value.trim()];
    if (note) msg.push("📝 " + I.ui("waNote") + ": " + note);
    window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(msg.join("\n")), "_blank", "noopener");
    toast(I.ui("sent"));
  });

  /* ---------- magnetic buttons ---------- */
  if (window.matchMedia("(hover: hover)").matches && !reduce) {
    $$(".magnetic").forEach(function (b) {
      b.addEventListener("pointermove", function (e) { var r = b.getBoundingClientRect(); b.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1) + "px," + ((e.clientY - r.top - r.height / 2) * 0.25).toFixed(1) + "px)"; });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
  }

  /* ---------- helpers ---------- */
  function swipe(el, cb) {
    var sx = 0, sy = 0;
    el.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    el.addEventListener("touchend", function (e) { var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) cb(dx < 0 ? 1 : -1); }, { passive: true });
  }
  var toastEl = $("#toast"), toastT = 0;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add("is-on"); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("is-on"); }, 4500); }

  /* ---------- language changes ---------- */
  document.addEventListener("nt:lang", function () { renderPrices(); tick(); sigLabel(); buildNights(); if (nightIdx > -1) buildTimes(); update(); });

  renderPrices(); tick(); setInterval(tick, 1000);
  buildNights(); pickNight(0);
})();
