/* งานวันเด็ก ตอนที่ 2 — scenes: rehearse, stagek, staget, stageb, breathe, rain, shelter, rainbow, paddy, practice, props, final, decorate, bed, end */
function hallCast(c, pre, opt = {}) {
  const W = G(c.root, { id: pre + 'W' }); const h = stageHall(W, opt);
  const tch = adult(W, pre + 'Tc', 'teacher'); place(tch, 170, 1060, .85);
  const mates = classmates(W, pre + 'm', [[1060, .62, [1770, 1870]]], 3);
  return { W, h, tch: pre + 'Tc', mates };
}
/* ---------- REHEARSE ---------- */
SC.rehearse = c => {
  const { W, tch, mates } = hallCast(c, 're2'); const ids = kidSet(W, 're2', [700, 960, 1220], 1060, .95, { bag: null });
  const hands = c.at('hands'); ids.forEach((id, i) => { T(hands + i * .15, `#${id}_armR`, { rotation: -150, duration: .3 }); O(hands + .4 + i * .15, `#${id}_armR`, { rotation: -150 }, { rotation: -130, duration: .2, repeat: 7, yoyo: true }); T(c.t1 - 1.2, `#${id}_armR`, { rotation: 0, duration: .3 }); happy(id, hands, c.t1); });
  T(c.L(c.Lt('ใครพร้อมแล้ว')), `#${tch}_armR`, { rotation: -130, duration: .4 }); T(hands, `#${tch}_armR`, { rotation: 0, duration: .4 }); happy(tch, hands, c.t1);
  cam(W, c.t0, c.s.dur, 1.0, 1.06, 960, 700);
  return { speakers: { T: tch, B: ids[1], G: ids[0], O: ids[2], C: ids }, blink: [tch, ...ids, ...mates] };
};
/* ---------- STAGE: KAEW ---------- */
SC.stagek = c => {
  const { W, h, tch, mates } = hallCast(c, 'sk'); const k = kid(W, 'skK', KAEW); place(k, 960, 760, .95);
  const wait = kidSet(W, 'skw', [0, 1470, 1620], 1060, .8, { bag: null }); gsap.set('#skwK', { opacity: 0 });
  const dn = c.at('dance'), clap = c.at('clap');
  danceStep('skK', dn, clap - .4, 1.2, 6); happy('skK', dn, c.t1); T(dn, k, { x: 1060, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: 1 });
  notesAt(W, 'skNote', 900, 460, dn + .5, 2); happy(tch, c.L(c.Lt('สวยมากจ้ะแก้ว')), c.t1);
  clapping(['skwB', 'skwT', ...mates], clap, clap + 2.4); ['skwB', 'skwT'].forEach(id => happy(id, clap, c.t1));
  cam(W, c.t0, c.s.dur, 1.0, 1.08, 960, 600);
  return { speakers: { T: tch, O: 'skwT', G: 'skK' }, blink: [tch, 'skK', 'skwB', 'skwT', ...mates] };
};
/* ---------- STAGE: TON ---------- */
SC.staget = c => {
  const { W, tch, mates } = hallCast(c, 'st2'); const t = kid(W, 'st2T', TON); place(t, 960, 760, .95); drum(W, 'st2Dr', 960, 780, .7);
  const wait = kidSet(W, 'st2w', [1470, 1620, 0], 1060, .8, { bag: null }); gsap.set('#st2wT', { opacity: 0 });
  const fast = c.at('fast'), slow = c.at('slow');
  drumming('st2T', fast, fast + 5, .1); happy('st2T', fast, fast + 5); const sw = el('path', { d: 'M0,0 q10,16 0,24 q-10,-8 0,-24Z', fill: '#8FD3FF', opacity: 0 }, W); gsap.set(sw, { x: 1010, y: 510 }); O(c.L(c.Lt('เร็วไปหน่อย')), sw, { opacity: 1, y: 510 }, { y: 560, opacity: 0, duration: 1.2 });
  T(c.L(c.Lt('เร็วไปหน่อย')), `#${tch}_armR`, { rotation: -60, duration: .4 }); O(c.L(c.Lt('เร็วไปหน่อย')) + .4, `#${tch}_armR`, { rotation: -60 }, { rotation: -40, duration: .6, repeat: 3, yoyo: true }); T(slow, `#${tch}_armR`, { rotation: 0, duration: .4 });
  T(c.L(c.Lt('ครับคุณครู')), '#st2T_head', { rotation: 8, duration: .2, yoyo: true, repeat: 1 });
  drumming('st2T', slow, slow + 4.6, .45); happy('st2T', slow, c.t1); notesAt(W, 'st2Note', 900, 480, slow + .3, 2); happy(tch, c.L(c.Lt('ดีมากจ้ะ')), c.t1);
  cam(W, c.t0, c.s.dur, 1.0, 1.08, 960, 600);
  return { speakers: { T: tch, O: 'st2T' }, blink: [tch, 'st2T', 'st2wK', 'st2wB', ...mates] };
};
/* ---------- STAGE: KHAO forgets ---------- */
SC.stageb = c => {
  const { W, tch, mates } = hallCast(c, 'sb'); const b = kid(W, 'sbB', KHAO); place(b, 1320, 1060, .8);
  const wait = kidSet(W, 'sbw', [1480, 0, 1640], 1060, .8, { bag: null }); gsap.set('#sbwB', { opacity: 0 }); gsap.set('#sbwK', { x: 1470 }); gsap.set('#sbwT', { x: 1620 });
  const up = c.at('up'), fg = c.at('forget');
  walkCycle('sbB', up - 1.4, up, .25); T(up - 1.4, b, { x: 960, y: 760, scale: .95, duration: 1.4, ease: 'power1.inOut' });
  const q = qmark(W, 'sbQ', 1060, 380); S(fg, q, { opacity: 1 }); O(fg, q, { y: 30 }, { y: 0, duration: .4, ease: 'back.out(3)' }); loop(fg + .4, c.t1, q, { rotation: -8, svgOrigin: '1060 350' }, { rotation: 8 }, .5);
  sad('sbB', fg, c.t1); T(fg, '#sbB_head', { rotation: -10, duration: .5 }); const sw = el('path', { d: 'M0,0 q10,16 0,24 q-10,-8 0,-24Z', fill: '#8FD3FF', opacity: 0 }, W); gsap.set(sw, { x: 1010, y: 500 }); O(fg + .5, sw, { opacity: 1, y: 500 }, { y: 560, opacity: 0, duration: 1.2, repeat: 2, repeatDelay: .4 });
  T(fg, '#sbB_armL', { rotation: -20, duration: .4 }); T(fg, '#sbB_armR', { rotation: 20, duration: .4 });
  ['sbwK', 'sbwT', tch].forEach(id => sad(id, fg + 1, c.t1));
  cam(W, c.t0, fg - c.t0, 1.0, 1.0, 960, 540); cam(W, fg, c.t1 - fg, 1.0, 1.35, 960, 560);
  return { speakers: { B: 'sbB' }, blink: [tch, 'sbB', 'sbwK', 'sbwT', ...mates] };
};
/* ---------- BREATHE ---------- */
SC.breathe = c => {
  const W = G(c.root, { id: 'brW' }); stageHall(W); const tch = adult(W, 'brTc', 'teacher'); place(tch, 560, 1060, .95);
  const ids = kidSet(W, 'br', [1450, 1000, 1700], 1060, .95, { bag: null }); sad('brB', c.t0, c.at('in'));
  const lab = domEl(c.dom, 'num', 'หายใจเข้า', 'left:760px;top:250px;width:400px;font-size:64px;text-align:center'); const lab2 = domEl(c.dom, 'num', 'หายใจออก', 'left:760px;top:250px;width:400px;font-size:64px;text-align:center');
  const breathe = (id, t, adultK) => { const sc = adultK ? 1.05 : 1.07; T(t, `#${id}_up`, { scaleY: sc, svgOrigin: adultK ? '0 -160' : '0 -110', duration: 2.4, ease: 'sine.inOut' }); T(t, `#${id}_armL`, { rotation: 30, duration: 2.4 }); T(t, `#${id}_armR`, { rotation: -30, duration: 2.4 }); closed(id, t, t + 5.6);
    T(t + 3, `#${id}_up`, { scaleY: 1, duration: 2.4, ease: 'sine.inOut' }); T(t + 3, [`#${id}_armL`, `#${id}_armR`], { rotation: 0, duration: 2.4 }); };
  const iT = c.at('in'), oT = c.at('out'), all = c.at('all');
  breathe('brTc', iT, true); breathe('brB', iT); popIn(iT, lab, .4); T(oT - .2, lab, { opacity: 0, duration: .2 }); popIn(oT, lab2, .4); T(oT + 2.6, lab2, { opacity: 0, duration: .3 });
  ['brTc', 'brB', 'brK', 'brT'].forEach(id => breathe(id, all, id === 'brTc')); popIn(all, lab, .4); T(all + 2.8, lab, { opacity: 0, duration: .2 }); popIn(all + 3, lab2, .4); T(all + 5.6, lab2, { opacity: 0, duration: .3 });
  happy('brK', c.L(c.Lt('น้องข้าวทำได้')), c.t1); happy('brT', c.L(c.Lt('สู้ๆ')), c.t1); T(c.L(c.Lt('สู้ๆ')), '#brT_armR', { rotation: -150, duration: .3 }); T(c.Le(c.Lt('สู้ๆ')) + .5, '#brT_armR', { rotation: 0, duration: .3 });
  happy('brB', c.at('smile'), c.t1); happy('brTc', c.at('smile'), c.t1); T(c.at('smile'), '#brB_head', { rotation: 0, duration: .3 });
  hearts(W, 'brHeart', 1000, 600, c.at('smile') + .5);
  cam(W, c.t0, c.s.dur, 1.0, 1.12, 1100, 760);
  return { speakers: { T: 'brTc', B: 'brB', G: 'brK', O: 'brT' }, blink: ['brTc', 'brB', 'brK', 'brT'] };
};
/* ---------- RAIN ---------- */
function roadSet(W, pre) { sky(W, null, 'gDay'); const dk = sky(W, pre + 'Dark', 'gNight', { opacity: 0 }); mountains(W); palm(W, 250, 705, 260, .85); stiltHouse(W, 1650, 705, .75); tree(W, 1100, 710, .7);
  field(W, '#9BCB6B', '#72B04F', null, 700); el('rect', { y: 840, width: 1920, height: 110, fill: '#C9A26C' }, W); grassTufts(W, 1080, 26, '#5FA442', '#6FAF4B', 50); return dk; }
