/* scenes: work, lunch, fish, kite, sunset, dinner, bed, end */
function paddyBack(W, skyGrad = 'gNoon') {
  sky(W, null, skyGrad); const cl = G(W); cloud(cl, 250, 150, .9); cloud(cl, 1300, 110, 1.1);
  mountains(W, '#9CC4D2', '#86B89C', -60); palm(W, 150, 600, 260, .8); palm(W, 330, 605, 200, .7); tree(W, 1650, 610, .7); palm(W, 1820, 600, 280, .8); stiltHouse(W, 1450, 606, .5);
  el('rect', { y: 580, width: 1920, height: 40, fill: '#6FAF4B' }, W); grassTufts(W, 600, 40, '#5FA442', '#6FAF4B', 22);
  el('rect', { y: 615, width: 1920, height: 465, fill: 'url(#gWater)' }, W); el('rect', { y: 615, width: 1920, height: 465, fill: '#7A5B3C', opacity: .1 }, W);
  const sh = G(W); seed(3); for (let i = 0; i < 18; i++) el('path', { d: `M${R(0, 1900)},${R(650, 1050)} q30,-8 60,0`, fill: 'none', stroke: '#fff', 'stroke-width': 3, opacity: .3 }, sh);
  return cl;
}
function ripple(p, cls, x, y, n = 3) { for (let i = 0; i < n; i++) el('ellipse', { class: cls, cx: x, cy: y, rx: 30, ry: 8, fill: 'none', stroke: '#fff', 'stroke-width': 4, opacity: 0 }, p); }
function rippleAt(t, cls) { tl.fromTo('.' + cls, { opacity: .9, scale: .4, transformOrigin: '50% 50%' }, { opacity: 0, scale: 3, duration: 1.2, stagger: .25, ease: 'power1.out', immediateRender: false }, t); }

/* ---------- WORK ---------- */
SC.work = c => {
  const W = G(c.root, { id: 'wkW' }); const cl = paddyBack(W); T(c.t0, cl, { x: 100, duration: c.s.dur, ease: 'none' });
  const rows = G(W); const ROWS = [690, 740, 800, 870]; const seeds = [];
  ROWS.forEach((y, r) => { const s = .35 + r * .12; for (let x = 120 + r * 20; x < 1850; x += 110 - r * 5) { const g = seedling(rows, x, y, s); gsap.set(g, { opacity: 0 }); seeds.push({ g, r, x }); } });
  const dad = adult(W, 'wkF', 'dad', { shadow: false }); place(dad, 1300, 1080, 1.0);
  const bundle = G($('wkF_armL')); el('path', { d: 'M-70,-176 l-10,-60 M-64,-176 l0,-66 M-58,-176 l10,-58', stroke: '#5CBF5A', 'stroke-width': 7, 'stroke-linecap': 'round' }, bundle); el('rect', { x: -78, y: -186, width: 26, height: 12, rx: 4, fill: '#C8994F' }, bundle);
  const b = boy(W, 'wkB', { shadow: false }); place(b, 700, 1075, 1.1);
  const bb = G($('wkB_armL')); el('path', { d: 'M-50,-106 l-8,-40 M-46,-106 l0,-44 M-42,-106 l8,-38', stroke: '#5CBF5A', 'stroke-width': 6, 'stroke-linecap': 'round' }, bb);
  const front = G(W); el('rect', { y: 930, width: 1920, height: 150, fill: '#5E9EA3', opacity: .82 }, front); for (let i = 0; i < 10; i++) el('path', { class: 'wkWl', d: `M${i * 210 - 40},${960 + (i % 3) * 35} q40,-10 80,0 t80,0`, fill: 'none', stroke: '#fff', 'stroke-width': 4, opacity: .35 }, front);
  const rp = G(W); ripple(rp, 'wkRd', 1255, 915); ripple(rp, 'wkRb', 660, 915);
  const p1 = seedling(W, 1255, 925, .5, 'wkP1'); gsap.set(p1, { opacity: 0 }); const p2 = seedling(W, 660, 925, .45, 'wkP2'); gsap.set(p2, { opacity: 0 });
  const drop = el('path', { id: 'wkSweat', d: 'M0,0 q10,16 0,24 q-10,-8 0,-24Z', fill: '#8FD3FF', opacity: 0 }, W);
  const nums = [0, 1, 2].map(i => domEl(c.dom, 'num', String(i + 1), `left:${80 + i * 120}px;top:430px`));
  const demo = c.at('demo'), tryT = c.at('try'), mont = c.at('montage'), rowsT = c.at('rows');
  tl.fromTo('.wkWl', { x: -30 }, { x: 30, duration: 2.4, repeat: Math.floor(c.s.dur / 2.4), yoyo: true, stagger: .2, immediateRender: false }, c.t0);
  T(demo + .3, '#wkF_up', { rotation: -8, svgOrigin: '0 -160', duration: .5 }); T(demo + .3, '#wkF_armR', { rotation: 18, duration: .5 }); S(demo + .9, p1, { opacity: 1 }); O(demo + .9, p1, { scale: .1 }, { scale: .5, duration: .4, ease: 'back.out(2)' }); rippleAt(demo + .9, 'wkRd');
  T(demo + 1.6, '#wkF_up', { rotation: 0, duration: .5 }); T(demo + 1.6, '#wkF_armR', { rotation: 0, duration: .5 });
  T(tryT - .4, '#wkB_armR', { rotation: 30, duration: .5 }); S(tryT + .2, p2, { opacity: 1 }); O(tryT + .2, p2, { scale: .1 }, { scale: .45, duration: .4, ease: 'back.out(2)' }); rippleAt(tryT + .2, 'wkRb'); T(c.Le(c.s.lines.findIndex(l => l.text.startsWith('แบบนี้'))) + .2, '#wkB_armR', { rotation: 0, duration: .4 });
  S(c.L(c.s.lines.findIndex(l => l.text.startsWith('ใช่แล้ว'))), '#wkB_eyes', { opacity: 0 }); S(c.L(c.s.lines.findIndex(l => l.text.startsWith('ใช่แล้ว'))), '#wkB_eyesH', { opacity: 1 }); S(mont, '#wkB_eyesH', { opacity: 0 }); S(mont, '#wkB_eyes', { opacity: 1 });
  const span = rowsT - mont - .5; seeds.sort((a, b2) => a.r - b2.r || a.x - b2.x);
  seeds.forEach((s, i) => { const t = mont + (i / seeds.length) * span; S(t, s.g, { opacity: 1 }); O(t, s.g, { scaleY: .1 }, { scaleY: .35 + s.r * .12, duration: .3, ease: 'back.out(2)' }); });
  for (let t = mont; t < rowsT - .6; t += 1.1) { T(t, '#wkB_armR', { rotation: 30, duration: .35 }); T(t + .45, '#wkB_armR', { rotation: 0, duration: .35 }); T(t + .5, '#wkF_armR', { rotation: 18, duration: .35 }); T(t + .95, '#wkF_armR', { rotation: 0, duration: .3 }); }
  const hot = c.L(c.s.lines.findIndex(l => l.text.startsWith('แดดร้อน'))); gsap.set(drop, { x: 760, y: 700 }); O(hot, drop, { opacity: 1, y: 700 }, { y: 760, opacity: 0, duration: 1.2, ease: 'power1.in', repeat: 1, repeatDelay: .3 });
  const rd = c.line(c.s.lines.findIndex(l => l.text.startsWith('หนึ่งแถว'))).d; nums.forEach((n, i) => popIn(rowsT + i * rd / 3, n, .35)); nums.forEach(n => T(c.t1 - .8, n, { opacity: 0, duration: .4 }));
  const fin = c.L(c.s.lines.findIndex(l => l.text.startsWith('เสร็จแล้ว'))); S(fin, '#wkB_eyes', { opacity: 0 }); S(fin, '#wkB_eyesH', { opacity: 1 }); T(fin, '#wkB_armR', { rotation: -150, duration: .3 }); O(fin + .3, '#wkB_armR', { rotation: -150 }, { rotation: -120, duration: .22, repeat: 5, yoyo: true }); T(fin + 1.7, '#wkB_armR', { rotation: 0, duration: .4 });
  const th = c.L(c.s.lines.length - 1); S(th, '#wkF_eyes', { opacity: 0 }); S(th, '#wkF_eyesH', { opacity: 1 });
  cam(W, c.t0, c.s.dur, 1.0, 1.1, 980, 860);
  return { speakers: { B: 'wkB', F: 'wkF' }, blink: ['wkB', 'wkF'] };
};

