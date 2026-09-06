import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';
import BrandStripGallery from './BrandStripGallery';

export default function BrandStrip() {
  const { t } = useLanguage();

  return (
    <div id="marques" className="relative z-10 py-16 border-y border-white/10 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 'min(1100px, 100%)',
          height: 400,
          background: 'radial-gradient(50% 50% at 50% 50%, rgba(76,150,209,0.12) 0%, rgba(76,150,209,0) 70%)',
        }}
      />
      <Reveal className="relative z-10 text-center mb-8 px-5">
        <span className="text-xs uppercase tracking-widest text-white/40">{t.brandsHeading}</span>
      </Reveal>
      <Reveal className="relative z-10 w-full">
        <BrandStripGallery />
      </Reveal>
    </div>
  );
}