SC.rain = c => {
  const W = G(c.root, { id: 'rnW' }); const dk = roadSet(W, 'rn'); const clouds = G(W, { opacity: 0 }); [[-100, 120, 1.6], [500, 80, 1.8], [1100, 130, 1.7], [1600, 90, 1.6]].forEach(([x, y, s]) => darkCloud(clouds, x, y, s));
  const ids = kidSet(W, 'rn', [520, 760, 1000], 960, .95, { bag: '#E53935' }); gsap.set('#rnK_bagb', { fill: '#F48FB1' }); gsap.set('#rnT_bagb', { fill: '#42A5F5' });
  const shade = el('rect', { width: 1920, height: 1080, fill: '#1D2440', opacity: 0 }, W); const rg = rainSys(W, 'rnDrop', 140); const sp = puddleSplash(W, 'rnSpl', 30, 860, 1070);
  const flash = el('rect', { width: 1920, height: 1080, fill: '#fff', opacity: 0 }, W);
  const dark = c.at('dark'), rain = c.at('rain'), run = c.at('run');
  ids.forEach((id, i) => walkCycle(id, c.t0, dark, .3)); ids.forEach((id, i) => O(c.t0, `#${id}`, { x: [200, 440, 680][i] }, { x: [520, 760, 1000][i], duration: dark - c.t0, ease: 'none' }));
  T(c.t0 + 1, clouds, { opacity: 1, duration: dark - c.t0 }); T(c.t0 + 1, dk, { opacity: .55, duration: dark - c.t0 + 1 }); T(dark - 1, shade, { opacity: .3, duration: 2 });
  const th = (TIMELINE.sfx.find(x => x.name === 'thunder' && x.t >= c.t0 && x.t < c.t1) || { t: dark }).t; O(th, flash, { opacity: .8 }, { opacity: 0, duration: .5, ease: 'power2.out' }); O(th + .7, flash, { opacity: .5 }, { opacity: 0, duration: .4 });
  ids.forEach(id => { T(th, `#${id}_eyes`, { scale: 1.3, duration: .15 }); T(th + 1.2, `#${id}_eyes`, { scale: 1, duration: .3 }); sad(id, th, c.t1); });
  rainRun(rg, 'rnDrop', rain, c.t1 + 1); splashRun('rnSpl', rain, c.t1); S(rain, sp, { opacity: 1 });
  ids.forEach(id => { T(rain + .3, `#${id}_armL`, { rotation: 160, duration: .3 }); T(rain + .3, `#${id}_armR`, { rotation: -160, duration: .3 }); });
  ids.forEach((id, i) => { walkCycle(id, run, c.t1 + .6, .15, 30, false); S(run, `#${id}`, { scaleX: .95 }); T(run, `#${id}`, { x: 2200 + i * 150, duration: 4.6, ease: 'power1.in' }); });
  cam(W, c.t0, c.s.dur, 1.0, 1.06, 960, 700);
  return { speakers: { G: ids[0], B: ids[1], O: ids[2] }, blink: ids };
};
/* ---------- SHELTER ---------- */
function shelterSet(W, pre) { sky(W, null, 'gDay'); const dk = sky(W, pre + 'Dark', 'gNight', { opacity: .55 }); mountains(W, '#8FA3B4', '#7C9888'); tree(W, 120, 720, .9); palm(W, 1850, 720, 280, .85);
  el('rect', { y: 700, width: 1920, height: 380, fill: '#9DB06E' }, W); grassTufts(W, 710, 40, '#5FA442', '#6FAF4B', 24); const sl = sala(W, 960, 1000, 1.25); dk.sala = sl; return dk; }