/* ---------- LUNCH ---------- */
function pinto(p, id, x, y, s = 1) { const g = G(p, { id }); place(g, x, y, s); [0, 1, 2].forEach(i => { el('rect', { x: -40, y: -34 - i * 36, width: 80, height: 34, rx: 8, fill: ['#C0392B', '#2E86C1', '#27AE60'][i] }, g); el('rect', { x: -40, y: -38 - i * 36, width: 80, height: 6, rx: 3, fill: '#D5DBDB' }, g); }); el('path', { d: 'M-34,-112 Q0,-160 34,-112', fill: 'none', stroke: '#D5DBDB', 'stroke-width': 7 }, g); return g; }
SC.lunch = c => {
  const W = G(c.root, { id: 'luW' }); sky(W, null, 'gNoon'); sun(W, null, 960, 120); const cl = G(W); cloud(cl, 200, 170, .8); cloud(cl, 1400, 130, 1);
  mountains(W, '#9CC4D2', '#86B89C', -40); field(W, '#8BCF5E', '#5FAF45', null, 680);
  const bu = buffalo(W, 'luU'); place(bu, 1560, 760, .55, true);
  const canopy = G(W, { id: 'luTree' }); el('path', { d: 'M1640,980 Q1650,700 1620,520 L1700,520 Q1680,700 1720,980Z', fill: '#6B4A2E' }, canopy); [[1560, 400, 170], [1760, 380, 160], [1660, 300, 170], [1480, 480, 120], [1840, 480, 120]].forEach(([x, y, r], i) => el('circle', { cx: x, cy: y, r, fill: i % 2 ? '#3F8F3F' : '#4FA048' }, canopy));
  const hut = G(W); [760, 1160, 740, 1180].forEach((x, i) => el('rect', { x: x - 10, y: i < 2 ? 840 : 480, width: 20, height: i < 2 ? 160 : 360, fill: '#6B4A2E' }, hut));
  el('rect', { x: 690, y: 830, width: 540, height: 26, rx: 6, fill: '#8B5E34' }, hut); el('path', { d: 'M620,500 L960,330 L1300,500 L1260,520 L960,380 L660,520Z', fill: '#C9A45C' }, hut); for (let i = 0; i < 16; i++) el('path', { d: `M${640 + i * 42},${510 - Math.max(0, 8 - Math.abs(i - 7.5)) * 0} L960,340`, stroke: '#A8843F', 'stroke-width': 3, opacity: .6 }, hut);
  const standM = adult(W, 'luMs', 'mom'); place(standM, -200, 1020, .85); const pt0 = pinto($('luMs_armR'), 'luPin0', 65, -150, .9);
  const seat = G(W, { id: 'luSeat', opacity: 0 });
  const mom = adult(seat, 'luM', 'mom', { pose: 'sit' }); place(mom, 800, 850, .62); const b = boy(seat, 'luB', { pose: 'sit' }); place(b, 960, 838, .72); const dad = adult(seat, 'luF', 'dad', { pose: 'sit' }); place(dad, 1120, 850, .62);
  pinto(seat, 'luPin', 960, 858, .7); el('ellipse', { cx: 880, cy: 852, rx: 36, ry: 9, fill: '#EDE8DC' }, seat); el('ellipse', { cx: 1040, cy: 852, rx: 36, ry: 9, fill: '#EDE8DC' }, seat);
  const dg = dog(W, 'luD'); place(dg, 1420, 1000, .8); S(c.t0, '#luD_eyes', { opacity: 0 });
  const zz = G(W); zzz(zz, 'luZ', 1500, 880);
  const breeze = G(W); for (let i = 0; i < 4; i++) el('path', { class: 'luBr', d: `M0,${300 + i * 90} q60,-30 120,0 t120,0`, fill: 'none', stroke: '#fff', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0 }, breeze);
  const sit = c.at('sit');
  walkCycle('luMs', c.t0 + .2, c.L(1) - .1, .3); T(c.t0 + .2, standM, { x: 640, duration: c.L(1) - .3 - c.t0, ease: 'none' });
  T(sit - .4, standM, { opacity: 0, duration: .4 }); T(sit - .4, seat, { opacity: 1, duration: .5 });
  loop(c.t0, c.t1, canopy, { rotation: -.6, svgOrigin: '1680 980' }, { rotation: .6 }, 2.2); loop(c.t0, c.t1, '#luU_head', { rotation: 0 }, { rotation: 14 }, 1.4);
  tl.fromTo('.luZ', { opacity: 0, y: 0 }, { opacity: 1, y: -50, duration: 1.2, stagger: .35, repeat: Math.floor(c.s.dur / 1.8), repeatDelay: .5, immediateRender: false }, c.t0 + .5);
  tl.fromTo('.luBr', { opacity: 0, x: -200 }, { opacity: .8, x: 2100, duration: 3.2, stagger: .5, ease: 'none', immediateRender: false }, c.L(2));
  eatLoop('luB', sit + .5, c.L(3) - .2, 132, 1.2); eatLoop('luF', sit + .9, c.L(4) - .2, 140, 1.5); eatLoop('luM', sit + 1.3, c.L(5) - .2, 140, 1.4);
  S(c.L(3), '#luB_eyes', { opacity: 0 }); S(c.L(3), '#luB_eyesH', { opacity: 1 }); S(c.Le(3) + .4, '#luB_eyesH', { opacity: 0 }); S(c.Le(3) + .4, '#luB_eyes', { opacity: 1 });
  cam(W, c.t0, sit - c.t0, 1.0, 1.0, 960, 540); cam(W, sit - .4, c.t1 - sit + .4, 1.0, 1.35, 960, 760);
  return { speakers: ln => ln.who === 'M' ? (c.t0 + ln.t < sit ? 'luMs' : 'luM') : ln.who === 'B' ? 'luB' : ln.who === 'F' ? 'luF' : null, blink: ['luB', 'luF', 'luM', 'luMs'] };
};

