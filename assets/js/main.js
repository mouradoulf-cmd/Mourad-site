/* Giulivo — interactions, sans aucune dépendance externe.
 *
 * Ce fichier remplace GSAP + ScrollTrigger + Lenis (chargés depuis un CDN) et
 * le curseur personnalisé. La priorité est la fluidité :
 *   - un seul écouteur de défilement, limité à une image par rafraîchissement,
 *     qui n'écrit qu'un `transform` (jamais de `width`, jamais de lecture de
 *     position) : aucune invalidation de mise en page pendant le défilement ;
 *   - les apparitions, les compteurs et le repérage de section passent par des
 *     IntersectionObserver, pas par un calcul de position à chaque image ;
 *   - l'état masqué des apparitions n'est posé qu'après confirmation que
 *     l'observateur fonctionne (html.reveal-ready), avec un filet de sécurité
 *     de 3 s : sans JS, le contenu est visible d'emblée.
 *
 * Tout est progressif : sans ce fichier la page reste complète et lisible.
 */
(function () {
  "use strict";

  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Année du pied de page ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Préchargeur : le CSS le congédie seul, on le retire proprement ---------- */
  var preloader = document.getElementById("preloader");
  try { sessionStorage.setItem("giulivoIntroSeen", "1"); } catch (e) { /* stockage refusé */ }
  if (preloader) setTimeout(function () { if (preloader.parentNode) preloader.parentNode.removeChild(preloader); }, 3200);

  /* ---------- Un seul écouteur de défilement, une seule écriture ---------- */
  var navbar = document.getElementById("navbar");
  var progressBar = document.getElementById("progressBar");
  var scrollQueued = false;

  function onScrollFrame() {
    scrollQueued = false;
    var y = window.scrollY || window.pageYOffset || 0;
    if (navbar) navbar.classList.toggle("scrolled", y > 40);
    if (progressBar) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? Math.min(1, y / max) : 0;
      progressBar.style.transform = "scaleX(" + ratio.toFixed(4) + ")";
    }
  }
  function queueScroll() {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(onScrollFrame);
  }
  window.addEventListener("scroll", queueScroll, { passive: true });
  window.addEventListener("resize", queueScroll, { passive: true });
  onScrollFrame();

  /* ---------- Diapositives du héros ----------
     Le premier écran ne paie que la première diapositive. Les suivantes ne
     reçoivent leurs sources qu'au moment où elles vont apparaître : le
     décodage est ainsi réparti au lieu de s'exécuter d'un bloc après load
     (c'est ce bloc qui provoquait une tâche principale de plusieurs secondes).
     Sans JS, la première diapositive suffit : rien ne manque. */
  (function heroSlideshow() {
    var slides = $$(".hero__slide");
    if (slides.length < 2 || reduce) return;

    function upgrade(slide) {
      if (!slide.hasAttribute("data-defer")) return;
      $$("source[data-srcset]", slide).forEach(function (s) {
        s.srcset = s.getAttribute("data-srcset");
        s.removeAttribute("data-srcset");
      });
      var img = $("img[data-src]", slide);
      if (img) { img.src = img.getAttribute("data-src"); img.removeAttribute("data-src"); }
      slide.removeAttribute("data-defer");
    }

    var index = 0;
    function advance() {
      var next = (index + 1) % slides.length;
      upgrade(slides[next]);          // une seule diapositive décodée à la fois
      slides[index].classList.remove("is-active");
      index = next;
      slides[index].classList.add("is-active");
    }
    function begin() { setInterval(advance, 7000); }
    if (document.readyState === "complete") setTimeout(begin, 900);
    else window.addEventListener("load", function () { setTimeout(begin, 900); }, { once: true });
  })();

  /* ---------- Braises décoratives du héros (transform + opacité uniquement) ---------- */
  var embersHost = document.getElementById("heroEmbers");
  if (embersHost && !reduce) {
    for (var e = 0; e < 8; e++) {
      var ember = document.createElement("div");
      ember.className = "hero__ember";
      ember.style.left = (42 + Math.random() * 54) + "%";
      ember.style.width = ember.style.height = (2 + Math.random() * 3).toFixed(1) + "px";
      ember.style.setProperty("--drift", (Math.random() * 40 - 20).toFixed(0) + "px");
      ember.style.animationDelay = (Math.random() * 14).toFixed(1) + "s";
      ember.style.animationDuration = (12 + Math.random() * 9).toFixed(1) + "s";
      embersHost.appendChild(ember);
    }
  }

  /* ---------- Apparitions au défilement ----------
     L'état masqué est posé par le script (html.reveal-ready) uniquement après
     confirmation que l'IntersectionObserver fonctionne. Un filet de sécurité
     affiche tout au bout de 3 s quoi qu'il arrive. */
  var revealEls = $$(".reveal");
  function revealAll() {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    revealEls = [];
  }
  if ("IntersectionObserver" in window && !reduce) {
    root.classList.add("reveal-ready");
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealIO.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { revealIO.observe(el); });
    // déjà à l'écran au chargement
    setTimeout(function () {
      revealEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) { el.classList.add("is-visible"); revealIO.unobserve(el); }
      });
    }, 80);
    // filet de sécurité
    setTimeout(revealAll, 3000);
  } else {
    revealAll();
  }

  /* ---------- Compteurs ----------
     La valeur finale est écrite dans le HTML : sans JS, le chiffre est juste. */
  $$(".stat__num").forEach(function (el) {
    var final = el.textContent.trim();
    el.setAttribute("data-final", final);
  });
  function animateCounter(el) {
    var to = parseFloat(el.getAttribute("data-count"));
    if (!isFinite(to)) return;
    var decimals = parseInt(el.getAttribute("data-decimal") || "0", 10);
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduce) { el.textContent = prefix + to.toFixed(decimals) + suffix; return; }
    var from = 0, started = null, dur = 1200;
    requestAnimationFrame(function step(ts) {
      if (started === null) started = ts;
      var p = Math.min(1, (ts - started) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + (from + (to - from) * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = prefix + to.toFixed(decimals) + suffix;
    });
  }
  var counters = $$(".stat__num");
  if (counters.length && "IntersectionObserver" in window) {
    var counterIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        counterIO.unobserve(entry.target);
        animateCounter(entry.target);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { counterIO.observe(el); });
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------- Menu mobile ---------- */
  var burger = document.getElementById("burger");
  var navLinks = document.getElementById("navLinks");
  var menuOpen = false;

  function setMenu(open, returnFocus) {
    if (!burger || !navLinks) return;
    menuOpen = open;
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? (burger.getAttribute("data-label-close") || "Chiudi il menu") : (burger.getAttribute("data-label-open") || "Apri il menu"));
    navLinks.classList.toggle("open", open);
    burger.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      var first = $("a, button", navLinks);
      if (first) setTimeout(function () { first.focus(); }, 60);
    } else if (returnFocus) {
      burger.focus();
    }
  }
  if (burger && navLinks) {
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-controls", "navLinks");
    // Signale que le panneau mobile est pilotable : sans cette classe, le CSS
    // laisse la navigation visible en ligne (utilisable sans JS).
    root.classList.add("menu-ready");
    burger.addEventListener("click", function () { setMenu(!menuOpen); });
    navLinks.addEventListener("click", function (ev) { if (ev.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && menuOpen) { setMenu(false, true); return; }
      // piège de focus simple tant que le menu est ouvert
      if (ev.key === "Tab" && menuOpen) {
        var items = $$("a[href], button", navLinks);
        if (!items.length) return;
        var first = items[0], last = items[items.length - 1];
        if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
        else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
      }
    });
    var desktop = window.matchMedia("(min-width: 761px)");
    var onDesktop = function (m) { if (m.matches && menuOpen) setMenu(false); };
    if (desktop.addEventListener) desktop.addEventListener("change", onDesktop);
  }

  /* ---------- Menu « livre » : onglets, filtre Terra/Mare, modale ---------- */
  var menuTabs = document.getElementById("menuTabs");
  var book = $(".menu-book");

  function moveIndicator(indicator, target) {
    if (!indicator || !target) return;
    indicator.style.transform = "translateX(" + target.offsetLeft + "px)";
    indicator.style.width = target.offsetWidth + "px";
  }

  if (menuTabs && book) {
    book.classList.add("is-book");

    var tabs = $$(".menu-tab", menuTabs);
    var indicator = $(".menu-tabs__indicator", menuTabs);
    var panels = tabs.map(function (t) { return document.getElementById("panel-" + t.getAttribute("data-panel")); });
    var current = 0;

    function select(index, focusTab) {
      current = (index + tabs.length) % tabs.length;
      tabs.forEach(function (t, i) {
        var on = i === current;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        panels[i].classList.toggle("is-active", on);
      });
      moveIndicator(indicator, tabs[current]);
      if (focusTab) tabs[current].focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(i); });
      tab.addEventListener("keydown", function (ev) {
        var k = ev.key;
        if (k === "ArrowRight" || k === "ArrowDown") { ev.preventDefault(); select(i + 1, true); }
        else if (k === "ArrowLeft" || k === "ArrowUp") { ev.preventDefault(); select(i - 1, true); }
        else if (k === "Home") { ev.preventDefault(); select(0, true); }
        else if (k === "End") { ev.preventDefault(); select(tabs.length - 1, true); }
      });
    });
    var prev = document.getElementById("menuPrev");
    var next = document.getElementById("menuNext");
    if (prev) prev.addEventListener("click", function () { select(current - 1); });
    if (next) next.addEventListener("click", function () { select(current + 1); });
    select(0);
    window.addEventListener("resize", function () { moveIndicator(indicator, tabs[current]); }, { passive: true });
  }

  var originToggle = $(".menu-origin");
  if (originToggle && menuTabs) {
    var originBtns = $$(".origin-btn", originToggle);
    var originIndicator = $(".menu-origin__indicator", originToggle);

    function applyOriginFilter(origin) {
      $$(".menu-list__row").forEach(function (row) {
        var o = row.getAttribute("data-origin");
        row.classList.toggle("is-filtered-out", !(origin === "all" || !o || o === origin));
      });
      $$(".menu-panel").forEach(function (panel) {
        var visible = $$(".menu-list__row", panel).filter(function (r) { return !r.classList.contains("is-filtered-out"); });
        panel.classList.toggle("is-empty", visible.length === 0);
      });
    }
    originBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        originBtns.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        originToggle.setAttribute("data-active", btn.getAttribute("data-origin"));
        moveIndicator(originIndicator, btn);
        applyOriginFilter(btn.getAttribute("data-origin"));
      });
    });
    window.addEventListener("resize", function () {
      var active = originBtns.filter(function (b) { return b.classList.contains("is-active"); })[0];
      moveIndicator(originIndicator, active);
    }, { passive: true });
    moveIndicator(originIndicator, originBtns[0]);
  }

  /* ---------- Repérage de la section courante ---------- */
  var sections = $$("main > section[id]");
  var navAnchors = $$(".nav-link");
  if (sections.length && navAnchors.length && "IntersectionObserver" in window) {
    var spyIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navAnchors.forEach(function (a) {
          var on = a.getAttribute("href") === "#" + id;
          a.classList.toggle("is-current", on);
          if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spyIO.observe(s); });
  }

  /* ---------- Modale du menu complet ---------- */
  var modal = document.getElementById("menuModal");
  var openBtn = document.getElementById("openMenuModal");
  if (modal && openBtn) {
    var modalBody = document.getElementById("menuModalBody");
    var modalClose = document.getElementById("menuModalClose");
    var panelsSource = document.getElementById("menuPanels");
    var lastFocused = null;

    function build() {
      if (!modalBody || !panelsSource) return;
      modalBody.innerHTML = "";
      $$(".menu-panel", panelsSource).forEach(function (panel) {
        var cat = document.createElement("section");
        cat.className = "menu-modal__cat";
        var h = document.createElement("h3");
        h.textContent = panel.getAttribute("data-label") || "";
        cat.appendChild(h);
        var note = $(".menu-list__note", panel);
        if (note) cat.appendChild(note.cloneNode(true));
        var grid = $(".menu-panel__grid", panel);
        if (grid) cat.appendChild(grid.cloneNode(true));
        modalBody.appendChild(cat);
      });
    }
    function open() {
      lastFocused = document.activeElement;
      build();
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      if (modalClose) modalClose.focus();
    }
    function close() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }
    openBtn.addEventListener("click", open);
    if (modalClose) modalClose.addEventListener("click", close);
    $$("[data-modal-close]", modal).forEach(function (el) { el.addEventListener("click", close); });
    document.addEventListener("keydown", function (ev) {
      if (!modal.classList.contains("is-open")) return;
      if (ev.key === "Escape") { close(); return; }
      if (ev.key === "Tab") {
        var items = $$("a[href], button", modal).filter(function (el) { return el.offsetWidth > 0; });
        if (!items.length) return;
        var first = items[0], last = items[items.length - 1];
        if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
        else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- Demande de table -> WhatsApp ---------- */
  var form = document.getElementById("reservationForm");
  if (form) {
    var lang = (root.lang || "it").slice(0, 2);
    var strings = {
      it: { hello: "Ciao! Vorrei prenotare un tavolo da Giulivo.", date: "Data", time: "Ora", guests: "Persone", notes: "Note", sep: "/" },
      en: { hello: "Hello! I would like to book a table at Giulivo.", date: "Date", time: "Time", guests: "Guests", notes: "Notes", sep: "/" },
      de: { hello: "Hallo! Ich möchte einen Tisch bei Giulivo reservieren.", date: "Datum", time: "Uhrzeit", guests: "Personen", notes: "Anmerkungen", sep: "." },
      th: { hello: "สวัสดีครับ/ค่ะ ต้องการจองโต๊ะที่ Giulivo", date: "วันที่", time: "เวลา", guests: "จำนวนท่าน", notes: "หมายเหตุ", sep: "/" }
    };
    var t = strings[lang] || strings.it;
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var d = form.elements.data ? form.elements.data.value : "";
      var o = form.elements.ora ? form.elements.ora.value : "";
      var p = form.elements.persone ? form.elements.persone.value : "";
      var note = form.elements.note ? form.elements.note.value.trim() : "";
      if (d) { var parts = d.split("-"); if (parts.length === 3) d = parts[2] + t.sep + parts[1] + t.sep + parts[0]; }
      var lines = [t.hello, t.date + ": " + (d || "-"), t.time + ": " + (o || "-"), t.guests + ": " + (p || "-")];
      if (note) lines.push(t.notes + ": " + note);
      window.open("https://wa.me/393888566367?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
    });
  }

  /* ---------- Carrousel d'avis ----------
     Sans JS, les trois citations restent lisibles, empilées. Le script prend
     le relais et signale les citations inactives aux lecteurs d'écran. */
  var carousel = document.getElementById("reviewsCarousel");
  if (carousel && !reduce) {
    var quotes = $$(".reviews__slide", carousel);
    if (quotes.length > 1) {
      carousel.classList.add("is-live");
      var qi = 0;
      quotes.forEach(function (q, i) { q.setAttribute("aria-hidden", i === 0 ? "false" : "true"); });
      setInterval(function () {
        quotes[qi].classList.remove("is-active");
        quotes[qi].setAttribute("aria-hidden", "true");
        qi = (qi + 1) % quotes.length;
        quotes[qi].classList.add("is-active");
        quotes[qi].setAttribute("aria-hidden", "false");
      }, 6000);
    }
  }

  /* ---------- Défilement doux vers les ancres internes ----------
     Uniquement si l'utilisateur accepte le mouvement ; sinon le navigateur
     saute directement (comportement natif, plus fluide). */
  if (canHover && !reduce) {
    document.addEventListener("click", function (ev) {
      var a = ev.target.closest && ev.target.closest('a[href^="#"]');
      if (!a) return;
      var href = a.getAttribute("href");
      if (!href || href.length < 2) return;
      var target = document.getElementById(href.slice(1));
      if (!target) return;
      ev.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", href);
    });
  }
})();
