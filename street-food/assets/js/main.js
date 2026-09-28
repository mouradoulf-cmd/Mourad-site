/* Mae Lek — interactions (vanilla JS, no dependencies).
   The page is complete without this file: the whole menu is in the HTML;
   JS adds filtering, the takeaway bag and the WhatsApp order. */
(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;
  var WA = "66812345678";
  var OPEN = 17, CLOSE = 1, DAY_OFF = 1; // Bangkok time; Monday off

  var I = window.SFI18n || {
    apply: function () {}, lang: function () { return "en"; }, locale: function () { return "en-GB"; },
    t: function (k) { var el = document.querySelector('[data-i18n="' + k + '"]'); return el ? el.innerHTML : ""; },
    ui: function (k) { return ({ open: "Cooking now · until 01:00", opens: "Opens tonight at 17:00", monday: "Closed Mondays · back Tuesday 17:00", tonight: "Tonight", tomorrow: "Tomorrow", spice: [["ไม่เผ็ด", "Not spicy", ""], ["เผ็ดนิดหน่อย", "A little spicy", ""], ["เผ็ดกลาง", "Medium", ""], ["เผ็ด", "Spicy", ""], ["เผ็ดมาก", "Thai spicy", ""]], added: "Added to your order:", chooseTime: "Please choose a pick-up time.", required: "Please fill this in.", phoneBad: "Please enter a number we can reach on WhatsApp.", emptyBag: "Add at least one dish first.", sent: "WhatsApp is opening with your order — just press send.", special: "special", remove: "Remove one", addOne: "Add one", closedNow: "", waHello: "Hello Mae Lek! Takeaway order:", waSpice: "Spice", waPickup: "Pick-up", waName: "Name", waPhone: "Phone", waNote: "Note", waTotal: "Total", waAsap: "as soon as possible" })[k] || ""; },
    money: function (thb) { return "฿" + thb.toLocaleString("en-US"); }
  };
  function txt(k) { var d = document.createElement("div"); d.innerHTML = I.t(k); return d.textContent; }

  /* ---------- Bangkok clock ---------- */
  function bkk() {
    var p = {};
    new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Bangkok", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false, weekday: "short" })
      .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    return { y: +p.year, m: +p.month - 1, d: +p.day, h: +p.hour % 24, min: +p.minute, wd: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday) };
  }
  // An evening belongs to the day it started: 00:30 Wednesday is Tuesday night.
  function nightDay(n) { return n.h < 5 ? (n.wd + 6) % 7 : n.wd; }
  // The evening people mean by "tonight": after closing time it is the coming one.
  function evening(n) { return n.h < CLOSE ? (n.wd + 6) % 7 : n.wd; }
  function isOpen(n) { var nd = nightDay(n); return nd !== DAY_OFF && (n.h >= OPEN || n.h < CLOSE); }
  function tick() {
    var n = bkk(), key = isOpen(n) ? "open" : (n.wd === DAY_OFF && n.h >= CLOSE) ? "monday" : "opens";
    $$("[data-status]").forEach(function (el) { el.textContent = I.ui(key); el.closest(".status").classList.toggle("is-closed", key !== "open"); });
    var nd = evening(n);
    $$("#hours li").forEach(function (li) { li.classList.toggle("is-today", Number(li.getAttribute("data-day")) === nd); });
  }

  /* ---------- header, progress, mobile nav ---------- */
  var header = $("#header"), bar = $(".progress span"), hero = $(".hero"), lastY = window.scrollY, ticking = false, navOpen = false;
  var navLinks = $$(".nav a"), sections = navLinks.map(function (a) { return $(a.getAttribute("href")); });
  function onScroll() {
    ticking = false;
    var y = window.scrollY, heroH = hero.offsetHeight;
    header.classList.toggle("is-solid", y > 40);
    if (!navOpen) {
      if (y > heroH * 0.6 && y > lastY + 4) header.classList.add("is-hidden");
      else if (y < lastY - 4 || y < heroH * 0.6) header.classList.remove("is-hidden");
    }
    if (Math.abs(y - lastY) > 4) lastY = y;
    document.body.classList.toggle("hdr-on", !header.classList.contains("is-hidden") && y > 40);
    var max = root.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
    var mid = y + window.innerHeight * 0.35, cur = -1;
    sections.forEach(function (s, i) { if (s && s.offsetTop <= mid) cur = i; });
    navLinks.forEach(function (a, i) { a.classList.toggle("is-current", i === cur); });
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
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
  window.matchMedia("(min-width: 960px)").addEventListener("change", function (m) { if (m.matches && navOpen) setNav(false); });
  document.addEventListener("click", function (e) { var b = e.target.closest("[data-lang]"); if (b) I.apply(b.getAttribute("data-lang")); });

  /* ---------- reveals + counters ---------- */
  if ("IntersectionObserver" in window && !reduce) {
    var items = $$("[data-reveal]");
    items.forEach(function (el) {
      var sibs = $$(":scope > [data-reveal]", el.parentNode), i = sibs.indexOf(el);
      if (i > 0) el.style.setProperty("--d", Math.min(i * 0.06, 0.36) + "s");
    });
    root.classList.add("reveal-ready");
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); rio.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });
    items.forEach(function (el) { rio.observe(el); });
    setTimeout(function () { items.forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-in"); }); }, 60);
    var counters = $$("[data-count]");
    counters.forEach(function (c) { c.textContent = "0"; });
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        cio.unobserve(en.target);
        var el = en.target, to = Number(el.getAttribute("data-count")), t0 = null;
        (function step(ts) { if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / 1400); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(step); })(performance.now());
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
    }, 6000);
  }

  /* ---------- dishes: chili marks, filters ---------- */
  var DISHES = {};
  $$(".dish").forEach(function (d) {
    var id = d.getAttribute("data-id");
    DISHES[id] = { el: d, price: Number(d.getAttribute("data-thb")), name: $(".dish__name", d).textContent, img: $("img", d).getAttribute("src") };
    var c = $(".chili", d), n = Number(c.getAttribute("data-n"));
    c.setAttribute("aria-hidden", "true");
    if (n === 0) c.remove();
    else for (var i = 0; i < 3; i++) { var s = document.createElement("i"); if (i < n) s.className = "on"; c.appendChild(s); }
    $(".add", d).addEventListener("click", function (e) { addToBag(id, e.currentTarget); });
  });
  var cat = "all", vegOnly = $("#vegOnly");
  function filter() {
    var shown = 0;
    $$(".dish").forEach(function (d) {
      var ok = (cat === "all" || d.getAttribute("data-cat") === cat) && (!vegOnly.checked || d.hasAttribute("data-veg"));
      if (ok && d.hidden && !reduce) { d.classList.remove("pop"); void d.offsetWidth; d.classList.add("pop"); }
      d.hidden = !ok; if (ok) shown++;
    });
    $("#empty").hidden = shown > 0;
  }
  $$(".fchip").forEach(function (b) {
    b.addEventListener("click", function () {
      cat = b.getAttribute("data-cat");
      $$(".fchip").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      filter();
    });
  });
  vegOnly.addEventListener("change", filter);

  /* ---------- the bag ---------- */
  var bag = [];   // {key, id, price, special, qty}
  try { bag = JSON.parse(sessionStorage.getItem("mlkBag") || "[]").filter(function (l) { return DISHES[l.id]; }); } catch (e) { bag = []; }
  var obar = $("#obar");
  function save() { try { sessionStorage.setItem("mlkBag", JSON.stringify(bag)); } catch (e) {} }
  function lineName(l) { return DISHES[l.id].name + (l.special ? " (" + I.ui("special") + ")" : ""); }
  function count() { return bag.reduce(function (s, l) { return s + l.qty; }, 0); }
  function total() { return bag.reduce(function (s, l) { return s + l.qty * l.price; }, 0); }
  function addToBag(id, from, special) {
    var key = special ? "sp-" + id : id, l = bag.filter(function (x) { return x.key === key; })[0];
    if (l) l.qty++; else bag.push({ key: key, id: id, price: special || DISHES[id].price, special: !!special, qty: 1 });
    save(); renderBag();
    if (!reduce) { obar.classList.remove("bump"); void obar.offsetWidth; obar.classList.add("bump"); }
    if (from && !reduce) fly(from);
    toast(I.ui("added") + " " + lineName(bag.filter(function (x) { return x.key === key; })[0]));
  }
  function fly(from) {
    var r = from.getBoundingClientRect(), dot = document.createElement("span");
    dot.className = "fly"; dot.textContent = "🌶";
    dot.style.left = r.left + r.width / 2 + "px"; dot.style.top = r.top + r.height / 2 + "px";
    document.body.appendChild(dot);
    var t = obar.hidden ? { left: window.innerWidth / 2, top: window.innerHeight - 40 } : (function () { var o = obar.getBoundingClientRect(); return { left: o.left + 30, top: o.top + o.height / 2 }; })();
    requestAnimationFrame(function () { dot.style.transform = "translate(" + (t.left - r.left - r.width / 2) + "px," + (t.top - r.top - r.height / 2) + "px) scale(.6)"; dot.style.opacity = "0.2"; });
    setTimeout(function () { dot.remove(); }, 700);
  }
  function renderBag() {
    var n = count();
    obar.hidden = n === 0 || !drawer.hidden;
    document.body.classList.toggle("has-bag", n > 0);
    $("#obarCount").textContent = n;
    $("#obarTotal").textContent = I.money(total());
    $("#dTotal").textContent = I.money(total());
    $$(".dish").forEach(function (d) {
      var q = bag.filter(function (l) { return l.id === d.getAttribute("data-id") && !l.special; })[0];
      var add = $(".add", d);
      add.setAttribute("data-qty", q ? q.qty : "");
      add.setAttribute("aria-label", I.ui("addOne") + ": " + DISHES[d.getAttribute("data-id")].name + (q ? " (" + q.qty + ")" : ""));
    });
    var ul = $("#lines"); ul.innerHTML = "";
    bag.forEach(function (l) {
      var li = document.createElement("li"); li.className = "oline";
      li.innerHTML = "<img alt='' width='56' height='56'><div class='oline__txt'><b></b><span></span></div><div class='qty'><button type='button' data-d='-1'>−</button><output></output><button type='button' data-d='1'>+</button></div>";
      $("img", li).src = DISHES[l.id].img;
      $("b", li).textContent = lineName(l);
      $("span", li).textContent = I.money(l.price * l.qty);
      $("output", li).textContent = l.qty;
      $$("button", li).forEach(function (b) {
        var d = Number(b.getAttribute("data-d"));
        b.setAttribute("aria-label", I.ui(d < 0 ? "remove" : "addOne") + ": " + lineName(l));
        b.addEventListener("click", function () {
          l.qty += d;
          if (l.qty <= 0) bag.splice(bag.indexOf(l), 1);
          save(); renderBag();
          var again = $$(".oline button[data-d='" + d + "']")[Math.min(bag.indexOf(l), bag.length - 1)];
          if (again) again.focus(); else $(".xbtn", drawer).focus();
        });
      });
      ul.appendChild(li);
    });
    $("#linesEmpty").hidden = bag.length > 0;
  }

  /* ---------- spice ---------- */
  var spice = 1, range = $("#spice");
  function setSpice(v) {
    spice = v; range.value = v;
    var s = I.ui("spice")[v];
    $("#spiceTh").textContent = s[0]; $("#spiceEn").textContent = s[1]; $("#spiceNote").textContent = s[2];
    $$(".meter__chilis i").forEach(function (c, i) { c.classList.toggle("on", i <= v); });
    $(".meter").setAttribute("data-level", v);
    range.setAttribute("aria-valuetext", s[1]);
    var seg = $("#oSpice"); seg.innerHTML = "";
    I.ui("spice").forEach(function (x, i) {
      var b = document.createElement("button"); b.type = "button"; b.className = "seg__b";
      b.textContent = x[1]; b.setAttribute("aria-pressed", String(i === v));
      b.addEventListener("click", function () { setSpice(i); b.focus(); });
      seg.appendChild(b);
    });
    try { localStorage.setItem("mlkSpice", v); } catch (e) {}
  }
  try { var sv = Number(localStorage.getItem("mlkSpice")); if (sv >= 0 && sv <= 4 && localStorage.getItem("mlkSpice") !== null) spice = sv; } catch (e) {}
  range.addEventListener("input", function () { setSpice(Number(range.value)); });

  /* ---------- tonight's chalkboard ---------- */
  var SPECIALS = { 2: ["tomyum", 99], 3: ["padthai", 65], 4: ["grill", 75], 5: ["moo", 30], 6: ["curry", 65], 0: ["mango", 60] };
  function renderBoard() {
    var n = bkk(), nd = evening(n), sp = SPECIALS[nd];
    $("#boardDay").textContent = I.ui("tonight") + " · " + new Intl.DateTimeFormat(I.locale(), { weekday: "long" }).format(new Date(Date.UTC(2024, 0, 7 + nd, 12)));
    $("#boardSpecial").hidden = !sp; $("#boardClosed").hidden = !!sp;
    var show = sp || SPECIALS[2];
    if (sp) {
      $("#boardDish").textContent = DISHES[sp[0]].name;
      $("#boardNote").textContent = txt("ton.n" + nd);
      $("#boardWas").textContent = I.money(DISHES[sp[0]].price);
      $("#boardNow").textContent = I.money(sp[1]);
    }
    var img = $("#boardImg"); img.src = DISHES[show[0]].img; img.alt = DISHES[show[0]].name;
    var ul = $("#boardWeek"); ul.innerHTML = "";
    [2, 3, 4, 5, 6, 0].forEach(function (d) {
      var li = document.createElement("li"); if (d === nd) li.className = "is-on";
      li.innerHTML = "<span></span><b></b>";
      li.firstChild.textContent = new Intl.DateTimeFormat(I.locale(), { weekday: "short" }).format(new Date(Date.UTC(2024, 0, 7 + d, 12))).replace(".", "");
      li.lastChild.textContent = DISHES[SPECIALS[d][0]].name;
      ul.appendChild(li);
    });
  }
  $("#boardAdd").addEventListener("click", function (e) { var sp = SPECIALS[evening(bkk())]; if (sp) addToBag(sp[0], e.currentTarget, sp[1]); });

  /* ---------- dialogs ---------- */
  var openDialog = null, lastFocus = null, drawer = $("#drawer");
  function openBox(box, focusEl) {
    lastFocus = document.activeElement; openDialog = box;
    box.hidden = false; box.classList.add("is-open"); document.body.style.overflow = "hidden";
    (focusEl || $("[data-close].xbtn, .xbtn", box)).focus();
  }
  function closeBox(box) {
    box.hidden = true; box.classList.remove("is-open"); document.body.style.overflow = ""; openDialog = null;
    if (box === drawer) { obar.setAttribute("aria-expanded", "false"); renderBag(); }
    if (lastFocus && lastFocus.isConnected && lastFocus.offsetParent !== null) lastFocus.focus(); else if (box === drawer && !obar.hidden) obar.focus();
  }
  $$("[data-close]").forEach(function (b) { b.addEventListener("click", function () { closeBox(b.closest(".drawer, .lightbox, .showcard")); }); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { if (openDialog) closeBox(openDialog); else if (navOpen) { setNav(false); burger.focus(); } }
    if (openDialog === lb) { if (e.key === "ArrowRight") showPhoto(lbIndex + 1); if (e.key === "ArrowLeft") showPhoto(lbIndex - 1); }
    if (openDialog && e.key === "Tab") {
      var f = $$("button, input, a[href]", openDialog).filter(function (b) { return b.offsetParent !== null && !b.disabled; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  /* show-to-the-cook cards */
  var sc = $("#showcard");
  function showCard(th, rom, mean) {
    $("#scThai").textContent = th; $("#scRom").textContent = rom; $("#scMean").textContent = mean;
    $("#scHello").hidden = !rom;
    openBox(sc);
  }
  $$(".phrase").forEach(function (p) { p.addEventListener("click", function () { showCard(p.getAttribute("data-th"), p.getAttribute("data-rom"), $("span", p).textContent); }); });
  $("#taxiBtn").addEventListener("click", function () { showCard("ร้านแม่เล็ก\nซอยบัวขาว พัทยา", "", txt("find.taxiMean")); });

  /* lightbox */
  var tiles = $$(".bento__item"), lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap"), lbIndex = 0;
  tiles.forEach(function (tile, i) { tile.addEventListener("click", function () { openBox(lb); showPhoto(i); }); });
  function showPhoto(i) {
    lbIndex = (i + tiles.length) % tiles.length;
    var img = $("img", tiles[lbIndex]);
    lbImg.src = img.currentSrc || img.src; lbImg.alt = img.alt;
    lbImg.style.animation = "none"; void lbImg.offsetWidth; lbImg.style.animation = "";
    lbCap.textContent = (lbIndex + 1) + " / " + tiles.length + " · " + $(".bento__cap", tiles[lbIndex]).textContent;
  }
  $$(".lightbox__arrow", lb).forEach(function (a) { a.addEventListener("click", function () { showPhoto(lbIndex + Number(a.getAttribute("data-dir"))); }); });
  lb.addEventListener("click", function (e) { if (e.target === lb || e.target.classList.contains("lightbox__stage")) closeBox(lb); });
  (function () {
    var sx = 0, sy = 0;
    lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    lb.addEventListener("touchend", function (e) { var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) showPhoto(lbIndex + (dx < 0 ? 1 : -1)); }, { passive: true });
  })();

  /* ---------- order drawer ---------- */
  var time = "";
  obar.addEventListener("click", function () { openDrawer(); });
  function openDrawer() { buildTimes(); obar.hidden = true; obar.setAttribute("aria-expanded", "true"); openBox(drawer); }
  function hhmm(mins) { mins = (mins + 1440) % 1440; return (mins / 60 | 0) + ":" + (mins % 60 < 10 ? "0" : "") + mins % 60; }
  function buildTimes() {
    var n = bkk(), open = isOpen(n), box = $("#oTime"), slots = [], label;
    var nowM = (n.h < 5 ? n.h + 24 : n.h) * 60 + n.min;
    if (open) {
      label = I.ui("tonight");
      var from = Math.ceil((nowM + 20) / 30) * 30;
      for (var m = Math.max(from, OPEN * 60 + 30); m <= 24 * 60 + 30; m += 30) slots.push(m);
    } else {
      // the next evening we cook
      var d = n.wd, add = 0;
      if (n.h >= OPEN) { add = 1; d = (d + 1) % 7; }
      while (d === DAY_OFF) { d = (d + 1) % 7; add++; }
      label = add === 0 ? I.ui("tonight") : add === 1 ? I.ui("tomorrow") : new Intl.DateTimeFormat(I.locale(), { weekday: "long" }).format(new Date(Date.UTC(2024, 0, 7 + d, 12)));
      for (var k = OPEN * 60 + 30; k <= 24 * 60 + 30; k += 30) slots.push(k);
    }
    $("#pickLegend").textContent = txt("order.pickup") + " · " + label;
    box.innerHTML = "";
    var opts = (open ? ["asap"] : []).concat(slots.map(hhmm));
    if (opts.indexOf(time) < 0) time = open ? "asap" : "";
    opts.forEach(function (o) {
      var b = document.createElement("button"); b.type = "button"; b.className = "slot" + (o === "asap" ? " slot--asap" : "");
      if (o === "asap") b.innerHTML = "<b></b><small></small>", b.firstChild.textContent = txt("order.asap"), b.lastChild.textContent = txt("order.min");
      else b.textContent = o;
      b.setAttribute("aria-pressed", String(o === time));
      b.addEventListener("click", function () { time = o; $("#oTimeErr").textContent = ""; $$(".slot", box).forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); }); });
      box.appendChild(b);
    });
    box.setAttribute("data-label", label);
  }
  function fieldErr(input, msg) { input.setAttribute("aria-invalid", msg ? "true" : "false"); document.getElementById(input.id + "Err").textContent = msg || ""; return !msg; }
  ["oName", "oPhone"].forEach(function (id) { var el = document.getElementById(id); el.addEventListener("input", function () { if (el.getAttribute("aria-invalid") === "true") fieldErr(el, ""); }); });
  $("#orderForm").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!bag.length) { toast(I.ui("emptyBag")); return; }
    var ok = true, name = $("#oName"), phone = $("#oPhone");
    if (!time) { $("#oTimeErr").textContent = I.ui("chooseTime"); ok = false; }
    if (!fieldErr(name, name.value.trim() ? "" : I.ui("required"))) ok = false;
    var digits = phone.value.replace(/\D/g, "");
    if (!fieldErr(phone, !phone.value.trim() ? I.ui("required") : digits.length < 8 ? I.ui("phoneBad") : "")) ok = false;
    if (!ok) {
      var bad = !time ? $("#oTime") : $('#orderForm [aria-invalid="true"]');
      bad.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
      if (bad.tagName === "INPUT") bad.focus({ preventScroll: true });
      return;
    }
    var s = I.ui("spice")[spice], note = $("#oNote").value.trim();
    var msg = [I.ui("waHello"), ""];
    bag.forEach(function (l) { msg.push("• " + l.qty + " × " + DISHES[l.id].name + (l.special ? " (" + I.ui("special") + ")" : "") + " — ฿" + (l.qty * l.price)); });
    msg.push("", "🌶 " + I.ui("waSpice") + ": " + s[1] + " (" + s[0] + ")",
      "🕐 " + I.ui("waPickup") + ": " + (time === "asap" ? I.ui("waAsap") : $("#oTime").getAttribute("data-label") + " " + time),
      "🙋 " + I.ui("waName") + ": " + name.value.trim(),
      "📱 " + I.ui("waPhone") + ": " + phone.value.trim());
    if (note) msg.push("📝 " + I.ui("waNote") + ": " + note);
    msg.push("💰 " + I.ui("waTotal") + ": ฿" + total().toLocaleString("en-US"));
    window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(msg.join("\n")), "_blank", "noopener");
    toast(I.ui("sent"));
  });

  /* ---------- helpers ---------- */
  var toastEl = $("#toast"), toastT = 0;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add("is-on"); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("is-on"); }, 2600); }

  function renderAll() { tick(); setSpice(spice); renderBoard(); renderBag(); if (!drawer.hidden) buildTimes(); }
  document.addEventListener("sf:lang", renderAll);
  renderAll(); setInterval(tick, 30000);
})();
