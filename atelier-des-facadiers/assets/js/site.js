/* Atelier des Façadiers — site.js (vanilla, no build). Every enhancement is layered on top of content that is already visible. */
const CONFIG = {
  EMAIL: "",          // adresse qui reçoit les demandes de devis (laisser vide = récapitulatif à copier + boutons d'appel)
  FORM_ENDPOINT: ""   // ou une URL Formspree / API qui reçoit le formulaire en POST
};
(function () {
"use strict";
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
document.documentElement.classList.add("js");

/* ---------- header ---------- */
const hdr = $(".hdr");
if (hdr) {
  const solid = () => hdr.classList.toggle("is-solid", scrollY > 40);
  if (!hdr.classList.contains("hdr--page")) { solid(); addEventListener("scroll", solid, { passive: true }); }
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
    const f = n => { const p = clamp((n - t0) / dur), v = Math.round(to * (1 - Math.pow(1 - p, 3))); el.textContent = v.toLocaleString("fr-FR"); if (p < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  }), { threshold: .6 });
  cu.forEach(el => io2.observe(el));
}

/* ---------- hero: panel-by-panel cladding reveal ---------- */
const hero = $(".hero");
if (hero && !reduce) {
  const cols = innerWidth < 700 ? 6 : 14, rows = innerWidth < 700 ? 10 : 8;
  const g = document.createElement("div"); g.className = "cladding"; g.setAttribute("aria-hidden", "true");
  g.style.gridTemplateColumns = `repeat(${cols},1fr)`; g.style.gridTemplateRows = `repeat(${rows},1fr)`;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const i = document.createElement("i"); i.style.setProperty("--d", ((rows - 1 - r) * 60 + c * 45 + Math.random() * 90).toFixed(0) + "ms"); g.appendChild(i); }
  hero.appendChild(g); setTimeout(() => g.remove(), 2600);
}
const hs = $$(".hs"), hd = $$(".hero__dots span");
if (hs.length > 1 && !reduce) {
  let k = 0; const go = n => { hs[k].classList.remove("on"); hd[k] && hd[k].classList.remove("on"); k = n % hs.length; hs[k].classList.add("on"); hd[k] && hd[k].classList.add("on"); };
  setInterval(() => { if (!document.hidden) go(k + 1); }, 6500);
}

/* ---------- exploded façade (scroll-driven) ---------- */
const xv = $(".xv");
if (xv) {
  const scene = $(".xv__scene", xv), layers = $$(".xv__layer", xv), items = $$(".xv__list li", xv);
  const N = items.length;
  const setOn = k => { items.forEach((li, i) => li.classList.toggle("on", i === k)); layers.forEach(l => l.classList.toggle("on", +l.dataset.n === k)); scene.classList.toggle("has-on", k >= 0); };
  const upd = () => {
    if (reduce) { setOn(N - 1); return; }
    const r = xv.getBoundingClientRect(), p = clamp(-r.top / (r.height - innerHeight));
    const ex = clamp(p / .34), e = ex * ex * (3 - 2 * ex);
    xv.style.setProperty("--ex", e.toFixed(3)); scene.style.setProperty("--ex", e.toFixed(3));
    const k = p < .3 ? -1 : Math.min(N - 1, Math.floor((p - .3) / .7 * N));
    setOn(k);
  };
  addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); upd();
  items.forEach((li, i) => li.addEventListener("click", () => {
    const r = xv.getBoundingClientRect(), top = scrollY + r.top, span = r.height - innerHeight;
    scrollTo({ top: top + (.3 + (i + .5) / N * .7) * span, behavior: reduce ? "auto" : "smooth" });
  }));
}

