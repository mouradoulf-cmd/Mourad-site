import { useLanguage } from '../context/LanguageContext';
import heroVideo from '../assets/hero-video.mp4';
import heroPoster from '../assets/hero-poster.jpg';
import MagneticButton from './MagneticButton';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative w-full h-screen overflow-hidden" style={{ height: '100dvh' }}>
      <video
        className="hero-video absolute inset-0 w-full h-full object-cover"
        src={heroVideo}
        poster={heroPoster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(5,8,13,0.45) 0%, rgba(5,8,13,0.25) 35%, rgba(5,8,13,0.92) 100%)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-3/5 h-[20%] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at bottom right, rgba(5,8,13,1) 0%, rgba(5,8,13,1) 40%, rgba(5,8,13,0) 100%)' }}
      />

      <div className="relative h-full flex flex-col items-center text-center px-5 pt-[26%] sm:pt-[22%] z-10">
        <h1 className="text-white leading-[0.95]" style={{ textShadow: '0 4px 40px rgba(0,0,0,0.6)' }}>
          <span
            className="hero-anim hero-reveal block font-serif italic font-normal text-5xl sm:text-7xl md:text-8xl"
            style={{ letterSpacing: '-0.02em', animationDelay: '0.25s' }}
          >
            {t.hero.line1}
          </span>
          <span
            className="hero-anim hero-reveal block font-display font-semibold uppercase text-4xl sm:text-6xl md:text-7xl mt-2"
            style={{ letterSpacing: '0.08em', animationDelay: '0.45s', color: '#f5b90f' }}
          >
            {t.hero.line2}
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
          {t.hero.text}
        </p>

        <div className="hero-anim hero-fade mt-9" style={{ animationDelay: '1.05s' }}>
          <MagneticButton
            href="#contact"
            className="bg-crimson hover:bg-[#c81450] text-white text-sm font-medium px-8 py-3.5 rounded-full transition-colors active:scale-95 hover:shadow-lg hover:shadow-crimson/40"
          >
            {t.hero.cta}
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
