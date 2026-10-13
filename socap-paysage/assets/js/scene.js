/* SOCAP — « Le jardin suspendu » : scène WebGL (Three.js r160, auto-hébergé).
   Un îlot de jardin procédural qui se construit sous vos yeux (plan filaire -> jardin vivant), avec herbe animée,
   arbres, bassin, terrasse bois + pergola, lanternes, lucioles, ciel crépuscule -> nuit.
   Le site (site.js) pilote la scène par scroll : scene.setState({px,py,pz,tx,ty,tz,build,night}).
   Rien n'est chargé depuis un CDN ; sans WebGL (ou machine trop faible) le site garde un poster statique. */
import * as THREE from "../vendor/three.module.min.js";

/* ---------------------------------------------------------------- maths utiles */
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const mix = (a, b, t) => a + (b - a) * t;
function mulberry(seed) { return function () { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function hash(x, y) { let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967295; }
function vnoise(x, y) { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf); const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; }
function fbm(x, y, o) { let s = 0, a = .5, f = 1; for (let i = 0; i < (o || 4); i++) { s += a * vnoise(x * f, y * f); f *= 2; a *= .5; } return s; }

/* ---------------------------------------------------------------- géométrie du monde */
const R = 42;                                   // rayon de l'îlot
const POND = { x: -11, z: 9, r: 6.4 };
const TERR = { x: 15, z: -6, hx: 8, hz: 6, a: -0.32, y: 0.95 };
const rimAt = ang => R * (0.93 + 0.07 * vnoise(Math.cos(ang) * 2.2 + 11, Math.sin(ang) * 2.2 + 5));

function curvePts(pts, n) { const c = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(p[0], 0, p[1]))); return c.getPoints(n); }
const PATH_MAIN = curvePts([[-6, 44], [-3, 33], [1, 24], [5, 15], [9, 7], [11, 0.5], [12, -2.5]], 120);
const PATH_POND = curvePts([[-1, 22], [-6, 17], [-9.2, 14.2]], 40);
const PATHS = PATH_MAIN.concat(PATH_POND);
function distPath(x, z) { let m = 1e9; for (let i = 0; i < PATHS.length; i++) { const dx = x - PATHS[i].x, dz = z - PATHS[i].z, d = dx * dx + dz * dz; if (d < m) m = d; } return Math.sqrt(m); }
function terrDist(x, z) { const c = Math.cos(-TERR.a), s = Math.sin(-TERR.a), px = (x - TERR.x) * c - (z - TERR.z) * s, pz = (x - TERR.x) * s + (z - TERR.z) * c; const qx = Math.abs(px) - TERR.hx, qz = Math.abs(pz) - TERR.hz; return Math.hypot(Math.max(qx, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qz), 0); }

function H(x, z) {
  const r = Math.hypot(x, z), ang = Math.atan2(z, x), rim = rimAt(ang);
  let h = (fbm(x * .045 + 3, z * .045 + 7, 4) - .46) * 7.5 + (fbm(x * .13, z * .13, 2) - .5) * .9;
  h *= .45 + .55 * smooth(2, 20, r);
  const low = (fbm(x * .02 + 1, z * .02 + 2, 2) - .45) * 2.2;
  const wp = 1 - smooth(.9, 3.4, distPath(x, z)); h = mix(h, low, wp * .88);
  const wt = 1 - smooth(0, 5.5, terrDist(x, z)); h = mix(h, TERR.y - .35, wt);
  const dp = Math.hypot(x - POND.x, z - POND.z); h = mix(h, -.95, 1 - smooth(POND.r * .62, POND.r + 2.2, dp));
  const m = smooth(rim - 11, rim - 1.2, r);                    // 0 au centre -> 1 au bord
  h = mix(h, -1.6 - m * 1.5, m * m);
  return h;
}

/* ---------------------------------------------------------------- shaders partagés */
const GLSL_SCAN_UNI = "uniform vec3 uScanO; uniform float uScanR; uniform float uBuild; uniform float uScanOn;";
function patchScan(mat, opts) {
  const o = Object.assign({ grow: false, inverse: false, glow: 1.0 }, opts || {});
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uScanO = U.uScanO; sh.uniforms.uScanR = U.uScanR; sh.uniforms.uBuild = U.uBuild; sh.uniforms.uScanOn = U.uScanOn;
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\n" + GLSL_SCAN_UNI + "\nvarying vec3 vWPos;")
      .replace("#include <begin_vertex>", `#include <begin_vertex>
        ${o.grow ? `
        #ifdef USE_INSTANCING
          vec3 cenI = instanceMatrix[3].xyz;
        #else
          vec3 cenI = vec3(0.0);
        #endif
        float gdist = distance((modelMatrix * vec4(cenI, 1.0)).xz, uScanO.xz);
        float gk = clamp((uScanR - gdist) / 10.0, 0.0, 1.0); gk = gk * gk * (3.0 - 2.0 * gk);
        transformed *= mix(1.0, gk, uScanOn);` : ""}`)
      .replace("#include <project_vertex>", `#include <project_vertex>
        vec4 wpv = modelMatrix * vec4(transformed, 1.0);
        #ifdef USE_INSTANCING
          wpv = modelMatrix * instanceMatrix * vec4(transformed, 1.0);
        #endif
        vWPos = wpv.xyz;`);
    const scanTest = o.inverse
      ? `float sd = distance(vWPos.xz, uScanO.xz); float wob = sin(vWPos.x * .21 + vWPos.z * .13) * 1.6 + sin(vWPos.z * .37 - vWPos.x * .09) * .8;
         float rimK = exp(-pow((sd - uScanR - wob) / 1.9, 2.0));
         float planK = (1.0 - smoothstep(0.0, 1.0, uBuild)) * .34;
         float wireA = (rimK * 1.7 + planK * step(uScanR - 1.0 + wob, sd)) * (1.0 - smoothstep(.86, 1.0, uBuild)) * uScanOn;
         if (sd < uScanR - 2.0 + wob || wireA < .01) discard;`
      : `float sd = distance(vWPos.xz, uScanO.xz); float wob = sin(vWPos.x * .21 + vWPos.z * .13) * 1.6 + sin(vWPos.z * .37 - vWPos.x * .09) * .8;
         if (uScanOn > .5 && sd > uScanR - 1.2 + wob) discard;
         float frontK = exp(-pow((uScanR + wob - sd) / 1.1, 2.0)) * uScanOn;`;
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\n" + GLSL_SCAN_UNI + "\nvarying vec3 vWPos;")
      .replace("void main() {", "void main() {\n" + scanTest);
    if (o.inverse) {
      sh.fragmentShader = sh.fragmentShader.replace("#include <color_fragment>", "#include <color_fragment>\n diffuseColor.a *= wireA;");
    } else {
      sh.fragmentShader = sh.fragmentShader.replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n totalEmissiveRadiance += vec3(.18, 1.0, .55) * frontK * " + (o.glow).toFixed(2) + ";");
    }
  };
  mat.customProgramCacheKey = () => "scan" + (o.grow ? "g" : "") + (o.inverse ? "i" : "") + o.glow;
  return mat;
}

