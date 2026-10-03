/* NM Studio — the one honest answer to "can this page take a payment?".
   checkout.html claims Stripe wording and card logos in several places.
   Until payment-config.js holds at least one real method (a Stripe payment
   link, the customer portal, a PromptPay ID or an IBAN) and `demo` is off,
   every [data-payment-claim] block is hidden and the [data-payment-manual]
   blocks ("we'll send you the payment details on WhatsApp") are shown.
   Loaded with defer after payment-config.js; it also recomputes if the config
   is assigned later, so the order of the two files never matters. */
(function () {
  "use strict";
  window.NM_PAYMENT_READY = false;

  // True as soon as ONE real method exists and the sample data is off.
  function ready() {
    var p = window.NM_PAYMENTS || window.NM_PAYMENT || {};
    var card = p.card || {}, bank = p.bank || {};
    var link = Object.keys(card).some(function (k) { return !!card[k]; });
    return p.demo !== true && !!(link || p.portal || p.promptpay || bank.iban);
  }

  function apply() {
    var ok = ready();
    window.NM_PAYMENT_READY = ok;
    document.documentElement.setAttribute("data-payment", ok ? "live" : "manual");
    document.querySelectorAll("[data-payment-claim]").forEach(function (el) { el.hidden = !ok; });
    document.querySelectorAll("[data-payment-manual]").forEach(function (el) { el.hidden = ok; });
  }

  // payment-config.js may still be loading: catch the moment it assigns.
  var config = window.NM_PAYMENTS, flush = null;
  try {
    Object.defineProperty(window, "NM_PAYMENTS", {
      configurable: true, enumerable: true,
      get: function () { return config; },
      set: function (value) { config = value; if (flush) flush(); }
    });
    flush = apply;
  } catch (e) { /* frozen global — the two listeners below still cover us */ }

  apply();                                    // deferred: the markup is parsed
  document.addEventListener("DOMContentLoaded", apply);
  window.addEventListener("load", apply);
})();
