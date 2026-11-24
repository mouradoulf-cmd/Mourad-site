/* NM Studio · QR menu "Plus" add-on. Opt-in per restaurant: add  "plus": { ... }  to menus/<slug>/menu.js and load
 * menu-plus.css + menu-plus.js after menu.js. Menus without "plus" are never touched.
 *  - search bar (every language, matches name + original name + description)
 *  - "recommended" 3D photo carousel (cover-flow, scroll-linked, tilt on touch/mouse) — the photos are the show
 *  - "goes well with" suggestions inside the dish sheet (adds to the guest's selection through the engine's own + button)
 *  - optional info card: opening hours (open/closed now), address, Instagram, Google reviews, Maps, phone — ONLY from real data in config
 * plus: { featured:[ids], pairs:{ "<sectionId>":[ids] }, info:{ hours:[sun..sat each [open,close] "HH:MM" or null], utc:7,
 *         address, instagram, google, maps, phone } }   Nothing is invented: no data → that block is simply not shown. */
(function () {
  "use strict";
  var M = window.NM_MENU, root = document.getElementById("menu");
  if (!M || !M.plus || !root) return;
  var P = M.plus;
  document.documentElement.classList.add("pl-on");
  var ol = M.origLang || M.defaultLang || M.langs[0];
  var T = {
    search: { th: "ค้นหาในเมนู…", en: "Search the menu…", zh: "搜索菜单…", ru: "Поиск по меню…", ko: "메뉴 검색…", hi: "मेन्यू में खोजें…", ar: "ابحث في القائمة…", de: "In der Karte suchen…", fr: "Rechercher dans la carte…", it: "Cerca nel menù…" },
    rec: { th: "เมนูแนะนำ", en: "Recommended", zh: "推荐菜品", ru: "Рекомендуем", ko: "추천 메뉴", hi: "सुझाए गए व्यंजन", ar: "نوصي به", de: "Empfehlungen", fr: "Nos suggestions", it: "Consigliati" },
    pause: { th: "หยุดชั่วคราว", en: "Pause", zh: "暂停", ru: "Пауза", ko: "일시정지", hi: "रोकें", ar: "إيقاف مؤقت", de: "Pause", fr: "Pause", it: "Pausa" },
    play: { th: "เล่นต่อ", en: "Play", zh: "播放", ru: "Продолжить", ko: "재생", hi: "चलाएँ", ar: "تشغيل", de: "Abspielen", fr: "Lecture", it: "Riprendi" },
    swipe: { th: "ปัดเพื่อดูเพิ่ม", en: "Swipe to browse", zh: "左右滑动浏览", ru: "Листайте", ko: "옆으로 넘겨보세요", hi: "स्वाइप करें", ar: "اسحب للتصفح", de: "Wischen zum Blättern", fr: "Faites glisser", it: "Scorri" },
    pair: { th: "ทานคู่กับ", en: "Goes well with", zh: "搭配推荐", ru: "Хорошо сочетается", ko: "함께 드셔보세요", hi: "इसके साथ", ar: "يتناسب مع", de: "Passt dazu", fr: "À associer", it: "Da abbinare" },
    none: { th: "ไม่พบรายการที่ค้นหา", en: "Nothing found", zh: "没有找到", ru: "Ничего не найдено", ko: "결과 없음", hi: "कुछ नहीं मिला", ar: "لا توجد نتائج", de: "Nichts gefunden", fr: "Aucun résultat", it: "Nessun risultato" },
    open: { th: "เปิดอยู่", en: "Open now", zh: "营业中", ru: "Открыто", ko: "영업 중", hi: "खुला है", ar: "مفتوح الآن", de: "Jetzt geöffnet", fr: "Ouvert", it: "Aperto" },
    closed: { th: "ปิดอยู่", en: "Closed now", zh: "已打烊", ru: "Закрыто", ko: "영업 종료", hi: "बंद है", ar: "مغلق الآن", de: "Geschlossen", fr: "Fermé", it: "Chiuso" },
    until: { th: "ถึง", en: "until", zh: "至", ru: "до", ko: "까지", hi: "तक", ar: "حتى", de: "bis", fr: "jusqu’à", it: "fino alle" },
    ig: { th: "Instagram", en: "Instagram", zh: "Instagram", ru: "Instagram", ko: "Instagram", hi: "Instagram", ar: "Instagram", de: "Instagram", fr: "Instagram", it: "Instagram" },
    rev: { th: "รีวิว Google", en: "Google reviews", zh: "Google 评价", ru: "Отзывы Google", ko: "Google 리뷰", hi: "Google समीक्षाएँ", ar: "تقييمات Google", de: "Google-Bewertungen", fr: "Avis Google", it: "Recensioni Google" },
    map: { th: "แผนที่", en: "Map", zh: "地图", ru: "Карта", ko: "지도", hi: "नक्शा", ar: "الخريطة", de: "Karte", fr: "Plan", it: "Mappa" },
    call: { th: "โทร", en: "Call", zh: "致电", ru: "Позвонить", ko: "전화", hi: "कॉल", ar: "اتصال", de: "Anrufen", fr: "Appeler", it: "Chiama" }
  };
  function L() { var l = document.documentElement.lang || "en"; return l === "zh-Hans" ? "zh" : l; }
  function tx(k) { var o = T[k], l = L(); return o[l] || o.en; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var byId = {}, all = [];
  M.sections.forEach(function (s, si) { s.items.forEach(function (d) { d._s = si; byId[d.id] = d; all.push(d); }); });
  function title(d) { var l = L(); return M.localTitles && l !== ol && d.sn && d.sn[l] ? d.sn[l] : d.n; }
  function money(p) { return "⁦" + (M.currency === "฿" ? p + " ฿" : p + " " + M.currency) + "⁩"; }
  function pic(d, w) { return M.photoHD ? d.img + "-c-" + (w || 800) + ".webp" : (P.crops && P.crops.indexOf(d.id) > -1 ? d.img + "-sc.webp" : d.img + ".webp"); }
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ICO = {
    search: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    plus: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg>'
  };

  /* ───────────── info card (real data only) ───────────── */
  function openNow(info) {
    if (!info.hours) return "";
    var now = new Date(Date.now() + ((info.utc == null ? 7 : info.utc) * 60 + new Date().getTimezoneOffset()) * 60000);
    var h = info.hours[now.getDay()];
    if (!h) return '<span class="pl-st off"><i></i>' + esc(tx("closed")) + "</span>";
    var m = now.getHours() * 60 + now.getMinutes(), a = h[0].split(":"), b = h[1].split(":");
    var s = +a[0] * 60 + +a[1], e = +b[0] * 60 + +b[1], on = e > s ? (m >= s && m < e) : (m >= s || m < e);
    return on ? '<span class="pl-st on"><i></i>' + esc(tx("open")) + " · " + esc(tx("until")) + " " + h[1] + "</span>" : '<span class="pl-st off"><i></i>' + esc(tx("closed")) + "</span>";
  }
  function infoCard() {
    var I = P.info; if (!I) return "";
    var b = [];
    if (I.instagram) b.push('<a href="' + esc(I.instagram) + '" target="_blank" rel="noopener">' + esc(tx("ig")) + "</a>");
    if (I.google) b.push('<a href="' + esc(I.google) + '" target="_blank" rel="noopener">' + esc(tx("rev")) + "</a>");
    if (I.maps) b.push('<a href="' + esc(I.maps) + '" target="_blank" rel="noopener">' + esc(tx("map")) + "</a>");
    if (I.phone) b.push('<a href="tel:' + esc(String(I.phone).replace(/[^+\d]/g, "")) + '" target="_blank" rel="noopener">' + esc(tx("call")) + "</a>");
    var st = openNow(I);
    if (!st && !I.address && !b.length) return "";
    return '<div class="pl-info">' + (st ? '<div class="pl-info__r">' + st + "</div>" : "") + (I.address ? '<p class="pl-info__a">' + esc(I.address) + "</p>" : "") + (b.length ? '<div class="pl-info__b">' + b.join("") + "</div>" : "") + "</div>";
  }

  /* ───────────── showcase (auto-playing 3D photo ring) + search ───────────── */
  function featured() {
    var ids = P.featured && P.featured.length ? P.featured : M.sections.map(function (s) { var x = s.items.filter(function (d) { return d.img; })[0]; return x && x.id; }).filter(Boolean);
    return ids.map(function (i) { return byId[i]; }).filter(function (d) { return d && d.img && !d.soldout; }).slice(0, 9);
  }
  function trObj(o) { var l = L(); return (o && (o[l] || o.en || o[ol])) || ""; }
  function desc(d) { var l = L(), x = d.d && (d.d[l] || (l === ol ? "" : d.d.en)); return x && x !== d.n ? x : ""; }
  function srcset(d) { return M.photoHD ? d.img + "-c-800.webp 800w, " + d.img + "-c-1200.webp 1200w" : pic(d); }
  var V = { th: "ดูจาน", en: "See the dish", zh: "查看菜品", ru: "Посмотреть", ko: "메뉴 보기", hi: "व्यंजन देखें", ar: "عرض الطبق", de: "Gericht ansehen", fr: "Voir le plat", it: "Vedi il piatto" };
  var HOLD = 4200;   // ms each dish stays in front
  function wrap(v, n) { v = ((v % n) + n) % n; return v > n / 2 ? v - n : v; }
  function ease(t) { return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); }
  function buildTop(main) {
    if (main.querySelector(".pl-top")) return;
    var F = featured(), N = F.length, show = N >= 3;
    var h = '<section class="pl-top" aria-label="' + esc(tx("rec")) + '">' + infoCard();
    if (show) {
      h += '<div class="pl-show" tabindex="0" role="region" aria-roledescription="carousel" aria-label="' + esc(tx("rec")) + '"><div class="pl-amb" aria-hidden="true"><img alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="><img alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></div>' +
        '<button type="button" class="pl-pause" aria-label="' + esc(tx("pause")) + '" aria-pressed="false"><svg class="i-p" viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg><svg class="i-g" viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></button>' +
        '<div class="pl-stage"><div class="pl-ring">' + F.map(function (d, i) {
          return '<button type="button" class="pl-card" data-pl="' + esc(d.id) + '" aria-label="' + (i + 1) + " / " + N + " · " + esc(title(d)) + '"><span class="pl-bz"><span class="pl-ph"><img src="' + pic(d, 800) + '"' + (M.photoHD ? ' srcset="' + srcset(d) + '" sizes="(min-width:760px) 300px, 66vw"' : "") + (i > 2 ? ' loading="lazy"' : "") + ' alt="" decoding="async" draggable="false"><i class="pl-sh"></i></span></span></button>';
        }).join("") + '</div><div class="pl-floor" aria-hidden="true"></div></div>' +
        '<div class="pl-info2"><h3 class="pl-name"></h3><p class="pl-meta"></p><p class="pl-desc"></p><div class="pl-row"><span class="pl-price"></span><span class="pl-hot"></span><button type="button" class="pl-view">' + esc(V[L()] || V.en) + '</button></div></div>' +
        '<div class="pl-seg" role="group" aria-label="' + esc(tx("rec")) + '">' + F.map(function (d, k) { return '<button type="button" class="pl-sg" data-k="' + k + '" aria-label="' + (k + 1) + " / " + N + '"><i><u></u></i></button>'; }).join("") + '</div><p class="pl-sr" role="status" aria-live="polite"></p></div>';
    }
    h += '<label class="pl-search">' + ICO.search + '<input type="search" inputmode="search" enterkeyhint="search" autocomplete="off" placeholder="' + esc(tx("search")) + '" aria-label="' + esc(tx("search")) + '"></label>' +
      '<p class="pl-none" hidden>' + esc(tx("none")) + "</p></section>";
    main.insertAdjacentHTML("afterbegin", h);
    var top = main.querySelector(".pl-top"), inp = top.querySelector("input"), sh = top.querySelector(".pl-show");
    inp.addEventListener("input", function () {
      var q = inp.value.trim().toLowerCase(), any = false;
      main.querySelectorAll(".dish").forEach(function (li) { var ok = !q || li.textContent.toLowerCase().indexOf(q) > -1; li.classList.toggle("pl-hide", !ok); if (ok) any = true; });
      main.querySelectorAll(".ch").forEach(function (c) { c.classList.toggle("pl-hide", !!q && !c.querySelector(".dish:not(.pl-hide)")); });
      if (sh) sh.hidden = !!q;
      top.querySelector(".pl-none").hidden = any || !q;
      document.body.classList.toggle("pl-searching", !!q);
    });
    if (!show) return;

    var cards = [].slice.call(top.querySelectorAll(".pl-card")), segs = [].slice.call(top.querySelectorAll(".pl-sg")),
      amb = [].slice.call(top.querySelectorAll(".pl-amb img")), ambI = 0, stage = top.querySelector(".pl-stage"),
      cat = top.querySelector(".pl-meta"), nameEl = top.querySelector(".pl-name"), dEl = top.querySelector(".pl-desc"),
      pr = top.querySelector(".pl-price"), hotEl = top.querySelector(".pl-hot"), info = top.querySelector(".pl-info2"), sr = top.querySelector(".pl-sr"), userMoved = false;
    var pos = 0, spread = 0, idx = -1, W = 270, tw = 0, dragging = false, visible = false, inView = false, moved = 0, started = false, userPaused = false;
    function measure() { W = Math.min(innerWidth * 0.66, 300); stage.style.setProperty("--w", W + "px"); }
    function render() {
      var ref = 1;
      cards.forEach(function (c, i) {
        var o = wrap(i - pos, N), a = Math.abs(o), sg = o < 0 ? -1 : 1, ac = Math.min(a, 2.2);
        var x = sg * (Math.min(ac, 1) * 0.66 + Math.max(0, ac - 1) * 0.34) * W * spread;
        var z = -ac * 150 * spread, ry = -Math.max(-2, Math.min(2, o)) * 40 * spread, sc = (1 - Math.min(a, 2) * 0.07) * (0.86 + 0.14 * spread);
        c.style.transform = "translate3d(" + x.toFixed(1) + "px,0," + z.toFixed(1) + "px) rotateY(" + ry.toFixed(1) + "deg) scale(" + sc.toFixed(3) + ")";
        c.style.opacity = a > 2.4 ? "0" : String(Math.max(0, (1 - Math.min(a, 2) * 0.3) * spread).toFixed(2));
        c.style.zIndex = String(100 - Math.round(a * 10));
        c.style.pointerEvents = a < 0.5 ? "auto" : "none";
        var bz = c.firstChild, ph = bz.firstChild; bz.style.filter = a > 0.15 ? "blur(" + (Math.min(a, 2) * 1.2).toFixed(1) + "px) brightness(" + (1 - Math.min(a, 2) * 0.18).toFixed(2) + ")" : "none";
        var im = ph.firstChild; im.style.transform = "translate3d(" + (-o * 7).toFixed(1) + "%,0,0) scale(1.18)";
        ph.lastChild.style.backgroundPosition = (-o * 90 + 50).toFixed(0) + "% 0";
      });
      var n = ((Math.round(pos) % N) + N) % N; if (n !== idx) setIdx(n);
    }
    function setIdx(n) {
      idx = n; var d = F[n], s = M.sections[d._s];
      cat.textContent = trObj(s.t); pr.innerHTML = money(d.p);
      var words = String(title(d)).split(" ");
      nameEl.innerHTML = words.map(function (w, k) { return '<span style="--k:' + k + '">' + esc(w) + "</span>"; }).join(" ");
      dEl.textContent = desc(d); hotEl.textContent = d.hot ? new Array(d.hot + 1).join("🌶️") : "";
      info.classList.remove("swap"); void info.offsetWidth; info.classList.add("swap");
      info.setAttribute("data-id", d.id);
      segs.forEach(function (sg, k) { sg.firstChild.className = k < n ? "done" : k === n ? "cur" : ""; if (k === n) sg.setAttribute("aria-current", "true"); else sg.removeAttribute("aria-current"); });

      var im = amb[ambI = 1 - ambI]; im.src = pic(d, 800); im.className = "on"; amb[1 - ambI].className = "";
    }
    function tween(target, ms) {
      cancelAnimationFrame(tw); var from = pos, t0 = null;
      function step(t) { if (t0 == null) t0 = t; var k = Math.min(1, (t - t0) / ms); pos = from + (target - from) * ease(k); render(); if (k < 1) tw = requestAnimationFrame(step); else if (userMoved) { var d = F[idx]; sr.textContent = (idx + 1) + " / " + N + " · " + title(d) + ", " + String(money(d.p)).replace(/[\u2066\u2069]/g, ""); userMoved = false; } }
      tw = requestAnimationFrame(step);
    }
    function next() { tween(Math.round(pos) + 1, reduce ? 1 : 1150); }
    // auto-advance: the progress segment of the front dish fills, and when it ends the ring turns
    top.addEventListener("animationend", function (e) { if (e.target.tagName === "U" && !dragging) next(); });
    function run() { sh.classList.toggle("paused", !(inView && !document.hidden && !dragging) || reduce || userPaused); }
    document.addEventListener("visibilitychange", run);
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { inView = en[0].isIntersecting; if (inView && !started) intro(); run(); }, { threshold: 0.35 }).observe(sh); else { inView = true; intro(); }
    function intro() { started = true; if (reduce) { spread = 1; render(); return; } var t0 = null; (function step(t) { if (t0 == null) t0 = t; var k = Math.min(1, (t - t0) / 1300); spread = ease(k); render(); if (k < 1) requestAnimationFrame(step); })(performance.now()); }
    // drag / swipe still works, and a tap opens the dish
    var sx = 0, sp = 0, lx = 0, lt = 0, vel = 0;
    stage.addEventListener("pointerdown", function (e) { dragging = true; moved = 0; sx = lx = e.clientX; sp = pos; lt = performance.now(); vel = 0; cancelAnimationFrame(tw); run(); try { stage.setPointerCapture(e.pointerId); } catch (x) {} });
    stage.addEventListener("pointermove", function (e) {
      if (dragging) { var dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx)); var now = performance.now(); vel = (e.clientX - lx) / Math.max(1, now - lt); lx = e.clientX; lt = now; pos = sp - dx / (W * 0.62); render(); }
      else if (!reduce && e.pointerType === "mouse") { var c = cards[idx]; if (c) { var r = c.getBoundingClientRect(); c.firstChild.style.setProperty("--tx", (-((e.clientY - r.top) / r.height - 0.5) * 8).toFixed(1) + "deg"); c.firstChild.style.setProperty("--ty", (((e.clientX - r.left) / r.width - 0.5) * 10).toFixed(1) + "deg"); } }
    });
    function end() { if (!dragging) return; dragging = false; userMoved = moved > 8; var tgt = Math.round(pos - vel * 2.2); tween(tgt, 700); run(); }
    stage.addEventListener("pointerup", end); stage.addEventListener("pointercancel", end);
    stage.addEventListener("pointerleave", function () { cards.forEach(function (c) { c.firstChild.style.setProperty("--tx", "0deg"); c.firstChild.style.setProperty("--ty", "0deg"); }); });
    function openDish(id) { var btn = root.querySelector('.dish__o[data-dish="' + id + '"]'); if (btn) btn.click(); }
    stage.addEventListener("click", function (e) { var c = e.target.closest(".pl-card"); if (c && moved < 8 && cards.indexOf(c) === idx) openDish(c.getAttribute("data-pl")); else if (c && moved < 8) tween(Math.round(pos) + wrap(cards.indexOf(c) - Math.round(pos), N), 800); });
    var pb = top.querySelector(".pl-pause"); pb.addEventListener("click", function () { userPaused = !userPaused; pb.setAttribute("aria-pressed", userPaused); pb.setAttribute("aria-label", userPaused ? tx("play") : tx("pause")); sh.classList.toggle("is-paused", userPaused); run(); });
    top.querySelector(".pl-view").addEventListener("click", function () { openDish(info.getAttribute("data-id")); });
    top.querySelector(".pl-seg").addEventListener("click", function (e) { var b = e.target.closest(".pl-sg"); if (!b) return; userMoved = true; tween(Math.round(pos) + wrap(+b.getAttribute("data-k") - Math.round(pos), N), 1000); });
    sh.addEventListener("keydown", function (e) { userMoved = true; if (e.key === "ArrowRight") tween(Math.round(pos) + 1, 700); if (e.key === "ArrowLeft") tween(Math.round(pos) - 1, 700); });
    measure(); addEventListener("resize", function () { measure(); render(); });
    render(); run();
  }

  /* ───────────── "goes well with" inside the dish sheet ───────────── */
  function pairIds(d) { var p = P.pairs || {}; var s = M.sections[d._s]; return (p[d.id] || p[s.id] || p["*"] || []).filter(function (i) { return i !== d.id && byId[i]; }).slice(0, 3); }
  function buildPairs() {
    var sb = document.getElementById("sb"); if (!sb || sb.querySelector(".pl-pair")) return;
    var add = sb.querySelector(".sd__f [data-add]"); if (!add) return;
    var d = byId[add.getAttribute("data-add")]; if (!d) return;
    var ids = pairIds(d); if (!ids.length) return;
    var html = '<div class="pl-pair"><p class="pl-pair__h">' + esc(tx("pair")) + '</p><div class="pl-pair__r">' + ids.map(function (i) {
      var x = byId[i];
      return '<div class="pl-pc">' + (x.img ? '<img src="' + pic(x, 800) + '" alt="" loading="lazy" decoding="async">' : "") + '<span class="pl-pc__n">' + esc(title(x)) + '</span><span class="pl-pc__p">' + money(x.p) + '</span><button type="button" data-plp="' + esc(x.id) + '" aria-label="+">' + ICO.plus + "</button></div>";
    }).join("") + "</div></div>";
    sb.querySelector(".sd__f").insertAdjacentHTML("beforebegin", html);
    var ph = sb.querySelector(".sd__ph");
    if (ph && !reduce) {
      ph.addEventListener("pointermove", function (e) { var r = ph.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; ph.style.setProperty("--tx", (-y * 7).toFixed(1) + "deg"); ph.style.setProperty("--ty", (x * 9).toFixed(1) + "deg"); });
      ph.addEventListener("pointerleave", function () { ph.style.setProperty("--tx", "0deg"); ph.style.setProperty("--ty", "0deg"); });
    }
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-plp]"); if (!b) return;
    var id = b.getAttribute("data-plp"), row = root.querySelector('.dish [data-add="' + id + '"]');
    if (row) row.click();
    b.classList.add("done"); b.innerHTML = ICO.check;
  });

  /* ───────────── (re)build after every render of the engine ───────────── */
  var sbObs = null;
  function enhance() {
    var main = root.querySelector("main"); if (!main) return;
    buildTop(main);
    var sb = document.getElementById("sb");
    if (sb && !sb.__pl) { sb.__pl = 1; if (sbObs) sbObs.disconnect(); sbObs = new MutationObserver(function () { buildPairs(); }); sbObs.observe(sb, { childList: true }); }
  }
  new MutationObserver(function () { enhance(); }).observe(root, { childList: true });
  enhance();
})();
