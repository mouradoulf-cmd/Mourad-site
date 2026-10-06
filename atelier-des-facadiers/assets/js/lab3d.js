/* ==========================================================================
   lab3d.js — two small, useful 3D viewers (lazy ES module, Three.js self-hosted).

   · bardage.html  "Matières en 3D": a 2 × 3 façade wall on aluminium rails; pick a cladding family and the
     panels flip over to that material. Texts come from the page's own (already translated) cards.
   · ossature.html "Profils en 3D": the six section shapes (TE, cornière, oméga, zed, U, tube) as real
     extrusions you can turn with the pointer. Labels come from the page's own strip.

   Rules: nothing is added unless WebGL is real (no software renderer) and the visitor has not asked for
   reduced motion or data saving; if anything fails the page stays exactly as it was. Render loop runs only
   while the viewer is on screen. Shapes are schematic, no dimensions or performance figures are shown.
   ========================================================================== */
import * as THREE from "../vendor/three.module.min.js";

const D = document;
const lang = (D.documentElement.lang || "fr").slice(0, 2);
const T = {
  fr: { eMat: "Matières en 3D", tMat: "Choisissez une matière.<br>Faites-la tourner.", eProf: "Profils en 3D", tProf: "Les sections,<br>en volume.", hint: "Glissez pour tourner", note: "Rendu indicatif : teintes et textures varient selon les gammes.", noteP: "Représentation schématique des sections, non contractuelle.", view: "Vue 3D interactive", sel: "Sélection" },
  en: { eMat: "Materials in 3D", tMat: "Pick a material.<br>Turn it around.", eProf: "Profiles in 3D", tProf: "The sections,<br>in volume.", hint: "Drag to rotate", note: "Indicative render: colours and textures vary by range.", noteP: "Schematic representation of the sections, not contractual.", view: "Interactive 3D view", sel: "Selection" },
  de: { eMat: "Materialien in 3D", tMat: "Material wählen.<br>Drehen Sie es.", eProf: "Profile in 3D", tProf: "Die Querschnitte,<br>räumlich.", hint: "Zum Drehen ziehen", note: "Richtwert: Farben und Texturen variieren je nach Sortiment.", noteP: "Schematische Darstellung der Querschnitte, unverbindlich.", view: "Interaktive 3D-Ansicht", sel: "Auswahl" },
  nl: { eMat: "Materialen in 3D", tMat: "Kies een materiaal.<br>Draai het rond.", eProf: "Profielen in 3D", tProf: "De doorsneden,<br>in volume.", hint: "Sleep om te draaien", note: "Indicatieve weergave: kleuren en texturen variëren per assortiment.", noteP: "Schematische weergave van de doorsneden, niet contractueel.", view: "Interactieve 3D-weergave", sel: "Selectie" },
  es: { eMat: "Materiales en 3D", tMat: "Elija un material.<br>Hágalo girar.", eProf: "Perfiles en 3D", tProf: "Las secciones,<br>en volumen.", hint: "Arrastre para girar", note: "Representación indicativa: los colores y texturas varían según la gama.", noteP: "Representación esquemática de las secciones, no contractual.", view: "Vista 3D interactiva", sel: "Selección" }
}[lang] || null;

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const force = /gl=force/.test(location.href);

function glOk() {
  if (!T) return false;
  if (reduce && !force) return false;
  if (navigator.connection && navigator.connection.saveData) return false;
  if ((navigator.hardwareConcurrency || 8) < 4 && !force) return false;
  try {
    const c = D.createElement("canvas"), gl = c.getContext("webgl2") || c.getContext("webgl"); if (!gl) return false;
    const e = gl.getExtension("WEBGL_debug_renderer_info"), r = e ? String(gl.getParameter(e.UNMASKED_RENDERER_WEBGL)) : "";
    if (/swiftshader|llvmpipe|software|basic render/i.test(r) && !force) return false;
  } catch (e) { return false; }
  return true;
}