/* ---------- FISH ---------- */
SC.fish = c => {
  const W = G(c.root, { id: 'fiW' }); sky(W, null, 'gNoon'); cloud(W, 400, 150, .8); cloud(W, 1300, 110, 1);
  mountains(W, '#9CC4D2', '#86B89C', -120); palm(W, 250, 560, 240, .8); palm(W, 1500, 560, 280, .85); tree(W, 1100, 570, .6); el('rect', { y: 540, width: 1920, height: 60, fill: '#6FAF4B' }, W); grassTufts(W, 560, 36, '#5FA442', '#6FAF4B', 22);
  el('rect', { y: 590, width: 1920, height: 490, fill: 'url(#gCanal)' }, W);
  const sw = G(W); const FS = []; [['#F29A2E', 1150, 820], ['#E8E8E8', 1400, 900], ['#F2C14E', 1600, 780], ['#F29A2E', 1250, 980], ['#C0C8D0', 1700, 950]].forEach(([col, x, y], i) => { const f = fish(sw, 'fiF' + i, col); place(f, x, y, 1.2, i % 2 === 0); gsap.set(f, { opacity: .85 }); FS.push(f); });
  const sh = G(W); for (let i = 0; i < 16; i++) el('path', { class: 'fiSh', d: `M${i * 130},${650 + (i % 5) * 80} q40,-10 80,0`, fill: 'none', stroke: '#fff', 'stroke-width': 4, opacity: .35 }, sh);
  const bank = G(W); el('path', { d: 'M0,860 Q500,830 980,900 Q1000,960 980,1080 L0,1080Z', fill: '#7FBF5A' }, bank); el('path', { d: 'M0,900 Q480,880 960,940 L980,1080 L0,1080Z', fill: '#9C7B55' }, bank); grassTufts(bank, 880, 16, '#5FA442', '#6FAF4B', 40, 0, 950);
  const dad = adult(W, 'fiF', 'dad'); place(dad, 330, 1010, .95);
  const b = boy(W, 'fiB'); place(b, 740, 1010, 1.1);
  const net = G(W, { id: 'fiNet' }); el('line', { x1: 0, y1: 0, x2: 330, y2: 0, stroke: '#B98A45', 'stroke-width': 10, 'stroke-linecap': 'round' }, net); el('ellipse', { cx: 390, cy: 0, rx: 62, ry: 24, fill: 'none', stroke: '#8B5E34', 'stroke-width': 7 }, net); el('path', { d: 'M330,0 Q390,110 452,0', fill: 'url(#pNet)', stroke: '#DDD', 'stroke-width': 2 }, net);
  const caught = G(net, { id: 'fiCaught', opacity: 0 }); [[372, 34], [408, 30]].forEach(([x, y], i) => { const f = fish(caught, 'fiC' + i, i ? '#F2C14E' : '#F29A2E'); place(f, x, y, .7, i === 1); });
  gsap.set(net, { svgOrigin: '0 0', x: 790, y: 880, rotation: -35 });
  const rp = G(W); ripple(rp, 'fiR', 1150, 760, 3);
  const drops = G(W); seed(77); for (let i = 0; i < 14; i++) { const w = G(drops, { transform: `translate(${1150 + R(-50, 50)},${740})` }); el('circle', { class: 'fiDrop', r: R(5, 10), fill: '#DDF4FF', opacity: 0 }, w); }
  const hs = G(W); for (let i = 0; i < 4; i++) { const w = G(hs, { transform: `translate(${820 + i * 40},${640})` }); el('path', { class: 'fiHeart', d: 'M0,0 C-20,-22 -44,4 0,34 C44,4 20,-22 0,0Z', fill: '#FF6B8A', opacity: 0 }, w); }
  const scoop = c.at('scoop'), rel = c.at('release');
  FS.forEach((f, i) => loop(c.t0, c.t1, f, { x: 1050 + i * 120 }, { x: 1350 + i * 110 }, 2.4 + i * .5));
  tl.fromTo('.fiSh', { x: -30 }, { x: 30, duration: 2.2, repeat: Math.floor(c.s.dur / 2.2), yoyo: true, stagger: .15, immediateRender: false }, c.t0);
  T(scoop - .3, net, { rotation: 12, duration: .5, ease: 'power2.in' }); rippleAt(scoop + .2, 'fiR');
  tl.fromTo('.fiDrop', { opacity: 1, x: 0, y: 0 }, { opacity: 0, x: () => R(-120, 120), y: () => R(-140, -30), duration: .8, ease: 'power2.out', stagger: .01, immediateRender: false }, scoop + .2);
  T(scoop + 1.2, net, { rotation: -28, duration: .9, ease: 'power2.out' }); S(scoop + 1.2, caught, { opacity: 1 }); loop(scoop + 2.1, rel + .6, caught, { rotation: -3, svgOrigin: '390 20' }, { rotation: 3 }, .15);
  S(c.L(2), '#fiB_eyes', { opacity: 0 }); S(c.L(2), '#fiB_eyesH', { opacity: 1 }); S(c.Le(2) + .3, '#fiB_eyesH', { opacity: 0 }); S(c.Le(2) + .3, '#fiB_eyes', { opacity: 1 });
  T(rel + .2, net, { rotation: 10, duration: .6 }); T(rel + .8, caught, { y: 120, opacity: 0, duration: .6, ease: 'power1.in' }); tl.fromTo('.fiDrop', { opacity: 1, x: 0, y: 0 }, { opacity: 0, x: () => R(-80, 80), y: () => R(-90, -20), duration: .7, ease: 'power2.out', stagger: .01, immediateRender: false }, rel + 1.3);
  T(rel + 1.6, net, { rotation: -35, duration: .6 });
  const kind = c.L(c.s.lines.length - 1); S(kind, '#fiB_eyes', { opacity: 0 }); S(kind, '#fiB_eyesH', { opacity: 1 });
  tl.fromTo('.fiHeart', { opacity: 0, y: 0, scale: .3 }, { opacity: 1, y: -80, scale: 1, duration: .7, stagger: .25, ease: 'back.out(2)', immediateRender: false }, kind + .3); tl.to('.fiHeart', { opacity: 0, y: -200, duration: 1, stagger: .25 }, kind + 1.2);
  cam(W, c.t0, c.s.dur, 1.0, 1.12, 900, 850);
  return { speakers: { B: 'fiB', F: 'fiF' }, blink: ['fiB', 'fiF'] };
};