const U = {
  uTime: { value: 0 }, uScanO: { value: new THREE.Vector3(-34, 0, 30) }, uScanR: { value: 0 }, uBuild: { value: 0 }, uScanOn: { value: 1 },
  uNight: { value: 0 }, uSunCol: { value: new THREE.Color(1, .8, .55) }, uFogCol: { value: new THREE.Color(.5, .55, .5) }
};

/* ---------------------------------------------------------------- scène */
export function createScene(canvas, opts) {
  const o = Object.assign({ mobile: false, weak: false, shadows: true }, opts || {});
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !o.mobile, alpha: false, powerPreference: "high-performance", stencil: false });
  renderer.setClearColor(0x04100c, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = .92;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  if (o.shadows) { renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; }

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x1a2f2a, 0.0105);
  const camera = new THREE.PerspectiveCamera(o.mobile ? 52 : 42, 1, 0.5, 900);

  /* ---- lumières */
  const hemi = new THREE.HemisphereLight(0xa9c8d8, 0x2a2018, .8); scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffd5a0, 3.1); sun.position.set(-72, 30, -30); sun.target.position.set(0, 0, 0);
  if (o.shadows) { sun.castShadow = true; sun.shadow.mapSize.set(o.mobile ? 1024 : 2048, o.mobile ? 1024 : 2048); const c = sun.shadow.camera; c.left = -58; c.right = 58; c.top = 58; c.bottom = -58; c.near = 10; c.far = 220; sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.06; }
  scene.add(sun, sun.target);

  /* ---- ciel */
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { uNight: U.uNight, uTime: U.uTime, uSunDir: { value: new THREE.Vector3(-.82, .17, -.5).normalize() } },
    vertexShader: "varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
    fragmentShader: `
      uniform float uNight; uniform float uTime; uniform vec3 uSunDir; varying vec3 vDir;
      float h21(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
      float n2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h21(i),h21(i+vec2(1,0)),f.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x), f.y); }
      void main(){
        vec3 d = normalize(vDir); float y = d.y;
        vec3 dTop = vec3(.02,.07,.15), dMid = vec3(.05,.2,.3), dHor = vec3(.55,.42,.32);
        vec3 nTop = vec3(.012,.03,.05), nMid = vec3(.02,.09,.10), nHor = vec3(.05,.2,.18);
        vec3 top = mix(dTop,nTop,uNight), mid = mix(dMid,nMid,uNight), hor = mix(dHor,nHor,uNight);
        vec2 az = normalize(d.xz + 1e-4), sz = normalize(uSunDir.xz);
        float side = pow(max(dot(az, sz), 0.), 2.5);
        hor = mix(mix(vec3(.3,.36,.36), nHor, uNight), hor, .38 + .62*side);
        vec3 c = mix(hor, mid, smoothstep(-.02,.075,y)); c = mix(c, top, smoothstep(.06,.7,y));
        vec3 abyss = mix(vec3(.03,.1,.12), vec3(.008,.03,.04), uNight);
        c = mix(c, abyss, smoothstep(-.01,-.34,y));
        float glow = exp(-pow((y - .01) * 11., 2.));
        c += mix(vec3(.25,.45,.42), vec3(1.7,.78,.4), side) * glow * (1. - uNight*.75) * (.45 + .55*side);
        float sd = max(dot(d, uSunDir), 0.0);
        c += vec3(1.,.62,.3) * (pow(sd,60.)*1.1 + pow(sd,6.)*.28) * (1.-uNight);
        c += vec3(.55,.7,1.) * pow(sd,300.) * .0;
        // étoiles + aurore émeraude la nuit
        vec2 sp = d.xz / (abs(d.y)+.35) * 90.;
        float st = step(.9965, h21(floor(sp))) * smoothstep(.05,.4,y);
        float tw = .6 + .4*sin(uTime*2. + h21(floor(sp))*40.);
        c += vec3(.8,.95,1.) * st * tw * uNight * 1.4;
        float au = n2(vec2(d.x*3.+uTime*.03, d.y*6.)) * n2(vec2(d.z*2.-uTime*.02, d.y*3.+4.));
        c += vec3(.1,.9,.55) * au * smoothstep(.05,.35,y) * smoothstep(.75,.3,y) * uNight * .55;
        gl_FragColor = vec4(c,1.0);
      }`
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(600, 32, 16), skyMat); sky.renderOrder = -10; sky.frustumCulled = false; scene.add(sky);

  /* ---- île : terrain */
  function buildTerrain(N, withColor) {
    const size = R * 2 + 6, pos = [], col = [], idx = [], tmp = new THREE.Color();
    for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) {
      let x = (i / N - .5) * size, z = (j / N - .5) * size;
      const r = Math.hypot(x, z), ang = Math.atan2(z, x), rim = rimAt(ang);
      let y;
      if (r > rim) { x *= rim / r; z *= rim / r; y = -5.2 - (r - rim) * .0; } else { y = H(x, z); }
      pos.push(x, y, z);
      if (withColor) {
        const dpa = distPath(x, z), dpo = Math.hypot(x - POND.x, z - POND.z), nn = fbm(x * .3, z * .3, 2), rimK = smooth(rim - 7, rim - .5, Math.min(r, rim));
        if (r > rim) tmp.setRGB(.18, .13, .1);
        else {
          tmp.setHSL(mix(.27, .32, nn), mix(.42, .55, nn), mix(.13, .26, nn));
          if (fbm(x * .05 + 40, z * .05, 2) > .56) tmp.lerp(new THREE.Color().setHSL(.16, .4, .26), .4);        // prairie sèche
          const pk = 1 - smooth(.9, 1.7, dpa); tmp.lerp(new THREE.Color(.8, .7, .5), pk * .96);
          const tb = 1 - smooth(0, 1.8, terrDist(x, z)); tmp.lerp(new THREE.Color(.33, .3, .27), tb * .9);
          const pb = 1 - smooth(POND.r - .6, POND.r + 1.8, dpo); tmp.lerp(new THREE.Color(.16, .14, .11), pb * .85);
          tmp.lerp(new THREE.Color(.24, .17, .12), rimK * .92);
        }
        col.push(tmp.r, tmp.g, tmp.b);
      }
    }
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const a = j * (N + 1) + i, b = a + 1, c = a + N + 1, d = c + 1; idx.push(a, c, b, b, c, d); }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    if (withColor) g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    g.setIndex(idx); g.computeVertexNormals(); return g;
  }
  const terrainGeo = buildTerrain(o.weak ? 120 : 170, true);
  const terrain = new THREE.Mesh(terrainGeo, patchScan(new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: .96, metalness: 0 }), { glow: 1.2 }));
  terrain.receiveShadow = true; scene.add(terrain);
  const cageGeo = new THREE.WireframeGeometry(buildTerrain(o.mobile ? 46 : 62, false));
  const cageMat = patchScan(new THREE.MeshBasicMaterial({ color: 0x59ffb4, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }), { inverse: true });
  const cage = new THREE.LineSegments(cageGeo, new THREE.LineBasicMaterial({ color: 0x59ffb4, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  cage.material.onBeforeCompile = cageMat.onBeforeCompile; cage.material.customProgramCacheKey = () => "cage"; cage.position.y = .08; scene.add(cage);

  /* ---- dessous de l'îlot */
  (function underside() {
    const prof = [[R * .985, -5.4], [R * .93, -8], [R * .8, -12], [R * .62, -17], [R * .42, -23], [R * .22, -29], [R * .08, -34], [0, -37]].map(p => new THREE.Vector2(p[0], p[1]));
    const g = new THREE.LatheGeometry(prof, 56); const p = g.attributes.position, c = [];
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i), k = Math.min(1, Math.hypot(x, z) / R + .12);
      const n = (fbm(x * .16 + y * .09, z * .16 - y * .07, 3) - .5) * 7 * k; const r = Math.hypot(x, z) || 1;
      p.setXYZ(i, x + (x / r) * n, y + (fbm(x * .1, z * .1, 2) - .5) * 4 * k, z + (z / r) * n);
      const t = Math.min(1, -y / 36); c.push(mix(.25, .06, t), mix(.18, .22, t), mix(.12, .15, t));
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(c, 3)); g.computeVertexNormals();
    const m = new THREE.Mesh(g, patchScan(new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1, side: THREE.DoubleSide }), { glow: .6 })); m.receiveShadow = true; scene.add(m);
    // cristaux émeraude suspendus
    const crystal = new THREE.OctahedronGeometry(1, 0); const cm = new THREE.MeshBasicMaterial({ color: 0x66ffc2, transparent: true, opacity: .9 });
    const ci = new THREE.InstancedMesh(crystal, patchScan(cm, { glow: 0 }), 16); const rng = mulberry(5), d = new THREE.Object3D();
    for (let i = 0; i < 16; i++) { const a = rng() * 6.283, rr = (.12 + rng() * .5) * R, yy = -9 - rng() * 22; d.position.set(Math.cos(a) * rr * .8, yy, Math.sin(a) * rr * .8); d.scale.set(.5 + rng() * .5, 1.6 + rng() * 2.4, .5 + rng() * .5); d.rotation.set(rng() * .5, rng() * 6, rng() * .5); d.updateMatrix(); ci.setMatrixAt(i, d.matrix); }
    scene.add(ci);
  })();

  /* ---- instances utilitaires */
  const rng = mulberry(20260);
  const dummy = new THREE.Object3D(), col = new THREE.Color();
  function placeOK(x, z, o2) {
    const r = Math.hypot(x, z), rim = rimAt(Math.atan2(z, x));
    if (r > rim - (o2.rim || 5)) return false;
    if (Math.hypot(x - POND.x, z - POND.z) < POND.r + (o2.pond || 1.2)) return false;
    if (distPath(x, z) < (o2.path || 1.6)) return false;
    if (terrDist(x, z) < (o2.terr || 1.5)) return false;
    return true;
  }
  const spots = [];  // positions des gros éléments (espacement)
  function pickSpot(minD, o2, tries) {
    for (let t = 0; t < (tries || 400); t++) {
      const a = rng() * 6.283, r = Math.sqrt(rng()) * R * .92, x = Math.cos(a) * r, z = Math.sin(a) * r;
      if (!placeOK(x, z, o2)) continue;
      let ok = true; for (let i = 0; i < spots.length; i++) { const s = spots[i]; if (Math.hypot(x - s[0], z - s[1]) < Math.max(minD, s[2] * .6)) { ok = false; break; } }
      if (ok) { spots.push([x, z, minD]); return [x, z]; }
    } return null;
  }

  /* arbres : feuillus + conifères */
  const trunkGeo = new THREE.CylinderGeometry(.16, .3, 1.8, 6); trunkGeo.translate(0, .9, 0);
  const crownGeo = new THREE.IcosahedronGeometry(1, 1); crownGeo.translate(0, 2.7, 0);
  const coneGeo = new THREE.ConeGeometry(1, 3.4, 7); coneGeo.translate(0, 2.4, 0);
  const NR = o.weak ? 24 : 36, NC = o.weak ? 14 : 22;
  const trunks = new THREE.InstancedMesh(trunkGeo, patchScan(new THREE.MeshStandardMaterial({ color: 0x4a3626, flatShading: true, roughness: 1 }), { grow: true }), NR + NC);
  const crowns = new THREE.InstancedMesh(crownGeo, patchScan(new THREE.MeshStandardMaterial({ flatShading: true, roughness: .9 }), { grow: true, glow: 1.4 }), NR);
  const cones = new THREE.InstancedMesh(coneGeo, patchScan(new THREE.MeshStandardMaterial({ flatShading: true, roughness: .9 }), { grow: true, glow: 1.4 }), NC);
  const greens = [0x2f7d46, 0x3b9250, 0x4aa458, 0x2a6a44, 0x58b05a], reds = [0xb3342f, 0xd1572f, 0xc1432e], pinks = [0xe58aa6, 0xf0a3b9];
  const treePos = []; let nT = 0, nCr = 0, nCo = 0;
  for (let i = 0; i < NR; i++) {
    const p = i === 0 ? [-23, -13] : pickSpot(5.2, { rim: 5 }); if (!p) continue;
    const y = H(p[0], p[1]), s = i === 0 ? 2.7 : .8 + rng() * 1.2, k = rng();
    dummy.position.set(p[0], y - .1, p[1]); dummy.rotation.set(0, rng() * 6.28, 0); dummy.scale.set(s, s * (.9 + rng() * .4), s); dummy.updateMatrix();
    trunks.setMatrixAt(nT++, dummy.matrix); crowns.setMatrixAt(nCr, dummy.matrix);
    col.setHex(i === 0 ? 0x4aa458 : k < .12 ? reds[(rng() * 3) | 0] : k < .2 ? pinks[(rng() * 2) | 0] : greens[(rng() * 5) | 0]); col.offsetHSL((rng() - .5) * .02, 0, (rng() - .5) * .06);
    crowns.setColorAt(nCr++, col); treePos.push(p);
  }
  for (let i = 0; i < NC; i++) {
    const p = pickSpot(4.4, { rim: 3.5 }); if (!p) continue; const y = H(p[0], p[1]), s = .8 + rng() * 1.0;
    dummy.position.set(p[0], y - .1, p[1]); dummy.rotation.set(0, rng() * 6.28, 0); dummy.scale.set(s * .9, s * (1.1 + rng() * .7), s * .9); dummy.updateMatrix();
    trunks.setMatrixAt(nT++, dummy.matrix); cones.setMatrixAt(nCo, dummy.matrix);
    col.setHex([0x1f5a3d, 0x266a49, 0x2f7a52][(rng() * 3) | 0]); cones.setColorAt(nCo++, col);
  }
  trunks.count = nT; crowns.count = nCr; cones.count = nCo;
  [trunks, crowns, cones].forEach(m => { m.castShadow = true; m.receiveShadow = true; m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true; scene.add(m); });

  /* buissons + fleurs */
  const shrubGeo = new THREE.IcosahedronGeometry(1, 1); shrubGeo.translate(0, .55, 0);
  const NS = o.weak ? 50 : 90, shrubs = new THREE.InstancedMesh(shrubGeo, patchScan(new THREE.MeshStandardMaterial({ flatShading: true, roughness: .95 }), { grow: true }), NS);
  for (let i = 0; i < NS; i++) {
    let x, z, ok = false, t = 0;
    while (!ok && t++ < 60) { const q = PATH_MAIN[(rng() * PATH_MAIN.length) | 0]; const a = rng() * 6.283, d = 1.9 + rng() * 3.6; x = q.x + Math.cos(a) * d; z = q.z + Math.sin(a) * d; ok = placeOK(x, z, { rim: 4, path: 1.5, terr: .6 }); }
    if (!ok) { x = 999; z = 999; }
    const s = .45 + rng() * .8; dummy.position.set(x, H(x, z) - .1, z); dummy.rotation.set(0, rng() * 6, 0); dummy.scale.set(s * (.9 + rng() * .4), s * (.7 + rng() * .4), s); dummy.updateMatrix(); shrubs.setMatrixAt(i, dummy.matrix);
    col.setHex([0x1f6a3a, 0x2c8244, 0x3a9650, 0x1a5a35][(rng() * 4) | 0]); shrubs.setColorAt(i, col);
  }
  shrubs.castShadow = true; shrubs.receiveShadow = true; scene.add(shrubs);
  const flowerGeo = new THREE.IcosahedronGeometry(.2, 0); flowerGeo.translate(0, .55, 0);
  const NF = o.weak ? 120 : 280, flowers = new THREE.InstancedMesh(flowerGeo, patchScan(new THREE.MeshStandardMaterial({ flatShading: true, roughness: .7, emissive: 0x220010, emissiveIntensity: .6 }), { grow: true }), NF);
  const fcol = [0xff4d9e, 0xff7ac0, 0xffffff, 0xc23cff, 0xffd34d, 0xff6a3d];
  for (let c = 0; c < 26; c++) {
    const q = PATH_MAIN[(rng() * PATH_MAIN.length) | 0], a = rng() * 6.283, d = 2.6 + rng() * 5; const cx = q.x + Math.cos(a) * d, cz = q.z + Math.sin(a) * d;
    const base = fcol[(rng() * 6) | 0];
    for (let k = 0; k < NF / 26; k++) {
      const i = c * Math.floor(NF / 26) + k; if (i >= NF) break; const x = cx + (rng() - .5) * 3.2, z = cz + (rng() - .5) * 3.2, ok = placeOK(x, z, { rim: 4, path: 1.2, terr: .5 });
      dummy.position.set(ok ? x : 999, H(x, z) - .1, ok ? z : 999); const s = .6 + rng() * 1.1; dummy.scale.setScalar(s); dummy.rotation.set(0, rng() * 6, 0); dummy.updateMatrix(); flowers.setMatrixAt(i, dummy.matrix);
      col.setHex(rng() < .75 ? base : fcol[(rng() * 6) | 0]); flowers.setColorAt(i, col);
    }
  }
  flowers.receiveShadow = true; scene.add(flowers);

  /* pierres : bassin, chemin, bord de l'île */
  const rockGeo = new THREE.DodecahedronGeometry(1, 0), rocks = [];
  const NRK = 64, rockM = new THREE.InstancedMesh(rockGeo, patchScan(new THREE.MeshStandardMaterial({ flatShading: true, roughness: .9 }), { grow: true }), NRK);
  let ri = 0;
  function addRock(x, z, sx, sy, sz, hex, lift) { if (ri >= NRK) return; dummy.position.set(x, H(x, z) + (lift == null ? .05 : lift), z); dummy.rotation.set(rng() * .4, rng() * 6, rng() * .4); dummy.scale.set(sx, sy, sz); dummy.updateMatrix(); rockM.setMatrixAt(ri, dummy.matrix); col.setHex(hex); col.offsetHSL(0, 0, (rng() - .5) * .08); rockM.setColorAt(ri, col); ri++; }
  for (let i = 0; i < 26; i++) { const a = (i / 26) * 6.283 + rng() * .2, d = POND.r + .2 + rng() * .5; addRock(POND.x + Math.cos(a) * d, POND.z + Math.sin(a) * d, .5 + rng() * .8, .3 + rng() * .35, .5 + rng() * .7, [0xb9ad92, 0xa59a82, 0xcfc3a6][(rng() * 3) | 0]); }
  for (let i = 0; i < 14; i++) { const q = PATH_MAIN[10 + ((rng() * (PATH_MAIN.length - 14)) | 0)]; const a = rng() < .5 ? 1 : -1; addRock(q.x + a * (1.6 + rng() * .6), q.z + (rng() - .5), .35 + rng() * .4, .2 + rng() * .2, .35 + rng() * .4, 0x9a8f78); }
  for (let i = 0; i < 12; i++) { const a = rng() * 6.283, rr = rimAt(a) - 3 - rng() * 2; addRock(Math.cos(a) * rr, Math.sin(a) * rr, 1.1 + rng() * 1.4, .8 + rng() * 1.0, 1 + rng() * 1.2, 0x6c6254, -.2); }
  rockM.count = ri; rockM.castShadow = true; rockM.receiveShadow = true; rockM.instanceMatrix.needsUpdate = true; scene.add(rockM);

  /* bassin */
  const water = new THREE.Mesh(new THREE.CircleGeometry(POND.r + .45, 56), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, fog: true,
    uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { uTime: U.uTime, uNight: U.uNight, uScanO: U.uScanO, uScanR: U.uScanR, uScanOn: U.uScanOn }]),
    vertexShader: `#include <common>
#include <fog_pars_vertex>
varying vec3 vW;
void main(){ vec4 wp = modelMatrix*vec4(position,1.); vW = wp.xyz; vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
#include <fog_vertex>
}`,
    fragmentShader: `#include <common>
#include <fog_pars_fragment>
uniform float uTime, uNight, uScanR, uScanOn; uniform vec3 uScanO; varying vec3 vW;
      void main(){ if(uScanOn>.5 && distance(vW.xz,uScanO.xz) > uScanR-1.0) discard;
        vec3 V = normalize(cameraPosition - vW); float fr = pow(1.0 - max(V.y,0.0), 3.0);
        vec2 q = vW.xz*.55; float rip = sin(q.x*3.+uTime*.9)*sin(q.y*3.2-uTime*.7)*.5 + sin((q.x+q.y)*5.+uTime*1.3)*.25;
        vec3 deep = mix(vec3(.0,.13,.15), vec3(.0,.05,.08), uNight), shallow = mix(vec3(.05,.42,.4), vec3(.03,.2,.22), uNight);
        vec3 sk = mix(vec3(.45,.36,.3), vec3(.05,.25,.25), uNight);
        vec3 c = mix(deep, shallow, .45+.3*rip) + sk*fr*(.32+.25*rip) + vec3(1.,.8,.55)*pow(max(rip,0.),6.)*.35*(1.-uNight) + vec3(.1,.9,.6)*uNight*.1;
        gl_FragColor = vec4(c, .93);
#include <fog_fragment>
}`
  }));
  water.rotation.x = -Math.PI / 2; water.position.set(POND.x, -.12, POND.z); scene.add(water);

  /* terrasse bois + pergola + mobilier */
  const terr = new THREE.Group(); terr.position.set(TERR.x, 0, TERR.z); terr.rotation.y = TERR.a; scene.add(terr);
  const plank = document.createElement("canvas"); plank.width = 256; plank.height = 256; const pc = plank.getContext("2d");
  for (let i = 0; i < 12; i++) { pc.fillStyle = `hsl(${22 + (i % 3) * 3},${52 + (i % 4) * 3}%,${30 + (i % 5) * 2.2}%)`; pc.fillRect(0, i * 21.4, 256, 20.4); pc.fillStyle = "rgba(0,0,0,.28)"; pc.fillRect(0, i * 21.4 + 20, 256, 1.4); }
  const plankTex = new THREE.CanvasTexture(plank); plankTex.colorSpace = THREE.SRGBColorSpace; plankTex.wrapS = plankTex.wrapT = THREE.RepeatWrapping; plankTex.repeat.set(2, 1.2); plankTex.anisotropy = 4;
  const deck = new THREE.Mesh(new THREE.BoxGeometry(TERR.hx * 2, .42, TERR.hz * 2), patchScan(new THREE.MeshStandardMaterial({ map: plankTex, roughness: .78 }), { grow: true, glow: 1 })); deck.position.y = TERR.y - .2 + .02; deck.castShadow = true; deck.receiveShadow = true; terr.add(deck);
  const stone = new THREE.MeshStandardMaterial({ color: 0x3a3d3b, roughness: .85 }), wood = new THREE.MeshStandardMaterial({ color: 0x2a1f17, roughness: .7 });
  patchScan(stone, { grow: true }); patchScan(wood, { grow: true });
  function box(w, h, d, x, y, z, mat, parent) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; (parent || terr).add(m); return m; }
  box(TERR.hx * 2, 1.1, .5, 0, TERR.y + .45, -TERR.hz - .2, stone);                       // muret
  [[-5.4, -3.6], [5.4, -3.6], [-5.4, 3.6], [5.4, 3.6]].forEach(p => box(.3, 4.4, .3, p[0], TERR.y + 2.0, p[1], wood));
  for (let i = 0; i < 7; i++) box(.22, .22, 8.4, -5.4 + i * 1.8, TERR.y + 4.3, 0, wood);
  for (let i = 0; i < 4; i++) box(11.6, .2, .3, 0, TERR.y + 4.1, -3.6 + i * 2.4, wood);
  box(2.6, .08, 1.4, 1.6, TERR.y + .95, .6, stone); [[0.5, -.4], [2.7, -.4], [.5, 1.6], [2.7, 1.6]].forEach(p => box(.12, .9, .12, p[0] + .0, TERR.y + .48, p[1], stone));
  [[-.2, .6], [3.4, .6]].forEach(p => box(.9, .55, 1.2, p[0], TERR.y + .45, p[1], new THREE.MeshStandardMaterial({ color: 0x7c7466, roughness: .95 })));
  const warm = new THREE.Mesh(new THREE.BoxGeometry(11, .05, 9), new THREE.MeshBasicMaterial({ color: 0xffb867, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })); warm.position.y = TERR.y + .12; terr.add(warm);

  /* chemin : dalles lumineuses + lanternes */
  const lanternPts = [PATH_MAIN[18], PATH_MAIN[40], PATH_MAIN[62], PATH_MAIN[84], PATH_MAIN[104], PATH_POND[16]].map((q, i) => { const side = i % 2 ? 1 : -1; return [q.x + side * 1.9, q.z + .3]; });
  const lanternGeo = new THREE.CylinderGeometry(.05, .07, 1.1, 5); lanternGeo.translate(0, .55, 0);
  const lanternMesh = new THREE.InstancedMesh(lanternGeo, patchScan(new THREE.MeshStandardMaterial({ color: 0x2c2c2c, roughness: .5, metalness: .4 }), { grow: true }), lanternPts.length);
  lanternPts.forEach((p, i) => { dummy.position.set(p[0], H(p[0], p[1]), p[1]); dummy.rotation.set(0, 0, 0); dummy.scale.setScalar(1); dummy.updateMatrix(); lanternMesh.setMatrixAt(i, dummy.matrix); });
  scene.add(lanternMesh);

  /* grains lumineux : fonction générique (lucioles, halos de lanternes, étoiles de cristaux) */
  function glowPoints(positions, sizes, color, o3) {
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3)); g.setAttribute("aSize", new THREE.Float32BufferAttribute(sizes, 1));
    g.setAttribute("aPh", new THREE.Float32BufferAttribute(sizes.map(() => rng() * 6.283), 1));
    const m = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: U.uTime, uNight: U.uNight, uCol: { value: new THREE.Color(color) }, uBase: { value: o3.base }, uNightGain: { value: o3.nightGain }, uMove: { value: o3.move || 0 }, uPx: { value: 1 }, uScanO: U.uScanO, uScanR: U.uScanR, uScanOn: U.uScanOn },
      vertexShader: `attribute float aSize; attribute float aPh; uniform float uTime, uMove, uPx, uScanR, uScanOn; uniform vec3 uScanO; varying float vA; varying float vS;
        void main(){ vec3 p = position;
          p += uMove * vec3(sin(uTime*.45+aPh*3.1)*1.4, sin(uTime*.6+aPh*1.7)*.8, cos(uTime*.4+aPh*2.3)*1.4);
          vec4 mv = modelViewMatrix*vec4(p,1.); gl_Position = projectionMatrix*mv;
          float g = clamp((uScanR - distance(p.xz,uScanO.xz))/6., 0., 1.); g = mix(1., g, uScanOn);
          gl_PointSize = aSize * uPx * (60. / -mv.z) * g; vA = .55 + .45*sin(uTime*(1.4+aPh*.3) + aPh*5.); vS = g; }`,
      fragmentShader: `uniform vec3 uCol; uniform float uBase, uNightGain, uNight; varying float vA; varying float vS;
        void main(){ vec2 c = gl_PointCoord-.5; float d = length(c); float a = pow(max(1.-d*2.,0.), 2.2); gl_FragColor = vec4(uCol, a * vA * (uBase + uNightGain*uNight) * vS); }`
    });
    const pts = new THREE.Points(g, m); pts.frustumCulled = false; scene.add(pts); return pts;
  }
  /* lucioles */
  const NFF = o.weak ? 140 : 320, ffP = [], ffS = [];
  for (let i = 0; i < NFF; i++) { const a = rng() * 6.283, r = Math.sqrt(rng()) * R * .95; ffP.push(Math.cos(a) * r, H(Math.cos(a) * r, Math.sin(a) * r) + .8 + rng() * 5, Math.sin(a) * r); ffS.push(.9 + rng() * 1.6); }
  const fireflies = glowPoints(ffP, ffS.map(v => v * 2.4), 0xc6ff7a, { base: .3, nightGain: 1.1, move: 1 });
  /* halos de lanternes + terrasse */
  const lgP = [], lgS = []; lanternPts.forEach(p => { lgP.push(p[0], H(p[0], p[1]) + 1.15, p[1]); lgS.push(46); });
  lgP.push(TERR.x, TERR.y + 3.3, TERR.z); lgS.push(120);
  glowPoints(lgP, lgS, 0xffb35a, { base: .25, nightGain: 1.0 });
  /* chemin balisé de points émeraude + massifs qui s'allument la nuit */
  const pgP = [], pgS = []; for (let i = 6; i < PATH_MAIN.length; i += 3) { const q = PATH_MAIN[i], sd = (i % 6 ? 1 : -1) * 1.45; pgP.push(q.x + sd, H(q.x + sd, q.z) + .22, q.z); pgS.push(7); }
  glowPoints(pgP, pgS, 0x7dffc6, { base: .05, nightGain: 1.0 });
  const flP = [], flS = []; for (let c = 0; c < 22; c++) { const q = PATH_MAIN[(rng() * PATH_MAIN.length) | 0], a = rng() * 6.283, d = 2.8 + rng() * 5, x = q.x + Math.cos(a) * d, z = q.z + Math.sin(a) * d; if (!placeOK(x, z, { rim: 4, path: 1.2, terr: .5 })) continue; flP.push(x, H(x, z) + .7, z); flS.push(30 + rng() * 20); }
  glowPoints(flP, flS, 0xff6ec7, { base: .0, nightGain: .5 });
  /* halo cristaux */
  const crP = [], crS = []; for (let i = 0; i < 9; i++) { const a = rng() * 6.283, rr = (.15 + rng() * .4) * R; crP.push(Math.cos(a) * rr * .8, -12 - rng() * 18, Math.sin(a) * rr * .8); crS.push(26 + rng() * 14); }
  glowPoints(crP, crS, 0x4dffb0, { base: .3, nightGain: .5 });
  /* lueur du bassin la nuit */
  glowPoints([POND.x, .1, POND.z], [90], 0x2ef0c0, { base: 0, nightGain: .22 });

  /* ---- herbe vivante (instanciée, vent) ---- */
  const NG = o.weak ? 9000 : (o.mobile ? 16000 : 34000);
  const bladeGeo = new THREE.InstancedBufferGeometry();
  { const segs = 4, pos = [], uv = [], ix = [], bl = 5; let v = 0;
    for (let k = 0; k < bl; k++) { const ang = (k / bl) * 6.283 + (k % 2) * .5, lean = .25 + (k % 3) * .18, w = .16 + (k % 2) * .05, ox = Math.cos(ang) * .12, oz = Math.sin(ang) * .12, h = .75 + (k % 3) * .22;
      for (let s2 = 0; s2 <= segs; s2++) { const t = s2 / segs, tp = 1 - t * .82, bx = ox + Math.cos(ang) * lean * t * t * .9, bz = oz + Math.sin(ang) * lean * t * t * .9, px = -Math.sin(ang) * w * tp * .5, pz = Math.cos(ang) * w * tp * .5;
        pos.push(bx - px, t * h, bz - pz, bx + px, t * h, bz + pz); uv.push(0, t, 1, t); if (s2 < segs) { const a0 = v + s2 * 2; ix.push(a0, a0 + 1, a0 + 2, a0 + 1, a0 + 3, a0 + 2); } }
      v += (segs + 1) * 2; }
    bladeGeo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); bladeGeo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); bladeGeo.setIndex(ix); }
  const gB = new Float32Array(NG * 3), gR = new Float32Array(NG * 4); let gi = 0;
  for (let t = 0; t < NG * 4 && gi < NG; t++) {
    const a = rng() * 6.283, r = Math.sqrt(rng()) * (R - 1), x = Math.cos(a) * r, z = Math.sin(a) * r; if (!placeOK(x, z, { rim: 2.4, pond: .9, path: 1.25, terr: .9 })) continue;
    const dens = fbm(x * .09 + 9, z * .09 + 3, 2); if (rng() > .35 + dens * 1.1) continue;
    gB[gi * 3] = x; gB[gi * 3 + 1] = H(x, z) - .05; gB[gi * 3 + 2] = z; gR[gi * 4] = rng(); gR[gi * 4 + 1] = rng(); gR[gi * 4 + 2] = rng(); gR[gi * 4 + 3] = rng(); gi++;
  }
  bladeGeo.setAttribute("aBase", new THREE.InstancedBufferAttribute(gB, 3)); bladeGeo.setAttribute("aRand", new THREE.InstancedBufferAttribute(gR, 4)); bladeGeo.instanceCount = gi;
  const grassMat = new THREE.ShaderMaterial({
    side: THREE.DoubleSide, fog: true,
    uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { uTime: U.uTime, uScanO: U.uScanO, uScanR: U.uScanR, uScanOn: U.uScanOn, uNight: U.uNight, uSun: U.uSunCol }]),
    vertexShader: `#include <common>
#include <fog_pars_vertex>
      attribute vec3 aBase; attribute vec4 aRand; uniform float uTime, uScanR, uScanOn; uniform vec3 uScanO; varying float vH; varying float vV; varying float vFront;
      void main(){
        float d = distance(aBase.xz, uScanO.xz);
        float wob = sin(aBase.x*.21+aBase.z*.13)*1.6 + sin(aBase.z*.37-aBase.x*.09)*.8;
        float grow = clamp((uScanR + wob - d)/6., 0., 1.); grow = mix(1., grow*grow*(3.-2.*grow), uScanOn);
        float h = clamp(position.y / 1.2, 0., 1.); vec3 p = position;
        float sc = (.55 + aRand.y*.9) * grow; p *= vec3(sc * 1.15, sc * 1.1, sc * 1.15);
        float cs = cos(aRand.x*6.2831), sn = sin(aRand.x*6.2831); p.xz = vec2(p.x*cs - p.z*sn, p.x*sn + p.z*cs);
        float w = sin(uTime*1.25 + aBase.x*.19 + aBase.z*.12 + aRand.w*6.28)*.55 + sin(uTime*2.3 + aBase.z*.33 + aBase.x*.2)*.3;
        float gust = sin(uTime*.35 + aBase.x*.05 - aBase.z*.04); p.x += (w + gust*.5) * h*h * .5; p.z += w * h*h * .22;
        vec4 wp = vec4(aBase + p, 1.); vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        vH = h; vV = aRand.z; vFront = exp(-pow((uScanR + wob - d)/1.0, 2.0)) * uScanOn;
        #include <fog_vertex>
      }`,
    fragmentShader: `#include <common>
#include <fog_pars_fragment>
      uniform float uNight; uniform vec3 uSun; varying float vH; varying float vV; varying float vFront;
      void main(){
        vec3 base = mix(vec3(.05,.2,.08), vec3(.1,.28,.08), vV), tip = mix(vec3(.38,.62,.18), vec3(.7,.78,.26), vV*vV);
        vec3 c = mix(base, tip, smoothstep(0.,1.,vH));
        float lit = mix(1.0, .22, uNight); c *= (.5 + .5*vH) * (.35 + lit*.9) * mix(vec3(1.), uSun, .5);
        c += vec3(.08,.4,.25) * uNight * vH * .35;
        c += vec3(.15,1.,.5) * vFront * 1.3;
        gl_FragColor = vec4(c, 1.);
#include <fog_fragment>
      }`
  });
  const grass = new THREE.Mesh(bladeGeo, grassMat); grass.frustumCulled = false; scene.add(grass);

  /* ---- îlots flottants lointains ---- */
  const islets = new THREE.Group(); scene.add(islets);
  for (let i = 0; i < 6; i++) {
    const g = new THREE.Group(), a = (i / 6) * 6.283 + .5, rr = 80 + (i % 3) * 22; g.position.set(Math.cos(a) * rr, 6 + (i % 3) * 7 - 14, Math.sin(a) * rr - 20); g.userData = { ph: rng() * 6, sp: .2 + rng() * .3 };
    const s2 = 3 + rng() * 4, prof = [[s2, 0], [s2 * .9, -s2 * .5], [s2 * .6, -s2 * 1.1], [s2 * .3, -s2 * 1.8], [0, -s2 * 2.4]].map(p => new THREE.Vector2(p[0], p[1]));
    const lg = new THREE.LatheGeometry(prof, 9), pp = lg.attributes.position; for (let k = 0; k < pp.count; k++) { const nn = (fbm(pp.getX(k) * .6 + i * 7, pp.getZ(k) * .6 + pp.getY(k) * .4, 2) - .5) * s2 * .5; pp.setXYZ(k, pp.getX(k) + nn, pp.getY(k) + nn * .5, pp.getZ(k) + nn * .7); } lg.computeVertexNormals();
    const rock = new THREE.Mesh(lg, new THREE.MeshStandardMaterial({ color: 0x4a3a2c, flatShading: true, roughness: 1, side: THREE.DoubleSide })); g.add(rock);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(s2 * 1.02, s2 * .98, .5, 9), new THREE.MeshStandardMaterial({ color: 0x2f7a40, flatShading: true, roughness: .95 })); top.position.y = .15; g.add(top);
    const tr = new THREE.Mesh(new THREE.IcosahedronGeometry(s2 * .5, 1), new THREE.MeshStandardMaterial({ color: [0x3b9250, 0xc1432e, 0x2f7d46][i % 3], flatShading: true })); tr.position.y = s2 * .8; g.add(tr);
    const tk = new THREE.Mesh(new THREE.CylinderGeometry(.12 * s2 * .4, .2 * s2 * .4, s2 * .6, 5), new THREE.MeshStandardMaterial({ color: 0x4a3626, flatShading: true })); tk.position.y = s2 * .3; g.add(tk);
    islets.add(g);
  }

  /* ---------------------------------------------------------------- pilotage */
  const state = { px: -6, py: 13, pz: 50, tx: 0, ty: 2, tz: 0, build: 1, night: 0 };
  const cur = Object.assign({}, state), look = new THREE.Vector3(), clock = new THREE.Clock();
  let introT = 0, introOn = true, mx = 0, my = 0, smx = 0, smy = 0, running = true, quality = 1, frames = 0, acc = 0, W = 1, Hh = 1;
  const dayFog = new THREE.Color(.1, .2, .21), nightFog = new THREE.Color(.03, .1, .1), dayHemiS = new THREE.Color(.78, .88, 1), nightHemiS = new THREE.Color(.16, .34, .42);
  const sunDay = new THREE.Color(1, .82, .58), sunNight = new THREE.Color(.45, .62, 1);

  function setSize() { const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight; W = w; Hh = h; renderer.setPixelRatio(Math.min(devicePixelRatio || 1, o.mobile ? 1.5 : 2) * quality); renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); fireflies.material.uniforms.uPx.value = renderer.getPixelRatio(); }
  addEventListener("resize", setSize); setSize();
  addEventListener("pointermove", e => { mx = (e.clientX / innerWidth - .5) * 2; my = (e.clientY / innerHeight - .5) * 2; }, { passive: true });

  function frame() {
    if (!running) return; requestAnimationFrame(frame);
    const dt = Math.min(.05, clock.getDelta()), t = clock.elapsedTime; U.uTime.value = t;
    if (introOn) { introT = Math.min(1, introT + dt / 5.2); if (introT >= 1) introOn = false; }
    const ie = introOn || introT < 1 ? (introT < .5 ? 2 * introT * introT : 1 - Math.pow(-2 * introT + 2, 2) / 2) : 1;
    const k = 1 - Math.exp(-dt * 3.2);
    for (const key of ["px", "py", "pz", "tx", "ty", "tz", "build", "night"]) cur[key] += (state[key] - cur[key]) * (key === "build" || key === "night" ? 1 - Math.exp(-dt * 5) : k);
    smx += (mx - smx) * (1 - Math.exp(-dt * 2.2)); smy += (my - smy) * (1 - Math.exp(-dt * 2.2));
    const build = Math.min(cur.build, ie);
    U.uBuild.value = build; U.uScanR.value = build * 105 + (build >= .999 ? 60 : 0); U.uScanOn.value = build >= .999 ? 0 : 1;
    // lumière / ciel : crépuscule -> nuit
    const n = cur.night; U.uNight.value = n;
    U.uSunCol.value.copy(sunDay).lerp(sunNight, n); U.uFogCol.value.copy(dayFog).lerp(nightFog, n);
    scene.fog.color.copy(U.uFogCol.value); scene.fog.density = mix(.0078, .0085, n);
    hemi.color.copy(dayHemiS).lerp(nightHemiS, n); hemi.intensity = mix(.8, .85, n);
    sun.color.copy(sunDay).lerp(sunNight, n); sun.intensity = mix(3.9, 1.5, n);
    warm.material.opacity = n * .22;
    // caméra
    const arc = (1 - ie) * 1.0, ang = Math.sin(t * .06) * .05;
    camera.position.set(cur.px + smx * 1.6 + Math.sin(arc * 2.2) * 26 * (1 - ie) + ang * 6, cur.py - smy * .9 + (1 - ie) * 16, cur.pz + (1 - ie) * 10);
    look.set(cur.tx + smx * .6, cur.ty, cur.tz); camera.lookAt(look);
    sky.position.copy(camera.position);
    islets.children.forEach(g => { g.position.y += Math.sin(t * g.userData.sp + g.userData.ph) * .004; g.rotation.y += .0007; });
    renderer.render(scene, camera);
    // gouverneur de perf : si < 28 fps sur 50 images -> baisse la résolution puis l'herbe
    acc += dt; frames++; if (frames === 50) { const fps = frames / acc; api.fps = fps; if (fps < 28 && quality > .6) { quality = Math.max(.6, quality - .2); setSize(); if (quality <= .7) bladeGeo.instanceCount = Math.floor(bladeGeo.instanceCount * .6); } frames = 0; acc = 0; }
  }
  const api = {
    state, fps: 60, setState(s) { Object.assign(state, s); },
    snap() { Object.assign(cur, state); introOn = false; introT = 1; },
    replayIntro() { introT = 0; introOn = true; },
    pause() { running = false; }, resume() { if (!running) { running = true; clock.getDelta(); frame(); } },
    renderOnce() { renderer.render(scene, camera); }, renderer, scene, camera
  };
  document.addEventListener("visibilitychange", () => { if (document.hidden) api.pause(); else api.resume(); });
  frame();
  return api;
}
