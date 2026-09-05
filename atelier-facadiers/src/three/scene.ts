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
  scene.fog = new THREE.FogExp2(0x0a1420, 0.045);

  const camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 6);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

  const panelGroup = new THREE.Group();
  scene.add(panelGroup);

  const loader = new THREE.TextureLoader();
  const geometry = new THREE.PlaneGeometry(2.6, 3.4);
  const frameGeometry = new THREE.PlaneGeometry(2.8, 3.6);

  const PANEL_COUNT = 22;
  const panels: { mesh: THREE.Mesh; baseY: number; speed: number; offset: number }[] = [];

  for (let i = 0; i < PANEL_COUNT; i++) {
    const img = images[i % images.length];
    const color = BRAND_COLORS[i % BRAND_COLORS.length];

    const frameMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });
    const frame = new THREE.Mesh(frameGeometry, frameMat);

    const texture = loader.load(img);
    texture.colorSpace = THREE.SRGBColorSpace;
    const panelMat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
    const panel = new THREE.Mesh(geometry, panelMat);
    panel.position.z = 0.02;
    frame.add(panel);

    const x = (Math.random() - 0.5) * 20;
    const y = (Math.random() - 0.5) * 12;
    const z = -Math.random() * 30 - 1;
    frame.position.set(x, y, z);
    frame.rotation.y = (Math.random() - 0.5) * 0.6;
    frame.rotation.x = (Math.random() - 0.5) * 0.15;

    panelGroup.add(frame);
    panels.push({ mesh: frame, baseY: y, speed: 0.2 + Math.random() * 0.4, offset: Math.random() * Math.PI * 2 });
  }

  // Particle field
  const PARTICLE_COUNT = 500;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const colorObjs = BRAND_COLORS.map((c) => new THREE.Color(c));
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = -Math.random() * 35;
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
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  let reducedMotion = false;
  let rafId = 0;
  const clock = new THREE.Clock();
  let scrollProgress = 0;

  function renderFrame() {
    const t = clock.getElapsedTime();

    if (!reducedMotion) {
      panelGroup.rotation.y = scrollProgress * Math.PI * 0.5;
      panels.forEach((p) => {
        p.mesh.position.y = p.baseY + Math.sin(t * p.speed + p.offset) * 0.35;
        p.mesh.rotation.z = Math.sin(t * 0.15 + p.offset) * 0.03;
      });
      particles.rotation.y = t * 0.01;
    }

    camera.position.z = 6 - scrollProgress * 34;
    camera.position.y = Math.sin(scrollProgress * Math.PI) * 1.2;
    camera.lookAt(0, 0, camera.position.z - 10);

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
      renderer.dispose();
    },
  };
}
