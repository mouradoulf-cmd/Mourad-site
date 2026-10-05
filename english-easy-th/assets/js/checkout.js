/* English Easy TH — checkout (#/checkout/<plan>) + legal pages. Provider-agnostic: PromptPay QR (generated here), card payment links,
   LINE manual payment, optional server verification, test mode. Configure everything in assets/js/config.js (see PAYMENT.md). */
(function (EE) {
"use strict";
const { $, $$, esc } = EE, S = EE.state();
const C = () => EE.CONFIG, P = () => (EE.CONFIG.PAYMENT || {});
const baht = n => "฿" + Number(n).toLocaleString("en-US");
const fmtDate = ts => new Date(ts).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" });

/* ---------- PromptPay (EMVCo) payload ---------- */
const tlv = (id, v) => id + String(v.length).padStart(2, "0") + v;
function crc16(s) { let c = 0xFFFF; for (let i = 0; i < s.length; i++) { c ^= s.charCodeAt(i) << 8; for (let j = 0; j < 8; j++) c = (c & 0x8000) ? ((c << 1) ^ 0x1021) : (c << 1); c &= 0xFFFF; } return c.toString(16).toUpperCase().padStart(4, "0"); }
EE.promptPayPayload = function (id, amount) {
  id = String(id).replace(/\D/g, ""); let t, v;
  if (id.length >= 15) { t = "03"; v = id; } else if (id.length === 13) { t = "02"; v = id; } else { t = "01"; v = "0066" + id.replace(/^0/, ""); }
  const p = tlv("00", "01") + tlv("01", amount ? "12" : "11") + tlv("29", tlv("00", "A000000677010111") + tlv(t, v)) + tlv("53", "764") + (amount ? tlv("54", Number(amount).toFixed(2)) : "") + tlv("58", "TH") + "6304";
  return p + crc16(p);
};

const methodsFor = plan => {
  const p = P(), card = (p.CARD_LINKS || {})[plan.id] || C().BUY_URL || "", line = p.LINE_ID ? "https://line.me/R/oaMessage/" + encodeURIComponent(p.LINE_ID) + "/" : C().LINE;
  return [
    { id: "pp", icon: "📱", name: "PromptPay QR", sub: "สแกนจ่ายผ่านแอปธนาคาร", ok: !!p.PROMPTPAY_ID },
    { id: "card", icon: "💳", name: "บัตรเครดิต / เดบิต", sub: "ชำระผ่านหน้าปลอดภัยของผู้ให้บริการ", ok: !!card, link: card },
    { id: "line", icon: "💬", name: "โอน / ติดต่อผ่าน LINE", sub: "โอนเงินแล้วแจ้งสลิปกับแอดมิน", ok: !!line, link: line }
  ].concat(p.TEST_MODE ? [{ id: "test", icon: "🧪", name: "จำลองการชำระเงิน", sub: "โหมดทดสอบ (ไม่ตัดเงินจริง)", ok: true }] : []);
};

EE.checkoutView = function (root, planId) {
  const plans = C().PLANS; let plan = plans.find(p => p.id === planId) || plans.find(p => p.best) || plans[0];
  let step = 1, method = null, order = null; const form = { name: S.name || "", email: S.email || "", agree: false };
  const total = () => plan.amount != null ? plan.amount : Number(String(plan.price).replace(/[^0-9.]/g, "")) || 0;
  const periodTxt = p => p.months === 0 ? "จ่ายครั้งเดียว ใช้ได้ตลอดชีพ" : p.months === 1 ? "ใช้งาน 1 เดือน" : "ใช้งาน 12 เดือน";
  const STEPS = ["แพ็กเกจ", "ข้อมูล", "ชำระเงิน", "เสร็จสิ้น"];

  function newOrder() {
    const id = "EE-" + Date.now().toString(36).toUpperCase().slice(-6) + Math.random().toString(36).slice(2, 5).toUpperCase();
    order = { id, plan: plan.id, amount: total(), name: form.name, email: form.email, ts: Date.now(), status: "pending" };
    S.orders = (S.orders || []).concat(order).slice(-10); S.email = form.email; if (form.name) S.name = form.name; EE.save();
  }

  function frame(inner) {
    root.innerHTML = `<section class="co"><a class="co__back" href="#/pro">← กลับ</a>
      <ol class="co__steps" aria-label="ขั้นตอน">${STEPS.map((s, i) => `<li class="${i + 1 < step ? "done" : i + 1 === step ? "on" : ""}"><b>${i + 1 < step ? "✓" : i + 1}</b><span>${s}</span></li>`).join("")}<i class="co__line"><u style="width:${(step - 1) / (STEPS.length - 1) * 100}%"></u></i></ol>
      <div class="co__grid"><div class="co__main">${inner}</div>${step < 4 ? summary() : ""}</div></section>`;
  }
  const summary = () => `<aside class="co__sum"><h3>สรุปคำสั่งซื้อ</h3><div class="co__row"><span>${esc(C().PRODUCT)}</span><b>${esc(plan.name)}</b></div><div class="co__row"><span>${periodTxt(plan)}</span><b>${esc(plan.price)}</b></div>
    <ul class="co__feat">${C().FEATURES.map(f => `<li>${f[0]} ${esc(f[1])}</li>`).join("")}</ul><div class="co__total"><span>ยอดชำระ</span><strong>${baht(total())}</strong></div>
    <p class="fine">${plan.months === 0 ? "ชำระครั้งเดียว ไม่มีค่าใช้จ่ายรายเดือน" : "PromptPay / โอนเงิน ไม่ต่ออายุอัตโนมัติ"} · คืนเงินภายใน ${P().REFUND_DAYS || 7} วัน ดู<a href="#/terms">เงื่อนไข</a></p></aside>`;

  /* ---- step 1: plan ---- */
  function s1() {
    step = 1; frame(`<h2>เลือกแพ็กเกจ</h2><div class="offer__plans co__plans" role="radiogroup">${plans.map(p => `<button class="plan ${p.id === plan.id ? "on" : ""}" role="radio" aria-checked="${p.id === plan.id}" data-p="${p.id}">${p.best ? '<i class="plan__best">แนะนำ</i>' : ""}<b>${esc(p.name)}</b><strong>${esc(p.price)}<small>${esc(p.per)}</small></strong><em>${esc(p.note)}</em></button>`).join("")}</div>
      <button class="btn btn--gold btn--lg co__go" id="co-n">ต่อไป →</button>`);
    $$(".plan", root).forEach(b => b.onclick = () => { plan = plans.find(p => p.id === b.dataset.p); EE.sfx.pick(); s1(); });
    $("#co-n").onclick = () => { EE.sfx.ok(); s2(); };
  }
  /* ---- step 2: details ---- */
  function s2() {
    step = 2; frame(`<h2>ข้อมูลของคุณ</h2><p class="lead">ใช้สำหรับออกใบเสร็จและส่งรหัสเปิดใช้งาน</p>
      <label class="field">ชื่อ-นามสกุล<input class="ob__inp co__inp" id="co-name" autocomplete="name" value="${esc(form.name)}" placeholder="ชื่อของคุณ"></label>
      <label class="field">อีเมล<input class="ob__inp co__inp" id="co-mail" type="email" autocomplete="email" inputmode="email" value="${esc(form.email)}" placeholder="you@example.com"></label>
      ${S.minor ? '<p class="offer__minor">🧒 ผู้ที่อายุต่ำกว่า 18 ปี ต้องได้รับอนุญาตจากผู้ปกครองก่อนชำระเงิน</p>' : ""}
      <label class="sw co__agree"><input type="checkbox" id="co-ag" ${form.agree ? "checked" : ""}><span>ฉันยอมรับ<a href="#/terms" target="_blank" rel="noopener">เงื่อนไขการใช้งาน</a>และ<a href="#/privacy" target="_blank" rel="noopener">นโยบายความเป็นส่วนตัว</a></span></label>
      <p class="co__err" id="co-err" role="alert"></p><div class="co__btns"><button class="btn btn--ghost" id="co-b">← ย้อนกลับ</button><button class="btn btn--gold btn--lg" id="co-n">ไปชำระเงิน →</button></div>`);
    $("#co-b").onclick = s1;
    $("#co-n").onclick = () => {
      form.name = $("#co-name").value.trim(); form.email = $("#co-mail").value.trim(); form.agree = $("#co-ag").checked; const err = $("#co-err");
      if (form.name.length < 2) return err.textContent = "กรุณากรอกชื่อ";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) return err.textContent = "อีเมลไม่ถูกต้อง";
      if (!form.agree) return err.textContent = "กรุณายอมรับเงื่อนไขก่อนดำเนินการต่อ";
      EE.sfx.ok(); if (!order || order.status === "paid" || order.plan !== plan.id || order.email !== form.email) newOrder(); s3();
    };
  }
  /* ---- step 3: pay ---- */
  function s3() {
    step = 3; const ms = methodsFor(plan), any = ms.some(m => m.ok); if (!method || !ms.find(m => m.id === method && m.ok)) method = (ms.find(m => m.ok) || {}).id || null;
    frame(`<h2>เลือกวิธีชำระเงิน</h2><p class="fine">เลขที่คำสั่งซื้อ <b>${order.id}</b> · ยอด <b>${baht(order.amount)}</b></p>
      <div class="co__methods" role="radiogroup">${ms.map(m => `<button class="meth ${m.id === method ? "on" : ""}" role="radio" aria-checked="${m.id === method}" data-m="${m.id}" ${m.ok ? "" : "disabled"}><span>${m.icon}</span><div><b>${m.name}</b><em>${m.ok ? m.sub : "เร็ว ๆ นี้"}</em></div><i>✓</i></button>`).join("")}</div>
      ${any ? "" : '<div class="co__note">🛠️ ระบบชำระเงินกำลังเตรียมเปิดใช้งาน — ผู้ขายยังไม่ได้ตั้งค่าช่องทางรับเงิน (ดู PAYMENT.md) คุณสามารถใช้งานแบบฟรีต่อไปได้</div>'}
      <div class="co__panel" id="co-panel"></div><div class="co__btns"><button class="btn btn--ghost" id="co-b">← ย้อนกลับ</button></div>`);
    $("#co-b").onclick = s2; $$(".meth", root).forEach(b => b.onclick = () => { method = b.dataset.m; EE.sfx.pick(); $$(".meth", root).forEach(x => { x.classList.toggle("on", x === b); x.setAttribute("aria-checked", x === b); }); panel(ms); });
    panel(ms);
  }
  function replace(u) { return u.replace("{email}", encodeURIComponent(form.email)).replace("{ref}", encodeURIComponent(order.id)); }
  function cardLink(u) { try { const x = new URL(replace(u)); if (/stripe\.com$/.test(x.hostname) || /buy\.stripe/.test(x.hostname)) { x.searchParams.set("prefilled_email", form.email); x.searchParams.set("client_reference_id", order.id); } return x.toString(); } catch (e) { return replace(u); } }
  function panel(ms) {
    const el = $("#co-panel"); if (!el) return; const m = ms.find(x => x.id === method); if (!m) { el.innerHTML = ""; return; }
    const msg = `สวัสดีค่ะ/ครับ ฉันชำระ ${C().PRODUCT} (${plan.name}) ยอด ${baht(order.amount)} เลขที่ ${order.id} ชื่อ ${form.name} อีเมล ${form.email}`;
    if (m.id === "pp") {
      const payload = EE.promptPayPayload(P().PROMPTPAY_ID, order.amount), q = window.qrcode(0, "M"); q.addData(payload); q.make();
      el.innerHTML = `<div class="qr"><div class="qr__f"><span class="ob__corner c1"></span><span class="ob__corner c2"></span><span class="ob__corner c3"></span><span class="ob__corner c4"></span><div class="qr__c">${q.createSvgTag({ cellSize: 6, margin: 2, scalable: true })}</div><i class="qr__scan"></i></div>
        <div class="qr__i"><div class="qr__amt">${baht(order.amount)}</div>${P().PROMPTPAY_NAME ? `<p>${esc(P().PROMPTPAY_NAME)}</p>` : ""}<ol class="co__how"><li>เปิดแอปธนาคาร แล้วสแกน QR</li><li>ตรวจยอด ${baht(order.amount)} แล้วยืนยัน</li><li>แจ้งสลิปทาง LINE/อีเมล หรือกรอกรหัสที่ได้รับ</li></ol><button class="btn btn--ghost btn--sm" id="qr-dl">⬇️ บันทึก QR</button></div></div>
        <button class="btn btn--gold btn--lg co__go" id="co-paid">โอนแล้ว → เปิดใช้งาน</button>`;
      $("#qr-dl").onclick = () => { const a = document.createElement("a"); a.href = q.createDataURL(8, 4); a.download = "promptpay-" + order.id + ".gif"; a.click(); };
      $("#co-paid").onclick = () => { EE.sfx.ok(); s4(false); };
    } else if (m.id === "card") {
      el.innerHTML = `<div class="co__note co__note--ok">🔒 คุณจะถูกพาไปหน้าชำระเงินที่ปลอดภัยของผู้ให้บริการ — เว็บนี้ไม่เก็บข้อมูลบัตรของคุณ</div><button class="btn btn--gold btn--lg co__go" id="co-open">ไปหน้าชำระเงินด้วยบัตร →</button><button class="linkbtn" id="co-paid">ชำระแล้ว? กรอกรหัสเปิดใช้งาน</button>`;
      $("#co-open").onclick = () => { window.open(cardLink(m.link), "_blank", "noopener"); setTimeout(() => s4(false), 600); }; $("#co-paid").onclick = () => s4(false);
    } else if (m.id === "line") {
      el.innerHTML = `<div class="co__note">โอนเงินตามที่แอดมินแจ้ง แล้วส่งสลิปพร้อมเลขที่คำสั่งซื้อ — เราจะส่งรหัสเปิดใช้งานให้</div><button class="btn btn--gold btn--lg co__go" id="co-open">💬 เปิดแชท LINE (ข้อความกรอกให้แล้ว)</button><button class="linkbtn" id="co-paid">ได้รับรหัสแล้ว? กรอกรหัสเปิดใช้งาน</button>`;
      $("#co-open").onclick = () => { window.open(P().LINE_ID ? m.link + "?text=" + encodeURIComponent(msg) : m.link, "_blank", "noopener"); setTimeout(() => s4(false), 600); }; $("#co-paid").onclick = () => s4(false);
    } else if (m.id === "test") {
      el.innerHTML = `<div class="co__note">🧪 โหมดทดสอบ: กดเพื่อจำลองว่าชำระเงินสำเร็จ (ไม่ตัดเงินจริง) — ปิด TEST_MODE ก่อนเปิดขายจริง</div><button class="btn btn--gold btn--lg co__go" id="co-sim">จำลองชำระเงินสำเร็จ</button>`;
      $("#co-sim").onclick = () => { EE.grantPro(plan.id); order.status = "paid"; EE.save(); s4(true); };
    }
  }
  /* ---- step 4: activate / done ---- */
  function s4(done) {
    step = 4;
    if (done) {
      const until = S.proUntil; EE.confetti(); EE.sfx.win(); EE.gl && EE.gl.jump();
      frame(`<div class="co__ok"><svg viewBox="0 0 80 80" class="co__tick"><circle cx="40" cy="40" r="34" pathLength="1"/><path d="M24 41l12 12 21-24" pathLength="1"/></svg><h2>ชำระเงินสำเร็จ — ยินดีต้อนรับสู่ Pro! 🎉</h2><p class="lead">ขอบคุณ ${esc(order.name || S.name || "")} · เปิดใช้งานทุกฟีเจอร์แล้ว</p></div>
        <div class="receipt" id="receipt"><h3>ใบเสร็จรับเงิน</h3><div class="co__row"><span>เลขที่</span><b>${order.id}</b></div><div class="co__row"><span>วันที่</span><b>${fmtDate(order.ts)}</b></div><div class="co__row"><span>รายการ</span><b>${esc(C().PRODUCT)} — ${esc(plan.name)}</b></div><div class="co__row"><span>ผู้ซื้อ</span><b>${esc(order.name)} (${esc(order.email)})</b></div><div class="co__row"><span>ใช้ได้ถึง</span><b>${until ? fmtDate(until) : "ตลอดชีพ"}</b></div><div class="co__row co__row--t"><span>ยอดรวม</span><b>${baht(order.amount)}</b></div>${(P().SELLER || {}).name ? `<p class="fine">${esc(P().SELLER.name)} ${esc(P().SELLER.address || "")} ${P().SELLER.taxId ? "· เลขประจำตัวผู้เสียภาษี " + esc(P().SELLER.taxId) : ""}</p>` : ""}</div>
        <div class="co__btns"><button class="btn btn--ghost" id="co-print">🖨️ พิมพ์ / บันทึก PDF</button><a class="btn btn--gold btn--lg" href="#/home">เริ่มเรียนแบบ Pro →</a></div>`);
      $("#co-print").onclick = () => window.print(); return;
    }
    frame(`<h2>เปิดใช้งาน Pro</h2><p class="lead">เมื่อชำระเงินแล้ว กรอก<b>รหัสเปิดใช้งาน</b>ที่ได้รับทางอีเมล/LINE ระบบจะเปิดสิทธิ์ให้ทันที</p>
      <div class="co__wait"><i></i><span>เลขที่คำสั่งซื้อ <b>${order.id}</b> · ${baht(order.amount)} · สถานะ: รอยืนยันการชำระเงิน</span></div>
      <input class="ob__inp co__inp" id="co-code" placeholder="รหัสเปิดใช้งาน" autocomplete="off" autocapitalize="characters"><p class="co__err" id="co-err" role="alert"></p>
      <div class="co__btns"><button class="btn btn--ghost" id="co-b">← ย้อนกลับ</button><button class="btn btn--gold btn--lg" id="co-act">เปิดใช้งาน</button></div><p class="fine">ยังไม่ได้รับรหัสภายใน 24 ชั่วโมง? ติดต่อ ${P().SUPPORT_EMAIL ? esc(P().SUPPORT_EMAIL) : "ผู้ขาย"} พร้อมเลขที่คำสั่งซื้อ</p>`);
    $("#co-b").onclick = s3;
    $("#co-act").onclick = async () => { const b = $("#co-act"); b.disabled = true; b.textContent = "กำลังตรวจสอบ…"; const r = await EE.activate($("#co-code").value, form.email, order.id); b.disabled = false; b.textContent = "เปิดใช้งาน";
      if (r.ok) { order.status = "paid"; EE.save(); plan = plans.find(p => p.id === S.plan) || plan; s4(true); } else { EE.sfx.no(); $("#co-err").textContent = r.msg; } };
  }
  s1(); EE.gl && EE.gl.mode("app");
};

/* ---------- legal pages (templates!) ---------- */
EE.legalView = function (root, kind) {
  const p = P(), s = p.SELLER || {}, who = s.name || "ผู้ให้บริการ English Easy", mail = p.SUPPORT_EMAIL || "(อีเมลติดต่อ)";
  const T = {
    terms: ["เงื่อนไขการใช้งาน", [
      ["1. บริการ", `${who} ให้บริการแอปเรียนภาษาอังกฤษ English Easy ทั้งแบบใช้ฟรีและแบบ Pro (เสียค่าบริการ)`],
      ["2. การชำระเงิน", "ราคาแสดงเป็นสกุลเงินบาท (THB) แพ็กเกจรายเดือน/รายปีที่ชำระผ่าน PromptPay หรือโอนเงินจะไม่ต่ออายุอัตโนมัติ แพ็กเกจที่ชำระผ่านบัตรอาจต่ออายุตามเงื่อนไขของผู้ให้บริการชำระเงิน ซึ่งจะแจ้งก่อนชำระ"],
      ["3. การคืนเงิน", `ขอคืนเงินได้ภายใน ${p.REFUND_DAYS || 7} วันนับจากวันชำระ หากยังใช้งานไม่เกินที่ควร โดยติดต่อ ${mail} พร้อมเลขที่คำสั่งซื้อ`],
      ["4. สิทธิ์การใช้งาน", "สิทธิ์ Pro ใช้ส่วนตัว ห้ามแจกจ่ายรหัสเปิดใช้งานต่อ ผู้ให้บริการอาจยกเลิกสิทธิ์หากพบการใช้ผิดเงื่อนไข"],
      ["5. ผู้เยาว์", "ผู้ที่อายุต่ำกว่า 18 ปีต้องได้รับความยินยอมจากผู้ปกครองก่อนซื้อ"],
      ["6. ข้อจำกัดความรับผิด", "เนื้อหาเพื่อการเรียนรู้ ไม่รับประกันผลลัพธ์เฉพาะบุคคล ใบรับรองในแอปไม่ใช่วุฒิการศึกษาทางการ"]]],
    privacy: ["นโยบายความเป็นส่วนตัว", [
      ["ข้อมูลที่เก็บ", "ความคืบหน้าการเรียน ชื่อเล่น เพศ ช่วงอายุ และความสนใจ ถูกเก็บ <b>ในอุปกรณ์ของคุณ</b> (localStorage) ไม่ได้ส่งไปเซิร์ฟเวอร์ ยกเว้นตอนซื้อ"],
      ["ข้อมูลตอนซื้อ", "ชื่อและอีเมลที่กรอกตอนชำระเงินใช้เพื่อออกใบเสร็จและส่งรหัสเปิดใช้งาน ข้อมูลบัตรถูกประมวลผลโดยผู้ให้บริการชำระเงินโดยตรง เว็บนี้ไม่เก็บข้อมูลบัตร"],
      ["เสียงและไมโครโฟน", "ฟีเจอร์ฝึกพูดใช้บริการรู้จำเสียงของเบราว์เซอร์/ระบบปฏิบัติการของคุณ และขอสิทธิ์ใช้ไมค์เฉพาะตอนที่คุณกดปุ่ม"],
      ["สิทธิ์ของคุณ", `ลบข้อมูลในอุปกรณ์ได้ที่โปรไฟล์ → รีเซ็ต หรือขอให้ลบข้อมูลการซื้อโดยติดต่อ ${mail}`]]]
  }[kind === "privacy" ? "privacy" : "terms"];
  root.innerHTML = `<section class="page legal"><a class="co__back" href="#/pro">← กลับ</a><h1>${T[0]}</h1><div class="co__note">⚠️ นี่คือข้อความตัวอย่างสำหรับเริ่มต้น กรุณาให้ที่ปรึกษากฎหมายตรวจสอบก่อนเปิดขายจริง</div>${T[1].map(x => `<h2>${x[0]}</h2><p>${x[1]}</p>`).join("")}<p class="fine">ผู้ให้บริการ: ${esc(who)} ${esc(s.address || "")} ${s.taxId ? "· " + esc(s.taxId) : ""}</p></section>`;
};
})(window.EE);
