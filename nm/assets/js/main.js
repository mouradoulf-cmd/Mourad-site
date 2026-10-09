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
  window.NM_LENIS = lenis;
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
  var hero = $(".h, .phero, .status");
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
  var solidState = null, barVal = -1;
  function onScroll() {
    var y = window.scrollY;
    var solid = y > 24;
    if (solid !== solidState) { solidState = solid; header.classList.toggle("is-solid", solid); }
    var menuOpen = menuEl && !menuEl.hidden;
    // Hide on a deliberate move down past the hero, show on a move up; tiny
    // easing deltas at the end of a smooth scroll leave the state unchanged.
    if (y < metrics.heroEnd || menuOpen || y < lastY - 4) header.classList.remove("is-hidden");
    else if (y > lastY + 4) header.classList.add("is-hidden");
    if (Math.abs(y - lastY) > 4 || y < metrics.heroEnd) lastY = y;
    if (progressBar) { var bv = Math.round(Math.min(1, y / metrics.maxScroll) * 1000); if (bv !== barVal) { barVal = bv; progressBar.style.transform = "scaleX(" + (bv / 1000) + ")"; } }
    if (waFloat) {
      // On phones the floating button would sit on top of the text being
      // read, so it follows the header: hidden while reading down, back on scroll up.
      var readingDown = narrow.matches && header.classList.contains("is-hidden");
      // Hysteresis: a few pixels of rubber-band/momentum wobble right at the
      // hero or finale boundary used to flip .is-visible on and off every
      // scroll frame, re-triggering the button's transform/opacity transition
      // each time — the flicker users reported. Once shown/hidden, the
      // opposite edge has to move 28px past the boundary before it flips back.
      var shown = waFloat.classList.contains("is-visible"), m = 28;
      var visible = shown
        ? y > metrics.heroEnd - m && y + metrics.vh * 0.85 < metrics.finaleTop + m
        : y > metrics.heroEnd + m && y + metrics.vh * 0.85 < metrics.finaleTop - m;
      waFloat.classList.toggle("is-visible", visible && !readingDown);
    }
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
    ["work", "offers", "why", "how", "faq"].forEach(function (id) { var s = document.getElementById(id); if (s) sectionObserver.observe(s); });
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

  }

  onScroll();

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
  // Elements GSAP sets to opacity:0 pending a scroll-triggered reveal — a
  // safety net at the bottom of this file force-shows any of these still
  // stuck invisible once they're actually on screen (an instant scroll,
  // e.g. a #hash landing or a fast programmatic jump, can land a trigger
  // past its "already entered" check before ScrollTrigger has a current
  // scroll position to evaluate it against, leaving it hidden for good).
  var revealWatch = [];

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
    // Give each word inside <em> its slice of the gradient. Read every rect
    // and computed style first, then write — interleaving the two forces a
    // synchronous layout on each word and adds up across several titles.
    var emReads = $$("em", el).map(function (em) {
      return { em: em, rect: em.getBoundingClientRect(), bg: getComputedStyle(em).backgroundImage, words: $$(".wi", em).map(function (w) { return { w: w, rect: w.getBoundingClientRect() }; }) };
    });
    emReads.forEach(function (e) {
      e.words.forEach(function (ww) {
        ww.w.style.backgroundImage = e.bg;
        ww.w.style.backgroundSize = e.rect.width + "px 100%";
        ww.w.style.backgroundPosition = (e.rect.left - ww.rect.left) + "px 0";
        ww.w.style.webkitBackgroundClip = "text"; ww.w.style.backgroundClip = "text"; ww.w.style.color = "transparent";
      });
    });
    return { words: words, revert: function () { el.innerHTML = original; } };
  }
  /* Hero: the pill, the title word by word, then the rest; the devices rise
     in from below and the floating chips pop around them. */
  var heroTitle = $(".h__title");
  var tl = gsap.timeline({ delay: 0.15, defaults: { ease: "expo.out" } });
  if (heroTitle) {
    var heroSplit = splitWords(heroTitle);
    gsap.set(heroSplit.words, { yPercent: 115 });
    tl.to(heroSplit.words, { yPercent: 0, duration: 1.2, stagger: 0.09, onComplete: function () {
      if (heroSplit.words[0] && heroTitle.contains(heroSplit.words[0])) heroSplit.revert();
    } }, 0.2);
    var splitLang = document.documentElement.lang;
    window.addEventListener("resize", function once() {
      window.removeEventListener("resize", once);
      if (document.documentElement.lang === splitLang && heroSplit.words[0] && heroTitle.contains(heroSplit.words[0])) heroSplit.revert();
    });
    tl.from(".h__pill", { y: 18, opacity: 0, duration: 0.9 }, 0)
      .from(".h__sub", { y: 24, opacity: 0, duration: 1 }, 0.75)
      .from(".h__ctas > *", { y: 22, opacity: 0, duration: 1, stagger: 0.08 }, 0.9)
      .from(".h__proof li", { y: 16, opacity: 0, duration: 0.9, stagger: 0.07 }, 1.05)
      .from(".h__orb", { scale: 0.6, opacity: 0, duration: 2 }, 0)
      .from(".h__ring", { scale: 0.7, opacity: 0, duration: 1.8, stagger: 0.1 }, 0.1)
      .from(".dev--hero .mac__view", { opacity: 0.05, duration: 1.4, ease: "power2.out" }, 0.1)
      .from(".dev--hero .iph", { y: 140, duration: 1.5 }, 0.4)
      .from(".h__chip .chip", { scale: 0.6, opacity: 0, y: 20, duration: 1, stagger: 0.14, ease: "back.out(1.7)" }, 1.1)
      .from(".h__now", { opacity: 0, y: 10, duration: 0.8 }, 1.4);
    // Scrolling away: the copy drifts up and fades, the stage sinks slower.
    // (the copy no longer fades out on scroll: it stays readable until it leaves the screen)
    gsap.to(".h__visual", { yPercent: 10, ease: "none", scrollTrigger: { trigger: ".h", start: "top top", end: "bottom top", scrub: true } });
  } else tl.kill();

  /* Section titles: word-by-word rise when they enter. Splitting a title
     into word spans forces a layout read, so titles well below the fold
     are only split once they're getting close — not all at once on load,
     which used to add up across six titles. Words are tucked below their
     masks right before the reveal trigger; a language switch simply
     replaces the markup, which leaves the translated title fully visible. */
  $$('[data-anim="words"]').forEach(function (el) {
    function setup() {
      var split = splitWords(el);
      gsap.set(split.words, { yPercent: 115 });
      ST.create({
        trigger: el, start: "top 86%", once: true,
        onEnter: function () {
          if (!split.words[0] || !el.contains(split.words[0])) return;
          gsap.to(split.words, { yPercent: 0, duration: 1.1, stagger: 0.05, ease: "expo.out", onComplete: split.revert });
        }
      });
    }
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); setup(); } }, { rootMargin: "50% 0px" });
      io.observe(el);
    } else setup();
  });

  $$(".section-lead, .section-head .eyebrow, .phero .eyebrow, .phero__lead").forEach(function (el) {
    if (el.closest(".h, dialog")) return;
    gsap.from(el, { y: 18, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
  });

  /* Key figures: each rises in, its icon starts moving once it's on screen. */
  var stItems = $$(".st__item");
  if (stItems.length) {
    gsap.fromTo(stItems, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: 0.1, ease: "expo.out", clearProps: "transform,opacity",
      scrollTrigger: { trigger: ".st__grid", start: "top 88%", once: true } });
    revealWatch.push.apply(revealWatch, stItems);
  }

  /* Cards with a CSS transform transition (hover lift / tilt) use explicit
     start and end values and no transition during the tween, or GSAP reads a
     mid-transition value as the resting state. */
  function rise(sel, opts) {
    var els = $$(sel);
    if (!els.length) return;
    var from = Object.assign({ y: 70, opacity: 0 }, opts && opts.from);
    els.forEach(function (c) { c.style.transition = "none"; });
    gsap.set(els, from);
    revealWatch.push.apply(revealWatch, els);
    ST.batch(els, {
      start: "top 90%", once: true,
      onEnter: function (batch) {
        gsap.fromTo(batch, from, Object.assign({ y: 0, opacity: 1, rotateX: 0, scale: 1, duration: 1.2, stagger: 0.1, ease: "expo.out", clearProps: "transform,opacity,transition" }, opts && opts.to));
      }
    });
  }
  rise(".wk-card", { from: { y: 90, rotateX: 8, transformPerspective: 1400 } });
  rise(".why-card");
  rise(".how-step", { from: { y: 80, scale: 0.96 } });
  rise(".offer", { from: { y: 70, rotateX: 10, transformPerspective: 1200 } });
  // Device screens inside the work cards settle from a slight zoom.
  var phone = window.matchMedia("(max-width: 760px)").matches;   /* scrubbed image parallax is skipped on phones (one less ticker job per image) */
  if (!phone) $$(".wk-card .mac__view img").forEach(function (img) {
    gsap.fromTo(img, { scale: 1.18 }, { scale: 1, ease: "none", scrollTrigger: { trigger: img.closest(".wk-card"), start: "top bottom", end: "center center", scrub: true } });
  });
  // Photos in why/how cards drift inside their frame.
  if (!phone) $$(".why-card__media img, .how-step__media img").forEach(function (img) {
    gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: img.parentNode, start: "top bottom", end: "bottom top", scrub: true } });
  });

  /* Finale: the WhatsApp button rises in, then the rest. */
  if ($(".wa-giant")) gsap.from(".wa-giant", { scale: .6, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".finale", start: "top 70%", once: true } });
  if ($(".finale__sub")) gsap.from(".finale__sub, .finale__replies, .finale__scan, .finale__ctas", { y: 24, opacity: 0, duration: 1.1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".finale", start: "top 70%", once: true } });

  /* Everything else fades up in small staggered groups as it enters. */
  var batchSel = ".qa, .footer__brand, .footer__col, .pcard, .guide__row, .cmp-wrap, .legal__sec, .status__card, .trust, .offers__links, .faq__intro .btn, .bill, .carebox, .phero__chips";
  var batchEls = $$(batchSel).filter(function (el) { return !el.hasAttribute("data-anim") && !el.closest("dialog, .h, [data-anim]"); });
  if (batchEls.length) {
    batchEls.forEach(function (el) { el.style.transition = "none"; });
    gsap.set(batchEls, { y: 36, opacity: 0 });
    revealWatch.push.apply(revealWatch, batchEls);
    ST.batch(batchEls, {
      start: "top 92%", once: true,
      onEnter: function (els) { gsap.to(els, { y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: "expo.out", clearProps: "transform,opacity,transition" }); }
    });
  }

  /* Light parallax on page-hero photos. */
  $$(".phero__bg img").forEach(function (img) {
    gsap.fromTo(img, { yPercent: -6, scale: 1.12 }, { yPercent: 8, scale: 1.12, ease: "none", scrollTrigger: { trigger: img.closest("section"), start: "top top", end: "bottom top", scrub: true } });
  });

  window.addEventListener("load", function () { ST.refresh(); setTimeout(function () { ST.refresh(); }, 1500); });
  document.addEventListener("nm:lang", function () { setTimeout(function () { ST.refresh(); }, 300); });   // the Thai offers block changes the page height
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });

  // Safety net: anything still at opacity:0 once it's actually on screen
  // gets shown directly, bypassing whatever left its own ScrollTrigger
  // from firing. A short grace delay lets a normal, on-time reveal happen
  // first so this never fights it.
  if (revealWatch.length && "IntersectionObserver" in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        revealObs.unobserve(entry.target);
        var el = entry.target;
        setTimeout(function () {
          if (getComputedStyle(el).opacity === "0") {
            gsap.to(el, { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 0.6, ease: "power2.out", clearProps: "transform,opacity,transition" });
          }
        }, 600);
      });
    }, { rootMargin: "0px 0px -5% 0px" });
    revealWatch.forEach(function (el) { revealObs.observe(el); });
  }
})();
