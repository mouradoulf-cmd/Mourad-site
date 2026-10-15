/* NM Studio — "Votre site, en direct" : the visitor types the name of their business, picks an activity, and a
 * real demo site opens inside a laptop + phone, with their name in it (demo-name.js on the demo, ?n=Name).
 * Self-contained: injects its own section after #work and its own styles. Texts in en / fr / it / th / ar. */
(function () {
  "use strict";
  var work = document.getElementById("work");
  if (!work || document.getElementById("live")) return;

  var lang = (document.documentElement.lang || "en").slice(0, 2);
  var rtl = document.documentElement.dir === "rtl";
  var ROOT = (function () { var s = document.currentScript && document.currentScript.src; return s ? s.replace(/nm\/assets\/js\/live-preview\.js.*$/, "") : "../../"; })();

  var T = {
    en: { eye: "Live preview", t1: "Your website,", t2: "live.", lead: "Type the name of your business, pick your activity: your future website appears right before your eyes. Free, no sign-up.",
      ph: "Your business name", go: "Show my website", empty: "Your website will appear here", note: "Mock-up made live for", by: "by NM Studio. Real design, real speed, your name.",
      want: "I want this website", full: "Open full screen", copied: "Message copied, paste it in WhatsApp", again: "Try another activity",
      msg: "Hello Mourad, I just saw the mock-up of my website on NM Studio: {n} ({t}). I'm interested, can we talk?",
      types: ["Restaurant", "Bar & nightlife", "Spa & massage", "Hair & beauty", "Rentals"], loading: "Building your website…" },
    fr: { eye: "Essai en direct", t1: "Votre site,", t2: "en direct.", lead: "Tapez le nom de votre commerce, choisissez votre activité : votre futur site apparaît sous vos yeux. Gratuit, sans inscription.",
      ph: "Le nom de votre commerce", go: "Voir mon site", empty: "Votre site s'affichera ici", note: "Maquette réalisée en direct pour", by: "par NM Studio. Vrai design, vraie vitesse, votre nom.",
      want: "Je veux ce site", full: "Ouvrir en plein écran", copied: "Message copié, collez-le dans WhatsApp", again: "Essayer une autre activité",
      msg: "Bonjour Mourad, je viens de voir la maquette de mon site sur NM Studio : {n} ({t}). Ça m'intéresse, on en parle ?",
      types: ["Restaurant", "Bar & soirées", "Spa & massage", "Coiffure & beauté", "Location"], loading: "On construit votre site…" },
    it: { eye: "Prova dal vivo", t1: "Il tuo sito,", t2: "dal vivo.", lead: "Scrivi il nome della tua attività, scegli il settore: il tuo futuro sito appare davanti ai tuoi occhi. Gratis, senza registrazione.",
      ph: "Il nome della tua attività", go: "Mostra il mio sito", empty: "Il tuo sito apparirà qui", note: "Bozza creata dal vivo per", by: "da NM Studio. Vero design, vera velocità, il tuo nome.",
      want: "Voglio questo sito", full: "Apri a schermo intero", copied: "Messaggio copiato, incollalo su WhatsApp", again: "Prova un altro settore",
      msg: "Ciao Mourad, ho appena visto la bozza del mio sito su NM Studio: {n} ({t}). Mi interessa, ne parliamo?",
      types: ["Ristorante", "Bar & serate", "Spa & massaggi", "Parrucchiere & bellezza", "Noleggio"], loading: "Stiamo creando il tuo sito…" },
    th: { eye: "ทดลองดูสด", t1: "เว็บไซต์ของคุณ", t2: "ดูได้ทันที", lead: "พิมพ์ชื่อร้านของคุณ เลือกประเภทธุรกิจ แล้วเว็บไซต์ในอนาคตของคุณจะปรากฏตรงหน้า ฟรี ไม่ต้องสมัคร",
      ph: "ชื่อร้านของคุณ", go: "ดูเว็บไซต์ของฉัน", empty: "เว็บไซต์ของคุณจะแสดงที่นี่", note: "แบบร่างที่ทำสดสำหรับ", by: "โดย NM Studio ดีไซน์จริง ความเร็วจริง ชื่อของคุณ",
      want: "ฉันอยากได้เว็บไซต์นี้", full: "เปิดเต็มจอ", copied: "คัดลอกข้อความแล้ว วางใน WhatsApp ได้เลย", again: "ลองประเภทอื่น",
      msg: "สวัสดีครับคุณ Mourad ฉันเพิ่งดูแบบร่างเว็บไซต์ของฉันบน NM Studio: {n} ({t}) สนใจครับ คุยกันได้ไหม",
      types: ["ร้านอาหาร", "บาร์ & ปาร์ตี้", "สปา & นวด", "ร้านทำผม & ความงาม", "ให้เช่า"], loading: "กำลังสร้างเว็บไซต์ของคุณ…" },
    ar: { eye: "تجربة مباشرة", t1: "موقعك،", t2: "مباشرةً.", lead: "اكتب اسم نشاطك التجاري واختر مجالك: موقعك المستقبلي يظهر أمام عينيك. مجاناً، بدون تسجيل.",
      ph: "اسم نشاطك التجاري", go: "اعرض موقعي", empty: "سيظهر موقعك هنا", note: "نموذج أُنجز مباشرةً لـ", by: "بواسطة NM Studio. تصميم حقيقي، سرعة حقيقية، واسمك.",
      want: "أريد هذا الموقع", full: "فتح بملء الشاشة", copied: "تم نسخ الرسالة، الصقها في واتساب", again: "جرّب مجالاً آخر",
      msg: "مرحباً مراد، رأيت للتو نموذج موقعي على NM Studio: {n} ({t}). أنا مهتم، هل نتحدث؟",
      types: ["مطعم", "بار وسهرات", "سبا ومساج", "تصفيف وتجميل", "تأجير"], loading: "نُنشئ موقعك…" }
  };
  var L = T[lang] || T.en;
  // activity -> demo folder (all use ../demo-name.js, so ?n= puts the visitor's name in the site)
  var DEMOS = ["street-food/", "neon-tiger/", "v6-thai-spa/", "noir/", "scooter/"];
  var ICONS = [
    '<path d="M7 3v8a2 2 0 0 0 2 2v8M9 3v6M5 3v6M5 9h4M17 3c-2 0-3 2-3 6s1 4 3 4v8"/>',
    '<path d="M5 4h14l-7 8zM12 12v8M8 20h8"/>',
    '<path d="M12 21c-4-3-7-6-7-10a7 7 0 0 1 14 0c0 4-3 7-7 10z"/><path d="M12 7v6M9 10h6"/>',
    '<circle cx="6" cy="7" r="3"/><circle cx="6" cy="17" r="3"/><path d="M8.5 8.5 20 18M8.5 15.5 20 6"/>',
    '<circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17l4-8h5l3 8M10 9 8 5H5"/>'
  ];

  /* ---------- styles ---------- */
  var css = [
    ".lv{position:relative;padding:clamp(4.5rem,10vw,8rem) 0;overflow:hidden;isolation:isolate}",
    ".lv:before{content:'';position:absolute;inset:auto -20% 10% -20%;height:70%;z-index:-1;background:radial-gradient(60% 60% at 50% 60%,rgba(201,169,97,.16),transparent 70%);pointer-events:none}",
    ".lv__head{text-align:center;max-width:46rem;margin:0 auto}",
    ".lv__eye{display:inline-flex;align-items:center;gap:.6rem;font:600 .72rem/1 var(--font-sans);letter-spacing:.22em;text-transform:uppercase;color:var(--gold-soft)}",
    ".lv__eye i{width:8px;height:8px;border-radius:50%;background:#3ddc84;box-shadow:0 0 0 0 rgba(61,220,132,.6);animation:lvPulse 1.8s infinite}",
    "@keyframes lvPulse{70%{box-shadow:0 0 0 10px rgba(61,220,132,0)}100%{box-shadow:0 0 0 0 rgba(61,220,132,0)}}",
    ".lv__h{margin:1rem 0 0;font:700 clamp(2.3rem,6vw,4.4rem)/1.02 var(--font-display);letter-spacing:-.035em;color:var(--text)}",
    ".lv__h em{display:block;font:italic 400 1.02em/1.05 var(--font-serif);letter-spacing:-.02em;background:var(--grad-gold);-webkit-background-clip:text;background-clip:text;color:transparent}",
    ".lv__lead{margin:1.1rem auto 0;max-width:36rem;color:var(--muted);font-size:1.05rem;line-height:1.6}",
    ".lv__form{margin:2.2rem auto 0;max-width:46rem;padding:1rem;border-radius:var(--radius-lg);background:var(--glass);box-shadow:var(--shadow-1);display:grid;gap:.9rem}",
    ".lv__row{display:flex;gap:.6rem}",
    ".lv__in{flex:1;min-width:0;height:3.4rem;padding:0 1.2rem;border-radius:var(--radius-md);border:1px solid var(--line-strong);background:rgba(10,10,11,.6);color:var(--text);font:500 1.08rem var(--font-sans);outline:none;transition:border-color .2s,box-shadow .2s}",
    ".lv__in:focus{border-color:var(--gold);box-shadow:0 0 0 4px rgba(201,169,97,.18)}",
    ".lv__go{flex:none;height:3.4rem;padding:0 1.4rem;border:0;border-radius:var(--radius-md);background:var(--grad-btn);color:var(--btn-ink);font:700 1rem var(--font-sans);cursor:pointer;display:inline-flex;align-items:center;gap:.5rem;transition:transform .2s,filter .2s,opacity .2s}",
    ".lv__go:hover{transform:translateY(-1px);filter:brightness(1.06)}.lv__go:disabled{opacity:.45;cursor:not-allowed;transform:none}",
    ".lv__go svg{width:18px;height:18px}",
    ".lv__chips{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center}",
    ".lv__chip{display:inline-flex;align-items:center;gap:.45rem;padding:.55rem .95rem;border-radius:999px;border:0;background:rgba(245,241,232,.05);box-shadow:inset 0 0 0 1px var(--line-strong);color:var(--muted);font:600 .88rem var(--font-sans);cursor:pointer;transition:color .2s,background .2s,box-shadow .2s}",
    ".lv__chip svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}",
    ".lv__chip[aria-pressed=true]{color:var(--ink-on-gold);background:var(--grad-gold);box-shadow:none}",
    ".lv__stage{position:relative;margin:3rem auto 0;max-width:1100px;display:grid;grid-template-columns:1fr 23%;gap:2.2%;align-items:end}",
    ".lv__mac{position:relative}",
    ".lv__lid{position:relative;border-radius:16px 16px 6px 6px;padding:1.1% 1.1% 0;background:linear-gradient(180deg,#2a2827,#151415);box-shadow:var(--shadow-2)}",
    ".lv__bar{display:flex;align-items:center;gap:.55rem;height:30px;padding:0 .7rem;border-radius:10px 10px 0 0;background:#1d1c1f}",
    ".lv__dots{display:flex;gap:5px}.lv__dots b{width:9px;height:9px;border-radius:50%;background:#3a3836}.lv__dots b:nth-child(1){background:#ff5f57}.lv__dots b:nth-child(2){background:#febc2e}.lv__dots b:nth-child(3){background:#28c840}",
    ".lv__url{flex:1;max-width:60%;margin:0 auto;height:20px;border-radius:6px;background:#0f0e10;color:var(--muted);font:500 .74rem/20px var(--font-sans);text-align:center;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;direction:ltr}",
    ".lv__url b{color:var(--text);font-weight:600}",
    ".lv__screen{position:relative;aspect-ratio:16/10;overflow:hidden;background:#0d0c0e}",
    ".lv__base{height:14px;margin:0 -3.5%;border-radius:0 0 18px 18px;background:linear-gradient(180deg,#3a3836,#1b1a1b);box-shadow:0 30px 60px -20px rgba(0,0,0,.9)}",
    ".lv__base:after{content:'';display:block;width:14%;height:5px;margin:0 auto;border-radius:0 0 8px 8px;background:#121113}",
    ".lv__phone{position:relative;border-radius:34px;padding:9px;background:linear-gradient(160deg,#3a3836,#141314);box-shadow:var(--shadow-2);margin-bottom:-6px}",
    ".lv__phone .lv__screen{aspect-ratio:390/844;border-radius:26px}",
    ".lv__phone:before{content:'';position:absolute;top:16px;left:50%;width:28%;height:16px;margin-left:-14%;border-radius:20px;background:#050505;z-index:3}",
    ".lv__frame{position:absolute;left:0;top:0;border:0;transform-origin:0 0;background:#fff;opacity:0;transition:opacity .6s}",
    ".lv__frame.on{opacity:1}",
    ".lv__ph{position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:1.5rem;color:var(--faint);font:600 .95rem var(--font-sans);background:radial-gradient(70% 70% at 50% 40%,rgba(201,169,97,.10),transparent 70%),repeating-linear-gradient(90deg,rgba(245,241,232,.025) 0 1px,transparent 1px 64px),repeating-linear-gradient(0deg,rgba(245,241,232,.025) 0 1px,transparent 1px 64px)}",
    ".lv__ph strong{display:block;margin-top:.6rem;font:italic 400 clamp(1.3rem,3vw,2.2rem)/1.15 var(--font-serif);color:var(--gold-soft);word-break:break-word}",
    ".lv__load{position:absolute;inset:0;display:none;place-items:center;color:var(--gold-soft);font:600 .9rem var(--font-sans);background:rgba(10,10,11,.75);z-index:2}",
    ".lv__load i{display:block;width:34px;height:34px;margin:0 auto .8rem;border-radius:50%;border:3px solid rgba(201,169,97,.25);border-top-color:var(--gold);animation:lvSpin .9s linear infinite}",
    ".is-loading .lv__load{display:grid}@keyframes lvSpin{to{transform:rotate(360deg)}}",
    ".lv__out{max-width:46rem;margin:2.4rem auto 0;text-align:center;display:none}",
    ".lv__out.on{display:block;animation:lvIn .6s cubic-bezier(.2,.8,.2,1)}@keyframes lvIn{from{opacity:0;transform:translateY(12px)}}",
    ".lv__out p{color:var(--muted);margin:0 0 1.2rem}.lv__out p b{color:var(--text)}",
    ".lv__acts{display:flex;flex-wrap:wrap;gap:.7rem;justify-content:center}",
    ".lv__btn{display:inline-flex;align-items:center;gap:.5rem;padding:.95rem 1.35rem;border-radius:999px;font:700 .98rem var(--font-sans);text-decoration:none;border:0;cursor:pointer}",
    ".lv__btn--gold{background:var(--grad-btn);color:var(--btn-ink)}.lv__btn--ghost{background:rgba(245,241,232,.06);color:var(--text);box-shadow:inset 0 0 0 1px var(--line-strong)}",
    ".lv__btn svg{width:18px;height:18px}",
    ".lv__toast{margin-top:.9rem;min-height:1.2em;color:#3ddc84;font-size:.9rem}",
    "@media (max-width:760px){.lv__stage{grid-template-columns:1fr;justify-items:center}.lv__mac{display:none}.lv__phone{width:min(72vw,300px)}.lv__row{flex-direction:column}.lv__go{justify-content:center}}",
    "@media (max-width:760px){.wa-float,.line-float{transition:opacity .3s,transform .3s}.lv-hide-fab .wa-float,.lv-hide-fab .line-float{opacity:0;transform:translateY(20px);pointer-events:none}}",
    "@media (prefers-reduced-motion:reduce){.lv__eye i,.lv__load i{animation:none}.lv__out.on{animation:none}}"
  ].join("\n");
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  /* ---------- markup ---------- */
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' + (rtl ? "M19 12H5M11 6l-6 6 6 6" : "M5 12h14M13 6l6 6-6 6") + '"/></svg>';
  var sec = document.createElement("section");
  sec.className = "lv"; sec.id = "live"; sec.setAttribute("aria-labelledby", "lvTitle");
  sec.innerHTML =
    '<div class="container">' +
      '<div class="lv__head"><span class="lv__eye"><i></i>' + esc(L.eye) + '</span>' +
      '<h2 class="lv__h" id="lvTitle">' + esc(L.t1) + ' <em>' + esc(L.t2) + '</em></h2>' +
      '<p class="lv__lead">' + esc(L.lead) + '</p></div>' +
      '<form class="lv__form" id="lvForm" novalidate>' +
        '<div class="lv__row"><input class="lv__in" id="lvName" type="text" maxlength="40" autocomplete="organization" placeholder="' + esc(L.ph) + '" aria-label="' + esc(L.ph) + '">' +
        '<button class="lv__go" id="lvGo" type="submit" disabled>' + esc(L.go) + arrow + '</button></div>' +
        '<div class="lv__chips" role="group">' + L.types.map(function (t, i) {
          return '<button type="button" class="lv__chip" data-i="' + i + '" aria-pressed="' + (i === 0) + '"><svg viewBox="0 0 24 24">' + ICONS[i] + '</svg>' + esc(t) + '</button>';
        }).join("") + '</div>' +
      '</form>' +
      '<div class="lv__stage" id="lvStage" aria-live="polite">' +
        '<div class="lv__mac"><div class="lv__lid"><div class="lv__bar"><span class="lv__dots"><b></b><b></b><b></b></span><span class="lv__url" id="lvUrl">www.<b>votre-commerce</b>.com</span><span style="width:33px"></span></div>' +
          '<div class="lv__screen" id="lvMac"><div class="lv__ph" id="lvPhMac"><div>' + esc(L.empty) + '<strong id="lvBig"></strong></div></div><div class="lv__load"><div><i></i>' + esc(L.loading) + '</div></div></div></div><div class="lv__base"></div></div>' +
        '<div class="lv__phone"><div class="lv__screen" id="lvPhone"><div class="lv__ph"><div>' + esc(L.empty) + '</div></div><div class="lv__load"><div><i></i></div></div></div></div>' +
      '</div>' +
      '<div class="lv__out" id="lvOut"><p id="lvNote"></p><div class="lv__acts">' +
        '<a class="lv__btn lv__btn--gold" id="lvWant" href="#" target="_blank" rel="noopener">' + esc(L.want) + arrow + '</a>' +
        '<a class="lv__btn lv__btn--ghost" id="lvFull" href="#" target="_blank" rel="noopener">' + esc(L.full) + ' ↗</a></div>' +
        '<div class="lv__toast" id="lvToast" role="status"></div></div>' +
    '</div>';
  work.parentNode.insertBefore(sec, work.nextSibling);

  /* ---------- behaviour ---------- */
  var $ = function (id) { return document.getElementById(id); };
  var input = $("lvName"), go = $("lvGo"), chips = [].slice.call(sec.querySelectorAll(".lv__chip"));
  var type = 0, built = false;
  var defUrl = lang === "fr" ? "votre-commerce" : lang === "it" ? "la-tua-attivita" : "your-business";
  function slug(s) {
    var x = s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9฀-๿؀-ۿ]+/g, "-").replace(/^-+|-+$/g, "");
    return x || defUrl;
  }
  function paintName() {
    var n = input.value.trim();
    $("lvUrl").innerHTML = "www.<b>" + esc(slug(n)) + "</b>.com";
    $("lvBig").textContent = n;
    go.disabled = n.length < 2;
  }
  $("lvUrl").innerHTML = "www.<b>" + defUrl + "</b>.com";
  input.addEventListener("input", paintName);
  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      type = +c.getAttribute("data-i");
      chips.forEach(function (k) { k.setAttribute("aria-pressed", String(k === c)); });
      if (built && input.value.trim().length >= 2) build();
    });
  });

  var mobile = function () { return matchMedia("(max-width:760px)").matches; };
  function frame(box, w, h, src) {
    var old = box.querySelector("iframe"); if (old) old.remove();
    var f = document.createElement("iframe");
    f.className = "lv__frame"; f.width = w; f.height = h; f.loading = "eager"; f.title = L.note;
    f.style.width = w + "px"; f.style.height = h + "px";
    function fit() { var s = box.clientWidth / w; f.style.transform = "scale(" + s + ")"; }
    fit(); if (window.ResizeObserver) new ResizeObserver(fit).observe(box);
    box.classList.add("is-loading");
    f.addEventListener("load", function () { box.classList.remove("is-loading"); f.classList.add("on"); var ph = box.querySelector(".lv__ph"); if (ph) ph.style.display = "none"; });
    f.src = src; box.appendChild(f);
  }
  function waLink(text) {
    var c = window.NM_CONTACT || {};
    if (c.whatsappNumber) return "https://wa.me/" + c.whatsappNumber + "?text=" + encodeURIComponent(text);
    return c.whatsappLink || "https://wa.me/qr/PYPOVXTCVM74I1";
  }
  function build() {
    var n = input.value.trim(); if (n.length < 2) return;
    var src = ROOT + DEMOS[type] + "?n=" + encodeURIComponent(n);
    if (!mobile()) frame($("lvMac"), 1280, 800, src);
    frame($("lvPhone"), 390, 844, src);
    built = true;
    var t = L.types[type];
    $("lvNote").innerHTML = esc(L.note) + " <b>" + esc(n) + "</b> " + esc(L.by);
    $("lvFull").href = src;
    var msg = L.msg.replace("{n}", n).replace("{t}", t);
    var want = $("lvWant"); want.href = waLink(msg);
    want.onclick = function () {
      if (!(window.NM_CONTACT || {}).whatsappNumber && navigator.clipboard) {
        navigator.clipboard.writeText(msg).then(function () { $("lvToast").textContent = L.copied; }, function () {});
      }
    };
    var out = $("lvOut"); out.classList.remove("on"); void out.offsetWidth; out.classList.add("on");
    var stage = $("lvStage"), r = stage.getBoundingClientRect();
    if (r.top < 0 || r.top > innerHeight * .6) stage.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  /* on phones the floating WhatsApp/LINE buttons cover the action buttons: hide them where the page already has its own */
  if ("IntersectionObserver" in window) {
    var seen = new Set();
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) seen.add(e.target); else seen.delete(e.target); });
      document.documentElement.classList.toggle("lv-hide-fab", seen.size > 0);
    }, { rootMargin: "0px 0px -10% 0px" });
    [$("lvOut"), document.getElementById("contact"), document.querySelector("footer")].forEach(function (el) { if (el) io.observe(el); });
  }
  $("lvForm").addEventListener("submit", function (e) { e.preventDefault(); build(); });
})();
