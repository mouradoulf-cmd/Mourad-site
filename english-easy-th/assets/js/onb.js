/* English Easy TH — onboarding: splash → welcome → chat-style profile questions (name, gender, age in two pop-up panels,
   goal, interests, level, placement mini-test, daily goal) → analysis → projected path → offer. */
(function (EE) {
"use strict";
const { $, esc } = EE, S = EE.state(), $$ = EE.$$;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const fast = EE.reduce;
/* polite particle from gender: ค่ะ / ครับ */
EE.pol = () => S.gender === "m" ? "ครับ" : S.gender === "f" ? "ค่ะ" : "ค่ะ/ครับ";
EE.polQ = () => S.gender === "m" ? "ครับ" : S.gender === "f" ? "คะ" : "คะ/ครับ";

EE.runOnb = function (root, done) {
  const total = 11; let token = 0, cur = "splash";
  const my = () => ++token;
  function shell(inner, prog) {
    root.innerHTML = `<section class="ob">${prog == null ? "" : `<div class="ob__bar"><i style="width:${Math.round(prog * 100)}%"></i></div>`}${inner}</section>`;
  }
  async function type(el, text, t) {
    el.textContent = ""; el.classList.add("typing"); const sy = el.closest(".ob__say"); sy && sy.classList.add("talk");
    if (fast) { el.textContent = text; el.classList.remove("typing"); sy && sy.classList.remove("talk"); return; }
    for (let i = 1; i <= text.length; i++) { if (t !== token) return; el.textContent = text.slice(0, i); if (i % 2 === 0) EE.sfx.key(); await sleep(text[i - 1] === " " ? 14 : 24); }
    el.classList.remove("typing"); sy && sy.classList.remove("talk");
  }
  const say = (txt) => `<div class="ob__say"><span class="ob__av">${EE.mascot("happy", 44)}</span><div class="ob__bub" data-t="${esc(txt)}"></div></div>`;
  async function ask(txt, t) { const b = $(".ob__bub"); if (b) await type(b, b.dataset.t, t); if (t === token) $(".ob__body") && $(".ob__body").classList.add("show"); }
  function question(prog, txt, bodyHtml, ready) {
    const t = my();
    shell(`${say(txt)}<div class="ob__body">${bodyHtml}</div><button class="btn btn--primary btn--lg ob__next" disabled>ต่อไป →</button>`, prog);
    const next = $(".ob__next"); ready(next, t); ask(txt, t); return t;
  }
  const nm = () => S.name || "เพื่อน";
  const pickFx = b => { EE.sfx.pick(); const r = b.getBoundingClientRect(); EE.burst(r.left + r.width / 2, r.top + r.height / 2); };
  function choices(prog, txt, items, grid, after) {
    question(prog, txt, `<div class="ob__opts ${grid ? "grid" : ""}">${items.map((it, i) => `<button class="ob__opt" data-v="${esc(it[0])}" style="--i:${i}"><span>${it[1]}</span><b>${it[2]}</b><em>✓</em></button>`).join("")}</div>`, (next) => {
      let val = null;
      $$(".ob__opt").forEach(b => b.onclick = () => { $$(".ob__opt").forEach(x => x.classList.remove("on")); b.classList.add("on"); val = b.dataset.v; next.disabled = false; pickFx(b); });
      next.onclick = () => { if (val == null) return; EE.sfx.ok(); after(val); };
    });
  }

  const SC = {
    splash() {
      const t = my(); root.innerHTML = `<section class="ob ob--splash"><div class="ob__hud"><span>SYS//BOOT</span><span>v1.0</span></div><div class="ob__logo"><span class="ob__ring"></span><span class="ob__ring r2"></span><span class="ob__corner c1"></span><span class="ob__corner c2"></span><span class="ob__corner c3"></span><span class="ob__corner c4"></span><i class="ob__orbit o1"></i><i class="ob__orbit o2"></i><span class="ob__mark">${EE.logo(120)}</span></div><h1 class="ob__title glitch" data-t="ENGLISH.EASY"><span>ENGLISH</span><b>.EASY</b></h1><div class="ob__scan"><i id="ob-ld"></i></div><p class="ob__load"><span>อังกฤษง่าย ๆ</span> / LOADING <b id="ob-pc">0</b>%</p><div class="ob__sweep"></div></section>`;
      EE.sfx.boot(); const t0 = performance.now(), D = fast ? 200 : 2600, ld = $("#ob-ld"), pc = $("#ob-pc");
      (function f() { if (t !== token) return; const k = Math.min(1, (performance.now() - t0) / D), e = 1 - Math.pow(1 - k, 2.2); ld.style.width = (e * 100) + "%"; pc.textContent = Math.round(e * 100); if (k < 1) requestAnimationFrame(f); else { root.firstChild.classList.add("ob--flash"); setTimeout(() => { if (t === token) go("welcome"); }, fast ? 0 : 450); } })();
    },
    welcome() {
      my(); shell(`<div class="ob__center"><div class="ob__logo ob__logo--s"><span class="ob__mark">${EE.logo(84)}</span></div><h1>ยินดีต้อนรับสู่<br><span>English Easy</span>!</h1><p class="lead">เรียนอังกฤษแบบเล่นเกม แบบเป็นขั้นเป็นตอน<br>ตอบไม่กี่คำถาม เราจะปรับเส้นทางให้เหมาะกับคุณ 💜</p><div class="ob__trust"><span>🎓 คอร์สเต็ม A1→A2</span><span>🎙️ ฝึกพูด</span><span>🧠 ทวนอัจฉริยะ</span></div><button class="btn btn--primary btn--lg" id="ob-go">เริ่มเลย 🚀</button><p class="fine">ใช้ฟรีได้ ไม่ต้องสมัครสมาชิก ข้อมูลเก็บในเครื่องของคุณ</p></div>`);
      $("#ob-go").onclick = () => { EE.sfx.win(); go("name"); };
    },
    name() {
      question(1 / total, "สวัสดี! ฉันชื่อ “อีซี่” จะเป็นโค้ชส่วนตัวของคุณ — คุณชื่ออะไร? 😊", `<input class="ob__inp" id="ob-name" maxlength="20" placeholder="ชื่อเล่นของคุณ…" autocomplete="nickname" enterkeyhint="done">`, (next, t) => {
        const i = $("#ob-name"); i.value = S.name || ""; next.disabled = !i.value.trim(); i.oninput = () => { next.disabled = !i.value.trim(); }; i.onkeydown = e => { if (e.key === "Enter" && i.value.trim()) next.click(); };
        next.onclick = () => { S.name = i.value.trim(); EE.sfx.ok(); go("gender"); };
        setTimeout(() => { if (t === token && !matchMedia("(pointer:coarse)").matches) i.focus(); }, 1300);
      });
    },
    gender() {
      const ic = {
        m: '<svg viewBox="0 0 64 64" class="gi"><circle cx="26" cy="38" r="15" pathLength="1"/><path d="M37 27L54 10M42 10h12v12" pathLength="1"/></svg>',
        f: '<svg viewBox="0 0 64 64" class="gi"><circle cx="32" cy="24" r="15" pathLength="1"/><path d="M32 39v20M22 50h20" pathLength="1"/></svg>',
        x: '<svg viewBox="0 0 64 64" class="gi"><circle cx="32" cy="32" r="15" pathLength="1"/><path d="M32 22v20M24 27l16 10M40 27L24 37" pathLength="1"/></svg>' };
      question(2 / total, `ยินดีที่ได้รู้จัก ${nm()}! คุณเป็นเพศอะไร? (เพื่อให้ฉันพูดกับคุณได้ถูกต้อง)`, `<div class="ob__gen"><button class="gcard gcard--m" data-v="m"><span class="gcard__i">${ic.m}</span><b>ผู้ชาย</b><em>Male</em></button><button class="gcard gcard--f" data-v="f"><span class="gcard__i">${ic.f}</span><b>ผู้หญิง</b><em>Female</em></button></div><button class="ob__alt" data-v="x">${ic.x}<span>ไม่ระบุ / อื่น ๆ</span></button>`, (next) => {
        let val = null; const all = $$(".gcard,.ob__alt");
        all.forEach(b => b.onclick = () => { all.forEach(x => { x.classList.toggle("on", x === b); x.classList.toggle("dim", x !== b); }); val = b.dataset.v; next.disabled = false; pickFx(b); });
        next.onclick = () => { if (!val) return; S.gender = val; EE.sfx.ok(); go("age"); };
      });
    },
    age() {
      question(3 / total, `${nm()} อายุเท่าไหร่${EE.polQ()}? เลือกกลุ่มกว้าง ๆ ก่อนได้เลย`, `<div class="ob__age"><button class="acard" data-g="u18"><span>🎒</span><b>ต่ำกว่า 18 ปี</b><em>Under 18</em></button><button class="acard" data-g="o18"><span>💼</span><b>18 ปีขึ้นไป</b><em>18 and over</em></button></div><p class="fine ob__agehint">แตะเพื่อเลือกช่วงอายุที่ละเอียดขึ้น</p>`, (next) => {
        const set = (a, g) => { S.age = a; S.minor = g === "u18"; $$(".acard").forEach(x => x.classList.toggle("on", x.dataset.g === g)); $(".ob__agehint").textContent = "ช่วงอายุ: " + AGE[a]; next.disabled = false; };
        const AGE = { "u10": "ต่ำกว่า 10 ปี", "10": "10–12 ปี", "13": "13–15 ปี", "16": "16–17 ปี", "18": "18–24 ปี", "25": "25–34 ปี", "35": "35–44 ปี", "45": "45–54 ปี", "55": "55 ปีขึ้นไป" };
        $$(".acard").forEach(b => b.onclick = () => {
          pickFx(b); const g = b.dataset.g, list = g === "u18" ? ["u10", "10", "13", "16"] : ["18", "25", "35", "45", "55"];
          const dr = document.createElement("div"); dr.className = "drawer"; dr.innerHTML = `<div class="drawer__bg"></div><div class="drawer__card" role="dialog" aria-label="เลือกช่วงอายุ"><button class="drawer__x" aria-label="ปิด">✕</button><div class="drawer__grab"></div><h3>${g === "u18" ? "🎒 ต่ำกว่า 18 ปี" : "💼 18 ปีขึ้นไป"}</h3><p class="fine">เลือกช่วงอายุของคุณ</p><div class="drawer__opts">${list.map((a, i) => `<button class="dopt" data-a="${a}" style="--i:${i}"><b>${AGE[a]}</b><i>→</i></button>`).join("")}</div></div>`;
          root.firstChild.appendChild(dr); EE.sfx.whoosh(); requestAnimationFrame(() => dr.classList.add("open"));
          const close = () => { dr.classList.remove("open"); setTimeout(() => dr.remove(), 350); };
          $(".drawer__x", dr).onclick = close; $(".drawer__bg", dr).onclick = close;
          $$(".dopt", dr).forEach(o => o.onclick = () => { pickFx(o); set(o.dataset.a, g); close(); });
        });
        next.onclick = () => { EE.sfx.ok(); go("why"); };
        if (S.age) { const g = ["u10", "10", "13", "16"].includes(S.age) ? "u18" : "o18"; setTimeout(() => set(S.age, g), 50); }
      });
    },
    why() { choices(4 / total, `เยี่ยมเลย ${nm()}! ทำไมถึงอยากเรียนภาษาอังกฤษ${EE.polQ()}?`, [["travel", "✈️", "เที่ยวต่างประเทศ"], ["work", "💼", "ใช้ในการทำงาน / หางานที่ดีขึ้น"], ["study", "🎓", "เรียน / สอบ / ไปเรียนต่อ"], ["family", "👨‍👩‍👧", "คุยกับครอบครัว/แฟน/เพื่อนต่างชาติ"], ["fun", "🎬", "ดูหนัง ฟังเพลง เล่นเกม"]], false, v => { S.why = v; go("interests"); }); },
    interests() {
      const items = [["food", "🍜", "อาหาร"], ["travel", "🧳", "ท่องเที่ยว"], ["biz", "📈", "ธุรกิจ"], ["tech", "💻", "เทคโนโลยี"], ["music", "🎵", "ดนตรี / หนัง"], ["sport", "⚽", "กีฬา"], ["nature", "🌿", "ธรรมชาติ"], ["fashion", "👗", "แฟชั่น / ความงาม"]];
      question(5 / total, "เลือกเรื่องที่คุณสนใจได้สูงสุด 3 อย่าง — ฉันจะเลือกคำศัพท์ให้ตรงใจ ✨", `<div class="ob__chips">${items.map((it, i) => `<button class="chip" data-v="${it[0]}" style="--i:${i}"><span>${it[1]}</span>${it[2]}</button>`).join("")}</div><p class="fine ob__cnt">เลือกแล้ว 0/3</p>`, (next) => {
        const sel = new Set(S.interests || []);
        const paint = () => { $$(".chip").forEach(c => c.classList.toggle("on", sel.has(c.dataset.v))); $(".ob__cnt").textContent = "เลือกแล้ว " + sel.size + "/3"; next.disabled = sel.size === 0; };
        $$(".chip").forEach(c => c.onclick = () => { const v = c.dataset.v; if (sel.has(v)) sel.delete(v); else if (sel.size < 3) sel.add(v); else { EE.sfx.no(); return; } pickFx(c); paint(); });
        paint(); next.onclick = () => { S.interests = Array.from(sel); EE.sfx.ok(); go("level"); };
      });
    },
    level() { choices(6 / total, `${nm()} ตอนนี้ภาษาอังกฤษของคุณระดับไหน${EE.polQ()}?`, [["zero", "🐣", "เริ่มจากศูนย์ ไม่รู้อะไรเลย"], ["some", "🌱", "รู้ศัพท์บ้าง ประโยคง่าย ๆ ได้"], ["rusty", "🔥", "เคยเรียนมา แต่ลืมไปเยอะ"], ["good", "🚀", "พอสื่อสารได้ อยากเก่งขึ้น"]], false, v => { S.level = v; go("placement"); }); },
    placement() {
      const Q = [
        { q: "“สวัสดี” ภาษาอังกฤษคืออะไร?", o: ["Hello", "Goodbye", "Sorry"], a: 0 },
        { q: "She ___ a doctor.", o: ["am", "is", "are"], a: 1 },
        { q: "Yesterday I ___ to the market.", o: ["go", "going", "went"], a: 2 },
        { q: "___ do you live?  (คุณอาศัยอยู่ที่ไหน)", o: ["Who", "Where", "Why"], a: 1 }
      ];
      let i = 0, score = 0; const t = my();
      const draw = () => {
        const q = Q[i]; shell(`${say(i === 0 ? "ลองมินิเทสต์ 4 ข้อ ไม่มีผิดถูกที่เสียหาย แค่ให้ฉันรู้ว่าควรเริ่มตรงไหน 🎯" : "ไปต่อ!")}<div class="ob__body show"><div class="ob__qn">ข้อ ${i + 1}/${Q.length}</div><h2 class="ob__q">${esc(q.q)}</h2><div class="ob__opts">${q.o.map((o, k) => `<button class="ob__opt" data-k="${k}" style="--i:${k}"><b>${esc(o)}</b></button>`).join("")}</div></div><button class="linkbtn ob__skip" id="pl-skip">ข้ามมินิเทสต์ (เริ่มตามที่เลือกไว้)</button>`, (7 + i / Q.length) / total);
        ask("", t);
        $$(".ob__opt").forEach(b => b.onclick = () => { const ok = +b.dataset.k === q.a; if (ok) score++; b.classList.add(ok ? "good" : "bad"); $$(".ob__opt").forEach(x => { x.disabled = true; if (+x.dataset.k === q.a) x.classList.add("good"); }); ok ? EE.sfx.ok() : EE.sfx.no(); setTimeout(() => { i++; if (i < Q.length) draw(); else { S.placement = score; go("goal"); } }, 750); });
        $("#pl-skip").onclick = () => { S.placement = null; go("goal"); };
      };
      draw();
    },
    goal() { choices(8 / total, "อยากเรียนวันละเท่าไหร่ดี? แนะนำให้เริ่มเบา ๆ แต่ทำทุกวัน 💪", [["10", "🌿", "สบาย ๆ — 10 XP (~3 นาที)"], ["20", "🔥", "ปกติ — 20 XP (~6 นาที)"], ["50", "🚀", "จริงจัง — 50 XP (~15 นาที)"]], false, v => { S.goal = +v; go("analyse"); }); },
    async analyse() {
      const t = my(); const msgs = ["กำลังวิเคราะห์โปรไฟล์…", "คำนวณแผนการเรียน…", "ปรับเส้นทางให้เหมาะกับคุณ…", "แผนของคุณพร้อมแล้ว! 🎉"];
      const logs = ["> profile.scan ............ OK", "> level.detect ............ OK", "> goal.sync ............... OK", "> path.optimize ........... OK", "> plan.ready ..............  ✓"];
      shell(`<div class="ob__center ob__an"><div class="ob__holo"><span class="h1"></span><span class="h2"></span><span class="h3"></span><div class="ob__logo ob__logo--s">${EE.mascot("happy", 96)}</div></div><div class="ob__pct"><b id="ob-p">0</b>%</div><div class="ob__prog"><i></i></div><p class="ob__msg">${msgs[0]}</p><pre class="ob__log" id="ob-log"></pre></div>`, 10 / total);
      const bar = $(".ob__prog i"), msg = $(".ob__msg"), pc = $("#ob-p"), lg = $("#ob-log"); let shown = "";
      for (let k = 0; k < msgs.length; k++) {
        if (t !== token) return; msg.textContent = msgs[k]; const from = k * 25, to = (k + 1) * 25; bar.style.width = to + "%";
        for (let n = 0; n < 2 && logs.length; n++) { shown += (shown ? "\n" : "") + logs.shift(); lg.textContent = shown; EE.sfx.key(); await sleep(fast ? 10 : 260); }
        for (let v = from; v <= to; v += 5) { pc.textContent = v; await sleep(fast ? 5 : 40); }
        if (k === 3) EE.sfx.win(); await sleep(fast ? 50 : 250);
      }
      go("plan");
    },
    plan() {
      const t = my(), tot = EE.ALL_WORDS.length, g = S.goal || 20, k = g >= 50 ? 1 : g >= 20 ? .75 : .5;
      const pts = [0, Math.round(tot * .12 * k), Math.round(tot * .4 * k), Math.round(tot * .85 * k)];
      const X = [20, 100, 200, 300], Y = pts.map(p => 130 - (p / (tot * .85)) * 110);
      const d = `M${X[0]} ${Y[0]} C ${X[0] + 40} ${Y[0]}, ${X[1] - 30} ${Y[1]}, ${X[1]} ${Y[1]} S ${X[2] - 40} ${Y[2]}, ${X[2]} ${Y[2]} S ${X[3] - 40} ${Y[3]}, ${X[3]} ${Y[3]}`;
      shell(`${say(`${nm()} นี่คือเส้นทางของคุณ — ประมาณการหากเรียนตามเป้าหมายทุกวัน`)}<div class="ob__body show"><svg class="ob__chart" viewBox="0 0 330 170" role="img" aria-label="กราฟประมาณการคำศัพท์"><defs><linearGradient id="og" x1="0" x2="1"><stop offset="0" stop-color="#a78bfa"/><stop offset=".55" stop-color="#facc15"/><stop offset="1" stop-color="#4ade80"/></linearGradient><linearGradient id="of" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8b5cf6" stop-opacity=".45"/><stop offset="1" stop-color="#8b5cf6" stop-opacity="0"/></linearGradient></defs><path d="${d} L ${X[3]} 150 L ${X[0]} 150 Z" fill="url(#of)" class="ob__fill"/>${[40,80,120].map(y => `<line x1="14" x2="310" y1="${y}" y2="${y}" stroke="rgba(168,85,247,.18)" stroke-dasharray="3 5"/>`).join("")}<path d="${d}" fill="none" stroke="url(#og)" stroke-width="4" stroke-linecap="round" class="ob__line" pathLength="1" style="filter:drop-shadow(0 0 6px #facc15)"/><circle r="7" fill="#fff" class="ob__trav"><animateMotion dur="2.2s" begin=".4s" fill="freeze" path="${d}"/></circle>${X.map((x, i) => `<circle cx="${x}" cy="${Y[i]}" r="5" fill="${i === 3 ? "#4ade80" : "#c4b5fd"}" class="ob__dot" style="--i:${i}"/><text x="${x}" y="${Y[i] - 12}" text-anchor="middle" fill="#fff" font-size="11" font-weight="800" class="ob__dot" style="--i:${i}">${pts[i] ? "~" + pts[i] : 0}</text>`).join("")}${["วันนี้", "1 เดือน", "3 เดือน", "6 เดือน"].map((l, i) => `<text x="${X[i]}" y="166" text-anchor="middle" fill="#b9a6e0" font-size="10">${l}</text>`).join("")}</svg><p class="fine ob__cap">จำนวนคำศัพท์ที่จะรู้ (ตัวเลขประมาณการ ไม่ใช่การรับประกันผล)</p></div><button class="btn btn--primary btn--lg ob__next">เริ่มเรียนบทแรก →</button>`, 11 / total);
      ask("", t); $(".ob__next").onclick = () => { EE.sfx.win(); const r = $(".ob__next").getBoundingClientRect(); EE.burst(r.left + r.width / 2, r.top, null); go("offer"); };
    },
    offer() { my(); EE.renderOffer(root, finish, true); }
  };
  /* where to start, from claimed level + placement result */
  function startIndex() {
    const first = (n) => EE.UNITS.slice(0, n).reduce((a, u) => a + u.lessons.length, 0) - 1;
    const byLevel = { zero: 0, some: first(3), rusty: first(2), good: first(6) }[S.level] || 0;
    const byTest = S.placement == null ? 0 : [0, first(2), first(5), first(10), first(14)][S.placement] || 0;
    return Math.max(0, Math.max(byLevel, byTest));
  }
  function finish() { S.unlockTo = startIndex(); EE.confetti(); const o = root.firstChild; if (o && o.classList) o.classList.add("ob--flash"); S.onboarded = true; EE.save(); EE.gl.jump(); setTimeout(done, fast ? 0 : 700); }
  const MODES = { splash: "splash", welcome: "welcome", analyse: "analyse" };
  function go(n) {
    const c = root.firstChild;
    const run = () => { cur = n; EE.gl.mode(MODES[n] || "chat"); if (n === "welcome") EE.gl.jump(); if (n === "plan") EE.gl.pulse(); SC[n](); window.scrollTo(0, 0); };
    if (fast || !c || !c.classList || n === "splash") return run();
    c.classList.add("ob--out"); setTimeout(run, 260);
  }
  go("splash");
};
})(window.EE);
