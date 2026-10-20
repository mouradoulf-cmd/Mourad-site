/* Giulivo — the logo's sun and olive branch, traced from the real menu, extruded in 3D brass (three.js).
   It turns slowly, follows the pointer and the scroll, and lights up warm like the terrace lanterns.
   Renders only while visible. Falls back to the flat SVG mark if WebGL or modules are unavailable. */
import * as THREE from "three";
import { SVGLoader } from "../vendor/SVGLoader.js";
import { RoomEnvironment } from "../vendor/RoomEnvironment.js";

const box = document.getElementById("mark3d");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (box) start().catch(() => {});

async function start() {
  const svgText = (await (await fetch("assets/img/mark.svg")).text()).replace(/currentColor/g, "#000");
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, matchMedia("(hover: none)").matches ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
  box.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), .04).texture;
  const camera = new THREE.PerspectiveCamera(30, 1, .1, 100); camera.position.set(0, 0, 9.5);

  // geometry from the traced SVG
  const data = new SVGLoader().parse(svgText);
  const group = new THREE.Group();
  const mat = new THREE.MeshPhysicalMaterial({ color: 0xd9a35f, metalness: 1, roughness: .27, clearcoat: .45, clearcoatRoughness: .25, envMapIntensity: 1.1 });
  const shapes = [];
  data.paths.forEach((p) => SVGLoader.createShapes(p).forEach((s) => shapes.push(s)));
  const geo = new THREE.ExtrudeGeometry(shapes, { depth: 70, bevelEnabled: true, bevelThickness: 14, bevelSize: 9, bevelSegments: 5, curveSegments: 18 });
  geo.computeBoundingBox(); const bb = geo.boundingBox, c = new THREE.Vector3(); bb.getCenter(c); geo.translate(-c.x, -c.y, -c.z);
  const size = Math.max(bb.max.x - bb.min.x, bb.max.y - bb.min.y);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.scale.setScalar(4.2 / size); mesh.scale.y *= -1; // SVG y points down
  group.add(mesh); scene.add(group);

  scene.add(new THREE.AmbientLight(0xffe2b8, .25));
  const key = new THREE.PointLight(0xffb565, 60, 30, 1.6); key.position.set(3.5, 3, 5); scene.add(key);
  const rim = new THREE.PointLight(0xff7a3d, 40, 30, 1.6); rim.position.set(-4, -2.5, 3); scene.add(rim);
  const top = new THREE.DirectionalLight(0xfff1dc, 1.2); top.position.set(0, 6, 4); scene.add(top);

  function resize() { const w = box.clientWidth, h = box.clientHeight || w; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  resize(); addEventListener("resize", resize);

  let mx = 0, my = 0, smx = 0, smy = 0, visible = true, raf = 0; const t0 = performance.now();
  addEventListener("pointermove", (e) => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; }, { passive: true });
  function frame(now) {
    raf = 0; if (!visible || document.hidden) return;
    const t = (now - t0) / 1000;
    smx += (mx - smx) * .05; smy += (my - smy) * .05;
    const r = box.getBoundingClientRect(), sp = (innerHeight / 2 - (r.top + r.height / 2)) / innerHeight;
    group.rotation.y = (reduce ? 0 : Math.sin(t * .45) * .55) + smx * .9 + sp * 1.4;
    group.rotation.x = (reduce ? 0 : Math.sin(t * .3) * .12) + smy * .5;
    group.position.y = reduce ? 0 : Math.sin(t * .8) * .08;
    key.intensity = 55 + Math.sin(t * 3.1) * 4 + Math.sin(t * 7.7) * 2;
    renderer.render(scene, camera);
    if (!reduce) raf = requestAnimationFrame(frame);
  }
  new IntersectionObserver((en) => { visible = en[0].isIntersecting; if (visible && !raf) raf = requestAnimationFrame(frame); }).observe(box);
  document.addEventListener("visibilitychange", () => { if (!document.hidden && !raf) raf = requestAnimationFrame(frame); });
  box.classList.add("is-3d");
  raf = requestAnimationFrame(frame);
}
