/* NM Studio — scroll film: the desk video is scrubbed by scroll position,
   three chapters fade in along the way. Sleeps whenever the section is off-screen. */
(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  /* Hero depth: the video drifts and zooms as you scroll away, the copy lifts and fades;
     on desktop the copy also leans gently toward the pointer. */
  (function heroDepth() {
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

  var sec = document.getElementById("film");
  if (!sec) return;
  var v = sec.querySelector(".film__video"), chs = [].slice.call(sec.querySelectorAll(".film__ch")), rail = sec.querySelector(".film__rail");
  var target = 0, cur = 0, active = false, raf = 0, idx = -1, dur = 0;

  function progress() {
    var r = sec.getBoundingClientRect(), total = r.height - window.innerHeight;
    return total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
  }
  function setChapter(i) {
    if (i === idx) return; idx = i;
    chs.forEach(function (c, k) { c.classList.toggle("is-on", k === i); });
  }
  function tick() {
    raf = 0;
    var p = progress();
    target = p;
    cur += (target - cur) * 0.14;
    if (Math.abs(target - cur) < 0.0004) cur = target;
    dur = v.duration || dur;
    if (dur) {
      var t = Math.min(dur - 0.05, cur * dur);
      if (Math.abs(v.currentTime - t) > 0.02) { try { v.currentTime = t; } catch (e) {} }
    }
    var s = 1.02 + cur * 0.06;
    v.style.transform = "scale(" + s.toFixed(4) + ") translate3d(" + ((cur - .5) * -1.6).toFixed(2) + "%,0,0)";
    if (rail) rail.style.setProperty("--p", (cur * 100).toFixed(1) + "%");
    setChapter(cur < 0.34 ? 0 : cur < 0.67 ? 1 : 2);
    if (active && (cur !== target || true)) raf = requestAnimationFrame(tick);
  }
  function start() { if (!raf) raf = requestAnimationFrame(tick); }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      active = es[0].isIntersecting;
      if (active) { v.load && v.readyState < 1 && v.load(); start(); }
    }, { rootMargin: "20% 0px" }).observe(sec);
  } else { active = true; start(); }
  v.addEventListener("loadedmetadata", function () { dur = v.duration; start(); });
})();
