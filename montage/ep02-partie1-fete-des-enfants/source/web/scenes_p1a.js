/* งานวันเด็ก ตอนที่ 1 — scenes: title, morning, road, flag, thai, math, music, announce, recess */
function happy(id, t0, t1) { S(t0, `#${id}_eyes`, { opacity: 0 }); S(t0, `#${id}_eyesH`, { opacity: 1 }); if (t1) { S(t1, `#${id}_eyesH`, { opacity: 0 }); S(t1, `#${id}_eyes`, { opacity: 1 }); } }
function closed(id, t0, t1) { S(t0, `#${id}_eyes`, { opacity: 0 }); S(t0, `#${id}_eyesC`, { opacity: 1 }); if (t1) { S(t1, `#${id}_eyesC`, { opacity: 0 }); S(t1, `#${id}_eyes`, { opacity: 1 }); } }
function sad(id, t0, t1) { S(t0, `#${id}_mC`, { opacity: 0 }); S(t0, `#${id}_mS`, { opacity: 1 }); if (t1) { S(t1, `#${id}_mS`, { opacity: 0 }); S(t1, `#${id}_mC`, { opacity: 1 }); } }
function wai(id, t, dur, adultK) { const a = adultK ? 45 : 54; T(t, `#${id}_armL`, { rotation: -a, duration: .4 }); T(t, `#${id}_armR`, { rotation: a, duration: .4 }); closed(id, t + .2, t + dur); T(t + dur, [`#${id}_armL`, `#${id}_armR`], { rotation: 0, duration: .4 }); }
function waveArm(id, t, n = 5, arm = 'R') { const r = arm === 'R' ? -150 : 150; T(t, `#${id}_arm${arm}`, { rotation: r, duration: .3 }); O(t + .3, `#${id}_arm${arm}`, { rotation: r }, { rotation: r + (arm === 'R' ? 30 : -30), duration: .22, repeat: n, yoyo: true }); T(t + .3 + .22 * (n + 1), `#${id}_arm${arm}`, { rotation: 0, duration: .35 }); }
function hop(target, t, n, y0, dy = 50, d = .22) { O(t, target, { y: y0 }, { y: y0 - dy, duration: d, repeat: n * 2 - 1, yoyo: true, ease: 'power1.out' }); }
function kidSet(p, pre, xs, y, s, opt = {}) { const L = [[pre + 'K', KAEW], [pre + 'B', KHAO], [pre + 'T', TON]]; return L.map(([id, o], i) => { const k = kid(p, id, { ...o, ...opt }); place(k, xs[i], y, s); return id; }); }
function classmates(p, pre, rows, sd = 1) { const ids = []; rows.forEach(([y, s, xs], r) => xs.forEach((x, i) => { const id = `${pre}${r}_${i}`; const o = CLASSMATES[(i + r * 2 + sd) % CLASSMATES.length]; const k = kid(p, id, o); place(k, x, y, s); ids.push(id); })); return ids; }
function schoolYard(W, sky0 = 'gDay') { sky(W, null, sky0); sun(W, null, 1700, 140); const cl = G(W); cloud(cl, 200, 150, .9); cloud(cl, 1200, 110, .8);
  mountains(W, '#9CC4D2', '#86B89C', -60); palm(W, 120, 640, 260, .8); tree(W, 1820, 660, .9);
  school(W, 1060, 660, .95); el('rect', { y: 650, width: 1920, height: 430, fill: '#D8C089' }, W); grassTufts(W, 660, 40, '#79B85A', '#6AAE4E', 22); return cl; }

