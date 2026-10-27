/* NM Studio — "before / after" menu showcase (self-contained: injects its own section after #problems).
   Scenes: 1) dated paper menu  2) QR card on the table  3) the premium digital menu in a phone (live, auto-scrolling iframe).
   Safety: everything is visible by default; the one-scene-at-a-time mode is only switched on once IntersectionObserver works.
   To change the demo menu, edit /nm/demo-menu/. Texts for all 5 site languages are in T below. */
(function () {
  "use strict";
  var script = document.currentScript;
  var BASE = script ? new URL("../../", script.src) : new URL("../", location.href); /* → /nm/ */
  var DEMO = new URL("demo-menu/", BASE).href;

  var T = {
    th: { eb: "ก่อน · หลัง", t: "เมนูเก่าที่อ่านยาก <em>กลายเป็นเมนูที่ลูกค้าอยากสั่ง</em>", c: ["<b>เมนูแบบเดิม</b> ตัวหนังสือแน่น รูปไม่ชัด คำแปลผิด นักท่องเที่ยวอ่านไม่ออกและไม่กล้าสั่ง", "<b>วาง QR ที่โต๊ะ</b> ลูกค้าสแกนครั้งเดียว ไม่ต้องดาวน์โหลดแอป", "<b>เมนูสวย 7 ภาษา</b> รูปจัดเป็นระเบียบ บอกความเผ็ดและสิ่งที่แพ้ สั่งง่ายขึ้น"], b: "ก่อน", q: "สแกนเลย", a: "หลัง", rp: "เล่นอีกครั้ง", cta: "เปิดเมนูตัวอย่างเต็ม", stamp: "อ่านไม่ออก", stampS: "TOURISTS CAN’T READ IT", scan: "สแกนดูเมนู", langs: "7 ภาษา · 7 languages", sample: "ตัวอย่างเมนูเพื่อการนำเสนอ", rest: "บ้านสวน ครัวไทย", ttl: "เมนูก่อนและหลัง" },
    en: { eb: "Before · After", t: "From a dated menu <em>to one guests can’t wait to order from</em>", c: ["<b>The old menu:</b> cramped text, blurry photos, wrong translations. Tourists can’t read it, so they don’t order.", "<b>A QR code on every table.</b> One scan, no app to download.", "<b>A beautiful menu in 7 languages.</b> Photos neatly organised, spice levels and allergens shown, easy to order from."], b: "Before", q: "Scan", a: "After", rp: "Replay", cta: "Open the full sample menu", stamp: "CAN’T READ IT", stampS: "TOURISTS GIVE UP", scan: "Scan for menu", langs: "7 languages", sample: "Sample menu for illustration", rest: "Baan Suan Thai Kitchen", ttl: "Menu before and after" },
    fr: { eb: "Avant · Après", t: "D’un menu dépassé <em>à un menu qui donne envie de commander</em>", c: ["<b>L’ancien menu :</b> texte serré, photos floues, traductions fausses. Les touristes ne le lisent pas, donc ne commandent pas.", "<b>Un QR code sur chaque table.</b> Un seul scan, aucune appli à télécharger.", "<b>Un beau menu en 7 langues.</b> Photos bien rangées, niveau de piment et allergènes indiqués, simple pour commander."], b: "Avant", q: "Scanner", a: "Après", rp: "Rejouer", cta: "Ouvrir le menu d’exemple complet", stamp: "ILLISIBLE", stampS: "LES TOURISTES ABANDONNENT", scan: "Scannez le menu", langs: "7 langues", sample: "Menu d’exemple pour illustration", rest: "Baan Suan Thai Kitchen", ttl: "Menu avant et après" },
    it: { eb: "Prima · Dopo", t: "Da un menu datato <em>a un menu che fa venire voglia di ordinare</em>", c: ["<b>Il vecchio menu:</b> testo fitto, foto sfocate, traduzioni sbagliate. I turisti non lo leggono e non ordinano.", "<b>Un QR code su ogni tavolo.</b> Una scansione, nessuna app da scaricare.", "<b>Un bel menu in 7 lingue.</b> Foto ben ordinate, livello di piccantezza e allergeni indicati, facile da ordinare."], b: "Prima", q: "Scansiona", a: "Dopo", rp: "Rivedi", cta: "Apri il menu di esempio completo", stamp: "ILLEGGIBILE", stampS: "I TURISTI RINUNCIANO", scan: "Scansiona il menu", langs: "7 lingue", sample: "Menu di esempio a scopo illustrativo", rest: "Baan Suan Thai Kitchen", ttl: "Menu prima e dopo" },
    ar: { eb: "قبل · بعد", t: "من قائمة طعام قديمة <em>إلى قائمة تجعل الضيوف يرغبون في الطلب</em>", c: ["<b>القائمة القديمة:</b> نص مزدحم وصور غير واضحة وترجمات خاطئة. لا يستطيع السياح قراءتها فلا يطلبون.", "<b>رمز QR على كل طاولة.</b> مسح واحد، دون تحميل أي تطبيق.", "<b>قائمة جميلة بسبع لغات.</b> صور منظمة، ومستوى الحرارة والمواد المسببة للحساسية موضحة، وطلب أسهل."], b: "قبل", q: "امسح", a: "بعد", rp: "إعادة التشغيل", cta: "افتح القائمة النموذجية كاملة", stamp: "غير مقروءة", stampS: "السياح يتخلّون", scan: "امسح للقائمة", langs: "7 لغات", sample: "قائمة نموذجية للتوضيح", rest: "بان سوان", ttl: "القائمة قبل وبعد" }
  };
  // Thai site: the "before" photo is a worn menu written only in Thai
  if (/\/nm\/th(-fr)?\//.test(location.pathname)) {
    T.th.c[0] = "<b>เมนูแบบเดิม</b> กระดาษเก่า ราคาแก้ด้วยปากกา และมีแต่ภาษาไทย นักท่องเที่ยวอ่านไม่ออก เลยไม่กล้าสั่ง";
    T.fr.c[0] = "<b>Le menu d’aujourd’hui :</b> papier usé, prix corrigés au stylo, et tout en thaï. Les touristes ne peuvent pas le lire, alors ils n’osent pas commander.";
    T.fr.stampS = "LES TOURISTES NE PEUVENT PAS LIRE";
  }
  var DUR = [4600, 3800, 10500];

  function lang() { var l = (document.documentElement.lang || "en").slice(0, 2).toLowerCase(); return T[l] ? l : "en"; }
  function menuLang(l) { return l === "th" ? "th" : l === "fr" ? "fr" : "en"; }

  var sec, io, timer, step = 0, auto = true, started = false, qrDone = false;

  function build() {
    var l = lang(), x = T[l];
    sec = document.createElement("section");
    sec.className = "mba"; sec.id = "menu-ba"; sec.setAttribute("aria-labelledby", "mbaTitle");
    sec.innerHTML =
      '<div class="container">' +
        '<div class="section-head section-head--center"><p class="eyebrow" data-k="eb"></p><h2 class="section-title" id="mbaTitle" data-k="t"></h2></div>' +
        '<div class="mba__stage">' +
          '<div class="mba__scene mba__scene--before"><span class="mba__tag" data-k="b"></span>' + oldMenu() + '<p class="mba__scap" data-c="0"></p></div>' +
          '<div class="mba__scene mba__scene--qr"><span class="mba__tag" data-k="q"></span>' + tent() + '<p class="mba__scap" data-c="1"></p></div>' +
          '<div class="mba__scene mba__scene--after"><span class="mba__tag" data-k="a"></span>' +
            '<div class="mphone"><div class="mphone__screen"><iframe title="' + x.ttl + '" loading="lazy" tabindex="-1"></iframe></div></div><p class="mba__scap" data-c="2"></p></div>' +
        '</div>' +
        '<div class="mba__cap" aria-live="polite"><p id="mbaLive"></p>' +
          '<div class="mba__dots"><button type="button" data-go="1" aria-label="1"></button><button type="button" data-go="2" aria-label="2"></button><button type="button" data-go="3" aria-label="3"></button></div><button type="button" class="mba__replay" data-replay></button></div>' +
        '<p class="mba__cta"><a class="btn btn--sun btn--lg" id="mbaCta" target="_blank" rel="noopener"><span data-k="cta"></span></a></p>' +
      '</div>';
    var anchor = document.getElementById("problems");
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(sec, anchor.nextSibling);
    else { var w = document.getElementById("work"); if (!w) return false; w.parentNode.insertBefore(sec, w); }
    text(); return true;
  }

  function oldMenu() {
    // Thai site (and its French reading copy): a photo-like worn paper menu, all in Thai — what owners really have today
    if (/\/nm\/th(-fr)?\//.test(location.pathname)) {
      var img = new URL("assets/img/", BASE).href;
      return '<div class="old old--photo" aria-hidden="true"><img src="' + img + 'old-menu-th.webp" srcset="' + img + 'old-menu-th-520.webp 520w, ' + img + 'old-menu-th.webp 900w" sizes="(min-width: 900px) 340px, 82vw" alt="" loading="lazy" decoding="async" width="900" height="1125">' +
        '<div class="old__stamp" data-stamp></div></div>';
    }
    return '<div class="old" aria-hidden="true">' +
      '<div class="old__t">MENU</div><div class="old__sub">~ Thai food · Chinese food · Europe food ~</div>' +
      '<div class="old__cols"><div>' +
        '<h5>Rice &amp; noodle</h5>' +
        '<p><span>ข้าวผัดกะเพรา<i>Fry rice basil pig</i></span><span>60</span></p>' +
        '<p><span>ผัดไทยกุ้ง<i>Pad thai shrimp fried</i></span><span>80</span></p>' +
        '<p><span>ก๋วยเตี๋ยวต้มยำ<i>Noodle yam yam</i></span><span>70</span></p>' +
        '<h5 class="b">Soup / Curry</h5>' +
        '<p><span>ต้มยำกุ้ง<i>Tom yam shrimp soap</i></span><span>120</span></p>' +
        '<p><span>แกงเขียวหวาน<i>Curry green sweet chicken</i></span><span>90</span></p>' +
      '</div><div>' +
        '<h5 class="b">Hot Hot!!</h5>' +
        '<p><span>ส้มตำไทย<i>Papaya hit hit</i></span><span>50</span></p>' +
        '<p><span>ไก่ทอด<i>Chicken fly</i></span><span>70</span></p>' +
        '<p><span>ปลาทอดน้ำปลา<i>Fish fire sauce</i></span><span>150</span></p>' +
        '<h5>Dessert</h5>' +
        '<p><span>ข้าวเหนียวมะม่วง<i>Mango sticky</i></span><span>70</span></p>' +
        '<p><span>น้ำมะพร้าว<i>Coconut water</i></span><span>40</span></p>' +
      '</div></div>' +
      '<div class="old__ph"><b></b><b></b><b></b></div>' +
      '<div class="old__foot">*Price can change without notice*  Cash only</div>' +
      '<div class="old__stamp" data-stamp></div></div>';
  }

  function tent() {
    var fl = ["#d52b1e", "#de2910", "#138808", "#0039a6", "#cc0001", "#a51931", "#1f3c88"].map(function (c) { return '<s style="background:' + c + '"></s>'; }).join("");
    return '<div class="tent" aria-hidden="true"><div class="tent__n" data-rest></div>' +
      '<div class="tent__qr" id="mbaQr"><i></i><i></i><i></i><i></i><span class="tent__beam"></span></div>' +
      '<div class="tent__scan" data-scan></div><div class="tent__langs" data-langs></div><div class="tent__fl">' + fl + '</div></div>';
  }

  function text() {
    var l = lang(), x = T[l];
    sec.setAttribute("lang", l);
    [].forEach.call(sec.querySelectorAll("[data-k]"), function (e) { e.innerHTML = x[e.getAttribute("data-k")]; });
    [].forEach.call(sec.querySelectorAll("[data-c]"), function (e) { e.innerHTML = x.c[+e.getAttribute("data-c")]; });
    var q = function (s) { return sec.querySelector(s); };
    q("[data-stamp]").innerHTML = x.stamp + "<small>" + x.stampS + "</small>";
    q("[data-rest]").innerHTML = '<span>' + x.rest.split(" ").slice(0, 2).join(" ") + '</span><em>' + x.rest.split(" ").slice(2).join(" ") + "</em>";
    q("[data-scan]").textContent = x.scan; q("[data-langs]").textContent = x.langs;
    q("[data-replay]").textContent = x.rp;
    q("#mbaCta").href = DEMO + "?lang=" + menuLang(l);
    var f = q("iframe"); var want = DEMO + "?embed=1&auto=1&theme=sage&lang=" + menuLang(l);
    if (f.dataset.want !== want) { f.dataset.want = want; if (f.dataset.loaded) f.src = want; }
    sec.setAttribute("dir", document.documentElement.getAttribute("dir") || "ltr");
  }

  function makeQr() {
    if (qrDone) return; qrDone = true;
    var el = document.getElementById("mbaQr");
    function draw() { try { new QRCode(el, { text: DEMO, width: 300, height: 300, colorDark: "#0b0c16", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M }); } catch (e) {} }
    if (window.QRCode) draw();
    else { var s = document.createElement("script"); s.src = new URL("assets/js/qrcode.min.js", BASE).href; s.onload = draw; document.head.appendChild(s); }
  }
  function fit() {
    var scr = sec.querySelector(".mphone__screen"), f = sec.querySelector("iframe"); if (!scr || !f || !scr.clientWidth) return;
    var k = scr.clientWidth / 390; f.style.width = "390px"; f.style.height = ((scr.clientHeight - 30) / k) + "px"; f.style.transform = "scale(" + k + ")";
  }
  function loadFrame() { var f = sec.querySelector("iframe"); if (!f.dataset.loaded) { f.dataset.loaded = "1"; f.addEventListener("load", syncFrame); f.src = f.dataset.want; } }

  /* the embedded menu only auto-scrolls while its phone is on screen and its scene is showing */
  var secOn = false;
  function syncFrame() {
    var f = sec.querySelector("iframe"); if (!f || !f.contentWindow) return;
    var on = secOn && (!sec.classList.contains("mba--js") || step === 3);
    try { f.contentWindow.postMessage(on ? "nm-play" : "nm-pause", location.origin); } catch (e) {}
  }
  function show(n) {
    step = n; sec.setAttribute("data-step", String(n)); syncFrame();
    var live = sec.querySelector("#mbaLive"); if (live) live.innerHTML = T[lang()].c[n - 1];
    var sc = sec.querySelector(n === 1 ? ".mba__scene--before" : n === 2 ? ".mba__scene--qr" : ".mba__scene--after"), st = sec.querySelector(".mba__stage");
    if (sc && st && matchMedia("(max-width: 860px)").matches && sec.classList.contains("mba--js")) st.style.height = (sc.offsetHeight + 8) + "px"; else if (st) st.style.height = "";
    [].forEach.call(sec.querySelectorAll("[data-go]"), function (b) { b.setAttribute("aria-current", +b.getAttribute("data-go") === n ? "true" : "false"); });
  }
  function play(from) {
    clearTimeout(timer); auto = true; var n = from || 1; show(n);
    (function next() { timer = setTimeout(function () { n = n % 3 + 1; show(n); if (auto) next(); }, DUR[n - 1]); })();
  }
  function stop() { auto = false; clearTimeout(timer); }

  function start() {
    if (started) return; started = true;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return; /* static mode: the 3 scenes stay stacked, each with its own caption */
    sec.classList.add("mba--js"); play(1);
  }

  /* Thai site (and its French copy): a still, simple version anyone understands at a glance, no animation —
     before photo → after phone screenshot, then 3 big steps. Mourad (2026-10-27): "simple pour tout le monde, même les vieux". */
  var S = {
    th: { t: "เมนูกระดาษ <em>→ เมนูในมือถือ</em>", b: "ก่อน", bc: "เมนูภาษาไทยอย่างเดียว นักท่องเที่ยวอ่านไม่ออก", a: "หลัง", ac: "นักท่องเที่ยวเห็นเมนูเป็นภาษาของเขา พร้อมรูปอาหาร",
      q: "สแกน", s: [["สแกน", "ลูกค้าสแกน QR บนโต๊ะ ด้วยกล้องมือถือ"], ["เลือกภาษา", "อังกฤษ จีน รัสเซีย เกาหลี ฝรั่งเศส หรือไทย"], ["ดูรูปแล้วสั่ง", "กดให้พนักงานดู เป็นภาษาไทย"]], cta: "ลองเปิดเมนูตัวอย่าง" },
    fr: { t: "Menu papier <em>→ menu dans le téléphone</em>", b: "Avant", bc: "Menu tout en thaï : les touristes ne peuvent pas le lire", a: "Après", ac: "Le touriste voit le menu dans sa langue, avec les photos",
      q: "Scanner", s: [["Scanner", "Le client scanne le QR sur la table avec l'appareil photo"], ["Choisir la langue", "Anglais, chinois, russe, coréen, français ou thaï"], ["Voir et commander", "Il montre sa commande au serveur, en thaï"]], cta: "Ouvrir le menu d'exemple" }
  };
  var AR = '<span class="mbs__arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M5 12h13m0 0-5-5m5 5-5 5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
  function simple() {
    var img = new URL("assets/img/", BASE).href, MAE = new URL("../menus/mae-lek/", BASE).href;
    sec = document.createElement("section");
    sec.className = "mbs"; sec.id = "menu-ba"; sec.setAttribute("aria-labelledby", "mbsTitle");
    function fill() {
      var l = document.documentElement.lang === "fr" ? "fr" : "th", x = S[l];
      sec.setAttribute("lang", l);
      sec.innerHTML = '<div class="container">' +
        '<h2 class="section-title mbs__t" id="mbsTitle">' + x.t + "</h2>" +
        '<div class="mbs__ba">' +
          '<figure class="mbs__col"><span class="mbs__tag mbs__tag--b">' + x.b + '</span><div class="mbs__pic mbs__pic--old"><img src="' + img + 'old-menu-th-520.webp" srcset="' + img + "old-menu-th-520.webp 520w, " + img + 'old-menu-th.webp 900w" sizes="(min-width: 760px) 320px, 44vw" alt="" loading="lazy" decoding="async" width="900" height="1125"></div><figcaption>' + x.bc + "</figcaption></figure>" +
          '<div class="mbs__mid">' + AR + '<figure class="mbs__qr"><span class="mbs__qrbox" id="mbsQr" role="img" aria-label="QR"></span><figcaption>' + x.q + "</figcaption></figure>" + AR + "</div>" +
          '<figure class="mbs__col"><span class="mbs__tag mbs__tag--a">' + x.a + '</span><div class="mbs__pic mbs__phone"><img src="' + img + 'menu-after-en-390.webp" srcset="' + img + "menu-after-en-390.webp 390w, " + img + 'menu-after-en.webp 780w" sizes="(min-width: 760px) 300px, 44vw" alt="" loading="lazy" decoding="async" width="780" height="1560"></div><figcaption>' + x.ac + "</figcaption></figure>" +
        "</div>" +
        '<ol class="mbs__steps">' + x.s.map(function (s, i) { return '<li><b class="mbs__n">' + (i + 1) + "</b><span><strong>" + s[0] + "</strong>" + s[1] + "</span></li>"; }).join("") + "</ol>" +
        '<p class="mbs__cta"><a class="btn btn--sun btn--lg" href="' + MAE + "?lang=" + (l === "fr" ? "fr" : "en") + '" target="_blank" rel="noopener"><span>' + x.cta + "</span></a></p></div>";
    }
    fill();
    function qr() { var el = sec.querySelector("#mbsQr"); if (!el || el.firstChild) return; try { new QRCode(el, { text: MAE, width: 240, height: 240, colorDark: "#0b0c16", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M }); } catch (e) {} }
    if (window.QRCode) qr(); else { var sc = document.createElement("script"); sc.src = new URL("assets/js/qrcode.min.js", BASE).href; sc.onload = qr; document.head.appendChild(sc); }
    document.addEventListener("nm:lang", function () { if (window.QRCode) qr(); });
    var anchor = document.getElementById("problems");
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(sec, anchor.nextSibling);
    else { var w = document.getElementById("work"); if (!w) return; w.parentNode.insertBefore(sec, w); }
    document.addEventListener("nm:lang", fill);
  }

  function init() {
    if (/\/nm\/th(-fr)?\//.test(location.pathname)) { simple(); return; }
    if (!build()) return;
    makeQr(); fit(); addEventListener("resize", fit); if (window.ResizeObserver) new ResizeObserver(fit).observe(sec.querySelector(".mphone"));
    sec.addEventListener("click", function (e) {
      var g = e.target.closest("[data-go]"); if (g) { stop(); show(+g.getAttribute("data-go")); return; }
      if (e.target.closest("[data-replay]")) { sec.classList.add("mba--js"); play(1); }
    });
    if ("IntersectionObserver" in window) {
      var near = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { loadFrame(); near.disconnect(); } }); }, { rootMargin: "700px 0px" });
      near.observe(sec);
      io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          secOn = e.isIntersecting; syncFrame();
          if (e.isIntersecting) { if (!started) start(); else if (sec.classList.contains("mba--js") && !auto && false) play(step); }
          else if (started && auto) { /* pause while off-screen */ clearTimeout(timer); sec.dataset.paused = "1"; }
          if (e.isIntersecting && sec.dataset.paused) { delete sec.dataset.paused; if (auto && sec.classList.contains("mba--js")) play(step || 1); }
        });
      }, { threshold: .35 });
      io.observe(sec);
    } else { loadFrame(); }
    document.addEventListener("nm:lang", text);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