/* ---------------------------------------------------------------- procedural textures */
function tex(draw, size, repeatX, repeatY, srgb) {
  const c = D.createElement("canvas"); c.width = c.height = size; const g = c.getContext("2d"); draw(g, size);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeatX || 1, repeatY || 1); t.anisotropy = 4;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace; return t;
}
const rnd = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
function speckle(g, n, base, amp, count, sz) {
  g.fillStyle = base; g.fillRect(0, 0, n, n);
  for (let i = 0; i < count; i++) { const v = Math.floor(128 + (rnd() - .5) * amp); g.fillStyle = "rgba(" + v + "," + v + "," + v + "," + (.08 + rnd() * .22) + ")"; g.fillRect(rnd() * n, rnd() * n, sz * (.5 + rnd()), sz * (.5 + rnd())); }
}

/* the six cladding families: appearance only */
function materialSet() {
  const bump = {
    fiber: tex((g, n) => speckle(g, n, "#808080", 90, 5000, 3), 256, 2, 3),
    rock: tex((g, n) => { g.fillStyle = "#808080"; g.fillRect(0, 0, n, n); for (let i = 0; i < 1400; i++) { g.strokeStyle = "rgba(" + (rnd() > .5 ? "255,255,255" : "0,0,0") + ",.12)"; g.lineWidth = 1; g.beginPath(); const x = rnd() * n, y = rnd() * n; g.moveTo(x, y); g.lineTo(x + (rnd() - .5) * 26, y + (rnd() - .5) * 26); g.stroke(); } }, 256, 2, 3),
    brushed: tex((g, n) => { g.fillStyle = "#808080"; g.fillRect(0, 0, n, n); for (let i = 0; i < 900; i++) { g.fillStyle = "rgba(" + (rnd() > .5 ? "255,255,255" : "0,0,0") + ",.07)"; g.fillRect(0, rnd() * n, n, 1 + rnd() * 1.4); } }, 256, 1, 3)
  };
  const wood = tex((g, n) => {
    g.fillStyle = "#8a5a35"; g.fillRect(0, 0, n, n); const lames = 6, w = n / lames;
    for (let l = 0; l < lames; l++) {
      const tone = 112 + Math.floor(rnd() * 34); g.fillStyle = "rgb(" + tone + "," + Math.floor(tone * .62) + "," + Math.floor(tone * .38) + ")"; g.fillRect(l * w, 0, w, n);
      for (let k = 0; k < 90; k++) { g.strokeStyle = "rgba(60,30,12," + (.05 + rnd() * .12) + ")"; g.lineWidth = .6 + rnd(); const x = l * w + rnd() * w; g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + (rnd() - .5) * 8, n * .3, x + (rnd() - .5) * 8, n * .7, x + (rnd() - .5) * 5, n); g.stroke(); }
      g.fillStyle = "rgba(20,10,4,.55)"; g.fillRect(l * w, 0, 2, n);
    }
  }, 512, 1, 1, true);
  const deck = tex((g, n) => {
    g.fillStyle = "#6f6a60"; g.fillRect(0, 0, n, n); const rows = 8, h = n / rows;
    for (let r = 0; r < rows; r++) { const v = 96 + Math.floor(rnd() * 22); g.fillStyle = "rgb(" + v + "," + (v - 4) + "," + (v - 12) + ")"; g.fillRect(0, r * h, n, h); for (let k = 0; k < 60; k++) { g.fillStyle = "rgba(255,255,255,.04)"; g.fillRect(rnd() * n, r * h + 3 + rnd() * (h - 6), 20 + rnd() * 60, 1); } g.fillStyle = "rgba(10,10,10,.6)"; g.fillRect(0, r * h, n, 2); }
  }, 512, 1, 1, true);
  const std = (o) => new THREE.MeshStandardMaterial(Object.assign({ envMapIntensity: .95 }, o));
  return [
    std({ color: 0xb4b2a8, roughness: .93, metalness: 0, bumpMap: bump.fiber, bumpScale: 1.4 }),
    std({ color: 0xb9c3cc, roughness: .26, metalness: .88, roughnessMap: bump.brushed, envMapIntensity: 1.35 }),
    new THREE.MeshPhysicalMaterial({ color: 0x2c333b, roughness: .42, metalness: 0, clearcoat: .55, clearcoatRoughness: .3, envMapIntensity: 1 }),
    std({ color: 0xc2673c, roughness: .96, metalness: 0, bumpMap: bump.rock, bumpScale: 2.2 }),
    std({ color: 0xffffff, map: wood, roughness: .72, metalness: 0 }),
    std({ color: 0xffffff, map: deck, roughness: .82, metalness: 0 })
  ];
}