/* ---------- TITLE ---------- */
SC.title = c => {
  const W = G(c.root, { id: 'ti_w' }); const v = villageWide(W, { dawn: true, sunY: 760 }); const fr = G(W); grassTufts(fr, 1080, 22);
  const bd = G(W); for (let i = 0; i < 4; i++) bird(bd, 'tiBird');
  cam(W, c.t0, c.s.dur, 1.12, 1.0, 960, 760, 'power1.out'); O(c.t0, v.sun, { y: 760 }, { y: 260, duration: 7, ease: 'power2.out' }); T(c.t0 + 1, '#ti_w_dawn', { opacity: 0, duration: 7 }); T(c.t0, '#ti_w_clouds', { x: 120, duration: c.s.dur, ease: 'none' });
  tl.fromTo('.tiBird', { x: i => -100 - i * 80, y: i => 300 + (i % 2) * 40 }, { x: i => 2100 - i * 60, y: i => 220 + (i % 2) * 30, duration: 8, ease: 'none', stagger: .3, immediateRender: false }, c.t0 + 2);
  tl.fromTo('.tiBirdW', { scaleY: 1, transformOrigin: '50% 100%' }, { scaleY: -.6, duration: .18, repeat: 40, yoyo: true, immediateRender: false }, c.t0 + 2);
  const ov = domEl(c.dom, 'ov', '<div class="t1">ชาวนาตัวน้อย</div><div class="t2">งานวันเด็ก · ตอนที่ 1</div><div class="e2" style="margin-top:18px">ข่าวดีจากคุณครู</div>'); S(c.t0, ov, { opacity: 1 });
  popIn(c.t0 + .5, ov.children[0], .9); O(c.t0 + 1.3, ov.children[1], { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: .7, ease: 'back.out(1.8)' }); O(c.t0 + 2.0, ov.children[2], { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power2.out' });
  loop(c.t0 + 2.6, c.t1 - 2, ov.children[0], { scale: 1 }, { scale: 1.05 }, .9);
  T(c.t1 - 1.4, ov.children[0], { y: -500, opacity: 0, duration: .7, ease: 'back.in(1.5)' }); T(c.t1 - 1.3, [ov.children[1], ov.children[2]], { y: 400, opacity: 0, duration: .6, ease: 'back.in(1.5)' });
  return {};
};

/* ---------- MORNING ---------- */
SC.morning = c => {
  const eat = c.at('eat'), mom = c.at('mom'), thuiT = c.at('thui');
  const A = G(c.root, { id: 'moA' }); mealRoom(A, 'moA', false);
  const b = kid(A, 'moB', { ...KHAO, bag: '#E53935' }); place(b, 960, 1000, 1.15); S(c.t0, ['#moB_bagb', '#moB_bags'], { opacity: 0 });
  const sp = G(A); sparkleBurst(sp, 'moSpk', 960, 640, 12, 190);
  const Bq = G(c.root, { id: 'moB2', opacity: 0 }); mealRoom(Bq, 'moBq', false);
  const mm = adult(Bq, 'moM', 'mom', { pose: 'sit' }); place(mm, 470, 930, .88); const bs = kid(Bq, 'moBs', { ...KHAO, pose: 'sit' }); place(bs, 960, 868, 1.0); const dd = adult(Bq, 'moF', 'dad', { pose: 'sit' }); place(dd, 1450, 930, .88);
  mealTray(Bq, 'moT'); const eggs = G(Bq); [[1000, 960], [1040, 955], [1020, 940]].forEach(([x, y]) => el('ellipse', { cx: x, cy: y, rx: 20, ry: 25, fill: '#FBF7EE', stroke: '#E5DCC8', 'stroke-width': 3 }, eggs));
  const Cq = G(c.root, { id: 'moC', opacity: 0 }); mealRoom(Cq, 'moCq', false);
  const m2 = adult(Cq, 'moM2', 'mom'); place(m2, 560, 1000, .95); const f2 = adult(Cq, 'moF2', 'dad'); place(f2, 1400, 1000, .95); const b2 = kid(Cq, 'moB2k', { ...KHAO, bag: '#E53935' }); place(b2, 960, 1000, 1.1);
  const box = G(Cq, { id: 'moBox' }); el('rect', { x: -40, y: -26, width: 80, height: 40, rx: 8, fill: '#4FC3F7' }, box); el('rect', { x: -44, y: -32, width: 88, height: 12, rx: 5, fill: '#2E86C1' }, box); gsap.set(box, { x: 640, y: 820 });
  const D = G(c.root, { id: 'moD', opacity: 0 }); villageWide(D); el('rect', { y: 870, width: 1920, height: 210, fill: '#C19A67' }, D); grassTufts(D, 880, 30, '#6FAF4B', '#5FA442', 34);
  const bu = buffalo(D, 'moU'); place(bu, 700, 1000, 1.2); const b3 = kid(D, 'moB3', { ...KHAO, bag: '#E53935' }); place(b3, 1250, 1010, 1.15);
  // part A: uniform
  const uni = c.at('uniform'), bag = c.at('bag');
  O(uni, b, { scaleX: 1.15 }, { scaleX: -1.15, duration: .35, yoyo: true, repeat: 1, ease: 'power1.inOut' }); tl.fromTo('.moSpk', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: .35, stagger: .04, yoyo: true, repeat: 1, ease: 'back.out(3)', immediateRender: false }, uni + .2);
  happy('moB', c.L(c.Lt('ชุดนักเรียนของผม')), c.Le(c.Lt('ชุดนักเรียนของผม')) + .3);
  S(bag, ['#moB_bagb', '#moB_bags'], { opacity: 1 }); O(bag, ['#moB_bagb', '#moB_bags'], { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: .5, ease: 'bounce.out' });
  cam(A, c.t0, eat - c.t0, 1.0, 1.15, 960, 720);
  // part B: breakfast
  T(eat - .4, A, { opacity: 0, duration: .5 }); T(eat - .4, Bq, { opacity: 1, duration: .5 });
  eatLoop('moBs', eat + .3, mom - .4, 132, 1.2); eatLoop('moF', eat + .6, mom - .4, 140, 1.5); eatLoop('moM', eat + 1.8, mom - .4, 140, 1.4);
  happy('moBs', c.L(c.Lt('อร่อยมาก')), c.Le(c.Lt('อร่อยมาก')) + .4);
  // part C: lunch box + goodbye
  T(mom - .4, Bq, { opacity: 0, duration: .5 }); T(mom - .4, Cq, { opacity: 1, duration: .5 });
  T(mom + .2, '#moM2_armR', { rotation: -40, duration: .4 }); T(c.L(c.Lt('ขอบคุณครับแม่')) - .3, box, { x: 900, y: 860, duration: .6 }); T(c.L(c.Lt('ขอบคุณครับแม่')) - .3, '#moM2_armR', { rotation: 0, duration: .5 }); S(c.Le(c.Lt('ขอบคุณครับแม่')), box, { opacity: 0 });
  happy('moM2', c.L(c.Lt('ไปโรงเรียน ตั้งใจ')), c.t1); happy('moF2', c.L(c.Lt('ไปโรงเรียน ตั้งใจ')), c.t1);
  wai('moB2k', c.at('wai'), 2.2);
  cam(Cq, mom - .4, thuiT - mom + .4, 1.0, 1.08, 960, 700);
  // part D: goodbye Thui
  T(thuiT - .4, Cq, { opacity: 0, duration: .5 }); T(thuiT - .4, D, { opacity: 1, duration: .5 });
  loop(thuiT, c.t1, '#moU_tail', { rotation: -10 }, { rotation: 14 }, .6); waveArm('moB3', thuiT + .2, 7);
  const moo = TIMELINE.sfx.find(x => x.name === 'moo' && x.t > thuiT && x.t < c.t1); if (moo) { T(moo.t - .1, '#moU_head', { rotation: -18, duration: .35 }); T(moo.t + 1.3, '#moU_head', { rotation: 0, duration: .4 }); }
  walkCycle('moB3', c.t1 - 2.2, c.t1 + .5, .27); T(c.t1 - 2.2, b3, { x: 2100, duration: 2.7, ease: 'none' });
  return { speakers: ln => ln.who === 'B' ? (c.t0 + ln.t < eat ? 'moB' : c.t0 + ln.t < mom ? 'moBs' : c.t0 + ln.t < thuiT ? 'moB2k' : 'moB3') : ln.who === 'M' ? (c.t0 + ln.t < mom ? 'moM' : 'moM2') : ln.who === 'F' ? 'moF2' : null, blink: ['moB', 'moBs', 'moM', 'moF', 'moM2', 'moF2', 'moB2k', 'moB3'] };
};

/* ---------- ROAD ---------- */
SC.road = c => {
  const bridge = c.at('bridge'), yai = c.at('yai');
  const A = G(c.root, { id: 'rdA' }); sky(A, null, 'gDay'); sun(A, null, 1650, 140); const cl = G(A); cloud(cl, 200, 170, 1); cloud(cl, 1100, 120, 1.2); cloud(cl, 1900, 200, .8);
  const far = G(A); mountains(far); mountains(G(far, { transform: 'translate(1920,0)' }));
  const mid = G(A); seed(33); for (let i = 0; i < 16; i++) { const x = i * 260 + R(-40, 40); if (i % 5 === 2) stiltHouse(mid, x, 700, .7); else if (i % 3 === 0) tree(mid, x, 710, .7); else palm(mid, x, 705, R(220, 300), .85); }
  field(A, '#8BCF5E', '#5FAF45', null, 700); el('rect', { y: 840, width: 1920, height: 110, fill: '#C9A26C' }, A); el('rect', { y: 836, width: 1920, height: 8, fill: '#DCC08F' }, A);
  const fl = G(A); flowers(fl, 950, 1070, 40, 9); grassTufts(fl, 1080, 26, '#5FA442', '#6FAF4B', 50);
  const kb = kid(A, 'rdB', { ...KHAO, bag: '#E53935' }); place(kb, 760, 960, 1.0);
  const kk = kid(A, 'rdK', { ...KAEW, bag: '#F48FB1' }); place(kk, -200, 960, .95); const kt = kid(A, 'rdT', { ...TON, bag: '#42A5F5' }); place(kt, 2150, 960, 1.0, true);
  const k0 = c.at('kaew'), t0 = c.at('ton'), walk = c.at('walk');
  walkCycle('rdB', c.t0, k0 - .5, .28); O(c.t0, kb, { x: 300 }, { x: 760, duration: k0 - .5 - c.t0, ease: 'none' });
  walkCycle('rdK', k0 - .2, k0 + 1.2, .18, 30); T(k0 - .2, kk, { x: 560, duration: 1.4, ease: 'power1.out' }); waveArm('rdK', k0 + 1.3, 4);
  walkCycle('rdT', t0 - .2, t0 + 1.3, .2, 26); T(t0 - .2, kt, { x: 980, duration: 1.5, ease: 'power1.out' }); S(t0 + 1.35, kt, { scaleX: 1.0 });
  waveArm('rdB', c.L(c.Lt('สวัสดีแก้ว')), 5);
  const D = bridge - walk; T(walk, far, { x: -120, duration: D + 1, ease: 'none' }); T(walk, mid, { x: -900, duration: D + 1, ease: 'none' }); T(walk, fl, { x: -1500, duration: D + 1, ease: 'none' }); T(walk, cl, { x: -100, duration: D + 1, ease: 'none' });
  ['rdK', 'rdB', 'rdT'].forEach((id, i) => walkCycle(id, walk + i * .05, bridge + .5, .3));
  happy('rdK', c.L(c.Lt('ดูสิ ดอกไม้')), c.Le(c.Lt('ดูสิ ดอกไม้')) + .5); happy('rdT', c.L(c.Lt('นกก็ร้อง')), c.Le(c.Lt('นกก็ร้อง')) + .5);
  const bd = G(A); for (let i = 0; i < 5; i++) bird(bd, 'rdBird'); tl.fromTo('.rdBird', { x: i => -100 - i * 70, y: i => 260 + (i % 2) * 40 }, { x: i => 2100 - i * 50, y: i => 200 + (i % 3) * 30, duration: 7, ease: 'none', stagger: .3, immediateRender: false }, c.L(c.Lt('นกก็ร้อง')) - 1);
  tl.fromTo('.rdBirdW', { scaleY: 1, transformOrigin: '50% 100%' }, { scaleY: -.6, duration: .18, repeat: 36, yoyo: true, immediateRender: false }, c.L(c.Lt('นกก็ร้อง')) - 1);
  // bridge
  const Bb = G(c.root, { id: 'rdBb', opacity: 0 }); sky(Bb, null, 'gDay'); cloud(Bb, 300, 150, .9); cloud(Bb, 1400, 120, 1); mountains(Bb, '#9CC4D2', '#86B89C', -80); palm(Bb, 200, 600, 260, .8); palm(Bb, 1700, 600, 280, .85);
  el('rect', { y: 580, width: 1920, height: 60, fill: '#6FAF4B' }, Bb); el('rect', { y: 630, width: 1920, height: 450, fill: 'url(#gCanal)' }, Bb);
  const fs = G(Bb); [['#F29A2E', 600, 950], ['#E8E8E8', 1100, 1000], ['#F2C14E', 1400, 930]].forEach(([col, x, y], i) => { const f = fish(fs, 'rdF' + i, col); place(f, x, y, 1.3, i % 2 === 1); loop(bridge, yai, f, { x: x - 150 }, { x: x + 150 }, 2.4 + i * .4); });
  const br = G(Bb); el('path', { d: 'M200,760 Q960,560 1720,760', fill: 'none', stroke: '#8B5E34', 'stroke-width': 46 }, br); el('path', { d: 'M200,740 Q960,540 1720,740', fill: 'none', stroke: '#A8743F', 'stroke-width': 20 }, br); for (let i = 0; i < 9; i++) { const x = 330 + i * 160, y = 760 - Math.sin(Math.PI * (x - 200) / 1520) * 200; el('rect', { x: x - 8, y: y - 90, width: 16, height: 90, fill: '#8B5E34' }, br); } el('path', { d: 'M300,650 Q960,460 1620,650', fill: 'none', stroke: '#8B5E34', 'stroke-width': 12 }, br);
  const bIds = kidSet(Bb, 'rdb', [780, 960, 1140], 600, .75, { bag: null });
  T(bridge - .4, A, { opacity: 0, duration: .5 }); T(bridge - .4, Bb, { opacity: 1, duration: .5 });
  S(c.L(c.Lt('ดูสิ มีปลา')), '#rdbT_armR', { rotation: 40 }); T(c.Le(c.Lt('ดูสิ มีปลา')) + .6, '#rdbT_armR', { rotation: 0, duration: .4 }); bIds.forEach(id => happy(id, c.L(c.Lt('ดูสิ มีปลา')) + .3, yai));
  // grandma
  const Cc = G(c.root, { id: 'rdC', opacity: 0 }); sky(Cc, null, 'gDay'); sun(Cc, null, 300, 150); cloud(Cc, 900, 130, .8);
  el('rect', { y: 700, width: 1920, height: 380, fill: '#CDB07C' }, Cc); stiltHouse(Cc, 1450, 760, 2.0); banana(Cc, 1850, 780, 1.3);
  const fence = G(Cc); for (let x = 900; x < 1920; x += 90) el('rect', { x, y: 690, width: 16, height: 110, rx: 5, fill: '#F4F1EA' }, fence); el('rect', { x: 890, y: 720, width: 1040, height: 12, fill: '#F4F1EA' }, fence);
  flowers(Cc, 790, 860, 40, 13); grassTufts(Cc, 800, 30, '#6FAF4B', '#5FA442', 30);
  const y1 = adult(Cc, 'rdY', 'yai'); place(y1, 1300, 960, .95, true); const can = G($('rdY_armR')); el('rect', { x: 40, y: -210, width: 56, height: 40, rx: 10, fill: '#4FC3F7' }, can); el('path', { d: 'M94,-200 L130,-226 L134,-220 L98,-186Z', fill: '#4FC3F7' }, can);
  const drops = G(Cc); for (let i = 0; i < 8; i++) { const w = G(drops, { transform: `translate(${1150 - i * 6},${760})` }); el('circle', { class: 'rdDrop', r: 5, fill: '#8FD3FF', opacity: 0 }, w); }
  const cIds = kidSet(Cc, 'rdc', [420, 620, 820], 990, 1.0, { bag: '#E53935' });
  const bans = cIds.map((id, i) => { const g = G(Cc, { opacity: 0 }); el('path', { d: 'M-20,0 Q0,30 26,-6 Q6,14 -20,0Z', fill: '#FFD84D', stroke: '#C9A21E', 'stroke-width': 3 }, g); gsap.set(g, { x: 1200, y: 780 }); return g; });
  T(yai - .4, Bb, { opacity: 0, duration: .5 }); T(yai - .4, Cc, { opacity: 1, duration: .5 });
  S(yai, '#rdY_armR', { rotation: 30 }); tl.fromTo('.rdDrop', { opacity: 1, y: 0 }, { opacity: 0, y: 160, duration: .7, stagger: .1, repeat: 3, immediateRender: false }, yai + .3);
  cIds.forEach(id => wai(id, c.L(c.Lt('สวัสดีครับคุณยาย')), 1.8));
  happy('rdY', c.L(c.Lt('สวัสดีจ้ะหลาน')), c.t1); S(c.L(c.Lt('สวัสดีจ้ะหลาน')), '#rdY_armR', { rotation: 0 });
  const bn = c.at('banana'); bans.forEach((g, i) => { S(bn + i * .25, g, { opacity: 1 }); T(bn + i * .25, g, { x: [460, 660, 860][i], y: 880, duration: .6, ease: 'power2.out' }); });
  cIds.forEach(id => wai(id, c.L(c.Lt('ขอบคุณครับคุณยาย')), 1.6));
  cam(Cc, yai - .4, c.t1 - yai + .4, 1.0, 1.08, 800, 800);
  const spk = (ln) => { const T0 = c.t0 + ln.t; const set = T0 < bridge ? ['rdK', 'rdB', 'rdT'] : T0 < yai ? bIds : cIds; const m = { G: set[0], B: set[1], O: set[2] }; if (ln.who === 'C') return set; if (ln.who === 'Y') return 'rdY'; return m[ln.who] || null; };
  return { speakers: spk, blink: ['rdB', 'rdK', 'rdT', 'rdY', ...bIds, ...cIds] };
};

/* ---------- FLAG ---------- */
SC.flag = c => {
  const W = G(c.root, { id: 'flW' }); const cl = schoolYard(W); T(c.t0, cl, { x: 80, duration: c.s.dur, ease: 'none' });
  flagpole(W, 560, 700, 560); const flag = thaiFlag(W, 'flF', 566, 610, 1); loop(c.t0, c.t1, '#flF_cloth', { skewY: -4 }, { skewY: 4 }, .6);
  const mates = classmates(W, 'flm', [[860, .55, [760, 900, 1040, 1180, 1320, 1460, 1600]], [960, .62, [720, 880, 1440, 1600, 1760]]], 2);
  const ids = kidSet(W, 'fl', [1040, 1180, 1320], 990, .72, { bag: null });
  const tch = adult(W, 'flTc', 'teacher'); place(tch, 2150, 1000, .9, true);
  const raise = c.at('raise'), teacher = c.at('teacher'), greet = c.at('greet');
  T(raise + .5, flag, { y: 160, duration: 6.5, ease: 'sine.inOut' });
  [...mates, ...ids].forEach((id, i) => { T(raise, `#${id}_armR`, { rotation: 0, duration: .2 }); });
  walkCycle('flTc', teacher - .6, teacher + 1.6, .3); T(teacher - .6, tch, { x: 360, duration: 2.2, ease: 'power1.out' }); S(teacher + 1.7, tch, { scaleX: .9 });
  happy('flTc', c.L(c.Lt('สวัสดีจ้ะ นักเรียน')), c.t1);
  [...mates, ...ids].forEach((id, i) => wai(id, greet + (i % 4) * .05, 1.9));
  cam(W, c.t0, raise - c.t0 + 1, 1.0, 1.0, 960, 540); cam(W, raise + 1, teacher - raise - 1, 1.0, 1.25, 560, 330); T(teacher, W, { scale: 1.0, duration: 1.2 });
  return { speakers: ln => ln.who === 'T' ? 'flTc' : ln.who === 'C' ? [...ids, ...mates] : null, blink: ['flTc', ...ids] };
};

/* ---------- classroom helpers ---------- */
function classScene(c, pre, opt = {}) {
  const W = G(c.root, { id: pre + 'W' }); const board = classroom(W, { id: pre + 'Board' });
  const tch = adult(W, pre + 'Tc', 'teacher'); place(tch, opt.tx || 290, 1010, .95);
  const ids = kidSet(W, pre, opt.kx || [1130, 1420, 1710], 1075, .98, { bag: null });
  (opt.kx || [1130, 1420, 1710]).forEach(x => desk(W, x, 985, 1.22));
  return { W, board, ids, tch: pre + 'Tc' };
}
function iconFor(p, k, x, y) { const g = G(p, { transform: `translate(${x},${y})` });
  if (k === 0) { const h = hen(g, 'ic_hen' + Math.random().toString(36).slice(2, 6)); place(h, 0, 90, 1.8); }
  if (k === 1) { el('ellipse', { cx: 0, cy: 10, rx: 60, ry: 78, fill: '#FBF7EE', stroke: '#E5DCC8', 'stroke-width': 6 }, g); el('ellipse', { cx: -18, cy: -20, rx: 12, ry: 20, fill: '#fff' }, g); }
  if (k === 2) { const bu = buffalo(g, 'ic_bu' + Math.random().toString(36).slice(2, 6)); place(bu, -40, 110, .62); }
  if (k === 3) { el('path', { d: 'M-110,60 C-80,-20 -30,100 0,20 C30,-60 70,60 100,-20', fill: 'none', stroke: '#6BBF4A', 'stroke-width': 30, 'stroke-linecap': 'round' }, g); el('circle', { cx: 104, cy: -30, r: 24, fill: '#6BBF4A' }, g); el('circle', { cx: 112, cy: -36, r: 5, fill: '#1D1410' }, g); el('path', { d: 'M126,-24 l20,6 l-20,4', stroke: '#E53935', 'stroke-width': 4, fill: 'none' }, g); }
  if (k === 4) { el('ellipse', { cx: 0, cy: 30, rx: 120, ry: 40, fill: '#fff', stroke: '#9FB5CF', 'stroke-width': 8 }, g); el('ellipse', { cx: 0, cy: 26, rx: 80, ry: 22, fill: '#EAF2FB' }, g); }
  if (k === 5) { el('ellipse', { cx: 0, cy: 0, rx: 100, ry: 70, fill: '#9AA5B4' }, g); el('circle', { cx: 90, cy: -30, r: 50, fill: '#9AA5B4' }, g); el('ellipse', { cx: 70, cy: -40, rx: 34, ry: 50, fill: '#8591A2' }, g); el('path', { d: 'M130,-10 Q160,40 140,90', fill: 'none', stroke: '#9AA5B4', 'stroke-width': 24, 'stroke-linecap': 'round' }, g); el('circle', { cx: 104, cy: -44, r: 6, fill: '#1D1410' }, g); [-60, -20, 30, 70].forEach(x => el('rect', { x: x - 16, y: 50, width: 32, height: 50, rx: 10, fill: '#8591A2' }, g)); el('path', { d: 'M126,4 l30,10', stroke: '#fff', 'stroke-width': 8, 'stroke-linecap': 'round' }, g); }
  if (k === 6) { for (let i = 0; i < 5; i++) el('ellipse', { cx: -120 + i * 60, cy: 0, rx: 36, ry: 22, fill: 'none', stroke: '#90A4AE', 'stroke-width': 12, transform: i % 2 ? `rotate(90 ${-120 + i * 60} 0)` : '' }, g); }
  if (k === 7) { el('path', { d: 'M-70,110 Q-60,20 0,20 Q60,20 70,110Z', fill: '#E0648C' }, g); el('circle', { cx: 0, cy: -30, r: 52, fill: '#F0C08E' }, g); el('path', { d: 'M-54,-30 Q-58,-100 0,-100 Q58,-100 54,-30 Q40,-70 0,-72 Q-40,-70 -54,-30Z', fill: '#1E140E' }, g); el('path', { d: 'M-54,-30 Q-70,30 -40,60 M54,-30 Q70,30 40,60', stroke: '#1E140E', 'stroke-width': 18, fill: 'none' }, g); [-18, 18].forEach(x => el('circle', { cx: x, cy: -32, r: 6, fill: '#1D1410' }, g)); el('path', { d: 'M-14,-8 Q0,6 14,-8', fill: 'none', stroke: '#7A2E24', 'stroke-width': 5 }, g); }
  return g; }

/* ---------- THAI LESSON ---------- */
SC.thai = c => {
  const { W, board, ids, tch } = classScene(c, 'th2');
  const LET = [['ก', 'ไก่'], ['ข', 'ไข่'], ['ค', 'ควาย'], ['ง', 'งู'], ['จ', 'จาน'], ['ช', 'ช้าง'], ['ซ', 'โซ่'], ['ญ', 'หญิง']];
  const top = chalk(board, 'พยัญชนะไทย', 960, 190, 60); S(c.t0, top, { opacity: 0 }); T(c.L(1), top, { opacity: 1, duration: .5 });
  LET.forEach(([a, w], k) => { const g = G(board, { opacity: 0 }); chalk(g, a, 720, 440, 230, '', '#FFE27A'); chalk(g, w, 720, 520, 60); iconFor(g, k, 1180, 350);
    const t = c.at('l' + k); S(t, g, { opacity: 1 }); O(t, g, { scale: .6, svgOrigin: '960 330' }, { scale: 1, duration: .45, ease: 'back.out(2)' });
    const nx = k < LET.length - 1 ? c.at('l' + (k + 1)) : c.t1 - 1.5; T(nx - .25, g, { opacity: 0, duration: .25 });
    T(t, `#${tch}_armR`, { rotation: -120, duration: .35 }); T(t + 1.6, `#${tch}_armR`, { rotation: 0, duration: .4 }); });
  happy(ids[1], c.L(c.Lt('ค ควาย เหมือน')), c.Le(c.Lt('ค ควาย เหมือน')) + .5);
  const snake = c.L(c.Lt('งูน่ากลัว')); O(snake, `#${ids[0]}`, { x: 1150 }, { x: 1142, duration: .06, repeat: 20, yoyo: true }); T(snake, `#${ids[0]}_eyes`, { scale: 1.3, duration: .2 }); T(c.Le(c.Lt('งูน่ากลัว')) + .3, `#${ids[0]}_eyes`, { scale: 1, duration: .3 });
  const ele = c.L(c.Lt('ช้างตัวใหญ่')); T(ele, `#${ids[2]}_armL`, { rotation: 110, duration: .4 }); T(ele, `#${ids[2]}_armR`, { rotation: -110, duration: .4 }); T(c.Le(c.Lt('ช้างตัวใหญ่')) + .2, [`#${ids[2]}_armL`, `#${ids[2]}_armR`], { rotation: 0, duration: .4 });
  const good = c.L(c.Lt('เก่งมาก ทุกคน')); ids.forEach(id => happy(id, good, c.t1)); happy(tch, good, c.t1); const sp = G(W); sparkleBurst(sp, 'thSpk', 1420, 700, 12, 300); tl.fromTo('.thSpk', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: .35, stagger: .04, yoyo: true, repeat: 1, ease: 'back.out(3)', immediateRender: false }, good + .4);
  cam(W, c.t0, c.s.dur, 1.0, 1.06, 960, 500);
  return { speakers: { T: tch, B: ids[1], G: ids[0], O: ids[2], C: ids }, blink: [tch, ...ids] };
};

