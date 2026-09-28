/* งานวันเด็ก ตอนที่ 2 — scenes: title, recap, saturday, lesson, mud, thuiwash, lines, market, costume, kaew, ton, monday */

/* ---------- TITLE ---------- */
SC.title = c => {
  const W = G(c.root, { id: 'ti_w' }); const v = villageWide(W, { sunY: 260 }); const fr = G(W); grassTufts(fr, 1080, 22);
  const bd = G(W); for (let i = 0; i < 4; i++) bird(bd, 'tiBird');
  cam(W, c.t0, c.s.dur, 1.12, 1.0, 960, 760, 'power1.out'); T(c.t0, '#ti_w_clouds', { x: 120, duration: c.s.dur, ease: 'none' });
  tl.fromTo('.tiBird', { x: i => -100 - i * 80, y: i => 300 + (i % 2) * 40 }, { x: i => 2100 - i * 60, y: i => 220 + (i % 2) * 30, duration: 8, ease: 'none', stagger: .3, immediateRender: false }, c.t0 + 2);
  tl.fromTo('.tiBirdW', { scaleY: 1, transformOrigin: '50% 100%' }, { scaleY: -.6, duration: .18, repeat: 40, yoyo: true, immediateRender: false }, c.t0 + 2);
  const ids = kidSet(W, 'ti', [700, 960, 1220], 1060, .8, { bag: null, uniform: false }); gsap.set('#tiB', { opacity: 0 });
  const fk = kid(W, 'tiF', FARMER); place(fk, 960, 1060, .8); sash('tiF');
  ids.forEach((id, i) => { if (id !== 'tiB') hop(`#${id}`, c.t0 + 3 + i * .2, 3, 1060, 30); }); hop('#tiF', c.t0 + 3.2, 3, 1060, 30); happy('tiF', c.t0 + 3, c.t1); happy('tiK', c.t0 + 3, c.t1); happy('tiT', c.t0 + 3, c.t1);
  const ov = domEl(c.dom, 'ov', '<div class="t1">ชาวนาตัวน้อย</div><div class="t2">งานวันเด็ก · ตอนที่ 2</div><div class="e2" style="margin-top:18px">ซ้อมการแสดง</div>'); S(c.t0, ov, { opacity: 1 });
  popIn(c.t0 + .5, ov.children[0], .9); O(c.t0 + 1.3, ov.children[1], { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: .7, ease: 'back.out(1.8)' }); O(c.t0 + 2.0, ov.children[2], { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power2.out' });
  loop(c.t0 + 2.6, c.t1 - 2, ov.children[0], { scale: 1 }, { scale: 1.05 }, .9);
  T(c.t1 - 1.4, ov.children[0], { y: -500, opacity: 0, duration: .7, ease: 'back.in(1.5)' }); T(c.t1 - 1.3, [ov.children[1], ov.children[2]], { y: 400, opacity: 0, duration: .6, ease: 'back.in(1.5)' });
  return { blink: ['tiK', 'tiF', 'tiT'] };
};

/* ---------- RECAP ---------- */
SC.recap = c => {
  const { W, board, ids, tch } = classScene(c, 'rc'); const ban = G(board); chalk(ban, 'งานวันเด็ก', 960, 360, 150, '', '#FFE27A'); [700, 1220].forEach(x => { el('circle', { cx: x, cy: 460, r: 34, fill: '#FF6B8A' }, ban); el('path', { d: `M${x},494 q-10,30 6,60`, stroke: '#fff', 'stroke-width': 3, fill: 'none' }, ban); });
  const kids = c.at('kids'), kh = c.at('khao');
  T(kids, `#${ids[0]}_armL`, { rotation: 140, duration: .3 }); T(kids, `#${ids[0]}_armR`, { rotation: -140, duration: .3 }); O(kids + .3, `#${ids[0]}_body`, { rotation: -6 }, { rotation: 6, duration: .4, repeat: 5, yoyo: true }); T(kids + 2.8, [`#${ids[0]}_armL`, `#${ids[0]}_armR`, `#${ids[0]}_body`], { rotation: 0, duration: .3 }); happy(ids[0], kids, kh);
  drumming(ids[2], kids + .8, kids + 3.4, .18); happy(ids[2], kids + .8, kh);
  const hat = G(W, { opacity: 0 }); el('path', { d: 'M-128,-292 Q0,-392 128,-292 Q0,-270 -128,-292Z', fill: '#E3B35F' }, hat); el('path', { d: 'M-70,-302 Q0,-330 70,-302', fill: 'none', stroke: '#D9453B', 'stroke-width': 8 }, hat); place(hat, 1420, 1075, .98);
  S(kh, hat, { opacity: 1 }); O(kh, hat, { y: 700 }, { y: 1075, duration: .7, ease: 'bounce.out' }); happy(ids[1], kh + .5, c.t1); sparkAt(W, 'rcSpk', 1420, 700, kh + .6, 12, 220);
  cam(W, c.t0, kh - c.t0, 1.0, 1.0, 960, 540); cam(W, kh, c.t1 - kh, 1.0, 1.25, 1420, 760);
  return { blink: [tch, ...ids] };
};

/* ---------- SATURDAY ---------- */
SC.saturday = c => {
  const W = G(c.root, { id: 'saW' }); mealRoom(W, 'saR', false);
  const mm = adult(W, 'saM', 'mom', { pose: 'sit' }); place(mm, 470, 930, .88); const b = kid(W, 'saB', { ...CASUAL, pose: 'sit', hat: true }); place(b, 960, 868, 1.0); const dd = adult(W, 'saF', 'dad', { pose: 'sit' }); place(dd, 1450, 930, .88);
  gsap.set('#saB_hat', { opacity: 0 }); mealTray(W, 'saT');
  const ask = c.at('ask'), hat = c.at('hat');
  closed('saB', c.t0, c.t0 + 2.4); T(c.t0 + 2.6, '#saB_armR', { rotation: -150, duration: .3 }); O(c.t0 + 2.9, '#saB_armR', { rotation: -150 }, { rotation: -130, duration: .25, repeat: 3, yoyo: true }); T(c.t0 + 4, '#saB_armR', { rotation: 0, duration: .3 });
  happy('saB', ask, ask + 3); happy('saF', c.L(c.Lt('ได้เลยลูก')), c.t1);
  eatLoop('saB', c.Le(c.Lt('ได้เลยลูก')) + .2, hat - .2, 132, 1.2); eatLoop('saF', c.Le(c.Lt('ได้เลยลูก')) + .6, c.t1, 140, 1.5);
  const h2 = G(W); el('path', { d: 'M-128,-292 Q0,-392 128,-292 Q0,-270 -128,-292Z', fill: '#E3B35F' }, h2); el('path', { d: 'M-70,-302 Q0,-330 70,-302', fill: 'none', stroke: '#D9453B', 'stroke-width': 8 }, h2); place(h2, 520, 610, .7); gsap.set(h2, { opacity: 0 });
  T(hat, '#saM_armR', { rotation: -60, duration: .4 }); S(hat + .5, h2, { opacity: 1 }); T(hat + .6, h2, { x: 960, y: 910, scale: 1, duration: .8, ease: 'power2.inOut' }); S(hat + 1.4, h2, { opacity: 0 }); S(hat + 1.4, '#saB_hat', { opacity: 1 }); T(hat + 1.2, '#saM_armR', { rotation: 0, duration: .4 });
  happy('saB', c.L(c.Lt('ครับแม่')), c.t1); happy('saM', c.L(c.Lt('ครับแม่')), c.t1);
  cam(W, c.t0, c.s.dur, 1.0, 1.1, 960, 700);
  return { speakers: { B: 'saB', F: 'saF', M: 'saM' }, blink: ['saB', 'saF', 'saM'] };
};

/* ---------- LESSON (planting) ---------- */
function paddyCast(W, pre) {
  const dad = adult(W, pre + 'F', 'dad', { shadow: false }); place(dad, 1260, 1080, 1.0);
  const bundle = G($(pre + 'F_armL')); el('path', { d: 'M-70,-176 l-10,-60 M-64,-176 l0,-66 M-58,-176 l10,-58', stroke: '#5CBF5A', 'stroke-width': 7, 'stroke-linecap': 'round' }, bundle); el('rect', { x: -78, y: -186, width: 26, height: 12, rx: 4, fill: '#C8994F' }, bundle);
  const b = kid(W, pre + 'B', { ...CASUAL, hat: true, shadow: false }); place(b, 700, 1075, 1.1);
  const bb = G($(pre + 'B_armL')); el('path', { d: 'M-50,-106 l-8,-40 M-46,-106 l0,-44 M-42,-106 l8,-38', stroke: '#5CBF5A', 'stroke-width': 6, 'stroke-linecap': 'round' }, bb);
  return { dad, b, bb };
}
function paddyFront(W, cls) { const front = G(W); el('rect', { y: 930, width: 1920, height: 150, fill: '#5E9EA3', opacity: .82 }, front); for (let i = 0; i < 10; i++) el('path', { class: cls, d: `M${i * 210 - 40},${960 + (i % 3) * 35} q40,-10 80,0 t80,0`, fill: 'none', stroke: '#fff', 'stroke-width': 4, opacity: .35 }, front); return front; }
SC.lesson = c => {
  const W = G(c.root, { id: 'leW' }); const cl = paddyBack(W); T(c.t0, cl, { x: 100, duration: c.s.dur, ease: 'none' });
  const rows = G(W); const seeds = []; [700, 760].forEach((y, r) => { for (let x = 160 + r * 40; x < 1800; x += 130) { const g = seedling(rows, x, y, .35 + r * .1); seeds.push(g); } });
  paddyCast(W, 'le'); paddyFront(W, 'leWl'); const rp = G(W); ripple(rp, 'leRd', 1255, 915);
  const p1 = seedling(W, 1255, 925, .5, 'leP1'); gsap.set(p1, { opacity: 0 });
  const mine = [560, 620, 680, 740, 800].map((x, i) => { const s = seedling(W, x - 140, 928, .42); gsap.set(s, { opacity: 0 }); return s; });
  tl.fromTo('.leWl', { x: -30 }, { x: 30, duration: 2.4, repeat: Math.floor(c.s.dur / 2.4), yoyo: true, stagger: .2, immediateRender: false }, c.t0);
  const hold = c.at('hold'), plant = c.at('plant'), tryT = c.at('try');
  T(c.L(c.Lt('นี่คือต้นกล้า')), '#leF_armL', { rotation: 40, duration: .4 }); T(hold, '#leF_armL', { rotation: 0, duration: .4 });
  T(plant, '#leF_up', { rotation: -8, svgOrigin: '0 -160', duration: .5 }); T(plant, '#leF_armR', { rotation: 18, duration: .5 }); S(plant + .6, p1, { opacity: 1 }); O(plant + .6, p1, { scale: .1 }, { scale: .5, duration: .4, ease: 'back.out(2)' }); rippleAt(plant + .6, 'leRd');
  T(plant + 1.4, '#leF_up', { rotation: 0, duration: .5 }); T(plant + 1.4, '#leF_armR', { rotation: 0, duration: .5 });
  happy('leB', c.L(c.Lt('ผมขอลอง')), c.t1);
  mine.forEach((s, i) => { const t = tryT + .6 + i * 1.3; T(t - .5, '#leB_armR', { rotation: 30, duration: .35 }); S(t, s, { opacity: 1 }); O(t, s, { scaleY: .1 }, { scaleY: .42, duration: .35, ease: 'back.out(2)' }); T(t + .2, '#leB_armR', { rotation: 0, duration: .35 }); });
  happy('leF', c.L(c.Lt('เก่งมากลูก')), c.t1); sparkAt(W, 'leSpk', 480, 880, c.L(c.Lt('เก่งมากลูก')) + .3, 10, 180);
  cam(W, c.t0, c.s.dur, 1.0, 1.1, 980, 860);
  return { speakers: { B: 'leB', F: 'leF' }, blink: ['leB', 'leF'] };
};

/* ---------- MUD ---------- */
SC.mud = c => {
  const W = G(c.root, { id: 'mdW' }); const cl = paddyBack(W); T(c.t0, cl, { x: 80, duration: c.s.dur, ease: 'none' });
  const rows = G(W); [700, 760].forEach((y, r) => { for (let x = 160 + r * 40; x < 1800; x += 130) seedling(rows, x, y, .35 + r * .1); });
  const { b } = paddyCast(W, 'md'); mudSpots('mdB', 'mdMud');
  const sitB = kid(W, 'mdBs', { ...CASUAL, pose: 'sit', hat: true, shadow: false }); place(sitB, 700, 1010, 1.1); mudSpots('mdBs', 'mdMud2'); gsap.set(sitB, { opacity: 0 }); gsap.set('.mdMud2', { opacity: 1 });
  paddyFront(W, 'mdWl'); tl.fromTo('.mdWl', { x: -30 }, { x: 30, duration: 2.4, repeat: Math.floor(c.s.dur / 2.4), yoyo: true, stagger: .2, immediateRender: false }, c.t0);
  const drops = G(W); for (let i = 0; i < 12; i++) { const w = G(drops, { transform: `translate(${640 + (i % 6) * 22},${930})` }); el('circle', { class: 'mdDrop', r: R(8, 14), fill: '#7A5638', opacity: 0 }, w); }
  const slip = c.at('slip'), laugh = c.at('laugh'), talkT = c.at('talk');
  T(slip, '#mdB_legR', { rotation: -40, duration: .2 }); T(slip + .1, b, { rotation: -70, y: 1060, duration: .4, ease: 'power2.in' }); sad('mdB', slip, laugh);
  const sp = c.at('slip') + (TIMELINE.sfx.find(x => x.name === 'splash' && x.t >= slip) || { t: slip + 2 }).t - slip;
  tl.fromTo('.mdDrop', { opacity: 1, x: 0, y: 0 }, { opacity: 0, x: () => R(-160, 160), y: () => R(-220, -60), duration: .8, ease: 'power2.out', stagger: .01, immediateRender: false }, sp - .1);
  S(sp, b, { opacity: 0 }); S(sp, sitB, { opacity: 1 }); sad('mdBs', sp, laugh); T(sp, '#mdBs_head', { rotation: -8, duration: .3 });
  T(laugh, '#mdBs_head', { rotation: 0, duration: .3 }); happy('mdBs', laugh, c.t1); happy('mdF', laugh, c.t1); O(laugh + .2, '#mdBs_body', { y: 0 }, { y: -8, duration: .16, repeat: 11, yoyo: true }); O(laugh + .2, '#mdF_body', { y: 0 }, { y: -6, duration: .2, repeat: 9, yoyo: true });
  const help = c.L(c.Lt('ไม่เป็นไรลูก')); T(help, '#mdF_armL', { rotation: -30, duration: .4 }); T(help + 2, '#mdF_armL', { rotation: 0, duration: .4 });
  T(talkT, '#mdF_armR', { rotation: -40, duration: .4 }); T(c.Le(c.Lt('ข้าวทุกเม็ด')) + .5, '#mdF_armR', { rotation: 0, duration: .4 });
  cam(W, c.t0, slip - c.t0 + 1, 1.0, 1.0, 960, 540); cam(W, slip + 1, c.t1 - slip - 1, 1.0, 1.25, 900, 880);
  return { speakers: ln => ({ F: 'mdF', B: c.t0 + ln.t < sp ? 'mdB' : 'mdBs' })[ln.who] || null, blink: ['mdB', 'mdBs', 'mdF'] };
};

/* ---------- THUI WASH ---------- */
SC.thuiwash = c => {
  const W = G(c.root, { id: 'twW' }); sky(W, null, 'gNoon'); const cl = G(W); cloud(cl, 300, 150, .9); cloud(cl, 1400, 120, 1); mountains(W, '#9CC4D2', '#86B89C', -80); palm(W, 200, 600, 260, .8); palm(W, 1700, 600, 280, .85); banana(W, 1500, 620, 1.0);
  el('rect', { y: 580, width: 1920, height: 60, fill: '#6FAF4B' }, W); el('rect', { y: 630, width: 1920, height: 450, fill: 'url(#gCanal)' }, W); T(c.t0, cl, { x: 80, duration: c.s.dur, ease: 'none' });
  const bu = buffalo(W, 'twU'); place(bu, 760, 960, 1.05); const b = kid(W, 'twB', { ...CASUAL, shadow: false }); place(b, 1250, 990, 1.0); mudSpots('twB', 'twMud'); gsap.set('.twMud', { opacity: 1 });
  const bowl = G($('twB_armR')); el('path', { d: 'M40,-110 L110,-110 Q104,-80 75,-78 Q46,-80 40,-110Z', fill: '#C0C7CF' }, bowl);
  const front = G(W); el('rect', { y: 900, width: 1920, height: 180, fill: '#5E9EA3', opacity: .85 }, front); for (let i = 0; i < 10; i++) el('path', { class: 'twWl', d: `M${i * 210 - 40},${930 + (i % 3) * 40} q40,-10 80,0 t80,0`, fill: 'none', stroke: '#fff', 'stroke-width': 4, opacity: .4 }, front);
  tl.fromTo('.twWl', { x: -30 }, { x: 30, duration: 2.4, repeat: Math.floor(c.s.dur / 2.4), yoyo: true, stagger: .2, immediateRender: false }, c.t0);
  const drops = G(W); for (let i = 0; i < 10; i++) { const w = G(drops, { transform: `translate(${1150 + (i % 5) * 16},${820})` }); el('circle', { class: 'twDrop', r: 7, fill: '#BFE6FF', opacity: 0 }, w); }
  const bub = G(W); seed(12); for (let i = 0; i < 14; i++) { const w = G(bub, { transform: `translate(${R(560, 1000)},${R(760, 880)})` }); el('circle', { class: 'twBub', r: R(8, 18), fill: '#fff', stroke: '#BFE8FF', 'stroke-width': 2, opacity: 0 }, w); }
  const spl = c.at('splash'), bb = c.at('bubble');
  for (let k = 0; k < 5; k++) { const t = spl + k * 1.6; T(t, '#twB_armR', { rotation: 50, duration: .4 }); T(t + .5, '#twB_armR', { rotation: -60, duration: .25 }); tl.fromTo('.twDrop', { opacity: 1, x: 0, y: 0 }, { opacity: 0, x: () => R(-260, -120), y: () => R(-80, 40), duration: .7, stagger: .02, immediateRender: false }, t + .6); T(t + 1.0, '#twB_armR', { rotation: 0, duration: .3 }); }
  T(spl + 1, '.twMud', { opacity: 0, duration: 4, stagger: .5 });
  loop(c.t0, c.t1, '#twU_tail', { rotation: -10 }, { rotation: 14 }, .6); TIMELINE.sfx.filter(x => x.name === 'moo' && x.t > c.t0 && x.t < c.t1).forEach(m => { T(m.t - .1, '#twU_head', { rotation: -18, duration: .35 }); T(m.t + 1.3, '#twU_head', { rotation: 0, duration: .4 }); });
  tl.fromTo('.twBub', { opacity: 0, scale: .3 }, { opacity: .9, scale: 1, duration: .8, stagger: .15, yoyo: true, repeat: 3, immediateRender: false }, bb);
  happy('twB', c.L(c.Lt('ทุย อาบน้ำ')), c.t1); closed('twU', bb, c.t1);
  cam(W, c.t0, c.s.dur, 1.0, 1.1, 980, 800);
  return { speakers: { B: 'twB' }, blink: ['twB'] };
};

/* ---------- LINES (practice to Thui) ---------- */
SC.lines = c => {
  const W = G(c.root, { id: 'lnW' }); villageWide(W, { sunX: 1500, sunY: 220 }); el('rect', { y: 870, width: 1920, height: 210, fill: '#C19A67' }, W); grassTufts(W, 880, 30, '#6FAF4B', '#5FA442', 34);
  const bu = buffalo(W, 'lnU'); place(bu, 650, 1000, 1.2); const b = kid(W, 'lnB', { ...CASUAL, hat: true }); place(b, 1300, 1010, 1.15, true);
  const sp = c.at('speak'), ask = c.at('ask');
  T(sp, '#lnB_armR', { rotation: -40, duration: .3 }); T(sp + .3, '#lnB_armL', { rotation: 60, duration: .3 }); T(c.L(c.Lt('ผมช่วยพ่อ')), '#lnB_armL', { rotation: 0, duration: .3 }); T(c.L(c.Lt('ผมช่วยพ่อ')), '#lnB_armR', { rotation: -120, duration: .3 }); T(c.Le(c.Lt('ผมช่วยพ่อ')), '#lnB_armR', { rotation: 0, duration: .3 });
  happy('lnB', sp, sp + 3); happy('lnB', ask, c.t1);
  TIMELINE.sfx.filter(x => x.name === 'moo' && x.t > c.t0 && x.t < c.t1).forEach(m => { T(m.t - .1, '#lnU_head', { rotation: -18, duration: .35 }); T(m.t + 1.3, '#lnU_head', { rotation: 0, duration: .4 }); });
  loop(c.t0, c.t1, '#lnU_tail', { rotation: -10 }, { rotation: 14 }, .7); O(c.L(c.Lt('ทุยส่ายหาง')), '#lnU_tail', { rotation: -25 }, { rotation: 30, duration: .18, repeat: 15, yoyo: true });
  hearts(W, 'lnHeart', 700, 640, c.L(c.Lt('ทุยส่ายหาง')) + .5);
  cam(W, c.t0, c.s.dur, 1.0, 1.1, 980, 800);
  return { speakers: { B: 'lnB' }, blink: ['lnB'] };
};

/* ---------- MARKET ---------- */
SC.market = c => {
  const W = G(c.root, { id: 'mkW' }); sky(W, null, 'gDay'); cloud(W, 300, 140, .9); cloud(W, 1400, 110, 1); mountains(W, '#9CC4D2', '#86B89C', -120);
  el('rect', { y: 560, width: 1920, height: 520, fill: '#D8C089' }, W); marketStall(W, 1860 + 0, 780); marketStall(W, 80, 760);
  const sel = adult(W, 'mkS', 'mom'); place(sel, 960, 760, .72); recolor(sel, { '#E0648C': '#F2A93B', '#B8476C': '#C98320' });
  const st = marketStall(W, 960, 820); const cols = ['#E53935', '#FDD835', '#43A047', '#1E63C4']; const RX = [560, 760, 1160, 1360]; const rolls = cols.map((col, i) => clothRoll(W, RX[i], 570, col, .95));
  const mm = adult(W, 'mkM', 'mom'); place(mm, 520, 1060, .95); const b = kid(W, 'mkB', { ...CASUAL }); place(b, 820, 1060, 1.0);
  const labs = ['สีแดง', 'สีเหลือง', 'สีเขียว', 'สีน้ำเงิน'].map((t, i) => domEl(c.dom, 'num', t, `left:${RX[i] - 90}px;top:${330}px;width:180px;font-size:44px;text-align:center`));
  ['c0', 'c1', 'c2', 'c3'].forEach((m, i) => { const t = c.at(m); O(t, rolls[i], { y: 570 }, { y: 530, duration: .2, yoyo: true, repeat: 1 }); popIn(t, labs[i], .35); });
  labs.forEach(l => T(c.at('pick') + 3, l, { opacity: 0, duration: .4 }));
  const pick = c.at('pick'); T(pick, '#mkB_armR', { rotation: -130, duration: .3 }); T(pick + 2.5, '#mkB_armR', { rotation: 0, duration: .3 }); happy('mkB', pick, c.t1); sparkAt(W, 'mkSpk', 1360, 480, pick + .2, 10, 130); T(pick + .4, rolls[3], { scale: 1.08, svgOrigin: '1360 570', duration: .3, yoyo: true, repeat: 3 });
  const cnt = c.at('count'), cd = c.line(c.Lt('สิบ ยี่สิบ')).d; const coins = [0, 1, 2, 3, 4].map(i => { const g = coin(W, 780 + i * 90, 700, 1.1); gsap.set(g, { opacity: 0 }); return g; });
  const nums = [10, 20, 30, 40, 50].map((n, i) => domEl(c.dom, 'num', String(n), `left:${780 + i * 90 - 48}px;top:${560}px`));
  coins.forEach((g, i) => { const t = cnt + i * cd / 6.2; S(t, g, { opacity: 1 }); O(t, g, { y: 660 }, { y: 700, duration: .3, ease: 'bounce.out' }); popIn(t, nums[i], .3); });
  const paid = c.at('paid'); T(paid, coins, { x: 960, y: 560, opacity: 0, duration: .7, stagger: .08 }); nums.forEach(n => T(paid, n, { opacity: 0, duration: .4 })); happy('mkS', paid, c.t1); happy('mkM', c.L(c.Lt('เก่งมากจ้ะ')), c.t1);
  T(cnt - .3, '#mkB_armR', { rotation: -40, duration: .3 }); T(paid, '#mkB_armR', { rotation: 0, duration: .3 });
  cam(W, c.t0, c.s.dur, 1.0, 1.06, 960, 700);
  return { speakers: { B: 'mkB', M: 'mkM' }, blink: ['mkB', 'mkM', 'mkS'] };
};

/* ---------- COSTUME ---------- */
SC.costume = c => {
  const W = G(c.root, { id: 'coW' }); mealRoom(W, 'coR', true);
  const mm = adult(W, 'coM', 'mom'); place(mm, 520, 1000, .95); const dd = adult(W, 'coF', 'dad'); place(dd, 1420, 1000, .95);
  const b0 = kid(W, 'coB0', CASUAL); place(b0, 960, 1000, 1.1); const b1 = kid(W, 'coB', FARMER); place(b1, 960, 1000, 1.1); sash('coB'); gsap.set(b1, { opacity: 0 }); gsap.set('#coB_sash', { opacity: 0 });
  const cloth = G($('coM_armR')); el('path', { d: 'M40,-190 L140,-190 L150,-100 L30,-100Z', fill: '#2A4B8D' }, cloth); el('path', { d: 'M110,-190 q-20,40 0,90', stroke: '#1B3566', 'stroke-width': 4, fill: 'none' }, cloth);
  nightTint(W);
  const wear = c.at('wear'), sh = c.at('sash'); T(c.L(c.Lt('ลองใส่ดูสิ')), '#coM_armR', { rotation: -50, duration: .4 }); T(wear - .2, '#coM_armR', { rotation: 0, duration: .3 }); S(wear, cloth, { opacity: 0 });
  O(wear, b0, { scaleX: 1.1 }, { scaleX: 0, duration: .3, ease: 'power1.in' }); S(wear + .3, b0, { opacity: 0 }); S(wear + .3, b1, { opacity: 1 }); O(wear + .3, b1, { scaleX: 0 }, { scaleX: 1.1, duration: .35, ease: 'back.out(2)' });
  sparkAt(W, 'coSpk', 960, 650, wear + .3, 14, 240); happy('coB', wear + .4, c.t1); hop('#coB', wear + 1, 2, 1000, 40);
  happy('coF', c.L(c.Lt('หล่อมากลูก')), c.t1); happy('coM', c.L(c.Lt('หล่อมากลูก')), c.t1);
  const sashF = G(W, { opacity: 0 }); el('rect', { x: -46, y: -8, width: 92, height: 18, rx: 7, fill: 'url(#pPakaW)' }, sashF); place(sashF, 560, 760, 1.1);
  T(sh, '#coM_armR', { rotation: -50, duration: .4 }); S(sh + .2, sashF, { opacity: 1 }); T(sh + .4, sashF, { x: 960, y: 1000 - 117 * 1.1, duration: .8, ease: 'power2.inOut' }); S(sh + 1.2, sashF, { opacity: 0 }); S(sh + 1.2, '#coB_sash', { opacity: 1 }); T(sh + 1.2, '#coM_armR', { rotation: 0, duration: .4 });
  wai('coB', c.L(c.Lt('ขอบคุณครับแม่')) + .4, 1.8);
  cam(W, c.t0, c.s.dur, 1.0, 1.08, 960, 720);
  return { speakers: ln => ({ F: 'coF', M: 'coM', B: c.t0 + ln.t < wear + .3 ? 'coB0' : 'coB' })[ln.who] || null, blink: ['coB0', 'coB', 'coF', 'coM'] };
};

/* ---------- KAEW (dance with grandma) ---------- */
SC.kaew = c => {
  const W = G(c.root, { id: 'kwW' }); const cl = yardScene(W); T(c.t0, cl, { x: 80, duration: c.s.dur, ease: 'none' });
  const y1 = adult(W, 'kwY', 'yai'); place(y1, 520, 1000, .95); const k = kid(W, 'kwK', { ...KAEW, uniform: false, shirt: '#F48FB1', collar: '#E0648C', lowerColor: '#8E44AD' }); place(k, 900, 1010, 1.05);
  const b = kid(W, 'kwB', CASUAL); place(b, 2100, 1010, 1.05, true);
  const dance = c.at('dance'), kh = c.at('khao');
  let t = dance; const yDance = (t0, t1) => { let tt = t0, n = 0; while (tt + 1.4 <= t1) { const a = n % 2; T(tt, '#kwY_armL', { rotation: a ? 60 : 120, duration: .6 }); T(tt, '#kwY_armR', { rotation: a ? -120 : -60, duration: .6 }); tt += 1.4; n++; } T(t1, ['#kwY_armL', '#kwY_armR'], { rotation: 0, duration: .4 }); };
  yDance(dance, c.L(c.Lt('ใช่จ้ะ')) + 2); danceStep('kwK', dance + .8, kh + 6, 1.3, 5); happy('kwK', c.L(c.Lt('ใช่จ้ะ')), c.t1); happy('kwY', c.L(c.Lt('ใช่จ้ะ')), c.t1);
  notesAt(W, 'kwNote', 860, 640, dance + 1, 3);
  walkCycle('kwB', kh - 1.8, kh - .1, .25); T(kh - 1.8, b, { x: 1350, duration: 1.7, ease: 'power1.out' }); happy('kwB', kh, c.t1); clapping(['kwB'], c.Le(c.Lt('แก้วรำสวย')) + .1, c.Le(c.Lt('แก้วรำสวย')) + 1.6);
  cam(W, c.t0, c.s.dur, 1.0, 1.08, 900, 780);
  return { speakers: { Y: 'kwY', G: 'kwK', B: 'kwB' }, blink: ['kwY', 'kwK', 'kwB'] };
};

/* ---------- TON (drum, hens) ---------- */
SC.ton = c => {
  const W = G(c.root, { id: 'tnW' }); const cl = yardScene(W, { houseX: 1500 }); T(c.t0, cl, { x: 80, duration: c.s.dur, ease: 'none' });
  const t = kid(W, 'tnT', { ...TON, uniform: false, shirt: '#42A5F5', collar: '#1E88E5', lowerColor: '#37474F' }); place(t, 1000, 1010, 1.05); const dr = drum(W, 'tnDr', 1000, 1030, .8);
  const k = kid(W, 'tnK', { ...KAEW, uniform: false, shirt: '#F48FB1', collar: '#E0648C', lowerColor: '#8E44AD' }); place(k, -200, 1010, 1.0); const b = kid(W, 'tnB', CASUAL); place(b, -380, 1010, 1.0);
  const hens = [[520, 1040], [640, 1060], [1400, 1050]].map(([x, y], i) => { const h = hen(W, 'tnH' + i); place(h, x, y, 1.0, i === 2); return h; }); const ch = chick(W, 'tnC'); place(ch, 1500, 1070, 1.0);
  hens.forEach((h, i) => loop(c.t0, c.at('drum'), `#tnH${i}_head`, { rotation: 0 }, { rotation: 25 }, .5 + i * .1));
  const drm = c.at('drum'), stop = c.at('stop'), soft = c.at('soft');
  walkCycle('tnK', c.t0 + .5, c.t0 + 3, .25); T(c.t0 + .5, k, { x: 380, duration: 2.5, ease: 'power1.out' }); walkCycle('tnB', c.t0 + .7, c.t0 + 3.2, .25); T(c.t0 + .7, b, { x: 220, duration: 2.5, ease: 'power1.out' });
  drumming('tnT', drm, drm + 5.2, .14); happy('tnT', drm, stop);
  hens.forEach((h, i) => { const dir = i === 2 ? 1 : -1; S(drm + .6 + i * .2, h, { scaleX: dir }); T(drm + .6 + i * .2, h, { x: dir > 0 ? 2200 : -300, duration: 2.2, ease: 'power1.in' }); O(drm + .6 + i * .2, `#tnH${i}_body`, { y: 0 }, { y: -20, duration: .1, repeat: 21, yoyo: true }); });
  S(drm + 1, ch, { scaleX: 1 }); T(drm + 1, ch, { x: 2200, duration: 2.4, ease: 'power1.in' });
  [k, b].forEach((g, i) => { const id = i ? 'tnB' : 'tnK'; T(drm + .3, `#${id}_armL`, { rotation: 150, duration: .2 }); T(drm + .3, `#${id}_armR`, { rotation: -150, duration: .2 }); T(stop - .3, [`#${id}_armL`, `#${id}_armR`], { rotation: 0, duration: .3 }); });
  const sw = el('path', { id: 'tnSweat', d: 'M0,0 q10,16 0,24 q-10,-8 0,-24Z', fill: '#8FD3FF', opacity: 0 }, W); gsap.set(sw, { x: 1060, y: 700 }); O(c.L(c.Lt('ขอโทษครับ')), sw, { opacity: 1, y: 700 }, { y: 760, opacity: 0, duration: 1.2, ease: 'power1.in' });
  happy('tnB', c.L(c.Lt('ไก่ตกใจ')), c.t1); drumming('tnT', soft, soft + 4.6, .45); happy('tnT', soft, c.t1); happy('tnK', c.L(c.Lt('แบบนี้เพราะ')), c.t1);
  notesAt(W, 'tnNote', 960, 700, soft + .3, 2);
  cam(W, c.t0, c.s.dur, 1.0, 1.06, 900, 800);
  return { speakers: { G: 'tnK', O: 'tnT', B: 'tnB' }, blink: ['tnK', 'tnT', 'tnB'] };
};

/* ---------- MONDAY ---------- */
SC.monday = c => {
  const W = G(c.root, { id: 'mnW' }); const cl = schoolYard(W); T(c.t0, cl, { x: 80, duration: c.s.dur, ease: 'none' });
  const ids = kidSet(W, 'mn', [620, 960, 1300], 1000, 1.05, { bag: null });
  const laugh = c.at('laugh'), want = c.at('want');
  T(c.L(1), `#${ids[1]}_armR`, { rotation: -40, duration: .3 }); T(c.L(1) + .3, `#${ids[1]}_armL`, { rotation: 60, duration: .3 }); T(c.Le(1), [`#${ids[1]}_armR`, `#${ids[1]}_armL`], { rotation: 0, duration: .3 });
  happy(ids[2], laugh, laugh + 3); O(laugh, `#${ids[2]}_body`, { y: 0 }, { y: -8, duration: .15, repeat: 11, yoyo: true }); happy(ids[1], laugh + .4, laugh + 3);
  sad(ids[0], c.L(c.Lt('แล้วเจ็บไหม')), c.Le(c.Lt('แล้วเจ็บไหม')) + .3); happy(ids[1], c.L(c.Lt('ไม่เจ็บเลย')), c.t1);
  happy(ids[0], want, c.t1); T(want, `#${ids[0]}_armL`, { rotation: 40, duration: .3 }); T(want, `#${ids[0]}_armR`, { rotation: -40, duration: .3 }); T(want + 2, [`#${ids[0]}_armL`, `#${ids[0]}_armR`], { rotation: 0, duration: .3 });
  T(c.L(c.Lt('รอดูในวันงาน')), `#${ids[1]}_armR`, { rotation: -150, duration: .3 }); O(c.L(c.Lt('รอดูในวันงาน')) + .3, `#${ids[1]}_armR`, { rotation: -150 }, { rotation: -125, duration: .2, repeat: 5, yoyo: true }); T(c.Le(c.Lt('รอดูในวันงาน')) + .5, `#${ids[1]}_armR`, { rotation: 0, duration: .3 });
  cam(W, c.t0, c.s.dur, 1.0, 1.1, 960, 760);
  return { speakers: { G: ids[0], B: ids[1], O: ids[2] }, blink: ids };
};
