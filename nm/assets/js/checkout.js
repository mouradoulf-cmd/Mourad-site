/* NM Studio — checkout flow (checkout.html).
   Three steps (plan → details → payment) with inline validation, a live
   order summary in the visitor's currency, and a confirmation screen.
   Payments: Stripe Payment Links / PromptPay / bank details come from
   payment-config.js; any method not configured falls back to finishing
   the payment on WhatsApp. No card data is ever collected on this page. */
(function () {
  "use strict";

  var WA_URL = "https://wa.me/qr/PYPOVXTCVM74I1";
  var STORE = "nmCheckout";
  var PAY = window.NM_PAYMENTS || {};
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var t = function (k) { return window.NMI18n.t(k) || ""; };
  var fmt = function (n) { return window.NMI18n.format(n); };

  var form = $("#coForm");
  var panels = $$(".co-panel", form);
  var dots = $$(".co-steps__item");
  var current = 1, maxReached = 1;

  /* ---------- state ---------- */
  function planKey() { var r = $('input[name="plan"]:checked', form); return r ? r.value : "pro"; }
  function method() { var r = $('input[name="method"]:checked', form); return r ? r.value : "card"; }
  function amounts(plan) {
    plan = plan || planKey();
    return { setup: window.NMI18n.price(plan + "Setup"), monthly: window.NMI18n.price(plan + "Monthly") };
  }
  function cardLink(plan) {
    var c = PAY.card && PAY.card[window.NMI18n.currency()];
    return (c && c[plan]) || "";
  }

  // Preselect the plan from ?plan=… and restore anything already typed.
  (function restore() {
    var saved = {};
    try { saved = JSON.parse(sessionStorage.getItem(STORE) || "{}"); } catch (e) {}
    var q = new URLSearchParams(location.search).get("plan") || saved.plan;
    var r = q && $('input[name="plan"][value="' + q + '"]', form);
    if (r) r.checked = true;
    ["business", "type", "name", "phone", "email", "notes"].forEach(function (k) { if (saved[k] && form.elements[k]) form.elements[k].value = saved[k]; });
    if (saved.langs) $$('input[name="langs"]', form).forEach(function (c) { c.checked = saved.langs.indexOf(c.value) > -1; });
    if (saved.method) { var m = $('input[name="method"][value="' + saved.method + '"]', form); if (m) m.checked = true; }
  })();
  function save() {
    var d = collect();
    try { sessionStorage.setItem(STORE, JSON.stringify(d)); } catch (e) {}
  }
  function collect() {
    return {
      plan: planKey(), method: method(),
      business: form.elements.business.value.trim(), type: form.elements.type.value,
      name: form.elements.name.value.trim(), phone: form.elements.phone.value.trim(),
      email: form.elements.email.value.trim(), notes: form.elements.notes.value.trim(),
      langs: $$('input[name="langs"]:checked', form).map(function (c) { return c.value; })
    };
  }
  form.addEventListener("input", save);
  form.addEventListener("change", function () { save(); render(); });

  /* ---------- rendering ---------- */
  function render() {
    var p = planKey(), a = amounts(p);
    $("#sumPlanName").textContent = t("pricing." + p + ".title");
    $("#sumPlanTag").textContent = t("pricing." + p + ".tagline");
    $("#sumSetup").textContent = fmt(a.setup);
    $("#sumMonthly").textContent = fmt(a.monthly) + " / " + t("checkout.month");
    $("#sumToday").textContent = fmt(a.setup);
    $("#sumTodayMini").textContent = fmt(a.setup);

    var inc = $("#coIncluded"); inc.innerHTML = "";
    ["f1", "f2", "f3", "f4"].forEach(function (f) {
      var txt = t("pricing." + p + "." + f);
      if (!txt) return;
      var li = document.createElement("li");
      li.innerHTML = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 10.5l3 3 7-7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      var s = document.createElement("span"); s.textContent = txt; li.appendChild(s);
      inc.appendChild(li);
    });

    // PromptPay is a Thai method: listed first for Thai visitors.
    var methods = $("#coMethods"), pp = $('input[value="promptpay"]', methods).closest(".co-method");
    if (window.NM_LANG === "th") methods.insertBefore(pp, methods.firstElementChild);
    else if (methods.firstElementChild === pp) methods.insertBefore(pp, methods.children[2]);

    // Thai visitors pay the way everyone does in Thailand: one Thai QR
    // Payment (PromptPay) code with the amount, no method list.
    var thai = window.NM_LANG === "th";
    form.classList.toggle("co-form--thai", thai);
    $("#thaiQr").hidden = !thai;
    $("#coPayTitle").textContent = t(thai ? "checkout.payTitleQr" : "checkout.payTitle");
    if (thai) { var ppRadio = $('input[name="method"][value="promptpay"]', form); if (!ppRadio.checked) ppRadio.checked = true; renderThaiQr(); }

    var m = method(), note = "";
    if (m === "card") note = cardLink(p) ? t("checkout.nCardLive").replace("{amount}", fmt(a.setup)) : t("checkout.nCardManual");
    if (m === "promptpay") note = PAY.promptpay ? t("checkout.nPromptLive") : t("checkout.nManual");
    if (m === "bank") note = PAY.bank && PAY.bank.iban ? t("checkout.nBankLive") : t("checkout.nManual");
    if (m === "meeting") note = t("checkout.nMeet");
    $("#coMethodNote").textContent = note;

    var label;
    if (thai) label = PAY.promptpay ? t("checkout.payPaid").replace("{amount}", thbText(p)) : t("checkout.payOrder").replace("{amount}", thbText(p));
    else if (m === "meeting") label = t("checkout.payConfirm");
    else if (m === "card" && cardLink(p)) label = t("checkout.payNow").replace("{amount}", fmt(a.setup));
    else label = t("checkout.payOrder").replace("{amount}", fmt(a.setup));
    $("#coPayLabel").textContent = label;
  }
  document.addEventListener("nm:lang", render);

  /* ---------- Thai QR Payment card ---------- */
  function thbAmount(plan) { return window.NMI18n.price(plan + "Setup", "thb"); }
  function thbText(plan) { return thbAmount(plan).toLocaleString("en-US") + " ฿"; }
  var qrKey = "";
  function renderThaiQr() {
    var p = planKey(), amount = thbAmount(p);
    $("#thaiQrAmount").textContent = amount.toLocaleString("en-US", { minimumFractionDigits: 2 }) + " ฿";
    var box = $("#thaiQr"), ready = !!PAY.promptpay && !!window.QRCode;
    box.classList.toggle("thaiqr--pending", !ready);
    $("#thaiQrPending").hidden = ready;
    if (!ready) return;
    var key = PAY.promptpay + "|" + amount;
    if (key === qrKey) return;
    qrKey = key;
    var holder = $("#thaiQrCode"); holder.innerHTML = "";
    new window.QRCode(holder, { text: promptPayPayload(PAY.promptpay, amount), width: 480, height: 480, colorDark: "#0b2b5e", colorLight: "#ffffff", correctLevel: window.QRCode.CorrectLevel.M });
    $$("img, canvas", holder).forEach(function (el) { el.setAttribute("aria-hidden", "true"); if (el.tagName === "IMG") el.alt = ""; });
  }
  // On a phone you can't scan your own screen: Thai banking apps scan a QR
  // from the photo gallery, so offer the code as an image to save.
  $("#thaiQrSave").addEventListener("click", function () {
    var canvas = $("#thaiQrCode canvas");
    if (!canvas) return;
    var name = "nm-studio-promptpay-" + thbAmount(planKey()) + ".png";
    canvas.toBlob(function (blob) {
      var file = blob && window.File ? new File([blob], name, { type: "image/png" }) : null;
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: "PromptPay · NM Studio" }).catch(function () {});
        return;
      }
      var a = document.createElement("a");
      a.href = canvas.toDataURL("image/png"); a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
    });
  });

  /* ---------- steps ---------- */
  function setErr(field, msg) {
    var err = document.getElementById(field.id + "Err");
    field.setAttribute("aria-invalid", msg ? "true" : "false");
    if (err) err.textContent = msg || "";
    return !msg;
  }
  function validateField(f) {
    var v = f.value.trim();
    if (f.required && !v) return setErr(f, t("booking.required"));
    if (f.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return setErr(f, t("checkout.emailInvalid"));
    if (f.type === "tel" && v && v.replace(/\D/g, "").length < 8) return setErr(f, t("checkout.phoneInvalid"));
    return setErr(f, "");
  }
  $$("input[required], select", form).forEach(function (f) {
    if (f.type === "checkbox" || f.type === "radio") return;
    f.addEventListener("blur", function () { if (f.value) validateField(f); });
    f.addEventListener("input", function () { if (f.getAttribute("aria-invalid") === "true") validateField(f); });
  });
  function validateStep(n) {
    if (n !== 2) return true;
    var bad = ["coBusiness", "coName", "coPhone", "coEmail"].map(function (id) { return document.getElementById(id); }).filter(function (f) { return !validateField(f); });
    if (bad.length) { bad[0].focus(); return false; }
    return true;
  }
  function go(n, focus) {
    if (n > current && !validateStep(current)) return;
    current = n; maxReached = Math.max(maxReached, n);
    panels.forEach(function (p) {
      var s = Number(p.getAttribute("data-step"));
      p.classList.toggle("is-open", s === n);
      p.classList.toggle("is-done", s < n);
      p.disabled = s !== n;
    });
    dots.forEach(function (d) {
      var s = Number(d.getAttribute("data-step-dot"));
      d.classList.toggle("is-current", s === n);
      d.classList.toggle("is-done", s < n);
      if (s < n) d.setAttribute("aria-current", "false"); else if (s === n) d.setAttribute("aria-current", "step"); else d.removeAttribute("aria-current");
    });
    var panel = panels[n - 1];
    if (focus !== false) {
      var top = $(".co-steps").getBoundingClientRect().top + window.scrollY - 90;
      if (window.scrollY > top) window.scrollTo({ top: top, behavior: reduce ? "auto" : "smooth" });
      var first = $("input:not([type=radio]):not([type=checkbox]), input:checked, button", panel);
      setTimeout(function () { if (first) first.focus({ preventScroll: true }); }, 220);
    }
  }
  form.addEventListener("click", function (e) {
    var b = e.target.closest("[data-go]");
    if (b) { e.preventDefault(); go(Number(b.getAttribute("data-go"))); }
  });
  dots.forEach(function (d) {
    d.addEventListener("click", function () { var s = Number(d.getAttribute("data-step-dot")); if (s < current) go(s); });
  });
  // Enter in a text field moves forward instead of submitting early.
  form.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target.tagName === "INPUT" && current < 3) { e.preventDefault(); go(current + 1); }
  });

  /* ---------- mobile summary toggle ---------- */
  var sumToggle = $("#sumToggle");
  sumToggle.addEventListener("click", function () {
    var open = sumToggle.getAttribute("aria-expanded") !== "true";
    sumToggle.setAttribute("aria-expanded", String(open));
    $(".co__summary").classList.toggle("is-open", open);
  });

  /* ---------- language buttons ---------- */
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-lang]");
    if (b) window.NMI18n.apply(b.getAttribute("data-lang"));
  });

  /* ---------- PromptPay (EMVCo) payload ---------- */
  function crc16(str) {
    var crc = 0xFFFF;
    for (var i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8;
      for (var j = 0; j < 8; j++) crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xFFFF;
    }
    return ("0000" + crc.toString(16).toUpperCase()).slice(-4);
  }
  function tlv(id, value) { return id + ("0" + value.length).slice(-2) + value; }
  function promptPayPayload(target, amountThb) {
    var id = String(target).replace(/\D/g, "");
    var acc = id.length >= 13 ? tlv("02", id) : tlv("01", ("0000000000000" + id.replace(/^0/, "66")).slice(-13));
    var p = tlv("00", "01") + tlv("01", "12") + tlv("29", tlv("00", "A000000677010111") + acc) +
      tlv("53", "764") + tlv("54", amountThb.toFixed(2)) + tlv("58", "TH") + "6304";
    return p + crc16(p);
  }

  /* ---------- submit ---------- */
  function orderMessage(o) {
    return [
      t("checkout.waHead") + " " + o.ref,
      t("checkout.waPlan") + ": NM Studio " + t("pricing." + o.plan + ".title"),
      t("checkout.sumSetup") + ": " + fmt(o.setup) + " · " + t("checkout.sumMonthly") + ": " + fmt(o.monthly),
      t("checkout.waMethod") + ": " + o.methodLabel,
      "",
      t("booking.business") + ": " + o.business + " (" + o.typeLabel + ")",
      t("checkout.name") + ": " + o.name,
      "WhatsApp: " + o.phone,
      "Email: " + o.email,
      t("checkout.langs") + ": " + (o.langs.join(", ") || "—"),
      o.notes ? t("checkout.notes") + " " + o.notes : ""
    ].filter(Boolean).join("\n");
  }
  function showToast(msg) {
    var toast = $("#toast"); toast.textContent = msg; toast.classList.add("is-visible");
    clearTimeout(showToast.timer); showToast.timer = setTimeout(function () { toast.classList.remove("is-visible"); }, 5000);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (current !== 3) { go(current + 1); return; }
    var terms = $("#coTerms");
    if (!terms.checked) { $("#coTermsErr").textContent = t("checkout.termsRequired"); terms.focus(); return; }
    $("#coTermsErr").textContent = "";

    var d = collect(), a = amounts(d.plan);
    var thaiMode = window.NM_LANG === "th";
    var o = Object.assign(d, {
      thai: thaiMode,
      ref: "NM-" + Date.now().toString(36).slice(-6).toUpperCase(),
      setup: a.setup, monthly: a.monthly, currency: window.NMI18n.currency(),
      methodLabel: $('input[name="method"]:checked + .co-method__card b', form).textContent,
      typeLabel: form.elements.type.options[form.elements.type.selectedIndex].text
    });
    try { sessionStorage.setItem(STORE + "Order", JSON.stringify(o)); } catch (err) {}

    var link = d.method === "card" && cardLink(d.plan);
    if (link) {
      var btn = $("#coPay"); btn.disabled = true; btn.classList.add("is-loading");
      $("#coPayLabel").textContent = t("checkout.redirecting");
      var url = link + (link.indexOf("?") > -1 ? "&" : "?") + "prefilled_email=" + encodeURIComponent(d.email) + "&client_reference_id=" + encodeURIComponent(o.ref);
      setTimeout(function () { window.location.href = url; }, 400);
      return;
    }
    showDone(o);
  });

  function showDone(o) {
    $("#coFlow").hidden = true;
    var done = $("#coDone"); done.hidden = false;
    $("#doneRef").textContent = t("checkout.doneRef") + " " + o.ref;

    var lead = o.thai ? (PAY.promptpay ? t("checkout.leadSlip") : t("checkout.leadManual")) : {
      card: t("checkout.leadCard"), promptpay: PAY.promptpay ? t("checkout.leadPrompt") : t("checkout.leadManual"),
      bank: PAY.bank && PAY.bank.iban ? t("checkout.leadBank") : t("checkout.leadManual"), meeting: t("checkout.leadMeet")
    }[o.method];
    $("#doneLead").textContent = lead;

    var payBox = $("#donePay"); payBox.innerHTML = ""; payBox.hidden = true;
    if (!o.thai && o.method === "promptpay" && PAY.promptpay && window.QRCode) {
      var amountThb = window.NMI18n.price(o.plan + "Setup", "thb"); // PromptPay settles in baht
      payBox.hidden = false;
      payBox.innerHTML = '<div class="pp"><div class="pp__head"><b>PromptPay</b><span>' + amountThb.toLocaleString("en-US") + ' ฿</span></div><div class="pp__qr" id="ppQr"></div><p class="pp__note"></p></div>';
      $(".pp__note", payBox).textContent = t("checkout.ppNote");
      new window.QRCode($("#ppQr"), { text: promptPayPayload(PAY.promptpay, amountThb), width: 360, height: 360, colorDark: "#111216", colorLight: "#ffffff", correctLevel: window.QRCode.CorrectLevel.M });
    }
    if (o.method === "bank" && PAY.bank && PAY.bank.iban) {
      payBox.hidden = false;
      var rows = [["checkout.bHolder", PAY.bank.holder], ["checkout.bBank", PAY.bank.bank], ["IBAN", PAY.bank.iban], ["BIC / SWIFT", PAY.bank.bic], ["checkout.bRef", o.ref], ["checkout.sumToday", fmt(o.setup)]];
      var dl = document.createElement("dl"); dl.className = "sum__rows";
      rows.forEach(function (r) {
        if (!r[1]) return;
        var div = document.createElement("div"), dt = document.createElement("dt"), dd = document.createElement("dd");
        dt.textContent = r[0].indexOf("checkout.") === 0 ? t(r[0]) : r[0]; dd.textContent = r[1];
        div.appendChild(dt); div.appendChild(dd); dl.appendChild(div);
      });
      payBox.appendChild(dl);
    }

    var recap = $("#doneRecap"); recap.innerHTML = "";
    [["checkout.waPlan", "NM Studio " + t("pricing." + o.plan + ".title")], ["checkout.sumSetup", fmt(o.setup)], ["checkout.sumMonthly", fmt(o.monthly) + " / " + t("checkout.month")], ["checkout.waMethod", o.methodLabel], ["booking.business", o.business], ["checkout.email", o.email]].forEach(function (r) {
      var div = document.createElement("div"), dt = document.createElement("dt"), dd = document.createElement("dd");
      dt.textContent = t(r[0]); dd.textContent = r[1]; div.appendChild(dt); div.appendChild(dd); recap.appendChild(div);
    });

    $("#doneWa").onclick = function () {
      var msg = orderMessage(o);
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(msg).then(function () { showToast(t("booking.toast")); }, function () {});
      window.open(WA_URL + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
    };
    $("#donePrint").onclick = function () { window.print(); };

    window.scrollTo({ top: 0, behavior: "auto" });
    done.focus({ preventScroll: true });
    try { sessionStorage.removeItem(STORE); } catch (e) {}
  }

  // Returning from Stripe (configure the Payment Link's success URL as
  // …/checkout.html?paid=1) shows the confirmation for the stored order.
  if (new URLSearchParams(location.search).get("paid") === "1") {
    try { var stored = JSON.parse(sessionStorage.getItem(STORE + "Order") || "null"); if (stored) { showDone(stored); $("#doneLead").textContent = t("checkout.leadPaid"); } } catch (e) {}
  }

  render();
  go(1, false);
})();