SC.shelter = c => {
  const W = G(c.root, { id: 'shW' }); const dk = shelterSet(W, 'sh'); const clouds = G(W); [[-100, 60, 1.5], [600, 30, 1.7], [1300, 60, 1.6]].forEach(([x, y, s]) => darkCloud(clouds, x, y, s));
  const ids = kidSet(W, 'sh', [640, 960, 1280], 950, .9, { bag: null }); const shade = el('rect', { width: 1920, height: 1080, fill: '#1D2440', opacity: .25 }, W);
  const rg = rainSys(W, 'shDrop', 120); W.insertBefore(rg, dk.sala); rainRun(rg, 'shDrop', c.t0, c.t1 + 1);
  const drip = G(W); [[420, 560], [1500, 560], [700, 560], [1220, 560]].forEach(([x, y], i) => { const w = G(drip, { transform: `translate(${x},${y})` }); el('path', { class: 'shDrip', d: 'M0,0 q8,14 0,20 q-8,-6 0,-20Z', fill: '#BFE6FF', opacity: 0 }, w); });
  tl.fromTo('.shDrip', { opacity: .9, y: 0 }, { opacity: 0, y: 420, duration: .9, stagger: .3, repeat: Math.floor(c.s.dur / 1.2), ease: 'power1.in', immediateRender: false }, c.t0);
  ids.forEach((id, i) => O(c.t0, `#${id}`, { x: [2100, 2250, 2400][i] }, { x: [640, 960, 1280][i], duration: 2.2, ease: 'power2.out' })); ids.forEach(id => walkCycle(id, c.t0, c.t0 + 2.2, .15, 30));
  O(c.L(c.Lt('ตัวผมเปียก')), `#${ids[2]}_body`, { rotation: -4 }, { rotation: 4, duration: .08, repeat: 13, yoyo: true }); S(c.Le(c.Lt('ตัวผมเปียก')), `#${ids[2]}_body`, { rotation: 0 });
  const idea = c.at('idea'), yes = c.at('yes'), pr = c.at('practice');
  const bl = bulb(W, 'shBulb', 960, 520, .9); S(idea, bl, { opacity: 1 }); O(idea, bl, { scale: .2 }, { scale: 1, duration: .5, ease: 'back.out(3)' }); T(yes, bl, { opacity: 0, duration: .4 }); happy(ids[1], idea, c.t1);
  T(c.L(c.Lt('ต้นตีกลอง')), `#${ids[1]}_armR`, { rotation: -60, duration: .3 }); T(c.L(c.Lt('ต้นตีกลอง')) + 1.6, `#${ids[1]}_armR`, { rotation: 60, duration: .3 }); T(c.Le(c.Lt('ต้นตีกลอง')), `#${ids[1]}_armR`, { rotation: 0, duration: .3 });
  ids.forEach(id => { happy(id, yes, c.t1); hop(`#${id}`, yes, 2, 950, 36); });
  drumming(ids[2], pr, c.t1 - 1, .45); danceStep(ids[0], pr + .3, c.t1 - 1, 1.3, 4); for (let t = pr + .5; t < c.t1 - 1.5; t += 1.2) { T(t, `#${ids[1]}_up`, { rotation: -10, svgOrigin: '0 -110', duration: .4 }); T(t + .6, `#${ids[1]}_up`, { rotation: 0, duration: .4 }); }
  notesAt(W, 'shNote', 600, 600, pr + .5, 2);
  cam(W, c.t0, c.s.dur, 1.0, 1.08, 960, 720);
  return { speakers: { G: ids[0], B: ids[1], O: ids[2], C: ids }, blink: ids };
};
/* ---------- RAINBOW ---------- */
SC.rainbow = c => {
  const W = G(c.root, { id: 'rbW' }); const dk = shelterSet(W, 'rb'); const clouds = G(W); [[-100, 60, 1.5], [600, 30, 1.7], [1300, 60, 1.6]].forEach(([x, y, s]) => darkCloud(clouds, x, y, s));
  const sn = sun(W, 'rbSun', 1650, 180); gsap.set(sn, { opacity: 0 }); const bow = rainbow(W, 'rbBow', 960, 700, 760); W.insertBefore(bow, W.children[2]); W.insertBefore(sn, bow);
  const ids = kidSet(W, 'rb', [640, 960, 1280], 1040, .95, { bag: null }); const rg = rainSys(W, 'rbDrop', 90); W.insertBefore(rg, dk.sala); const shade = el('rect', { width: 1920, height: 1080, fill: '#1D2440', opacity: .25 }, W);
  const pud = G(W); [[380, 1030], [1560, 1040]].forEach(([x, y]) => el('ellipse', { cx: x, cy: y, rx: 150, ry: 28, fill: '#A9D3EA', opacity: .8 }, pud));
  const fr = [frog(W, 'rbF0', 330, 1030, .9), frog(W, 'rbF1', 1620, 1040, .9)]; gsap.set(fr, { opacity: 0 });
  const stop = c.at('stop'), bw = c.at('bow'), fg = c.at('frogs');
  rainRun(rg, 'rbDrop', c.t0, stop + 1.5); T(stop, clouds, { x: -300, opacity: 0, duration: 4 }); T(stop, [dk, shade], { opacity: 0, duration: 3 }); T(stop + 1, sn, { opacity: 1, duration: 2 });
  tl.to('.rbBowA', { attr: { 'stroke-dashoffset': 0 }, duration: 2.2, stagger: .15, ease: 'power1.inOut' }, bw - .6);
  ids.forEach(id => { happy(id, bw, c.t1); T(bw + .8, `#${id}_armR`, { rotation: -150, duration: .3 }); T(bw + 3, `#${id}_armR`, { rotation: 0, duration: .3 }); }); hop('#rbK', bw + .8, 2, 1040, 40);
  fr.forEach((f, i) => { S(fg, f, { opacity: 1 }); const y0 = i ? 1040 : 1030; O(fg + i * .3, f, { y: y0 + 40, opacity: 0 }, { y: y0, opacity: 1, duration: .4, ease: 'back.out(2)' }); for (let t = fg + 1.2 + i * .4; t < c.t1 - 1; t += 1.6) O(t, f, { y: y0 }, { y: y0 - 60, duration: .25, yoyo: true, repeat: 1, ease: 'power1.out' }); });
  T(c.L(c.Lt('ได้ยินเสียงกบ')), '#rbT_armL', { rotation: 60, duration: .3 }); T(c.Le(c.Lt('ได้ยินเสียงกบ')) + .4, '#rbT_armL', { rotation: 0, duration: .3 });
  cam(W, c.t0, c.s.dur, 1.06, 1.0, 960, 600);
  return { speakers: { G: 'rbK', B: 'rbB', O: 'rbT', C: ids }, blink: ids };
};
/* ---------- PADDY (rain is good) ---------- */
SC.paddy = c => {
  const W = G(c.root, { id: 'pdW' }); const cl = paddyBack(W, 'gDusk'); const sn = sun(W, null, 1500, 430, 'gSunset', '#FFB25C'); W.insertBefore(sn, W.children[1]);
  const rows = G(W); const seeds = []; [700, 760, 830].forEach((y, r) => { for (let x = 140 + r * 40; x < 1800; x += 120) seeds.push(seedling(rows, x, y, .3 + r * .1)); });
  const dad = adult(W, 'pdF', 'dad'); place(dad, 1180, 1010, .95); const b = kid(W, 'pdB', { ...KHAO, bag: '#E53935' }); place(b, 800, 1010, 1.0);
  el('rect', { y: 960, width: 1920, height: 120, fill: '#8B6A45' }, W); grassTufts(W, 970, 30, '#6FAF4B', '#5FA442', 26);
  const glow = el('rect', { width: 1920, height: 1080, fill: '#FF9E4A', opacity: .12 }, W);
  const gr = c.at('grow'); seeds.forEach((s, i) => { const sc0 = gsap.getProperty(s, 'scaleX'); O(gr + (i % 14) * .07, s, { scaleX: sc0, scaleY: sc0 }, { scaleX: sc0 * 1.35, scaleY: sc0 * 1.35, duration: .6, ease: 'back.out(2)' }); });
  sparkAt(W, 'pdSpk', 960, 760, gr + .2, 14, 520); happy('pdF', c.L(c.Lt('ไม่เป็นไรลูก')), c.t1); happy('pdB', gr, c.t1);
  T(c.L(c.Lt('ฝนตก น้ำในนา')), '#pdF_armR', { rotation: -70, duration: .4 }); T(gr + 2, '#pdF_armR', { rotation: 0, duration: .4 }); sad('pdB', c.L(c.Lt('พ่อครับ ฝนตก')), c.Le(c.Lt('พ่อครับ ฝนตก')) + .3);
  cam(W, c.t0, c.s.dur, 1.0, 1.08, 960, 800);
  return { speakers: { B: 'pdB', F: 'pdF' }, blink: ['pdB', 'pdF'] };
};
/* ---------- PRACTICE (evening, parents) ---------- */
SC.practice = c => {
  const W = G(c.root, { id: 'prW' }); mealRoom(W, 'prR', true);
  const mom = adult(W, 'prM', 'mom', { pose: 'sit' }); place(mom, 420, 960, .88); const dad = adult(W, 'prF', 'dad', { pose: 'sit' }); place(dad, 1500, 960, .88);
  const b = kid(W, 'prB', FARMER); place(b, 960, 1000, 1.1); sash('prB'); nightTint(W);
  const sp = c.at('speak'), cl = c.at('clap');
  T(sp, '#prB_armR', { rotation: -40, duration: .3 }); T(sp + .3, '#prB_armL', { rotation: 60, duration: .3 }); T(c.L(c.Lt('ข้าวทุกเม็ด')), '#prB_armL', { rotation: 0, duration: .3 }); T(c.L(c.Lt('ข้าวทุกเม็ด')), '#prB_armR', { rotation: -120, duration: .4 }); T(cl, '#prB_armR', { rotation: 0, duration: .3 });
  happy('prB', sp, sp + 3); happy('prM', c.L(c.Lt('ดีจังเลยลูก')), c.t1); happy('prF', c.L(c.Lt('ลองพูดบท')), c.t1);
  wai('prB', cl, 1.6); clapping(['prM', 'prF'], cl, cl + 2.4); happy('prB', cl + 1.8, c.t1); hearts(W, 'prHeart', 900, 520, cl + 2.5);
  cam(W, c.t0, c.s.dur, 1.0, 1.08, 960, 720);
  return { speakers: { B: 'prB', F: 'prF', M: 'prM' }, blink: ['prB', 'prF', 'prM'] };
};
/* ---------- PROPS ---------- */
SC.props = c => {
  const { W, board, ids, tch } = classScene(c, 'pp', { tx: 250 }); chalk(board, 'งานวันเด็ก', 960, 300, 110, '', '#FFE27A');
  const pa = c.at('paper'), dr = c.at('drum'), sg = c.at('sign'), dn = c.at('done');
  const rice = [0, 1, 2, 3].map(i => { const r = paperRice(W, 1050 + i * 55, 985, .8, 'ppRice'); return r; }); gsap.set(rice, { opacity: 0 });
  rice.forEach((r, i) => { S(pa + 1 + i * .8, r, { opacity: 1 }); O(pa + 1 + i * .8, r, { scale: .1 }, { scale: .9, duration: .35, ease: 'back.out(2)' }); });
  T(pa, `#${ids[0]}_armR`, { rotation: 40, duration: .3 }); O(pa + .3, `#${ids[0]}_armR`, { rotation: 36 }, { rotation: 50, duration: .15, repeat: 20, yoyo: true }); S(dr, `#${ids[0]}_armR`, { rotation: 0 });
  const d = drum(W, 'ppDr', 1710, 1000, .55); const rib = G(W, { opacity: 0 }); ['#E53935', '#FDD835', '#43A047', '#1E88E5'].forEach((col, i) => el('rect', { x: 1662 + i * 26, y: 930, width: 14, height: 60, fill: col }, rib));
  T(dr, `#${ids[2]}_armR`, { rotation: 30, duration: .3 }); O(dr + .3, `#${ids[2]}_armR`, { rotation: 26 }, { rotation: 40, duration: .15, repeat: 14, yoyo: true }); S(sg, `#${ids[2]}_armR`, { rotation: 0 }); S(dr + 1.5, rib, { opacity: 1 }); O(dr + 1.5, rib, { scaleY: 0, svgOrigin: '1710 990' }, { scaleY: 1, duration: .5, ease: 'back.out(2)' });
  const sgG = G(W, { id: 'ppSign' }); const sb = signBoard(sgG, 960, 560, 1.0, 'ชาวนาตัวน้อย'); const clip = el('clipPath', { id: 'ppClip' }, $('svg').querySelector('defs')); el('rect', { id: 'ppClipR', x: -310, y: -120, width: 0, height: 170 }, clip); sb.setAttribute('clip-path', 'url(#ppClip)');
  S(sg, sgG, { opacity: 1 }); T(sg + .5, '#ppClipR', { attr: { width: 620 }, duration: 3, ease: 'none' }); T(sg, `#${ids[1]}_armR`, { rotation: 40, duration: .3 }); O(sg + .3, `#${ids[1]}_armR`, { rotation: 36 }, { rotation: 50, duration: .12, repeat: 24, yoyo: true }); S(dn, `#${ids[1]}_armR`, { rotation: 0 });
  gsap.set(sgG, { opacity: 0 }); sparkAt(W, 'ppSpk', 960, 520, dn, 14, 360); ids.forEach(id => happy(id, dn, c.t1)); happy(tch, dn, c.t1);
  cam(W, c.t0, c.s.dur, 1.0, 1.05, 960, 600);
  return { speakers: { T: tch, B: ids[1], G: ids[0], O: ids[2], C: ids }, blink: [tch, ...ids] };
};
/* ---------- FINAL REHEARSAL ---------- */
SC.final = c => {
  const { W, tch, mates } = hallCast(c, 'fn'); signBoard(W, 960, 330, .9, 'ชาวนาตัวน้อย');
  [760, 820, 1100, 1160].forEach(x => paperRice(W, x, 760, .9));
  const t = kid(W, 'fnT', TON); place(t, 600, 760, .9); drum(W, 'fnDr', 600, 780, .6); const k = kid(W, 'fnK', KAEW); place(k, 1320, 760, .9); const b = kid(W, 'fnB', FARMER); place(b, 960, 760, .95); sash('fnB');
  const bnd = G($('fnB_armL')); el('path', { d: 'M-50,-106 l-8,-40 M-46,-106 l0,-44 M-42,-106 l8,-38', stroke: '#5CBF5A', 'stroke-width': 6, 'stroke-linecap': 'round' }, bnd);
  const st = c.at('start'), pl = c.at('plant'), bw = c.at('bow');
  drumming('fnT', st, bw, .45); happy('fnT', st, c.t1); danceStep('fnK', c.L(c.Lt('ปลูกข้าว')), bw, 1.2, 5); happy('fnK', st, c.t1); notesAt(W, 'fnNote', 1280, 480, c.L(c.Lt('ปลูกข้าว')), 1);
  T(c.L(c.Lt('สวัสดีครับ')), '#fnB_armR', { rotation: -40, duration: .3 }); T(c.Le(c.Lt('สวัสดีครับ')), '#fnB_armR', { rotation: 0, duration: .3 }); happy('fnB', c.L(c.Lt('สวัสดีครับ')), c.t1);
  for (let tt = pl; tt < pl + 3; tt += 1.2) { T(tt, '#fnB_up', { rotation: -12, svgOrigin: '0 -110', duration: .4 }); T(tt + .6, '#fnB_up', { rotation: 0, duration: .4 }); }
  const ms = [880, 1040].map((x, i) => { const s = seedling(W, x, 770, .35); gsap.set(s, { opacity: 0 }); S(pl + .5 + i * 1.2, s, { opacity: 1 }); O(pl + .5 + i * 1.2, s, { scaleY: .05 }, { scaleY: .35, duration: .3 }); return s; });
  ['fnT', 'fnK', 'fnB'].forEach(id => { T(bw, `#${id}_up`, { rotation: 0, duration: .01 }); T(bw + .1, `#${id}_head`, { rotation: 0, y: 30, duration: .4 }); T(bw + 1.3, `#${id}_head`, { y: 0, duration: .4 }); });
  clapping([tch, ...mates], bw + .8, bw + 3.4); happy(tch, bw + .8, c.t1); confettiAt(W, 'fnCf', 960, 450, bw + .9, 40);
  cam(W, c.t0, c.s.dur, 1.0, 1.06, 960, 560);
  return { speakers: { T: tch, B: 'fnB', G: 'fnK', O: 'fnT' }, blink: [tch, 'fnT', 'fnK', 'fnB', ...mates] };
};
/* ---------- DECORATE ---------- */
SC.decorate = c => {
  const W = G(c.root, { id: 'dcW' }); const cl = schoolYard(W, 'gDusk'); T(c.t0, cl, { x: 80, duration: c.s.dur, ease: 'none' }); const glow = el('rect', { width: 1920, height: 1080, fill: '#FF9E4A', opacity: .1 }, W);
  const b1 = bunting(W, 'dcFlag1', 560, 1560, 470, 40); const b2 = bunting(W, 'dcFlag2', 0, 560, 560, 30); const b3 = bunting(W, 'dcFlag3', 1560, 1920, 560, 30);
  gsap.set(['.dcFlag1', '.dcFlag2', '.dcFlag3'], { scaleY: 0 });
  const ids = kidSet(W, 'dc', [620, 960, 1300], 1040, 1.0, { bag: null }); const tch = adult(W, 'dcTc', 'teacher'); place(tch, 1650, 1040, .9, true);
  const fl = c.at('flags'), bl = c.at('balloon');
  ids.forEach(id => { T(fl, `#${id}_armR`, { rotation: -160, duration: .3 }); T(fl + 3, `#${id}_armR`, { rotation: 0, duration: .3 }); });
  ['.dcFlag1', '.dcFlag2', '.dcFlag3'].forEach((s, i) => tl.to(s, { scaleY: 1, duration: .3, stagger: .08, ease: 'back.out(2)' }, fl + .3 + i * .6));
  const cols = ['#FF6B8A', '#FFD84D', '#4FC3F7', '#8BC34A', '#B58CFF', '#FF6B8A']; const bs = cols.map((col, i) => balloon(W, 'dcBal', 300 + i * 270, 1200, col, 1.1));
  tl.fromTo('.dcBal', { y: 0 }, { y: (i) => -560 - (i % 3) * 60, duration: 2.4, stagger: .2, ease: 'power2.out', immediateRender: false }, bl); tl.to('.dcBal', { rotation: 6, duration: 1.2, yoyo: true, repeat: Math.floor(c.s.dur / 1.2), stagger: .2 }, bl + 2.6);
  ids.forEach(id => happy(id, bl, c.t1)); happy('dcTc', fl, c.t1); hop(`#${ids[0]}`, bl + .6, 2, 1040, 40);
  cam(W, c.t0, c.s.dur, 1.0, 1.06, 960, 700);
  return { speakers: { T: 'dcTc', G: ids[0], B: ids[1], O: ids[2] }, blink: ['dcTc', ...ids] };
};
/* ---------- BED ---------- */
SC.bed = c => {
  const W = G(c.root, { id: 'bdW' }); el('rect', { width: 1920, height: 800, fill: 'url(#pWall)' }, W);
  const win = G(W); el('rect', { x: 1240, y: 150, width: 440, height: 340, fill: 'url(#gNight)' }, win); el('circle', { cx: 1560, cy: 260, r: 44, fill: '#FFF6D0' }, win); el('circle', { cx: 1560, cy: 260, r: 120, fill: 'url(#gMoon)' }, win); seed(2); for (let i = 0; i < 22; i++) el('circle', { class: 'bdStar', cx: R(1250, 1670), cy: R(160, 470), r: R(2, 4.5), fill: '#fff' }, win);
  el('rect', { x: 1228, y: 138, width: 464, height: 364, fill: 'none', stroke: '#6A4428', 'stroke-width': 24 }, W);
  el('rect', { y: 780, width: 1920, height: 300, fill: 'url(#pPlank)' }, W); el('path', { d: 'M470,940 L1330,940 L1290,800 L510,800Z', fill: 'url(#pMat)' }, W); el('ellipse', { cx: 640, cy: 845, rx: 95, ry: 40, fill: '#F7F2E8' }, W);
  const hang = G(W); el('path', { d: 'M1420,640 l0,-60', stroke: '#6A4428', 'stroke-width': 6 }, hang); const shirt = G(hang); el('path', { d: 'M1340,640 L1500,640 L1520,780 L1320,780Z', fill: '#2A4B8D' }, shirt); el('path', { d: 'M1340,640 L1300,700 L1330,720 M1500,640 L1540,700 L1510,720', stroke: '#2A4B8D', 'stroke-width': 30, fill: 'none' }, shirt);
  const hat = G(W); el('path', { d: 'M1560,760 Q1660,690 1760,760 Q1660,776 1560,760Z', fill: '#E3B35F' }, hat);
  const lying = kid(W, 'bdBl', { ...KHAO, uniform: false, shirt: '#3D8C6E', collar: '#2E6E55', shadow: false }); gsap.set(lying, { svgOrigin: '0 0', x: 960, y: 870, rotation: -90, scale: 1.05 }); happy('bdBl', c.t0, c.L(0) + 1); closed('bdBl', c.L(0) + 1);
  const blanket = G(W); el('path', { d: 'M800,790 Q900,760 1040,790 L1060,900 L790,900Z', fill: '#7FB3E8' }, blanket); for (let i = 0; i < 5; i++) el('rect', { x: 800 + i * 52, y: 786, width: 16, height: 112, fill: '#5E97D4', opacity: .6 }, blanket);
  el('rect', { width: 1920, height: 1080, fill: '#1E1540', opacity: .42 }, W); const g2 = el('circle', { cx: 1560, cy: 260, r: 700, fill: 'url(#gMoon)', opacity: .35 }, W); g2.style.mixBlendMode = 'screen';
  const zz = G(W); zzz(zz, 'bdZ', 700, 640); tl.fromTo('.bdZ', { opacity: 0, y: 0 }, { opacity: 1, y: -60, duration: 1.2, stagger: .35, repeat: Math.floor((c.t1 - c.L(1)) / 1.6), repeatDelay: .5, immediateRender: false }, c.L(1));
  tl.fromTo('.bdStar', { opacity: .3 }, { opacity: 1, duration: .7, stagger: .08, repeat: Math.floor(c.s.dur / 1.4), yoyo: true, immediateRender: false }, c.t0);
  const dream = G(W, { id: 'bdDream', opacity: 0 }); el('ellipse', { cx: 520, cy: 330, rx: 400, ry: 260, fill: '#FFF8E6', stroke: '#8B5E34', 'stroke-width': 8 }, dream); [[700, 590], [760, 660]].forEach(([x, y], i) => el('circle', { cx: x, cy: y, r: i ? 18 : 30, fill: '#FFF8E6', stroke: '#8B5E34', 'stroke-width': 6 }, dream));
  el('rect', { x: 250, y: 150, width: 540, height: 290, rx: 20, fill: '#4E3B8C' }, dream); el('rect', { x: 230, y: 430, width: 580, height: 40, fill: '#8B5E34' }, dream); [250, 790].forEach(x => el('path', { d: `M${x},140 L${x + (x < 500 ? 70 : -70)},140 Q${x + (x < 500 ? 50 : -50)},300 ${x + (x < 500 ? 80 : -80)},440 L${x},440Z`, fill: '#C62834' }, dream));
  const dt = kid(dream, 'bdDt', TON); place(dt, 390, 432, .42); const db = kid(dream, 'bdDb', FARMER); place(db, 520, 432, .45); const dk = kid(dream, 'bdDk', KAEW); place(dk, 650, 432, .42);
  const dr = c.at('dream'); T(dr, dream, { opacity: 1, duration: .8 }); O(dr, dream, { scale: .6, svgOrigin: '700 620' }, { scale: 1, duration: .8, ease: 'back.out(1.5)' }); ['bdDt', 'bdDb', 'bdDk'].forEach(id => happy(id, dr, c.t1)); waveArm('bdDb', dr + 1, 7); drumming('bdDt', dr + 1, c.t1 - 1, .4); danceStep('bdDk', dr + 1, c.t1 - 1, 1.3, 5);
  cam(W, c.t0, c.s.dur, 1.0, 1.1, 800, 600);
  return { speakers: {}, blink: [] };
};
/* ---------- END ---------- */
SC.end = c => {
  const W = G(c.root, { id: 'enW' }); sky(W, null, 'gNight'); el('circle', { cx: 1500, cy: 250, r: 70, fill: '#FFF6D0' }, W); el('circle', { cx: 1500, cy: 250, r: 220, fill: 'url(#gMoon)' }, W);
  seed(6); for (let i = 0; i < 70; i++) el('circle', { class: 'enStar', cx: R(0, 1920), cy: R(0, 760), r: R(1.5, 4.5), fill: '#fff' }, W);
  mountains(W, '#2B3A6A', '#22305A'); field(W, '#2E4A3A', '#253E30', null, 720); const sil = G(W); stiltHouse(sil, 560, 720, .9); sil.querySelectorAll('rect,path').forEach(e => { if (e.getAttribute('fill') && e.getAttribute('fill') !== 'none') e.setAttribute('fill', '#141E33'); if (e.getAttribute('stroke') && e.getAttribute('stroke') !== 'none') e.setAttribute('stroke', '#141E33'); }); el('rect', { x: 540, y: 600, width: 40, height: 40, fill: '#FFD27A' }, W);
  tl.fromTo('.enStar', { opacity: .2 }, { opacity: 1, duration: .6, stagger: .04, repeat: Math.floor(c.s.dur / 1.2), yoyo: true, immediateRender: false }, c.t0);
  const ov = domEl(c.dom, 'ov', '<div class="e2" style="font-size:70px">ติดตามตอนต่อไป</div><div class="e1" style="font-size:150px">งานวันเด็ก</div><div class="e2">ตอนที่ 3: วันงานวันเด็ก</div><div class="e3">อย่าลืมกดติดตามนะ</div>'); S(c.t0, ov, { opacity: 1 });
  O(c.t0 + .2, ov.children[0], { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .6 }); popIn(c.t0 + .6, ov.children[1], .8); O(c.t0 + 1.3, ov.children[2], { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power2.out' }); popIn(c.L(0), ov.children[3], .6);
  loop(c.L(0) + .8, c.t1, ov.children[3], { scale: 1 }, { scale: 1.06 }, .6); cam(W, c.t0, c.s.dur, 1.0, 1.06, 960, 540);
  return {};
};
