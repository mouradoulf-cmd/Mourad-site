/* งานวันเด็ก ตอนที่ 3 — scenes: stage, backstage, show1, show2, show3, applause, award, photo, goodbye, home, dinner, thanks, bed, end */
function showHall(c, pre, opt = {}) { const W = G(c.root, { id: pre + 'W' }); stageHall(W); if (opt.sign !== false) signBoard(W, 960, 330, .9, opt.sign || 'ชาวนาตัวน้อย'); const fg = G(W); return { W, fg }; }
function crowd(W, cls) { const a = audience(W, 1110, 9, cls); return a; }
/* ---------- STAGE (other performances) ---------- */
SC.stage = c => {
  const { W } = showHall(c, 'sg', { sign: 'งานวันเด็ก' }); const tch = adult(W, 'sgTc', 'teacher'); place(tch, 200, 760, .8);
  const little = classmates(W, 'sgl', [[760, .62, [620, 760, 900, 1040, 1180, 1320]]], 4); const big = classmates(W, 'sgb', [[760, .85, [640, 960, 1280]]], 6); gsap.set(big.map(i => '#' + i), { opacity: 0 });
  const a = crowd(W, 'sgAud'); const song = c.at('song'), clap = c.at('clap'), dance = c.at('dance'), clap2 = c.at('clap2');
  gsap.set(little.map(i => '#' + i), { opacity: 0 }); S(c.at('teacher'), little.map(i => '#' + i), { opacity: 1 }); tl.fromTo(little.map(i => '#' + i), { opacity: 0, y: 820 }, { opacity: 1, y: 760, duration: .4, stagger: .1, immediateRender: false }, c.at('teacher'));
  little.forEach((id, i) => { happy(id, song, clap + 1); O(song + i * .1, `#${id}_body`, { rotation: -5 }, { rotation: 5, duration: .5, repeat: 9, yoyo: true }); T(clap + .5, `#${id}_body`, { rotation: 0, duration: .3 }); }); notesAt(W, 'sgNote', 900, 460, song + .3, 2);
  tl.to('.sgAud', { y: -14, duration: .15, yoyo: true, repeat: 11, stagger: .05 }, clap);
  S(c.L(c.Lt('ชุดต่อไป')), little.map(i => '#' + i), { opacity: 0 }); S(dance - .3, big.map(i => '#' + i), { opacity: 1 }); big.forEach((id, i) => { danceStep(id, dance, clap2 - .2, 1.2, 5); happy(id, dance, c.t1); });
  tl.to('.sgAud', { y: -14, duration: .15, yoyo: true, repeat: 13, stagger: .05 }, clap2); happy('sgTc', c.at('teacher'), c.t1);
  cam(W, c.t0, c.s.dur, 1.0, 1.05, 960, 560);
  return { speakers: { T: 'sgTc' }, blink: ['sgTc', ...little, ...big] };
};
/* ---------- BACKSTAGE ---------- */
SC.backstage = c => {
  const W = G(c.root, { id: 'bsW' }); el('rect', { width: 1920, height: 1080, fill: '#3A2A4E' }, W); for (let x = 0; x < 1920; x += 160) el('path', { d: `M${x},0 Q${x + 40},540 ${x},1080`, stroke: '#2C1F3C', 'stroke-width': 40, fill: 'none' }, W);
  el('path', { d: 'M1500,0 L1920,0 L1920,1080 L1560,1080 Q1640,540 1500,0Z', fill: '#C62834' }, W); el('rect', { y: 900, width: 1920, height: 180, fill: '#5A3E2B' }, W); const lamp = el('circle', { cx: 900, cy: 150, r: 420, fill: '#FFE9A8', opacity: .12 }, W);
  const ids = trioFair(W, 'bs', [620, 900, 1180], 1020, 1.1); drum(W, 'bsDr', 1330, 1030, .6);
  const iT = c.at('in'), oT = c.at('out'), hands = c.at('hands'), call = c.at('call');
  sad('bsB', c.L(c.Lt('มือผมเย็น')), iT); O(c.L(c.Lt('มือผมเย็น')), '#bsB_body', { rotation: -2 }, { rotation: 2, duration: .07, repeat: 15, yoyo: true }); S(c.Le(c.Lt('มือผมเย็น')), '#bsB_body', { rotation: 0 });
  ['bsB', 'bsK', 'bsT'].forEach(id => { T(iT, `#${id}_up`, { scaleY: 1.07, svgOrigin: '0 -110', duration: 2.6 }); T(iT, `#${id}_armL`, { rotation: 30, duration: 2.6 }); T(iT, `#${id}_armR`, { rotation: -30, duration: 2.6 }); closed(id, iT, oT + 3); T(oT, `#${id}_up`, { scaleY: 1, duration: 2.6 }); T(oT, [`#${id}_armL`, `#${id}_armR`], { rotation: 0, duration: 2.6 }); });
  const l1 = domEl(c.dom, 'num', 'หายใจเข้า', 'left:760px;top:180px;width:400px;font-size:64px;text-align:center'), l2 = domEl(c.dom, 'num', 'หายใจออก', 'left:760px;top:180px;width:400px;font-size:64px;text-align:center'); popIn(iT, l1, .4); T(oT - .2, l1, { opacity: 0, duration: .2 }); popIn(oT, l2, .4); T(oT + 2.8, l2, { opacity: 0, duration: .3 });
  ['bsK', 'bsT'].forEach((id, i) => { T(hands, `#${id}_arm${i ? 'L' : 'R'}`, { rotation: i ? -60 : 60, duration: .4 }); }); T(hands, '#bsB_armL', { rotation: -30, duration: .4 }); T(hands, '#bsB_armR', { rotation: 30, duration: .4 }); ids.forEach(id => happy(id, hands, c.t1)); hearts(W, 'bsHeart', 860, 560, hands + .4);
  T(call, ['#bsK_armR', '#bsT_armL', '#bsB_armL', '#bsB_armR'], { rotation: 0, duration: .3 }); ids.forEach((id, i) => { walkCycle(id, call + 1.4, c.t1 + .5, .26); T(call + 1.4, `#${id}`, { x: `+=${900}`, duration: c.t1 - call - 1.4 + .5, ease: 'power1.in' }); });
  cam(W, c.t0, c.s.dur, 1.0, 1.1, 900, 720);
  return { speakers: { G: 'bsK', B: 'bsB', O: 'bsT', T: null }, blink: ids };
};
/* ---------- SHOW 1 ---------- */
function showCast(W, pre) { const t = kid(W, pre + 'T', TONC); place(t, 560, 760, .9); drum(W, pre + 'Dr', 560, 780, .6); const k = kid(W, pre + 'K', KAEWC); place(k, 1360, 760, .9); const b = kid(W, pre + 'B', FARMER); place(b, 960, 760, .95); sash(pre + 'B'); return [pre + 'K', pre + 'B', pre + 'T']; }
function curtains(W, pre) { const g = G(W, { id: pre + 'Cur' }); el('rect', { x: 400, y: 130, width: 560, height: 632, fill: '#C62834' }, g); el('rect', { x: 960, y: 130, width: 560, height: 632, fill: '#C62834' }, g); for (let x = 430; x < 1520; x += 60) el('path', { d: `M${x},130 L${x},762`, stroke: '#9E1C27', 'stroke-width': 8 }, g); return g; }
SC.show1 = c => {
  const A = G(c.root, { id: 's1A' }); stageHall(A); signBoard(A, 960, 330, .9, 'ชาวนาตัวน้อย'); const ids = showCast(A, 's1'); gsap.set('#s1B', { x: 1700 });
  const rice = [760, 820, 1100, 1160].map(x => paperRice(A, x, 760, .9)); const cur = curtains(A, 's1'); const aud = crowd(A, 's1Aud');
  const op = c.at('open'), en = c.at('enter'), mo = c.at('moo'), la = c.at('laugh');
  T(op, '#s1Cur rect:first-child', { scaleX: 0, svgOrigin: '400 0', duration: 1.6, ease: 'power2.inOut' }); T(op, '#s1Cur rect:nth-child(2)', { scaleX: 0, svgOrigin: '1520 0', duration: 1.6, ease: 'power2.inOut' }); T(op, '#s1Cur path', { opacity: 0, duration: 1.2 });
  drumming('s1T', op + .3, en, .45); happy('s1T', op, c.t1); happy('s1K', op, c.t1);
  walkCycle('s1B', en - 1.2, en, .25); T(en - 1.2, '#s1B', { x: 960, duration: 1.2, ease: 'power1.out' }); happy('s1B', en, mo); T(en + .2, '#s1B_armR', { rotation: -40, duration: .3 }); T(c.Le(c.Lt('ผมช่วยพ่อ')), '#s1B_armR', { rotation: 0, duration: .3 });
  const Bq = G(c.root, { id: 's1Bq', opacity: 0 }); villageWide(Bq, { sunY: 200 }); const fence = G(Bq); for (let x = 0; x < 1920; x += 90) el('rect', { x, y: 820, width: 18, height: 180, rx: 5, fill: '#F4F1EA' }, fence); el('rect', { y: 860, width: 1920, height: 14, fill: '#F4F1EA' }, fence); school(Bq, 1500, 800, .6);
  const bu = buffalo(Bq, 's1U'); place(bu, 700, 1060, 1.2); garland($('s1U_head'), 150, -150, 60, 70); el('rect', { y: 1000, width: 1920, height: 80, fill: '#C19A67' }, Bq); Bq.appendChild($('s1U'));
  T(mo - .4, A, { opacity: 0, duration: .4 }); T(mo - .4, Bq, { opacity: 1, duration: .4 }); T(mo, '#s1U_head', { rotation: -18, duration: .35 }); T(mo + 1.3, '#s1U_head', { rotation: 0, duration: .4 }); loop(mo, la, '#s1U_tail', { rotation: -10 }, { rotation: 14 }, .5);
  T(la - .4, Bq, { opacity: 0, duration: .4 }); T(la - .4, A, { opacity: 1, duration: .4 }); tl.to('.s1Aud', { y: -18, duration: .14, yoyo: true, repeat: 15, stagger: .04 }, la); ids.forEach(id => happy(id, la, c.t1)); waveArm('s1B', la + .6, 7);
  cam(A, c.t0, mo - c.t0, 1.0, 1.06, 960, 560); cam(A, la, c.t1 - la, 1.0, 1.04, 960, 560);
  return { speakers: { B: 's1B' }, blink: [...ids] };
};
/* ---------- SHOW 2 ---------- */
SC.show2 = c => {
  const { W } = showHall(c, 's2'); const ids = showCast(W, 's2'); const aud = crowd(W, 's2Aud');
  const rice = [760, 820, 1100, 1160].map(x => { const r = paperRice(W, x, 760, .5, 's2Rice'); return r; }); const bnd = G($('s2B_armL')); el('path', { d: 'M-50,-106 l-8,-40 M-46,-106 l0,-44 M-42,-106 l8,-38', stroke: '#5CBF5A', 'stroke-width': 6, 'stroke-linecap': 'round' }, bnd);
  const pl = c.at('plant'), rn = c.at('rain'), sn = c.at('sun'), gr = c.at('grow');
  T(c.L(0), '#s2B_armR', { rotation: -40, duration: .3 }); T(c.Le(0), '#s2B_armR', { rotation: 0, duration: .3 });
  for (let t = pl - 2.2; t < pl + 2.8; t += 1.2) { T(t, '#s2B_up', { rotation: -12, svgOrigin: '0 -110', duration: .4 }); T(t + .6, '#s2B_up', { rotation: 0, duration: .4 }); }
  rice.forEach((r, i) => O(pl - 2 + i * .8, r, { scale: .1 }, { scale: .6, duration: .4, ease: 'back.out(2)' })); danceStep('s2K', c.L(c.Lt('ปลูกข้าว')), rn, 1.2, 5); notesAt(W, 's2Note', 1300, 480, c.L(c.Lt('ปลูกข้าว')), 1);
  const rg = rainSys(W, 's2Drop', 60, 420, 1080, 760); rainRun(rg, 's2Drop', rn, sn, 760); drumming('s2T', rn, sn, .3); happy('s2B', rn, c.t1);
  const ps = G(W); sun(ps, 's2Sun', 1200, 900, 'gSun', '#FFE45C'); el('rect', { x: 1195, y: 900, width: 10, height: 300, fill: '#8B5E34' }, ps); W.insertBefore(ps, $('s2T')); gsap.set(ps, { opacity: 0 });
  S(sn, ps, { opacity: 1 }); T(sn, ps, { y: -430, duration: 1.4, ease: 'back.out(1.4)' }); rice.forEach((r, i) => T(gr + i * .1, r, { scale: 1.0, duration: .6, ease: 'back.out(2)' })); sparkAt(W, 's2Spk', 960, 700, gr, 12, 420);
  cam(W, c.t0, c.s.dur, 1.0, 1.06, 960, 560);
  return { speakers: { B: 's2B', G: 's2K' }, blink: ids };
};
/* ---------- SHOW 3 ---------- */
SC.show3 = c => {
  const { W } = showHall(c, 's3'); const ids = showCast(W, 's3'); const aud = crowd(W, 's3Aud');
  const green = [760, 820, 1100, 1160].map(x => paperRice(W, x, 760, 1.0)); const gold = [760, 820, 1100, 1160].map(x => { const g = goldSheaf(W, x, 760, 1.0); gsap.set(g, { opacity: 0 }); return g; });
  const go = c.at('gold'), hv = c.at('harvest'), bw = c.at('bow');
  green.forEach((g, i) => T(go + i * .15, g, { opacity: 0, duration: .5 })); gold.forEach((g, i) => { S(go + i * .15, g, { opacity: 1 }); O(go + i * .15, g, { scale: .3 }, { scale: 1, duration: .5, ease: 'back.out(2)' }); }); sparkAt(W, 's3Spk', 960, 660, go, 14, 420);
  const held = goldSheaf($('s3B_armR'), 60, -110, .8); gsap.set(held, { opacity: 0 }); S(hv, held, { opacity: 1 }); T(hv, '#s3B_armR', { rotation: -120, duration: .4 }); T(c.Le(c.Lt('ข้าวทุกเม็ด')), '#s3B_armR', { rotation: 0, duration: .4 });
  wai('s3B', c.L(c.Lt('กินข้าวให้หมด')) + 2, 1.6); ids.forEach(id => happy(id, go, c.t1));
  ids.forEach(id => { T(bw, `#${id}_head`, { y: 30, duration: .4 }); T(bw + 1.3, `#${id}_head`, { y: 0, duration: .4 }); T(bw, `#${id}_up`, { rotation: 0, duration: .01 }); }); confettiAt(W, 's3Cf', 960, 420, bw + .6, 50);
  cam(W, c.t0, hv - c.t0, 1.0, 1.1, 960, 560); cam(W, hv, c.t1 - hv, 1.1, 1.25, 960, 520);
  return { speakers: { B: 's3B' }, blink: ids };
};
/* ---------- APPLAUSE (audience) ---------- */
SC.applause = c => {
  const W = G(c.root, { id: 'apW' }); el('rect', { width: 1920, height: 1080, fill: '#F1E2C4' }, W); for (let x = 0; x < 1920; x += 120) el('rect', { x, y: 0, width: 60, height: 1080, fill: '#EAD8B4', opacity: .5 }, W); el('rect', { y: 900, width: 1920, height: 180, fill: 'url(#pPlank)' }, W);
  bunting(W, 'apFl', 0, 1920, 120, 40);
  const rows = [['apY', 'yai', 360, null], ['apM', 'mom', 720, null], ['apF', 'dad', 1080, null], ['apD', 'dad', 1440, TONDAD]]; rows.forEach(([id, k, x, rc]) => { const a = adult(W, id, k, { pose: 'sit' }); if (rc) recolor(a, rc); place(a, x, 960, .9); });
  const back = audience(W, 1110, 7, 'apAud');
  const pa = c.at('parents'), ya = c.at('yai'); clapping(['apY', 'apM', 'apF', 'apD'], c.t0 + .2, pa + 1); ['apY', 'apM', 'apF', 'apD'].forEach(id => happy(id, c.t0 + .2, c.t1)); tl.to('.apAud', { y: -16, duration: .14, yoyo: true, repeat: 17, stagger: .04 }, c.t0);
  const tr = tears($('apM_head'), 'apTear', 0, -392 + 10); tearRun('apTear', c.L(c.Lt('ลูกเราเก่ง')), c.Le(c.Lt('ลูกเราเก่ง')) + 1);
  T(c.L(c.Lt('พ่อภูมิใจ')), '#apF_armR', { rotation: -150, duration: .3 }); T(c.Le(c.Lt('พ่อภูมิใจ')) + .5, '#apF_armR', { rotation: 0, duration: .3 }); hearts(W, 'apHeart', 700, 440, pa + .5);
  cam(W, c.t0, c.s.dur, 1.15, 1.25, 900, 760);
  return { speakers: { M: 'apM', F: 'apF', Y: 'apY' }, blink: ['apY', 'apM', 'apF', 'apD'] };
};
/* ---------- AWARD ---------- */
SC.award = c => {
  const { W } = showHall(c, 'aw', { sign: 'งานวันเด็ก' }); const tch = adult(W, 'awTc', 'teacher'); place(tch, 400, 760, .85); const ids = showCast(W, 'aw'); gsap.set('#awDr', { opacity: 0 }); gsap.set('#awT', { x: 1560 }); gsap.set('#awK', { x: 1260 }); gsap.set('#awB', { x: 960 }); const aud = crowd(W, 'awAud');
  const gv = c.at('give'); const certs = ids.map((id, i) => { const g = certificate(W, 500, 560, .9); gsap.set(g, { opacity: 0 }); return g; });
  certs.forEach((g, i) => { const t = gv + i * .7, x = [1260, 960, 1560][i]; S(t, g, { opacity: 1 }); T(t, g, { x, y: 600, duration: .6, ease: 'power2.inOut' }); T(t + .5, `#${ids[i]}_armR`, { rotation: -60, duration: .3 }); happy(ids[i], t + .5, c.t1); });
  T(gv, '#awTc_armR', { rotation: -70, duration: .3 }); T(gv + 2.2, '#awTc_armR', { rotation: 0, duration: .3 }); happy('awTc', c.t0, c.t1); sparkAt(W, 'awSpk', 1260, 520, gv + 2.2, 14, 380); tl.to('.awAud', { y: -14, duration: .15, yoyo: true, repeat: 11, stagger: .05 }, gv + 2.2);
  ids.forEach(id => wai(id, c.L(c.Lt('ขอบคุณครับคุณครู')), 1.6)); certs.forEach((g, i) => S(c.L(c.Lt('ขอบคุณครับคุณครู')), g, { opacity: 0 }));
  certs.forEach((g, i) => S(c.Le(c.Lt('ขอบคุณครับคุณครู')) + .5, g, { opacity: 1 }));
  cam(W, c.t0, c.s.dur, 1.0, 1.08, 1100, 560);
  return { speakers: { T: 'awTc', C: ids }, blink: ['awTc', ...ids] };
};
/* ---------- PHOTO ---------- */
SC.photo = c => {
  const W = G(c.root, { id: 'phW' }); fairYard(W, { k: 'ph' });
  const P = [['phY', 'yai', 330, null], ['phM', 'mom', 560, null], ['phF', 'dad', 1360, null], ['phD', 'dad', 1590, TONDAD], ['phTc', 'teacher', 1790, null]]; P.forEach(([id, k, x, rc]) => { const a = adult(W, id, k); if (rc) recolor(a, rc); place(a, x, 1000, .85); });
  const ids = trioFair(W, 'ph', [780, 960, 1140], 1030, .95);
  const fl = c.at('flash'); const fr = polaroid(c.dom, 'phFrame'); const flash = el('rect', { width: 1920, height: 1080, fill: '#fff', opacity: 0 }, W);
  const all = [...P.map(p => p[0]), ...ids]; all.forEach(id => happy(id, c.L(c.Lt('พร้อมนะ')) + 1.5, c.t1)); ids.forEach(id => { T(fl - .6, `#${id}_armR`, { rotation: -150, duration: .3 }); });
  O(fl, flash, { opacity: 1 }, { opacity: 0, duration: .6 }); S(fl, fr, { opacity: 1 }); T(fl, W, { rotation: -2, svgOrigin: '960 540', duration: .01 }); T(c.t1 - .6, fr, { opacity: 0, duration: .4 });
  const numsEl = ['หนึ่ง', 'สอง', 'สาม'].map((n, i) => domEl(c.dom, 'num', n, `left:${820 + i * 150 - 60}px;top:160px;width:120px;font-size:44px;text-align:center`)); const cl = c.line(c.Lt('พร้อมนะ')); numsEl.forEach((n, i) => { popIn(c.L(c.Lt('พร้อมนะ')) + cl.d * (.3 + i * .18), n, .3); T(fl - .3, n, { opacity: 0, duration: .2 }); });
  cam(W, c.t0, fl - c.t0, 1.0, 1.08, 960, 760);
  return { speakers: { F: 'phF' }, blink: all };
};
/* ---------- GOODBYE ---------- */
SC.goodbye = c => {
  const W = G(c.root, { id: 'gbW' }); const cl = fairYard(W, { k: 'gb', sky: 'gDusk' }); const glow = el('rect', { width: 1920, height: 1080, fill: '#FF9E4A', opacity: .14 }, W);
  const ids = trioFair(W, 'gb', [700, 960, 1220], 1040, 1.05); const hug = c.at('hug');
  happy('gbK', c.L(0), c.t1); happy('gbT', c.L(c.Lt('ปีหน้า')), c.t1); happy('gbB', c.L(c.Lt('สัญญานะ')), c.t1); T(c.L(c.Lt('สัญญานะ')), '#gbB_armR', { rotation: -60, duration: .3 });
  T(hug, '#gbK', { x: 830, duration: .6 }); T(hug, '#gbT', { x: 1090, duration: .6 }); T(hug, '#gbK_armR', { rotation: 70, duration: .4 }); T(hug, '#gbT_armL', { rotation: -70, duration: .4 }); T(hug, '#gbB_armL', { rotation: -60, duration: .4 }); hearts(W, 'gbHeart', 900, 560, hug + .4); closed('gbB', hug + .5, c.t1); closed('gbK', hug + .5, c.t1); closed('gbT', hug + .5, c.t1);
  cam(W, c.t0, c.s.dur, 1.0, 1.15, 960, 800);
  return { speakers: { G: 'gbK', B: 'gbB', O: 'gbT' }, blink: ids };
};
/* ---------- HOME (Thui) ---------- */
SC.home = c => {
  const W = G(c.root, { id: 'hmW' }); villageWide(W, { sunY: 420 }); sky(W, null, 'gDusk', { opacity: .35 }); el('rect', { y: 870, width: 1920, height: 210, fill: '#C19A67' }, W); grassTufts(W, 880, 30, '#6FAF4B', '#5FA442', 34);
  const bu = buffalo(W, 'hmU'); place(bu, 700, 1000, 1.2); garland($('hmU_head'), 150, -150, 60, 70); const b = kid(W, 'hmB', FARMER); place(b, 2050, 1010, 1.15, true); sash('hmB'); const glow = el('rect', { width: 1920, height: 1080, fill: '#FF9E4A', opacity: .12 }, W);
  const th = c.at('thui'); walkCycle('hmB', c.t0 + .5, th, .2, 28); T(c.t0 + .5, b, { x: 1180, duration: th - c.t0 - .5, ease: 'power1.out' }); happy('hmB', th, c.t1); T(th + .2, ['#hmB_armL', '#hmB_armR'], { rotation: (i) => i ? -70 : 70, duration: .4 });
  loop(c.t0, c.t1, '#hmU_tail', { rotation: -10 }, { rotation: 14 }, .6); TIMELINE.sfx.filter(x => x.name === 'moo' && x.t > c.t0 && x.t < c.t1).forEach(m => { T(m.t - .1, '#hmU_head', { rotation: -18, duration: .35 }); T(m.t + 1.3, '#hmU_head', { rotation: 0, duration: .4 }); }); hearts(W, 'hmHeart', 1000, 620, c.L(c.Lt('ขอบใจนะทุย')));
  cam(W, c.t0, c.s.dur, 1.0, 1.1, 960, 800);
  return { speakers: { B: 'hmB' }, blink: ['hmB'] };
};
/* ---------- DINNER ---------- */
SC.dinner = c => {
  const W = G(c.root, { id: 'dnW' }); mealRoom(W, 'dnR', true); const mom = adult(W, 'dnM', 'mom', { pose: 'sit' }); place(mom, 470, 930, .88); const b = kid(W, 'dnB', { ...KHAO, pose: 'sit', uniform: false, shirt: '#3D8C6E', collar: '#2E6E55' }); place(b, 960, 868, 1.0); const dad = adult(W, 'dnF', 'dad', { pose: 'sit' }); place(dad, 1450, 930, .88);
  mealTray(W, 'dnT'); const plate = G(W); el('ellipse', { cx: 960, cy: 1000, rx: 90, ry: 24, fill: '#F4F1EA' }, plate); const riceP = el('ellipse', { cx: 960, cy: 992, rx: 60, ry: 16, fill: '#FFFDF3' }, W); nightTint(W);
  const eat = c.at('eat'); eatLoop('dnB', eat, c.L(c.Lt('ข้าวอร่อยมาก')) - .2, 132, 1.0); T(eat, riceP, { scaleX: 0, scaleY: 0, svgOrigin: '960 992', duration: c.L(c.Lt('ข้าวอร่อยมาก')) - eat, ease: 'none' }); eatLoop('dnF', c.t0 + 1, c.t1, 140, 1.6); eatLoop('dnM', c.t0 + 1.5, c.L(c.Lt('เก่งมากจ้ะ')) - .2, 140, 1.5);
  happy('dnB', c.L(c.Lt('ข้าวอร่อยมาก')), c.t1); T(c.L(c.Lt('ข้าวอร่อยมาก')) + .5, '#dnB_armR', { rotation: -150, duration: .3 }); T(c.Le(c.Lt('ข้าวอร่อยมาก')), '#dnB_armR', { rotation: 0, duration: .3 }); happy('dnM', c.L(c.Lt('เก่งมากจ้ะ')), c.t1); happy('dnF', c.L(c.Lt('เพราะลูกรู้')), c.t1); sparkAt(W, 'dnSpk', 960, 960, c.L(c.Lt('เก่งมากจ้ะ')) + .3, 8, 140);
  cam(W, c.t0, c.s.dur, 1.0, 1.1, 960, 760);
  return { speakers: { B: 'dnB', F: 'dnF', M: 'dnM' }, blink: ['dnB', 'dnF', 'dnM'] };
};
/* ---------- THANKS ---------- */
SC.thanks = c => {
  const W = G(c.root, { id: 'tkW' }); mealRoom(W, 'tkR', true); const mom = adult(W, 'tkM', 'mom'); place(mom, 560, 1000, .95); const dad = adult(W, 'tkF', 'dad'); place(dad, 1380, 1000, .95); const b = kid(W, 'tkB', { ...KHAO, uniform: false, shirt: '#3D8C6E', collar: '#2E6E55' }); place(b, 960, 1000, 1.1);
  const cert = certificate(W, 960, 900, .9); const hang = c.at('hang'), wa = c.at('wai'), hug = c.at('hug'); nightTint(W);
  T(hang - 1, '#tkB_armR', { rotation: -150, duration: .4 }); T(hang - .8, cert, { x: 420, y: 360, scale: 1.3, duration: 1, ease: 'power2.inOut' }); T(hang + .4, '#tkB_armR', { rotation: 0, duration: .4 }); sparkAt(W, 'tkSpk', 420, 360, hang + .2, 10, 150);
  wai('tkB', wa, 2); happy('tkM', c.L(c.Lt('แม่ก็ขอบคุณ')), c.t1); happy('tkF', c.L(c.Lt('ลูกคือชาวนา')), c.t1); happy('tkB', c.L(c.Lt('แม่ก็ขอบคุณ')), c.t1);
  T(hug, '#tkM', { x: 800, duration: .7 }); T(hug, '#tkF', { x: 1120, duration: .7 }); T(hug + .3, '#tkM_armR', { rotation: -40, duration: .4 }); T(hug + .3, '#tkF_armL', { rotation: 40, duration: .4 }); hearts(W, 'tkHeart', 900, 480, hug + .6); closed('tkB', hug + .8, c.t1);
  cam(W, c.t0, c.s.dur, 1.0, 1.1, 960, 720);
  return { speakers: { B: 'tkB', F: 'tkF', M: 'tkM' }, blink: ['tkB', 'tkF', 'tkM'] };
};
/* ---------- BED ---------- */
SC.bed = c => {
  const W = G(c.root, { id: 'bdW' }); el('rect', { width: 1920, height: 800, fill: 'url(#pWall)' }, W);
  const win = G(W); el('rect', { x: 1240, y: 150, width: 440, height: 340, fill: 'url(#gNight)' }, win); el('circle', { cx: 1560, cy: 260, r: 44, fill: '#FFF6D0' }, win); el('circle', { cx: 1560, cy: 260, r: 120, fill: 'url(#gMoon)' }, win); seed(2); for (let i = 0; i < 22; i++) el('circle', { class: 'bdStar', cx: R(1250, 1670), cy: R(160, 470), r: R(2, 4.5), fill: '#fff' }, win);
  el('rect', { x: 1228, y: 138, width: 464, height: 364, fill: 'none', stroke: '#6A4428', 'stroke-width': 24 }, W); certificate(W, 1000, 360, 1.2);
  el('rect', { y: 780, width: 1920, height: 300, fill: 'url(#pPlank)' }, W); el('path', { d: 'M470,940 L1330,940 L1290,800 L510,800Z', fill: 'url(#pMat)' }, W); el('ellipse', { cx: 640, cy: 845, rx: 95, ry: 40, fill: '#F7F2E8' }, W);
  const lying = kid(W, 'bdBl', { ...KHAO, uniform: false, shirt: '#3D8C6E', collar: '#2E6E55', shadow: false }); gsap.set(lying, { svgOrigin: '0 0', x: 960, y: 870, rotation: -90, scale: 1.05 }); happy('bdBl', c.t0, c.L(1)); closed('bdBl', c.L(1));
  const blanket = G(W); el('path', { d: 'M800,790 Q900,760 1040,790 L1060,900 L790,900Z', fill: '#7FB3E8' }, blanket); for (let i = 0; i < 5; i++) el('rect', { x: 800 + i * 52, y: 786, width: 16, height: 112, fill: '#5E97D4', opacity: .6 }, blanket);
  el('rect', { width: 1920, height: 1080, fill: '#1E1540', opacity: .42 }, W); const g2 = el('circle', { cx: 1560, cy: 260, r: 700, fill: 'url(#gMoon)', opacity: .35 }, W); g2.style.mixBlendMode = 'screen';
  const zz = G(W); zzz(zz, 'bdZ', 700, 640); tl.fromTo('.bdZ', { opacity: 0, y: 0 }, { opacity: 1, y: -60, duration: 1.2, stagger: .35, repeat: Math.floor((c.t1 - c.L(1)) / 1.6), repeatDelay: .5, immediateRender: false }, c.L(1));
  tl.fromTo('.bdStar', { opacity: .3 }, { opacity: 1, duration: .7, stagger: .08, repeat: Math.floor(c.s.dur / 1.4), yoyo: true, immediateRender: false }, c.t0);
  const dream = G(W, { id: 'bdDream', opacity: 0 }); el('ellipse', { cx: 520, cy: 330, rx: 400, ry: 260, fill: '#FFF8E6', stroke: '#8B5E34', 'stroke-width': 8 }, dream); [[700, 590], [760, 660]].forEach(([x, y], i) => el('circle', { cx: x, cy: y, r: i ? 18 : 30, fill: '#FFF8E6', stroke: '#8B5E34', 'stroke-width': 6 }, dream));
  el('rect', { x: 200, y: 140, width: 640, height: 320, rx: 30, fill: '#BFE6F7' }, dream); el('rect', { x: 200, y: 360, width: 640, height: 100, fill: '#8BCF5E' }, dream); const du = buffalo(dream, 'bdDu'); place(du, 330, 440, .4); garland($('bdDu_head'), 150, -150, 60, 70);
  const dt = kid(dream, 'bdDt', TONC); place(dt, 500, 440, .42); const db = kid(dream, 'bdDb', FARMER); place(db, 620, 440, .45); const dk = kid(dream, 'bdDk', KAEWC); place(dk, 740, 440, .42);
  const dr = c.at('dream'); T(dr, dream, { opacity: 1, duration: .8 }); O(dr, dream, { scale: .6, svgOrigin: '700 620' }, { scale: 1, duration: .8, ease: 'back.out(1.5)' }); ['bdDt', 'bdDb', 'bdDk'].forEach((id, i) => { happy(id, dr, c.t1); hop(`#${id}`, dr + 1 + i * .2, 3, 440, 16); }); confettiAt(dream, 'bdCf', 520, 250, dr + 1, 30);
  cam(W, c.t0, c.s.dur, 1.0, 1.1, 800, 600);
  return { speakers: {}, blink: [] };
};
/* ---------- END ---------- */
SC.end = c => {
  const W = G(c.root, { id: 'enW' }); sky(W, null, 'gNight'); el('circle', { cx: 1500, cy: 250, r: 70, fill: '#FFF6D0' }, W); el('circle', { cx: 1500, cy: 250, r: 220, fill: 'url(#gMoon)' }, W);
  seed(6); for (let i = 0; i < 70; i++) el('circle', { class: 'enStar', cx: R(0, 1920), cy: R(0, 760), r: R(1.5, 4.5), fill: '#fff' }, W);
  mountains(W, '#2B3A6A', '#22305A'); field(W, '#2E4A3A', '#253E30', null, 720); const sil = G(W); stiltHouse(sil, 560, 720, .9); sil.querySelectorAll('rect,path').forEach(e => { if (e.getAttribute('fill') && e.getAttribute('fill') !== 'none') e.setAttribute('fill', '#141E33'); if (e.getAttribute('stroke') && e.getAttribute('stroke') !== 'none') e.setAttribute('stroke', '#141E33'); }); el('rect', { x: 540, y: 600, width: 40, height: 40, fill: '#FFD27A' }, W);
  tl.fromTo('.enStar', { opacity: .2 }, { opacity: 1, duration: .6, stagger: .04, repeat: Math.floor(c.s.dur / 1.2), yoyo: true, immediateRender: false }, c.t0);
  const ov = domEl(c.dom, 'ov', '<div class="e2" style="font-size:70px">จบตอน</div><div class="e1" style="font-size:150px">งานวันเด็ก</div><div class="e2">ขอบคุณที่ดูนะ</div><div class="e3">อย่าลืมกดติดตามนะ</div>'); S(c.t0, ov, { opacity: 1 });
  O(c.t0 + .2, ov.children[0], { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .6 }); popIn(c.t0 + .6, ov.children[1], .8); O(c.t0 + 1.3, ov.children[2], { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power2.out' }); popIn(c.L(0) + 2, ov.children[3], .6);
  loop(c.L(0) + 2.8, c.t1, ov.children[3], { scale: 1 }, { scale: 1.06 }, .6); cam(W, c.t0, c.s.dur, 1.0, 1.06, 960, 540);
  return {};
};
