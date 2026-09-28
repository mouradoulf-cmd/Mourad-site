/* งานวันเด็ก ตอนที่ 1 — scenes: lunch, story, garden, sport, art, cleanup, homeward, evening, homework, bed, end */
function canteen(p) { el('rect', { width: 1920, height: 760, fill: '#F3E6CF' }, p); for (let x = 0; x < 1920; x += 60) for (let y = 440; y < 760; y += 60) el('rect', { x: x + 2, y: y + 2, width: 56, height: 56, fill: (x / 60 + y / 60) % 2 ? '#DDEFF5' : '#EAF6FA' }, p);
  [[160, 110], [760, 110], [1360, 110]].forEach(([x, y]) => { el('rect', { x, y, width: 400, height: 260, fill: '#BFE6F7' }, p); el('rect', { x, y, width: 400, height: 260, fill: 'none', stroke: '#8B5E34', 'stroke-width': 12 }, p); }); el('rect', { y: 760, width: 1920, height: 320, fill: '#C9B28A' }, p); }
function longTable(p, y) { el('rect', { x: 160, y, width: 1600, height: 30, rx: 8, fill: '#D59A5E' }, p); el('rect', { x: 180, y: y + 30, width: 1560, height: 130, fill: '#B98352' }, p); }

/* ---------- LUNCH ---------- */
SC.lunch = c => {
  const wash = c.at('wash'), table = c.at('table');
  const A = G(c.root, { id: 'luA' }); canteen(A); const sink = G(A); el('rect', { x: 300, y: 720, width: 1320, height: 90, rx: 14, fill: '#CFD8DC' }, sink); el('rect', { x: 320, y: 730, width: 1280, height: 40, rx: 10, fill: '#90A4AE' }, sink); [520, 960, 1400].forEach(x => { el('rect', { x: x - 8, y: 620, width: 16, height: 100, fill: '#B0BEC5' }, sink); el('path', { d: `M${x},620 q40,0 40,40`, fill: 'none', stroke: '#B0BEC5', 'stroke-width': 14 }, sink); });
  const wIds = kidSet(A, 'luw', [520, 960, 1400], 1040, 1.0, { bag: null });
  const bub = G(A); seed(8); for (let i = 0; i < 18; i++) { const w = G(bub, { transform: `translate(${[520, 960, 1400][i % 3] + R(-40, 40)},${780})` }); el('circle', { class: 'luBub', r: R(6, 14), fill: '#fff', stroke: '#BFE8FF', 'stroke-width': 2, opacity: 0 }, w); }
  wIds.forEach((id, i) => { T(wash + .2, [`#${id}_armL`, `#${id}_armR`], { rotation: (k) => k ? 30 : -30, duration: .3 }); O(wash + .5, `#${id}_armL`, { rotation: -30 }, { rotation: -40, duration: .15, repeat: 20, yoyo: true }); O(wash + .5, `#${id}_armR`, { rotation: 30 }, { rotation: 40, duration: .15, repeat: 20, yoyo: true }); S(table - .5, [`#${id}_armL`, `#${id}_armR`], { rotation: 0 }); happy(id, wash + 1, table); });
  tl.fromTo('.luBub', { opacity: 0, y: 0, scale: .3 }, { opacity: .9, y: -120, scale: 1, duration: 1.2, stagger: .12, repeat: 2, immediateRender: false }, wash + .5);
  const Bq = G(c.root, { id: 'luB', opacity: 0 }); canteen(Bq);
  const ids = kidSet(Bq, 'lub', [560, 960, 1360], 1000, 1.0, { bag: null }); longTable(Bq, 860);
  const boxes = [lunchbox(Bq, 560, 880, 'rice', 1.3), lunchbox(Bq, 960, 880, 'egg', 1.3)]; const lid = G(Bq); el('rect', { x: -60, y: -34, width: 120, height: 14, rx: 6, fill: '#2E86C1' }, lid); gsap.set(lid, { x: 960, y: 880 });
  const share = lunchbox(Bq, 1360, 880, 'egg', 1.1); gsap.set(share, { opacity: 0 });
  T(wash + (table - wash) - .5, A, { opacity: 0, duration: .5 }); T(table - .5, Bq, { opacity: 1, duration: .5 });
  const op = c.at('open'); T(op, lid, { y: 760, rotation: -30, opacity: 0, duration: .6 }); happy(ids[1], c.L(c.Lt('ว้าว แม่ทำ')), c.at('oops'));
  const oops = c.at('oops'); sad(ids[2], oops, c.at('share') + 1.5); T(oops, `#${ids[2]}_armL`, { rotation: 30, duration: .3 }); T(oops, `#${ids[2]}_armR`, { rotation: -30, duration: .3 }); T(c.at('share'), [`#${ids[2]}_armL`, `#${ids[2]}_armR`], { rotation: 0, duration: .3 });
  const sh = c.at('share'); T(sh + .3, `#${ids[1]}_armR`, { rotation: 40, duration: .4 }); S(sh + .6, share, { opacity: 1 }); O(sh + .6, share, { x: 960 }, { x: 1360, duration: .8, ease: 'power2.inOut' }); T(sh + 1.4, `#${ids[1]}_armR`, { rotation: 0, duration: .4 });
  happy(ids[2], c.L(c.Lt('ขอบใจมากนะเพื่อน')), c.t1); happy(ids[0], c.L(c.Lt('หนูแบ่ง')), c.t1); happy(ids[1], c.L(c.Lt('ขอบใจมากนะเพื่อน')), c.t1);
  const hs = G(Bq); for (let i = 0; i < 4; i++) { const w = G(hs, { transform: `translate(${1300 + i * 40},${640})` }); el('path', { class: 'luHeart', d: 'M0,0 C-20,-22 -44,4 0,34 C44,4 20,-22 0,0Z', fill: '#FF6B8A', opacity: 0 }, w); }
  tl.fromTo('.luHeart', { opacity: 0, y: 0, scale: .3 }, { opacity: 1, y: -80, scale: 1, duration: .7, stagger: .25, ease: 'back.out(2)', immediateRender: false }, c.L(c.Lt('ขอบใจมากนะเพื่อน')) + .3); tl.to('.luHeart', { opacity: 0, y: -200, duration: 1, stagger: .25 }, c.L(c.Lt('ขอบใจมากนะเพื่อน')) + 1.3);
  eatLoop(ids[0], c.L(c.Lt('หนูแบ่ง')) + 2, c.t1, 132, 1.3); eatLoop(ids[1], c.Le(c.Lt('ขอบใจมากนะเพื่อน')) + .5, c.t1, 132, 1.2); eatLoop(ids[2], c.Le(c.Lt('ขอบใจมากนะเพื่อน')) + .8, c.t1, 132, 1.25);
  cam(Bq, table - .5, c.t1 - table + .5, 1.0, 1.1, 960, 760);
  return { speakers: ln => { const set = c.t0 + ln.t < table - .5 ? wIds : ids; return ({ G: set[0], B: set[1], O: set[2], C: set })[ln.who] || null; }, blink: [...wIds, ...ids] };
};

