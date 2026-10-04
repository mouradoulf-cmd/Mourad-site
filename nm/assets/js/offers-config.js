/* NM Studio — the four offers, their prices and the optional care plan.
 *
 * price  — the amount used for the offer, expressed here in Thai baht
 *          (baht is what a customer is charged in Thailand).
 * care   — optional care plan per month (0 = none); yearly = 10 months.
 * videos — drop a short MP4 (≤ 2 MB) into assets/video/ and put its path here.
 * posters — optional still image shown while the video loads.
 * social — the studio's own pages; each footer icon stays hidden until filled.
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

  /* ONE currency per language, and only that one: a French visitor sees euros
     and nothing else, an English visitor pounds, an Arabic visitor dirhams, a
     Thai visitor baht (which is the real charge). Amounts are hand-rounded to
     keep round numbers — this is not a live exchange rate. Change the mapping
     or the values here and the whole site follows. */
  currency: { en: "gbp", fr: "eur", it: "eur", th: "thb", ar: "mad" },
  currencySymbol: { gbp: " £", eur: " €", mad: " DH", thb: " ฿" },
  /* Rounded local amounts, per baht price. */
  approx: {
    gbp: { 990: 22, 1990: 45, 4990: 110, 9990: 220, 290: 7, 590: 13, 1490: 33, 2900: 65, 5900: 130, 14900: 330 },
    eur: { 990: 25, 1990: 50, 4990: 125, 9990: 250, 290: 8, 590: 15, 1490: 39, 2900: 75, 5900: 150, 14900: 390 },
    mad: { 990: 270, 1990: 550, 4990: 1400, 9990: 2800, 290: 80, 590: 165, 1490: 420, 2900: 800, 5900: 1650, 14900: 4200 }
  }
};

/* Price formatting shared by every page.
   · currency()  — the single currency of the language being read
   · amount(n)   — the amount to print, in that currency ("" nowhere: Thai falls
                   back to the baht price)
   · thb(n)      — what a price reads as on the page
   · render()    — rewrites every [data-thb] on the page accordingly */
window.NMPrice = (function () {
  var O = window.NM_OFFERS;
  function lang() { return window.NM_LANG || document.documentElement.lang || "en"; }
  function group(n) { return Math.round(n).toLocaleString("en-US"); }
  function currency() { return O.currency[lang()] || "eur"; }

  function baht(n) { return lang() === "th" ? group(n) + " บาท" : "฿" + group(n); }

  /* The amount in the reader's currency; empty for Thai, where the number is
     already the baht price. */
  function amount(n) {
    var c = currency();
    if (c === "thb") return "";
    var table = O.approx[c] || {};
    var v = table[n];
    if (v == null) {
      var rate = c === "eur" ? 38 : c === "gbp" ? 45 : 0.28 * 3.6;   /* eur / gbp / mad fallbacks */
      v = c === "mad" ? Math.round(n * 0.28 / 10) * 10 : Math.round(n / rate);
    }
    return group(v) + (O.currencySymbol[c] || "");
  }

  /* What is printed: one currency only — the reader's. */
  function thb(n) {
    var a = amount(n);
    return a || baht(n);
  }

  function approx(n) { return amount(n); }

  function render(root) {
    var doc = root || document;
    doc.querySelectorAll(".nm-baht, .nm-local").forEach(function (el) { el.remove(); });

    doc.querySelectorAll("[data-thb]").forEach(function (el) {
      var n = +el.getAttribute("data-thb");
      el.textContent = thb(n);
    });

    /* The old "about 25 EUR" lines are redundant now that the headline price is
       already in the reader's currency: they say nothing more, so they go. */
    doc.querySelectorAll("[data-approx]").forEach(function (el) {
      el.textContent = "";
      el.hidden = true;
    });
  }

  document.addEventListener("nm:lang", function () { render(); });

  return { thb: thb, baht: baht, amount: amount, approx: approx, currency: currency, render: render };
})();
