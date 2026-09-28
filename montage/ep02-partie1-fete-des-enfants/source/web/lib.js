/* ชาวนาตัวน้อย — shared drawing + animation helpers */
const NS = 'http://www.w3.org/2000/svg';
const $ = id => document.getElementById(id);
function el(tag, attrs, parent) { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
function G(parent, attrs = {}) { return el('g', attrs, parent); }
let _seed = 1; function seed(s) { _seed = s; } function rnd() { _seed = (_seed * 16807) % 2147483647; return (_seed - 1) / 2147483646; }
const R = (a, b) => a + rnd() * (b - a);

/* ---------------- timeline helpers ---------------- */
const tl = gsap.timeline({ paused: true });
gsap.defaults({ ease: 'sine.inOut' });
const T = (t, target, vars) => tl.to(target, vars, t);
const S = (t, target, vars) => tl.set(target, vars, t);
const O = (t, target, from, to) => tl.fromTo(target, from, { ...to, immediateRender: false }, t);
function origin(sel, x, y) { gsap.set(sel, { svgOrigin: `${x} ${y}` }); }
function place(sel, x, y, s = 1, flip = false) { gsap.set(sel, { svgOrigin: '0 0', x, y, scaleX: flip ? -s : s, scaleY: s }); }
function blinks(eyes, t0, t1, sd = 3) { seed(sd * 97 + 13); let t = t0 + R(0.6, 2.2); while (t < t1 - 0.3) { T(t, eyes, { scaleY: .08, duration: .07, ease: 'none' }); T(t + .1, eyes, { scaleY: 1, duration: .08, ease: 'none' }); t += R(2.4, 4.6); } }
function talk(p, t0, t1) {
  const n = Math.max(1, Math.floor((t1 - t0) / .13));
  O(t0, `#${p}_mO`, { opacity: 0 }, { opacity: 1, duration: .13, repeat: n, yoyo: true, ease: 'steps(1)' });
  O(t0, `#${p}_mC`, { opacity: 1 }, { opacity: 0, duration: .13, repeat: n, yoyo: true, ease: 'steps(1)' });
  S(t1 + .02, `#${p}_mO`, { opacity: 0 }); S(t1 + .02, `#${p}_mC`, { opacity: 1 });
  const k = Math.max(1, Math.floor((t1 - t0) / .5));
  O(t0, `#${p}_head`, { rotation: -2 }, { rotation: 3, duration: .5, repeat: k, yoyo: true });
  S(t1 + .05, `#${p}_head`, { rotation: 0 });
}
function walkCycle(p, t0, t1, leg = .28, amp = 22, arms = true) {
  const n = Math.max(1, Math.floor((t1 - t0) / leg));
  O(t0, `#${p}_legL`, { rotation: -amp }, { rotation: amp, duration: leg, repeat: n, yoyo: true });
  O(t0, `#${p}_legR`, { rotation: amp }, { rotation: -amp, duration: leg, repeat: n, yoyo: true });
  if (arms) { O(t0, `#${p}_armL`, { rotation: amp * .7 }, { rotation: -amp * .7, duration: leg, repeat: n, yoyo: true }); O(t0, `#${p}_armR`, { rotation: -amp * .7 }, { rotation: amp * .7, duration: leg, repeat: n, yoyo: true }); }
  O(t0, `#${p}_body`, { y: 0 }, { y: -8, duration: leg / 2, repeat: n * 2 + 1, yoyo: true });
  S(t1 + .01, [`#${p}_legL`, `#${p}_legR`].concat(arms ? [`#${p}_armL`, `#${p}_armR`] : []), { rotation: 0 }); S(t1 + .01, `#${p}_body`, { y: 0 });
}
function quadWalk(p, t0, t1, step = .3, amp = 16) {
  const n = Math.max(1, Math.floor((t1 - t0) / step));
  ['a', 'c'].forEach(k => O(t0, `#${p}_leg${k}`, { rotation: -amp }, { rotation: amp, duration: step, repeat: n, yoyo: true }));
  ['b', 'd'].forEach(k => O(t0, `#${p}_leg${k}`, { rotation: amp }, { rotation: -amp, duration: step, repeat: n, yoyo: true }));
  O(t0, `#${p}_body`, { y: 0 }, { y: -6, duration: step / 2, repeat: n * 2 + 1, yoyo: true });
  S(t1 + .01, ['a', 'b', 'c', 'd'].map(k => `#${p}_leg${k}`), { rotation: 0 }); S(t1 + .01, `#${p}_body`, { y: 0 });
}
function loop(t0, t1, target, from, to, dur) { const n = Math.max(0, Math.floor((t1 - t0) / dur) - 1); O(t0, target, from, { ...to, duration: dur, repeat: n, yoyo: true }); }

/* ---------------- shared defs ---------------- */
function defs(svg) {
  const d = el('defs', {}, svg);
  d.innerHTML = `
  <linearGradient id="gDay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6EC6F0"/><stop offset=".7" stop-color="#BFE8F7"/><stop offset="1" stop-color="#FFF4D6"/></linearGradient>
  <linearGradient id="gDawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5B6FB5"/><stop offset=".45" stop-color="#F29A8E"/><stop offset=".8" stop-color="#FFD08A"/><stop offset="1" stop-color="#FFF0C9"/></linearGradient>
  <linearGradient id="gDusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3E4C8C"/><stop offset=".4" stop-color="#E0706A"/><stop offset=".75" stop-color="#FFA552"/><stop offset="1" stop-color="#FFD58A"/></linearGradient>
  <linearGradient id="gNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E1638"/><stop offset=".7" stop-color="#23306A"/><stop offset="1" stop-color="#3B4A8A"/></linearGradient>
  <linearGradient id="gNoon" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4DB4EE"/><stop offset=".75" stop-color="#A9DDF6"/><stop offset="1" stop-color="#E9F7FF"/></linearGradient>
  <radialGradient id="gSun"><stop offset="0" stop-color="#FFF7C2"/><stop offset=".35" stop-color="#FFE066" stop-opacity=".9"/><stop offset="1" stop-color="#FFB84D" stop-opacity="0"/></radialGradient>
  <radialGradient id="gSunset"><stop offset="0" stop-color="#FFE9B0"/><stop offset=".35" stop-color="#FF9E4A" stop-opacity=".9"/><stop offset="1" stop-color="#FF6A3D" stop-opacity="0"/></radialGradient>
  <radialGradient id="gMoon"><stop offset="0" stop-color="#FFFBE6"/><stop offset=".3" stop-color="#FFF4C2" stop-opacity=".8"/><stop offset="1" stop-color="#FFF4C2" stop-opacity="0"/></radialGradient>
  <radialGradient id="gLamp"><stop offset="0" stop-color="#FFE7A3" stop-opacity=".95"/><stop offset=".4" stop-color="#FFB04A" stop-opacity=".45"/><stop offset="1" stop-color="#FF9A3D" stop-opacity="0"/></radialGradient>
  <linearGradient id="gWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ED7D2"/><stop offset="1" stop-color="#4F9CA6"/></linearGradient>
  <linearGradient id="gCanal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FC6C4"/><stop offset="1" stop-color="#3F8D99"/></linearGradient>
  <linearGradient id="gMud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9C7B55"/><stop offset="1" stop-color="#7A5B3C"/></linearGradient>
  <linearGradient id="gWood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B98352"/><stop offset=".5" stop-color="#C79461"/><stop offset="1" stop-color="#AE7746"/></linearGradient>
  <linearGradient id="gWoodDark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6A4428"/><stop offset="1" stop-color="#4E311C"/></linearGradient>
  <linearGradient id="gFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A56D3E"/><stop offset="1" stop-color="#8A5930"/></linearGradient>
  <linearGradient id="gJar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5A2E1A"/><stop offset=".35" stop-color="#8E4B2A"/><stop offset=".6" stop-color="#7A3E22"/><stop offset="1" stop-color="#4A2414"/></linearGradient>
  <linearGradient id="gShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient>
  <pattern id="pPaka" width="24" height="14" patternUnits="userSpaceOnUse"><rect width="24" height="14" fill="#D9453B"/><rect width="6" height="14" fill="#F4E6D8" opacity=".85"/><rect y="5" width="24" height="4" fill="#9E2A22" opacity=".6"/></pattern>
  <pattern id="pPakaW" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="#E8E2D6"/><rect width="7" height="20" fill="#C9423A" opacity=".85"/><rect y="7" width="20" height="5" fill="#C9423A" opacity=".55"/></pattern>
  <pattern id="pSarong" width="40" height="30" patternUnits="userSpaceOnUse"><rect width="40" height="30" fill="#6B3E8E"/><path d="M0,15 Q10,5 20,15 T40,15" fill="none" stroke="#E8B64A" stroke-width="3"/><circle cx="10" cy="25" r="2.5" fill="#F2D7A0"/><circle cx="30" cy="5" r="2.5" fill="#F2D7A0"/></pattern>
  <pattern id="pMat" width="28" height="28" patternUnits="userSpaceOnUse"><rect width="28" height="28" fill="#D8B26E"/><rect width="14" height="14" fill="#C99B55"/><rect x="14" y="14" width="14" height="14" fill="#C99B55"/><rect y="12" width="28" height="4" fill="#B5433A" opacity=".35"/></pattern>
  <pattern id="pPlank" width="120" height="44" patternUnits="userSpaceOnUse"><rect width="120" height="44" fill="#B07A48"/><rect y="40" width="120" height="4" fill="#7E5230"/><rect x="60" width="3" height="40" fill="#8E5E36" opacity=".6"/><path d="M8,14 q30,-6 50,0 M70,28 q20,-5 40,0" stroke="#9A6A3E" stroke-width="2" fill="none" opacity=".6"/></pattern>
  <pattern id="pWall" width="70" height="200" patternUnits="userSpaceOnUse"><rect width="70" height="200" fill="#C49261"/><rect width="4" height="200" fill="#9C6C40"/><path d="M20,30 q6,40 0,80 M48,90 q5,40 0,80" stroke="#B3804F" stroke-width="2" fill="none"/></pattern>
  <pattern id="pNet" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M0,0 L10,10 M10,0 L0,10" stroke="#fff" stroke-width=".8" opacity=".55"/></pattern>
  <pattern id="pBasket" width="16" height="12" patternUnits="userSpaceOnUse"><rect width="16" height="12" fill="#C8994F"/><path d="M0,6 h16 M8,0 v12" stroke="#A67A36" stroke-width="2"/></pattern>
  <filter id="fSoft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter>
  <clipPath id="cFrame"><rect width="1920" height="1080"/></clipPath>`;
  return d;
}

/* ---------------- scenery ---------------- */
function sky(p, id, grad, extra = {}) { return el('rect', { id, width: 1920, height: 1080, fill: `url(#${grad})`, ...extra }, p); }
function cloud(p, x, y, s, col = '#fff', op = 1) { const g = G(p, { transform: `translate(${x},${y}) scale(${s})`, opacity: op }); [[0, 0, 70], [70, -25, 85], [150, 0, 70], [75, 20, 75], [-50, 15, 50], [200, 18, 48]].forEach(([cx, cy, r]) => el('circle', { cx, cy, r, fill: col }, g)); return g; }
function sun(p, id, x, y, grad = 'gSun', core = '#FFE45C') { const g = G(p, { id }); el('circle', { r: 230, fill: `url(#${grad})` }, g); el('circle', { r: 92, fill: core }, g); el('circle', { r: 92, fill: 'none', stroke: '#FFC93C', 'stroke-width': 10, opacity: .8 }, g); place(g, x, y); return g; }
function mountains(p, c1 = '#8FB9C9', c2 = '#79AE8F', y = 0) { const g = G(p, { transform: `translate(0,${y})` });
  el('path', { d: 'M0,720 L0,560 Q180,430 360,540 Q520,380 720,520 Q900,410 1080,530 Q1280,400 1480,520 Q1680,430 1920,540 L1920,720Z', fill: c1 }, g);
  el('path', { d: 'M0,720 L0,610 Q240,520 480,600 Q700,520 960,610 Q1200,530 1440,600 Q1700,520 1920,600 L1920,720Z', fill: c2 }, g); return g; }
function palm(p, x, y, h, s, c1 = '#2F7D3A', c2 = '#3F9447') { const g = G(p, { transform: `translate(${x},${y}) scale(${s})` });
  el('path', { d: `M-7,0 L-4,${-h} L4,${-h} L7,0Z`, fill: '#6B4A2E' }, g); const c = G(g, { transform: `translate(0,${-h})` });
  for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; el('path', { d: `M0,0 L${Math.cos(a - .12) * 55},${Math.sin(a - .12) * 40} L${Math.cos(a) * 78},${Math.sin(a) * 58} L${Math.cos(a + .12) * 55},${Math.sin(a + .12) * 40}Z`, fill: i % 2 ? c1 : c2 }, c); }
  el('circle', { r: 14, fill: '#2A6B31' }, c); return g; }
