/* NM Studio · QR menu "Atelier" layer (needs menu.js + menu-plus-cards.js). Opt-in: NM_MENU.plus.atelier = true.
 * Small DOM touches that the stylesheet cannot do: flame icons for the spice level, the big outlined section number, sparks when a dish is added. */
(function () {
  "use strict";
  var M = window.NM_MENU, root = document.getElementById("menu");
  if (!M || !M.plus || !M.plus.atelier || !root) return;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("pl-atelier");
  var FLAME = '<svg class="at-chili %C%" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.4 2.6c.35 1.7-.15 3-1.2 4 4.1.8 6 4.4 5.4 8.3-.6 4.2-3.9 6.6-8.2 6.4-3.9-.2-6.5-3.2-6.1-6.8.2-2.3 1.5-4.4 3.5-5.7.3 1.2.9 2 1.8 2.3-.3-3.6 1-6.7 4.8-8.5Z"/></svg>';
  function dress() {
    root.querySelectorAll(".chip.hot:not([data-at])").forEach(function (c) {
      c.setAttribute("data-at", "1"); var n = parseInt(c.getAttribute("title"), 10) || (c.textContent.match(/🌶/g) || []).length || 1, h = "";
      for (var i = 1; i <= 3; i++) h += FLAME.replace("%C%", i <= n ? "on" : ""); c.innerHTML = h; c.setAttribute("role", "img"); c.setAttribute("aria-label", c.getAttribute("title") || ("" + n + "/3"));
    });
    root.querySelectorAll(".ch__no:not([data-at])").forEach(function (e) {
      e.setAttribute("data-at", "1"); var m = e.textContent.trim().match(/^(\d+)\s*\/\s*(\d+)$/); if (m) e.innerHTML = "<b>" + m[1] + "</b> <span>/ " + m[2] + "</span>";
    });
  }
  new MutationObserver(function () { requestAnimationFrame(dress); }).observe(root, { childList: true }); dress();
  // sparks + halo where the add button was pressed (the engine still does the real work)
  function burst(from) {
    if (reduce || !from.animate) return; var r = from.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var ring = document.createElement("i"); ring.className = "at-ring"; document.body.appendChild(ring);
    var a = ring.animate([{ transform: "translate(" + cx + "px," + cy + "px) scale(.6)", opacity: .9 }, { transform: "translate(" + cx + "px," + cy + "px) scale(3.2)", opacity: 0 }], { duration: 650, easing: "cubic-bezier(.22,1,.36,1)" });
    a.onfinish = a.oncancel = function () { ring.remove(); };
    for (var i = 0; i < 9; i++) {
      var s = document.createElement("i"); s.className = "at-spark"; document.body.appendChild(s);
      var ang = (i / 9) * Math.PI * 2 + Math.random() * .5, d = 34 + Math.random() * 30;
      (function (s) {
        var an = s.animate([{ transform: "translate(" + cx + "px," + cy + "px) scale(1)", opacity: 1 }, { transform: "translate(" + (cx + Math.cos(ang) * d) + "px," + (cy + Math.sin(ang) * d) + "px) scale(0)", opacity: 0 }], { duration: 520 + Math.random() * 220, easing: "cubic-bezier(.16,1,.3,1)" });
        an.onfinish = an.oncancel = function () { s.remove(); };
      })(s);
    }
    var ph = from.closest(".dish__ph"); if (ph) { ph.classList.remove("at-pop"); void ph.offsetWidth; ph.classList.add("at-pop"); }
    if (navigator.vibrate) { try { navigator.vibrate(12); } catch (e) {} }
  }
  root.addEventListener("click", function (e) { var b = e.target.closest(".pl-first,.pl-inc"); if (b) burst(b); }, true);
})();
