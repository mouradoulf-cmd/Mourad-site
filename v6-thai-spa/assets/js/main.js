(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('[role="tabpanel"]'));

  function activate(index) {
    tabs.forEach(function (tab, i) {
      var selected = i === index;
      tab.setAttribute('aria-selected', selected ? 'true' : 'false');
      tab.tabIndex = selected ? 0 : -1;
    });
    panels.forEach(function (panel, i) {
      panel.dataset.active = i === index ? 'true' : 'false';
    });
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { activate(i); });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % tabs.length;
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
      if (next !== null) { e.preventDefault(); tabs[next].focus(); activate(next); }
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(i); }
    });
  });

  if (tabs.length) activate(0);

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var heroSlides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  if (heroSlides.length > 1 && !prefersReducedMotion) {
    var heroSlideIndex = 0;
    setInterval(function () {
      heroSlides[heroSlideIndex].classList.remove('is-active');
      heroSlideIndex = (heroSlideIndex + 1) % heroSlides.length;
      heroSlides[heroSlideIndex].classList.add('is-active');
    }, 5000);
  }
})();
