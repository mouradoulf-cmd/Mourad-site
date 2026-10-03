/* NM Studio — the four offers, their prices and the optional care plan.
 *
 * price  — one-time price in Thai baht (the real price, what is charged).
 * care   — optional care plan, baht per month (0 = no care plan).
 *          Yearly billing = 10 months (2 months free).
 * videos — drop a short MP4 (15–20 s, ≤ 2 MB, 16:9 or 4:5) into
 *          assets/video/ and put its path here, e.g. "assets/video/google.mp4".
 *          Left empty, the offer shows its animated illustration instead.
 * posters — optional still image shown while the video loads.
 * social — the studio's own pages. Each footer icon (real brand logo)
 *          stays hidden until its link is filled in here.
 */
window.NM_OFFERS = {
  order: ["google", "qr", "pack", "ultimate"],
  featured: "pack",
  price: { google: 990, qr: 1990, pack: 4990, ultimate: 9990 },
  care: { google: 0, qr: 290, pack: 590, ultimate: 1490 },
  yearlyMonths: 10,
  videos: { google: "", qr: "", pack: "", ultimate: "" },
  posters: { google: "", qr: "", pack: "", ultimate: "" },
  social: { facebook: "", instagram: "", tiktok: "", line: "" },

  /* The price follows the language of the page: French and Italian readers see
     euros, Arabic readers dirhams, Thai readers baht. Baht is the real price —
     it is what the customer is charged — so it is always shown as well, in
     small, right after the local amount. Amounts are rounded by hand to keep
     round numbers; this is not a live exchange rate. Change the mapping or the
     values here and the whole site follows. */
  currency: { en: "eur", fr: "eur", it: "eur", th: "thb", ar: "mad" },
  currencySymbol: { eur: " €", mad: " DH", thb: " ฿" },
  /* "environ" / "about" / "circa" / "حوالي" — left out in Thai, where the baht
     price is already the local one and needs no approximation. */
  approxWord: { en: "about", fr: "environ", it: "circa", ar: "حوالي" },
  /* Rounded local amounts per baht price. */
  approx: {
    eur: { 990: 25, 1990: 50, 4990: 125, 9990: 250, 290: 8, 590: 15, 1490: 39, 2900: 75, 5900: 150, 14900: 390 },
    mad: { 990: 270, 1990: 550, 4990: 1400, 9990: 2800, 290: 80, 590: 165, 1490: 420, 2900: 800, 5900: 1650, 14900: 4200 }
  }
};

/* Price formatting shared by every page.
   · local(n)  — the amount in the reader's currency, or "" in Thai
   · baht(n)   — the real price, always available
   · thb(n)    — what a price should read as: local first, then the real price
   · render()  — rewrites every [data-thb] on the page accordingly */
window.NMPrice = (function () {
  var O = window.NM_OFFERS;
  function lang() { return window.NM_LANG || document.documentElement.lang || "en"; }
  function group(n) { return Math.round(n).toLocaleString("en-US"); }
  function currency() { return O.currency[lang()] || "eur"; }

  function baht(n) { return lang() === "th" ? group(n) + " บาท" : "฿" + group(n); }

  function amount(n) {
    var c = currency();
    if (c === "thb") return "";
    var table = O.approx[c] || {};
    var v = table[n];
    if (v == null) v = c === "eur" ? Math.round(n / 38) : Math.round(n * 0.28 / 10) * 10;
    return group(v) + (O.currencySymbol[c] || "");
  }

  /* "25 €" in French, "270 DH" in Arabic, "" in Thai. */
  function local(n) { return amount(n); }

  /* "25 € · ฿990" — local first, real price after; just "฿990" in Thai. */
  function thb(n) {
    var a = amount(n);
    return a ? a + " · " + baht(n) : baht(n);
  }

  /* The little word in front of a rounded amount: "environ 25 €". */
  function approx(n) {
    var a = amount(n);
    if (!a) return "";
    var word = O.approxWord[lang()];
    return (word ? word + " " : "") + a;
  }

  function render(root) {
    var doc = root || document;

    doc.querySelectorAll("[data-thb]").forEach(function (el) {
      var n = +el.getAttribute("data-thb");
      var localAmount = local(n);
      var previous = el.querySelector && el.querySelector(".nm-local");
      if (previous) previous.remove();

      if (!localAmount) { el.textContent = baht(n); return; }

      /* Local currency becomes the headline price; the real baht price travels
         with it so nobody is surprised by the charge. */
      el.textContent = localAmount;
      el.insertAdjacentHTML("beforeend", '<span class="nm-baht">' + baht(n) + "</span>");
    });

    /* The old "about 25 €" lines are now redundant where the headline price is
       already in euros: they either disappear (Thai) or carry the baht price. */
    doc.querySelectorAll("[data-approx]").forEach(function (el) {
      var n = +el.getAttribute("data-approx");
      el.textContent = local(n) ? "≈ " + baht(n) : "";
      el.hidden = !local(n);
    });
  }

  document.addEventListener("nm:lang", function () {
    document.querySelectorAll(".nm-local, .nm-baht").forEach(function (el) { el.remove(); });
    render();
  });

  return { thb: thb, baht: baht, local: local, approx: approx, amount: amount, currency: currency, render: render };
})();
