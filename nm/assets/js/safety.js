/* NM Studio — safety net.
 *
 * Reveal animations are a promise: content that is on screen must be visible.
 * If any of them ever fails to run (a scroll library that did not load, a
 * mis-measured trigger, a background tab, a resized window), this turns the
 * element back on instead of leaving a blank section behind. It only touches
 * elements that are actually on screen and still almost transparent, so it
 * never fights an animation that is working. */
(function () {
  "use strict";

  function repair() {
    // the founder entrance is a CSS class: switch it on if the section is on screen and still waiting
    var f = document.querySelector(".founder--anim:not(.is-in)");
    if (f) { var fr = f.getBoundingClientRect(); if (fr.top < window.innerHeight - 40 && fr.bottom > 40) f.classList.add("is-in"); }
    var els = document.querySelectorAll("[data-anim], .reveal, .offer, .pcard, .why-card, .how-step, .wk-card, .section-lead, .section-head .eyebrow, .phero .eyebrow, .phero__lead, .st__item");
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var r = el.getBoundingClientRect();
      var onScreen = r.bottom > 40 && r.top < window.innerHeight - 40 && r.width > 0;
      if (!onScreen) continue;
      if (parseFloat(getComputedStyle(el).opacity) >= 0.35) continue;
      el.style.opacity = "";
      el.style.transform = "";
      el.style.translate = "";
      el.style.visibility = "";
    }
  }

  function later() {
    setTimeout(repair, 900);
    setTimeout(repair, 2400);
    setTimeout(repair, 5000);
  }

  if (document.readyState === "complete") later();
  else window.addEventListener("load", later);

  /* Debounced: the safety net only has to act once scrolling settles, not on every frame
     (it used to force a style + layout flush ~60x/second while scrolling). */
  var t = 0;
  window.addEventListener("scroll", function () {
    clearTimeout(t);
    t = setTimeout(repair, 220);
  }, { passive: true });

  window.addEventListener("resize", repair);
  document.addEventListener("visibilitychange", repair);
})();
