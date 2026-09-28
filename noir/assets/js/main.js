/* Noir — interactions (vanilla JS, no dependencies).
   Everything is progressive: without this file the page is complete and
   readable; hidden "before" states only switch on once the observer that
   reveals them is confirmed to work. */
(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // If i18n.js failed to load, keep everything working in English.
  var I = window.NoirI18n || {
    apply: function () {}, lang: function () { return "en"; }, locale: function () { return "en-GB"; }, price: function () { return ""; },
    t: function (k) { var el = document.querySelector('[data-i18n="' + k + '"]'); return el ? el.textContent : ""; },
    ui: function (k) {
      return ({ openNow: "Open now · until {t}", opensAt: "Closed · opens {d} at {t}", today: "today", tomorrow: "tomorrow", slotsFor: "Times for {d}",
        chooseDay: "Please choose a day.", chooseTime: "Please choose a time.", required: "Please fill this in.", phoneBad: "Please enter a phone number we can reach.",
        any: "No preference", sent: "WhatsApp is opening with your request — just press send.", waHello: "Hello Noir, I'd like to book:",
        waSvc: "Service", waSty: "Stylist", waDay: "Day", waTime: "Time", waName: "Name", waPhone: "Phone", waNote: "Note" })[k] || "";
    }
  };
  var root = document.documentElement;
  var WA = "66812345678";
  var TZ = "Asia/Bangkok";

  /* ---------- intro (once per visit) ---------- */
  var intro = $(".intro");
  try { sessionStorage.setItem("noirIntro", "1"); } catch (e) {}
  if (intro) setTimeout(function () { intro.classList.add("is-done"); }, reduce || root.classList.contains("no-intro") ? 0 : 2600);

  /* ---------- header, progress, current section ---------- */
  var header = $("#header"), bar = $(".progress span"), hero = $(".hero");
  var lastY = window.scrollY, ticking = false;
  var navLinks = $$(".nav a");
  var sections = navLinks.map(function (a) { return $(a.getAttribute("href")); });
  function onScroll() {
    ticking = false;
    var y = window.scrollY, heroH = hero ? hero.offsetHeight : 600;
    header.classList.toggle("is-solid", y > 40);
    if (!menuOpen) {
      if (y > heroH * 0.6 && y > lastY + 4) header.classList.add("is-hidden");
      else if (y < lastY - 4 || y < heroH * 0.6) header.classList.remove("is-hidden");
    }
    if (Math.abs(y - lastY) > 4) lastY = y;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
    if (!reduce && hero && y < heroH) $(".hero__media").style.transform = "translate3d(0," + (y * 0.25).toFixed(1) + "px,0)";
    var mid = y + window.innerHeight * 0.35, cur = -1;
    sections.forEach(function (s, i) { if (s && s.offsetTop <= mid) cur = i; });
    navLinks.forEach(function (a, i) { a.classList.toggle("is-current", i === cur); });
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var burger = $("#burger"), menu = $("#menu"), menuOpen = false;
  function setMenu(open) {
    menuOpen = open;
    burger.setAttribute("aria-expanded", String(open));
    header.classList.remove("is-hidden");
    if (open) { menu.hidden = false; menu.classList.add("is-open"); document.body.style.overflow = "hidden"; }
    else { menu.hidden = true; menu.classList.remove("is-open"); document.body.style.overflow = ""; }
  }
  burger.addEventListener("click", function () { setMenu(!menuOpen); });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menuOpen) { setMenu(false); burger.focus(); } });
  window.matchMedia("(min-width: 1000px)").addEventListener("change", function (m) { if (m.matches && menuOpen) setMenu(false); });

  /* ---------- language ---------- */
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-lang]");
    if (b) I.apply(b.getAttribute("data-lang"));
  });

  /* ---------- reveals ---------- */
  if ("IntersectionObserver" in window && !reduce) {
    var items = $$("[data-reveal]");
    // Stagger siblings that reveal together.
    items.forEach(function (el) {
      var sibs = $$(":scope > [data-reveal]", el.parentNode), i = sibs.indexOf(el);
      if (i > 0) el.style.setProperty("--d", Math.min(i * 0.08, 0.48) + "s");
    });
    root.classList.add("reveal-ready");
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        rio.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    items.forEach(function (el) { rio.observe(el); });
    // Anything already on screen at load (e.g. hero) shows at once.
    setTimeout(function () { items.forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-in"); }); }, 60);
  }

  /* ---------- count-up stats ---------- */
  var counters = $$("[data-count]");
  if (counters.length && "IntersectionObserver" in window && !reduce) {
    counters.forEach(function (c) { c.textContent = "0"; });
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        cio.unobserve(en.target);
        var el = en.target, to = parseFloat(el.getAttribute("data-count")), dec = Number(el.getAttribute("data-decimals") || 0), t0 = null;
        (function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min(1, (ts - t0) / 1600), e = 1 - Math.pow(1 - p, 4);
          el.textContent = (to * e).toFixed(dec);
          if (p < 1) requestAnimationFrame(step);
        })(performance.now());
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- live opening status (Bangkok time) ---------- */
  var HOURS = { 0: [9, 19], 1: null, 2: [10, 20], 3: [10, 20], 4: [10, 20], 5: [10, 20], 6: [9, 19] };
  function bkkNow() {
    var parts = {};
    new Intl.DateTimeFormat("en-US", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false, weekday: "short" })
      .formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
    var wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday);
    return { y: +parts.year, m: +parts.month - 1, d: +parts.day, h: +parts.hour % 24, min: +parts.minute, wd: wd };
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function renderStatus() {
    var n = bkkNow(), today = HOURS[n.wd], mins = n.h * 60 + n.min;
    var open = today && mins >= today[0] * 60 && mins < today[1] * 60, txt;
    if (open) txt = I.ui("openNow").replace("{t}", pad(today[1]) + ":00");
    else {
      var k = 0, wd = n.wd;
      if (today && mins < today[0] * 60) k = 0; else { do { k++; wd = (n.wd + k) % 7; } while (!HOURS[wd] && k < 7); }
      var dayWord = k === 0 ? I.ui("today") : k === 1 ? I.ui("tomorrow") : new Intl.DateTimeFormat(I.locale(), { weekday: "long" }).format(new Date(Date.UTC(2024, 0, 7 + wd, 12)));
      txt = I.ui("opensAt").replace("{d}", dayWord).replace("{t}", pad(HOURS[wd][0]) + ":00");
    }
    $$("[data-status]").forEach(function (el) { el.textContent = txt; el.closest(".status").classList.toggle("is-closed", !open); });
    $$(".hours tr").forEach(function (tr) { tr.classList.toggle("is-today", tr.getAttribute("data-days").split(",").indexOf(String(n.wd)) > -1); });
  }
  renderStatus();
  setInterval(renderStatus, 60000);
  document.addEventListener("noir:lang", renderStatus);

  /* ---------- service tabs ---------- */
  var tabs = $$(".tabs [role=tab]"), pics = $$(".svc__media picture");
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute("aria-controls"));
      panel.hidden = !on;
      if (on && !reduce) { panel.classList.remove("is-entering"); void panel.offsetWidth; panel.classList.add("is-entering"); }
    });
    var key = tab.id.replace("tab-", "");
    pics.forEach(function (p) { p.classList.toggle("is-on", p.getAttribute("data-for") === key); });
    if (focus) tab.focus();
    tab.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduce ? "auto" : "smooth" });
    // Pre-select the matching service in the booking form.
    var map = { cut: "cut", colour: "colour", barber: "barber", care: "care", bridal: "bridal" };
    var r = $('input[name="service"][value="' + map[key] + '"]');
    if (r) { r.checked = true; updateSummary(); }
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { selectTab(t); });
    t.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (e.key === "Home") { e.preventDefault(); selectTab(tabs[0], true); }
      if (e.key === "End") { e.preventDefault(); selectTab(tabs[tabs.length - 1], true); }
      if (d) { e.preventDefault(); selectTab(tabs[(i + d + tabs.length) % tabs.length], true); }
    });
  });

  /* ---------- lookbook lightbox (pattern from 21st "Interactive Bento Gallery") ---------- */
  var tiles = $$(".bento__item"), lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap"), dock = $("#lbDock"), lbIndex = 0, lastFocus = null;
  tiles.forEach(function (tile, i) {
    tile.style.setProperty("--i", i % 4);
    var b = document.createElement("button");
    b.type = "button";
    b.innerHTML = "<img alt='' loading='lazy'>";
    b.firstChild.src = $("img", tile).getAttribute("src");
    b.addEventListener("click", function () { showPhoto(i); });
    dock.appendChild(b);
    tile.addEventListener("click", function () { openLightbox(i); });
  });
  function showPhoto(i) {
    lbIndex = (i + tiles.length) % tiles.length;
    var img = $("img", tiles[lbIndex]);
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbImg.style.animation = "none"; void lbImg.offsetWidth; lbImg.style.animation = "";
    lbCap.innerHTML = "";
    var b = document.createElement("b"); b.textContent = $(".bento__cap b", tiles[lbIndex]).textContent;
    lbCap.appendChild(b); lbCap.appendChild(document.createTextNode($(".bento__cap small", tiles[lbIndex]).textContent));
    $$("button", dock).forEach(function (d, k) {
      d.setAttribute("aria-current", k === lbIndex ? "true" : "false");
      d.setAttribute("aria-label", $(".bento__cap b", tiles[k]).textContent);
    });
    var cur = dock.children[lbIndex];
    if (cur) cur.scrollIntoView({ block: "nearest", inline: "center" });
  }
  function openLightbox(i) {
    lastFocus = document.activeElement;
    lb.hidden = false; lb.classList.add("is-open");
    document.body.style.overflow = "hidden";
    showPhoto(i);
    $(".lightbox__close", lb).focus();
  }
  function closeLightbox() {
    lb.hidden = true; lb.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  $(".lightbox__close", lb).addEventListener("click", closeLightbox);
  $$(".lightbox__arrow", lb).forEach(function (a) { a.addEventListener("click", function () { showPhoto(lbIndex + Number(a.getAttribute("data-dir"))); }); });
  lb.addEventListener("click", function (e) { if (e.target === lb || e.target.classList.contains("lightbox__stage")) closeLightbox(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showPhoto(lbIndex + 1);
    if (e.key === "ArrowLeft") showPhoto(lbIndex - 1);
    if (e.key === "Tab") { // keep focus inside
      var f = $$("button", lb).filter(function (b) { return b.offsetParent !== null; });
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  swipe(lb, function (dir) { showPhoto(lbIndex + dir); });

  /* ---------- reviews carousel ---------- */
  var quotes = $$(".quote"), qDots = $(".quotes__dots"), qIndex = 0, qTimer = null;
  quotes.forEach(function (q, i) {
    var d = document.createElement("button");
    d.type = "button";
    d.setAttribute("aria-label", String(i + 1) + " / " + quotes.length);
    d.addEventListener("click", function () { showQuote(i, true); });
    qDots.appendChild(d);
  });
  function showQuote(i, user) {
    qIndex = (i + quotes.length) % quotes.length;
    quotes.forEach(function (q, k) { q.classList.toggle("is-on", k === qIndex); q.setAttribute("aria-hidden", k === qIndex ? "false" : "true"); });
    $$("button", qDots).forEach(function (d, k) { d.setAttribute("aria-current", k === qIndex ? "true" : "false"); });
    if (user) restartQuotes();
  }
  function restartQuotes() { clearInterval(qTimer); if (!reduce) qTimer = setInterval(function () { showQuote(qIndex + 1); }, 6500); }
  $$(".quotes__arrow").forEach(function (a) { a.addEventListener("click", function () { showQuote(qIndex + Number(a.getAttribute("data-dir")), true); }); });
  var qWrap = $(".quotes");
  qWrap.addEventListener("mouseenter", function () { clearInterval(qTimer); });
  qWrap.addEventListener("mouseleave", restartQuotes);
  qWrap.addEventListener("focusin", function () { clearInterval(qTimer); });
  swipe(qWrap, function (dir) { showQuote(qIndex + dir, true); });
  showQuote(0); restartQuotes();

  /* ---------- booking (pattern from 21st "Preset Time Selection Calendar") ---------- */
  var form = $("#bookForm"), calGrid = $(".cal__grid"), calWeek = $(".cal__week"), calTitle = $("#calTitle"), slotsEl = $("#slots"), slotsDay = $("#slotsDay");
  var now = bkkNow(), todayDate = new Date(now.y, now.m, now.d);
  var maxDate = new Date(now.y, now.m, now.d + 60);
  var view = new Date(now.y, now.m, 1), picked = null, pickedTime = null;
  function fmt(d, opts) { return new Intl.DateTimeFormat(I.locale(), opts).format(d); }
  function sameDay(a, b) { return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
  function renderCal() {
    calTitle.textContent = fmt(view, { month: "long", year: "numeric" });
    calWeek.innerHTML = "";
    for (var w = 0; w < 7; w++) { // Monday first
      var s = document.createElement("span");
      s.textContent = fmt(new Date(2024, 0, 1 + w), { weekday: "short" }).replace(".", "");
      calWeek.appendChild(s);
    }
    calGrid.innerHTML = "";
    var first = new Date(view.getFullYear(), view.getMonth(), 1), lead = (first.getDay() + 6) % 7;
    var days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    for (var i = 0; i < lead; i++) calGrid.appendChild(document.createElement("span"));
    for (var d = 1; d <= days; d++) {
      var date = new Date(view.getFullYear(), view.getMonth(), d), b = document.createElement("button");
      b.type = "button"; b.className = "cal__day"; b.textContent = d;
      var closed = !HOURS[date.getDay()], past = date < todayDate, far = date > maxDate;
      b.disabled = closed || past || far;
      if (closed) b.classList.add("is-closed");
      if (sameDay(date, todayDate)) b.classList.add("is-today");
      b.setAttribute("aria-label", fmt(date, { weekday: "long", day: "numeric", month: "long" }));
      b.setAttribute("aria-pressed", sameDay(date, picked) ? "true" : "false");
      (function (dt) { b.addEventListener("click", function () { picked = dt; pickedTime = null; renderCal(); renderSlots(); updateSummary(); $("#whenErr").textContent = ""; }); })(date);
      calGrid.appendChild(b);
    }
    $('.cal__nav[data-month="-1"]').disabled = view <= new Date(now.y, now.m, 1);
    $('.cal__nav[data-month="1"]').disabled = new Date(view.getFullYear(), view.getMonth() + 1, 1) > maxDate;
  }
  $$(".cal__nav").forEach(function (b) {
    b.addEventListener("click", function () { view = new Date(view.getFullYear(), view.getMonth() + Number(b.getAttribute("data-month")), 1); renderCal(); });
  });
  // Demo availability: a stable pseudo-random set of taken slots per day and stylist.
  function taken(date, time) {
    var sty = (form.elements.stylist.value || "any"), s = date.toDateString() + time + sty, h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h % 100 < (sty === "any" ? 18 : 34);
  }
  function renderSlots() {
    slotsEl.innerHTML = "";
    if (!picked) { slotsDay.textContent = I.t("book.pickDay"); return; }
    slotsDay.textContent = I.ui("slotsFor").replace("{d}", fmt(picked, { weekday: "long", day: "numeric", month: "long" }));
    var hrs = HOURS[picked.getDay()], isToday = sameDay(picked, todayDate), nowMin = now.h * 60 + now.min;
    for (var m = hrs[0] * 60; m <= hrs[1] * 60 - 60; m += 30) {
      var label = pad(Math.floor(m / 60)) + ":" + pad(m % 60), b = document.createElement("button");
      b.type = "button"; b.className = "slot"; b.textContent = label;
      b.disabled = (isToday && m < nowMin + 60) || taken(picked, label);
      b.setAttribute("aria-pressed", pickedTime === label ? "true" : "false");
      (function (l) { b.addEventListener("click", function () { pickedTime = l; $$(".slot", slotsEl).forEach(function (x) { x.setAttribute("aria-pressed", x.textContent === l ? "true" : "false"); }); updateSummary(); $("#whenErr").textContent = ""; }); })(label);
      slotsEl.appendChild(b);
    }
  }
  function label(name) {
    var r = $('input[name="' + name + '"]:checked');
    return r ? r.nextElementSibling.textContent : "—";
  }
  // Booking choice → the menu line whose "from" price it shows.
  var FROM = { cut: "cut1", colour: "col2", balayage: "col1", barber: "bar1", care: "car2", bridal: "bri1" };
  function priceFrom() { var r = $('input[name="service"]:checked'); return (r && I.price(FROM[r.value])) || "—"; }
  var prevSum = {};
  function updateSummary() {
    var vals = {
      sumSvc: label("service"),
      sumSty: form.elements.stylist.value === "any" ? I.ui("any") : form.elements.stylist.value,
      sumDay: picked ? fmt(picked, { weekday: "short", day: "numeric", month: "short" }) : "—",
      sumTime: pickedTime || "—",
      sumPrice: priceFrom()
    };
    Object.keys(vals).forEach(function (id) {
      var el = document.getElementById(id);
      if (el.textContent !== vals[id]) {
        el.textContent = vals[id];
        if (prevSum[id] !== undefined && !reduce) { el.classList.remove("is-new"); void el.offsetWidth; el.classList.add("is-new"); }
      }
      prevSum[id] = vals[id];
    });
    var recap = $("#recap");
    recap.innerHTML = "";
    [vals.sumSvc, vals.sumSty, vals.sumDay === "—" ? I.t("book.day") : vals.sumDay, vals.sumTime === "—" ? I.t("book.time") : vals.sumTime, I.t("book.price") + " " + vals.sumPrice].forEach(function (v, i) {
      var sp = document.createElement("span");
      sp.textContent = v;
      if (i < 2 || (i === 2 && picked) || (i === 3 && pickedTime)) sp.classList.add("is-set");
      if (i === 4) sp.classList.add("is-price");
      recap.appendChild(sp);
    });
  }
  form.addEventListener("change", function (e) {
    if (e.target.name === "stylist" && picked) { pickedTime = null; renderSlots(); }
    updateSummary();
  });
  function fieldErr(input, msg) {
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    document.getElementById(input.id + "Err").textContent = msg || "";
    return !msg;
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true, whenErr = $("#whenErr"), name = $("#fName"), phone = $("#fPhone");
    whenErr.textContent = !picked ? I.ui("chooseDay") : !pickedTime ? I.ui("chooseTime") : "";
    if (whenErr.textContent) ok = false;
    if (!fieldErr(name, name.value.trim() ? "" : I.ui("required"))) ok = false;
    var digits = phone.value.replace(/\D/g, "");
    if (!fieldErr(phone, !phone.value.trim() ? I.ui("required") : digits.length < 8 ? I.ui("phoneBad") : "")) ok = false;
    if (!ok) {
      var firstBad = whenErr.textContent ? $("#cal") : form.querySelector('[aria-invalid="true"]');
      if (firstBad) { firstBad.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" }); if (firstBad.focus) firstBad.focus({ preventScroll: true }); }
      return;
    }
    var note = form.elements.note.value.trim();
    var msg = [
      I.ui("waHello"), "",
      "• " + I.ui("waSvc") + ": " + label("service") + " (" + I.ui("waPrice") + " " + priceFrom() + ")",
      "• " + I.ui("waSty") + ": " + (form.elements.stylist.value === "any" ? I.ui("any") : form.elements.stylist.value),
      "• " + I.ui("waDay") + ": " + fmt(picked, { weekday: "long", day: "numeric", month: "long" }),
      "• " + I.ui("waTime") + ": " + pickedTime,
      "• " + I.ui("waName") + ": " + name.value.trim(),
      "• " + I.ui("waPhone") + ": " + phone.value.trim()
    ];
    if (note) msg.push("• " + I.ui("waNote") + ": " + note);
    window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(msg.join("\n")), "_blank", "noopener");
    toast(I.ui("sent"));
  });
  ["fName", "fPhone"].forEach(function (id) {
    var el = document.getElementById(id);
    el.addEventListener("input", function () { if (el.getAttribute("aria-invalid") === "true") fieldErr(el, ""); });
  });
  document.addEventListener("noir:lang", function () { renderCal(); renderSlots(); updateSummary(); });
  renderCal(); renderSlots(); updateSummary();

  /* ---------- cursor label over the lookbook (additive) ---------- */
  var cursor = $(".cursor");
  if (cursor && window.matchMedia("(hover: hover)").matches && !reduce) {
    var cx = -200, cy = -200, tx = -200, ty = -200, raf = 0;
    function loop() {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      cursor.style.transform = "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0)";
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.3 ? requestAnimationFrame(loop) : 0;
    }
    document.addEventListener("pointermove", function (e) { tx = e.clientX; ty = e.clientY; if (!raf) raf = requestAnimationFrame(loop); }, { passive: true });
    tiles.forEach(function (t) {
      t.addEventListener("pointerenter", function () { cursor.classList.add("is-on"); });
      t.addEventListener("pointerleave", function () { cursor.classList.remove("is-on"); });
    });
  }

  /* ---------- magnetic buttons ---------- */
  if (window.matchMedia("(hover: hover)").matches && !reduce) {
    $$(".magnetic").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1) + "px," + ((e.clientY - r.top - r.height / 2) * 0.25).toFixed(1) + "px)";
      });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
  }

  /* ---------- helpers ---------- */
  function swipe(el, cb) {
    var sx = 0, sy = 0;
    el.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    el.addEventListener("touchend", function (e) {
      var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) cb(dx < 0 ? 1 : -1);
    }, { passive: true });
  }
  var toastEl = $("#toast"), toastT = 0;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add("is-on");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("is-on"); }, 4500);
  }
})();
