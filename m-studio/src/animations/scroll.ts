import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { SceneHandle } from '../three/scene'

gsap.registerPlugin(ScrollTrigger)

export interface AnimationHandle {
  dispose: () => void
}

export function initSceneAnimations(scene: SceneHandle, heroSection: HTMLElement, reducedMotion: boolean): AnimationHandle {
  scene.setReducedMotion(reducedMotion)

  if (reducedMotion) {
    scene.setIntroProgress(1)
    scene.setScrollProgress(0)
    return { dispose: () => {} }
  }

  const introState = { t: 0 }
  const introTween = gsap.to(introState, {
    t: 1,
    duration: 2.2,
    delay: 0.15,
    ease: 'power3.out',
    onUpdate: () => scene.setIntroProgress(introState.t),
  })

  const scrollState = { t: 0 }
  const scrollTrigger = ScrollTrigger.create({
    trigger: heroSection,
    start: 'top top',
    end: 'bottom top',
    scrub: 0.6,
    onUpdate: (self) => {
      scrollState.t = self.progress
      scene.setScrollProgress(self.progress)
    },
  })

  return {
    dispose() {
      introTween.kill()
      scrollTrigger.kill()
    },
  }
}

export function initPointerParallax(onMove: (x: number, y: number) => void, reducedMotion: boolean): () => void {
  if (reducedMotion) return () => {}

  function handlePointerMove(event: PointerEvent) {
    const x = (event.clientX / window.innerWidth) * 2 - 1
    const y = (event.clientY / window.innerHeight) * 2 - 1
    onMove(x, y)
  }
  window.addEventListener('pointermove', handlePointerMove, { passive: true })
  return () => window.removeEventListener('pointermove', handlePointerMove)
}
