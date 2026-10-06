/* Atelier des Façadiers — site.js (vanilla, no build). Every enhancement is layered on top of content that is already visible. */
const CONFIG = {
  EMAIL: "",          // adresse qui reçoit les demandes de devis (laisser vide = récapitulatif à copier + boutons d'appel)
  FORM_ENDPOINT: ""   // ou une URL Formspree / API qui reçoit le formulaire en POST
};
(function () {
"use strict";
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const LANG = document.documentElement.lang || "fr", TX = (window.I18N && window.I18N[LANG]) || {};
const t = (k, fb) => (TX[k] != null ? TX[k] : fb), fmt = (str, o) => str.replace(/\{(\w+)\}/g, (_, k) => o[k]);
const LOC = { fr: "fr-FR", en: "en-GB", de: "de-DE", nl: "nl-NL", es: "es-ES" }[LANG] || "fr-FR";
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
document.documentElement.classList.add("js");
/* one shared, rAF-throttled scroll loop for every scroll-driven effect (no layout reads outside it) */
const SCQ = []; let scT = false;
const onScroll = fn => { SCQ.push(fn); };
addEventListener("scroll", () => { if (scT) return; scT = true; requestAnimationFrame(() => { scT = false; for (let i = 0; i < SCQ.length; i++) SCQ[i](); }); }, { passive: true });
window.__onScroll = onScroll;
/* run fn only while el is near the viewport */
const nearView = (el, cb) => { if (!("IntersectionObserver" in window)) return () => true; let v = true; new IntersectionObserver(es => { v = es[0].isIntersecting; cb && cb(v); }, { rootMargin: "300px 0px" }).observe(el); return () => v; };

/* ---------- header ---------- */
const hdr = $(".hdr");
if (hdr) {
  const solid = () => hdr.classList.toggle("is-solid", scrollY > 40);
  if (!hdr.classList.contains("hdr--page")) { solid(); onScroll(solid); }
  let ly = scrollY; onScroll(() => { const y = scrollY, d = y - ly; if (Math.abs(d) < 8) return; hdr.classList.toggle("is-hidden", d > 0 && y > 360 && !hdr.classList.contains("nav-open")); ly = y; });
  const burger = $(".burger", hdr);
  if (burger) {
    burger.addEventListener("click", () => { const o = hdr.classList.toggle("nav-open"); burger.setAttribute("aria-expanded", o); });
    $$(".nav a", hdr).forEach(a => a.addEventListener("click", () => { hdr.classList.remove("nav-open"); burger.setAttribute("aria-expanded", "false"); }));
  }
}

/* ---------- reveal on scroll (hidden state only switched on once the observer works) ---------- */
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
  $$("[data-r]").forEach((el, i) => { el.style.transitionDelay = (el.dataset.r ? +el.dataset.r : 0) + "ms"; io.observe(el); });
} else $$("[data-r]").forEach(el => el.classList.add("in"));

/* ---------- count-up ---------- */
const cu = $$("[data-count]");
if (cu.length && "IntersectionObserver" in window) {
  const io2 = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; io2.unobserve(e.target);
    const el = e.target, to = +el.dataset.count, dur = reduce ? 1 : 1400, t0 = performance.now();
    const f = n => { const p = clamp((n - t0) / dur), v = Math.round(to * (1 - Math.pow(1 - p, 3))); el.textContent = v.toLocaleString(LOC); if (p < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  }), { threshold: .6 });
  cu.forEach(el => io2.observe(el));
}

/* ---------- hero: panel-by-panel cladding reveal ---------- */
const hero = $(".hero");
if (hero && !reduce && !document.documentElement.classList.contains("ldr-on")) {
  const cols = innerWidth < 700 ? 6 : 14, rows = innerWidth < 700 ? 10 : 8;
  const g = document.createElement("div"); g.className = "cladding"; g.setAttribute("aria-hidden", "true");
  g.style.gridTemplateColumns = `repeat(${cols},1fr)`; g.style.gridTemplateRows = `repeat(${rows},1fr)`;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const i = document.createElement("i"); i.style.setProperty("--d", ((rows - 1 - r) * 60 + c * 45 + Math.random() * 90).toFixed(0) + "ms"); g.appendChild(i); }
  hero.appendChild(g); setTimeout(() => g.remove(), 2600);
}
/* hero video: pause control + reduced-motion / save-data fallback to poster */
const hv = $(".hero__video"), hp = $(".hero__pause");
if (hv) {
  const still = reduce || (navigator.connection && navigator.connection.saveData);
  if (still) { hv.removeAttribute("autoplay"); hv.pause(); hp && (hp.hidden = true); }
  else {
    const setBtn = paused => { if (!hp) return; hp.setAttribute("aria-pressed", String(paused)); hp.setAttribute("aria-label", paused ? t("vid_play", "Lire la vidéo") : t("vid_pause", "Mettre la vidéo en pause")); };
    const go = () => { const pl = hv.play(); if (pl && pl.catch) pl.catch(() => setBtn(true)); };   /* autoplay refused (low-power mode…): show the poster + a play button */
    hv.muted = true; go();
    hv.addEventListener("loadeddata", () => { if (hv.paused && hp && hp.getAttribute("aria-pressed") !== "true") go(); }, { once: true });
    hv.addEventListener("playing", () => setBtn(false));
    hv.addEventListener("error", () => { if (hp) hp.hidden = true; });   /* unsupported codec: poster stays, no broken UI */
  }
  hp && hp.addEventListener("click", () => { const p = hv.paused; p ? hv.play() : hv.pause(); hp.setAttribute("aria-pressed", String(!p)); hp.setAttribute("aria-label", p ? t("vid_pause","Mettre la vidéo en pause") : t("vid_play","Lire la vidéo")); });
  let inV = true; if ("IntersectionObserver" in window) new IntersectionObserver(es => { inV = es[0].isIntersecting; if (still || (hp && hp.getAttribute("aria-pressed") === "true")) return; inV ? hv.play().catch(() => {}) : hv.pause(); }, { threshold: .05 }).observe(hv);
  document.addEventListener("visibilitychange", () => { if (document.hidden) hv.pause(); else if (!still && inV && hp.getAttribute("aria-pressed") !== "true") hv.play().catch(() => {}); });
}

