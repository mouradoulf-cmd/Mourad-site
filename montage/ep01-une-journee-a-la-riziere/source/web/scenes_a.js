/* scenes: title, dawn, wash, breakfast, animals, garden, thui, path */
const SC = {};
function cam(g, t0, dur, s0, s1, fx, fy, ease = 'sine.inOut') { gsap.set(g, { svgOrigin: `${fx} ${fy}` }); O(t0, g, { scale: s0 }, { scale: s1, duration: dur, ease }); }
function domEl(parent, cls, html, style) { const d = document.createElement('div'); d.className = cls; d.innerHTML = html; if (style) d.style.cssText += style; parent.appendChild(d); return d; }
function popIn(t, target, dur = .5) { O(t, target, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: dur, ease: 'back.out(2.2)' }); }
function popOut(t, target, dur = .3) { T(t, target, { scale: 0, opacity: 0, duration: dur, ease: 'back.in(2)' }); }
function villageWide(W, opt = {}) {
  sky(W, null, 'gDay');
  if (opt.dawn) sky(W, W.id + '_dawn', 'gDawn');
  const sn = sun(W, W.id + '_sun', opt.sunX || 1480, opt.sunY || 250);
  mountains(W);
  const cl = G(W, { id: W.id + '_clouds' }); cloud(cl, 150, 190, 1); cloud(cl, 1250, 130, 1.2); cloud(cl, 760, 300, .7);
  palm(W, 180, 700, 300, 1); palm(W, 300, 705, 240, .9); stiltHouse(W, 560, 700, .9); palm(W, 1560, 700, 320, 1); stiltHouse(W, 1330, 705, .75); palm(W, 1760, 705, 250, .85); palm(W, 980, 700, 200, .7);
  field(W, '#8BCF5E', '#5FAF45', null);
  const d = G(W); el('path', { d: 'M-20,835 Q480,800 960,818 T1940,812 L1940,872 Q1440,880 960,876 T-20,892Z', fill: '#C19A67' }, d); el('path', { d: 'M-20,835 Q480,800 960,818 T1940,812', fill: 'none', stroke: '#D8B988', 'stroke-width': 6 }, d);
  return { sun: sn, clouds: cl };
}

/* ---------- TITLE ---------- */
SC.title = c => {
  const W = G(c.root, { id: 'ti_w' }); const v = villageWide(W, { dawn: true, sunY: 760 });
  const fr = G(W); grassTufts(fr, 1080, 22);
  const bd = G(W); for (let i = 0; i < 4; i++) bird(bd, 'tiBird');
  cam(W, c.t0, c.s.dur, 1.12, 1.0, 960, 760, 'power1.out');
  O(c.t0, v.sun, { y: 760 }, { y: 260, duration: 7, ease: 'power2.out' });
  T(c.t0 + 1, '#ti_w_dawn', { opacity: 0, duration: 7 });
  T(c.t0, '#ti_w_clouds', { x: 120, duration: c.s.dur, ease: 'none' });
  tl.fromTo('.tiBird', { x: i => -100 - i * 80, y: i => 300 + (i % 2) * 40 }, { x: i => 2100 - i * 60, y: i => 220 + (i % 2) * 30, duration: 8, ease: 'none', stagger: .3, immediateRender: false }, c.t0 + 2);
  tl.fromTo('.tiBirdW', { scaleY: 1, transformOrigin: '50% 100%' }, { scaleY: -.6, duration: .18, repeat: 40, yoyo: true, immediateRender: false }, c.t0 + 2);
  const ov = domEl(c.dom, 'ov', '<div class="t1">ชาวนาตัวน้อย</div><div class="t2">ตอน หนึ่งวันในท้องนา</div>');
  S(c.t0, ov, { opacity: 1 });
  popIn(c.t0 + .5, ov.children[0], .9); O(c.t0 + 1.3, ov.children[1], { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: .7, ease: 'back.out(1.8)' });
  loop(c.t0 + 2.2, c.t0 + 7.5, ov.children[0], { scale: 1 }, { scale: 1.05 }, .9);
  T(c.t1 - 1.4, ov.children[0], { y: -500, opacity: 0, duration: .7, ease: 'back.in(1.5)' }); T(c.t1 - 1.3, ov.children[1], { y: 400, opacity: 0, duration: .6, ease: 'back.in(1.5)' });
  return {};
};

