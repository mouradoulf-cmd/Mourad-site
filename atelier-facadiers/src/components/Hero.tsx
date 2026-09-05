export default function Hero() {
  return (
    <section className="relative w-full h-screen" style={{ height: '100dvh' }}>
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(5,8,13,0.75) 100%)' }}
      />

      <div className="absolute top-[30%] left-0 right-0 flex flex-col items-center text-center px-5 pointer-events-none z-10">
        <h1 className="text-white leading-[0.95]" style={{ textShadow: '0 4px 40px rgba(0,0,0,0.6)' }}>
          <span
            className="hero-anim hero-reveal block font-serif italic font-normal text-5xl sm:text-7xl md:text-8xl"
            style={{ letterSpacing: '-0.02em', animationDelay: '0.25s' }}
          >
            De l'ossature
          </span>
          <span
            className="hero-anim hero-reveal block font-display font-semibold uppercase text-4xl sm:text-6xl md:text-7xl mt-2"
            style={{ letterSpacing: '0.08em', animationDelay: '0.45s', color: '#f5b90f' }}
          >
            à la façade
          </span>
        </h1>

        <div
          className="hero-anim hero-fade mt-8 w-24 h-[2px] glow-pulse"
          style={{
            animationDelay: '0.75s',
            background: 'linear-gradient(90deg, #4fae8c, #f5b90f, #e41959, #4c96d1, #7d2a72)',
            boxShadow: '0 0 16px rgba(245,185,15,0.6)',
          }}
        />

        <p
          className="hero-anim hero-fade mt-8 max-w-md text-sm sm:text-base text-white/75 leading-relaxed"
          style={{ animationDelay: '0.9s' }}
        >
          Façonnier et distributeur de solutions de bardage nouvelle génération : stock, préconisation
          technique, usinage sur-mesure et logistique pilotés pour vos chantiers.
        </p>

        <a
          href="#contact"
          className="hero-anim hero-fade pointer-events-auto mt-9 bg-crimson hover:bg-[#c81450] text-white text-sm font-medium px-8 py-3.5 rounded-full transition-all hover:scale-[1.04] active:scale-95 hover:shadow-lg hover:shadow-crimson/40"
          style={{ animationDelay: '1.05s' }}
        >
          Demander un devis
        </a>
      </div>

      <div className="hero-anim hero-fade absolute bottom-8 left-0 right-0 flex justify-center z-10" style={{ animationDelay: '1.3s' }}>
        <span className="text-[11px] tracking-[0.3em] uppercase text-white/40 font-display">Scroll</span>
      </div>
    </section>
  );
}
