/* NM Studio: the "problems" film. A muted video (sound on request) inside a 3D iPhone; captions, the 4-step bar and the chapter card follow it.
   - the video file only loads when the section gets close, and only plays while it is on screen
   - reduced motion or data saver: no autoplay, a play button instead, no 3D
   - 3D with a job: the phone stands up to face you as you scroll to it; the chapter card turns in when the step changes
   - captions come from the hidden .film__cues list, so the language switcher (data-i18n) translates them too
   - to swap the film: replace assets/video/film.mp4 and adjust data-s / data-e (cues) and data-t (chapters) in the HTML */
(function () {
  "use strict";
  var root = document.querySelector(".film");
  if (!root) return;
  var video = root.querySelector(".film__video"), cap = root.querySelector(".film__cap"), bar = root.querySelector(".film__bar i");
  var playBtn = root.querySelector("[data-film-play]"), soundBtn = root.querySelector("[data-film-sound]"), big = root.querySelector(".film__big");
  var phone = root.querySelector(".film__phone"), stage = root.querySelector(".film__stage");
  var steps = [].slice.call(root.querySelectorAll(".film__step"));
  var cues = [].slice.call(root.querySelectorAll(".film__cues li")).map(function (li) {
    return { s: parseFloat(li.getAttribute("data-s")), e: parseFloat(li.getAttribute("data-e")), el: li };
  });
  var endBox = root.querySelector(".film__end"), replayBtn = root.querySelector("[data-film-replay]"), isEnd = false;
  var chs = [].slice.call(root.querySelectorAll(".film__ch")).map(function (li) { return { t: parseFloat(li.getAttribute("data-t")), el: li }; });
  if (!video) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var rtl = document.documentElement.dir === "rtl";
  var auto = !reduce && !saveData, userPaused = false, visible = false, loaded = false, raf = 0, curCue = -1, curCh = -1;

  root.classList.add("film--js");

  function load() {
    if (loaded) return; loaded = true;
    var src = video.querySelector("source[data-src]");
    if (src) { src.src = src.getAttribute("data-src"); src.removeAttribute("data-src"); }
    video.preload = "auto"; video.load();
  }
  function setPaused(p) { root.classList.toggle("is-paused", p); if (playBtn) playBtn.classList.toggle("is-on", !p); }
  function play() { load(); var pr = video.play(); if (pr && pr.catch) pr.catch(function () { setPaused(true); }); }

  function show(i) {
    if (!chs.length || i === curCh) return;
    var prev = curCh; curCh = i;
    chs.forEach(function (c, k) {
      c.el.classList.toggle("is-on", k === i);
      c.el.classList.toggle("is-out", k === prev);
      c.el.setAttribute("aria-hidden", k === i ? "false" : "true");
      if ("inert" in c.el) c.el.inert = k !== i;
    });
    fit();
    steps.forEach(function (s, k) { s.classList.toggle("is-on", k === i); s.setAttribute("aria-current", k === i ? "step" : "false"); if (k !== i) s.style.setProperty("--p", k < i ? 1 : 0); });
  }
  // the card area takes the height of the card shown, so there is never an empty band under a short chapter
  var panel = root.querySelector(".film__chapters");
  function fit() { if (curCh >= 0 && panel) panel.style.height = chs[curCh].el.offsetHeight + "px"; }
  window.addEventListener("resize", fit, { passive: true });
  if (window.ResizeObserver) { var ro = new ResizeObserver(fit); chs.forEach(function (c) { ro.observe(c.el); }); }
  function chapterIndex(t) { var i = 0; chs.forEach(function (c, k) { if (t >= c.t) i = k; }); return i; }
  function render() {
    var t = video.currentTime || 0, d = video.duration || 0;
    setEnd(t >= endAt || video.ended);
    if (bar && d) bar.style.setProperty("--p", (t / d).toFixed(4));
    var ci = -1;
    for (var k = 0; k < cues.length; k++) if (t >= cues[k].s && t < cues[k].e) { ci = k; break; }
    if (ci !== curCue) {
      curCue = ci; cap.classList.add("is-swap");
      setTimeout(function () { cap.textContent = curCue >= 0 ? cues[curCue].el.textContent.trim() : ""; cap.classList.remove("is-swap"); }, reduce ? 0 : 200);
    }
    if (!chs.length) return;
    var hi = chapterIndex(t); show(hi);
    var end = hi + 1 < chs.length ? chs[hi + 1].t : (d || chs[hi].t + 1);
    if (steps[hi]) steps[hi].style.setProperty("--p", Math.max(0, Math.min(1, (t - chs[hi].t) / (end - chs[hi].t))).toFixed(3));
  }
  // the last seconds (from data-end) and the end of the film show the end panel; its links only become focusable then
  function setEnd(on) {
    if (on === isEnd || !endBox) return; isEnd = on;
    root.classList.toggle("is-end", on); endBox.setAttribute("aria-hidden", on ? "false" : "true");
    [].forEach.call(endBox.querySelectorAll("a,button"), function (el) { el.tabIndex = on ? 0 : -1; });
  }
  var endAt = parseFloat(video.getAttribute("data-end")) || Infinity;
  function loop() { render(); raf = !video.paused && visible ? requestAnimationFrame(loop) : 0; }

  video.addEventListener("play", function () { setPaused(false); if (!raf) raf = requestAnimationFrame(loop); });
  video.addEventListener("pause", function () { setPaused(true); });
  video.addEventListener("timeupdate", function () { if (!raf) render(); });
  video.addEventListener("loadedmetadata", render);
  video.addEventListener("ended", function () { setEnd(true); if (bar) bar.style.setProperty("--p", "1"); });
  function replay() { userPaused = false; setEnd(false); video.currentTime = 0; play(); }
  if (replayBtn) replayBtn.addEventListener("click", replay);

  function toggle() { if (video.ended) { replay(); return; } if (video.paused) { userPaused = false; play(); } else { userPaused = true; video.pause(); } }
  video.addEventListener("click", toggle);
  if (big) big.addEventListener("click", function () { userPaused = false; play(); });
  if (playBtn) playBtn.addEventListener("click", toggle);
  if (soundBtn) soundBtn.addEventListener("click", function () {
    video.muted = !video.muted; soundBtn.classList.toggle("is-on", !video.muted);
    soundBtn.setAttribute("aria-pressed", String(!video.muted));
    if (video.paused) { userPaused = false; play(); }
  });

  function seek(i) {
    load(); show(i);
    var go = function () { video.currentTime = chs[i].t + 0.05; userPaused = false; play(); render(); };
    if (video.readyState >= 1) go(); else video.addEventListener("loadedmetadata", go, { once: true });
  }
  steps.forEach(function (s, i) { s.addEventListener("click", function () { seek(i); }); });

  // start on step 1 with its caption, so the section reads well before the film starts
  show(0);
  if (cues[0]) { cap.textContent = cues[0].el.textContent.trim(); curCue = 0; }
  setPaused(!auto);

  if (!("IntersectionObserver" in window)) { load(); if (auto) play(); return; }
  new IntersectionObserver(function (es) { if (es[0].isIntersecting) load(); }, { rootMargin: "600px 0px" }).observe(stage);
  new IntersectionObserver(function (es) {
    visible = es[0].isIntersecting;
    if (visible && auto && !userPaused && !video.ended) play();
    else if (!visible && !video.paused) video.pause();
  }, { threshold: 0.35 }).observe(phone);

  if (reduce) return;

  /* the line under the film writes itself once it is on screen: words of the headline, then the gold line, then the closing
     promise one sentence at a time. Text is split into spans only now, and only the visible text nodes (a language switch
     later simply shows the new text without the effect). */
  var punch = root.querySelector(".film__punch");
  if (punch) {
    var head = punch.querySelector(".film__headline"), line = punch.querySelector(".film__punchl"), n = 0;
    if (head) [].slice.call(head.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        var frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          var w = document.createElement("span"); w.className = "w"; w.textContent = part; w.style.setProperty("--i", n++); frag.appendChild(w);
        });
        head.replaceChild(frag, node);
      } else if (node.nodeName === "EM") { node.style.setProperty("--i", n + 2); }
    });
    if (line) {
      var parts = line.textContent.trim().match(/[^.。!?]+[.。!?]?/g) || [line.textContent];
      if (parts.length < 2) parts = line.textContent.trim().split(/\s+/);   // Thai: no full stops, phrases are separated by spaces
      if (parts.length > 1) {
        line.textContent = "";
        parts.forEach(function (p, i) { var sp = document.createElement("span"); sp.className = "s"; sp.textContent = p.trim(); sp.style.setProperty("--i", i); line.appendChild(sp); });
      }
    }
    root.classList.add("film--reveal");
    // two frames later, so the hidden state is painted first and the text really animates in (even if already on screen)
    var go = function () { requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add("is-in"); }); }); };
    var pio = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { go(); pio.disconnect(); } }, { threshold: 0.3 });
    requestAnimationFrame(function () { pio.observe(punch); });
    setTimeout(function () { root.classList.add("is-in"); }, 8000);
  }

  /* 3D 1: the phone lies back and stands up to face you as it reaches the middle of the screen.
     Scroll work only runs while the stage is near the viewport. */
  var baseRy = rtl ? 12 : -12, tiltX = 0, tiltY = 0, standing = 0, near = false, tick = 0;
  function apply() {
    tick = 0;
    var r = stage.getBoundingClientRect(), vh = window.innerHeight;
    var p = Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.75)));   // 0 when the stage enters, 1 once its top is a quarter up the screen
    standing = 1 - Math.pow(1 - p, 3);
    var rx = 4 + (1 - standing) * 38 + tiltX, ry = baseRy * (0.4 + 0.6 * standing) + tiltY;
    phone.style.setProperty("--rx", rx.toFixed(2) + "deg");
    phone.style.setProperty("--ry", ry.toFixed(2) + "deg");
  }
  function req() { if (!tick) tick = requestAnimationFrame(apply); }
  new IntersectionObserver(function (es) {
    near = es[0].isIntersecting;
    if (near) { window.addEventListener("scroll", req, { passive: true }); req(); }
    else window.removeEventListener("scroll", req);
  }, { rootMargin: "200px 0px" }).observe(stage);
  window.addEventListener("resize", req, { passive: true });
  apply();

  /* desktop: the phone follows the mouse a little, and the light on the glass moves with it */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    stage.addEventListener("pointermove", function (e) {
      var r = stage.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      tiltY = (x - 0.5) * 14; tiltX = (0.5 - y) * 8;
      phone.style.setProperty("--sx", (100 - x * 80).toFixed(1) + "%"); req();
    });
    stage.addEventListener("pointerleave", function () { tiltX = tiltY = 0; phone.style.removeProperty("--sx"); req(); });
  }
})();