/* ---------- DAWN ---------- */
SC.dawn = c => {
  const A = G(c.root, { id: 'dwA' });
  sky(A, null, 'gDay'); sky(A, 'dwA_dawn', 'gDawn'); const sn = sun(A, 'dwA_sun', 1500, 700); mountains(A);
  const cl = G(A, { id: 'dwA_cl' }); cloud(cl, 200, 170, .9); cloud(cl, 1100, 110, 1.1);
  palm(A, 120, 760, 330, 1); banana(A, 1780, 900, 1.3);
  el('rect', { x: 0, y: 740, width: 1920, height: 340, fill: '#7CC05A' }, A); grassTufts(A, 780, 30, '#5FAF45', '#6CBA4F', 40);
  stiltHouse(A, 640, 900, 2.2); tree(A, 1180, 800, .9);
  const fence = G(A); for (let x = 1000; x < 1920; x += 130) el('rect', { x, y: 800, width: 22, height: 140, rx: 6, fill: '#8B5E34' }, fence); el('rect', { x: 990, y: 830, width: 940, height: 16, rx: 6, fill: '#A0703E' }, fence); el('rect', { x: 990, y: 885, width: 940, height: 16, rx: 6, fill: '#A0703E' }, fence);
  const post = el('rect', { x: 1418, y: 760, width: 34, height: 190, rx: 8, fill: '#7A4E2A' }, A);
  const rs = rooster(A, 'dwR'); place(rs, 1430, 770, 1.35);
  const arcs = G(A, { id: 'dwArcs' }); [0, 1, 2].forEach(i => el('path', { class: 'dwArc', d: `M${1560 + i * 26},${590 - i * 6} q${22 + i * 8},${40} 0,${80 + i * 16}`, fill: 'none', stroke: '#fff', 'stroke-width': 8, 'stroke-linecap': 'round', opacity: 0 }, arcs));
  grassTufts(A, 1080, 24);
  const crow = c.at('crow'), cut = c.at('cut'), crow2 = c.at('crow2'), jump = c.at('jump'), fold = c.at('fold');
  O(c.t0, sn, { y: 700 }, { y: 230, duration: cut - c.t0, ease: 'power1.out' }); T(c.t0, '#dwA_dawn', { opacity: 0, duration: cut - c.t0 });
  T(c.t0, cl, { x: 90, duration: cut - c.t0, ease: 'none' });
  cam(A, c.t0, cut - c.t0, 1.0, 1.28, 1470, 700);
  // crow
  T(crow - .15, '#dwR_head', { rotation: -28, duration: .25, ease: 'power2.out' }); S(crow, '#dwR_beak', { opacity: 1 });
  O(crow, '#dwR_body', { scaleY: 1 }, { scaleY: 1.08, duration: .25, repeat: 3, yoyo: true });
  tl.fromTo('.dwArc', { opacity: 0, scale: .6, transformOrigin: '0% 50%' }, { opacity: 1, scale: 1.2, duration: .4, stagger: .15, repeat: 1, yoyo: true, immediateRender: false }, crow + .05);
  S(crow + 1.8, '#dwR_beak', { opacity: 0 }); T(crow + 1.8, '#dwR_head', { rotation: 0, duration: .35 });
  loop(crow + 2.4, cut, '#dwR_head', { rotation: 0 }, { rotation: 8 }, .5);
  // bedroom
  const Bd = G(c.root, { id: 'dwB', opacity: 0 });
  el('rect', { width: 1920, height: 800, fill: 'url(#pWall)' }, Bd);
  const win = G(Bd); el('rect', { x: 1240, y: 150, width: 440, height: 340, fill: 'url(#gDawn)' }, win); const wsun = G(win, { id: 'dwWsun' }); el('circle', { cx: 1560, cy: 420, r: 60, fill: '#FFE45C' }, wsun); el('circle', { cx: 1560, cy: 420, r: 110, fill: 'url(#gSun)' }, wsun);
  cloud(win, 1300, 250, .45); el('path', { d: 'M1240,420 Q1350,380 1460,420 T1680,410 L1680,490 L1240,490Z', fill: '#79AE8F' }, win);
  el('rect', { x: 1228, y: 138, width: 464, height: 364, fill: 'none', stroke: '#6A4428', 'stroke-width': 24 }, Bd); el('rect', { x: 1450, y: 150, width: 16, height: 340, fill: '#6A4428' }, Bd);
  el('rect', { x: 1120, y: 150, width: 110, height: 340, fill: '#8E5E34' }, Bd); el('rect', { x: 1690, y: 150, width: 110, height: 340, fill: '#8E5E34' }, Bd);
  const rays = G(Bd, { id: 'dwRays', opacity: .0 }); [0, 1, 2].forEach(i => el('path', { d: `M${1260 + i * 120},490 L${700 + i * 180},1000 L${820 + i * 180},1000 L${1340 + i * 120},490Z`, fill: '#FFF3C4', opacity: .22 }, rays));
  el('rect', { y: 780, width: 1920, height: 300, fill: 'url(#pPlank)' }, Bd); el('rect', { y: 772, width: 1920, height: 14, fill: '#6A4428' }, Bd);
  const door = G(Bd); el('rect', { x: 60, y: 200, width: 300, height: 590, fill: '#2B1A10' }, door); el('rect', { x: 50, y: 190, width: 320, height: 600, fill: 'none', stroke: '#6A4428', 'stroke-width': 20 }, door);
  const mom = adult(Bd, 'dwM', 'mom'); place(mom, -260, 960, .95);
  el('path', { d: 'M470,940 L1330,940 L1290,800 L510,800Z', fill: 'url(#pMat)' }, Bd);
  el('ellipse', { cx: 640, cy: 845, rx: 95, ry: 40, fill: '#F7F2E8' }, Bd);
  const lying = boy(Bd, 'dwBl', { hat: false, shadow: false }); gsap.set(lying, { svgOrigin: '0 0', x: 960, y: 870, rotation: -90, scale: 1.05 });
  S(c.t0, '#dwBl_eyes', { opacity: 0 }); S(c.t0, '#dwBl_eyesC', { opacity: 1 });
  const blanket = G(Bd, { id: 'dwBlk' }); el('path', { d: 'M800,790 Q900,760 1040,790 L1060,900 L790,900Z', fill: '#7FB3E8' }, blanket); for (let i = 0; i < 5; i++) el('rect', { x: 800 + i * 52, y: 786, width: 16, height: 112, fill: '#5E97D4', opacity: .6 }, blanket);
  const standing = boy(Bd, 'dwBs', { hat: false }); place(standing, 1060, 930, 1.05); S(c.t0, standing, { opacity: 0 });
  const net = G(Bd, { id: 'dwNet' }); el('path', { d: 'M560,380 L1260,380 L1330,930 L480,930Z', fill: 'url(#pNet)' }, net); el('path', { d: 'M560,380 L1260,380 L1330,930 L480,930Z', fill: '#fff', opacity: .12 }, net); el('path', { d: 'M560,380 L1260,380', stroke: '#fff', 'stroke-width': 4, opacity: .6 }, net);
  [[560, 380], [1260, 380]].forEach(([x, y]) => el('line', { x1: x, y1: 0, x2: x, y2: y, stroke: '#EDE6D6', 'stroke-width': 3 }, Bd));
  const zz = G(Bd); zzz(zz, 'dwZ', 700, 640);
  const ff = G(Bd, { id: 'dwFold', opacity: 0 }); el('rect', { x: 1190, y: 840, width: 150, height: 34, rx: 8, fill: '#7FB3E8' }, ff); el('rect', { x: 1195, y: 812, width: 140, height: 32, rx: 8, fill: '#8FC0EE' }, ff);
  T(cut - .3, A, { opacity: 0, duration: .6 }); T(cut - .3, Bd, { opacity: 1, duration: .6 });
  O(cut, '#dwWsun', { y: 60 }, { y: -80, duration: c.t1 - cut, ease: 'power1.out' }); T(cut + 3, rays, { opacity: 1, duration: 6 });
  cam(Bd, cut - .3, crow2 - cut, 1.12, 1.0, 900, 700);
  // sleeping
  tl.fromTo('.dwZ', { opacity: 0, y: 0, x: 0 }, { opacity: 1, y: -60, x: 20, duration: 1.2, stagger: .35, repeat: Math.floor((crow2 - cut) / 1.6), repeatDelay: .5, immediateRender: false }, cut + .2);
  S(crow2 + .1, '.dwZ', { opacity: 0 });
  loop(cut, crow2, blanket, { scaleY: 1, svgOrigin: '920 900' }, { scaleY: 1.04 }, 1.3);
  const mIn = c.L(1) - 1.2; T(mIn, mom, { x: 210, duration: .8, ease: 'power2.out' }); T(c.Le(1) + .6, mom, { x: -260, duration: .8, ease: 'power2.in' });
  S(crow2 + .45, '#dwBl_eyesC', { opacity: 0 }); S(crow2 + .45, '#dwBl_eyes', { opacity: 1 }); O(crow2 + .45, '#dwBl_eyes', { scale: .6 }, { scale: 1.25, duration: .25, ease: 'back.out(3)' });
  // jump up
  S(jump, lying, { opacity: 0 }); S(jump, standing, { opacity: 1 }); O(jump, standing, { y: 930 }, { y: 760, duration: .28, ease: 'power2.out', yoyo: true, repeat: 1 });
  T(jump, blanket, { x: 60, y: 20, duration: .3 }); T(jump + .1, net, { scaleY: .1, svgOrigin: '900 380', opacity: 0, duration: .6, ease: 'power2.inOut' });
  // stretch
  const st = c.L(5); T(st, '#dwBs_armL', { rotation: 160, duration: .6 }); T(st, '#dwBs_armR', { rotation: -160, duration: .6 }); T(st, '#dwBs_body', { scaleY: 1.06, duration: .6 });
  S(st + .1, '#dwBs_eyes', { opacity: 0 }); S(st + .1, '#dwBs_eyesH', { opacity: 1 }); S(st + .1, '#dwBs_mO', { opacity: 1 });
  T(c.Le(5), ['#dwBs_armL', '#dwBs_armR'], { rotation: 0, duration: .5 }); T(c.Le(5), '#dwBs_body', { scaleY: 1, duration: .5 }); S(c.Le(5), '#dwBs_mO', { opacity: 0 });
  S(c.Le(5) + .1, '#dwBs_eyes', { opacity: 1 }); S(c.Le(5) + .1, '#dwBs_eyesH', { opacity: 0 });
  // fold blanket
  T(fold, standing, { x: 1150, duration: .6 }); T(fold + .3, blanket, { scaleX: .2, scaleY: .5, x: 330, y: 70, svgOrigin: '1060 900', opacity: 0, duration: .8 });
  O(fold + .9, ff, { opacity: 0, scale: .6, svgOrigin: '1265 870' }, { opacity: 1, scale: 1, duration: .4, ease: 'back.out(2)' });
  S(fold + 1.2, '#dwBs_eyes', { opacity: 0 }); S(fold + 1.2, '#dwBs_eyesH', { opacity: 1 }); T(fold + 1.2, '#dwBs_armR', { rotation: -150, duration: .3 }); O(fold + 1.5, '#dwBs_armR', { rotation: -150 }, { rotation: -120, duration: .25, repeat: 5, yoyo: true });
  cam(Bd, fold - 1, c.t1 - fold + 1, 1.0, 1.1, 1150, 800);
  return { speakers: (ln) => ln.who === 'B' ? (c.t0 + ln.t < jump ? 'dwBl' : 'dwBs') : ln.who === 'M' ? 'dwM' : null, blink: ['dwBs', 'dwM'] };
};

