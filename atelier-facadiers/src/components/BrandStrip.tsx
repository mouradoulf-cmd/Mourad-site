import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';
import BrandStripGallery from './BrandStripGallery';

export default function BrandStrip() {
  const { t } = useLanguage();

  return (
    <div id="marques" className="relative z-10 py-24 border-y border-white/10 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 'min(1300px, 100%)',
          height: 520,
          background: 'radial-gradient(50% 50% at 50% 50%, rgba(76,150,209,0.16) 0%, rgba(76,150,209,0) 70%)',
        }}
      />
      <Reveal className="relative z-10 text-center mb-12 px-5">
        <span className="block text-xs uppercase tracking-widest text-white/40 mb-3">{t.brandsHeading}</span>
        <h2 className="text-3xl sm:text-5xl font-light text-white" style={{ textWrap: 'balance' }}>
          {t.brandsTitle1} <span className="font-serif italic">{t.brandsAccent}</span> {t.brandsTitle2}
        </h2>
        <p className="text-white/40 text-sm mt-4">{t.brandsHint}</p>
      </Reveal>
      <Reveal className="relative z-10 w-full">
        <BrandStripGallery />
      </Reveal>
    </div>
  );
}
