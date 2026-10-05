/* NM Studio — runtime performance helpers (additive, no visual change).
 *
 * 1. Infinite CSS animations (aurora, marquees, floaty cards, rings, pulses…)
 *    keep the compositor busy even when their section is scrolled out of view.
 *    Sections that are off-screen get `.nm-off`, which pauses every animation
 *    inside them; they resume the instant the section comes back (±160px early,
 *    so there is no visible hitch).
 * 2. Nothing is observed on reduced-motion devices (animations are already off). */
(function () {
  "use strict";
  if (!("IntersectionObserver" in window)) return;
  var st = document.createElement("style");
  st.textContent = ".nm-off,.nm-off *,.nm-off *::before,.nm-off *::after{animation-play-state:paused!important}";
  document.head.appendChild(st);
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { e.target.classList.toggle("nm-off", !e.isIntersecting); });
  }, { rootMargin: "160px 0px 160px 0px" });
  function init() { [].forEach.call(document.querySelectorAll("main > section, section.h, section.phero, section.status, footer, .marquee, .reel"), function (el) { io.observe(el); }); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();

  /* 3. Page transition: a dark panel with a gold edge wipes between pages (same language as the
        Atelier des Façadiers site). Skipped for reduced motion, new tabs, hash links, downloads. */
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[href]");
      if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || a.target || a.hasAttribute("download")) return;
      var h = a.getAttribute("href");
      if (!h || /^(#|tel:|mailto:|sms:|https?:|javascript:|whatsapp:)/i.test(h)) return;
      var u; try { u = new URL(a.href, location.href); } catch (x) { return; }
      if (u.origin !== location.origin || (u.pathname === location.pathname && u.search === location.search)) return;
      e.preventDefault();
      try { sessionStorage.setItem("nm-wipe", "1"); } catch (x) {}
      document.body.classList.add("nm-leave");
      setTimeout(function () { location.href = a.href; }, 400);
    });
    window.addEventListener("pageshow", function (e) { if (e.persisted) document.body.classList.remove("nm-leave"); });
  }
})();
