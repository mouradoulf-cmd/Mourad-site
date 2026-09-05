import { useEffect, useRef } from 'react';
import { initThreeScene, type Scene3DHandle } from '../three/scene';
import { initScrollAnimations } from '../animations/scroll';

import heroChantier from '../assets/hero-chantier.jpg';
import projetBatiment from '../assets/projet-batiment.jpg';
import atelierStock from '../assets/atelier-stock.jpg';
import equitone from '../assets/equitone-swatches.jpg';

const IMAGES = [heroChantier, projetBatiment, atelierStock, equitone];

export default function Scene3D() {
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

    const killScroll = media.matches ? () => {} : initScrollAnimations(scene);

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
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
