/* NM Studio — hero depth: the hero video drifts and zooms as you scroll
   away, the copy lifts and fades; on desktop the copy also leans gently
   toward the pointer. */
(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var hero = document.getElementById("top"), hv = hero && hero.querySelector(".h__video"), copy = hero && hero.querySelector(".h__copy");
  if (!hero || !hv) return;
  var ticking = false, mx = 0, my = 0;
  function paint() {
    ticking = false;
    var y = Math.min(window.scrollY, window.innerHeight * 1.2), k = y / window.innerHeight;
    hv.style.transform = "translate3d(" + (mx * -14).toFixed(1) + "px," + (y * 0.12 + my * -10).toFixed(1) + "px,0) scale(" + (1.1 + k * 0.08).toFixed(3) + ")";
    if (copy) { copy.style.transform = "translate3d(" + (mx * 10).toFixed(1) + "px," + (-y * 0.12 + my * 6).toFixed(1) + "px,0)"; copy.style.opacity = Math.max(0, 1 - k * 1.25).toFixed(3); }
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }
  window.addEventListener("scroll", req, { passive: true });
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    window.addEventListener("pointermove", function (e) { mx = e.clientX / window.innerWidth - .5; my = e.clientY / window.innerHeight - .5; req(); }, { passive: true });
  }
  req();
})();
