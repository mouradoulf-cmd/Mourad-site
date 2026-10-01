/* ═══════════════════════════════════════════════════════════
   NM STUDIO — content.js
   Generated with the « Site Immersif » skill. Every photo below is
   a real screenshot of a live NM Studio project (see nm/README.md
   for the seven demos) — nothing here is stock or AI-generated.
   ═══════════════════════════════════════════════════════════ */

window.SITE_CONTENT = {

  brand: {
    name: 'NM Studio',
    title: 'NM Studio — Websites, QR Menus & Google Profiles in Pattaya',
    description: 'Websites, QR menus and Google Business Profiles for restaurants, salons, spas and shops in Pattaya — live in days, no contract.',
    kicker: 'NM STUDIO — WEB DESIGN, PATTAYA',
    copyright: '© 2026 — PATTAYA, THAILAND',
    signature: 'CRAFTED IN PATTAYA, THAILAND',
    socials: []
  },

  nav: { proof: 'WORK', universes: 'PROCESS', cta: 'START' },

  hook: {
    line1: 'Your business,',
    line2a: 'found and',
    line2b: 'chosen.',
    image: 'images/hook-giulivo.jpg',
    imageAlt: 'Giulivo, a restaurant website built by NM Studio',
    floaters: [
      'images/floater-giulivo.jpg',
      'images/floater-facadiers.jpg',
      'images/floater-facadiers-desk.jpg',
      'images/floater-noir.jpg',
      'images/floater-malee.jpg',
      'images/floater-malee-desk.jpg',
      'images/floater-mae-lek.jpg',
      'images/floater-ride-siam.jpg',
      'images/floater-ride-siam-desk.jpg',
      'images/floater-why-salon.jpg'
    ]
  },

  positioning: 'Real sites for real Pattaya businesses.',

  manifesto: {
    text: 'We come to your shop, take the photos, and handle everything — you never touch the tech. No contract, [[just WhatsApp]].'
  },

  proof: {
    layout: 'masonry',
    kicker: 'SELECTED WORK',
    title: 'Seven live sites, seven industries.',
    sub: 'Every demo below is real — restaurants, salons, bars, spas, street food, rentals, trade.',
    meta: 'SEVEN PROJECTS — LIVE IN 2026',
    projects: [
      { img: 'images/masonry-giulivo.jpg', title: 'Giulivo', meta: 'RESTAURANT — 2026' },
      { img: 'images/masonry-facadiers.jpg', title: 'Façadiers', meta: 'TRADE & B2B — 2026' },
      { img: 'images/masonry-noir.jpg', title: 'Noir', meta: 'HAIR SALON — 2026' },
      { img: 'images/masonry-neon-tiger-mobile.jpg', title: 'Neon Tiger', meta: 'BAR & NIGHTLIFE — 2026' },
      { img: 'images/masonry-malee.jpg', title: 'Malee', meta: 'SPA & WELLNESS — 2026' },
      { img: 'images/masonry-mae-lek.jpg', title: 'Mae Lek', meta: 'STREET FOOD — 2026' },
      { img: 'images/masonry-ride-siam.jpg', title: 'Ride Siam', meta: 'SCOOTER RENTAL — 2026' },
      { img: 'images/masonry-pattaya.jpg', title: 'Pattaya, Thailand', meta: 'WHERE WE WORK — 2026' }
    ]
  },

  motto: {
    kicker: 'WHAT GUIDES EVERY PROJECT',
    words: [
      { word: 'Fast', hint: 'Live in days, never months.' },
      { word: 'Local', hint: 'We come to your shop in Pattaya.' },
      { word: 'Yours', hint: 'No contract — edits on WhatsApp, forever.' }
    ]
  },

  universes: {
    introA: 'One',
    introB: 'site,',
    introC: 'three steps.',
    cta: 'Get started →',
    image: 'images/universes-neon-tiger.jpg',
    items: [
      { name: 'Send your photos', meta: 'STEP — 01', desc: 'Photos, menu, opening hours — sent straight from WhatsApp. That’s all we need to start.' },
      { name: 'We design it', meta: 'STEP — 02', desc: 'Design, copy, QR menu, Google Maps and every language your customers speak — done for you.' },
      { name: 'You go live', meta: 'STEP — 03', desc: 'Your site is online within days. Want a change later? One message — edits are unlimited.' }
    ]
  },

  /* No client testimonial yet — fabricating one would break the
     studio's own "no fake reviews" rule. Reused as a verifiable
     studio fact instead: every project shown above is real. */
  testimonial: {
    kicker: 'REAL WORK, NOT MOCKUPS',
    figure: '7',
    unit: '',
    quote: 'Every project on this page is a live site you can click through — built this year, for real Pattaya businesses.',
    author: 'NM STUDIO — PATTAYA'
  },

  objections: {
    items: ['No contract to sign.', 'No tech skills needed.', 'No waiting months for changes.'],
    finale: 'Just a site,',
    pill: 'that works.'
  },

  contact: {
    kicker: 'GOT A BUSINESS IN PATTAYA?',
    email: 'hello@nmstudio.co',
    reassurance: 'REPLY ON WHATSAPP — FREE QUOTE, NO CONTRACT'
  },

  trail: [
    'images/trail-01.jpg', 'images/trail-02.jpg', 'images/trail-03.jpg', 'images/trail-04.jpg',
    'images/trail-05.jpg', 'images/trail-06.jpg', 'images/trail-07.jpg', 'images/trail-08.jpg',
    'images/trail-09.jpg', 'images/trail-10.jpg', 'images/trail-11.jpg', 'images/trail-12.jpg',
    'images/trail-13.jpg', 'images/trail-14.jpg', 'images/trail-15.jpg', 'images/trail-16.jpg',
    'images/trail-17.jpg'
  ]
};

