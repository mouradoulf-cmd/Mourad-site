/* ÔBlanc — interactions. Vanilla JS, no dependencies. Everything is readable
   without JavaScript; this adds the intro, the live panel (Casablanca time),
   tabs, the selection drawer, the juice glass, the lightbox and the booking
   ticket. Nothing animates with prefers-reduced-motion. */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var t = function (k) { return window.OBI18n ? window.OBI18n.t(k) : ""; };
  var lang = function () { return window.OBI18n ? window.OBI18n.lang() : "fr"; };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;
  var TZ = "Africa/Casablanca";
  var TEL = "05 23 32 44 54";

  /* ---------- intro: once per visit ---------- */
  try { sessionStorage.setItem("obIntro", "1"); } catch (e) {}
  var intro = $(".intro");
  if (intro && !root.classList.contains("no-intro")) setTimeout(function () { intro.remove(); }, 3400);

  /* ---------- toast ---------- */
  var toast = $("#toast"), toastTimer;
  function say(msg) { toast.textContent = msg; toast.classList.add("is-on"); clearTimeout(toastTimer); toastTimer = setTimeout(function () { toast.classList.remove("is-on"); }, 2600); }
  function copy(text, msg) {
    var done = function () { say(msg); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
    else done();
  }

  /* ---------- header, progress, nav ---------- */
  var header = $("#header"), bar = $(".progress span"), lastY = 0;
  function onScroll() {
    var y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle("is-solid", y > 20);
    var menuOpen = !$("#menu").hidden;
    if (y > 500 && y > lastY + 5 && !menuOpen) header.classList.add("is-hidden");
    else if (y < lastY - 5 || y < 500) header.classList.remove("is-hidden");
    lastY = y;
    if (bar) bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
  }
  var q = false;
  window.addEventListener("scroll", function () { if (!q) { q = true; requestAnimationFrame(function () { q = false; onScroll(); }); } }, { passive: true });
  onScroll();

  var burger = $("#burger"), menu = $("#menu");
  function setMenu(open) {
    menu.hidden = !open; burger.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    $$("main, footer").forEach(function (el) { if (open) el.setAttribute("inert", ""); else el.removeAttribute("inert"); });
    if (open) { var a = $("a", menu); if (a) a.focus(); }
  }
  burger.addEventListener("click", function () { setMenu(menu.hidden); });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) { setMenu(false); burger.focus(); } });
  window.addEventListener("resize", function () { if (innerWidth >= 1000 && !menu.hidden) setMenu(false); });

  if ("IntersectionObserver" in window) {
    var navLinks = $$(".nav a");
    var secIO = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) navLinks.forEach(function (a) { a.classList.toggle("is-current", a.getAttribute("href") === "#" + e.target.id); }); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["carte", "journee", "maison", "galerie", "reserver", "infos"].forEach(function (id) { var s = document.getElementById(id); if (s) secIO.observe(s); });
  }

  /* ---------- Casablanca time ---------- */
  function nowCasa() {
    var p = {};
    new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "numeric", minute: "numeric", weekday: "short", hour12: false }).formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { h: +p.hour % 24, m: +p.minute, d: days[p.weekday] };
  }
  function moment(h) { return h < 12 ? 0 : h < 16 ? 1 : h < 19 ? 2 : 3; }

  /* ---------- live panel ---------- */
  function live() {
    var n = nowCasa(), open = n.h >= 6;
    var st = $("#liveStatus");
    st.innerHTML = '<span class="dot' + (open ? "" : " dot--off") + '"></span>';
    var s = document.createElement("span"); s.textContent = t(open ? "live.open" : "live.closed"); st.appendChild(s);
    var mk = "live.m" + (moment(n.h) + 1), lm = $("#liveMoment");
    lm.setAttribute("data-i18n", mk); lm.textContent = t(mk);
    var diff = (5 - n.d + 7) % 7;
    $("#liveFriday").textContent = diff === 0 ? t("live.today") : diff === 1 ? t("live.tomorrow") : t("live.inDays").replace("{n}", diff);
    $$("#hours [data-day]").forEach(function (r) { r.classList.toggle("is-today", +r.getAttribute("data-day") === n.d); });
  }
  live(); setInterval(live, 60000);
  document.addEventListener("ob:lang", live);

  /* ---------- hero slides ---------- */
  (function slides() {
    var wrap = $("#slides"); if (!wrap) return;
    var items = $$(".slide", wrap), dots = $(".slides__dots", wrap), i = 0, timer, visible = true;
    items.forEach(function (s, k) {
      var b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", (k + 1) + " / " + items.length);
      if (!k) b.setAttribute("aria-current", "true");
      b.addEventListener("click", function () { go(k); schedule(); });
      dots.appendChild(b);
    });
    function go(k) {
      items[i].classList.remove("is-on"); dots.children[i].removeAttribute("aria-current");
      i = k; items[i].classList.add("is-on"); dots.children[i].setAttribute("aria-current", "true");
    }
    function schedule() { clearTimeout(timer); if (reduce || !visible || document.hidden) return; timer = setTimeout(function () { go((i + 1) % items.length); schedule(); }, 5200); }
    if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; schedule(); }).observe(wrap);
    document.addEventListener("visibilitychange", schedule);
    schedule();
  })();

  /* ---------- tabs (ARIA, arrow keys) ---------- */
  function tabs(list, onChange) {
    if (!list) return null;
    var btns = $$("[role=tab]", list);
    function select(b, focus) {
      btns.forEach(function (x) {
        var on = x === b;
        x.setAttribute("aria-selected", String(on)); x.tabIndex = on ? 0 : -1;
        var p = document.getElementById(x.getAttribute("aria-controls")); if (p) p.hidden = !on;
      });
      if (focus) b.focus();
      if (onChange) onChange(b);
    }
    btns.forEach(function (b, k) {
      b.addEventListener("click", function () { select(b); });
      b.addEventListener("keydown", function (e) {
        var dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (root.dir === "rtl") dir = -dir;
        if (dir) { e.preventDefault(); select(btns[(k + dir + btns.length) % btns.length], true); }
      });
    });
    return { select: select, btns: btns };
  }
  // The day: open on the current moment, flagged "now".
  var day = tabs($("#dayTabs"));
  if (day) {
    var m = moment(nowCasa().h), cur = day.btns[m];
    var tag = document.createElement("span"); tag.className = "tab__now"; tag.setAttribute("data-i18n", "day.now"); tag.textContent = t("day.now");
    cur.appendChild(tag); day.select(cur);
  }
  // The menu: the photo follows the category.
  var pic = $("#cartePic");
  tabs($("#carteTabs"), function (b) {
    var name = b.getAttribute("data-pic"), img = $("img", pic), src = $("source", pic);
    if (!img || img.getAttribute("src").indexOf(name + ".") > -1) return;
    img.classList.add("is-out");
    setTimeout(function () {
      src.srcset = "assets/img/" + name + ".webp"; img.src = "assets/img/" + name + ".jpg";
      img.onload = function () { img.classList.remove("is-out"); };
    }, reduce ? 0 : 280);
  });

  /* ---------- selection bag ---------- */
  var bag = {}, mode = "bag.here", bagBtn = $("#bag"), drawer = $("#drawer");
  try { bag = JSON.parse(sessionStorage.getItem("obBag") || "{}"); } catch (e) {}
  function save() { try { sessionStorage.setItem("obBag", JSON.stringify(bag)); } catch (e) {} }
  function count() { return Object.keys(bag).reduce(function (s, k) { return s + bag[k].q; }, 0); }
  function total() { return Object.keys(bag).reduce(function (s, k) { return s + bag[k].q * bag[k].p; }, 0); }
  function renderBag() {
    var n = count();
    $("#bagN").textContent = n;
    bagBtn.classList.toggle("is-on", n > 0);
    var list = $("#bagList"); list.innerHTML = "";
    if (!n) { var p = document.createElement("p"); p.className = "drawer__empty"; p.textContent = t("bag.empty"); list.appendChild(p); }
    Object.keys(bag).forEach(function (k) {
      var it = bag[k], row = document.createElement("div"); row.className = "line";
      var b = document.createElement("b"); b.textContent = k;
      var pr = document.createElement("span"); pr.className = "line__price mad"; pr.textContent = it.q * it.p + " dhs";
      var qd = document.createElement("div"); qd.className = "line__qty";
      var minus = document.createElement("button"); minus.type = "button"; minus.textContent = "−"; minus.setAttribute("aria-label", "− " + k);
      var qn = document.createElement("span"); qn.textContent = it.q;
      var plus = document.createElement("button"); plus.type = "button"; plus.textContent = "+"; plus.setAttribute("aria-label", "+ " + k);
      minus.addEventListener("click", function () { it.q--; if (it.q <= 0) delete bag[k]; save(); renderBag(); });
      plus.addEventListener("click", function () { it.q++; save(); renderBag(); });
      qd.appendChild(minus); qd.appendChild(qn); qd.appendChild(plus);
      row.appendChild(b); row.appendChild(pr); row.appendChild(qd);
      list.appendChild(row);
    });
    $("#bagTotal").textContent = total() + " dhs";
    $("#bagHint").textContent = t("bag.hint").replace("{tel}", TEL);
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-add]"); if (!b) return;
    var k = b.getAttribute("data-add");
    bag[k] = bag[k] || { q: 0, p: +b.getAttribute("data-price") }; bag[k].q++;
    save(); renderBag();
    b.classList.remove("is-pop"); void b.offsetWidth; b.classList.add("is-pop");
    bagBtn.classList.remove("is-bump"); void bagBtn.offsetWidth; bagBtn.classList.add("is-bump");
    say("+ " + k);
  });
  bagBtn.addEventListener("click", function () { if (drawer.showModal) drawer.showModal(); else drawer.setAttribute("open", ""); });
  drawer.addEventListener("click", function (e) { if (e.target === drawer || e.target.closest("[data-close]")) drawer.close(); });
  $$(".seg button", drawer).forEach(function (b) {
    b.addEventListener("click", function () { mode = b.getAttribute("data-mode"); $$(".seg button", drawer).forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); }); });
  });
  $("#bagCopy").addEventListener("click", function () {
    var lines = Object.keys(bag).map(function (k) { return bag[k].q + " × " + k + " — " + bag[k].q * bag[k].p + " dhs"; });
    copy("ÔBlanc — " + t(mode) + "\n" + lines.join("\n") + "\n" + t("bag.total") + " : " + total() + " dhs", t("bag.copied"));
  });
  document.addEventListener("ob:lang", renderBag);
  renderBag();

  /* ---------- the juice glass ---------- */
  var sig = $("#jus");
  $$(".flavor").forEach(function (b) {
    b.addEventListener("click", function () {
      $$(".flavor").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      sig.style.setProperty("--c1", b.getAttribute("data-c1")); sig.style.setProperty("--c2", b.getAttribute("data-c2"));
      $("#juicePrice").textContent = b.getAttribute("data-price") + " dhs";
      var j = $(".glass__juice"); j.style.height = "40%"; setTimeout(function () { j.style.height = ""; }, reduce ? 0 : 350);
    });
  });

  /* ---------- gallery lightbox ---------- */
  var lb = $("#lightbox"), shots = $$("#bento button"), at = 0;
  function show(k) {
    at = (k + shots.length) % shots.length;
    var s = shots[at], img = $("img", s);
    $("#lbImg").src = s.getAttribute("data-src"); $("#lbImg").alt = img.alt; $("#lbCap").textContent = s.getAttribute("data-cap");
  }
  shots.forEach(function (s, k) { s.addEventListener("click", function () { show(k); if (lb.showModal) lb.showModal(); else lb.setAttribute("open", ""); }); });
  $("#lbPrev").addEventListener("click", function () { show(at - 1); });
  $("#lbNext").addEventListener("click", function () { show(at + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb || e.target.closest("[data-close]")) lb.close(); });
  lb.addEventListener("keydown", function (e) {
    var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (root.dir === "rtl") d = -d;
    if (d) show(at + d);
  });
  lb.addEventListener("close", function () { shots[at].focus(); });

  /* ---------- booking ticket ---------- */
  var bk = { occ: "b.o1", day: 0, time: null, ppl: 2, where: "b.in" };
  var SLOTS = { "b.o1": ["07:00", "08:00", "09:00", "10:00", "11:00"], "b.o2": ["12:30", "13:00", "13:30", "14:00", "14:30"], "b.o3": ["19:30", "20:00", "20:30", "21:00", "22:00"], "b.o4": ["16:00", "17:00", "18:00", "19:00", "20:00"] };
  function dayDate(k) { var d = new Date(); d.setDate(d.getDate() + k); return d; }
  function dayLabel(k, long) {
    if (k === 0) return t("b.today"); if (k === 1) return t("b.tomorrow");
    var loc = lang() === "ar" ? "ar-MA" : lang() === "en" ? "en-GB" : "fr-FR";
    return dayDate(k).toLocaleDateString(loc, long ? { weekday: "long", day: "numeric", month: "long" } : { weekday: "short", day: "numeric" });
  }
  function pills(el, items, current, onPick) {
    el.innerHTML = "";
    items.forEach(function (it) {
      var b = document.createElement("button"); b.type = "button"; b.className = "pill";
      b.textContent = it.label; b.disabled = !!it.disabled;
      b.setAttribute("aria-pressed", String(it.value === current));
      b.addEventListener("click", function () { onPick(it.value); });
      el.appendChild(b);
    });
  }
  function renderBooking() {
    pills($("#bkDays"), [0, 1, 2, 3, 4, 5, 6].map(function (k) { return { value: k, label: dayLabel(k) }; }), bk.day, function (v) { bk.day = v; bk.time = null; renderBooking(); });
    var n = nowCasa();
    pills($("#bkTimes"), SLOTS[bk.occ].map(function (s) {
      var past = bk.day === 0 && (+s.slice(0, 2) < n.h + 1);
      return { value: s, label: s, disabled: past };
    }), bk.time, function (v) { bk.time = v; renderBooking(); });
    $$("[data-group=occ] .pill, [data-group=where] .pill").forEach(function (b) {
      var g = b.parentNode.getAttribute("data-group");
      b.setAttribute("aria-pressed", String(b.getAttribute("data-val") === bk[g]));
    });
    $("#cakeNote").hidden = bk.occ !== "b.o4";
    $("#ppl").textContent = bk.ppl;
    $("#tkOcc").textContent = t(bk.occ);
    $("#tkDay").textContent = dayLabel(bk.day, true);
    $("#tkTime").textContent = bk.time || "—";
    $("#tkPpl").textContent = bk.ppl;
    $("#tkWhere").textContent = t(bk.where);
    $("#tkName").textContent = $("#bkName").value.trim() || "—";
  }
  $$("[data-group=occ] .pill, [data-group=where] .pill").forEach(function (b) {
    b.addEventListener("click", function () {
      var g = b.parentNode.getAttribute("data-group"); bk[g] = b.getAttribute("data-val");
      if (g === "occ") bk.time = null;
      renderBooking();
    });
  });
  $("#pplMinus").addEventListener("click", function () { bk.ppl = Math.max(1, bk.ppl - 1); renderBooking(); });
  $("#pplPlus").addEventListener("click", function () { bk.ppl = Math.min(40, bk.ppl + 1); renderBooking(); });
  $("#bkName").addEventListener("input", renderBooking);
  $("#tkCopy").addEventListener("click", function () {
    var txt = "ÔBlanc — " + t("tk.title") + "\n" + t("tk.occ") + " : " + t(bk.occ) + "\n" + t("tk.day") + " : " + dayLabel(bk.day, true) + "\n" + t("tk.time") + " : " + (bk.time || "—") + "\n" + t("tk.ppl") + " : " + bk.ppl + "\n" + t("tk.where") + " : " + t(bk.where) + "\n" + t("tk.name") + " : " + ($("#bkName").value.trim() || "—");
    copy(txt, t("bag.copied"));
  });
  document.addEventListener("ob:lang", renderBooking);
  renderBooking();

  /* ---------- counters ---------- */
  function countUp(el) {
    var to = +el.getAttribute("data-count"), t0 = performance.now(), dur = 1400;
    (function step(now) {
      var p = Math.min(1, (now - t0) / dur), v = Math.round(to * (1 - Math.pow(1 - p, 3)));
      el.textContent = v >= 1000 ? v.toLocaleString("fr-FR") : v;
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* ---------- reveals: only hide once IntersectionObserver is confirmed ---------- */
  if ("IntersectionObserver" in window && !reduce) {
    root.classList.add("reveal-ready");
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in"); io.unobserve(e.target);
        $$("[data-count]", e.target).forEach(countUp);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    $$("[data-reveal]").forEach(function (el) { io.observe(el); });
  }

  /* ---------- atay / friday photo: slow parallax ---------- */
  var fbg = $(".atay__bg");
  if (fbg && !reduce) {
    var fq = false;
    window.addEventListener("scroll", function () {
      if (fq) return; fq = true;
      requestAnimationFrame(function () {
        fq = false;
        var r = fbg.parentNode.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        fbg.style.transform = "translateY(" + ((r.top + r.height / 2 - innerHeight / 2) * -0.12).toFixed(1) + "px)";
      });
    }, { passive: true });
  }
})();
