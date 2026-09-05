import { Boxes, ClipboardCheck, Truck, Ruler, LifeBuoy } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';
import TiltCard from './TiltCard';

const ICONS = [Boxes, ClipboardCheck, Truck, Ruler, LifeBuoy];
const COLORS = ['#4fae8c', '#f5b90f', '#e41959', '#4c96d1', '#7d2a72'];

export default function Pillars() {
  const { t } = useLanguage();

  return (
    <section id="services" className="relative z-10 py-24 px-5 sm:px-8">
      <Reveal className="max-w-3xl mx-auto text-center mb-14">
        <h2 className="text-3xl sm:text-5xl font-light text-white" style={{ textWrap: 'balance' }}>
          {t.pillars.heading1}{' '}
          <span className="font-display uppercase" style={{ letterSpacing: '0.04em' }}>
            {t.pillars.heading2}
          </span>
        </h2>
      </Reveal>

      <div className="max-w-6xl mx-auto relative">
        <div
          className="line-sweep hidden md:block absolute top-6 left-[10%] right-[10%] h-px overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.08)' }}
          aria-hidden="true"
        />

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-5" style={{ perspective: '900px' }}>
          {t.pillars.items.map(({ title, text }, i) => {
            const Icon = ICONS[i];
            const color = COLORS[i];
            return (
              <Reveal key={title} delay={i * 90}>
                <TiltCard
                  className="group glass-panel rounded-2xl p-6 flex flex-col gap-4 relative"
                  style={{ borderTop: `2px solid ${color}` }}
                >
                  <span className="absolute top-4 right-5 font-display text-xs text-white/25 tracking-widest">
                    0{i + 1}
                  </span>
                  <span className="relative inline-flex items-center justify-center w-11 h-11 mt-1 mb-2" style={{ color }} aria-hidden="true">
                    <span className="icon-ring--reverse" />
                    <span className="icon-ring" />
                    <span className="icon-ping" style={{ border: `1.5px solid ${color}`, animationDelay: `${i * 0.4}s` }} />
                    <span
                      className="relative inline-flex items-center justify-center w-11 h-11 rounded-full transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                      style={{ backgroundColor: `${color}26`, color, boxShadow: `0 0 18px ${color}40` }}
                    >
                      <Icon size={20} strokeWidth={1.75} />
                    </span>
                  </span>
                  <h3 className="text-base font-semibold text-white font-display tracking-wide uppercase">{title}</h3>
                  <p className="text-sm leading-relaxed text-white/60">{text}</p>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
