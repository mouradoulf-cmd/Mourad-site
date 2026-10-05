/* ==========================================================================
   hero3d.js — the hero's 3D scene (lazy ES module, ~12 meshes).

   Story: a ventilated façade is made of prefabricated panels that arrive on
   site and are fixed one by one. On load the panels fly in and snap into the
   grid; scrolling "explodes" the assembly (same idea as the exploded section
   below); the pointer tilts it. Cost: one draw call per panel, pixel ratio
   capped at 1.5, rendering paused when the hero is off-screen or the tab is
   hidden. If WebGL fails, fx.js leaves the video hero untouched.
   ========================================================================== */
import * as THREE from "../vendor/three.module.min.js";

export function start(hero) {
  const canvas = document.createElement("canvas");
  canvas.className = "hero__gl"; canvas.setAttribute("aria-hidden", "true");
  hero.insertBefore(canvas, hero.querySelector(".hero__shade").nextSibling);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  canvas.addEventListener("webglcontextlost", () => canvas.remove());

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, .1, 60); camera.position.set(0, 0, 11);

  /* --- image-based light: a tiny procedural sky (dark → blue → warm) baked once --- */
  const pm = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  const sky = new THREE.Mesh(new THREE.SphereGeometry(10, 24, 16), new THREE.ShaderMaterial({
    side: THREE.BackSide,
    vertexShader: "varying vec3 p;void main(){p=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
    fragmentShader: "varying vec3 p;void main(){float h=p.y*.5+.5;vec3 low=vec3(.03,.045,.07),mid=vec3(.16,.28,.5),top=vec3(.95,.82,.7);vec3 c=mix(low,mid,smoothstep(.1,.55,h));c=mix(c,top,smoothstep(.62,1.,h));c+=vec3(1.,.45,.2)*pow(max(0.,dot(p,normalize(vec3(.6,.4,.7)))),24.)*1.6;gl_FragColor=vec4(c,1.);}"
  }));
  envScene.add(sky);
  scene.environment = pm.fromScene(envScene, .04).texture; pm.dispose();

  const key = new THREE.DirectionalLight(0xfff0e0, 2.1); key.position.set(-4, 5, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(0x6d9aea, 1.6); rim.position.set(5, 1, -4); scene.add(rim);
  scene.add(new THREE.AmbientLight(0x8aa0c0, .25));

  /* --- the assembly: 4 columns x 3 rows of cassette-like panels, staggered --- */
  const group = new THREE.Group(); scene.add(group);
  const palette = [0x232b36, 0x7f8c9b, 0xcfcac0, 0x151b25, 0x98a3b0, 0x3b556b, 0xb9b4aa, 0x232b36, 0x7f8c9b, 0x151b25, 0xcfcac0, 0x98a3b0];
  const accent = 5;                               /* one signal-orange panel = the brand accent */
  const W = [1.0, 1.35, .8, 1.15], rows = 3, ph = .78, gap = .06, panels = [];
  const edgeMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: .22 });
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    const widths = r % 2 ? [W[1], W[0], W[3], W[2]] : [W[0], W[2], W[1], W[3]];
    const total = widths.reduce((a, b) => a + b + gap, 0) - gap; let x = -total / 2;
    for (let c = 0; c < 4; c++) {
      const w = widths[c], geo = new THREE.BoxGeometry(w, ph, .06);
      const mat = new THREE.MeshPhysicalMaterial({ color: idx === accent ? 0xff5a1f : palette[idx % palette.length], metalness: idx === accent ? .35 : .88, roughness: idx === accent ? .38 : .3, clearcoat: .55, clearcoatRoughness: .25, envMapIntensity: .85 });
      const m = new THREE.Mesh(geo, mat);
      m.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat));
      const home = new THREE.Vector3(x + w / 2, (1 - r) * (ph + gap), 0);
      /* start state: scattered far away, tilted — "delivery" */
      const a = Math.random() * Math.PI * 2, d = 5 + Math.random() * 4;
      m.userData = { home, from: new THREE.Vector3(Math.cos(a) * d + 2, Math.sin(a) * d * .6, 4 + Math.random() * 6), rot: new THREE.Vector3((Math.random() - .5) * 2.4, (Math.random() - .5) * 2.4, (Math.random() - .5) * 1.6), delay: idx * .09 + Math.random() * .12, r, c, seed: Math.random() * 6.28 };
      m.position.copy(m.userData.from); group.add(m); panels.push(m); x += w + gap; idx++;
    }
  }

  /* --- layout: assembly sits on the right, headline stays on the left --- */
  function resize() {
    const w = hero.clientWidth, h = hero.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    const s = clamp(w / 1500, .7, 1.2) * .8; group.scale.setScalar(s);
    const vis = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z; /* world height at z=0 */
    group.userData.baseX = vis * camera.aspect * .31; group.userData.baseY = vis * .035;
  }
  const ro = new ResizeObserver(resize); ro.observe(hero); resize();

  /* --- input: pointer tilt + scroll progress --- */
  let px = 0, py = 0, tx = 0, ty = 0, prog = 0, visible = true, running = false;
  addEventListener("pointermove", e => { tx = (e.clientX / innerWidth - .5); ty = (e.clientY / innerHeight - .5); }, { passive: true });
  const io = new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) kick(); }, { threshold: 0 }); io.observe(hero);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) kick(); });

  const clock = new THREE.Clock(); let T0 = 0;
  const ease = x => 1 - Math.pow(1 - clamp(x, 0, 1), 4);
  /* --- quality governor: if the device cannot hold ~40 fps, step down, then bail out to the video --- */
  let slow = 0, tier = 0, avg = 16;
  const FORCE = /gl=force/.test(location.href);   /* debugging aid: never degrade */
  function govern(rawDt) {
    if (FORCE || T0 < 2.2) return true;                                        /* ignore the intro warm-up */
    avg += (rawDt * 1000 - avg) * .08;
    if (avg > 26) slow++; else slow = Math.max(0, slow - 2);
    if (slow > 50) {
      slow = 0; avg = 16;
      if (tier === 0) { tier = 1; renderer.setPixelRatio(1); resize(); }
      else { stop(); return false; }
    }
    return true;
  }
  function stop() { visible = false; ro.disconnect(); io.disconnect(); canvas.remove(); renderer.dispose(); }
  function frame() {
    running = false; if (!visible || document.hidden) return;
    const raw = clock.getDelta(), dt = Math.min(raw, .05); T0 += dt; if (!govern(raw)) return;
    px += (tx - px) * .06; py += (ty - py) * .06;
    prog += (clamp(scrollY / (hero.clientHeight * .9), 0, 1) - prog) * .12;
    canvas.style.opacity = canvas.classList.contains("ready") ? String(1 - prog * 1.15) : "";
    const u = group.userData;
    group.position.set(u.baseX - prog * 1.2, u.baseY + prog * .9, 0);
    group.rotation.y = -.5 + prog * .95 + px * .34; group.rotation.x = py * .2 - prog * .12;
    for (const m of panels) {
      const d = m.userData, k = ease((T0 - 0.35 - d.delay) / 1.5);          /* installation */
      m.position.lerpVectors(d.from, d.home, k);
      m.rotation.set(d.rot.x * (1 - k), d.rot.y * (1 - k), d.rot.z * (1 - k));
      const e = prog * (.5 + d.r * .35 + d.c * .12);                       /* scroll "explode" along Z + drift */
      m.position.z += e * 2.6 + Math.sin(T0 * .8 + d.seed) * .012 * k;
      m.position.x += (d.c - 1.5) * e * .22; m.position.y += (d.r - 1) * -e * .12;
    }
    if (!canvas.classList.contains("ready") && T0 > .05) canvas.classList.add("ready");
    renderer.render(scene, camera); kick();
  }
  function kick() { if (!running && visible && !document.hidden) { running = true; requestAnimationFrame(frame); } }
  kick();
}
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
