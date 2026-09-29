/* NM Studio — checkout flow (checkout.html).
   Four steps (offer + optional care plan → details → payment → review)
   with inline validation, a live order summary in baht, and a confirmation
   screen.
   Payments: Stripe Payment Links / PromptPay / bank details come from
   payment-config.js; any method not configured falls back to finishing
   the payment on WhatsApp. No card data is ever collected on this page. */
(function () {
  "use strict";

  var WA_URL = "https://wa.me/qr/PYPOVXTCVM74I1";
  var STORE = "nmCheckout";
  var PAY = window.NM_PAYMENTS || {};
  var params = new URLSearchParams(location.search);
  // ?demo=1 previews the Thai QR flow with a clearly labelled sample code
  // while no real PromptPay ID is configured. It never pays anyone.
  var DEMO = params.get("demo") === "1" && !PAY.promptpay;
  var PP_ID = PAY.promptpay || (DEMO ? "0000000000" : "");
  var QR_TTL = 15 * 60 * 1000;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var t = function (k) { return window.NMI18n.t(k) || ""; };
  var O = window.NM_OFFERS;
  var fmt = function (n) { return window.NMPrice.thb(n); };
  var LAST = 4;

  var form = $("#coForm");
  var panels = $$(".co-panel", form);
  var dots = $$(".co-steps__item");
  var current = 1, maxReached = 1;

  /* ---------- state ---------- */
  function planKey() { var r = $('input[name="offer"]:checked', form); return r ? r.value : O.featured; }
  function careMode(plan) {
    if (!O.care[plan || planKey()]) return "none";
    var r = $('input[name="care"]:checked', form); return r ? r.value : "none";
  }
  function method() { var r = $('input[name="method"]:checked', form); return r ? r.value : "card"; }
  // Due today = the offer, plus the first care-plan period when one is chosen.
  function amounts(plan) {
    plan = plan || planKey();
    var mode = careMode(plan), per = O.care[plan] * (mode === "yearly" ? O.yearlyMonths : 1);
    var care = mode === "none" ? 0 : per;
    return { setup: O.price[plan], care: care, mode: mode, today: O.price[plan] + care, monthly: care };
  }
  function cardLink(plan) {
    var c = PAY.card || {}, mode = careMode(plan);
    return (mode === "none" ? c[plan] : c[plan + "_" + mode]) || "";
  }
  function periodLabel(mode) { return t(mode === "yearly" ? "co2.year" : "co2.month"); }

  // Preselect the plan from ?plan=… and restore anything already typed.
  (function restore() {
    var saved = {};
    try { saved = JSON.parse(sessionStorage.getItem(STORE) || "{}"); } catch (e) {}
    var q = params.get("offer") || saved.plan;
    var r = q && $('input[name="offer"][value="' + q + '"]', form);
    if (r) r.checked = true;
    var cq = params.get("care") || saved.care;
    var cr = cq && $('input[name="care"][value="' + cq + '"]', form);
    if (cr) cr.checked = true;
    if (saved.promo && form.elements.promo) form.elements.promo.value = saved.promo;
    ["business", "type", "name", "phone", "email", "notes"].forEach(function (k) { if (saved[k] && form.elements[k]) form.elements[k].value = saved[k]; });
    if (saved.langs) $$('input[name="langs"]', form).forEach(function (c) { c.checked = saved.langs.indexOf(c.value) > -1; });
    var mq = params.get("method") || saved.method;
    if (mq) { var m = $('input[name="method"][value="' + mq + '"]', form); if (m) m.checked = true; }
  })();
  // One order reference per checkout, shown on the QR card and in the order.
  var orderRef = "";
  try { orderRef = sessionStorage.getItem(STORE + "Ref") || ""; } catch (e) {}
  if (!orderRef) {
    orderRef = "NM-" + Date.now().toString(36).slice(-6).toUpperCase();
    try { sessionStorage.setItem(STORE + "Ref", orderRef); } catch (e) {}
  }
  function save() {
    var d = collect();
    try { sessionStorage.setItem(STORE, JSON.stringify(d)); } catch (e) {}
  }
  function collect() {
    return {
      plan: planKey(), care: careMode(), method: method(), promo: (form.elements.promo.value || "").trim().toUpperCase(),
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
    $("#sumPlanName").textContent = t("offers." + p + ".name");
    $("#sumPlanTag").textContent = t("offers." + p + ".benefit");
    $("#sumSetup").textContent = fmt(a.setup);
    $("#sumMonthly").textContent = a.care ? fmt(a.care) + " / " + periodLabel(a.mode) : t("co2.sumNone");
    $("#sumToday").textContent = fmt(a.today);
    $("#sumTodayMini").textContent = fmt(a.today);
    var renew = $("#sumRenew");
    renew.hidden = !a.care;
    if (a.care) renew.textContent = t("co2.renew").replace("{price}", fmt(a.care)).replace("{period}", periodLabel(a.mode));

    // Care plan options follow the chosen offer.
    var careBox = $("#coCare"), hasCare = !!O.care[p];
    $(".co-care__opts", careBox).hidden = !hasCare;
    $("#careGoogle").hidden = hasCare;
    if (hasCare) {
      $("#careMonthlyPrice").textContent = fmt(O.care[p]);
      $("#careYearlyPrice").textContent = fmt(O.care[p] * O.yearlyMonths);
    }
    $$(".co-offer").forEach(function (l) { l.classList.toggle("is-playing", $("input", l).checked); });

    var inc = $("#coIncluded"); inc.innerHTML = "";
    ["i1", "i2", "i3", "i4", "i5"].forEach(function (f) {
      var txt = t("offers." + p + "." + f);
      if (!txt) return;
      var li = document.createElement("li");
      li.innerHTML = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 10.5l3 3 7-7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      var s = document.createElement("span"); s.textContent = txt; li.appendChild(s);
      inc.appendChild(li);
    });
    renderReview(p, a);

    // PromptPay is a Thai method: listed first for Thai visitors.
    var methods = $("#coMethods"), pp = $('input[value="promptpay"]', methods).closest(".co-method");
    if (window.NM_LANG === "th") methods.insertBefore(pp, methods.firstElementChild);
    else if (methods.firstElementChild === pp) methods.insertBefore(pp, methods.children[2]);

    // Thai visitors pay the way everyone does in Thailand: one Thai QR
    // Payment (PromptPay) code with the amount, no method list.
    var thai = window.NM_LANG === "th";
    form.classList.toggle("co-form--thai", thai);
    var sec = $(".sum__secure span"), secKey = thai ? "checkout.secureNoteQr" : "checkout.secureNote";
    sec.setAttribute("data-i18n", secKey); sec.textContent = t(secKey);
    $("#thaiQr").hidden = !thai;
    $("#coPayTitle").textContent = t(thai ? "checkout.payTitleQr" : "checkout.payTitle");
    if (thai) { var ppRadio = $('input[name="method"][value="promptpay"]', form); if (!ppRadio.checked) ppRadio.checked = true; renderThaiQr(); }

    var m = method(), note = "";
    if (m === "card") note = cardLink(p) ? t("checkout.nCardLive").replace("{amount}", fmt(a.today)) : t("checkout.nCardManual");
    if (m === "promptpay") note = PAY.promptpay ? t("checkout.nPromptLive") : t("checkout.nManual");
    if (m === "bank") note = PAY.bank && PAY.bank.iban ? t("checkout.nBankLive") : t("checkout.nManual");
    if (m === "meeting") note = t("checkout.nMeet");
    $("#coMethodNote").textContent = note;

    var label;
    if (thai) label = t(!PP_ID ? "checkout.payOrder" : slip ? "checkout.payNotify" : "checkout.payPaid").replace("{amount}", thbText(p));
    else if (m === "meeting") label = t("checkout.payConfirm");
    else if (m === "card" && cardLink(p)) label = t("checkout.payNow").replace("{amount}", fmt(a.today));
    else label = t("checkout.payOrder").replace("{amount}", fmt(a.today));
    $("#coPayLabel").textContent = label;
    // Promo codes are redeemed on Stripe's page, so the field only shows for card payments.
    $("#coPromoField").hidden = !(m === "card" && !thai);
  }

  function renderReview(p, a) {
    var box = $("#coReview"); if (!box) return;
    var mLabel = $('input[name="method"]:checked + .co-method__card b', form);
    var rows = [
      ["co2.step1", t("offers." + p + ".name") + " · " + fmt(a.setup), 1],
      ["co2.sumCare", a.care ? fmt(a.care) + " / " + periodLabel(a.mode) : t("co2.sumNone"), 1],
      ["booking.business", form.elements.business.value.trim() || "—", 2],
      ["checkout.email", form.elements.email.value.trim() || "—", 2],
      ["co2.method", window.NM_LANG === "th" ? "PromptPay" : (mLabel ? mLabel.textContent : "—"), 3],
      ["checkout.sumToday", fmt(a.today), 0]
    ];
    box.innerHTML = "";
    rows.forEach(function (r) {
      var div = document.createElement("div"), dt = document.createElement("dt"), dd = document.createElement("dd");
      if (!r[2]) div.className = "co-review__total";
      dt.textContent = t(r[0]); dd.textContent = r[1];
      div.appendChild(dt); div.appendChild(dd);
      if (r[2]) {
        var b = document.createElement("button"); b.type = "button"; b.className = "co-review__edit"; b.setAttribute("data-go", r[2]);
        b.textContent = t("co2.edit"); b.setAttribute("aria-label", t("co2.edit") + " — " + t(r[0])); div.appendChild(b);
      }
      box.appendChild(div);
    });
  }
  document.addEventListener("nm:lang", render);

  /* ---------- Thai QR Payment card ---------- */
  function thbAmount(plan) { return amounts(plan).today; }
  function thbText(plan) { return fmt(thbAmount(plan)); }
  var qrKey = "", qrExpiry = 0, qrTimer = 0, slip = null;
  function renderThaiQr() {
    var p = planKey(), amount = thbAmount(p);
    $("#thaiQrAmount").textContent = amount.toLocaleString("en-US", { minimumFractionDigits: 2 }) + " ฿";
    $("#thaiQrRef").textContent = t("checkout.qrRef") + " " + orderRef;
    $("#thaiQrPayee").textContent = PAY.promptpayName || "NM Studio";
    $("#thaiQrStatusText").textContent = t(slip ? "checkout.qrSlipIn" : "checkout.qrWaiting");
    var box = $("#thaiQr"), ready = !!PP_ID && !!window.QRCode;
    box.classList.toggle("thaiqr--pending", !ready);
    box.classList.toggle("thaiqr--slip", !!slip);
    $("#thaiQrPending").hidden = ready;
    $("#thaiQrDemo").hidden = !DEMO;
    $("#thaiQrCopy").hidden = !PAY.promptpay;
    if (!ready) return;
    var key = PP_ID + "|" + amount;
    if (key === qrKey) return;
    qrKey = key;
    var holder = $("#thaiQrCode");
    $$("canvas, img", holder).forEach(function (el) { el.remove(); });
    new window.QRCode(holder, { text: promptPayPayload(PP_ID, amount), width: 480, height: 480, colorDark: "#0b2b5e", colorLight: "#ffffff", correctLevel: window.QRCode.CorrectLevel.M });
    holder.removeAttribute("title");
    $$("img, canvas", holder).forEach(function (el) { el.setAttribute("aria-hidden", "true"); if (el.tagName === "IMG") el.alt = ""; });
    // A new amount is a new code: restart its validity window.
    if (qrExpiry) startQrTimer();
  }

  // Thai payment pages (Omise, 2C2P, marketplaces) show how long the QR
  // stays valid and let you make a fresh one when it runs out.
  function startQrTimer() {
    qrExpiry = Date.now() + QR_TTL;
    $("#thaiQr").classList.remove("thaiqr--expired");
    $("#thaiQrExpired").hidden = true;
    clearInterval(qrTimer);
    qrTimer = setInterval(tickQr, 1000);
    tickQr();
  }
  function tickQr() {
    var left = Math.max(0, qrExpiry - Date.now()), sec = Math.ceil(left / 1000);
    $("#thaiQrClock").textContent = Math.floor(sec / 60) + ":" + ("0" + (sec % 60)).slice(-2);
    $("#thaiQrBar").style.transform = "scaleX(" + (left / QR_TTL).toFixed(4) + ")";
    $("#thaiQrTimer").classList.toggle("is-low", sec <= 120);
    if (left > 0) return;
    clearInterval(qrTimer);
    $("#thaiQr").classList.add("thaiqr--expired");
    $("#thaiQrExpired").hidden = false;
  }
  $("#thaiQrRenew").addEventListener("click", function () {
    startQrTimer();
    var c = $("#thaiQrWrap");
    c.classList.remove("is-fresh"); void c.offsetWidth; c.classList.add("is-fresh");
  });

  // On a phone you can't scan your own screen: Thai banking apps read a QR
  // from the photo gallery, so offer the whole payment card as an image.
  function qrCardImage(cb) {
    var qr = $("#thaiQrCode canvas");
    if (!qr) return cb(null);
    var W = 720, H = 1010, c = document.createElement("canvas"), x = c.getContext("2d");
    c.width = W; c.height = H;
    x.fillStyle = "#ffffff"; x.fillRect(0, 0, W, H);
    x.fillStyle = "#113566"; x.fillRect(0, 0, W, 104);
    x.textAlign = "center"; x.textBaseline = "middle";
    var font = function (w, px) { return w + " " + px + "px Geist, 'Helvetica Neue', Arial, sans-serif"; };
    x.fillStyle = "#ffffff"; x.font = font(700, 30); x.fillText("THAI QR PAYMENT", W / 2, 54);
    x.fillStyle = "#0b2b5e"; x.font = font(700, 34); x.fillText("PromptPay", W / 2, 160);
    x.drawImage(qr, 120, 200, 480, 480);
    x.fillStyle = "#5a6b85"; x.font = font(500, 26); x.fillText("To  " + (PAY.promptpayName || "NM Studio"), W / 2, 730);
    x.fillStyle = "#0b2b5e"; x.font = font(700, 58); x.fillText($("#thaiQrAmount").textContent.replace(" ฿", "") + " THB", W / 2, 800);
    x.fillStyle = "#eef2f8"; x.fillRect(60, 862, W - 120, 1);
    x.fillStyle = "#5a6b85"; x.font = font(500, 24); x.fillText("Order " + orderRef + "  ·  NM Studio", W / 2, 910);
    if (DEMO) {
      x.save(); x.translate(W / 2, 440); x.rotate(-0.5); x.fillStyle = "rgba(220,38,38,.85)"; x.font = font(800, 90); x.fillText("SAMPLE", 0, 0); x.restore();
    }
    c.toBlob(cb, "image/png");
  }
  $("#thaiQrSave").addEventListener("click", function () {
    var name = "nm-studio-promptpay-" + orderRef + ".png";
    qrCardImage(function (blob) {
      if (!blob) return;
      var file = window.File ? new File([blob], name, { type: "image/png" }) : null;
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: "PromptPay · NM Studio" }).then(function () { showToast(t("checkout.qrSaved")); }, function () {});
        return;
      }
      var a = document.createElement("a"), url = URL.createObjectURL(blob);
      a.href = url; a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      showToast(t("checkout.qrSaved"));
    });
  });
  $("#thaiQrCopy").addEventListener("click", function () {
    if (navigator.clipboard) navigator.clipboard.writeText(PAY.promptpay).then(function () { showToast(t("checkout.qrCopied")); }, function () {});
  });

  // Transfer slip: every Thai shop that takes PromptPay asks for the slip
  // the banking app produces after the transfer. With no server here, it is
  // kept in the page and handed to WhatsApp on the confirmation screen.
  var slipInput = $("#slipFile"), slipUrl = "";
  function setSlip(file) {
    if (slipUrl) URL.revokeObjectURL(slipUrl);
    slip = file || null; slipUrl = slip ? URL.createObjectURL(slip) : "";
    $("#slipPreview").hidden = !slip;
    $("#slipDrop").hidden = !!slip;
    if (slip) { $("#slipImg").src = slipUrl; $("#slipName").textContent = slip.name; }
    else slipInput.value = "";
    render();
  }
  slipInput.addEventListener("change", function (e) {
    e.stopPropagation();
    var f = slipInput.files && slipInput.files[0];
    if (f && !/^image\//.test(f.type)) { showToast(t("checkout.slipBad")); slipInput.value = ""; return; }
    if (f) setSlip(f);
  });
  $("#slipRemove").addEventListener("click", function () { setSlip(null); slipInput.focus(); });
  var drop = $("#slipDrop");
  ["dragenter", "dragover"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("is-over"); }); });
  ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function () { drop.classList.remove("is-over"); }); });
  drop.addEventListener("drop", function (e) {
    e.preventDefault();
    var f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (f && /^image\//.test(f.type)) setSlip(f); else if (f) showToast(t("checkout.slipBad"));
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
    if (n === 3 && window.NM_LANG === "th" && PP_ID && !qrExpiry) startQrTimer();
    if (n === LAST) render();
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
    if (e.key === "Enter" && e.target.tagName === "INPUT" && current < LAST) { e.preventDefault(); go(current + 1); }
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
      o.slip ? t("checkout.waSlip") : "",
      t("checkout.waPlan") + ": " + t("offers." + o.plan + ".name") + " — " + fmt(o.setup),
      t("co2.sumCare") + ": " + (o.care !== "none" ? fmt(o.monthly) + " / " + periodLabel(o.care) : t("co2.sumNone")),
      t("checkout.sumToday") + ": " + fmt(o.today),
      o.promo ? t("co2.promo") + ": " + o.promo : "",
      t("checkout.waMethod") + ": " + o.methodLabel,
      "",
      t("booking.business") + ": " + o.business + " (" + o.typeLabel + ")",
      t("checkout.name") + ": " + o.name,
      "WhatsApp: " + o.phone,
      "Email: " + o.email,
      t("checkout.langs") + ": " + (o.langs.join(", ") || "—"),
      o.notes ? t("checkout.notes") + " " + o.notes : ""
    ].filter(function (l, i) { return l || i === 5; }).join("\n");
  }
  function showToast(msg) {
    var toast = $("#toast"); toast.textContent = msg; toast.classList.add("is-visible");
    clearTimeout(showToast.timer); showToast.timer = setTimeout(function () { toast.classList.remove("is-visible"); }, 5000);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (current !== LAST) { go(current + 1); return; }
    var terms = $("#coTerms");
    if (!terms.checked) { $("#coTermsErr").textContent = t("checkout.termsRequired"); terms.focus(); return; }
    $("#coTermsErr").textContent = "";

    var d = collect(), a = amounts(d.plan);
    var thaiMode = window.NM_LANG === "th";
    var o = Object.assign(d, {
      thai: thaiMode, slip: thaiMode && !!slip,
      ref: orderRef,
      setup: a.setup, monthly: a.care, today: a.today, currency: "thb",
      methodLabel: $('input[name="method"]:checked + .co-method__card b', form).textContent,
      typeLabel: form.elements.type.options[form.elements.type.selectedIndex].text
    });
    try { sessionStorage.setItem(STORE + "Order", JSON.stringify(o)); } catch (err) {}

    var link = d.method === "card" && cardLink(d.plan);
    if (link) {
      var btn = $("#coPay"); btn.disabled = true; btn.classList.add("is-loading");
      $("#coPayLabel").textContent = t("checkout.redirecting");
      var url = link + (link.indexOf("?") > -1 ? "&" : "?") + "prefilled_email=" + encodeURIComponent(d.email) + "&client_reference_id=" + encodeURIComponent(o.ref) +
        (d.promo ? "&prefilled_promo_code=" + encodeURIComponent(d.promo) : "") + (window.NM_LANG ? "&locale=" + encodeURIComponent(window.NM_LANG) : "");
      setTimeout(function () { window.location.href = url; }, 400);
      return;
    }
    showDone(o);
  });

  function showDone(o) {
    $("#coFlow").hidden = true;
    var done = $("#coDone"); done.hidden = false;
    $("#doneRef").textContent = t("checkout.doneRef") + " " + o.ref;

    var lead = o.thai ? t(!PP_ID ? "checkout.leadManual" : o.slip ? "checkout.leadSlipSent" : "checkout.leadSlip") : {
      card: t("checkout.leadCard"), promptpay: PAY.promptpay ? t("checkout.leadPrompt") : t("checkout.leadManual"),
      bank: PAY.bank && PAY.bank.iban ? t("checkout.leadBank") : t("checkout.leadManual"), meeting: t("checkout.leadMeet")
    }[o.method];
    $("#doneLead").textContent = lead;

    var payBox = $("#donePay"); payBox.innerHTML = ""; payBox.hidden = true;
    $("#doneTrack").hidden = !(o.thai && PP_ID);
    var slipFile = o.slip && slip;
    if (slipFile) {
      payBox.hidden = false;
      payBox.innerHTML = '<div class="done-slip"><img alt=""><span><b></b><small></small></span></div>';
      $(".done-slip img", payBox).src = slipUrl;
      $(".done-slip b", payBox).textContent = t("checkout.slipOk");
      $(".done-slip small", payBox).textContent = $("#thaiQrAmount").textContent + " · " + o.ref;
    }
    if (!o.thai && o.method === "promptpay" && PAY.promptpay && window.QRCode) {
      var amountThb = o.today;
      payBox.hidden = false;
      payBox.innerHTML = '<div class="pp"><div class="pp__head"><b>PromptPay</b><span>' + amountThb.toLocaleString("en-US") + ' ฿</span></div><div class="pp__qr" id="ppQr"></div><p class="pp__note"></p></div>';
      $(".pp__note", payBox).textContent = t("checkout.ppNote");
      new window.QRCode($("#ppQr"), { text: promptPayPayload(PAY.promptpay, amountThb), width: 360, height: 360, colorDark: "#111216", colorLight: "#ffffff", correctLevel: window.QRCode.CorrectLevel.M });
    }
    if (o.method === "bank" && PAY.bank && PAY.bank.iban) {
      payBox.hidden = false;
      var rows = [["checkout.bHolder", PAY.bank.holder], ["checkout.bBank", PAY.bank.bank], ["IBAN", PAY.bank.iban], ["BIC / SWIFT", PAY.bank.bic], ["checkout.bRef", o.ref], ["checkout.sumToday", fmt(o.today)]];
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
    [["checkout.waPlan", t("offers." + o.plan + ".name")], ["co2.sumOffer", fmt(o.setup)], ["co2.sumCare", o.care !== "none" ? fmt(o.monthly) + " / " + periodLabel(o.care) : t("co2.sumNone")], ["checkout.sumToday", fmt(o.today)], ["checkout.waMethod", o.methodLabel], ["booking.business", o.business], ["checkout.email", o.email]].forEach(function (r) {
      var div = document.createElement("div"), dt = document.createElement("dt"), dd = document.createElement("dd");
      dt.textContent = t(r[0]); dd.textContent = r[1]; div.appendChild(dt); div.appendChild(dd); recap.appendChild(div);
    });

    var waKey = slipFile ? "checkout.doneWaSlip" : "checkout.doneWa", waSpan = $("#doneWa span");
    waSpan.setAttribute("data-i18n", waKey); waSpan.textContent = t(waKey);
    $("#doneWa").onclick = function () {
      var msg = orderMessage(o);
      // Phones can hand the slip image and the order text straight to
      // WhatsApp through the share sheet.
      if (slipFile && navigator.canShare && navigator.canShare({ files: [slipFile] })) {
        navigator.share({ files: [slipFile], text: msg }).catch(function () {});
        return;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(msg).then(function () { showToast(t(slipFile ? "checkout.slipHint" : "booking.toast")); }, function () {});
      window.open(WA_URL + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
    };
    $("#donePrint").onclick = function () { window.print(); };

    window.scrollTo({ top: 0, behavior: "auto" });
    done.focus({ preventScroll: true });
    clearInterval(qrTimer);
    try { sessionStorage.removeItem(STORE); sessionStorage.removeItem(STORE + "Ref"); } catch (e) {}
  }

  // Returning from Stripe (configure the Payment Link's success URL as
  // …/checkout.html?paid=1) shows the confirmation for the stored order.
  if (params.get("paid") === "1") {
    try { var stored = JSON.parse(sessionStorage.getItem(STORE + "Order") || "null"); if (stored) { showDone(stored); $("#doneLead").textContent = t("checkout.leadPaid"); } } catch (e) {}
  }

  render();
  go(1, false);
})();