function tree(p, x, y, s, col = '#4E9E45', col2 = '#3D8A3A') { const g = G(p, { transform: `translate(${x},${y}) scale(${s})` });
  el('path', { d: 'M-18,0 Q-10,-90 -14,-160 L14,-160 Q10,-90 18,0Z', fill: '#7A5230' }, g);
  [[0, -230, 110, col2], [-80, -190, 80, col], [80, -195, 85, col], [-30, -290, 80, col], [45, -280, 75, col2], [0, -200, 90, col]].forEach(([cx, cy, r, c]) => el('circle', { cx, cy, r, fill: c }, g)); return g; }
function banana(p, x, y, s) { const g = G(p, { transform: `translate(${x},${y}) scale(${s})` }); el('rect', { x: -12, y: -200, width: 24, height: 200, rx: 10, fill: '#7FA652' }, g);
  [[-60, -40], [-30, -70], [10, -80], [45, -60], [70, -30]].forEach(([a, b], i) => el('path', { d: `M0,-200 Q${a},${-200 + b - 60} ${a * 2.4},${-200 + b + 30} Q${a * 1.2},${-200 + b - 10} 0,-190Z`, fill: i % 2 ? '#6DB34A' : '#5AA03F' }, g)); return g; }
function stiltHouse(p, x, y, s) { const g = G(p, { transform: `translate(${x},${y}) scale(${s})` });
  [-70, -25, 25, 70].forEach(sx => el('rect', { x: sx - 5, y: -60, width: 10, height: 60, fill: '#5B3B22' }, g));
  el('rect', { x: -90, y: -150, width: 180, height: 92, fill: '#A8743F' }, g); for (let i = 0; i < 9; i++) el('rect', { x: -90 + i * 20, y: -150, width: 3, height: 92, fill: '#8B5E30' }, g);
  el('rect', { x: -20, y: -125, width: 40, height: 67, fill: '#5B3B22' }, g); el('path', { d: 'M-120,-146 L0,-265 L120,-146Z', fill: '#8A3B24' }, g);
  el('path', { d: 'M-120,-146 L0,-265 L120,-146', fill: 'none', stroke: '#5E2616', 'stroke-width': 8 }, g); el('path', { d: 'M0,-265 q-6,-24 12,-34', fill: 'none', stroke: '#5E2616', 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
  el('rect', { x: -100, y: -64, width: 200, height: 8, fill: '#5B3B22' }, g); return g; }
function field(p, base, tuft, grain, y0 = 700, x0 = 0, w = 1920) {
  el('rect', { x: x0, y: y0 - 12, width: w, height: 1100 - y0, fill: base }, p); let y = y0, row = 0;
  while (y < 1100) { const sz = 10 + (y - y0 + 10) / 10; let d = '';
    for (let x = x0 - 40 + (row % 2) * sz; x < x0 + w + 40; x += sz * 1.6) d += `M${x},${y} l${sz * .35},${-sz * 1.6} l${sz * .3},${sz * 1.2} l${sz * .25},${-sz * 1.9} l${sz * .25},${sz * 1.9} l${sz * .3},${-sz * 1.2} l${sz * .35},${sz * 1.6}Z `;
    el('path', { d, fill: tuft }, p); if (grain) for (let x = x0 + (row % 2) * sz; x < x0 + w; x += sz * 3.2) el('circle', { cx: x + sz * .8, cy: y - sz * 1.9, r: sz * .16, fill: grain }, p);
    y += sz * 1.15; row++; } }
function grassTufts(p, y, n, c1 = '#4E9E3C', c2 = '#5DB049', h = 70, x0 = 0, w = 1920) { seed(y * 7 + n); for (let i = 0; i < n; i++) { const x = x0 + i * (w / n) + R(-10, 30); el('path', { d: `M${x},${y + 5} l${h * .2},${-h} l${h * .17},${h * .8} l${h * .2},${-h * 1.28} l${h * .2},${h * 1.28} l${h * .17},${-h * .8} l${h * .2},${h}Z`, fill: i % 2 ? c1 : c2 }, p); } }
function flowers(p, y0, y1, n, sd = 5) { seed(sd); const cols = ['#FF7FA8', '#FFD84D', '#FFFFFF', '#B58CFF']; for (let i = 0; i < n; i++) { const x = R(0, 1920), y = R(y0, y1), c = cols[i % 4]; const g = G(p, { transform: `translate(${x},${y})` }); for (let k = 0; k < 5; k++) { const a = k / 5 * 6.28; el('circle', { cx: Math.cos(a) * 7, cy: Math.sin(a) * 7, r: 6, fill: c }, g); } el('circle', { r: 5, fill: '#F2A93B' }, g); } }
function seedling(p, x, y, s = 1, id) { const g = G(p, id ? { id } : {}); place(g, x, y, s); [['M0,0 C-4,-40 -20,-70 -45,-95', '#4CAF50'], ['M0,0 C3,-45 20,-80 42,-105', '#5CBF5A'], ['M0,0 C0,-50 -4,-95 -1,-125', '#43A047']].forEach(([d, c]) => el('path', { d, fill: 'none', stroke: c, 'stroke-width': 9, 'stroke-linecap': 'round' }, g)); return g; }

/* ---------------- characters ---------------- */
const SKIN = { boy: '#F5C896', boyLimb: '#E9B27E', dad: '#D59A62', dadLimb: '#C98C55', mom: '#F0C08E', momLimb: '#E4AE7A' };
function face(H, id, cx, cy, r, skin, opt = {}) {
  el('circle', { cx: cx - r * .95, cy: cy + 3, r: r * .24, fill: skin }, H); el('circle', { cx: cx + r * .95, cy: cy + 3, r: r * .24, fill: skin }, H);
  el('circle', { cx, cy, r, fill: skin }, H);
  const eyes = G(H, { id: id + '_eyes' }); const ex = r * .37, ey = cy - r * .02;
  [-1, 1].forEach(sx => { el('ellipse', { cx: cx + sx * ex, cy: ey, rx: r * .16, ry: r * .22, fill: '#1D1410' }, eyes); el('circle', { cx: cx + sx * ex + r * .05, cy: ey - r * .08, r: r * .065, fill: '#fff' }, eyes); });
  const ec = G(H, { id: id + '_eyesC', opacity: 0 }); [-1, 1].forEach(sx => el('path', { d: `M${cx + sx * ex - r * .16},${ey} Q${cx + sx * ex},${ey + r * .15} ${cx + sx * ex + r * .16},${ey}`, fill: 'none', stroke: '#1D1410', 'stroke-width': r * .07, 'stroke-linecap': 'round' }, ec));
  const hap = G(H, { id: id + '_eyesH', opacity: 0 }); [-1, 1].forEach(sx => el('path', { d: `M${cx + sx * ex - r * .16},${ey + r * .05} Q${cx + sx * ex},${ey - r * .18} ${cx + sx * ex + r * .16},${ey + r * .05}`, fill: 'none', stroke: '#1D1410', 'stroke-width': r * .07, 'stroke-linecap': 'round' }, hap));
  el('path', { d: `M${cx - ex - r * .18},${ey - r * .38} q${r * .16},${-r * .1} ${r * .32},0 M${cx + ex - r * .14},${ey - r * .38} q${r * .16},${-r * .1} ${r * .32},0`, fill: 'none', stroke: opt.brow || '#2B1D14', 'stroke-width': r * .08, 'stroke-linecap': 'round' }, H);
  el('ellipse', { cx: cx - r * .63, cy: cy + r * .36, rx: r * .19, ry: r * .12, fill: '#F28B82', opacity: .55 }, H); el('ellipse', { cx: cx + r * .63, cy: cy + r * .36, rx: r * .19, ry: r * .12, fill: '#F28B82', opacity: .55 }, H);
  el('path', { d: `M${cx - r * .05},${cy + r * .2} q${r * .05},${r * .06} ${r * .1},0`, fill: 'none', stroke: '#B97E52', 'stroke-width': r * .05 }, H);
  if (opt.mustache) el('path', { d: `M${cx - r * .32},${cy + r * .4} Q${cx},${cy + r * .26} ${cx + r * .32},${cy + r * .4} Q${cx},${cy + r * .34} ${cx - r * .32},${cy + r * .4}Z`, fill: '#2B1D14' }, H);
  el('path', { id: id + '_mC', d: `M${cx - r * .25},${cy + r * .47} Q${cx},${cy + r * .7} ${cx + r * .25},${cy + r * .47}`, fill: 'none', stroke: '#7A2E24', 'stroke-width': r * .08, 'stroke-linecap': 'round' }, H);
  el('path', { id: id + '_mS', d: `M${cx - r * .22},${cy + r * .64} Q${cx},${cy + r * .46} ${cx + r * .22},${cy + r * .64}`, fill: 'none', stroke: '#7A2E24', 'stroke-width': r * .08, 'stroke-linecap': 'round', opacity: 0 }, H);
  const mO = G(H, { id: id + '_mO', opacity: 0 }); el('path', { d: `M${cx - r * .25},${cy + r * .43} Q${cx},${cy + r * .9} ${cx + r * .25},${cy + r * .43}Z`, fill: '#8B2E2E' }, mO); el('ellipse', { cx, cy: cy + r * .7, rx: r * .11, ry: r * .06, fill: '#E77A7A' }, mO);
}
/* boy: origin at feet (stand) or seat (sit). opt: hat, pose:'stand'|'sit', pj */
function boy(p, id, opt = {}) {
  const hat = opt.hat !== false, sit = opt.pose === 'sit'; const shirt = opt.shirt || '#2E4A7D', collar = '#1F3358';
  const B = G(p, { id }); if (opt.shadow !== false) el('ellipse', { cx: 0, cy: 0, rx: sit ? 80 : 58, ry: 12, fill: '#000', opacity: .14 }, B); const body = G(B, { id: id + '_body' });
  const legL = G(body, { id: id + '_legL' }), legR = G(body, { id: id + '_legR' });
  if (!sit) { el('rect', { x: -26, y: -72, width: 17, height: 70, rx: 8, fill: SKIN.boyLimb }, legL); el('ellipse', { cx: -18, cy: -2, rx: 16, ry: 7, fill: '#6B3A1E' }, legL);
    el('rect', { x: 9, y: -72, width: 17, height: 70, rx: 8, fill: SKIN.boyLimb }, legR); el('ellipse', { cx: 18, cy: -2, rx: 16, ry: 7, fill: '#6B3A1E' }, legR);
    el('path', { d: 'M-38,-112 L38,-112 L40,-66 L4,-66 L0,-80 L-4,-66 L-40,-66Z', fill: opt.shorts || '#5B3A29' }, body); }
  else { el('path', { d: 'M-70,-8 Q-72,-40 -38,-44 L38,-44 Q72,-40 70,-8 Q0,6 -70,-8Z', fill: opt.shorts || '#5B3A29' }, body);
    el('ellipse', { cx: -52, cy: -6, rx: 30, ry: 12, fill: SKIN.boyLimb }, legL); el('ellipse', { cx: 52, cy: -6, rx: 30, ry: 12, fill: SKIN.boyLimb }, legR);
    el('path', { d: 'M-38,-104 L38,-104 L40,-40 L-40,-40Z', fill: opt.shorts || '#5B3A29' }, body); }
  const oy = sit ? 42 : 0; const up = G(body, { id: id + '_up', transform: `translate(0,${oy})` });
  const armL = G(up, { id: id + '_armL' }), armR = G(up, { id: id + '_armR' });
  [[armL, -1], [armR, 1]].forEach(([a, sx]) => { el('rect', { x: sx < 0 ? -58 : 34, y: -186, width: 24, height: 78, rx: 12, fill: SKIN.boyLimb }, a); el('rect', { x: sx < 0 ? -58 : 34, y: -188, width: 24, height: 36, rx: 10, fill: shirt }, a); el('circle', { cx: sx * 46, cy: -106, r: 13, fill: '#F2BE8C' }, a); });
  el('rect', { x: -42, y: -194, width: 84, height: 92, rx: 22, fill: shirt }, up);
  el('path', { d: 'M-16,-194 L0,-170 L16,-194', fill: 'none', stroke: collar, 'stroke-width': 6, 'stroke-linejoin': 'round' }, up);
  el('rect', { x: -44, y: -122, width: 88, height: 16, rx: 6, fill: 'url(#pPaka)' }, up); el('path', { d: 'M26,-110 l14,34 l-16,-6Z', fill: '#D9453B' }, up);
  const H = G(up, { id: id + '_head' }); face(H, id, 0, -255, 63, SKIN.boy);
  el('path', { d: 'M-58,-270 Q-40,-318 0,-316 Q42,-318 58,-270 Q30,-292 12,-282 Q0,-296 -14,-282 Q-34,-294 -58,-270Z', fill: '#2B1D14' }, H);
  if (hat) { const h = G(H, { id: id + '_hat' }); el('path', { d: 'M-128,-292 Q0,-392 128,-292 Q0,-270 -128,-292Z', fill: '#E3B35F' }, h); el('path', { d: 'M-128,-292 Q0,-270 128,-292', fill: 'none', stroke: '#B9843A', 'stroke-width': 6 }, h);
    for (let i = -3; i <= 3; i++) el('path', { d: `M${i * 34},${-285 + Math.abs(i) * 2} L0,-362`, stroke: '#C9934A', 'stroke-width': 3 }, h); el('path', { d: 'M-70,-302 Q0,-330 70,-302', fill: 'none', stroke: '#D9453B', 'stroke-width': 8 }, h); }
  gsap.set(`#${id}_legL`, { svgOrigin: sit ? '-52 -6' : '-18 -72' }); gsap.set(`#${id}_legR`, { svgOrigin: sit ? '52 -6' : '18 -72' });
  gsap.set(`#${id}_armL`, { svgOrigin: '-46 -178' }); gsap.set(`#${id}_armR`, { svgOrigin: '46 -178' });
  gsap.set([`#${id}_eyes`, `#${id}_eyesC`, `#${id}_eyesH`], { svgOrigin: '0 -256' }); gsap.set(`#${id}_head`, { svgOrigin: '0 -200' }); gsap.set(`#${id}_body`, { svgOrigin: '0 0' });
  return B;
}
/* adults: kind 'dad' | 'mom'. origin at feet (stand) or seat (sit) */
function adult(p, id, kind, opt = {}) {
  const sit = opt.pose === 'sit', dad = kind === 'dad', tch = kind === 'teacher', yai = kind === 'yai'; const skin = dad ? SKIN.dad : yai ? '#E8B888' : SKIN.mom, limb = dad ? SKIN.dadLimb : yai ? '#DCA878' : SKIN.momLimb;
  const shirt = dad ? '#2C4F8C' : tch ? '#F3F7FC' : yai ? '#8E6BB5' : '#E0648C', shirtD = dad ? '#1E3868' : tch ? '#9FB5CF' : yai ? '#6B4C90' : '#B8476C';
  const lowerF = tch ? '#26355E' : 'url(#pSarong)', hairC = yai ? '#C9C9C9' : '#1E140E';
  const A = G(p, { id }); if (opt.shadow !== false) el('ellipse', { cx: 0, cy: 0, rx: sit ? 110 : 70, ry: 14, fill: '#000', opacity: .14 }, A); const body = G(A, { id: id + '_body' });
  const legL = G(body, { id: id + '_legL' }), legR = G(body, { id: id + '_legR' });
  if (!sit) {
    if (dad) { [[legL, -1], [legR, 1]].forEach(([l, sx]) => { el('rect', { x: sx < 0 ? -40 : 8, y: -160, width: 32, height: 120, rx: 10, fill: '#3A3F55' }, l); el('rect', { x: sx < 0 ? -36 : 10, y: -46, width: 24, height: 44, rx: 10, fill: limb }, l); el('ellipse', { cx: sx * 22, cy: -2, rx: 20, ry: 8, fill: '#4A2A16' }, l); }); }
    else { [[legL, -1], [legR, 1]].forEach(([l, sx]) => { el('rect', { x: sx < 0 ? -30 : 8, y: -60, width: 22, height: 58, rx: 10, fill: limb }, l); el('ellipse', { cx: sx * 20, cy: -2, rx: 18, ry: 7, fill: '#7A3A2A' }, l); });
      el('path', { d: 'M-52,-172 L52,-172 L60,-40 L-60,-40Z', fill: lowerF }, body); el('rect', { x: -54, y: -178, width: 108, height: 14, rx: 5, fill: tch ? '#1B2647' : '#4B2A66' }, body); }
  } else {
    el('path', { d: 'M-95,-10 Q-98,-52 -52,-58 L52,-58 Q98,-52 95,-10 Q0,8 -95,-10Z', fill: dad ? '#3A3F55' : lowerF }, body);
    el('ellipse', { cx: -70, cy: -8, rx: 36, ry: 14, fill: dad ? '#3A3F55' : lowerF }, legL); el('ellipse', { cx: 70, cy: -8, rx: 36, ry: 14, fill: dad ? '#3A3F55' : lowerF }, legR);
    el('ellipse', { cx: -96, cy: -6, rx: 16, ry: 10, fill: limb }, legL); el('ellipse', { cx: 96, cy: -6, rx: 16, ry: 10, fill: limb }, legR);
  }
  const oy = sit ? 118 : 0; const up = G(body, { id: id + '_up', transform: `translate(0,${oy})` });
  const armL = G(up, { id: id + '_armL' }), armR = G(up, { id: id + '_armR' });
  [[armL, -1], [armR, 1]].forEach(([a, sx]) => { el('rect', { x: sx < 0 ? -80 : 50, y: -318, width: 30, height: 140, rx: 15, fill: limb }, a); el('rect', { x: sx < 0 ? -80 : 50, y: -320, width: 30, height: dad ? 80 : 60, rx: 13, fill: shirt }, a); el('circle', { cx: sx * 65, cy: -176, r: 16, fill: skin }, a); });
  el('rect', { x: -56, y: -330, width: 112, height: 176, rx: 30, fill: shirt }, up);
  if (dad) { el('path', { d: 'M-22,-330 L0,-296 L22,-330', fill: 'none', stroke: shirtD, 'stroke-width': 7, 'stroke-linejoin': 'round' }, up); el('rect', { x: -58, y: -176, width: 116, height: 20, rx: 7, fill: 'url(#pPakaW)' }, up); }
  else if (tch) { el('path', { d: 'M-30,-330 L0,-300 L30,-330', fill: 'none', stroke: shirtD, 'stroke-width': 7, 'stroke-linejoin': 'round' }, up); el('path', { d: 'M-12,-306 l12,14 l12,-14 l-12,-8Z', fill: '#2E6FB8' }, up); [-270, -234, -198].forEach(y => el('circle', { cx: 0, cy: y, r: 5, fill: '#C9D6E6' }, up)); }
  else { el('path', { d: 'M-30,-330 Q0,-300 30,-330', fill: 'none', stroke: shirtD, 'stroke-width': 7 }, up); [-286, -250, -214].forEach(y => el('circle', { cx: 0, cy: y, r: 5, fill: yai ? '#E8DDF5' : '#FCE3EC' }, up)); }
  const H = G(up, { id: id + '_head' }); const hy = -392, r = 56;
  if (!dad) { el('circle', { cx: 0, cy: hy - 62, r: 34, fill: hairC }, H); if (!yai) el('rect', { x: -40, y: hy - 70, width: 80, height: 10, rx: 5, fill: tch ? '#2E6FB8' : '#E8B64A' }, H); }
  face(H, id, 0, hy, r, skin, { mustache: dad, brow: '#1E140E' });
  if (dad) { el('path', { d: `M-58,${hy - 12} Q-56,${hy - 72} 0,${hy - 74} Q56,${hy - 72} 58,${hy - 12} Q40,${hy - 44} 0,${hy - 46} Q-40,${hy - 44} -58,${hy - 12}Z`, fill: '#1E140E' }, H);
    el('path', { d: `M-60,${hy - 34} Q0,${hy - 60} 60,${hy - 34} L60,${hy - 18} Q0,${hy - 44} -60,${hy - 18}Z`, fill: 'url(#pPakaW)' }, H); el('path', { d: `M56,${hy - 30} l26,18 l-6,16 l-24,-16Z`, fill: 'url(#pPakaW)' }, H); }
  else { el('path', { d: `M-58,${hy + 6} Q-62,${hy - 70} 0,${hy - 70} Q62,${hy - 70} 58,${hy + 6} Q52,${hy - 36} 18,${hy - 44} Q0,${hy - 30} -20,${hy - 44} Q-52,${hy - 36} -58,${hy + 6}Z`, fill: hairC }, H);
    el('circle', { cx: -52, cy: hy + 18, r: 5, fill: '#F2C14E' }, H); el('circle', { cx: 52, cy: hy + 18, r: 5, fill: '#F2C14E' }, H); if (!tch && !yai) el('circle', { cx: 30, cy: hy - 52, r: 9, fill: '#FF8FB0' }, H);
    if (tch || yai) { const gl = G(H); [-21, 21].forEach(x => el('circle', { cx: x, cy: hy - 1, r: 17, fill: 'none', stroke: tch ? '#3B2A20' : '#8E6B3A', 'stroke-width': 4 }, gl)); el('path', { d: `M-4,${hy - 3} q4,-4 8,0`, fill: 'none', stroke: tch ? '#3B2A20' : '#8E6B3A', 'stroke-width': 4 }, gl); }
    if (yai) el('path', { d: `M-40,${hy + 30} q6,6 12,0 M28,${hy + 30} q6,6 12,0`, fill: 'none', stroke: '#C08A5E', 'stroke-width': 3 }, H); }
  gsap.set(`#${id}_legL`, { svgOrigin: sit ? '-70 -8' : (dad ? '-24 -160' : '-19 -60') }); gsap.set(`#${id}_legR`, { svgOrigin: sit ? '70 -8' : (dad ? '24 -160' : '19 -60') });
  gsap.set(`#${id}_armL`, { svgOrigin: '-65 -306' }); gsap.set(`#${id}_armR`, { svgOrigin: '65 -306' });
  gsap.set([`#${id}_eyes`, `#${id}_eyesC`, `#${id}_eyesH`], { svgOrigin: `0 ${hy}` }); gsap.set(`#${id}_head`, { svgOrigin: `0 ${hy + 60}` }); gsap.set(`#${id}_body`, { svgOrigin: '0 0' });
  return A;
}
/* buffalo facing right, origin feet */
function buffalo(p, id) { const B = G(p, { id }); el('ellipse', { cx: 0, cy: 0, rx: 190, ry: 20, fill: '#000', opacity: .15 }, B); const body = G(B, { id: id + '_body' });
  const tail = G(body, { id: id + '_tail' }); el('path', { d: 'M-160,-150 Q-205,-120 -196,-62', fill: 'none', stroke: '#56626F', 'stroke-width': 9, 'stroke-linecap': 'round' }, tail); el('ellipse', { cx: -196, cy: -56, rx: 10, ry: 16, fill: '#3E4852' }, tail);
  [[-118, 'a'], [-78, 'b'], [72, 'c'], [112, 'd']].forEach(([x, k]) => { const g = G(body, { id: id + '_leg' + k }); el('rect', { x: x - 14, y: -80, width: 28, height: 78, rx: 10, fill: k == 'b' || k == 'd' ? '#4F5A66' : '#5B6775' }, g); el('rect', { x: x - 15, y: -14, width: 30, height: 14, rx: 5, fill: '#2F363D' }, g); gsap.set(g, { svgOrigin: `${x} -80` }); });
  el('ellipse', { cx: 0, cy: -128, rx: 172, ry: 86, fill: '#6D7A8C' }, body); el('ellipse', { cx: 10, cy: -98, rx: 120, ry: 42, fill: '#8592A3' }, body);
  const H = G(body, { id: id + '_head' });
  el('ellipse', { cx: 190, cy: -185, rx: 72, ry: 60, fill: '#768498' }, H);
  el('ellipse', { cx: 125, cy: -218, rx: 30, ry: 14, fill: '#5E6B7C', transform: 'rotate(-25 125 -218)' }, H); el('ellipse', { cx: 252, cy: -222, rx: 28, ry: 13, fill: '#5E6B7C', transform: 'rotate(25 252 -222)' }, H);
  el('path', { d: 'M150,-228 Q70,-262 92,-196 Q98,-238 160,-214Z', fill: '#F1E7D3' }, H); el('path', { d: 'M228,-228 Q308,-262 286,-196 Q280,-238 218,-214Z', fill: '#F1E7D3' }, H);
  el('ellipse', { cx: 200, cy: -150, rx: 48, ry: 32, fill: '#E9ABA6' }, H); el('ellipse', { cx: 184, cy: -150, rx: 7, ry: 9, fill: '#8E4D4A' }, H); el('ellipse', { cx: 216, cy: -150, rx: 7, ry: 9, fill: '#8E4D4A' }, H);
  const eyes = G(H, { id: id + '_eyes' }); [[166], [214]].forEach(([x]) => { el('ellipse', { cx: x, cy: -196, rx: 9, ry: 12, fill: '#1D1410' }, eyes); el('circle', { cx: x + 3, cy: -200, r: 3.5, fill: '#fff' }, eyes); });
  el('path', { d: 'M172,-122 Q190,-100 212,-122', fill: 'none', stroke: '#A0B0C0', 'stroke-width': 6 }, H); el('circle', { cx: 192, cy: -104, r: 14, fill: '#F2C14E', stroke: '#B98A1E', 'stroke-width': 4 }, H);
  gsap.set(tail, { svgOrigin: '-160 -150' }); gsap.set(H, { svgOrigin: '150 -150' }); gsap.set(eyes, { svgOrigin: '190 -196' }); gsap.set(body, { svgOrigin: '0 0' });
  return B; }
/* dog (ด่าง) facing right, origin feet */
function dog(p, id) { const D = G(p, { id }); el('ellipse', { cx: 5, cy: 0, rx: 75, ry: 11, fill: '#000', opacity: .14 }, D); const body = G(D, { id: id + '_body' });
  const tail = G(body, { id: id + '_tail' }); el('path', { d: 'M-62,-78 Q-96,-110 -84,-138', fill: 'none', stroke: '#F4EEE4', 'stroke-width': 13, 'stroke-linecap': 'round' }, tail);
  [[-44, 'a'], [-24, 'b'], [30, 'c'], [50, 'd']].forEach(([x, k]) => { const g = G(body, { id: id + '_leg' + k }); el('rect', { x: x - 8, y: -50, width: 16, height: 50, rx: 7, fill: k == 'b' || k == 'd' ? '#E3DBCF' : '#F4EEE4' }, g); gsap.set(g, { svgOrigin: `${x} -50` }); });
  el('ellipse', { cx: 0, cy: -70, rx: 70, ry: 34, fill: '#F4EEE4' }, body); el('ellipse', { cx: -20, cy: -82, rx: 26, ry: 18, fill: '#A0643A' }, body); el('ellipse', { cx: 28, cy: -60, rx: 14, ry: 10, fill: '#A0643A' }, body);
  const H = G(body, { id: id + '_head' }); el('circle', { cx: 70, cy: -112, r: 38, fill: '#F4EEE4' }, H); el('ellipse', { cx: 100, cy: -100, rx: 24, ry: 17, fill: '#FBF7F0' }, H); el('ellipse', { cx: 120, cy: -106, rx: 9, ry: 7, fill: '#2A1E18' }, H);
  el('ellipse', { cx: 52, cy: -128, rx: 22, ry: 14, fill: '#A0643A' }, H); const ear = G(H, { id: id + '_ear' }); el('path', { d: 'M52,-142 Q30,-150 34,-110 Q46,-118 60,-136Z', fill: '#A0643A' }, ear); gsap.set(ear, { svgOrigin: '55 -140' });
  const eyes = G(H, { id: id + '_eyes' }); el('ellipse', { cx: 82, cy: -122, rx: 6, ry: 8, fill: '#1D1410' }, eyes); el('circle', { cx: 84, cy: -125, r: 2.2, fill: '#fff' }, eyes); gsap.set(eyes, { svgOrigin: '82 -122' });
  el('path', { d: 'M100,-88 Q108,-80 116,-90', fill: 'none', stroke: '#6B3A2A', 'stroke-width': 3 }, H);
  const tg = G(H, { id: id + '_tongue', opacity: 0 }); el('ellipse', { cx: 108, cy: -80, rx: 7, ry: 10, fill: '#F07A8A' }, tg);
  el('rect', { x: 36, y: -96, width: 44, height: 9, rx: 4, fill: '#D9453B' }, body);
  gsap.set(tail, { svgOrigin: '-62 -78' }); gsap.set(H, { svgOrigin: '60 -90' }); gsap.set(body, { svgOrigin: '0 0' }); return D; }
function hen(p, id, col = '#C8642C', col2 = '#A94E1E') { const g = G(p, { id }); const b = G(g, { id: id + '_body' });
  el('path', { d: 'M-40,-40 Q-70,-80 -46,-96 Q-40,-70 -28,-62Z', fill: col2 }, b); el('ellipse', { cx: 0, cy: -44, rx: 44, ry: 34, fill: col }, b); el('path', { d: 'M-18,-50 Q0,-30 22,-46 Q4,-60 -18,-50Z', fill: col2 }, b);
  el('rect', { x: -12, y: -14, width: 5, height: 14, fill: '#E8A23A' }, b); el('rect', { x: 6, y: -14, width: 5, height: 14, fill: '#E8A23A' }, b);
  const H = G(b, { id: id + '_head' }); el('circle', { cx: 34, cy: -78, r: 20, fill: col }, H); el('path', { d: 'M24,-96 q6,-14 12,-2 q6,-12 12,2 q2,6 -4,6Z', fill: '#E53935' }, H); el('path', { d: 'M52,-80 l14,4 l-14,5Z', fill: '#F2B632' }, H); el('ellipse', { cx: 48, cy: -66, rx: 5, ry: 7, fill: '#E53935' }, H); el('circle', { cx: 40, cy: -82, r: 3.5, fill: '#1D1410' }, H);
  gsap.set(H, { svgOrigin: '30 -60' }); gsap.set(b, { svgOrigin: '0 0' }); return g; }
function rooster(p, id) { const g = G(p, { id }); const b = G(g, { id: id + '_body' });
  [['#2E7D5B', -30], ['#1B5E40', -10], ['#C62828', 10]].forEach(([c, r]) => el('path', { d: 'M-40,-60 Q-90,-120 -60,-150 Q-50,-100 -24,-70Z', fill: c, transform: `rotate(${r} -40 -60)` }, b));
  el('ellipse', { cx: 0, cy: -60, rx: 46, ry: 38, fill: '#D35400' }, b); el('path', { d: 'M-14,-66 Q6,-40 30,-60 Q10,-78 -14,-66Z', fill: '#A04000' }, b);
  el('rect', { x: -12, y: -26, width: 6, height: 26, fill: '#E8A23A' }, b); el('rect', { x: 6, y: -26, width: 6, height: 26, fill: '#E8A23A' }, b);
  const H = G(b, { id: id + '_head' }); el('path', { d: 'M20,-80 Q30,-110 44,-108 L50,-84Z', fill: '#E67E22' }, H); el('circle', { cx: 40, cy: -108, r: 20, fill: '#E67E22' }, H);
  el('path', { d: 'M26,-126 q4,-18 12,-4 q6,-16 12,0 q6,-12 10,4 q0,8 -8,8Z', fill: '#E53935' }, H); el('path', { d: 'M58,-110 l16,5 l-16,6Z', fill: '#F2B632' }, H); el('ellipse', { cx: 54, cy: -94, rx: 6, ry: 9, fill: '#E53935' }, H); el('circle', { cx: 46, cy: -112, r: 4, fill: '#1D1410' }, H);
  const beak = G(H, { id: id + '_beak', opacity: 0 }); el('path', { d: 'M58,-104 l18,10 l-18,-2Z', fill: '#F2B632' }, beak);
  gsap.set(H, { svgOrigin: '30 -80' }); gsap.set(b, { svgOrigin: '0 0' }); return g; }
function chick(p, id) { const g = G(p, { id }); const b = G(g, { id: id + '_body' }); el('ellipse', { cx: 0, cy: -22, rx: 24, ry: 21, fill: '#FFD84D' }, b); el('circle', { cx: 14, cy: -40, r: 15, fill: '#FFE070' }, b);
  el('path', { d: 'M27,-42 l10,3 l-10,4Z', fill: '#F29A2E' }, b); el('circle', { cx: 18, cy: -44, r: 2.8, fill: '#1D1410' }, b); el('path', { d: 'M-10,-24 q10,10 18,0', fill: 'none', stroke: '#F2C230', 'stroke-width': 4 }, b);
  el('rect', { x: -6, y: -4, width: 3, height: 5, fill: '#F29A2E' }, b); el('rect', { x: 4, y: -4, width: 3, height: 5, fill: '#F29A2E' }, b); gsap.set(b, { svgOrigin: '0 0' }); return g; }
function duck(p, id) { const g = G(p, { id }); const b = G(g, { id: id + '_body' }); el('path', { d: 'M-48,-22 Q-60,-50 -40,-44 Q-10,-58 30,-40 Q48,-20 20,-6 L-30,-6 Q-50,-10 -48,-22Z', fill: '#FAFAF5' }, b);
  el('path', { d: 'M-24,-30 Q0,-16 16,-30', fill: 'none', stroke: '#DADAD2', 'stroke-width': 4 }, b); const H = G(b, { id: id + '_head' }); el('circle', { cx: 30, cy: -58, r: 18, fill: '#FAFAF5' }, H); el('path', { d: 'M44,-58 q18,0 20,6 q-10,4 -22,2Z', fill: '#F29A2E' }, H); el('circle', { cx: 34, cy: -62, r: 3, fill: '#1D1410' }, H);
  gsap.set(H, { svgOrigin: '26 -44' }); gsap.set(b, { svgOrigin: '0 0' }); return g; }
function fish(p, id, col = '#F29A2E') { const g = G(p, { id }); el('path', { d: 'M-30,0 Q0,-20 30,0 Q0,20 -30,0Z', fill: col }, g); el('path', { d: 'M-28,0 l-18,-12 l0,24Z', fill: col }, g); el('circle', { cx: 16, cy: -3, r: 3, fill: '#1D1410' }, g); el('path', { d: 'M-4,-12 q6,12 0,24', fill: 'none', stroke: '#fff', 'stroke-width': 2, opacity: .5 }, g); return g; }
function butterfly(p, id, c1, c2) { const g = G(p, { id }); const wl = G(g, { id: id + '_w' }); el('path', { d: 'M0,0 C-30,-40 -60,-20 -46,4 C-60,24 -30,34 0,6Z', fill: c1, stroke: c2, 'stroke-width': 3 }, wl); el('path', { d: 'M0,0 C30,-40 60,-20 46,4 C60,24 30,34 0,6Z', fill: c1, stroke: c2, 'stroke-width': 3 }, wl);
  el('circle', { cx: -26, cy: -10, r: 6, fill: c2, opacity: .7 }, wl); el('circle', { cx: 26, cy: -10, r: 6, fill: c2, opacity: .7 }, wl); el('ellipse', { cx: 0, cy: 4, rx: 4, ry: 16, fill: '#3B2A20' }, g); el('path', { d: 'M-2,-10 q-8,-14 -14,-16 M2,-10 q8,-14 14,-16', fill: 'none', stroke: '#3B2A20', 'stroke-width': 2 }, g); gsap.set(wl, { svgOrigin: '0 0' }); return g; }
function dragonfly(p, id) { const g = G(p, { id }); el('rect', { x: -40, y: -3, width: 60, height: 6, rx: 3, fill: '#2E86C1' }, g); el('circle', { cx: 24, cy: 0, r: 7, fill: '#1B4F72' }, g); const w = G(g, { id: id + '_w' }); [[-6, -16], [-6, 16], [6, -14], [6, 14]].forEach(([x, y]) => el('ellipse', { cx: x, cy: y, rx: 8, ry: 18, fill: '#D6EAF8', opacity: .7, transform: `rotate(${y > 0 ? 20 : -20} ${x} ${y})` }, w)); gsap.set(w, { svgOrigin: '0 0' }); return g; }
function bird(p, cls) { const g = G(p, { class: cls }); el('path', { class: cls + 'W', d: 'M-26,0 Q-13,-16 0,0 Q13,-16 26,0', fill: 'none', stroke: '#3B3B4F', 'stroke-width': 6, 'stroke-linecap': 'round' }, g); return g; }
function kite(p, id) { const g = G(p, { id }); el('path', { d: 'M0,-80 L60,0 L0,90 L-60,0Z', fill: '#E53935' }, g); el('path', { d: 'M0,-80 L0,90 M-60,0 L60,0', stroke: '#8E1B1B', 'stroke-width': 4 }, g); el('path', { d: 'M0,-80 L60,0 L0,0Z', fill: '#FF6F61' }, g);
  const tail = G(g, { id: id + '_tail' }); el('path', { d: 'M0,90 q20,40 0,80 q-20,40 0,80', fill: 'none', stroke: '#8E1B1B', 'stroke-width': 3 }, tail); [130, 170, 210, 250].forEach((y, i) => el('path', { d: `M0,${y} l-14,-8 l0,16Z M0,${y} l14,-8 l0,16Z`, fill: i % 2 ? '#FFD84D' : '#4FC3F7' }, tail)); gsap.set(tail, { svgOrigin: '0 90' }); return g; }
function sparkleBurst(p, cls, cx, cy, n = 10, r = 120) { for (let i = 0; i < n; i++) { const a = i / n * 6.28; const w = G(p, { transform: `translate(${cx + Math.cos(a) * r},${cy + Math.sin(a) * r * .8})` }); el('path', { class: cls, d: 'M0,-18 L5,-5 L18,0 L5,5 L0,18 L-5,5 L-18,0 L-5,-5Z', fill: '#FFF3A6', opacity: 0 }, w); } }
function zzz(p, cls, x, y) { ['Z', 'z', 'z'].forEach((c, i) => { const t = el('text', { class: cls, x: x + i * 26, y: y - i * 34, 'font-family': 'K', 'font-weight': 700, 'font-size': 44 - i * 8, fill: '#fff', opacity: 0 }, p); t.textContent = c; }); }
