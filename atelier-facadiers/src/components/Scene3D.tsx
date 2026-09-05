import { useEffect, useRef } from 'react';
import { initThreeScene, type Scene3DHandle } from '../three/scene';
import { initScrollAnimations } from '../animations/scroll';

import heroChantier from '../assets/hero-chantier.jpg';
import projetBatiment from '../assets/projet-batiment.jpg';
import atelierStock from '../assets/atelier-stock.jpg';
import equitone from '../assets/equitone-swatches.jpg';

const IMAGES = [heroChantier, projetBatiment, atelierStock, equitone];

export default function Scene3D() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<Scene3DHandle | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = initThreeScene(canvas, IMAGES);
    sceneRef.current = scene;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    scene.setReducedMotion(media.matches);
    const onMotionChange = (e: MediaQueryListEvent) => scene.setReducedMotion(e.matches);
    media.addEventListener('change', onMotionChange);

    const heroEl = document.getElementById('hero-3d') ?? document.documentElement;

    const killScroll = media.matches
      ? () => {}
      : initScrollAnimations(scene, {
          trigger: heroEl,
          onProgress: (progress) => {
            if (wrapperRef.current) {
              const opacity = Math.max(0, 1 - progress * 1.15);
              wrapperRef.current.style.opacity = String(opacity);
            }
          },
        });

    const resizeObserver = new ResizeObserver(() => scene.resize());
    resizeObserver.observe(canvas);

    return () => {
      media.removeEventListener('change', onMotionChange);
      killScroll();
      resizeObserver.disconnect();
      scene.dispose();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="fixed inset-0 z-0 pointer-events-none" style={{ transition: 'opacity 0.1s linear' }}>
      <canvas ref={canvasRef} className="w-full h-full" aria-hidden="true" />
    </div>
  );
}
