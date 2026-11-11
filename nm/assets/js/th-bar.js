/* NM Studio, Thai site only: a slim sign-up bar fixed to the bottom of phone screens.
   Shows once the hero is passed, steps aside while the offers, the sign-up or the contact block are on screen
   (their own buttons are there), and lifts the WhatsApp bubble above itself. */
(function () {
  "use strict";
  if (!window.IntersectionObserver) return;
  var fr = document.documentElement.lang !== "th";
  var SRC = document.currentScript && document.currentScript.src;
  var href = SRC ? new URL("../../th/signup.html", SRC).href : "signup.html";
  var bar = document.createElement("div");
  bar.className = "thbar"; bar.setAttribute("role", "region"); bar.setAttribute("aria-label", fr ? "Inscription" : "สมัครใช้บริการ");
  bar.innerHTML = '<p class="thbar__t"><b>' + (fr ? "Menu QR 390 ฿/mois" : "เมนู QR 390 บาท/เดือน") + "</b><span>" +
    (fr ? "Installation gratuite · 1er mois offert" : "ติดตั้งฟรี · เดือนแรกฟรี") + '</span></p>' +
    '<a class="thbar__btn" href="' + href + '">' + (fr ? "S’inscrire" : "สมัครเลย") + "</a>";
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
