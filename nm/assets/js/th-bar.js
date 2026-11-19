/* NM Studio, Thai site only: a slim sign-up bar fixed to the bottom of phone screens.
   Shows once the hero is passed, steps aside while the offers, the sign-up or the contact block are on screen
   (their own buttons are there), and lifts the WhatsApp bubble above itself. */
(function () {
  "use strict";
  if (!window.IntersectionObserver) return;
  var fr = document.documentElement.lang !== "th";
  var SRC = document.currentScript && document.currentScript.src;
  var href = (window.NM_CONTACT && window.NM_CONTACT.lineLink) || "https://line.me/ti/p/vMkNZMcALE";
  var bar = document.createElement("div");
  bar.className = "thbar"; bar.setAttribute("role", "region"); bar.setAttribute("aria-label", fr ? "Contact" : "ติดต่อ");
  var CC = window.NM_CONTACT || {};
  var LINE = CC.lineLink || "https://line.me/ti/p/vMkNZMcALE", WA = CC.whatsappLink || "https://wa.me/66965405754";
  function icon(sel) { var s = document.querySelector(sel + " svg"); return s ? s.outerHTML : ""; }
  bar.innerHTML = '<p class="thbar__t"><b>' + (fr ? "Menu QR 390 ฿/mois" : "เมนู QR 390 บาท/เดือน") + "</b><span>" +
    (fr ? "Rendez-vous gratuit · Sans engagement" : "นัดพบฟรี · ไม่มีข้อผูกมัด") + '</span></p>' +
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
