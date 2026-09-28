/* episode 2 additions: school kids, school buildings, props */
const UNI = { shirt: '#F7F7F2', collar: '#C9D0D8', navy: '#23335F' };
/* kid: generic child (same part ids as boy). opt: hair 'khao'|'ton'|'kaew'|'girl'|'boy', skin, shirt, lower 'shorts'|'skirt', lowerColor, glasses, bag, pose, shadow, hat */
function kid(p, id, opt = {}) {
  const sit = opt.pose === 'sit', skin = opt.skin || SKIN.boy, limb = opt.limb || SKIN.boyLimb;
  const shirt = opt.shirt || UNI.shirt, collar = opt.collar || UNI.collar, lowC = opt.lowerColor || UNI.navy, skirt = opt.lower === 'skirt';
  const B = G(p, { id }); if (opt.shadow !== false) el('ellipse', { cx: 0, cy: 0, rx: sit ? 80 : 58, ry: 12, fill: '#000', opacity: .14 }, B);
  const body = G(B, { id: id + '_body' });
  const legL = G(body, { id: id + '_legL' }), legR = G(body, { id: id + '_legR' });
  if (!sit) {
    [[legL, -1], [legR, 1]].forEach(([l, sx]) => { el('rect', { x: sx < 0 ? -26 : 9, y: -72, width: 17, height: 70, rx: 8, fill: limb }, l); if (opt.uniform !== false) el('rect', { x: sx < 0 ? -27 : 8, y: -22, width: 19, height: 14, rx: 5, fill: '#fff' }, l); el('ellipse', { cx: sx * 18, cy: -3, rx: 17, ry: 8, fill: opt.uniform !== false ? '#1C1C22' : '#6B3A1E' }, l); });
    if (skirt) el('path', { d: 'M-40,-112 L40,-112 L54,-58 L-54,-58Z', fill: lowC }, body), [-30, -10, 10, 30].forEach(x => el('path', { d: `M${x},-110 L${x * 1.35},-60`, stroke: '#18244A', 'stroke-width': 2, opacity: .6 }, body));
    else el('path', { d: 'M-38,-112 L38,-112 L40,-66 L4,-66 L0,-80 L-4,-66 L-40,-66Z', fill: lowC }, body);
  } else {
    el('path', { d: 'M-70,-8 Q-72,-40 -38,-44 L38,-44 Q72,-40 70,-8 Q0,6 -70,-8Z', fill: lowC }, body);
    el('ellipse', { cx: -52, cy: -6, rx: 30, ry: 12, fill: limb }, legL); el('ellipse', { cx: 52, cy: -6, rx: 30, ry: 12, fill: limb }, legR);
    el('path', { d: 'M-38,-104 L38,-104 L40,-40 L-40,-40Z', fill: lowC }, body);
  }
  const oy = sit ? 42 : 0; const up = G(body, { id: id + '_up', transform: `translate(0,${oy})` });
  if (opt.bag) { el('rect', { id: id + '_bagb', x: -52, y: -196, width: 104, height: 96, rx: 20, fill: opt.bag }, up); }
  const armL = G(up, { id: id + '_armL' }), armR = G(up, { id: id + '_armR' });
  [[armL, -1], [armR, 1]].forEach(([a, sx]) => { el('rect', { x: sx < 0 ? -58 : 34, y: -186, width: 24, height: 78, rx: 12, fill: limb }, a); el('rect', { x: sx < 0 ? -58 : 34, y: -188, width: 24, height: 34, rx: 10, fill: shirt, stroke: collar, 'stroke-width': 1.5 }, a); el('circle', { cx: sx * 46, cy: -106, r: 13, fill: skin }, a); });
  el('rect', { x: -42, y: -194, width: 84, height: 92, rx: 22, fill: shirt, stroke: collar, 'stroke-width': 2 }, up);
  el('path', { d: 'M-22,-194 L0,-176 L22,-194 L14,-200 L0,-190 L-14,-200Z', fill: '#fff', stroke: collar, 'stroke-width': 2 }, up);
  if (opt.uniform !== false) { el('circle', { cx: -20, cy: -164, r: 6, fill: '#2E6FB8' }, up); if (!skirt) el('rect', { x: -44, y: -118, width: 88, height: 10, rx: 4, fill: '#2B2B30' }, up); }
  if (skirt && opt.uniform !== false) el('path', { d: 'M-8,-178 l8,10 l8,-10 l-8,-6Z', fill: UNI.navy }, up);
  if (opt.bag) { const bs = G(up, { id: id + '_bags' }); [-26, 26].forEach(x => el('rect', { x: x - 5, y: -194, width: 10, height: 80, rx: 4, fill: opt.bagStrap || opt.bag }, bs)); }
  const H = G(up, { id: id + '_head' });
  const hair = opt.hair || 'khao', HC = opt.hairColor || '#2B1D14';
  if (hair === 'kaew') { [[-66, -250], [66, -250]].forEach(([x, y]) => { el('circle', { cx: x, cy: y + 18, r: 24, fill: HC }, H); el('circle', { cx: x * .9, cy: y - 2, r: 9, fill: '#FF7FA8' }, H); }); }
  if (hair === 'girl') el('path', { d: 'M-66,-250 Q-72,-190 -56,-170 L56,-170 Q72,-190 66,-250Z', fill: HC }, H);
  face(H, id, 0, -255, 63, skin);
  if (hair === 'khao') el('path', { d: 'M-58,-270 Q-40,-318 0,-316 Q42,-318 58,-270 Q30,-292 12,-282 Q0,-296 -14,-282 Q-34,-294 -58,-270Z', fill: HC }, H);
  if (hair === 'ton') el('path', { d: 'M-60,-268 L-54,-300 L-38,-290 L-30,-322 L-14,-300 L0,-330 L14,-300 L30,-322 L38,-290 L54,-300 L60,-268 Q30,-286 0,-282 Q-30,-286 -60,-268Z', fill: HC }, H);
  if (hair === 'boy') el('path', { d: 'M-60,-262 Q-58,-316 0,-318 Q58,-316 60,-262 Q30,-284 0,-284 Q-30,-284 -60,-262Z', fill: HC }, H);
  if (hair === 'kaew' || hair === 'girl') el('path', { d: 'M-64,-250 Q-66,-320 0,-322 Q66,-320 64,-250 Q56,-282 36,-290 Q20,-270 0,-286 Q-20,-270 -36,-290 Q-56,-282 -64,-250Z', fill: HC }, H);
  if (opt.glasses) { [-23, 23].forEach(x => el('circle', { cx: x, cy: -256, r: 19, fill: 'none', stroke: '#2B2B30', 'stroke-width': 4.5 }, H)); el('path', { d: 'M-5,-258 q5,-5 10,0', fill: 'none', stroke: '#2B2B30', 'stroke-width': 4 }, H); }
  if (opt.hat) { const h = G(H, { id: id + '_hat' }); el('path', { d: 'M-128,-292 Q0,-392 128,-292 Q0,-270 -128,-292Z', fill: '#E3B35F' }, h); el('path', { d: 'M-70,-302 Q0,-330 70,-302', fill: 'none', stroke: '#D9453B', 'stroke-width': 8 }, h); }
  gsap.set(`#${id}_legL`, { svgOrigin: sit ? '-52 -6' : '-18 -72' }); gsap.set(`#${id}_legR`, { svgOrigin: sit ? '52 -6' : '18 -72' });
  gsap.set(`#${id}_armL`, { svgOrigin: '-46 -178' }); gsap.set(`#${id}_armR`, { svgOrigin: '46 -178' });
  gsap.set([`#${id}_eyes`, `#${id}_eyesC`, `#${id}_eyesH`], { svgOrigin: '0 -256' }); gsap.set(`#${id}_head`, { svgOrigin: '0 -200' }); gsap.set(`#${id}_body`, { svgOrigin: '0 0' });
  return B;
}
const KHAO = { hair: 'khao' }, KAEW = { hair: 'kaew', lower: 'skirt', skin: '#F7CFA3', limb: '#EDBB8A' }, TON = { hair: 'ton', glasses: true, skin: '#E6B07C', limb: '#D99E68' };
const CLASSMATES = [{ hair: 'girl', lower: 'skirt', skin: '#F3C495' }, { hair: 'boy', skin: '#E2A873', limb: '#D49660' }, { hair: 'girl', lower: 'skirt', skin: '#EDB988', hairColor: '#4A2E1C' }, { hair: 'boy', skin: '#F5C896', hairColor: '#3A2618' }, { hair: 'kaew', lower: 'skirt', skin: '#E8B584' }, { hair: 'ton', skin: '#F0BE8C' }];