/* ---------- STORY ---------- */
SC.story = c => {
  const W = G(c.root, { id: 'stW' }); classroom(W); el('rect', { x: 200, y: 830, width: 1520, height: 200, rx: 20, fill: 'url(#pMat)', opacity: .9 }, W);
  const tch = adult(W, 'stTc', 'teacher', { pose: 'sit' }); place(tch, 330, 900, .9);
  const book = G($('stTc_armR')); el('path', { d: 'M20,-200 L90,-190 L90,-120 L20,-130Z', fill: '#E53935' }, book); el('path', { d: 'M90,-190 L160,-200 L160,-130 L90,-120Z', fill: '#FFCDD2' }, book); gsap.set('#stTc_armR', { rotation: -40 });
  const ids = kidSet(W, 'st', [860, 1130, 1400], 1040, .8, { bag: null, pose: 'sit' });
  const P = G(W, { id: 'stPanel' }); el('rect', { x: 560, y: 120, width: 1300, height: 560, rx: 30, fill: '#FFF8E6', stroke: '#8B5E34', 'stroke-width': 10 }, P); el('rect', { x: 580, y: 480, width: 1260, height: 180, fill: '#9CCC65' }, P); el('rect', { x: 580, y: 140, width: 1260, height: 340, fill: '#E3F4FD' }, P);
  cloud(P, 700, 220, .5); tree(P, 1300, 560, .6); const fin = G(P); el('rect', { x: 1740, y: 380, width: 8, height: 190, fill: '#6B4A2E' }, fin); el('path', { d: 'M1748,380 l70,24 l-70,24Z', fill: '#E53935' }, fin);
  const rb = rabbit(P, 'stRb'); place(rb, 700, 580, 1); const tt = turtle(P, 'stTt'); place(tt, 700, 630, 1);
  const zz = G(P); zzz(zz, 'stZ', 1330, 470); const cup = G(P, { id: 'stCup', opacity: 0 }); el('path', { d: 'M1640,300 L1720,300 Q1716,360 1680,370 Q1644,360 1640,300Z', fill: '#FFC107' }, cup); el('rect', { x: 1668, y: 368, width: 24, height: 30, fill: '#FFC107' }, cup); el('rect', { x: 1650, y: 396, width: 60, height: 14, fill: '#8B5E34' }, cup);
  S(c.t0, P, { opacity: 0 }); const op = c.at('open'); T(op, P, { opacity: 1, duration: .6 });
  const run = c.at('run'), slp = c.at('sleep'), wk = c.at('walk'), win = c.at('win');
  T(run, rb, { x: 1250, duration: 1.4, ease: 'power2.out' }); O(run, '#stRb', { y: 580 }, { y: 560, duration: .12, repeat: 11, yoyo: true });
  T(slp, rb, { rotation: 80, svgOrigin: '0 0', y: 600, duration: .5 }); tl.fromTo('.stZ', { opacity: 0, y: 0 }, { opacity: 1, y: -50, duration: 1.2, stagger: .35, repeat: Math.floor((c.t1 - slp) / 1.8), repeatDelay: .5, immediateRender: false }, slp + .4);
  O(run, tt, { x: 700 }, { x: 900, duration: slp - run, ease: 'none' }); T(slp, tt, { x: 1200, duration: wk - slp + 1, ease: 'none' }); T(wk + 1, tt, { x: 1700, duration: win - wk - 1, ease: 'none' });
  S(win, cup, { opacity: 1 }); O(win, cup, { scale: .3, svgOrigin: '1680 350' }, { scale: 1, duration: .5, ease: 'back.out(3)' });
  const sp = G(P); sparkleBurst(sp, 'stSpk', 1690, 380, 10, 120); tl.fromTo('.stSpk', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: .35, stagger: .04, yoyo: true, repeat: 1, ease: 'back.out(3)', immediateRender: false }, win);
  ids.forEach(id => happy(id, win, c.t1)); happy(ids[1], c.L(c.Lt('ผมจะพยายาม')), c.t1); T(c.L(c.Lt('ผมจะพยายาม')), `#${ids[1]}_armR`, { rotation: -150, duration: .3 }); T(c.Le(c.Lt('ผมจะพยายาม')) + .3, `#${ids[1]}_armR`, { rotation: 0, duration: .3 });
  cam(W, c.t0, c.s.dur, 1.0, 1.04, 1200, 400);
  return { speakers: { T: 'stTc', B: ids[1], G: ids[0], O: ids[2], C: ids }, blink: ['stTc', ...ids] };
};

