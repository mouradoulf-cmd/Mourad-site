/* NM Studio · QR menu renderer (shared by every restaurant in /menus/<slug>/).
 * Content: window.NM_MENU (menus/<slug>/menu.js). Subscription: menus/abonnements.json, fetched fresh on every
 * open so "paid"/"paused" takes effect right away. If that file can't be read (offline), the menu stays open:
 * a guest at the table is never punished for a network hiccup. Preview the paused screen with ?apercu=pause. */
(function () {
  "use strict";
  var M = window.NM_MENU;
  if (!M) return;
  var root = document.getElementById("menu");
  var LN = { th: "ไทย", en: "English", zh: "中文", ru: "Русский", fr: "Français", it: "Italiano", de: "Deutsch", ja: "日本語", ko: "한국어" };
  var UI = {
    al: { th: "สารก่อภูมิแพ้", en: "Allergens", zh: "过敏原", ru: "Аллергены", fr: "Allergènes", it: "Allergeni" },
    legend: { th: "รายการสารก่อภูมิแพ้", en: "Allergen list", zh: "过敏原列表", ru: "Список аллергенов", fr: "Liste des allergènes", it: "Elenco allergeni" },
    ask: { th: "แพ้อาหาร? แจ้งพนักงานของเราได้เลย", en: "Food allergy? Just tell our staff.", zh: "如有食物过敏，请告知我们的服务员。", ru: "Есть аллергия? Скажите нашему официанту.", fr: "Une allergie ? Dites-le simplement à notre équipe.", it: "Allergie? Chiedete pure al nostro staff." },
    paused: { th: "เมนูออนไลน์กำลังปรับปรุง", en: "Our online menu is being updated", zh: "我们的电子菜单正在更新", ru: "Наше онлайн-меню обновляется", fr: "Notre menu en ligne est en cours de mise à jour", it: "Il nostro menù online è in aggiornamento" },
    paused2: { th: "ขออภัยในความไม่สะดวก กรุณาขอเมนูจากพนักงานได้เลยค่ะ", en: "Sorry for the inconvenience — please ask our staff for the menu.", zh: "抱歉给您带来不便，请向服务员索取菜单。", ru: "Извините за неудобство — попросите меню у официанта.", fr: "Désolés pour le désagrément : demandez la carte à notre équipe.", it: "Ci scusiamo: chiedete pure il menù al nostro staff." }
  };
  var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
                set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  var langs = M.langs;
  var lang = (function () {
    var q = new URLSearchParams(location.search).get("lang");
    if (q && langs.indexOf(q) > -1) return q;
    var s = store.get("nm-menu-lang");
    if (s && langs.indexOf(s) > -1) return s;
    var navs = navigator.languages || [navigator.language || ""];
    for (var i = 0; i < navs.length; i++) { var l = String(navs[i]).slice(0, 2).toLowerCase(); if (langs.indexOf(l) > -1) return l; }
    return M.defaultLang || langs[0];
  })();
  function t(o) { return o == null ? "" : typeof o === "string" ? o : (o[lang] || o.en || o[M.defaultLang] || ""); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function price(p) { return M.currency === "฿" ? p + " ฿" : p + " " + M.currency; }

  if (M.theme) Object.keys(M.theme).forEach(function (k) { document.documentElement.style.setProperty("--" + k, M.theme[k]); });

  var logoSvg = "";
  function loadLogo() {
    if (!M.logo) return Promise.resolve();
    return fetch(M.logo).then(function (r) { return r.ok ? r.text() : ""; }).then(function (s) { logoSvg = s; }).catch(function () {});
  }

  function render() {
    document.documentElement.lang = lang === "zh" ? "zh-Hans" : lang;
    var h = [];
    h.push('<header class="top"><div class="wrap">');
    if (logoSvg) h.push('<div class="logo" role="img" aria-label="' + esc(M.name) + '">' + logoSvg + "</div>");
    h.push('<h1 class="name"' + (logoSvg ? ' style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)"' : "") + ">" + esc(M.name) + "</h1>");
    h.push('<p class="tagline">' + esc(t(M.tagline)) + "</p>");
    h.push('<div class="langs" role="group" aria-label="Language">');
    langs.forEach(function (l) { h.push('<button type="button" data-lang="' + l + '" aria-pressed="' + (l === lang) + '" lang="' + l + '">' + (LN[l] || l) + "</button>"); });
    h.push("</div></div></header>");

    h.push('<nav class="tabs" aria-label="Menu"><div class="wrap">');
    M.sections.forEach(function (s) { h.push('<a href="#' + s.id + '">' + esc(t(s.t)) + "</a>"); });
    h.push("</div></nav>");

    h.push('<main class="wrap">');
    if (M.allergens) h.push('<div class="tools"><span>' + esc(t(UI.ask)) + '</span><button type="button" class="switch" id="alsw" aria-pressed="' + document.body.classList.contains("show-al") + '"><i></i>' + esc(t(UI.al)) + "</button></div>");
    M.sections.forEach(function (s) {
      var feat = s.items.filter(function (d) { return d.img; }), rest = s.items.filter(function (d) { return !d.img; });
      h.push('<section class="sec" id="' + s.id + '"><h2 class="rv">' + esc(t(s.t)) + "</h2>");
      var ol = M.origLang || "it";
      if (s.t[ol] && lang !== ol) h.push('<span class="orig" lang="' + ol + '">' + esc(s.t[ol]) + "</span>");
      if (feat.length) { h.push('<div class="feat">'); feat.forEach(function (d) { h.push('<article class="fd rv"><figure><picture><source srcset="' + d.img + '-640.webp" type="image/webp"><img src="' + d.img + '-640.jpg" alt="' + esc(d.n) + '" loading="lazy" decoding="async" width="640" height="480"></picture></figure><div class="b">' + dish(d) + "</div></article>"); }); h.push("</div>"); }
      if (rest.length) { h.push('<ul class="list">'); rest.forEach(function (d) { h.push('<li class="it rv">' + dish(d) + "</li>"); }); h.push("</ul>"); }
      if (s.note && M.notes && M.notes[s.note]) h.push('<p class="note">' + esc(t(M.notes[s.note])) + "</p>");
      h.push("</section>");
    });
    if (M.extras && M.extras.length) { h.push('<div class="extras">'); M.extras.forEach(function (x) { h.push("<div><span>" + esc(t(x.t)) + "</span><b>" + price(x.p) + "</b></div>"); }); h.push("</div>"); }
    if (M.allergens) { var a = M.allergens[lang] || M.allergens.en; h.push('<details class="legend"><summary>' + esc(t(UI.legend)) + "</summary><ol>" + a.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ol></details>"); }
    h.push('</main><footer class="foot">Menu · <a href="https://mouradoulf-cmd.github.io/Mourad-site/nm/" target="_blank" rel="noopener">NM Studio</a></footer>');
    root.innerHTML = h.join("");
    wire();
  }
  function dish(d) {
    var desc = t(d.d), orig = d.n;
    var s = '<div class="row"><h3 class="dn">' + esc(orig) + '</h3><span class="pr">' + price(d.p) + "</span></div>";
    if (desc && desc !== orig) s += '<p class="dd">' + esc(desc) + "</p>";
    if (d.a && M.allergens) { var names = M.allergens[lang] || M.allergens.en; s += '<div class="al">' + d.a.map(function (n) { return "<span>" + n + " · " + esc(names[n - 1]) + "</span>"; }).join("") + "</div>"; }
    return s;
  }

  function wire() {
    root.querySelectorAll("[data-lang]").forEach(function (b) {
      b.addEventListener("click", function () { lang = b.getAttribute("data-lang"); store.set("nm-menu-lang", lang); var y = scrollY; render(); scrollTo(0, y); });
    });
    var sw = document.getElementById("alsw");
    if (sw) sw.addEventListener("click", function () { var on = document.body.classList.toggle("show-al"); sw.setAttribute("aria-pressed", on); });
    // reveal: content is visible by default; hidden state only once the observer is confirmed working
    var rv = root.querySelectorAll(".rv");
    if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -6% 0px" });
      rv.forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < innerHeight) el.classList.add("in"); io.observe(el); });
      setTimeout(function () { rv.forEach(function (el) { if (el.getBoundingClientRect().top < innerHeight) el.classList.add("in"); }); }, 1500);
    } else rv.forEach(function (el) { el.classList.add("in"); });
    // active tab follows the scroll
    var tabs = root.querySelectorAll(".tabs a"), secs = root.querySelectorAll(".sec");
    function spy() {
      var cur = secs[0] && secs[0].id;
      secs.forEach(function (s) { if (s.getBoundingClientRect().top < 140) cur = s.id; });
      tabs.forEach(function (a) { var on = a.getAttribute("href") === "#" + cur; if (on !== a.classList.contains("on")) { a.classList.toggle("on", on); if (on) a.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" }); } });
    }
    removeEventListener("scroll", window.__nmSpy || spy); window.__nmSpy = spy;
    addEventListener("scroll", spy, { passive: true }); spy();
  }

  function paused() {
    document.documentElement.lang = lang;
    var others = langs.filter(function (l) { return l !== lang; }).slice(0, 4);
    root.innerHTML = '<div class="pause">' + (logoSvg ? '<div class="logo">' + logoSvg + "</div>" : '<p class="name">' + esc(M.name) + "</p>") +
      "<h1>" + esc(t(UI.paused)) + "</h1><p>" + esc(t(UI.paused2)) + '</p><div class="others">' +
      others.map(function (l) { return '<span lang="' + l + '">' + esc(UI.paused[l] || "") + "</span>"; }).join("") + "</div></div>";
  }

  // subscription status (same rule as the admin page nm/menus.html)
  function status(sub, grace) {
    if (!sub) return "ok";
    if (sub.pause) return "pause";
    var end = new Date(sub.paidUntil + "T23:59:59"), now = new Date();
    return now <= new Date(end.getTime() + (grace || 4) * 864e5) ? "ok" : "pause";
  }

  var preview = new URLSearchParams(location.search).get("apercu");
  Promise.all([
    loadLogo(),
    fetch("../abonnements.json?t=" + Date.now(), { cache: "no-store" }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
  ]).then(function (res) {
    var data = res[1], sub = data && data.restaurants && data.restaurants.filter(function (r) { return r.slug === M.slug; })[0];
    if (preview === "pause" || (data && status(sub, data.graceDays) === "pause")) paused(); else render();
  });
})();