/* ═══════════════════════════════════════════════════════════
   INJECTION — NE PAS MODIFIER (remplit le DOM avant app.js)
   ═══════════════════════════════════════════════════════════ */
(() => {
  const C = window.SITE_CONTENT;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const set = (sel, txt) => { const el = $(sel); if (el) el.textContent = txt; };

  document.title = C.brand.title;
  const md = document.querySelector('meta[name="description"]');
  if (md) md.setAttribute('content', C.brand.description);

  // chrome
  set('.loader-wordmark', C.brand.name);
  set('.dock-wordmark', C.brand.name);
  set('.dock-link[href="#travaux"]', C.nav.proof);
  set('.dock-link[href="#explorer"]', C.nav.universes);
  set('.dock-cta', C.nav.cta);

  // 1 · accroche
  set('#heroKicker', C.brand.kicker);
  set('#heroLine1', C.hook.line1);
  const hls = $$('#heroLine2 .hl');
  if (hls.length === 2) { hls[0].textContent = C.hook.line2a; hls[1].textContent = C.hook.line2b; }
  const g1 = $('#grow1 img');
  if (g1) { g1.src = C.hook.image; g1.alt = C.hook.imageAlt; }
  $$('.floaters .fl img').forEach((img, i) => { if (C.hook.floaters[i]) img.src = C.hook.floaters[i]; });

  // 2 · positionnement (un span par mot)
  const intro = $('#spotIntro');
  if (intro) intro.innerHTML = C.positioning.split(' ').map((w) => `<span>${w}</span>`).join(' ');

  // 3 · démarche
  const fill = $('#fillText');
  if (fill) {
    fill.innerHTML = C.manifesto.text.replace(
      /\[\[(.+?)\]\]/,
      '<span class="boxed" id="boxedPhrase">$1<svg class="box-svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path id="boxPath" d="M50,6 C88,4 98,22 97,50 C96,82 76,96 49,95 C16,94 3,76 4,48 C5,18 20,7 50,6 Z"/></svg></span>'
    );
  }

  // 4 · preuve : masonry (8 photos) ou bento (4 features big/tall/tall/big)
  const head = $$('.coll-head > *');
  if (head.length === 4) {
    head[0].textContent = C.proof.kicker;
    head[1].textContent = C.proof.title;
    head[2].textContent = C.proof.sub;
    head[3].textContent = C.proof.meta;
  }
  const grid = $('#collGrid');
  if (grid && C.proof.layout === 'bento') {
    grid.className = 'bento-grid';
    grid.innerHTML = C.proof.features.map((f) =>
      `<figure class="card${f.size ? ' b-' + f.size : ''}"><div class="card-img"><img src="${f.illu}" alt="${f.title}"></div><figcaption>${f.title}<span class="mono">${f.meta}</span></figcaption></figure>`
    ).join('');
  } else if (grid) {
    grid.className = 'coll-grid';
    const SPEEDS = [-0.05, 0.06, -0.028, 0.085];
    grid.innerHTML = SPEEDS.map((s, ci) =>
      `<div class="col" data-pspeed="${s}">` +
      C.proof.projects.slice(ci * 2, ci * 2 + 2).map((p) =>
        `<figure class="card"><div class="card-img"><img src="${p.img}" alt="${p.title} — ${p.meta}"></div><figcaption>${p.title}<span class="mono">${p.meta}</span></figcaption></figure>`
      ).join('') + '</div>'
    ).join('');
  }

  // 5 · devise (train de mots-clés)
  set('#mottoKicker', C.motto.kicker);
  const mtrack = $('#mottoTrack');
  if (mtrack) mtrack.innerHTML = C.motto.words.map((w) => `<span class="mw">${w.word}</span>`).join('');

  // 6-7 · processus immersif (visuels posés un à un)
  set('#nw1', C.universes.introA);
  set('#nw2', C.universes.introB);
  set('#nw3', C.universes.introC);
  const g2 = $('#grow2 img');
  if (g2) g2.src = C.universes.image || (C.universes.items[0] || {}).img || g2.src;
  const psteps = $('#psteps');
  if (psteps) {
    psteps.innerHTML = C.universes.items.map((u) =>
      `<div class="pstep"><span class="pstep-meta mono ash">${u.meta}</span><h3>${u.name}</h3><p>${u.desc || ''}</p></div>`
    ).join('');
  }
  const sCta = $('#stepsCtaLink');
  if (sCta) sCta.childNodes[0].textContent = C.universes.cta;

  // 8 · preuve sociale — le chiffre qui frappe
  set('#figKicker', C.testimonial.kicker || '');
  const figM = String(C.testimonial.figure || '').trim().match(/^([^\d.,+-]*[+−-]?)\s*(-?[\d.,]+)/);
  set('#figPre', figM ? figM[1] : '');
  set('#figVal', figM ? figM[2] : '');
  set('#figUnit', C.testimonial.unit || '');
  set('#quoteText', C.testimonial.quote);
  set('#quoteAuthor', C.testimonial.author);

  // 9 · objections
  C.objections.items.forEach((t, i) => set('#fs' + (i + 1), t));
  const fs4 = $('#fs4');
  if (fs4) {
    fs4.innerHTML = `${C.objections.finale} <span class="pill" id="pillPhrase">${C.objections.pill}<svg class="pill-svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path id="pillPath" d="M50,6 C88,4 98,22 97,50 C96,82 76,96 49,95 C16,94 3,76 4,48 C5,18 20,7 50,6 Z"/></svg></span>`;
  }
  $$('#trail img').forEach((img, i) => { img.src = C.trail[i % C.trail.length]; });

  // 10 · conversion
  set('.footer-kicker', C.contact.kicker);
  const mail = $('.footer-mail');
  if (mail) { mail.href = 'mailto:' + C.contact.email; mail.querySelector('.footer-mail-text').textContent = C.contact.email; }
  set('.footer-reassurance', C.contact.reassurance);
  const fname = $('#footerName');
  if (fname) { fname.textContent = C.brand.name; fname.setAttribute('aria-label', C.brand.name); }
  const bottom = $$('.footer-bottom > p');
  if (bottom.length === 3) {
    bottom[0].textContent = C.brand.copyright;
    bottom[1].innerHTML = C.brand.socials.map((s) => `<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`).join('&nbsp;&nbsp;&nbsp;');
    bottom[2].textContent = C.brand.signature;
  }
})();
