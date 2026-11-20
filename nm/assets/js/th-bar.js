/* NM Studio, Thai site only: a slim sign-up bar fixed to the bottom of phone screens.
   Shows once the hero is passed, steps aside while the offers, the sign-up or the contact block are on screen
   (their own buttons are there), and lifts the WhatsApp bubble above itself. */
(function () {
  "use strict";
  if (!window.IntersectionObserver) return;
  var L = document.documentElement.lang || "th";
  var TX = {
    th: ["ติดต่อ", "เมนู QR 3,000 + 390 บาท/เดือน", "นัดพบฟรี · ไม่มีข้อผูกมัด"],
    fr: ["Contact", "Menu QR 3 000 ฿ + 390 ฿/mois", "RDV gratuit · Sans engagement"],
    en: ["Contact", "QR menu 3,000 ฿ + 390 ฿/month", "Free meeting · No commitment"],
    it: ["Contatti", "Menu QR 3.000 ฿ + 390 ฿/mese", "Incontro gratis · Senza impegno"],
    ar: ["تواصل", "قائمة QR 3,000 + 390 ฿/شهر", "موعد مجاني · دون التزام"]
  };
  var T = TX[L] || TX.en;
  var SRC = document.currentScript && document.currentScript.src;
  var href = (window.NM_CONTACT && window.NM_CONTACT.lineLink) || "https://line.me/ti/p/vMkNZMcALE";
  var bar = document.createElement("div");
  bar.className = "thbar"; bar.setAttribute("role", "region"); bar.setAttribute("aria-label", T[0]);
  var CC = window.NM_CONTACT || {};
  var LINE = CC.lineLink || "https://line.me/ti/p/vMkNZMcALE", WA = CC.whatsappLink || "https://wa.me/66965405754";
  function icon(sel) { var s = document.querySelector(sel + " svg"); return s ? s.outerHTML : ""; }
  bar.innerHTML = '<p class="thbar__t"><b>' + T[1] + "</b><span>" +
    T[2] + '</span></p>' +
    '<a class="thbar__ic thbar__ic--line" href="' + LINE + '" target="_blank" rel="noopener" aria-label="LINE">' + icon(".line-float") + "</a>" +
    '<a class="thbar__ic thbar__ic--wa" href="' + WA + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + icon(".wa-float") + "</a>";
  document.body.appendChild(bar);
  var past = false, busy = {};
  function update() {
    var any = Object.keys(busy).some(function (k) { return busy[k]; });
    var on = past && !any;
    bar.classList.toggle("is-on", on);
    document.body.classList.toggle("thbar-on", on);
  }
  var hero = document.getElementById("top");
  if (hero) new IntersectionObserver(function (e) { past = !e[0].isIntersecting; update(); }, { rootMargin: "-40% 0px 0px 0px" }).observe(hero);
  ["offers", "contact"].forEach(function (id) {
    var el = document.getElementById(id); if (!el) return;
    new IntersectionObserver(function (e) { busy[id] = e[0].isIntersecting; update(); }).observe(el);
  });
})();
