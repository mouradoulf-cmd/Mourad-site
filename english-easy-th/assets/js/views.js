/* English Easy TH — views & router (hash routes): home path, alphabet, training, games, word of the day, tips, shop, profile. */
(function (EE) {
"use strict";
const { $, $$, esc, shuffle, pick } = EE;
const S = EE.state();
const main = () => $("#main");
const mmss = ms => { const m = Math.ceil(ms / 60000); return m + " นาที"; };

/* ---------- badges ---------- */
const BADGES = [
  ["first", "🌱", "บทเรียนแรก", s => s.stats.lessons >= 1], ["five", "📘", "เรียนครบ 5 บท", s => s.stats.lessons >= 5], ["twenty", "🏅", "เรียนครบ 20 บท", s => s.stats.lessons >= 20],
  ["perfect", "💯", "ได้ 3 ดาวเต็ม", s => s.stats.perfect >= 1], ["streak3", "🔥", "สตรีค 3 วัน", s => s.best >= 3], ["streak7", "🔥", "สตรีค 7 วัน", s => s.best >= 7],
  ["xp100", "⭐", "100 XP", s => s.xp >= 100], ["xp500", "🌟", "500 XP", s => s.xp >= 500], ["words50", "🧠", "จำได้ 50 คำ", s => Object.keys(s.learned).length >= 50],
  ["speed", "⚡", "Speed Quiz 15+", s => s.bestSpeed >= 15], ["memory", "🃏", "Memory ใน 20 ตา", s => s.bestMemory > 0 && s.bestMemory <= 20]
];
EE.BADGES = BADGES;
EE.checkBadges = () => BADGES.forEach(b => { if (!S.badges[b[0]] && b[3](S)) { S.badges[b[0]] = EE.dayKey(); EE.toast("ได้รับเหรียญ " + b[1] + " " + b[2], "ok"); } });

/* ---------- top bar ---------- */
function topbar() {
  EE.tick(); const ms = EE.heartsLeftMs();
  $("#st-streak").textContent = S.streak; $("#st-gems").textContent = S.gems; $("#st-hearts").textContent = S.settings.demo ? "∞" : S.hearts;
  $("#st-hearts").title = ms ? "หัวใจดวงถัดไปใน " + mmss(ms) : "หัวใจเต็ม";
  $("#st-xp").textContent = S.xp;
}
EE.on("state", topbar);

/* ---------- onboarding ---------- */
function onboarding() {
  main().innerHTML = `<section class="onb"><div class="onb__m">${EE.mascot("cheer", 150)}</div><h1>สวัสดี! ยินดีต้อนรับสู่ <span>English Easy</span></h1>
    <p class="lead">เรียนภาษาอังกฤษแบบเกม วันละนิด เก่งขึ้นทุกวัน — ฟังเสียง ตอบคำถาม สะสมดาว ได้ทั้งบนมือถือและคอม</p>
    <label class="field">ให้เรียกคุณว่าอะไร?<input id="onb-name" class="inp" maxlength="20" placeholder="ชื่อเล่น (ไม่ใส่ก็ได้)" autocomplete="nickname"></label>
    <fieldset class="goals"><legend>เป้าหมายรายวัน</legend>
      <label class="goal"><input type="radio" name="goal" value="10"><span><b>สบาย ๆ</b>10 XP / วัน (~3 นาที)</span></label>
      <label class="goal"><input type="radio" name="goal" value="20" checked><span><b>ปกติ</b>20 XP / วัน (~6 นาที)</span></label>
      <label class="goal"><input type="radio" name="goal" value="50"><span><b>จริงจัง</b>50 XP / วัน (~15 นาที)</span></label></fieldset>
    <button class="btn btn--primary btn--lg" id="onb-go">เริ่มเรียนเลย</button><p class="fine">ความคืบหน้าถูกเก็บไว้ในเครื่องของคุณ ไม่ต้องสมัครสมาชิก</p></section>`;
  $("#onb-go").onclick = () => { S.name = $("#onb-name").value.trim(); S.goal = +($("input[name=goal]:checked").value); S.onboarded = true; EE.save(); location.hash = "#/home"; EE.route(); };
}

/* ---------- home: learning path ---------- */
function ring(p, label, sub) {
  const R = 34, C = 2 * Math.PI * R, o = C * (1 - Math.min(1, p));
  return `<div class="ring"><svg viewBox="0 0 80 80" width="84" height="84" aria-hidden="true"><circle cx="40" cy="40" r="${R}" fill="none" stroke="#e9e7ff" stroke-width="9"/><circle cx="40" cy="40" r="${R}" fill="none" stroke="#6c5ce7" stroke-width="9" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${o}" transform="rotate(-90 40 40)"/></svg><div class="ring__t"><b>${label}</b><span>${sub}</span></div></div>`;
}
function home() {
  const cur = EE.current(), goalP = S.today.xp / S.goal, doneN = EE.LESSONS.filter(l => S.done[l.id]).length;
  const hello = S.name ? "สวัสดี " + esc(S.name) + " 👋" : "สวัสดี 👋";
  let h = `<section class="hero-card"><div class="hero-card__l"><p class="eyebrow">${hello}</p><h1>${cur ? "ไปต่อกันเลย!" : "คุณเรียนครบทุกบทแล้ว 🎉"}</h1><p>${cur ? "บทถัดไป: <b>" + esc(EE.unitById(cur.unit).title) + " · " + esc(cur.title) + "</b>" : "ทบทวนคำที่ผิดหรือเล่นเกมเพื่อฝึกต่อได้เลย"}</p>
    ${cur ? '<button class="btn btn--primary btn--lg" id="go-cur">เรียนต่อ</button>' : '<a class="btn btn--primary btn--lg" href="#/train">ฝึกทบทวน</a>'}</div>
    <div class="hero-card__r">${ring(goalP, S.today.xp + "/" + S.goal, "XP วันนี้")}<div class="hero-card__m">${EE.mascot(goalP >= 1 ? "cheer" : "happy", 86)}</div></div></section>
    <div class="mini-stats"><div><b>🔥 ${S.streak}</b><span>วันต่อเนื่อง</span></div><div><b>📘 ${doneN}/${EE.LESSONS.length}</b><span>บทที่เรียนแล้ว</span></div><div><b>🧠 ${Object.keys(S.learned).length}</b><span>คำที่รู้</span></div></div>
    <div class="path">`;
  EE.UNITS.forEach((u, ui) => {
    const lessons = u.lessons, unitDone = lessons.every(l => S.done[l.id]);
    h += `<div class="unit" style="--uc:${u.color};--ud:${u.dark}"><div class="unit__banner"><div><span class="unit__n">หน่วยที่ ${ui + 1} · ${esc(u.sub)}</span><h2>${u.emoji} ${esc(u.title)}</h2><p>${esc(u.intro)}</p></div>${unitDone ? '<span class="unit__ok">✓ ผ่านแล้ว</span>' : ""}</div><div class="unit__nodes">`;
    lessons.forEach((l, li) => {
      const done = S.done[l.id], unl = EE.unlocked(l), isCur = cur === l, off = [0, 46, 70, 46, 0, -46, -70, -46][(li + ui * 3) % 8];
      const st = done ? "done" : isCur ? "cur" : unl ? "open" : "lock";
      h += `<div class="node-wrap" style="--off:${off}px"><button class="node node--${st}" data-lesson="${l.id}" aria-label="${esc(l.title)}${done ? " — " + done + " ดาว" : unl ? "" : " (ล็อก)"}">${st === "lock" ? "🔒" : st === "done" ? "★" : u.emoji}</button>${isCur ? '<span class="node__start">เริ่ม!</span>' : ""}<span class="node__t">${esc(l.title)}</span>${done ? `<span class="node__s">${"★".repeat(done)}${"☆".repeat(3 - done)}</span>` : ""}</div>`;
    });
    h += "</div></div>";
  });
  h += "</div>";
  main().innerHTML = h;
  const gc = $("#go-cur"); if (gc) gc.onclick = () => EE.startLesson(cur);
  $$(".node").forEach(b => b.addEventListener("click", () => {
    const l = EE.lessonById(b.dataset.lesson);
    if (!EE.unlocked(l)) { EE.toast("เรียนบทก่อนหน้าให้จบก่อนนะ 🔒", "warn"); EE.sfx.no(); return; }
    sheet(l);
  }));
  const curNode = $(".node--cur"); if (curNode && !EE.reduce) curNode.scrollIntoView({ block: "center" });
}
function sheet(l) {
  const u = EE.unitById(l.unit), el = $("#sheet"); const n = (l.words || []).length, m = (l.sentences || []).length, done = S.done[l.id];
  el.innerHTML = `<div class="sheet__card" style="--uc:${u.color}" role="dialog" aria-modal="true" aria-label="${esc(l.title)}"><button class="sheet__x" aria-label="ปิด">✕</button><div class="sheet__e">${u.emoji}</div><h3>${esc(u.title)}</h3><h2>${esc(l.title)}</h2>
    <p>${n ? n + " คำ" : ""}${n && m ? " · " : ""}${m ? m + " ประโยค" : ""}${done ? " · ได้ " + "★".repeat(done) : ""}</p><button class="btn btn--primary btn--lg" id="sheet-go">${done ? "ฝึกอีกครั้ง" : "เริ่มบทเรียน"}</button>${S.hearts <= 0 && !S.settings.demo ? '<p class="fine">หัวใจหมด — ไปฝึกเพื่อรับหัวใจก่อน</p>' : ""}</div>`;
  el.hidden = false; const close = () => { el.hidden = true; el.innerHTML = ""; };
  $(".sheet__x", el).onclick = close; el.onclick = e => { if (e.target === el) close(); };
  $("#sheet-go", el).onclick = () => { close(); EE.startLesson(l); }; $("#sheet-go", el).focus();
}

/* ---------- alphabet ---------- */
function alphabet() {
  main().innerHTML = `<section class="page"><h1>🔤 ตัวอักษร A–Z</h1><p class="lead">แตะที่ตัวอักษรเพื่อฟังเสียง และดูคำตัวอย่าง</p><div class="alpha">${EE.ALPHABET.map(l => `<button class="alpha__c" data-l="${l.en}"><b>${l.en}<small>${l.en.toLowerCase()}</small></b><span>${l.th}</span><i>${l.emoji}</i></button>`).join("")}</div>
    <div class="alpha__d" id="alpha-d" aria-live="polite">เลือกตัวอักษรเพื่อดูรายละเอียด</div></section>`;
  $$(".alpha__c").forEach(b => b.addEventListener("click", () => {
    const l = EE.ALPHABET.find(x => x.en === b.dataset.l); $$(".alpha__c").forEach(x => x.classList.remove("is-on")); b.classList.add("is-on"); EE.sfx.tap();
    $("#alpha-d").innerHTML = `<div class="alpha__big">${l.en}${l.en.toLowerCase()}</div><div><b>${l.th}</b><p>${l.emoji} <b>${l.ex}</b> — ${l.exTh}</p><button class="btn btn--ghost" id="a-say">🔊 ฟังตัวอักษร</button> <button class="btn btn--ghost" id="a-word">🔊 ฟังคำ ${l.ex}</button></div>`;
    $("#a-say").onclick = () => EE.speak(l.say); $("#a-word").onclick = () => EE.speak(l.ex); EE.speak(l.say);
  }));
}

/* ---------- training ---------- */
function train() {
  const mis = Object.keys(S.mistakes).map(k => EE.ALL_WORDS.find(w => w.en === k)).filter(Boolean);
  const learned = EE.ALL_WORDS.filter(w => S.learned[w.en] && !w.letter);
  const pool = learned.length >= 4 ? learned : EE.ALL_WORDS.filter(w => !w.letter);
  main().innerHTML = `<section class="page"><h1>🎯 ฝึกฝน</h1><p class="lead">ฝึก 10 ข้อ ไม่เสียหัวใจ — เสร็จแล้วรับหัวใจ +1 ❤️</p>
    <div class="cards2"><article class="card big-card"><div class="big-card__e">❗</div><h3>ทบทวนคำที่เคยตอบผิด</h3><p>${mis.length ? "มี <b>" + mis.length + "</b> คำที่ควรทบทวน" : "ยังไม่มีคำที่ตอบผิด เยี่ยมมาก!"}</p><button class="btn btn--primary" id="t-mis" ${mis.length ? "" : "disabled"}>ทบทวนเลย</button></article>
    <article class="card big-card"><div class="big-card__e">🔁</div><h3>ฝึกคำศัพท์ทั่วไป</h3><p>${learned.length >= 4 ? "จากคำที่คุณเรียนแล้ว (" + learned.length + " คำ)" : "สุ่มจากคำศัพท์ทั้งหมด"}</p><button class="btn btn--primary" id="t-gen">เริ่มฝึก</button></article></div>
    <p class="fine">❤️ ตอนนี้มี ${S.settings.demo ? "∞" : S.hearts}/${EE.MAX_HEARTS}</p></section>`;
  $("#t-mis").onclick = () => EE.startTraining(mis.length >= 4 ? mis : mis.concat(pick(pool, 6)), "train");
  $("#t-gen").onclick = () => EE.startTraining(pool, "train");
}

/* ---------- games ---------- */
function games() {
  main().innerHTML = `<section class="page"><h1>🎮 มินิเกม</h1><p class="lead">เล่นสนุก ได้คำศัพท์ และได้เพชร 💎</p><div class="cards2">
    <a class="card big-card" href="#/game/memory"><div class="big-card__e">🃏</div><h3>Memory Match</h3><p>จับคู่คำภาษาอังกฤษกับความหมาย<br><small>สถิติดีที่สุด: ${S.bestMemory ? S.bestMemory + " ตา" : "—"}</small></p><span class="btn btn--primary">เล่นเลย</span></a>
    <a class="card big-card" href="#/game/speed"><div class="big-card__e">⚡</div><h3>Speed Quiz</h3><p>ตอบให้ได้มากที่สุดใน 60 วินาที<br><small>คะแนนสูงสุด: ${S.bestSpeed || "—"}</small></p><span class="btn btn--primary">เล่นเลย</span></a></div></section>`;
}
function gameWords() { const l = EE.ALL_WORDS.filter(w => S.learned[w.en] && !w.letter); return l.length >= 8 ? l : EE.ALL_WORDS.filter(w => !w.letter); }

function memory() {
  const ws = pick(gameWords(), 8), cards = shuffle(ws.map(w => ({ w, side: "en", k: w.en + "e" })).concat(ws.map(w => ({ w, side: "th", k: w.en + "t" }))));
  main().innerHTML = `<section class="page"><h1>🃏 Memory Match</h1><div class="game-bar"><span>ตา: <b id="m-moves">0</b></span><span>คู่: <b id="m-pairs">0</b>/8</span><a class="btn btn--ghost btn--sm" href="#/games">ออก</a></div><div class="mem" id="mem">${cards.map((c, i) => `<button class="mem__c" data-i="${i}" aria-label="การ์ด ${i + 1}"><span class="mem__f">❓</span><span class="mem__b ${c.side}">${esc(c.side === "en" ? c.w.en : c.w.th)}</span></button>`).join("")}</div></section>`;
  let open = [], moves = 0, pairs = 0, lock = false;
  $$(".mem__c").forEach(b => b.addEventListener("click", () => {
    if (lock || b.classList.contains("is-open") || b.classList.contains("is-done")) return; EE.sfx.tap(); b.classList.add("is-open"); open.push(b); if (cards[+b.dataset.i].side === "en") EE.speak(cards[+b.dataset.i].w.en);
    if (open.length === 2) {
      moves++; $("#m-moves").textContent = moves; const [a, c] = open.map(x => cards[+x.dataset.i]);
      if (a.w === c.w) { pairs++; $("#m-pairs").textContent = pairs; EE.sfx.ok(); open.forEach(x => x.classList.add("is-done")); open = [];
        if (pairs === 8) { const gems = Math.max(2, 10 - Math.floor(moves / 4)); S.gems += gems; EE.addXp(15); if (!S.bestMemory || moves < S.bestMemory) S.bestMemory = moves; EE.touchStreak(); EE.checkBadges(); EE.save(); EE.sfx.win(); EE.confetti(); setTimeout(() => { $("#mem").insertAdjacentHTML("afterend", `<div class="game-end"><h2>เก่งมาก! 🎉</h2><p>จบใน ${moves} ตา · +${gems} 💎 · +15 XP</p><a class="btn btn--primary" href="#/game/memory" id="m-again">เล่นอีกครั้ง</a></div>`); $("#m-again").onclick = () => setTimeout(EE.route, 0); }, 400); } }
      else { lock = true; EE.sfx.no(); setTimeout(() => { open.forEach(x => x.classList.remove("is-open")); open = []; lock = false; }, 800); }
    }
  }));
}

function speed() {
  const pool = gameWords(); let score = 0, left = 60, combo = 0, cur, timer;
  main().innerHTML = `<section class="page"><h1>⚡ Speed Quiz</h1><div class="game-bar"><span>⏱ <b id="s-t">60</b></span><span>คะแนน: <b id="s-s">0</b></span><span id="s-c"></span><a class="btn btn--ghost btn--sm" href="#/games">ออก</a></div><div class="speed" id="speed"></div></section>`;
  const q = () => {
    cur = pick(pool, 1)[0]; const o = shuffle(pool.filter(w => w.th !== cur.th)).slice(0, 3).concat([cur]);
    $("#speed").innerHTML = `<div class="st__big"><span class="st__emoji">${cur.emoji || ""}</span><span class="st__word">${esc(cur.en)}</span></div><div class="opts">${shuffle(o).map((w, i) => `<button class="opt" data-ok="${w === cur ? 1 : 0}"><kbd>${i + 1}</kbd><span>${esc(w.th)}</span></button>`).join("")}</div>`;
    $$(".opt", $("#speed")).forEach(b => b.addEventListener("click", () => {
      if (b.dataset.ok === "1") { combo++; score += 1 + Math.floor(combo / 5); EE.sfx.ok(); } else { combo = 0; left = Math.max(0, left - 3); EE.sfx.no(); b.classList.add("is-bad"); }
      $("#s-s").textContent = score; $("#s-c").textContent = combo >= 3 ? "🔥 x" + combo : ""; q();
    }));
  };
  const end = () => { clearInterval(timer); const gems = Math.floor(score / 3); S.gems += gems; EE.addXp(Math.min(30, score)); if (score > S.bestSpeed) S.bestSpeed = score; EE.touchStreak(); EE.checkBadges(); EE.save(); EE.sfx.win(); if (score >= 10) EE.confetti();
    $("#speed").innerHTML = `<div class="game-end"><h2>หมดเวลา! ⏰</h2><p>คะแนน <b>${score}</b> · ดีที่สุด ${S.bestSpeed}</p><p>+${gems} 💎 · +${Math.min(30, score)} XP</p><a class="btn btn--primary" href="#/game/speed" id="s-again">เล่นอีกครั้ง</a></div>`; $("#s-again").onclick = () => setTimeout(EE.route, 0); };
  q(); timer = setInterval(() => { left--; $("#s-t").textContent = Math.max(0, left); if (left <= 0) end(); }, 1000);
  EE.stopGame = () => clearInterval(timer);
}

/* ---------- word of the day + vocabulary ---------- */
function word() {
  const i = Math.abs([...EE.dayKey()].reduce((a, c) => a * 31 + c.charCodeAt(0), 7)) % EE.WOTD.length, w = EE.WOTD[i], fav = S.favs.includes(w.en);
  const learned = EE.ALL_WORDS.filter(x => S.learned[x.en] && !x.letter);
  main().innerHTML = `<section class="page"><h1>📅 คำศัพท์ประจำวัน</h1><article class="wotd"><p class="eyebrow">${new Date().toLocaleDateString("th-TH", { weekday: "long", day: "numeric", month: "long" })}</p><h2>${esc(w.en)}</h2><p class="wotd__th">${esc(w.th)}</p>
    <div class="wotd__btns"><button class="btn btn--primary" id="w-say">🔊 ฟังเสียง</button><button class="btn btn--ghost" id="w-slow">🐢 ช้า ๆ</button><button class="btn btn--ghost" id="w-fav">${fav ? "★ บันทึกแล้ว" : "☆ บันทึกคำ"}</button></div>
    <div class="wotd__ex"><p lang="en">“${esc(w.ex)}”</p><p>${esc(w.exTh)}</p><button class="btn btn--ghost btn--sm" id="w-ex">🔊 ฟังประโยค</button></div></article>
    <h2 class="sec">คำที่คุณเรียนแล้ว (${learned.length})</h2>${learned.length ? `<div class="vocab">${learned.map(x => `<button class="vocab__i" data-say="${esc(x.en)}"><b>${esc(x.en)}</b><span>${esc(x.th)}</span><i>🔊</i></button>`).join("")}</div>` : '<p class="fine">เรียนบทแรกให้จบ แล้วคำศัพท์จะมารวมอยู่ที่นี่</p>'}
    ${S.favs.length ? `<h2 class="sec">คำที่บันทึกไว้</h2><div class="vocab">${S.favs.map(f => `<button class="vocab__i" data-say="${esc(f)}"><b>${esc(f)}</b><span>${esc((EE.WOTD.find(x => x.en === f) || {}).th || "")}</span><i>🔊</i></button>`).join("")}</div>` : ""}</section>`;
  $("#w-say").onclick = () => EE.speak(w.en); $("#w-slow").onclick = () => EE.speak(w.en, { slow: true }); $("#w-ex").onclick = () => EE.speak(w.ex);
  $("#w-fav").onclick = () => { const k = S.favs.indexOf(w.en); if (k >= 0) S.favs.splice(k, 1); else S.favs.push(w.en); EE.save(); word(); };
  $$(".vocab__i").forEach(b => b.addEventListener("click", () => EE.speak(b.dataset.say)));
}

/* ---------- tips ---------- */
function tips() {
  main().innerHTML = `<section class="page"><h1>💡 เคล็ดลับไวยากรณ์</h1><p class="lead">สรุปสั้น ๆ เป็นภาษาไทย พร้อมตัวอย่างที่ฟังเสียงได้</p>${EE.TIPS.map((t, i) => `<details class="tip" ${i === 0 ? "open" : ""}><summary>${i + 1}. ${esc(t.t)}</summary><div class="tip__b"><p>${t.body}</p>${t.ex.map(e => `<div class="tip__ex"><button class="spk" data-say="${esc(e[0])}" aria-label="ฟัง">🔊</button><span lang="en">${esc(e[0])}</span><em>${esc(e[1])}</em></div>`).join("")}</div></details>`).join("")}</section>`;
  $$(".spk").forEach(b => b.addEventListener("click", () => EE.speak(b.dataset.say)));
}

/* ---------- shop ---------- */
function shop() {
  main().innerHTML = `<section class="page"><h1>🛍️ ร้านค้า</h1><p class="lead">ใช้เพชร 💎 ที่ได้จากการเรียนและเล่นเกม — ไม่ต้องจ่ายเงินจริง</p><div class="gems-box">💎 <b>${S.gems}</b> เพชร</div><div class="cards2">
    <article class="card big-card"><div class="big-card__e">❤️</div><h3>เติมหัวใจเต็ม</h3><p>หัวใจตอนนี้ ${S.settings.demo ? "∞" : S.hearts}/${EE.MAX_HEARTS}</p><button class="btn btn--gold" id="b-heart" ${S.gems < 30 || S.hearts >= EE.MAX_HEARTS ? "disabled" : ""}>💎 30</button></article>
    <article class="card big-card"><div class="big-card__e">🧊</div><h3>ตัวป้องกันสตรีค</h3><p>ข้ามไปได้ 1 วันโดยสตรีคไม่ขาด (มี ${S.freeze})</p><button class="btn btn--gold" id="b-freeze" ${S.gems < 50 || S.freeze >= 2 ? "disabled" : ""}>💎 50</button></article></div>
    <article class="card premium"><h3>⭐ English Easy Plus <span class="tag">เร็ว ๆ นี้</span></h3><p>แผนที่กำลังพัฒนา: หัวใจไม่จำกัด บทเรียนเพิ่ม และบทฝึกพูดแบบมีผู้ช่วยตอบ — ตอนนี้ทุกอย่างในเว็บนี้ใช้ได้ฟรี</p></article></section>`;
  const buy = (c, f) => { if (S.gems < c) return; S.gems -= c; f(); EE.sfx.coin(); EE.save(); shop(); };
  $("#b-heart").onclick = () => buy(30, () => { S.hearts = EE.MAX_HEARTS; S.heartTs = 0; EE.toast("หัวใจเต็มแล้ว ❤️", "ok"); });
  $("#b-freeze").onclick = () => buy(50, () => { S.freeze++; EE.toast("ได้ตัวป้องกันสตรีค 🧊", "ok"); });
}

/* ---------- profile ---------- */
function profile() {
  const lv = EE.level(), xpIn = S.xp % 100, acc = Math.round(S.stats.ok / Math.max(1, S.stats.ok + S.stats.ko) * 100);
  main().innerHTML = `<section class="page"><div class="prof"><div class="prof__m">${EE.mascot("happy", 100)}</div><div><h1>${esc(S.name || "ผู้เรียน")}</h1><p>ระดับ ${lv} · ${S.xp} XP</p><div class="xpbar" aria-label="ความคืบหน้าระดับ"><i style="width:${xpIn}%"></i></div><button class="linkbtn" id="p-name">เปลี่ยนชื่อ</button></div></div>
    <div class="stats-grid"><div><b>🔥 ${S.streak}</b><span>สตรีค (สูงสุด ${S.best})</span></div><div><b>📘 ${S.stats.lessons}</b><span>บทที่จบ</span></div><div><b>🎯 ${acc}%</b><span>ความแม่นยำ</span></div><div><b>💎 ${S.gems}</b><span>เพชร</span></div></div>
    <h2 class="sec">เหรียญรางวัล</h2><div class="badges">${BADGES.map(b => `<div class="badge ${S.badges[b[0]] ? "on" : ""}" title="${esc(b[2])}"><span>${b[1]}</span><b>${esc(b[2])}</b></div>`).join("")}</div>
    <h2 class="sec">ตั้งค่า</h2><div class="settings"><label class="sw"><input type="checkbox" id="o-sound" ${S.settings.sound ? "checked" : ""}><span>เสียงเอฟเฟกต์</span></label><label class="sw"><input type="checkbox" id="o-slow" ${S.settings.slow ? "checked" : ""}><span>อ่านออกเสียงช้าลง</span></label>
      <label class="sw"><input type="checkbox" id="o-demo" ${S.settings.demo ? "checked" : ""}><span>โหมดเดโม: ปลดล็อกทุกบท & หัวใจไม่จำกัด</span></label>
      <label class="field">เป้าหมายรายวัน<select id="o-goal" class="inp">${[10, 20, 30, 50].map(g => `<option value="${g}" ${S.goal === g ? "selected" : ""}>${g} XP</option>`).join("")}</select></label>
      <button class="btn btn--ghost" id="o-test">🔊 ทดสอบเสียงอ่านภาษาอังกฤษ</button><button class="btn btn--bad btn--sm" id="o-reset">ล้างความคืบหน้าทั้งหมด</button></div>
    <p class="fine">ความคืบหน้าเก็บไว้ในเบราว์เซอร์ของคุณ (ไม่มีการสมัครสมาชิก) · เสียงอ่านใช้เสียงในเครื่อง คุณภาพขึ้นกับอุปกรณ์</p></section>`;
  $("#p-name").onclick = () => { const n = prompt("ชื่อของคุณ", S.name || ""); if (n !== null) { S.name = n.trim().slice(0, 20); EE.save(); profile(); } };
  $("#o-sound").onchange = e => { S.settings.sound = e.target.checked; EE.save(); }; $("#o-slow").onchange = e => { S.settings.slow = e.target.checked; EE.save(); };
  $("#o-demo").onchange = e => { S.settings.demo = e.target.checked; EE.save(); };
  $("#o-goal").onchange = e => { S.goal = +e.target.value; EE.save(); };
  $("#o-test").onclick = () => EE.speak("Hello! Welcome to English Easy.");
  $("#o-reset").onclick = () => { if (confirm("ล้างความคืบหน้าทั้งหมด? การกระทำนี้ย้อนกลับไม่ได้")) { localStorage.removeItem("ee1"); location.hash = "#/home"; location.reload(); } };
}

/* ---------- router ---------- */
const ROUTES = { home, alphabet, train, games, word, tips, shop, profile };
EE.route = function () {
  if (EE.stopGame) { EE.stopGame(); EE.stopGame = null; }
  const h = location.hash.replace(/^#\/?/, "") || "home", [a, b] = h.split("/");
  EE.tick(); topbar();
  if (!S.onboarded) { onboarding(); $("#app").classList.add("is-onb"); return; }
  $("#app").classList.remove("is-onb");
  const view = a === "game" ? (b === "memory" ? memory : b === "speed" ? speed : games) : (ROUTES[a] || home);
  view(); window.scrollTo(0, 0);
  $$(".nav a").forEach(l => { const on = l.getAttribute("href") === "#/" + (a === "game" ? "games" : a); l.classList.toggle("is-on", on); if (on) l.setAttribute("aria-current", "page"); else l.removeAttribute("aria-current"); });
  document.title = ({ home: "เรียนอังกฤษ", alphabet: "ตัวอักษร A–Z", train: "ฝึกฝน", games: "มินิเกม", word: "คำศัพท์ประจำวัน", tips: "เคล็ดลับไวยากรณ์", shop: "ร้านค้า", profile: "โปรไฟล์" }[a === "game" ? "games" : a] || "เรียนอังกฤษ") + " · English Easy";
};
addEventListener("hashchange", () => { if (!$("#player") || $("#player").hidden) EE.route(); });
document.addEventListener("DOMContentLoaded", () => { EE.route(); setInterval(topbar, 30000); });
})(window.EE = window.EE || {});
