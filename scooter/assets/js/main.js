/* Ride Siam — interactions (vanilla JS, no dependencies).
   The page reads fine without this file; JS adds the price period toggle,
   the fleet filter, the range calendar and the WhatsApp booking. */
(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;
  var WA = "66812345678";
  var OPEN = 8, CLOSE = 20, FAR_FEE = 300, DAY = 864e5;

  var I = window.RSI18n || {
    apply: function () {}, lang: function () { return "en"; }, locale: function () { return "en-GB"; },
    t: function (k) { var el = document.querySelector('[data-i18n="' + k + '"]'); return el ? el.innerHTML : ""; },
    ui: function (k) { return ({ open: "Open now · until 20:00", closed: "Closed · opens 08:00 · help 24/7", perDay: "/ day", perWeek: "/ week", perMonth: "/ month", hintStart: "Tap your pick-up day", hintEnd: "Now tap your return day", hintDone: "{n} · tap a date to start again", rateDay: "Daily rate", rateWeek: "Weekly rate", rateMonth: "Monthly rate", save: "You save {x} with the long-rental rate", none: "None", perDayShort: "day", delivHotel: "Hotel delivery", delivShop: "At the shop", delivFar: "Outside the zone", free: "free", chooseDates: "Please choose your dates in the calendar.", required: "Please fill this in.", phoneBad: "Please enter a number we can reach on WhatsApp.", hotelReq: "Tell us where to deliver.", badRange: "The return date must be after the pick-up date.", sent: "WhatsApp is opening with your request — just press send.", waHello: "Hello Ride Siam! I'd like to rent:", waDates: "Dates", waTimes: "Times", waDeliv: "Delivery", waExtras: "Extras", waLic: "Licence", waYes: "yes", waNo: "no", waName: "Name", waPhone: "Phone", waTotal: "Total", waDep: "Deposit" })[k] || ""; },
    money: function (thb) { return "฿" + Math.round(thb).toLocaleString("en-US"); }
  };
  function txt(k) { var d = document.createElement("div"); d.innerHTML = I.t(k); return d.textContent; }
  function fmt(d, o) { return new Intl.DateTimeFormat(I.locale(), o).format(d); }
  function daysLabel(n) { return n + " " + txt(n === 1 ? "t.day" : "t.days"); }

  /* ---------- Bangkok clock ---------- */
  function bkk() {
    var p = {};
    new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Bangkok", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false })
      .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    return { y: +p.year, m: +p.month - 1, d: +p.day, h: +p.hour % 24, min: +p.minute };
  }
  var now = bkk(), TODAY = new Date(now.y, now.m, now.d);
  function tick() {
    var n = bkk(), open = n.h >= OPEN && n.h < CLOSE;
    $$("[data-status]").forEach(function (el) { el.textContent = I.ui(open ? "open" : "closed"); el.closest(".status").classList.toggle("is-closed", !open); });
  }

  /* ---------- header, progress, mobile nav ---------- */
  var header = $("#header"), bar = $(".progress span"), hero = $(".hero"), lastY = window.scrollY, ticking = false, navOpen = false;
  var navLinks = $$(".nav a"), sections = navLinks.map(function (a) { return $(a.getAttribute("href")); });
  var heroImg = $(".hero__media img"), bookSec = $("#book"), mbar = $("#mbar");
  function onScroll() {
    ticking = false;
    var y = window.scrollY, heroH = hero.offsetHeight;
    header.classList.toggle("is-solid", y > 40);
    if (!navOpen) {
      if (y > heroH * 0.7 && y > lastY + 4) header.classList.add("is-hidden");
      else if (y < lastY - 4 || y < heroH * 0.7) header.classList.remove("is-hidden");
    }
    if (Math.abs(y - lastY) > 4) lastY = y;
    var max = root.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
    var mid = y + window.innerHeight * 0.35, cur = -1;
    sections.forEach(function (s, i) { if (s && s.offsetTop <= mid) cur = i; });
    navLinks.forEach(function (a, i) { a.classList.toggle("is-current", i === cur); });
    if (!reduce && y < heroH) heroImg.style.transform = "translateY(" + (y * 0.2).toFixed(1) + "px) scale(1.06)";
    var r = bookSec.getBoundingClientRect(), sr = $(".summary__card").getBoundingClientRect();
    mbar.classList.toggle("is-on", r.top < window.innerHeight * 0.5 && sr.top > window.innerHeight - 40);
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener("resize", function () { buildCal(); onScroll(); });
  mbar.addEventListener("click", function () { $(".summary__card").scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" }); });
  var burger = $("#burger"), mnav = $("#mnav");
  function setNav(open) {
    navOpen = open;
    burger.setAttribute("aria-expanded", String(open));
    header.classList.remove("is-hidden");
    header.classList.toggle("nav-open", open);
    mnav.hidden = !open;
    document.body.style.overflow = open ? "hidden" : "";
  }
  burger.addEventListener("click", function () { setNav(!navOpen); });
  mnav.addEventListener("click", function (e) { if (e.target.closest("a")) setNav(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && navOpen) { setNav(false); burger.focus(); } });
  window.matchMedia("(min-width: 1024px)").addEventListener("change", function (m) { if (m.matches && navOpen) setNav(false); });
  document.addEventListener("click", function (e) { var b = e.target.closest("[data-lang]"); if (b) I.apply(b.getAttribute("data-lang")); });

  /* ---------- reveals ---------- */
  if ("IntersectionObserver" in window && !reduce) {
    var items = $$("[data-reveal]");
    items.forEach(function (el) {
      var sibs = $$(":scope > [data-reveal]", el.parentNode), i = sibs.indexOf(el);
      if (i > 0) el.style.setProperty("--d", Math.min(i * 0.07, 0.42) + "s");
    });
    root.classList.add("reveal-ready");
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); rio.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });
    items.forEach(function (el) { rio.observe(el); });
    setTimeout(function () { items.forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-in"); }); }, 60);
  }

  /* ---------- fleet ---------- */
  var MODELS = {}, ORDER = [];
  $$(".scoot").forEach(function (c) {
    var id = c.getAttribute("data-id");
    ORDER.push(id);
    MODELS[id] = {
      el: c, cat: c.getAttribute("data-cat"), name: $(".scoot__name", c).textContent.replace(/\s+/g, " ").trim(),
      day: +c.getAttribute("data-day"), week: +c.getAttribute("data-week"), month: +c.getAttribute("data-month"),
      deposit: +c.getAttribute("data-deposit"), img: $("img", c).getAttribute("src")
    };
    $(".scoot__book", c).addEventListener("click", function () { state.model = id; renderBook(); bookSec.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); });
  });
  var period = "day";
  function renderFleet() {
    ORDER.forEach(function (id) {
      var m = MODELS[id], rate = $("[data-rate]", m.el), v = I.money(m[period]);
      if (rate.textContent !== v) { rate.textContent = v; if (!reduce) { rate.classList.remove("is-new"); void rate.offsetWidth; rate.classList.add("is-new"); } }
      $("[data-per]", m.el).textContent = I.ui(period === "day" ? "perDay" : period === "week" ? "perWeek" : "perMonth");
    });
  }
  $$(".period button").forEach(function (b) {
    b.addEventListener("click", function () {
      period = b.getAttribute("data-period");
      $$(".period button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      $(".period").setAttribute("data-period", period);
      renderFleet();
    });
  });
  $$(".fleet .chip").forEach(function (b) {
    b.addEventListener("click", function () {
      var cat = b.getAttribute("data-cat");
      $$(".fleet .chip").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      ORDER.forEach(function (id) {
        var el = MODELS[id].el, ok = cat === "all" || MODELS[id].cat === cat;
        if (ok && el.hidden && !reduce) { el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); }
        el.hidden = !ok;
      });
    });
  });

  /* ---------- pricing ---------- */
  function quote(id, days) {
    var m = MODELS[id], tier = days >= 28 ? "month" : days >= 7 ? "week" : "day";
    var perDay = tier === "month" ? m.month / 30 : tier === "week" ? m.week / 7 : m.day;
    var base = Math.round(perDay * days / 10) * 10;
    return { tier: tier, perDay: perDay, base: base, save: Math.max(0, m.day * days - base) };
  }
  function diffDays(a, b) { return Math.round((b - a) / DAY); }

  /* ---------- state ---------- */
  var state = { model: "pcx", start: new Date(TODAY.getTime() + DAY), end: new Date(TODAY.getTime() + 4 * DAY), pickT: "10:00", retT: "10:00", deliv: "hotel", extras: {}, licTouched: false };
  var viewMonth = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);

  /* ---------- quick quote in the hero ---------- */
  var qModel = $("#qModel"), qFrom = $("#qFrom"), qTo = $("#qTo");
  function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function parseIso(s) { var p = s.split("-"); return p.length === 3 ? new Date(+p[0], +p[1] - 1, +p[2]) : null; }
  qFrom.min = iso(TODAY); qTo.min = iso(new Date(TODAY.getTime() + DAY));
  qFrom.value = iso(state.start); qTo.value = iso(state.end);
  function renderQuick() {
    var a = parseIso(qFrom.value), b = parseIso(qTo.value);
    if (a && b && b <= a) { b = new Date(a.getTime() + DAY); qTo.value = iso(b); }
    if (a) qTo.min = iso(new Date(a.getTime() + DAY));
    var n = a && b ? diffDays(a, b) : 0;
    $("#qDays").textContent = n ? daysLabel(n) : "—";
    $("#qTotal").textContent = n ? I.money(quote(qModel.value, n).base) : "—";
  }
  [qModel, qFrom, qTo].forEach(function (el) { el.addEventListener("change", renderQuick); el.addEventListener("input", renderQuick); });
  $("#quick").addEventListener("submit", function (e) {
    e.preventDefault();
    var a = parseIso(qFrom.value), b = parseIso(qTo.value);
    state.model = qModel.value;
    if (a && b && b > a && a >= TODAY) { state.start = a; state.end = b; viewMonth = new Date(a.getFullYear(), a.getMonth(), 1); }
    renderBook();
    bookSec.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  });

  /* ---------- booking: models ---------- */
  var modelsEl = $("#bModels");
  function buildModels() {
    modelsEl.innerHTML = "";
    ORDER.forEach(function (id) {
      var m = MODELS[id], b = document.createElement("button");
      b.type = "button"; b.className = "model"; b.setAttribute("aria-pressed", String(id === state.model));
      b.innerHTML = "<img alt='' width='96' height='72' loading='lazy'><span><b></b><small></small></span>";
      $("img", b).src = m.img; $("b", b).textContent = m.name;
      $("small", b).textContent = I.money(m.day) + " " + I.ui("perDay");
      b.addEventListener("click", function () { state.model = id; renderBook(); b.focus(); });
      modelsEl.appendChild(b);
    });
  }

  /* ---------- booking: range calendar ---------- */
  var monthsEl = $("#calMonths"), hover = null;
  function buildCal() {
    var two = window.matchMedia("(min-width: 760px)").matches, html = "";
    monthsEl.innerHTML = "";
    for (var k = 0; k < (two ? 2 : 1); k++) {
      var first = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + k, 1);
      var box = document.createElement("div"); box.className = "month";
      var h = document.createElement("p"); h.className = "month__name"; h.textContent = fmt(first, { month: "long", year: "numeric" });
      box.appendChild(h);
      var grid = document.createElement("div"); grid.className = "month__grid"; grid.setAttribute("role", "group"); grid.setAttribute("aria-label", h.textContent);
      for (var w = 0; w < 7; w++) {
        var wd = document.createElement("span"); wd.className = "month__wd"; wd.setAttribute("aria-hidden", "true");
        wd.textContent = fmt(new Date(2024, 0, 1 + w), { weekday: "narrow" });
        grid.appendChild(wd);
      }
      var lead = (first.getDay() + 6) % 7;
      for (var e = 0; e < lead; e++) grid.appendChild(document.createElement("span"));
      var dim = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
      for (var d = 1; d <= dim; d++) {
        var date = new Date(first.getFullYear(), first.getMonth(), d), b = document.createElement("button");
        b.type = "button"; b.className = "day"; b.textContent = d;
        b.setAttribute("data-t", date.getTime());
        b.setAttribute("aria-label", fmt(date, { weekday: "long", day: "numeric", month: "long" }));
        if (date < TODAY) b.disabled = true;
        if (date.getTime() === TODAY.getTime()) b.classList.add("is-today");
        grid.appendChild(b);
      }
      box.appendChild(grid);
      monthsEl.appendChild(box);
    }
    paintCal();
    $(".cal__nav[data-step='-1']").disabled = viewMonth <= new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);
    $(".cal__nav[data-step='1']").disabled = viewMonth >= new Date(TODAY.getFullYear(), TODAY.getMonth() + 5, 1);
  }
  function paintCal() {
    var s = state.start && state.start.getTime(), e = state.end ? state.end.getTime() : (hover && s && hover > s ? hover : null);
    $$(".day", monthsEl).forEach(function (b) {
      var t = +b.getAttribute("data-t");
      b.classList.toggle("is-start", t === s);
      b.classList.toggle("is-end", e !== null && t === e);
      b.classList.toggle("in-range", s && e !== null && t > s && t < e);
      b.classList.toggle("is-preview", !state.end && e !== null && t > s && t <= e);
      b.setAttribute("aria-pressed", String(t === s || (state.end && t === state.end.getTime())));
    });
    var hint = !state.start ? I.ui("hintStart") : !state.end ? I.ui("hintEnd") : I.ui("hintDone").replace("{n}", daysLabel(diffDays(state.start, state.end)));
    $("#calHint").textContent = hint;
  }
  monthsEl.addEventListener("click", function (ev) {
    var b = ev.target.closest(".day"); if (!b || b.disabled) return;
    var d = new Date(+b.getAttribute("data-t"));
    if (!state.start || state.end) { state.start = d; state.end = null; }
    else if (d <= state.start) { state.start = d; }
    else { state.end = d; }
    $("#dateErr").textContent = "";
    hover = null; paintCal(); renderSummary();
  });
  monthsEl.addEventListener("pointerover", function (ev) { var b = ev.target.closest(".day"); if (b && state.start && !state.end) { hover = +b.getAttribute("data-t"); paintCal(); } });
  monthsEl.addEventListener("pointerleave", function () { if (hover) { hover = null; paintCal(); } });
  $$(".cal__nav").forEach(function (b) { b.addEventListener("click", function () { viewMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + Number(b.getAttribute("data-step")), 1); buildCal(); }); });

  /* ---------- booking: times, delivery, extras, licence ---------- */
  var pickSel = $("#bPickT"), retSel = $("#bRetT");
  for (var hh = OPEN; hh <= CLOSE; hh += 0.5) {
    var lbl = String(Math.floor(hh)).padStart(2, "0") + ":" + (hh % 1 ? "30" : "00");
    [pickSel, retSel].forEach(function (s) { var o = document.createElement("option"); o.value = o.textContent = lbl; s.appendChild(o); });
  }
  pickSel.value = state.pickT; retSel.value = state.retT;
  pickSel.addEventListener("change", function () { state.pickT = pickSel.value; });
  retSel.addEventListener("change", function () { state.retT = retSel.value; });
  $$('input[name="deliv"]').forEach(function (r) { r.addEventListener("change", function () { state.deliv = r.value; $("#hotelField").hidden = r.value === "shop"; renderSummary(); }); });
  $$(".extra input").forEach(function (c) { c.addEventListener("change", function () { if (c.checked) state.extras[c.value] = +c.getAttribute("data-perday"); else delete state.extras[c.value]; renderSummary(); }); });
  var lic = $("#bLicence");
  lic.addEventListener("change", function () { state.licTouched = true; $("#licHint").hidden = lic.checked; });

  /* ---------- summary ---------- */
  var prev = {};
  function extraName(key) { var inp = $('.extra input[value="' + key + '"]'); return $("b", inp.parentNode).textContent; }
  function totals() {
    var m = MODELS[state.model], n = state.start && state.end ? diffDays(state.start, state.end) : 0;
    if (!n) return { m: m, n: 0 };
    var q = quote(state.model, n), ex = 0;
    Object.keys(state.extras).forEach(function (k) { ex += state.extras[k] * n; });
    var del = state.deliv === "far" ? FAR_FEE : 0;
    return { m: m, n: n, q: q, ex: ex, del: del, total: q.base + ex + del };
  }
  function set(id, v) {
    var el = document.getElementById(id);
    if (el.textContent !== v) { el.textContent = v; if (prev[id] !== undefined && !reduce) { el.classList.remove("is-new"); void el.offsetWidth; el.classList.add("is-new"); } }
    prev[id] = v;
  }
  function renderSummary() {
    var T = totals(), m = T.m;
    var img = $("#sImg"); if (img.getAttribute("src") !== m.img) img.src = m.img;
    set("sName", m.name);
    if (!T.n) {
      set("sDates", state.start ? fmt(state.start, { weekday: "short", day: "numeric", month: "short" }) + " → …" : "—");
      ["sRate", "sExtras", "sDeliv", "sTotal"].forEach(function (id) { set(id, "—"); });
      $("#sSave").hidden = true;
    } else {
      set("sDates", fmt(state.start, { day: "numeric", month: "short" }) + " → " + fmt(state.end, { day: "numeric", month: "short" }) + " · " + daysLabel(T.n));
      set("sRate", I.ui(T.q.tier === "month" ? "rateMonth" : T.q.tier === "week" ? "rateWeek" : "rateDay") + " · " + I.money(T.q.perDay) + " / " + I.ui("perDayShort"));
      var ex = Object.keys(state.extras).map(extraName);
      set("sExtras", ex.length ? ex.join(", ") + " · " + I.money(T.ex) : I.ui("none"));
      set("sDeliv", I.ui(state.deliv === "hotel" ? "delivHotel" : state.deliv === "shop" ? "delivShop" : "delivFar") + " · " + (T.del ? I.money(T.del) : I.ui("free")));
      set("sTotal", I.money(T.total));
      var sv = $("#sSave"); sv.hidden = !T.q.save; sv.textContent = I.ui("save").replace("{x}", I.money(T.q.save));
    }
    set("sDep", I.money(m.deposit));
    $("#mbarTxt").textContent = m.name + (T.n ? " · " + daysLabel(T.n) : "");
    $("#mbarTotal").textContent = T.n ? I.money(T.total) : "—";
  }
  function renderBook() {
    buildModels();
    if (state.start) viewMonth = viewMonth || new Date(state.start.getFullYear(), state.start.getMonth(), 1);
    buildCal(); renderSummary();
    qModel.value = state.model;
  }

  /* ---------- submit ---------- */
  function fieldErr(input, msg) { input.setAttribute("aria-invalid", msg ? "true" : "false"); var e = document.getElementById(input.id + "Err"); if (e) e.textContent = msg || ""; return !msg; }
  ["bName", "bPhone"].forEach(function (id) { var el = document.getElementById(id); el.addEventListener("input", function () { if (el.getAttribute("aria-invalid") === "true") fieldErr(el, ""); }); });
  $("#bookForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var T = totals(), ok = true, name = $("#bName"), phone = $("#bPhone"), hotel = $("#bHotel"), first = null;
    if (!T.n) { $("#dateErr").textContent = I.ui("chooseDates"); ok = false; first = first || $("#cal"); } else $("#dateErr").textContent = "";
    if (state.deliv !== "shop" && !hotel.value.trim()) { hotel.setAttribute("aria-invalid", "true"); hotel.placeholder = I.ui("hotelReq"); ok = false; first = first || hotel; } else hotel.setAttribute("aria-invalid", "false");
    if (!fieldErr(name, name.value.trim() ? "" : I.ui("required"))) { ok = false; first = first || name; }
    var digits = phone.value.replace(/\D/g, "");
    if (!fieldErr(phone, !phone.value.trim() ? I.ui("required") : digits.length < 8 ? I.ui("phoneBad") : "")) { ok = false; first = first || phone; }
    if (!ok) {
      first.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
      if (first.tagName === "INPUT") first.focus({ preventScroll: true });
      return;
    }
    var ex = Object.keys(state.extras).map(extraName);
    var msg = [I.ui("waHello"), "",
      "🛵 " + T.m.name,
      "📅 " + I.ui("waDates") + ": " + fmt(state.start, { weekday: "short", day: "numeric", month: "short" }) + " → " + fmt(state.end, { weekday: "short", day: "numeric", month: "short" }) + " (" + daysLabel(T.n) + ")",
      "🕙 " + I.ui("waTimes") + ": " + state.pickT + " → " + state.retT,
      "📍 " + I.ui("waDeliv") + ": " + I.ui(state.deliv === "hotel" ? "delivHotel" : state.deliv === "shop" ? "delivShop" : "delivFar") + (state.deliv !== "shop" ? " — " + hotel.value.trim() : ""),
      "➕ " + I.ui("waExtras") + ": " + (ex.length ? ex.join(", ") : I.ui("none")),
      "🪪 " + I.ui("waLic") + ": " + I.ui(lic.checked ? "waYes" : "waNo"),
      "🙋 " + I.ui("waName") + ": " + name.value.trim(),
      "📱 " + I.ui("waPhone") + ": " + phone.value.trim(),
      "💰 " + I.ui("waTotal") + ": ฿" + T.total.toLocaleString("en-US") + " · " + I.ui("waDep") + ": ฿" + T.m.deposit.toLocaleString("en-US")];
    window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(msg.join("\n")), "_blank", "noopener");
    toast(I.ui("sent"));
  });

  /* ---------- helpers ---------- */
  var toastEl = $("#toast"), toastT = 0;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add("is-on"); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("is-on"); }, 4000); }
  // Drag-to-scroll for the routes rail with a mouse.
  var rail = $("#rail"), drag = null;
  rail.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") return; drag = { x: e.clientX, s: rail.scrollLeft, moved: false }; });
  window.addEventListener("pointermove", function (e) { if (!drag) return; var dx = e.clientX - drag.x; if (Math.abs(dx) > 4) { drag.moved = true; rail.classList.add("is-drag"); } rail.scrollLeft = drag.s - dx; });
  window.addEventListener("pointerup", function () { if (drag) { setTimeout(function () { rail.classList.remove("is-drag"); }, 0); drag = null; } });
  rail.addEventListener("click", function (e) { if (rail.classList.contains("is-drag")) e.preventDefault(); }, true);

  function renderAll() { tick(); renderFleet(); renderQuick(); renderBook(); }
  document.addEventListener("rs:lang", renderAll);
  renderAll(); onScroll(); setInterval(tick, 30000);
})();