/* ---------- MATH ---------- */
SC.math = c => {
  const { W, board, ids, tch } = classScene(c, 'ma');
  const title = chalk(board, 'คณิตศาสตร์', 960, 190, 60); const mg = G(board);
  const m1 = [0, 1].map(i => mango(mg, 560 + i * 130, 360, 1.3, 'maM1')); const plus = chalk(board, '+', 900, 390, 120); const m2 = [0, 1, 2].map(i => mango(mg, 1040 + i * 130, 360, 1.3, 'maM2'));
  const eq = chalk(board, '2 + 3 = 5', 960, 520, 100, '', '#FFE27A');
  gsap.set([...m1, ...m2, plus, eq], { opacity: 0 });
  tl.fromTo(m1, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: .4, stagger: .25, ease: 'back.out(2)', immediateRender: false }, c.at('m2'));
  S(c.at('m3'), plus, { opacity: 1 }); tl.fromTo(m2, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: .4, stagger: .25, ease: 'back.out(2)', immediateRender: false }, c.at('m3') + .2);
  const cnt = c.at('count'), cd = c.line(c.Lt('หนึ่ง สอง')).d; const all = [...m1, ...m2]; const xs = [560, 690, 1040, 1170, 1300];
  const nums = xs.map((x, i) => domEl(c.dom, 'num', String(i + 1), `left:${x - 48}px;top:${240}px`));
  all.forEach((m, i) => { const t = cnt + i * cd / 5 * .98; O(t, m, { y: 0 }, { y: -30, duration: .15, yoyo: true, repeat: 1 }); popIn(t, nums[i], .3); }); nums.forEach(n => T(c.at('right') + 2, n, { opacity: 0, duration: .4 }));
  T(cnt, `#${tch}_armR`, { rotation: -120, duration: .35 }); T(c.at('right'), `#${tch}_armR`, { rotation: 0, duration: .4 });
  S(c.at('right'), eq, { opacity: 1 }); O(c.at('right'), eq, { scale: .5, svgOrigin: '960 500' }, { scale: 1, duration: .5, ease: 'back.out(2)' });
  happy(ids[1], c.L(c.Lt('ห้าลูกครับ')), c.t1); happy(tch, c.at('right'), c.t1); T(c.L(c.Lt('ห้าลูกครับ')), `#${ids[1]}_armR`, { rotation: -150, duration: .3 }); T(c.Le(c.Lt('ห้าลูกครับ')) + .4, `#${ids[1]}_armR`, { rotation: 0, duration: .3 });
  cam(W, c.t0, c.s.dur, 1.0, 1.05, 960, 400);
  return { speakers: { T: tch, B: ids[1], G: ids[0], O: ids[2], C: ids }, blink: [tch, ...ids] };
};

