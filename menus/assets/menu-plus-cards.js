/* NM Studio · QR menu "Cards" layer (needs menu.js + menu-plus.js). Opt-in: NM_MENU.plus.cards = true.
 *  - photo-led dish cards: the engine's own markup is re-composed (price + add control on the photograph)
 *  - add control that turns into a  − 2 +  stepper; a thumbnail flies into the selection bar; the bar shows what was picked
 *  - category tabs with a photo and a sliding indicator; large / grid view switch (remembered)
 * It never changes prices, dishes or the selection logic: every +/− goes through the engine (window.__nmMenu). */
(function () {
  "use strict";
  var M = window.NM_MENU, root = document.getElementById("menu");
  if (!M || !M.plus || !M.plus.cards || !root) return;
  var API = function () { return window.__nmMenu; };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var XU = (window.NM_I18N_X && window.NM_I18N_X.ui) || {};
  function L() { var l = document.documentElement.lang || "en"; return l === "zh-Hans" ? "zh" : l === "zh-Hant" ? "zt" : l; }
  function ui(k) { return ((XU[L()] || {})[k]) || ((XU.en || {})[k]) || k; }
  document.documentElement.classList.add("pl-cards");
  var byId = {}; M.sections.forEach(function (s, si) { s.items.forEach(function (d) { d._s = si; byId[d.id] = d; }); });
  function lget(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lset(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  var view = lget("pl-view") || M.plus.layout || "large";
  function setView(v) { view = v; lset("pl-view", v); document.documentElement.classList.toggle("pl-v-grid", v === "grid"); var b = document.querySelector(".pl-vsw"); if (b) b.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x.getAttribute("data-v") === v); }); }
  setView(view);
  var ICO = {
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    large: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="4" y="4" width="16" height="9" rx="2.5"/><path d="M4 17h16M4 20.5h10" stroke-linecap="round"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/></svg>'
  };
  function thumb(d) { return d.img ? d.img + (M.photoHD ? "-c-800.webp" : "-t.webp") : ""; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ───────── dish cards ───────── */
  // the blurred placeholder behind each photograph is only fetched when its card is about to be seen
  var lqIO = "IntersectionObserver" in window ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.style.setProperty("--lq", e.target.__lq); lqIO.unobserve(e.target); } }); }, { rootMargin: "700px 0px" }) : null;
  function lqObserve(ph) { if (lqIO) lqIO.observe(ph); else ph.style.setProperty("--lq", ph.__lq); }
  function ctl(id) {
    return '<div class="pl-ctl" data-id="' + esc(id) + '" data-q="0"><button type="button" class="pl-first" data-plq="1">' + ICO.plus + "<span>" + esc(ui("addshort")) + '</span></button>' +
      '<div class="pl-step"><button type="button" class="pl-dec" data-plq="-1" aria-label="' + esc(ui("less")) + '">−</button><span class="pl-q" aria-live="polite">0</span><button type="button" class="pl-inc" data-plq="1" aria-label="' + esc(ui("addshort")) + '">+</button></div></div>';
  }
  function dress(main) {
    main.querySelectorAll(".dish").forEach(function (li) {
      if (li.__pc) return; li.__pc = 1;
      var id = li.getAttribute("data-row"), ph = li.querySelector(".dish__ph"), p = li.querySelector(".dish__p"), m = li.querySelector(".dish__m");
      if (ph) {
        var im = ph.querySelector("img"), d = byId[id];
        if (d && d.img) { ph.__lq = 'url("' + new URL(d.img + "-t.webp", document.baseURI).href + '")'; lqObserve(ph); }
        if (im) { var ok = function () { im.classList.add("pl-ok"); }; if (im.complete && im.naturalWidth) ok(); else { im.addEventListener("load", ok); im.addEventListener("error", ok); } }
        if (p) ph.appendChild(p);
        ph.insertAdjacentHTML("beforeend", ctl(id));
      } else {
        li.insertAdjacentHTML("beforeend", '<div class="pl-side"></div>');
        var side = li.querySelector(".pl-side"); if (p) side.appendChild(p); side.insertAdjacentHTML("beforeend", ctl(id));
      }
    });
    sync();
  }
  function sync() {
    var A = API(); if (!A) return;
    root.querySelectorAll(".pl-ctl").forEach(function (c) {
      var q = A.qty(c.getAttribute("data-id")), prev = +c.getAttribute("data-q");
      if (q === prev) return; c.setAttribute("data-q", q);
      var qe = c.querySelector(".pl-q"); qe.textContent = q;
      if (q && prev && !reduce) { qe.classList.remove("bump"); void qe.offsetWidth; qe.classList.add("bump"); }
    });
    bagThumbs();
  }
  document.addEventListener("nm-sel", sync);

  /* ───────── add / remove (through the engine) + fly to the bar ───────── */
  root.addEventListener("click", function (e) {
    var b = e.target.closest("[data-plq]"); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    var c = b.closest(".pl-ctl"), id = c.getAttribute("data-id"), d = +b.getAttribute("data-plq"), A = API(); if (!A || (byId[id] && byId[id].soldout)) return;
    A.add(id, d);
    if (d > 0) { fly(b, id); var bag = document.getElementById("bag"); if (bag) { bag.classList.remove("bump"); void bag.offsetWidth; bag.classList.add("bump"); } }
  }, true);
  function fly(from, id) {
    if (reduce || !from.animate) return;
    var d = byId[id], src = d && thumb(d); if (!src) return;
    var r = from.getBoundingClientRect(), bag = document.getElementById("bag"), br = bag && bag.classList.contains("on") ? bag.getBoundingClientRect() : { left: innerWidth / 2 - 40, top: innerHeight - 70, width: 80, height: 50 };
    var el = document.createElement("div"); el.className = "pl-fly"; el.innerHTML = '<img src="' + src + '" alt="">'; document.body.appendChild(el);
    var x0 = r.left + r.width / 2 - 27, y0 = r.top + r.height / 2 - 27, x1 = br.left + 22, y1 = br.top + br.height / 2 - 27;
    var a = el.animate([{ transform: "translate(" + x0 + "px," + y0 + "px) scale(1)", opacity: 1 }, { transform: "translate(" + (x0 + (x1 - x0) * 0.55) + "px," + (Math.min(y0, y1) - 70) + "px) scale(.85)", opacity: 1, offset: 0.55 }, { transform: "translate(" + x1 + "px," + y1 + "px) scale(.4)", opacity: 0.2 }], { duration: 720, easing: "cubic-bezier(.32,.72,0,1)" });
    a.onfinish = function () { el.remove(); }; a.oncancel = function () { el.remove(); };
  }
  function bagThumbs() {
    var bag = document.getElementById("bag"), A = API(); if (!bag || !A) return;
    var box = bag.querySelector(".pl-bagth"); if (!box) { bag.insertAdjacentHTML("afterbegin", '<span class="pl-bagth" aria-hidden="true"></span>'); box = bag.querySelector(".pl-bagth"); }
    var ids = A.ids().filter(function (i) { return byId[i] && byId[i].img; }).slice(-3);
    var key = ids.join(","); if (box.getAttribute("data-k") === key) return; box.setAttribute("data-k", key);
    box.innerHTML = ids.map(function (i) { return "<i><img src=\"" + thumb(byId[i]) + "\" alt=\"\"></i>"; }).join("");
  }

  /* ───────── view switch ───────── */
  function viewSwitch(main) {
    var top = main.querySelector(".pl-top"); if (!top || top.querySelector(".pl-vsw")) return;
    var anchor = top.querySelector(".pl-chips") || top.querySelector(".pl-search"); if (!anchor) return;
    var h = '<div class="pl-vsw" role="group"><button type="button" data-v="large" aria-label="' + esc(ui("viewlarge")) + '" aria-pressed="' + (view === "large") + '">' + ICO.large + '</button><button type="button" data-v="grid" aria-label="' + esc(ui("viewgrid")) + '" aria-pressed="' + (view === "grid") + '">' + ICO.grid + "</button></div>";
    anchor.insertAdjacentHTML("afterend", h);
    top.querySelector(".pl-vsw").addEventListener("click", function (e) { var b = e.target.closest("[data-v]"); if (b) setView(b.getAttribute("data-v")); });
  }

  /* ───────── category tabs: photo + sliding indicator ───────── */
  var tabsObs = null;
  function tabs() {
    var nav = document.getElementById("tabs"); if (!nav) return;
    if (!nav.__pc) {
      nav.__pc = 1;
      nav.querySelectorAll("button[data-go]").forEach(function (b) {
        var s = M.sections.filter(function (x) { return x.id === b.getAttribute("data-go"); })[0], it = s && s.items.filter(function (d) { return d.img; })[0];
        if (it) b.insertAdjacentHTML("afterbegin", '<span class="pl-tabimg"><img src="' + thumb(it) + '" alt="" width="32" height="32" loading="lazy" decoding="async"></span>');
        else b.style.paddingLeft = "16px";
      });
      nav.insertAdjacentHTML("beforeend", '<span class="pl-ind" aria-hidden="true"></span>'); // last child: the engine addresses the tab buttons by index
      if (tabsObs) tabsObs.disconnect();
      tabsObs = new MutationObserver(moveInd); tabsObs.observe(nav, { attributes: true, subtree: true, attributeFilter: ["class"] });
      if ("ResizeObserver" in window) { var ro = new ResizeObserver(function () { moveInd(); }); nav.querySelectorAll("button[data-go]").forEach(function (b) { ro.observe(b); }); }
    }
    moveInd();
  }
  function moveInd() {
    var nav = document.getElementById("tabs"); if (!nav) return;
    var on = nav.querySelector("button.on") || nav.querySelector("button[data-go]"), ind = nav.querySelector(".pl-ind"); if (!on || !ind) return;
    ind.style.width = on.offsetWidth + "px"; ind.style.transform = "translate(" + on.offsetLeft + "px," + on.offsetTop + "px)";
  }
  addEventListener("resize", moveInd);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveInd);

  /* ───────── (re)build after every render of the engine ───────── */
  function enhance() {
    var main = root.querySelector("main"); if (!main) return;
    dress(main); viewSwitch(main); tabs(); bagThumbs();
  }
  new MutationObserver(function () { requestAnimationFrame(enhance); }).observe(root, { childList: true });
  enhance();
})();