/* ---------- GARDEN ---------- */
SC.garden = c => {
  const W = G(c.root, { id: 'gaW' }); sky(W, null, 'gDay'); const sn = sun(W, 'gaSun', 1680, 160); cloud(W, 400, 150, .9); school(W, 700, 620, .6);
  el('rect', { y: 610, width: 1920, height: 470, fill: '#C8A26E' }, W); grassTufts(W, 620, 40, '#79B85A', '#6AAE4E', 22);
  const sprouts = []; [700, 820, 940].forEach((y, r) => { el('rect', { x: 180, y: y - 40, width: 1560, height: 70, rx: 30, fill: '#7A5638' }, W); for (let x = 260; x < 1700; x += 120) { const s = seedling(W, x + (r % 2) * 50, y + 10, .3); sprouts.push(s); } });
  const ids = kidSet(W, 'ga', [640, 960, 1280], 1040, 1.0, { bag: null }); const can = wateringCan($(`${ids[1]}_armR`), 80, -110, .9);
  const tch = adult(W, 'gaTc', 'teacher'); place(tch, 1650, 1040, .9, true);
  const drops = G(W); for (let i = 0; i < 12; i++) { const w = G(drops, { transform: `translate(${1070 + (i % 4) * 14},${860})` }); el('circle', { class: 'gaDrop', r: 6, fill: '#8FD3FF', opacity: 0 }, w); }
  const rays = G(W, { opacity: 0 }); for (let i = 0; i < 10; i++) { const a = i / 10 * 6.28; el('path', { d: `M${1680 + Math.cos(a) * 120},${160 + Math.sin(a) * 120} L${1680 + Math.cos(a) * 200},${160 + Math.sin(a) * 200}`, stroke: '#FFD54F', 'stroke-width': 12, 'stroke-linecap': 'round' }, rays); }
  const wt = c.at('water'), su = c.at('sun'), so = c.at('soil'), gr = c.at('grow');
  T(wt, `#${ids[1]}_armR`, { rotation: -40, duration: .4 }); tl.fromTo('.gaDrop', { opacity: 1, y: 0 }, { opacity: 0, y: 120, duration: .6, stagger: .06, repeat: 3, immediateRender: false }, wt + .4); T(su - .2, `#${ids[1]}_armR`, { rotation: 0, duration: .4 });
  T(su, `#${ids[0]}_armR`, { rotation: -150, duration: .35 }); S(su, rays, { opacity: 1 }); loop(su, c.t1, rays, { rotation: 0, svgOrigin: '1680 160' }, { rotation: 20 }, 1.5); T(so - .2, `#${ids[0]}_armR`, { rotation: 0, duration: .3 });
  T(so, `#${ids[2]}_armR`, { rotation: 30, duration: .3 }); O(so + .3, `#${ids[2]}_armR`, { rotation: 30 }, { rotation: 45, duration: .2, repeat: 5, yoyo: true }); T(gr - .3, `#${ids[2]}_armR`, { rotation: 0, duration: .3 });
  sprouts.forEach((s, i) => O(gr + (i % 13) * .08, s, { scale: .3 }, { scale: .55, duration: .6, ease: 'back.out(2)' }));
  const sp = G(W); sparkleBurst(sp, 'gaSpk', 960, 760, 14, 500); tl.fromTo('.gaSpk', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: .35, stagger: .04, yoyo: true, repeat: 1, ease: 'back.out(3)', immediateRender: false }, gr + .3);
  ids.forEach(id => happy(id, gr, c.t1)); happy('gaTc', c.L(c.Lt('ถูกต้องจ้ะ น้ำ')), c.t1);
  cam(W, c.t0, c.s.dur, 1.0, 1.06, 960, 800);
  return { speakers: { T: 'gaTc', B: ids[1], G: ids[0], O: ids[2], C: ids }, blink: ['gaTc', ...ids] };
};