/* ---------- WASH ---------- */
SC.wash = c => {
  const W = G(c.root, { id: 'wsW' }); sky(W, null, 'gDay'); sun(W, null, 1620, 150); cloud(W, 700, 150, .8); cloud(W, 1300, 250, .6);
  mountains(W, '#9CC4D2', '#86B89C', 40);
  el('rect', { y: 760, width: 1920, height: 320, fill: '#D8B47A' }, W); grassTufts(W, 770, 26, '#79B85A', '#6AAE4E', 36);
  banana(W, 1640, 800, 1.5); banana(W, 1830, 820, 1.2); tree(W, 1450, 790, .8);
  const hw = G(W); el('rect', { x: 0, y: 120, width: 560, height: 700, fill: 'url(#pWall)' }, hw); el('rect', { x: 0, y: 810, width: 580, height: 24, fill: '#6A4428' }, hw); el('rect', { x: 180, y: 260, width: 220, height: 200, fill: '#2B1A10' }, hw); el('rect', { x: 170, y: 250, width: 240, height: 220, fill: 'none', stroke: '#6A4428', 'stroke-width': 16 }, hw);
  el('path', { d: 'M-20,140 L600,140 L520,60 L-20,60Z', fill: '#8A3B24' }, hw);
  el('rect', { x: 1040, y: 930, width: 280, height: 30, rx: 12, fill: '#6A4428' }, W);
  const jar = G(W, { id: 'wsJar' }); el('path', { d: 'M1060,940 Q1010,800 1080,700 L1260,700 Q1330,800 1280,940Z', fill: 'url(#gJar)' }, jar); el('ellipse', { cx: 1170, cy: 700, rx: 96, ry: 22, fill: '#4A2414' }, jar); el('ellipse', { cx: 1170, cy: 702, rx: 82, ry: 16, fill: '#5DA9B5' }, jar);
  el('path', { d: 'M1090,800 q40,-40 80,0 t80,0 M1100,860 q35,-30 70,0 t70,0', fill: 'none', stroke: '#E0A84A', 'stroke-width': 7, opacity: .8 }, jar); el('ellipse', { cx: 1210, cy: 700, rx: 30, ry: 8, fill: '#D8DDE3' }, jar);
  const b = boy(W, 'wsB', { hat: false }); place(b, -150, 960, 1.15);
  const brush = G($('wsB_armR'), { id: 'wsBrush', opacity: 0 }); el('rect', { x: 36, y: -140, width: 12, height: 50, rx: 5, fill: '#4FC3F7' }, brush); el('rect', { x: 32, y: -148, width: 20, height: 14, rx: 4, fill: '#fff' }, brush);
  const bowl = G($('wsB_armR'), { id: 'wsBowl', opacity: 0 }); el('path', { d: 'M24,-104 Q46,-78 70,-104Z', fill: '#C9D1D9' }, bowl);
  const drops = G(W); seed(31); for (let i = 0; i < 16; i++) { const w = G(drops, { transform: `translate(${930 + R(-60, 60)},${640 + R(-40, 40)})` }); el('circle', { class: 'wsDrop', r: R(6, 12), fill: '#BFE8FF', opacity: 0 }, w); }
  const foam = G(W); for (let i = 0; i < 7; i++) { const w = G(foam, { transform: `translate(${930 + (i % 3) * 22 - 20},${690 - Math.floor(i / 3) * 18})` }); el('circle', { class: 'wsFoam', r: 9 + (i % 3) * 3, fill: '#fff', opacity: 0 }, w); }
  const sp = G(W); sparkleBurst(sp, 'wsSpk', 930, 660, 10, 150);
  const splash = c.at('splash'), brushT = c.at('brush'), shine = c.at('shine');
  walkCycle('wsB', c.t0 + .3, c.L(0) + c.line(0).d, .28); T(c.t0 + .3, b, { x: 930, duration: c.L(0) + c.line(0).d - c.t0 - .3, ease: 'none' });
  S(splash - .5, '#wsBowl', { opacity: 1 }); T(splash - .5, '#wsB_armR', { rotation: 60, duration: .4 }); T(splash, '#wsB_armR', { rotation: 150, duration: .35, ease: 'power2.out' });
  tl.fromTo('.wsDrop', { opacity: 1, x: 0, y: 0, scale: .5 }, { opacity: 0, x: () => R(-140, 140), y: () => R(-120, 60), scale: 1.2, duration: .9, ease: 'power2.out', stagger: .01, immediateRender: false }, splash + .3);
  S(splash + .3, '#wsB_eyes', { opacity: 0 }); S(splash + .3, '#wsB_eyesC', { opacity: 1 });
  T(splash + 1.0, '#wsB_armR', { rotation: 0, duration: .5 }); S(splash + 1.4, '#wsBowl', { opacity: 0 });
  S(c.L(2), '#wsB_eyesC', { opacity: 0 }); S(c.L(2), '#wsB_eyesH', { opacity: 1 }); S(c.Le(2) + .3, '#wsB_eyesH', { opacity: 0 }); S(c.Le(2) + .3, '#wsB_eyes', { opacity: 1 });
  S(brushT, '#wsBrush', { opacity: 1 }); T(brushT, '#wsB_armR', { rotation: 132, duration: .4 }); O(brushT + .4, '#wsB_armR', { rotation: 126 }, { rotation: 140, duration: .14, repeat: Math.floor((shine - brushT - .8) / .14), yoyo: true });
  tl.fromTo('.wsFoam', { opacity: 0, scale: .2, y: 0 }, { opacity: .95, scale: 1, y: -30, duration: .6, stagger: .25, repeat: 2, repeatDelay: .3, immediateRender: false }, brushT + .6);
  S(shine - .2, '.wsFoam', { opacity: 0 }); T(shine - .4, '#wsB_armR', { rotation: 0, duration: .4 }); S(shine, '#wsBrush', { opacity: 0 });
  S(shine, '#wsB_eyes', { opacity: 0 }); S(shine, '#wsB_eyesH', { opacity: 1 }); S(shine, '#wsB_mO', { opacity: 1 }); S(c.L(3) - .02, '#wsB_mO', { opacity: 0 });
  tl.fromTo('.wsSpk', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: .35, stagger: .04, yoyo: true, repeat: 1, ease: 'back.out(3)', immediateRender: false }, shine);
  S(c.Le(4) + .2, '#wsB_eyesH', { opacity: 0 }); S(c.Le(4) + .2, '#wsB_eyes', { opacity: 1 });
  cam(W, c.t0, splash - c.t0, 1.0, 1.0, 960, 540); cam(W, splash - .6, c.t1 - splash + .6, 1.0, 1.3, 1040, 640);
  return { speakers: { B: 'wsB' }, blink: ['wsB'] };
};

