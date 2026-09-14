import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';
import TiltCard from './TiltCard';
import { BRAND_LOGOS as LOGOS } from '../assets/brandLogos';

const BRAND_LINKS: Record<string, string> = {
  EQUITONE: '/bardage/equitone',
};

const COLORS = ['#e41959', '#f5b90f', '#e41959', '#e41959', '#e41959'];

export default function BrandStrip() {
  const { t } = useLanguage();

  return (
    <div id="marques" className="relative z-10 py-24 px-5 sm:px-8 border-y border-white/10 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 'min(1300px, 100%)',
          height: 520,
          background: 'radial-gradient(50% 50% at 50% 50%, rgba(76,150,209,0.16) 0%, rgba(76,150,209,0) 70%)',
        }}
      />
      <Reveal className="relative z-10 text-center mb-14">
        <span className="block text-xs uppercase tracking-widest text-white/40 mb-3">{t.brandsHeading}</span>
        <h2 className="text-3xl sm:text-5xl font-light text-white" style={{ textWrap: 'balance' }}>
          {t.brandsTitle1} <span className="font-serif italic">{t.brandsAccent}</span> {t.brandsTitle2}
        </h2>
      </Reveal>

      <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6" style={{ perspective: '1000px' }}>
        {t.brands.map((brand, i) => {
          const color = COLORS[i % COLORS.length];
          const card = (
            <TiltCard
              className="bg-white rounded-2xl py-6 px-5 flex items-center justify-center h-28 sm:h-36"
              style={{ borderBottom: `4px solid ${color}`, boxShadow: '0 12px 30px rgba(0,0,0,0.3)' }}
            >
              <img src={LOGOS[brand]} alt={brand} className="max-h-10 sm:max-h-14 w-auto object-contain" />
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
