/* NM Studio · QR menu "Depth" layer (needs menu.js + menu-plus-cards.js). Opt-in: NM_MENU.plus.depth = true.
 * Photo-serving 3D, no decorative objects:
 *  - every dish photo rises out of the page in perspective the first time it enters the screen
 *  - while scrolling, the photo frame tilts like the inside of a drum and the picture slides behind it (parallax window)
 *  - mouse pointer: the frame follows the cursor with a soft light glare (desktop only)
 * Transform/opacity only, one rAF while scrolling, only the cards on screen are touched. Off for reduced-motion and weak phones. */
(function () {
  "use strict";
  var M = window.NM_MENU, root = document.getElementById("menu");
  if (!M || !M.plus || !M.plus.depth || !root || !("IntersectionObserver" in window)) return;
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var weak = (navigator.deviceMemory && navigator.deviceMemory <= 2) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);
  var vis = new Set(), seen = new WeakSet(), raf = 0, armed = false;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var el = e.target;
      if (e.isIntersecting) { vis.add(el); if (!seen.has(el)) { seen.add(el); el.classList.add("d3-in"); } }
      else { vis.delete(el); el.style.removeProperty("--rx"); el.style.removeProperty("--py"); }
    });
    if (!armed) { armed = true; document.documentElement.classList.add("d3"); } // hidden start state only after the observer is confirmed to work
    kick();
  }, { rootMargin: "80px 0px" });
  function kick() { if (!raf) raf = requestAnimationFrame(tick); }
  function tick() {
    raf = 0; var vh = innerHeight || 800;
    vis.forEach(function (el) {
      var r = el.getBoundingClientRect(), t = Math.max(-1, Math.min(1, ((r.top + r.height / 2) / vh - 0.5) * 2));
      el.style.setProperty("--rx", (t * 7).toFixed(2) + "deg");
      if (!weak) el.style.setProperty("--py", (t * -9).toFixed(2) + "%");
    });
  }
  addEventListener("scroll", kick, { passive: true }); addEventListener("resize", kick);
  var fine = window.matchMedia && matchMedia("(hover:hover) and (pointer:fine)").matches;
  function bind(ph) {
    if (ph.__d3) return; ph.__d3 = 1; io.observe(ph);
    // the frame sits above the card-wide "open the dish" button, so a tap on the picture itself forwards to it
    ph.addEventListener("click", function (e) { if (e.target.closest(".pl-ctl")) return; var o = ph.closest(".dish") && ph.closest(".dish").querySelector(".dish__o"); if (o) o.click(); });
    if (!fine) return;
    var g = document.createElement("i"); g.className = "d3-glare"; g.setAttribute("aria-hidden", "true"); ph.appendChild(g);
    ph.addEventListener("pointermove", function (e) {
      var b = ph.getBoundingClientRect(), x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
      ph.style.setProperty("--ry", ((x - 0.5) * 10).toFixed(2) + "deg"); ph.style.setProperty("--tx", ((0.5 - y) * 6).toFixed(2) + "deg");
      ph.style.setProperty("--gx", (x * 100).toFixed(1) + "%"); ph.style.setProperty("--gy", (y * 100).toFixed(1) + "%"); ph.classList.add("d3-hot");
    });
    ph.addEventListener("pointerleave", function () { ph.classList.remove("d3-hot"); ph.style.removeProperty("--ry"); ph.style.removeProperty("--tx"); });
  }
  function scan() { root.querySelectorAll("main .dish__ph").forEach(bind); }
  new MutationObserver(function () { requestAnimationFrame(scan); }).observe(root, { childList: true });
  scan();
})();