/* ---------- BREAKFAST ---------- */
function mealRoom(R0, id, night) {
  el('rect', { width: 1920, height: 780, fill: 'url(#pWall)' }, R0);
  const win = G(R0); el('rect', { x: 700, y: 110, width: 520, height: 380, fill: night ? 'url(#gNight)' : 'url(#gDay)' }, win);
  if (!night) { mountains(G(win, { transform: 'translate(700,110) scale(.27,.35)' })); cloud(win, 760, 180, .35); palm(win, 1120, 470, 180, .6); el('rect', { x: 700, y: 440, width: 520, height: 50, fill: '#8BCF5E' }, win); }
  else { el('circle', { cx: 1080, cy: 210, r: 36, fill: '#FFF6D0' }, win); el('circle', { cx: 1080, cy: 210, r: 90, fill: 'url(#gMoon)' }, win); seed(9); for (let i = 0; i < 16; i++) el('circle', { class: id + 'Star', cx: R(710, 1210), cy: R(120, 420), r: R(2, 4), fill: '#fff' }, win); }
  el('rect', { x: 690, y: 100, width: 540, height: 400, fill: 'none', stroke: '#6A4428', 'stroke-width': 22 }, R0); el('rect', { x: 952, y: 110, width: 16, height: 380, fill: '#6A4428' }, R0);
  el('rect', { y: 770, width: 1920, height: 310, fill: 'url(#pPlank)' }, R0); el('rect', { y: 762, width: 1920, height: 14, fill: '#6A4428' }, R0);
  el('path', { d: 'M300,1080 L1620,1080 L1500,860 L420,860Z', fill: 'url(#pMat)' }, R0);
}
function mealTray(R0, id) {
  const t = G(R0, { id: id + 'Tray' }); el('ellipse', { cx: 960, cy: 935, rx: 360, ry: 92, fill: '#8E1F1A' }, t); el('ellipse', { cx: 960, cy: 920, rx: 360, ry: 92, fill: '#B0302A' }, t); el('ellipse', { cx: 960, cy: 920, rx: 340, ry: 82, fill: 'none', stroke: '#E8B64A', 'stroke-width': 6 }, t);
  const bk = G(t); el('path', { d: 'M790,905 L800,800 L900,800 L910,905Z', fill: 'url(#pBasket)' }, bk); el('ellipse', { cx: 850, cy: 800, rx: 52, ry: 14, fill: '#B98A45' }, bk); el('path', { d: 'M800,800 Q850,760 900,800', fill: '#C8994F' }, bk);
  el('ellipse', { cx: 1080, cy: 905, rx: 110, ry: 30, fill: '#F4F1EA' }, t); [[1040, 890], [1085, 880], [1125, 895]].forEach(([x, y]) => el('path', { d: `M${x - 28},${y} q10,-28 34,-20 q24,6 20,22 q-10,14 -34,10 q-22,-2 -20,-12Z`, fill: '#B8652B' }, t));
  el('ellipse', { cx: 960, cy: 950, rx: 70, ry: 20, fill: '#EDE8DC' }, t); el('ellipse', { cx: 960, cy: 945, rx: 56, ry: 14, fill: '#E88F3A' }, t); el('path', { d: 'M925,945 l20,-6 M950,948 l24,-8 M980,944 l14,-4', stroke: '#6BAF4A', 'stroke-width': 5 }, t);
  [[720, 930], [1200, 935]].forEach(([x, y]) => { el('ellipse', { cx: x, cy: y, rx: 40, ry: 13, fill: '#EDE8DC' }, t); el('ellipse', { cx: x, cy: y - 3, rx: 32, ry: 8, fill: '#F7F4EC' }, t); });
  const steam = G(t); [[850, 780], [1080, 870], [960, 925]].forEach(([x, y], i) => el('path', { class: id + 'Steam', d: `M${x},${y} q-14,-24 0,-48 q14,-24 0,-48`, fill: 'none', stroke: '#fff', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: .0 }, steam));
  return t;
}
function eatLoop(p, t0, t1, reach = 132, period = 1.3, delay = 0) { let t = t0 + delay; while (t + period < t1) { T(t, `#${p}_armR`, { rotation: reach, duration: period * .35, ease: 'power1.inOut' }); T(t + period * .5, `#${p}_armR`, { rotation: 0, duration: period * .35 }); t += period + .4; } }
SC.breakfast = c => {
  const W = G(c.root, { id: 'bfW' }); mealRoom(W, 'bf', false);
  const mom = adult(W, 'bfM', 'mom', { pose: 'sit' }); place(mom, 470, 930, .88);
  const b = boy(W, 'bfB', { hat: false, pose: 'sit' }); place(b, 960, 868, 1.0);
  const dad = adult(W, 'bfF', 'dad', { pose: 'sit' }); place(dad, 1450, 930, .88);
  mealTray(W, 'bf');
  tl.fromTo('.bfSteam', { opacity: 0, y: 0 }, { opacity: .7, y: -40, duration: 1.6, stagger: .5, repeat: Math.floor(c.s.dur / 2.1), repeatDelay: .5, yoyo: true, immediateRender: false }, c.t0);
  const wai = c.at('wai'), eat = c.at('eat');
  S(c.L(2), '#bfB_eyes', { opacity: 0 }); S(c.L(2), '#bfB_eyesH', { opacity: 1 }); S(c.Le(2) + .2, '#bfB_eyesH', { opacity: 0 }); S(c.Le(2) + .2, '#bfB_eyes', { opacity: 1 });
  T(wai, '#bfB_armL', { rotation: -54, duration: .45 }); T(wai, '#bfB_armR', { rotation: 54, duration: .45 }); T(wai, '#bfB_head', { rotation: 0, y: 8, duration: .45 });
  S(wai, '#bfB_eyes', { opacity: 0 }); S(wai, '#bfB_eyesC', { opacity: 1 });
  T(c.Le(4) - .1, ['#bfB_armL', '#bfB_armR'], { rotation: 0, duration: .5 }); T(c.Le(4) - .1, '#bfB_head', { y: 0, duration: .5 }); S(c.Le(4), '#bfB_eyesC', { opacity: 0 }); S(c.Le(4), '#bfB_eyes', { opacity: 1 });
  S(c.L(5), '#bfM_eyes', { opacity: 0 }); S(c.L(5), '#bfM_eyesH', { opacity: 1 }); S(c.Le(5) + .5, '#bfM_eyesH', { opacity: 0 }); S(c.Le(5) + .5, '#bfM_eyes', { opacity: 1 });
  const iBall = c.Lt('ข้าวเหนียวต้อง'), iOk = c.Lt('ปั้นเป็นก้อน'), iDone = c.Lt('กินเสร็จแล้ว'), iYes = c.Lt('ได้เลยครับพ่อ');
  eatLoop('bfB', eat, c.L(iBall) - .2, 132, 1.2); eatLoop('bfF', eat + .4, c.L(iBall) - .3, 140, 1.5); eatLoop('bfM', eat + .8, c.t1, 140, 1.4);
  T(c.L(iBall) + .2, '#bfF_armR', { rotation: 60, duration: .4 }); O(c.L(iBall) + .6, '#bfF_armR', { rotation: 60 }, { rotation: 72, duration: .2, repeat: 7, yoyo: true }); T(c.Le(iBall), '#bfF_armR', { rotation: 0, duration: .4 });
  T(c.L(iOk) - .6, '#bfB_armR', { rotation: 60, duration: .4 }); O(c.L(iOk) - .2, '#bfB_armR', { rotation: 60 }, { rotation: 72, duration: .2, repeat: 5, yoyo: true }); T(c.Le(iOk) + .2, '#bfB_armR', { rotation: 0, duration: .4 });
  S(c.Le(iOk), '#bfB_eyes', { opacity: 0 }); S(c.Le(iOk), '#bfB_eyesH', { opacity: 1 }); S(c.L(iDone), '#bfB_eyesH', { opacity: 0 }); S(c.L(iDone), '#bfB_eyes', { opacity: 1 });
  eatLoop('bfB', c.Le(iOk) + .6, c.L(iDone) - .2, 132, 1.2); eatLoop('bfF', c.Le(iOk) + .9, c.L(iDone) - .3, 140, 1.5);
  T(c.L(iYes), '#bfB_armR', { rotation: -150, duration: .35 }); O(c.L(iYes) + .35, '#bfB_armR', { rotation: -150 }, { rotation: -120, duration: .22, repeat: 3, yoyo: true }); T(c.Le(iYes) + .2, '#bfB_armR', { rotation: 0, duration: .4 });
  cam(W, c.t0, c.s.dur, 1.0, 1.1, 960, 720);
  return { speakers: { B: 'bfB', F: 'bfF', M: 'bfM' }, blink: ['bfB', 'bfF', 'bfM'] };
};