/* ---------- SPORT ---------- */
SC.sport = c => {
  const W = G(c.root, { id: 'spW' }); sky(W, null, 'gNoon'); cloud(W, 300, 140, .9); cloud(W, 1300, 110, 1); mountains(W, '#9CC4D2', '#86B89C', -60); school(W, 1500, 600, .45);
  el('rect', { y: 590, width: 1920, height: 490, fill: '#6DB54A' }, W); el('path', { d: 'M0,760 L1920,760 L1920,1080 L0,1080Z', fill: '#C8553D' }, W); [820, 890, 960, 1030].forEach(y => el('rect', { y, width: 1920, height: 5, fill: '#fff', opacity: .85 }, W));
  const finish = G(W); el('rect', { x: 1640, y: 700, width: 12, height: 360, fill: '#EEE' }, finish); el('rect', { x: 1640, y: 700, width: 12, height: 360, fill: '#EEE', transform: 'translate(0,0)' }, finish); const tape = el('rect', { id: 'spTape', x: 1600, y: 850, width: 90, height: 10, fill: '#E53935' }, W);
  const tch = adult(W, 'spTc', 'teacher'); place(tch, 200, 900, .85);
  const kb = kid(W, 'spB', KHAO); place(kb, 420, 940, .85); const kk = kid(W, 'spK', KAEW); place(kk, 520, 870, .8); const kt = kid(W, 'spT', TON); place(kt, 330, 1000, .88);
  const go = c.at('go'), fall = c.at('fall'), help = c.at('help'), tog = c.at('together'), fin = c.at('finish');
  S(c.L(c.Lt('พร้อมครับ')), ['spB', 'spK', 'spT'].map(i => `#${i}_armR`), { rotation: -150 }); S(c.Le(c.Lt('พร้อมครับ')) + .3, ['spB', 'spK', 'spT'].map(i => `#${i}_armR`), { rotation: 0 });
  T(go, '#spTc_armR', { rotation: -150, duration: .3 }); T(go + 2, '#spTc_armR', { rotation: 0, duration: .3 });
  const g1 = c.L(c.Lt('หนึ่ง สอง สาม ไป')) + c.line(c.Lt('หนึ่ง สอง สาม ไป')).d - .2;
  walkCycle('spB', g1, fall, .16, 32); T(g1, kb, { x: 880, duration: fall - g1, ease: 'none' });
  walkCycle('spK', g1, fall + 1.0, .16, 32); T(g1, kk, { x: 1180, duration: fall + 1 - g1, ease: 'none' }); walkCycle('spT', g1, fall + 1.0, .16, 32); T(g1, kt, { x: 1220, duration: fall + 1 - g1, ease: 'none' });
  T(fall, kb, { rotation: -75, y: 950, duration: .3, ease: 'power2.in' }); sad('spB', fall, tog); closed('spB', fall + .2, help + 1.5);
  const dust = G(W); for (let i = 0; i < 8; i++) { const w = G(dust, { transform: `translate(${880},${940})` }); el('circle', { class: 'spDust', r: 14, fill: '#E0B89A', opacity: 0 }, w); } tl.fromTo('.spDust', { opacity: .8, x: 0, y: 0, scale: .4 }, { opacity: 0, x: () => R(-90, 90), y: () => R(-60, -10), scale: 1.3, duration: .8, stagger: .02, immediateRender: false }, fall + .25);
  S(help, [kk, kt], { scaleX: -.8 }); gsap.set(kt, { scaleY: .88 }); S(help, kt, { scaleX: -.88 }); walkCycle('spK', help, help + 1.2, .22); T(help, kk, { x: 960, duration: 1.2 }); walkCycle('spT', help, help + 1.2, .22); T(help, kt, { x: 800, duration: 1.2 });
  T(c.L(c.Lt('ไม่เป็นไรครับ')), kb, { rotation: 0, y: 940, duration: .5 }); S(c.L(c.Lt('ไม่เป็นไรครับ')) + .5, [kk], { scaleX: .8 }); S(c.L(c.Lt('ไม่เป็นไรครับ')) + .5, [kt], { scaleX: .88 });
  happy('spB', tog, c.t1); happy('spK', tog, c.t1); happy('spT', tog, c.t1);
  ['spB', 'spK', 'spT'].forEach(id => walkCycle(id, tog + .8, fin, .2, 26)); T(tog + .8, kb, { x: 1700, duration: fin - tog - .8, ease: 'none' }); T(tog + .8, kk, { x: 1760, duration: fin - tog - .8, ease: 'none' }); T(tog + .8, kt, { x: 1640, duration: fin - tog - .8, ease: 'none' });
  T(fin - .4, tape, { scaleX: 0, svgOrigin: '1600 855', opacity: 0, duration: .4 });
  const cf = G(W); confetti(cf, 'spCf', 1700, 700, 40, 8); tl.fromTo('.spCf', { opacity: 1, x: 0, y: 0 }, { opacity: 0, x: () => R(-500, 300), y: () => R(-400, 300), rotation: () => R(-300, 300), duration: 1.8, stagger: .01, immediateRender: false }, fin);
  ['spB', 'spK', 'spT'].forEach(id => hop(`#${id}`, fin + .2, 2, id === 'spK' ? 870 : id === 'spB' ? 940 : 1000, 40));
  happy('spTc', fin, c.t1); T(fin + .3, ['#spTc_armL', '#spTc_armR'], { rotation: (i) => i ? -40 : 40, duration: .3 }); O(fin + .6, '#spTc_armR', { rotation: -40 }, { rotation: -20, duration: .15, repeat: 9, yoyo: true });
  cam(W, c.t0, fall - c.t0, 1.0, 1.0, 960, 540); cam(W, fall - .2, tog + .8 - fall, 1.0, 1.35, 880, 840); T(tog + .8, W, { scale: 1, duration: 1.2 });
  return { speakers: ln => ({ T: 'spTc', B: 'spB', G: 'spK', O: 'spT', C: ['spB', 'spK', 'spT'] })[ln.who] || null, blink: ['spTc', 'spB', 'spK', 'spT'] };
};

