/* NM Studio — the four offers, their prices and the optional care plan.
 *
 * price  — one-time price in Thai baht.
 * care   — optional care plan, baht per month (0 = no care plan).
 *          Yearly billing = 10 months (2 months free).
 * videos — drop a short MP4 (15–20 s, ≤ 2 MB, 16:9 or 4:5) into
 *          assets/video/ and put its path here, e.g. "assets/video/google.mp4".
 *          Left empty, the offer shows its animated illustration instead.
 * posters — optional still image shown while the video loads.
 * hero   — the home page's cinematic hero video (10 s, 16:9, no sound,
 *          < 2 MB). Put the files in assets/video/ and fill the paths:
 *          mp4 (H.264, required), webm (optional, lighter), mp4Mobile
 *          (optional 720p version for phones), poster (a still frame shown
 *          instantly while it loads), loop (false = plays once and rests
 *          on its last frame, which is also the no-JS / reduced-motion image
 *          assets/img/hero-video-end.*).
 */
window.NM_OFFERS = {
  order: ["google", "qr", "pack", "ultimate"],
  featured: "pack",
  price: { google: 990, qr: 1990, pack: 4990, ultimate: 9990 },
  care: { google: 0, qr: 290, pack: 590, ultimate: 1490 },
  yearlyMonths: 10,
  videos: { google: "", qr: "", pack: "", ultimate: "" },
  posters: { google: "", qr: "", pack: "", ultimate: "" },
  hero: { mp4: "", webm: "", mp4Mobile: "", poster: "", loop: true },

  /* Approximate amounts shown next to the baht price for visitors reading in
     another language — hand-rounded, not a live exchange rate. */
  approx: {
    eur: { 990: 25, 1990: 50, 4990: 125, 9990: 250, 290: 8, 590: 15, 1490: 39, 2900: 75, 5900: 150, 14900: 390 },
    mad: { 990: 270, 1990: 550, 4990: 1400, 9990: 2800, 290: 80, 590: 165, 1490: 420, 2900: 800, 5900: 1650, 14900: 4200 }
  }
};

/* Price formatting shared by every page. Baht is always the real price. */
window.NMPrice = (function () {
  var O = window.NM_OFFERS;
  function lang() { return window.NM_LANG || document.documentElement.lang || "en"; }
  function group(n) { return Math.round(n).toLocaleString("en-US"); }
  function thb(n) { return lang() === "th" ? group(n) + " บาท" : "฿" + group(n); }
  function approx(n) {
    var l = lang();
    if (l === "th") return "";
    var cur = l === "ar" ? "mad" : "eur";
    var v = O.approx[cur][n];
    if (v == null) v = cur === "eur" ? Math.round(n / 38) : Math.round(n * 0.28 / 10) * 10;
    return "≈ " + group(v) + (cur === "eur" ? " €" : " DH");
  }
  function render(root) {
    (root || document).querySelectorAll("[data-thb]").forEach(function (el) { el.textContent = thb(+el.getAttribute("data-thb")); });
    (root || document).querySelectorAll("[data-approx]").forEach(function (el) {
      var a = approx(+el.getAttribute("data-approx"));
      el.textContent = a; el.hidden = !a;
    });
  }
  document.addEventListener("nm:lang", function () { render(); });
  return { thb: thb, approx: approx, render: render };
})();