/* ---------- buildings & props ---------- */
function thaiFlag(p, id, x, y, s = 1) { const g = G(p, { id }); place(g, x, y, s); const f = G(g, { id: id + '_cloth' });
  [['#A51931', 0], ['#F4F5F8', 1], ['#2D2A4A', 2], ['#2D2A4A', 3], ['#F4F5F8', 4], ['#A51931', 5]].forEach(([c, i]) => el('rect', { x: 0, y: i * 18, width: 160, height: 18, fill: c }, f)); gsap.set(f, { svgOrigin: '0 54' }); return g; }
function school(p, x, y, s = 1) { const g = G(p, { transform: `translate(${x},${y}) scale(${s})` });
  el('rect', { x: -520, y: -260, width: 1040, height: 260, fill: '#F4E3B0' }, g); el('rect', { x: -520, y: -30, width: 1040, height: 30, fill: '#D9C48E' }, g);
  el('path', { d: 'M-570,-250 L-470,-360 L470,-360 L570,-250Z', fill: '#D2552E' }, g); el('path', { d: 'M-570,-250 L570,-250', stroke: '#9E3A1E', 'stroke-width': 12 }, g);
  for (let i = 0; i < 6; i++) { const x0 = -460 + i * 170; if (i === 2 || i === 3) { el('rect', { x: x0, y: -190, width: 110, height: 190, fill: '#3E7CB1' }, g); el('rect', { x: x0 + 52, y: -190, width: 6, height: 190, fill: '#2C5E88' }, g); }
    else { el('rect', { x: x0, y: -200, width: 120, height: 100, fill: '#A7D8F0' }, g); el('rect', { x: x0, y: -200, width: 120, height: 100, fill: 'none', stroke: '#3E7CB1', 'stroke-width': 10 }, g); el('rect', { x: x0 + 57, y: -200, width: 6, height: 100, fill: '#3E7CB1' }, g); } }
  const sign = G(g); el('rect', { x: -220, y: -345, width: 440, height: 70, rx: 12, fill: '#1F5FA8', stroke: '#fff', 'stroke-width': 5 }, sign); const t = el('text', { x: 0, y: -298, 'text-anchor': 'middle', 'font-family': 'K', 'font-weight': 700, 'font-size': 44, fill: '#fff' }, sign); t.textContent = 'โรงเรียนบ้านนา';
  return g; }