/* ---------- parallax band ---------- */
const bandImg = $(".band__img");
if (bandImg && !reduce) {
  const band = bandImg.parentElement;
  const vis = nearView(band);
  const pf = () => { if (!vis()) return; const r = band.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; bandImg.style.transform = `translate3d(0,${(p * -9).toFixed(2)}%,0)`; };
  onScroll(pf); pf();
}

/* ---------- pinned horizontal showcase ---------- */
const hz = $(".hz");
if (hz) {
  const track = $(".hz__track", hz), bar = $(".hz__bar i", hz);
  const mobileNoPin = reduce || matchMedia("(max-width:900px)").matches || matchMedia("(hover:none)").matches;
  if (mobileNoPin) hz.classList.add("no-hz");
  else {
    const size = () => { const dist = Math.max(0, track.scrollWidth - innerWidth); hz.style.height = (innerHeight + dist * 1.15) + "px"; return dist; };
    let dist = size();
    const vis = nearView(hz, v => { track.style.willChange = v ? "transform" : "auto"; });
    const tick = () => { if (!vis()) return; const r = hz.getBoundingClientRect(), p = clamp(-r.top / (hz.offsetHeight - innerHeight)); track.style.transform = `translate3d(${(-p * dist).toFixed(1)}px,0,0)`; bar && hz.style.setProperty("--p", p.toFixed(3)); };
    onScroll(tick); addEventListener("resize", () => { dist = size(); tick(); }); addEventListener("load", () => { dist = size(); tick(); }); tick();
  }
}

/* ---------- exploded façade (scroll-driven) ---------- */
const xv = $(".xv");
if (xv) {
  const scene = $(".xv__scene", xv), layers = $$(".xv__layer", xv), items = $$(".xv__list li", xv);
  const N = items.length;
  const setOn = k => { items.forEach((li, i) => li.classList.toggle("on", i === k)); layers.forEach(l => l.classList.toggle("on", +l.dataset.n === k)); scene.classList.toggle("has-on", k >= 0); };
  const vis = nearView(xv);
  const upd = () => {
    if (reduce) { setOn(N - 1); return; }
    if (!vis()) return;
    const r = xv.getBoundingClientRect(), p = clamp(-r.top / (r.height - innerHeight));
    const ex = clamp(p / .34), e = ex * ex * (3 - 2 * ex);
    xv.style.setProperty("--ex", e.toFixed(3)); scene.style.setProperty("--ex", e.toFixed(3));
    const k = p < .3 ? -1 : Math.min(N - 1, Math.floor((p - .3) / .7 * N));
    setOn(k);
  };
  onScroll(upd); addEventListener("resize", upd); upd();
  items.forEach((li, i) => li.addEventListener("click", () => {
    const r = xv.getBoundingClientRect(), top = scrollY + r.top, span = r.height - innerHeight;
    scrollTo({ top: top + (.3 + (i + .5) / N * .7) * span, behavior: reduce ? "auto" : "smooth" });
  }));
}

