import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';
import TiltCard from './TiltCard';
import { BRAND_LOGOS as LOGOS } from '../assets/brandLogos';

const BRAND_LINKS: Record<string, string> = {
  EQUITONE: '/bardage/equitone',
};

const COLORS = ['#4fae8c', '#f5b90f', '#e41959', '#4c96d1', '#7d2a72'];

export default function BrandStrip() {
  const { t } = useLanguage();

  return (
    <div id="marques" className="relative z-10 py-14 px-5 sm:px-8 border-y border-white/10">
      <div className="max-w-4xl mx-auto grid grid-cols-3 gap-3 sm:gap-4" style={{ perspective: '900px' }}>
        {t.brands.map((brand, i) => {
          const color = COLORS[i % COLORS.length];
          const card = (
            <TiltCard
              className="bg-white rounded-xl py-5 px-4 flex items-center justify-center h-20 sm:h-24"
              style={{ borderBottom: `3px solid ${color}`, boxShadow: '0 8px 20px rgba(0,0,0,0.25)' }}
            >
              <img src={LOGOS[brand]} alt={brand} className="max-h-8 sm:max-h-9 w-auto object-contain" />
            </TiltCard>
          );
          const link = BRAND_LINKS[brand];
          return (
            <Reveal key={brand} delay={i * 70}>
              {link ? (
                <Link to={link} className="block">
                  {card}
                </Link>
              ) : (
                card
              )}
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