/* ---------- ANIMALS ---------- */
SC.animals = c => {
  const W = G(c.root, { id: 'anW' }); sky(W, null, 'gDay'); sun(W, null, 1700, 140); cloud(W, 300, 150, .9); cloud(W, 1000, 110, .7);
  mountains(W, '#9CC4D2', '#86B89C', -20); palm(W, 240, 610, 260, .8); palm(W, 1320, 615, 280, .85); stiltHouse(W, 900, 612, .55);
  el('rect', { y: 600, width: 1920, height: 480, fill: '#DDBB82' }, W); grassTufts(W, 610, 30, '#79B85A', '#6AAE4E', 30);
  const fence = G(W); for (let x = -20; x < 1940; x += 120) el('rect', { x, y: 540, width: 18, height: 110, rx: 5, fill: '#8B5E34' }, fence); el('rect', { x: -20, y: 565, width: 1960, height: 12, rx: 5, fill: '#A0703E' }, fence); el('rect', { x: -20, y: 610, width: 1960, height: 12, rx: 5, fill: '#A0703E' }, fence);
  const coop = G(W); el('rect', { x: 110, y: 560, width: 230, height: 170, fill: '#A8743F' }, coop); el('path', { d: 'M90,570 L225,470 L360,570Z', fill: '#8A3B24' }, coop); el('rect', { x: 190, y: 640, width: 70, height: 90, fill: '#3A2414' }, coop); el('path', { d: 'M190,730 L140,800 L170,800 L230,730Z', fill: '#8B5E34' }, coop);
  tree(W, 1700, 700, 1.05);
  const pond = G(W, { id: 'anPond' }); el('ellipse', { cx: 1660, cy: 950, rx: 360, ry: 120, fill: '#6FAE5A' }, pond); el('ellipse', { cx: 1660, cy: 955, rx: 330, ry: 100, fill: 'url(#gWater)' }, pond);
  seed(4); for (let i = 0; i < 6; i++) el('ellipse', { cx: R(1420, 1880), cy: R(930, 1000), rx: R(40, 70), ry: 5, fill: '#fff', opacity: .3 }, pond);
  const ducks = []; [[1480, 950], [1650, 990], [1800, 945]].forEach(([x, y], i) => { const d = duck(pond, 'anDk' + i); place(d, x, y, 1.1, i === 2); ducks.push(d); });
  [1330, 1380, 1900].forEach(x => el('path', { d: `M${x},${980} q-6,-70 4,-120 M${x + 12},${985} q4,-60 16,-100`, fill: 'none', stroke: '#4E8F3A', 'stroke-width': 7, 'stroke-linecap': 'round' }, pond));
  const grains = G(W); seed(12); for (let i = 0; i < 26; i++) el('circle', { class: 'anGrain', cx: 740, cy: 720, r: 5, fill: '#F2D27A', opacity: 0 }, grains);
  const b = boy(W, 'anB'); place(b, 620, 930, 1.1);
  const bowl = G($('anB_armR'), { id: 'anBowl' }); el('path', { d: 'M20,-108 Q46,-70 74,-108Z', fill: '#E8DCC0' }, bowl); el('ellipse', { cx: 47, cy: -108, rx: 27, ry: 7, fill: '#F2D27A' }, bowl);
  const hen1 = hen(W, 'anH'); place(hen1, 1290, 800, 1.25);
  const CH = [[780, 890], [890, 925], [1000, 885], [1110, 925], [1220, 890]]; CH.forEach(([x, y], i) => { const ch = chick(W, 'anC' + i); place(ch, x + 120, y + 20, 1.25, i % 2 === 1); });
  const dg = dog(W, 'anD'); place(dg, 2150, 800, 1.15, true);
  const nums = CH.map(([x, y], i) => domEl(c.dom, 'num', String(i + 1), `left:${x - 48}px;top:${y - 190}px`));
  const tags = G(W);
  const throwT = c.at('throw'), count = c.at('count'), dogT = c.at('dog'), ducksT = c.at('ducks');
  T(throwT - .3, '#anB_armR', { rotation: -70, duration: .3 }); T(throwT, '#anB_armR', { rotation: 40, duration: .25, ease: 'power2.out' }); T(throwT + .5, '#anB_armR', { rotation: 0, duration: .4 });
  tl.fromTo('.anGrain', { opacity: 1, x: 0, y: 0 }, { x: i => 60 + (i * 37) % 500, y: i => 160 + (i * 53) % 80, duration: .7, ease: 'power1.in', stagger: .01, immediateRender: false }, throwT + .05);
  CH.forEach(([x, y], i) => { T(throwT + .3, '#anC' + i, { x, y, duration: .8, ease: 'power2.out' }); loop(throwT + 1.2 + i * .13, count - .1, '#anC' + i + '_body', { rotation: 0 }, { rotation: i % 2 ? -22 : 22 }, .22); S(count - .05, '#anC' + i + '_body', { rotation: 0 }); });
  loop(throwT + .6, c.t1, '#anH_head', { rotation: 0 }, { rotation: 30 }, .35);
  const cd = c.line(c.s.lines.findIndex(l => l.text.startsWith('หนึ่ง'))).d; const slot = cd / 5;
  CH.forEach(([x, y], i) => { const t = count + i * slot * .98; O(t, '#anC' + i, { y }, { y: y - 40, duration: .18, yoyo: true, repeat: 1, ease: 'power2.out' }); popIn(t, nums[i], .35); });
  nums.forEach(n => T(count + cd + 2.2, n, { opacity: 0, duration: .4 }));
  CH.forEach(([x, y], i) => loop(count + cd + .4, c.t1, '#anC' + i + '_body', { rotation: 0 }, { rotation: i % 2 ? -22 : 22 }, .24 + i * .02));
  quadWalk('anD', dogT - .2, dogT + 1.6, .16, 26); T(dogT - .2, dg, { x: 1580, duration: 1.8, ease: 'power1.out' });
  loop(dogT - .2, c.t1, '#anD_tail', { rotation: -18 }, { rotation: 22 }, .16); S(dogT + 1.7, '#anD_tongue', { opacity: 1 });
  (TIMELINE.sfx.filter(x => x.name === 'bark' && x.t >= c.t0 && x.t < c.t1)).forEach(x => { T(x.t - .05, '#anD_head', { rotation: -18, duration: .12 }); T(x.t + .25, '#anD_head', { rotation: 0, duration: .2 }); O(x.t, '#anD_body', { y: 0 }, { y: -12, duration: .12, yoyo: true, repeat: 1 }); });
  ducks.forEach((d, i) => { loop(c.t0, c.t1, '#anDk' + i + '_body', { y: 0 }, { y: -6 }, .9 + i * .15); });
  (TIMELINE.sfx.filter(x => x.name === 'quack' && x.t >= c.t0 && x.t < c.t1)).forEach(x => ducks.forEach((d, i) => { T(x.t + i * .15, '#anDk' + i + '_head', { rotation: -25, duration: .12 }); T(x.t + i * .15 + .3, '#anDk' + i + '_head', { rotation: 0, duration: .15 }); }));
  gsap.set(W, { svgOrigin: '1660 900' }); O(ducksT - .6, W, { scale: 1 }, { scale: 1.45, duration: 2.2, ease: 'power2.inOut' }); T(c.t1 - 2.6, W, { scale: 1, duration: 2.2 });
  return { speakers: { B: 'anB' }, blink: ['anB'] };
};

