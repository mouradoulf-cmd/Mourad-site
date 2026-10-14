/* SOCAP — interactions du site. Vanilla JS, une seule dépendance : Lenis (défilement doux, auto-hébergé).
   - Le diaporama du héros est dans hero.js (WebGL brut) ; sans WebGL la photo reste affichée.
   - Contenus visibles par défaut : l'état « caché » des révélations n'est activé qu'une fois l'IntersectionObserver confirmé.
   - Le curseur personnalisé est un anneau ADDITIF : le curseur natif n'est jamais masqué. */
(function () {
  "use strict";
  var CONFIG = {
    phone: "04 74 55 00 98",
    email: "",                       /* À RENSEIGNER : adresse qui reçoit les demandes de devis (le formulaire ouvre alors le client mail) */
    foundedYear: 1983
  };
  var root = document.documentElement, $ = function (s, c) { return (c || document).querySelector(s); }, $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches, coarse = matchMedia("(hover: none), (pointer: coarse)").matches;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); }, smooth = function (t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  var vh = innerHeight;

  /* ------------------------------------------------------------ défilement doux (Lenis) + bus de scroll */
  var lenis = null;
  function readY() { return lenis ? lenis.scroll : (window.pageYOffset || 0); }
  var lite = matchMedia("(hover: none), (max-width: 900px)").matches; if (lite) root.classList.add("lite");
  if (!reduce && !lite && window.Lenis) { try { lenis = new window.Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true }); root.classList.add("lenis", "lenis-smooth"); } catch (e) { lenis = null; } }
  var listeners = [], ticking = false;
  function onScroll(fn) { listeners.push(fn); }
  function fire() { ticking = false; var y = readY(); for (var i = 0; i < listeners.length; i++) listeners[i](y); }
  function queue() { if (!ticking) { ticking = true; requestAnimationFrame(fire); } }
  addEventListener("scroll", queue, { passive: true }); if (lenis) lenis.on("scroll", queue);
  (function tick(time) { if (lenis) lenis.raf(time); requestAnimationFrame(tick); })(0);
  function goTo(sel) { var el = $(sel); if (!el) return; var y = el.getBoundingClientRect().top + readY(); if (lenis) lenis.scrollTo(y, { duration: 1.7 }); else scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" }); }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return; var h = a.getAttribute("href"); if (h.length < 2 || !$(h)) return;
    e.preventDefault(); closeMenu(); goTo(h); history.replaceState(null, "", h);
  });

  /* ------------------------------------------------------------ loader : logo qui se dessine, compteur, ouverture en iris */
  var loader = $("#loader"), ldN = $("#ldN"), ldBar = $("#ldBar"), ldDone = false, t0 = performance.now(), heroImg = $("#heroImg");
  function finishLoader() { if (ldDone) return; ldDone = true; ldN.textContent = "100"; ldBar.style.transform = "scaleX(1)"; setTimeout(function () { loader.classList.add("done"); root.classList.add("ready"); }, 280); }
  (function countUp() {
    var heroReady = !heroImg || (heroImg.complete && heroImg.naturalWidth), minMs = reduce ? 300 : 2300;
    if (heroImg && !heroReady) { heroImg.addEventListener("load", function () { heroReady = true; }); heroImg.addEventListener("error", function () { heroReady = true; }); }
    (function step() {
      if (ldDone) return; var k = clamp((performance.now() - t0) / minMs, 0, 1), v = Math.round(100 * (1 - Math.pow(1 - k, 2.2)) * (heroReady ? 1 : 0.9));
      ldN.textContent = String(v); ldBar.style.transform = "scaleX(" + v / 100 + ")";
      if (k >= 1 && heroReady) return finishLoader(); requestAnimationFrame(step);
    })();
    setTimeout(finishLoader, 6500);
  })();

  /* ------------------------------------------------------------ en-tête, menu, progression, rail, retour en haut */
  var hd = $("#hd"), nav = $("#nav"), burger = $("#burger"), prog = $("#progress i"), lastY = 0, ring = $("#totopRing"), totop = $("#totop");
  function closeMenu() { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Ouvrir le menu"); if (lenis) lenis.start(); document.body.style.overflow = ""; }
  burger.addEventListener("click", function () { var o = !nav.classList.contains("open"); nav.classList.toggle("open", o); burger.setAttribute("aria-expanded", String(o)); burger.setAttribute("aria-label", o ? "Fermer le menu" : "Ouvrir le menu"); if (o) { if (lenis) lenis.stop(); document.body.style.overflow = "hidden"; } else closeMenu(); });
  addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  totop.addEventListener("click", function () { goTo("#top"); });
  onScroll(function (y) {
    hd.classList.toggle("solid", y > 40); var down = y > lastY && y > 520; hd.classList.toggle("hide", down && !nav.classList.contains("open")); lastY = y;
    var max = document.documentElement.scrollHeight - innerHeight, k = max > 0 ? clamp(y / max, 0, 1) : 0; prog.style.transform = "scaleX(" + k + ")"; ring.style.strokeDashoffset = String(1 - k); totop.classList.toggle("show", y > 700);
  });
  var secIds = ["top", "manifeste", "plan", "prestations", "realisations", "zone", "contact"], railA = $$("#rail a"), navA = $$("#nav a");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting) return; var id = e.target.id; railA.forEach(function (a) { a.classList.toggle("act", a.getAttribute("href") === "#" + id); }); navA.forEach(function (a) { a.classList.toggle("act", a.getAttribute("href") === "#" + id); }); }); }, { rootMargin: "-45% 0px -50% 0px" });
    secIds.forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }

  /* horloge locale (Châtillon-sur-Chalaronne) */
  (function clock() { var el = $("#clock"); if (!el) return; var f; try { f = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" }); } catch (e) { return; } (function t() { el.textContent = f.format(new Date()); setTimeout(t, 15000); })(); })();

  /* ------------------------------------------------------------ héros : légende + segments de progression */
  var hsP = $("#hsP"), segs = [];
  (function heroUI() {
    var H = window.SocapHero; if (!H) return;
    H.slides.forEach(function (s, i) { var b = document.createElement("button"); b.type = "button"; b.setAttribute("role", "tab"); b.setAttribute("aria-label", "Diapositive " + (i + 1) + " : " + s.t); b.innerHTML = "<i></i>"; b.addEventListener("click", function () { H.go(i, true); }); hsP.appendChild(b); segs.push(b); });
    H.on(function (i, s) {
      $("#hsI").textContent = (i < 9 ? "0" : "") + (i + 1); $("#hsT").textContent = s.t; $("#hsL").textContent = s.l;
      segs.forEach(function (b, k) { b.classList.remove("on", "done"); b.setAttribute("aria-selected", String(k === i)); if (k < i) b.classList.add("done"); }); void hsP.offsetWidth; segs[i].classList.add("on");
      var cap = $(".cap"); if (cap) { cap.classList.remove("swap"); void cap.offsetWidth; cap.classList.add("swap"); }
    });
  })();

  /* ------------------------------------------------------------ révélations (visibles par défaut) */
  var rvSel = ".h2, .lead, .eyebrow:not(.hero .eyebrow), .mani__txt p, .ring, .vows__g li, .proj__b, .zone__list, .zone__note, .addr, .bigtel, .form, .ft__g > div, .svc__list, .svc__stage";
  if ("IntersectionObserver" in window && !reduce) {
    var items = $$(rvSel).filter(function (el) { return !el.closest(".plan__txt, .hero, .work__head"); });
    items.forEach(function (el) { el.classList.add("rv"); var sib = el.parentElement ? [].indexOf.call(el.parentElement.children, el) : 0; el.style.setProperty("--d", Math.min(sib, 5) * 0.08 + "s"); });
    var rio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); rio.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    root.classList.add("rv-on"); items.forEach(function (el) { rio.observe(el); });
    setTimeout(function () { items.forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add("in"); }); }, 3000);
  }

  /* ------------------------------------------------------------ manifeste : le texte s'allume mot par mot */
  var maniT = $("#maniT"), words = [];
  if (maniT) {
    var txt = maniT.textContent.trim().split(/\s+/); maniT.textContent = ""; txt.forEach(function (w, i) { var s = document.createElement("span"); s.className = "w"; s.textContent = w + (i < txt.length - 1 ? " " : ""); maniT.appendChild(s); words.push(s); });
    if (!reduce) maniT.classList.add("js");
    onScroll(function () { if (reduce) return; var r = maniT.getBoundingClientRect(), p = clamp((innerHeight * .82 - r.top) / (r.height + innerHeight * .32), 0, 1), n = Math.round(p * words.length); for (var i = 0; i < words.length; i++) words[i].classList.toggle("on", i < n); });
  }
  /* anneaux + compteurs */
  var yrs = new Date().getFullYear() - CONFIG.foundedYear;
  $$("[data-count]").forEach(function (el) { if (el.getAttribute("data-count") === "43") el.setAttribute("data-count", String(yrs)); el.textContent = el.getAttribute("data-count"); });
  $$(".ring .fg").forEach(function (c) { c.style.strokeDasharray = "1"; c.style.strokeDashoffset = reduce ? String(1 - parseFloat(c.parentNode.parentNode.getAttribute("data-ring"))) : "1"; });
  if ("IntersectionObserver" in window && !reduce) {
    var cio = new IntersectionObserver(function (es) { es.forEach(function (e) {
      if (!e.isIntersecting) return; cio.unobserve(e.target); var ringEl = e.target, c = $(".fg", ringEl), ratio = parseFloat(ringEl.getAttribute("data-ring")), b = $("[data-count]", ringEl), to = b ? +b.getAttribute("data-count") : 0, t = performance.now();
      (function step(n) { var k = smooth((n - t) / 1700); c.style.strokeDashoffset = String(1 - ratio * k); if (b) b.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); else if (b) b.textContent = to; })(t);
    }); }, { threshold: 0.5 });
    $$(".ring").forEach(function (r) { cio.observe(r); });
  }

  /* ------------------------------------------------------------ « plan -> photo » : le scroll révèle la vraie photo derrière le tracé */
  var plan = $("#plan"), steps = $$("#steps li"), planFill = $("#planFill"), hudState = $("#hudState"), HUD = ["ÉTAPE 01 · ÉTUDE", "ÉTAPE 02 · TERRAIN", "ÉTAPE 03 · MATÉRIAUX", "ÉTAPE 04 · VÉGÉTAL & EAU", "ÉTAPE 05 · SUIVI"], curStep = -1;
  var figs = $$("#stage figure"), scanEl = $("#scan"), calsEl = $("#cals"), curFig = -1;
  var CALS = [
    [["Bassin d’ornement", 50, 44], ["Haies taillées", 18, 72], ["Allée sablée", 82, 30]],
    [["Maçonnerie paysagère", 30, 82], ["Topiaires", 52, 38], ["Haie persistante", 78, 24]],
    [["Terrasse", 56, 46], ["Pas japonais", 64, 86], ["Mur en pierre", 66, 24]],
    [["Franchissement", 52, 40], ["Cours d’eau", 46, 82], ["Gazon", 20, 70]],
    [["Platelage bois", 30, 66], ["Bassin", 62, 78], ["Éclairage", 54, 38]]
  ];
  function planProgress(y) { return clamp((y - plan.offsetTop) / Math.max(1, plan.offsetHeight - innerHeight), 0, 1); }
  function ease(t) { t = clamp(t, 0, 1); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function buildCals(f) { calsEl.innerHTML = ""; CALS[f].forEach(function (c, i) { var d = document.createElement("div"); d.className = "cal"; d.style.left = c[1] + "%"; d.style.top = c[2] + "%"; d.style.setProperty("--i", i); d.innerHTML = "<i></i><span>" + c[0] + "</span>"; calsEl.appendChild(d); }); }
  function stageUpdate(p) {
    var n = figs.length, f = Math.min(n - 1, Math.floor(p * n)), t = p * n - f, k = ease((t - 0.04) / 0.5);
    if (f !== curFig) { curFig = f; figs.forEach(function (fg, i) { fg.classList.toggle("on", i === f); }); buildCals(f); }
    var cut = (1 - k) * 100; if (lite) { var rv = k > 0.35; if (figs[f].classList.contains("rev") !== rv) figs[f].classList.toggle("rev", rv); } else figs[f].style.setProperty("--cut", cut.toFixed(2) + "%"); calsEl.classList.toggle("in", k > 0.92);
    if (scanEl && !lite) { scanEl.style.left = cut.toFixed(2) + "%"; scanEl.style.opacity = k > 0.02 && k < 0.985 ? 1 : 0; }
    var s = Math.min(steps.length - 1, Math.floor(p * steps.length)); planFill.style.transform = "scaleY(" + p + ")";
    if (s !== curStep) { curStep = s; steps.forEach(function (li, i) { li.classList.toggle("on", i === s); }); if (hudState) hudState.textContent = HUD[s]; }
  }
  onScroll(function (y) { stageUpdate(planProgress(y)); });
  figs.forEach(function (fg, i) { if (i) fg.querySelector(".ph").style.setProperty("--cut", "100%"); }); stageUpdate(0);

  /* ------------------------------------------------------------ prestations : explorateur */
  var SVC = [
    ["Terrasses et dallage", "Zone de vie reliant la maison au jardin, nos terrasses sont de véritables pièces à vivre, esthétiques et fonctionnelles. Nous vous guidons dans le choix des matériaux les mieux adaptés à vos besoins.", ["Grès cérame", "Pierre naturelle, locale ou exotique", "Bois composite", "Bois exotique ou local"]],
    ["Cours, allées et parkings", "Premier accès à votre maison : nous vous guidons dans le choix des matériaux et l’agencement de vos cours, allées et parkings. Nous allions praticité et esthétique, dans l’Ain (01) et le Rhône (69).", ["Pavage", "Dallage", "Sable stabilisé", "Béton désactivé", "Enrobé", "Bordures"]],
    ["Plantations et gazons", "Nous aménageons votre jardin selon vos goûts. SOCAP fait partie du groupe Pépinières Daniel Soupe, dans l’Ain (01), pour vous assurer des produits cultivés localement et de première qualité.", ["Arbustes", "Massifs fleuris", "Haies", "Arbres", "Talus", "Gazons, prairies, pelouses"]],
    ["Plantation de grands sujets", "Nos connaissances et nos équipements spécifiques permettent de planter des sujets d’exception, ou de transplanter les grands sujets déjà présents dans votre jardin. Nous intervenons dans l’Ain et le Rhône.", ["Sujets d’exception", "Transplantation", "Ain et Rhône"]],
    ["Bassins et fontaines", "Création et réalisation de vos bassins d’ornement, étangs de jardin, fontaines, cascades ou jeux d’eau. Terrassements, étanchéité, filtration et stérilisateur UV garantissent la qualité et la clarté de l’eau.", ["Bassins d’ornement", "Étangs de jardin", "Cascades", "Étanchéité en bâche", "Filtration + UV", "Bassins maçonnés"]],
    ["Murs, enrochements, maçonnerie paysagère", "Aplanir, stabiliser un terrain en pente, créer ou réaménager un espace de vie extérieur, délimiter les espaces de façon fonctionnelle et esthétique : nous concevons et réalisons toutes sortes de murs et d’enrochements, dans l’Ain (01) et autour de Lyon (69).", ["Murs", "Enrochements", "Soutènements", "Terrains en pente"]],
    ["Escaliers", "La solution la plus adaptée pour relier les différents paliers du jardin ou accéder à votre maison ou à votre terrasse : différents matériaux qui allient esthétique et praticité.", ["Pierre taillée", "Dalles d’enrochement", "Bois", "Pavés", "Métal"]],
    ["Clôtures et portails", "Pour intimiser ou protéger, nous vous conseillons dans le choix et la pose de clôtures et portails, dans l’Ain et la région lyonnaise : ajourés ou occultants, contemporains ou rustiques, en divers matériaux et coloris.", ["Treillis soudé", "Simple torsion", "Brise-vue", "Soubassement béton", "Claustras aluminium ou bois"]],
    ["Pergolas, carports, équipements", "Pergola ombragée, abri de jardin en bois ou en composite pour ranger outils et mobilier, carport pour mettre vos véhicules à l’abri des intempéries : conception et installation d’équipements de jardin et de solutions sur mesure.", ["Pergolas", "Abris de jardin", "Carports", "Sur mesure"]]
  ];
  var svcBtns = $$("#svcList button"), svcFigs = $$(".svc__imgs figure"), svcCur = -1, svcTimer = 0, svcUser = false, svcVisible = false;
  function svcSelect(i) {
    if (i === svcCur) return; svcCur = i;
    svcBtns.forEach(function (b, k) { b.setAttribute("aria-selected", String(k === i)); b.classList.toggle("on", k === i); }); svcFigs.forEach(function (f, k) { f.classList.toggle("on", k === i); }); if (svcBtns[i].parentNode.parentNode && matchMedia("(max-width:900px)").matches) { var L = svcBtns[i].parentNode, P = L.parentNode; P.scrollTo({ left: L.offsetLeft - 16, behavior: "smooth" }); }
    var d = SVC[i], p = $(".svc__panel"); p.classList.remove("swap"); void p.offsetWidth; p.classList.add("swap");
    $("#svcNo").textContent = (i < 9 ? "0" : "") + (i + 1) + " / 09"; $("#svcT").textContent = d[0]; $("#svcD").textContent = d[1]; $("#svcTags").innerHTML = d[2].map(function (t) { return "<li>" + t + "</li>"; }).join("");
  }
  svcBtns.forEach(function (b, i) { b.addEventListener("click", function () { svcUser = true; svcSelect(i); }); b.addEventListener("mouseenter", function () { if (!coarse) { svcUser = true; svcSelect(i); } }); b.addEventListener("keydown", function (e) { var k = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0; if (k) { e.preventDefault(); var n = (i + k + svcBtns.length) % svcBtns.length; svcBtns[n].focus(); svcUser = true; svcSelect(n); } }); });
  svcSelect(0);
  if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { svcVisible = e[0].isIntersecting; }, { threshold: 0.35 }).observe($("#svc"));
  if (!reduce) setInterval(function () { if (svcVisible && !svcUser) svcSelect((svcCur + 1) % SVC.length); }, 5200);

  /* ------------------------------------------------------------ réalisations : défilement horizontal épinglé */
  var work = $("#realisations"), track = $("#wTrack"), wCur = $("#wCur"), wMax = 0, nProj = $$(".proj", track).length, mobileMQ = matchMedia("(max-width: 900px)");
  function measureWork() { wMax = Math.max(0, track.scrollWidth - innerWidth + (parseFloat(getComputedStyle(track).paddingLeft) || 0)); }
  onScroll(function (y) {
    if (mobileMQ.matches) { track.style.transform = ""; return; }
    var p = clamp((y - work.offsetTop) / Math.max(1, work.offsetHeight - innerHeight), 0, 1);
    track.style.transform = "translate3d(" + (-p * wMax).toFixed(1) + "px,0,0)"; var n = Math.min(nProj, Math.round(p * (nProj - 1)) + 1); wCur.textContent = (n < 10 ? "0" : "") + n;
  });
  track.addEventListener("scroll", function () { if (!mobileMQ.matches) return; var n = Math.round(track.scrollLeft / (track.scrollWidth / nProj)) + 1; wCur.textContent = (n < 10 ? "0" : "") + clamp(n, 1, nProj); }, { passive: true });
  function measure() { vh = innerHeight; measureWork(); }
  addEventListener("resize", measure); addEventListener("load", measure); measure();
  if (window.ResizeObserver) { var rt; new ResizeObserver(function () { clearTimeout(rt); rt = setTimeout(measure, 120); }).observe(document.body); }

  /* parallaxe douce */
  var pars = $$("[data-par]");
  if (pars.length && !reduce) onScroll(function () { pars.forEach(function (f, i) { var r = f.getBoundingClientRect(); if (r.bottom < -200 || r.top > innerHeight + 200) return; var k = (r.top + r.height / 2 - innerHeight / 2) / innerHeight, sp = [-44, 34, -22][i % 3]; f.style.transform = "translate3d(0," + (k * sp).toFixed(1) + "px,0)"; }); });

  /* ------------------------------------------------------------ curseur additif, tilt, aimant */
  var cur = $("#cursor"), curT = $("#cursorT");
  if (!coarse && !reduce) {
    var cx = 0, cy = 0, tx = 0, ty = 0, on = false;
    addEventListener("pointermove", function (e) { tx = e.clientX; ty = e.clientY; if (!on) { on = true; cx = tx; cy = ty; cur.classList.add("on"); } }, { passive: true });
    (function loop() { cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18; cur.style.transform = "translate3d(" + cx + "px," + cy + "px,0)"; requestAnimationFrame(loop); })();
    document.addEventListener("pointerover", function (e) {
      var t = e.target.closest ? e.target.closest("a, button, input, textarea, label, .proj, .svc__stage") : null; cur.classList.toggle("hov", !!t);
      var lbl = t && t.classList.contains("proj") ? "Voir" : t && t.classList.contains("svc__stage") ? "" : ""; curT.textContent = lbl; cur.classList.toggle("lbl", !!lbl);
    });
    $$("[data-magnet]").forEach(function (b) {
      b.addEventListener("pointermove", function (e) { var r = b.getBoundingClientRect(), x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2); b.style.transform = "translate(" + (x * 0.18).toFixed(1) + "px," + (y * 0.28).toFixed(1) + "px)"; });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
    var zw = $("#zoneWrap"); if (zw) { zw.addEventListener("pointermove", function (e) { var r = zw.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; zw.style.setProperty("--rx", (40 - y * 10).toFixed(1) + "deg"); zw.style.setProperty("--rz", (-10 + x * 14).toFixed(1) + "deg"); }); }
  }

  /* ------------------------------------------------------------ carte de la zone d'intervention (projection réelle, repères indicatifs) */
  (function mapZone() {
    var svg = $("#zoneMap"); if (!svg) return; var NS = "http://www.w3.org/2000/svg", C = [280, 280], home = { la: 46.1206, lo: 4.9617 }, pxkm = 2.6;
    function P(la, lo) { return [C[0] + (lo - home.lo) * Math.cos(home.la * Math.PI / 180) * 111.32 * pxkm, C[1] - (la - home.la) * 110.57 * pxkm]; }
    function el(n, a, t) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); if (t) e.textContent = t; svg.appendChild(e); return e; }
    var defs = el("defs", {}); var g = document.createElementNS(NS, "linearGradient"); g.setAttribute("id", "sw"); g.setAttribute("x1", "0"); g.setAttribute("x2", "1"); g.innerHTML = '<stop offset="0" stop-color="#7dffc6" stop-opacity="0"/><stop offset="1" stop-color="#7dffc6" stop-opacity=".34"/>'; defs.appendChild(g);
    [25, 50, 75, 100].forEach(function (km) { el("circle", { cx: C[0], cy: C[1], r: km * pxkm, class: "m-ring" }); el("text", { x: C[0] + 6, y: C[1] - km * pxkm - 5, class: "m-ringt" }, km + " KM"); });
    el("line", { x1: C[0], y1: 14, x2: C[0], y2: 546, class: "m-line" }); el("line", { x1: 14, y1: C[1], x2: 546, y2: C[1], class: "m-line" });
    el("path", { d: "M280 280 L280 20 A260 260 0 0 1 463.8 96.2 Z", fill: "url(#sw)", class: "m-sweep" });
    var places = [
      { n: "Lyon", la: 45.764, lo: 4.8357, k: "ref", dx: 10, dy: 4, a: "start" }, { n: "Villefranche-sur-Saône", la: 45.9857, lo: 4.7192, k: "ref", dx: -10, dy: 4, a: "end" },
      { n: "Mâcon", la: 46.3069, lo: 4.8287, k: "ref", dx: -9, dy: -3, a: "end" }, { n: "Bourg-en-Bresse", la: 46.2052, lo: 5.2255, k: "ref", dx: 10, dy: -6, a: "start" },
      { n: "Nantua", la: 46.1544, lo: 5.6086, k: "real", dx: 10, dy: 14, a: "start" }, { n: "Châtillon-en-Michaille", la: 46.15, lo: 5.8, k: "real", dx: 10, dy: -8, a: "start" },
      { n: "Saint-Genis-Pouilly", la: 46.2417, lo: 6.0214, k: "real", dx: -10, dy: -10, a: "end" }, { n: "Manziat", la: 46.2989, lo: 4.9167, k: "real", dx: 10, dy: -4, a: "start" },
      { n: "La Chapelle-du-Châtelard", la: 46.0764, lo: 5.0647, k: "real", dx: 10, dy: 12, a: "start" }
    ];
    var h = P(home.la, home.lo);
    places.filter(function (p) { return p.k === "real"; }).forEach(function (p, i) { var xy = P(p.la, p.lo), mx = (h[0] + xy[0]) / 2, my = (h[1] + xy[1]) / 2 - 28 - Math.hypot(xy[0] - h[0], xy[1] - h[1]) * .22; el("path", { d: "M" + h[0] + " " + h[1] + " Q" + mx + " " + my + " " + xy[0] + " " + xy[1], class: "m-arc", style: "animation-delay:" + (i * .35) + "s" }); });
    places.forEach(function (p) {
      var xy = P(p.la, p.lo);
      el("circle", { cx: xy[0], cy: xy[1], r: p.k === "real" ? 4.4 : 3.2, class: "m-dot", fill: p.k === "real" ? "#c6ff7a" : "#7dffc6" });
      el("text", { x: xy[0] + p.dx, y: xy[1] + p.dy, "text-anchor": p.a, class: "m-lbl" + (p.k === "real" ? "" : " sub") }, p.n);
    });
    el("circle", { cx: h[0], cy: h[1], r: 9, class: "m-pulse" }); el("circle", { cx: h[0], cy: h[1], r: 6, class: "m-home" });
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
    else { msg.innerHTML = "<b>Merci " + d.nom.replace(/[<>&]/g, "") + " !</b> Ce formulaire n’envoie pas encore de message : à la mise en ligne, il sera relié à la boîte mail de SOCAP. En attendant, appelez-nous au <a href=\"tel:+33474550098\" target=\"_blank\" rel=\"noopener\">" + CONFIG.phone + "</a>."; }
  });
  $$("input, textarea", form).forEach(function (f) { f.addEventListener("input", function () { f.classList.remove("bad"); }); });

  /* ------------------------------------------------------------ mentions légales */
  var dlg = $("#legal");
  $$("[data-open='legal']").forEach(function (b) { b.addEventListener("click", function () { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); }); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", function () { if (lenis) lenis.start(); });
})();