/* ---------- KITE ---------- */
SC.kite = c => {
  const W = G(c.root, { id: 'kiW' }); sky(W, null, 'gNoon'); sun(W, null, 260, 140); const cl = G(W); [[300, 260, .9], [900, 160, 1.2], [1500, 290, .8], [2100, 200, 1]].forEach(([x, y, s]) => cloud(cl, x, y, s));
  mountains(W, '#9CC4D2', '#86B89C', 60); palm(W, 1650, 800, 260, .8); palm(W, 1780, 805, 200, .7); stiltHouse(W, 250, 800, .5);
  el('rect', { y: 790, width: 1920, height: 290, fill: '#8BCF5E' }, W); const gr = G(W, { id: 'kiGrass' }); grassTufts(gr, 1080, 30, '#5FA442', '#6FAF4B', 90); grassTufts(gr, 900, 40, '#79B85A', '#6AAE4E', 40);
  const dad = adult(W, 'kiF', 'dad'); place(dad, 330, 1010, .9);
  const b = boy(W, 'kiB'); place(b, 560, 1010, 1.05);
  const str = el('line', { id: 'kiStr', x1: 610, y1: 900, x2: 700, y2: 950, stroke: '#fff', 'stroke-width': 3, opacity: .9 }, W);
  const k = kite(W, 'kiK'); gsap.set(k, { svgOrigin: '0 0', x: 700, y: 950, scale: .5, rotation: 20 });
  const run = c.at('run'), up = c.at('up');
  T(c.t0, cl, { x: -500, duration: c.s.dur, ease: 'none' }); loop(c.t0, c.t1, gr, { skewX: 0 }, { skewX: -4 }, 1.2);
  const r1 = run + 3.0; walkCycle('kiB', run, r1, .17, 30); T(run, b, { x: 1250, duration: r1 - run, ease: 'power1.inOut' }); T(run, str, { attr: { x1: 1300 }, duration: r1 - run, ease: 'power1.inOut' });
  T(run + .3, k, { x: 1150, y: 600, scale: .75, rotation: 0, duration: 1.6, ease: 'power2.out' }); T(run + .3, str, { attr: { x2: 1150, y2: 600 }, duration: 1.6, ease: 'power2.out' });
  T(run + 1.9, k, { x: 1450, y: 260, scale: .9, duration: 2.6, ease: 'sine.out' }); T(run + 1.9, str, { attr: { x2: 1450, y2: 260 }, duration: 2.6, ease: 'sine.out' });
  loop(run + 4.5, c.t1, k, { rotation: -8, y: 260 }, { rotation: 8, y: 230 }, 1.1); loop(run + 4.5, c.t1, str, { attr: { y2: 260 } }, { attr: { y2: 230 } }, 1.1);
  loop(c.t0, c.t1, '#kiK_tail', { rotation: -12 }, { rotation: 12 }, .3);
  T(run, '#kiB_armR', { rotation: -120, duration: .3 });
  S(up, '#kiF_eyes', { opacity: 0 }); S(up, '#kiF_eyesH', { opacity: 1 }); T(up, ['#kiF_armL', '#kiF_armR'], { rotation: (i) => i ? -150 : 150, duration: .4 });
  const yay = c.L(c.Lt('ว่าวของผม')); S(yay, '#kiB_eyes', { opacity: 0 }); S(yay, '#kiB_eyesH', { opacity: 1 }); O(yay, b, { y: 1010 }, { y: 950, duration: .22, yoyo: true, repeat: 5, ease: 'power1.out' }); T(yay, '#kiB_armL', { rotation: 150, duration: .3 });
  cam(W, c.t0, c.s.dur, 1.0, 1.06, 1100, 700);
  return { speakers: { B: 'kiB', F: 'kiF' }, blink: ['kiB', 'kiF'] };
};

