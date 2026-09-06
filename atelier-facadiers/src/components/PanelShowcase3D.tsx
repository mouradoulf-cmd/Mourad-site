import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import tectiva from '../assets/equitone/tectiva.jpg';
import linea from '../assets/equitone/linea.jpg';
import natura from '../assets/equitone/natura.jpg';
import textura from '../assets/equitone/textura.jpg';
import inspira from '../assets/equitone/inspira.jpg';
import hero from '../assets/equitone/hero.jpg';

const TEXTURES = [tectiva, linea, natura, textura, inspira, hero];
const COLS = 5;
const ROWS = 3;
const PANEL_W = 1.15;
const PANEL_H = 1.95;
const GAP = 0.16;

function easeOutExpo(t: number) {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export default function PanelShowcase3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0.3, 9.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xffffff, 1.3);
    key.position.set(4, 6, 8);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x88aaff, 0.35);
    fill.position.set(-6, -2, 4);
    scene.add(fill);

    const group = new THREE.Group();
    scene.add(group);

    const loader = new THREE.TextureLoader();
    let seed = 11;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const totalW = COLS * PANEL_W + (COLS - 1) * GAP;
    const totalH = ROWS * PANEL_H + (ROWS - 1) * GAP;

    type PanelAnim = {
      mesh: THREE.Mesh;
      from: { x: number; y: number; z: number; rx: number; ry: number; rz: number };
      to: { x: number; y: number; z: number };
      delay: number;
    };
    const panels: PanelAnim[] = [];

    let index = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const tex = loader.load(TEXTURES[index % TEXTURES.length]);
        tex.colorSpace = THREE.SRGBColorSpace;
        const geo = new THREE.PlaneGeometry(PANEL_W, PANEL_H);
        const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7, metalness: 0.05 });
        const mesh = new THREE.Mesh(geo, mat);

        const toX = c * (PANEL_W + GAP) - totalW / 2 + PANEL_W / 2;
        const toY = -(r * (PANEL_H + GAP) - totalH / 2 + PANEL_H / 2);

        const from = {
          x: toX + (rand() - 0.5) * 10,
          y: toY + (rand() - 0.5) * 6,
          z: -4 - rand() * 6,
          rx: (rand() - 0.5) * 2.4,
          ry: (rand() - 0.5) * 2.4,
          rz: (rand() - 0.5) * 1.2,
        };

        mesh.position.set(from.x, from.y, from.z);
        mesh.rotation.set(from.rx, from.ry, from.rz);
        group.add(mesh);

        panels.push({ mesh, from, to: { x: toX, y: toY, z: 0 }, delay: (r * COLS + c) * 0.05 });
        index++;
      }
    }

    const scale = Math.min(1, (mount.clientWidth / mount.clientHeight) * 0.62);
    group.scale.setScalar(Math.max(0.55, scale));

    let isVisible = false;
    let hasAssembled = reduceMotion;
    let assembleStart = 0;
    const clock = new THREE.Clock();

    if (reduceMotion) {
      panels.forEach(({ mesh, to }) => {
        mesh.position.set(to.x, to.y, to.z);
        mesh.rotation.set(0, 0, 0);
      });
    }

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry?.isIntersecting ?? false;
        if (isVisible && !hasAssembled && assembleStart === 0) {
          assembleStart = clock.getElapsedTime();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(mount);

    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    mount.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!mount || mount.clientHeight === 0) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      const s = Math.min(1, (mount.clientWidth / mount.clientHeight) * 0.62);
      group.scale.setScalar(Math.max(0.55, s));
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);

    let rafId = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!isVisible && hasAssembled) {
        renderer.render(scene, camera);
        return;
      }
      const t = clock.getElapsedTime();

      if (!hasAssembled && assembleStart > 0) {
        let allDone = true;
        panels.forEach(({ mesh, from, to, delay }) => {
          const local = Math.max(0, Math.min(1, (t - assembleStart - delay) / 1.4));
          if (local < 1) allDone = false;
          const e = easeOutExpo(local);
          mesh.position.set(
            from.x + (to.x - from.x) * e,
            from.y + (to.y - from.y) * e,
            from.z + (to.z - from.z) * e
          );
          mesh.rotation.set(from.rx * (1 - e), from.ry * (1 - e), from.rz * (1 - e));
        });
        if (allDone) hasAssembled = true;
      }

      if (hasAssembled && !reduceMotion) {
        group.rotation.y += (mouse.x * 0.22 - group.rotation.y) * 0.04;
        group.rotation.x += (-mouse.y * 0.1 - group.rotation.x) * 0.04;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      resizeObserver.disconnect();
      mount.removeEventListener('mousemove', handleMouseMove);
      panels.forEach(({ mesh }) => {
        mesh.geometry.dispose();
        (mesh.material as THREE.MeshStandardMaterial).map?.dispose();
        (mesh.material as THREE.MeshStandardMaterial).dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
