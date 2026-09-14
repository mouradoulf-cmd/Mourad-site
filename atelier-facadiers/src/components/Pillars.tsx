import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Boxes, ClipboardCheck, Truck, Ruler, LifeBuoy } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';
import TiltCard from './TiltCard';
import AnimatedWords from './AnimatedWords';

import stockImg from '../assets/atelier-stock.jpg';
import preconisationImg from '../assets/pillars/preconisation.jpg';
import logistiqueImg from '../assets/pillars/logistique.jpg';
import usinageImg from '../assets/pillars/usinage.jpg';
import serviceImg from '../assets/pillars/service-technique.jpg';

const ICONS = [Boxes, ClipboardCheck, Truck, Ruler, LifeBuoy];
const COLORS = ['#e41959', '#f5b90f', '#e41959', '#e41959', '#e41959'];
const IMAGES = [stockImg, preconisationImg, logistiqueImg, usinageImg, serviceImg];

export default function Pillars() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const activeColor = COLORS[active];

  return (
    <section id="services" className="relative z-10 py-24 px-5 sm:px-8">
      <Reveal className="max-w-3xl mx-auto text-center mb-14">
        <h2 className="text-3xl sm:text-5xl font-light text-white" style={{ textWrap: 'balance' }}>
          <AnimatedWords text={t.pillars.heading1} />{' '}
          <span className="font-display uppercase" style={{ letterSpacing: '0.04em' }}>
            <AnimatedWords text={t.pillars.heading2} delayOffset={t.pillars.heading1.split(' ').length * 0.07} />
          </span>
        </h2>
      </Reveal>

      <Reveal className="max-w-5xl mx-auto">
        <div className="relative flex justify-between items-start mb-14 px-2 sm:px-6">
          <div className="absolute left-0 right-0 top-7 sm:top-8 h-px bg-white/10" aria-hidden="true" />
          {t.pillars.items.map(({ title }, i) => {
            const Icon = ICONS[i];
            const isActive = i === active;
            const color = COLORS[i];
            return (
              <button
                key={title}
                type="button"
                onClick={() => setActive(i)}
                className="relative z-10 flex flex-col items-center gap-2.5 group flex-1"
              >
                <motion.span
                  className="flex items-center justify-center rounded-full"
                  animate={{
                    width: isActive ? 60 : 44,
                    height: isActive ? 60 : 44,
                    backgroundColor: isActive ? color : 'rgba(255,255,255,0.06)',
                    boxShadow: isActive ? `0 0 0 4px ${color}33, 0 8px 24px ${color}66` : '0 0 0 1px rgba(255,255,255,0.12)',
                  }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Icon size={isActive ? 24 : 18} strokeWidth={2} color={isActive ? '#fff' : color} />
                </motion.span>
                <span
                  className="hidden sm:block text-xs sm:text-sm font-display uppercase tracking-wide text-center transition-colors"
                  style={{ color: isActive ? color : 'rgba(255,255,255,0.5)' }}
                >
                  {title}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ perspective: 1200 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, rotateX: -6, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, rotateX: 6, y: -24, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl p-6 sm:p-10 grid md:grid-cols-[1.2fr_1fr] gap-8 items-center overflow-hidden"
              style={{ backgroundColor: activeColor, transformStyle: 'preserve-3d' }}
            >
              <div>
                <span className="sm:hidden block text-xs font-display uppercase tracking-widest text-white/70 mb-2">
                  {t.pillars.items[active].title}
                </span>
                <h3 className="font-display uppercase text-xl sm:text-2xl text-white mb-4 leading-tight" style={{ textWrap: 'balance' }}>
                  {t.pillars.items[active].heading}
                </h3>
                <p className="text-sm sm:text-base text-white/90 leading-relaxed">{t.pillars.items[active].text}</p>
              </div>
              <TiltCard className="rounded-2xl overflow-hidden">
                <img src={IMAGES[active]} alt={t.pillars.items[active].title} className="w-full h-56 sm:h-64 object-cover" />
              </TiltCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}