/* ---------- SUNSET ---------- */
SC.sunset = c => {
  const W = G(c.root, { id: 'suW' }); sky(W, null, 'gDusk'); const sn = sun(W, 'suSun', 1250, 520, 'gSunset', '#FFB25C');
  mountains(W, '#8E5B7A', '#6E4A6A'); const sil = G(W); palm(sil, 180, 720, 300, 1, '#3B2A3A', '#473244'); palm(sil, 330, 725, 230, .9, '#3B2A3A', '#473244'); stiltHouse(sil, 560, 720, .9); palm(sil, 1560, 720, 320, 1, '#3B2A3A', '#473244'); palm(sil, 1760, 725, 250, .85, '#3B2A3A', '#473244');
  sil.querySelectorAll('rect,path').forEach(e => { if (e.getAttribute('fill') && !e.getAttribute('fill').startsWith('url') && e.getAttribute('fill') !== 'none') e.setAttribute('fill', '#3E2A3C'); if (e.getAttribute('stroke') && e.getAttribute('stroke') !== 'none') e.setAttribute('stroke', '#3E2A3C'); });
  field(W, '#C98B4A', '#A86E38', null, 720);
  el('path', { d: 'M-20,875 Q480,840 960,858 T1940,852 L1940,912 Q1440,920 960,916 T-20,932Z', fill: '#9E7045' }, W);
  const bu = buffalo(W, 'suU'); place(bu, 1850, 905, .78, true); const rider = boy($('suU_body'), 'suR', { pose: 'sit', shadow: false }); gsap.set(rider, { svgOrigin: '0 0', x: -20, y: -196, scale: .78 });
  const dad = adult(W, 'suF', 'dad'); place(dad, 2150, 915, .72, true); const dg = dog(W, 'suD'); place(dg, 1500, 915, .75, true);
  const glow = el('rect', { width: 1920, height: 1080, fill: '#FF8A3D', opacity: .12 }, W);
  const bd = G(W); for (let i = 0; i < 7; i++) { const g = bird(bd, 'suBird'); gsap.set(g, { x: 2000 + Math.abs(i - 3) * 60, y: 250 + Math.abs(i - 3) * 40 }); }
  const D = c.s.dur;
  O(c.t0, sn, { y: 520 }, { y: 760, duration: D, ease: 'none' });
  quadWalk('suU', c.t0, c.t1, .36, 14); T(c.t0, bu, { x: 600, duration: D, ease: 'none' }); loop(c.t0, c.t1, '#suU_tail', { rotation: -10 }, { rotation: 14 }, .6);
  walkCycle('suF', c.t0 + .5, c.t1, .32); T(c.t0 + .5, dad, { x: 900, duration: D - .5, ease: 'none' });
  quadWalk('suD', c.t0, c.t1, .2, 22); T(c.t0, dg, { x: 350, duration: D, ease: 'none' }); loop(c.t0, c.t1, '#suD_tail', { rotation: -18 }, { rotation: 22 }, .2);
  tl.fromTo('.suBird', { x: (i) => 2000 + Math.abs(i - 3) * 60 }, { x: (i) => -200 + Math.abs(i - 3) * 60, duration: 9, ease: 'none', immediateRender: false }, c.L(2) - 1);
  tl.fromTo('.suBirdW', { scaleY: 1, transformOrigin: '50% 100%' }, { scaleY: -.6, duration: .2, repeat: 44, yoyo: true, immediateRender: false }, c.L(2) - 1);
  const ty = c.L(c.Lt('ขอบคุณนะทุย')); S(ty, '#suR_eyes', { opacity: 0 }); S(ty, '#suR_eyesH', { opacity: 1 }); T(ty + .2, '#suR_armR', { rotation: -130, duration: .3 }); O(ty + .5, '#suR_armR', { rotation: -130 }, { rotation: -150, duration: .3, repeat: 3, yoyo: true });
  T(ty + 1.6, '#suU_head', { rotation: -16, duration: .35 }); T(ty + 2.8, '#suU_head', { rotation: 0, duration: .4 });
  cam(W, c.t0, D, 1.0, 1.1, 960, 800);
  return { speakers: { B: 'suR', F: 'suF' }, blink: ['suR', 'suF'] };
};

