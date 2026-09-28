/* งานวันเด็ก ตอนที่ 3 — scenes: title, recap, wakeup, breakfast, dressup, thui, journey, arrive, quiz, draw, sack, ring, face, snack, lost, picnic */
const KAEWC = { ...KAEW, uniform: false, shirt: '#F48FB1', collar: '#E0648C', lowerColor: '#8E44AD' };
const TONC = { ...TON, uniform: false, shirt: '#42A5F5', collar: '#1E88E5', lowerColor: '#37474F' };
function trioFair(p, pre, xs, y, s) { const k = kid(p, pre + 'K', KAEWC); place(k, xs[0], y, s); const b = kid(p, pre + 'B', FARMER); place(b, xs[1], y, s); sash(pre + 'B'); const t = kid(p, pre + 'T', TONC); place(t, xs[2], y, s); return [pre + 'K', pre + 'B', pre + 'T']; }
function fairYard(W, opt = {}) { const cl = schoolYard(W, opt.sky || 'gDay'); bunting(W, 'fyF' + (opt.k || ''), 560, 1560, 470, 40); bunting(W, 'fyG' + (opt.k || ''), 0, 560, 560, 30); bunting(W, 'fyH' + (opt.k || ''), 1560, 1920, 560, 30);
  if (opt.balloons !== false) { const cols = ['#FF6B8A', '#FFD84D', '#4FC3F7', '#8BC34A', '#B58CFF']; [[120, 700], [1800, 690], [240, 660], [1690, 650]].forEach(([x, y], i) => balloon(W, 'fyBal' + (opt.k || ''), x, y, cols[i % 5], 1)); } return cl; }

