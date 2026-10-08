/* NM Studio: free mock-up / free Google check forms, founder section, optional analytics.
   Settings live in contact-config.js (window.NM_CONTACT). */
(function () {
  "use strict";
  var C = window.NM_CONTACT || {};
  var me = document.querySelector('script[src*="nm-grow.js"]');
  var base = me ? me.getAttribute("src").replace(/assets\/js\/nm-grow\.js.*$/, "") : "";   // "" or "../"
  function t(k) { return (window.NMI18n && window.NMI18n.t(k)) || ""; }

  /* ---------- toast (same element as the rest of the site) ---------- */
  var toastEl = document.getElementById("toast"), toastTimer = 0;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg; toastEl.classList.add("is-visible");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.classList.remove("is-visible"); }, 5000);
  }
  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).catch(fallback);
    return fallback();
    function fallback() {
      return new Promise(function (ok) {
        var ta = document.createElement("textarea"); ta.value = text; ta.setAttribute("readonly", "");
        ta.style.cssText = "position:fixed;top:-1000px;opacity:0"; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        ta.remove(); ok();
      });
    }
  }

  /* ---------- free mock-up / free check forms ---------- */
  [].slice.call(document.querySelectorAll("form[data-free]")).forEach(function (form) {
    var kind = form.getAttribute("data-free");   // "m" mock-up, "a" Google check
    var err = form.querySelector(".free__err");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.elements.business.value.trim();
      if (!name) { if (err) err.textContent = t("free.req"); form.elements.business.focus(); return; }
      if (err) err.textContent = "";
      var lines = [t(kind === "m" ? "free.msgM" : "free.msgA"), "", "*" + t("free.l_name") + ":* " + name];
      [["type", "l_type"], ["city", "l_city"], ["maps", "l_maps"], ["first", "l_first"]].forEach(function (f) {
        var el = form.elements[f[0]]; if (!el) return;
        var v = el.tagName === "SELECT" ? (el.value ? el.options[el.selectedIndex].text : "") : el.value.trim();
        if (v) lines.push("*" + t("free." + f[1]) + ":* " + v);
      });
      var msg = lines.join("\n");
      try { document.dispatchEvent(new CustomEvent("nm:lead", { detail: { kind: kind } })); } catch (e2) {}
      var num = String(C.whatsappNumber || "").replace(/\D/g, "");
      if (num) { window.open("https://wa.me/" + num + "?text=" + encodeURIComponent(msg), "_blank", "noopener"); return; }
      // No number configured: copy the message, then open the WhatsApp link (a new tab opened right away keeps the gesture)
      var copied = copy(msg);   // start the copy inside the tap, then open WhatsApp in the same tap
      window.open(C.whatsappLink || "https://wa.me/qr/PYPOVXTCVM74I1", "_blank", "noopener");
      copied.then(function () { toast(t("free.copied")); });
    });
  });

  /* ---------- video-call booking (slots in Thailand time, real availability from contact-config.js) ---------- */
  (function booking() {
    var box = document.getElementById("book"), cfg = C.booking;
    if (!box || !cfg) return;
    var daysEl = box.querySelector(".book__days"), slotsEl = box.querySelector(".book__slots"), localEl = box.querySelector(".book__local");
    var form = box.querySelector("form[data-book]"), err = form.querySelector(".free__err");
    var TZ = 7 * 3600e3, booked = {}, closed = {}, sel = null, curDay = null;
    (cfg.booked || []).forEach(function (k) { booked[k.trim()] = 1; });
    (cfg.closed || []).forEach(function (k) { closed[k.trim()] = 1; });
    function lang() { return document.documentElement.lang || "en"; }
    function pad(n) { return (n < 10 ? "0" : "") + n; }
    function thDate(ms) { return new Date(ms + TZ); }                       // read with getUTC* = Thailand wall clock
    function slotMs(ymd, hm) { var p = ymd.split("-"), h = hm.split(":"); return Date.UTC(+p[0], +p[1] - 1, +p[2], +h[0], +h[1]) - TZ; }
    function fmt(ms, o) { try { return new Intl.DateTimeFormat(lang(), Object.assign({ timeZone: "Asia/Bangkok" }, o)).format(ms); } catch (e) { return ""; } }
    function localFmt(ms) { try { return new Intl.DateTimeFormat(lang(), { hour: "2-digit", minute: "2-digit", weekday: "short" }).format(ms); } catch (e) { return ""; } }
    var sameZone = (-new Date().getTimezoneOffset()) === 420;

    function days() {
      var out = [], now = Date.now(), base = thDate(now);
      for (var i = 0; i < (cfg.daysAhead || 10); i++) {
        var d = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate() + i));
        var ymd = d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()), wd = d.getUTCDay() || 7;
        if ((cfg.days || []).indexOf(wd) < 0 || closed[ymd]) continue;
        var slots = (cfg.hours || []).map(function (hm) {
          var ms = slotMs(ymd, hm); return { ymd: ymd, hm: hm, ms: ms, taken: !!booked[ymd + " " + hm], past: ms < now + 2 * 3600e3 };
        }).filter(function (x) { return !x.past; });
        if (slots.length) out.push({ ymd: ymd, ms: slotMs(ymd, "12:00"), slots: slots, free: slots.filter(function (x) { return !x.taken; }).length });
      }
      return out;
    }
    function render() {
      var list = days(); daysEl.innerHTML = ""; slotsEl.innerHTML = "";
      if (!list.some(function (d) { return d.free; })) { slotsEl.innerHTML = '<p class="book__none">' + t("book.none") + "</p>"; return; }
      if (!curDay || !list.some(function (d) { return d.ymd === curDay && d.free; })) curDay = (list.filter(function (d) { return d.free; })[0] || list[0]).ymd;
      list.forEach(function (d) {
        var b = document.createElement("button"); b.type = "button"; b.className = "book__day"; b.disabled = !d.free;
        b.setAttribute("aria-pressed", String(d.ymd === curDay));
        b.innerHTML = "<span>" + fmt(d.ms, { weekday: "short" }) + "</span><b>" + fmt(d.ms, { day: "numeric" }) + "</b><small>" + fmt(d.ms, { month: "short" }) + "</small>" + (d.free ? "<i></i>" : "");
        b.onclick = function () { curDay = d.ymd; sel = null; render(); };
        daysEl.appendChild(b);
      });
      var day = list.filter(function (d) { return d.ymd === curDay; })[0];
      day.slots.forEach(function (x, n) {
        var b = document.createElement("button"); b.type = "button"; b.className = "book__slot"; b.disabled = x.taken; b.style.setProperty("--i", n);
        b.setAttribute("aria-pressed", String(!!(sel && sel.ms === x.ms)));
        b.innerHTML = x.hm + (x.taken ? "<small>" + t("book.taken") + "</small>" : "");
        b.onclick = function () {   // select without rebuilding the grid, so the entrance animation does not replay
          sel = x; err.textContent = "";
          [].slice.call(slotsEl.querySelectorAll(".book__slot")).forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
          summary();
        };
        slotsEl.appendChild(b);
      });
      summary();
    }
    var sumBox = box.querySelector(".bk__sum"), sumV = box.querySelector(".bk__sumv"), clockEl = box.querySelector(".bk__clocktxt");
    function summary() {
      localEl.textContent = sel && !sameZone ? t("book.local").replace("{t}", localFmt(sel.ms)) : "";
      if (!sumBox) return;
      if (sel) { sumV.textContent = fmt(sel.ms, { weekday: "long", day: "numeric", month: "long" }) + " · " + sel.hm + " · " + t("book.dur"); sumBox.classList.remove("is-set"); void sumBox.offsetWidth; sumBox.classList.add("is-set"); }
      else { sumV.textContent = t("book.sumNone"); sumBox.classList.remove("is-set"); }
    }
    function clock() { if (clockEl) clockEl.textContent = t("book.clock").replace("{t}", fmt(Date.now(), { hour: "2-digit", minute: "2-digit" })); }
    clock(); setInterval(clock, 30e3); document.addEventListener("nm:lang", function () { setTimeout(clock, 0); });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!sel) { err.textContent = t("book.pick"); return; }
      var name = form.elements.business.value.trim(), first = form.elements.first.value.trim();
      var when = fmt(sel.ms, { weekday: "long", day: "numeric", month: "long" }) + " · " + sel.hm + " (" + t("book.tz") + ")";
      var lines = [t("book.msg"), "", "*" + t("book.l_slot") + ":* " + when];
      if (name) lines.push("*" + t("free.l_name") + ":* " + name);
      if (first) lines.push("*" + t("free.l_first") + ":* " + first);
      var msg = lines.join("\n");
      try { document.dispatchEvent(new CustomEvent("nm:lead", { detail: { kind: "book" } })); } catch (e2) {}
      var num = String(C.whatsappNumber || "").replace(/\D/g, "");
      if (num) { window.open("https://wa.me/" + num + "?text=" + encodeURIComponent(msg), "_blank", "noopener"); return; }
      var copied = copy(msg);
      window.open(C.whatsappLink || "https://wa.me/qr/PYPOVXTCVM74I1", "_blank", "noopener");
      copied.then(function () { toast(t("book.copied")); });
    });
    render();
    document.addEventListener("nm:lang", function () { setTimeout(render, 0); });
    setInterval(render, 5 * 60e3);
  })();

  /* ---------- referral: "{gift}" follows referralMonths, form goes to WhatsApp ---------- */
  (function referral() {
    var box = document.getElementById("parrainage"); if (!box) return;
    var n = Math.max(1, parseInt(C.referralMonths, 10) || 1);
    function gift() { return t(n === 1 ? "ref.gift1" : n === 2 ? "ref.gift2" : "ref.giftN").replace("{n}", n); }
    function fill() {
      var g = gift(); if (!g) return;
      [].slice.call(box.querySelectorAll("[data-ref-fill]")).forEach(function (el) {
        var key = el.getAttribute("data-i18n-html") || el.getAttribute("data-i18n"), v = t(key); if (!v) return;
        if (el.hasAttribute("data-i18n-html")) el.innerHTML = v.split("{gift}").join(g); else el.textContent = v.split("{gift}").join(g);
      });
      [].slice.call(box.querySelectorAll("[data-ref-gift]")).forEach(function (el) { el.textContent = g; });
    }
    fill(); window.addEventListener("load", fill); document.addEventListener("nm:lang", function () { setTimeout(fill, 0); });
    var form = box.querySelector("form[data-ref]"), err = form.querySelector(".free__err");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var biz = form.elements.biz.value.trim();
      if (!biz) { err.textContent = t("ref.req"); form.elements.biz.focus(); return; }
      err.textContent = "";
      var lines = [t("ref.msg"), "", "*" + t("ref.l_biz") + ":* " + biz];
      [["city", "l_city"], ["contact", "l_contact"], ["you", "l_you"], ["yourBiz", "l_yourBiz"]].forEach(function (f) {
        var v = form.elements[f[0]].value.trim(); if (v) lines.push("*" + t("ref." + f[1]) + ":* " + v);
      });
      var msg = lines.join("\n");
      try { document.dispatchEvent(new CustomEvent("nm:lead", { detail: { kind: "ref" } })); } catch (e2) {}
      var num = String(C.whatsappNumber || "").replace(/\D/g, "");
      if (num) { window.open("https://wa.me/" + num + "?text=" + encodeURIComponent(msg), "_blank", "noopener"); return; }
      var copied = copy(msg);
      window.open(C.whatsappLink || "https://wa.me/qr/PYPOVXTCVM74I1", "_blank", "noopener");
      copied.then(function () { toast(t("ref.copied")); });
    });
  })();

  /* ---------- LINE: floating button + footer link, only once a LINE link is set ---------- */
  if (C.lineLink) {
    [].slice.call(document.querySelectorAll(".line-float")).forEach(function (a) { a.href = C.lineLink; a.hidden = false; });
    var waFoot = document.querySelector('.footer__col a[href*="wa.me"]');
    if (waFoot) { var la = document.createElement("a"); la.href = C.lineLink; la.target = "_blank"; la.rel = "noopener"; la.textContent = "LINE"; waFoot.parentNode.insertBefore(la, waFoot.nextSibling); }
  }

  /* ---------- founder: name and photo from the settings ---------- */
  var founderName = C.founderName || "Mourad";
  function fillName() {
    [].slice.call(document.querySelectorAll("[data-founder-fill]")).forEach(function (el) {
      if (el.textContent.indexOf("{name}") > -1) el.textContent = el.textContent.split("{name}").join(founderName);
    });
    [].slice.call(document.querySelectorAll("[data-founder-name]")).forEach(function (el) { el.textContent = founderName.charAt(0).toUpperCase(); });
  }
  fillName();
  document.addEventListener("nm:lang", function () { setTimeout(fillName, 0); });
  window.addEventListener("load", fillName);
  if (C.founderPhoto) {
    [].slice.call(document.querySelectorAll(".founder__photo")).forEach(function (box) {
      var img = new Image(); img.alt = ""; img.decoding = "async"; img.loading = "lazy";
      img.onload = function () { box.classList.add("has-photo"); };
      img.src = /^(https?:)?\//.test(C.founderPhoto) ? C.founderPhoto : base + C.founderPhoto;
      box.appendChild(img);
    });
  }

  /* ---------- analytics (Cloudflare Web Analytics: no cookies), only when a token is set ---------- */
  if (C.analyticsToken) {
    var s = document.createElement("script"); s.defer = true;
    s.src = "https://static.cloudflareinsights.com/beacon.min.js";
    s.setAttribute("data-cf-beacon", JSON.stringify({ token: C.analyticsToken }));
    document.head.appendChild(s);
  }
})();
