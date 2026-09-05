import * as THREE from 'three';

const BRAND_COLORS = [0x4fae8c, 0xf5b90f, 0xe41959, 0x4c96d1, 0x7d2a72];

export interface Scene3DHandle {
  update: (progress: number) => void;
  resize: () => void;
  dispose: () => void;
  setReducedMotion: (reduced: boolean) => void;
}

export function initThreeScene(canvas: HTMLCanvasElement, images: string[]): Scene3DHandle {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a1420, 0.02);

  const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 120);
  camera.position.set(0, 0, 8);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

  const panelGroup = new THREE.Group();
  scene.add(panelGroup);

  const loader = new THREE.TextureLoader();
  const geometry = new THREE.PlaneGeometry(3.0, 3.9);
  const frameGeometry = new THREE.PlaneGeometry(3.2, 4.1);

  // Organized receding grid: COLS panels across, ROWS layers of depth.
  const COLS = 5;
  const ROWS = 4;
  const COL_SPACING = 4.6;
  const ROW_DEPTH = 9;

  const panels: { mesh: THREE.Mesh }[] = [];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const i = row * COLS + col;
      const img = images[i % images.length];
      const color = BRAND_COLORS[col % BRAND_COLORS.length];

      const frameMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
      });
      const frame = new THREE.Mesh(frameGeometry, frameMat);

      const texture = loader.load(img);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = maxAniso;
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      const panelMat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
      const panel = new THREE.Mesh(geometry, panelMat);
      panel.position.z = 0.02;
      frame.add(panel);

      const x = (col - (COLS - 1) / 2) * COL_SPACING;
      const y = Math.sin(col * 0.9) * 0.5;
      const z = -row * ROW_DEPTH - 2;
      frame.position.set(x, y, z);
      frame.rotation.y = row % 2 === 0 ? 0.04 : -0.04;

      panelGroup.add(frame);
      panels.push({ mesh: frame });
    }
  }

  // Sparse ambient particle field (subtle, not distracting)
  const PARTICLE_COUNT = 350;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const colorObjs = BRAND_COLORS.map((c) => new THREE.Color(c));
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 34;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = -Math.random() * (ROWS * ROW_DEPTH + 10);
    const c = colorObjs[i % colorObjs.length];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const particleMat = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Horizon grid for depth cue, kept faint
  const grid = new THREE.GridHelper(90, 30, 0x4c96d1, 0x1c3a52);
  grid.position.y = -8;
  grid.position.z = -(ROWS * ROW_DEPTH) / 2;
  (grid.material as THREE.Material).transparent = true;
  (grid.material as THREE.Material).opacity = 0.12;
  scene.add(grid);

  let reducedMotion = false;
  let rafId = 0;
  const clock = new THREE.Clock();
  let scrollProgress = 0;

  const pointer = { x: 0, y: 0 };
  const pointerSmooth = { x: 0, y: 0 };
  function onPointerMove(e: PointerEvent) {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  }
  window.addEventListener('pointermove', onPointerMove);

  const maxZ = -(ROWS - 1) * ROW_DEPTH - 6;

  function renderFrame() {
    const t = clock.getElapsedTime();

    if (!reducedMotion) {
      panelGroup.position.y = Math.sin(t * 0.12) * 0.15;
      particles.rotation.y = t * 0.006;
      pointerSmooth.x += (pointer.x - pointerSmooth.x) * 0.03;
      pointerSmooth.y += (pointer.y - pointerSmooth.y) * 0.03;
    }

    camera.position.z = 8 + scrollProgress * maxZ;
    camera.position.y = 0.3 - pointerSmooth.y * 0.3;
    camera.position.x = pointerSmooth.x * 0.5;
    camera.lookAt(0, 0, camera.position.z - 12);

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(renderFrame);
  }
  rafId = requestAnimationFrame(renderFrame);

  return {
    update(progress: number) {
      scrollProgress = progress;
    },
    resize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h || 1;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    },
    setReducedMotion(reduced: boolean) {
      reducedMotion = reduced;
    },
    dispose() {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      panels.forEach((p) => {
        const frame = p.mesh as THREE.Mesh;
        const panelChild = frame.children[0] as THREE.Mesh | undefined;
        (frame.material as THREE.Material).dispose();
        if (panelChild) {
          ((panelChild.material as THREE.MeshBasicMaterial).map ?? null)?.dispose();
          (panelChild.material as THREE.Material).dispose();
          panelChild.geometry.dispose();
        }
        frame.geometry.dispose();
      });
      geometry.dispose();
      frameGeometry.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      grid.geometry.dispose();
      (grid.material as THREE.Material).dispose();
      renderer.dispose();
    },
  };
}
