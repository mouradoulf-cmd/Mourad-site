import { useLanguage } from '../context/LanguageContext';

const COLORS = ['#4fae8c', '#f5b90f', '#e41959', '#4c96d1', '#7d2a72'];

export default function BrandStrip() {
  const { t } = useLanguage();

  return (
    <div className="relative z-10 py-14 px-5 sm:px-8 border-y border-white/10">
      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-5">
        {t.brands.map((brand, i) => {
          const color = COLORS[i % COLORS.length];
          return (
            <div
              key={brand}
              className="glass-panel rounded-2xl py-6 px-4 flex flex-col items-center justify-center gap-3 text-center"
              style={{ borderBottom: `3px solid ${color}` }}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}90` }} />
              <span className="font-serif italic text-xl sm:text-2xl text-white">{brand}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
