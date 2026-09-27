(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  var hasGsap = !!window.gsap;

  /* ---------- Preloader ---------- */
  (function preloader() {
    var el = document.getElementById('preloader');
    if (!el) return;
    var bar = el.querySelector('.preloader-bar span');
    var done = false;

    function finish() {
      if (done) return;
      done = true;
      el.classList.add('is-done');
      if (hasGsap && !reduceMotion) {
        gsap.to(el, { autoAlpha: 0, duration: 0.6, ease: 'power2.out', onComplete: function () { el.remove(); } });
      } else {
        el.style.opacity = '0';
        setTimeout(function () { el.remove(); }, 50);
      }
    }

    if (bar && hasGsap && !reduceMotion) {
      gsap.to(bar, { width: '100%', duration: 1.1, ease: 'power2.out' });
    } else if (bar) {
      bar.style.width = '100%';
    }

    // Finish once the page has loaded, with a short minimum display time so it
    // doesn't just flash on a fast/cached load — plus a safety net in case
    // 'load' never fires for some reason.
    var minDisplay = reduceMotion ? 0 : 650;
    var minTimerDone = false;
    var pageLoaded = document.readyState === 'complete';

    setTimeout(function () { minTimerDone = true; if (pageLoaded) finish(); }, minDisplay);
    window.addEventListener('load', function () { pageLoaded = true; if (minTimerDone) finish(); });
    setTimeout(finish, 4000);
  })();

  /* ---------- Custom cursor ---------- */
  (function cursor() {
    if (reduceMotion || coarsePointer || !hasGsap) return;
    var el = document.querySelector('[data-cursor]');
    if (!el) return;
    var label = el.querySelector('[data-cursor-label]');
    var xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
    var yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });

    document.addEventListener('pointermove', function (e) { xTo(e.clientX); yTo(e.clientY); });

    document.querySelectorAll('[data-cursor-label]').forEach(function (target) {
      if (el.contains(target)) return;
      target.addEventListener('pointerenter', function () {
        if (label) label.textContent = target.dataset.cursorLabel || '';
        gsap.to(el, { scale: 2.6, duration: 0.35, ease: 'power3.out' });
        gsap.to(label, { autoAlpha: 1, duration: 0.25 });
      });
      target.addEventListener('pointerleave', function () {
        gsap.to(el, { scale: 1, duration: 0.35, ease: 'power3.out' });
        gsap.to(label, { autoAlpha: 0, duration: 0.2 });
      });
    });
  })();

  /* ---------- Fullscreen menu ---------- */
  (function menu() {
    var btn = document.getElementById('burgerBtn');
    var nav = document.getElementById('fullMenu');
    if (!btn || !nav) return;
    var open = false;

    function setOpen(next) {
      open = next;
      btn.setAttribute('aria-expanded', String(open));
      nav.setAttribute('aria-hidden', String(!open));
      nav.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }

    btn.addEventListener('click', function () { setOpen(!open); });
    nav.querySelectorAll('[data-menu-link]').forEach(function (link) {
      link.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) setOpen(false); });
  })();

  /* ---------- Animated counters ---------- */
  (function counters() {
    var targets = document.querySelectorAll('[data-counter]');
    if (!targets.length) return;

    targets.forEach(function (el) {
      var to = parseFloat(el.dataset.counterTo || '0');
      var decimals = parseInt(el.dataset.counterDecimals || '0', 10);

      function render(value) { el.textContent = value.toFixed(decimals); }

      if (reduceMotion || !hasGsap || !window.ScrollTrigger) { render(to); return; }

      var obj = { value: 0 };
      gsap.to(obj, {
        value: to, duration: 1.4, ease: 'power2.out',
        onUpdate: function () { render(obj.value); },
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });
  })();
})();