/* ---------- façade configurator ---------- */
const cfgEl = $("#cfg");
if (cfgEl) {
  const FAM = {
    fc:   { n: t("fam_fc","Fibre-ciment"), b: "Equitone · Cedral", f: "matte", inv: "Tergo Design (Equitone)", sw: [[t("sw_fc_0","Blanc minéral"),"#e8e6df"],[t("sw_fc_1","Gris perle"),"#bdbfbf"],[t("sw_fc_2","Sable"),"#cdbb9a"],[t("sw_fc_3","Terre cuite"),"#b4653f"],[t("sw_fc_4","Anthracite"),"#3c4147"],[t("sw_fc_5","Vert mousse"),"#7f8c6a"]] },
    hpl:  { n: t("fam_hpl","Stratifié HPL"), b: "Fundermax · Trespa · Pura by Trespa", f: "smooth", inv: "Eclip’s (Fundermax) · TS200 (Trespa)", sw: [[t("sw_hpl_0","Noir profond"),"#15181c"],[t("sw_hpl_1","Graphite"),"#3d434a"],[t("sw_hpl_2","Chêne clair"),"#c9a46b"],[t("sw_hpl_3","Bleu ardoise"),"#3b556b"],[t("sw_hpl_4","Rouge brique"),"#9a3d2f"],[t("sw_hpl_5","Blanc cassé"),"#ecebe6"]] },
    alu:  { n: t("fam_alu","Aluminium composite"), b: "Stacbond · Alpolic", f: "metal", inv: t("inv_alu","Cassettes CH (Stacbond) · M-BASE (Alpolic)"), sw: [[t("sw_alu_0","Argent"),"#b7bcc2"],[t("sw_alu_1","Anthracite métal"),"#4b5058"],[t("sw_alu_2","Bronze"),"#7b5b3f"],[t("sw_alu_3","Bleu nuit"),"#1f3550"],[t("sw_alu_4","Champagne"),"#cdbb94"],[t("sw_alu_5","Cuivre"),"#b3653c"]] },
    lr:   { n: t("fam_lr","Laine de roche comprimée"), b: "Rockpanel", f: "matte", inv: null, sw: [[t("sw_lr_0","Gris minéral"),"#8e9490"],[t("sw_lr_1","Anthracite"),"#353a3f"],[t("sw_lr_2","Beige"),"#c9b9a2"],[t("sw_lr_3","Brun"),"#6b4d3a"],[t("sw_lr_4","Vert sapin"),"#3f5a4a"],[t("sw_lr_5","Blanc"),"#e5e3dc"]] },
    bois: { n: t("fam_bois","Bardage bois"), b: t("b_bois","Lames de bois"), f: "wood", inv: null, sw: [[t("sw_bois_0","Naturel"),"#c89a63"],[t("sw_bois_1","Chêne doré"),"#b8864a"],[t("sw_bois_2","Brun"),"#6a4a31"],[t("sw_bois_3","Gris argenté"),"#9a968f"],[t("sw_bois_4","Noir brûlé"),"#24201d"],[t("sw_bois_5","Cèdre rouge"),"#9a5b3d"]] },
    comp: { n: t("fam_comp","Bois composite"), b: "Fiberdeck", f: "wood", inv: null, sw: [[t("sw_comp_0","Teck"),"#a37a4b"],[t("sw_comp_1","Gris galet"),"#8c8a86"],[t("sw_comp_2","Brun"),"#5b4333"],[t("sw_comp_3","Anthracite"),"#35383c"],[t("sw_comp_4","Sable"),"#c5b08d"],[t("sw_comp_5","Noir"),"#1b1c1e"]] }
  };
  const POSE = { plan: t("pose_plan","Panneaux plans"), cassette: t("pose_cassette","Cassettes"), lames: t("pose_lames","Bandeaux / lames") };
  const st = { fam: "fc", pose: "plan", sw: 0 };
  const q = new URLSearchParams(location.search);
  if (FAM[q.get("famille")]) st.fam = q.get("famille"); if (POSE[q.get("pose")]) st.pose = q.get("pose");
  const famBox = $("#cfg-fam", cfgEl), poseBox = $("#cfg-pose", cfgEl), swBox = $("#cfg-sw", cfgEl), view = $("#cfg-svg", cfgEl), sum = $("#cfg-sum", cfgEl), devis = $("#cfg-devis", cfgEl), cap = $("#cfg-cap", cfgEl);
  const hex2 = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (h, t, a) => "#" + hex2(h).map((v, i) => Math.round(v + (hex2(t)[i] - v) * a).toString(16).padStart(2, "0")).join("");
  const lum = h => { const [r, g, b] = hex2(h); return (r * .299 + g * .587 + b * .114) / 255; };
  const chip = (name, val, label, sub, checked) => `<label class="chip" data-k="${val}"><input type="radio" name="${name}" value="${val}" ${checked ? "checked" : ""}><span>${label}${sub ? `<small>${sub}</small>` : ""}</span></label>`;
  famBox.innerHTML = Object.entries(FAM).map(([k, f]) => chip("fam", k, f.n, f.b, k === st.fam)).join("");
  poseBox.innerHTML = Object.entries(POSE).map(([k, v]) => chip("pose", k, v, "", k === st.pose)).join("");
  function renderSw() {
    swBox.dataset.name = FAM[st.fam].sw[st.sw][0];
    swBox.innerHTML = FAM[st.fam].sw.map(([n, c], i) => `<label title="${n}"><input type="radio" name="sw" value="${i}" ${i === st.sw ? "checked" : ""} aria-label="${n}"><i style="--c:${c}"></i></label>`).join("");
  }
  function svg() {
    const f = FAM[st.fam], col = f.sw[st.sw][1], dark = lum(col) < .45;
    const edge = mix(col, "#000000", .35), hi = mix(col, "#ffffff", .22);
    const BX = 110, BY = 70, BW = 580, BH = 390;
    let p = "";
    if (st.pose === "lames") {
      const h = f.f === "wood" ? 26 : 24, gap = f.f === "wood" ? 0 : 2;
      for (let y = BY; y < BY + BH; y += h + gap) {
        const hh = Math.min(h, BY + BH - y);
        p += `<rect x="${BX}" y="${y}" width="${BW}" height="${hh}" fill="${col}"/>`;
        if (f.f === "wood") p += `<rect x="${BX}" y="${y + hh - 3}" width="${BW}" height="3" fill="${edge}" opacity=".55"/><rect x="${BX}" y="${y}" width="${BW}" height="1.5" fill="${hi}" opacity=".5"/>`;
        else p += `<rect x="${BX}" y="${y}" width="${BW}" height="2" fill="${hi}" opacity=".35"/>`;
      }
    } else {
      const mw = 145, mh = 97, gp = st.pose === "cassette" ? 9 : 4;
      for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
        const x = BX + c * mw + gp / 2, y = BY + r * mh + gp / 2, w = mw - gp, h = mh - gp;
        p += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${col}"/>`;
        if (st.pose === "cassette") p += `<path d="M${x} ${y + h}V${y}H${x + w}" fill="none" stroke="${hi}" stroke-width="3" opacity=".6"/><path d="M${x + w} ${y}V${y + h}H${x}" fill="none" stroke="${edge}" stroke-width="3" opacity=".55"/>`;
        else { const o = (r + c) % 3; p += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#sheen)" opacity="${.5 + o * .15}"/>`; }
      }
    }
    // finish overlay
    let tex = "";
    if (f.f === "wood") tex = `<rect x="${BX}" y="${BY}" width="${BW}" height="${BH}" fill="url(#grain)" opacity=".5"/>`;
    else if (f.f === "metal") tex = `<rect x="${BX}" y="${BY}" width="${BW}" height="${BH}" fill="url(#brush)" opacity=".55"/><rect x="${BX}" y="${BY}" width="${BW}" height="${BH}" fill="url(#sheen)"/>`;
    else if (f.f === "smooth") tex = `<rect x="${BX}" y="${BY}" width="${BW}" height="${BH}" fill="url(#sheen)" opacity=".7"/>`;
    else tex = `<rect x="${BX}" y="${BY}" width="${BW}" height="${BH}" fill="url(#mat)" opacity=".5"/>`;
    // windows
    let w = "";
    const frame = dark ? "#d9dde2" : "#2a2f35";
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
      const x = 150 + c * 135, y = 120 + r * 115;
      w += `<rect x="${x - 6}" y="${y - 6}" width="102" height="82" fill="#000" opacity=".28" transform="translate(5 6)"/><rect x="${x - 6}" y="${y - 6}" width="102" height="82" fill="${frame}"/><rect x="${x}" y="${y}" width="90" height="70" fill="url(#glass)"/><path d="M${x + 45} ${y}V${y + 70}M${x} ${y + 36}H${x + 90}" stroke="${frame}" stroke-width="3"/><path d="M${x + 10} ${y + 60}L${x + 40} ${y + 8}" stroke="#fff" stroke-width="5" opacity=".14"/>`;
    }
    return `<svg viewBox="0 0 800 520" role="img" aria-label="${fmt(t("aria_svg","Aperçu de façade : {fam}, {pose}, teinte {tint}"), { fam: f.n, pose: POSE[st.pose], tint: f.sw[st.sw][0] })}">
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcd3ee"/><stop offset="1" stop-color="#eef2f6"/></linearGradient>
<linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a9c0d8"/><stop offset=".55" stop-color="#6b88a6"/><stop offset="1" stop-color="#3f566e"/></linearGradient>
<linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient>
<pattern id="grain" width="14" height="40" patternUnits="userSpaceOnUse"><path d="M2 0C1 14 4 26 2 40M7 0C9 12 5 28 8 40M12 0C11 16 13 30 12 40" stroke="#000" stroke-opacity=".16" fill="none"/></pattern>
<pattern id="brush" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M1 0V6M4 0V6" stroke="#fff" stroke-opacity=".16"/></pattern>
<pattern id="mat" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".7" fill="#000" opacity=".12"/><circle cx="6" cy="6" r=".7" fill="#fff" opacity=".12"/></pattern>
</defs>
<rect width="800" height="520" fill="url(#sky)"/>
<ellipse cx="400" cy="470" rx="360" ry="16" fill="#000" opacity=".16"/>
<rect x="40" y="460" width="720" height="60" fill="#8f918d"/><rect x="40" y="460" width="720" height="3" fill="#6f716e"/>
<rect x="${BX - 8}" y="${BY - 18}" width="${BW + 16}" height="18" fill="#2a3139"/><rect x="${BX - 8}" y="${BY - 18}" width="${BW + 16}" height="3" fill="#59636f"/>
${p}${tex}${w}
<rect x="${BX}" y="${BY + BH}" width="${BW}" height="10" fill="#4a4f55"/>
<g stroke="#244760" stroke-width="1.2" fill="none" opacity=".7"><path d="M${BX + BW + 24} ${BY}V${BY + BH}M${BX + BW + 18} ${BY}h12M${BX + BW + 18} ${BY + BH}h12"/></g>
<text x="${BX + BW + 34}" y="${BY + BH / 2}" font-family="IBM Plex Mono,monospace" font-size="11" fill="#244760" transform="rotate(90 ${BX + BW + 34} ${BY + BH / 2})" text-anchor="middle" letter-spacing="2">${t("elev","ÉLÉVATION — ÉCH. INDICATIVE")}</text>
</svg>`;
  }

  /* ---- photo engine: a real project photo, panels re-coloured live (luminance-preserving) through a hand-checked mask ---- */
  const PH = { state: "idle", cur: null, tw: 0 };
  const phBase = (document.currentScript && document.currentScript.src ? document.currentScript.src : (document.querySelector('script[src*="site.js"]') || {}).src || "").replace(/assets\/js\/site\.js.*$/, "");
  function loadPhoto() {
    const W = matchMedia("(max-width:700px)").matches ? 760 : 1000;
    const ld = u => new Promise((res, rej) => { const i = new Image(); i.decoding = "async"; i.onload = () => res(i); i.onerror = rej; i.src = u; });
    return Promise.all([ld(phBase + "assets/img/cfg/photo.webp"), ld(phBase + "assets/img/cfg/mask.png")]).then(([ph, mk]) => {
      const cv = D_.createElement("canvas"); cv.width = cv.height = W;
      const x = cv.getContext("2d", { willReadFrequently: true });
      x.drawImage(ph, 0, 0, W, W); const base = x.getImageData(0, 0, W, W);
      x.clearRect(0, 0, W, W); x.drawImage(mk, 0, 0, W, W); const md = x.getImageData(0, 0, W, W).data;
      const n = W * W, idx = []; const lr = new Float32Array(n), mw = new Float32Array(n);
      let sum = 0, cnt = 0;
      for (let i = 0; i < n; i++) { const a = md[i * 4] / 255; mw[i] = a; if (a > .5) { sum += base.data[i * 4] * .299 + base.data[i * 4 + 1] * .587 + base.data[i * 4 + 2] * .114; cnt++; } }
      const mean = sum / Math.max(1, cnt);
      let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      const colN = new Float32Array(W); for (let c = 0; c < W; c++) colN[c] = rnd();
      for (let i = 0; i < n; i++) if (mw[i] > .004) {
        idx.push(i); const o = i * 4;
        lr[i] = Math.max(.3, Math.min(1.7, (base.data[o] * .299 + base.data[o + 1] * .587 + base.data[o + 2] * .114) / mean));
      }
      PH.W = W; PH.base = base; PH.idx = Uint32Array.from(idx); PH.lr = lr; PH.mw = mw; PH.colN = colN;
      PH.cv = cv; PH.x = x; PH.out = x.createImageData(W, W);
      const c2 = D_.createElement("canvas"); c2.width = c2.height = W; PH.show = c2;
    });
  }
  const D_ = document;
  const smooth = (a, b, v) => { const t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
  function photoRender(rgb) {
    const { W, base, idx, lr, mw, colN, out } = PH, bd = base.data, od = out.data, f = FAM[st.fam].f, pose = st.pose;
    od.set(bd);
    const k = W / 900;
    for (let j = 0; j < idx.length; j++) {
      const i = idx[j], px = i % W, py = (i / W) | 0, X = px / k, Y = py / k;
      let v = lr[i], add = 0;
      if (pose === "cassette") v = Math.pow(v, 1.22);
      if (f === "metal") { v = Math.pow(v, 1.3); add = 26 * smooth(.2, 1, (X + (900 - Y)) / 1800) + (colN[px] - .5) * 10; }
      else if (f === "smooth") { v = Math.pow(v, .92); add = 20 * smooth(.35, 1, (X + (900 - Y)) / 1800); }
      else if (f === "wood") { const g = Math.sin(px * .9 + colN[px] * 6) * .5 + colN[px] * .5; v *= 1 + .2 * (g - .25) + .06 * Math.sin(py * .05 + px * .01); }
      if (pose === "bandeau") {
        const sdt = X < 635 + .14 * (Y - 25) ? Y + .397 * X : Y - 2.2 * X;
        const ph = ((sdt % 34) + 34) % 34; const edge = Math.min(ph, 34 - ph); v *= 1 - .5 * (1 - smooth(0, 3.2, edge)) ;
      }
      const a = mw[i], o = i * 4;
      const r = rgb[0] * v + add, g2 = rgb[1] * v + add, b = rgb[2] * v + add;
      od[o] = bd[o] + (Math.max(0, Math.min(255, r)) - bd[o]) * a;
      od[o + 1] = bd[o + 1] + (Math.max(0, Math.min(255, g2)) - bd[o + 1]) * a;
      od[o + 2] = bd[o + 2] + (Math.max(0, Math.min(255, b)) - bd[o + 2]) * a;
    }
    PH.x.putImageData(out, 0, 0);
  }
  function mountPhoto() {
    const f = FAM[st.fam], s = f.sw[st.sw], target = hex2(s[1]);
    let cv = view.querySelector("canvas.cfg__photo");
    if (!cv) { view.innerHTML = ""; cv = D_.createElement("canvas"); cv.className = "cfg__photo"; cv.width = cv.height = PH.W; view.appendChild(cv); PH.ctx = cv.getContext("2d"); PH.cur = null; }
    cv.setAttribute("role", "img");
    cv.setAttribute("aria-label", fmt(t("aria_svg", "Aperçu de façade : {fam}, {pose}, teinte {tint}"), { fam: f.n, pose: POSE[st.pose], tint: s[0] }));
    const from = PH.cur || target, t0 = performance.now(), dur = (PH.cur && !reduce) ? 520 : 0;
    cancelAnimationFrame(PH.tw);
    const step = now => {
      const u = dur ? Math.min(1, (now - t0) / dur) : 1, e = u * u * (3 - 2 * u);
      const c = [0, 1, 2].map(i => from[i] + (target[i] - from[i]) * e);
      photoRender(c); PH.ctx.putImageData(PH.out, 0, 0); PH.cur = c;
      if (u < 1) PH.tw = requestAnimationFrame(step); else PH.cur = target;
    };
    PH.tw = requestAnimationFrame(step);
  }
  function drawView() {
    if (PH.state === "fail") { view.innerHTML = svg(); return; }
    if (PH.state === "ready") { mountPhoto(); return; }
    if (PH.state === "idle") {
      PH.state = "loading"; view.innerHTML = '<div class="cfg__ph" aria-hidden="true"></div>';
      loadPhoto().then(() => { PH.state = "ready"; mountPhoto(); }).catch(() => { PH.state = "fail"; view.innerHTML = svg(); });
    }
  }
  function paint() {
    const f = FAM[st.fam], s = f.sw[st.sw];
    drawView(); cfgEl.classList.remove("flash"); void cfgEl.offsetWidth; cfgEl.classList.add("flash"); swBox.dataset.name = s[0];
    document.documentElement.style.setProperty("--panel", s[1]);
    sum.innerHTML = `<div><b>${f.n}</b> — ${f.b}</div><div>${fmt(t("sum_pose","Pose : {pose} · Teinte : {tint}"), { pose: POSE[st.pose], tint: s[0] })} <span class="note">${t("sum_ind","(indicative)")}</span></div><div>${f.inv ? fmt(t("sum_inv","Fixation invisible possible : {inv}"), { inv: f.inv }) : t("sum_vis","Fixation visible : vis, rivets, EPDM.")}</div>`;
    cap.textContent = `${f.n} / ${POSE[st.pose]} / ${s[0]}`;
    const u = new URLSearchParams({ famille: st.fam, pose: st.pose, teinte: s[0] });
    devis.href = "contact.html?" + u.toString() + "#devis";
    history.replaceState(null, "", "?" + new URLSearchParams({ famille: st.fam, pose: st.pose }).toString() + location.hash);
  }
  const idleRun = window.requestIdleCallback ? (f => requestIdleCallback(f, { timeout: 1200 })) : (f => setTimeout(f, 200));
  idleRun(() => { renderSw(); paint(); });
  cfgEl.addEventListener("change", e => {
    const t = e.target;
    if (t.name === "fam") { st.fam = t.value; st.sw = 0; renderSw(); }
    else if (t.name === "pose") st.pose = t.value;
    else if (t.name === "sw") st.sw = +t.value;
    paint();
  });
  /* estimator */
  const sI = $("#est-s"), fI = $("#est-f"), cI = $("#est-c"), o1 = $("#est-n"), o2 = $("#est-a");
  if (sI) {
    const calc = () => {
      const S = Math.max(0, +sI.value || 0), chute = clamp(+cI.value || 0, 0, 40), [a] = fI.value.split("|").map(Number);
      const tot = S * (1 + chute / 100), n = a ? Math.ceil(tot / a) : 0;
      o1.textContent = n.toLocaleString(LOC); o2.textContent = Math.round(n * a).toLocaleString(LOC);
    };
    [sI, fI, cI].forEach(i => i.addEventListener("input", calc)); (window.requestIdleCallback ? requestIdleCallback(calc, { timeout: 1200 }) : setTimeout(calc, 200));
    $("#est-devis").addEventListener("click", e => { e.currentTarget.href = devis.href + "&surface=" + encodeURIComponent(sI.value); });
  }
}