/* ---------- MUSIC ---------- */
SC.music = c => {
  const W = G(c.root, { id: 'muW' }); classroom(W); chalk(W, 'ดนตรีไทย', 960, 300, 110);
  const ids = kidSet(W, 'mu', [1100, 1380, 1660], 880, .82, { bag: null });
  const tch = adult(W, 'muTc', 'teacher'); place(tch, 300, 1010, .95);
  const dr = drum(W, 'muDr', 700, 1020, 1.1), ch = ching(W, 'muCh', 1000, 990, 1.2), rn = ranat(W, 'muRn', 1420, 1030, 1.05);
  const notes = G(W); for (let i = 0; i < 8; i++) { const w = G(notes, { transform: `translate(${660 + (i % 4) * 30},${820})` }); const t = el('text', { class: 'muNote', 'font-size': 60, fill: ['#E53935', '#1E88E5', '#43A047', '#FB8C00'][i % 4], opacity: 0 }, w); t.textContent = i % 2 ? '♪' : '♫'; }
  const hi = (t, g, ox, oy) => O(t, g, { scale: 1 }, { scale: 1.15, duration: .25, yoyo: true, repeat: 3, svgOrigin: `${ox} ${oy}` });
  hi(c.at('drum'), dr, 700, 1020); T(c.at('drum') + .2, '#muTc_armR', { rotation: -60, duration: .3 }); T(c.at('drum') + 1.2, '#muTc_armR', { rotation: 0, duration: .3 });
  hi(c.at('ching'), ch, 1000, 990); hi(c.at('ranat'), rn, 1420, 1030); tl.fromTo('.muRnBar', { fill: '#E3B35F' }, { fill: '#FFF3A6', duration: .12, stagger: .1, yoyo: true, repeat: 1, immediateRender: false }, c.at('ranat') + .2);
  happy(ids[0], c.L(c.Lt('เสียงเพราะ')), c.Le(c.Lt('เสียงเพราะ')) + .5); happy(ids[2], c.L(c.Lt('ผมชอบกลอง')), c.Le(c.Lt('ผมชอบกลอง')) + .5);
  const play = c.at('play'); walkCycle(ids[2], play - 1.6, play - .1, .25); T(play - 1.6, `#${ids[2]}`, { x: 720, y: 900, duration: 1.5 });
  O(play, `#${ids[2]}_armL`, { rotation: 20 }, { rotation: -30, duration: .16, repeat: 28, yoyo: true }); O(play + .08, `#${ids[2]}_armR`, { rotation: -20 }, { rotation: 30, duration: .16, repeat: 28, yoyo: true });
  S(play + 4.8, [`#${ids[2]}_armL`, `#${ids[2]}_armR`], { rotation: 0 }); happy(ids[2], play, c.t1);
  tl.fromTo('.muNote', { opacity: 0, y: 0, x: 0 }, { opacity: 1, y: -220, x: (i) => (i % 2 ? 60 : -60), duration: 1.4, stagger: .35, repeat: 1, immediateRender: false }, play + .2);
  const yay = c.L(c.Lt('ดีใจจังเลย')); [ids[0], ids[1]].forEach(id => { happy(id, yay, c.t1); hop(`#${id}`, yay, 2, 880, 40); }); happy('muTc', c.L(c.Lt('ต้นตีกลอง')), c.t1);
  cam(W, c.t0, c.s.dur, 1.0, 1.06, 960, 800);
  return { speakers: { T: 'muTc', B: ids[1], G: ids[0], O: ids[2], C: ids }, blink: ['muTc', ...ids] };
};

