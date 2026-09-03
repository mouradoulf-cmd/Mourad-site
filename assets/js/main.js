(function () {
  "use strict";

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Navbar scroll state + progress bar ---------- */
  var navbar = document.getElementById("navbar");
  var progressBar = document.getElementById("progressBar");

  function onScroll() {
    var scrollY = window.scrollY || window.pageYOffset;
    navbar.classList.toggle("scrolled", scrollY > 40);

    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    progressBar.style.width = pct + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById("burger");
  var navLinks = document.getElementById("navLinks");

  burger.addEventListener("click", function () {
    var isOpen = navLinks.classList.toggle("open");
    burger.classList.toggle("open", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
      burger.classList.remove("open");
      document.body.style.overflow = "";
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  function revealInView() {
    var vh = window.innerHeight;
    revealEls = revealEls.filter(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < vh + 60 && rect.bottom > -60) {
        el.classList.add("is-visible");
        return false;
      }
      return true;
    });
    if (revealEls.length === 0) {
      window.removeEventListener("scroll", onRevealScroll);
      window.removeEventListener("resize", onRevealScroll);
    }
  }

  var revealTicking = false;
  function onRevealScroll() {
    if (revealTicking) return;
    revealTicking = true;
    requestAnimationFrame(function () {
      revealInView();
      revealTicking = false;
    });
  }

  window.addEventListener("scroll", onRevealScroll, { passive: true });
  window.addEventListener("resize", onRevealScroll);
  revealInView();

  /* Safety net: catches content skipped by fast/native smooth-scroll or
     programmatic jumps that don't reliably fire enough scroll samples. */
  var revealPoll = setInterval(function () {
    revealInView();
    if (revealEls.length === 0) clearInterval(revealPoll);
  }, 250);
  setTimeout(function () {
    clearInterval(revealPoll);
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    revealEls = [];
  }, 6000);

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll(".stat__num");
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimal") || "0", 10);
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1400;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = target * eased;
      el.textContent = prefix + value.toFixed(decimals) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target.toFixed(decimals) + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window) {
    var counterIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) { counterIO.observe(el); });
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------- Subtle hero parallax ---------- */
  var heroBg = document.querySelector(".hero__bg");
  if (heroBg && window.matchMedia("(min-width: 760px)").matches) {
    window.addEventListener(
      "scroll",
      function () {
        var y = window.scrollY || window.pageYOffset;
        if (y < window.innerHeight) {
          heroBg.style.transform = "translateY(" + y * 0.15 + "px)";
        }
      },
      { passive: true }
    );
  }

  /* ---------- Animated menu tabs ---------- */
  var menuTabs = document.getElementById("menuTabs");
  if (menuTabs) {
    var tabs = Array.prototype.slice.call(menuTabs.querySelectorAll(".menu-tab"));
    var indicator = menuTabs.querySelector(".menu-tabs__indicator");
    var panels = document.getElementById("menuPanels");

    function moveIndicator(tab) {
      indicator.style.width = tab.offsetWidth + "px";
      indicator.style.transform = "translateX(" + tab.offsetLeft + "px)";
    }

    function activateTab(tab) {
      if (tab.classList.contains("is-active")) return;

      tabs.forEach(function (t) {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
      moveIndicator(tab);

      var nextPanel = document.getElementById("panel-" + tab.dataset.panel);
      var currentPanel = panels.querySelector(".menu-panel.is-active");
      if (!nextPanel || nextPanel === currentPanel) return;

      if (currentPanel) {
        currentPanel.classList.remove("is-active", "is-entering");
      }
      nextPanel.classList.add("is-active");
      // restart the row entrance animation
      nextPanel.classList.remove("is-entering");
      void nextPanel.offsetWidth;
      nextPanel.classList.add("is-entering");
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        activateTab(tab);
      });
    });

    var activeTab = tabs.filter(function (t) { return t.classList.contains("is-active"); })[0] || tabs[0];
    if (activeTab) {
      requestAnimationFrame(function () {
        moveIndicator(activeTab);
        var firstPanel = panels.querySelector(".menu-panel.is-active");
        if (firstPanel) firstPanel.classList.add("is-entering");
      });
      window.addEventListener("resize", function () {
        var current = tabs.filter(function (t) { return t.classList.contains("is-active"); })[0];
        if (current) moveIndicator(current);
      });
    }
  }

  /* ---------- Scroll-spy navigation ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main > section[id]"));
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  if (sections.length && navAnchors.length && "IntersectionObserver" in window) {
    var spyIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          navAnchors.forEach(function (a) {
            a.classList.toggle("is-current", a.getAttribute("href") === "#" + id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { spyIO.observe(s); });
  }
})();
