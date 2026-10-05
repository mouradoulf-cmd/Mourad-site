/* English Easy TH — chat-style onboarding (splash → welcome → mascot asks questions with typewriter bubbles → analysing → projected path). */
(function (EE) {
"use strict";
const { $, esc } = EE, S = EE.state();
const sleep = ms => new Promise(r => setTimeout(r, ms));
const fast = EE.reduce;

EE.runOnb = function (root, done) {
  const total = 9; let alive = true, step = 0, token = 0;
  const my = () => ++token;
  function shell(inner, prog) {
    root.innerHTML = `<section class="ob">${prog == null ? "" : `<div class="ob__bar"><i style="width:${Math.round(prog * 100)}%"></i></div>`}${inner}</section>`;
  }
  async function type(el, text, t) {
    el.textContent = ""; el.classList.add("typing");
    if (fast) { el.textContent = text; el.classList.remove("typing"); return; }
    for (let i = 1; i <= text.length; i++) { if (t !== token) return; el.textContent = text.slice(0, i); await sleep(text[i - 1] === " " ? 14 : 26); }
    el.classList.remove("typing");
  }
  const say = (txt) => `<div class="ob__say"><span class="ob__av">${EE.mascot("happy", 44)}</span><div class="ob__bub" data-t="${esc(txt)}"></div></div>`;
  async function ask(txt, t) { const b = $(".ob__bub"); await type(b, b.dataset.t, t); if (t === token) $(".ob__body") && $(".ob__body").classList.add("show"); }

  function question(prog, txt, bodyHtml, ready) {
    const t = my();
    shell(`${say(txt)}<div class="ob__body">${bodyHtml}</div><button class="btn btn--primary btn--lg ob__next" disabled>ต่อไป →</button>`, prog);
    const next = $(".ob__next"); ready(next, t); ask(txt, t);
    return t;
  }
  const nm = () => S.name || "เพื่อน";
  function choices(prog, txt, items, key, grid, after) {
    question(prog, txt, `<div class="ob__opts ${grid ? "grid" : ""}">${items.map((it, i) => `<button class="ob__opt" data-v="${esc(it[0])}" style="--i:${i}"><span>${it[1]}</span><b>${it[2]}</b><em>✓</em></button>`).join("")}</div>`, (next) => {
      let val = null;
      $$(".ob__opt").forEach(b => b.onclick = () => { $$(".ob__opt").forEach(x => x.classList.remove("on")); b.classList.add("on"); val = b.dataset.v; next.disabled = false; EE.sfx.tap(); });
      next.onclick = () => { if (val == null) return; EE.sfx.ok(); after(val); };
    });
  }
  const $$ = EE.$$;

  const screens = [
    function splash() {
      const t = my(); root.innerHTML = `<section class="ob ob--splash"><div class="ob__logo"><span class="ob__corner c1"></span><span class="ob__corner c2"></span><span class="ob__corner c3"></span><span class="ob__corner c4"></span>${EE.mascot("cheer", 150)}</div><h1 class="ob__title"><span>ENGLISH</span><b>.EASY</b></h1><div class="ob__scan"><i></i></div><p class="ob__load">อังกฤษง่าย ๆ / LOADING...</p></section>`;
      setTimeout(() => { if (t === token) go(1); }, fast ? 300 : 2300);
    },
    function welcome() {
      my(); shell(`<div class="ob__center"><div class="ob__logo ob__logo--s">${EE.mascot("cheer", 120)}</div><h1>ยินดีต้อนรับสู่<br><span>English Easy</span>!</h1><p class="lead">เรียนอังกฤษแบบเล่นเกม<br>ใน 2 นาที เราจะปรับเส้นทางให้เหมาะกับคุณ 💜</p><button class="btn btn--primary btn--lg" id="ob-go">เริ่มเลย 🚀</button><p class="fine">ฟรี ไม่ต้องสมัครสมาชิก ข้อมูลเก็บในเครื่องของคุณ</p></div>`);
      $("#ob-go").onclick = () => { EE.sfx.win(); go(2); };
    },
    function name() {
      question(1 / total, "สวัสดี! คุณชื่ออะไรคะ/ครับ? ฉันจะปรับเส้นทางการเรียนให้คุณ 😊", `<input class="ob__inp" id="ob-name" maxlength="20" placeholder="ชื่อเล่นของคุณ…" autocomplete="nickname" enterkeyhint="done">`, (next, t) => {
        const i = $("#ob-name"); i.oninput = () => { next.disabled = !i.value.trim(); }; i.onkeydown = e => { if (e.key === "Enter" && i.value.trim()) next.click(); };
        next.onclick = () => { S.name = i.value.trim(); EE.sfx.ok(); go(3); };
        setTimeout(() => { if (t === token && !matchMedia("(pointer:coarse)").matches) i.focus(); }, 1400);
      });
    },
    () => choices(2 / total, `เยี่ยมเลย ${nm()}! ทำไมถึงอยากเรียนภาษาอังกฤษ?`, [["travel", "✈️", "เที่ยวต่างประเทศ"], ["family", "👨‍👩‍👧", "คุยกับครอบครัว/เพื่อนต่างชาติ"], ["work", "💼", "ใช้ในการทำงาน"], ["study", "🎓", "เรียน / สอบ"], ["fun", "🎬", "ดูหนัง ฟังเพลง เล่นเกม"]], "why", false, v => { S.why = v; go(4); }),
    () => choices(3 / total, `${nm()} อายุเท่าไหร่คะ/ครับ?`, [["u13", "🧒", "ต่ำกว่า 13"], ["13", "🧑", "13–17"], ["18", "🙂", "18–24"], ["25", "😎", "25–34"], ["35", "🧔", "35–44"], ["45", "👨", "45–54"], ["55", "🌟", "55+"]], "age", true, v => { S.age = v; go(5); }),
    () => choices(4 / total, `${nm()} ตอนนี้ภาษาอังกฤษของคุณระดับไหน?`, [["zero", "🐣", "ไม่รู้อะไรเลย"], ["some", "🌱", "รู้ศัพท์บ้างนิดหน่อย"], ["rusty", "🔥", "เคยเรียน แต่ลืมไปเยอะ"]], "level", false, v => { S.level = v; go(6); }),
    function reading() {
      const t = my(); shell(`${say("ลองดูหน่อย — คุณอ่านคำนี้ออกไหม?")}<div class="ob__body"><div class="ob__word">Hello</div><button class="spk ob__spk" aria-label="ฟังเสียง">🔊</button><div class="ob__yn"><button class="ob__yes" aria-label="อ่านได้">👍</button><button class="ob__no" aria-label="อ่านไม่ได้">👎</button></div></div><button class="btn btn--primary btn--lg ob__next" disabled>ต่อไป →</button>`, 5 / total);
      const next = $(".ob__next"); $(".ob__spk").onclick = () => EE.speak("Hello");
      $(".ob__yes").onclick = () => { S.canRead = true; $(".ob__yes").classList.add("on"); $(".ob__no").classList.remove("on"); next.disabled = false; EE.sfx.ok(); };
      $(".ob__no").onclick = () => { S.canRead = false; $(".ob__no").classList.add("on"); $(".ob__yes").classList.remove("on"); next.disabled = false; EE.sfx.tap(); };
      next.onclick = () => go(7); ask("", t);
    },
    () => choices(6 / total, "อยากเรียนวันละเท่าไหร่ดี?", [["10", "🌿", "สบาย ๆ — 10 XP (~3 นาที)"], ["20", "🔥", "ปกติ — 20 XP (~6 นาที)"], ["50", "🚀", "จริงจัง — 50 XP (~15 นาที)"]], "goal", false, v => { S.goal = +v; go(8); }),
    async function analyse() {
      const t = my(); const msgs = ["กำลังวิเคราะห์โปรไฟล์…", "คำนวณแผนการเรียน…", "ปรับเส้นทางให้เหมาะกับคุณ…", "แผนของคุณพร้อมแล้ว! 🎉"];
      shell(`<div class="ob__center ob__an"><div class="ob__logo ob__logo--s">${EE.mascot("happy", 96)}</div><div class="ob__prog"><i></i></div><p class="ob__msg">${msgs[0]}</p></div>`, 7 / total);
      const bar = $(".ob__prog i"), msg = $(".ob__msg");
      for (let k = 0; k < msgs.length; k++) { if (t !== token) return; msg.textContent = msgs[k]; bar.style.width = ((k + 1) / msgs.length * 100) + "%"; if (k === 3) EE.sfx.win(); await sleep(fast ? 100 : 1300); }
      go(9);
    },
    function plan() {
      const t = my(), tot = EE.ALL_WORDS.length, g = S.goal || 20, k = g >= 50 ? 1 : g >= 20 ? .75 : .5;
      const pts = [0, Math.round(tot * .12 * k), Math.round(tot * .4 * k), Math.round(tot * .85 * k)];
      const X = [20, 100, 200, 300], Y = pts.map(p => 130 - (p / (tot * .85)) * 110);
      const d = `M${X[0]} ${Y[0]} C ${X[0] + 40} ${Y[0]}, ${X[1] - 30} ${Y[1]}, ${X[1]} ${Y[1]} S ${X[2] - 40} ${Y[2]}, ${X[2]} ${Y[2]} S ${X[3] - 40} ${Y[3]}, ${X[3]} ${Y[3]}`;
      shell(`${say(`${nm()} นี่คือเส้นทางของคุณ — ประมาณการหากเรียนตามเป้าหมายทุกวัน`)}<div class="ob__body show"><svg class="ob__chart" viewBox="0 0 330 170" role="img" aria-label="กราฟประมาณการคำศัพท์"><defs><linearGradient id="og" x1="0" x2="1"><stop offset="0" stop-color="#a78bfa"/><stop offset=".55" stop-color="#facc15"/><stop offset="1" stop-color="#4ade80"/></linearGradient><linearGradient id="of" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8b5cf6" stop-opacity=".45"/><stop offset="1" stop-color="#8b5cf6" stop-opacity="0"/></linearGradient></defs><path d="${d} L ${X[3]} 150 L ${X[0]} 150 Z" fill="url(#of)" class="ob__fill"/><path d="${d}" fill="none" stroke="url(#og)" stroke-width="4" stroke-linecap="round" class="ob__line" pathLength="1"/>${X.map((x, i) => `<circle cx="${x}" cy="${Y[i]}" r="5" fill="${i === 3 ? "#4ade80" : "#c4b5fd"}" class="ob__dot" style="--i:${i}"/><text x="${x}" y="${Y[i] - 12}" text-anchor="middle" fill="#fff" font-size="11" font-weight="800" class="ob__dot" style="--i:${i}">${pts[i] ? "~" + pts[i] : 0}</text>`).join("")}${["วันนี้", "1 เดือน", "3 เดือน", "6 เดือน"].map((l, i) => `<text x="${X[i]}" y="166" text-anchor="middle" fill="#b9a6e0" font-size="10">${l}</text>`).join("")}</svg><p class="fine ob__cap">จำนวนคำศัพท์ที่จะรู้ (ตัวเลขประมาณการ ไม่ใช่การรับประกันผล)</p></div><button class="btn btn--primary btn--lg ob__next">เริ่มเรียนบทแรก →</button>`, 8 / total);
      ask("", t); $(".ob__next").onclick = () => { EE.sfx.win(); S.onboarded = true; EE.save(); done(); };
    }
  ];
  function go(n) { step = n; (screens[n])(); window.scrollTo(0, 0); }
  go(0);
};
})(window.EE);
