import { useState } from 'react'
import { ChevronsRight } from 'lucide-react'

// Substitution note: the pinned CDN asset (cdn.5sdesign.art/projects/labs/labs-video.mp4)
// is blocked by this environment's network policy and could not be downloaded to
// public/labs-video.mp4. The <video> below still targets that exact local path per
// spec, so it will "just work" the moment the real file is added to public/. Until
// then, an inline fallback (z-0, behind the video) approximates the neon-green-on-black
// look with a blurred animated gradient so the hero isn't a flat black screen.
function BackgroundVideo({ loaded, onLoaded }: { loaded: boolean; onLoaded: () => void }) {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 overflow-hidden bg-black"
        style={{ opacity: loaded ? 0 : 1, transition: 'opacity 1500ms ease' }}
      >
        <div
          className="absolute inset-[-20%] blur-3xl opacity-70"
          style={{
            background:
              'radial-gradient(closest-side, rgba(143,232,33,0.55), transparent 65%) 20% 30% / 55% 55% no-repeat,' +
              'radial-gradient(closest-side, rgba(143,232,33,0.35), transparent 65%) 80% 70% / 60% 60% no-repeat',
            animation: 'labsFallbackDrift 14s ease-in-out infinite',
          }}
        />
      </div>
      <video
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={onLoaded}
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 1500ms ease' }}
        src="/labs-video.mp4"
      />
    </>
  )
}

function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 sm:px-10 pt-6">
      <a href="#" className="flex items-center gap-2 select-none">
        <ChevronsRight size={22} strokeWidth={2.5} className="text-white" />
        <span className="text-white text-[17px] font-medium">Labs</span>
      </a>
      <nav className="hidden md:flex items-center bg-black/50 backdrop-blur-md rounded-2xl px-2 py-1.5">
        <a href="#" className="px-4 py-2 text-[14px] font-medium text-white/90 hover:text-white transition-colors">
          About
        </a>
        <a href="#" className="px-4 py-2 text-[14px] font-medium text-white/90 hover:text-white transition-colors">
          Services
        </a>
        <a href="#" className="px-4 py-2 text-[14px] font-medium text-white/90 hover:text-white transition-colors">
          Blog
        </a>
        <a href="#" className="px-4 py-2 text-[14px] font-medium text-white/90 hover:text-white transition-colors">
          Contact
        </a>
        <a href="#" className="px-4 py-2 text-[14px] font-medium text-white/90 hover:text-white transition-colors">
          Login
        </a>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pt-[14vh]">
      <h1 className="font-display font-semibold text-white text-[42px] sm:text-[64px] lg:text-[84px] leading-[1.06] tracking-tight">
        Connecting you to
        <br />
        a <em className="italic">faster</em> future.
      </h1>
      <p className="text-white/85 text-[15px] sm:text-[17px] leading-relaxed mt-7 max-w-[500px]">
        Experience ultra-fast, reliable internet service with Labs, your gateway to seamless connectivity.
      </p>
      <a
        href="#"
        className="mt-9 bg-white text-black text-[15px] font-semibold px-7 py-3.5 rounded-xl hover:bg-white/90 transition-colors"
      >
        Get started now
      </a>
    </section>
  )
}

function App() {
  const [loaded, setLoaded] = useState(false)

  return (
    <main className="relative h-screen overflow-hidden bg-black font-sans">
      <BackgroundVideo loaded={loaded} onLoaded={() => setLoaded(true)} />
      <Navbar />
      <Hero />
    </main>
  )
}

export default App
