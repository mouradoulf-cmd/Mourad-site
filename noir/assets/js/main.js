(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Navbar scroll state ---------- */
  var navbar = document.getElementById("navbar");
  function updateNavbar() {
    if (window.scrollY > 40) navbar.classList.add("is-scrolled");
    else navbar.classList.remove("is-scrolled");
  }
  updateNavbar();
  window.addEventListener("scroll", updateNavbar, { passive: true });

  /* ---------- Mobile burger menu ---------- */
  var burger = document.getElementById("burger");
  var mobileNav = document.getElementById("mobileNav");
  burger.addEventListener("click", function () {
    burger.classList.toggle("is-open");
    mobileNav.classList.toggle("is-open");
  });
  mobileNav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      burger.classList.remove("is-open");
      mobileNav.classList.remove("is-open");
    });
  });

  /* ---------- Scroll reveal ----------
     Visible by default in CSS. The hidden "pre-reveal" state is only
     switched on here, right before a confirmed-working IntersectionObserver
     starts watching — a script error or missing API can never leave
     content stuck invisible. */
  try {
    var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (revealEls.length && !prefersReducedMotion && "IntersectionObserver" in window) {
      revealEls.forEach(function (el) { el.style.transition = "none"; });
      revealEls.forEach(function (el) { el.classList.add("pre-reveal"); });
      void revealEls[0].offsetHeight; // flush the instant, transition-less state
      requestAnimationFrame(function () {
        revealEls.forEach(function (el) { el.style.transition = ""; });
      });

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var delay = parseInt(entry.target.style.getPropertyValue("--d"), 10) || 0;
            setTimeout(function () { entry.target.classList.add("is-visible"); }, delay * 90);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.18 });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  } catch (e) {}

  /* ---------- Count-up stats ---------- */
  try {
    var countEls = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
    if (countEls.length && "IntersectionObserver" in window) {
      var countIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var target = parseFloat(el.getAttribute("data-count"));
          var decimals = parseInt(el.getAttribute("data-decimal"), 10) || 0;
          var suffix = el.getAttribute("data-suffix") || "";
          if (prefersReducedMotion) {
            el.textContent = target.toFixed(decimals) + suffix;
          } else {
            var start = 0;
            var duration = 1400;
            var startTime = null;
            function step(ts) {
              if (!startTime) startTime = ts;
              var progress = Math.min((ts - startTime) / duration, 1);
              var eased = 1 - Math.pow(1 - progress, 3);
              var value = start + (target - start) * eased;
              el.textContent = value.toFixed(decimals) + suffix;
              if (progress < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
          }
          countIo.unobserve(el);
        });
      }, { threshold: 0.4 });
      countEls.forEach(function (el) { countIo.observe(el); });
    }
  } catch (e) {}

  /* ---------- Reviews carousel ---------- */
  try {
    var slides = Array.prototype.slice.call(document.querySelectorAll(".reviews__slide"));
    if (slides.length > 1 && !prefersReducedMotion) {
      var slideIndex = 0;
      setInterval(function () {
        slides[slideIndex].classList.remove("is-active");
        slideIndex = (slideIndex + 1) % slides.length;
        slides[slideIndex].classList.add("is-active");
      }, 5000);
    }
  } catch (e) {}

  /* ---------- Booking form -> WhatsApp deep link ---------- */
  var bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(bookingForm);
      var date = data.get("date") || "";
      var time = data.get("time") || "";
      var service = data.get("service") || "";
      var notes = data.get("notes") || "";
      var message = "Hi Noir! I'd like to book an appointment.\n" +
        "Service: " + service + "\n" +
        "Date: " + date + "\n" +
        "Time: " + time +
        (notes ? "\nNotes: " + notes : "");
      var url = "https://wa.me/66812345678?text=" + encodeURIComponent(message);
      window.open(url, "_blank", "noopener");
    });
  }
})();
