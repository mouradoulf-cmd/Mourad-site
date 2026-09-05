import { useLanguage } from '../context/LanguageContext';

const COLORS = ['#4fae8c', '#f5b90f', '#e41959', '#4c96d1', '#7d2a72'];

export default function BrandStrip() {
  const { t } = useLanguage();

  return (
    <div className="relative z-10 py-14 px-5 sm:px-8 border-y border-white/10">
      <div className="max-w-4xl mx-auto grid grid-cols-3 gap-3 sm:gap-4">
        {t.brands.map((brand, i) => {
          const color = COLORS[i % COLORS.length];
          return (
            <div
              key={brand}
              className="glass-panel rounded-xl py-5 px-3 flex flex-col items-center justify-center gap-2.5 text-center"
              style={{ borderBottom: `3px solid ${color}` }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}90` }} />
              <span className="font-serif italic text-base sm:text-xl text-white">{brand}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
