/* English Easy TH — core: state (localStorage), helpers, voice (speechSynthesis), sound effects (WebAudio), confetti. */
(function (EE) {
"use strict";
const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
EE.$ = $; EE.$$ = $$;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
EE.reduce = reduce;

/* ---------- tiny helpers ---------- */
EE.shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
EE.pick = (a, n) => EE.shuffle(a).slice(0, n);
EE.esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
EE.norm = s => String(s).toLowerCase().replace(/[’‘`´]/g, "'").replace(/[^a-z0-9' ]+/g, " ").replace(/'/g, "").replace(/\s+/g, " ").trim();
const dayKey = (d) => { d = d || new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
EE.dayKey = dayKey;
const dayDiff = (a, b) => Math.round((new Date(b + "T00:00:00") - new Date(a + "T00:00:00")) / 86400000);

/* ---------- state ---------- */
const KEY = "ee1";
const MAX_HEARTS = 5, HEART_MS = 30 * 60 * 1000;
const def = () => ({ name: "", goal: 20, xp: 0, gems: 20, hearts: MAX_HEARTS, heartTs: 0, streak: 0, best: 0, lastDay: "", freeze: 0,
  done: {}, mistakes: {}, learned: {}, today: { d: dayKey(), xp: 0 }, stats: { ok: 0, ko: 0, lessons: 0, perfect: 0 }, favs: [],
  settings: { sound: true, slow: false, demo: false }, onboarded: false, badges: {}, bestSpeed: 0, bestMemory: 0 });
let S;
function load() { try { S = Object.assign(def(), JSON.parse(localStorage.getItem(KEY) || "{}")); S.settings = Object.assign(def().settings, S.settings); S.stats = Object.assign(def().stats, S.stats); } catch (e) { S = def(); } tick(); }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} EE.emit("state"); }
EE.state = () => S; EE.save = save; EE.MAX_HEARTS = MAX_HEARTS;

/* tiny event bus */
const L = {}; EE.on = (n, f) => (L[n] = L[n] || []).push(f); EE.emit = (n, a) => (L[n] || []).forEach(f => f(a));

/* daily rollover + streak check + hearts regeneration */
function tick() {
  const t = dayKey();
  if (S.today.d !== t) S.today = { d: t, xp: 0 };
  if (S.lastDay) {
    const gap = dayDiff(S.lastDay, t);
    if (gap > 1) { if (S.freeze > 0 && gap === 2) { S.freeze--; S.lastDay = dayKey(new Date(Date.now() - 86400000)); } else S.streak = 0; }
  }
  if (S.hearts < MAX_HEARTS) {
    if (!S.heartTs) S.heartTs = Date.now();
    const n = Math.floor((Date.now() - S.heartTs) / HEART_MS);
    if (n > 0) { S.hearts = Math.min(MAX_HEARTS, S.hearts + n); S.heartTs = S.hearts >= MAX_HEARTS ? 0 : S.heartTs + n * HEART_MS; }
  } else S.heartTs = 0;
}
EE.tick = () => { tick(); };
EE.heartsLeftMs = () => (S.hearts >= MAX_HEARTS || !S.heartTs) ? 0 : Math.max(0, S.heartTs + HEART_MS - Date.now());

EE.addXp = n => { S.xp += n; S.today.xp += n; };
EE.touchStreak = () => {
  const t = dayKey(); if (S.lastDay === t) return false;
  S.streak = (S.lastDay && dayDiff(S.lastDay, t) === 1) ? S.streak + 1 : 1; S.best = Math.max(S.best, S.streak); S.lastDay = t; return true;
};
EE.loseHeart = () => { if (S.hearts > 0) { if (S.hearts === MAX_HEARTS) S.heartTs = Date.now(); S.hearts--; } };
EE.level = () => Math.floor(S.xp / 100) + 1;
EE.recordMistake = w => { const k = w.en; S.mistakes[k] = (S.mistakes[k] || 0) + 1; };
EE.clearMistake = w => { const k = w.en; if (S.mistakes[k]) { S.mistakes[k]--; if (S.mistakes[k] <= 0) delete S.mistakes[k]; } };

/* lesson progress */
EE.isDone = id => !!S.done[id];
EE.unlocked = lesson => {
  if (S.settings.demo) return true;
  const i = EE.LESSONS.indexOf(lesson); return i === 0 || !!S.done[EE.LESSONS[i - 1].id];
};
EE.current = () => EE.LESSONS.find(l => !S.done[l.id]) || null;

/* ---------- toast ---------- */
EE.toast = (msg, kind) => {
  const box = $("#toasts"); if (!box) return; const t = document.createElement("div");
  t.className = "toast" + (kind ? " toast--" + kind : ""); t.textContent = msg; box.appendChild(t);
  setTimeout(() => t.classList.add("out"), 2600); setTimeout(() => t.remove(), 3100);
};

/* ---------- voice (speech synthesis) ---------- */
let voice = null, voiceReady = false;
function pickVoice() {
  if (!("speechSynthesis" in window)) return;
  const vs = speechSynthesis.getVoices().filter(v => /^en[-_]/i.test(v.lang));
  if (!vs.length) return;
  const rank = v => { const n = v.name; let r = 0; if (/en[-_]US/i.test(v.lang)) r += 3; if (/Samantha|Aria|Jenny|Google US English|Natural|Premium|Enhanced/i.test(n)) r += 4; if (/Zira|David|Guy|Alex|Daniel/i.test(n)) r += 2; if (/en[-_]GB/i.test(v.lang)) r += 1; return r; };
  voice = vs.sort((a, b) => rank(b) - rank(a))[0]; voiceReady = true;
}
if ("speechSynthesis" in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
EE.canSpeak = () => "speechSynthesis" in window;
let warned = false;
EE.speak = (text, opt) => {
  opt = opt || {};
  if (!EE.canSpeak()) { if (!warned) { warned = true; EE.toast("อุปกรณ์นี้ยังไม่รองรับเสียงอ่านภาษาอังกฤษ", "warn"); } return; }
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text); u.lang = "en-US"; if (voice) u.voice = voice;
    u.rate = opt.slow || S.settings.slow ? 0.62 : 0.88; u.pitch = 1; speechSynthesis.speak(u);
  } catch (e) {}
};
EE.sayOf = w => w.say || w.en;

/* ---------- sound effects (WebAudio, synthesised) ---------- */
let ac = null;
function ctx() { if (!ac) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ac = new C(); } if (ac.state === "suspended") ac.resume(); return ac; }
function tone(f, d, type, vol, when, slide) {
  if (!S.settings.sound) return; const c = ctx(); if (!c) return;
  const o = c.createOscillator(), g = c.createGain(), t = c.currentTime + (when || 0);
  o.type = type || "sine"; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || .08, t + .01); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d + .03);
}
EE.sfx = {
  ok() { tone(660, .12, "triangle", .09); tone(990, .2, "triangle", .08, .09); },
  no() { tone(220, .25, "sawtooth", .06, 0, 110); },
  tap() { tone(520, .05, "sine", .05); },
  win() { [523, 659, 784, 1047].forEach((f, i) => tone(f, .28, "triangle", .08, i * .11)); },
  coin() { tone(1200, .08, "square", .04); tone(1600, .14, "square", .04, .07); },
  combo(n) { const b = 523 * Math.pow(1.122, Math.min(n || 0, 8)); tone(b, .1, "triangle", .09); tone(b * 1.5, .16, "triangle", .07, .07); },
  whoosh() { tone(300, .25, "sawtooth", .03, 0, 1200); }
};

/* ---------- confetti (canvas, tiny) ---------- */
EE.confetti = () => {
  if (reduce) return; const cv = document.createElement("canvas"); cv.className = "confetti"; document.body.appendChild(cv);
  const c = cv.getContext("2d"), W = cv.width = innerWidth, H = cv.height = innerHeight, cols = ["#6c5ce7", "#ffc21a", "#00b894", "#ff7675", "#0984e3", "#fd79a8"];
  const ps = Array.from({ length: 90 }, () => ({ x: W / 2 + (Math.random() - .5) * 120, y: H * .35, vx: (Math.random() - .5) * 14, vy: -Math.random() * 14 - 4, s: Math.random() * 8 + 4, r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: cols[Math.floor(Math.random() * cols.length)] }));
  let f = 0; (function step() { c.clearRect(0, 0, W, H); ps.forEach(p => { p.vy += .4; p.x += p.vx; p.y += p.vy; p.r += p.vr; c.save(); c.translate(p.x, p.y); c.rotate(p.r); c.fillStyle = p.c; c.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * .6); c.restore(); });
    if (++f < 130) requestAnimationFrame(step); else cv.remove(); })();
};

/* ---------- mascot (original SVG, 3 moods) ---------- */
EE.mascot = (mood, size) => {
  const m = mood || "happy", s = size || 96;
  const eyes = m === "sad" ? '<path d="M34 46q4-5 8 0M58 46q4-5 8 0" stroke="#1f2340" stroke-width="3.5" fill="none" stroke-linecap="round"/>' : '<circle cx="38" cy="46" r="5" fill="#1f2340"/><circle cx="62" cy="46" r="5" fill="#1f2340"/><circle cx="40" cy="44" r="1.6" fill="#fff"/><circle cx="64" cy="44" r="1.6" fill="#fff"/>';
  const mouth = m === "sad" ? '<path d="M40 66q10-8 20 0" stroke="#1f2340" stroke-width="3.5" fill="none" stroke-linecap="round"/>' : m === "cheer" ? '<path d="M38 60q12 16 24 0z" fill="#1f2340"/><path d="M43 66q7 6 14 0" fill="#ff7675"/>' : '<path d="M40 62q10 10 20 0" stroke="#1f2340" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
  return `<svg class="mascot mascot--${m}" width="${s}" height="${s}" viewBox="0 0 100 100" role="img" aria-label="น้องอีซี่"><path d="M50 8C26 8 10 24 10 46c0 14 7 25 18 32l-5 15 20-11c2 .3 5 .4 7 .4 24 0 40-16 40-36S74 8 50 8z" fill="#6c5ce7"/><path d="M50 14C30 14 16 27 16 46s12 31 34 31 34-12 34-31S70 14 50 14z" fill="#8a7dff"/><ellipse cx="29" cy="58" rx="6" ry="4" fill="#ff9aa9" opacity=".7"/><ellipse cx="71" cy="58" rx="6" ry="4" fill="#ff9aa9" opacity=".7"/>${eyes}${mouth}${m === "cheer" ? '<path d="M18 24l-6-8M82 24l6-8M50 8V0" stroke="#ffc21a" stroke-width="4" stroke-linecap="round"/>' : ""}</svg>`;
};

load();
})(window.EE = window.EE || {});