/* ---------- lightbox ---------- */
const lb = $(".lb");
if (lb) {
  const links = $$(".mason a"), img = $("img", lb), cp = $("p", lb);
  let i = 0;
  const show = n => { i = (n + links.length) % links.length; const a = links[i]; img.src = a.href; img.alt = $("img", a).alt; cp.textContent = `${String(i + 1).padStart(2, "0")} / ${String(links.length).padStart(2, "0")} — ${$("img", a).alt}`; };
  const open = n => { show(n); lb.classList.add("open"); document.body.style.overflow = "hidden"; $(".x", lb).focus(); };
  const close = () => { lb.classList.remove("open"); document.body.style.overflow = ""; };
  links.forEach((a, n) => a.addEventListener("click", e => { e.preventDefault(); open(n); }));
  $(".x", lb).onclick = close; $(".p", lb).onclick = () => show(i - 1); $(".nx", lb).onclick = () => show(i + 1);
  lb.addEventListener("click", e => { if (e.target === lb) close(); });
  addEventListener("keydown", e => { if (!lb.classList.contains("open")) return; if (e.key === "Escape") close(); if (e.key === "ArrowLeft") show(i - 1); if (e.key === "ArrowRight") show(i + 1); });
}

/* ---------- contact / devis form ---------- */
const form = $("#devis-form");
if (form) {
  const q = new URLSearchParams(location.search), msg = $("#f-msg"), subj = $("#f-sujet"), ref = $("#f-ref");
  if (q.get("famille")) {
    const L = { fc: t("fam_fc", "Fibre-ciment"), hpl: t("fam_hpl", "Stratifié HPL"), alu: t("fam_alu", "Aluminium composite"), lr: t("fam_lr", "Laine de roche comprimée"), bois: t("fam_bois", "Bardage bois"), comp: t("fam_comp", "Bois composite") };
    const P = { plan: t("msgpose_plan","panneaux plans"), cassette: t("msgpose_cassette","cassettes"), lames: t("msgpose_lames","bandeaux / lames") };
    subj.value = "Demande de devis"; ref.value = L[q.get("famille")] || "";
    msg.value = fmt(t("msg_prefill","Bonjour,\\nJe souhaite un devis pour une façade : {fam}, pose en {pose}{tint}{area}.\\n"), { fam: L[q.get("famille")] || "", pose: P[q.get("pose")] || "", tint: q.get("teinte") ? fmt(t("msg_tint",", teinte {v}"), { v: q.get("teinte") }) : "", area: q.get("surface") ? fmt(t("msg_area",", environ {v} m²"), { v: q.get("surface") }) : "" });
  }
  if (q.get("sujet")) subj.value = q.get("sujet");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    $$(".err", form).forEach(n => n.remove());
    let ok = true;
    $$("[required]", form).forEach(el => { const bad = el.type === "checkbox" ? !el.checked : !el.value.trim(); if (bad) { ok = false; const s = document.createElement("span"); s.className = "err"; s.textContent = t("err_req","Champ requis"); el.closest("label").appendChild(s); } });
    const mail = $("#f-email"); if (mail.value && !/^\S+@\S+\.\S+$/.test(mail.value)) { ok = false; const s = document.createElement("span"); s.className = "err"; s.textContent = t("err_mail","Adresse e-mail invalide"); mail.closest("label").appendChild(s); }
    if (!ok) return;
    const d = Object.fromEntries(new FormData(form));
    const txt = `${d.sujet} — ${d.prenom} ${d.nom}${d.societe ? " (" + d.societe + ")" : ""}\nE-mail : ${d.email}${d.tel ? "\nTéléphone : " + d.tel : ""}\nAdresse : ${d.adresse}, ${d.pays}${d.ref ? "\nRéférence produit : " + d.ref : ""}\n\n${d.message || ""}`;
    const out = $("#f-out");
    if (CONFIG.FORM_ENDPOINT) {
      try { await fetch(CONFIG.FORM_ENDPOINT, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } }); $("pre", out).textContent = t("sent", "Merci, votre demande a bien été envoyée. Nous revenons vers vous rapidement.") + "\n\n" + txt; }
      catch (_) { $("pre", out).textContent = txt; }
    } else if (CONFIG.EMAIL) { location.href = `mailto:${CONFIG.EMAIL}?subject=${encodeURIComponent(d.sujet + " — " + d.prenom + " " + d.nom)}&body=${encodeURIComponent(txt)}`; $("pre", out).textContent = txt; }
    else $("pre", out).textContent = txt;
    out.classList.add("show"); out.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    $("#f-copy").onclick = async () => { try { await navigator.clipboard.writeText(txt); $("#f-copy").textContent = t("copied","Copié ✓"); } catch (_) { const r = document.createRange(); r.selectNodeContents($("pre", out)); getSelection().removeAllRanges(); getSelection().addRange(r); } };
  });
}
})();

