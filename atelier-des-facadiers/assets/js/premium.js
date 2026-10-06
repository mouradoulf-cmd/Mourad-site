/* premium.js — final finish layer. Small, passive, no layout reads in scroll loops except one rect per frame. */
(function () {
"use strict";
var D = document, reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
var fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
var raf = window.requestAnimationFrame.bind(window);

/* 1. hero: pointer + scroll depth (desktop only, only while the hero is visible) */
var hero = D.querySelector(".hero");
if (hero && !reduce) {
  var vis = true, tx = 0, ty = 0, sy = 0, ticking = false, st = 0;
  if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { vis = e[0].isIntersecting; }, { threshold: 0 }).observe(hero);
  var apply = function () {
    ticking = false; if (!vis) return;
    var s = Math.min(1, Math.max(0, scrollY / Math.max(1, hero.offsetHeight)));
    hero.style.setProperty("--hx", (tx * -10).toFixed(1) + "px");
    hero.style.setProperty("--hy", (ty * -6 + s * 70).toFixed(1) + "px");
    hero.style.setProperty("--hs", (1.06 + s * 0.04).toFixed(3));
  };
  var kick = function () { if (!ticking) { ticking = true; raf(apply); } };
  addEventListener("scroll", function () { hero.classList.add("is-scrolling"); clearTimeout(st); st = setTimeout(function () { hero.classList.remove("is-scrolling"); }, 140); kick(); }, { passive: true });
  if (fine) hero.addEventListener("pointermove", function (e) { var r = hero.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - .5; ty = (e.clientY - r.top) / r.height - .5; kick(); }, { passive: true });
  kick();
}

/* 2. process timeline: line fills with scroll, steps light up as the line reaches them */
var proc = D.querySelector(".proc");
if (proc && "IntersectionObserver" in window && !reduce) {
  var items = [].slice.call(proc.children), pv = false, pt = false;
  new IntersectionObserver(function (e) { pv = e[0].isIntersecting; if (pv) upd(); }, { rootMargin: "0px 0px -10% 0px" }).observe(proc);
  var upd = function () {
    pt = false; var r = proc.getBoundingClientRect(), vh = innerHeight, vertical = getComputedStyle(proc).gridTemplateColumns.split(" ").length === 1;
    var p = Math.min(1, Math.max(0, (vh * .78 - r.top) / (r.height + (vertical ? 0 : vh * .25))));
    proc.style.setProperty("--p", p.toFixed(3));
    items.forEach(function (li, i) { li.classList.toggle("on", p >= (i + .15) / items.length); });
  };
  addEventListener("scroll", function () { if (pv && !pt) { pt = true; raf(upd); } }, { passive: true }); upd();
} else if (proc) { proc.style.setProperty("--p", "1"); [].forEach.call(proc.children, function (li) { li.classList.add("on"); }); }

/* 3. image reveal: only switched on once the observer exists (content never stays hidden) */
if ("IntersectionObserver" in window && !reduce) {
  var imgs = [].slice.call(D.querySelectorAll(".card__ph, .bc img")).filter(function (i) { return !i.closest(".hero,.xv,.lab"); });
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: .12, rootMargin: "0px 0px -6% 0px" });
  imgs.forEach(function (i) { i.classList.add("rv-img"); io.observe(i); });
  D.documentElement.classList.add("pr-on");
}

/* 4. magnetic buttons: 4px pull, desktop only */
if (fine && !reduce) D.querySelectorAll(".btn:not(.btn--sm)").forEach(function (b) {
  b.addEventListener("pointermove", function (e) { var r = b.getBoundingClientRect(); b.style.translate = ((e.clientX - r.left - r.width / 2) * .06).toFixed(1) + "px " + ((e.clientY - r.top - r.height / 2) * .12).toFixed(1) + "px"; });
  b.addEventListener("pointerleave", function () { b.style.translate = ""; });
});
})();
