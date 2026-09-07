(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var hasGsap = !!window.gsap;

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Preloader ---------- */
  var preloader = document.getElementById("preloader");
  if (preloader) {
    var introSeen = false;
    try { introSeen = sessionStorage.getItem("giulivoIntroSeen") === "1"; } catch (err) { introSeen = false; }
    if (introSeen || prefersReducedMotion) {
      preloader.remove();
    } else {
      try { sessionStorage.setItem("giulivoIntroSeen", "1"); } catch (err) { /* noop */ }
      window.addEventListener("load", function () {
        setTimeout(function () {
          preloader.classList.add("is-done");
          setTimeout(function () { preloader.remove(); }, 900);
        }, 550);
      });
    }
  }

  /* ---------- Split a heading's text into animatable word spans ---------- */
  function splitWords(el) {
    if (!el || el.dataset.split === "done") return;
    el.dataset.split = "done";
    var text = el.textContent;
    var tokens = text.split(/(\s+)/);
    el.innerHTML = "";
    el.classList.add("split-parent");
    var wordIndex = 0;
    tokens.forEach(function (token) {
      if (/^\s+$/.test(token) || token.length === 0) {
        el.appendChild(document.createTextNode(token));
        return;
      }
      var span = document.createElement("span");
      span.className = "split-word";
      span.style.setProperty("--wi", wordIndex);
      span.textContent = token;
      el.appendChild(span);
      wordIndex++;
    });
  }

  /* ---------- Auto-tag media for the curtain reveal effect ---------- */
  document.querySelectorAll(".story__frame").forEach(function (el) {
    el.classList.add("reveal", "reveal-media");
  });
  document.querySelectorAll(".gallery__item.reveal").forEach(function (el) {
    el.classList.add("reveal-media");
  });

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

  /* ---------- 3D word reveal on section headings ---------- */
  var splitTargets = Array.prototype.slice.call(document.querySelectorAll("main h2"));
  splitTargets.forEach(function (el) { splitWords(el); });

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    var splitIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".split-word").forEach(function (w) {
              w.classList.add("is-visible");
            });
            splitIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    splitTargets.forEach(function (el) { splitIO.observe(el); });
  } else {
    splitTargets.forEach(function (el) {
      el.querySelectorAll(".split-word").forEach(function (w) { w.classList.add("is-visible"); });
    });
  }

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

  /* ---------- Hero parallax depth (scroll drift + mouse-driven 3D tilt) ---------- */
  var heroBg = document.querySelector(".hero__bg");
  var heroSection = document.querySelector(".hero");
  var heroContentEl = heroSection ? heroSection.querySelector(".hero__content") : null;
  var heroScrollY = 0, heroMouseX = 0, heroMouseY = 0;

  function updateHeroBgTransform() {
    if (!heroBg) return;
    heroBg.style.transform = "translate(" + heroMouseX.toFixed(1) + "px," + (heroScrollY * 0.15 + heroMouseY).toFixed(1) + "px)";
  }

  if (heroBg && window.matchMedia("(min-width: 760px)").matches) {
    window.addEventListener(
      "scroll",
      function () {
        var y = window.scrollY || window.pageYOffset;
        if (y < window.innerHeight) {
          heroScrollY = y;
          updateHeroBgTransform();
        }
      },
      { passive: true }
    );
  }

  if (heroSection && canHover && !prefersReducedMotion) {
    heroSection.addEventListener("mousemove", function (e) {
      var rect = heroSection.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width - 0.5;
      var py = (e.clientY - rect.top) / rect.height - 0.5;
      heroMouseX = px * 18;
      heroMouseY = py * 12;
      updateHeroBgTransform();
      if (heroContentEl) {
        heroContentEl.style.transform =
          "perspective(1400px) rotateY(" + (px * 2.6).toFixed(2) + "deg) rotateX(" + (-py * 2).toFixed(2) + "deg)";
      }
    });
    heroSection.addEventListener("mouseleave", function () {
      heroMouseX = 0;
      heroMouseY = 0;
      updateHeroBgTransform();
      if (heroContentEl) heroContentEl.style.transform = "";
    });
  }

  /* ---------- Animated menu "book" (page-flip) ---------- */
  var menuTabs = document.getElementById("menuTabs");
  if (menuTabs) {
    var tabs = Array.prototype.slice.call(menuTabs.querySelectorAll(".menu-tab"));
    var indicator = menuTabs.querySelector(".menu-tabs__indicator");
    var panels = document.getElementById("menuPanels");
    var categoryOrder = tabs.map(function (t) { return t.dataset.panel; });
    var currentCatIndex = 0;
    var isFlipping = false;
    var FLIP_MS = 450;
    var flipReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function moveIndicator(tab) {
      indicator.style.width = tab.offsetWidth + "px";
      indicator.style.transform = "translateX(" + tab.offsetLeft + "px)";
    }

    function syncTabUI(index) {
      var key = categoryOrder[index];
      tabs.forEach(function (t) {
        var active = t.dataset.panel === key;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", active ? "true" : "false");
        if (active) moveIndicator(t);
      });
    }

    function goToIndex(targetIndex) {
      var total = categoryOrder.length;
      targetIndex = ((targetIndex % total) + total) % total;
      if (targetIndex === currentCatIndex || isFlipping) return;

      var direction = targetIndex > currentCatIndex ? "next" : "prev";
      // shortest-path direction when wrapping around the ends
      if (currentCatIndex === 0 && targetIndex === total - 1) direction = "prev";
      if (currentCatIndex === total - 1 && targetIndex === 0) direction = "next";

      var fromPanel = document.getElementById("panel-" + categoryOrder[currentCatIndex]);
      var toPanel = document.getElementById("panel-" + categoryOrder[targetIndex]);
      if (!fromPanel || !toPanel) return;

      syncTabUI(targetIndex);

      if (flipReduced) {
        fromPanel.classList.remove("is-active", "is-entering");
        toPanel.classList.add("is-active");
        void toPanel.offsetWidth;
        toPanel.classList.add("is-entering");
        currentCatIndex = targetIndex;
        return;
      }

      isFlipping = true;
      var outClass = direction === "next" ? "flip-out-next" : "flip-out-prev";
      var inStartClass = direction === "next" ? "flip-in-start-next" : "flip-in-start-prev";

      fromPanel.classList.add(outClass);

      setTimeout(function () {
        fromPanel.classList.remove("is-active", "is-entering", outClass);

        toPanel.classList.add("is-active", inStartClass);
        void toPanel.offsetWidth;
        toPanel.classList.remove(inStartClass);
        toPanel.classList.remove("is-entering");
        void toPanel.offsetWidth;
        toPanel.classList.add("is-entering");

        currentCatIndex = targetIndex;
        setTimeout(function () { isFlipping = false; }, FLIP_MS);
      }, FLIP_MS);
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        goToIndex(index);
      });
    });

    var prevBtn = document.getElementById("menuPrev");
    var nextBtn = document.getElementById("menuNext");
    if (prevBtn) prevBtn.addEventListener("click", function () { goToIndex(currentCatIndex - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goToIndex(currentCatIndex + 1); });

    requestAnimationFrame(function () {
      syncTabUI(currentCatIndex);
      var firstPanel = panels.querySelector(".menu-panel.is-active");
      if (firstPanel) firstPanel.classList.add("is-entering");
    });
    window.addEventListener("resize", function () {
      var active = tabs.filter(function (t) { return t.classList.contains("is-active"); })[0];
      if (active) moveIndicator(active);
    });
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
      cursorDot.style.transform = "translate(" + curX + "px," + curY + "px) translate(-50%,-50%)";
      requestAnimationFrame(cursorLoop);
    })();

    /* Auto-derive a cursor label from each element's own text, so the
       dot can morph into a small pill announcing what a click will do. */
    document.querySelectorAll(".btn--primary, .menu-card").forEach(function (el) {
      if (el.hasAttribute("data-cursor")) return;
      var source = el.classList.contains("menu-card") ? el.querySelector("h3") : el;
      var label = source ? source.textContent.trim() : "";
      if (label) el.setAttribute("data-cursor", label.length > 20 ? label.slice(0, 18) + "…" : label);
    });
    document.querySelectorAll(".gallery__item").forEach(function (el) {
      if (el.hasAttribute("data-cursor")) return;
      var caption = el.querySelector("figcaption");
      if (caption) el.setAttribute("data-cursor", caption.textContent.trim());
    });

    var cursorLabel = cursorDot.querySelector(".cursor-dot__label");
    var hoverSelector = "a, button, .menu-tab, .gallery__item, .menu-card";
    document.addEventListener("mouseover", function (e) {
      var labeled = e.target.closest && e.target.closest("[data-cursor]");
      if (labeled && cursorLabel) {
        cursorLabel.textContent = labeled.getAttribute("data-cursor");
        cursorDot.classList.add("is-labeled");
        cursorDot.classList.remove("is-hovering");
        return;
      }
      if (e.target.closest && e.target.closest(hoverSelector)) {
        cursorDot.classList.add("is-hovering");
      }
    });
    document.addEventListener("mouseout", function (e) {
      var labeled = e.target.closest && e.target.closest("[data-cursor]");
      if (labeled) {
        cursorDot.classList.remove("is-labeled");
        if (cursorLabel) cursorLabel.textContent = "";
      }
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

  /* ---------- Magnetic primary buttons ---------- */
  if (canHover && !prefersReducedMotion) {
    document.querySelectorAll(".btn--primary").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var rect = btn.getBoundingClientRect();
        var x = (e.clientX - rect.left - rect.width / 2) * 0.35;
        var y = (e.clientY - rect.top - rect.height / 2) * 0.45;
        btn.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "";
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
    var pageLang = (document.documentElement.lang || "it").slice(0, 2);
    var reservationStrings = {
      it: { greeting: "Ciao! Vorrei prenotare un tavolo da Giulivo.", date: "Data", time: "Ora", guests: "Persone", notes: "Note", dateSep: "/" },
      en: { greeting: "Hi! I'd like to book a table at Giulivo.", date: "Date", time: "Time", guests: "Guests", notes: "Notes", dateSep: "/" },
      de: { greeting: "Hallo! Ich möchte einen Tisch bei Giulivo reservieren.", date: "Datum", time: "Uhrzeit", guests: "Personen", notes: "Anmerkungen", dateSep: "." }
    };
    var rt = reservationStrings[pageLang] || reservationStrings.it;

    reservationForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = reservationForm.elements.data.value;
      var ora = reservationForm.elements.ora.value;
      var persone = reservationForm.elements.persone.value;
      var note = reservationForm.elements.note.value.trim();

      var dataFormatted = data;
      if (data) {
        var parts = data.split("-");
        if (parts.length === 3) dataFormatted = parts[2] + rt.dateSep + parts[1] + rt.dateSep + parts[0];
      }

      var lines = [
        rt.greeting,
        rt.date + ": " + (dataFormatted || "-"),
        rt.time + ": " + (ora || "-"),
        rt.guests + ": " + (persone || "-")
      ];
      if (note) lines.push(rt.notes + ": " + note);

      var message = encodeURIComponent(lines.join("\n"));
      window.open("https://wa.me/393888566367?text=" + message, "_blank", "noopener");
    });
  }
})();
