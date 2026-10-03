/* NM Studio — hero video, loaded late and on purpose.
 *
 * The encoded pair (hero.webm VP9 / hero.mp4 H.264) is ~2.5 MB each, so the
 * markup carries no `autoplay`, uses preload="none" and keeps its sources in
 * data-src: the sources are only injected when the screen is large enough to
 * make the video worth its bytes and the connection can afford it. Until then
 * the hero shows the <picture class="h__poster"> (AVIF → WebP → JPEG, 1600×900),
 * warmed by the preload in <head>.
 *
 * The poster → video hand-over is a single 600 ms cross-fade driven by the
 * video's own `playing` event. The video is decoded and rendering its first
 * frame at that point, so there is never a white flash and never a hard jump.
 * Any failure (autoplay policy, codec, network) leaves the poster at its CSS
 * default opacity: 1 — the worst case looks exactly like the slow-connection
 * path, never like a broken hero. A `play()` rejected by the autoplay policy is
 * retried once, on the first user interaction.
 *
 * The pair is 1600×900 and the hero frame is ~1584 px wide, so the video is no
 * longer upscaled by the browser; the only remaining scaling is the intentional
 * `scale(1.1 → 1.18)` depth effect owned by hero-depth.js. */
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

  // Promote data-src to src. The <source> order in the markup is already the
  // final one (webm then mp4): nothing is reordered or duplicated here.
  var sources = video.querySelectorAll("source[data-src]");
  if (!sources.length) return;
  for (var i = 0; i < sources.length; i++) {
    sources[i].src = sources[i].getAttribute("data-src");
  }
  video.preload = "auto";

  var poster = document.querySelector(".h__poster");
  var faded = false;
  var retried = false;

  // The cross-fade start state is applied in JS, never in the stylesheet: a
  // visitor without JS (or filtered out above) must keep a fully opaque hero,
  // and this runs before load() can paint a first video frame, so the poster is
  // never briefly uncovered.
  video.style.opacity = "0";
  video.load();

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

  function retry() {
    if (faded || retried) return;
    retried = true;
    window.removeEventListener("pointerdown", retry);
    window.removeEventListener("touchstart", retry);
    window.removeEventListener("keydown", retry);
    var p = video.play();
    if (p && p.catch) p.catch(function () {});
  }

  var started = video.play();
  if (started && started.catch) {
    started.catch(function () {
      // Autoplay policy (or a momentary network failure): the poster keeps its
      // opacity — nothing is flashed — and we ask once more on first input.
      window.addEventListener("pointerdown", retry, { passive: true });
      window.addEventListener("touchstart", retry, { passive: true });
      window.addEventListener("keydown", retry);
    });
  }
})();
