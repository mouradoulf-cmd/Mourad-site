/* English Easy TH — lesson player: builds exercises from the curriculum and runs them (choice, listening, typing,
   matching, sentence building). Used for lessons, daily training and the "fix your mistakes" review. */
(function (EE) {
"use strict";
const { $, $$, esc, shuffle, pick, norm } = EE;
const PRAISE = ["ยอดเยี่ยม!", "เก่งมาก!", "ถูกต้อง!", "เยี่ยมเลย!", "สุดยอด!", "ใช่เลย!"];

/* ---------- distractors ---------- */
const ALL_SENT = [].concat.apply([], EE.LESSONS.map(l => (l.sentences || []).map(s => Object.assign({ unit: l.unit }, s))));
function opts(item, field, n, pool) {
  const bad = shuffle(pool.filter(w => w !== item && w[field] !== item[field])).slice(0, n - 1);
  const uniq = []; bad.concat([item]).forEach(w => { if (!uniq.some(u => u[field] === w[field])) uniq.push(w); });
  return shuffle(uniq).map(w => ({ label: w[field], item: w, ok: w === item }));
}
function poolFor(item) { return item.letter ? EE.ALPHABET : (EE.ALL_WORDS.filter(w => w.unit === item.unit).length >= 6 ? EE.ALL_WORDS.filter(w => w.unit === item.unit).concat(pick(EE.ALL_WORDS, 6)) : EE.ALL_WORDS); }

/* ---------- step factories ---------- */
const steps = {
  choice(prompt, o, extra) { return Object.assign({ type: "choice", prompt, options: o }, extra || {}); },
  en2th(w) { return w.letter ? steps.choice("ตัวอักษรนี้อ่านว่าอะไร?", opts(w, "th", 4, EE.ALPHABET), { big: w.en, speak: w, item: w, answer: w.th, auto: true })
      : steps.choice("คำนี้แปลว่าอะไร?", opts(w, "th", 4, poolFor(w)), { big: w.en, emoji: w.emoji, speak: w, item: w, answer: w.th, auto: true }); },
  th2en(w) { return w.letter ? steps.choice("ตัวอักษรที่อ่านว่า “" + w.th + "” คือข้อไหน?", opts(w, "en", 4, EE.ALPHABET), { item: w, answer: w.en, big: w.th, speakOpt: true })
      : steps.choice("เลือกคำภาษาอังกฤษที่ตรงกับ", opts(w, "en", 4, poolFor(w)), { big: w.th, emoji: w.emoji, item: w, answer: w.en, speakOpt: true }); },
  listen(w) { return steps.choice("ฟังแล้วเลือกสิ่งที่ได้ยิน", opts(w, "en", 4, poolFor(w)), { listen: w, item: w, answer: w.en, auto: true }); },
  letterWord(w) { return steps.choice("“" + w.ex + "” ขึ้นต้นด้วยตัวอักษรอะไร?", opts(w, "en", 4, EE.ALPHABET), { big: w.ex, emoji: w.emoji, sub: w.exTh, item: w, answer: w.en, speakText: w.ex }); },
  type(w) { return { type: "type", prompt: "พิมพ์เป็นภาษาอังกฤษ", big: w.th, emoji: w.emoji, item: w, answer: w.en, alts: (w.alt || []).concat([w.en]) }; },
  match(ws) { return { type: "match", prompt: "จับคู่คำกับความหมาย", pairs: ws }; },
  order(s) { return { type: "order", prompt: "เรียงประโยคเป็นภาษาอังกฤษ", big: s.th, sent: s, answer: s.en }; },
  sentChoice(s) { const o = shuffle(ALL_SENT.filter(x => x.en !== s.en).slice(0, 40)).slice(0, 2).concat([s]); return steps.choice("ประโยคนี้แปลว่าอะไร?", shuffle(o).map(x => ({ label: x.th, item: x, ok: x === s })), { big: s.en, speakText: s.en, item: s, answer: s.th, auto: true, sentence: true }); },
  sentListen(s) { const o = shuffle(ALL_SENT.filter(x => x.en !== s.en).slice(0, 40)).slice(0, 2).concat([s]); return steps.choice("ฟังประโยคแล้วเลือกความหมาย", shuffle(o).map(x => ({ label: x.th, item: x, ok: x === s })), { listen: s, speakText: s.en, item: s, answer: s.th, auto: true, sentence: true }); }
};

/* ---------- lesson plan ---------- */
function planLesson(L) {
  const ws = shuffle(L.words || []), ss = shuffle(L.sentences || []), out = [];
  if (L.words.length) out.push({ type: "intro", words: L.words, lesson: L });
  ws.slice(0, 8).forEach(w => out.push(steps.en2th(w)));
  if (ws.length >= 4 && !ws[0].letter) out.splice(Math.min(4, out.length), 0, steps.match(ws.slice(0, 5)));
  const kinds = ws[0] && ws[0].letter ? ["listen", "letterWord", "th2en"] : ["listen", "th2en", "type"];
  ws.slice(0, 7).forEach((w, i) => { const k = kinds[i % kinds.length]; out.push(steps[k](w)); });
  if (ws[0] && ws[0].letter) shuffle(ws).slice(0, 3).forEach(w => out.push(steps.en2th(w)));
  const take = ws.length ? Math.min(ss.length, 3) : Math.min(ss.length, 6);
  ss.slice(0, take).forEach(s => { out.push(steps.order(s)); if (!ws.length) { out.push(steps.sentListen(s)); } else out.push(steps.sentChoice(s)); });
  if (ws.length && ss.length === 0) { /* words only: add a typing round */ ws.slice(0, 3).forEach(w => out.push(steps.type(w))); }
  return out;
}
function planTraining(list, n) {
  const w = shuffle(list).slice(0, n || 10), out = [];
  w.forEach((x, i) => { const r = i % 4; out.push(r === 0 ? steps.en2th(x) : r === 1 ? steps.listen(x) : r === 2 ? steps.th2en(x) : steps.type(x)); });
  return out;
}
EE.planTraining = planTraining; EE.steps = steps;

/* ---------- player ---------- */
EE.play = function (cfg) {
  /* cfg: { title, steps, mode:'lesson'|'train'|'review', color, onExit(), onFinish(result) } */
  const S = EE.state();
  const root = $("#player"); root.hidden = false; document.body.classList.add("playing");
  const plan = cfg.steps.slice(), total = plan.filter(s => s.type !== "intro").length;
  const P = { i: 0, wrong: 0, right: 0, firstTry: 0, queue: plan, retried: new Set(), started: Date.now(), xp: 0, answered: 0, advance: null };

  root.innerHTML = `<div class="pl__top"><button class="pl__x" aria-label="ออกจากบทเรียน">✕</button><div class="pl__bar" role="progressbar" aria-valuemin="0" aria-valuemax="100"><i></i></div><div class="pl__hearts" aria-label="หัวใจ"></div></div>
  <div class="pl__stage" id="stage" aria-live="polite"></div>
  <div class="pl__foot" id="foot"><div class="pl__fb" id="fb" hidden></div><button class="btn btn--primary pl__go" id="go" disabled>ตรวจคำตอบ</button></div>`;
  root.style.setProperty("--uc", cfg.color || "#6c5ce7");
  const stage = $("#stage", root), go = $("#go", root), fb = $("#fb", root), bar = $("i", $(".pl__bar", root)), hearts = $(".pl__hearts", root);
  const heartsUI = () => { hearts.innerHTML = cfg.mode === "lesson" ? "❤️ " + S.hearts : "♾️"; };
  const progress = () => { const p = Math.min(100, Math.round(P.answered / Math.max(1, total + P.retried.size) * 100)); bar.style.width = p + "%"; bar.parentNode.setAttribute("aria-valuenow", p); };
  heartsUI(); progress();

  function exit(confirm) { if (confirm && P.answered > 0 && !window.confirm("ออกจากบทเรียนตอนนี้? ความคืบหน้าของบทนี้จะไม่ถูกบันทึก")) return; close(); cfg.onExit && cfg.onExit(); }
  function close() { root.hidden = true; root.innerHTML = ""; document.body.classList.remove("playing"); document.removeEventListener("keydown", onKey); if (EE.canSpeak()) speechSynthesis.cancel(); }
  $(".pl__x", root).addEventListener("click", () => exit(true));

  /* keyboard: 1-4 choose, Enter checks / continues */
  function onKey(e) {
    if (root.hidden) return;
    if (e.key === "Enter") { if (!go.disabled) { e.preventDefault(); go.click(); } return; }
    if (/^[1-4]$/.test(e.key) && !(e.target && /INPUT|TEXTAREA/.test(e.target.tagName))) { const b = $$(".opt", stage)[+e.key - 1]; if (b && !b.disabled) b.click(); }
  }
  document.addEventListener("keydown", onKey);

  function setFooter(state, text, label) {
    fb.hidden = state === "idle"; fb.className = "pl__fb" + (state === "ok" ? " pl__fb--ok" : state === "bad" ? " pl__fb--bad" : ""); fb.innerHTML = text || "";
    go.textContent = label || "ตรวจคำตอบ"; go.className = "btn pl__go " + (state === "bad" ? "btn--bad" : state === "ok" ? "btn--good" : "btn--primary");
  }
  function next() { P.i++; show(); }

  function result(ok, st, correctText, extraXp) {
    P.answered++;
    if (ok) { P.right++; const first = !P.retried.has(st); if (first) P.firstTry++; const gain = first ? 10 : 5; P.xp += gain; S.stats.ok++; P.combo=(P.combo||0)+1; EE.sfx.combo(P.combo); if (st.item && !st.item.sentence) EE.clearMistake(st.item); setFooter("ok", "<b>" + PRAISE[Math.floor(Math.random() * PRAISE.length)] + "</b> <span>+" + gain + " XP</span>", "ต่อไป"); }
    else {
      P.wrong++; P.combo=0; S.stats.ko++; EE.sfx.no(); if (st.item && st.item.en && !st.item.letter) EE.recordMistake(st.item);
      if (cfg.mode === "lesson") { EE.loseHeart(); heartsUI(); }
      if (!P.retried.has(st)) { P.retried.add(st); P.queue.push(st); }
      setFooter("bad", "<b>คำตอบที่ถูกต้อง</b><span>" + esc(correctText || "") + "</span>", "เข้าใจแล้ว");
      if (cfg.mode === "lesson" && S.hearts <= 0) { EE.save(); go.onclick = () => outOfHearts(); go.disabled = false; progress(); return; }
    }
    EE.save(); progress(); go.disabled = false; go.onclick = next;
    go.focus({ preventScroll: true });
  }

  function outOfHearts() {
    root.innerHTML = `<div class="pl__end"><div class="pl__mascot">${EE.mascot("sad", 120)}</div><h2>หัวใจหมดแล้ว 💔</h2><p>หัวใจจะเพิ่มขึ้น 1 ดวงทุก 30 นาที หรือเลือกวิธีด้านล่าง</p>
      <div class="pl__btns"><button class="btn btn--primary" id="oh-train">ฝึกเพื่อรับหัวใจ (+1 ❤️)</button><button class="btn btn--gold" id="oh-buy" ${S.gems < 30 ? "disabled" : ""}>เติมหัวใจเต็ม 💎 30</button><button class="btn btn--ghost" id="oh-exit">กลับหน้าหลัก</button></div><p class="pl__hint">💎 ที่มี: ${S.gems}</p></div>`;
    $("#oh-exit", root).onclick = () => exit(false);
    $("#oh-train", root).onclick = () => { close(); location.hash = "#/train"; };
    $("#oh-buy", root).onclick = () => { if (S.gems >= 30) { S.gems -= 30; S.hearts = EE.MAX_HEARTS; S.heartTs = 0; EE.save(); EE.sfx.coin(); close(); EE.toast("เติมหัวใจเต็มแล้ว ❤️", "ok"); cfg.onExit && cfg.onExit(); EE.restart && EE.restart(cfg); } };
  }

  /* ---------- renderers ---------- */
  function speakBtn(text, slow, cls) { return `<button class="spk ${cls || ""}" data-say="${esc(text)}" ${slow ? 'data-slow="1"' : ""} aria-label="ฟังเสียง${slow ? "ช้า" : ""}">${slow ? "🐢" : "🔊"}</button>`; }
  function bindSpeak(scope) { $$(".spk", scope).forEach(b => b.addEventListener("click", e => { e.stopPropagation(); EE.speak(b.dataset.say, { slow: !!b.dataset.slow }); })); }

  function renderIntro(st) {
    setFooter("idle", "", "เริ่มเลย"); go.disabled = false; go.onclick = next; go.className = "btn btn--primary pl__go";
    stage.innerHTML = `<div class="st st--intro"><h2>คำที่จะได้เรียน</h2><p class="st__sub">แตะที่ไอคอนเพื่อฟังเสียงอ่าน</p><div class="cards">${st.words.map(w =>
      `<div class="card w-card"><span class="w-card__e">${w.emoji || (w.letter ? w.en : "💬")}</span><div class="w-card__t"><b>${esc(w.letter ? w.en + " — " + w.ex : w.en)}</b><span>${esc(w.letter ? w.th + " · " + w.exTh : w.th)}</span></div>${speakBtn(EE.sayOf(w))}</div>`).join("")}</div></div>`;
    bindSpeak(stage);
  }

  function renderChoice(st) {
    go.disabled = true; setFooter("idle", "", "ตรวจคำตอบ"); let chosen = null, locked = false;
    const head = st.listen ? `<div class="st__listen">${speakBtn(st.speakText || EE.sayOf(st.listen), false, "spk--xl")}${speakBtn(st.speakText || EE.sayOf(st.listen), true, "spk--slow")}</div>`
      : `<div class="st__big">${st.emoji ? `<span class="st__emoji">${st.emoji}</span>` : ""}<span class="st__word ${st.sentence ? "st__word--s" : ""}">${esc(st.big || "")}</span>${(st.speak || st.speakText) ? speakBtn(st.speakText || EE.sayOf(st.speak)) : ""}</div>${st.sub ? `<div class="st__sub">${esc(st.sub)}</div>` : ""}`;
    stage.innerHTML = `<div class="st"><h2 class="st__q">${esc(st.prompt)}</h2>${head}<div class="opts" role="listbox">${st.options.map((o, i) => `<button class="opt" role="option" data-i="${i}"><kbd>${i + 1}</kbd><span>${esc(o.label)}</span></button>`).join("")}</div></div>`;
    bindSpeak(stage);
    if (st.auto && (st.speak || st.listen || st.speakText)) setTimeout(() => EE.speak(st.speakText || EE.sayOf(st.speak || st.listen)), 250);
    const btns = $$(".opt", stage);
    btns.forEach(b => b.addEventListener("click", () => {
      if (locked) return; EE.sfx.tap(); btns.forEach(x => x.classList.remove("is-on")); b.classList.add("is-on"); chosen = +b.dataset.i; go.disabled = false;
      if (st.speakOpt) EE.speak(st.options[chosen].label);
    }));
    go.onclick = () => {
      if (chosen === null || locked) return; locked = true; btns.forEach(b => b.disabled = true);
      const o = st.options[chosen]; btns[chosen].classList.add(o.ok ? "is-good" : "is-bad"); if (!o.ok) btns[st.options.findIndex(x => x.ok)].classList.add("is-good");
      result(o.ok, st, st.answer);
    };
  }

  function renderType(st) {
    go.disabled = true; setFooter("idle", "", "ตรวจคำตอบ");
    stage.innerHTML = `<div class="st"><h2 class="st__q">${esc(st.prompt)}</h2><div class="st__big">${st.emoji ? `<span class="st__emoji">${st.emoji}</span>` : ""}<span class="st__word st__word--th">${esc(st.big)}</span></div>
      <input class="inp" id="inp" type="text" inputmode="text" lang="en" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="พิมพ์คำตอบที่นี่…" aria-label="พิมพ์คำตอบภาษาอังกฤษ">
      <p class="st__hint">ไม่ต้องกังวลเรื่องตัวพิมพ์เล็ก-ใหญ่ · <button class="linkbtn" id="peek">ดูคำใบ้</button></p></div>`;
    const inp = $("#inp", stage); let locked = false; inp.focus({ preventScroll: true });
    inp.addEventListener("input", () => { go.disabled = !inp.value.trim(); });
    $("#peek", stage).addEventListener("click", () => { $(".st__hint", stage).innerHTML = "ขึ้นต้นด้วย <b>" + esc(st.answer.slice(0, 1).toUpperCase()) + "</b> · " + st.answer.length + " ตัวอักษร"; });
    go.onclick = () => {
      if (locked || !inp.value.trim()) return; locked = true; inp.disabled = true;
      const ok = st.alts.some(a => norm(a) === norm(inp.value)); inp.classList.add(ok ? "is-good" : "is-bad"); EE.speak(st.answer);
      result(ok, st, st.answer);
    };
  }

  function renderMatch(st) {
    go.disabled = true; setFooter("idle", "", "ตรวจคำตอบ"); go.hidden = true;
    const L = shuffle(st.pairs), R = shuffle(st.pairs); let a = null, left = st.pairs.length, tries = 0;
    stage.innerHTML = `<div class="st"><h2 class="st__q">${esc(st.prompt)}</h2><div class="match"><div class="match__col">${L.map((w, i) => `<button class="mt" data-k="L${i}">${esc(w.en)}</button>`).join("")}</div><div class="match__col">${R.map((w, i) => `<button class="mt" data-k="R${i}">${esc(w.th)}</button>`).join("")}</div></div></div>`;
    const btn = (side, i) => $(`[data-k="${side}${i}"]`, stage);
    $$(".mt", stage).forEach(b => b.addEventListener("click", () => {
      if (b.classList.contains("is-gone")) return; EE.sfx.tap(); const side = b.dataset.k[0], idx = +b.dataset.k.slice(1);
      if (side === "L") EE.speak(L[idx].en);
      if (!a) { a = { side, idx, b }; b.classList.add("is-on"); return; }
      if (a.side === side) { a.b.classList.remove("is-on"); a = { side, idx, b }; b.classList.add("is-on"); return; }
      const li = side === "L" ? idx : a.idx, ri = side === "R" ? idx : a.idx, ok = L[li] === R[ri], ba = btn("L", li), bb = btn("R", ri);
      a.b.classList.remove("is-on"); a = null;
      if (ok) { EE.sfx.ok(); [ba, bb].forEach(x => x.classList.add("is-gone")); if (--left === 0) { go.hidden = false; P.answered++; P.right++; P.xp += tries ? 5 : 10; EE.sfx.win(); setFooter("ok", "<b>จับคู่ครบแล้ว!</b> <span>+" + (tries ? 5 : 10) + " XP</span>", "ต่อไป"); go.disabled = false; go.onclick = next; progress(); } }
      else { tries++; P.wrong++; S.stats.ko++; EE.sfx.no(); [ba, bb].forEach(x => { x.classList.add("is-bad"); setTimeout(() => x.classList.remove("is-bad"), 500); }); EE.recordMistake(L[li]); }
    }));
  }

  function renderOrder(st) {
    go.disabled = true; setFooter("idle", "", "ตรวจคำตอบ"); go.hidden = false;
    const toks = st.sent.en.split(/\s+/), extraPool = ALL_SENT.filter(x => x.en !== st.sent.en).map(x => x.en.split(/\s+/)).reduce((p, c) => p.concat(c), []).filter(t => !toks.includes(t)), extra = pick(extraPool, 2);
    const bank = shuffle(toks.map((t, i) => ({ t, id: i })).concat(extra.map((t, i) => ({ t, id: 100 + i })))), line = []; let locked = false;
    stage.innerHTML = `<div class="st"><h2 class="st__q">${esc(st.prompt)}</h2><div class="st__big"><span class="st__word st__word--th st__word--s">${esc(st.big)}</span>${speakBtn(st.sent.en)}</div><div class="line" id="line" aria-label="ประโยคของคุณ"></div><div class="bank" id="bank"></div></div>`;
    bindSpeak(stage); const lineEl = $("#line", stage), bankEl = $("#bank", stage);
    const draw = () => {
      lineEl.innerHTML = line.map(x => `<button class="tk" data-id="${x.id}">${esc(x.t)}</button>`).join("");
      bankEl.innerHTML = bank.map(x => `<button class="tk ${line.includes(x) ? "tk--used" : ""}" data-id="${x.id}" ${line.includes(x) ? "disabled" : ""}>${esc(x.t)}</button>`).join("");
      go.disabled = line.length === 0;
    };
    stage.addEventListener("click", e => {
      const b = e.target.closest(".tk"); if (!b || locked) return; EE.sfx.tap(); const id = +b.dataset.id, w = bank.find(x => x.id === id);
      if (line.includes(w)) line.splice(line.indexOf(w), 1); else line.push(w); draw();
    }); draw();
    go.onclick = () => { if (locked || !line.length) return; locked = true; const ok = norm(line.map(x => x.t).join(" ")) === norm(st.sent.en); EE.speak(st.sent.en); result(ok, st, st.sent.en); };
  }

  function show() {
    go.hidden = false; go.disabled = true; go.onclick = null;
    if (P.i >= P.queue.length) return finish();
    const st = P.queue[P.i]; stage.scrollTop = 0; stage.classList.remove("enter"); void stage.offsetWidth; stage.classList.add("enter");
    ({ intro: renderIntro, choice: renderChoice, type: renderType, match: renderMatch, order: renderOrder }[st.type])(st);
  }

  /* ---------- finish ---------- */
  function finish() {
    const acc = Math.round(P.right / Math.max(1, P.right + P.wrong) * 100), perfect = P.wrong === 0, stars = perfect ? 3 : P.wrong <= 2 ? 2 : 1;
    let bonus = cfg.mode === "lesson" ? (perfect ? 20 : 10) : 5, gems = cfg.mode === "lesson" ? (perfect ? 10 : 5) : 2;
    EE.addXp(P.xp + bonus); S.gems += gems; const newDay = EE.touchStreak();
    if (cfg.mode === "lesson") { S.stats.lessons++; if (perfect) S.stats.perfect++; const old = S.done[cfg.lesson.id] || 0; S.done[cfg.lesson.id] = Math.max(old, stars); cfg.lesson.words.forEach(w => S.learned[w.en] = 1); }
    if (cfg.mode === "train" && S.hearts < EE.MAX_HEARTS) { S.hearts++; if (S.hearts >= EE.MAX_HEARTS) S.heartTs = 0; }
    EE.checkBadges && EE.checkBadges(); EE.save(); EE.sfx.win(); EE.confetti();
    const goalDone = S.today.xp >= S.goal;
    root.innerHTML = `<div class="pl__end"><div class="pl__mascot">${EE.mascot(perfect ? "cheer" : "happy", 130)}</div><h2>${cfg.mode === "lesson" ? "จบบทเรียนแล้ว!" : "ฝึกเสร็จแล้ว!"}</h2>
      ${cfg.mode === "lesson" ? `<div class="stars" aria-label="${stars} ดาว">${[1, 2, 3].map(i => `<span class="${i <= stars ? "on" : ""}">★</span>`).join("")}</div>` : ""}
      <div class="res"><div class="res__i"><b>+${P.xp + bonus}</b><span>XP</span></div><div class="res__i"><b>${acc}%</b><span>แม่นยำ</span></div><div class="res__i"><b>+${gems}</b><span>💎 เพชร</span></div>${cfg.mode === "train" ? '<div class="res__i"><b>+1</b><span>❤️ หัวใจ</span></div>' : ""}</div>
      ${newDay ? `<p class="pl__streak">🔥 สตรีค ${S.streak} วัน!</p>` : ""}${goalDone ? '<p class="pl__goal">🎯 ถึงเป้าหมายรายวันแล้ว!</p>' : ""}
      <div class="pl__btns"><button class="btn btn--primary" id="again-go">${cfg.mode === "lesson" ? "ทำต่อ" : "เสร็จ"}</button>${cfg.mode === "lesson" && !perfect ? '<button class="btn btn--ghost" id="again-retry">ลองใหม่เพื่อดาวเพิ่ม</button>' : ""}</div></div>`;
    $("#again-go", root).onclick = () => { close(); cfg.onFinish && cfg.onFinish({ stars }); };
    const r = $("#again-retry", root); if (r) r.onclick = () => { close(); EE.startLesson(cfg.lesson); };
  }

  show();
};

/* ---------- entry points ---------- */
EE.startLesson = function (L) {
  const S = EE.state(); EE.tick();
  if (S.hearts <= 0 && !S.settings.demo) { EE.toast("หัวใจหมดแล้ว — ฝึกเพื่อรับหัวใจ หรือรอ 30 นาที", "warn"); location.hash = "#/train"; return; }
  const u = EE.unitById(L.unit);
  EE.play({ mode: "lesson", lesson: L, color: u.color, steps: planLesson(L), onExit: () => { EE.route(); }, onFinish: () => { EE.route(); } });
};
EE.startTraining = function (list, mode) {
  const S = EE.state();
  EE.play({ mode: mode || "train", color: "#00b894", steps: planTraining(list, 10), onExit: () => EE.route(), onFinish: () => { location.hash = "#/home"; EE.route(); } });
};
})(window.EE = window.EE || {});