/* ===== v2.1 details ===== */
(function () {
"use strict";
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
/* scroll progress, back-to-top, mobile action bar */
const bar = $(".prog i"), tt = $(".totop"), mb = $(".mbar");
let SH = 0; const mh = () => { SH = document.documentElement.scrollHeight - innerHeight; }; mh(); addEventListener("resize", mh); addEventListener("load", mh); setTimeout(mh, 1500);
const onS = () => { const h = SH; bar && (bar.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`); tt && tt.classList.toggle("on", scrollY > innerHeight * 1.2); mb && mb.classList.toggle("on", scrollY > innerHeight * .6); };
window.__onScroll(onS); onS();
tt && tt.addEventListener("click", () => scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));
/* split-word heading reveal (hidden state only once the observer exists) */
if ("IntersectionObserver" in window && !reduce) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .3 });
  $$(".sec h2, .head h2").forEach(h => {
    if (h.closest(".hero") || h.closest(".xv")) return;
    let k = 0;
    const walk = n => [...n.childNodes].forEach(c => {
      if (c.nodeType === 3) { const f = document.createDocumentFragment(); c.textContent.split(/(\s+)/).forEach(t => { if (!t) return; if (/^\s+$/.test(t)) f.appendChild(document.createTextNode(" ")); else { const w = document.createElement("span"), i = document.createElement("span"); w.className = "w"; i.textContent = t; i.style.setProperty("--k", k++); w.appendChild(i); f.appendChild(w); } }); c.replaceWith(f); }
      else if (c.nodeType === 1 && c.tagName !== "BR") walk(c);
    });
    walk(h); h.classList.add("sp"); io.observe(h);
  });
}
/* spotlight on cards + magnetic buttons (fine pointers only) */
if (matchMedia("(hover:hover) and (pointer:fine)").matches && !reduce) {
  $$(".bc,.card").forEach(c => c.addEventListener("pointermove", e => { const r = c.getBoundingClientRect(); c.style.setProperty("--mx", (e.clientX - r.left) + "px"); c.style.setProperty("--my", (e.clientY - r.top) + "px"); }));
  $$(".btn").forEach(b => { b.addEventListener("pointermove", e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${((e.clientX - r.left) / r.width - .5) * 8}px,${((e.clientY - r.top) / r.height - .5) * 6 - 2}px)`; }); b.addEventListener("pointerleave", () => b.style.transform = ""); });
}
addEventListener("pageshow", e => e.persisted && document.body.classList.remove("leave"));
})();