/* ---------- ART ---------- */
SC.art = c => {
  const { W, board, ids, tch } = classScene(c, 'ar', { tx: 300 }); chalk(board, 'ศิลปะ', 960, 330, 150, '', '#FFE27A');
  const draw = c.at('draw'); ids.forEach((id, i) => { T(draw, `#${id}_armR`, { rotation: 40, duration: .3 }); O(draw + .3, `#${id}_armR`, { rotation: 36 }, { rotation: 48, duration: .12, repeat: 26 + i, yoyo: true }); S(c.at('kaew') - .1, `#${id}_armR`, { rotation: 0 }); });
  const mk = (x, k) => { const g = G(W, { opacity: 0 }); const pp = paper(g, x, 420, 460, 340);
    if (k === 0) { [[-80, 20, '#FF7FA8'], [0, -40, '#FFD84D'], [80, 30, '#B58CFF']].forEach(([dx, dy, col]) => { for (let j = 0; j < 6; j++) { const a = j / 6 * 6.28; el('circle', { cx: x + dx + Math.cos(a) * 26, cy: 420 + dy + Math.sin(a) * 26, r: 20, fill: col }, g); } el('circle', { cx: x + dx, cy: 420 + dy, r: 16, fill: '#F2A93B' }, g); el('path', { d: `M${x + dx},${440 + dy} L${x + dx},560`, stroke: '#4CAF50', 'stroke-width': 8 }, g); }); }
    if (k === 1) { const d = drum(g, 'arDr', x, 540, .9); }
    if (k === 2) { el('rect', { x: x - 220, y: 260, width: 440, height: 160, fill: '#BFE6F7' }, g); el('circle', { cx: x + 150, cy: 310, r: 34, fill: '#FFE45C' }, g); el('rect', { x: x - 220, y: 420, width: 440, height: 160, fill: '#8BCF5E' }, g); for (let i = 0; i < 10; i++) el('path', { d: `M${x - 200 + i * 44},${560} l8,-40 l8,40`, fill: '#5FAF45' }, g); const bu = buffalo(g, 'arBu'); place(bu, x - 40, 540, .5); }
    return g; };
  const pp = [mk(480, 0), mk(960, 1), mk(1440, 2)];
  ['kaew', 'ton', 'khao'].forEach((m, i) => { const t = c.at(m); S(t, pp[i], { opacity: 1 }); O(t, pp[i], { scale: .3, svgOrigin: `${[480, 960, 1440][i]} 420` }, { scale: 1, duration: .5, ease: 'back.out(2)' }); happy(ids[[0, 2, 1][i]], t, c.t1); });
  happy(tch, c.L(c.Lt('สวยมากจ้ะ ครูเห็น')), c.t1);
  const think = c.at('think'); T(think, [pp[0], pp[1]], { opacity: 0, duration: .5 }); T(think, pp[2], { x: -480, duration: .8 }); S(think, `#${ids[1]}_eyesH`, { opacity: 0 }); S(think, `#${ids[1]}_eyes`, { opacity: 1 }); T(think, `#${ids[1]}_head`, { rotation: -8, duration: .6 });
  cam(W, c.t0, think - c.t0, 1.0, 1.0, 960, 540); cam(W, think, c.t1 - think, 1.0, 1.3, 1100, 600);
  return { speakers: { T: tch, B: ids[1], G: ids[0], O: ids[2], C: ids }, blink: [tch, ...ids] };
};

/* ---------- CLEANUP ---------- */
SC.cleanup = c => {
  const { W, board, ids, tch } = classScene(c, 'cu', { tx: 1780, kx: [520, 1180, 1500] }); const txt = chalk(board, 'ก ข ค ง จ ช', 960, 380, 130);
  const br = broom($(`${ids[0]}_armR`), 46, -60); const dust = G(W); for (let i = 0; i < 10; i++) { const w = G(dust, { transform: `translate(${560},${1020})` }); el('circle', { class: 'cuDust', r: 10, fill: '#D7C4A0', opacity: 0 }, w); }
  const kw = c.at('kaew'), tn = c.at('ton'), kh = c.at('khao'), cl = c.at('clean');
  O(kw, `#${ids[0]}_armR`, { rotation: -20 }, { rotation: 25, duration: .4, repeat: Math.floor((cl - kw) / .4), yoyo: true }); tl.fromTo('.cuDust', { opacity: .8, x: 0, y: 0 }, { opacity: 0, x: () => R(-120, 120), y: () => R(-40, 0), duration: .9, stagger: .15, repeat: 2, immediateRender: false }, kw + .2);
  walkCycle(ids[2], tn - 1.2, tn - .1, .25); T(tn - 1.2, `#${ids[2]}`, { x: 820, y: 960, duration: 1.1 }); T(tn, `#${ids[2]}_armR`, { rotation: -150, duration: .3 }); O(tn + .3, `#${ids[2]}_armR`, { rotation: -160 }, { rotation: -120, duration: .3, repeat: 9, yoyo: true }); T(tn + .4, txt, { opacity: 0, duration: 3 });
  const chairs = G(W); [1180, 1500].forEach(x => { const g = G(chairs, { class: 'cuChair' }); el('rect', { x: x - 40, y: 960, width: 80, height: 14, fill: '#8E5E34' }, g); el('rect', { x: x - 36, y: 974, width: 10, height: 60, fill: '#6B4A2E' }, g); el('rect', { x: x + 26, y: 974, width: 10, height: 60, fill: '#6B4A2E' }, g); });
  tl.to('.cuChair', { y: -90, rotation: 180, svgOrigin: '0 0', duration: .6, stagger: .8, ease: 'power2.inOut' }, kh + .4); T(kh + .2, `#${ids[1]}_armR`, { rotation: -60, duration: .4 }); T(kh + 2.2, `#${ids[1]}_armR`, { rotation: 0, duration: .4 });
  const sp = G(W); sparkleBurst(sp, 'cuSpk', 960, 600, 14, 520); tl.fromTo('.cuSpk', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: .35, stagger: .04, yoyo: true, repeat: 1, ease: 'back.out(3)', immediateRender: false }, cl);
  ids.forEach(id => happy(id, cl, c.t1)); happy(tch, cl, c.t1); T(cl, `#${ids[0]}_armR`, { rotation: 0, duration: .3 });
  cam(W, c.t0, c.s.dur, 1.0, 1.06, 960, 700);
  return { speakers: { T: tch, B: ids[1], G: ids[0], O: ids[2], C: ids }, blink: [tch, ...ids] };
};

