import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';
import TiltCard from './TiltCard';

import fundermax from '../assets/brands/fundermax.png';
import trespa from '../assets/brands/trespa.png';
import pura from '../assets/brands/pura.png';
import equitone from '../assets/brands/equitone.png';
import cedral from '../assets/brands/cedral.png';
import rockpanel from '../assets/brands/rockpanel.png';
import stacbond from '../assets/brands/stacbond.png';
import alpolic from '../assets/brands/alpolic.png';
import fiberdeck from '../assets/brands/fiberdeck.png';

const LOGOS: Record<string, string> = {
  Fundermax: fundermax,
  Trespa: trespa,
  PURA: pura,
  EQUITONE: equitone,
  Cedral: cedral,
  Rockpanel: rockpanel,
  Stacbond: stacbond,
  Alpolic: alpolic,
  Fiberdeck: fiberdeck,
};

const COLORS = ['#4fae8c', '#f5b90f', '#e41959', '#4c96d1', '#7d2a72'];

export default function BrandStrip() {
  const { t } = useLanguage();

  return (
    <div className="relative z-10 py-14 px-5 sm:px-8 border-y border-white/10">
      <div className="max-w-4xl mx-auto grid grid-cols-3 gap-3 sm:gap-4" style={{ perspective: '900px' }}>
        {t.brands.map((brand, i) => {
          const color = COLORS[i % COLORS.length];
          return (
            <Reveal key={brand} delay={i * 70}>
              <TiltCard
                className="bg-white rounded-xl py-5 px-4 flex items-center justify-center h-20 sm:h-24"
                style={{ borderBottom: `3px solid ${color}`, boxShadow: '0 8px 20px rgba(0,0,0,0.25)' }}
              >
                <img src={LOGOS[brand]} alt={brand} className="max-h-8 sm:max-h-9 w-auto object-contain" />
              </TiltCard>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
