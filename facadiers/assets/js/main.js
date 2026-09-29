/* Atelier des Façadiers — interactions (vanilla, no dependencies) */
(function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ui = function () { return window.FAI18n ? window.FAI18n.ui() : null; };
  // Placeholder address — to be confirmed by the client (see README).
  var QUOTE_EMAIL = "contact@atelierdesfacadiers.fr";

  /* ---------- header, progress, active nav ---------- */
  var header = $("#header");
  var bar = $(".progress span");
  var lastY = 0;
  function onScroll() {
    var y = window.scrollY;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.setProperty("--p", h > 0 ? (y / h).toFixed(4) : 0);
    header.classList.toggle("is-solid", y > 40);
    var menuOpen = header.classList.contains("menu-open");
    header.classList.toggle("is-hidden", !menuOpen && y > 600 && y > lastY + 4);
    if (y < lastY - 4 || y < 600) header.classList.remove("is-hidden");
    lastY = y;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var navLinks = $$(".nav a");
  if ("IntersectionObserver" in window) {
    var secIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["metiers", "materiaux", "references", "methode", "devis"].forEach(function (id) { var s = document.getElementById(id); if (s) secIO.observe(s); });
  }

  /* ---------- mobile menu ---------- */
  var burger = $("#burger"), mnav = $("#mnav");
  function setMenu(open) {
    burger.setAttribute("aria-expanded", String(open));
    header.classList.toggle("menu-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (open) { mnav.hidden = false; requestAnimationFrame(function () { mnav.classList.add("is-open"); }); }
    else { mnav.classList.remove("is-open"); mnav.hidden = true; }
  }
  burger.addEventListener("click", function () { setMenu(burger.getAttribute("aria-expanded") !== "true"); });
  mnav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && header.classList.contains("menu-open")) { setMenu(false); burger.focus(); } });
  window.addEventListener("resize", function () { if (window.innerWidth >= 1080 && header.classList.contains("menu-open")) setMenu(false); });

  /* ---------- hero: material explorer with lamella reveal ---------- */
  var ORDER = ["fibre", "bois", "metal", "hpl", "mineral"];
  var BRANDS = { fibre: "Equitone · Cedral", bois: "Fiberdeck · Pura", metal: "Stacbond · Alpolic", hpl: "Trespa · Fundermax", mineral: "Rockpanel" };
  var stage = $(".hero__stage"), blinds = $(".blinds"), explorer = $(".explorer");
  var swatches = $$(".swatch"), exName = $("#exName"), exBrands = $("#exBrands"), exIndex = $("#exIndex"), exBar = $("#exBar");
  var pics = {};
  var first = $(".hero__img", stage);
  first.classList.add("is-first");
  pics.bois = first;
  ORDER.forEach(function (m) {
    if (pics[m]) return;
    var p = first.cloneNode(true);
    p.classList.remove("is-on", "is-first");
    p.setAttribute("data-m", m);
    $$("source", p).forEach(function (s) { s.srcset = s.srcset.replace(/m-bois/, "m-" + m); });
    var im = $("img", p);
    im.removeAttribute("fetchpriority");
    im.loading = "lazy";
    im.src = im.getAttribute("src").replace(/m-bois/, "m-" + m);
    stage.insertBefore(p, blinds);
    pics[m] = p;
  });

  var cur = "bois", busy = false, timer = null, paused = false, inView = true, DUR = 6000;
  var N = window.innerWidth < 700 ? 6 : 10;

  function label(m) { var u = ui(); return u ? u.m[m] : m; }
  function paint(m) {
    exName.textContent = label(m);
    exBrands.textContent = BRANDS[m];
    exIndex.textContent = "0" + (ORDER.indexOf(m) + 1);
    swatches.forEach(function (s) { s.setAttribute("aria-pressed", String(s.getAttribute("data-m") === m)); });
  }

  function ready(img) {
    img.loading = "eager";
    if (img.complete && img.naturalWidth) return Promise.resolve();
    return new Promise(function (res) {
      img.addEventListener("load", res, { once: true });
      img.addEventListener("error", res, { once: true });
    });
  }

  function show(m) {
    if (m === cur || busy) return;
    var next = pics[m], prev = pics[cur], img = $("img", next);
    busy = true;
    paint(m);
    ready(img).then(function () {
      if (reduce || !img.naturalWidth) { swap(); return; }
      var W = stage.clientWidth, H = stage.clientHeight;
      var s = Math.max(W / img.naturalWidth, H / img.naturalHeight) * 1.06;
      var bw = img.naturalWidth * s, bh = img.naturalHeight * s;
      var ox = (W - bw) / 2, oy = (H - bh) / 2, sw = W / N;
      blinds.style.setProperty("--n", N);
      blinds.innerHTML = "";
      for (var i = 0; i < N; i++) {
        var strip = document.createElement("i");
        strip.style.setProperty("--i", i);
        strip.style.backgroundImage = "url(\"" + (img.currentSrc || img.src) + "\")";
        strip.style.backgroundSize = bw + "px " + bh + "px";
        strip.style.backgroundPosition = (ox - i * sw) + "px " + oy + "px";
        blinds.appendChild(strip);
      }
      void blinds.offsetWidth;
      blinds.classList.add("is-run");
      var last = blinds.lastElementChild;
      var done = false;
      function end() { if (done) return; done = true; swap(); }
      last.addEventListener("animationend", end, { once: true });
      setTimeout(end, 55 * N + 1400);
    });
    function swap() {
      next.classList.add("is-on");
      prev.classList.remove("is-on", "is-first");
      cur = m;
      requestAnimationFrame(function () {
        blinds.classList.remove("is-run");
        blinds.innerHTML = "";
        busy = false;
      });
    }
    restart();
  }

  function restart() {
    clearTimeout(timer);
    exBar.classList.remove("is-run");
    if (reduce) return;
    void exBar.offsetWidth;
    exBar.style.setProperty("--dur", DUR + "ms");
    exBar.classList.add("is-run");
  }
  exBar.addEventListener("animationend", function () {
    if (paused || !inView || document.hidden) return;
    show(ORDER[(ORDER.indexOf(cur) + 1) % ORDER.length]);
  });

  swatches.forEach(function (s) {
    s.addEventListener("click", function () { show(s.getAttribute("data-m")); });
  });
  function setPaused(p) {
    paused = p;
    explorer.classList.toggle("is-paused", p || !inView);
  }
  explorer.addEventListener("pointerenter", function () { setPaused(true); });
  explorer.addEventListener("pointerleave", function () { setPaused(false); });
  explorer.addEventListener("focusin", function () { setPaused(true); });
  explorer.addEventListener("focusout", function (e) { if (!explorer.contains(e.relatedTarget)) setPaused(false); });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) {
      inView = en[0].isIntersecting;
      explorer.classList.toggle("is-paused", paused || !inView);
    }).observe($(".hero"));
  }
  document.addEventListener("visibilitychange", function () {
    explorer.classList.toggle("is-paused", paused || document.hidden || !inView);
  });
  paint(cur);
  // start cycling after the intro choreography
  setTimeout(restart, reduce ? 0 : 1600);
  // warm up the next image once the page is idle
  window.addEventListener("load", function () {
    setTimeout(function () { ORDER.forEach(function (m) { $("img", pics[m]).loading = "eager"; }); }, 2500);
  });

  document.addEventListener("fa:lang", function () { paint(cur); syncTrade(activeTrade); });

  /* ---------- trades: sticky visual follows the active trade ---------- */
  var trades = $$(".trade"), timgs = $$(".trades__img"), badge = $(".trades__badge");
  var tradeNum = $("#tradeNum"), tradeName = $("#tradeName"), activeTrade = 0;
  function syncTrade(i) {
    trades.forEach(function (t, k) { t.classList.toggle("is-active", k === i); });
    timgs.forEach(function (p, k) {
      p.classList.toggle("was-on", k === activeTrade && k !== i);
      if (k !== i && k !== activeTrade) p.classList.remove("was-on");
      p.classList.toggle("is-on", k === i);
    });
    var u = ui();
    tradeNum.textContent = "0" + (i + 1);
    tradeName.textContent = u ? u.trades[i] : "";
    if (badge) badge.style.setProperty("--tc", trades[i].style.getPropertyValue("--c"));
    activeTrade = i;
  }
  if ("IntersectionObserver" in window) {
    var tIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) syncTrade(trades.indexOf(en.target));
      });
    }, { rootMargin: "-48% 0px -48% 0px" });
    trades.forEach(function (t) { tIO.observe(t); });
  }
  syncTrade(0);

  /* ---------- reveals + counters + steps line ---------- */
  function count(el) {
    var to = +el.getAttribute("data-count"), t0 = null;
    if (reduce) { el.textContent = to; return; }
    function step(ts) {
      if (!t0) t0 = ts;
      var k = Math.min(1, (ts - t0) / 1400);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    }
    el.textContent = "0";
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    document.documentElement.classList.add("reveal-ready");
    // stagger siblings that reveal together
    $$("[data-reveal]").forEach(function (el) {
      var sibs = $$(":scope > [data-reveal]", el.parentElement);
      var i = sibs.indexOf(el);
      if (sibs.length > 1 && i > 0) el.style.setProperty("--rd", Math.min(i, 6) * 0.08 + "s");
    });
    var rIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        $$("[data-count]", en.target).forEach(count);
        rIO.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.01 });
    $$("[data-reveal]").forEach(function (el) { rIO.observe(el); });
    var steps = $("#steps");
    new IntersectionObserver(function (en, o) {
      if (en[0].isIntersecting) { steps.classList.add("is-drawn"); o.disconnect(); }
    }, { rootMargin: "0px 0px -25% 0px" }).observe(steps);
  }

  /* ---------- references rail ---------- */
  var rail = $("#rail"), railBar = $("#railBar");
  function railProgress() {
    var max = rail.scrollWidth - rail.clientWidth;
    var vis = rail.clientWidth / rail.scrollWidth;
    var p = max > 0 ? vis + (1 - vis) * (rail.scrollLeft / max) : 1;
    railBar.style.setProperty("--p", p.toFixed(3));
  }
  rail.addEventListener("scroll", railProgress, { passive: true });
  window.addEventListener("resize", railProgress);
  railProgress();
  $$(".rail__btn").forEach(function (b) {
    b.addEventListener("click", function () {
      var card = $(".ref", rail);
      var step = card ? card.getBoundingClientRect().width + 19 : rail.clientWidth * 0.8;
      rail.scrollBy({ left: step * +b.getAttribute("data-dir"), behavior: reduce ? "auto" : "smooth" });
    });
  });
  // drag to scroll with a mouse
  var drag = null;
  rail.addEventListener("pointerdown", function (e) {
    if (e.pointerType !== "mouse") return;
    drag = { x: e.clientX, left: rail.scrollLeft, moved: false };
    rail.style.scrollSnapType = "none";
  });
  window.addEventListener("pointermove", function (e) {
    if (!drag) return;
    var dx = e.clientX - drag.x;
    if (Math.abs(dx) > 4) drag.moved = true;
    rail.scrollLeft = drag.left - dx;
  });
  window.addEventListener("pointerup", function () {
    if (!drag) return;
    drag = null;
    rail.style.scrollSnapType = "";
  });
  rail.addEventListener("dragstart", function (e) { e.preventDefault(); });

  /* ---------- magnetic primary CTA ---------- */
  if (!reduce && window.matchMedia("(pointer: fine)").matches) {
    $$(".magnetic").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1) + "px," + ((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1) + "px)";
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------- quote form → pre-filled email ---------- */
  var toastEl = $("#toast"), toastT = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove("is-on"); }, 3800);
  }
  var form = $("#qform");
  function setErr(input, errEl, msg) {
    input.closest(".field").classList.toggle("is-bad", !!msg);
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    errEl.textContent = msg || "";
    if (msg) input.setAttribute("aria-describedby", errEl.id); else input.removeAttribute("aria-describedby");
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var u = ui();
    var name = $("#qName"), email = $("#qEmail");
    var badName = !name.value.trim(), badEmail = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    setErr(name, $("#qNameErr"), badName ? u.errName : "");
    setErr(email, $("#qEmailErr"), badEmail ? u.errEmail : "");
    if (badName) { name.focus(); return; }
    if (badEmail) { email.focus(); return; }
    var type = (form.querySelector("input[name=ptype]:checked") || {}).value;
    var mats = $$("input[name=mat]:checked", form).map(function (c) { return c.value === "conseil" ? u.advice : u.m[c.value]; });
    var L = u.lines, rows = [];
    function add(k, v) { if (v) rows.push("• " + L[k] + " : " + v); }
    add("type", u.types[type]);
    add("mat", mats.join(", "));
    add("name", name.value.trim());
    add("company", $("#qCompany").value.trim());
    add("email", email.value.trim());
    add("phone", $("#qPhone").value.trim());
    add("area", $("#qArea").value ? $("#qArea").value + " m²" : "");
    add("city", $("#qCity").value.trim());
    add("msg", $("#qMsg").value.trim());
    var body = u.hello + "\n\n" + rows.join("\n");
    toast(u.sent);
    window.location.href = "mailto:" + QUOTE_EMAIL + "?subject=" + encodeURIComponent(u.subject) + "&body=" + encodeURIComponent(body);
  });
  ["#qName", "#qEmail"].forEach(function (s) {
    $(s).addEventListener("input", function () { if (this.getAttribute("aria-invalid") === "true") setErr(this, $(s + "Err"), ""); });
  });
})();