/* ---------------------------------------------------------------- scene helpers */
function makeEnv(renderer) {
  const pm = new THREE.PMREMGenerator(renderer), s = new THREE.Scene();
  s.add(new THREE.Mesh(new THREE.SphereGeometry(10, 24, 16), new THREE.ShaderMaterial({
    side: THREE.BackSide,
    vertexShader: "varying vec3 p;void main(){p=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
    fragmentShader: "varying vec3 p;void main(){float h=p.y*.5+.5;vec3 low=vec3(.04,.05,.07),mid=vec3(.2,.28,.42),top=vec3(.95,.93,.9);vec3 c=mix(low,mid,smoothstep(.15,.55,h));c=mix(c,top,smoothstep(.6,1.,h));c+=vec3(1.,.55,.3)*pow(max(0.,dot(p,normalize(vec3(.7,.35,.6)))),20.)*1.5;c+=vec3(.5,.7,1.)*pow(max(0.,dot(p,normalize(vec3(-.8,.2,-.3)))),14.)*.9;gl_FragColor=vec4(c,1.);}"
  })));
  const t = pm.fromScene(s, .04).texture; pm.dispose(); return t;
}
function shadowTex() {
  return tex((g, n) => { const r = g.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2); r.addColorStop(0, "rgba(0,0,0,.55)"); r.addColorStop(1, "rgba(0,0,0,0)"); g.clearRect(0, 0, n, n); g.fillStyle = r; g.fillRect(0, 0, n, n); }, 128);
}
function slabGeo(w, h, d, bevel) {
  const s = new THREE.Shape(); s.moveTo(-w / 2, -h / 2); s.lineTo(w / 2, -h / 2); s.lineTo(w / 2, h / 2); s.lineTo(-w / 2, h / 2); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2, curveSegments: 1 });
  g.translate(0, 0, -d / 2); return g;
}
const ease = (x) => 1 - Math.pow(1 - x, 3);

/* generic viewer shell: canvas + HUD + render loop owned by the caller's `frame(dt, t)` */
function viewer(host, opts) {
  const canvas = host.querySelector("canvas");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  const scene = new THREE.Scene(); scene.environment = makeEnv(renderer);
  const camera = new THREE.PerspectiveCamera(30, 1, .1, 60); camera.position.set(0, .4, opts.dist || 11);
  const key = new THREE.DirectionalLight(0xfff1e2, 2.2); key.position.set(-4, 6, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(0x6d9aea, 1.6); rim.position.set(6, 2, -5); scene.add(rim);
  scene.add(new THREE.AmbientLight(0x8aa0c0, .25));
  const pivot = new THREE.Group(); scene.add(pivot);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), new THREE.MeshBasicMaterial({ map: shadowTex(), transparent: true, depthWrite: false }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = opts.floorY; scene.add(floor);

  const st = { yaw: opts.yaw0 || 0, pitch: opts.pitch0 || 0, vy: 0, vp: 0, drag: false, lx: 0, ly: 0, touched: false, visible: false, last: 0, raf: 0, dirty: true };
  const clampP = (p) => Math.max(-.5, Math.min(.5, p));
  canvas.style.touchAction = "pan-y";
  canvas.addEventListener("pointerdown", (e) => { st.drag = true; st.touched = true; st.lx = e.clientX; st.ly = e.clientY; try { canvas.setPointerCapture(e.pointerId); } catch (x) {} host.classList.add("is-drag"); });
  canvas.addEventListener("pointermove", (e) => { if (!st.drag) return; const dx = e.clientX - st.lx, dy = e.clientY - st.ly; st.lx = e.clientX; st.ly = e.clientY; st.vy = dx * .0085; st.vp = dy * .004; st.yaw += st.vy; st.pitch = clampP(st.pitch + st.vp); st.dirty = true; wake(); });
  const end = () => { st.drag = false; host.classList.remove("is-drag"); };
  canvas.addEventListener("pointerup", end); canvas.addEventListener("pointercancel", end);
  canvas.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") { st.yaw -= .25; st.touched = true; st.dirty = true; wake(); } if (e.key === "ArrowRight") { st.yaw += .25; st.touched = true; st.dirty = true; wake(); } });

  function size() { const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); camera.aspect = w / h; camera.fov = w / h < .9 ? 38 : 30; camera.updateProjectionMatrix(); st.dirty = true; }
  size(); new ResizeObserver(size).observe(host);

  const api = { THREE, scene, pivot, camera, renderer, st, host, ang: host.querySelector("[data-ang]"), update: null };
  let lastAng = -1;
  function loop(now) {
    st.raf = 0; if (!st.visible || D.hidden) return;
    const dt = Math.min(.05, (now - st.last) / 1000 || .016); st.last = now;
    let moving = false;
    if (!st.drag && (Math.abs(st.vy) > .0004 || Math.abs(st.vp) > .0004)) { st.yaw += st.vy; st.pitch = clampP(st.pitch + st.vp); st.vy *= .94; st.vp *= .9; moving = true; }
    if (api.update) { if (api.update(dt, now / 1000)) moving = true; }
    if (opts.auto && !reduce && !st.touched && !st.drag) { st.yaw += opts.auto * dt; moving = true; }
    pivot.rotation.y = st.yaw; pivot.rotation.x = st.pitch;
    const deg = Math.round(((st.yaw * 180 / Math.PI) % 360 + 360) % 360); if (api.ang && deg !== lastAng) { lastAng = deg; api.ang.textContent = String(deg).padStart(3, "0") + "°"; }
    renderer.render(scene, camera); st.dirty = false;
    if (moving || st.dirty || api.animating) st.raf = requestAnimationFrame(loop);
  }
  function wake() { if (!st.raf && st.visible) { st.last = performance.now(); st.raf = requestAnimationFrame(loop); } }
  api.wake = wake;
  new IntersectionObserver((e) => { st.visible = e[0].isIntersecting; if (st.visible) { size(); wake(); } }, { threshold: .08 }).observe(host);
  D.addEventListener("visibilitychange", wake);
  canvas.addEventListener("webglcontextlost", () => { host.closest(".lab").remove(); });
  return api;
}