/* ---------- DINNER ---------- */
function nightTint(p) { el('rect', { width: 1920, height: 1080, fill: '#1E1540', opacity: .34 }, p); const g = el('circle', { cx: 960, cy: 300, r: 900, fill: 'url(#gLamp)', opacity: .9 }, p); g.style.mixBlendMode = 'screen';
  const lamp = G(p); el('line', { x1: 960, y1: 0, x2: 960, y2: 230, stroke: '#3A2414', 'stroke-width': 4 }, lamp); el('path', { d: 'M930,230 L990,230 L980,300 L940,300Z', fill: '#B98A45' }, lamp); el('ellipse', { cx: 960, cy: 262, rx: 16, ry: 24, fill: '#FFE7A3' }, lamp); return lamp; }
SC.dinner = c => {
  const A = G(c.root, { id: 'dnA' }); mealRoom(A, 'dnA', true); el('rect', { x: 1300, y: 860, width: 170, height: 70, rx: 10, fill: '#6A4428' }, A);
  const basin = G(A); el('ellipse', { cx: 1385, cy: 850, rx: 90, ry: 26, fill: '#C9D1D9' }, basin); el('ellipse', { cx: 1385, cy: 846, rx: 76, ry: 18, fill: '#8FD3FF' }, basin);
  const b = boy(A, 'dnBs', { hat: false, shirt: '#3D8C6E' }); place(b, 1080, 1000, 1.15);
  const towel = G($('dnBs_up')); el('path', { d: 'M-44,-196 Q-20,-206 10,-196 L4,-120 L-30,-118Z', fill: '#fff', opacity: .95 }, towel);
  const sp = G(A); sparkleBurst(sp, 'dnSpk', 1080, 620, 10, 170);
  const drops = G(A); seed(55); for (let i = 0; i < 12; i++) { const w = G(drops, { transform: `translate(${1330 + R(-40, 40)},${830})` }); el('circle', { class: 'dnDrop', r: R(5, 9), fill: '#DDF4FF', opacity: 0 }, w); }
  nightTint(A);
  const Bq = G(c.root, { id: 'dnB', opacity: 0 }); mealRoom(Bq, 'dnB', true);
  const mom = adult(Bq, 'dnM', 'mom', { pose: 'sit' }); place(mom, 470, 930, .88); const bb = boy(Bq, 'dnB2', { hat: false, pose: 'sit', shirt: '#3D8C6E' }); place(bb, 960, 868, 1.0); const dad = adult(Bq, 'dnF', 'dad', { pose: 'sit' }); place(dad, 1450, 930, .88);
  mealTray(Bq, 'dnT'); nightTint(Bq);
  tl.fromTo('.dnTSteam', { opacity: 0, y: 0 }, { opacity: .6, y: -40, duration: 1.6, stagger: .5, repeat: Math.floor(c.s.dur / 2.1), repeatDelay: .5, yoyo: true, immediateRender: false }, c.t0);
  tl.fromTo('.dnAStar,.dnBStar', { opacity: .3 }, { opacity: 1, duration: .8, stagger: .1, repeat: Math.floor(c.s.dur / 1.6), yoyo: true, immediateRender: false }, c.t0);
  const wash = c.at('wash'), table = c.at('table');
  S(c.t0, '#dnBs_eyes', { opacity: 0 }); S(c.t0, '#dnBs_eyesH', { opacity: 1 }); tl.fromTo('.dnSpk', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: .4, stagger: .06, yoyo: true, repeat: 1, ease: 'back.out(3)', immediateRender: false }, c.L(0) + .8);
  S(wash - .3, '#dnBs_eyesH', { opacity: 0 }); S(wash - .3, '#dnBs_eyes', { opacity: 1 });
  walkCycle('dnBs', wash - .2, wash + .8, .25); T(wash - .2, b, { x: 1240, duration: 1.0 });
  T(wash + .9, ['#dnBs_armR', '#dnBs_armL'], { rotation: (i) => i ? 25 : -20, duration: .4 }); O(wash + 1.3, '#dnBs_armR', { rotation: 25 }, { rotation: 38, duration: .18, repeat: 7, yoyo: true });
  tl.fromTo('.dnDrop', { opacity: 1, x: 0, y: 0 }, { opacity: 0, x: () => R(-90, 90), y: () => R(-90, -20), duration: .7, ease: 'power2.out', stagger: .02, immediateRender: false }, wash + 1.3);
  T(table - .5, A, { opacity: 0, duration: .5 }); T(table - .5, Bq, { opacity: 1, duration: .5 });
  eatLoop('dnB2', table + .3, c.L(c.s.lines.findIndex(l => l.who === 'B')) - .2, 132, 1.2); eatLoop('dnF', table + .6, c.t1, 140, 1.6, 3.5); eatLoop('dnM', table + 1.0, c.L(c.s.lines.findIndex(l => l.who === 'M')) - .2, 140, 1.4);
  const pr = c.L(c.Lt('พ่อภูมิใจ')); S(pr, '#dnF_eyes', { opacity: 0 }); S(pr, '#dnF_eyesH', { opacity: 1 }); S(pr + .3, '#dnB2_eyes', { opacity: 0 }); S(pr + .3, '#dnB2_eyesH', { opacity: 1 });
  cam(A, c.t0, table - c.t0, 1.0, 1.12, 1200, 700); cam(Bq, table - .5, c.t1 - table + .5, 1.0, 1.1, 960, 720);
  return { speakers: { B: 'dnB2', F: 'dnF', M: 'dnM' }, blink: ['dnBs', 'dnB2', 'dnF', 'dnM'] };
};

