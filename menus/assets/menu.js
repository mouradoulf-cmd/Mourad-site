/* NM Studio · QR menu renderer, shared by every restaurant in /menus/<slug>/: a paper book, one page at a time.
 * Content: window.NM_MENU (menus/<slug>/menu.js). Pages are cut to fit the screen, so a long section simply
 * continues on the next page. Subscription: menus/abonnements.json, fetched fresh on every open so "paid" /
 * "paused" takes effect right away; if it can't be read (offline) the menu stays open — a guest at the table is
 * never punished for a network hiccup. Preview the paused screen with ?apercu=pause. */
(function () {
  "use strict";
  var M = window.NM_MENU;
  if (!M) return;
  var root = document.getElementById("menu");
  var LN = { th: "ไทย", en: "English", zh: "中文", ru: "Русский", fr: "Français", it: "Italiano", de: "Deutsch", ja: "日本語", ko: "한국어" };
  var UI = {
    menu: { th: "เมนู", en: "Menu", zh: "菜单", ru: "Меню", fr: "Menu", it: "Menù" },
    swipe: { th: "ปัดเพื่อพลิกหน้า ›", en: "Swipe to turn the page ›", zh: "滑动翻页 ›", ru: "Листайте страницы ›", fr: "Glissez pour tourner la page ›", it: "Scorri per girare pagina ›" },
    cont: { th: "ต่อ", en: "continued", zh: "续", ru: "продолжение", fr: "suite", it: "segue" },
    info: { th: "ข้อมูลเพิ่มเติม", en: "Good to know", zh: "须知", ru: "Полезно знать", fr: "Bon à savoir", it: "Da sapere" },
    al: { th: "สารก่อภูมิแพ้", en: "Allergens", zh: "过敏原", ru: "Аллергены", fr: "Allergènes", it: "Allergeni" },
    ask: { th: "แพ้อาหาร? แจ้งพนักงานของเราได้เลย", en: "Food allergy? Just tell our staff.", zh: "如有食物过敏，请告知我们的服务员。", ru: "Есть аллергия? Скажите нашему официанту.", fr: "Une allergie ? Dites-le simplement à notre équipe.", it: "Allergie? Chiedete pure al nostro staff." },
    prev: { th: "หน้าก่อน", en: "Previous page", zh: "上一页", ru: "Назад", fr: "Page précédente", it: "Pagina precedente" },
    next: { th: "หน้าถัดไป", en: "Next page", zh: "下一页", ru: "Вперёд", fr: "Page suivante", it: "Pagina successiva" },
    paused: { th: "เมนูออนไลน์กำลังปรับปรุง", en: "Our online menu is being updated", zh: "我们的电子菜单正在更新", ru: "Наше онлайн-меню обновляется", fr: "Notre menu en ligne est en cours de mise à jour", it: "Il nostro menù online è in aggiornamento" },
    paused2: { th: "ขออภัยในความไม่สะดวก กรุณาขอเมนูจากพนักงานได้เลยค่ะ", en: "Sorry for the inconvenience — please ask our staff for the menu.", zh: "抱歉给您带来不便，请向服务员索取菜单。", ru: "Извините за неудобство — попросите меню у официанта.", fr: "Désolés pour le désagrément : demandez la carte à notre équipe.", it: "Ci scusiamo: chiedete pure il menù al nostro staff." }
  };
  var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
                set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  var langs = M.langs, ol = M.origLang || "it";
  var lang = (function () {
    var q = new URLSearchParams(location.search).get("lang");
    if (q && langs.indexOf(q) > -1) return q;
    var s = store.get("nm-menu-lang");
    if (s && langs.indexOf(s) > -1) return s;
    var navs = navigator.languages || [navigator.language || ""];
    for (var i = 0; i < navs.length; i++) { var l = String(navs[i]).slice(0, 2).toLowerCase(); if (langs.indexOf(l) > -1) return l; }
    return M.defaultLang || langs[0];
  })();
  function t(o) { return o == null ? "" : typeof o === "string" ? o : (o[lang] || o.en || o[ol] || ""); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function price(p) { return p + " " + M.currency; }
  if (M.theme) Object.keys(M.theme).forEach(function (k) { document.documentElement.style.setProperty("--" + k, M.theme[k]); });

  var svg = { logo: "", motif: "" };
  function get(u) { return u ? fetch(u).then(function (r) { return r.ok ? r.text() : ""; }).catch(function () { return ""; }) : Promise.resolve(""); }
  var ICO = {
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18"/></svg>',
    l: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 5l-7 7 7 7"/></svg>',
    r: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg>'
  };

  var cur = 0, pages = [], book, turnedOnce = !!store.get("nm-menu-swiped");

  function shell() {
    document.documentElement.lang = lang === "zh" ? "zh-Hans" : lang;
    document.title = M.name + " · " + t(UI.menu);
    root.innerHTML =
      '<div class="bar"><button class="lb" type="button" aria-haspopup="true" aria-expanded="false">' + ICO.globe + "<span>" + (LN[lang] || lang) + "</span></button>" +
      '<div class="lp" role="menu">' + langs.map(function (l) { return '<button type="button" role="menuitemradio" data-lang="' + l + '" lang="' + l + '" aria-pressed="' + (l === lang) + '">' + (LN[l] || l) + "</button>"; }).join("") + "</div></div>" +
      '<div class="stage"><div class="book" aria-live="polite"></div></div>' +
      '<div class="nav"><button type="button" class="pv" aria-label="' + esc(t(UI.prev)) + '">' + ICO.l + '</button><span class="count"></span><button type="button" class="nx" aria-label="' + esc(t(UI.next)) + '">' + ICO.r + "</button></div>" +
      (turnedOnce ? "" : '<div class="hint">' + esc(t(UI.swipe)) + "</div>");
    book = root.querySelector(".book");
  }

  function size() {
    var st = root.querySelector(".stage"), W = st.clientWidth - 28, H = st.clientHeight - 8;
    var w = Math.min(W, 520), h = Math.min(H, Math.round(w * 1.7));
    if (h / w < 1.25) w = Math.round(h / 1.4);
    book.style.width = w + "px"; book.style.height = h + "px";
  }

  function sheet(cls) {
    var pg = document.createElement("article");
    pg.className = "pg " + (cls || "");
    var m = svg.motif ? '<div class="motif" aria-hidden="true">' + svg.motif + "</div>" : "";
    pg.innerHTML = '<div class="face front">' + m + '<div class="in"></div></div><div class="face back" aria-hidden="true">' + m + "</div>";
    book.appendChild(pg);
    pages.push(pg);
    return pg.querySelector(".in");
  }
  function over(el) { return el.scrollHeight > el.clientHeight + 1; }
  function dishHtml(d) {
    var desc = d.d && (d.d[lang] || (lang === ol ? "" : d.d.en)) || "";
    return '<div class="row"><span class="dn">' + esc(d.n) + '</span><span class="dots" aria-hidden="true"></span><span class="pr">' + price(d.p) + "</span></div>" +
      (desc && desc !== d.n ? '<p class="dd">' + esc(desc) + "</p>" : "") +
      (d.a ? '<p class="al">(' + d.a.join(", ") + ")</p>" : "");
  }

  function build(keepSection) {
    book.innerHTML = ""; pages = [];
    size();
    // cover
    var c = sheet("cover");
    c.innerHTML = (svg.logo ? '<div class="clogo" role="img" aria-label="' + esc(M.name) + '">' + svg.logo + "</div>" : "<h1>" + esc(M.name) + "</h1>") +
      '<div class="rule"></div><h1 style="font-size:2.1rem">' + esc(t(UI.menu)) + '</h1><p class="tg">' + esc(t(M.tagline)) + "</p>";
    c.parentNode.parentNode.dataset.sec = "cover";
    var logoSmall = svg.logo ? '<div class="slogo" aria-hidden="true">' + svg.logo + "</div>" : "";
    M.sections.forEach(function (s) {
      var sub = lang !== ol && s.t[ol] ? "<p>" + esc(s.t[ol]) + "</p>" : "";
      function newPage(cont) {
        var p = sheet();
        p.parentNode.parentNode.dataset.sec = s.id;
        p.innerHTML = (cont ? "" : logoSmall) + '<header class="head' + (cont ? " cont" : "") + '"><h2>' + esc(t(s.t)) + (cont ? " · " + esc(t(UI.cont)) : "") + "</h2>" + (cont ? "" : sub) + '</header><ul class="list"></ul>';
        return p;
      }
      var p = newPage(false), ul = p.querySelector(".list");
      var feat = s.items.filter(function (d) { return d.img; }).slice(0, 2);
      if (feat.length) {
        var ph = document.createElement("div"); ph.className = "ph" + (feat.length === 1 ? " one" : ""); ph.style.setProperty("--n", feat.length);
        ph.innerHTML = feat.map(function (d) { return '<picture><source srcset="' + d.img + '-640.webp" type="image/webp"><img src="' + d.img + '-640.jpg" alt="' + esc(d.n) + '" width="640" height="480" decoding="async"></picture>'; }).join("");
        p.insertBefore(ph, ul);
        if (over(p)) p.removeChild(ph);
      }
      s.items.forEach(function (d) {
        var li = document.createElement("li"); li.className = "dish"; li.innerHTML = dishHtml(d);
        ul.appendChild(li);
        if (over(p) && ul.children.length > 1) { ul.removeChild(li); p = newPage(true); ul = p.querySelector(".list"); ul.appendChild(li); }
      });
      if (s.note && M.notes && M.notes[s.note]) {
        var n = document.createElement("p"); n.className = "note"; n.textContent = t(M.notes[s.note]);
        p.appendChild(n);
        if (over(p)) { p.removeChild(n); p = newPage(true); p.appendChild(n); }
      }
    });
    // last page: cover charge, allergens, "tell our staff"
    var f = sheet("info");
    f.parentNode.parentNode.dataset.sec = "info";
    var a = M.allergens && (M.allergens[lang] || M.allergens.en);
    f.innerHTML = logoSmall + '<header class="head"><h2>' + esc(t(UI.info)) + "</h2></header>" +
      (M.extras || []).map(function (x) { return '<div class="xrow"><span>' + esc(t(x.t)) + "</span><span>" + price(x.p) + "</span></div>"; }).join("") +
      (a ? "<h3>" + esc(t(UI.al)) + '</h3><ol class="alist">' + a.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ol>" : "") +
      '<p class="ask">' + esc(t(UI.ask)) + '</p><p class="by">Menu · NM Studio</p>';
    // page numbers + stacking order
    pages.forEach(function (pg, i) {
      if (i) { var nb = document.createElement("span"); nb.className = "num"; nb.textContent = i + " / " + (pages.length - 1); pg.querySelector(".front").appendChild(nb); }
    });
    var target = 0;
    if (keepSection) pages.some(function (pg, i) { if (pg.dataset.sec === keepSection) { target = i; return true; } });
    go(target, true);
  }

  function go(i, instant) {
    cur = Math.max(0, Math.min(pages.length - 1, i));
    pages.forEach(function (pg, k) {
      if (instant) pg.style.transition = "none";
      pg.classList.toggle("turned", k < cur);
      pg.style.zIndex = k < cur ? k : pages.length * 2 - k;
      pg.setAttribute("aria-hidden", k !== cur);
      pg.style.visibility = k < cur - 1 || k > cur + 1 ? "hidden" : "";
      if (instant) { void pg.offsetWidth; pg.style.transition = ""; }
    });
    // keep the page that is turning away visible above the new one until it has flipped
    root.querySelector(".count").textContent = (cur + 1) + " / " + pages.length;
    root.querySelector(".pv").disabled = cur === 0;
    root.querySelector(".nx").disabled = cur === pages.length - 1;
  }
  function turn(dir) {
    var n = cur + dir;
    if (n < 0 || n >= pages.length) return;
    if (!turnedOnce) { turnedOnce = true; store.set("nm-menu-swiped", "1"); var h = root.querySelector(".hint"); if (h) h.classList.add("off"); }
    go(n);
  }

  function wire() {
    root.querySelector(".pv").addEventListener("click", function () { turn(-1); });
    root.querySelector(".nx").addEventListener("click", function () { turn(1); });
    var lb = root.querySelector(".lb"), lp = root.querySelector(".lp");
    lb.addEventListener("click", function (e) { e.stopPropagation(); var on = lp.classList.toggle("on"); lb.setAttribute("aria-expanded", on); });
    document.addEventListener("click", function () { lp.classList.remove("on"); lb.setAttribute("aria-expanded", "false"); });
    lp.addEventListener("click", function (e) {
      var b = e.target.closest("[data-lang]"); if (!b) return;
      var sec = pages[cur] && pages[cur].dataset.sec;
      lang = b.getAttribute("data-lang"); store.set("nm-menu-lang", lang);
      start(sec);
    });
    var x0 = null, y0 = 0;
    book.addEventListener("pointerdown", function (e) { x0 = e.clientX; y0 = e.clientY; });
    book.addEventListener("pointerup", function (e) {
      if (x0 == null) return;
      var dx = e.clientX - x0, dy = e.clientY - y0, r = book.getBoundingClientRect(); x0 = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) turn(dx < 0 ? 1 : -1);
      else if (Math.abs(dx) < 10 && Math.abs(dy) < 10) turn(e.clientX - r.left < r.width * 0.3 ? -1 : 1);
    });
    book.addEventListener("pointercancel", function () { x0 = null; });
    addEventListener("keydown", function (e) { if (e.key === "ArrowRight") turn(1); if (e.key === "ArrowLeft") turn(-1); });
  }
  var rt;
  addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { if (book) build(pages[cur] && pages[cur].dataset.sec); }, 200); });

  function start(sec) {
    shell(); wire();
    var go2 = function () { build(sec); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(go2); else go2();
  }

  function paused() {
    document.documentElement.lang = lang;
    var others = langs.filter(function (l) { return l !== lang; }).slice(0, 4);
    root.innerHTML = '<div class="pause">' + (svg.logo ? '<div class="clogo">' + svg.logo + "</div>" : "<h1>" + esc(M.name) + "</h1>") +
      "<h1>" + esc(t(UI.paused)) + "</h1><p>" + esc(t(UI.paused2)) + '</p><div class="others">' +
      others.map(function (l) { return '<span lang="' + l + '">' + esc(UI.paused[l] || "") + "</span>"; }).join("") + "</div></div>";
  }

  // subscription status (same rule as the admin page nm/menus.html)
  function status(sub, grace) {
    if (!sub) return "ok";
    if (sub.pause) return "pause";
    var end = new Date(sub.paidUntil + "T23:59:59");
    return new Date() <= new Date(end.getTime() + (grace || 4) * 864e5) ? "ok" : "pause";
  }

  var preview = new URLSearchParams(location.search).get("apercu");
  Promise.all([
    get(M.logo).then(function (s) { svg.logo = s; }),
    get(M.motif).then(function (s) { svg.motif = s; }),
    fetch("../abonnements.json?t=" + Date.now(), { cache: "no-store" }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
  ]).then(function (res) {
    var data = res[2], sub = data && data.restaurants && data.restaurants.filter(function (r) { return r.slug === M.slug; })[0];
    if (preview === "pause" || (data && status(sub, data.graceDays) === "pause")) paused(); else start();
  });
})();
