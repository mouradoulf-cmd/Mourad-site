/* NM Studio — hero depth: the hero media drifts and zooms as you scroll away,
   the copy stays put and readable; on desktop the copy also leans gently toward the
   pointer.

   The transform is applied to the .h__media wrapper, NEVER to the <video>.
   Transforming a video element while it plays makes the browser re-rasterise
   the video layer on every frame, which is the classic cause of stutter on
   Intel/AMD GPUs under Windows; moving the wrapper leaves the video on a stable
   composited layer (see .h__video in site.css). The effect itself — amplitude,
   scroll parallax, pointer response, reduced-motion bail-out — is unchanged. */
(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var hero = document.getElementById("top");
  var media = hero && hero.querySelector(".h__media");
  var copy = hero && hero.querySelector(".h__copy");
  if (!hero || !media) return;
  var ticking = false, mx = 0, my = 0;
  function paint() {
    ticking = false;
    var y = Math.min(window.scrollY, window.innerHeight * 1.2), k = y / window.innerHeight;
    media.style.transform = "translate3d(" + (mx * -14).toFixed(1) + "px," + (y * 0.12 + my * -10).toFixed(1) + "px,0) scale(" + (1.04 + k * 0.08).toFixed(3) + ")";
    // the copy only leans toward the pointer: it no longer fades or drifts on scroll, so the buttons and the
    // founder's signature stay fully readable for as long as they are on screen (phones show them low in the hero)
    if (copy) copy.style.transform = "translate3d(" + (mx * 10).toFixed(1) + "px," + (my * 6).toFixed(1) + "px,0)";
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }
  // Compositor hint only on the element that really animates, and only once:
  // it costs a layer, so it is worth it for the scroll/pointer-driven wrapper
  // and not for anything else.
  media.style.willChange = "transform";
  window.addEventListener("scroll", req, { passive: true });
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    window.addEventListener("pointermove", function (e) { mx = e.clientX / window.innerWidth - .5; my = e.clientY / window.innerHeight - .5; req(); }, { passive: true });
  }
  req();
})();
