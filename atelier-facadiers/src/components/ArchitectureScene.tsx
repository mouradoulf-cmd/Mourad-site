import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const BUILDING_COLORS = ['#f5f5f7', '#eceef1', '#ffffff', '#e4e6ea'];
const ACCENT_COLORS = [0x4fae8c, 0xf5b90f, 0xe41959, 0x4c96d1, 0x7d2a72];

export default function ArchitectureScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05080d, 0.014);

    const frustumSize = 22;
    let aspect = mount.clientWidth / Math.max(mount.clientHeight, 1);
    const camera = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      100
    );
    camera.position.set(13, 11.5, 13);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xaab4c8, 1.4);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 2.2);
    sun.position.set(11, 18, 12);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -20;
    sun.shadow.camera.right = 20;
    sun.shadow.camera.top = 20;
    sun.shadow.camera.bottom = -20;
    sun.shadow.bias = -0.0015;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0xffffff, 0.9);
    fill.position.set(13, 8, 13);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0x7d2a72, 0.6);
    rim.position.set(-12, 6, -10);
    scene.add(rim);

    const groundGeo = new THREE.CircleGeometry(16, 64);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x0d1520, roughness: 0.95, metalness: 0.05 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const cityGroup = new THREE.Group();
    scene.add(cityGroup);

    let seed = 42;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const gridSize = 7;
    const spacing = 2.15;
    const accentMeshes: { mesh: THREE.Mesh; phase: number }[] = [];

    for (let ix = 0; ix < gridSize; ix++) {
      for (let iz = 0; iz < gridSize; iz++) {
        const distFromCenter = Math.hypot(ix - gridSize / 2, iz - gridSize / 2);
        if (rand() < 0.14 || distFromCenter > gridSize * 0.62) continue;

        const height = 1 + rand() * 5 + Math.max(0, 1 - distFromCenter / (gridSize * 0.7)) * 2.4;
        const w = 1.25 + rand() * 0.55;
        const geo = new THREE.BoxGeometry(w, height, w);
        const colorHex = BUILDING_COLORS[Math.floor(rand() * BUILDING_COLORS.length)];
        const mat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.55, metalness: 0.15 });
        const mesh = new THREE.Mesh(geo, mat);
        const x = (ix - gridSize / 2) * spacing + (rand() - 0.5) * 0.4;
        const z = (iz - gridSize / 2) * spacing + (rand() - 0.5) * 0.4;
        mesh.position.set(x, height / 2, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        cityGroup.add(mesh);

        if (rand() < 0.55) {
          const accentColor = ACCENT_COLORS[Math.floor(rand() * ACCENT_COLORS.length)];
          const stripGeo = new THREE.BoxGeometry(w + 0.05, 0.12, w + 0.05);
          const stripMat = new THREE.MeshStandardMaterial({
            color: accentColor,
            emissive: accentColor,
            emissiveIntensity: 1.2,
            roughness: 0.4,
          });
          const strip = new THREE.Mesh(stripGeo, stripMat);
          strip.position.set(x, height - 0.06, z);
          cityGroup.add(strip);
          accentMeshes.push({ mesh: strip, phase: rand() * Math.PI * 2 });
        }

        if (rand() < 0.16) {
          const treeColor = rand() < 0.5 ? 0x7d2a72 : 0x4fae8c;
          const treeGeo = new THREE.IcosahedronGeometry(0.45 + rand() * 0.3, 0);
          const treeMat = new THREE.MeshStandardMaterial({ color: treeColor, roughness: 0.75 });
          const tree = new THREE.Mesh(treeGeo, treeMat);
          tree.position.set(x + (rand() - 0.5) * 0.9, 0.45, z + (rand() - 0.5) * 0.9);
          tree.castShadow = true;
          cityGroup.add(tree);
        }
      }
    }

    const handleResize = () => {
      if (!mount || mount.clientHeight === 0) return;
      aspect = mount.clientWidth / mount.clientHeight;
      camera.left = (-frustumSize * aspect) / 2;
      camera.right = (frustumSize * aspect) / 2;
      camera.top = frustumSize / 2;
      camera.bottom = -frustumSize / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);

    let isVisible = true;
    const io = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    io.observe(mount);

    let rafId = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!isVisible) return;
      const t = clock.getElapsedTime();
      cityGroup.rotation.y = t * 0.09;
      accentMeshes.forEach(({ mesh, phase }) => {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.7 + Math.sin(t * 1.6 + phase) * 0.6;
      });
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      io.disconnect();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative w-full h-[60vh] sm:h-[75vh] md:h-[85vh] overflow-hidden bg-void">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 'min(1400px, 100%)',
          height: '100%',
          background: 'radial-gradient(50% 50% at 50% 45%, rgba(76,150,209,0.12) 0%, rgba(76,150,209,0) 70%)',
        }}
      />
      <div ref={mountRef} className="absolute inset-0" />
    </div>
  );
}
