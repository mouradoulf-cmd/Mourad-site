/* NM Studio: the "problems" film. A muted, looping video inside a 3D iPhone; captions and the chapter list follow the video.
   - the video file only loads when the section gets close, and only plays while it is on screen
   - reduced motion or data saver: no autoplay, a play button instead
   - captions come from the hidden .film__cues list, so the language switcher (data-i18n) translates them too
   - to swap the film: replace assets/video/film.mp4 and adjust data-s / data-e (cues) and data-t (chapters) in the HTML */
(function () {
  "use strict";
  var root = document.querySelector(".film");
  if (!root) return;
  var video = root.querySelector(".film__video"), cap = root.querySelector(".film__cap"), bar = root.querySelector(".film__bar i");
  var playBtn = root.querySelector("[data-film-play]"), soundBtn = root.querySelector("[data-film-sound]"), big = root.querySelector(".film__big");
  var phone = root.querySelector(".film__phone"), stage = root.querySelector(".film__stage");
  var cues = [].slice.call(root.querySelectorAll(".film__cues li")).map(function (li) {
    return { s: parseFloat(li.getAttribute("data-s")), e: parseFloat(li.getAttribute("data-e")), el: li };
  });
  var chs = [].slice.call(root.querySelectorAll(".film__ch")).map(function (li) { return { t: parseFloat(li.getAttribute("data-t")), el: li }; });

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var auto = !reduce && !saveData, userPaused = false, visible = false, loaded = false, raf = 0, curCue = -1, curCh = -1;

  function load() {
    if (loaded) return; loaded = true;
    var src = video.querySelector("source[data-src]");
    if (src) { src.src = src.getAttribute("data-src"); src.removeAttribute("data-src"); }
    video.preload = "auto"; video.load();
  }
  function setPaused(p) {
    root.classList.toggle("is-paused", p);
    if (playBtn) playBtn.classList.toggle("is-on", !p);
  }
  function play() {
    load();
    var pr = video.play();
    if (pr && pr.catch) pr.catch(function () { setPaused(true); });
  }

  function chapterIndex(t) { var i = 0; chs.forEach(function (c, k) { if (t >= c.t) i = k; }); return i; }
  function render() {
    var t = video.currentTime || 0, d = video.duration || 0;
    if (bar && d) bar.style.setProperty("--p", (t / d).toFixed(4));
    var ci = -1;
    for (var k = 0; k < cues.length; k++) if (t >= cues[k].s && t < cues[k].e) { ci = k; break; }
    if (ci !== curCue) {
      curCue = ci; cap.classList.add("is-swap");
      setTimeout(function () { cap.textContent = curCue >= 0 ? cues[curCue].el.textContent.trim() : ""; cap.classList.remove("is-swap"); }, reduce ? 0 : 200);
    }
    var hi = chapterIndex(t);
    if (hi !== curCh) { curCh = hi; chs.forEach(function (c, k) { c.el.classList.toggle("is-on", k === hi); if (k !== hi) c.el.style.setProperty("--p", k < hi ? 1 : 0); }); }
    var end = hi + 1 < chs.length ? chs[hi + 1].t : (d || chs[hi].t + 1);
    chs[hi].el.style.setProperty("--p", Math.max(0, Math.min(1, (t - chs[hi].t) / (end - chs[hi].t))).toFixed(3));
  }
  function loop() { render(); raf = !video.paused && visible ? requestAnimationFrame(loop) : 0; }

  video.addEventListener("play", function () { setPaused(false); if (!raf) raf = requestAnimationFrame(loop); });
  video.addEventListener("pause", function () { setPaused(true); });
  video.addEventListener("timeupdate", function () { if (!raf) render(); });
  video.addEventListener("loadedmetadata", render);

  function toggle() { if (video.paused) { userPaused = false; play(); } else { userPaused = true; video.pause(); } }
  video.addEventListener("click", toggle);
  if (big) big.addEventListener("click", function () { userPaused = false; play(); });
  if (playBtn) playBtn.addEventListener("click", toggle);
  if (soundBtn) soundBtn.addEventListener("click", function () {
    video.muted = !video.muted; soundBtn.classList.toggle("is-on", !video.muted);
    soundBtn.setAttribute("aria-pressed", String(!video.muted));
    if (video.paused) { userPaused = false; play(); }
  });

  chs.forEach(function (c) {
    c.el.addEventListener("click", function () {
      load();
      var go = function () { video.currentTime = c.t + 0.05; userPaused = false; play(); render(); };
      if (video.readyState >= 1) go(); else video.addEventListener("loadedmetadata", go, { once: true });
    });
  });

  // initial state: first chapter + first caption, so the section reads well before the video starts
  chs[0] && chs[0].el.classList.add("is-on"); curCh = 0;
  if (cues[0]) { cap.textContent = cues[0].el.textContent.trim(); curCue = 0; }
  setPaused(!auto);

  if (!("IntersectionObserver" in window)) { load(); if (auto) play(); return; }

  // load when close, play only while really visible
  new IntersectionObserver(function (es) { if (es[0].isIntersecting) load(); }, { rootMargin: "600px 0px" }).observe(stage);
  new IntersectionObserver(function (es) {
    visible = es[0].isIntersecting;
    if (visible && auto && !userPaused) play();
    else if (!visible && !video.paused) video.pause();
  }, { threshold: 0.35 }).observe(phone);

  // entry: only armed once we know the observer works, so the section is never stuck hidden
  if (!reduce) {
    root.classList.add("film--armed");
    var io = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { root.classList.add("is-in"); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(root);
    setTimeout(function () { root.classList.add("is-in"); }, 4000);
  }

  // gentle tilt and moving light that follow the mouse (desktop only)
  if (!reduce && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var tr = 0, rtl = document.documentElement.dir === "rtl";
    stage.addEventListener("pointermove", function (e) {
      if (tr) return;
      tr = requestAnimationFrame(function () {
        tr = 0; var r = stage.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        root.classList.add("is-tilting");
        phone.style.setProperty("--ry", ((rtl ? 11 : -11) + (x - 0.5) * 14).toFixed(2) + "deg");
        phone.style.setProperty("--rx", (3 + (0.5 - y) * 8).toFixed(2) + "deg");
        phone.style.setProperty("--sx", (100 - x * 80).toFixed(1) + "%");
      });
    });
    stage.addEventListener("pointerleave", function () {
      root.classList.remove("is-tilting");
      phone.style.removeProperty("--ry"); phone.style.removeProperty("--rx"); phone.style.removeProperty("--sx");
    });
  }
})();
