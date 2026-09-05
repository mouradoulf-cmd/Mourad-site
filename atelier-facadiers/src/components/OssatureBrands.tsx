import { useLanguage } from '../context/LanguageContext';

export default function OssatureBrands() {
  const { t } = useLanguage();

  return (
    <section className="relative z-10 pb-6 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto glass-panel rounded-2xl px-6 py-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
        <span className="text-xs uppercase tracking-widest text-white/50 font-display shrink-0">
          {t.ossature.heading}
        </span>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {t.ossature.items.map((item) => (
            <span key={item} className="text-sm sm:text-base text-white/80 font-medium">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
