import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Reveal from '../components/Reveal';
import TiltCard from '../components/TiltCard';

import heroImg from '../assets/equitone/hero.jpg';
import tectiva from '../assets/equitone/tectiva.jpg';
import linea from '../assets/equitone/linea.jpg';
import lunara from '../assets/equitone/lunara.jpg';
import natura from '../assets/equitone/natura.jpg';
import pictura from '../assets/equitone/pictura.jpg';
import textura from '../assets/equitone/textura.jpg';
import inspira from '../assets/equitone/inspira.jpg';

const COLORS = ['#4fae8c', '#f5b90f', '#e41959', '#4c96d1', '#7d2a72'];

const RANGES = [
  { name: 'Tectiva', img: tectiva },
  { name: 'Linea', img: linea },
  { name: 'Lunara', img: lunara },
  { name: 'Natura', img: natura },
  { name: 'Pictura', img: pictura },
  { name: 'Textura', img: textura },
  { name: 'Inspira', img: inspira },
];

export default function Equitone() {
  const { t } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(dir: number) {
    trackRef.current?.scrollBy({ left: dir * 260, behavior: 'smooth' });
  }

  return (
    <>
      <section className="relative w-full h-[70vh] min-h-[480px] overflow-hidden">
        <img src={heroImg} alt={t.equitone.caption} className="hero-video absolute inset-0 w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(5,8,13,0.55) 0%, rgba(5,8,13,0.25) 40%, rgba(5,8,13,0.95) 100%)' }}
        />
        <div className="relative h-full flex flex-col items-center justify-end text-center px-5 pb-14 z-10">
          <span className="hero-anim hero-fade text-xs uppercase tracking-widest text-white/50 mb-3" style={{ animationDelay: '0.1s' }}>
            {t.equitone.caption}
          </span>
          <h1
            className="hero-anim hero-reveal font-display text-white text-5xl sm:text-7xl tracking-wide"
            style={{ animationDelay: '0.25s' }}
          >
            EQUITONE
          </h1>
          <p className="hero-anim hero-fade text-white/70 text-sm sm:text-base mt-2" style={{ animationDelay: '0.5s' }}>
            {t.equitone.tagline}
          </p>
        </div>
        <Link
          to="/"
          className="hero-anim hero-fade absolute top-5 left-5 sm:top-6 sm:left-8 z-20 inline-flex items-center gap-2 text-white/80 hover:text-white text-sm bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full px-4 py-2 transition-colors"
          style={{ animationDelay: '0.7s' }}
        >
          <ArrowLeft size={15} /> {t.equitone.backCta}
        </Link>
      </section>

      <section className="relative z-10 py-16 px-5 sm:px-8">
        <Reveal className="max-w-4xl mx-auto glass-panel rounded-3xl p-6 sm:p-10" style={{ borderTop: '2px solid #e41959' }}>
          {t.equitone.paragraphs.map((p) => (
            <p key={p.slice(0, 20)} className="text-white/70 leading-relaxed mb-4 text-sm sm:text-base last:mb-0">
              {p}
            </p>
          ))}
          <Link
            to="/"
            className="inline-flex mt-6 bg-crimson hover:bg-[#c81450] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03]"
          >
            {t.equitone.quoteCta}
          </Link>
        </Reveal>
      </section>

      <section className="relative z-10 pb-24 px-5 sm:px-8">
        <Reveal className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-light text-white">{t.equitone.gammesHeading}</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scroll(-1)}
                aria-label="Précédent"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scroll(1)}
                aria-label="Suivant"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div
            ref={trackRef}
            className="flex gap-4 overflow-x-auto pb-4"
            style={{ scrollSnapType: 'x mandatory', perspective: '900px', scrollbarWidth: 'none' }}
          >
            {RANGES.map(({ name, img }, i) => {
              const color = COLORS[i % COLORS.length];
              return (
                <Reveal key={name} delay={i * 80} className="shrink-0">
                  <TiltCard
                    className="glass-panel rounded-2xl overflow-hidden shrink-0"
                    style={{ width: 180, scrollSnapAlign: 'start', borderTop: `2px solid ${color}` }}
                  >
                    <img src={img} alt={name} className="w-full h-32 object-cover" draggable={false} />
                    <div className="px-4 py-3 text-center">
                      <span className="font-display uppercase text-sm text-white tracking-wide">{name}</span>
                    </div>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </Reveal>
      </section>
    </>
  );
}
