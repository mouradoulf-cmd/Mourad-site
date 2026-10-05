/* English Easy TH — gl.js: real-time WebGL background (hyperspace starfield + holographic core). ES module, lazy, skipped on weak/software GL. */
import * as THREE from "../vendor/three.module.min.js";
const EE = window.EE, force = /gl=force/.test(location.hash);
function weak() {
  if (EE.reduce && !force) return true; if (force) return false;
  if ((navigator.hardwareConcurrency || 4) <= 2) return true;
  try { const c = document.createElement("canvas"), g = c.getContext("webgl"); if (!g) return true; const e = g.getExtension("WEBGL_debug_renderer_info"); const r = e ? g.getParameter(e.UNMASKED_RENDERER_WEBGL) : ""; if (/swiftshader|llvmpipe|software|basic render/i.test(r)) return true; } catch (e) { return true; }
  return false;
}
if (!weak()) try {
  const host = document.querySelector(".fxbg"), canvas = document.createElement("canvas"); canvas.className = "gl"; canvas.setAttribute("aria-hidden", "true"); host.insertBefore(canvas, host.firstChild);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5)); renderer.setClearColor(0x000000, 0);
  canvas.addEventListener("webglcontextlost", () => { canvas.remove(); document.documentElement.classList.remove("gl-on"); });
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(60, 1, .1, 200); cam.position.z = 8;
  const coarse = matchMedia("(pointer: coarse)").matches, N = coarse ? 900 : 1800;

  /* hyperspace streaks */
  const pos = new Float32Array(N * 6), col = new Float32Array(N * 6), base = [];
  const palette = [new THREE.Color("#c4b5fd"), new THREE.Color("#38bdf8"), new THREE.Color("#facc15"), new THREE.Color("#f472b6"), new THREE.Color("#ffffff")];
  for (let i = 0; i < N; i++) {
    const a = Math.random() * 6.283, r = 3 + Math.random() * 38, c = palette[i % palette.length];
    base.push({ x: Math.cos(a) * r * 1.3, y: Math.sin(a) * r * .8, z: -Math.random() * 120, s: .5 + Math.random() });
    col.set([c.r, c.g, c.b, 0, 0, 0], i * 6);
  }
  const sg = new THREE.BufferGeometry(); sg.setAttribute("position", new THREE.BufferAttribute(pos, 3)); sg.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const stars = new THREE.LineSegments(sg, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); stars.frustumCulled = false; scene.add(stars);

  /* holographic core */
  const core = new THREE.Group(); scene.add(core);
  const fres = new THREE.ShaderMaterial({ transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
    uniforms: { t: { value: 0 }, k: { value: 1 } },
    vertexShader: "varying vec3 vN;varying vec3 vV;void main(){vec4 m=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=normalize(-m.xyz);gl_Position=projectionMatrix*m;}",
    fragmentShader: "uniform float t;uniform float k;varying vec3 vN;varying vec3 vV;void main(){float f=pow(1.-abs(dot(normalize(vN),normalize(vV))),2.2);vec3 c=mix(vec3(.25,.1,.7),vec3(.95,.7,1.),f);c+=vec3(1.,.8,.2)*pow(f,6.)*(.6+.4*sin(t*2.));gl_FragColor=vec4(c,(.12+f*.85)*k);}" });
  const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5, 2), fres); core.add(ico);
  const wire = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.95, 1)), new THREE.LineBasicMaterial({ color: 0xc084fc, transparent: true, opacity: .55, blending: THREE.AdditiveBlending, depthWrite: false })); core.add(wire);
  const inner = new THREE.Mesh(new THREE.OctahedronGeometry(.7, 0), new THREE.MeshBasicMaterial({ color: 0xfacc15, wireframe: true, transparent: true, opacity: .9, blending: THREE.AdditiveBlending })); core.add(inner);
  const ring = (R, c, rx, ry) => { const m = new THREE.Mesh(new THREE.TorusGeometry(R, .014, 8, 140), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: .85, blending: THREE.AdditiveBlending })); m.rotation.set(rx, ry, 0); core.add(m); return m; };
  const r1 = ring(2.7, 0xfacc15, 1.2, 0), r2 = ring(3.1, 0x38bdf8, .4, .9), r3 = ring(3.5, 0xc084fc, 1.9, -.5);
  const hp = new Float32Array(260 * 3); for (let i = 0; i < 260; i++) { const u = Math.random() * 6.283, v = Math.acos(2 * Math.random() - 1), R = 2.2 + Math.random() * 1.6; hp.set([R * Math.sin(v) * Math.cos(u), R * Math.sin(v) * Math.sin(u), R * Math.cos(v)], i * 3); }
  const hg = new THREE.BufferGeometry(); hg.setAttribute("position", new THREE.BufferAttribute(hp, 3));
  const halo = new THREE.Points(hg, new THREE.PointsMaterial({ color: 0xffffff, size: .05, transparent: true, opacity: .8, blending: THREE.AdditiveBlending, depthWrite: false })); core.add(halo);

  /* modes: target params, eased every frame */
  const MODES = {
    splash: { x: 0, y: .95, z: 0, s: .72, spin: 1.1, k: .9, warp: .14, o: 1 },
    welcome: { x: 0, y: 2, z: -1, s: .6, spin: .8, k: .8, warp: .05, o: 1 },
    chat: { x: 2.6, y: 3.1, z: -4, s: .5, spin: .5, k: .6, warp: .03, o: .7 },
    analyse: { x: 0, y: 1.2, z: 0, s: .85, spin: 3.2, k: 1, warp: .5, o: 1 },
    app: { x: 0, y: 2.8, z: -6, s: .55, spin: .35, k: .35, warp: .02, o: .45 }
  };
  let cur = Object.assign({}, MODES.splash), tgt = MODES.splash, boost = 0, pulse = 0, px = 0, py = 0, hidden = false;
  EE.gl = { on: true, mode(n) { tgt = MODES[n] || MODES.app; }, jump() { boost = 1; }, pulse() { pulse = 1; } };
  addEventListener("pointermove", e => { px = e.clientX / innerWidth - .5; py = e.clientY / innerHeight - .5; }, { passive: true });
  addEventListener("deviceorientation", e => { if (e.gamma != null) { px = Math.max(-.5, Math.min(.5, e.gamma / 60)); py = Math.max(-.5, Math.min(.5, (e.beta - 45) / 90)); } }, { passive: true });
  const size = () => { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }; size(); addEventListener("resize", size);
  document.addEventListener("visibilitychange", () => { hidden = document.hidden; if (!hidden) { last = performance.now(); requestAnimationFrame(frame); } });
  let last = performance.now(), T = 0, frames = 0, slow = 0, ok = false;
  function frame(now) {
    if (hidden) return; const dt = Math.min(.05, (now - last) / 1000); last = now; T += dt;
    for (const k in tgt) cur[k] += (tgt[k] - cur[k]) * Math.min(1, dt * 2.6);
    boost = Math.max(0, boost - dt * .9); pulse = Math.max(0, pulse - dt * 2.2);
    const warp = cur.warp + boost * 1.6, speed = 6 + warp * 90, streak = .12 + warp * 7;
    for (let i = 0; i < N; i++) { const b = base[i]; b.z += speed * b.s * dt; if (b.z > 6) { b.z -= 126; } const j = i * 6; pos[j] = b.x; pos[j + 1] = b.y; pos[j + 2] = b.z; pos[j + 3] = b.x; pos[j + 4] = b.y; pos[j + 5] = b.z - streak * b.s; }
    sg.attributes.position.needsUpdate = true;
    const sc = cur.s * (1 + pulse * .18 + boost * .5); core.position.set(cur.x + px * .6, cur.y - py * .5, cur.z - boost * 5); core.scale.setScalar(sc);
    core.rotation.y += dt * cur.spin; core.rotation.x = Math.sin(T * .4) * .25 + py * .6; core.rotation.z = px * .4;
    inner.rotation.x += dt * 1.4; inner.rotation.y -= dt * 1.1; r1.rotation.z += dt * .9; r2.rotation.z -= dt * .7; r3.rotation.z += dt * .5; wire.rotation.y -= dt * .3; halo.rotation.y += dt * .08;
    fres.uniforms.t.value = T; fres.uniforms.k.value = cur.k * (1 + pulse * .8); core.visible = cur.o > .02; wire.material.opacity = .55 * cur.o; halo.material.opacity = .8 * cur.o;
    cam.position.x += (px * 1.2 - cam.position.x) * .04; cam.position.y += (-py * .8 - cam.position.y) * .04; cam.lookAt(0, 0, -4);
    renderer.render(scene, cam);
    /* perf governor: if the first 90 frames average < 24fps, bail out to the 2D background */
    if (++frames <= 90) { if (dt > .042) slow++; if (frames === 90 && slow > 60 && !force) { canvas.remove(); document.documentElement.classList.remove("gl-on"); EE.gl = { on: false, mode() {}, jump() {}, pulse() {} }; hidden = true; return; } }
    if (!ok && frames > 2) { ok = true; document.documentElement.classList.add("gl-on"); }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
} catch (e) { /* 2D background stays */ }
