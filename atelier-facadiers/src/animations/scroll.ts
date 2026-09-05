import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Scene3DHandle } from '../three/scene';

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations(scene: Scene3DHandle) {
  const trigger = ScrollTrigger.create({
    trigger: document.documentElement,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.6,
    onUpdate: (self) => scene.update(self.progress),
  });

  return () => {
    trigger.kill();
  };
}
