import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

export interface SceneHandle {
  /** 0 = resting hero pose, 1 = fully scrolled past hero */
  setScrollProgress: (t: number) => void
  /** 0 = far/intro camera + collapsed hero, 1 = settled resting pose */
  setIntroProgress: (t: number) => void
  /** Normalized pointer position, -1..1 on both axes */
  setPointer: (x: number, y: number) => void
  setReducedMotion: (reduced: boolean) => void
  resize: () => void
  dispose: () => void
}

const GOLD = 0xd4af37
const GOLD_BRIGHT = 0xf4d888
const MARBLE = 0x0c0a12

/** Builds the flat "M" silhouette used as the extrusion profile — a single
 *  concave heptagon (no holes): two full-height legs whose tops are joined
 *  by a V-shaped notch dipping to `valleyDepth`. */
function buildMShape(): THREE.Shape {
  const w = 4.4
  const h = 5.2
  const legW = 1.3
  const valleyY = h * 0.42

  const shape = new THREE.Shape()
  shape.moveTo(-w / 2, -h / 2)
  shape.lineTo(-w / 2, h / 2)
  shape.lineTo(-w / 2 + legW, h / 2)
  shape.lineTo(0, -h / 2 + valleyY)
  shape.lineTo(w / 2 - legW, h / 2)
  shape.lineTo(w / 2, h / 2)
  shape.lineTo(w / 2, -h / 2)
  shape.closePath()
  return shape
}

function buildCrown(): THREE.Group {
  const crown = new THREE.Group()
  const goldMat = new THREE.MeshStandardMaterial({ color: GOLD, metalness: 1, roughness: 0.22 })
  const jewelMat = new THREE.MeshStandardMaterial({
    color: GOLD_BRIGHT,
    emissive: GOLD_BRIGHT,
    emissiveIntensity: 0.9,
    metalness: 0.3,
    roughness: 0.15,
  })

  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.5, 0.35, 24, 1, true), goldMat)
  crown.add(base)

  const bandTop = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.06, 8, 32), goldMat)
  bandTop.rotation.x = Math.PI / 2
  bandTop.position.y = 0.17
  crown.add(bandTop)

  const spikeCount = 7
  for (let i = 0; i < spikeCount; i++) {
    const angle = (i / spikeCount) * Math.PI * 2
    const radius = 1.15
    const isTall = i % 2 === 0
    const spikeH = isTall ? 1.35 : 0.85
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.22, spikeH, 6), goldMat)
    spike.position.set(Math.cos(angle) * radius, spikeH / 2 + 0.17, Math.sin(angle) * radius)
    crown.add(spike)

    if (isTall) {
      const jewel = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 0), jewelMat)
      jewel.position.set(Math.cos(angle) * radius, spikeH + 0.17 + 0.05, Math.sin(angle) * radius)
      crown.add(jewel)
    }
  }

  return crown
}

function buildRings(): THREE.Group {
  const rings = new THREE.Group()
  const ringMat = new THREE.MeshStandardMaterial({
    color: GOLD,
    emissive: GOLD_BRIGHT,
    emissiveIntensity: 1.4,
    metalness: 0.6,
    roughness: 0.3,
  })

  const specs = [
    { radius: 2.9, tube: 0.035, tiltX: 1.4, tiltZ: 0.15, speed: 0.09 },
    { radius: 2.3, tube: 0.03, tiltX: 1.15, tiltZ: -0.3, speed: -0.14 },
    { radius: 3.5, tube: 0.02, tiltX: 1.55, tiltZ: 0.4, speed: 0.06 },
  ]

  specs.forEach((spec) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(spec.radius, spec.tube, 10, 96), ringMat)
    ring.rotation.x = spec.tiltX
    ring.rotation.z = spec.tiltZ
    ring.userData.spinSpeed = spec.speed
    rings.add(ring)
  })

  return rings
}

function buildShards(count: number): { mesh: THREE.InstancedMesh; seeds: Float32Array } {
  const geometry = new THREE.IcosahedronGeometry(0.16, 0)
  const material = new THREE.MeshStandardMaterial({
    color: MARBLE,
    metalness: 0.4,
    roughness: 0.4,
    emissive: GOLD,
    emissiveIntensity: 0.25,
  })
  const mesh = new THREE.InstancedMesh(geometry, material, count)
  const seeds = new Float32Array(count * 4) // radius, angle, height, spin speed

  const dummy = new THREE.Object3D()
  for (let i = 0; i < count; i++) {
    const radius = 3 + Math.random() * 2.6
    const angle = Math.random() * Math.PI * 2
    const height = (Math.random() - 0.5) * 4.5
    const spinSpeed = 0.2 + Math.random() * 0.5
    seeds.set([radius, angle, height, spinSpeed], i * 4)

    dummy.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius)
    dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
    const scale = 0.5 + Math.random() * 0.9
    dummy.scale.setScalar(scale)
    dummy.updateMatrix()
    mesh.setMatrixAt(i, dummy.matrix)
  }
  mesh.instanceMatrix.needsUpdate = true

  return { mesh, seeds }
}

