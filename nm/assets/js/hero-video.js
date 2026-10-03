/* NM Studio — hero video, loaded late and on purpose.
 *
 * The video is 3.3 MB (webm) / 4.4 MB (mp4): if it autoplays it competes with
 * the fonts and the H1 and delays first paint, so the markup no longer has
 * `autoplay`, uses preload="none" and keeps its sources in data-src. The hero
 * shows hero-poster.jpg instead (see the <img class="h__poster"> and the
 * preload in <head>), which is what mobile and reduced-motion visitors keep.
 *
 * The sources are only injected — and playback only started — when the screen
 * is large enough to make the video worth its bytes and the connection can
 * afford it. Any failure leaves the poster in place. */
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

  // Promote data-src to src, then start. play() rejects (autoplay policy,
  // codec, network) — the poster stays visible and that is a fine outcome.
  var sources = video.querySelectorAll("source[data-src]");
  for (var i = 0; i < sources.length; i++) {
    sources[i].src = sources[i].getAttribute("data-src");
  }
  if (!sources.length) return;
  video.load();
  var started = video.play();
  if (started && started.catch) started.catch(function () {});
})();