/* ===== language switcher + suggestion banner ===== */
(function () {
"use strict";
const $ = (x, r = document) => r.querySelector(x), $$ = (x, r = document) => [...r.querySelectorAll(x)];
const lang = $(".lang");
if (lang) {
  const b = $(".lang__b", lang);
  const set = o => { lang.classList.toggle("open", o); b.setAttribute("aria-expanded", String(o)); };
  b.addEventListener("click", e => { e.stopPropagation(); set(!lang.classList.contains("open")); });
  document.addEventListener("click", e => { if (!lang.contains(e.target)) set(false); });
  addEventListener("keydown", e => { if (e.key === "Escape" && lang.classList.contains("open")) { set(false); b.focus(); } });
  $$(".lang__l a", lang).forEach(a => a.addEventListener("click", () => { try { localStorage.setItem("adf-lang", a.getAttribute("hreflang")); } catch (_) {} }));
}
/* offer (never force) the visitor's language on the French pages */
const cur = document.documentElement.lang;
if (cur === "fr" && lang) {
  let chosen = null, closed = false;
  try { chosen = localStorage.getItem("adf-lang"); closed = sessionStorage.getItem("adf-lang-x") === "1"; } catch (_) {}
  const nav = (navigator.language || "fr").slice(0, 2).toLowerCase();
  const T = { en: ["This site is also available in English.", "English"], de: ["Diese Website gibt es auch auf Deutsch.", "Deutsch"], nl: ["Deze website is ook beschikbaar in het Nederlands.", "Nederlands"], es: ["Este sitio también está disponible en español.", "Español"] };
  const a0 = $$(".lang__l a", lang).find(a => a.getAttribute("hreflang") === nav);
  if (T[nav] && a0 && !chosen && !closed) {
    const d = document.createElement("div"); d.className = "langbar"; d.setAttribute("role", "region"); d.setAttribute("lang", nav);
    d.innerHTML = `<span>${T[nav][0]}</span><a href="${a0.getAttribute("href")}" hreflang="${nav}">${T[nav][1]}</a><button type="button" aria-label="×">×</button>`;
    $("button", d).onclick = () => { d.remove(); try { sessionStorage.setItem("adf-lang-x", "1"); } catch (_) {} };
    setTimeout(() => { document.body.appendChild(d); setTimeout(() => d.remove(), 9000); }, 1800);
  }
}
})();

/* ===== waving flags (strips ripple out of phase, crisp edges) ===== */
(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll(".flag").forEach(function (f, k) {
    var w = f.offsetWidth || 24, strips = Math.max(7, Math.round(w / 3)), sw = Math.max(1, Math.round(w / strips));
    strips = Math.ceil(w / sw);
    f.style.setProperty("--sw", sw + "px"); f.style.setProperty("--d", (k * -0.37).toFixed(2) + "s");
    for (var i = 0; i < strips; i++) { var s = document.createElement("i"); s.style.setProperty("--i", i); if (i === strips - 1) s.style.width = (w - sw * i) + "px"; f.appendChild(s); }
    f.classList.add("is-waving");
  });
})();

/* pause the logo marquee while off screen (keeps scroll frames cheap) */
(function () {
  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle("is-off", !e.isIntersecting)), { rootMargin: "100px 0px" });
  document.querySelectorAll(".mq__tr").forEach(t => io.observe(t));
})();
