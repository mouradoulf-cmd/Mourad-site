/* NM Studio: "Why it pays". Builds the 3D bar chart (pure CSS 3D, driven by rAF), counts numbers up when the section is seen,
   and shows the satisfaction tile only when a real number or real reviews exist. Numbers come from proof-config.js. */
(function () {
  "use strict";
  var sec = document.getElementById("results"); if (!sec) return;
  var P = window.NM_PROOF || {}, L = +P.liftPercent || 30, N = 6;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function lang() { return window.NM_LANG || document.documentElement.lang || "en"; }
  function t(k) { return (window.NMI18n && window.NMI18n.t(k)) || ""; }

  /* ---- data: rises from 100 to 100 + L, a little fast at first then settling ---- */
  var vals = []; for (var i = 0; i < N; i++) vals.push(100 + L * (1 - Math.pow(1 - i / (N - 1), 1.7)));
  var big = sec.querySelector("[data-count-to][data-prefix]"); if (big) big.setAttribute("data-count-to", L);

  /* ---- build the bars ---- */
  var stage = sec.querySelector(".chart3d__stage"), W = 46, D = 52, GAP = 16, PITCH = W + GAP, K = 1.18, bars = [];
  stage.style.setProperty("--W", W + "px"); stage.style.setProperty("--D", D + "px"); stage.style.setProperty("--K", K);
  stage.style.width = (N * PITCH - GAP) + "px"; stage.style.height = D + "px";
  var html = '<i class="chart3d__floor"></i><i class="chart3d__ref" style="width:' + (N * PITCH - GAP + 28) + 'px"></i>';
  vals.forEach(function (v, k) { html += '<div class="bar' + (k === N - 1 ? " bar--last" : "") + '" style="left:' + (k * PITCH) + 'px"><i class="f top"></i><i class="f front"></i><i class="f side"></i></div>'; });
  stage.innerHTML = html; bars = [].slice.call(stage.querySelectorAll(".bar"));
  function setH(k, p) { bars[k].style.setProperty("--h", (vals[k] * K * p).toFixed(1) + "px"); }
  bars.forEach(function (b, k) { setH(k, reduce ? 1 : 0); });
  var ref = stage.querySelector(".chart3d__ref"); ref.style.transform = "translateZ(" + (100 * K) + "px)";

  /* ---- tiles: real data only ---- */
  var sites = document.querySelectorAll(".wk-card").length; var s = document.getElementById("resSites"); if (s && sites) s.setAttribute("data-count-to", sites);
  var R = window.NM_REVIEWS, tile = document.getElementById("resRating");
  function fillTiles() {
    if (!tile) return;
    var sat = P.satisfaction && P.satisfaction.percent;
    if (R && R.length) {
      var avg = R.reduce(function (a, r) { return a + (+r.rating || 0); }, 0) / R.length;
      document.getElementById("resAvg").textContent = avg.toFixed(1).replace(/\.0$/, "");
      document.getElementById("resAvgLabel").textContent = t("results.tr").replace("{n}", R.length); tile.hidden = false;
    } else if (sat) {
      tile.querySelector(".res__num").innerHTML = '<b data-count-to="' + (+sat) + '">' + (+sat) + '</b><small>%</small>';
      var tx = P.satisfaction.text || {}; document.getElementById("resAvgLabel").textContent = tx[lang()] || tx.en || ""; tile.hidden = false;
    }
  }
  fillTiles(); document.addEventListener("nm:lang", fillTiles);

  /* ---- animation ---- */
  function ease(x) { return 1 - Math.pow(1 - x, 3); }
  function back(x) { var c = 1.4; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); }
  var counters = [].slice.call(sec.querySelectorAll("[data-count-to]"));
  function setNum(el, p) { var to = +el.getAttribute("data-count-to"); el.textContent = (el.getAttribute("data-prefix") || "") + Math.round(to * p); }
  function final() { bars.forEach(function (b, k) { setH(k, 1); }); counters.forEach(function (c) { setNum(c, 1); }); sec.classList.add("is-in"); }
  if (reduce) { final(); return; }
  counters.forEach(function (c) { setNum(c, 0); });
  var started = false;
  function run() {
    if (started) return; started = true; sec.classList.add("is-in"); var t0 = performance.now();
    (function frame(now) {
      var el = now - t0, done = true;
      bars.forEach(function (b, k) { var p = Math.min(1, Math.max(0, (el - 250 - k * 170) / 1100)); if (p < 1) done = false; setH(k, back(p)); });
      var cp = Math.min(1, Math.max(0, (el - 250) / 1900)); counters.forEach(function (c) { setNum(c, ease(cp)); }); if (cp < 1) done = false;
      if (!done) requestAnimationFrame(frame); else final();
    })(t0);
  }
  if ("IntersectionObserver" in window) { var io = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { io.disconnect(); run(); } }, { threshold: 0.35 }); io.observe(sec.querySelector(".res__grid")); } else run();
})();