/* ---------- GARDEN ---------- */
SC.garden = c => {
  const W = G(c.root, { id: 'gdW' }); sky(W, null, 'gDay'); sun(W, null, 260, 150); cloud(W, 900, 120, .9); cloud(W, 1500, 200, .6);
  mountains(W, '#9CC4D2', '#86B89C', -40); const bam = G(W); for (let x = 0; x < 1940; x += 34) el('rect', { x, y: 470, width: 26, height: 200, rx: 8, fill: x % 68 ? '#B7C46A' : '#A6B55B' }, bam);
  el('rect', { y: 640, width: 1920, height: 440, fill: '#C8A26E' }, W); grassTufts(W, 650, 34, '#79B85A', '#6AAE4E', 26);
  [[520, '#6B4A2E'], [960, '#6B4A2E'], [1400, '#6B4A2E']].forEach(([x, col]) => { el('rect', { x: x - 190, y: 770, width: 380, height: 90, rx: 30, fill: '#7A5638' }, W); el('rect', { x: x - 180, y: 760, width: 360, height: 40, rx: 20, fill: '#8C6644' }, W); });
  const chili = G(W, { id: 'gdChili' }); [[460, 700, 60], [540, 690, 70], [600, 720, 55], [500, 740, 55]].forEach(([x, y, r]) => el('circle', { cx: x, cy: y, r, fill: '#4E9E45' }, chili)); seed(5); for (let i = 0; i < 12; i++) { const x = R(430, 630), y = R(650, 760); el('path', { d: `M${x},${y} q6,24 -2,42 q-8,-18 2,-42Z`, fill: '#E53935' }, chili); }
  const egg = G(W, { id: 'gdEgg' }); [[900, 690, 70], [1010, 700, 75], [960, 650, 60]].forEach(([x, y, r]) => el('ellipse', { cx: x, cy: y, rx: r, ry: r * .7, fill: '#5DA24E' }, egg)); [[900, 740], [970, 755], [1030, 735], [940, 700]].forEach(([x, y]) => { el('ellipse', { cx: x, cy: y + 26, rx: 20, ry: 36, fill: '#7B3FA0' }, egg); el('path', { d: `M${x - 12},${y - 8} l12,-6 l12,6 l-12,10Z`, fill: '#3E7A34' }, egg); });
  const bean = G(W, { id: 'gdBean' }); [[1260, 1300], [1400, 1440], [1540, 1500]].forEach(([a, b2]) => el('path', { d: `M${a},780 L${(a + b2) / 2},520 L${b2},780`, fill: 'none', stroke: '#A6864F', 'stroke-width': 10 }, bean)); el('rect', { x: 1250, y: 515, width: 300, height: 10, fill: '#A6864F' }, bean);
  seed(8); for (let i = 0; i < 16; i++) { const x = R(1270, 1530), y = R(540, 720); el('ellipse', { cx: x, cy: y, rx: 16, ry: 10, fill: '#5DA24E' }, bean); } for (let i = 0; i < 11; i++) { const x = 1285 + i * 24, y = 600 + (i % 3) * 30; el('path', { d: `M${x},${y} q-6,70 4,130`, fill: 'none', stroke: '#6FBF4A', 'stroke-width': 8, 'stroke-linecap': 'round' }, bean); }
  const bas = G(W, { id: 'gdBasket' }); el('path', { d: 'M860,1010 L880,930 L1040,930 L1060,1010Z', fill: 'url(#pBasket)' }, bas); el('path', { d: 'M880,932 Q960,860 1040,932', fill: 'none', stroke: '#A67A36', 'stroke-width': 8 }, bas);
  const fill = G(W, { id: 'gdFill' }); const items = [];
  [['#E53935', 'M-8,0 q6,24 -2,42 q-8,-18 2,-42Z'], ['#7B3FA0', 'M0,0 m-18,0 a18,32 0 1,0 36,0 a18,32 0 1,0 -36,0'], ['#6FBF4A', 'M0,0 q-6,50 4,90']].forEach(([col, d], k) => { for (let j = 0; j < 3; j++) { const w = G(fill, { transform: `translate(${900 + k * 50 + j * 14},${920 - j * 6})` }); const it = el('path', { class: 'gdItem' + k, d, fill: k === 2 ? 'none' : col, stroke: k === 2 ? col : 'none', 'stroke-width': 8, 'stroke-linecap': 'round', opacity: 0 }, w); items.push(it); } });
  const mom = adult(W, 'gdM', 'mom'); place(mom, 190, 1000, .9);
  const b = boy(W, 'gdB'); place(b, 700, 1000, 1.05);
  const tag = (txt, bg, x, y) => domEl(c.dom, 'tag', txt, `background:${bg};left:${x}px;top:${y}px`);
  const tg = [tag('พริก', '#E53935', 440, 540), tag('มะเขือ', '#7B3FA0', 860, 520), tag('ถั่วฝักยาว', '#4CAF50', 1250, 400)];
  const marks = ['chili', 'eggplant', 'beans'].map(m => c.at(m)); const xs = [520, 820, 1200];
  marks.forEach((t, i) => { if (i > 0) { walkCycle('gdB', t - 1.0, t - .1, .25); T(t - 1.0, b, { x: xs[i], duration: .9, ease: 'none' }); } else { T(t - .6, b, { x: xs[0], duration: .6 }); walkCycle('gdB', t - .6, t - .1, .25); }
    popIn(t, tg[i]); O(t, [['#gdChili', '#gdEgg', '#gdBean'][i]], { scale: 1 }, { scale: 1.06, duration: .3, yoyo: true, repeat: 1, svgOrigin: `${[520, 960, 1400][i]} 760` });
    T(t + .5, '#gdB_armR', { rotation: -120, duration: .3 }); T(t + 1.0, '#gdB_armR', { rotation: 0, duration: .3 });
    tl.fromTo('.gdItem' + i, { opacity: 0, y: -160, x: -60 }, { opacity: 1, y: 0, x: 0, duration: .5, stagger: .12, ease: 'power2.in', immediateRender: false }, t + .9); });
  tg.forEach(t => T(c.at('full') + 3, t, { opacity: 0, duration: .5 }));
  const full = c.at('full'); T(full - .6, b, { x: 1000, duration: .6 }); S(full, '#gdB_eyes', { opacity: 0 }); S(full, '#gdB_eyesH', { opacity: 1 }); O(full, b, { y: 1000 }, { y: 950, duration: .2, yoyo: true, repeat: 3 });
  S(c.L(c.s.lines.length - 1), '#gdM_eyes', { opacity: 0 }); S(c.L(c.s.lines.length - 1), '#gdM_eyesH', { opacity: 1 });
  cam(W, c.t0, c.s.dur, 1.0, 1.08, 900, 800);
  return { speakers: { B: 'gdB', M: 'gdM' }, blink: ['gdB', 'gdM'] };
};

