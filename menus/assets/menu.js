/* NM Studio · QR menu "La carta" — shared by every restaurant in /menus/<slug>/.
 * Content: window.NM_MENU (menus/<slug>/menu.js). Opening screen (photo + language), chapters with large dish
 * photos, a detail sheet per dish, an allergy filter, and "my selection" that the guest shows to the waiter in the
 * restaurant's own language (no order is sent anywhere). Subscription: menus/abonnements.json, fetched fresh on
 * every open so "paid"/"paused" takes effect right away; if it can't be read (offline) the menu stays open.
 * Preview the paused screen with ?apercu=pause. */
(function () {
  "use strict";
  var M = window.NM_MENU;
  if (!M) return;
  var root = document.getElementById("menu");
  var LN = { th: "ไทย", en: "English", zh: "中文", ru: "Русский", fr: "Français", it: "Italiano", de: "Deutsch", ja: "日本語", ko: "한국어" };
  var LS = { th: "ไทย", en: "EN", zh: "中文", ru: "RU", fr: "FR", it: "IT", de: "DE", ja: "日本", ko: "한국" };
  //            th, en, zh, ru, fr, it
  var U = (function (o) { var r = {}, k = ["th", "en", "zh", "ru", "fr", "it"]; Object.keys(o).forEach(function (n) { r[n] = {}; k.forEach(function (l, i) { r[n][l] = o[n][i]; }); }); return r; })({
    choose: ["เลือกภาษา", "Choose your language", "选择语言", "Выберите язык", "Choisissez votre langue", "Scegliete la lingua"],
    cue: ["เมนูจะเปิดในภาษาของคุณ", "The menu opens in your language", "菜单将以您的语言打开", "Меню откроется на вашем языке", "La carte s’ouvre dans votre langue", "Il menù si apre nella vostra lingua"],
    see: ["ดูจาน", "See the dish", "查看菜品", "Посмотреть", "Voir le plat", "Vedi il piatto"],
    add: ["เพิ่มในรายการของฉัน", "Add to my selection", "加入我的选择", "В мой выбор", "Ajouter à ma sélection", "Aggiungi alla selezione"],
    added: ["เพิ่มแล้ว", "Added to your selection", "已加入", "Добавлено", "Ajouté à votre sélection", "Aggiunto"],
    sel: ["รายการของฉัน", "My selection", "我的选择", "Мой выбор", "Ma sélection", "La mia selezione"],
    view: ["ดู", "View", "查看", "Открыть", "Voir", "Vedi"],
    dishes: ["รายการ", "dishes", "道菜", "блюд", "plats", "piatti"],
    show: ["แสดงให้พนักงานดู", "Show the waiter", "给服务员看", "Показать официанту", "Montrer au serveur", "Mostra al cameriere"],
    clear: ["ล้าง", "Clear", "清空", "Очистить", "Vider", "Svuota"],
    empty: ["แตะ + ที่จานเพื่อเพิ่มที่นี่", "Tap + on a dish to add it here.", "点击菜品上的 + 即可加入。", "Нажмите + у блюда, чтобы добавить его сюда.", "Touchez + sur un plat pour l’ajouter ici.", "Toccate + su un piatto per aggiungerlo qui."],
    selnote: ["นี่ไม่ใช่การสั่งอาหาร แค่แสดงหน้าจอนี้ให้พนักงานดู", "This is not an order — simply show this screen to your waiter.", "这不是下单，只需把此页面给服务员看。", "Это не заказ — просто покажите экран официанту.", "Ce n’est pas une commande : montrez simplement cet écran au serveur.", "Non è un ordine: mostrate questa schermata al cameriere."],
    waiter: ["สำหรับพนักงาน", "For the waiter", "给服务员", "Для официанта", "Pour le serveur", "Per il cameriere"],
    back: ["กลับ", "Back", "返回", "Назад", "Retour", "Indietro"],
    total: ["รวม", "Total", "合计", "Итого", "Total", "Totale"],
    al: ["ภูมิแพ้", "Allergies", "过敏", "Аллергии", "Allergies", "Allergie"],
    alt: ["คุณแพ้อะไรบ้าง?", "Any allergies?", "您对什么过敏？", "Есть аллергия?", "Des allergies ?", "Avete allergie?"],
    als: ["จานที่มีส่วนผสมนี้จะถูกทำให้จางลง", "Dishes that contain them will fade out.", "含有这些成分的菜品会变暗。", "Блюда с ними станут бледнее.", "Les plats qui en contiennent s’effacent.", "I piatti che li contengono si attenuano."],
    alf: ["ข้อมูลจากร้าน กรุณายืนยันกับพนักงานทุกครั้ง", "Information from the restaurant — always confirm with our staff.", "信息由餐厅提供，请务必与服务员确认。", "Данные ресторана — всегда уточняйте у персонала.", "Informations du restaurant : confirmez toujours avec notre équipe.", "Informazioni del ristorante: confermate sempre con il personale."],
    alb: ["จานที่มีสารก่อภูมิแพ้ของคุณถูกทำให้จางลง กรุณายืนยันกับพนักงาน", "Dishes with your allergens are faded — please confirm with our staff.", "含有您过敏原的菜品已变暗，请与服务员确认。", "Блюда с вашими аллергенами приглушены — уточните у персонала.", "Les plats avec vos allergènes sont estompés : confirmez avec notre équipe.", "I piatti con i vostri allergeni sono attenuati: confermate con il personale."],
    done: ["เสร็จ", "Done", "完成", "Готово", "Terminé", "Fatto"],
    reset: ["ล้าง", "Reset", "重置", "Сбросить", "Effacer", "Azzera"],
    contains: ["มี", "Contains", "含", "Содержит", "Contient", "Contiene"],
    alls: ["สารก่อภูมิแพ้", "Allergens", "过敏原", "Аллергены", "Allergènes", "Allergeni"],
    menu: ["เมนู", "Menu", "菜单", "Меню", "La carte", "Il menù"],
    lang: ["ภาษา", "Language", "语言", "Язык", "Langue", "Lingua"],
    enjoy: ["ทานให้อร่อยนะคะ", "Enjoy your meal", "用餐愉快", "Приятного аппетита", "Bon appétit", "Buon appetito"],
    ask: ["แพ้อาหาร? แจ้งพนักงานของเราได้เลย", "Food allergy? Just tell our staff.", "如有食物过敏，请告知服务员。", "Есть аллергия? Скажите официанту.", "Une allergie ? Dites-le simplement à notre équipe.", "Allergie? Chiedete pure al nostro staff."],
    orig: ["ชื่อเดิม", "Original name", "原名", "Оригинал", "Nom d’origine", "Nome originale"],
    paused: ["เมนูออนไลน์กำลังปรับปรุง", "Our online menu is being updated", "我们的电子菜单正在更新", "Наше онлайн-меню обновляется", "Notre menu en ligne est en cours de mise à jour", "Il nostro menù online è in aggiornamento"],
    paused2: ["ขออภัยในความไม่สะดวก กรุณาขอเมนูจากพนักงานได้เลยค่ะ", "Sorry for the inconvenience — please ask our staff for the menu.", "抱歉给您带来不便，请向服务员索取菜单。", "Извините за неудобство — попросите меню у официанта.", "Désolés pour le désagrément : demandez la carte à notre équipe.", "Ci scusiamo: chiedete pure il menù al nostro staff."]
  });
  var AI = ["🌾", "🦐", "🥚", "🐟", "🥜", "🫘", "🥛", "🌰", "🥬", "🟡", "⚪", "🍷", "🌸", "🦑"];
  var ICO = {
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3l7 3v5c0 4.6-3 8.4-7 10-4-1.6-7-5.4-7-10V6z"/><path d="M9 12l2 2 4-4"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    cam: '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>'
  };

  var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
                set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  var langs = M.langs, ol = M.origLang || M.defaultLang || langs[0];
  var qLang = new URLSearchParams(location.search).get("lang");
  var suggested = (function () {
    var navs = navigator.languages || [navigator.language || ""];
    for (var i = 0; i < navs.length; i++) { var l = String(navs[i]).slice(0, 2).toLowerCase(); if (langs.indexOf(l) > -1) return l; }
    return M.defaultLang || langs[0];
  })();
  var lang = (qLang && langs.indexOf(qLang) > -1) ? qLang : (langs.indexOf(store.get("nm-menu-lang")) > -1 ? store.get("nm-menu-lang") : suggested);
  var KEY = "nm-menu-" + M.slug;
  var sel = {}; try { sel = JSON.parse(store.get(KEY + "-sel") || "{}") || {}; } catch (e) { sel = {}; }
  var alg = []; try { alg = JSON.parse(store.get(KEY + "-alg") || "[]") || []; } catch (e) { alg = []; }
  var byId = {}; M.sections.forEach(function (s, si) { s.items.forEach(function (d) { d._s = si; byId[d.id] = d; }); });

  function tr(o, l) { return o == null ? "" : typeof o === "string" ? o : (o[l || lang] || o.en || o[ol] || ""); }
  function t(k) { return tr(U[k]); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function num(p) { return parseFloat(String(p).replace(",", ".")) || 0; }
  function money(v) {
    var s = (Math.round(v * 100) / 100).toFixed(v % 1 ? 2 : 0);
    if (M.currency === "€") s = s.replace(".", ",");
    return M.currency === "฿" ? s + " ฿" : s + " " + M.currency;
  }
  function price(p) { return M.currency === "฿" ? p + " ฿" : p + " " + M.currency; }
  function aname(n) { var a = M.allergens && (M.allergens[lang] || M.allergens.en); return a ? a[n - 1] : n; }
  function img(base, w) { return base + "-" + w + ".webp"; }
  function hits(d) { return (d.a || []).filter(function (n) { return alg.indexOf(n) > -1; }); }
  function desc(d) { var x = d.d && (d.d[lang] || (lang === ol ? "" : d.d.en)); return x && x !== d.n ? x : ""; }
  if (M.theme) Object.keys(M.theme).forEach(function (k) { document.documentElement.style.setProperty("--" + k, M.theme[k]); });

  var svg = { logo: "", motif: "" };
  function get(u) { return u ? fetch(u).then(function (r) { return r.ok ? r.text() : ""; }).catch(function () { return ""; }) : Promise.resolve(""); }

  /* ─────────── page ─────────── */
  function render() {
    document.documentElement.lang = lang === "zh" ? "zh-Hans" : lang;
    document.title = M.name + " · " + t("menu");
    var h = [];
    h.push('<div class="grain" aria-hidden="true"></div>');
    // opening
    h.push('<section class="open" id="top">');
    if (M.hero) h.push('<div class="open__ph"><img src="' + img(M.hero, 1280) + '" srcset="' + img(M.hero, 640) + ' 640w, ' + img(M.hero, 1280) + ' 1280w" sizes="100vw" alt="" fetchpriority="high"></div>');
    h.push('<div class="open__top">' + (svg.logo ? '<div class="open__logo rise" style="--d:.15s" role="img" aria-label="' + esc(M.name) + '">' + svg.logo + "</div>" : '<h1 class="open__name rise">' + esc(M.name) + "</h1>") +
      '<p class="open__tag rise" style="--d:.35s">' + esc(tr(M.tagline)) + "</p></div>");
    h.push('<div class="open__bot"><p class="open__ask rise" style="--d:.55s">' + esc(t("choose")) + '</p><div class="langs">' +
      langs.map(function (l, i) { return '<button type="button" class="rise' + (l === lang ? " sug" : "") + '" style="--d:' + (0.65 + i * 0.06).toFixed(2) + 's" data-pick="' + l + '" lang="' + l + '">' + (LN[l] || l) + "</button>"; }).join("") +
      '</div><p class="open__cue rise" style="--d:1.1s">' + esc(t("cue")) + "</p></div></section>");
    // header
    h.push('<header class="hd" id="hd"><a class="hd__logo" href="#top" aria-label="' + esc(M.name) + '">' + (svg.logo || esc(M.name)) + "</a>" +
      '<button class="hd__ch" type="button" id="hdch" aria-label="' + esc(t("menu")) + '"><small></small><span></span></button>' +
      '<div class="hd__r"><button class="ib lb" type="button" data-open="lang" aria-label="' + esc(t("lang")) + '">' + (LS[lang] || lang) + "</button>" +
      '<button class="ib" type="button" data-open="alg" aria-label="' + esc(t("al")) + '">' + ICO.shield + '<span class="n' + (alg.length ? " on" : "") + '" id="algn">' + alg.length + "</span></button></div>" +
      '<i class="prog" id="prog"></i></header>');
    // chapters
    h.push("<main>");
    M.sections.forEach(function (s, si) {
      var feat = s.items.filter(function (d) { return d.img; });
      h.push('<section class="ch" id="' + s.id + '" data-i="' + si + '"><div class="wrap">');
      h.push('<header class="ch__h rv"><p class="ch__no">' + String(si + 1).padStart(2, "0") + " / " + String(M.sections.length).padStart(2, "0") + '</p><h2 class="ch__t">' + esc(tr(s.t)) + "</h2>" +
        (lang !== ol && s.t[ol] ? '<p class="ch__o" lang="' + ol + '">' + esc(s.t[ol]) + "</p>" : "") + "</header>");
      if (si === 0) h.push('<p class="alb">' + esc(t("alb")) + "</p>");
      if (feat.length) {
        h.push('<div class="feat" data-feat>');
        feat.forEach(function (d) {
          h.push('<button type="button" class="card rv" data-dish="' + d.id + '"><img src="' + img(d.img, 640) + '" srcset="' + img(d.img, 640) + " 640w, " + img(d.img, 1280) + ' 1280w" sizes="(min-width:760px) 340px, 80vw" alt="" loading="lazy" decoding="async">' +
            '<span class="card__b"><span class="card__k">' + esc(tr(s.t)) + '</span><span class="card__n">' + esc(d.n) + '</span><span class="card__f"><span class="card__p">' + price(d.p) + '</span><span class="card__go">' + esc(t("see")) + " " + ICO.arrow.replace("<svg", '<svg width="14" height="14"') + "</span></span></span></button>");
        });
        h.push("</div>");
        if (feat.length > 1) h.push('<div class="dots2" aria-hidden="true">' + feat.map(function (_, i) { return "<i" + (i ? "" : ' class="on"') + "></i>"; }).join("") + "</div>");
      }
      h.push('<ul class="list">');
      s.items.forEach(function (d, i) { h.push(dishRow(d, i)); });
      h.push("</ul>");
      if (s.note && M.notes && M.notes[s.note]) h.push('<p class="note rv">' + esc(tr(M.notes[s.note])) + "</p>");
      h.push("</div></section>");
    });
    // end
    h.push('<section class="end"><div class="wrap" style="display:grid;gap:18px;justify-items:center">' + (svg.motif ? '<div class="end__mark" aria-hidden="true">' + svg.motif + "</div>" : "") +
      "<h2>" + esc(t("enjoy")) + "</h2>" +
      (M.extras || []).map(function (x) { return '<div class="xrow"><span>' + esc(tr(x.t)) + "</span><span>" + price(x.p) + "</span></div>"; }).join("") +
      "<p>" + esc(t("ask")) + '</p><p class="by"><a href="https://mouradoulf-cmd.github.io/Mourad-site/nm/" target="_blank" rel="noopener">Menu · NM Studio</a></p></div></section>');
    h.push("</main>");
    // selection bar, sheets, waiter
    h.push('<div class="bag" id="bag"><span class="bag__t"><b id="bagn"></b><span id="bagp"></span></span><button class="bag__go" type="button" data-open="sel">' + esc(t("view")) + " " + ICO.arrow.replace("<svg", '<svg width="15" height="15"') + "</button></div>");
    h.push('<div class="scrim" id="scrim"></div><div class="sheet" id="sheet" role="dialog" aria-modal="true"><div class="sheet__grab" id="grab"></div><button class="sheet__x" type="button" data-close aria-label="' + esc(t("back")) + '">' + ICO.x + '</button><div class="sheet__body" id="sb"></div></div>');
    h.push('<div class="waiter" id="waiter" role="dialog" aria-modal="true"><div class="waiter__in" id="wi"></div><div class="waiter__f"><button class="cta" type="button" data-wclose>' + esc(t("back")) + "</button></div></div>");
    h.push('<div class="toast" id="toast" role="status"></div>');
    root.innerHTML = h.join("");
    wire();
    applyAlg(); bagUpdate();
  }

  function dishRow(d, i) {
    var dd = desc(d), hs = hits(d), q = sel[d.id] || 0;
    return '<li class="dish rv' + (hs.length ? " off" : "") + '" data-row="' + d.id + '" style="--d:' + Math.min(i * 0.04, 0.2).toFixed(2) + 's">' +
      '<button class="dish__o" type="button" data-dish="' + d.id + '" aria-label="' + esc(d.n) + '"></button>' +
      '<span class="dish__n">' + esc(d.n) + '</span><span class="dish__p">' + price(d.p) + "</span>" +
      (dd ? '<span class="dish__d">' + esc(dd) + "</span>" : "") +
      '<span class="dish__m">' + (d.img ? '<span class="chip ph">' + ICO.cam + "</span>" : "") +
      (hs.length ? '<span class="chip warn">' + esc(t("contains")) + " · " + hs.map(function (n) { return AI[n - 1]; }).join(" ") + "</span>" : "") + "</span>" +
      '<button class="add' + (q ? " on" : "") + '" type="button" data-add="' + d.id + '" aria-label="' + esc(t("add")) + '">' + ICO.plus + '<span class="q">' + (q || "") + "</span></button></li>";
  }

  /* ─────────── behaviour ─────────── */
  var cur = -1, spyFn;
  function wire() {
    var hd = document.getElementById("hd"), prog = document.getElementById("prog"), chs = [].slice.call(root.querySelectorAll(".ch")), hdch = document.getElementById("hdch");
    if (spyFn) removeEventListener("scroll", spyFn);
    cur = -1;
    spyFn = function () {
      var y = scrollY, H = innerHeight;
      hd.classList.toggle("on", y > H * 0.55);
      var max = document.documentElement.scrollHeight - H;
      prog.style.setProperty("--p", Math.max(0, Math.min(1, (y - H * 0.5) / Math.max(1, max - H * 0.5))).toFixed(3));
      var c = 0;
      chs.forEach(function (s, i) { if (s.getBoundingClientRect().top < 120) c = i; });
      if (c !== cur) {
        cur = c;
        var s = M.sections[c];
        hdch.querySelector("small").textContent = String(c + 1).padStart(2, "0") + " / " + String(M.sections.length).padStart(2, "0");
        hdch.querySelector("span").textContent = tr(s.t);
        hdch.classList.remove("swap"); void hdch.offsetWidth; hdch.classList.add("swap");
      }
    };
    addEventListener("scroll", spyFn, { passive: true }); spyFn();

    // reveal — visible by default, hidden only once IntersectionObserver is confirmed
    var rv = root.querySelectorAll(".rv");
    if ("IntersectionObserver" in window) {
      document.documentElement.classList.add("js-rv");
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
      rv.forEach(function (el) { io.observe(el); });
      setTimeout(function () { rv.forEach(function (el) { if (el.getBoundingClientRect().top < innerHeight) el.classList.add("in"); }); }, 1200);
    }
    // carousel dots
    root.querySelectorAll("[data-feat]").forEach(function (f) {
      var dots = f.nextElementSibling && f.nextElementSibling.classList.contains("dots2") ? f.nextElementSibling.children : null;
      if (!dots) return;
      f.addEventListener("scroll", function () {
        var w = f.firstElementChild.getBoundingClientRect().width + 12, i = Math.round(f.scrollLeft / w);
        [].forEach.call(dots, function (d, k) { d.classList.toggle("on", k === i); });
      }, { passive: true });
    });
    hdch.addEventListener("click", function () { openSheet("idx"); });
    var grab = document.getElementById("grab"); dragClose(grab);
  }

  root.addEventListener("click", function (e) {
    var b = e.target.closest("[data-pick],[data-add],[data-dish],[data-open],[data-close],[data-lang],[data-a],[data-q],[data-go],[data-wclose],[data-show],[data-clear],[data-areset]");
    if (!b) return;
    if (b.hasAttribute("data-pick")) {
      var l = b.getAttribute("data-pick"); store.set("nm-menu-lang", l);
      if (l !== lang) { lang = l; render(); }
      var first = document.getElementById(M.sections[0].id);
      requestAnimationFrame(function () { scrollTo({ top: first.getBoundingClientRect().top + scrollY - 70, behavior: "smooth" }); });
      return;
    }
    if (b.hasAttribute("data-add")) { e.stopPropagation(); add(b.getAttribute("data-add"), 1, b); return; }
    if (b.hasAttribute("data-dish")) { openSheet("dish", b.getAttribute("data-dish")); return; }
    if (b.hasAttribute("data-open")) { openSheet(b.getAttribute("data-open")); return; }
    if (b.hasAttribute("data-close")) { closeSheet(); return; }
    if (b.hasAttribute("data-lang")) {
      var y = M.sections[Math.max(cur, 0)].id, atTop = scrollY < innerHeight * 0.5;
      lang = b.getAttribute("data-lang"); store.set("nm-menu-lang", lang); closeSheet(true); render();
      if (!atTop) { var el = document.getElementById(y); scrollTo(0, el.getBoundingClientRect().top + scrollY - 70); }
      return;
    }
    if (b.hasAttribute("data-a")) {
      var n = +b.getAttribute("data-a"), k = alg.indexOf(n);
      if (k > -1) alg.splice(k, 1); else alg.push(n);
      b.setAttribute("aria-pressed", k < 0); saveAlg(); return;
    }
    if (b.hasAttribute("data-areset")) { alg = []; saveAlg(); openSheet("alg"); return; }
    if (b.hasAttribute("data-q")) { add(b.getAttribute("data-q"), +b.getAttribute("data-d")); openSheet("sel"); return; }
    if (b.hasAttribute("data-go")) { var g = document.getElementById(b.getAttribute("data-go")); closeSheet(); setTimeout(function () { scrollTo({ top: g.getBoundingClientRect().top + scrollY - 70, behavior: "smooth" }); }, 250); return; }
    if (b.hasAttribute("data-clear")) { sel = {}; saveSel(); refreshAdds(); openSheet("sel"); return; }
    if (b.hasAttribute("data-show")) { showWaiter(); return; }
    if (b.hasAttribute("data-wclose")) { document.getElementById("waiter").classList.remove("on"); document.body.classList.remove("lock"); }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeSheet(); var w = document.getElementById("waiter"); if (w) w.classList.remove("on"); } });

  function saveSel() { store.set(KEY + "-sel", JSON.stringify(sel)); bagUpdate(); }
  function saveAlg() { store.set(KEY + "-alg", JSON.stringify(alg)); applyAlg(); }
  function add(id, d, btn) {
    sel[id] = Math.max(0, (sel[id] || 0) + d); if (!sel[id]) delete sel[id];
    saveSel(); refreshAdds();
    if (d > 0 && btn) { toast(t("added")); var bag = document.getElementById("bag"); bag.classList.remove("bump"); void bag.offsetWidth; }
  }
  function refreshAdds() {
    root.querySelectorAll("[data-add]").forEach(function (b) { var q = sel[b.getAttribute("data-add")] || 0; b.classList.toggle("on", !!q); var s = b.querySelector(".q"); if (s) s.textContent = q || ""; });
  }
  function selList() { return Object.keys(sel).filter(function (k) { return byId[k]; }).map(function (k) { return { d: byId[k], q: sel[k] }; }).sort(function (a, b) { return a.d._s - b.d._s; }); }
  function bagUpdate() {
    var L = selList(), n = 0, sum = 0; L.forEach(function (x) { n += x.q; sum += x.q * num(x.d.p); });
    var bag = document.getElementById("bag"); if (!bag) return;
    bag.classList.toggle("on", n > 0);
    document.getElementById("bagn").textContent = t("sel") + " · " + n;
    document.getElementById("bagp").textContent = money(sum);
  }
  function applyAlg() {
    document.body.classList.toggle("alg", alg.length > 0);
    var n = document.getElementById("algn"); if (n) { n.textContent = alg.length; n.classList.toggle("on", alg.length > 0); }
    root.querySelectorAll("[data-row]").forEach(function (li) {
      var d = byId[li.getAttribute("data-row")], hs = hits(d);
      li.classList.toggle("off", hs.length > 0);
      var m = li.querySelector(".dish__m"), w = m.querySelector(".warn");
      if (w) w.remove();
      if (hs.length) m.insertAdjacentHTML("beforeend", '<span class="chip warn">' + esc(t("contains")) + " · " + hs.map(function (k) { return AI[k - 1]; }).join(" ") + "</span>");
    });
  }
  function toast(m) { var el = document.getElementById("toast"); el.textContent = m; el.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove("on"); }, 1400); }

  /* ─────────── sheets ─────────── */
  var lastFocus;
  function openSheet(kind, id) {
    var sh = document.getElementById("sheet"), sb = document.getElementById("sb"), h = "";
    sh.classList.remove("sheet--photo");
    if (kind === "dish") {
      var d = byId[id], s = M.sections[d._s], dd = desc(d), hs = hits(d), od = d.d && d.d[ol] && lang !== ol ? d.d[ol] : "";
      if (d.img) { sh.classList.add("sheet--photo"); h += '<div class="sd__ph"><img src="' + img(d.img, 1280) + '" alt="' + esc(d.n) + '"></div>'; }
      h += '<p class="sd__k">' + esc(tr(s.t)) + '</p><h3 class="sd__n">' + esc(d.n) + "</h3>" + (dd ? '<p class="sd__d">' + esc(dd) + "</p>" : "") +
        (od && od !== dd ? '<p class="sd__o" lang="' + ol + '">' + esc(od) + "</p>" : "");
      if (d.a && d.a.length) h += '<p class="sd__h">' + esc(t("alls")) + '</p><div class="sd__al">' + d.a.map(function (n) { return '<span class="' + (hs.indexOf(n) > -1 ? "warn" : "") + '">' + AI[n - 1] + " " + esc(aname(n)) + "</span>"; }).join("") + "</div>";
      h += '<div class="sd__f"><span class="sd__p">' + price(d.p) + '</span><button class="cta" type="button" data-add="' + d.id + '">' + ICO.plus + esc(t("add")) + "</button></div>";
    } else if (kind === "idx") {
      h += '<p class="sd__k" style="margin-top:4px">' + esc(M.name) + '</p><h3 class="st">' + esc(t("menu")) + '</h3><ul class="idx">' + M.sections.map(function (s, i) {
        return '<li><button type="button" data-go="' + s.id + '" class="' + (i === cur ? "cur" : "") + '"><small>' + String(i + 1).padStart(2, "0") + "</small><b>" + esc(tr(s.t)) + "</b><i>" + s.items.length + "</i></button></li>";
      }).join("") + "</ul>";
    } else if (kind === "lang") {
      h += '<h3 class="st" style="margin-top:4px">' + esc(t("lang")) + '</h3><div class="lgrid">' + langs.map(function (l) { return '<button type="button" data-lang="' + l + '" lang="' + l + '" aria-pressed="' + (l === lang) + '">' + (LN[l] || l) + "</button>"; }).join("") + "</div>";
    } else if (kind === "alg") {
      var A = M.allergens && (M.allergens[lang] || M.allergens.en) || [];
      h += '<h3 class="st" style="margin-top:4px">' + esc(t("alt")) + '</h3><p class="ss">' + esc(t("als")) + '</p><div class="agrid">' + A.map(function (a, i) {
        return '<button type="button" data-a="' + (i + 1) + '" aria-pressed="' + (alg.indexOf(i + 1) > -1) + '"><em>' + AI[i] + "</em>" + esc(a) + "</button>";
      }).join("") + '</div><p class="fine">' + esc(t("alf")) + '</p><div class="row2"><button class="cta ghost" type="button" data-areset>' + esc(t("reset")) + '</button><button class="cta" type="button" data-close>' + esc(t("done")) + "</button></div>";
    } else if (kind === "sel") {
      var L = selList(), sum = 0;
      h += '<h3 class="st" style="margin-top:4px">' + esc(t("sel")) + "</h3>";
      if (!L.length) h += '<p class="empty">' + esc(t("empty")) + "</p>";
      else {
        h += '<ul class="sel">' + L.map(function (x) { sum += x.q * num(x.d.p); return '<li><span class="n">' + esc(x.d.n) + '</span><span class="p">' + price(x.d.p) + '</span><span class="qty"><button type="button" data-q="' + x.d.id + '" data-d="-1" aria-label="−">−</button><span>' + x.q + '</span><button type="button" data-q="' + x.d.id + '" data-d="1" aria-label="+">+</button></span></li>'; }).join("") + "</ul>";
        h += '<div class="tot"><span>' + esc(t("total")) + "</span><b>" + money(sum) + '</b></div><p class="fine">' + esc(t("selnote")) + '</p><div class="col2"><button class="cta" type="button" data-show>' + ICO.eye + esc(t("show")) + '</button><button class="link" type="button" data-clear>' + esc(t("clear")) + "</button></div>";
      }
    }
    sb.innerHTML = h; sb.scrollTop = 0;
    if (!sh.classList.contains("on")) lastFocus = document.activeElement;
    sh.classList.add("on"); document.getElementById("scrim").classList.add("on"); document.body.classList.add("lock");
    sh.style.transform = "";
    setTimeout(function () { var x = sh.querySelector(".sheet__x"); if (x) x.focus({ preventScroll: true }); }, 50);
  }
  function closeSheet(instant) {
    var sh = document.getElementById("sheet"); if (!sh) return;
    sh.classList.remove("on"); sh.style.transform = "";
    document.getElementById("scrim").classList.remove("on"); document.body.classList.remove("lock");
    if (lastFocus && lastFocus.focus && !instant) lastFocus.focus({ preventScroll: true });
  }
  document.addEventListener("click", function (e) { if (e.target.id === "scrim") closeSheet(); });
  function dragClose(handle) {
    var sh = document.getElementById("sheet"), y0 = null, dy = 0;
    handle.addEventListener("pointerdown", function (e) { y0 = e.clientY; dy = 0; sh.classList.add("drag"); handle.setPointerCapture(e.pointerId); });
    handle.addEventListener("pointermove", function (e) { if (y0 == null) return; dy = Math.max(0, e.clientY - y0); sh.style.transform = "translateY(" + dy + "px)"; });
    function up() { if (y0 == null) return; y0 = null; sh.classList.remove("drag"); if (dy > 90) closeSheet(); else sh.style.transform = ""; }
    handle.addEventListener("pointerup", up); handle.addEventListener("pointercancel", up);
  }
  function showWaiter() {
    var L = selList(), w = document.getElementById("waiter");
    document.getElementById("wi").innerHTML = (svg.logo ? '<div class="waiter__logo">' + svg.logo + "</div>" : "<h1>" + esc(M.name) + "</h1>") +
      "<h2>" + esc(U.waiter[ol] || U.waiter.en) + (lang !== ol ? " · " + esc(t("waiter")) : "") + "</h2><ol>" +
      L.map(function (x) { return "<li><b>" + x.q + "×</b><span>" + esc(x.d.n) + "</span></li>"; }).join("") + '</ol><p class="waiter__note">' + esc(t("selnote")) + "</p>";
    closeSheet(true); w.classList.add("on"); document.body.classList.add("lock");
  }

  /* ─────────── paused screen ─────────── */
  function paused() {
    document.documentElement.lang = lang;
    var others = langs.filter(function (l) { return l !== lang; }).slice(0, 4);
    root.innerHTML = '<div class="grain" aria-hidden="true"></div><div class="pause">' + (svg.logo ? '<div class="open__logo">' + svg.logo + "</div>" : '<h1 class="open__name">' + esc(M.name) + "</h1>") +
      "<h1>" + esc(t("paused")) + "</h1><p>" + esc(t("paused2")) + '</p><div class="others">' +
      others.map(function (l) { return '<span lang="' + l + '">' + esc(U.paused[l] || "") + "</span>"; }).join("") + "</div></div>";
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
    if (preview === "pause" || (data && status(sub, data.graceDays) === "pause")) paused(); else render();
  });
})();