/** A radial gold-glow disc used as the reflective platform beneath the M,
 *  built from a runtime canvas texture (no external asset needed). */
function buildFloorGlow(): THREE.Mesh {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(244,216,136,0.55)')
  gradient.addColorStop(0.35, 'rgba(212,175,55,0.28)')
  gradient.addColorStop(1, 'rgba(212,175,55,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false })
  const mesh = new THREE.Mesh(new THREE.CircleGeometry(5.5, 64), material)
  mesh.rotation.x = -Math.PI / 2
  mesh.position.y = -2.7
  return mesh
}

export function initThreeScene(canvas: HTMLCanvasElement): SceneHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 1)

  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x000000, 0.045)

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
  const restCameraPos = new THREE.Vector3(0, 1.6, 11.5)
  const introCameraPos = new THREE.Vector3(0, 4.6, 21)
  const lookAtTarget = new THREE.Vector3(0, 2.1, 0)
  camera.position.copy(introCameraPos)
  camera.lookAt(lookAtTarget)

  // ---------- Lighting ----------
  scene.add(new THREE.AmbientLight(0x1a1420, 0.7))
  const keyLight = new THREE.PointLight(0xffdca0, 22, 26, 2)
  keyLight.position.set(4, 6, 6)
  scene.add(keyLight)
  const rimLight = new THREE.PointLight(0x8fa2ff, 7, 26, 2)
  rimLight.position.set(-6, 2, -5)
  scene.add(rimLight)
  const fillLight = new THREE.PointLight(GOLD_BRIGHT, 5, 22, 2)
  fillLight.position.set(0, -3, 6)
  scene.add(fillLight)

  // ---------- Hero group (everything that rotates/scales together) ----------
  // `hero` carries rotation/scale/bob; `rig` (its child) carries a fixed
  // vertical offset so the crown+M sit in the upper part of the frame,
  // leaving room below for the overlaid headline.
  const hero = new THREE.Group()
  scene.add(hero)
  const rig = new THREE.Group()
  rig.position.y = 1.9
  hero.add(rig)

  const mShape = buildMShape()
  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.9,
    bevelEnabled: true,
    bevelThickness: 0.12,
    bevelSize: 0.1,
    bevelSegments: 3,
    curveSegments: 1,
  }
  const mGeometry = new THREE.ExtrudeGeometry(mShape, extrudeSettings)
  mGeometry.center()
  const mMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x1c1522,
    emissive: 0x0d0812,
    emissiveIntensity: 1,
    metalness: 0.4,
    roughness: 0.4,
    clearcoat: 0.75,
    clearcoatRoughness: 0.25,
  })
  const mMesh = new THREE.Mesh(mGeometry, mMaterial)
  rig.add(mMesh)

  const edges = new THREE.EdgesGeometry(mGeometry, 20)
  const edgeMaterial = new THREE.LineBasicMaterial({ color: GOLD_BRIGHT, transparent: true, opacity: 0.9 })
  const edgeLines = new THREE.LineSegments(edges, edgeMaterial)
  rig.add(edgeLines)

  const crown = buildCrown()
  crown.position.y = 2.95
  crown.scale.setScalar(1.05)
  rig.add(crown)

  const rings = buildRings()
  rig.add(rings)

  const { mesh: shardMesh, seeds: shardSeeds } = buildShards(46)
  rig.add(shardMesh)

  scene.add(buildFloorGlow())

  // ---------- Starfield backdrop ----------
  const starCount = 400
  const starPositions = new Float32Array(starCount * 3)
  for (let i = 0; i < starCount; i++) {
    const radius = 20 + Math.random() * 30
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    starPositions[i * 3 + 1] = Math.abs(radius * Math.sin(phi) * Math.sin(theta)) * 0.4
    starPositions[i * 3 + 2] = radius * Math.cos(phi)
  }
  const starGeometry = new THREE.BufferGeometry()
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.045, transparent: true, opacity: 0.5 })
  const stars = new THREE.Points(starGeometry, starMaterial)
  scene.add(stars)

  // ---------- Post-processing ----------
  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.55, 0.4, 0.68)
  composer.addPass(bloomPass)
  composer.addPass(new OutputPass())

  // ---------- Runtime state ----------
  let reducedMotion = false
  let scrollProgress = 0
  let introProgress = 0
  const pointer = { x: 0, y: 0 }
  const pointerEased = { x: 0, y: 0 }
  const clock = new THREE.Clock()
  let frameId = 0
  hero.scale.setScalar(0.001)
  // Extra camera distance on narrow/portrait viewports so the vertical
  // extent of the crown+M composition still fits without cropping.
  let portraitPad = 0

  function setSize() {
    const parent = canvas.parentElement
    const width = parent ? parent.clientWidth : window.innerWidth
    const height = parent ? parent.clientHeight : window.innerHeight
    renderer.setSize(width, height, false)
    composer.setSize(width, height)
    bloomPass.setSize(width, height)
    const aspect = width / Math.max(height, 1)
    camera.aspect = aspect
    camera.updateProjectionMatrix()
    portraitPad = Math.max(0, 0.85 - aspect) * 9
  }
  setSize()

  function animate() {
    frameId = requestAnimationFrame(animate)
    const dt = Math.min(clock.getDelta(), 1 / 30)
    const elapsed = clock.getElapsedTime()

    if (!reducedMotion) {
      pointerEased.x += (pointer.x - pointerEased.x) * Math.min(dt * 3, 1)
      pointerEased.y += (pointer.y - pointerEased.y) * Math.min(dt * 3, 1)

      const spinIn = (1 - introProgress) * Math.PI * 2.4
      hero.rotation.y = elapsed * 0.12 + pointerEased.x * 0.35 + spinIn
      hero.rotation.x = pointerEased.y * -0.18
      hero.position.y = Math.sin(elapsed * 0.6) * 0.12
      hero.scale.setScalar(Math.max(introProgress, 0.001) / (1 + scrollProgress * 0.5))

      rings.children.forEach((child) => {
        const speed = (child.userData.spinSpeed as number) ?? 0.1
        child.rotation.z += speed * dt
      })

      const dummy = new THREE.Object3D()
      for (let i = 0; i < shardMesh.count; i++) {
        const radius = shardSeeds[i * 4]
        const baseAngle = shardSeeds[i * 4 + 1]
        const height = shardSeeds[i * 4 + 2]
        const spinSpeed = shardSeeds[i * 4 + 3]
        const angle = baseAngle + elapsed * 0.08 * spinSpeed
        dummy.position.set(Math.cos(angle) * radius, height + Math.sin(elapsed * spinSpeed + i) * 0.25, Math.sin(angle) * radius)
        dummy.rotation.set(elapsed * spinSpeed * 0.6, elapsed * spinSpeed * 0.4, 0)
        dummy.scale.setScalar(0.5 + (i % 5) * 0.18)
        dummy.updateMatrix()
        shardMesh.setMatrixAt(i, dummy.matrix)
      }
      shardMesh.instanceMatrix.needsUpdate = true

      stars.rotation.y = elapsed * 0.004
    }

    // Camera: GSAP drives `introProgress` 0→1 once on mount (far dramatic
    // shot → resting shot); scroll then dollies further out as the hero
    // section leaves the viewport. Both are simple lerps so Three.js only
    // has to answer "given these two progress values, where is the camera".
    if (!reducedMotion) {
      const introPos = new THREE.Vector3().lerpVectors(introCameraPos, restCameraPos, introProgress)
      introPos.z += portraitPad
      const scrolledOutPos = new THREE.Vector3(0, 1.6, 15 + portraitPad)
      camera.position.lerpVectors(introPos, scrolledOutPos, Math.min(scrollProgress * 1.4, 1))
      camera.lookAt(lookAtTarget)
    }

    composer.render()
  }
  frameId = requestAnimationFrame(animate)

  const resizeObserver = new ResizeObserver(() => setSize())
  if (canvas.parentElement) resizeObserver.observe(canvas.parentElement)
  window.addEventListener('resize', setSize)

  return {
    setScrollProgress(t: number) {
      scrollProgress = t
    },
    setIntroProgress(t: number) {
      introProgress = t
    },
    setPointer(x: number, y: number) {
      pointer.x = x
      pointer.y = y
    },
    setReducedMotion(reduced: boolean) {
      reducedMotion = reduced
      if (reduced) {
        hero.rotation.set(0, 0, 0)
        hero.position.y = 0
        hero.scale.setScalar(1)
        camera.position.copy(restCameraPos)
        camera.lookAt(lookAtTarget)
        composer.render()
      }
    },
    resize: setSize,
    dispose() {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      window.removeEventListener('resize', setSize)

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.InstancedMesh || object instanceof THREE.LineSegments) {
          object.geometry.dispose()
          const material = object.material
          if (Array.isArray(material)) material.forEach((m) => m.dispose())
          else material.dispose()
        }
        if (object instanceof THREE.Points) {
          object.geometry.dispose()
          ;(object.material as THREE.Material).dispose()
        }
      })
      composer.dispose()
      renderer.dispose()
    },
  }
}
