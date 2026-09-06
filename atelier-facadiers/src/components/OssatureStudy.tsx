import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';
import TiltCard from './TiltCard';

export default function OssatureStudy() {
  const { t } = useLanguage();
  const cards = [t.study.card1, t.study.card2];
  const colors = ['#4fae8c', '#4c96d1'];

  return (
    <section id="ossature" className="relative z-10 py-16 px-5 sm:px-8">
      <Reveal className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-light text-white" style={{ textWrap: 'balance' }}>
          {t.study.heading}
        </h2>
      </Reveal>
      <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-5" style={{ perspective: '900px' }}>
        {cards.map((card, i) => (
          <Reveal key={card.title} delay={i * 120}>
            <TiltCard
              className="glass-panel rounded-2xl p-8 h-full flex flex-col"
              style={{ borderTop: `2px solid ${colors[i]}` }}
            >
              <h3 className="font-display uppercase tracking-wide text-lg text-white mb-3">{card.title}</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-6 flex-1">{card.text}</p>
              <a
                href="#contact"
                className="self-start inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full text-white transition-transform hover:scale-[1.03]"
                style={{ backgroundColor: colors[i] }}
              >
                {card.cta}
              </a>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
