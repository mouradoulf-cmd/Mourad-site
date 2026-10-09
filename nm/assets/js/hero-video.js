/* NM Studio — hero video, loaded late and on purpose.
 *
 * Two encodings, one per screen size, both H.264:
 *   ≤899 px  hero-m.mp4  960×540   ~1.1 MiB / 640 kb/s   (phones, tablets)
 *   ≥900 px  hero.mp4   1280×720   ~2.7 MiB / 1493 kb/s  (+ hero.webm VP9)
 * A phone therefore never downloads the desktop pair — 3.8 MB of video for a
 * frame a 390 px screen crops to its middle third — and a desktop never
 * downloads the phone file. The <source> elements carry the breakpoint in
 * `media`; the non-matching ones are also removed from the DOM below, before
 * load(), so an engine that ignores `media` on <source> still gets the right
 * file instead of a 960×540 desktop hero.
 *
 * The markup carries no `autoplay`, uses preload="none" and keeps its sources
 * in data-src: the sources are only injected when the connection can afford
 * them. Until then the hero shows the <picture class="h__poster"> (AVIF → WebP
 * → JPEG, 1280×720), warmed by the preload in <head>.
 *
 * H.264 is declared first in the markup: Windows, iOS and Android decode it on
 * the GPU, while VP9 is very often decoded in software (CPU at 100 %, visible
 * stutter). The webm stays as the desktop fallback source.
 *
 * Start-up is fast and still bump-free: the download starts right after the
 * first paint (two animation frames, on every screen size), WITHOUT calling
 * play(); playback starts as soon as `canplaythrough` fires or `buffered`
 * covers 1.5 s ahead (the files are fast-start, a key frame every 2 s), and at
 * the latest 4 s after the download began. The owner found the old rule (wait
 * for the full page load + idle on phones, 4 s of buffer) too slow to start.
 *
 * The poster → video hand-over is a single 600 ms cross-fade driven by the
 * video's own `playing` event. The video is decoded and rendering its first
 * frame at that point, so there is never a white flash and never a hard jump.
 * Any failure (autoplay policy, codec, network) leaves the poster at its CSS
 * default opacity: 1 — the worst case looks exactly like the slow-connection
 * path, never like a broken hero. A `play()` rejected by the autoplay policy is
 * retried once, on the first user interaction.
 *
 * Mobile follows the same path with the same guardrails, plus one extra rule on
 * the timing: a phone waits for the whole first screen (load) before the
 * download starts, so the video's bytes and its decode never compete with the
 * paint the visitor is looking at, and it is paused the moment the hero leaves
 * the viewport. The guardrails still decide for the visitor: `saveData`,
 * `slow-2g`/`2g`/`3g` keep the poster, which
 * is the correct and intended outcome there.
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

  // The muted hero video plays for everyone (the owner's choice), reduced motion included; only data saver
  // and slow connections below keep the still image.
  video.muted = true; video.defaultMuted = true; video.setAttribute("muted", ""); video.playsInline = true;
  // Skip metered or slow connections (Connection API is absent on Safari/FF,
  // in which case we simply keep the video).
  var conn = navigator.connection;
  if (conn) {
    if (conn.saveData) return;
    if (/^(slow-2g|2g|3g)$/.test(conn.effectiveType || "")) return;
  }

  // Same breakpoint as the `media` attribute on the <source> elements.
  var small = window.matchMedia("(max-width: 899px)").matches;
  var poster = document.querySelector(".h__poster");
  var faded = false;

  // The cross-fade start state is applied in JS, never in the stylesheet: a
  // visitor without JS (or filtered out above) must keep a fully opaque hero,
  // and this runs before the first video frame can paint, so the poster is never
  // briefly uncovered.
  video.style.opacity = "0";

  // Keep only the encoding that matches this screen, then promote data-src to
  // src. The <source> order in the markup is already the final one (mp4 then
  // webm): nothing is reordered or duplicated here.
  var sources = video.querySelectorAll("source[data-src]");
  if (!sources.length) return;
  for (var i = sources.length - 1; i >= 0; i--) {
    var mq = sources[i].getAttribute("media");
    if (mq && !window.matchMedia(mq).matches) {
      sources[i].parentNode.removeChild(sources[i]);
      continue;
    }
    sources[i].src = sources[i].getAttribute("data-src");
  }
  if (!video.querySelector("source[src]")) return;
  if (video.canPlayType && !video.canPlayType("video/mp4") && !video.canPlayType("video/webm")) return;

  video.preload = "auto";
  window.__heroVideoPick = { small: small, source: (video.querySelector("source[src]") || {}).src || "" };

  /* ---------- start-up: download first, play second ---------- */

  var MIN_BUFFER = 1.5;    // seconds of media we want before showing motion
  var MAX_WAIT = 4000;     // hard deadline: never keep the poster longer
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
    window.__heroVideoStart = { at: since(), reason: video.readyState >= 4 ? "canplaythrough" : "buffer>=" + MIN_BUFFER + "s", ahead: +bufferedAhead().toFixed(2) };
    play();
  }
  function onProgress() { if (canStart()) start(); }
  function watch() {
    video.addEventListener("canplaythrough", start);
    video.addEventListener("progress", onProgress);
    video.addEventListener("canplay", onProgress);
    video.addEventListener("error", fail);
    timer = window.setTimeout(start, MAX_WAIT);
  }
  function unwatch() {
    video.removeEventListener("canplaythrough", start);
    video.removeEventListener("progress", onProgress);
    video.removeEventListener("canplay", onProgress);
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

  // Right after the first paint, on every screen size: two animation frames
  // guarantee the poster (preloaded in <head>) is on screen before the video
  // starts fetching, so the download never delays the first paint.
  function begin() {
    video.load();     // picks the first playable <source> and starts fetching
    watch();
  }
  requestAnimationFrame(function () { requestAnimationFrame(begin); });
})();
