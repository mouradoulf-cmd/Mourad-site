(function () {
  "use strict";

  var DATA = window.BAR_DATA || { mosaic: [], drinks: [] };

  function renderMosaic() {
    var grid = document.getElementById("mosaicGrid");
    if (!grid) return;
    grid.innerHTML = DATA.mosaic.map(function (label) {
      return '<div class="mosaic__tile">' + label + '</div>';
    }).join("");
  }

  function renderDrinks() {
    var grid = document.getElementById("drinksGrid");
    if (!grid) return;
    grid.innerHTML = DATA.drinks.map(function (group) {
      var rows = group.items.map(function (item) {
        return '<div class="drinks__row"><span class="drinks__name">' + item[0] + '</span>' +
          '<span class="drinks__leader"></span><span class="drinks__price">฿' + item[1] + '</span></div>';
      }).join("");
      return '<div class="drinks__cat"><h3>' + group.cat + '</h3>' + rows + '</div>';
    }).join("");
  }

  function initReveal() {
    var tiles = document.querySelectorAll(".mosaic__tile");
    if (!("IntersectionObserver" in window)) {
      tiles.forEach(function (t) { t.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function () { entry.target.classList.add("is-visible"); }, i * 80);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    tiles.forEach(function (t) { io.observe(t); });
  }

  function initHeroVideo() {
    var video = document.getElementById("heroVideo");
    if (!video) return;
    video.addEventListener("error", function () { video.style.display = "none"; });
    if (video.readyState === 0 && video.networkState === 3) video.style.display = "none";
  }

  function initHeroSound() {
    var btn = document.getElementById("soundToggle");
    var video = document.getElementById("heroVideo");
    if (!btn) return;
    btn.addEventListener("click", function () {
      if (!video || video.style.display === "none") {
        btn.textContent = btn.dataset.noVideo;
        return;
      }
      var muted = video.muted;
      video.muted = !muted;
      if (video.paused) video.play().catch(function () {});
      btn.textContent = video.muted ? btn.dataset.unmute : btn.dataset.mute;
    });
  }

  function initSmoothScroll() {
    if (typeof Lenis === "undefined") return;
    var lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (typeof gsap !== "undefined" && gsap.ticker) {
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    }
  }

  function initBurger() {
    var burger = document.getElementById("burger");
    var links = document.getElementById("navLinks");
    if (!burger) return;
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open));
      if (!open) {
        links.style.cssText = "display:flex;position:absolute;top:74px;left:0;right:0;flex-direction:column;background:#15110c;padding:20px 6%;gap:16px;border-bottom:1px solid rgba(241,230,200,0.14);";
      } else {
        links.style.cssText = "";
      }
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        burger.setAttribute("aria-expanded", "false");
        links.style.cssText = "";
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderMosaic();
    renderDrinks();
    initReveal();
    initHeroVideo();
    initHeroSound();
    initSmoothScroll();
    initBurger();
  });
})();