/* ---------- THUI ---------- */
SC.thui = c => {
  const W = G(c.root, { id: 'thW' }); const v = villageWide(W); T(c.t0, v.clouds, { x: 80, duration: c.s.dur, ease: 'none' });
  el('rect', { y: 870, width: 1920, height: 210, fill: '#C19A67' }, W); grassTufts(W, 880, 30, '#6FAF4B', '#5FA442', 34);
  const bu = buffalo(W, 'thU'); place(bu, 820, 1000, 1.3);
  const rider = boy($('thU_body'), 'thR', { pose: 'sit', shadow: false }); gsap.set(rider, { svgOrigin: '0 0', x: -20, y: -196, scale: .78, opacity: 0 });
  const b = boy(W, 'thB'); place(b, 2050, 1010, 1.2, true);
  const dg = dog(W, 'thD'); place(dg, 260, 1020, 1.1);
  const moo = c.at('moo'), kneel = c.at('kneel'), climb = c.at('climb'), go = c.at('go');
  walkCycle('thB', c.t0 + .2, c.L(1) - .3, .27); T(c.t0 + .2, b, { x: 1330, duration: c.L(1) - .5 - c.t0, ease: 'none' });
  loop(c.t0, c.t1, '#thU_tail', { rotation: -10 }, { rotation: 14 }, .6);
  T(moo - .1, '#thU_head', { rotation: -18, duration: .35 }); T(moo + 1.3, '#thU_head', { rotation: 0, duration: .4 });
  const legs = ['a', 'b', 'c', 'd'].map(k => '#thU_leg' + k);
  T(kneel + .3, legs, { scaleY: .55, duration: .8 }); T(kneel + .3, '#thU_body', { y: 36, duration: .8 });
  T(climb - .2, b, { x: 1060, y: 780, duration: .55, ease: 'power2.out' }); S(climb + .35, b, { opacity: 0 }); S(climb + .35, rider, { opacity: 1 }); O(climb + .35, rider, { y: -240 }, { y: -196, duration: .25, ease: 'bounce.out' });
  T(climb + 1.0, legs, { scaleY: 1, duration: .8 }); T(climb + 1.0, '#thU_body', { y: 0, duration: .8 });
  const iGo = c.Lt('ไปกันเลย'); S(c.L(iGo), '#thR_eyes', { opacity: 0 }); S(c.L(iGo), '#thR_eyesH', { opacity: 1 }); T(c.L(iGo), '#thR_armR', { rotation: -150, duration: .3 }); O(c.L(iGo) + .3, '#thR_armR', { rotation: -150 }, { rotation: -120, duration: .22, repeat: 5, yoyo: true });
  quadWalk('thU', go, c.t1 + .5, .32, 16); T(go, bu, { x: 2400, duration: c.t1 - go + .5, ease: 'power1.in' });
  quadWalk('thD', go + .6, c.t1 + .5, .16, 26); T(go + .6, dg, { x: 2100, duration: c.t1 - go, ease: 'power1.in' }); loop(c.t0, c.t1, '#thD_tail', { rotation: -18 }, { rotation: 22 }, .2);
  cam(W, c.t0, go - c.t0, 1.0, 1.12, 1100, 850);
  return { speakers: ln => ln.who === 'B' ? (c.t0 + ln.t < climb + .3 ? 'thB' : 'thR') : null, blink: ['thB', 'thR'] };
};

