import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';
import TiltCard from './TiltCard';
import team from '../assets/team.jpg';
import heroChantier from '../assets/hero-chantier.jpg';
import catalogue from '../assets/catalogue-2026.jpg';

const COLORS = ['#4fae8c', '#f5b90f', '#e41959', '#4c96d1', '#7d2a72'];

export default function News() {
  const { t } = useLanguage();
  const images = [team, heroChantier, catalogue];

  return (
    <section id="actualites" className="relative z-10 py-28 px-5 sm:px-8 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
        style={{
          width: 'min(1100px, 100%)',
          height: 480,
          background: 'radial-gradient(50% 50% at 50% 0%, rgba(76,150,209,0.14) 0%, rgba(76,150,209,0) 70%)',
        }}
      />
      <Reveal className="relative z-10 max-w-3xl mx-auto text-center mb-16">
        <span className="block text-xs uppercase tracking-widest text-white/40 mb-3">{t.news.heading}</span>
        <h2 className="text-3xl sm:text-5xl font-light text-white" style={{ textWrap: 'balance' }}>
          {t.news.title1} <span className="font-serif italic">{t.news.titleAccent}</span> {t.news.title2}
        </h2>
      </Reveal>

      <div className="relative z-10 max-w-6xl mx-auto grid sm:grid-cols-3 gap-6">
        {t.news.items.map((item, i) => {
          const color = COLORS[i % COLORS.length];
          return (
            <Reveal key={item.title} delay={i * 120}>
              <TiltCard className="h-full">
                <a
                  href="#contact"
                  className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full group"
                  style={{ borderTop: `2px solid ${color}` }}
                >
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={images[i]}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, rgba(5,8,13,0.85) 0%, rgba(5,8,13,0.05) 55%, transparent 100%)' }}
                    />
                    {item.date && (
                      <span
                        className="absolute top-4 left-4 text-[11px] font-semibold uppercase tracking-wide text-white px-3 py-1.5 rounded-full backdrop-blur-md"
                        style={{ background: `${color}cc` }}
                      >
                        {item.date}
                      </span>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-white font-display uppercase tracking-wide text-base mb-3">{item.title}</h3>
                    <span
                      className="mt-auto inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
                      style={{ color }}
                    >
                      {t.news.readMore}
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </a>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>

      <Reveal className="relative z-10 flex justify-center mt-12">
        <a
          href="#contact"
          className="text-xs font-medium uppercase tracking-widest bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full transition-colors border border-white/15"
        >
          {t.news.viewAll}
        </a>
      </Reveal>
    </section>
  );
}
