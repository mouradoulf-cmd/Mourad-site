(function () {
  "use strict";

  var LINEUP = [
    { day: "Wed", event: "Rooftop Warm-Up", style: "Deep house, sunset to midnight", time: "9pm" },
    { day: "Thu", event: "Throwback Thursday", style: "Hip-hop and R&B", time: "9pm" },
    { day: "Fri", event: "DJ Navy — House Night", style: "Progressive house", time: "10pm" },
    { day: "Sat", event: "Ladies Night", style: "Free entry for ladies before 11pm · commercial dance", time: "10pm" },
    { day: "Sun", event: "Sunset Sessions", style: "Live sax + DJ, poolside deck", time: "8pm" }
  ];

  var MOSAIC = [
    "Dancefloor, mid-level",
    "Rooftop bar, open air",
    "DJ booth, upper deck",
    "VIP booths",
    "Poolside deck"
  ];

  var DRINKS = [
    {
      cat: "Signature cocktails",
      items: [
        ["Monsoon Sour", "280"],
        ["Bougainvillea Spritz", "260"],
        ["Salted Tamarind Margarita", "290"],
        ["Smoked Lychee Old Fashioned", "320"]
      ]
    },
    {
      cat: "Buckets & towers",
      items: [
        ["Vodka bucket, 4 mixers", "650"],
        ["Whisky bucket, 4 mixers", "750"],
        ["Beer tower, 3L", "590"]
      ]
    },
    {
      cat: "Spirits, by the bottle",
      items: [
        ["Local whisky", "1400"],
        ["Imported vodka", "2600"],
        ["Imported gin", "2800"]
      ]
    },
    {
      cat: "Zero-proof",
      items: [
        ["Virgin Bougainvillea", "160"],
        ["Fresh coconut", "140"],
        ["Soda, tonic, juice", "90"]
      ]
    }
  ];

  function renderTicker() {
    var track = document.getElementById("tickerTrack");
    var text = LINEUP.map(function (l) { return l.day.toUpperCase() + " — " + l.event; }).join("   ★   ");
    track.innerHTML = '<span class="ticker__item">' + text + '</span><span class="ticker__item">' + text + '</span>';
  }

  function renderLineup() {
    var body = document.getElementById("lineupBody");
    body.innerHTML = LINEUP.map(function (l) {
      return '<tr><td class="lineup__day">' + l.day + '</td>' +
        '<td><span class="lineup__event">' + l.event + '</span><br><span class="lineup__style">' + l.style + '</span></td>' +
        '<td class="lineup__time">' + l.time + '</td></tr>';
    }).join("");
  }

  function renderMosaic() {
    var grid = document.getElementById("mosaicGrid");
    grid.innerHTML = MOSAIC.map(function (label) {
      return '<div class="mosaic__tile">' + label + '</div>';
    }).join("");
  }

  function renderDrinks() {
    var grid = document.getElementById("drinksGrid");
    grid.innerHTML = DRINKS.map(function (group) {
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
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open));
      if (!open) {
        links.style.cssText = "display:flex;position:absolute;top:72px;left:0;right:0;flex-direction:column;background:#0c0f0d;padding:20px 6%;gap:16px;border-bottom:1px solid rgba(243,239,230,0.12);";
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

  function initVipForm() {
    var form = document.getElementById("vipForm");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var msg = "Table request — " + fd.get("name") + ", " + fd.get("party") + " guests, " + fd.get("date") + ". Contact: " + fd.get("contact");
      var lineUrl = "https://line.me/ti/p/~monsoonpattaya";
      var win = window.open(lineUrl, "_blank", "noopener");
      if (!win) window.location.href = lineUrl;
      form.reset();
      alert("Thanks — opening LINE so you can send us: \n\n" + msg);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderTicker();
    renderLineup();
    renderMosaic();
    renderDrinks();
    initReveal();
    initSmoothScroll();
    initBurger();
    initVipForm();
  });
})();
