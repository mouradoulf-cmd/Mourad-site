/* NM Studio — shared page interactions: counters, offer cards + detail
   dialog, pricing toggle, success/account pages, social links and the live
   site preview.
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

  /* ---------- device mockups: scale the fixed-px devices.css frames
     (MacBook Pro / iPhone 14 Pro) to fit their responsive slot ---------- */
  (function deviceScale() {
    var NATIVE_W = { "device-macbook-pro": 740, "device-iphone-14-pro": 428 };
    var els = $$(".dev-scale .device");
    if (!els.length) return;
    function nativeWidth(el) {
      for (var k in NATIVE_W) { if (el.classList.contains(k)) return NATIVE_W[k]; }
      return el.offsetWidth || 1;
    }
    function fit(el) {
      var w = el.parentElement.offsetWidth, nw = nativeWidth(el);
      el.style.setProperty("--s", w ? w / nw : 1);
    }
    function fitAll() { els.forEach(fit); }
    fitAll();
    if ("ResizeObserver" in window) {
      var ro = new ResizeObserver(fitAll);
      els.forEach(function (el) { ro.observe(el.parentElement); });
    } else {
      var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(fitAll, 150); });
    }
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
    var colors = ["#f6e1ad", "#e6c27a", "#c79c50", "#7b61ff", "#4f7bff", "#ffffff"];
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

  /* ---------- social links: shown only once they are configured ---------- */
  (function socials() {
    var cfg = (O && O.social) || {};
    $$("[data-social]").forEach(function (a) {
      var url = cfg[a.getAttribute("data-social")];
      if (!url) return;
      a.href = url;
      a.parentNode.hidden = false;
    });
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