/* ---------- ANNOUNCE ---------- */
SC.announce = c => {
  const { W, board, ids, tch } = classScene(c, 'an2', { tx: 480 });
  const ban = G(board); chalk(ban, 'งานวันเด็ก', 960, 360, 150, '', '#FFE27A'); [700, 1220].forEach(x => { el('circle', { cx: x, cy: 460, r: 34, fill: '#FF6B8A' }, ban); el('path', { d: `M${x},494 q-10,30 6,60`, stroke: '#fff', 'stroke-width': 3, fill: 'none' }, ban); }); S(c.t0, ban, { opacity: 0 });
  const ann = c.L(c.Lt('อีกสองสัปดาห์')); S(ann, ban, { opacity: 1 }); O(ann, ban, { scale: .4, svgOrigin: '960 360' }, { scale: 1, duration: .6, ease: 'back.out(2)' });
  const cf = G(W); confetti(cf, 'anCf', 1420, 600, 40, 5); const cheer = c.at('cheer');
  tl.fromTo('.anCf', { opacity: 1, x: 0, y: 0, rotation: 0 }, { opacity: 0, x: () => R(-700, 700), y: () => R(-500, 300), rotation: () => R(-400, 400), duration: 2, ease: 'power2.out', stagger: .01, immediateRender: false }, cheer);
  ids.forEach(id => { happy(id, cheer, cheer + 2.5); hop(`#${id}`, cheer, 2, 1075, 40); }); happy(tch, cheer, cheer + 3);
  const kw = c.at('kaew'); T(kw, `#${ids[0]}_armL`, { rotation: 150, duration: .3 }); T(kw, `#${ids[0]}_armR`, { rotation: -150, duration: .3 }); O(kw + .3, `#${ids[0]}_body`, { rotation: -6 }, { rotation: 6, duration: .4, repeat: 5, yoyo: true, svgOrigin: '0 0' }); T(kw + 2.8, [`#${ids[0]}_armL`, `#${ids[0]}_armR`, `#${ids[0]}_body`], { rotation: 0, duration: .3 }); happy(ids[0], kw, kw + 3);
  const tn = c.at('ton'); O(tn, `#${ids[2]}_armL`, { rotation: 20 }, { rotation: -40, duration: .18, repeat: 13, yoyo: true }); O(tn + .09, `#${ids[2]}_armR`, { rotation: -20 }, { rotation: 40, duration: .18, repeat: 13, yoyo: true }); S(tn + 2.8, [`#${ids[2]}_armL`, `#${ids[2]}_armR`], { rotation: 0 }); happy(ids[2], tn, tn + 3);
  const wr = c.at('worry'); const q = qmark(W, 'anQ', 1440, 560); S(wr, q, { opacity: 1 }); O(wr, q, { y: 30 }, { y: 0, duration: .4, ease: 'back.out(3)' }); loop(wr + .4, c.t1, q, { rotation: -8, svgOrigin: '1440 530' }, { rotation: 8 }, .5);
  sad(ids[1], wr, c.t1); T(wr, `#${ids[1]}_head`, { rotation: -10, duration: .5 });
  cam(W, c.t0, wr - c.t0, 1.0, 1.0, 960, 540); cam(W, wr, c.t1 - wr, 1.0, 1.4, 1420, 760);
  return { speakers: { T: tch, B: ids[1], G: ids[0], O: ids[2], C: ids }, blink: [tch, ...ids] };
};

