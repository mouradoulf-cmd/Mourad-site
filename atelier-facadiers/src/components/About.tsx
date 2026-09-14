import { Heart, HeartHandshake, Users, Lightbulb, Leaf } from 'lucide-react';
import siege from '../assets/siege.jpg';
import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';
import TiltCard from './TiltCard';
import CountUp from './CountUp';

const VALUE_ICONS = [Heart, HeartHandshake, Users, Lightbulb, Leaf];
const VALUE_COLORS = ['#e41959', '#f5b90f', '#e41959', '#e41959', '#e41959'];

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="apropos" className="relative z-10 py-24 px-5 sm:px-8">
      <Reveal className="max-w-6xl mx-auto glass-panel rounded-3xl p-6 sm:p-10 grid md:grid-cols-2 gap-10 md:gap-16 items-center mb-6">
        <img src={siege} alt={t.about.alt} className="rounded-2xl w-full h-[280px] sm:h-[380px] object-cover" />
        <div>
          <span className="text-xs uppercase tracking-widest text-crimson font-display mb-3 block">{t.about.eyebrow}</span>
          <h2 className="text-3xl sm:text-4xl font-light text-white mb-5" style={{ textWrap: 'balance' }}>
            {t.about.heading}
          </h2>
          {t.about.paragraphs.map((p) => (
            <p key={p.slice(0, 20)} className="text-white/65 leading-relaxed mb-4 text-sm sm:text-base">
              {p}
            </p>
          ))}
        </div>
      </Reveal>

      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mb-6">
        {t.about.stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 90}>
            <div className="glass-panel rounded-2xl p-6 h-full text-center">
              <div className="text-3xl sm:text-4xl font-semibold text-crimson font-display mb-2">
                {typeof stat.value === 'number' ? (
                  <>
                    <CountUp to={stat.value} />
                    {stat.suffix ?? ''}
                  </>
                ) : (
                  stat.display
                )}
              </div>
              <div className="text-xs sm:text-sm text-white/55 leading-snug">{stat.label}</div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="max-w-3xl mx-auto text-center mb-10">
        <h3 className="text-2xl sm:text-3xl font-light text-white">{t.about.valuesHeading}</h3>
      </Reveal>
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-5" style={{ perspective: '900px' }}>
        {t.about.values.map(({ title, text }, i) => {
          const Icon = VALUE_ICONS[i];
          const color = VALUE_COLORS[i];
          return (
            <Reveal key={title} delay={i * 90}>
              <TiltCard className="glass-panel rounded-2xl p-6 flex flex-col gap-4 h-full" style={{ borderTop: `2px solid ${color}` }}>
                <span
                  className="inline-flex items-center justify-center w-11 h-11 rounded-full"
                  style={{ backgroundColor: `${color}26`, color, boxShadow: `0 0 18px ${color}40` }}
                  aria-hidden="true"
                >
                  <Icon size={20} strokeWidth={1.75} />
                </span>
                <h4 className="text-sm font-semibold text-white leading-snug">{title}</h4>
                <p className="text-xs leading-relaxed text-white/55">{text}</p>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