function flagpole(p, x, y, h = 560) { const g = G(p); el('rect', { x: x - 60, y: y - 30, width: 120, height: 30, rx: 6, fill: '#BDBDBD' }, g); el('rect', { x: x - 40, y: y - 55, width: 80, height: 26, rx: 5, fill: '#D6D6D6' }, g); el('rect', { x: x - 6, y: y - h, width: 12, height: h - 50, fill: '#E8E8E8' }, g); el('circle', { cx: x, cy: y - h, r: 12, fill: '#E8B64A' }, g); return g; }
function classroom(p, opt = {}) {
  el('rect', { width: 1920, height: 820, fill: '#EFE3C8' }, p); el('rect', { y: 700, width: 1920, height: 120, fill: '#E3D2AE' }, p);
  [[60, 120], [1600, 120]].forEach(([x, y]) => { el('rect', { x, y, width: 260, height: 300, fill: '#BFE6F7' }, p); cloud(p, x + 30, y + 90, .35); el('rect', { x, y, width: 260, height: 300, fill: 'none', stroke: '#8B5E34', 'stroke-width': 14 }, p); el('rect', { x: x + 124, y, width: 12, height: 300, fill: '#8B5E34' }, p); });
  const board = G(p, { id: opt.id || null }); el('rect', { x: 430, y: 90, width: 1060, height: 470, rx: 10, fill: '#6B4A2E' }, board); el('rect', { x: 450, y: 110, width: 1020, height: 430, fill: '#2F5E47' }, board); el('rect', { x: 440, y: 552, width: 1040, height: 18, fill: '#8B5E34' }, board);
  el('rect', { y: 820, width: 1920, height: 260, fill: 'url(#pPlank)' }, p);
  return board; }