/* ---------- PATH ---------- */
SC.path = c => {
  const W = G(c.root, { id: 'ptW' }); sky(W, null, 'gDay'); sun(W, null, 1650, 140); const cl = G(W); cloud(cl, 200, 170, 1); cloud(cl, 1100, 120, 1.2); cloud(cl, 1900, 200, .8);
  const far = G(W); mountains(far); mountains(G(far, { transform: 'translate(1920,0)' }));
  const mid = G(W); seed(21); for (let i = 0; i < 16; i++) { const x = i * 260 + R(-40, 40); if (i % 5 === 2) stiltHouse(mid, x, 700, .7); else if (i % 3 === 0) tree(mid, x, 710, .7); else palm(mid, x, 705, R(220, 300), .85); }
  field(W, '#8BCF5E', '#5FAF45', null, 700, 0, 1920);
  const road = G(W); el('rect', { y: 740, width: 1920, height: 70, fill: '#C9A26C' }, road); el('rect', { y: 736, width: 1920, height: 8, fill: '#DCC08F' }, road);
  const canal = G(W, { id: 'ptCanal' }); el('rect', { y: 810, width: 1920, height: 270, fill: 'url(#gCanal)' }, canal); el('rect', { y: 806, width: 1920, height: 12, fill: '#6FAF4B' }, canal);
  const shimmer = G(canal); for (let i = 0; i < 14; i++) el('path', { d: `M${i * 160},${880 + (i % 4) * 45} q40,-10 80,0`, fill: 'none', stroke: '#fff', 'stroke-width': 4, opacity: .35 }, shimmer);
  const fishes = G(canal); [['#F29A2E', 700, 930], ['#E8E8E8', 1100, 990], ['#F2C14E', 1400, 910], ['#F29A2E', 900, 1030]].forEach(([col, x, y], i) => { const f = fish(fishes, 'ptF' + i, col); place(f, x, y, 1.2, i % 2 === 1); });
  const df = dragonfly(W, 'ptDf'); place(df, 1200, 760, 1.3);
  const bu = buffalo(W, 'ptU'); place(bu, 900, 790, .82); const rider = boy($('ptU_body'), 'ptR', { pose: 'sit', shadow: false }); gsap.set(rider, { svgOrigin: '0 0', x: -20, y: -196, scale: .78 });
  const dg = dog(W, 'ptD'); place(dg, 470, 800, .9);
  const fr = G(W); for (let i = 0; i < 30; i++) el('path', { d: `M${i * 130},${1085} q-8,-90 6,-160 M${i * 130 + 16},1085 q10,-70 26,-120`, fill: 'none', stroke: i % 2 ? '#4E8F3A' : '#5DA24A', 'stroke-width': 9, 'stroke-linecap': 'round' }, fr);
  const BX = [430, 1240, 1560]; const bfs = [['#FFD84D', '#E0A800'], ['#6EC6FF', '#2E86C1'], ['#FF8FB0', '#D9537E']].map(([a, b2], i) => { const f = butterfly(W, 'ptBf' + i, a, b2); place(f, BX[i], 380, 1.1); return f; });
  const D = c.s.dur;
  T(c.t0, far, { x: -300, duration: D, ease: 'none' }); T(c.t0, mid, { x: -1600, duration: D, ease: 'none' }); T(c.t0, cl, { x: -150, duration: D, ease: 'none' }); T(c.t0, fr, { x: -1900, duration: D, ease: 'none' }); T(c.t0, shimmer, { x: -900, duration: D, ease: 'none' });
  quadWalk('ptU', c.t0, c.t1, .34, 14); quadWalk('ptD', c.t0, c.t1, .2, 22); loop(c.t0, c.t1, '#ptU_tail', { rotation: -10 }, { rotation: 14 }, .6); loop(c.t0, c.t1, '#ptD_tail', { rotation: -18 }, { rotation: 22 }, .2);
  bfs.forEach((f, i) => { loop(c.t0, c.t1, `#ptBf${i}_w`, { scaleX: 1 }, { scaleX: .25 }, .11 + i * .01); loop(c.t0, c.t1, f, { x: BX[i] - 70, y: 330 + i * 30 }, { x: BX[i] + 70, y: 420 - i * 20 }, 1.7 + i * .3); });
  const colT = c.at('colors'), cdur = c.line(c.s.lines.findIndex(l => l.text.includes('สีเหลือง'))).d; const fr3 = [0.1, 0.42, 0.62];
  const ctags = [['สีเหลือง', '#E0A800'], ['สีฟ้า', '#2E86C1'], ['สีชมพู', '#D9537E']].map(([t, bg], i) => domEl(c.dom, 'tag', t, `background:${bg};left:${560 + i * 300}px;top:110px`));
  bfs.forEach((f, i) => { const t = colT + cdur * fr3[i]; popIn(t, ctags[i]); O(t, `#ptBf${i}`, { scale: 1.1 }, { scale: 1.9, duration: .3, yoyo: true, repeat: 1, ease: 'power2.out' }); });
  ctags.forEach(t => T(c.at('canal') + .5, t, { opacity: 0, duration: .4 }));
  fishes.querySelectorAll(':scope > g').forEach((f, i) => loop(c.t0, c.t1, f, { x: 600 + i * 220 }, { x: 900 + i * 220 }, 2.2 + i * .4));
  loop(c.t0, c.t1, '#ptDf_w', { scaleY: 1 }, { scaleY: .3 }, .05); loop(c.t0, c.t1, df, { x: 1150, y: 760 }, { x: 1300, y: 720 }, 1.3);
  const iBf = c.Lt('ผีเสื้อสวย'); S(c.L(iBf), '#ptR_eyes', { opacity: 0 }); S(c.L(iBf), '#ptR_eyesH', { opacity: 1 }); S(c.Le(iBf) + .3, '#ptR_eyesH', { opacity: 0 }); S(c.Le(iBf) + .3, '#ptR_eyes', { opacity: 1 });
  const canT = c.at('canal'); gsap.set(W, { svgOrigin: '1100 900' }); O(canT - .5, W, { scale: 1 }, { scale: 1.45, duration: 2.2, ease: 'power2.inOut' });
  T(canT + .8, '#ptR_armR', { rotation: -140, duration: .3 }); O(canT + 1.1 + 2.6, '#ptR_armR', { rotation: -140 }, { rotation: -115, duration: .22, repeat: 5, yoyo: true });
  return { speakers: { B: 'ptR' }, blink: ['ptR'] };
};
