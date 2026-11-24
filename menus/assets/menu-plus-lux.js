/* NM Studio · QR menu "Lux" layer (needs menu-plus.js). Opt-in through NM_MENU.plus:
 *   theme: "noir" | "ivoire" | "trattoria" | "kaiseki" | "bistro" | "tropical" | "modern"   — full identity (palette, type pairing, shapes, grain)
 *   styles: true           — floating "Style" button that lets a prospect see THEIR menu in every identity (sales demos; remove for live clients)
 *   hero3d: true           — WebGL opening photo (parallax drift, light sweep, touch ripple, film grain). Falls back to the plain photo.
 *   fx: true               — "prices in…" chips with live ECB rates (api.frankfurter.dev). Only for menus priced in ฿. No network → chips hidden.
 * Also always on (data-driven, never invented): spice / diet filter chips, sold-out dishes (item.soldout:true), diet badges (item.diet:[...]).
 */
(function () {
  "use strict";
  var M = window.NM_MENU, root = document.getElementById("menu");
  if (!M || !M.plus || !root) return;
  var P = M.plus, qs = new URLSearchParams(location.search);
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ol = M.origLang || M.defaultLang || M.langs[0];
  function L() { var l = document.documentElement.lang || "en"; return l === "zh-Hans" ? "zh" : l; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function sget(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function sset(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  function lget(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lset(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  var byId = {}; M.sections.forEach(function (s, si) { s.items.forEach(function (d) { d._s = si; byId[d.id] = d; }); });

  /* ───────────── 1 · identities ───────────── */
  var TH = {
    noir:      { n: "Noir & Or",        s: "Gastronomique étoilé", bg: "#09090a", ink: "#f2ecdf", accent: "#c8a45c", display: "'Cormorant Garamond','Noto Serif Thai','Noto Serif SC',Georgia,serif", body: "'Jost','Noto Sans Thai','Noto Sans SC',system-ui,sans-serif", f: "Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Jost:wght@300;400;500;600", r: "26px", g: 0.06, dark: 1 },
    ivoire:    { n: "Ivoire",           s: "Palace & hôtel de luxe", bg: "#f2ede3", ink: "#1b1814", accent: "#98763a", display: "'Bodoni Moda','Noto Serif Thai','Noto Serif SC',Georgia,serif", body: "'Manrope','Noto Sans Thai','Noto Sans SC',system-ui,sans-serif", f: "Bodoni+Moda:ital,wght@0,400;0,500;1,400&family=Manrope:wght@300;400;500;600", r: "4px", g: 0.05, dark: 0 },
    trattoria: { n: "Trattoria",        s: "Italien premium", bg: "#0f1612", ink: "#f2ebd9", accent: "#dc8452", display: "'DM Serif Display','Noto Serif Thai','Noto Serif SC',Georgia,serif", body: "'Jost','Noto Sans Thai','Noto Sans SC',system-ui,sans-serif", f: "DM+Serif+Display:ital@0;1&family=Jost:wght@300;400;500;600", r: "22px", g: 0.07, dark: 1 },
    kaiseki:   { n: "Kaiseki",          s: "Japonais haut de gamme", bg: "#0b0b0d", ink: "#eee8dc", accent: "#d8452c", display: "'Shippori Mincho','Noto Serif Thai','Noto Serif JP',Georgia,serif", body: "'Zen Kaku Gothic New','Jost','Noto Sans Thai','Noto Sans SC',system-ui,sans-serif", f: "Shippori+Mincho:wght@400;500;600&family=Zen+Kaku+Gothic+New:wght@300;400;500", r: "2px", g: 0.04, dark: 1 },
    bistro:    { n: "Bistrot",          s: "Français traditionnel", bg: "#190e0f", ink: "#f2e7d6", accent: "#cda35c", display: "'Playfair Display','Noto Serif Thai','Noto Serif SC',Georgia,serif", body: "'Lora','Noto Serif Thai','Noto Serif SC',Georgia,serif", f: "Playfair+Display:ital,wght@0,400;0,500;1,400&family=Lora:wght@400;500;600", r: "14px", g: 0.08, dark: 1 },
    tropical:  { n: "Beach club",       s: "Tropical & solaire", bg: "#071f1e", ink: "#fff4e3", accent: "#ff9a5a", display: "'Fraunces','Noto Serif Thai','Noto Serif SC',Georgia,serif", body: "'DM Sans','Noto Sans Thai','Noto Sans SC',system-ui,sans-serif", f: "Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;1,9..144,400&family=DM+Sans:wght@400;500;600", r: "34px", g: 0.04, dark: 1 },
    modern:    { n: "Contemporain",     s: "Moderne & audacieux", bg: "#0a0a0a", ink: "#ffffff", accent: "#d4ff4f", display: "'Syne','Noto Sans Thai','Noto Sans SC',system-ui,sans-serif", body: "'Space Grotesk','Noto Sans Thai','Noto Sans SC',system-ui,sans-serif", f: "Syne:wght@500;600;700&family=Space+Grotesk:wght@300;400;500;600", r: "8px", g: 0.03, dark: 1 }
  };
  var ORDER = Object.keys(TH);
  var cur = TH[qs.get("theme")] ? qs.get("theme") : (TH[sget("pl-theme")] && P.styles ? sget("pl-theme") : (TH[P.theme] ? P.theme : null));
  // each identity's fonts are fetched once; the promise resolves when they are ready (or after 800 ms, whichever comes first)
  var fontP = {};
  function fonts(k) {
    if (fontP[k]) return fontP[k]; var t = TH[k];
    fontP[k] = new Promise(function (res) { var l = document.createElement("link"); l.id = "plf-" + k; l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=" + t.f + "&display=swap"; l.onload = function () { (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(res); }; l.onerror = res; document.head.appendChild(l); setTimeout(res, 800); });
    return fontP[k];
  }
  function applyTheme(k, quiet) {
    var t = TH[k]; if (!t) return;
    cur = k; sset("pl-theme", k);
    var st = document.documentElement.style;
    st.setProperty("--bg", t.bg); st.setProperty("--ink", t.ink); st.setProperty("--accent", t.accent);
    st.setProperty("--display", t.display); st.setProperty("--body", t.body);
    st.setProperty("--pl-r", t.r); st.setProperty("--pl-grain", t.g);
    document.documentElement.setAttribute("data-pl-theme", k);
    document.documentElement.style.colorScheme = t.dark ? "dark" : "light";
    var mt = document.querySelector('meta[name="theme-color"]'); if (mt) mt.setAttribute("content", t.bg);
    fonts(k);
    var b = document.getElementById("plstyle"); if (b) { b.querySelector("b").textContent = t.n; b.setAttribute("aria-label", "Style : " + t.n + " — " + t.s); }
    if (!quiet) { var tt = document.getElementById("toast"); if (tt) { tt.textContent = t.n + " · " + t.s; tt.classList.add("on"); clearTimeout(applyTheme.t); applyTheme.t = setTimeout(function () { tt.classList.remove("on"); }, 1800); } }
  }
  if (cur) applyTheme(cur, true);
  function styleButton() {
    if (!(P.styles || qs.has("styles")) || document.getElementById("plstyle")) return;
    var b = document.createElement("button"); b.id = "plstyle"; b.type = "button"; b.className = "pl-style";
    b.innerHTML = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18c1.7 0 2-1.1 1.4-2-.7-1.1.1-2.4 1.6-2.4H17a4 4 0 0 0 4-4c0-5-4-9.6-9-9.6Z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7.5" r="1"/><circle cx="14.5" cy="7.5" r="1"/></svg><b></b>';
    document.body.appendChild(b);
    var showB = function () { b.classList.toggle("on", scrollY > innerHeight * 0.6); }; addEventListener("scroll", showB, { passive: true }); showB();
    b.addEventListener("click", function () {
      if (b.__busy) return; b.__busy = true; var k = ORDER[cur ? (ORDER.indexOf(cur) + 1) % ORDER.length : 0];
      fonts(k).then(function () {
        var go = function () { applyTheme(k); };
        // one cross-fade of the whole page through the View Transitions API; plain colour transition where it does not exist
        if (document.startViewTransition && !reduce) { var vt = document.startViewTransition(go); vt.finished.then(function () { b.__busy = false; }, function () { b.__busy = false; }); }
        else { document.documentElement.classList.add("pl-morph"); go(); setTimeout(function () { document.documentElement.classList.remove("pl-morph"); b.__busy = false; }, 900); }
      });
    });
    if (cur) applyTheme(cur, true); else b.querySelector("b").textContent = "Style";
  }

  /* ───────────── 2 · WebGL opening photo ───────────── */
  function hero3d() {
    if (!P.hero3d || reduce) return;
    var ph = root.querySelector(".open__ph"); if (!ph || ph.querySelector("canvas")) return;
    var im = ph.querySelector("img"); if (!im) return;
    var cv = document.createElement("canvas"); cv.className = "pl-gl"; cv.setAttribute("aria-hidden", "true");
    var gl = cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" }); if (!gl) return;
    var vs = "attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}";
    var fs = "precision mediump float;varying vec2 v;uniform sampler2D t;uniform vec2 res,img,par;uniform float time,zoom;uniform vec3 tc;" +
      "void main(){vec2 uv=v;float ra=res.x/res.y,ia=img.x/img.y;vec2 s=ra>ia?vec2(1.,ia/ra):vec2(ra/ia,1.);" +
      "vec2 c=(uv-.5)*s/zoom+.5+par*.018+vec2(sin(time*.11)*.007,cos(time*.09)*.007);" +
      "vec2 d=uv-tc.xy;d.x*=ra;float r=length(d),tt=time-tc.z;float w=sin(r*42.-tt*8.)*exp(-r*4.5)*exp(-tt*1.5)*step(0.,tt)*.014;c+=normalize(d+vec2(1e-4))*w;" +
      "c.y=1.-c.y;vec3 col=texture2D(t,c).rgb;" +
      "float sw=smoothstep(.0,.3,1.-abs(uv.x*.7+uv.y*.5-fract(time*.055)*2.2+.35)*2.4);col+=sw*.07*vec3(1.,.88,.7);" +
      "col*=1.-.42*smoothstep(.3,.95,length(uv-.5)*1.3);" +
      "col+=(fract(sin(dot(uv*res+time,vec2(12.9898,78.233)))*43758.5453)-.5)*.03;gl_FragColor=vec4(col,1.);}";
    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; }
    var a = sh(gl.VERTEX_SHADER, vs), b = sh(gl.FRAGMENT_SHADER, fs); if (!a || !b) return;
    var pg = gl.createProgram(); gl.attachShader(pg, a); gl.attachShader(pg, b); gl.linkProgram(pg); if (!gl.getProgramParameter(pg, gl.LINK_STATUS)) return;
    gl.useProgram(pg);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pg, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var U = {}; ["t", "res", "img", "par", "time", "zoom", "tc"].forEach(function (n) { U[n] = gl.getUniformLocation(pg, n); });
    var tex = gl.createTexture(), ready = false, iw = 1, ih = 1, run = false, vis = true, mx = 0, my = 0, px = 0, py = 0, tcx = -9, tcy = -9, tct = -99, t0 = performance.now();
    var src = im.currentSrc || im.src, pic = new Image(); pic.decoding = "async";
    pic.onload = function () {
      iw = pic.naturalWidth; ih = pic.naturalHeight;
      gl.bindTexture(gl.TEXTURE_2D, tex); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, pic);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      ready = true; ph.appendChild(cv); size(); frame(performance.now()); requestAnimationFrame(function () { ph.classList.add("pl-gl-on"); });
      loop();
    };
    pic.onerror = function () {}; pic.src = src;
    function size() { var d = Math.min(window.devicePixelRatio || 1, 1.6), w = Math.round(ph.clientWidth * d), h = Math.round(ph.clientHeight * d); if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; gl.viewport(0, 0, w, h); } }
    function frame(now) {
      px += (mx - px) * 0.06; py += (my - py) * 0.06;
      var tm = (now - t0) / 1000;
      gl.uniform1i(U.t, 0); gl.uniform2f(U.res, cv.width, cv.height); gl.uniform2f(U.img, iw, ih); gl.uniform2f(U.par, px, py);
      gl.uniform1f(U.time, tm); gl.uniform1f(U.zoom, 1.1 + Math.min(0.04, tm * 0.0016)); gl.uniform3f(U.tc, tcx, tcy, tct < -50 ? -99 : tct);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    function loop() { if (run) return; run = true; (function f(now) { if (!vis || document.hidden) { run = false; return; } frame(now); requestAnimationFrame(f); })(performance.now()); }
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { vis = en[0].isIntersecting; if (vis && ready) loop(); }, { threshold: 0.05 }).observe(ph);
    document.addEventListener("visibilitychange", function () { if (!document.hidden && ready && vis) loop(); });
    addEventListener("resize", function () { if (ready) { size(); } });
    var open = ph.parentNode;
    open.addEventListener("pointermove", function (e) { var r = open.getBoundingClientRect(); mx = ((e.clientX - r.left) / r.width - 0.5) * 2; my = ((e.clientY - r.top) / r.height - 0.5) * -2; }, { passive: true });
    open.addEventListener("pointerdown", function (e) { var r = ph.getBoundingClientRect(); tcx = (e.clientX - r.left) / r.width; tcy = 1 - (e.clientY - r.top) / r.height; tct = (performance.now() - t0) / 1000; }, { passive: true });
    if (window.DeviceOrientationEvent && !/iPad|iPhone/.test(navigator.userAgent)) addEventListener("deviceorientation", function (e) { if (e.gamma == null) return; mx = Math.max(-1, Math.min(1, e.gamma / 25)); my = Math.max(-1, Math.min(1, (e.beta - 45) / -30)); }, { passive: true });
  }

  /* ───────────── 3 · filters, sold-out, diet badges ───────────── */
  var LB = {
    all: { th: "ทั้งหมด", en: "All", zh: "全部", ru: "Все", ko: "전체", hi: "सभी", ar: "الكل", de: "Alle", fr: "Tout", it: "Tutti" },
    mild: { th: "ไม่เผ็ด", en: "Not spicy", zh: "不辣", ru: "Не остро", ko: "안 매움", hi: "तीखा नहीं", ar: "غير حار", de: "Mild", fr: "Doux", it: "Non piccante" },
    spicy: { th: "เผ็ด", en: "Spicy", zh: "辣", ru: "Остро", ko: "매움", hi: "तीखा", ar: "حار", de: "Scharf", fr: "Épicé", it: "Piccante" },
    veg: { th: "มังสวิรัติ", en: "Vegetarian", zh: "素食", ru: "Вегетарианское", ko: "채식", hi: "शाकाहारी", ar: "نباتي", de: "Vegetarisch", fr: "Végétarien", it: "Vegetariano" },
    vegan: { th: "วีแกน", en: "Vegan", zh: "纯素", ru: "Веган", ko: "비건", hi: "वीगन", ar: "نباتي صرف", de: "Vegan", fr: "Végan", it: "Vegano" },
    gf: { th: "ไม่มีกลูเตน", en: "Gluten-free", zh: "无麸质", ru: "Без глютена", ko: "글루텐 프리", hi: "ग्लूटेन-मुक्त", ar: "خالٍ من الغلوتين", de: "Glutenfrei", fr: "Sans gluten", it: "Senza glutine" },
    halal: { th: "ฮาลาล", en: "Halal", zh: "清真", ru: "Халяль", ko: "할랄", hi: "हलाल", ar: "حلال", de: "Halal", fr: "Halal", it: "Halal" },
    sold: { th: "หมดแล้ว", en: "Sold out", zh: "已售罄", ru: "Нет в наличии", ko: "품절", hi: "उपलब्ध नहीं", ar: "نفد", de: "Ausverkauft", fr: "Épuisé", it: "Esaurito" },
    ppl: { th: "ราคาโดยประมาณเป็น", en: "Approx. prices in", zh: "参考价格（币种）", ru: "Примерные цены в", ko: "대략적인 가격 통화", hi: "अनुमानित कीमतें", ar: "أسعار تقريبية بـ", de: "Ungefähre Preise in", fr: "Prix indicatifs en", it: "Prezzi indicativi in" },
    rate: { th: "อัตราแลกเปลี่ยนอ้างอิง (ECB) ไม่ใช่ราคาที่ชำระจริง", en: "Indicative ECB rates, not the amount charged", zh: "欧洲央行参考汇率，仅供参考", ru: "Ориентировочный курс ЕЦБ, не сумма к оплате", ko: "ECB 참고 환율이며 실제 청구 금액이 아닙니다", hi: "ECB का सांकेतिक दर, वास्तविक शुल्क नहीं", ar: "أسعار صرف إرشادية (ECB) وليست المبلغ المحصَّل", de: "Richtkurse der EZB, nicht der berechnete Betrag", fr: "Taux indicatifs BCE, pas le montant facturé", it: "Tassi indicativi BCE, non l’importo addebitato" }
  };
  function lb(k) { var o = LB[k], l = L(); return (o && (o[l] || o.en)) || k; }
  var flt = { chip: "all", fx: lget("pl-fx") || "THB" };
  var hasHot = false, dietSet = {};
  M.sections.forEach(function (s) { s.items.forEach(function (d) { if (d.hot) hasHot = true; (d.diet || []).forEach(function (x) { dietSet[x] = 1; }); }); });
  var chips = [];
  if (hasHot) chips.push(["mild", "mild"], ["spicy", "spicy"]);
  ["veg", "vegan", "gf", "halal"].forEach(function (k) { if (dietSet[k]) chips.push([k, k]); });
  function passes(d) {
    var c = flt.chip; if (c === "all") return true;
    if (c === "mild") return !d.hot; if (c === "spicy") return !!d.hot;
    return (d.diet || []).indexOf(c) > -1;
  }
  function refresh() {
    var main = root.querySelector("main"); if (!main) return;
    main.querySelectorAll(".dish").forEach(function (li) { var d = byId[li.getAttribute("data-row")]; li.classList.toggle("pl-hide2", !!d && !passes(d)); });
    main.querySelectorAll(".ch").forEach(function (c) { c.classList.toggle("pl-hide", !c.querySelector(".dish:not(.pl-hide):not(.pl-hide2)") && (flt.chip !== "all" || !!(main.querySelector(".pl-search input") || {}).value)); });
    var any = !!main.querySelector(".dish:not(.pl-hide):not(.pl-hide2)"), nn = main.querySelector(".pl-none"); if (nn) nn.hidden = any || (flt.chip === "all" && !((main.querySelector(".pl-search input") || {}).value));
    var sh = main.querySelector(".pl-show"); if (sh) sh.hidden = flt.chip !== "all" || !!((main.querySelector(".pl-search input") || {}).value);
  }
  function buildChips(main) {
    var top = main.querySelector(".pl-top"); if (!top || top.querySelector(".pl-chips")) return;
    var anchor = top.querySelector(".pl-search"); if (!anchor) return;
    if (chips.length) {
      var h = '<div class="pl-chips" role="group">' + ['all'].concat(chips.map(function (c) { return c[0]; })).map(function (k) { return '<button type="button" data-plc="' + k + '" aria-pressed="' + (flt.chip === k) + '">' + esc(lb(k === "all" ? "all" : k)) + "</button>"; }).join("") + "</div>";
      anchor.insertAdjacentHTML("afterend", h);
      top.querySelector(".pl-chips").addEventListener("click", function (e) {
        var b = e.target.closest("[data-plc]"); if (!b) return; flt.chip = b.getAttribute("data-plc");
        top.querySelectorAll("[data-plc]").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
        refresh();
      });
    }
    var inp = top.querySelector(".pl-search input"); if (inp) inp.addEventListener("input", function () { refresh(); });
  }
  function decorate(main) {
    main.querySelectorAll(".dish").forEach(function (li) {
      var d = byId[li.getAttribute("data-row")]; if (!d) return;
      if (d.soldout && !li.classList.contains("pl-sold")) { li.classList.add("pl-sold"); var m = li.querySelector(".dish__m"); if (m) m.insertAdjacentHTML("beforeend", '<span class="chip pl-so">' + esc(lb("sold")) + "</span>"); var ad = li.querySelector(".add"); if (ad) { ad.setAttribute("aria-disabled", "true"); ad.tabIndex = -1; } }
      if (d.diet && d.diet.length && !li.querySelector(".pl-dt")) { var m2 = li.querySelector(".dish__m"); if (m2) m2.insertAdjacentHTML("beforeend", d.diet.map(function (k) { return '<span class="chip pl-dt">' + esc(lb(k)) + "</span>"; }).join("")); }
    });
  }
  // a sold-out dish can never be added to the selection
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-add]"); if (!b) return; var d = byId[b.getAttribute("data-add")];
    if (d && d.soldout) { e.stopPropagation(); e.preventDefault(); }
  }, true);

  /* ───────────── 4 · "approx. prices in…" with live ECB rates ───────────── */
  var FX = { EUR: ["€", 2], USD: ["$", 2], GBP: ["£", 2], CNY: ["¥", 1], KRW: ["₩", 0], INR: ["₹", 0], JPY: ["JP¥", 0], AUD: ["A$", 2] }, rates = null;
  function loadRates() {
    if (!P.fx || M.currency !== "฿") return Promise.resolve(null);
    try { var c = JSON.parse(lget("pl-rates") || "null"); if (c && Date.now() - c.t < 6 * 3600e3) return Promise.resolve(c); } catch (e) {}
    return fetch("https://api.frankfurter.dev/v1/latest?base=THB&symbols=" + Object.keys(FX).join(",")).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      if (!j || !j.rates) return null; var c = { t: Date.now(), date: j.date, rates: j.rates }; lset("pl-rates", JSON.stringify(c)); return c;
    }).catch(function () { return null; });
  }
  function conv(p) {
    if (flt.fx === "THB" || !rates || !rates.rates[flt.fx]) return "";
    var f = FX[flt.fx], v = p * rates.rates[flt.fx], s = f[1] === 0 ? Math.round(v).toLocaleString("en") : v.toFixed(v < 10 ? 2 : 1);
    return "≈ ⁦" + f[0] + s + "⁩";
  }
  function paintFx() {
    var main = root.querySelector("main"); if (!main) return;
    main.querySelectorAll(".pl-fxv").forEach(function (n) { n.remove(); });
    if (flt.fx === "THB" || !rates) return;
    main.querySelectorAll(".dish").forEach(function (li) { var d = byId[li.getAttribute("data-row")], p = li.querySelector(".dish__p"); if (d && p) p.insertAdjacentHTML("afterend", '<span class="pl-fxv">' + conv(+d.p) + "</span>"); });
    paintSheetFx();
  }
  function paintSheetFx() {
    var sb = document.getElementById("sb"); if (!sb) return; sb.querySelectorAll(".pl-fxv").forEach(function (n) { n.remove(); });
    if (flt.fx === "THB" || !rates) return;
    var add = sb.querySelector(".sd__f [data-add]"), p = sb.querySelector(".sd__p"); if (!add || !p) return; var d = byId[add.getAttribute("data-add")]; if (d) p.insertAdjacentHTML("afterend", '<span class="pl-fxv pl-fxv--sheet">' + conv(+d.p) + "</span>");
  }
  function buildFx(main) {
    var top = main.querySelector(".pl-top"); if (!top || top.querySelector(".pl-fx") || !rates) return;
    var avail = Object.keys(FX).filter(function (k) { return rates.rates[k]; }); if (!avail.length) return;
    var sel = ["THB"].concat(avail.filter(function (k) { return ["EUR", "USD", "GBP", "CNY", "KRW", "INR"].indexOf(k) > -1; }));
    var h = '<div class="pl-fx"><span>' + esc(lb("ppl")) + '</span><div role="group">' + sel.map(function (k) { return '<button type="button" data-plfx="' + k + '" aria-pressed="' + (flt.fx === k) + '">' + (k === "THB" ? "฿" : FX[k][0]) + "</button>"; }).join("") + '</div><small>' + esc(lb("rate")) + " · " + esc(rates.date || "") + "</small></div>";
    var anchor = top.querySelector(".pl-chips") || top.querySelector(".pl-search"); anchor.insertAdjacentHTML("afterend", h);
    top.querySelector(".pl-fx").addEventListener("click", function (e) {
      var b = e.target.closest("[data-plfx]"); if (!b) return; flt.fx = b.getAttribute("data-plfx"); lset("pl-fx", flt.fx);
      top.querySelectorAll("[data-plfx]").forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); paintFx();
    });
  }
  var sbObs = null;
  function enhance() {
    var main = root.querySelector("main"); if (!main) return;
    buildChips(main); decorate(main); buildFx(main); if (rates) paintFx(); refresh(); hero3d(); styleButton();
    var sb = document.getElementById("sb"); if (sb && !sb.__lux) { sb.__lux = 1; if (sbObs) sbObs.disconnect(); sbObs = new MutationObserver(function () { paintSheetFx(); }); sbObs.observe(sb, { childList: true }); }
  }
  loadRates().then(function (r) { rates = r; enhance(); });
  // runs after menu-plus.js has built the top block (same MutationObserver tick order: this file is loaded later)
  new MutationObserver(function () { requestAnimationFrame(enhance); }).observe(root, { childList: true });
  enhance();
})();