function desk(p, x, y, s = 1) { const g = G(p, { transform: `translate(${x},${y}) scale(${s})` }); el('rect', { x: -110, y: -20, width: 220, height: 24, rx: 5, fill: '#C08A54' }, g); el('rect', { x: -100, y: 4, width: 200, height: 80, fill: '#A87444' }, g); el('rect', { x: -100, y: 4, width: 200, height: 14, fill: '#8E5E34' }, g); return g; }
function chalk(p, txt, x, y, size = 110, cls = '', col = '#F4F4EE') { const t = el('text', { class: cls, x, y, 'text-anchor': 'middle', 'font-family': 'K', 'font-weight': 700, 'font-size': size, fill: col }, p); t.textContent = txt; return t; }
function mango(p, x, y, s = 1, cls = '') { const o = G(p, { transform: `translate(${x},${y}) scale(${s})` }); const g = G(o, { class: cls }); el('path', { d: 'M0,-40 C40,-40 50,10 20,40 C0,56 -36,40 -34,6 C-32,-24 -18,-40 0,-40Z', fill: '#F7B32B' }, g); el('path', { d: 'M-4,-40 q-6,-14 6,-20', stroke: '#6B4A2E', 'stroke-width': 5, fill: 'none' }, g); el('path', { d: 'M4,-50 q30,-16 40,4 q-24,8 -40,-4Z', fill: '#5DA24E' }, g); return g; }
function drum(p, id, x, y, s = 1) { const g = G(p, { id }); place(g, x, y, s); el('path', { d: 'M-70,-140 Q-90,-70 -70,0 L70,0 Q90,-70 70,-140Z', fill: '#B0302A' }, g); el('ellipse', { cx: 0, cy: -140, rx: 70, ry: 20, fill: '#F2E6D0', stroke: '#6B4A2E', 'stroke-width': 5 }, g); for (let i = -3; i <= 3; i++) el('path', { d: `M${i * 20},-128 L${i * 22},-6`, stroke: '#E8B64A', 'stroke-width': 3 }, g); el('rect', { x: -76, y: -10, width: 152, height: 12, fill: '#6B4A2E' }, g); return g; }
function ching(p, id, x, y, s = 1) { const g = G(p, { id }); place(g, x, y, s); [[-40, 0], [40, 0]].forEach(([dx]) => { el('ellipse', { cx: dx, cy: 0, rx: 36, ry: 14, fill: '#E8B64A', stroke: '#B98A1E', 'stroke-width': 4 }, g); el('circle', { cx: dx, cy: -8, r: 9, fill: '#C9982E' }, g); }); el('path', { d: 'M-40,-16 Q0,-60 40,-16', fill: 'none', stroke: '#D9453B', 'stroke-width': 4 }, g); return g; }
function ranat(p, id, x, y, s = 1) { const g = G(p, { id }); place(g, x, y, s); el('path', { d: 'M-220,-60 Q0,-10 220,-60 L190,0 L-190,0Z', fill: '#8B3A24' }, g); for (let i = 0; i < 12; i++) { const bx = -170 + i * 31; el('rect', { class: id + 'Bar', x: bx, y: -86 + Math.abs(i - 5.5) * 1.5, width: 24, height: 40 - i * 1.5, rx: 4, fill: '#E3B35F', stroke: '#A67A36', 'stroke-width': 2 }, g); } el('rect', { x: -60, y: 0, width: 120, height: 40, fill: '#6B3A24' }, g); return g; }
function lunchbox(p, x, y, food, s = 1) { const g = G(p, { transform: `translate(${x},${y}) scale(${s})` }); el('rect', { x: -60, y: -30, width: 120, height: 40, rx: 10, fill: '#4FC3F7' }, g); el('rect', { x: -52, y: -26, width: 104, height: 28, rx: 8, fill: '#fff' }, g);
  if (food === 'egg') el('path', { d: 'M-40,-8 q20,-22 44,-6 q22,-10 36,6 q-40,14 -80,0Z', fill: '#F7C948' }, g); if (food === 'rice') { el('ellipse', { cx: 0, cy: -10, rx: 42, ry: 12, fill: '#F2C87A' }, g); [-20, 0, 20].forEach(x => el('circle', { cx: x, cy: -12, r: 4, fill: '#6BAF4A' }, g)); } return g; }
