/* NM Studio — the four offers, their prices and the optional care plan.
 *
 * price  — one-time price in Thai baht.
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

  /* The price follows the language of the page: a French visitor reads the
     amount in euros, an Arabic reader in dirhams, a Thai reader in baht.
     Baht stays the real price (it is what customers are charged), so the
     other currencies are shown next to it, rounded by hand for round numbers
     — this is not a live exchange rate. Change the mapping or the amounts
     here and the whole site follows. */
  currency: { en: "eur", fr: "eur", it: "eur", th: "thb", ar: "mad" },
  currencySymbol: { eur: " €", mad: " DH", thb: " ฿" },
  /* The little word in front of the rounded amount, in each language. */
  aboutWord: { en: "about", fr: "environ", it: "circa", ar: "حوالي" },
  approx: {
    eur: { 990: 25, 1990: 50, 4990: 125, 9990: 250, 290: 8, 590: 15, 1490: 39, 2900: 75, 5900: 150, 14900: 390 },
    mad: { 990: 270, 1990: 550, 4990: 1400, 9990: 2800, 290: 80, 590: 165, 1490: 420, 2900: 800, 5900: 1650, 14900: 4200 }
  }
};

/* Price formatting shared by every page. Baht is always the real price. */
window.NMPrice = (function () {
  var O = window.NM_OFFERS;
  function lang() { return window.NM_LANG || document.documentElement.lang || "en"; }
  function group(n) { return Math.round(n).toLocaleString("en-US"); }
  function thb(n) { return lang() === "th" ? group(n) + " บาท" : "฿" + group(n); }

  /* Currency of the language currently displayed ("thb" = baht, shown as-is). */
  function currency() { return O.currency[lang()] || "eur"; }

  /* Rounded amount in the reader's currency, without the leading word.
     Returns "" for Thai, where the baht price is already the local one. */
  function amount(n) {
    var c = currency();
    if (c === "thb") return "";
    var table = O.approx[c] || {};
    var v = table[n];
    if (v == null) v = c === "eur" ? Math.round(n / 38) : Math.round(n * 0.28 / 10) * 10;
    return group(v) + (O.currencySymbol[c] || "");
  }

  /* "environ 25 €" / "about 25 €" / "حوالي 270 DH" — "" in Thai. */
  function approx(n) {
    var a = amount(n);
    if (!a) return "";
    var word = O.aboutWord[lang()];
    return (word ? word + " " : "") + a;
  }

  function render(root) {
    var doc = root || document;

    doc.querySelectorAll("[data-thb]").forEach(function (el) {
      var n = +el.getAttribute("data-thb");
      el.textContent = thb(n);

      /* Every baht price also carries its equivalent in the reader's currency,
         so a price list is readable without knowing the baht. Skipped when the
         surrounding card already ships its own [data-approx] for that amount
         (the offer and pricing cards do), and not added at all in Thai. */
      var parent = el.parentNode;
      if (!parent) return;
      var node = parent, hasDedicated = false;
      for (var up = 0; up < 4 && node && node !== document.body; up++, node = node.parentNode) {
        if (node.querySelector && node.querySelector('[data-approx="' + n + '"]')) { hasDedicated = true; break; }
      }
      if (hasDedicated) return;
      var next = el.nextElementSibling;
      var has = !!(next && next.classList && next.classList.contains("nm-approx"));
      var text = approx(n);
      if (!text) { if (has) next.remove(); return; }
      if (!has) {
        el.insertAdjacentHTML("afterend", '<span class="nm-approx"></span>');
        next = el.nextElementSibling;
      }
      next.textContent = text;
      next.setAttribute("lang", lang() === "ar" ? "ar" : "");
      if (lang() !== "ar") next.removeAttribute("lang");
    });

    doc.querySelectorAll("[data-approx]").forEach(function (el) {
      var a = approx(+el.getAttribute("data-approx"));
      el.textContent = a;
      el.hidden = !a;
    });
  }

  document.addEventListener("nm:lang", function () {
    document.querySelectorAll(".nm-approx").forEach(function (el) { el.remove(); });
    render();
  });
  return { thb: thb, approx: approx, amount: amount, currency: currency, render: render };
})();
