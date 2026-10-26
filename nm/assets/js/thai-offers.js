/* NM Studio: the Thailand offers, shown ONLY when the page is read in Thai (and on the private French reading copy
   /nm/th-fr/). QR menu 390 baht/month with free setup, Website + QR menu 790 baht/month; no Google listing, no online
   checkout: every card leads to the appointment sheet (#book), plus a link to a live QR menu (Mae Lek).
   Every other language keeps the regular offers (offers-config.js), untouched.
   - texts live in nm-offers.js (window.NM_OFFERS2); this file only builds the cards
   - while it shows, the regular cards, links, payment strip, billing toggle, care box, comparison and guide are hidden
   - re-rendered on "nm:lang" (the language switch works in place) */
(function () {
  "use strict";
  var O = window.NM_OFFERS2;
  if (!O) return;
  var SRC = document.currentScript && document.currentScript.src;
  var DEMO = SRC ? new URL("../../../menus/mae-lek/", SRC).href : "../menus/mae-lek/";

  var CHECK = '<svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M4.5 10.5l3.5 3.5 7.5-8" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ARROW = '<svg aria-hidden="true" class="btn__arrow" fill="none" viewBox="0 0 20 20"><path d="M4 10h11m0 0l-4.5-4.5M15 10l-4.5 4.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7"></path></svg>';
  var CAL = '<svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18" fill="none"><rect x="3" y="4.5" width="14" height="12.5" rx="2.5" stroke="currentColor" stroke-width="1.6"/><path d="M3 8.5h14M7 2.8v3.4M13 2.8v3.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  var ICON = {
    menu: '<svg aria-hidden="true" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="7" width="13" height="13" rx="2.5"/><rect x="28" y="7" width="13" height="13" rx="2.5"/><rect x="7" y="28" width="13" height="13" rx="2.5"/><path d="M28 28h5v5h-5zM38 28h3M28 38h3M36 36h5v5"/></svg>',
    site: '<svg aria-hidden="true" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="9" width="38" height="30" rx="4"/><path d="M5 18h38M11 14h3M17 14h3"/><path d="M13 25h12M13 31h20"/></svg>'
  };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function list(items) { return '<ul class="tho-card__list">' + items.map(function (t) { return "<li>" + CHECK + "<span>" + esc(t) + "</span></li>"; }).join("") + "</ul>"; }
  function money(n, L) { var v = n.toLocaleString("en-US"); return L.cur === "บาท" ? '<strong>' + v + '</strong><span class="tho-card__cur">บาท</span>' : '<strong>' + v + '</strong><span class="tho-card__cur">฿</span>'; }

  // photo ribbon above the cards: the retouched HD dish photos of the sample menu (what a menu by NM Studio looks like)
  var RIB = {
    th: { k: "รูปอาหารในเมนู", t: "รูปที่ทำให้ลูกค้า<em>อยากสั่ง</em>", c: "ภาพประกอบจากเมนูตัวอย่าง · เมนูของร้านคุณใช้รูปอาหารของร้าน ปรับแสงและสีให้น่ากิน" },
    fr: { k: "Les photos du menu", t: "Des photos qui donnent <em>envie de commander</em>", c: "Photos d'illustration du menu d'exemple · le menu de votre restaurant utilise vos plats, avec lumière et couleurs retouchées" },
    en: { k: "Menu photos", t: "Photos that make guests <em>want to order</em>", c: "Illustration photos from the sample menu · your menu uses your own dishes, with light and colour retouched" }
  };
  var DISHES = [["krapao", "ผัดกะเพรา"], ["tomyum", "ต้มยำกุ้ง"], ["somtam", "ส้มตำไทย"], ["curry", "แกงเผ็ด"], ["padthai", "ผัดไทย"], ["mango", "ข้าวเหนียวมะม่วง"], ["noodle", "ก๋วยเตี๋ยว"], ["chicken", "ไก่ทอด"], ["glory", "ผักบุ้งไฟแดง"], ["tea", "ชาไทย"]];
  function ribbon(lang) {
    var R = RIB[lang] || RIB.en;
    var cells = DISHES.map(function (d) { return '<figure class="rib__c"><img src="' + DEMO + d[0] + '-c-800.webp" alt="' + d[1] + '" width="800" height="1000" loading="lazy" decoding="async"><figcaption lang="th">' + d[1] + "</figcaption></figure>"; }).join("");
    return '<div class="rib"><p class="rib__k">' + esc(R.k) + '</p><h3 class="rib__t">' + R.t + '</h3>' +
      '<a class="rib__row" href="' + DEMO + '" target="_blank" rel="noopener" aria-label="' + esc(L0(lang).demo) + '"><span class="rib__track">' + cells + '</span><span class="rib__track" aria-hidden="true">' + cells.replace(/ alt="[^"]*"/g, ' alt=""') + "</span></a>" +
      '<p class="rib__cap">' + esc(R.c) + "</p></div>";
  }
  function L0(lang) { return O[lang] || O.th; }

  function html(L, lang) {
    var book = '<a class="btn btn--sun btn--block tho-card__cta" href="#book" data-open-sheet="book"><span>' + esc(L.book) + "</span>" + ARROW + "</a>";
    return ribbon(lang) + '<div class="tho__grid tho__grid--two">' +
      '<article class="tho-card">' +
        '<div class="tho-card__top"><span class="tho-card__tier">01</span><span class="tho-card__ic">' + ICON.menu + "</span></div>" +
        '<p class="tho-card__kicker">' + esc(L.menu.kicker) + "</p>" +
        '<h3 class="tho-card__name">' + esc(L.menu.name) + "</h3>" +
        '<p class="tho-card__benefit">' + esc(L.menu.benefit) + "</p>" +
        '<p class="tho-card__price">' + money(O.price.menu, L) + '<span class="tho-card__per">' + esc(L.per) + "</span></p>" +
        '<p class="tho-card__unit tho-card__free">' + CHECK + esc(L.free) + "</p>" +
        list(L.menu.list) + book +
        '<a class="tho-card__alt" href="' + DEMO + '" target="_blank" rel="noopener">' + esc(L.demo) + " ↗</a>" +
      "</article>" +
      '<article class="tho-card tho-card--feat">' +
        '<span class="tho-card__badge">' + esc(L.site.badge) + "</span>" +
        '<div class="tho-card__top"><span class="tho-card__tier">02</span><span class="tho-card__ic">' + ICON.site + "</span></div>" +
        '<p class="tho-card__kicker">' + esc(L.site.kicker) + "</p>" +
        '<h3 class="tho-card__name">' + esc(L.site.name) + "</h3>" +
        '<p class="tho-card__benefit">' + esc(L.site.benefit) + "</p>" +
        '<p class="tho-card__price">' + money(O.price.site, L) + '<span class="tho-card__per">' + esc(L.per) + "</span></p>" +
        list(L.site.list) + book +
      "</article>" +
    "</div>";
  }

  var HIDE = [".offer-grid", ".offers__links", ".trust[data-payment-claim]", ".pcards", ".bill", ".carebox", "#compare", "#guide"];
  var ON = O.langs || ["th"];
  var box = null, cur = "";
  function anchor() { return document.querySelector("#offers .offer-grid") || document.querySelector("#plans .pcards"); }

  function apply(lang) {
    var a = anchor(), show = ON.indexOf(lang) > -1;
    if (!a) return;
    if (!box) box = document.getElementById("thOffers");
    if (show && !box) {
      box = document.createElement("div");
      box.className = "tho"; box.id = "thOffers";
      a.parentNode.insertBefore(box, a);
    }
    if (box) {
      box.classList.toggle("tho--off", !show);
      if (show && lang !== cur) { box.innerHTML = html(O[lang], lang); cur = lang; }
    }
    HIDE.forEach(function (sel) { [].forEach.call(document.querySelectorAll(sel), function (el) { el.classList.toggle("tho-hide", show); }); });
  }

  window.NM_OFFERS_HTML = function (lang, demo) { if (demo) DEMO = demo; return html(O[lang] || O.th, O[lang] ? lang : "th"); };
  document.addEventListener("nm:lang", function (e) { apply(e.detail && e.detail.lang); });
  apply(window.NM_LANG || document.documentElement.lang);
})();
