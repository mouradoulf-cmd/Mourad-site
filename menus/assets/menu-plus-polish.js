/* NM Studio · polish layer (see menu-plus-polish.css): tap ripple on interactive elements + chapter-title reveal. No dependencies, no timers while idle. */
(function () {
  "use strict";
  if (window.__plPolish) return; window.__plPolish = 1;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) addEventListener("pointerdown", function (e) {
    var b = e.target.closest && e.target.closest(".pl-first,.pl-inc,.pl-dec,.cta,.bag__go,.open__go,.tabs button,.ib");
    if (!b) return;
    var r = b.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2, d = document.createElement("span");
    d.className = "pl-rip"; d.style.cssText = "width:" + s + "px;height:" + s + "px;left:" + (e.clientX - r.left - s / 2) + "px;top:" + (e.clientY - r.top - s / 2) + "px";
    b.appendChild(d); setTimeout(function () { d.remove(); }, 650);
  }, { passive: true });
  // chapter hairline: mark each chapter number as "in" once it is on screen (the engine's own .rv reveal covers the rest)
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }); }, { rootMargin: "0px 0px -10% 0px" });
    var scan = function () { document.querySelectorAll(".ch__no:not(.in)").forEach(function (n) { io.observe(n); }); };
    scan(); new MutationObserver(scan).observe(document.getElementById("menu") || document.body, { childList: true });
  } else document.querySelectorAll(".ch__no").forEach(function (n) { n.classList.add("in"); });
})();
