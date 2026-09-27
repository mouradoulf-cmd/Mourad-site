(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Treatments: expand panels (one always open) ---------- */
  var txItems = Array.prototype.slice.call(document.querySelectorAll('[data-tx]'));
  var txTriggers = txItems.map(function (item) { return item.querySelector('.tx-trigger'); });

  function openTx(index) {
    txItems.forEach(function (item, i) {
      var open = i === index;
      item.classList.toggle('is-open', open);
      txTriggers[i].setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  txTriggers.forEach(function (trigger, i) {
    trigger.addEventListener('click', function () { openTx(i); });
    trigger.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % txTriggers.length;
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + txTriggers.length) % txTriggers.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = txTriggers.length - 1;
      if (next !== null) { e.preventDefault(); txTriggers[next].focus(); openTx(next); }
    });
  });

  /* ---------- Hero slideshow ---------- */
  var heroSlides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  if (heroSlides.length > 1 && !prefersReducedMotion) {
    var heroSlideIndex = 0;
    setInterval(function () {
      heroSlides[heroSlideIndex].classList.remove('is-active');
      heroSlideIndex = (heroSlideIndex + 1) % heroSlides.length;
      heroSlides[heroSlideIndex].classList.add('is-active');
    }, 6000);
  }

  /* ---------- Scroll progress ---------- */
  var progress = document.querySelector('.scroll-progress span');
  if (progress) {
    var ticking = false;
    var update = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------- Booking request: 4 steps + live summary ---------- */
  var form = document.getElementById('bookingForm');
  if (!form) return;

  var DURATIONS = {
    'Authentic Thai Massage': [['60 min', 'A proper reset'], ['90 min', 'Time for the full routine'], ['120 min', 'Slow, with nothing skipped']],
    'Foot Reflexology': [['30 min', 'A quick recovery between plans'], ['60 min', 'Feet, calves and a longer finish']],
    'Skin Treatments': [['Let us suggest', 'We recommend a length once we know your skin']]
  };
  var STORE_KEY = 'malee-booking';

  var steps = Array.prototype.slice.call(form.querySelectorAll('.bstep'));
  var stepCount = document.getElementById('stepCount');
  var backBtn = document.getElementById('bkBack');
  var nextBtn = document.getElementById('bkNext');
  var submitBtn = document.getElementById('bkSubmit');
  var statusEl = document.getElementById('bkStatus');
  var dateInput = document.getElementById('bk-date');
  var timeSelect = document.getElementById('bk-time');
  var durationWrap = form.querySelector('[data-step="2"] .choices');
  var detail = {
    name: document.getElementById('bk-name'),
    email: document.getElementById('bk-email'),
    notes: document.getElementById('bk-notes')
  };
  var current = 1;

  function todayISO() {
    var d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  }
  if (dateInput) dateInput.min = todayISO();

  function value(name) {
    var checked = form.querySelector('input[name="' + name + '"]:checked');
    return checked ? checked.value : '';
  }

  function renderDurations(service, keep) {
    var options = DURATIONS[service] || DURATIONS['Authentic Thai Massage'];
    var selected = options.some(function (o) { return o[0] === keep; }) ? keep : options[0][0];
    durationWrap.innerHTML = options.map(function (o, i) {
      return '<label class="choice"><input type="radio" name="duration" value="' + o[0] + '"' + (o[0] === selected ? ' checked' : '') + '>' +
        '<span class="choice-body"><strong>' + o[0] + '</strong><small>' + o[1] + '</small></span>' +
        '<span class="choice-key" aria-hidden="true">' + (i + 1) + '</span></label>';
    }).join('');
  }

  function formatDate(iso) {
    if (!iso) return '';
    var parts = iso.split('-');
    var d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  function setSummary(key, text) {
    var el = document.querySelector('[data-summary="' + key + '"]');
    if (!el || el.textContent === text) return;
    if (prefersReducedMotion) { el.textContent = text; return; }
    el.classList.add('is-updating');
    setTimeout(function () { el.textContent = text; el.classList.remove('is-updating'); }, 160);
  }

  function updateSummary() {
    setSummary('service', value('service'));
    setSummary('duration', value('duration'));
    var when = dateInput.value ? formatDate(dateInput.value) + ' · ' + timeSelect.value.replace(/\s*\(.*\)/, '') : 'Not chosen yet';
    setSummary('when', when);
  }

  function save() {
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify({
        service: value('service'), duration: value('duration'),
        date: dateInput.value, time: timeSelect.value,
        name: detail.name.value, email: detail.email.value, notes: detail.notes.value
      }));
    } catch (e) { /* storage unavailable — selections just won't persist */ }
  }

  function restore() {
    var data = null;
    try { data = JSON.parse(sessionStorage.getItem(STORE_KEY) || 'null'); } catch (e) { data = null; }
    if (!data) { renderDurations(value('service')); return; }
    var svc = form.querySelector('input[name="service"][value="' + data.service + '"]');
    if (svc) svc.checked = true;
    renderDurations(value('service'), data.duration);
    if (data.date && data.date >= dateInput.min) dateInput.value = data.date;
    if (data.time) timeSelect.value = data.time;
    ['name', 'email', 'notes'].forEach(function (k) { if (data[k]) detail[k].value = data[k]; });
  }

  function showStep(n, moveFocus) {
    current = n;
    steps.forEach(function (step) {
      var on = Number(step.dataset.step) === n;
      step.hidden = !on;
      step.classList.toggle('is-current', on);
    });
    stepCount.textContent = 'Step ' + n + ' of ' + steps.length;
    backBtn.hidden = n === 1;
    nextBtn.hidden = n === steps.length;
    submitBtn.hidden = n !== steps.length;
    statusEl.textContent = '';
    if (moveFocus) {
      var first = steps[n - 1].querySelector('input:checked, input, select, textarea');
      if (first) first.focus({ preventScroll: true });
    }
  }

  function setError(field, message) {
    var row = field.closest('.form-row');
    var errorEl = form.querySelector('[data-error-for="' + field.id + '"]');
    if (row) row.classList.toggle('has-error', !!message);
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (errorEl) { errorEl.textContent = message || ''; errorEl.id = 'err-' + field.id; field.setAttribute('aria-describedby', errorEl.id); }
  }

  function validateField(field) {
    if (field.validity.valueMissing) { setError(field, field.type === 'date' ? 'Choose a day.' : 'This field is required.'); return false; }
    if (field.type === 'email' && field.validity.typeMismatch) { setError(field, 'Enter a valid email address.'); return false; }
    if (field.type === 'date' && field.value < field.min) { setError(field, 'Choose today or a later day.'); return false; }
    setError(field, '');
    return true;
  }

  function validateStep(n) {
    var fields = Array.prototype.slice.call(steps[n - 1].querySelectorAll('input[required], textarea[required]'));
    var invalid = fields.filter(function (f) { return !validateField(f); });
    if (invalid.length) { invalid[0].focus(); return false; }
    return true;
  }

  form.addEventListener('change', function (e) {
    if (e.target.name === 'service') renderDurations(e.target.value, value('duration'));
    if (e.target.closest('.form-row') && e.target.required) validateField(e.target);
    updateSummary();
    save();
  });
  form.addEventListener('input', save);

  nextBtn.addEventListener('click', function () {
    if (!validateStep(current)) return;
    showStep(Math.min(current + 1, steps.length), true);
  });
  backBtn.addEventListener('click', function () { showStep(Math.max(current - 1, 1), true); });

  // Number keys pick an option on the choice steps (matches the key hints on each card).
  form.addEventListener('keydown', function (e) {
    if (!/^[1-9]$/.test(e.key) || e.target.matches('input[type="text"], input[type="email"], input[type="date"], textarea, select')) return;
    var radios = steps[current - 1].querySelectorAll('input[type="radio"]');
    var target = radios[Number(e.key) - 1];
    if (target) { target.checked = true; target.focus(); target.dispatchEvent(new Event('change', { bubbles: true })); }
  });

  // Enter inside a step advances instead of submitting early.
  form.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && current < steps.length && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'BUTTON') {
      e.preventDefault();
      nextBtn.click();
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!dateInput.value || dateInput.value < dateInput.min) { showStep(3); validateStep(3); return; }
    if (!validateStep(4)) return;

    var lines = [
      'Booking request (not yet confirmed)',
      '',
      'Treatment: ' + value('service'),
      'Length: ' + value('duration'),
      'Preferred day: ' + formatDate(dateInput.value),
      'Preferred time: ' + timeSelect.value,
      '',
      detail.notes.value ? 'Notes: ' + detail.notes.value + '\n' : '',
      '— ' + detail.name.value + ' (' + detail.email.value + ')'
    ];
    var subject = encodeURIComponent('Booking request — ' + value('service') + ' — ' + detail.name.value);
    var body = encodeURIComponent(lines.join('\n'));
    statusEl.textContent = 'Your email app should open with the request filled in. Nothing is booked until we reply to confirm.';
    window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
  });

  // "Book this treatment" buttons preselect the service and jump to the length step.
  document.querySelectorAll('[data-book-service]').forEach(function (link) {
    link.addEventListener('click', function () {
      var svc = form.querySelector('input[name="service"][value="' + link.dataset.bookService + '"]');
      if (!svc) return;
      svc.checked = true;
      renderDurations(svc.value, value('duration'));
      updateSummary();
      save();
      showStep(2, false);
    });
  });

  restore();
  showStep(1, false);
  updateSummary();
})();