/* ---------- HOMEWARD ---------- */
SC.homeward = c => {
  const thuiT = c.at('thui');
  const A = G(c.root, { id: 'hwA' }); sky(A, null, 'gDay'); sky(A, 'hwDusk', 'gDusk', { opacity: .55 }); sun(A, null, 1500, 420, 'gSunset', '#FFB25C'); mountains(A); school(A, 400, 700, .5); palm(A, 1250, 705, 260, .85); stiltHouse(A, 1650, 705, .75);
  field(A, '#9BCB6B', '#72B04F', null, 700); el('rect', { y: 840, width: 1920, height: 110, fill: '#C9A26C' }, A); grassTufts(A, 1080, 26, '#5FA442', '#6FAF4B', 50);
  const ids = kidSet(A, 'hw', [560, 800, 1040], 960, .95, { bag: '#E53935' }); gsap.set('#hwK_bagb', { fill: '#F48FB1' }); gsap.set('#hwT_bagb', { fill: '#42A5F5' });
  const glow = el('rect', { width: 1920, height: 1080, fill: '#FF9E4A', opacity: .12 }, A);
  ids.forEach(id => walkCycle(id, c.t0, c.L(c.Lt('พรุ่งนี้เจอกัน')) - .3, .3)); ids.forEach((id, i) => O(c.t0, `#${id}`, { x: [200, 440, 680][i] }, { x: [560, 800, 1040][i], duration: c.L(c.Lt('พรุ่งนี้เจอกัน')) - .3 - c.t0, ease: 'none' }));
  waveArm(ids[0], c.L(c.Lt('พรุ่งนี้เจอกัน')), 5); waveArm(ids[2], c.L(c.Lt('ไปก่อนนะ')), 5); waveArm(ids[1], c.L(c.Lt('ลาก่อนนะเพื่อน')), 5); ids.forEach(id => happy(id, c.L(c.Lt('พรุ่งนี้เจอกัน')), thuiT));
  const off = c.Le(c.Lt('ลาก่อนนะเพื่อน')); S(off, `#${ids[0]}`, { scaleX: -.95 }); walkCycle(ids[0], off, thuiT, .3); T(off, `#${ids[0]}`, { x: -200, duration: thuiT - off, ease: 'none' }); walkCycle(ids[2], off, thuiT, .3); T(off, `#${ids[2]}`, { x: 2150, duration: thuiT - off, ease: 'none' });
  const Bq = G(c.root, { id: 'hwB', opacity: 0 }); villageWide(Bq, { sunY: 420 }); sky(Bq, null, 'gDusk', { opacity: .35 }); el('rect', { y: 870, width: 1920, height: 210, fill: '#C19A67' }, Bq); grassTufts(Bq, 880, 30, '#6FAF4B', '#5FA442', 34);
  const bu = buffalo(Bq, 'hwU'); place(bu, 700, 1000, 1.2); const b = kid(Bq, 'hwB2', { ...KHAO, bag: '#E53935' }); place(b, 2050, 1010, 1.15, true);
  T(thuiT - .4, A, { opacity: 0, duration: .5 }); T(thuiT - .4, Bq, { opacity: 1, duration: .5 });
  walkCycle('hwB2', thuiT, thuiT + 1.6, .17, 30); T(thuiT, b, { x: 1180, duration: 1.6, ease: 'power1.out' }); happy('hwB2', thuiT + 1.2, c.t1); T(thuiT + 1.7, ['#hwB2_armL', '#hwB2_armR'], { rotation: (i) => i ? -70 : 70, duration: .4 });
  loop(thuiT, c.t1, '#hwU_tail', { rotation: -10 }, { rotation: 14 }, .6); const moo = TIMELINE.sfx.find(x => x.name === 'moo' && x.t > thuiT && x.t < c.t1 + .1); if (moo) { T(moo.t - .1, '#hwU_head', { rotation: -18, duration: .35 }); T(moo.t + 1.3, '#hwU_head', { rotation: 0, duration: .4 }); }
  const hs = G(Bq); for (let i = 0; i < 4; i++) { const w = G(hs, { transform: `translate(${1000 + i * 45},${620})` }); el('path', { class: 'hwHeart', d: 'M0,0 C-20,-22 -44,4 0,34 C44,4 20,-22 0,0Z', fill: '#FF6B8A', opacity: 0 }, w); }
  tl.fromTo('.hwHeart', { opacity: 0, y: 0, scale: .3 }, { opacity: 1, y: -80, scale: 1, duration: .7, stagger: .25, ease: 'back.out(2)', immediateRender: false }, thuiT + 2); tl.to('.hwHeart', { opacity: 0, y: -200, duration: 1, stagger: .25 }, thuiT + 3);
  return { speakers: ln => ln.who === 'B' ? (c.t0 + ln.t < thuiT ? ids[1] : 'hwB2') : ({ G: ids[0], O: ids[2] })[ln.who] || null, blink: [...ids, 'hwB2'] };
};

