/* NM Studio — hero video, loaded late and on purpose.
 *
 * The encoded pair (hero.mp4 H.264 1280×720 / hero.webm VP9) is ~2.5 MB each, so
 * the markup carries no `autoplay`, uses preload="none" and keeps its sources in
 * data-src: the sources are only injected when the screen is large enough to
 * make the video worth its bytes and the connection can afford it. Until then
 * the hero shows the <picture class="h__poster"> (AVIF → WebP → JPEG, 1280×720),
 * warmed by the preload in <head>.
 *
 * H.264 is declared first in the markup: Chrome on Windows decodes it on the
 * GPU, while VP9 is very often decoded in software (CPU at 100 %, visible
 * stutter). The webm stays as the fallback source.
 *
 * Start-up is deliberately bumpy-free: after the first screen is painted the
 * video is fetched in the background WITHOUT calling play(); playback only
 * starts once `canplaythrough` has fired or `buffered` covers ~4 s, and at the
 * latest 8 s after the download began. Starting while the opening seconds are
 * still arriving is what produced the first-seconds juddering.
 *
 * The poster → video hand-over is a single 600 ms cross-fade driven by the
 * video's own `playing` event. The video is decoded and rendering its first
 * frame at that point, so there is never a white flash and never a hard jump.
 * Any failure (autoplay policy, codec, network) leaves the poster at its CSS
 * default opacity: 1 — the worst case looks exactly like the slow-connection
 * path, never like a broken hero. A `play()` rejected by the autoplay policy is
 * retried once, on the first user interaction.
 *
 * Resource budget: the video is paused when the hero leaves the viewport
 * (IntersectionObserver) and when the tab goes to the background
 * (visibilitychange), which removes the decode load felt while scrolling the
 * rest of the page.
 *
 * The depth effect (translate + scale 1.1 → 1.18) belongs to hero-depth.js and
 * is applied to the .h__media wrapper, never to this element. */
(function () {
  "use strict";
  var video = document.querySelector(".h__video");
  if (!video) return;

  // Large screens only: below this the poster is the whole design.
  if (window.matchMedia("(max-width: 899px)").matches) return;
  // Respect the visitor's motion preference: never autoplay for them.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  // Skip metered or slow connections (Connection API is absent on Safari/FF,
  // in which case we simply keep the video).
  var conn = navigator.connection;
  if (conn) {
    if (conn.saveData) return;
    if (/^(slow-2g|2g|3g)$/.test(conn.effectiveType || "")) return;
  }

  var poster = document.querySelector(".h__poster");
  var faded = false;

  // The cross-fade start state is applied in JS, never in the stylesheet: a
  // visitor without JS (or filtered out above) must keep a fully opaque hero,
  // and this runs before the first video frame can paint, so the poster is never
  // briefly uncovered.
  video.style.opacity = "0";

  // Promote data-src to src. The <source> order in the markup is already the
  // final one (mp4 then webm): nothing is reordered or duplicated here.
  var sources = video.querySelectorAll("source[data-src]");
  if (!sources.length) return;
  for (var i = 0; i < sources.length; i++) {
    sources[i].src = sources[i].getAttribute("data-src");
  }
  if (video.canPlayType && !video.canPlayType("video/mp4") && !video.canPlayType("video/webm")) return;

  video.preload = "auto";

  /* ---------- start-up: download first, play second ---------- */

  var MIN_BUFFER = 4;      // seconds of media we want before showing motion
  var MAX_WAIT = 8000;     // hard deadline: never keep the poster longer
  var started = false, gaveUp = false, timer = 0;
  var t0 = (window.performance && performance.now) ? performance.now() : Date.now();
  var since = function () { return Math.round(((window.performance && performance.now) ? performance.now() : Date.now()) - t0); };

  function canStart() {
    if (started || gaveUp || video.error) return false;
    if (video.readyState >= 4) return true;                    // HAVE_ENOUGH_DATA
    return bufferedAhead() >= MIN_BUFFER;
  }
  function bufferedAhead() {
    try {
      for (var i = 0; i < video.buffered.length; i++) {
        var a = video.buffered.start(i), b = video.buffered.end(i);
        if (video.currentTime >= a && video.currentTime <= b) return b - video.currentTime;
      }
    } catch (e) { /* buffered can throw on a detached element */ }
    return 0;
  }
  function start() {
    if (started || gaveUp) return;
    started = true;
    window.clearTimeout(timer);
    unwatch();
    video.removeEventListener("canplaythrough", start);
    video.removeEventListener("progress", onProgress);
    video.removeEventListener("error", fail);
    window.__heroVideoStart = { at: since(), reason: video.readyState >= 4 ? "canplaythrough" : "buffer>=4s", ahead: +bufferedAhead().toFixed(2) };
    play();
  }
  function onProgress() { if (canStart()) start(); }
  function watch() {
    video.addEventListener("canplaythrough", start);
    video.addEventListener("progress", onProgress);
    video.addEventListener("error", fail);
    timer = window.setTimeout(start, MAX_WAIT);
  }
  function unwatch() {
    video.removeEventListener("canplaythrough", start);
    video.removeEventListener("progress", onProgress);
    video.removeEventListener("error", fail);
  }
  function fail() {
    gaveUp = true;
    window.clearTimeout(timer);
    unwatch();
  }

  /* ---------- playback + cross-fade ---------- */

  // Exactly one cross-fade, on the first `playing`. `playing` means the element
  // has left the buffering stall and pixels are actually being presented —
  // `loadeddata` or `canplay` would fade onto a frame that is not on screen yet.
  function fade() {
    if (faded) return;
    faded = true;
    if (poster) poster.style.opacity = "0";
    video.style.opacity = "1";
  }
  video.addEventListener("playing", fade, { once: true });

  var retried = false;
  function retry() {
    if (faded || retried) return;
    retried = true;
    window.removeEventListener("pointerdown", retry);
    window.removeEventListener("touchstart", retry);
    window.removeEventListener("keydown", retry);
    play();
  }
  function play() {
    var p = video.play();
    if (p && p.catch) {
      p.catch(function () {
        // Autoplay policy (or a momentary network failure): the poster keeps its
        // opacity — nothing is flashed — and we ask once more on first input.
        window.addEventListener("pointerdown", retry, { passive: true });
        window.addEventListener("touchstart", retry, { passive: true });
        window.addEventListener("keydown", retry);
      });
    }
  }

  /* ---------- decode budget: only while the hero is on screen ---------- */

  var hero = document.getElementById("top") || video.closest(".h");
  var seen = false, onScreen = false, hidden = !!(document.hidden || document.visibilityState === "hidden");
  function busy() { return hidden || (seen && !onScreen); }
  function sync() {
    if (!started || gaveUp) return;
    if (busy()) { if (!video.paused) video.pause(); }
    else if (video.paused && !video.ended) play();
  }
  if (hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      seen = true;
      onScreen = entries[0].isIntersecting;
      sync();
    }, { threshold: 0 }).observe(hero);
  }
  document.addEventListener("visibilitychange", function () {
    hidden = document.hidden;
    sync();
  });

  /* ---------- go ---------- */

  // Kick the download off as soon as the first screen is painted, so this never
  // competes with the LCP paint, but without waiting for full idle either.
  function begin() {
    video.load();     // picks the first playable <source> and starts fetching
    watch();
  }
  (window.requestIdleCallback
    ? window.requestIdleCallback(begin, { timeout: 1200 })
    : window.setTimeout(begin, 250));
})();
