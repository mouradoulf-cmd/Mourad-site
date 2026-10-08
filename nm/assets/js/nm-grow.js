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