function rabbit(p, id) { const g = G(p, { id }); el('ellipse', { cx: 0, cy: -40, rx: 46, ry: 34, fill: '#fff', stroke: '#D0D0D0', 'stroke-width': 3 }, g); el('circle', { cx: 42, cy: -70, r: 26, fill: '#fff', stroke: '#D0D0D0', 'stroke-width': 3 }, g); el('ellipse', { cx: 34, cy: -120, rx: 9, ry: 30, fill: '#fff', stroke: '#D0D0D0', 'stroke-width': 3 }, g); el('ellipse', { cx: 54, cy: -118, rx: 9, ry: 30, fill: '#fff', stroke: '#D0D0D0', 'stroke-width': 3 }, g); el('ellipse', { cx: 34, cy: -118, rx: 4, ry: 20, fill: '#FFC0CB' }, g); el('circle', { cx: 52, cy: -74, r: 4, fill: '#1D1410' }, g); el('circle', { cx: 68, cy: -64, r: 4, fill: '#FF8FA8' }, g); el('circle', { cx: -44, cy: -44, r: 12, fill: '#fff', stroke: '#D0D0D0', 'stroke-width': 3 }, g); return g; }
function turtle(p, id) { const g = G(p, { id }); el('ellipse', { cx: -30, cy: -8, rx: 12, ry: 10, fill: '#8BC34A' }, g); el('ellipse', { cx: 30, cy: -8, rx: 12, ry: 10, fill: '#8BC34A' }, g); el('circle', { cx: 62, cy: -30, r: 18, fill: '#8BC34A' }, g); el('circle', { cx: 68, cy: -34, r: 3.5, fill: '#1D1410' }, g); el('path', { d: 'M-56,-14 Q-50,-80 0,-82 Q50,-80 56,-14Z', fill: '#4E8F3A' }, g); el('path', { d: 'M-30,-20 l12,-40 l24,0 l12,40 M-44,-40 l88,0', stroke: '#2F6B24', 'stroke-width': 4, fill: 'none' }, g); return g; }
function bubble(p, id, x, y, w, h) { const g = G(p, { id, opacity: 0 }); el('rect', { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: 40, fill: '#fff', stroke: '#3B2A20', 'stroke-width': 5 }, g); [[x - w / 2 + 60, y + h / 2 + 30, 18], [x - w / 2 + 30, y + h / 2 + 64, 11]].forEach(([cx, cy, r]) => el('circle', { cx, cy, r, fill: '#fff', stroke: '#3B2A20', 'stroke-width': 4 }, g)); return g; }
function confetti(p, cls, cx, cy, n = 30, sd = 3) { seed(sd); const cols = ['#FF6B8A', '#FFD84D', '#4FC3F7', '#8BC34A', '#B58CFF']; for (let i = 0; i < n; i++) { const w = G(p, { transform: `translate(${cx},${cy})` }); el('rect', { class: cls, x: -6, y: -10, width: 12, height: 20, rx: 3, fill: cols[i % 5], opacity: 0 }, w); } }
function bulb(p, id, x, y, s = 1) { const g = G(p, { id, opacity: 0 }); place(g, x, y, s); el('circle', { r: 70, fill: '#FFF3A6', opacity: .5 }, g); el('path', { d: 'M-30,10 Q-44,-10 -40,-30 Q-30,-66 0,-66 Q30,-66 40,-30 Q44,-10 30,10 L22,30 L-22,30Z', fill: '#FFE45C', stroke: '#C99A1E', 'stroke-width': 5 }, g); el('rect', { x: -20, y: 30, width: 40, height: 20, rx: 5, fill: '#9E9E9E' }, g); return g; }
function qmark(p, id, x, y) { const g = G(p, { id, opacity: 0 }); const t = el('text', { x, y, 'text-anchor': 'middle', 'font-family': 'K', 'font-weight': 700, 'font-size': 90, fill: '#FFB300', stroke: '#6B3A1E', 'stroke-width': 4, 'paint-order': 'stroke' }, g); t.textContent = '?'; return g; }
function rope(p, id) { return el('path', { id, d: 'M0,0 Q0,0 0,0', fill: 'none', stroke: '#E53935', 'stroke-width': 7, 'stroke-linecap': 'round' }, p); }
function broom(p, x, y) { const g = G(p, { transform: `translate(${x},${y})` }); el('rect', { x: -4, y: -150, width: 8, height: 130, fill: '#A0703E' }, g); el('path', { d: 'M-30,0 L-10,-24 L10,-24 L30,0Z', fill: '#E3C07A' }, g); return g; }
function wateringCan(p, x, y, s = 1) { const g = G(p, { transform: `translate(${x},${y}) scale(${s})` }); el('rect', { x: -30, y: -40, width: 60, height: 44, rx: 10, fill: '#4FC3F7' }, g); el('path', { d: 'M28,-30 L70,-60 L76,-54 L34,-18Z', fill: '#4FC3F7' }, g); el('path', { d: 'M-20,-40 Q0,-70 20,-40', fill: 'none', stroke: '#2E86C1', 'stroke-width': 6 }, g); return g; }
function paper(p, x, y, w, h) { const g = G(p, { transform: `translate(${x},${y})` }); el('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 8, fill: '#FFFDF6', stroke: '#D9CBA8', 'stroke-width': 4 }, g); return g; }
