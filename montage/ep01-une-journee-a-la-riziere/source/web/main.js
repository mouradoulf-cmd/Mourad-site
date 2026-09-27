/* builds every scene from TIMELINE and wires talk / blink / subtitles */
(function () {
  const svg = $('svg'); defs(svg);
  const frame = G(svg, { 'clip-path': 'url(#cFrame)' });
  const dom = $('dom');
  const SCN = TIMELINE.scenes; const XF = 0.5;
  SCN.forEach((s, k) => {
    const t0 = s.start, t1 = s.start + s.dur;
    const root = G(frame, { id: 'sc_' + s.id, style: 'display:none' });
    const layer = document.createElement('div'); layer.style.cssText = 'position:absolute;inset:0;display:none'; dom.appendChild(layer);
    const ctx = { s, root, dom: layer, t0, t1, id: s.id,
      at: m => { if (!(m in s.marks)) throw new Error(`mark ${m} missing in ${s.id}`); return t0 + s.marks[m]; },
      L: i => t0 + s.lines[i].t, Le: i => t0 + s.lines[i].t + s.lines[i].d, line: i => s.lines[i], Lt: p => { const k = s.lines.findIndex(l => l.text.startsWith(p)); if (k < 0) throw new Error(`line '${p}' missing in ${s.id}`); return k; } };
    const ONLY = new URLSearchParams(location.search).get('only');
    const f = SC[s.id]; if (!f) throw new Error('no scene ' + s.id);
    const info = (ONLY && !ONLY.split(',').includes(s.id)) ? {} : (f(ctx) || {});
    const fin = k === 0 ? t0 : t0 - XF;
    S(0, [root], { display: 'none', opacity: k === 0 ? 1 : 0 }); S(0, layer, { display: 'none' });
    S(fin, root, { display: 'inline' }); S(fin, layer, { display: 'block' });
    if (k > 0) T(fin, [root, layer], { opacity: 1, duration: XF, ease: 'none' });
    const last = k === SCN.length - 1;
    if (!last) { S(t1 + 0.02, root, { display: 'none' }); S(t1 + 0.02, layer, { display: 'none' }); }
    const spk = info.speakers || {};
    s.lines.forEach((ln, i) => { const who = typeof spk === 'function' ? spk(ln, i) : spk[ln.who]; if (who) talk(who, t0 + ln.t, t0 + ln.t + ln.d); });
    (info.blink || []).forEach((b, j) => blinks(`#${b}_eyes`, fin, t1, k * 10 + j));
  });
  // subtitles
  const subs = $('subs'); const L = TIMELINE.lines; const NAME = { B: 'น้องข้าว', F: 'พ่อ', M: 'แม่' };
  L.forEach((ln, i) => {
    const d = document.createElement('div'); d.className = 'sub ' + ln.who;
    d.innerHTML = (NAME[ln.who] ? `<span class="who">${NAME[ln.who]}</span>` : '') + ln.text; subs.appendChild(d);
    const a = ln.T - 0.12, nx = i + 1 < L.length ? L[i + 1].T - 0.08 : ln.T + ln.d + 0.4; const b = Math.min(ln.T + ln.d + 0.25, nx);
    O(a, d, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .18, ease: 'power2.out' }); T(b - 0.15, d, { opacity: 0, duration: .15, ease: 'none' });
    S(0, d, { opacity: 0 });
  });
  const END = TIMELINE.total;
  T(END - 0.9, '#fade', { opacity: 1, duration: 0.85, ease: 'none' });
  tl.set({}, {}, END);
  window.DUR = END; window.seek = t => { tl.seek(t, false); };
  document.fonts.ready.then(() => { window.READY = true; });
})();
