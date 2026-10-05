/* English Easy TH — sales/offer screen (#/pro and end of onboarding). Config-driven, no fake urgency or testimonials. */
(function (EE) {
"use strict";
const { $, $$, esc } = EE, S = EE.state();
EE.renderOffer = function (root, onSkip, inOnb) {
  const C = EE.CONFIG; let plan = (C.PLANS.find(p => p.best) || C.PLANS[0]).id;
  const configured = !!C.BUY_URL;
  const num = x => +String(x).replace(/[^0-9.]/g, "");
  const month = C.PLANS.find(p => p.months === 1), saving = p => (month && p.months > 1 && num(month.price) && num(p.price)) ? `<i class="plan__save">ประหยัด ${Math.max(0, Math.round((1 - num(p.price) / (num(month.price) * p.months)) * 100))}%</i>` : "";
  root.innerHTML = `<section class="offer ${inOnb ? "ob" : "page"}"><div class="offer__hero"><div class="ob__holo ob__holo--s"><span class="h1"></span><span class="h2"></span><span class="h3"></span><div class="ob__logo ob__logo--s"><span class="ob__mark">${EE.logo(64)}</span></div></div>
    <p class="eyebrow">PRO</p><h1>${esc(C.PRODUCT)}</h1><p class="lead">${esc(C.TAGLINE)}</p></div>
    ${S.pro ? `<div class="offer__on">✅ คุณใช้ Pro อยู่แล้ว — ขอบคุณที่สนับสนุน 💜</div>` : ""}
    <div class="offer__feat">${C.FEATURES.map((f, i) => `<div style="--i:${i}"><span>${f[0]}</span><b>${esc(f[1])}</b><em>${esc(f[2])}</em></div>`).join("")}</div>
    <div class="offer__cmp"><div class="h"><span></span><b>ฟรี</b><b class="pro">Pro</b></div>
      ${[["หน่วยเรียน", EE.freeUnits() >= EE.UNITS.length ? "ทั้งหมด" : "หน่วย 1–" + EE.freeUnits(), "ครบ " + EE.UNITS.length + " หน่วย"], ["หัวใจ", "5 / รีเจน 30 นาที", "ไม่จำกัด"], ["ฝึกพูด + ตรวจเสียง", "—", "✓"], ["ใบรับรองจบคอร์ส", "—", "✓"], ["มินิเกม & คำศัพท์", "✓", "✓"]].map(r => `<div><span>${r[0]}</span><b>${r[1]}</b><b class="pro">${r[2]}</b></div>`).join("")}</div>
    <div class="offer__plans" role="radiogroup" aria-label="เลือกแพ็กเกจ">${C.PLANS.map(p => `<button class="plan ${p.id === plan ? "on" : ""}" role="radio" aria-checked="${p.id === plan}" data-p="${p.id}">${p.best ? '<i class="plan__best">แนะนำ</i>' : ""}<b>${esc(p.name)}</b><strong>${esc(p.price)}<small>${esc(p.per)}</small></strong><em>${esc(p.note)}</em>${saving(p)}</button>`).join("")}</div>
    ${S.minor ? '<p class="offer__minor">🧒 อายุต่ำกว่า 18 ปี: กรุณาปรึกษาผู้ปกครองก่อนสมัครแพ็กเกจที่มีค่าใช้จ่าย</p>' : ""}<button class="btn btn--gold btn--lg offer__buy" id="of-buy">🚀 สมัคร Pro</button>
    <details class="offer__code"><summary>มีรหัสเปิดใช้งาน?</summary><div><input class="ob__inp" id="of-code" placeholder="กรอกรหัส" autocomplete="off"><button class="btn btn--primary" id="of-ok">ใช้รหัส</button></div></details>
    <button class="linkbtn offer__skip" id="of-skip">${inOnb ? "ใช้ฟรีต่อไป →" : "← กลับ"}</button>
    <p class="fine">ใช้ฟรีได้ตลอดโดยไม่ต้องสมัครสมาชิก · <a href="#/terms">เงื่อนไข</a> · <a href="#/privacy">ความเป็นส่วนตัว</a></p></section>`;
  $$(".plan").forEach(b => b.onclick = () => { plan = b.dataset.p; $$(".plan").forEach(x => { x.classList.toggle("on", x === b); x.setAttribute("aria-checked", x === b); }); EE.sfx.pick(); });
  $("#of-buy").onclick = () => { EE.sfx.win(); const r = $("#of-buy").getBoundingClientRect(); EE.burst(r.left + r.width / 2, r.top + r.height / 2); onSkip("#/checkout/" + plan); };
  $("#of-ok").onclick = async () => { const r = await EE.activate($("#of-code").value); if (r.ok) { EE.confetti(); EE.sfx.win(); EE.toast("เปิดใช้ Pro แล้ว 🎉", "ok"); EE.renderOffer(root, onSkip, inOnb); } else { EE.sfx.no(); EE.toast(r.msg, "warn"); } };
  $("#of-skip").onclick = onSkip;
};
})(window.EE);
