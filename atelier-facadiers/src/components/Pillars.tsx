import { useState } from 'react';
import { Boxes, ClipboardCheck, Truck, Ruler, LifeBuoy } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';

import stockImg from '../assets/atelier-stock.jpg';
import preconisationImg from '../assets/pillars/preconisation.jpg';
import logistiqueImg from '../assets/pillars/logistique.jpg';
import usinageImg from '../assets/pillars/usinage.jpg';
import serviceImg from '../assets/pillars/service-technique.jpg';

const ICONS = [Boxes, ClipboardCheck, Truck, Ruler, LifeBuoy];
const COLORS = ['#4fae8c', '#f5b90f', '#e41959', '#4c96d1', '#7d2a72'];
const IMAGES = [stockImg, preconisationImg, logistiqueImg, usinageImg, serviceImg];

export default function Pillars() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const activeColor = COLORS[active];

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

      <Reveal className="max-w-5xl mx-auto">
        <div className="h-1 rounded-full overflow-hidden flex mb-8" aria-hidden="true">
          {COLORS.map((c) => (
            <span key={c} style={{ backgroundColor: c, flex: 1 }} />
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-5 sm:gap-x-10 mb-2">
          {t.pillars.items.map(({ title }, i) => {
            const Icon = ICONS[i];
            const isActive = i === active;
            return (
              <button
                key={title}
                type="button"
                onClick={() => setActive(i)}
                className="flex flex-col items-center gap-2 group"
              >
                <span
                  className="flex items-center gap-1.5 text-sm sm:text-base font-display uppercase tracking-wide transition-colors"
                  style={{ color: COLORS[i], textDecoration: isActive ? 'underline' : 'none', textUnderlineOffset: '4px' }}
                >
                  <Icon size={16} strokeWidth={2} />
                  {title}
                </span>
                <svg
                  width="18"
                  height="14"
                  viewBox="0 0 18 14"
                  style={{
                    fill: COLORS[i],
                    transform: isActive ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
                  }}
                >
                  <polygon points="0,0 18,7 0,14" />
                </svg>
              </button>
            );
          })}
        </div>

        <div
          key={active}
          className="rounded-3xl p-6 sm:p-10 grid md:grid-cols-[1.2fr_1fr] gap-8 items-center overflow-hidden"
          style={{ backgroundColor: activeColor, animation: 'panelFade 0.5s cubic-bezier(0.16,1,0.3,1)' }}
        >
          <div>
            <h3 className="font-display uppercase text-xl sm:text-2xl text-white mb-4 leading-tight" style={{ textWrap: 'balance' }}>
              {t.pillars.items[active].heading}
            </h3>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed">{t.pillars.items[active].text}</p>
          </div>
          <img
            src={IMAGES[active]}
            alt={t.pillars.items[active].title}
            className="w-full h-56 sm:h-64 object-cover rounded-2xl"
          />
        </div>
      </Reveal>

      <style>{`
        @keyframes panelFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
