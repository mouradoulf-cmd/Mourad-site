/* SOCAP — interactions du site. Vanilla JS, aucune dépendance sauf Lenis (défilement doux, auto-hébergé).
   - La scène 3D (scene.js) est chargée à la demande ; sans WebGL (ou machine trop faible) le poster statique reste affiché.
   - Les contenus sont visibles par défaut ; l'état « caché » des révélations n'est activé qu'une fois l'IntersectionObserver confirmé.
   - Le curseur personnalisé est un anneau ADDITIF : le curseur natif n'est jamais masqué. */
(function () {
  "use strict";
  var CONFIG = {
    phone: "04 74 55 00 98",
    email: "",                       /* À RENSEIGNER : adresse qui reçoit les demandes de devis (le formulaire ouvre alors le client mail) */
    foundedYear: 1983
  };
  var root = document.documentElement, $ = function (s, c) { return (c || document).querySelector(s); }, $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coarse = matchMedia("(hover: none), (pointer: coarse)").matches;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var smooth = function (t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  var vh = innerHeight;

  /* ------------------------------------------------------------ défilement doux (Lenis) */
  var lenis = null;
  function readY() { return lenis ? lenis.scroll : (window.pageYOffset || 0); }
  if (!reduce && window.Lenis) {
    try { lenis = new window.Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true }); root.classList.add("lenis", "lenis-smooth"); } catch (e) { lenis = null; }
  }
  var listeners = [];
  function onScroll(fn) { listeners.push(fn); }
  function tick(time) { if (lenis) lenis.raf(time); requestAnimationFrame(tick); }
  requestAnimationFrame(tick);
  var ticking = false;
  function fire() { ticking = false; var y = readY(); for (var i = 0; i < listeners.length; i++) listeners[i](y); }
  function queue() { if (!ticking) { ticking = true; requestAnimationFrame(fire); } }
  addEventListener("scroll", queue, { passive: true }); if (lenis) lenis.on("scroll", queue);

  function goTo(sel) { var el = $(sel); if (!el) return; var y = el.getBoundingClientRect().top + readY() - (sel === "#top" ? 0 : 0); if (lenis) lenis.scrollTo(y, { duration: 1.6 }); else scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" }); }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return; var h = a.getAttribute("href"); if (h.length < 2 || !$(h)) return;
    e.preventDefault(); closeMenu(); goTo(h); history.replaceState(null, "", h);
  });

  /* ------------------------------------------------------------ loader */
  var loader = $("#loader");
  function hideLoader() { if (!loader || loader.classList.contains("done")) return; loader.classList.add("done"); root.classList.add("ready"); }
  var t0 = performance.now();
  function whenReady() { var wait = Math.max(0, 1400 - (performance.now() - t0)); setTimeout(hideLoader, wait); }
  if (document.readyState === "complete") whenReady(); else addEventListener("load", whenReady);
  setTimeout(hideLoader, 4500);

  /* ------------------------------------------------------------ en-tête, menu, progression */
  var hd = $("#hd"), nav = $("#nav"), burger = $("#burger"), prog = $("#progress i"), lastY = 0;
  function closeMenu() { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Ouvrir le menu"); if (lenis) lenis.start(); document.body.style.overflow = ""; }
  burger.addEventListener("click", function () {
    var o = !nav.classList.contains("open"); nav.classList.toggle("open", o); burger.setAttribute("aria-expanded", String(o)); burger.setAttribute("aria-label", o ? "Fermer le menu" : "Ouvrir le menu");
    if (o) { if (lenis) lenis.stop(); document.body.style.overflow = "hidden"; } else closeMenu();
  });
  addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  onScroll(function (y) {
    hd.classList.toggle("solid", y > 40);
    var down = y > lastY && y > 480; hd.classList.toggle("hide", down && !nav.classList.contains("open") && !inPinned(y)); lastY = y;
    var max = document.documentElement.scrollHeight - innerHeight; prog.style.transform = "scaleX(" + (max > 0 ? clamp(y / max, 0, 1) : 0) + ")";
  });
  function inPinned() { return false; }

  /* lien actif */
  var links = $$("#nav a"), map = {}; links.forEach(function (a) { map[a.getAttribute("href")] = a; });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { links.forEach(function (l) { l.classList.remove("act"); }); var l = map["#" + e.target.id]; if (l) l.classList.add("act"); } }); }, { rootMargin: "-45% 0px -50% 0px" });
    ["plan", "entreprise", "prestations", "realisations", "zone"].forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }

  /* ------------------------------------------------------------ révélations (visibles par défaut) */
  var rvSel = ".h2, .lead, .ent__l p, .stat, .vows li, .h3, .card, .proj__b, .zone__list, .zone__note, .addr, .bigtel, .form, .ft__g > div, .eyebrow";
  if ("IntersectionObserver" in window && !reduce) {
    var items = $$(rvSel).filter(function (el) { return !el.closest(".plan__txt, .hero, .work__head"); });
    items.forEach(function (el, i) { el.classList.add("rv"); var sib = el.parentElement ? [].indexOf.call(el.parentElement.children, el) : 0; el.style.setProperty("--d", Math.min(sib, 5) * 0.07 + "s"); });
    var rio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); rio.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    root.classList.add("rv-on"); items.forEach(function (el) { rio.observe(el); });
    setTimeout(function () { items.forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add("in"); }); }, 2500);
  }

  /* compteurs */
  var yrs = new Date().getFullYear() - CONFIG.foundedYear;
  $$("[data-count]").forEach(function (el) { if (el.getAttribute("data-count") === "43") el.setAttribute("data-count", String(yrs)); el.textContent = el.getAttribute("data-count"); });
  if ("IntersectionObserver" in window && !reduce) {
    var cio = new IntersectionObserver(function (es) { es.forEach(function (e) {
      if (!e.isIntersecting) return; cio.unobserve(e.target); var el = e.target, to = +el.getAttribute("data-count"), t = performance.now();
      (function step(n) { var k = smooth((n - t) / 1600); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); else el.textContent = to; })(t);
    }); }, { threshold: 0.6 });
    $$("[data-count]").forEach(function (el) { cio.observe(el); });
  }

  /* ------------------------------------------------------------ « Du plan au jardin » */
  var plan = $("#plan"), steps = $$("#steps li"), planFill = $("#planFill"), hudState = $("#hudState"), HUD = ["ÉTAPE 01 · ÉTUDE", "ÉTAPE 02 · TERRAIN", "ÉTAPE 03 · MATÉRIAUX", "ÉTAPE 04 · VÉGÉTAL & EAU", "ÉTAPE 05 · SUIVI"], curStep = -1;
  function planProgress(y) { var top = plan.offsetTop, len = plan.offsetHeight - innerHeight; return clamp((y - top) / Math.max(1, len), 0, 1); }
  onScroll(function (y) {
    var p = planProgress(y), s = Math.min(steps.length - 1, Math.floor(p * steps.length)); planFill.style.transform = "scaleY(" + p + ")";
    if (s !== curStep) { curStep = s; steps.forEach(function (li, i) { li.classList.toggle("on", i === s); }); if (hudState) hudState.textContent = HUD[s]; }
  });

  /* ------------------------------------------------------------ réalisations : défilement horizontal épinglé */
  var work = $("#realisations"), track = $("#wTrack"), wCur = $("#wCur"), wMax = 0, nProj = $$(".proj", track).length, mobileMQ = matchMedia("(max-width: 900px)");
  function measureWork() { wMax = Math.max(0, track.scrollWidth - innerWidth + (parseFloat(getComputedStyle(track).paddingLeft) || 0)); }
  onScroll(function (y) {
    if (mobileMQ.matches) { track.style.transform = ""; return; }
    var p = clamp((y - work.offsetTop) / Math.max(1, work.offsetHeight - innerHeight), 0, 1);
    track.style.transform = "translate3d(" + (-p * wMax).toFixed(1) + "px,0,0)"; var n = Math.min(nProj, Math.round(p * (nProj - 1)) + 1); wCur.textContent = (n < 10 ? "0" : "") + n;
  });
  track.addEventListener("scroll", function () { if (!mobileMQ.matches) return; var n = Math.round(track.scrollLeft / (track.scrollWidth / nProj)) + 1; wCur.textContent = (n < 10 ? "0" : "") + clamp(n, 1, nProj); }, { passive: true });

  /* ------------------------------------------------------------ scène 3D : plans de caméra pilotés par le scroll */
  var scene = null, anchors = [];
  var SHOTS = [
    ["#top", 0.0, { px: -8, py: 12, pz: 46, tx: 0, ty: 1, tz: 0, build: 1, night: 0 }],
    ["#top", 1.0, { px: -8, py: 12, pz: 46, tx: 0, ty: 1, tz: 0, build: 1, night: 0 }],
    ["#plan", 0.05, { px: 0, py: 82, pz: 22, tx: 0, ty: 0, tz: 0, build: 0, night: 0.04 }],
    ["#plan", 0.3, { px: -14, py: 54, pz: 34, tx: 0, ty: 0, tz: 0, build: 0.3, night: 0.05 }],
    ["#plan", 0.55, { px: -30, py: 26, pz: 40, tx: 2, ty: 1, tz: 0, build: 0.58, night: 0.06 }],
    ["#plan", 0.78, { px: -26, py: 14, pz: 36, tx: 4, ty: 1, tz: 2, build: 0.82, night: 0.08 }],
    ["#plan", 0.98, { px: -12, py: 11, pz: 44, tx: 2, ty: 1, tz: 0, build: 1, night: 0.1 }],
    ["#entreprise", 0.2, { px: 26, py: 12, pz: 38, tx: 2, ty: 2, tz: -6, build: 1, night: 0.14 }],
    ["#entreprise", 0.9, { px: 30, py: 9, pz: 26, tx: 4, ty: 2, tz: -4, build: 1, night: 0.2 }],
    ["#prestations", 0.1, { px: -26, py: 8, pz: 30, tx: -9, ty: 1, tz: 8, build: 1, night: 0.3 }],
    ["#prestations", 0.9, { px: 2, py: 8, pz: 28, tx: -4, ty: 2, tz: 6, build: 1, night: 0.38 }],
    ["#realisations", 0.08, { px: 32, py: 9, pz: 14, tx: 15, ty: 2, tz: -6, build: 1, night: 0.55 }],
    ["#realisations", 0.92, { px: 24, py: 11, pz: -24, tx: 15, ty: 2, tz: -6, build: 1, night: 0.66 }],
    ["#zone", 0.5, { px: 0, py: 96, pz: 8, tx: 0, ty: 0, tz: 0, build: 1, night: 0.85 }],
    ["#contact", 0.5, { px: 0, py: 15, pz: 70, tx: 0, ty: -3, tz: 0, build: 1, night: 1 }]
  ];
  function measure() {
    vh = innerHeight; var out = [];
    SHOTS.forEach(function (s) { var el = $(s[0]); if (!el) return; var top = 0, e = el; while (e) { top += e.offsetTop; e = e.offsetParent; } out.push({ y: top + el.offsetHeight * s[1], s: s[2] }); });
    out.sort(function (a, b) { return a.y - b.y; }); anchors = out; measureWork();
  }
  var KEYS = ["px", "py", "pz", "tx", "ty", "tz", "build", "night"];
  function shotAt(y) {
    var c = y + vh * 0.5, a = anchors; if (!a.length) return null; if (c <= a[0].y) return a[0].s; if (c >= a[a.length - 1].y) return a[a.length - 1].s;
    for (var i = 0; i < a.length - 1; i++) if (c >= a[i].y && c <= a[i + 1].y) { var t = smooth((c - a[i].y) / Math.max(1, a[i + 1].y - a[i].y)), r = {}; KEYS.forEach(function (k) { r[k] = a[i].s[k] + (a[i + 1].s[k] - a[i].s[k]) * t; }); return r; }
    return a[0].s;
  }
  var lastPush = 0;
  function pushScene(y) {
    if (!scene) return; var s = shotAt(y); if (!s) return;
    var asp = innerWidth / innerHeight, k = asp < 0.8 ? 1 + (0.8 - asp) * 1.1 : 1;           /* portrait : on recule un peu */
    var o = {}; KEYS.forEach(function (key) { o[key] = s[key]; });
    if (k > 1) { o.px = s.tx + (s.px - s.tx) * k; o.pz = s.tz + (s.pz - s.tz) * k; o.py = s.ty + (s.py - s.ty) * k; }
    scene.setState(o);
    if (reduce) { scene.snap(); scene.renderOnce(); }
  }
  onScroll(pushScene);
  addEventListener("resize", function () { measure(); pushScene(readY()); });
  addEventListener("load", function () { measure(); pushScene(readY()); setTimeout(function () { measure(); pushScene(readY()); }, 800); });
  measure();
  if (window.ResizeObserver) { var rt; new ResizeObserver(function () { clearTimeout(rt); rt = setTimeout(function () { measure(); pushScene(readY()); }, 120); }).observe(document.body); }

  function glInfo() {
    try { var c = document.createElement("canvas"), gl = c.getContext("webgl2") || c.getContext("webgl"); if (!gl) return null; var ext = gl.getExtension("WEBGL_debug_renderer_info"); var r = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : ""; return { soft: /swiftshader|llvmpipe|software|basic render/i.test(r), name: r }; } catch (e) { return null; }
  }
  (function boot() {
    var force = /gl=force/.test(location.hash), info = glInfo();
    var saver = navigator.connection && navigator.connection.saveData, weakCPU = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) || (navigator.deviceMemory && navigator.deviceMemory <= 2);
    if (!info || (!force && (info.soft || saver))) return;                    /* poster statique conservé */
    var mobile = coarse || innerWidth < 900, lite = /lite/.test(location.hash);
    import("./scene.js").then(function (m) {
      scene = m.createScene($("#gl"), { mobile: mobile, weak: !!weakCPU || lite, shadows: !mobile && !weakCPU && !lite }); window.__scene = scene;
      pushScene(readY()); if (reduce) { scene.snap(); scene.renderOnce(); } else { var s = shotAt(readY()); if (s && readY() > 200) scene.snap(); }
      root.classList.add("gl-on");
    }).catch(function (e) { if (window.console) console.warn("Scène 3D indisponible, poster conservé.", e); });
  })();

  /* ------------------------------------------------------------ curseur additif, tilt, aimant */
  var cur = $("#cursor");
  if (!coarse && !reduce) {
    var cx = 0, cy = 0, tx = 0, ty = 0, on = false;
    addEventListener("pointermove", function (e) { tx = e.clientX; ty = e.clientY; if (!on) { on = true; cx = tx; cy = ty; cur.classList.add("on"); } }, { passive: true });
    (function loop() { cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18; cur.style.transform = "translate3d(" + cx + "px," + cy + "px,0)"; requestAnimationFrame(loop); })();
    document.addEventListener("pointerover", function (e) { cur.classList.toggle("hov", !!(e.target.closest && e.target.closest("a, button, [data-tilt], input, textarea, label"))); });
    $$("[data-tilt]").forEach(function (c) {
      c.addEventListener("pointermove", function (e) { var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; c.style.transform = "rotateY(" + (x * 9).toFixed(2) + "deg) rotateX(" + (-y * 9).toFixed(2) + "deg) translateY(-4px)"; });
      c.addEventListener("pointerleave", function () { c.style.transform = ""; });
    });
    $$("[data-magnet]").forEach(function (b) {
      b.addEventListener("pointermove", function (e) { var r = b.getBoundingClientRect(), x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2); b.style.transform = "translate(" + (x * 0.18).toFixed(1) + "px," + (y * 0.28).toFixed(1) + "px)"; });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
  }

  /* ------------------------------------------------------------ carte de la zone d'intervention (projection réelle, repères indicatifs) */
  (function mapZone() {
    var svg = $("#zoneMap"); if (!svg) return; var NS = "http://www.w3.org/2000/svg", C = [280, 280], home = { n: "Châtillon-sur-Chalaronne", la: 46.1206, lo: 4.9617 }, pxkm = 2.6;
    function P(la, lo) { return [C[0] + (lo - home.lo) * Math.cos(home.la * Math.PI / 180) * 111.32 * pxkm, C[1] - (la - home.la) * 110.57 * pxkm]; }
    function el(n, a, t) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); if (t) e.textContent = t; svg.appendChild(e); return e; }
    var defs = el("defs", {}); var g = document.createElementNS(NS, "linearGradient"); g.setAttribute("id", "sw"); g.setAttribute("x1", "0"); g.setAttribute("x2", "1"); g.innerHTML = '<stop offset="0" stop-color="#7dffc6" stop-opacity="0"/><stop offset="1" stop-color="#7dffc6" stop-opacity=".34"/>'; defs.appendChild(g);
    [25, 50, 75, 100].forEach(function (km) { el("circle", { cx: C[0], cy: C[1], r: km * pxkm, class: "m-ring" }); el("text", { x: C[0] + 6, y: C[1] - km * pxkm - 5, class: "m-ringt" }, km + " KM"); });
    el("line", { x1: C[0], y1: 14, x2: C[0], y2: 546, class: "m-line" }); el("line", { x1: 14, y1: C[1], x2: 546, y2: C[1], class: "m-line" });
    el("path", { d: "M280 280 L280 20 A260 260 0 0 1 463.8 96.200 Z", fill: "url(#sw)", class: "m-sweep" });
    /* repères : k = "real" (réalisation du site) / "ref" (ville repère) ; dx, dy, a = décalage et ancrage du libellé */
    var places = [
      { n: "Lyon", la: 45.764, lo: 4.8357, k: "ref", dx: 10, dy: 4, a: "start" }, { n: "Villefranche-sur-Saône", la: 45.9857, lo: 4.7192, k: "ref", dx: -10, dy: 4, a: "end" },
      { n: "Mâcon", la: 46.3069, lo: 4.8287, k: "ref", dx: -9, dy: -3, a: "end" }, { n: "Bourg-en-Bresse", la: 46.2052, lo: 5.2255, k: "ref", dx: 10, dy: -6, a: "start" },
      { n: "Nantua", la: 46.1544, lo: 5.6086, k: "real", dx: 10, dy: 14, a: "start" }, { n: "Châtillon-en-Michaille", la: 46.15, lo: 5.8, k: "real", dx: 10, dy: -8, a: "start" },
      { n: "Saint-Genis-Pouilly", la: 46.2417, lo: 6.0214, k: "real", dx: -10, dy: -10, a: "end" }, { n: "Manziat", la: 46.2989, lo: 4.9167, k: "real", dx: 10, dy: -4, a: "start" },
      { n: "La Chapelle-du-Châtelard", la: 46.0764, lo: 5.0647, k: "real", dx: 10, dy: 12, a: "start" }
    ];
    places.forEach(function (p) {
      var xy = P(p.la, p.lo);
      el("circle", { cx: xy[0], cy: xy[1], r: p.k === "real" ? 4.4 : 3.2, class: "m-dot", fill: p.k === "real" ? "#c6ff7a" : "#7dffc6" });
      el("text", { x: xy[0] + p.dx, y: xy[1] + p.dy, "text-anchor": p.a, class: "m-lbl" + (p.k === "real" ? "" : " sub") }, p.n);
    });
    var h = P(home.la, home.lo); el("circle", { cx: h[0], cy: h[1], r: 9, class: "m-pulse" }); el("circle", { cx: h[0], cy: h[1], r: 6, class: "m-home" });
    el("text", { x: h[0] - 4, y: h[1] - 30, "text-anchor": "end", class: "m-lbl home" }, "Châtillon-sur-Chalaronne"); el("text", { x: h[0] - 4, y: h[1] - 16, "text-anchor": "end", class: "m-lbl sub" }, "siège de SOCAP");
    var list = $("#zoneList"); [["Ain (01)", 1], ["Rhône (69)", 0], ["Mâconnais", 0], ["Châtillon-sur-Chalaronne · siège", 1]].forEach(function (c) { var li = document.createElement("li"); li.textContent = c[0]; if (c[1]) li.className = "pin"; list.appendChild(li); });
  })();

  /* ------------------------------------------------------------ formulaire */
  var form = $("#form"), msg = $("#formMsg");
  form.addEventListener("submit", function (e) {
    e.preventDefault(); var ok = true; $$("input[required], textarea[required]", form).forEach(function (f) { var bad = f.type === "checkbox" ? !f.checked : !f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value)); f.classList.toggle("bad", bad); if (bad) ok = false; });
    if (!ok) { msg.textContent = "Merci de compléter les champs marqués d’une étoile (et d’accepter la politique de confidentialité)."; var b = $(".bad", form); if (b) b.focus(); return; }
    var d = {}; new FormData(form).forEach(function (v, k) { d[k] = String(v).trim(); });
    var body = "Demande de devis (site SOCAP)\n\nNom : " + d.nom + "\nPrénom : " + (d.prenom || "-") + "\nAdresse : " + (d.adresse || "-") + "\nCode postal / ville : " + (d.cp || "-") + " " + d.ville + "\nTéléphone : " + (d.tel || "-") + "\nE-mail : " + d.email + "\n\nProjet :\n" + (d.msg || "-");
    if (CONFIG.email) { location.href = "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent("Demande de devis — " + d.nom) + "&body=" + encodeURIComponent(body); msg.innerHTML = "<b>Merci !</b> Votre messagerie s’ouvre avec votre demande, il ne reste qu’à l’envoyer."; }
    else { msg.innerHTML = "<b>Merci " + d.nom.replace(/[<>&]/g, "") + " !</b> Cette maquette n’envoie pas encore de message : à la mise en ligne, le formulaire sera relié à la boîte mail de SOCAP. En attendant, appelez-nous au <a href=\"tel:+33474550098\" target=\"_blank\" rel=\"noopener\">" + CONFIG.phone + "</a>."; }
  });
  $$("input, textarea", form).forEach(function (f) { f.addEventListener("input", function () { f.classList.remove("bad"); }); });

  /* ------------------------------------------------------------ mentions légales */
  var dlg = $("#legal");
  $$("[data-open='legal']").forEach(function (b) { b.addEventListener("click", function () { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); }); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", function () { if (lenis) lenis.start(); });
})();
