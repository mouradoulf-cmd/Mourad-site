(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = !!window.gsap;

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
  /* Hero elements are handled by the GSAP entrance timeline below when GSAP
     is available, so they're excluded here to avoid a double animation. */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal")).filter(function (el) {
    return !(hasGsap && el.hasAttribute("data-hero-el"));
  });

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

  /* ---------- Custom cursor ---------- */
  var cursorDot = document.getElementById("cursorDot");
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (cursorDot && canHover) {
    document.body.classList.add("has-custom-cursor");
    var mouseX = -100, mouseY = -100, curX = -100, curY = -100;
    var cursorSeen = false;

    window.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!cursorSeen) {
        cursorSeen = true;
        curX = mouseX;
        curY = mouseY;
        cursorDot.classList.add("is-visible");
      }
    });
    document.addEventListener("mouseleave", function () {
      cursorDot.classList.remove("is-visible");
    });

    (function cursorLoop() {
      curX += (mouseX - curX) * 0.28;
      curY += (mouseY - curY) * 0.28;
      cursorDot.style.transform = "translate(" + curX + "px," + curY + "px)";
      requestAnimationFrame(cursorLoop);
    })();

    var hoverSelector = "a, button, .menu-tab, .gallery__item, .menu-card";
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest && e.target.closest(hoverSelector)) {
        cursorDot.classList.add("is-hovering");
      }
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest && e.target.closest(hoverSelector)) {
        cursorDot.classList.remove("is-hovering");
      }
    });
  }

  /* ---------- 3D tilt on cards and gallery photos ---------- */
  if (canHover && !prefersReducedMotion) {
    var tiltSelector = ".menu-card, .gallery__item";
    document.querySelectorAll(tiltSelector).forEach(function (card) {
      card.style.transformStyle = "preserve-3d";
      card.style.willChange = "transform";

      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        var rotateX = (-py * 10).toFixed(2);
        var rotateY = (px * 12).toFixed(2);
        card.style.transition = "transform .08s linear";
        card.style.transform =
          "perspective(900px) translateY(-8px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) scale3d(1.04,1.04,1.04)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transition = "transform .5s cubic-bezier(0.34, 1.56, 0.64, 1)";
        card.style.transform = "perspective(900px) translateY(0) rotateX(0) rotateY(0) scale3d(1,1,1)";
      });
    });
  }

  /* ---------- GSAP hero entrance ---------- */
  if (hasGsap) {
    var heroEls = document.querySelectorAll("[data-hero-el]");
    if (prefersReducedMotion) {
      gsap.set(heroEls, { opacity: 1, y: 0 });
    } else {
      gsap.set(heroEls, { opacity: 0, y: 60 });
      gsap.to(heroEls, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.1,
        delay: 0.15
      });
    }
  }

  /* ---------- GSAP scroll-driven parallax on the experience section ---------- */
  if (hasGsap && window.ScrollTrigger && !prefersReducedMotion) {
    gsap.registerPlugin(ScrollTrigger);
    var expBg = document.getElementById("experienceBg");
    if (expBg) {
      gsap.to(expBg, {
        yPercent: 14,
        ease: "none",
        scrollTrigger: {
          trigger: expBg.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }
  }

  /* ---------- Lenis smooth scroll ---------- */
  if (window.Lenis && !prefersReducedMotion) {
    var lenis = new Lenis({ duration: 1.05 });

    if (hasGsap) {
      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      requestAnimationFrame(function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      });
    }
    if (window.ScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var href = link.getAttribute("href");
        if (href.length < 2) return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { duration: 1.2 });
      });
    });
  }

  /* ---------- Reviews carousel ---------- */
  var reviewsCarousel = document.getElementById("reviewsCarousel");
  if (reviewsCarousel && !prefersReducedMotion) {
    var slides = Array.prototype.slice.call(reviewsCarousel.querySelectorAll(".reviews__slide"));
    var slideIndex = 0;
    if (slides.length > 1) {
      setInterval(function () {
        slides[slideIndex].classList.remove("is-active");
        slideIndex = (slideIndex + 1) % slides.length;
        slides[slideIndex].classList.add("is-active");
      }, 4500);
    }
  }

  /* ---------- Full menu modal ---------- */
  var menuModal = document.getElementById("menuModal");
  var openMenuModalBtn = document.getElementById("openMenuModal");
  if (menuModal && openMenuModalBtn) {
    var modalBody = document.getElementById("menuModalBody");
    var modalClose = document.getElementById("menuModalClose");
    var panelsSource = document.getElementById("menuPanels");
    var lastFocused = null;

    function buildModalContent() {
      modalBody.innerHTML = "";
      panelsSource.querySelectorAll(".menu-panel").forEach(function (panel) {
        var cat = document.createElement("div");
        cat.className = "menu-modal__cat";

        var h4 = document.createElement("h4");
        h4.textContent = panel.dataset.label || "";
        cat.appendChild(h4);

        var note = panel.querySelector(".menu-list__note");
        if (note) cat.appendChild(note.cloneNode(true));

        var grid = panel.querySelector(".menu-panel__grid");
        if (grid) cat.appendChild(grid.cloneNode(true));

        modalBody.appendChild(cat);
      });
    }

    function openModal() {
      lastFocused = document.activeElement;
      buildModalContent();
      menuModal.classList.add("is-open");
      menuModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      modalClose.focus();
    }
    function closeModal() {
      menuModal.classList.remove("is-open");
      menuModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }

    openMenuModalBtn.addEventListener("click", openModal);
    modalClose.addEventListener("click", closeModal);
    menuModal.querySelectorAll("[data-modal-close]").forEach(function (el) {
      el.addEventListener("click", closeModal);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuModal.classList.contains("is-open")) closeModal();
    });
  }

  /* ---------- Reservation form -> WhatsApp ---------- */
  var reservationForm = document.getElementById("reservationForm");
  if (reservationForm) {
    reservationForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = reservationForm.elements.data.value;
      var ora = reservationForm.elements.ora.value;
      var persone = reservationForm.elements.persone.value;
      var note = reservationForm.elements.note.value.trim();

      var dataFormatted = data;
      if (data) {
        var parts = data.split("-");
        if (parts.length === 3) dataFormatted = parts[2] + "/" + parts[1] + "/" + parts[0];
      }

      var lines = [
        "Ciao! Vorrei prenotare un tavolo da Giulivo.",
        "Data: " + (dataFormatted || "-"),
        "Ora: " + (ora || "-"),
        "Persone: " + (persone || "-")
      ];
      if (note) lines.push("Note: " + note);

      var message = encodeURIComponent(lines.join("\n"));
      window.open("https://wa.me/393888566367?text=" + message, "_blank", "noopener");
    });
  }
})();
