(function () {
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out', duration: 0.85 });

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion && window.Lenis) {
    var lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.9, anchors: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  document.documentElement.classList.add('has-motion');

  function splitWords(element) {
    if (element.dataset.motionSplit === 'true') return;
    var text = element.textContent || '';
    var parts = text.split(/(\s+)/);
    element.textContent = '';
    element.setAttribute('aria-label', text.trim());
    parts.forEach(function (part) {
      if (!part.trim()) { element.appendChild(document.createTextNode(part)); return; }
      var mask = document.createElement('span');
      var word = document.createElement('span');
      mask.className = 'motion-word-mask';
      mask.setAttribute('aria-hidden', 'true');
      word.className = 'motion-word';
      word.textContent = part;
      mask.appendChild(word);
      element.appendChild(mask);
    });
    element.dataset.motionSplit = 'true';
  }

  function splitLines(element) {
    if (element.dataset.motionLineSplit === 'true') return;
    var html = element.innerHTML;
    var lines = html.split(/<br\s*\/?>/i).map(function (l) { return l.trim(); }).filter(Boolean);
    if (lines.length < 2) return;
    var plainLines = lines.map(function (l) {
      var tmp = document.createElement('div'); tmp.innerHTML = l; return tmp.textContent.trim();
    });
    element.textContent = '';
    element.setAttribute('aria-label', plainLines.join(' '));
    lines.forEach(function (line) {
      var mask = document.createElement('span');
      var inner = document.createElement('span');
      mask.className = 'motion-line-mask';
      mask.style.display = 'block';
      mask.setAttribute('aria-hidden', 'true');
      inner.className = 'motion-line';
      inner.innerHTML = line;
      mask.appendChild(inner);
      element.appendChild(mask);
    });
    element.dataset.motionLineSplit = 'true';
  }

  function initTextReveals() {
    if (reduceMotion) { gsap.set('[data-motion-text]', { autoAlpha: 1, clearProps: 'all' }); return; }

    gsap.utils.toArray('[data-motion-text="words"]').forEach(function (element) {
      splitWords(element);
      var words = element.querySelectorAll('.motion-word');
      gsap.set(element, { autoAlpha: 1 });
      gsap.fromTo(words,
        { yPercent: 110, autoAlpha: 0, filter: 'blur(8px)' },
        { yPercent: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power4.out', stagger: 0.055,
          scrollTrigger: { trigger: element, start: 'top 82%', once: true } });
    });

    gsap.utils.toArray('[data-motion-text="lines"]').forEach(function (element) {
      splitLines(element);
      var lines = element.querySelectorAll('.motion-line');
      var targets = lines.length ? lines : element.children;
      gsap.set(element, { autoAlpha: 1 });
      gsap.fromTo(targets,
        { yPercent: 100, autoAlpha: 0, filter: 'blur(8px)' },
        { yPercent: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 1, ease: 'power4.out', stagger: 0.11,
          scrollTrigger: { trigger: element, start: 'top 84%', once: true } });
    });
  }

  var revealPresets = {
    'fade-up': { from: { y: 32, autoAlpha: 0 }, to: { y: 0, autoAlpha: 1 } },
    'blur-in': { from: { y: 18, autoAlpha: 0, filter: 'blur(10px)' }, to: { y: 0, autoAlpha: 1, filter: 'blur(0px)' } },
    'scale': { from: { scale: 0.96, autoAlpha: 0 }, to: { scale: 1, autoAlpha: 1 } },
    'slide-left': { from: { x: 48, autoAlpha: 0 }, to: { x: 0, autoAlpha: 1 } },
    'slide-right': { from: { x: -48, autoAlpha: 0 }, to: { x: 0, autoAlpha: 1 } }
  };

  function initScrollReveals() {
    if (reduceMotion) { gsap.set('[data-reveal], [data-reveal-item]', { autoAlpha: 1, clearProps: 'all' }); return; }

    gsap.utils.toArray('[data-reveal-group]').forEach(function (group) {
      var items = group.querySelectorAll('[data-reveal-item]');
      gsap.set(group, { autoAlpha: 1 });
      gsap.fromTo(items,
        { y: 36, autoAlpha: 0, filter: 'blur(8px)' },
        { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.95, ease: 'power4.out', stagger: 0.075,
          scrollTrigger: { trigger: group, start: 'top 82%', once: true } });
    });

    gsap.utils.toArray('[data-reveal]:not([data-reveal-item])').forEach(function (element) {
      var preset = revealPresets[element.dataset.reveal] || revealPresets['fade-up'];
      gsap.set(element, { autoAlpha: 1 });
      var to = Object.assign({}, preset.to, {
        duration: 0.9, ease: 'power4.out', delay: Number(element.dataset.revealDelay || 0),
        scrollTrigger: { trigger: element, start: 'top 84%', once: true }
      });
      gsap.fromTo(element, preset.from, to);
    });
  }

  function initHeroEntrance() {
    if (reduceMotion) return;
    var hero = document.querySelector('.hero-media');
    if (!hero) return;
    gsap.fromTo(hero, { scale: 1.06 }, { scale: 1, duration: 1.6, ease: 'power3.out' });
  }

  function initMagnetic() {
    if (reduceMotion || window.matchMedia('(pointer: coarse)').matches) return;
    gsap.utils.toArray('[data-magnetic]').forEach(function (element) {
      var strength = Number(element.dataset.magnetic) || 0.18;
      var xTo = gsap.quickTo(element, 'x', { duration: 0.45, ease: 'power3.out' });
      var yTo = gsap.quickTo(element, 'y', { duration: 0.45, ease: 'power3.out' });
      element.addEventListener('pointermove', function (event) {
        var rect = element.getBoundingClientRect();
        xTo((event.clientX - rect.left - rect.width / 2) * strength);
        yTo((event.clientY - rect.top - rect.height / 2) * strength);
      });
      element.addEventListener('pointerleave', function () { xTo(0); yTo(0); });
    });
  }

  // Script runs at the end of <body>, so the DOM is already parsed —
  // no need to wait for DOMContentLoaded (it has already fired by now).
  initTextReveals();
  initScrollReveals();
  initHeroEntrance();
  initMagnetic();
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
