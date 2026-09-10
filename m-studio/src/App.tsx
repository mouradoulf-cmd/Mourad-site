import { useEffect, useRef, useState } from 'react'
import { initThreeScene, type SceneHandle } from './three/scene'
import { initPointerParallax, initSceneAnimations } from './animations/scroll'

const PHONE_E164 = '+33782943674'
const PHONE_DISPLAY = '07 82 94 36 74'
const WHATSAPP_URL = 'https://wa.me/33782943674'

function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 sm:px-10 pt-6">
      <a href="#" className="font-display text-xl font-semibold text-white select-none">
        M<span className="text-gold">.</span>
      </a>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener"
        className="rounded-full border border-gold/30 bg-black/40 px-5 py-2.5 text-sm font-medium text-white/90 backdrop-blur-md transition-colors hover:border-gold hover:text-white"
      >
        WhatsApp
      </a>
    </header>
  )
}

function HeroOverlay({ visible }: { visible: boolean }) {
  return (
    <div
      className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-[8vh] pt-[64vh] text-center transition-all duration-1000 ease-out sm:pt-[58vh]"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)' }}
    >
      <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-gold">Studio digital</p>
      <h1 className="font-display text-4xl font-semibold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
        <em className="not-italic text-gold-bright">Sites web sur mesure</em>
      </h1>
      <p className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-white/75 sm:text-[17px]">
        Je conçois des sites vitrines modernes pour restaurants, artisans et
        commerces — un design soigné, rapide à mettre en ligne, pensé pour
        convaincre vos clients dès la première visite.
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
        <a
          href={`tel:${PHONE_E164}`}
          target="_blank"
          rel="noopener"
          className="rounded-xl bg-gradient-to-br from-gold-bright to-gold px-7 py-3.5 text-[15px] font-semibold text-[#1a1406] transition-transform hover:-translate-y-0.5"
        >
          Appeler
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener"
          className="rounded-xl border border-gold/30 bg-white/[0.04] px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:border-gold"
        >
          WhatsApp
        </a>
      </div>
    </div>
  )
}

function Services() {
  const items = [
    {
      icon: '🎨',
      title: 'Design sur mesure',
      text: "Un style unique, adapté à votre activité et à votre image — pas de template générique.",
    },
    {
      icon: '⚡',
      title: 'Rapide & efficace',
      text: 'Un site vitrine complet livré en quelques jours, optimisé pour mobile et desktop.',
    },
    {
      icon: '🚀',
      title: 'Mise en ligne incluse',
      text: "Nom de domaine, hébergement et accompagnement — je m'occupe de tout, vous n'avez rien à gérer.",
    },
  ]

  return (
    <section className="relative z-10 border-t border-gold/20 bg-ink px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-gold">Ce que je propose</p>
        <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">Un site vitrine clé en main</h2>
        <p className="mx-auto mt-4 max-w-lg text-white/70">
          De l'idée à la mise en ligne, un accompagnement simple et sans jargon technique.
        </p>
      </div>
      <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className="rounded-2xl border border-gold/20 bg-gradient-to-b from-gold/5 to-transparent p-7">
            <span className="mb-3 block text-2xl">{item.icon}</span>
            <h3 className="mb-2 font-display text-lg font-semibold text-white">{item.title}</h3>
            <p className="text-sm text-white/70">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="relative z-10 border-t border-gold/20 bg-ink px-6 py-10 text-center">
      <div className="mb-3 flex flex-wrap items-center justify-center gap-6 text-sm text-white/80">
        <a href={`tel:${PHONE_E164}`} target="_blank" rel="noopener" className="hover:text-gold">
          {PHONE_DISPLAY}
        </a>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener" className="hover:text-gold">
          WhatsApp
        </a>
      </div>
      <p className="text-xs text-white/50">© {new Date().getFullYear()} M — Studio digital</p>
    </footer>
  )
}

function App() {
  const heroRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [overlayVisible, setOverlayVisible] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const heroSection = heroRef.current
    if (!canvas || !heroSection) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let scene: SceneHandle | null = null
    let disposeAnimations = () => {}
    let disposePointer = () => {}

    scene = initThreeScene(canvas)
    const animations = initSceneAnimations(scene, heroSection, reducedMotion)
    disposeAnimations = animations.dispose
    disposePointer = initPointerParallax((x, y) => scene?.setPointer(x, y), reducedMotion)

    const revealDelay = window.setTimeout(() => setOverlayVisible(true), reducedMotion ? 0 : 250)

    return () => {
      window.clearTimeout(revealDelay)
      disposeAnimations()
      disposePointer()
      scene?.dispose()
    }
  }, [])

  return (
    <div className="bg-ink font-sans">
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden bg-black">
        <canvas ref={canvasRef} className="absolute inset-0 z-0 h-full w-full" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[52%] bg-gradient-to-t from-black via-black/70 to-transparent" />
        <Navbar />
        <HeroOverlay visible={overlayVisible} />
      </section>
      <Services />
      <Footer />
    </div>
  )
}

export default App
