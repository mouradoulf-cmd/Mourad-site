(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var hasGsap = !!window.gsap;

  /* ---------- Preloader ---------- */
  var preloader = document.getElementById("preloader");
  if (preloader) {
    window.addEventListener("load", function () {
      setTimeout(function () {
        preloader.classList.add("is-done");
        setTimeout(function () { preloader.remove(); }, 700);
      }, 300);
    });
  }

  /* ---------- Scroll progress bar ---------- */
  var progressBar = document.getElementById("progressBar");
  function onScroll() {
    var scrollY = window.scrollY || window.pageYOffset;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById("burger");
  var mobileNav = document.getElementById("mobileNav");
  if (burger && mobileNav) {
    burger.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window) {
    var revealIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { revealIO.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Hero entrance (GSAP) ---------- */
  var heroWords = document.querySelectorAll(".hero__title .word");
  var heroActions = document.querySelector(".hero__actions");
  var heroCue = document.querySelector(".hero__cue");
  var heroCard = document.querySelector(".hero__card");

  if (hasGsap) {
    if (prefersReducedMotion) {
      gsap.set(heroWords, { opacity: 1, y: 0 });
      gsap.set([heroActions, heroCue], { opacity: 1, y: 0 });
    } else {
      var tl = gsap.timeline({ delay: 0.2 });
      tl.to(heroWords, { y: 0, opacity: 1, duration: 1.4, ease: "power4.out", stagger: 0.14 })
        .fromTo(heroActions, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.6")
        .fromTo(heroCue, { opacity: 0 }, { opacity: 1, duration: 1 }, "-=0.4");

      if (heroCard) {
        gsap.to(heroCard, { y: 18, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
      }
    }
  } else {
    heroWords.forEach(function (w) { w.style.opacity = 1; w.style.transform = "none"; });
    if (heroActions) { heroActions.style.opacity = 1; heroActions.style.transform = "none"; }
    if (heroCue) heroCue.style.opacity = 1;
  }

  /* ---------- GSAP scroll parallax on the experience photo ---------- */
  if (hasGsap && window.ScrollTrigger && !prefersReducedMotion) {
    gsap.registerPlugin(ScrollTrigger);
    var expImg = document.getElementById("experienceImg");
    if (expImg) {
      gsap.to(expImg, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: expImg.closest(".experience__frame"),
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }
  }

  /* ---------- Lenis smooth scroll ---------- */
  if (window.Lenis && !prefersReducedMotion) {
    var lenis = new Lenis({ duration: 1.1, smoothWheel: true });

    if (hasGsap) {
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      requestAnimationFrame(function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      });
    }
    if (window.ScrollTrigger) lenis.on("scroll", ScrollTrigger.update);

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

  /* ---------- Custom cursor ---------- */
  var cursorDot = document.getElementById("cursorDot");
  if (cursorDot && canHover) {
    var mouseX = -100, mouseY = -100, curX = -100, curY = -100, cursorSeen = false;

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
    document.addEventListener("mouseleave", function () { cursorDot.classList.remove("is-visible"); });

    (function cursorLoop() {
      curX += (mouseX - curX) * 0.28;
      curY += (mouseY - curY) * 0.28;
      cursorDot.style.transform = "translate(" + curX + "px," + curY + "px) translate(-50%,-50%)";
      requestAnimationFrame(cursorLoop);
    })();

    var hoverSelector = "a, button, [data-cursor-hover]";
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest && e.target.closest(hoverSelector)) cursorDot.classList.add("is-hovering");
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest && e.target.closest(hoverSelector)) cursorDot.classList.remove("is-hovering");
    });
  }

  /* ---------- Menu modal ---------- */
  var menuModal = document.getElementById("menuModal");
  var openMenuBtns = document.querySelectorAll("[data-open-menu]");
  if (menuModal && openMenuBtns.length) {
    var modalClose = document.getElementById("menuModalClose");
    var lastFocused = null;

    function openModal() {
      lastFocused = document.activeElement;
      menuModal.classList.add("is-open");
      document.body.style.overflow = "hidden";
      if (modalClose) modalClose.focus();
    }
    function closeModal() {
      menuModal.classList.remove("is-open");
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }

    openMenuBtns.forEach(function (btn) { btn.addEventListener("click", openModal); });
    if (modalClose) modalClose.addEventListener("click", closeModal);
    menuModal.querySelectorAll("[data-modal-close]").forEach(function (el) {
      el.addEventListener("click", closeModal);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuModal.classList.contains("is-open")) closeModal();
    });
  }

  /* ---------- Testimonials carousel ---------- */
  var reviewsBody = document.getElementById("reviewsBody");
  if (reviewsBody) {
    var quotes = window.BASILICO_QUOTES || [];
    var quoteEl = document.getElementById("reviewQuote");
    var authorEl = document.getElementById("reviewAuthor");
    var roleEl = document.getElementById("reviewRole");
    var dots = Array.prototype.slice.call(document.querySelectorAll(".reviews__dot"));
    var qi = 0;
    var autoplay;

    function render() {
      var q = quotes[qi];
      quoteEl.textContent = "“" + q.text + "”";
      authorEl.textContent = q.author;
      roleEl.textContent = q.role;
      dots.forEach(function (d, i) { d.classList.toggle("is-active", i === qi); });
    }
    function go(dir) {
      qi = (qi + dir + quotes.length) % quotes.length;
      render();
      restartAutoplay();
    }
    function restartAutoplay() {
      clearInterval(autoplay);
      if (!prefersReducedMotion) autoplay = setInterval(function () { go(1); }, 6000);
    }

    var prevBtn = document.getElementById("reviewPrev");
    var nextBtn = document.getElementById("reviewNext");
    if (prevBtn) prevBtn.addEventListener("click", function () { go(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { go(1); });
    dots.forEach(function (d, i) {
      d.addEventListener("click", function () { qi = i; render(); restartAutoplay(); });
    });

    render();
    restartAutoplay();
  }

  /* ---------- Reservation form -> WhatsApp ---------- */
  var reservationForm = document.getElementById("reservationForm");
  if (reservationForm) {
    reservationForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = reservationForm.elements;
      var lines = [
        "Hi! I'd like to reserve a table at Basilico.",
        "Name: " + (f.name.value || "-"),
        "Phone: " + (f.phone.value || "-"),
        "Date: " + (f.date.value || "-"),
        "Time: " + (f.time.value || "-"),
        "Guests: " + (f.guests.value || "-")
      ];
      if (f.notes.value.trim()) lines.push("Notes: " + f.notes.value.trim());

      var message = encodeURIComponent(lines.join("\n"));
      window.open("https://wa.me/15551234567?text=" + message, "_blank", "noopener");
    });
  }

  /* ---------- Newsletter (demo) ---------- */
  var newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Demo form — no email was actually sent.");
      newsletterForm.reset();
    });
  }
})();
