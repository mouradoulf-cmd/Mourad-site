---
name: web3d-integration-patterns
description: Patterns for combining Three.js (WebGL scenes), GSAP ScrollTrigger, and Framer Motion in a React app — for sites that need a scroll-driven 3D hero or background experience layered under normal DOM content. Use when a brief asks for a "3D experience", scroll-linked 3D scene, or WebGL background behind animated overlay content.
---

# Web 3D Integration Patterns

## When this applies

Use this only when the brief genuinely calls for a real 3D scene (rotating/orbiting geometry, particles, a WebGL environment) that reacts to scroll or cursor — not for ordinary 2D motion. Ordinary fade/slide/parallax effects belong in CSS or Framer Motion alone; reach for Three.js only when something needs to exist and move in 3D space. Adding a WebGL layer is real weight (bundle size, GPU cost, a new failure surface) — justify it against the brief before reaching for it.

## Architecture: three independent layers, one shared timeline

A scroll-linked 3D page is built from three layers that must stay decoupled in code but synchronized at runtime:

1. **The 3D layer** (Three.js) — owns a `<canvas>`, a renderer, camera, and scene graph. Exposes an imperative API (`setScrollProgress(t)`, `dispose()`) rather than reaching into React state on every frame.
2. **The scroll/timeline layer** (GSAP + ScrollTrigger) — owns the mapping from scroll position to progress values. Drives the 3D layer's imperative API and can also drive plain DOM/CSS transforms.
3. **The DOM overlay layer** (Framer Motion or CSS) — ordinary page content (headings, copy, buttons) that sits above the canvas and animates on mount/in-view, independent of the 3D scene's internal state.

Keep these as separate modules (`three/scene.ts`, `animations/scroll.ts`, and plain components) as in the reference shape below — a single component that owns Three.js internals, GSAP timelines, and React state simultaneously becomes unmaintainable and re-initializes the WebGL context on every re-render if refs aren't used correctly.

## Reference shape

```jsx
// App.jsx - React root
import { useEffect, useRef } from 'react'
import { initThreeScene } from './three/scene'
import { initScrollAnimations } from './animations/scroll'
import { motion } from 'framer-motion'

function App() {
  const canvasRef = useRef()
  const sceneRef = useRef()

  useEffect(() => {
    // Initialize Three.js scene
    sceneRef.current = initThreeScene(canvasRef.current)

    // Initialize GSAP ScrollTrigger animations
    initScrollAnimations(sceneRef.current)

    // Cleanup
    return () => {
      sceneRef.current.dispose()
    }
  }, [])

  return (
    <div className="app">
      <canvas ref={canvasRef} />

      <motion.div
        className="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <section className="hero">
          <h1>3D Experience</h1>
        </section>
        <section className="content">
          {/* Scrollable content */}
        </section>
      </motion.div>
    </div>
  )
}
```

`three/scene.ts` should return an object with a small, explicit surface (`{ update(progress), resize(), dispose() }`), never the raw `THREE.Scene`/`Renderer` for outside code to mutate directly. `animations/scroll.ts` creates the `ScrollTrigger` timeline(s) and, on each `onUpdate`, calls `scene.update(self.progress)` — GSAP owns "when", Three.js owns "what happens visually".

## Rules

- **One `<canvas>`, one renderer, one `requestAnimationFrame` loop** for the whole page. Never spin up a second Three.js renderer for a second section — reuse the same scene and swap what's visible via `update(progress)`.
- **Always dispose.** On unmount (or React StrictMode's double-invoke in dev), call `renderer.dispose()`, dispose geometries/materials/textures, and kill every `ScrollTrigger` instance created for this component (`ScrollTrigger.getAll().forEach(t => t.kill())` scoped to this mount, or store the instances and kill them by reference). A leaked WebGL context or an orphaned ScrollTrigger listener silently degrades every subsequent page.
- **Resize handling**: listen for container resize (a `ResizeObserver` on the canvas's parent, not just `window.resize`), update camera aspect + renderer size, and recompute any ScrollTrigger `start`/`end` that depends on element positions (`ScrollTrigger.refresh()`).
- **Respect `prefers-reduced-motion`**: for a scroll-linked 3D scene, that means either freezing camera/object motion at a static pose, or falling back to a plain image/video poster — never skip this check for a WebGL layer, since uncontrolled 3D motion is exactly the kind of effect this preference exists to suppress.
- **Don't block first paint on the 3D layer.** Mount the DOM overlay immediately (Framer Motion `initial`/`animate` as in the reference); initialize Three.js after mount, and consider lazy-loading the Three.js/GSAP bundles behind a dynamic `import()` if the 3D scene isn't in the very first viewport.
- **Keep the frame budget.** Profile on a mid-tier device, not just the dev machine. Prefer instancing/merged geometry over many separate meshes, cap pixel ratio (`renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`), and avoid recreating materials/geometries inside the scroll callback — allocate once in `initThreeScene`, mutate properties (position/rotation/uniform values) in `update()`.
- **Ground the scene in the actual brief.** A generic rotating abstract shape is the templated default for "3D experience" requests — per the `frontend-design` skill's own guidance, the 3D content should be the most characteristic thing in the subject's world (real product geometry, real data shape, real material), not decoration bolted onto unrelated copy.

## Stack notes

- Three.js: use the imperative API directly for full control, or `@react-three/fiber` if the rest of the codebase is heavily React-idiomatic and the team is comfortable with its reconciler — don't mix both approaches in the same scene.
- GSAP ScrollTrigger requires `gsap.registerPlugin(ScrollTrigger)` once, and its `scrub`/`pin` options interact with layout — test pinned sections against the "no horizontal scroll at any width" and mobile-viewport-height requirements that apply to every site in this project.
- Framer Motion stays scoped to ordinary DOM elements (the overlay); don't try to animate Three.js object properties through it.