/* ---------- BED ---------- */
SC.bed = c => {
  const W = G(c.root, { id: 'bdW' });
  el('rect', { width: 1920, height: 800, fill: 'url(#pWall)' }, W);
  const win = G(W); el('rect', { x: 1240, y: 150, width: 440, height: 340, fill: 'url(#gNight)' }, win); el('circle', { cx: 1560, cy: 260, r: 44, fill: '#FFF6D0' }, win); el('circle', { cx: 1560, cy: 260, r: 120, fill: 'url(#gMoon)' }, win); seed(2); for (let i = 0; i < 22; i++) el('circle', { class: 'bdStar', cx: R(1250, 1670), cy: R(160, 470), r: R(2, 4.5), fill: '#fff' }, win);
  el('rect', { x: 1228, y: 138, width: 464, height: 364, fill: 'none', stroke: '#6A4428', 'stroke-width': 24 }, W); el('rect', { x: 1450, y: 150, width: 16, height: 340, fill: '#6A4428' }, W);
  const shelf = G(W); el('rect', { x: 180, y: 300, width: 260, height: 18, fill: '#6A4428' }, shelf); el('path', { d: 'M310,300 Q280,300 285,270 Q290,240 310,236 Q330,240 335,270 Q340,300 310,300Z', fill: '#E8B64A' }, shelf); el('circle', { cx: 310, cy: 222, r: 16, fill: '#E8B64A' }, shelf); el('path', { d: 'M310,204 l0,-14', stroke: '#E8B64A', 'stroke-width': 6 }, shelf);
  [230, 390].forEach(x => { el('rect', { x: x - 10, y: 262, width: 20, height: 38, rx: 4, fill: '#F4F1EA' }, shelf); el('path', { d: `M${x},${262} q-6,-12 0,-22 q6,10 0,22`, fill: '#FFB84D' }, shelf); });
  el('path', { d: 'M200,340 q55,40 110,0 q55,40 110,0', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 8, 'stroke-dasharray': '2 10', 'stroke-linecap': 'round' }, shelf);
  el('rect', { y: 780, width: 1920, height: 300, fill: 'url(#pPlank)' }, W); el('rect', { y: 772, width: 1920, height: 14, fill: '#6A4428' }, W);
  el('path', { d: 'M470,940 L1330,940 L1290,800 L510,800Z', fill: 'url(#pMat)' }, W); el('ellipse', { cx: 640, cy: 845, rx: 95, ry: 40, fill: '#F7F2E8' }, W);
  const dad = adult(W, 'bdF', 'dad', { pose: 'sit' }); place(dad, 300, 910, .85);
  const lying = boy(W, 'bdBl', { hat: false, shirt: '#3D8C6E', shadow: false }); gsap.set(lying, { svgOrigin: '0 0', x: 960, y: 870, rotation: -90, scale: 1.05 });
  const blanket = G(W, { id: 'bdBlk' }); el('path', { d: 'M800,790 Q900,760 1040,790 L1060,900 L790,900Z', fill: '#7FB3E8' }, blanket); for (let i = 0; i < 5; i++) el('rect', { x: 800 + i * 52, y: 786, width: 16, height: 112, fill: '#5E97D4', opacity: .6 }, blanket);
  const sitB = boy(W, 'bdBs', { hat: false, pose: 'sit', shirt: '#3D8C6E' }); place(sitB, 820, 870, .95); gsap.set(sitB, { opacity: 0 });
  const mom = adult(W, 'bdM', 'mom', { pose: 'sit' }); place(mom, 1450, 910, .85);
  const net = G(W); el('path', { d: 'M560,380 L1260,380 L1330,930 L480,930Z', fill: 'url(#pNet)', opacity: .7 }, net); el('path', { d: 'M560,380 L1260,380 L1330,930 L480,930Z', fill: '#fff', opacity: .06 }, net);
  gsap.set(net, { svgOrigin: '900 380', scaleY: .1, opacity: 0 }); [[560, 380], [1260, 380]].forEach(([x, y]) => el('line', { x1: x, y1: 0, x2: x, y2: y, stroke: '#EDE6D6', 'stroke-width': 3 }, W));
  el('rect', { width: 1920, height: 1080, fill: '#1E1540', opacity: .42 }, W); const glow = el('circle', { cx: 1560, cy: 260, r: 700, fill: 'url(#gMoon)', opacity: .35 }, W); glow.style.mixBlendMode = 'screen';
  const lampG = el('circle', { id: 'bdLamp', cx: 1750, cy: 760, r: 520, fill: 'url(#gLamp)', opacity: .8 }, W); lampG.style.mixBlendMode = 'screen'; el('path', { d: 'M1730,800 L1770,800 L1765,760 L1735,760Z', fill: '#B98A45' }, W); el('ellipse', { cx: 1750, cy: 745, rx: 10, ry: 16, fill: '#FFE7A3' }, W);
  const dark = el('rect', { width: 1920, height: 1080, fill: '#0B0820', opacity: 0 }, W);
  const zz = G(W); zzz(zz, 'bdZ', 700, 640);
  tl.fromTo('.bdStar', { opacity: .3 }, { opacity: 1, duration: .7, stagger: .08, repeat: Math.floor(c.s.dur / 1.4), yoyo: true, immediateRender: false }, c.t0);
  const room = c.at('room'), pray = c.at('pray'), sleep = c.at('sleep');
  S(pray - .3, lying, { opacity: 0 }); S(pray - .3, blanket, { y: 30 }); S(pray - .3, sitB, { opacity: 1 }); O(pray - .3, sitB, { y: 900 }, { y: 870, duration: .3 });
  T(pray, '#bdBs_armL', { rotation: -54, duration: .45 }); T(pray, '#bdBs_armR', { rotation: 54, duration: .45 }); S(pray, '#bdBs_eyes', { opacity: 0 }); S(pray, '#bdBs_eyesC', { opacity: 1 }); T(pray, '#bdBs_head', { rotation: -6, duration: .5 });
  S(sleep - .2, sitB, { opacity: 0 }); S(sleep - .2, lying, { opacity: 1 }); S(sleep - .2, blanket, { y: 0 }); S(sleep, '#bdBl_eyes', { opacity: 0 }); S(sleep, '#bdBl_eyesC', { opacity: 1 });
  T(sleep, '#bdM_armL', { rotation: -40, duration: .5 }); O(sleep + .5, '#bdM_armL', { rotation: -40 }, { rotation: -30, duration: .4, repeat: 3, yoyo: true }); T(sleep + 2.3, '#bdM_armL', { rotation: 0, duration: .5 });
  T(sleep + .5, net, { scaleY: 1, opacity: 1, duration: 1.2, ease: 'power2.inOut' }); T(sleep + 1, dark, { opacity: .35, duration: 3 }); T(sleep + 1, '#bdLamp', { opacity: .3, duration: 3 });
  tl.fromTo('.bdZ', { opacity: 0, y: 0, x: 0 }, { opacity: 1, y: -60, x: 20, duration: 1.2, stagger: .35, repeat: Math.floor((c.t1 - sleep) / 1.6), repeatDelay: .5, immediateRender: false }, sleep + 1);
  loop(sleep, c.t1, blanket, { scaleY: 1, svgOrigin: '920 900' }, { scaleY: 1.04 }, 1.4);
  S(c.L(c.s.lines.findIndex(l => l.who === 'M')), '#bdM_eyes', { opacity: 0 }); S(c.L(c.s.lines.findIndex(l => l.who === 'M')), '#bdM_eyesH', { opacity: 1 });
  cam(W, c.t0, sleep - c.t0, 1.0, 1.08, 900, 700); cam(W, sleep, c.t1 - sleep, 1.08, 1.25, 1460, 330);
  return { speakers: ln => ln.who === 'B' ? (c.t0 + ln.t < pray - .3 ? 'bdBl' : 'bdBs') : ln.who === 'M' ? 'bdM' : ln.who === 'F' ? 'bdF' : null, blink: ['bdBl', 'bdF', 'bdM'] };
};