/* ---------- TITLE ---------- */
SC.title = c => {
  const W = G(c.root, { id: 'ti_w' }); fairYard(W, { k: 'ti' }); const ids = trioFair(W, 'ti', [700, 960, 1220], 1060, .8);
  tl.to('.fyBalti', { y: -20, duration: 1.2, yoyo: true, repeat: Math.floor(c.s.dur / 1.2), stagger: .2 }, c.t0);
  ids.forEach((id, i) => { hop(`#${id}`, c.t0 + 3 + i * .2, 3, 1060, 30); happy(id, c.t0 + 3, c.t1); });
  cam(W, c.t0, c.s.dur, 1.12, 1.0, 960, 760, 'power1.out'); confettiAt(W, 'tiCf', 960, 300, c.t0 + 2.2, 40);
  const ov = domEl(c.dom, 'ov', '<div class="t1">ชาวนาตัวน้อย</div><div class="t2">งานวันเด็ก · ตอนที่ 3</div><div class="e2" style="margin-top:18px">วันงานวันเด็ก</div>'); S(c.t0, ov, { opacity: 1 });
  popIn(c.t0 + .5, ov.children[0], .9); O(c.t0 + 1.3, ov.children[1], { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: .7, ease: 'back.out(1.8)' }); O(c.t0 + 2.0, ov.children[2], { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power2.out' });
  loop(c.t0 + 2.6, c.t1 - 2, ov.children[0], { scale: 1 }, { scale: 1.05 }, .9);
  T(c.t1 - 1.4, ov.children[0], { y: -500, opacity: 0, duration: .7, ease: 'back.in(1.5)' }); T(c.t1 - 1.3, [ov.children[1], ov.children[2]], { y: 400, opacity: 0, duration: .6, ease: 'back.in(1.5)' });
  return { blink: ids };
};
/* ---------- RECAP ---------- */
SC.recap = c => {
  const A = G(c.root, { id: 'rc3A' }); const h = stageHall(A); signBoard(A, 960, 330, .9, 'ชาวนาตัวน้อย'); const t = kid(A, 'rc3T', TON); place(t, 600, 760, .9); drum(A, 'rc3Dr', 600, 780, .6); const k = kid(A, 'rc3K', KAEW); place(k, 1320, 760, .9); const b = kid(A, 'rc3B', FARMER); place(b, 960, 760, .95); sash('rc3B');
  drumming('rc3T', c.t0 + .5, c.at('rain') - .5, .45); danceStep('rc3K', c.t0 + .5, c.at('rain') - .5, 1.2, 5); ['rc3T', 'rc3K', 'rc3B'].forEach(id => happy(id, c.t0, c.at('rain')));
  const Bq = G(c.root, { id: 'rc3B2', opacity: 0 }); const dk = shelterSet(Bq, 'rc3'); const rg = rainSys(Bq, 'rc3Drop', 100); Bq.insertBefore(rg, dk.sala); const ids = kidSet(Bq, 'rc3s', [640, 960, 1280], 950, .9, { bag: null });
  const rain = c.at('rain'), today = c.at('today'); T(rain - .4, A, { opacity: 0, duration: .5 }); T(rain - .4, Bq, { opacity: 1, duration: .5 }); rainRun(rg, 'rc3Drop', rain - .4, today + .2); ids.forEach(id => happy(id, rain + 2, today));
  const Cq = G(c.root, { id: 'rc3C', opacity: 0 }); const cl = fairYard(Cq, { k: 'rc' }); const cIds = trioFair(Cq, 'rc3c', [700, 960, 1220], 1040, 1.0);
  T(today - .4, Bq, { opacity: 0, duration: .5 }); T(today - .4, Cq, { opacity: 1, duration: .5 }); cIds.forEach((id, i) => { happy(id, today, c.t1); hop(`#${id}`, today + .4 + i * .15, 2, 1040, 40); }); confettiAt(Cq, 'rc3Cf', 960, 400, today + .3, 40);
  cam(A, c.t0, rain - c.t0, 1.0, 1.06, 960, 560); cam(Cq, today, c.t1 - today, 1.0, 1.08, 960, 800);
  return { blink: ['rc3T', 'rc3K', 'rc3B', ...ids, ...cIds] };
};
/* ---------- WAKEUP ---------- */
SC.wakeup = c => {
  const W = G(c.root, { id: 'wuW' }); el('rect', { width: 1920, height: 800, fill: 'url(#pWall)' }, W);
  const win = G(W); el('rect', { x: 1240, y: 150, width: 440, height: 340, fill: 'url(#gDawn)' }, win); sun(win, null, 1460, 470, 'gSunset', '#FFB25C'); el('rect', { x: 1228, y: 138, width: 464, height: 364, fill: 'none', stroke: '#6A4428', 'stroke-width': 24 }, W);
  el('rect', { y: 780, width: 1920, height: 300, fill: 'url(#pPlank)' }, W); el('path', { d: 'M470,940 L1330,940 L1290,800 L510,800Z', fill: 'url(#pMat)' }, W); el('ellipse', { cx: 640, cy: 845, rx: 95, ry: 40, fill: '#F7F2E8' }, W);
  const cal = G(W); el('rect', { x: 200, y: 200, width: 220, height: 240, rx: 12, fill: '#fff', stroke: '#C8B68A', 'stroke-width': 5 }, cal); el('rect', { x: 200, y: 200, width: 220, height: 60, rx: 12, fill: '#E53935' }, cal); const ct = el('text', { x: 310, y: 244, 'text-anchor': 'middle', 'font-family': 'K', 'font-weight': 700, 'font-size': 34, fill: '#fff' }, cal); ct.textContent = 'มกราคม'; const cn = el('text', { x: 310, y: 380, 'text-anchor': 'middle', 'font-family': 'K', 'font-weight': 700, 'font-size': 110, fill: '#333' }, cal); cn.textContent = 'เสาร์';
  gsap.set(cn, { attr: { 'font-size': 80 } });
  const lying = kid(W, 'wuBl', { ...KHAO, uniform: false, shirt: '#3D8C6E', collar: '#2E6E55', shadow: false }); gsap.set(lying, { svgOrigin: '0 0', x: 960, y: 870, rotation: -90, scale: 1.05 }); closed('wuBl', c.t0, c.at('jump') - 2);
  const blanket = G(W, { id: 'wuBk' }); el('path', { d: 'M800,790 Q900,760 1040,790 L1060,900 L790,900Z', fill: '#7FB3E8' }, blanket); for (let i = 0; i < 5; i++) el('rect', { x: 800 + i * 52, y: 786, width: 16, height: 112, fill: '#5E97D4', opacity: .6 }, blanket);
  const st = kid(W, 'wuB', { ...KHAO, uniform: false, shirt: '#3D8C6E', collar: '#2E6E55' }); place(st, 960, 1000, 1.1); gsap.set(st, { opacity: 0 });
  const folded = G(W, { opacity: 0 }); el('rect', { x: 1400, y: 900, width: 180, height: 60, rx: 12, fill: '#7FB3E8' }, folded); el('rect', { x: 1400, y: 930, width: 180, height: 6, fill: '#5E97D4' }, folded);
  const glow = el('rect', { width: 1920, height: 1080, fill: '#FFB25C', opacity: .12 }, W);
  const jump = c.at('jump'), fold = c.at('fold'); O(c.L(0), cal, { scale: 1 }, { scale: 1.08, svgOrigin: '310 320', duration: .4, yoyo: true, repeat: 3 });
  S(jump - .2, [lying], { opacity: 0 }); S(jump - .2, st, { opacity: 1 }); O(jump - .2, st, { y: 1000 }, { y: 900, duration: .25, yoyo: true, repeat: 1, ease: 'power1.out' }); happy('wuB', jump - .2, c.t1); T(jump, '#wuB_armL', { rotation: 150, duration: .3 }); T(jump, '#wuB_armR', { rotation: -150, duration: .3 }); T(jump + 2.2, ['#wuB_armL', '#wuB_armR'], { rotation: 0, duration: .3 });
  T(fold, blanket, { x: 560, y: 90, scaleX: .2, scaleY: .5, svgOrigin: '930 840', opacity: 0, duration: 1.2 }); S(fold + 1.1, folded, { opacity: 1 }); O(fold + 1.1, folded, { scale: .3, svgOrigin: '1490 930' }, { scale: 1, duration: .4, ease: 'back.out(2)' }); T(fold, '#wuB_armR', { rotation: 60, duration: .4, yoyo: true, repeat: 3 });
  cam(W, c.t0, c.s.dur, 1.0, 1.08, 900, 700);
  return { speakers: { B: 'wuB' }, blink: ['wuB'] };
};
/* ---------- BREAKFAST ---------- */
SC.breakfast = c => {
  const W = G(c.root, { id: 'bfW' }); mealRoom(W, 'bfR', false);
  const mm = adult(W, 'bfM', 'mom', { pose: 'sit' }); place(mm, 470, 930, .88); const b = kid(W, 'bfB', { ...KHAO, pose: 'sit', uniform: false, shirt: '#3D8C6E', collar: '#2E6E55' }); place(b, 960, 868, 1.0); const dd = adult(W, 'bfF', 'dad', { pose: 'sit' }); place(dd, 1450, 930, .88);
  mealTray(W, 'bfT'); const eat = c.at('eat');
  eatLoop('bfB', eat + .2, c.L(c.Lt('ครับแม่ ไข่เจียว')) - .2, 132, 1.2); eatLoop('bfF', eat + .5, c.L(c.Lt('ตื่นเต้นไหม')) - .2, 140, 1.5); eatLoop('bfM', eat + 1, c.L(c.Lt('กินข้าวให้อิ่ม')) - .2, 140, 1.4);
  happy('bfB', c.L(c.Lt('ครับแม่ ไข่เจียว')), c.L(c.Lt('ตื่นเต้นไหม'))); sad('bfB', c.L(c.Lt('นิดหน่อยครับ')), c.L(c.Lt('นิดหน่อยครับ')) + 1.4); happy('bfB', c.L(c.Lt('ดีมากลูก')), c.t1); happy('bfF', c.L(c.Lt('ดีมากลูก')), c.t1); happy('bfM', c.L(c.Lt('ดีมากลูก')), c.t1);
  eatLoop('bfB', c.Le(c.Lt('ดีมากลูก')) + .2, c.t1, 132, 1.2);
  cam(W, c.t0, c.s.dur, 1.0, 1.1, 960, 700);
  return { speakers: { B: 'bfB', F: 'bfF', M: 'bfM' }, blink: ['bfB', 'bfF', 'bfM'] };
};
/* ---------- DRESS UP ---------- */
SC.dressup = c => {
  const W = G(c.root, { id: 'duW' }); mealRoom(W, 'duR', false);
  const mm = adult(W, 'duM', 'mom'); place(mm, 560, 1000, .95); const dd = adult(W, 'duF', 'dad'); place(dd, 1380, 1000, .95);
  const b0 = kid(W, 'duB0', { ...KHAO, uniform: false, shirt: '#3D8C6E', collar: '#2E6E55' }); place(b0, 960, 1000, 1.1); const b1 = kid(W, 'duB', FARMER); place(b1, 960, 1000, 1.1); sash('duB'); gsap.set(b1, { opacity: 0 }); gsap.set(['#duB_sash', '#duB_hat'], { opacity: 0 });
  const sh = c.at('shirt'), sa = c.at('sash'), ht = c.at('hat');
  T(sh - .4, '#duM_armR', { rotation: -50, duration: .3 }); T(sh + .4, '#duM_armR', { rotation: 0, duration: .3 });
  O(sh, b0, { scaleX: 1.1 }, { scaleX: 0, duration: .3, ease: 'power1.in' }); S(sh + .3, b0, { opacity: 0 }); S(sh + .3, b1, { opacity: 1 }); O(sh + .3, b1, { scaleX: 0 }, { scaleX: 1.1, duration: .35, ease: 'back.out(2)' }); sparkAt(W, 'duSpk', 960, 650, sh + .3, 12, 220);
  T(sa - .3, '#duF_armL', { rotation: -40, duration: .3 }); S(sa + .3, '#duB_sash', { opacity: 1 }); O(sa + .3, '#duB_sash', { scaleX: 0 }, { scaleX: 1, svgOrigin: '0 -117', duration: .5 }); T(sa + 1, '#duF_armL', { rotation: 0, duration: .3 });
  const h2 = G(W, { opacity: 0 }); el('path', { d: 'M-128,-292 Q0,-392 128,-292 Q0,-270 -128,-292Z', fill: '#E3B35F' }, h2); el('path', { d: 'M-70,-302 Q0,-330 70,-302', fill: 'none', stroke: '#D9453B', 'stroke-width': 8 }, h2); place(h2, 620, 560, .7);
  T(ht - .3, '#duM_armR', { rotation: -60, duration: .3 }); S(ht, h2, { opacity: 1 }); T(ht, h2, { x: 960, y: 1000, scale: 1.1, duration: .7, ease: 'power2.inOut' }); S(ht + .7, h2, { opacity: 0 }); S(ht + .7, '#duB_hat', { opacity: 1 }); T(ht + .8, '#duM_armR', { rotation: 0, duration: .3 });
  happy('duB', sh + .5, c.t1); happy('duF', c.L(c.Lt('เรียบร้อยแล้ว')), c.t1); happy('duM', ht, c.t1); hearts(W, 'duHeart', 900, 520, c.L(c.Lt('แม่เชื่อว่า')) + .6);
  cam(W, c.t0, c.s.dur, 1.0, 1.08, 960, 720);
  return { speakers: ln => ({ F: 'duF', M: 'duM', B: c.t0 + ln.t < sh + .3 ? 'duB0' : 'duB' })[ln.who] || null, blink: ['duB0', 'duB', 'duF', 'duM'] };
};
/* ---------- THUI (garland) ---------- */
SC.thui = c => {
  const W = G(c.root, { id: 'thW' }); villageWide(W, { sunX: 1500, sunY: 230 }); el('rect', { y: 870, width: 1920, height: 210, fill: '#C19A67' }, W); grassTufts(W, 880, 30, '#6FAF4B', '#5FA442', 34);
  const bu = buffalo(W, 'thU'); place(bu, 700, 1000, 1.2); const gl = garland($('thU_head'), 150, -150, 60, 70, 'thGar'); gsap.set(gl, { opacity: 0 });
  const b = kid(W, 'thB', FARMER); place(b, 1250, 1010, 1.1, true); sash('thB');
  const g0 = c.at('garland'); T(g0 - .4, '#thB_armR', { rotation: -70, duration: .3 }); S(g0 + .2, gl, { opacity: 1 }); O(g0 + .2, gl, { scale: .3, svgOrigin: '150 -110' }, { scale: 1, duration: .5, ease: 'back.out(2)' }); T(g0 + 1, '#thB_armR', { rotation: 0, duration: .3 }); sparkAt(W, 'thSpk', 800, 700, g0 + .3, 10, 160);
  loop(c.t0, c.t1, '#thU_tail', { rotation: -10 }, { rotation: 14 }, .6); TIMELINE.sfx.filter(x => x.name === 'moo' && x.t > c.t0 && x.t < c.t1).forEach(m => { T(m.t - .1, '#thU_head', { rotation: -18, duration: .35 }); T(m.t + 1.3, '#thU_head', { rotation: 0, duration: .4 }); });
  happy('thB', g0, c.t1); closed('thU', g0 + .8, g0 + 3); waveArm('thB', c.L(c.Lt('ทุยก็หล่อ')) + 1.4, 5); hearts(W, 'thHeart', 760, 620, g0 + 1.2);
  walkCycle('thB', c.t1 - 2.2, c.t1 + .5, .27); S(c.t1 - 2.2, b, { scaleX: 1.1 }); T(c.t1 - 2.2, b, { x: 2100, duration: 2.7, ease: 'none' });
  cam(W, c.t0, c.s.dur, 1.0, 1.1, 960, 780);
  return { speakers: { B: 'thB' }, blink: ['thB'] };
};
/* ---------- JOURNEY ---------- */
SC.journey = c => {
  const W = G(c.root, { id: 'jnW' }); sky(W, null, 'gDay'); sun(W, null, 1650, 140); const cl = G(W); cloud(cl, 200, 170, 1); cloud(cl, 1100, 120, 1.2); cloud(cl, 1900, 200, .8);
  const far = G(W); mountains(far); mountains(G(far, { transform: 'translate(1920,0)' })); const mid = G(W); seed(44); for (let i = 0; i < 16; i++) { const x = i * 260 + R(-40, 40); if (i % 5 === 2) stiltHouse(mid, x, 700, .7); else if (i % 3 === 0) tree(mid, x, 710, .7); else palm(mid, x, 705, R(220, 300), .85); }
  field(W, '#8BCF5E', '#5FAF45', null, 700); el('rect', { y: 840, width: 1920, height: 110, fill: '#C9A26C' }, W); const fl = G(W); flowers(fl, 950, 1070, 40, 9); grassTufts(fl, 1080, 26, '#5FA442', '#6FAF4B', 50);
  const mom = adult(W, 'jnM', 'mom'); place(mom, 360, 960, .8); const b = kid(W, 'jnB', FARMER); place(b, 520, 960, .75); sash('jnB'); const dad = adult(W, 'jnF', 'dad'); place(dad, 680, 960, .8);
  const yai = adult(W, 'jnY', 'yai'); place(yai, 2150, 960, .8, true); const k = kid(W, 'jnK', KAEWC); place(k, 2300, 960, .72, true); const td = adult(W, 'jnD', 'dad'); recolor(td, TONDAD); place(td, 2460, 960, .8, true); const t = kid(W, 'jnT', TONC); place(t, 2600, 960, .75, true); const dr = drum($('jnT_armR'), 'jnDr', 60, -100, .35);
  const meet = c.at('meet'), walk = c.at('walk');
  ['jnM', 'jnB', 'jnF'].forEach(id => walkCycle(id, c.t0, meet, .3)); T(c.t0, far, { x: -60, duration: meet - c.t0, ease: 'none' }); T(c.t0, mid, { x: -500, duration: meet - c.t0, ease: 'none' }); T(c.t0, fl, { x: -800, duration: meet - c.t0, ease: 'none' });
  const arr = [[yai, 'jnY', 1080], [k, 'jnK', 1240], [td, 'jnD', 1420], [t, 'jnT', 1580]]; arr.forEach(([g, id, x], i) => { walkCycle(id, meet - .5 + i * .1, meet + 1.6, .3); T(meet - .5 + i * .1, g, { x, duration: 2.1, ease: 'power1.out' }); });
  waveArm('jnK', c.L(c.Lt('สวัสดีค่ะ')), 4, 'L'); happy('jnK', c.L(c.Lt('สวัสดีค่ะ')), c.t1); happy('jnB', c.L(c.Lt('สวัสดีค่ะ')) + .5, c.t1); happy('jnT', c.L(c.Lt('ผมเอากลอง')), c.t1); happy('jnY', c.L(c.Lt('ไปกันเถอะ')), c.t1);
  [['jnY', 1080], ['jnK', 1240], ['jnD', 1420], ['jnT', 1580]].forEach(([id]) => S(walk, `#${id}`, { scaleX: id === 'jnK' ? .72 : id === 'jnT' ? .75 : .8 }));
  const all = ['jnM', 'jnB', 'jnF', 'jnY', 'jnK', 'jnD', 'jnT']; all.forEach((id, i) => { walkCycle(id, walk + i * .05, c.t1 + .6, .3); T(walk, `#${id}`, { x: `+=${1500}`, duration: c.t1 - walk + .5, ease: 'power1.in' }); });
  cam(W, c.t0, c.s.dur, 1.0, 1.05, 960, 760);
  return { speakers: { G: 'jnK', O: 'jnT', Y: 'jnY', B: 'jnB' }, blink: all };
};
/* ---------- ARRIVE ---------- */
SC.arrive = c => {
  const W = G(c.root, { id: 'arW' }); fairYard(W, { k: 'ar' }); tl.to('.fyBalar', { y: -20, duration: 1.2, yoyo: true, repeat: Math.floor(c.s.dur / 1.2), stagger: .2 }, c.t0);
  const mates = classmates(W, 'arm', [[900, .6, [300, 420, 1500, 1640]]], 5); const tch = adult(W, 'arTc', 'teacher'); place(tch, 1500, 1050, .95, true);
  const ids = trioFair(W, 'ar', [620, 860, 1100], 1050, 1.0);
  const tb = G(W); el('rect', { x: 1640, y: 900, width: 260, height: 26, rx: 6, fill: '#C08A54' }, tb); el('rect', { x: 1660, y: 926, width: 16, height: 110, fill: '#8E5E34' }, tb); el('rect', { x: 1864, y: 926, width: 16, height: 110, fill: '#8E5E34' }, tb);
  const gifts = [0, 1, 2].map(i => { const g = G(W); place(g, 1690 + i * 80, 900, 1); el('rect', { x: -30, y: -56, width: 60, height: 56, rx: 6, fill: ['#E53935', '#1E88E5', '#43A047'][i] }, g); el('rect', { x: -6, y: -56, width: 12, height: 56, fill: '#FDD835' }, g); el('path', { d: 'M0,-56 q-20,-24 -26,-6 q10,8 26,6 q20,-24 26,-6 q-10,8 -26,6', fill: '#FDD835' }, g); return g; });
  const tc = c.at('teacher'), gf = c.at('gift'); waveArm('arTc', tc, 5, 'L'); happy('arTc', tc, c.t1); ids.forEach(id => wai(id, c.L(c.Lt('สวัสดีครับคุณครู')), 1.6));
  gifts.forEach((g, i) => { T(gf + .5 + i * .3, g, { x: [620, 860, 1100][i], y: 960, duration: .8, ease: 'power2.inOut' }); }); ids.forEach(id => { happy(id, gf + .8, c.t1); T(gf + .8, `#${id}_armL`, { rotation: -30, duration: .3 }); T(gf + .8, `#${id}_armR`, { rotation: 30, duration: .3 }); });
  sparkAt(W, 'arSpk', 860, 760, gf + 1.3, 12, 320);
  cam(W, c.t0, c.s.dur, 1.0, 1.06, 960, 760);
  return { speakers: { T: 'arTc', G: ids[0], B: ids[1], O: ids[2], C: ids }, blink: ['arTc', ...ids, ...mates] };
};
/* ---------- QUIZ ---------- */
SC.quiz = c => {
  const W = G(c.root, { id: 'qzW' }); stageHall(W); const tch = adult(W, 'qzTc', 'teacher'); place(tch, 960, 760, .85);
  const ids = trioFair(W, 'qz', [620, 960, 1300], 1070, .95); const mates = classmates(W, 'qzm', [[1070, .7, [200, 1700]]], 2);
  const fl = thaiFlag(W, 'qzFlag', 1200, 360, 1.6); gsap.set(fl, { opacity: 0 }); const cal = G(W, { opacity: 0 }); el('rect', { x: 1150, y: 280, width: 200, height: 200, rx: 12, fill: '#fff', stroke: '#C8B68A', 'stroke-width': 5 }, cal); el('rect', { x: 1150, y: 280, width: 200, height: 50, rx: 12, fill: '#E53935' }, cal); const ct = el('text', { x: 1250, y: 318, 'text-anchor': 'middle', 'font-family': 'K', 'font-weight': 700, 'font-size': 30, fill: '#fff' }, cal); ct.textContent = 'มกราคม'; const cn = el('text', { x: 1250, y: 440, 'text-anchor': 'middle', 'font-family': 'K', 'font-weight': 700, 'font-size': 70, fill: '#333' }, cal); cn.textContent = 'เสาร์';
  const q1 = c.at('q1'), a1 = c.at('a1'), q2 = c.at('q2'), a2 = c.at('a2');
  S(c.L(c.Lt('คำถามแรก')), fl, { opacity: 1 }); O(c.L(c.Lt('คำถามแรก')), fl, { scale: .3 }, { scale: 1.6, duration: .5, ease: 'back.out(2)' }); T(c.L(c.Lt('คำถามที่สอง')) - .3, fl, { opacity: 0, duration: .3 });
  S(c.L(c.Lt('คำถามที่สอง')), cal, { opacity: 1 }); O(c.L(c.Lt('คำถามที่สอง')), cal, { scale: .3, svgOrigin: '1250 380' }, { scale: 1, duration: .5, ease: 'back.out(2)' });
  T(q1, `#${ids[1]}_armR`, { rotation: -150, duration: .3 }); T(a1, `#${ids[1]}_armR`, { rotation: 0, duration: .3 }); happy(ids[1], a1, c.t1); sparkAt(W, 'qzSpk1', 1200, 420, a1, 10, 180);
  T(q2, `#${ids[0]}_armL`, { rotation: 150, duration: .3 }); T(a2, `#${ids[0]}_armL`, { rotation: 0, duration: .3 }); happy(ids[0], a2, c.t1); sparkAt(W, 'qzSpk2', 1250, 380, a2, 10, 180); happy('qzTc', a1, c.t1);
  T(c.L(c.Lt('คำถามแรก')), '#qzTc_armL', { rotation: 60, duration: .3 }); T(a1, '#qzTc_armL', { rotation: 0, duration: .3 }); clapping(mates, c.L(c.Lt('ถูกต้องอีกแล้ว')) + 1.5, c.t1 - .5); clapping([ids[2]], c.L(c.Lt('ถูกต้องอีกแล้ว')) + 1.5, c.t1 - .5);
  cam(W, c.t0, c.s.dur, 1.0, 1.05, 960, 620);
  return { speakers: { T: 'qzTc', G: ids[0], B: ids[1], O: ids[2] }, blink: ['qzTc', ...ids, ...mates] };
};
/* ---------- DRAW contest ---------- */
SC.draw = c => {
  const W = G(c.root, { id: 'dwW' }); fairYard(W, { k: 'dw', balloons: false }); const ids = trioFair(W, 'dw', [620, 960, 1300], 990, .95);
  const tb = G(W); el('rect', { x: 360, y: 900, width: 1200, height: 30, rx: 8, fill: '#D59A5E' }, tb); el('rect', { x: 380, y: 930, width: 1160, height: 150, fill: '#B98352' }, tb);
  const pp = [620, 960, 1300].map(x => paper(W, x, 880, 180, 40));
  const tch = adult(W, 'dwTc', 'teacher'); place(tch, 1720, 1060, .9, true);
  const st = c.at('start'), sh = c.at('show'), bd = c.at('board'); ids.forEach((id, i) => { T(st, `#${id}_armR`, { rotation: 40, duration: .3 }); O(st + .3, `#${id}_armR`, { rotation: 36 }, { rotation: 48, duration: .12, repeat: 20 + i, yoyo: true }); S(sh - .1, `#${id}_armR`, { rotation: 0 }); });
  const pic = G(W, { opacity: 0 }); paper(pic, 960, 420, 520, 380); el('rect', { x: 720, y: 250, width: 480, height: 160, fill: '#BFE6F7' }, pic); el('circle', { cx: 1110, cy: 300, r: 30, fill: '#FFE45C' }, pic); el('rect', { x: 720, y: 410, width: 480, height: 190, fill: '#8BCF5E' }, pic); const bu = buffalo(pic, 'dwBu'); place(bu, 930, 570, .55);
  S(sh, pic, { opacity: 1 }); O(sh, pic, { scale: .3, svgOrigin: '960 880' }, { scale: 1, duration: .6, ease: 'back.out(1.8)' }); happy(ids[1], sh, c.t1); happy(ids[0], c.L(c.Lt('สวยมากเลย')), c.t1); happy('dwTc', c.L(c.Lt('ภาพของทุกคน')), c.t1);
  const brd = G(W, { opacity: 0 }); el('rect', { x: 560, y: 180, width: 800, height: 360, rx: 14, fill: '#C9A26C', stroke: '#8B5E34', 'stroke-width': 10 }, brd); [[700, '#FFCDD2'], [960, '#BFE6F7'], [1220, '#FFF59D']].forEach(([x, col]) => { el('rect', { x: x - 100, y: 240, width: 200, height: 240, fill: col, stroke: '#fff', 'stroke-width': 6 }, brd); el('circle', { cx: x, cy: 236, r: 9, fill: '#E53935' }, brd); });
  T(bd - .3, pic, { opacity: 0, duration: .3 }); S(bd, brd, { opacity: 1 }); O(bd, brd, { scale: .5, svgOrigin: '960 360' }, { scale: 1, duration: .5, ease: 'back.out(2)' }); ids.forEach(id => happy(id, bd, c.t1));
  cam(W, c.t0, c.s.dur, 1.0, 1.05, 960, 700);
  return { speakers: { T: 'dwTc', G: ids[0], B: ids[1], O: ids[2] }, blink: ['dwTc', ...ids] };
};
/* ---------- SACK RACE ---------- */
SC.sack = c => {
  const W = G(c.root, { id: 'skW' }); sky(W, null, 'gNoon'); cloud(W, 300, 140, .9); cloud(W, 1300, 110, 1); mountains(W, '#9CC4D2', '#86B89C', -60); school(W, 1500, 600, .45); bunting(W, 'skFl', 0, 1920, 380, 30);
  el('rect', { y: 590, width: 1920, height: 490, fill: '#6DB54A' }, W); [820, 900, 980].forEach(y => el('rect', { y, width: 1920, height: 5, fill: '#fff', opacity: .85 }, W)); const tape = el('rect', { x: 1640, y: 760, width: 12, height: 300, fill: '#E53935' }, W);
  const tch = adult(W, 'skTc', 'teacher'); place(tch, 110, 900, .85); const mates = classmates(W, 'skm', [[700, .5, [1760, 1850]]], 1);
  const k = kid(W, 'skK', KAEWC); place(k, 620, 870, .8); sack('skK'); const b = kid(W, 'skB', FARMER); place(b, 470, 950, .85); sack('skB'); sash('skB'); const t = kid(W, 'skT', TONC); place(t, 320, 1030, .9); sack('skT');
  const go = c.at('go'), win = c.at('win'); const end = win;
  const hopRun = (g, id, y0, x1, dur, h) => { T(go, g, { x: x1, duration: dur, ease: 'none' }); O(go, g, { y: y0 }, { y: y0 - h, duration: .2, repeat: Math.floor(dur / .2) - 1, yoyo: true, ease: 'power1.out' }); };
  hopRun(k, 'skK', 870, 1700, win - go, 40); hopRun(b, 'skB', 950, 1450, win - go + .6, 36); hopRun(t, 'skT', 1030, 1300, win - go + .6, 34);
  ['skK', 'skB', 'skT'].forEach(id => { T(go, [`#${id}_armL`, `#${id}_armR`], { rotation: (i) => i ? -20 : 20, duration: .2 }); happy(id, go, c.t1); });
  T(win - .2, tape, { opacity: 0, duration: .3 }); confettiAt(W, 'skCf', 1700, 700, win, 40); hop('#skK', win + .8, 3, 870, 40); T(win + .6, '#skK_armL', { rotation: 150, duration: .3 }); T(win + .6, '#skK_armR', { rotation: -150, duration: .3 });
  clapping(['skB', 'skT', ...mates], c.L(c.Lt('แก้วเก่งมาก')), c.L(c.Lt('แก้วเก่งมาก')) + 2);
  T(c.L(c.Lt('เตรียมตัว')), '#skTc_armR', { rotation: -150, duration: .3 }); T(go + 1, '#skTc_armR', { rotation: 0, duration: .3 });
  cam(W, c.t0, go - c.t0, 1.0, 1.0, 960, 540); cam(W, go, c.t1 - go, 1.0, 1.15, 1300, 880);
  return { speakers: { T: 'skTc', G: 'skK', B: 'skB', O: 'skT' }, blink: ['skTc', 'skK', 'skB', 'skT', ...mates] };
};
/* ---------- RING TOSS ---------- */
SC.ring = c => {
  const W = G(c.root, { id: 'rgW' }); fairYard(W, { k: 'rg' }); const tb = G(W); el('rect', { x: 1200, y: 800, width: 560, height: 30, rx: 8, fill: '#D59A5E' }, tb); el('rect', { x: 1220, y: 830, width: 520, height: 230, fill: '#B98352' }, tb);
  const bots = [[1300, '#4FC3F7'], [1420, '#81C784'], [1540, '#FFB74D'], [1660, '#F06292']].map(([x, col]) => bottle(W, x, 800, col)); const doll = elephantDoll(W, 1480, 700, .9); gsap.set(doll, { opacity: 0 });
  const t = kid(W, 'rgT', TONC); place(t, 700, 1040, 1.05); const k = kid(W, 'rgK', KAEWC); place(k, 420, 1040, 1.0); const b = kid(W, 'rgB', FARMER); place(b, 220, 1040, 1.0); sash('rgB');
  const toss = (t0, x1, y1, ok, col) => { const r = ringToy(W, 'rgR' + Math.round(t0 * 10), col); gsap.set(r, { x: 760, y: 700, opacity: 0 }); S(t0 + .3, r, { opacity: 1 }); T(t0 + .3, r, { keyframes: [{ x: (760 + x1) / 2, y: 460, duration: .45, ease: 'power1.out' }, { x: x1, y: y1, duration: .45, ease: 'power1.in' }] }); if (!ok) T(t0 + 1.25, r, { x: x1 + 60, y: 1000, rotation: 60, duration: .5, ease: 'power1.in' }); T(t0, '#rgT_armR', { rotation: -140, duration: .25 }); T(t0 + .3, '#rgT_armR', { rotation: -40, duration: .2 }); T(t0 + .9, '#rgT_armR', { rotation: 0, duration: .3 }); return r; };
  const t1 = c.at('t1'), t2 = c.at('t2'), t3 = c.at('t3');
  toss(t1 - 1.4, 1250, 740, false, '#E53935'); sad('rgT', t1 - .2, t2 - .5); toss(t2 - 1.4, 1600, 730, false, '#1E88E5'); toss(t3 - 1.4, 1420, 700, true, '#FDD835');
  sparkAt(W, 'rgSpk', 1420, 700, t3 - .3, 10, 120); S(c.L(c.Lt('ดีใจจัง ผมได้')), doll, { opacity: 1 }); T(c.L(c.Lt('ดีใจจัง ผมได้')), doll, { x: 800, y: 900, duration: .8, ease: 'power2.inOut' });
  happy('rgT', t3, c.t1); hop('#rgT', t3, 2, 1040, 40); happy('rgB', t3, c.t1); happy('rgK', c.L(c.Lt('อีกนิดเดียว')), c.t1); clapping(['rgB', 'rgK'], t3 + .2, t3 + 2);
  cam(W, c.t0, c.s.dur, 1.0, 1.06, 1000, 760);
  return { speakers: { G: 'rgK', B: 'rgB', O: 'rgT' }, blink: ['rgK', 'rgB', 'rgT'] };
};
/* ---------- FACE PAINT ---------- */
SC.face = c => {
  const W = G(c.root, { id: 'fcW' }); fairYard(W, { k: 'fc' }); const st = marketStall(W, 960, 900); gsap.set(st, { scale: .8, svgOrigin: '960 900' });
  const tch = adult(W, 'fcTc', 'teacher'); place(tch, 1500, 1060, .95, true); const brush = G($('fcTc_armR')); el('rect', { x: 55, y: -190, width: 10, height: 70, rx: 4, fill: '#8D6E63' }, brush); el('path', { d: 'M54,-194 l12,0 l-6,-18Z', fill: '#E53935' }, brush);
  const ids = trioFair(W, 'fc', [620, 900, 1180], 1060, 1.0); faceIcon('fcK', 'flower'); faceIcon('fcT', 'drum'); faceIcon('fcB', 'rice');
  [['k', 'fcK'], ['o', 'fcT'], ['b', 'fcB']].forEach(([m, id]) => { const t = c.at(m); T(t - .3, '#fcTc_armR', { rotation: -70, duration: .3 }); O(t, '#fcTc_armR', { rotation: -70 }, { rotation: -60, duration: .12, repeat: 7, yoyo: true }); T(t + 1.2, '#fcTc_armR', { rotation: 0, duration: .3 }); S(t + .6, `#${id}_paint`, { opacity: 1 }); O(t + .6, `#${id}_paint`, { scale: 0, svgOrigin: '36 -226' }, { scale: 1, duration: .4, ease: 'back.out(3)' }); happy(id, t + .8, c.t1); });
  const mr = c.at('mirror'); ids.forEach((id, i) => hop(`#${id}`, mr + i * .15, 2, 1060, 36)); sparkAt(W, 'fcSpk', 900, 700, mr, 12, 360); happy('fcTc', mr, c.t1);
  cam(W, c.t0, c.s.dur, 1.0, 1.2, 900, 780);
  return { speakers: { G: 'fcK', B: 'fcB', O: 'fcT', C: ids }, blink: ['fcTc', ...ids] };
};
/* ---------- SNACK (ice cream, trash) ---------- */
SC.snack = c => {
  const W = G(c.root, { id: 'snW' }); fairYard(W, { k: 'sn' }); const cart = iceCart(W, 1450, 1000, 1.0); const seller = adult(W, 'snS', 'dad'); recolor(seller, { '#2C4F8C': '#E57373', '#1E3868': '#C62828' }); place(seller, 1680, 1040, .85, true);
  const bin = trashBin(W, 260, 1060, 1.0); const ids = trioFair(W, 'sn', [600, 860, 1120], 1060, 1.0);
  const buy = c.at('buy'), eat = c.at('eat'), drop = c.at('drop'), bn = c.at('bin');
  const cups = ids.map((id, i) => { const g = iceCup(W, 1450, 800, 1.2); gsap.set(g, { opacity: 0 }); return g; }); cups.forEach((g, i) => { S(buy + 1 + i * .3, g, { opacity: 1 }); T(buy + 1 + i * .3, g, { x: [660, 920, 1180][i], y: 900, duration: .7, ease: 'power2.inOut' }); });
  ids.forEach((id, i) => { T(buy + 1.6, `#${id}_armR`, { rotation: 40, duration: .3 }); eatLoop(id, eat, drop - .3, 120, 1.1, i * .2); happy(id, eat, drop); });
  T(drop - .2, cups, { opacity: 0, duration: .3 }); const trash = iceCup(W, 1180, 900, 1.2); gsap.set(trash, { opacity: 0 }); S(drop, trash, { opacity: 1 }); T(drop + .3, trash, { y: 1050, rotation: 80, duration: .5, ease: 'power2.in' });
  sad('snT', c.L(c.Lt('ต้น อย่าลืม')), bn); T(c.L(c.Lt('ต้น อย่าลืม')), '#snK_armR', { rotation: -60, duration: .3 }); T(bn, '#snK_armR', { rotation: 0, duration: .3 });
  walkCycle('snT', bn, bn + 1.4, .25); T(bn, '#snT', { x: 1000, duration: 1.2 }); T(bn + .6, trash, { keyframes: [{ x: 700, y: 820, rotation: 0, duration: .8, ease: 'power1.out' }, { x: 260, y: 920, duration: .8, ease: 'power1.in' }] }); S(bn + 2.2, trash, { opacity: 0 }); sparkAt(W, 'snSpk', 260, 900, bn + 2.2, 8, 90); happy('snT', bn + 2.2, c.t1); happy('snK', bn + 2.2, c.t1);
  ids.forEach(id => S(drop - .3, `#${id}_armR`, { rotation: 0 }));
  cam(W, c.t0, c.s.dur, 1.0, 1.06, 960, 760);
  return { speakers: { G: 'snK', B: 'snB', O: 'snT' }, blink: ['snS', ...ids] };
};
/* ---------- LOST CHILD ---------- */
SC.lost = c => {
  const W = G(c.root, { id: 'lsW' }); fairYard(W, { k: 'ls' }); const ids = trioFair(W, 'ls', [2150, 2300, 2450], 1000, 1.0);
  const lil = kid(W, 'lsL', { hair: 'girl', lower: 'skirt', uniform: false, shirt: '#FFF176', collar: '#FBC02D', lowerColor: '#FF8A65', skin: '#F3C495' }); place(lil, 1000, 1000, .7); const tr = tears($('lsL_head'), 'lsTear', 0, -236);
  const lm = adult(W, 'lsM', 'mom'); recolor(lm, LOSTMOM); place(lm, 2200, 1000, .95, true); const tch = adult(W, 'lsTc', 'teacher'); place(tch, -200, 1000, .95);
  const cry = c.at('cry'), search = c.at('search'), found = c.at('found'), hug = c.at('hug');
  sad('lsL', c.t0, found); closed('lsL', c.t0, found); tearRun('lsTear', c.t0 + .5, found); O(c.t0, '#lsL_body', { rotation: -3 }, { rotation: 3, duration: .25, repeat: Math.floor((found - c.t0) / .25), yoyo: true });
  ids.forEach((id, i) => { S(c.t0, `#${id}`, { scaleX: -1 }); walkCycle(id, cry - 1.6, cry, .25); T(cry - 1.6, `#${id}`, { x: [1300, 1480, 1660][i], duration: 1.6, ease: 'power1.out' }); sad(id, cry, search); });
  T(c.L(c.Lt('น้องหนูร้องไห้')), '#lsK_armR', { rotation: 50, duration: .3 }); T(c.L(c.Lt('ไม่ต้องกลัวนะ')), '#lsB_armL', { rotation: -40, duration: .3 }); T(search, ['#lsK_armR', '#lsB_armL'], { rotation: 0, duration: .3 });
  ['lsK', 'lsB', 'lsT'].forEach(id => { T(search, `#${id}_head`, { rotation: -12, duration: .5 }); T(search + 1, `#${id}_head`, { rotation: 12, duration: .8 }); T(search + 2, `#${id}_head`, { rotation: 0, duration: .5 }); });
  walkCycle('lsTc', c.L(c.Lt('ไปบอกคุณครู')) + 1, found, .3); T(c.L(c.Lt('ไปบอกคุณครู')) + 1, tch, { x: 420, duration: found - c.L(c.Lt('ไปบอกคุณครู')) - 1, ease: 'power1.out' });
  walkCycle('lsM', found, found + 1.6, .2, 30); T(found, lm, { x: 1180, duration: 1.6, ease: 'power1.out' }); happy('lsL', found + 1, c.t1); happy('lsM', found + 1, c.t1); T(hug, '#lsM_armR', { rotation: -40, duration: .4 }); T(hug, '#lsM_armL', { rotation: 40, duration: .4 });
  const wt = c.L(c.Lt('แม่ของน้องยกมือไหว้')); S(wt + .2, lm, { scaleX: .95 }); wai('lsM', wt + .3, 2.2, true); ids.forEach(id => { happy(id, found + 1, c.t1); wai(id, c.L(c.Lt('ด้วยความยินดี')), 1.6); }); hearts(W, 'lsHeart', 1060, 560, hug + .3); happy('lsTc', found + 1, c.t1);
  cam(W, c.t0, c.s.dur, 1.0, 1.08, 1200, 780);
  return { speakers: { G: 'lsK', B: 'lsB', O: 'lsT', C: ids }, blink: ['lsL', 'lsM', 'lsTc', ...ids] };
};
/* ---------- PICNIC ---------- */
SC.picnic = c => {
  const W = G(c.root, { id: 'pcW' }); fairYard(W, { k: 'pc', balloons: false }); tree(W, 960, 820, 1.8); el('path', { d: 'M260,1080 L1660,1080 L1560,900 L360,900Z', fill: 'url(#pMat)' }, W);
  const P = [['pcY', 'yai', 380, null], ['pcM', 'mom', 700, null], ['pcF', 'dad', 1250, null], ['pcD', 'dad', 1560, TONDAD]]; P.forEach(([id, k, x, rc]) => { const a = adult(W, id, k, { pose: 'sit' }); if (rc) recolor(a, rc); place(a, x, 1000, .78); });
  const kk = kid(W, 'pcK', { ...KAEWC, pose: 'sit' }); place(kk, 540, 1040, .9); const kb = kid(W, 'pcB', { ...FARMER, pose: 'sit' }); place(kb, 960, 1050, .95); const kt = kid(W, 'pcT', { ...TONC, pose: 'sit' }); place(kt, 1400, 1040, .9);
  const food = G(W, { opacity: 0 }); el('ellipse', { cx: 820, cy: 1030, rx: 80, ry: 22, fill: '#F4F1EA' }, food); el('ellipse', { cx: 820, cy: 1020, rx: 56, ry: 14, fill: '#F2C14E' }, food); el('ellipse', { cx: 800, cy: 1012, rx: 30, ry: 10, fill: '#FFFDF3' }, food);
  el('ellipse', { cx: 1110, cy: 1030, rx: 80, ry: 22, fill: '#F4F1EA' }, food); [[1080, 1016], [1110, 1008], [1140, 1018]].forEach(([x, y]) => el('path', { d: `M${x - 22},${y} q8,-22 28,-16 q18,6 16,18 q-8,12 -28,8 q-18,-2 -16,-10Z`, fill: '#C8742C' }, food));
  const fd = c.at('food'), sh = c.at('share'); S(fd, food, { opacity: 1 }); O(fd, food, { y: 30 }, { y: 0, duration: .5, ease: 'back.out(2)' }); happy('pcY', c.L(c.Lt('ยายทำข้าวเหนียว')), c.t1); happy('pcM', c.L(c.Lt('แม่ก็ทำไก่')), c.t1);
  ['pcK', 'pcB', 'pcT'].forEach((id, i) => { happy(id, sh, c.t1); eatLoop(id, sh + .6, c.t1, 132, 1.3, i * .3); }); ['pcM', 'pcF', 'pcY', 'pcD'].forEach((id, i) => eatLoop(id, sh + 1, c.t1, 140, 1.6, i * .4)); hearts(W, 'pcHeart', 900, 560, sh + 1.2);
  cam(W, c.t0, c.s.dur, 1.0, 1.08, 960, 860);
  return { speakers: { Y: 'pcY', M: 'pcM', B: 'pcB' }, blink: ['pcY', 'pcM', 'pcF', 'pcD', 'pcK', 'pcB', 'pcT'] };
};
