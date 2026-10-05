/* NM Studio: "problems → fixes" cards. Each card is a 3D flip: it shows the problem, then turns to the fix as it reaches the
   middle of the screen (or on click / tap / Enter). Without JS, or with reduced motion, the pair simply stays stacked. */
(function () {
  "use strict";
  var sec = document.getElementById("problems");
  if (!sec || !("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  sec.classList.add("prob--3d");
  var cards = [].slice.call(sec.querySelectorAll(".prob__card"));

  function set(card, on, byUser) {
    card.classList.toggle("is-flipped", on);
    var bad = card.querySelector(".prob__face--bad"), fix = card.querySelector(".prob__face--fix");
    bad.setAttribute("aria-hidden", on ? "true" : "false"); fix.setAttribute("aria-hidden", on ? "false" : "true");
    if ("inert" in bad) { bad.inert = on; fix.inert = !on; }
    if (byUser) card.setAttribute("data-user", "1");
  }
  cards.forEach(function (c) {
    set(c, false);
    c.addEventListener("click", function () { set(c, !c.classList.contains("is-flipped"), true); });
  });

  /* How long does a human need to take in the problem? Visitors skim: the headline plus the first lines of the sentence, at about
     6 words a second. Thai has no spaces, so count about 6 characters per word. Add a short reaction time and keep it between
     2.4 s and 3.4 s: long enough to read the problem, short enough that the fix follows right after. */
  function readMs(card) {
    var h = card.querySelector(".prob__face--bad h3").textContent.trim(), p = card.querySelector(".prob__face--bad p").textContent.trim();
    var thai = /[\u0E00-\u0E7F]/.test(h + p), words;
    if (thai) words = (h.replace(/\s+/g, "").length + Math.min(p.replace(/\s+/g, "").length, 70)) / 6;
    else words = h.split(/\s+/).length + Math.min(p.split(/\s+/).length, 14);
    return Math.max(2400, Math.min(3400, 600 + words / 6 * 1000));
  }

  /* flip when the card reaches the middle band of the screen, after its own reading time */
  var seen = 0;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var c = e.target; io.unobserve(c);
      if (c.getAttribute("data-user")) return;
      setTimeout(function () { if (!c.getAttribute("data-user")) set(c, true); }, readMs(c) + (seen++ % 3) * 250);
    });
  }, { rootMargin: "-18% 0px -40% 0px", threshold: 0 });
  cards.forEach(function (c) { io.observe(c); });

  /* gentle tilt + light that follows the pointer (mouse only) */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    sec.querySelectorAll(".prob__tilt").forEach(function (t) {
      var raf = 0;
      t.addEventListener("pointermove", function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = 0; var r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
          t.style.setProperty("--rx", ((0.5 - y) * 7).toFixed(2) + "deg"); t.style.setProperty("--ry", ((x - 0.5) * 9).toFixed(2) + "deg");
          t.style.setProperty("--gx", (x * 100).toFixed(1) + "%"); t.style.setProperty("--gy", (y * 100).toFixed(1) + "%");
        });
      });
      t.addEventListener("pointerleave", function () { t.style.setProperty("--rx", "0deg"); t.style.setProperty("--ry", "0deg"); });
    });
  }
})();