/* ---------- END ---------- */
SC.end = c => {
  const W = G(c.root, { id: 'enW' }); sky(W, null, 'gNight'); el('circle', { cx: 1500, cy: 250, r: 70, fill: '#FFF6D0' }, W); el('circle', { cx: 1500, cy: 250, r: 220, fill: 'url(#gMoon)' }, W);
  seed(6); for (let i = 0; i < 70; i++) el('circle', { class: 'enStar', cx: R(0, 1920), cy: R(0, 760), r: R(1.5, 4.5), fill: '#fff' }, W);
  cloud(W, 200, 300, .9, '#4A5A9A', .7); cloud(W, 1000, 200, .7, '#4A5A9A', .6);
  mountains(W, '#2B3A6A', '#22305A'); field(W, '#2E4A3A', '#253E30', null, 720); const sil = G(W); stiltHouse(sil, 560, 720, .9); palm(sil, 180, 720, 300, 1, '#152236', '#1B2A40'); palm(sil, 1560, 720, 320, 1, '#152236', '#1B2A40');
  sil.querySelectorAll('rect,path').forEach(e => { if (e.getAttribute('fill') && e.getAttribute('fill') !== 'none') e.setAttribute('fill', '#141E33'); if (e.getAttribute('stroke') && e.getAttribute('stroke') !== 'none') e.setAttribute('stroke', '#141E33'); });
  const win = el('rect', { x: 540, y: 600, width: 40, height: 40, fill: '#FFD27A' }, W);
  tl.fromTo('.enStar', { opacity: .2 }, { opacity: 1, duration: .6, stagger: .04, repeat: Math.floor(c.s.dur / 1.2), yoyo: true, immediateRender: false }, c.t0);
  const ov = domEl(c.dom, 'ov', '<div class="e1">จบ</div><div class="e2">ตอนหน้า: หนึ่งวันที่โรงเรียน</div><div class="e3">อย่าลืมกดติดตามนะ</div>'); S(c.t0, ov, { opacity: 1 });
  popIn(c.t0 + .3, ov.children[0], .8); O(c.t0 + 1.0, ov.children[1], { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power2.out' }); popIn(c.L(0), ov.children[2], .6);
  loop(c.L(0) + .8, c.t1, ov.children[2], { scale: 1 }, { scale: 1.06 }, .6);
  cam(W, c.t0, c.s.dur, 1.0, 1.06, 960, 540);
  return {};
};
