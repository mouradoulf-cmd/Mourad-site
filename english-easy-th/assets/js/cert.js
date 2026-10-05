/* English Easy TH — certificate of completion (canvas → PNG). Available to Pro learners once every lesson is done. */
(function (EE) {
"use strict";
const S = EE.state();
EE.certReady = () => EE.LESSONS.every(l => S.done[l.id]);
EE.drawCert = function (cv) {
  const W = cv.width = 1600, H = cv.height = 1131, c = cv.getContext("2d");
  const g = c.createLinearGradient(0, 0, W, H); g.addColorStop(0, "#12061f"); g.addColorStop(.5, "#2d1654"); g.addColorStop(1, "#12061f"); c.fillStyle = g; c.fillRect(0, 0, W, H);
  for (let i = 0; i < 160; i++) { c.globalAlpha = Math.random() * .6; c.fillStyle = ["#c4b5fd", "#fde047", "#fff"][i % 3]; c.beginPath(); c.arc(Math.random() * W, Math.random() * H, Math.random() * 2 + .4, 0, 7); c.fill(); } c.globalAlpha = 1;
  const bg = c.createLinearGradient(0, 0, W, 0); bg.addColorStop(0, "#fde047"); bg.addColorStop(.5, "#f472b6"); bg.addColorStop(1, "#a78bfa");
  c.strokeStyle = bg; c.lineWidth = 6; c.strokeRect(46, 46, W - 92, H - 92); c.lineWidth = 1.5; c.strokeRect(66, 66, W - 132, H - 132);
  c.textAlign = "center"; c.fillStyle = "#fff";
  c.font = "700 30px Nunito, sans-serif"; c.letterSpacing = "10px"; c.fillStyle = "#c4b5fd"; c.fillText("ENGLISH EASY", W / 2, 190);
  c.letterSpacing = "0px"; c.fillStyle = "#fff"; c.font = "900 92px Nunito, sans-serif"; c.fillText("CERTIFICATE", W / 2, 330);
  c.font = "700 34px Nunito, sans-serif"; c.fillStyle = "#fde047"; c.letterSpacing = "8px"; c.fillText("OF COMPLETION", W / 2, 385); c.letterSpacing = "0px";
  c.fillStyle = "#b9a6e0"; c.font = "400 30px 'Noto Sans Thai', Nunito, sans-serif"; c.fillText("ขอมอบใบรับรองนี้แก่", W / 2, 490);
  c.fillStyle = bg; c.font = "900 110px 'Noto Sans Thai', Nunito, sans-serif"; c.fillText(S.name || "Learner", W / 2, 640);
  c.strokeStyle = "rgba(255,255,255,.35)"; c.lineWidth = 2; c.beginPath(); c.moveTo(W / 2 - 360, 675); c.lineTo(W / 2 + 360, 675); c.stroke();
  c.fillStyle = "#fff"; c.font = "400 34px 'Noto Sans Thai', Nunito, sans-serif"; c.fillText("ที่เรียนจบหลักสูตรภาษาอังกฤษ English Easy ระดับ A1–A2", W / 2, 750);
  c.fillStyle = "#b9a6e0"; c.font = "400 28px Nunito, sans-serif"; c.fillText(EE.LESSONS.length + " lessons · " + EE.UNITS.length + " units · " + S.xp + " XP · " + Object.keys(S.learned).length + " words", W / 2, 810);
  const d = new Date(), ds = d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  c.fillStyle = "#fff"; c.font = "700 30px Nunito, sans-serif"; c.fillText(ds, W / 2, 930);
  let h = 0; const key = (S.name || "") + ds + S.xp; for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  c.fillStyle = "#7c6aa8"; c.font = "400 22px ui-monospace, monospace"; c.fillText("ID EE-" + h.toString(16).toUpperCase().padStart(8, "0") + "  ·  certificate issued by the English Easy app (not an official qualification)", W / 2, 1010);
};
EE.certView = function (root) {
  const ok = EE.certReady();
  root.innerHTML = `<section class="page"><h1>🎓 ใบรับรอง</h1>${ok ? `<p class="lead">ยินดีด้วย! คุณเรียนจบทุกบทแล้ว ดาวน์โหลดใบรับรองของคุณได้เลย</p><canvas id="cert" class="cert" aria-label="ใบรับรอง"></canvas><div class="cert__b"><button class="btn btn--gold btn--lg" id="cert-dl">⬇️ ดาวน์โหลด PNG</button></div><p class="fine">ใบรับรองจากแอป English Easy ไม่ใช่วุฒิการศึกษาทางการ</p>` : `<p class="lead">เรียนให้ครบทุกบท (${EE.LESSONS.filter(l => S.done[l.id]).length}/${EE.LESSONS.length}) เพื่อรับใบรับรองจบคอร์ส</p><div class="gems-box">🎓 ${Math.round(EE.LESSONS.filter(l => S.done[l.id]).length / EE.LESSONS.length * 100)}%</div>`}</section>`;
  if (ok) { const cv = document.getElementById("cert"); (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => EE.drawCert(cv)); document.getElementById("cert-dl").onclick = () => { const a = document.createElement("a"); a.download = "English-Easy-Certificate.png"; a.href = cv.toDataURL("image/png"); a.click(); EE.confetti(); }; }
};
})(window.EE);
