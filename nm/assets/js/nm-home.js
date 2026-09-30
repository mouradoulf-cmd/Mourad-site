/* NM Studio — home & services interactions: hero reel and gold dust, the
   three-screen story, offer cards + detail dialog, the "customers lost"
   calculator, the Pattaya map and the live site preview.
   Every block is optional: it quietly skips if its markup isn't on the page. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var t = function (k) { return (window.NMI18n && window.NMI18n.t(k)) || ""; };
  var O = window.NM_OFFERS, P = window.NMPrice;
  var lenis = function () { return window.NM_LENIS || null; };
  function onVisible(el, cb, opts) {
    if (!el || !("IntersectionObserver" in window)) { if (el) cb(true); return; }
    new IntersectionObserver(function (en) { cb(en[0].isIntersecting); }, opts || {}).observe(el);
  }

  if (P) P.render();

  /* ---------- hero: cinematic reel of three scenes ---------- */
  (function heroReel() {
    var slides = $$(".hero__slide"), bars = $$(".hero__reel i");
    if (slides.length < 2) return;
    var SLIDE_MS = 6500, i = 0, timer = null, visible = true, ready = false;
    document.documentElement.style.setProperty("--slide-ms", SLIDE_MS + "ms");
    function hydrate(p) {
      if (!p.hasAttribute("data-lazy")) return;
      $$("source", p).forEach(function (s) { s.srcset = s.getAttribute("data-srcset"); });
      var img = $("img", p); img.src = img.getAttribute("data-src");
      p.removeAttribute("data-lazy");
    }
    function show(n) {
      slides[i].classList.remove("is-on");
      i = n;
      hydrate(slides[(i + 1) % slides.length]);
      slides[i].classList.add("is-on");
      bars.forEach(function (b, k) {
        b.classList.remove("is-on");
        b.classList.toggle("is-done", k < i);
        if (k === i) { void b.offsetWidth; b.classList.add("is-on"); }
      });
    }
    function schedule() {
      clearTimeout(timer);
      if (!ready || !visible || document.hidden || reduce) return;
      timer = setTimeout(function () { show((i + 1) % slides.length); schedule(); }, SLIDE_MS);
    }
    function start() { hydrate(slides[1]); ready = true; show(0); schedule(); }
    onVisible($(".hero"), function (v) { visible = v; schedule(); });
    document.addEventListener("visibilitychange", schedule);
    if (reduce) return;
    if (document.readyState === "complete") setTimeout(start, 600);
    else window.addEventListener("load", function () { setTimeout(start, 600); });
  })();

  /* ---------- hero: cinematic video (when one is configured) ----------
     Autoplay, muted, looping, inline; the poster shows at once and the photo
     reel stays underneath until the first frame plays. Skipped with reduced
     motion or data saver, and paused whenever the hero is off screen. */
  (function heroVideo() {
    var hero = $(".hero"), media = $(".hero__media"), cfg = O && O.hero;
    if (!hero || !media || !cfg || !(cfg.mp4 || cfg.webm)) return;
    var saver = navigator.connection && navigator.connection.saveData;
    if (reduce || saver) return;
    var v = document.createElement("video");
    v.className = "hero__video";
    v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true; v.preload = "metadata";
    v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("aria-hidden", "true"); v.tabIndex = -1;
    if (cfg.poster) v.poster = cfg.poster;
    var phone = window.matchMedia("(max-width: 700px)").matches;
    if (cfg.webm && !phone) { var w = document.createElement("source"); w.src = cfg.webm; w.type = "video/webm"; v.appendChild(w); }
    var m = document.createElement("source"); m.src = phone && cfg.mp4Mobile ? cfg.mp4Mobile : cfg.mp4; m.type = "video/mp4"; v.appendChild(m);
    v.addEventListener("playing", function () { hero.classList.add("has-video"); }, { once: true });
    media.appendChild(v);
    onVisible(hero, function (on) {
      if (on && !document.hidden) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else v.pause();
    });
    document.addEventListener("visibilitychange", function () { if (document.hidden) v.pause(); else if (hero.getBoundingClientRect().bottom > 0) v.play().catch(function () {}); });
  })();

  /* ---------- hero: slow gold dust drifting up through the light ---------- */
  (function heroDust() {
    var canvas = $(".hero__dust");
    if (!canvas || reduce || !canvas.getContext) return;
    var ctx = canvas.getContext("2d"), dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var W = 0, H = 0, motes = [], running = false, raf = 0, visible = true;
    function size() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(70, W * H / 22000));
      motes = [];
      for (var k = 0; k < n; k++) motes.push(mote(true));
    }
    function mote(anywhere) {
      return { x: Math.random() * W, y: anywhere ? Math.random() * H : H + 10, r: .4 + Math.random() * 1.6, v: .12 + Math.random() * .4, a: Math.random() * Math.PI * 2, s: .004 + Math.random() * .01, o: .25 + Math.random() * .55 };
    }
    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (var k = 0; k < motes.length; k++) {
        var m = motes[k];
        m.y -= m.v; m.a += m.s; m.x += Math.sin(m.a) * .25;
        if (m.y < -10) motes[k] = m = mote(false);
        var flick = .65 + Math.sin(m.a * 3) * .35;
        ctx.beginPath();
        var jade = k % 3 === 0;
        ctx.fillStyle = jade ? "rgba(150,235,205," + (m.o * flick).toFixed(3) + ")" : "rgba(245," + (206 + (k % 3) * 10) + "," + (140 + (k % 4) * 12) + "," + (m.o * flick).toFixed(3) + ")";
        ctx.shadowColor = jade ? "rgba(44,194,149,.9)" : "rgba(216,174,94,.8)"; ctx.shadowBlur = m.r * 6;
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }
    function play(on) {
      if (on && !running) { running = true; raf = requestAnimationFrame(frame); }
      if (!on && running) { running = false; cancelAnimationFrame(raf); }
    }
    size();
    var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(size, 200); });
    onVisible(canvas, function (v) { visible = v; play(v && !document.hidden); });
    document.addEventListener("visibilitychange", function () { play(visible && !document.hidden); });
  })();

  /* ---------- counters ---------- */
  (function counters() {
    $$("[data-count]").forEach(function (el) {
      var to = +el.getAttribute("data-count");
      if (reduce || !to) return;
      el.textContent = "0";
      onVisible(el, function (v) {
        if (!v || el.dataset.done) return;
        el.dataset.done = "1";
        var t0 = null, dur = 1400;
        (function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - p, 3);
          el.textContent = String(Math.round(to * e));
          if (p < 1) requestAnimationFrame(step);
        })(performance.now());
      }, { threshold: .6 });
    });
  })();

  /* ---------- story: three screens, driven by scroll ---------- */
  (function story() {
    var section = $(".story");
    if (!section || reduce || !("IntersectionObserver" in window)) return;
    var lines = $$(".story__line", section), imgs = $$(".story__img", section), bars = $$(".story__bars i", section);
    section.classList.add("is-scroll");
    var current = -1, queued = false;
    function set(n) {
      if (n === current) return;
      current = n;
      lines.forEach(function (l, k) { l.classList.toggle("is-on", k === n); l.classList.toggle("is-past", k < n); });
      imgs.forEach(function (im, k) { im.classList.toggle("is-on", k === n); });
    }
    function update() {
      queued = false;
      var r = section.getBoundingClientRect(), vh = window.innerHeight;
      var total = Math.max(1, r.height - vh);
      var p = Math.min(1, Math.max(0, -r.top / total));
      set(Math.min(lines.length - 1, Math.floor(p * lines.length * 0.999)));
      bars.forEach(function (b, k) { b.style.setProperty("--p", Math.min(1, Math.max(0, p * lines.length - k)).toFixed(3)); });
    }
    window.addEventListener("scroll", function () { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener("resize", update);
    update();
  })();

  /* ---------- offers: play illustrations in view, tilt, open the detail dialog ---------- */
  var offerModal = $("#offerModal");
  (function offerCards() {
    var cards = $$(".offer");
    if (!cards.length) return;
    cards.forEach(function (card) {
      onVisible(card, function (v) { card.classList.toggle("is-playing", v); }, { threshold: .35 });
      card.addEventListener("click", function (e) {
        if (e.target.closest("a")) return;
        openOffer(card.getAttribute("data-offer"), $(".offer__more", card));
      });
      if (!finePointer || reduce) return;
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
        card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
        card.style.transform = "perspective(1100px) rotateY(" + ((px - .5) * 7).toFixed(2) + "deg) rotateX(" + ((.5 - py) * 6).toFixed(2) + "deg) translateY(-6px)";
      });
      card.addEventListener("pointerleave", function () { card.style.transform = ""; });
    });
  })();

  var lastTrigger = null;
  var CHECK = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 10.5l3 3 7-7.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function fillOffer(k) {
    var i = O.order.indexOf(k), price = O.price[k], care = O.care[k];
    $("#omTier").textContent = "0" + (i + 1) + " / 04";
    $("#omTitle").textContent = t("offers." + k + ".name");
    $("#omBenefit").textContent = t("offers." + k + ".benefit");
    $("#omPrice").textContent = P.thb(price);
    $("#omApprox").textContent = P.approx(price);
    $("#omTime").textContent = t("offers." + k + ".time");
    $("#omCare").textContent = care ? t("offers.careFrom").replace("{price}", P.thb(care)) : t("offers.careNone");
    $("#omOrderLabel").textContent = t("offers.order").replace("{price}", P.thb(price));
    $("#omOrder").href = "checkout.html?offer=" + k;
    var list = $("#omList"); list.innerHTML = "";
    ["i1", "i2", "i3", "i4", "i5"].forEach(function (f, n) {
      var li = document.createElement("li"); li.style.setProperty("--i", n);
      li.innerHTML = CHECK;
      var s = document.createElement("span"); s.textContent = t("offers." + k + "." + f); li.appendChild(s);
      list.appendChild(li);
    });
  }
  function openOffer(k, trigger) {
    if (!offerModal || !O || O.order.indexOf(k) < 0) return;
    lastTrigger = trigger || null;
    offerModal.setAttribute("data-offer", k);
    fillOffer(k);
    var media = $("#omMedia"), art = $("#omArt");
    var old = $("video", media); if (old) old.remove();
    art.innerHTML = window.NMIcons ? window.NMIcons.svg(k) : "";
    media.classList.remove("is-playing"); void media.offsetWidth; media.classList.add("is-playing");
    var src = O.videos && O.videos[k];
    media.classList.toggle("has-video", !!src);
    if (src) {
      var v = document.createElement("video");
      v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = !reduce; v.preload = "metadata";
      v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
      if (O.posters && O.posters[k]) v.poster = O.posters[k];
      v.src = src; v.controls = reduce;
      media.appendChild(v);
    }
    if (offerModal.showModal) offerModal.showModal(); else offerModal.setAttribute("open", "");
    if (lenis()) lenis().stop();
    morph(originCard(k, trigger), false);
    $("#omOrder").focus({ preventScroll: true });
  }

  /* The dialog grows out of the card that was clicked, and shrinks back
     into it on close (FLIP on the dialog panel; content fades in after). */
  var morphCard = null;
  function originCard(k, trigger) {
    var c = (trigger && trigger.closest && trigger.closest(".offer, .pcard")) || $('.offer[data-offer="' + k + '"]');
    if (!c) return null;
    var r = c.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight ? c : null;
  }
  function morph(card, closing, done) {
    var panel = $(".om__card", offerModal);
    morphCard = closing ? morphCard : card;
    if (reduce || !card || !panel.animate) { if (done) done(); return; }
    offerModal.classList.add("is-morph");
    var a = card.getBoundingClientRect(), b = panel.getBoundingClientRect();
    var from = "translate(" + (a.left - b.left).toFixed(1) + "px," + (a.top - b.top).toFixed(1) + "px) scale(" + (a.width / b.width).toFixed(4) + "," + (a.height / b.height).toFixed(4) + ")";
    var frames = [{ transform: from, opacity: 0.35 }, { transform: "none", opacity: 1 }];
    var opts = { duration: closing ? 480 : 700, easing: closing ? "cubic-bezier(.6,0,.4,1)" : "cubic-bezier(.16,1,.3,1)", fill: "both" };
    panel.style.transformOrigin = "0 0";
    var kids = Array.prototype.slice.call(panel.children);
    if (closing) {
      kids.forEach(function (el) { el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: "both" }); });
      frames.reverse();
    } else {
      kids.forEach(function (el) { el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 420, delay: 260, easing: "ease-out", fill: "backwards" }); });
    }
    var anim = panel.animate(frames, opts);
    anim.onfinish = function () {
      if (closing) { if (done) done(); kids.forEach(function (el) { el.getAnimations().forEach(function (x) { x.cancel(); }); }); }
      anim.cancel(); panel.style.transformOrigin = ""; offerModal.classList.remove("is-morph");
    };
  }
  function closeOffer() {
    if (!offerModal.open || offerModal.classList.contains("is-closing")) return;
    var card = morphCard && morphCard.getBoundingClientRect().bottom > 0 ? morphCard : null;
    offerModal.classList.add("is-closing");
    morph(card, true, function () { offerModal.classList.remove("is-closing"); offerModal.close(); });
  }
  if (offerModal) {
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-offer-open]");
      if (b) { e.preventDefault(); e.stopPropagation(); openOffer(b.getAttribute("data-offer-open"), b); }
    });
    offerModal.addEventListener("click", function (e) { if (e.target === offerModal || e.target.closest("[data-close]")) closeOffer(); });
    offerModal.addEventListener("cancel", function (e) { e.preventDefault(); closeOffer(); });
    offerModal.addEventListener("close", function () {
      var v = $("video", offerModal); if (v) { v.pause(); v.remove(); }
      if (lenis()) lenis().start();
      if (lastTrigger) lastTrigger.focus({ preventScroll: true });
    });
    document.addEventListener("nm:lang", function () { if (offerModal.open) fillOffer(offerModal.getAttribute("data-offer")); });
    // Deep link: …/#offer-pack opens that offer.
    var m = /^#offer-(\w+)$/.exec(location.hash);
    if (m) window.addEventListener("load", function () { setTimeout(function () { openOffer(m[1]); }, 400); });
  }

  /* ---------- pricing: care plan billing toggle, CTA labels, live illustrations ---------- */
  (function pricing() {
    $$(".pcard, .guide__row").forEach(function (el) { onVisible(el, function (v) { el.classList.toggle("is-playing", v); }, { threshold: .3 }); });
    var bill = $(".bill");
    var mode = "monthly";
    try { mode = sessionStorage.getItem("nmBill") || "monthly"; } catch (e) {}
    function render(animate) {
      if (bill) {
        bill.setAttribute("data-mode", mode);
        $$(".bill__btn", bill).forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-bill") === mode)); });
      }
      $$("[data-care]").forEach(function (el) {
        var k = el.getAttribute("data-care"), m = O.care[k] * (mode === "yearly" ? O.yearlyMonths : 1);
        var wrap = el.parentNode;
        function set() {
          el.setAttribute("data-thb", m); el.textContent = P.thb(m);
          var unit = wrap.parentNode.querySelector("[data-care-unit]");
          if (unit) { var key = mode === "yearly" ? "price2.perYear" : "price2.perMonth"; unit.setAttribute("data-i18n", key); unit.textContent = t(key); }
        }
        if (animate && !reduce) { wrap.classList.add("is-swapping"); setTimeout(function () { set(); wrap.classList.remove("is-swapping"); }, 220); }
        else set();
      });
      $$("[data-cta]").forEach(function (a) {
        var k = a.getAttribute("data-cta");
        a.href = "checkout.html?offer=" + k + (O.care[k] ? "&care=" + mode : "");
        var l = $(".pcard__cta-label", a); if (l) l.textContent = t("price2.choose").replace("{name}", t("offers." + k + ".short"));
      });
    }
    if (bill) $$(".bill__btn", bill).forEach(function (b) {
      b.addEventListener("click", function () {
        mode = b.getAttribute("data-bill");
        try { sessionStorage.setItem("nmBill", mode); } catch (e) {}
        render(true);
      });
    });
    document.addEventListener("nm:lang", function () { render(false); });
    render(false);
  })();

  /* ---------- success / account pages ---------- */
  (function statusPages() {
    // Success: recap the order saved by the checkout and celebrate.
    var okRows = $("#okRows");
    if (okRows) {
      var o = null;
      try { o = JSON.parse(sessionStorage.getItem("nmCheckoutOrder") || "null"); } catch (e) {}
      if (o && O && O.price[o.plan]) {
        $("#okOrder").hidden = false;
        $("#okRef").textContent = o.ref;
        var rows = [["co2.step1", t("offers." + o.plan + ".name")], ["co2.sumCare", o.care && o.care !== "none" ? P.thb(o.monthly) + " / " + t(o.care === "yearly" ? "co2.year" : "co2.month") : t("co2.sumNone")], ["pay.paid", P.thb(o.today || O.price[o.plan])], ["booking.business", o.business]];
        rows.forEach(function (r) {
          var d = document.createElement("div"), dt = document.createElement("dt"), dd = document.createElement("dd");
          dt.textContent = t(r[0]); dd.textContent = r[1] || "—"; d.appendChild(dt); d.appendChild(dd); okRows.appendChild(d);
        });
        var msg = t("pay.order") + " " + o.ref + "\n" + t("offers." + o.plan + ".name") + " · " + P.thb(o.today || O.price[o.plan]) + "\n" + (o.business || "") + " · " + (o.email || "");
        $("#okWa").href = $("#okWa").href.split("?")[0] + "?text=" + encodeURIComponent(msg);
        try { sessionStorage.removeItem("nmCheckout"); sessionStorage.removeItem("nmCheckoutRef"); } catch (e) {}
      }
      confetti($("#confetti"));
    }
    // Account: the Stripe customer portal link, when configured.
    var portal = $("#accPortal"), pay = window.NM_PAYMENTS || {};
    if (portal && pay.portal) {
      portal.hidden = false; $("#accManual").hidden = true;
      $("#accPortalLink").href = pay.portal;
    }
  })();

  function confetti(canvas) {
    if (!canvas || reduce || !canvas.getContext) return;
    var ctx = canvas.getContext("2d"), dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = canvas.width = innerWidth * dpr, H = canvas.height = innerHeight * dpr;
    var colors = ["#9fe9cf", "#d8ae5e", "#2cc295", "#17916b", "#3ee08f", "#f2ede3"];
    var bits = [];
    for (var k = 0; k < 160; k++) {
      var a = -Math.PI / 2 + (Math.random() - .5) * 1.6, v = (9 + Math.random() * 11) * dpr;
      bits.push({ x: W / 2 + (Math.random() - .5) * W * .25, y: H * .42, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: (4 + Math.random() * 5) * dpr, c: colors[k % colors.length], s: Math.random() * 6, w: .1 + Math.random() * .2, life: 0 });
    }
    var t0 = performance.now();
    (function frame(now) {
      var el = now - t0;
      ctx.clearRect(0, 0, W, H);
      bits.forEach(function (b) {
        b.vy += .32 * dpr; b.vx *= .985; b.vy *= .985; b.x += b.vx; b.y += b.vy; b.s += b.w;
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.s);
        ctx.globalAlpha = Math.max(0, 1 - el / 3200);
        ctx.fillStyle = b.c; ctx.fillRect(-b.r / 2, -b.r / 4, b.r, b.r / 2 * (1 + Math.sin(b.s * 2)));
        ctx.restore();
      });
      if (el < 3300) requestAnimationFrame(frame); else ctx.clearRect(0, 0, W, H);
    })(t0);
  }

  /* ---------- calculator ---------- */
  (function calculator() {
    var spend = $("#calcSpend"), missed = $("#calcMissed");
    if (!spend || !missed) return;
    var outSpend = $("#calcSpendOut"), outMissed = $("#calcMissedOut"), month = $("#calcMonth"), days = $("#calcDays");
    var seen = false;
    function fill(r) { r.style.setProperty("--p", ((r.value - r.min) / (r.max - r.min) * 100).toFixed(1) + "%"); }
    /* The monthly figure rolls like a slot machine: every digit is a
       column 0–9 that slides to its value (screen readers get plain text). */
    function slots(text) {
      if (reduce) { month.textContent = text; return; }
      month.classList.add("slot-on");
      var sr = month.querySelector(".visually-hidden");
      var wrap = month.querySelector(".slot");
      var chars = Array.from(text);
      if (!wrap || wrap.getAttribute("data-shape") !== text.replace(/\d/g, "0")) {
        wrap = document.createElement("span"); wrap.className = "slot"; wrap.setAttribute("aria-hidden", "true");
        wrap.setAttribute("data-shape", text.replace(/\d/g, "0"));
        var k = 0;
        chars.forEach(function (c) {
          if (/\d/.test(c)) {
            var d = document.createElement("span"); d.className = "slot__d";
            var col = document.createElement("span"); col.className = "slot__col"; col.style.setProperty("--k", k++);
            for (var n = 0; n < 10; n++) { var x = document.createElement("span"); x.textContent = n; col.appendChild(x); }
            d.appendChild(col); wrap.appendChild(d);
          } else { var sp = document.createElement("span"); sp.textContent = c; wrap.appendChild(sp); }
        });
        month.textContent = "";
        sr = document.createElement("span"); sr.className = "visually-hidden";
        month.appendChild(sr); month.appendChild(wrap);
        void wrap.offsetWidth; // let the columns start from 0 so they roll in
      }
      sr.textContent = text;
      var cols = wrap.querySelectorAll(".slot__col"), i = 0;
      chars.forEach(function (c) { if (/\d/.test(c)) cols[i++].style.setProperty("--v", seen ? c : 0); });
    }
    function tween(to) { slots(P.thb(to)); }
    function update() {
      var s = +spend.value, m = +missed.value;
      fill(spend); fill(missed);
      outSpend.textContent = P.thb(s);
      outMissed.textContent = String(m);
      tween(Math.round(m * s * 4.33 / 10) * 10);
      var d = Math.max(1, Math.ceil(O.price.pack / (m / 7 * s)));
      days.textContent = d === 1 ? t("calc.day") : t("calc.days").replace("{n}", d);
    }
    spend.addEventListener("input", update); missed.addEventListener("input", update);
    onVisible(month, function (v) { if (v && !seen) { seen = true; update(); } }, { threshold: .6 });
    document.addEventListener("nm:lang", update);
    update();
  })();

  /* ---------- Pattaya map: the pin hops between neighbourhoods ---------- */
  (function map() {
    var pin = $("#mapPin"), route = $("#mapRoute"), label = $("#mapArea");
    if (!pin) return;
    var areas = $$(".map__area").filter(function (a) { return a.getAttribute("data-area") !== "east"; });
    var ORIGIN = [332, 250], i = 1, timer = null, visible = false;
    function xy(el) { var m = /translate\(([-\d.]+)[ ,]+([-\d.]+)\)/.exec(el.getAttribute("transform")); return [+m[1], +m[2]]; }
    function go(n) {
      i = n;
      var a = areas[i], p = xy(a), key = a.getAttribute("data-area");
      areas.forEach(function (x) { x.classList.toggle("is-on", x === a); });
      pin.style.transform = "translate(" + p[0] + "px, " + p[1] + "px)";
      var mx = (ORIGIN[0] + p[0]) / 2, my = Math.min(ORIGIN[1], p[1]) - 40;
      route.setAttribute("d", "M" + ORIGIN[0] + " " + ORIGIN[1] + "Q" + mx + " " + my + " " + p[0] + " " + p[1]);
      label.setAttribute("data-i18n", "visit." + key);
      label.textContent = t("visit." + key);
    }
    pin.removeAttribute("transform");
    go(i);
    function schedule() {
      clearTimeout(timer);
      if (!visible || document.hidden || reduce) return;
      timer = setTimeout(function () { go((i + 1) % areas.length); schedule(); }, 2600);
    }
    onVisible($(".visit__map"), function (v) { visible = v; schedule(); });
    document.addEventListener("visibilitychange", schedule);
  })();

  /* ---------- live site preview ---------- */
  (function preview() {
    var dlg = $("#preview");
    if (!dlg) return;
    var stage = $("#pvStage"), vp = $("#pvViewport"), frame = $("#pvFrame"), trigger = null;
    var SIZES = { desktop: [1280, 800], mobile: [390, 844] };
    function fit() {
      var mode = stage.getAttribute("data-mode"), W = stage.clientWidth, H = stage.clientHeight;
      var w = SIZES[mode][0], h, s;
      if (mode === "desktop") { s = Math.min(1, W / w); h = H / s; vp.style.left = Math.max(0, (W - w * s) / 2) + "px"; vp.style.top = "0px"; }
      else { h = SIZES.mobile[1]; s = Math.min(1, (H - 48) / h, (W - 48) / w); vp.style.left = ((W - w * s) / 2) + "px"; vp.style.top = ((H - h * s) / 2) + "px"; }
      vp.style.width = w + "px"; vp.style.height = h + "px"; vp.style.transform = "scale(" + s + ")";
    }
    function setMode(mode) {
      stage.setAttribute("data-mode", mode);
      $$(".seg__btn", dlg).forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-mode") === mode)); });
      fit();
    }
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-preview]");
      if (!b) return;
      trigger = b;
      var url = b.getAttribute("data-preview"), name = b.getAttribute("data-name");
      $("#pvName").textContent = name;
      $("#pvOpen").href = url;
      frame.title = t("preview.title") + " — " + name;
      stage.classList.remove("is-loaded");
      setMode(window.innerWidth < 700 ? "mobile" : "desktop");
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
      if (lenis()) lenis().stop();
      frame.src = url;
      fit();
    });
    frame.addEventListener("load", function () { if (frame.src) stage.classList.add("is-loaded"); });
    $$(".seg__btn", dlg).forEach(function (b) { b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); }); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg || e.target.closest("[data-close]")) dlg.close(); });
    dlg.addEventListener("close", function () {
      frame.removeAttribute("src");
      if (lenis()) lenis().start();
      if (trigger) trigger.focus({ preventScroll: true });
    });
    window.addEventListener("resize", function () { if (dlg.open) fit(); });
  })();
})();
