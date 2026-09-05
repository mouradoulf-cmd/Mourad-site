import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Scene3DHandle } from '../three/scene';

gsap.registerPlugin(ScrollTrigger);

interface ScrollOptions {
  trigger: Element;
  onProgress?: (progress: number) => void;
}

export function initScrollAnimations(scene: Scene3DHandle, options: ScrollOptions) {
  const trigger = ScrollTrigger.create({
    trigger: options.trigger,
    start: 'top top',
    end: 'bottom top',
    scrub: 0.6,
    onUpdate: (self) => {
      scene.update(self.progress);
      options.onProgress?.(self.progress);
    },
  });

  return () => {
    trigger.kill();
  };
}
