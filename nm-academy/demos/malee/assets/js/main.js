/* Malee — interactions (vanilla JS, no dependencies).
   The page is complete without this file; hidden "before" states only
   switch on once the observer that reveals them is confirmed to work. */
(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;
  var WA = "66812345678";
  var OPEN = 11, CLOSE = 23, LAST = 21.5; // Bangkok time

  // If i18n.js failed to load, keep everything working in English.
  var I = window.MLI18n || {
    apply: function () {}, lang: function () { return "en"; }, locale: function () { return "en-GB"; },
    t: function (k) { var el = document.querySelector('[data-i18n="' + k + '"]'); return el ? el.textContent : ""; },
    ui: function (k) { return ({ open: "Open now · until 23:00", closing: "Open · last booking 21:30", opens: "Closed · opens at 11:00", today: "Today", tomorrow: "Tomorrow", chooseTime: "Please choose a time.", required: "Please fill this in.", phoneBad: "Please enter a number we can reach on WhatsApp.", noSlots: "No times left today — pick another day.", sent: "WhatsApp is opening with your booking — just press send.", giftSent: "WhatsApp is opening with your gift card request.", waHello: "Hello Malee! I'd like to book:", waTreat: "Treatment", waDay: "Day", waTime: "Time", waGuests: "Guests", waPressure: "Pressure", waName: "Name", waPhone: "Phone", waNote: "Note", waTotal: "Total", waGift: "Hello Malee! I'd like a gift card:", waAmount: "Amount", waFor: "For", waFrom: "From", waMsg: "Message", guest: "guest", guests: "guests" })[k] || ""; },
    money: function (thb) { return "฿" + thb.toLocaleString("en-US"); }
  };

  /* ---------- intro (once per visit) ---------- */
  var intro = $(".intro");
  try { sessionStorage.setItem("mlIntro", "1"); } catch (e) {}
  if (intro) setTimeout(function () { intro.classList.add("is-done"); }, reduce || root.classList.contains("no-intro") ? 0 : 2400);

  /* ---------- Bangkok clock ---------- */
  function bkk() {
    var p = {};
    new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Bangkok", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false })
      .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    return { y: +p.year, m: +p.month - 1, d: +p.day, h: +p.hour % 24, min: +p.minute };
  }
  function tick() {
    var n = bkk(), t = n.h + n.min / 60, key = t >= OPEN && t < CLOSE ? (t < LAST ? "open" : "closing") : "opens";
    $$("[data-status]").forEach(function (el) { el.textContent = I.ui(key); el.closest(".status").classList.toggle("is-closed", key === "opens"); });
  }

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
    var max = root.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
    var mid = y + window.innerHeight * 0.35, cur = -1;
    sections.forEach(function (s, i) { if (s && s.offsetTop <= mid) cur = i; });
    navLinks.forEach(function (a, i) { a.classList.toggle("is-current", i === cur); });
    if (!reduce && y < heroH) hero.style.setProperty("--py", (y * 0.25).toFixed(1) + "px");
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  var burger = $("#burger"), menu = $("#menu");
  function setMenu(open) {
    menuOpen = open;
    burger.setAttribute("aria-expanded", String(open));
    header.classList.remove("is-hidden");
    header.classList.toggle("menu-open", open);
    menu.hidden = !open;
    menu.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  burger.addEventListener("click", function () { setMenu(!menuOpen); });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  window.matchMedia("(min-width: 1024px)").addEventListener("change", function (m) { if (m.matches && menuOpen) setMenu(false); });
  document.addEventListener("click", function (e) { var b = e.target.closest("[data-lang]"); if (b) I.apply(b.getAttribute("data-lang")); });

  /* ---------- reveals + counters ---------- */
  if ("IntersectionObserver" in window && !reduce) {
    var items = $$("[data-reveal]");
    items.forEach(function (el) {
      var sibs = $$(":scope > [data-reveal]", el.parentNode), i = sibs.indexOf(el);
      if (i > 0) el.style.setProperty("--d", Math.min(i * 0.08, 0.48) + "s");
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
        var el = en.target, to = Number(el.getAttribute("data-count")), dec = Number(el.getAttribute("data-decimals") || 0), t0 = null;
        (function step(ts) { if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / 1600); el.textContent = (to * (1 - Math.pow(1 - p, 4))).toFixed(dec); if (p < 1) requestAnimationFrame(step); })(performance.now());
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- hero slideshow ---------- */
  var slides = $$(".hero__slide"), slide = 0;
  if (!reduce && slides.length > 1) {
    setTimeout(function () { slides.forEach(function (s) { $("img", s).loading = "eager"; }); }, 1500);
    setInterval(function () {
      if (document.hidden || window.scrollY > hero.offsetHeight) return;
      slides[slide].classList.remove("is-on");
      slide = (slide + 1) % slides.length;
      slides[slide].classList.add("is-on");
    }, 7000);
  }

  /* ---------- manifesto: words light up as the paragraph crosses the screen ---------- */
  var manWords = [];
  function splitWords() {
    var el = $("[data-words]"); if (!el || reduce) return;
    manWords = [];
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var w = document.createElement("span"); w.className = "w"; w.textContent = part; frag.appendChild(w); manWords.push(w);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) walk(child);
      });
    })(el);
    litWords();
  }
  function litWords() {
    if (!manWords.length) return;
    var el = $("[data-words]"), r = el.getBoundingClientRect(), vh = window.innerHeight;
    var p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.45)));
    var n = Math.round(p * manWords.length);
    manWords.forEach(function (w, i) { w.classList.toggle("is-lit", i < n); });
  }
  window.addEventListener("scroll", function () { requestAnimationFrame(litWords); }, { passive: true });

  /* ---------- hero: the arch drifts gently with the pointer ---------- */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduce) {
    var mx = 0, my = 0, raf = 0;
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5; my = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(function () { raf = 0; hero.style.setProperty("--mx", mx.toFixed(3)); hero.style.setProperty("--my", my.toFixed(3)); });
    });
    hero.addEventListener("pointerleave", function () { hero.style.setProperty("--mx", 0); hero.style.setProperty("--my", 0); });
  }

  /* ---------- treatments: durations drive the price ---------- */
  var TREATS = $$(".card[data-tr]").map(function (card) {
    return {
      key: card.getAttribute("data-tr"), card: card,
      prices: card.getAttribute("data-prices").split(",").map(function (p) { var a = p.split(":"); return { min: +a[0], thb: +a[1] }; })
    };
  });
  function byKey(k) { return TREATS.filter(function (t) { return t.key === k; })[0]; }
  function trName(t) { return I.t("tr." + t.key); }
  function minLabel(m) { return m + " " + I.t("dur.min"); }
  TREATS.forEach(function (t) {
    t.sel = t.prices.length > 1 && t.prices[0].min < 60 ? 1 : 0;
    if (t.key === "thai" || t.key === "oil") t.sel = 1;
    var box = $(".durs", t.card);
    t.prices.forEach(function (p, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "dur";
      b.addEventListener("click", function () { t.sel = i; renderCard(t); });
      box.appendChild(b);
    });
    $(".card__book", t.card).addEventListener("click", function () { bookWith(t.key, t.prices[t.sel].min); });
  });
  function renderCard(t) {
    $$(".dur", t.card).forEach(function (b, i) { b.textContent = minLabel(t.prices[i].min); b.setAttribute("aria-pressed", i === t.sel ? "true" : "false"); });
    var price = $(".card__price", t.card), v = I.money(t.prices[t.sel].thb);
    if (price.textContent !== v) {
      price.textContent = v;
      if (!reduce) { price.classList.remove("is-new"); void price.offsetWidth; price.classList.add("is-new"); }
    }
  }

  /* ---------- how do you feel ---------- */
  var MOODS = { stiff: ["thai", 90, "t-thai"], tired: ["oil", 90, "t-oil"], stressed: ["stone", 90, "t-stone"], walked: ["foot", 60, "t-foot"], sun: ["face", 60, "t-face"], treat: ["herbal", 120, "t-back"] };
  var mood = "", moodBtns = $$(".mood"), match = $("#match");
  moodBtns.forEach(function (b) { b.addEventListener("click", function () { mood = b.getAttribute("data-mood"); renderMatch(true); }); });
  function renderMatch(animate) {
    moodBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-mood") === mood ? "true" : "false"); });
    if (!mood) return;
    var m = MOODS[mood], t = byKey(m[0]), p = t.prices.filter(function (x) { return x.min === m[1]; })[0];
    $(".match__empty", match).hidden = true;
    var card = $(".match__card", match); card.hidden = false;
    var img = $("#matchImg");
    if (img.getAttribute("data-k") !== m[2]) { img.setAttribute("data-k", m[2]); img.src = "assets/img/" + m[2] + ".webp"; img.onerror = function () { img.onerror = null; img.src = "assets/img/" + m[2] + ".jpg"; }; }
    $("#matchName").textContent = trName(t);
    $("#matchWhy").textContent = I.t("feel." + mood + "W");
    $("#matchDur").textContent = minLabel(p.min);
    $("#matchPrice").textContent = I.money(p.thb);
    if (animate && !reduce) { card.classList.remove("is-new"); void card.offsetWidth; card.classList.add("is-new"); }
  }
  $("#matchBook").addEventListener("click", function () { var m = MOODS[mood]; bookWith(m[0], m[1]); });

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
  function restartQ() { clearInterval(qTimer); if (!reduce) qTimer = setInterval(function () { showQuote(qIndex + 1); }, 6500); }
  $$(".quotes__arrow").forEach(function (a) { a.addEventListener("click", function () { showQuote(qIndex + Number(a.getAttribute("data-dir")), true); }); });
  var qWrap = $(".quotes");
  qWrap.addEventListener("mouseenter", function () { clearInterval(qTimer); });
  qWrap.addEventListener("mouseleave", restartQ);
  swipe(qWrap, function (dir) { showQuote(qIndex + dir, true); });
  showQuote(0); restartQ();

  /* ---------- gift card ---------- */
  var gForm = $("#giftForm"), gCode = "";
  (function () { var c = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; for (var i = 0; i < 4; i++) gCode += c[Math.floor(Math.random() * c.length)]; })();
  $("#vCode").textContent = gCode;
  function giftAmount() { return Number($('input[name="gamount"]:checked', gForm).value); }
  function renderVoucher() {
    $("#vAmount").textContent = I.money(giftAmount());
    $("#vTo").textContent = $("#gTo").value.trim() || "—";
    $("#vFrom").textContent = $("#gFrom").value.trim() || "—";
    var msg = $("#gMsg").value.trim() || $("#gMsg").getAttribute("placeholder");
    $("#vMsg").textContent = "“" + msg + "”";
  }
  gForm.addEventListener("input", renderVoucher);
  gForm.addEventListener("change", renderVoucher);
  // Voucher tilts toward the pointer on desktop.
  var voucher = $("#voucher");
  if (window.matchMedia("(hover: hover)").matches && !reduce) {
    var vw = $(".voucher-wrap");
    vw.addEventListener("pointermove", function (e) { var r = vw.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; voucher.style.transform = "rotateY(" + (x * 12).toFixed(1) + "deg) rotateX(" + (-y * 10).toFixed(1) + "deg)"; voucher.style.setProperty("--gx", (x * 100 + 50).toFixed(0) + "%"); });
    vw.addEventListener("pointerleave", function () { voucher.style.transform = ""; });
  }
  gForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var msg = [I.ui("waGift"), "",
      "🎁 " + I.ui("waAmount") + ": " + "฿" + giftAmount().toLocaleString("en-US") + (I.money(giftAmount()).indexOf("฿") < 0 ? " (≈ " + I.money(giftAmount()) + ")" : "")];
    if ($("#gTo").value.trim()) msg.push("💐 " + I.ui("waFor") + ": " + $("#gTo").value.trim());
    if ($("#gFrom").value.trim()) msg.push("🙋 " + I.ui("waFrom") + ": " + $("#gFrom").value.trim());
    if ($("#gMsg").value.trim()) msg.push("💌 " + I.ui("waMsg") + ": " + $("#gMsg").value.trim());
    msg.push("🔖 MLE-" + gCode);
    window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(msg.join("\n")), "_blank", "noopener");
    toast(I.ui("giftSent"));
  });

  /* ---------- booking ---------- */
  var form = $("#bookForm"), treatEl = $("#bTreat"), durEl = $("#bDur"), dayEl = $("#bDay"), timeEl = $("#bTime");
  var bTreat = "thai", bDur = 90, days = [], dayIdx = 0, time = "", guests = 1;
  function fmt(d, o) { return new Intl.DateTimeFormat(I.locale(), o).format(d); }
  function chip(parent, label, on, fn, sub) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "chip--btn"; b.setAttribute("aria-pressed", on ? "true" : "false");
    b.innerHTML = "<span></span>" + (sub ? "<small></small>" : "");
    b.firstChild.textContent = label; if (sub) b.lastChild.textContent = sub;
    b.addEventListener("click", fn); parent.appendChild(b); return b;
  }
  function buildTreats() {
    treatEl.innerHTML = "";
    TREATS.forEach(function (t) { chip(treatEl, trName(t), t.key === bTreat, function () { bTreat = t.key; fixDur(); buildTreats(); buildDurs(); update(); }); });
  }
  function fixDur() { var t = byKey(bTreat); if (!t.prices.some(function (p) { return p.min === bDur; })) bDur = t.prices[Math.min(1, t.prices.length - 1)].min; }
  function buildDurs() {
    durEl.innerHTML = "";
    byKey(bTreat).prices.forEach(function (p) { chip(durEl, minLabel(p.min), p.min === bDur, function () { bDur = p.min; buildDurs(); buildTimes(); update(); }, I.money(p.thb)); });
  }
  function buildDays() {
    var n = bkk(), base = new Date(n.y, n.m, n.d);
    days = [];
    for (var i = 0; i < 14; i++) days.push(new Date(base.getFullYear(), base.getMonth(), base.getDate() + i));
    dayEl.innerHTML = "";
    days.forEach(function (d, i) {
      var name = i === 0 ? I.ui("today") : i === 1 ? I.ui("tomorrow") : fmt(d, { weekday: "short" }).replace(".", "");
      chip(dayEl, name, i === dayIdx, function () { dayIdx = i; buildDays(); buildTimes(); update(); }, fmt(d, { day: "numeric", month: "short" }));
    });
  }
  function buildTimes() {
    var n = bkk(), nowT = n.h + n.min / 60 + 0.5, today = dayIdx === 0, slots = [];
    for (var h = OPEN; h + bDur / 60 <= CLOSE && h <= LAST; h += 0.5) slots.push(h);
    timeEl.innerHTML = "";
    var free = slots.filter(function (h) { return !(today && h < nowT); });
    slots.forEach(function (h) {
      var lbl = Math.floor(h) + ":" + (h % 1 ? "30" : "00");
      var b = document.createElement("button");
      b.type = "button"; b.className = "slot"; b.textContent = lbl;
      b.disabled = today && h < nowT;
      b.setAttribute("aria-pressed", lbl === time ? "true" : "false");
      b.addEventListener("click", function () { time = lbl; $("#timeErr").textContent = ""; $$(".slot", timeEl).forEach(function (x) { x.setAttribute("aria-pressed", x.textContent === lbl ? "true" : "false"); }); update(); });
      timeEl.appendChild(b);
    });
    if (!free.some(function (h) { return Math.floor(h) + ":" + (h % 1 ? "30" : "00") === time; })) time = "";
    $("#timeErr").textContent = today && !free.length ? I.ui("noSlots") : "";
  }
  function pressureLabel() { return I.t("book.p" + $("#fPressure").value); }
  $$(".stepper__btn").forEach(function (b) {
    b.addEventListener("click", function () { guests = Math.max(1, Math.min(6, guests + Number(b.getAttribute("data-step")))); update(); });
  });
  var prev = {};
  function price() { return byKey(bTreat).prices.filter(function (p) { return p.min === bDur; })[0].thb; }
  function update() {
    $("#guests").textContent = guests;
    $$(".stepper__btn")[0].disabled = guests <= 1; $$(".stepper__btn")[1].disabled = guests >= 6;
    $("#couplePerk").hidden = guests !== 2;
    $("#pressureVal").textContent = pressureLabel();
    var d = days[dayIdx];
    var v = {
      sTreat: trName(byKey(bTreat)),
      sDur: minLabel(bDur),
      sDay: fmt(d, { weekday: "long", day: "numeric", month: "long" }),
      sTime: time || "—",
      sGuests: guests + " " + I.ui(guests > 1 ? "guests" : "guest"),
      sTotal: I.money(price() * guests)
    };
    Object.keys(v).forEach(function (id) {
      var el = document.getElementById(id);
      if (el.textContent !== v[id]) { el.textContent = v[id]; if (prev[id] !== undefined && !reduce) { el.classList.remove("is-new"); void el.offsetWidth; el.classList.add("is-new"); } }
      prev[id] = v[id];
    });
    var recap = $("#recap"); recap.innerHTML = "";
    [v.sTreat + " · " + v.sDur, fmt(d, { weekday: "short", day: "numeric", month: "short" }) + (time ? " · " + time : ""), v.sTotal].forEach(function (txt) {
      var s = document.createElement("span"); s.textContent = txt; recap.appendChild(s);
    });
  }
  $("#fPressure").addEventListener("input", update);
  function bookWith(key, min) {
    bTreat = key; bDur = min; fixDur();
    buildTreats(); buildDurs(); buildTimes(); update();
    $("#book").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }
  function fieldErr(input, msg) { input.setAttribute("aria-invalid", msg ? "true" : "false"); document.getElementById(input.id + "Err").textContent = msg || ""; return !msg; }
  ["fName", "fPhone"].forEach(function (id) { var el = document.getElementById(id); el.addEventListener("input", function () { if (el.getAttribute("aria-invalid") === "true") fieldErr(el, ""); }); });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true, name = $("#fName"), phone = $("#fPhone");
    if (!time) { $("#timeErr").textContent = $("#timeErr").textContent || I.ui("chooseTime"); ok = false; }
    if (!fieldErr(name, name.value.trim() ? "" : I.ui("required"))) ok = false;
    var digits = phone.value.replace(/\D/g, "");
    if (!fieldErr(phone, !phone.value.trim() ? I.ui("required") : digits.length < 8 ? I.ui("phoneBad") : "")) ok = false;
    if (!ok) {
      var bad = !time ? timeEl : form.querySelector('[aria-invalid="true"]');
      bad.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
      if (bad.tagName === "INPUT") bad.focus({ preventScroll: true });
      return;
    }
    var note = $("#fNote").value.trim(), d = days[dayIdx], total = price() * guests;
    var msg = [I.ui("waHello"), "",
      "🌿 " + I.ui("waTreat") + ": " + trName(byKey(bTreat)) + " · " + minLabel(bDur),
      "📅 " + I.ui("waDay") + ": " + fmt(d, { weekday: "long", day: "numeric", month: "long" }),
      "🕐 " + I.ui("waTime") + ": " + time,
      "👥 " + I.ui("waGuests") + ": " + guests,
      "💆 " + I.ui("waPressure") + ": " + pressureLabel(),
      "💰 " + I.ui("waTotal") + ": ฿" + total.toLocaleString("en-US"),
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
  function renderAll() {
    splitWords(); tick(); TREATS.forEach(renderCard); renderMatch(false); renderVoucher();
    buildTreats(); buildDurs(); buildDays(); buildTimes(); update();
  }
  document.addEventListener("ml:lang", renderAll);
  renderAll(); setInterval(tick, 30000);
})();
