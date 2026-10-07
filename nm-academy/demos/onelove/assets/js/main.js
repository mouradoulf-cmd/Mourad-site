(function () {
  "use strict";

  var DATA = window.BAR_DATA || { mosaic: [], drinks: [] };

  var ART = {
    nightsky:
      '<svg class="tile__art" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid slice">' +
      '<circle cx="70" cy="55" r="2" fill="#f1e6c8" opacity=".8"/><circle cx="150" cy="35" r="1.6" fill="#f1e6c8" opacity=".6"/>' +
      '<circle cx="230" cy="75" r="1.8" fill="#f1e6c8" opacity=".7"/><circle cx="330" cy="30" r="1.4" fill="#f1e6c8" opacity=".5"/>' +
      '<circle cx="40" cy="110" r="1.5" fill="#f1e6c8" opacity=".6"/><circle cx="250" cy="125" r="1.3" fill="#f1e6c8" opacity=".5"/>' +
      '<circle cx="540" cy="55" r="1.7" fill="#f1e6c8" opacity=".6"/><circle cx="565" cy="130" r="1.4" fill="#f1e6c8" opacity=".5"/>' +
      '<circle cx="450" cy="95" r="38" fill="#f1e6c8" opacity=".85"/>' +
      '<path d="M0,300 L0,255 Q150,228 300,250 T600,240 L600,300 Z" fill="#241608" opacity=".35"/>' +
      '<g stroke="#241608" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8">' +
      '<path d="M90,300 L96,192"/><path d="M96,192 Q60,178 40,192"/><path d="M96,192 Q132,174 156,188"/>' +
      '<path d="M96,192 Q70,150 48,140"/><path d="M96,192 Q124,148 150,142"/><path d="M96,192 Q96,144 96,124"/>' +
      '<path d="M510,300 L515,205"/><path d="M515,205 Q488,192 472,204"/><path d="M515,205 Q546,190 566,202"/>' +
      '<path d="M515,205 Q495,168 478,160"/><path d="M515,205 Q538,166 560,162"/>' +
      '</g></svg>',
    murals:
      '<svg class="tile__art" viewBox="0 0 900 210" preserveAspectRatio="xMidYMid slice">' +
      '<g stroke="#f1e6c8" stroke-width="3" fill="none" opacity=".55">' +
      '<circle cx="450" cy="100" r="30"/><path d="M450,54 v16M450,130 v16M404,100 v0h16M480,100 h16M420,70 l11,11M480,70 l-11,11M420,130 l11,-11M480,130 l-11,-11"/>' +
      '</g>' +
      '<path d="M0,140 Q56,112 112,140 T224,140 T336,140 T448,140 T560,140 T672,140 T784,140 T900,140" stroke="#f1e6c8" stroke-width="4" fill="none" opacity=".4"/>' +
      '<path d="M0,168 Q56,146 112,168 T224,168 T336,168 T448,168 T560,168 T672,168 T784,168 T900,168" stroke="#f1e6c8" stroke-width="3" fill="none" opacity=".26"/>' +
      '<g opacity=".45" fill="#f1e6c8">' +
      '<ellipse cx="770" cy="95" rx="10" ry="19"/>' +
      '<ellipse cx="770" cy="95" rx="10" ry="19" transform="rotate(72 770 95)"/>' +
      '<ellipse cx="770" cy="95" rx="10" ry="19" transform="rotate(144 770 95)"/>' +
      '<ellipse cx="770" cy="95" rx="10" ry="19" transform="rotate(216 770 95)"/>' +
      '<ellipse cx="770" cy="95" rx="10" ry="19" transform="rotate(288 770 95)"/>' +
      '<circle cx="770" cy="95" r="6" fill="#34210f"/>' +
      '</g></svg>',
    stage:
      '<svg class="tile__art" viewBox="0 0 900 210" preserveAspectRatio="xMidYMid slice">' +
      '<path d="M450,0 L340,210 L560,210 Z" fill="#f1e6c8" opacity=".12"/>' +
      '<path d="M450,0 L400,210 L500,210 Z" fill="#f1e6c8" opacity=".14"/>' +
      '<g fill="#241608" opacity=".85">' +
      '<circle cx="450" cy="108" r="20"/>' +
      '<path d="M426,132 Q450,152 474,132 L482,210 L418,210 Z"/>' +
      '<rect x="446" y="148" width="8" height="62" rx="3"/>' +
      '<circle cx="450" cy="140" r="6"/>' +
      '</g>' +
      '<g fill="#241608" opacity=".28"><circle cx="230" cy="200" r="12"/><circle cx="290" cy="206" r="10"/><circle cx="610" cy="204" r="10"/><circle cx="670" cy="198" r="12"/></g>' +
      '</svg>',
    neon:
      '<svg class="tile__art" viewBox="0 0 500 180" preserveAspectRatio="xMidYMid slice">' +
      '<rect x="55" y="20" width="390" height="140" rx="16" fill="none" stroke="#f0b13a" stroke-width="10" opacity=".18"/>' +
      '<rect x="55" y="20" width="390" height="140" rx="16" fill="none" stroke="#f0b13a" stroke-width="4" opacity=".8"/>' +
      '<g fill="none" stroke="#f1e6c8" stroke-width="2.6" opacity=".85">' +
      '<circle cx="250" cy="90" r="26"/>' +
      '<path d="M250,64 v-12M250,116 v12M224,90 h-12M276,90 h12M232,72 l-9,-9M268,72 l9,-9M232,108 l-9,9M268,108 l9,9"/>' +
      '</g>' +
      '<g fill="#f1e6c8" opacity=".7"><circle cx="80" cy="20" r="3.5"/><circle cx="128" cy="20" r="3.5"/><circle cx="176" cy="20" r="3.5"/><circle cx="224" cy="20" r="3.5"/><circle cx="276" cy="20" r="3.5"/><circle cx="324" cy="20" r="3.5"/><circle cx="372" cy="20" r="3.5"/><circle cx="420" cy="20" r="3.5"/></g>' +
      '</svg>',
    crowd:
      '<svg class="tile__art" viewBox="0 0 1000 180" preserveAspectRatio="xMidYMid slice">' +
      '<g fill="#f1e6c8" opacity=".3"><circle cx="90" cy="25" r="2"/><circle cx="220" cy="40" r="1.6"/><circle cx="420" cy="20" r="2"/><circle cx="620" cy="38" r="1.6"/><circle cx="800" cy="22" r="2"/><circle cx="920" cy="42" r="1.6"/></g>' +
      '<g fill="#241608">' +
      '<g opacity=".4"><circle cx="90" cy="128" r="26"/><path d="M52,180 Q90,140 128,180 Z"/></g>' +
      '<g opacity=".55"><circle cx="230" cy="112" r="29"/><path d="M188,180 Q230,132 272,180 Z"/></g>' +
      '<g opacity=".38"><circle cx="380" cy="132" r="24"/><path d="M344,180 Q380,144 416,180 Z"/></g>' +
      '<g opacity=".65"><circle cx="520" cy="106" r="31"/><path d="M476,180 Q520,124 564,180 Z"/></g>' +
      '<g opacity=".42"><circle cx="660" cy="130" r="25"/><path d="M624,180 Q660,142 696,180 Z"/></g>' +
      '<g opacity=".58"><circle cx="800" cy="114" r="28"/><path d="M760,180 Q800,134 840,180 Z"/></g>' +
      '<g opacity=".4"><circle cx="920" cy="130" r="23"/><path d="M886,180 Q920,143 954,180 Z"/></g>' +
      '</g>' +
      '<g fill="#f0b13a" opacity=".8"><path d="M298,95 l-9,30 h18 Z"/><path d="M598,90 l-9,32 h18 Z"/></g>' +
      '</svg>'
  };

  window.TILE_ART = ART;

  function renderMosaic() {
    var grid = document.getElementById("mosaicGrid");
    if (!grid) return;
    grid.innerHTML = DATA.mosaic.map(function (item) {
      var art = ART[item.art] || "";
      return '<div class="mosaic__tile">' + art + '<span class="mosaic__label">' + item.label + '</span></div>';
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
