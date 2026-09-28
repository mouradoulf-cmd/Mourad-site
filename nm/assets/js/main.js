/* NM Studio — interactions and motion.
   Everything is visible by default in CSS; motion is layered on only once
   GSAP has actually loaded, so a blocked script never hides content. */
(function () {
  "use strict";

  var WA_URL = "https://wa.me/qr/PYPOVXTCVM74I1";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  var t = function (k) { return window.NMI18n ? window.NMI18n.t(k) : ""; };
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- smooth scroll ---------- */
  var lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.1, wheelMultiplier: 0.95, smoothWheel: true });
    if (hasGsap) {
      lenis.on("scroll", window.ScrollTrigger.update);
      window.gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      window.gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })(0);
    }
  }
  // Offsets come from CSS scroll-padding-top (header height), which both
  // Lenis and native scrolling respect.
  function scrollToTarget(target) {
    if (lenis) lenis.scrollTo(target.id === "top" ? 0 : target, { duration: 1.2 });
    else target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }
  document.addEventListener("click", function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute("href").slice(1);
    var target = id ? document.getElementById(id) : null;
    if (!target) return;
    e.preventDefault();
    closeMenu();
    scrollToTarget(target);
    if (id === "main") target.setAttribute("tabindex", "-1"), target.focus({ preventScroll: true });
  });

  /* ---------- header: solid on scroll, hides going down, current section ---------- */
  var header = $("#header");
  var progressBar = $(".progress span");
  var waFloat = $(".wa-float");
  var hero = $(".hero");
  var finale = $(".finale");
  var menuEl = $("#menu");
  var lastY = window.scrollY;
  var narrow = window.matchMedia("(max-width: 959px)");
  // Layout metrics are measured on load/resize only, never inside scroll.
  var metrics = { heroEnd: 600, maxScroll: 1, finaleTop: Infinity, vh: window.innerHeight };
  function measure() {
    metrics.vh = window.innerHeight;
    metrics.heroEnd = hero ? hero.offsetHeight * 0.8 : 600;
    metrics.maxScroll = Math.max(1, document.documentElement.scrollHeight - metrics.vh);
    metrics.finaleTop = finale ? finale.getBoundingClientRect().top + window.scrollY : Infinity;
  }
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("is-solid", y > 24);
    var menuOpen = menuEl && !menuEl.hidden;
    // Hide on a deliberate move down past the hero, show on a move up; tiny
    // easing deltas at the end of a smooth scroll leave the state unchanged.
    if (y < metrics.heroEnd || menuOpen || y < lastY - 4) header.classList.remove("is-hidden");
    else if (y > lastY + 4) header.classList.add("is-hidden");
    if (Math.abs(y - lastY) > 4 || y < metrics.heroEnd) lastY = y;
    if (progressBar) progressBar.style.transform = "scaleX(" + Math.min(1, y / metrics.maxScroll) + ")";
    if (waFloat) {
      // On phones the floating button would sit on top of the text being
      // read, so it follows the header: hidden while reading down, back on scroll up.
      var readingDown = narrow.matches && header.classList.contains("is-hidden");
      waFloat.classList.toggle("is-visible", y > metrics.heroEnd && y + metrics.vh * 0.85 < metrics.finaleTop && !readingDown);
    }
    updateManifesto();
  }
  var scrollQueued = false;
  window.addEventListener("scroll", function () {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(function () { scrollQueued = false; onScroll(); });
  }, { passive: true });
  var resizeTimer;
  window.addEventListener("resize", function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(function () { measure(); onScroll(); }, 120); });
  window.addEventListener("load", function () { measure(); onScroll(); });
  measure();

  var navLinks = $$('.nav a[href^="#"]');
  if ("IntersectionObserver" in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle("is-current", a.getAttribute("href") === "#" + entry.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["work", "process", "pricing", "faq"].forEach(function (id) { var s = document.getElementById(id); if (s) sectionObserver.observe(s); });
  }

  /* ---------- mobile menu ---------- */
  var burger = $("#burger");
  var menu = $("#menu");
  var behindMenu = [$(".skip-link"), $("main"), $("footer")];
  function setInert(on) { behindMenu.forEach(function (el) { if (el) { if (on) el.setAttribute("inert", ""); else el.removeAttribute("inert"); } }); }
  function openMenu() {
    menu.hidden = false;
    setInert(true);
    burger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    if (lenis) lenis.stop();
    var first = $("a", menu); if (first) first.focus();
  }
  function closeMenu() {
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    setInert(false);
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (lenis) lenis.start();
  }
  if (burger) burger.addEventListener("click", function () { menu.hidden ? openMenu() : (closeMenu(), burger.focus()); });
  window.addEventListener("resize", function () { if (window.innerWidth >= 960) closeMenu(); });

  /* ---------- language switcher ---------- */
  var langBtn = $("#langBtn");
  var langList = $("#langList");
  function setLangOpen(open) {
    langList.hidden = !open;
    langBtn.setAttribute("aria-expanded", String(open));
    if (open) { var cur = $('[aria-current="true"]', langList) || $("button", langList); cur.focus(); }
  }
  if (langBtn) {
    langBtn.addEventListener("click", function () { setLangOpen(langList.hidden); });
    langList.addEventListener("keydown", function (e) {
      var items = $$("button", langList), i = items.indexOf(document.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); items[(i + 1) % items.length].focus(); }
      if (e.key === "ArrowUp") { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    });
    document.addEventListener("click", function (e) { if (!e.target.closest("#lang")) setLangOpen(false); });
  }
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-lang]");
    if (!btn || !window.NMI18n) return;
    window.NMI18n.apply(btn.getAttribute("data-lang"));
    if (langList && !langList.hidden) { setLangOpen(false); langBtn.focus(); }
  });
  document.addEventListener("nm:lang", function () {
    // Translated headings replace their markup; keep them fully visible and
    // let ScrollTrigger re-measure the new text lengths.
    $$("[data-anim]").forEach(function (el) { el.style.opacity = ""; el.style.transform = ""; });
    prepareManifesto();
    if (hasGsap) window.ScrollTrigger.refresh();
  });

  /* ---------- global Escape ---------- */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (langList && !langList.hidden) { setLangOpen(false); langBtn.focus(); }
    if (menu && !menu.hidden) { closeMenu(); burger.focus(); }
  });

  /* ---------- FAQ: animated details ---------- */
  $$(".qa").forEach(function (item) {
    var summary = $("summary", item);
    var body = $(".qa__body", item);
    summary.addEventListener("click", function (e) {
      if (reduce || !body.animate) return;
      e.preventDefault();
      if (item.dataset.animating) return;
      item.dataset.animating = "1";
      if (!item.open) {
        item.open = true;
        var h = body.scrollHeight;
        body.animate([{ height: "0px", opacity: 0 }, { height: h + "px", opacity: 1 }], { duration: 420, easing: "cubic-bezier(0.22,1,0.36,1)" })
          .onfinish = function () { delete item.dataset.animating; };
      } else {
        var h2 = body.scrollHeight;
        body.animate([{ height: h2 + "px", opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 320, easing: "cubic-bezier(0.65,0,0.35,1)" })
          .onfinish = function () { item.open = false; delete item.dataset.animating; };
      }
    });
  });

  /* ---------- booking dialog → WhatsApp ---------- */
  var dialog = $("#booking");
  var form = $("#bookingForm");
  var toast = $("#toast");
  var lastTrigger = null;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(function () { toast.classList.remove("is-visible"); }, 5000);
  }
  function openBooking(trigger) {
    lastTrigger = trigger || null;
    closeMenu();
    var date = $("#bkDate");
    var today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    date.min = today.toISOString().slice(0, 10);
    if (dialog.showModal) dialog.showModal(); else dialog.setAttribute("open", "");
    if (lenis) lenis.stop();
    setTimeout(function () { $("#bkBusiness").focus(); }, 60);
  }
  function closeBooking() {
    if (dialog.close) dialog.close(); else dialog.removeAttribute("open");
  }
  if (dialog) {
    dialog.addEventListener("close", function () {
      if (lenis) lenis.start();
      if (lastTrigger) lastTrigger.focus();
    });
    dialog.addEventListener("click", function (e) { if (e.target === dialog) closeBooking(); });
    $("#bookingClose").addEventListener("click", closeBooking);
    document.addEventListener("click", function (e) {
      var trigger = e.target.closest("[data-open-booking]");
      if (trigger) { e.preventDefault(); openBooking(trigger); }
    });

    var fields = ["bkBusiness", "bkPhone", "bkDate", "bkTime"].map(function (id) { return document.getElementById(id); });
    function validate(field) {
      var err = document.getElementById(field.id + "Err");
      var msg = "";
      if (!field.value.trim()) msg = t("booking.required");
      else if (field.type === "date" && field.min && field.value < field.min) msg = t("booking.pastDate");
      field.setAttribute("aria-invalid", msg ? "true" : "false");
      err.textContent = msg;
      return !msg;
    }
    fields.forEach(function (f) {
      f.addEventListener("blur", function () { if (f.value) validate(f); });
      f.addEventListener("input", function () { if (f.getAttribute("aria-invalid") === "true") validate(f); });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var invalid = fields.filter(function (f) { return !validate(f); });
      if (invalid.length) { invalid[0].focus(); return; }
      var lang = window.NM_LANG || "en";
      var d = new Date(fields[2].value + "T12:00:00");
      var niceDate = isNaN(d) ? fields[2].value : d.toLocaleDateString(lang, { weekday: "long", day: "numeric", month: "long" });
      var message = (t("booking.waMessage") || "")
        .replace("{business}", fields[0].value.trim())
        .replace("{phone}", fields[1].value.trim())
        .replace("{date}", niceDate)
        .replace("{time}", fields[3].value);
      // The studio's WhatsApp link is a QR contact link, which ignores
      // pre-filled text — so the message is also copied for a one-tap paste.
      var copied = navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(message) : Promise.reject();
      copied.then(function () { showToast(t("booking.toast")); }, function () {});
      window.open(WA_URL + "?text=" + encodeURIComponent(message), "_blank", "noopener");
      form.reset();
      fields.forEach(function (f) { f.removeAttribute("aria-invalid"); document.getElementById(f.id + "Err").textContent = ""; });
      closeBooking();
    });
  }

  /* ---------- cursor follower + magnetic buttons (fine pointers only) ---------- */
  if (finePointer && !reduce) {
    var cursor = $(".cursor");
    var label = $(".cursor__label");
    var cx = -100, cy = -100, tx = -100, ty = -100, cursorRunning = false;
    function cursorLoop() {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      cursor.style.transform = "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0)";
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) requestAnimationFrame(cursorLoop);
      else cursorRunning = false; // sleep until the pointer moves again
    }
    window.addEventListener("pointermove", function (e) {
      tx = e.clientX; ty = e.clientY; cursor.classList.add("is-active");
      if (!cursorRunning) { cursorRunning = true; requestAnimationFrame(cursorLoop); }
    }, { passive: true });
    document.documentElement.addEventListener("pointerleave", function () { cursor.classList.remove("is-active"); });
    $$("[data-cursor]").forEach(function (el) {
      el.addEventListener("pointerenter", function () { label.textContent = t("work.cursor"); cursor.classList.add("is-view"); });
      el.addEventListener("pointerleave", function () { cursor.classList.remove("is-view"); });
    });

    $$(".magnetic").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.22;
        var y = (e.clientY - r.top - r.height / 2) * 0.3;
        el.style.transform = "translate(" + x + "px," + y + "px)";
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });

    // Work mockups: gentle 3D tilt under the pointer.
    $$(".project__media").forEach(function (media) {
      media.addEventListener("pointermove", function (e) {
        var r = media.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        media.style.transform = "perspective(1400px) rotateY(" + (px * 6).toFixed(2) + "deg) rotateX(" + (-py * 5).toFixed(2) + "deg)";
      });
      media.addEventListener("pointerleave", function () { media.style.transform = ""; });
    });

    // Hero stage: pointer-driven depth.
    var stage = $("#stage");
    if (stage && hero) {
      var rx = 0, ry = 0, trx = 0, try_ = 0, stageRunning = false;
      hero.addEventListener("pointermove", function (e) {
        var r = hero.getBoundingClientRect();
        try_ = ((e.clientX - r.left) / r.width - 0.5) * 10;
        trx = -((e.clientY - r.top) / r.height - 0.5) * 7;
        if (!stageRunning) { stageRunning = true; requestAnimationFrame(stageLoop); }
      });
      hero.addEventListener("pointerleave", function () { trx = 0; try_ = 0; });
      var stageLoop = function () {
        rx += (trx - rx) * 0.07; ry += (try_ - ry) * 0.07;
        stage.style.setProperty("--rx", rx.toFixed(2) + "deg");
        stage.style.setProperty("--ry", ry.toFixed(2) + "deg");
        if (Math.abs(trx - rx) > 0.01 || Math.abs(try_ - ry) > 0.01) requestAnimationFrame(stageLoop);
        else stageRunning = false;
      };
    }
  }

  /* ---------- hero stage: cycle through the four live projects ---------- */
  (function stageShowcase() {
    var view = $("#stageView"), phoneView = $("#stagePhoneView");
    var nameEl = $("#stageName"), catEl = $("#stageCat"), dots = $$(".stage__dots i");
    if (!view || !phoneView || reduce) return;
    var projects = [
      { slug: "giulivo", name: "Giulivo", cat: "work.p1cat" },
      { slug: "malee", name: "Malee", cat: "work.p2cat" },
      { slug: "noir", name: "Noir", cat: "work.p3cat" },
      { slug: "facadiers", name: "Atelier des Façadiers", cat: "work.p4cat" }
    ];
    var SWAP_MS = 4200, index = 0, timer = null, layers = [], visible = true;
    document.documentElement.style.setProperty("--swap-ms", SWAP_MS + "ms");
    function layer(parent, src) {
      var img = new Image();
      img.className = "swap-layer"; img.alt = ""; img.decoding = "async"; img.src = src;
      parent.appendChild(img);
      return img;
    }
    var z = 1;
    function build() {
      // Every project (the first included) gets a layer, so each swap is a
      // true cross-fade: the incoming layer fades in on top of the current one.
      layers = projects.map(function (p) {
        return { desk: layer(view, "assets/img/work/" + p.slug + "-desk.webp"), mob: layer(phoneView, "assets/img/work/" + p.slug + "-mob-360.webp") };
      });
      layers[0].desk.classList.add("is-on"); layers[0].mob.classList.add("is-on");
      show(0);
      schedule();
    }
    function show(i) {
      var prev = layers[index], next = layers[i];
      index = i;
      if (next && prev !== next) {
        z += 1;
        next.desk.style.zIndex = next.mob.style.zIndex = z;
        next.desk.classList.add("is-on"); next.mob.classList.add("is-on");
        setTimeout(function () {
          if (layers[index] !== prev) { prev.desk.classList.remove("is-on"); prev.mob.classList.remove("is-on"); }
        }, 1100);
      }
      nameEl.textContent = projects[i].name;
      catEl.setAttribute("data-i18n", projects[i].cat);
      catEl.textContent = t(projects[i].cat);
      dots.forEach(function (d, k) { d.classList.remove("is-on"); if (k === i) { void d.offsetWidth; d.classList.add("is-on"); } });
    }
    function schedule() {
      clearTimeout(timer);
      if (!visible || document.hidden) return;
      timer = setTimeout(function () { show((index + 1) % projects.length); schedule(); }, SWAP_MS);
    }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; schedule(); }).observe(view);
    }
    document.addEventListener("visibilitychange", schedule);
    // Extra screenshots load only after the page itself has finished loading.
    if (document.readyState === "complete") setTimeout(build, 1200);
    else window.addEventListener("load", function () { setTimeout(build, 1200); });
  })();

  /* ---------- manifesto: words light up as you scroll ---------- */
  var manifestoWords = [];
  function prepareManifesto() {
    var el = $(".manifesto");
    if (!el || reduce) return;
    manifestoWords = [];
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var s = document.createElement("span"); s.className = "w"; s.textContent = part;
            frag.appendChild(s); manifestoWords.push(s);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && !child.classList.contains("w")) {
          walk(child);
        }
      });
    })(el);
    updateManifesto();
  }
  var manifestoEl = $(".manifesto");
  function updateManifesto() {
    var el = manifestoEl;
    if (!el || !manifestoWords.length) return;
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight;
    if (r.bottom < -vh || r.top > vh * 2) return;
    var p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
    var lit = Math.round(p * manifestoWords.length);
    for (var i = 0; i < manifestoWords.length; i++) manifestoWords[i].classList.toggle("on", i < lit);
  }
  prepareManifesto();
  onScroll();

  /* ---------- "The difference" ----------
     Desktop: the step crossing the middle of the screen drives the sticky phone.
     Phones/tablets: the steps are tappable cards under the phone; they
     auto-advance while the section is on screen, until the visitor taps one. */
  (function difference() {
    var section = $("#difference");
    var diffPhone = $("#diffPhone");
    var diffSteps = $$(".diff__step");
    if (!section || !diffPhone || !diffSteps.length) return;
    var DIFF_MS = 3800;
    section.style.setProperty("--diff-ms", DIFF_MS + "ms");
    function setState(n) {
      n = String(n);
      diffPhone.setAttribute("data-state", n);
      diffSteps.forEach(function (st) {
        var on = st.getAttribute("data-step") === n;
        st.classList.remove("is-active");
        if (on) { void st.offsetWidth; st.classList.add("is-active"); }
        var hit = st.querySelector(".diff__hit");
        if (hit) hit.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }
    var desktop = window.matchMedia("(min-width: 960px)");
    var io = null, autoTimer = null, inView = false, userTook = false;
    function current() { return Number(diffPhone.getAttribute("data-state")) || 1; }
    function stopAuto() { clearTimeout(autoTimer); section.classList.remove("is-auto"); }
    function runAuto() {
      stopAuto();
      if (desktop.matches || userTook || reduce || !inView || document.hidden) return;
      section.classList.add("is-auto");
      setState(current());
      autoTimer = setTimeout(function next() {
        setState(current() % diffSteps.length + 1);
        autoTimer = setTimeout(next, DIFF_MS);
      }, DIFF_MS);
    }
    function onTap(e) {
      userTook = true; stopAuto();
      setState(e.currentTarget.getAttribute("data-step"));
    }
    function setup() {
      if (io) { io.disconnect(); io = null; }
      stopAuto();
      if (!("IntersectionObserver" in window)) return;
      if (desktop.matches) {
        io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) { if (entry.isIntersecting) setState(entry.target.getAttribute("data-step")); });
        }, { rootMargin: "-45% 0px -45% 0px" });
        diffSteps.forEach(function (st) { io.observe(st); });
      } else {
        io = new IntersectionObserver(function (entries) { inView = entries[0].isIntersecting; runAuto(); }, { threshold: 0.35 });
        io.observe(diffPhone);
      }
    }
    $$(".diff__hit", section).forEach(function (btn) { btn.addEventListener("click", onTap); });
    document.addEventListener("visibilitychange", runAuto);
    if (desktop.addEventListener) desktop.addEventListener("change", setup); else desktop.addListener(setup);
    setup();
  })();

  /* ---------- footer: live local time in Pattaya ---------- */
  var clock = $("#localTime");
  function tick() {
    if (!clock) return;
    try {
      var now = new Date();
      clock.textContent = now.toLocaleTimeString(window.NM_LANG || "en", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Bangkok" });
      clock.setAttribute("datetime", now.toISOString());
    } catch (e) {}
  }
  tick(); setInterval(tick, 30000);
  document.addEventListener("nm:lang", tick);

  /* ==================== GSAP choreography ==================== */
  if (!hasGsap || reduce) return;
  var gsap = window.gsap, ST = window.ScrollTrigger;
  gsap.registerPlugin(ST);
  // Mobile browsers resize the viewport when the address bar hides; don't
  // recalculate every trigger (and jump) for that.
  ST.config({ ignoreMobileResize: true });

  // Split a heading into masked words while keeping <em> styling intact;
  // restore the original markup afterwards so the gradient stays seamless.
  function splitWords(el) {
    var original = el.innerHTML;
    var words = [];
    (function walk(node, inEm) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            var mask = document.createElement("span"); mask.className = "wm";
            var inner = document.createElement("span"); inner.className = "wi"; inner.textContent = part;
            mask.appendChild(inner); frag.appendChild(mask); words.push(inner);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          walk(child, inEm || child.tagName === "EM");
        }
      });
    })(el, false);
    // Give each word inside <em> its slice of the gradient.
    $$("em", el).forEach(function (em) {
      var er = em.getBoundingClientRect();
      $$(".wi", em).forEach(function (w) {
        var wr = w.getBoundingClientRect();
        w.style.backgroundImage = getComputedStyle(em).backgroundImage;
        w.style.backgroundSize = er.width + "px 100%";
        w.style.backgroundPosition = (er.left - wr.left) + "px 0";
        w.style.webkitBackgroundClip = "text"; w.style.backgroundClip = "text"; w.style.color = "transparent";
      });
    });
    return { words: words, revert: function () { el.innerHTML = original; } };
  }

  /* Hero entrance — starts as the intro curtain lifts. */
  var heroTitle = $(".hero__title");
  var tl = gsap.timeline({ delay: 0.35, defaults: { ease: "expo.out" } });
  if (heroTitle) {
    var heroSplit = splitWords(heroTitle);
    tl.from(heroSplit.words, { yPercent: 115, rotate: 4, duration: 1.05, stagger: 0.04 }, 0);
    // Keep the split markup after the entrance (rebuilding the headline would
    // repaint it); restore the plain markup only if the layout changes.
    window.addEventListener("resize", function once() { heroSplit.revert(); window.removeEventListener("resize", once); });
  }
  tl.from(".hero__eyebrow", { y: 16, opacity: 0, duration: 1 }, 0)
    .from(".hero__sub", { y: 22, opacity: 0, duration: 1.1 }, 0.45)
    .from(".hero__ctas", { y: 22, opacity: 0, duration: 1.1 }, 0.55)
    // Inner wrappers are animated so the CSS 3D transforms on the stage
    // layers (and the pointer-driven tilt) are never overwritten.
    .from(".stage__screen--back .frame", { opacity: 0, y: 80, duration: 1.8 }, 0.2)
    .from(".stage__screen--mid .frame", { opacity: 0, y: 100, duration: 1.8 }, 0.3)
    .from(".stage__screen--front .frame", { opacity: 0, y: 120, duration: 1.8 }, 0.4)
    .from(".stage__phone .device", { opacity: 0, y: 140, duration: 1.6 }, 0.6)
    .from(".stage__chip .chip", { opacity: 0, scale: .8, y: 20, duration: 1, stagger: 0.15, ease: "back.out(1.6)" }, 1.1)
    .from(".hero__facts li", { opacity: 0, y: 20, duration: 1, stagger: 0.08 }, 0.8);

  // Hero scroll: the stage drifts up and settles, copy eases away.
  gsap.to("#stage", { yPercent: -10, scale: 0.94, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero__copy", { yPercent: -14, opacity: 0.2, ease: "none", scrollTrigger: { trigger: ".hero", start: "25% top", end: "bottom top", scrub: true } });
  gsap.to(".stage__chip--a .chip", { y: -60, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".stage__chip--b .chip", { y: -110, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  /* Section titles: word-by-word rise when they enter. Words are split and
     tucked below their masks up front; a language switch simply replaces the
     markup, which leaves the translated title fully visible. */
  $$('[data-anim="words"]').forEach(function (el) {
    if (el === heroTitle) return;
    var split = splitWords(el);
    gsap.set(split.words, { yPercent: 115 });
    ST.create({
      trigger: el, start: "top 86%", once: true,
      onEnter: function () {
        if (!split.words[0] || !el.contains(split.words[0])) return;
        gsap.to(split.words, { yPercent: 0, duration: 1.1, stagger: 0.045, ease: "expo.out", onComplete: split.revert });
      }
    });
  });

  /* Generic fades / rises. */
  $$('[data-anim="rise"]').forEach(function (el, i) {
    gsap.from(el, { y: 40, opacity: 0, duration: 1.1, ease: "expo.out", delay: (i % 3) * 0.08, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
  });
  $$(".section-lead, .eyebrow").forEach(function (el) {
    if (el.closest(".hero, dialog")) return;
    gsap.from(el, { y: 18, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
  });

  /* Work: masked reveal + depth parallax on each project. */
  $$(".project").forEach(function (project) {
    var media = $(".project__media", project);
    var browser = $(".project__browser", project);
    var img = $(".project__browser img", project);
    var phone = $(".project__phone", project);
    var info = $(".project__info", project);
    gsap.fromTo(browser, { clipPath: "inset(14% 10% 14% 10% round 28px)" }, {
      clipPath: "inset(0% 0% 0% 0% round 14px)", ease: "none",
      scrollTrigger: { trigger: media, start: "top 95%", end: "top 55%", scrub: 0.6 }
    });
    gsap.fromTo(img, { scale: 1.3 }, { scale: 1.08, ease: "none", scrollTrigger: { trigger: media, start: "top bottom", end: "bottom top", scrub: true } });
    gsap.fromTo(phone, { y: 120 }, { y: -30, ease: "none", scrollTrigger: { trigger: media, start: "top bottom", end: "bottom top", scrub: 0.6 } });
    gsap.from($("img", phone), { opacity: 0, duration: 1, ease: "power2.out", scrollTrigger: { trigger: media, start: "top 80%", once: true } });
    gsap.from($$(":scope > *", info), { y: 30, opacity: 0, duration: 1, stagger: 0.07, ease: "expo.out", scrollTrigger: { trigger: info, start: "top 82%", once: true } });
  });

  /* Process: rail draws across as the steps come in. */
  $$(".flow__step").forEach(function (step, i) {
    var st = { trigger: step, start: "top 88%", once: true };
    gsap.from(step, { y: 60, opacity: 0, duration: 1.1, delay: window.innerWidth >= 960 ? i * 0.12 : 0, ease: "expo.out", scrollTrigger: st });
    gsap.from($$(".wa__msg, .bk, .build__tools, .live__url, .live__tile", step), { y: 14, opacity: 0, duration: .7, stagger: .12, delay: (window.innerWidth >= 960 ? i * 0.12 : 0) + .35, ease: "power3.out", scrollTrigger: st });
  });

  /* Finale + footer word. */
  gsap.from(".finale__sub, .finale__ctas", { y: 24, opacity: 0, duration: 1.1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".finale", start: "top 70%", once: true } });
  gsap.fromTo(".footer__word", { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom bottom", scrub: true } });

  /* Difference: the phone rises in with a slight tilt. */
  gsap.from(".dp", { y: 80, rotateX: 18, opacity: 0, duration: 1.4, ease: "expo.out", transformPerspective: 1200, scrollTrigger: { trigger: ".diff__grid", start: "top 80%", once: true } });

  /* Try it: the card lifts in, the QR frame snaps into place. */
  gsap.from(".tryit", { y: 60, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".tryit", start: "top 85%", once: true } });
  gsap.from(".tryit__corner", { scale: 1.8, opacity: 0, duration: .9, stagger: .06, ease: "back.out(2)", scrollTrigger: { trigger: ".tryit", start: "top 70%", once: true } });

  /* Finale orbit badge. */
  gsap.from(".orbit", { scale: .6, opacity: 0, rotate: -90, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".finale", start: "top 75%", once: true } });

  window.addEventListener("load", function () { ST.refresh(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });
})();
