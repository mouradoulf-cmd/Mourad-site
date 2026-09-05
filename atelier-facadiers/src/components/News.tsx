import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';
import team from '../assets/team.jpg';
import equitone from '../assets/equitone-swatches.jpg';
import heroChantier from '../assets/hero-chantier.jpg';
import catalogue from '../assets/catalogue-2026.jpg';

export default function News() {
  const { t } = useLanguage();
  const images = [team, equitone, heroChantier, catalogue];

  return (
    <section id="actualites" className="relative z-10 py-24 px-5 sm:px-8">
      <Reveal className="max-w-6xl mx-auto flex items-center justify-between mb-10 flex-wrap gap-4">
        <h2 className="text-2xl sm:text-3xl font-light text-white">{t.news.heading}</h2>
        <a
          href="#contact"
          className="text-xs font-medium uppercase tracking-wide bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-colors"
        >
          {t.news.viewAll}
        </a>
      </Reveal>
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 gap-5">
        {t.news.items.map((item, i) => (
          <Reveal key={item.title} delay={i * 90}>
            <a href="#contact" className="glass-panel rounded-2xl overflow-hidden flex flex-col sm:flex-row group h-full">
              <img
                src={images[i]}
                alt={item.title}
                className="w-full sm:w-40 h-40 sm:h-auto object-cover flex-shrink-0 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="p-5 flex flex-col">
                {item.date && (
                  <span className="text-xs text-crimson underline underline-offset-2 mb-2">{item.date}</span>
                )}
                <h3 className="text-white font-medium mb-2">{item.title}</h3>
                <span className="mt-auto text-xs text-white/50 group-hover:text-white/80 transition-colors">
                  {t.news.readMore} →
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