/* ---------- façade configurator ---------- */
const cfgEl = $("#cfg");
if (cfgEl) {
  const FAM = {
    fc:   { n: "Fibre-ciment", b: "Equitone · Cedral", f: "matte", inv: "Tergo Design (Equitone)", sw: [["Blanc minéral","#e8e6df"],["Gris perle","#bdbfbf"],["Sable","#cdbb9a"],["Terre cuite","#b4653f"],["Anthracite","#3c4147"],["Vert mousse","#7f8c6a"]] },
    hpl:  { n: "Stratifié HPL", b: "Fundermax · Trespa · Pura by Trespa", f: "smooth", inv: "Eclip's (Fundermax) · TS200 (Trespa)", sw: [["Noir profond","#15181c"],["Graphite","#3d434a"],["Chêne clair","#c9a46b"],["Bleu ardoise","#3b556b"],["Rouge brique","#9a3d2f"],["Blanc cassé","#ecebe6"]] },
    alu:  { n: "Aluminium composite", b: "Stacbond · Alpolic", f: "metal", inv: "Cassettes CH (Stacbond) · M-BASE (Alpolic)", sw: [["Argent","#b7bcc2"],["Anthracite métal","#4b5058"],["Bronze","#7b5b3f"],["Bleu nuit","#1f3550"],["Champagne","#cdbb94"],["Cuivre","#b3653c"]] },
    lr:   { n: "Laine de roche comprimée", b: "Rockpanel", f: "matte", inv: null, sw: [["Gris minéral","#8e9490"],["Anthracite","#353a3f"],["Beige","#c9b9a2"],["Brun","#6b4d3a"],["Vert sapin","#3f5a4a"],["Blanc","#e5e3dc"]] },
    bois: { n: "Bardage bois", b: "Bardage bois", f: "wood", inv: null, sw: [["Naturel","#c89a63"],["Chêne doré","#b8864a"],["Brun","#6a4a31"],["Gris argenté","#9a968f"],["Noir brûlé","#24201d"],["Cèdre rouge","#9a5b3d"]] },
    comp: { n: "Bois composite", b: "Fiberdeck", f: "wood", inv: null, sw: [["Teck","#a37a4b"],["Gris galet","#8c8a86"],["Brun","#5b4333"],["Anthracite","#35383c"],["Sable","#c5b08d"],["Noir","#1b1c1e"]] }
  };
  const POSE = { plan: "Panneaux plans", cassette: "Cassettes", lames: "Bandeaux / lames" };
  const st = { fam: "fc", pose: "plan", sw: 0 };
  const q = new URLSearchParams(location.search);
  if (FAM[q.get("famille")]) st.fam = q.get("famille"); if (POSE[q.get("pose")]) st.pose = q.get("pose");
  const famBox = $("#cfg-fam", cfgEl), poseBox = $("#cfg-pose", cfgEl), swBox = $("#cfg-sw", cfgEl), view = $("#cfg-svg", cfgEl), sum = $("#cfg-sum", cfgEl), devis = $("#cfg-devis", cfgEl), cap = $("#cfg-cap", cfgEl);
  const hex2 = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (h, t, a) => "#" + hex2(h).map((v, i) => Math.round(v + (hex2(t)[i] - v) * a).toString(16).padStart(2, "0")).join("");
  const lum = h => { const [r, g, b] = hex2(h); return (r * .299 + g * .587 + b * .114) / 255; };
  const chip = (name, val, label, sub, checked) => `<label class="chip"><input type="radio" name="${name}" value="${val}" ${checked ? "checked" : ""}><span>${label}${sub ? `<small>${sub}</small>` : ""}</span></label>`;
  famBox.innerHTML = Object.entries(FAM).map(([k, f]) => chip("fam", k, f.n, f.b, k === st.fam)).join("");
  poseBox.innerHTML = Object.entries(POSE).map(([k, v]) => chip("pose", k, v, "", k === st.pose)).join("");
  function renderSw() {
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
    return `<svg viewBox="0 0 800 520" role="img" aria-label="Aperçu de façade : ${f.n}, ${POSE[st.pose]}, teinte ${f.sw[st.sw][0]}">
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
<text x="${BX + BW + 34}" y="${BY + BH / 2}" font-family="IBM Plex Mono,monospace" font-size="11" fill="#244760" transform="rotate(90 ${BX + BW + 34} ${BY + BH / 2})" text-anchor="middle" letter-spacing="2">ÉLÉVATION — ÉCH. INDICATIVE</text>
</svg>`;
  }
  function paint() {
    const f = FAM[st.fam], s = f.sw[st.sw];
    view.innerHTML = svg();
    document.documentElement.style.setProperty("--panel", s[1]);
    sum.innerHTML = `<div><b>${f.n}</b> — ${f.b}</div><div>Pose : ${POSE[st.pose]} · Teinte : ${s[0]} <span class="note">(indicative)</span></div><div>${f.inv ? `Fixation invisible possible : ${f.inv}` : "Fixation visible : vis, rivets, EPDM."}</div>`;
    cap.textContent = `${f.n} / ${POSE[st.pose]} / ${s[0]}`;
    const u = new URLSearchParams({ famille: st.fam, pose: st.pose, teinte: s[0] });
    devis.href = "contact.html?" + u.toString() + "#devis";
    history.replaceState(null, "", "?" + new URLSearchParams({ famille: st.fam, pose: st.pose }).toString() + location.hash);
  }
  renderSw(); paint();
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
      o1.textContent = n.toLocaleString("fr-FR"); o2.textContent = (n * a).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };
    [sI, fI, cI].forEach(i => i.addEventListener("input", calc)); calc();
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
    const L = { fc: "Fibre-ciment", hpl: "Stratifié HPL", alu: "Aluminium composite", lr: "Laine de roche comprimée", bois: "Bardage bois", comp: "Bois composite" }, P = { plan: "panneaux plans", cassette: "cassettes", lames: "bandeaux / lames" };
    subj.value = "Demande de devis"; ref.value = L[q.get("famille")] || "";
    msg.value = `Bonjour,\nJe souhaite un devis pour une façade : ${L[q.get("famille")] || ""}, pose en ${P[q.get("pose")] || ""}${q.get("teinte") ? ", teinte " + q.get("teinte") : ""}${q.get("surface") ? ", environ " + q.get("surface") + " m²" : ""}.\n`;
  }
  if (q.get("sujet")) subj.value = q.get("sujet");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    $$(".err", form).forEach(n => n.remove());
    let ok = true;
    $$("[required]", form).forEach(el => { const bad = el.type === "checkbox" ? !el.checked : !el.value.trim(); if (bad) { ok = false; const s = document.createElement("span"); s.className = "err"; s.textContent = "Champ requis"; el.closest("label").appendChild(s); } });
    const mail = $("#f-email"); if (mail.value && !/^\S+@\S+\.\S+$/.test(mail.value)) { ok = false; const s = document.createElement("span"); s.className = "err"; s.textContent = "Adresse e-mail invalide"; mail.closest("label").appendChild(s); }
    if (!ok) return;
    const d = Object.fromEntries(new FormData(form));
    const txt = `${d.sujet} — ${d.prenom} ${d.nom}${d.societe ? " (" + d.societe + ")" : ""}\nE-mail : ${d.email}${d.tel ? "\nTéléphone : " + d.tel : ""}\nAdresse : ${d.adresse}, ${d.pays}${d.ref ? "\nRéférence produit : " + d.ref : ""}\n\n${d.message || ""}`;
    const out = $("#f-out");
    if (CONFIG.FORM_ENDPOINT) {
      try { await fetch(CONFIG.FORM_ENDPOINT, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } }); $("pre", out).textContent = "Merci, votre demande a bien été envoyée. Nous revenons vers vous rapidement.\n\n" + txt; }
      catch (_) { $("pre", out).textContent = txt; }
    } else if (CONFIG.EMAIL) { location.href = `mailto:${CONFIG.EMAIL}?subject=${encodeURIComponent(d.sujet + " — " + d.prenom + " " + d.nom)}&body=${encodeURIComponent(txt)}`; $("pre", out).textContent = txt; }
    else $("pre", out).textContent = txt;
    out.classList.add("show"); out.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    $("#f-copy").onclick = async () => { try { await navigator.clipboard.writeText(txt); $("#f-copy").textContent = "Copié ✓"; } catch (_) { const r = document.createRange(); r.selectNodeContents($("pre", out)); getSelection().removeAllRanges(); getSelection().addRange(r); } };
  });
}
})();