/* ---------- RECESS ---------- */
SC.recess = c => {
  const W = G(c.root, { id: 'reW' }); const cl = schoolYard(W); T(c.t0, cl, { x: 80, duration: c.s.dur, ease: 'none' });
  const pg = G(W); el('path', { d: 'M1500,1000 L1620,780 L1650,780 L1530,1000Z', fill: '#FF7043' }, pg); el('rect', { x: 1640, y: 760, width: 16, height: 240, fill: '#607D8B' }, pg); el('rect', { x: 1700, y: 760, width: 16, height: 240, fill: '#607D8B' }, pg); el('rect', { x: 1630, y: 752, width: 96, height: 16, fill: '#607D8B' }, pg);
  const tr = tree(W, 380, 1000, 1.1);
  const kk = kid(W, 'reK', KAEW); place(kk, 960, 990, 1.0); const kb = kid(W, 'reB', KHAO); place(kb, 700, 990, 1.0); const kt = kid(W, 'reT', TON); place(kt, 1220, 990, 1.0);
  const sitB = kid(W, 'reBs', { ...KHAO, pose: 'sit' }); place(sitB, 470, 990, 1.0); gsap.set(sitB, { opacity: 0 });
  const ropeA = el('path', { d: 'M850,870 Q960,480 1070,870', fill: 'none', stroke: '#E53935', 'stroke-width': 7, opacity: 0 }, W); const ropeB = el('path', { d: 'M850,870 Q960,1060 1070,870', fill: 'none', stroke: '#E53935', 'stroke-width': 7, opacity: 0 }, W);
  const jump = c.at('jump'), tag = c.at('tag'), chase = c.at('chase'), sadT = c.at('sad'), hug = c.at('hug');
  const cl1 = c.L(c.Lt('หนึ่ง สอง')), d1 = c.line(c.Lt('หนึ่ง สอง')).d, cl2 = c.L(c.Lt('หก เจ็ด')), d2 = c.line(c.Lt('หก เจ็ด')).d;
  const jumps = []; for (let i = 0; i < 5; i++) jumps.push(cl1 + i * d1 / 5); for (let i = 0; i < 5; i++) jumps.push(cl2 + i * d2 / 5);
  const nums = jumps.map((t, i) => domEl(c.dom, 'num', String(i + 1), `left:${560 + (i % 5) * 170}px;top:${i < 5 ? 150 : 260}px`));
  S(jump, [ropeA], { opacity: 1 });
  jumps.forEach((t, i) => { O(t, kk, { y: 990 }, { y: 900, duration: .16, yoyo: true, repeat: 1, ease: 'power1.out' }); S(t, ropeA, { opacity: 0 }); S(t, ropeB, { opacity: 1 }); S(t + .3, ropeB, { opacity: 0 }); S(t + .3, ropeA, { opacity: 1 }); popIn(t, nums[i], .3); });
  S(tag - .1, [ropeA, ropeB], { opacity: 0 }); nums.forEach(n => T(tag - .3, n, { opacity: 0, duration: .3 }));
  happy('reK', c.L(c.Lt('ดีใจจัง กระโดด')), tag); hop('#reK', c.L(c.Lt('ดีใจจัง กระโดด')), 2, 990, 50);
  ['reB', 'reK'].forEach(id => happy(id, chase, sadT - 1));
  walkCycle('reB', chase, sadT - .6, .17, 30); walkCycle('reK', chase, sadT - .6, .17, 30); walkCycle('reT', chase + .2, sadT - .6, .17, 30);
  T(chase, kb, { keyframes: [{ x: 1600, duration: 1.6 }, { x: 300, duration: 1.8 }, { x: 700, duration: 1.0 }] }); T(chase, kk, { keyframes: [{ x: 1750, duration: 1.7 }, { x: 450, duration: 1.8 }, { x: 960, duration: .9 }] }); T(chase + .2, kt, { keyframes: [{ x: 1500, duration: 1.4 }, { x: 250, duration: 2.0 }, { x: 1220, duration: 1.0 }] });
  S(sadT - .5, kb, { opacity: 0 }); S(sadT - .5, sitB, { opacity: 1 }); sad('reBs', sadT - .5, hug); T(sadT - .5, '#reBs_head', { rotation: -10, duration: .4 }); T(hug, '#reBs_head', { rotation: 0, duration: .4 });
  walkCycle('reK', sadT, sadT + 1.2, .25); T(sadT, kk, { x: 640, duration: 1.2 }); walkCycle('reT', sadT, sadT + 1.4, .25); T(sadT, kt, { x: 300, duration: 1.4 });
  T(hug, '#reK_armL', { rotation: 70, duration: .4 }); T(hug, '#reT_armR', { rotation: -70, duration: .4 }); happy('reBs', hug + .2, c.t1); happy('reK', hug, c.t1); happy('reT', hug, c.t1);
  const hs = G(W); for (let i = 0; i < 4; i++) { const w = G(hs, { transform: `translate(${400 + i * 50},${650})` }); el('path', { class: 'reHeart', d: 'M0,0 C-20,-22 -44,4 0,34 C44,4 20,-22 0,0Z', fill: '#FF6B8A', opacity: 0 }, w); }
  tl.fromTo('.reHeart', { opacity: 0, y: 0, scale: .3 }, { opacity: 1, y: -80, scale: 1, duration: .7, stagger: .25, ease: 'back.out(2)', immediateRender: false }, hug + .4); tl.to('.reHeart', { opacity: 0, y: -200, duration: 1, stagger: .25 }, hug + 1.4);
  cam(W, c.t0, sadT - c.t0, 1.0, 1.0, 960, 540); cam(W, sadT - .5, c.t1 - sadT + .5, 1.0, 1.3, 480, 800);
  return { speakers: ln => ({ G: 'reK', O: 'reT', B: c.t0 + ln.t < sadT - .5 ? 'reB' : 'reBs', C: ['reK', 'reB', 'reT'] })[ln.who] || null, blink: ['reK', 'reB', 'reT', 'reBs'] };
};