/* ---------- EVENING ---------- */
SC.evening = c => {
  const W = G(c.root, { id: 'evW' }); mealRoom(W, 'evR', true);
  const mom = adult(W, 'evM', 'mom', { pose: 'sit' }); place(mom, 470, 930, .88); const b = kid(W, 'evB', { ...KHAO, pose: 'sit', uniform: false, shirt: '#3D8C6E', collar: '#2E6E55' }); place(b, 960, 868, 1.0); const dad = adult(W, 'evF', 'dad', { pose: 'sit' }); place(dad, 1450, 930, .88);
  mealTray(W, 'evT'); nightTint(W);
  const bl = bulb(W, 'evBulb', 960, 380, 1.1); const idea = c.at('idea'); S(idea, bl, { opacity: 1 }); O(idea, bl, { scale: .2 }, { scale: 1.1, duration: .5, ease: 'back.out(3)' }); loop(idea + .5, c.t1, bl, { scale: 1.1 }, { scale: 1.2 }, .5);
  sad('evB', c.L(c.Lt('แต่ผมยังไม่รู้')), c.Le(c.Lt('แต่ผมยังไม่รู้')) + .4);
  happy('evB', idea, c.t1); hop('#evB', idea + .2, 2, 868, 40); happy('evM', c.L(c.Lt('ความคิดดีมาก')), c.t1); happy('evF', c.L(c.Lt('พ่อก็จะช่วย')), c.t1);
  T(c.L(c.Lt('ใช่แล้ว ผมจะแสดง')), '#evB_armR', { rotation: -150, duration: .3 }); T(c.Le(c.Lt('ใช่แล้ว ผมจะแสดง')) + .4, '#evB_armR', { rotation: 0, duration: .3 });
  wai('evB', c.L(c.Lt('เย้ ขอบคุณครับพ่อ')) + .6, 1.8);
  cam(W, c.t0, c.s.dur, 1.0, 1.1, 960, 700);
  return { speakers: { B: 'evB', F: 'evF', M: 'evM' }, blink: ['evB', 'evF', 'evM'] };
};

/* ---------- HOMEWORK ---------- */
SC.homework = c => {
  const W = G(c.root, { id: 'hkW' }); el('rect', { width: 1920, height: 800, fill: 'url(#pWall)' }, W); el('rect', { y: 780, width: 1920, height: 300, fill: 'url(#pPlank)' }, W);
  const winG = G(W); el('rect', { x: 1300, y: 150, width: 420, height: 320, fill: 'url(#gNight)' }, winG); el('circle', { cx: 1600, cy: 240, r: 40, fill: '#FFF6D0' }, winG); el('rect', { x: 1288, y: 138, width: 444, height: 344, fill: 'none', stroke: '#6A4428', 'stroke-width': 22 }, W);
  const b = kid(W, 'hkB', { ...KHAO, pose: 'sit', uniform: false, shirt: '#3D8C6E', collar: '#2E6E55' }); place(b, 820, 900, 1.0); const dad = adult(W, 'hkF', 'dad', { pose: 'sit' }); place(dad, 1260, 930, .88);
  el('rect', { x: 560, y: 860, width: 560, height: 26, rx: 8, fill: '#8E5E34' }, W); el('rect', { x: 600, y: 886, width: 20, height: 90, fill: '#6B4A2E' }, W); el('rect', { x: 1060, y: 886, width: 20, height: 90, fill: '#6B4A2E' }, W);
  const nb = G(W); el('path', { d: 'M660,856 L960,856 L990,830 L690,830Z', fill: '#FFFDF6' }, nb);
  nightTint(W);
  const P = G(W, { id: 'hkPage', opacity: 0 }); el('rect', { x: 360, y: 120, width: 1200, height: 620, rx: 20, fill: '#FFFDF6', stroke: '#C8B68A', 'stroke-width': 6 }, P); for (let y = 220; y < 720; y += 80) el('rect', { x: 400, y, width: 1120, height: 3, fill: '#BBD6F0' }, P);
  const lets = ['ก', 'ข', 'ค'].map((l, i) => { const t = chalk(P, l, 600 + i * 360, 520, 300, '', '#1F4E9A'); return t; });
  const clip = el('clipPath', { id: 'hkClip' }, $('svg').querySelector('defs')); const cr = el('rect', { id: 'hkClipR', x: 360, y: 120, width: 0, height: 620 }, clip); lets.forEach(t => t.setAttribute('clip-path', 'url(#hkClip)'));
  const wr = c.at('write'); T(wr, '#hkB_armR', { rotation: 40, duration: .3 }); O(wr + .3, '#hkB_armR', { rotation: 36 }, { rotation: 48, duration: .12, repeat: 30, yoyo: true }); S(wr + 4.2, '#hkB_armR', { rotation: 0 });
  T(wr + .3, P, { opacity: 1, duration: .4 }); T(wr + .5, '#hkClipR', { attr: { width: 1200 }, duration: 3.6, ease: 'none' }); T(c.L(c.Lt('สวยมากลูก')) + 1.5, P, { opacity: 0, duration: .5 });
  happy('hkF', c.L(c.Lt('สวยมากลูก')), c.t1); happy('hkB', c.L(c.Lt('สวยมากลูก')), c.t1); T(c.L(c.Lt('สวยมากลูก')) + .4, '#hkF_armR', { rotation: -60, duration: .4 });
  cam(W, c.t0, c.s.dur, 1.0, 1.08, 960, 760);
  return { speakers: { B: 'hkB', F: 'hkF' }, blink: ['hkB', 'hkF'] };
};

