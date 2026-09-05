import { Boxes, ClipboardCheck, Truck, Ruler, LifeBuoy } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ICONS = [Boxes, ClipboardCheck, Truck, Ruler, LifeBuoy];
const COLORS = ['#4fae8c', '#f5b90f', '#e41959', '#4c96d1', '#7d2a72'];

export default function Pillars() {
  const { t } = useLanguage();

  return (
    <section id="services" className="relative z-10 py-24 px-5 sm:px-8">
      <div className="max-w-3xl mx-auto text-center mb-14">
        <h2 className="text-3xl sm:text-5xl font-light text-white" style={{ textWrap: 'balance' }}>
          {t.pillars.heading1}{' '}
          <span className="font-display uppercase" style={{ letterSpacing: '0.04em' }}>
            {t.pillars.heading2}
          </span>
        </h2>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-5">
        {t.pillars.items.map(({ title, text }, i) => {
          const Icon = ICONS[i];
          const color = COLORS[i];
          return (
            <div
              key={title}
              className="glass-panel rounded-2xl p-6 flex flex-col gap-4 transition-transform hover:-translate-y-1"
              style={{ borderTop: `2px solid ${color}` }}
            >
              <span
                className="inline-flex items-center justify-center w-11 h-11 rounded-full"
                style={{ backgroundColor: `${color}26`, color, boxShadow: `0 0 18px ${color}40` }}
                aria-hidden="true"
              >
                <Icon size={20} strokeWidth={1.75} />
              </span>
              <h3 className="text-base font-semibold text-white font-display tracking-wide uppercase">{title}</h3>
              <p className="text-sm leading-relaxed text-white/60">{text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