const hud = (title, hint, note, extra) => '<div class="lab__stage" role="group" aria-label="' + T.view + '"><canvas tabindex="0" aria-label="' + T.view + '"></canvas>' +
  '<i class="lab__c lab__c--tl"></i><i class="lab__c lab__c--tr"></i><i class="lab__c lab__c--bl"></i><i class="lab__c lab__c--br"></i>' +
  '<div class="lab__hud lab__hud--tl"><span class="mono">' + T.sel + '</span><b data-name>' + (title || "") + '</b></div>' +
  '<div class="lab__hud lab__hud--tr mono"><span>θ</span> <b data-ang>000°</b></div>' +
  '<div class="lab__hud lab__hud--bl mono"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10a6 6 0 0110.5-4M16 10a6 6 0 01-10.5 4M14.5 3v3h-3M5.5 17v-3h3"/></svg>' + hint + '</div>' + (extra || "") + '</div>';

/* ================================================================ bardage: materials */
function bardage() {
  const cards = [].slice.call(D.querySelectorAll("main .card.brand")); if (cards.length < 3) return;
  const items = cards.map((c) => ({ name: c.querySelector("h2, h3").textContent.trim(), text: (c.querySelector("p") || {}).textContent || "" }));
  const first = D.querySelector("main > section.sec"); if (!first) return;
  const sec = D.createElement("section"); sec.className = "sec sec--dark blueprint lab"; sec.id = "lab-matieres";
  sec.innerHTML = '<div class="wrap"><div class="head head--split"><div><span class="eyebrow"><b>3D</b> ' + T.eMat + '</span><h2 style="margin-top:1rem">' + T.tMat + '</h2></div><p class="lead lab__cap" aria-live="polite"></p></div>' +
    hud(items[0].name, T.hint, "") + '<div class="lab__tabs" role="tablist">' + items.map((it, i) => '<button type="button" role="tab" class="lab__tab" data-i="' + i + '" aria-selected="' + (i === 0) + '"><b>' + String(i + 1).padStart(2, "0") + '</b><span>' + it.name + '</span></button>').join("") + '</div>' +
    '<p class="note lab__note">' + T.note + '</p></div>';
  first.parentNode.insertBefore(sec, first);
  const host = sec.querySelector(".lab__stage"), cap = sec.querySelector(".lab__cap"), nameEl = sec.querySelector("[data-name]");
  cap.textContent = items[0].text;

  const v = viewer(host, { dist: 12.5, floorY: -2.3, yaw0: -.5, pitch0: .08 });
  const { THREE: TH, pivot } = v, mats = materialSet();
  /* aluminium rails behind the panels */
  const rail = new TH.MeshStandardMaterial({ color: 0x8f9aa6, metalness: .9, roughness: .38, envMapIntensity: 1.2 });
  const railGeo = slabGeo(.16, 5.4, .22, .02);
  [-1.9, 0, 1.9].forEach((x) => { const r = new TH.Mesh(railGeo, rail); r.position.set(x, 0, -.32); pivot.add(r); });
  /* 2 columns × 3 rows of panels */
  const W = 1.75, H = 1.65, G = .09, geo = slabGeo(W, H, .14, .03), tiles = [];
  for (let cx = 0; cx < 2; cx++) for (let ry = 0; ry < 3; ry++) {
    const holder = new TH.Group(); holder.position.set((cx - .5) * (W + G), (1 - ry) * (H + G), 0);
    const m = new TH.Mesh(geo, mats[0]); holder.add(m); holder.userData = { m, flip: -1, to: 0, delay: (cx * 3 + ry) * .07 }; pivot.add(holder); tiles.push(holder);
  }
  let cur = 0, clock = 0, pending = null;
  v.update = (dt) => {
    clock += dt; let busy = false;
    tiles.forEach((h) => {
      const u = h.userData; if (u.flip < 0) return; u.flip += dt / .75; const k = Math.min(1, Math.max(0, (u.flip - u.delay) / 1));
      h.rotation.y = ease(k) * Math.PI; if (k > .5 && u.m.material !== mats[u.to]) u.m.material = mats[u.to];
      h.children[0].rotation.y = k > .5 ? Math.PI : 0;       /* keep the texture un-mirrored after the half turn */
      if (k >= 1) { u.flip = -1; h.rotation.y = 0; h.children[0].rotation.y = 0; } else busy = true;
    });
    v.animating = busy; return busy;
  };
  v.st.yaw = -.5;
  function select(i, byUser) {
    if (i === cur) return; cur = i;
    sec.querySelectorAll(".lab__tab").forEach((b, k) => b.setAttribute("aria-selected", String(k === i)));
    nameEl.textContent = items[i].name; cap.textContent = items[i].text;
    tiles.forEach((h) => { if (reduce) { h.userData.m.material = mats[i]; } else { h.userData.to = i; h.userData.flip = 0; } });
    v.st.dirty = true; v.animating = true; v.wake();
  }
  sec.querySelector(".lab__tabs").addEventListener("click", (e) => { const b = e.target.closest(".lab__tab"); if (b) select(+b.dataset.i, true); });
  sec.querySelector(".lab__tabs").addEventListener("keydown", (e) => { const n = items.length; let i = cur; if (e.key === "ArrowRight") i = (cur + 1) % n; else if (e.key === "ArrowLeft") i = (cur + n - 1) % n; else return; e.preventDefault(); select(i, true); sec.querySelector('.lab__tab[data-i="' + i + '"]').focus(); });
  /* swaying (not full turns) so the wall stays readable */
  const sway = v.update; let t0 = 0;
  v.update = (dt, t) => { const busy = sway(dt, t); if (!v.st.touched && !reduce) { v.st.yaw = -.5 + Math.sin(t * .35) * .42; return true; } return busy; };
}

