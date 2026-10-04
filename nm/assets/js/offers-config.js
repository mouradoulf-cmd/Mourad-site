/* NM Studio — the five offers, their prices, the subscriptions and the
 * optional care plan.
 *
 * Price model since the subscription switch:
 *   · website and pack are "setup + subscription": a one-time setup fee paid
 *     today, then a monthly subscription that is part of the offer (there is
 *     no "no thanks" option for them). Their amounts live in `sub`.
 *   · google, qr and ultimate keep their one-time price (`price`) and their
 *     optional care plan (`care`). The owner has not given new amounts for
 *     those three yet, so nothing about them changes here.
 *
 * price  — the one-time amount, expressed in Thai baht (baht is what a
 *          customer is charged in Thailand). For the two subscribed offers it
 *          is the setup fee that goes with `sub[id].monthly`.
 * care   — optional care plan per month (0 = none).
 * sub    — monthly subscription of an offer: setup (one-time, = price) and
 *          monthly (recurring). yearly = 10 months, i.e. 2 months free.
 * yearlyMonths — months charged in a year (10 = 2 months free).
 * videos — drop a short MP4 (≤ 2 MB) into assets/video/ and put its path here.
 * posters — optional still image shown while the video loads.
 * social — the studio's own pages; each footer icon stays hidden until filled.
 */
window.NM_OFFERS = {
  order: ["google", "qr", "website", "pack", "ultimate"],
  featured: "pack",
  price: { google: 990, qr: 1990, website: 5800, pack: 19000, ultimate: 9990 },
  care: { google: 0, qr: 290, website: 0, pack: 0, ultimate: 1490 },
  sub: {
    website: { setup: 5800, monthly: 1140 },
    pack: { setup: 19000, monthly: 3800 }
  },
  yearlyMonths: 10,
  videos: { google: "", qr: "", website: "", pack: "", ultimate: "" },
  posters: { google: "", qr: "", website: "", pack: "", ultimate: "" },
  social: { facebook: "", instagram: "", tiktok: "", line: "" },

  /* ONE currency per language, and only that one: a French visitor sees euros
     and nothing else, an English visitor pounds, an Arabic visitor dirhams, a
     Thai visitor baht (which is the real charge). Amounts are hand-rounded to
     keep round numbers — this is not a live exchange rate. Change the mapping
     or the values here and the whole site follows. */
  currency: { en: "gbp", fr: "eur", it: "eur", th: "thb", ar: "mad" },
  currencySymbol: { gbp: " £", eur: " €", mad: " DH", thb: " ฿" },
  /* Rounded local amounts, per baht price. The owner's own figures are the
     ones printed: 150 € setup then 30 € a month for the website, 500 € then
     100 € a month for the Complete Pack — the baht amounts are the euro
     figures taken at ~38 ฿ to the euro, because baht is what is charged in
     Thailand. Yearly = 10 months (two free): 11,400 ฿ and 38,000 ฿. */
  approx: {
    gbp: { 990: 22, 1990: 45, 4990: 110, 9990: 220, 290: 7, 590: 13, 1490: 33, 2900: 65, 5900: 130, 14900: 330, 5800: 130, 1140: 25, 11400: 250, 19000: 420, 3800: 85, 38000: 840 },
    eur: { 990: 25, 1990: 50, 4990: 125, 9990: 250, 290: 8, 590: 15, 1490: 39, 2900: 75, 5900: 150, 14900: 390, 5800: 150, 1140: 30, 11400: 300, 19000: 500, 3800: 100, 38000: 1000 },
    mad: { 990: 270, 1990: 550, 4990: 1400, 9990: 2800, 290: 80, 590: 165, 1490: 420, 2900: 800, 5900: 1650, 14900: 4200, 5800: 1620, 1140: 320, 11400: 3190, 19000: 5320, 3800: 1060, 38000: 10640 }
  }
};

/* Price formatting shared by every page.
   · currency()  — the single currency of the language being read
   · amount(n)   — the amount to print, in that currency ("" nowhere: Thai falls
                   back to the baht price)
   · thb(n)      — what a price reads as on the page
   · sub(id)     — the monthly subscription of an offer, or null
   · subPrice(id, mode) — "150 € de mise en place puis 30 €/mois" (or the yearly
                   equivalent) in the reader's single currency
   · render()    — rewrites every [data-thb] and [data-thb-sub] on the page */
