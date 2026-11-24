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
  function pic(d, w) { return M.photoHD ? d.img + "-c-" + (w || 800) + ".webp" : d.img + ".webp"; }
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

  /* ───────────── carousel + search ───────────── */
  function featured() {
    var ids = P.featured && P.featured.length ? P.featured : M.sections.map(function (s) { var x = s.items.filter(function (d) { return d.img; })[0]; return x && x.id; }).filter(Boolean);
    return ids.map(function (i) { return byId[i]; }).filter(function (d) { return d && d.img; }).slice(0, 9);
  }
  var tickBound = null;
  function buildTop(main) {
    if (main.querySelector(".pl-top")) return;
    var F = featured();
    var h = '<section class="pl-top" aria-label="' + esc(tx("rec")) + '">' + infoCard() +
      '<label class="pl-search">' + ICO.search + '<input type="search" inputmode="search" enterkeyhint="search" autocomplete="off" placeholder="' + esc(tx("search")) + '" aria-label="' + esc(tx("search")) + '"></label>';
    if (F.length) {
      h += '<div class="pl-rail"><div class="pl-rail__h"><h2>' + esc(tx("rec")) + '</h2><span>' + esc(tx("swipe")) + '</span></div><div class="pl-stage"><div class="pl-track" tabindex="0">' +
        F.map(function (d, i) {
          return '<button type="button" class="pl-card" data-pl="' + esc(d.id) + '"><span class="pl-ph"><img src="' + pic(d, 800) + '" alt="" ' + (i < 3 ? "" : 'loading="lazy" ') + 'decoding="async" width="260" height="325"><i class="pl-sh"></i></span>' +
            '<span class="pl-n">' + esc(title(d)) + '</span><span class="pl-p">' + money(d.p) + "</span></button>";
        }).join("") + "</div></div></div>";
    }
    h += '<p class="pl-none" hidden>' + esc(tx("none")) + "</p></section>";
    main.insertAdjacentHTML("afterbegin", h);
    var top = main.querySelector(".pl-top"), track = top.querySelector(".pl-track"), inp = top.querySelector("input");
    // search
    inp.addEventListener("input", function () {
      var q = inp.value.trim().toLowerCase(), any = false;
      main.querySelectorAll(".dish").forEach(function (li) {
        var ok = !q || li.textContent.toLowerCase().indexOf(q) > -1; li.classList.toggle("pl-hide", !ok); if (ok) any = true;
      });
      main.querySelectorAll(".ch").forEach(function (c) { c.classList.toggle("pl-hide", !!q && !c.querySelector(".dish:not(.pl-hide)")); });
      var r = top.querySelector(".pl-rail"); if (r) r.hidden = !!q;
      top.querySelector(".pl-none").hidden = any || !q;
      document.body.classList.toggle("pl-searching", !!q);
    });
    if (!track) return;
    // open the dish through the engine's own button
    track.addEventListener("click", function (e) {
      var c = e.target.closest(".pl-card"); if (!c) return;
      var btn = root.querySelector('.dish__o[data-dish="' + c.getAttribute("data-pl") + '"]'); if (btn) btn.click();
    });
    // 3D cover-flow: every card is positioned from its distance to the centre of the track
    var cards = [].slice.call(track.querySelectorAll(".pl-card")), raf = 0, tx0 = 0, ty0 = 0;
    function tick() {
      raf = 0;
      var tr = track.getBoundingClientRect(), mid = tr.left + tr.width / 2;
      cards.forEach(function (c) {
        var cr = c.getBoundingClientRect(), r = (cr.left + cr.width / 2 - mid) / cr.width;
        r = Math.max(-2.2, Math.min(2.2, r)); var a = Math.abs(r);
        if (reduce) { c.style.opacity = String(1 - Math.min(a, 1) * 0.35); return; }
        c.style.transform = "translate3d(" + (-r * 26).toFixed(1) + "px,0," + (-a * 130).toFixed(1) + "px) rotateY(" + (-r * 34).toFixed(1) + "deg) scale(" + (1 - a * 0.06).toFixed(3) + ")";
        c.style.opacity = String(Math.max(0.35, 1 - a * 0.28).toFixed(2));
        c.style.zIndex = String(10 - Math.round(a * 3));
        c.style.setProperty("--sh", (r * -60).toFixed(0) + "%");
        c.classList.toggle("is-mid", a < 0.35);
      });
    }
    function sched() { if (!raf) raf = requestAnimationFrame(tick); }
    track.addEventListener("scroll", sched, { passive: true }); addEventListener("resize", sched);
    // gentle tilt on the centred photo (finger or mouse)
    track.addEventListener("pointermove", function (e) {
      if (reduce) return; var c = cards.filter(function (x) { return x.classList.contains("is-mid"); })[0]; if (!c) return;
      var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      c.style.setProperty("--tx", (-y * 9).toFixed(1) + "deg"); c.style.setProperty("--ty", (x * 12).toFixed(1) + "deg");
    });
    track.addEventListener("pointerleave", function () { cards.forEach(function (c) { c.style.setProperty("--tx", "0deg"); c.style.setProperty("--ty", "0deg"); }); });
    // start centred on the second card so the 3D shows at once, then a small nudge to hint at swiping
    requestAnimationFrame(function () {
      var c = cards[Math.min(1, cards.length - 1)];
      if (c) { var tr = track.getBoundingClientRect(), cr = c.getBoundingClientRect(); track.scrollLeft += (cr.left + cr.width / 2) - (tr.left + tr.width / 2); }
      tick();
      if (!reduce && cards.length > 2) setTimeout(function () { try { track.scrollBy({ left: 70, behavior: "smooth" }); setTimeout(function () { track.scrollBy({ left: -70, behavior: "smooth" }); }, 700); } catch (e) {} }, 1400);
    });
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
