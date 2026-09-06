import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const WHITE_SHADES = ['#f7f7f9', '#eef0f3', '#ffffff', '#e9ebef'];
const TREE_COLORS = [0x7d2a72, 0x9c5a91, 0x4fae8c];

export default function ArchitectureScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05080d, 0.013);

    const frustumSize = 18;
    let aspect = mount.clientWidth / Math.max(mount.clientHeight, 1);
    const camera = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      100
    );
    camera.position.set(12, 10, 12.5);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xaab4c8, 1.5);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 2.3);
    sun.position.set(11, 18, 12);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -16;
    sun.shadow.camera.right = 16;
    sun.shadow.camera.top = 16;
    sun.shadow.camera.bottom = -16;
    sun.shadow.bias = -0.0015;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0xffffff, 0.9);
    fill.position.set(13, 8, 13);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0x7d2a72, 0.45);
    rim.position.set(-12, 6, -10);
    scene.add(rim);

    const groundGeo = new THREE.CircleGeometry(13.5, 64);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x0d1520, roughness: 0.95, metalness: 0.05 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const buildingGroup = new THREE.Group();
    scene.add(buildingGroup);

    let seed = 7;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    const shade = () => WHITE_SHADES[Math.floor(rand() * WHITE_SHADES.length)];

    const box = (w: number, h: number, d: number, x: number, y: number, z: number) => {
      const geo = new THREE.BoxGeometry(w, h, d);
      const mat = new THREE.MeshStandardMaterial({ color: shade(), roughness: 0.6, metalness: 0.08 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      buildingGroup.add(mesh);
      return mesh;
    };

    const treeMeshes: { mesh: THREE.Mesh; baseY: number; phase: number }[] = [];
    const tree = (x: number, y: number, z: number, r: number) => {
      const geo = new THREE.IcosahedronGeometry(r, 0);
      const mat = new THREE.MeshStandardMaterial({
        color: TREE_COLORS[Math.floor(rand() * TREE_COLORS.length)],
        roughness: 0.7,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      buildingGroup.add(mesh);
      treeMeshes.push({ mesh, baseY: y, phase: rand() * Math.PI * 2 });
    };

    const treeRow = (x0: number, x1: number, z: number, y: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const t = count === 1 ? 0.5 : i / (count - 1);
        const x = x0 + (x1 - x0) * t + (rand() - 0.5) * 0.15;
        tree(x, y, z + (rand() - 0.5) * 0.15, 0.22 + rand() * 0.1);
      }
    };

    box(7.2, 2.4, 6.2, 0, 1.2, 0);
    treeRow(-3.3, 3.3, 3.4, 2.55, 7);
    treeRow(-3.3, 3.3, -3.4, 2.55, 7);

    box(5.4, 2.2, 4.4, -0.4, 3.5, 0.3);
    treeRow(-2.7, 2.4, 2.5, 4.68, 6);

    box(3.4, 2.0, 3.0, 0.7, 5.6, -0.6);
    treeRow(-0.9, 2.2, 1.35, 6.68, 4);

    box(1.8, 1.6, 1.6, 1.4, 7.4, -1.0);

    box(2.6, 1.5, 4.6, -3.6, 0.75, 1.5);
    box(3.2, 1.1, 2.6, -3.9, 0.55, -2.6);
    box(2.2, 0.9, 2.0, 3.9, 0.45, 2.4);

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
      buildingGroup.rotation.y = t * 0.075;
      treeMeshes.forEach(({ mesh, baseY, phase }) => {
        mesh.position.y = baseY + Math.sin(t * 1.1 + phase) * 0.045;
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
          background: 'radial-gradient(50% 50% at 50% 45%, rgba(125,42,114,0.12) 0%, rgba(125,42,114,0) 70%)',
        }}
      />
      <div ref={mountRef} className="absolute inset-0" />
    </div>
  );
}
