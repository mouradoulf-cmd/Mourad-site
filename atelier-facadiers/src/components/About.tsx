import atelierStock from '../assets/atelier-stock.jpg';
import { useLanguage } from '../context/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="apropos" className="relative z-10 py-24 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto glass-panel rounded-3xl p-6 sm:p-10 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <img
          src={atelierStock}
          alt={t.about.alt}
          className="rounded-2xl w-full h-[280px] sm:h-[360px] object-cover"
        />
        <div>
          <h2 className="text-3xl sm:text-4xl font-light text-white mb-5" style={{ textWrap: 'balance' }}>
            {t.about.heading1} <span className="font-serif italic">{t.about.headingAccent}</span> {t.about.heading2}
          </h2>
          <p className="text-white/65 leading-relaxed mb-8">{t.about.text}</p>
          <div className="flex gap-10">
            <div>
              <div className="text-3xl font-semibold text-crimson font-display">5</div>
              <div className="text-sm text-white/50">{t.about.stat1}</div>
            </div>
            <div>
              <div className="text-3xl font-semibold text-crimson font-display">9</div>
              <div className="text-sm text-white/50">{t.about.stat2}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
