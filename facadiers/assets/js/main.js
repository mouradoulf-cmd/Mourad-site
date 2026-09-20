// ===== Word-split reveal (headline + description) =====
function splitWords(el){
  const text = el.textContent.trim();
  el.textContent = '';
  const parts = text.split(/(\s+)/).filter(p => p.length);
  parts.forEach(part => {
    if(/^\s+$/.test(part)){
      el.appendChild(document.createTextNode(' '));
    } else {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = part;
      el.appendChild(span);
      el.appendChild(document.createTextNode(' '));
    }
  });
  return el.querySelectorAll('.word');
}

// preserve <em> accent word: split manually keeping the em tag intact
function splitTitle(el){
  const html = el.innerHTML.trim();
  el.innerHTML = '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const words = [];

  tmp.childNodes.forEach(node => {
    if(node.nodeType === Node.TEXT_NODE){
      node.textContent.split(/\s+/).filter(Boolean).forEach(w => {
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = w;
        el.appendChild(span);
        el.appendChild(document.createTextNode(' '));
        words.push(span);
      });
    } else if(node.nodeName === 'EM'){
      const em = document.createElement('em');
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = node.textContent;
      em.appendChild(span);
      el.appendChild(em);
      el.appendChild(document.createTextNode(' '));
      words.push(span);
    }
  });
  return words;
}

function animateWords(words, staggerMs, startDelay){
  words.forEach((w, i) => {
    setTimeout(() => {
      w.style.transition = 'opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1), filter .7s cubic-bezier(.22,1,.36,1)';
      w.style.opacity = '1';
      w.style.transform = 'translateY(0)';
      w.style.filter = 'blur(0px)';
    }, startDelay + i * staggerMs);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Some mobile browsers accept the autoplay/muted/playsinline attributes
  // but still need an explicit play() call to actually start — attributes
  // alone aren't always enough. Silently ignored if it fails; the poster
  // image (or the video's own first frame) is still a complete fallback.
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    heroVideo.muted = true;
    const playPromise = heroVideo.play();
    if (playPromise && playPromise.catch) playPromise.catch(() => {});
  }

  const title = document.getElementById('heroTitle');
  const desc = document.getElementById('heroDesc');
  const cta = document.getElementById('heroCta');

  const titleWords = splitTitle(title);
  const descWords = splitWords(desc);

  cta.style.opacity = '0';
  cta.style.transform = 'translateY(10px)';
  cta.style.transition = 'opacity .6s cubic-bezier(.22,1,.36,1), transform .6s cubic-bezier(.22,1,.36,1)';

  requestAnimationFrame(() => {
    animateWords(titleWords, 120, 200);
    const descStart = 200 + titleWords.length * 120 + 150;
    animateWords(descWords, 40, descStart);
    const ctaStart = descStart + descWords.length * 40 + 250;
    setTimeout(() => {
      cta.style.opacity = '1';
      cta.style.transform = 'translateY(0)';
    }, ctaStart);
  });

  // ===== Burger menu =====
  const burger = document.getElementById('burgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  burger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileNav.classList.remove('open'));
  });

  // ===== Scroll reveal =====
  const revealEls = document.querySelectorAll('.reveal-up');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  // ===== Interactive pillars (icon tabs + single highlight card) =====
  const pillarTabs = document.querySelectorAll('.pillar-tab');
  const pillarPanel = document.getElementById('pillarPanel');
  if (pillarTabs.length && pillarPanel) {
    const panelEyebrow = pillarPanel.querySelector('.pillar-panel-eyebrow');
    const panelTitle = pillarPanel.querySelector('.pillar-panel-title');
    const panelHeading = pillarPanel.querySelector('.pillar-panel-heading');
    const panelBody = pillarPanel.querySelector('.pillar-panel-body');
    const panelImg = pillarPanel.querySelector('.pillar-panel-media img');

    function renderPillar(idx) {
      const tab = pillarTabs[idx];
      const color = tab.getAttribute('data-color');
      const image = tab.getAttribute('data-image');
      const lang = (window.FacadiersI18n && window.FacadiersI18n.getLang()) || 'fr';
      const t = window.FacadiersI18n ? window.FacadiersI18n.t : function () { return null; };
      const title = t(lang, 'pillars.items.' + idx + '.title') || '';

      pillarPanel.style.background = color;
      panelEyebrow.textContent = String(idx + 1).padStart(2, '0');
      panelTitle.textContent = title;
      panelHeading.textContent = t(lang, 'pillars.items.' + idx + '.heading') || '';
      panelBody.textContent = t(lang, 'pillars.items.' + idx + '.body') || '';
      panelImg.src = image;
      panelImg.alt = title;

      pillarTabs.forEach((btn, i) => btn.classList.toggle('active', i === idx));
    }

    pillarTabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => renderPillar(idx));
    });

    window.FacadiersRefreshPillars = function () {
      const activeIdx = Array.from(pillarTabs).findIndex((btn) => btn.classList.contains('active'));
      renderPillar(activeIdx >= 0 ? activeIdx : 0);
    };

    renderPillar(0);
  }

  // ===== Count-up stats =====
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const countEls = document.querySelectorAll('[data-count]');
  if (countEls.length && 'IntersectionObserver' in window) {
    const countIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        if (prefersReducedMotion) {
          el.textContent = target + suffix;
        } else {
          const duration = 1200;
          let startTime = null;
          function step(ts) {
            if (!startTime) startTime = ts;
            const progress = Math.min((ts - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        }
        countIo.unobserve(el);
      });
    }, { threshold: 0.4 });
    countEls.forEach((el) => countIo.observe(el));
  }
});
