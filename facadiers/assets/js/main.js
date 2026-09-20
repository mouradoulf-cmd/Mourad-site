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
});