/* ================================================================ ossature: profiles */
function ossature() {
  const prof = D.querySelector("main .prof"); if (!prof) return;
  const tabs = [].slice.call(prof.children); if (tabs.length < 6) return;
  const labels = tabs.map((d) => (d.querySelector("span") || {}).textContent || "");
  const stage = D.createElement("div"); stage.innerHTML = hud(labels[0], T.hint, "");
  const wrap = stage.firstChild; wrap.classList.add("lab__stage--prof"); prof.parentNode.insertBefore(wrap, prof);
  wrap.closest("section").classList.add("lab");
  prof.classList.add("prof--tabs"); prof.setAttribute("role", "tablist");
  const host = wrap, nameEl = host.querySelector("[data-name]");

  const v = viewer(host, { dist: 11, floorY: -2.05, yaw0: -.95, pitch0: .2, auto: .45 });
  const { THREE: TH, pivot } = v;
  const alu = new TH.MeshStandardMaterial({ color: 0xcfd6de, metalness: .93, roughness: .3, envMapIntensity: 1.25 });
  const edgeMat = new TH.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: .22 });
  const L = 2.4, t = .2;
  const part = (w, h, x, y, rz) => { const g = slabGeo(w, h, L, .025), m = new TH.Mesh(g, alu); m.position.set(x, y, 0); if (rz) m.rotation.z = rz; m.add(new TH.LineSegments(new TH.EdgesGeometry(g, 30), edgeMat)); return m; };
  const S = 2.1;
  const builders = [
    () => [part(S, t, 0, S / 2 - t / 2, 0), part(t, S, 0, -t / 2, 0)],                                            /* TE */
    () => [part(t, S, -S / 2 + t / 2, 0, 0), part(S, t, 0, -S / 2 + t / 2, 0)],                                  /* cornière */
    () => { const a = Math.atan2(1.7, .55); const len = Math.hypot(.55, 1.7); return [part(.95, t, -1.3, -.85, 0), part(.95, t, 1.3, -.85, 0), part(len, t, -.83, 0, a), part(len, t, .83, 0, -a), part(1.0, t, 0, .85, 0)]; }, /* oméga */
    () => [part(1.2, t, -.5, S / 2 - t / 2, 0), part(t, S, 0, 0, 0), part(1.2, t, .5, -S / 2 + t / 2, 0)],        /* zed */
    () => [part(t, S, -S / 2 + t / 2, 0, 0), part(t, S, S / 2 - t / 2, 0, 0), part(S, t, 0, -S / 2 + t / 2, 0)], /* U */
    () => [part(S, t, 0, S / 2 - t / 2, 0), part(S, t, 0, -S / 2 + t / 2, 0), part(t, S - 2 * t, -S / 2 + t / 2, 0, 0), part(t, S - 2 * t, S / 2 - t / 2, 0, 0)] /* tube */
  ];
  const shapes = builders.map((b) => { const g = new TH.Group(); b().forEach((m) => g.add(m)); g.visible = false; pivot.add(g); return g; });
  let cur = 0, from = -1, k = 1; shapes[0].visible = true;
  v.update = (dt) => {
    if (k >= 1) { v.animating = false; return false; }
    k = Math.min(1, k + dt / .55); const e = ease(k);
    if (from >= 0) { const o = shapes[from]; o.scale.setScalar(Math.max(.001, 1 - e * 1.2)); o.visible = k < .45; }
    const n = shapes[cur]; n.visible = k > .3; n.scale.setScalar(Math.min(1, Math.max(.001, (k - .3) / .7))); n.rotation.z = (1 - ease(Math.min(1, Math.max(0, (k - .3) / .7)))) * -.6;
    if (k >= 1) { shapes.forEach((s, i) => { s.visible = i === cur; s.scale.setScalar(1); s.rotation.z = 0; }); from = -1; }
    v.animating = k < 1; return k < 1;
  };
  function select(i) {
    if (i === cur) return; from = cur; cur = i; k = reduce ? 1 : 0;
    tabs.forEach((d, n) => { d.classList.toggle("is-on", n === i); d.setAttribute("aria-selected", String(n === i)); });
    nameEl.textContent = labels[i];
    if (reduce) { shapes.forEach((s, n) => { s.visible = n === i; }); }
    v.st.dirty = true; v.animating = true; v.wake();
  }
  tabs.forEach((d, i) => { d.setAttribute("role", "tab"); d.tabIndex = i === 0 ? 0 : -1; d.setAttribute("aria-selected", String(i === 0)); if (i === 0) d.classList.add("is-on");
    d.addEventListener("click", () => select(i));
    d.addEventListener("keydown", (e) => { let n = cur; if (e.key === "ArrowRight") n = (cur + 1) % tabs.length; else if (e.key === "ArrowLeft") n = (cur + tabs.length - 1) % tabs.length; else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(i); return; } else return; e.preventDefault(); tabs.forEach((x, m) => (x.tabIndex = m === n ? 0 : -1)); tabs[n].focus(); select(n); }); });
  const note = prof.parentNode.querySelector(".note"); if (note) note.textContent = T.noteP;
}

export function init(page) { if (!glOk()) return; try { if (page === "bardage") bardage(); else if (page === "ossature") ossature(); } catch (e) { /* the page stays as it was */ } }