/* ---------- BED ---------- */
SC.bed = c => {
  const W = G(c.root, { id: 'bdW' }); el('rect', { width: 1920, height: 800, fill: 'url(#pWall)' }, W);
  const win = G(W); el('rect', { x: 1240, y: 150, width: 440, height: 340, fill: 'url(#gNight)' }, win); el('circle', { cx: 1560, cy: 260, r: 44, fill: '#FFF6D0' }, win); el('circle', { cx: 1560, cy: 260, r: 120, fill: 'url(#gMoon)' }, win); seed(2); for (let i = 0; i < 22; i++) el('circle', { class: 'bdStar', cx: R(1250, 1670), cy: R(160, 470), r: R(2, 4.5), fill: '#fff' }, win);
  el('rect', { x: 1228, y: 138, width: 464, height: 364, fill: 'none', stroke: '#6A4428', 'stroke-width': 24 }, W);
  el('rect', { y: 780, width: 1920, height: 300, fill: 'url(#pPlank)' }, W); el('path', { d: 'M470,940 L1330,940 L1290,800 L510,800Z', fill: 'url(#pMat)' }, W); el('ellipse', { cx: 640, cy: 845, rx: 95, ry: 40, fill: '#F7F2E8' }, W);
  const lying = kid(W, 'bdBl', { ...KHAO, uniform: false, shirt: '#3D8C6E', collar: '#2E6E55', shadow: false }); gsap.set(lying, { svgOrigin: '0 0', x: 960, y: 870, rotation: -90, scale: 1.05 }); closed('bdBl', c.L(1) - .3);
  const blanket = G(W); el('path', { d: 'M800,790 Q900,760 1040,790 L1060,900 L790,900Z', fill: '#7FB3E8' }, blanket); for (let i = 0; i < 5; i++) el('rect', { x: 800 + i * 52, y: 786, width: 16, height: 112, fill: '#5E97D4', opacity: .6 }, blanket);
  el('rect', { width: 1920, height: 1080, fill: '#1E1540', opacity: .42 }, W); const g2 = el('circle', { cx: 1560, cy: 260, r: 700, fill: 'url(#gMoon)', opacity: .35 }, W); g2.style.mixBlendMode = 'screen';
  const zz = G(W); zzz(zz, 'bdZ', 700, 640); tl.fromTo('.bdZ', { opacity: 0, y: 0 }, { opacity: 1, y: -60, duration: 1.2, stagger: .35, repeat: Math.floor((c.t1 - c.L(1)) / 1.6), repeatDelay: .5, immediateRender: false }, c.L(1));
  tl.fromTo('.bdStar', { opacity: .3 }, { opacity: 1, duration: .7, stagger: .08, repeat: Math.floor(c.s.dur / 1.4), yoyo: true, immediateRender: false }, c.t0);
  const dream = G(W, { id: 'bdDream', opacity: 0 }); el('ellipse', { cx: 520, cy: 330, rx: 380, ry: 250, fill: '#FFF8E6', stroke: '#8B5E34', 'stroke-width': 8 }, dream); [[700, 580, 30], [760, 650, 18]].forEach(([x, y, r]) => el('circle', { cx: x, cy: y, r, fill: '#FFF8E6', stroke: '#8B5E34', 'stroke-width': 6 }, dream));
  el('path', { d: 'M280,470 L760,470 L730,420 L310,420Z', fill: '#B0302A' }, dream); el('path', { d: 'M360,160 L420,420 L620,420 L680,160Z', fill: '#FFF3A6', opacity: .6 }, dream);
  const db = kid(dream, 'bdDk', { ...KHAO, hat: true, uniform: false }); place(db, 520, 430, .55); [[330, 200], [700, 220], [480, 150]].forEach(([x, y]) => { const q = qmark(dream, null, x, y); q.setAttribute('opacity', 1); });
  const dr = c.at('dream'); T(dr, dream, { opacity: 1, duration: .8 }); O(dr, dream, { scale: .6, svgOrigin: '700 620' }, { scale: 1, duration: .8, ease: 'back.out(1.5)' }); happy('bdDk', dr, c.t1); waveArm('bdDk', dr + 1, 7);
  cam(W, c.t0, c.s.dur, 1.0, 1.1, 800, 600);
  return { speakers: {}, blink: [] };
};

/* ---------- END ---------- */
SC.end = c => {
  const W = G(c.root, { id: 'enW' }); sky(W, null, 'gNight'); el('circle', { cx: 1500, cy: 250, r: 70, fill: '#FFF6D0' }, W); el('circle', { cx: 1500, cy: 250, r: 220, fill: 'url(#gMoon)' }, W);
  seed(6); for (let i = 0; i < 70; i++) el('circle', { class: 'enStar', cx: R(0, 1920), cy: R(0, 760), r: R(1.5, 4.5), fill: '#fff' }, W);
  mountains(W, '#2B3A6A', '#22305A'); field(W, '#2E4A3A', '#253E30', null, 720); const sil = G(W); stiltHouse(sil, 560, 720, .9); sil.querySelectorAll('rect,path').forEach(e => { if (e.getAttribute('fill') && e.getAttribute('fill') !== 'none') e.setAttribute('fill', '#141E33'); if (e.getAttribute('stroke') && e.getAttribute('stroke') !== 'none') e.setAttribute('stroke', '#141E33'); }); el('rect', { x: 540, y: 600, width: 40, height: 40, fill: '#FFD27A' }, W);
  tl.fromTo('.enStar', { opacity: .2 }, { opacity: 1, duration: .6, stagger: .04, repeat: Math.floor(c.s.dur / 1.2), yoyo: true, immediateRender: false }, c.t0);
  const ov = domEl(c.dom, 'ov', '<div class="e2" style="font-size:70px">ติดตามตอนต่อไป</div><div class="e1" style="font-size:150px">งานวันเด็ก</div><div class="e2">ตอนที่ 2: ซ้อมการแสดง</div><div class="e3">อย่าลืมกดติดตามนะ</div>'); S(c.t0, ov, { opacity: 1 });
  O(c.t0 + .2, ov.children[0], { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .6 }); popIn(c.t0 + .6, ov.children[1], .8); O(c.t0 + 1.3, ov.children[2], { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power2.out' }); popIn(c.L(0), ov.children[3], .6);
  loop(c.L(0) + .8, c.t1, ov.children[3], { scale: 1 }, { scale: 1.06 }, .6); cam(W, c.t0, c.s.dur, 1.0, 1.06, 960, 540);
  return {};
};
