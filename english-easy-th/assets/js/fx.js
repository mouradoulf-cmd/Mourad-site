/* English Easy TH — fx: animated starfield/aurora background, staggered entrances, ripples, 3D tilt, number pops. Additive; app works without it. */
(function () {
"use strict";
var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches, $ = function (s, r) { return (r || document).querySelector(s); };
var coarse = matchMedia("(pointer: coarse)").matches;

/* aurora blobs + starfield canvas */
var bg = document.createElement("div"); bg.className = "fxbg"; bg.setAttribute("aria-hidden", "true");
bg.innerHTML = '<i class="a1"></i><i class="a2"></i><i class="a3"></i><canvas></canvas><b class="grid"></b>'; document.body.prepend(bg);
if (!reduce) {
  var cv = bg.querySelector("canvas"), c = cv.getContext("2d"), W, H, N = coarse ? 45 : 90, st = [], mx = 0, my = 0, raf;
  var size = function () { W = cv.width = innerWidth; H = cv.height = innerHeight; };
  size(); addEventListener("resize", size);
  for (var i = 0; i < N; i++) st.push({ x: Math.random(), y: Math.random(), z: Math.random() * .8 + .2, t: Math.random() * 6 });
  addEventListener("pointermove", function (e) { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; }, { passive: true });
  var loop = function (ts) {
    if (document.documentElement.classList.contains("gl-on")) { raf = requestAnimationFrame(loop); return; }
    c.clearRect(0, 0, W, H);
    for (var j = 0; j < st.length; j++) {
      var s = st[j]; s.y -= .00018 * s.z; if (s.y < -.02) { s.y = 1.02; s.x = Math.random(); }
      var x = (s.x + mx * .03 * s.z) * W, y = (s.y + my * .03 * s.z) * H, a = .35 + .65 * Math.abs(Math.sin(ts / 900 + s.t));
      c.globalAlpha = a * s.z; c.fillStyle = j % 5 ? "#c4a8ff" : "#fbbf24"; c.beginPath(); c.arc(x, y, s.z * 1.8, 0, 6.283); c.fill();
    }
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  document.addEventListener("visibilitychange", function () { if (document.hidden) cancelAnimationFrame(raf); else raf = requestAnimationFrame(loop); });
}

/* stagger entrance for whatever the router renders */
var main = $("#main");
function stagger(root) {
  if (reduce || !root) return; var kids = root.children, n = 0;
  for (var i = 0; i < kids.length && n < 24; i++) { kids[i].style.setProperty("--i", n++); kids[i].classList.add("rise-in"); }
  root.querySelectorAll(".node-wrap,.alpha__c,.vocab__i,.tip,.badge,.big-card").forEach(function (el, k) { if (k < 40) { el.style.setProperty("--i", k % 14); el.classList.add("pop-in"); } });
}
if (main) { new MutationObserver(function (m) { if (m.some(function (x) { return x.target === main; })) { var d = main.firstElementChild; if (d) stagger(d.classList.contains("page") || d.classList.contains("path") ? d : main); } }).observe(main, { childList: true }); }
var pl = $("#player");
if (pl) new MutationObserver(function () { var s = pl.querySelector(".pl__stage"); if (s && !s.dataset.fx) { s.dataset.fx = 1; s.classList.remove("enter"); void s.offsetWidth; s.classList.add("enter"); } }).observe(pl, { childList: true, subtree: true });

/* button ripple */
document.addEventListener("pointerdown", function (e) {
  var b = e.target.closest && e.target.closest(".btn,.opt,.node,.mt,.tk,.spk,.alpha__c"); if (!b || reduce) return;
  var r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 1.6, s = document.createElement("span");
  s.className = "ripple"; s.style.cssText = "width:" + d + "px;height:" + d + "px;left:" + (e.clientX - r.left - d / 2) + "px;top:" + (e.clientY - r.top - d / 2) + "px";
  if (getComputedStyle(b).position === "static") b.style.position = "relative"; b.style.overflow = "hidden"; b.appendChild(s); setTimeout(function () { s.remove(); }, 650);
}, { passive: true });

/* 3D tilt on cards (mouse only) */
if (!reduce && !coarse) document.addEventListener("pointermove", function (e) {
  var t = e.target.closest && e.target.closest(".hero-card,.big-card,.wotd,.card"); document.querySelectorAll(".tilting").forEach(function (x) { if (x !== t) { x.classList.remove("tilting"); x.style.transform = ""; } });
  if (!t) return; var r = t.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
  t.classList.add("tilting"); t.style.transform = "perspective(800px) rotateX(" + (-py * 7).toFixed(2) + "deg) rotateY(" + (px * 9).toFixed(2) + "deg) translateZ(0)";
}, { passive: true });

/* stat pop when numbers change */
var last = {};
function watch() { ["st-streak", "st-gems", "st-hearts", "st-xp"].forEach(function (id) { var el = document.getElementById(id); if (!el) return; var v = el.textContent; if (last[id] != null && last[id] !== v) { var p = el.closest(".stat"); p.classList.remove("pop"); void p.offsetWidth; p.classList.add("pop"); } last[id] = v; }); }
setInterval(watch, 400);

/* mascot eyes follow the pointer + music button + in-lesson effects */
addEventListener("pointermove", function (e) { var x = (e.clientX / innerWidth - .5) * 6, y = (e.clientY / innerHeight - .5) * 4; document.documentElement.style.setProperty("--mx", x.toFixed(2) + "px"); document.documentElement.style.setProperty("--my", y.toFixed(2) + "px"); }, { passive: true });
var bl = document.querySelector(".brand__logo"); if (bl && window.EE && EE.logo) bl.innerHTML = EE.logo(34);
EE.fx = {
  xp: function (n, el) { if (reduce || !el) return; var r = el.getBoundingClientRect(), t = document.createElement("div"); t.className = "xpfly"; t.textContent = "+" + n + " XP"; t.style.left = (r.left + r.width / 2) + "px"; t.style.top = (r.top - 10) + "px"; document.body.appendChild(t); setTimeout(function () { t.remove(); }, 1100); },
  shock: function (el, bad) { if (reduce || !el) return; var r = el.getBoundingClientRect(), s = document.createElement("div"); s.className = "shock" + (bad ? " shock--bad" : ""); s.style.left = (r.left + r.width / 2) + "px"; s.style.top = (r.top + r.height / 2) + "px"; document.body.appendChild(s); setTimeout(function () { s.remove(); }, 800); },
  combo: function (n) { if (reduce || n < 3) return; var c = document.querySelector(".combo"); if (!c) { c = document.createElement("div"); c.className = "combo"; document.body.appendChild(c); } c.textContent = "COMBO ×" + n; c.classList.remove("hit"); void c.offsetWidth; c.classList.add("hit"); clearTimeout(c._t); c._t = setTimeout(function () { c.remove(); }, 1500); },
  shake: function () { var p = document.getElementById("player"); if (!p || reduce) return; p.classList.remove("shake"); void p.offsetWidth; p.classList.add("shake"); var v = document.createElement("div"); v.className = "vig"; document.body.appendChild(v); setTimeout(function () { v.remove(); }, 600); }
};
})();