window.NMPrice = (function () {
  var O = window.NM_OFFERS;
  function lang() { return window.NM_LANG || document.documentElement.lang || "en"; }
  function group(n) { return Math.round(n).toLocaleString("en-US"); }
  function currency() { return O.currency[lang()] || "eur"; }

  function baht(n) { return lang() === "th" ? group(n) + " บาท" : "฿" + group(n); }

  /* An amount in the reader's single currency, placed the way that language
     prints prices: £130 (English), 150 € (French, Italian), 1,620 DH
     (Arabic), 5,800 บาท / ฿5,800 (Thai). */
  function money(n) {
    var c = currency();
    if (c === "thb") return baht(n);
    var s = (O.currencySymbol[c] || "").trim();
    return c === "gbp" ? s + group(n) : group(n) + " " + s;
  }

  /* A stored baht price read in the reader's currency: it goes through the
     same conversion table as every other price on the site, so the owner's
     own figures win (5,800 ฿ reads as 150 €, £130, 1,620 DH). */
  function local(n) {
    return currency() === "thb" ? baht(n) : (amount(n) || baht(n));
  }

  /* The amount in the reader's currency; empty for Thai, where the number is
     already the baht price. */
  function amount(n) {
    if (currency() === "thb") return "";
    var c = currency(), table = O.approx[c] || {}, v = table[n];
    if (v == null) {
      var rate = c === "eur" ? 38 : c === "gbp" ? 45 : 0.28 * 3.6;   /* eur / gbp / mad fallbacks */
      v = c === "mad" ? Math.round(n * 0.28 / 10) * 10 : Math.round(n / rate);
    }
    return money(v);
  }

  /* What is printed: one currency only — the reader's. */
  function thb(n) {
    var a = amount(n);
    return a || baht(n);
  }

  function approx(n) { return amount(n); }

  /* The monthly subscription of an offer (website, pack), or null. */
  function sub(id) { return (O.sub && O.sub[id]) || null; }

  /* "150 € de mise en place puis 30 €/mois" — built from the t() strings of
     the page, so every language reads its own sentence. Yearly takes
     10 months (2 free) and says so. */
  function subPrice(id, mode) {
    var s = sub(id), t = function (k) { return (window.NMI18n && window.NMI18n.t(k)) || ""; };
    if (!s) return "";
    if (mode === "yearly") {
      return t("price2.subYearly")
        .replace("{setup}", local(s.setup))
        .replace("{yearly}", local(s.monthly * (O.yearlyMonths || 10)))
        .replace("{monthly}", local(s.monthly));
    }
    return t("price2.subMonthly")
      .replace("{setup}", local(s.setup))
      .replace("{monthly}", local(s.monthly));
  }

  function render(root) {
    var doc = root || document;
    doc.querySelectorAll(".nm-baht, .nm-local").forEach(function (el) { el.remove(); });

    doc.querySelectorAll("[data-thb]").forEach(function (el) {
      var n = +el.getAttribute("data-thb");
      el.textContent = thb(n);
    });

    /* Setup + subscription lines on the offer cards, the checkout and the
       comparison table: an offer with a subscription says what is due once
       and what is due every month. */
    doc.querySelectorAll("[data-thb-sub]").forEach(function (el) {
      var id = el.getAttribute("data-thb-sub");
      el.textContent = subPrice(id, el.getAttribute("data-sub-mode") || "monthly");
      el.dir = lang() === "ar" ? "rtl" : "ltr";
      /* The markup ships the sentence hidden: nothing to read until the amount
         is really in it. */
      if (el.hasAttribute("hidden")) el.hidden = false;
    });

    /* The old "about 25 EUR" lines are redundant now that the headline price is
       already in the reader's currency: they say nothing more, so they go. */
    doc.querySelectorAll("[data-approx]").forEach(function (el) {
      el.textContent = "";
      el.hidden = true;
    });
  }

  document.addEventListener("nm:lang", function () { render(); });

  return { thb: thb, baht: baht, amount: amount, approx: approx, currency: currency, sub: sub, money: money, local: local, subPrice: subPrice, render: render };
})();
