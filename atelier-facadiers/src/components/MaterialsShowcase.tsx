import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';
import PanelShowcase3D from './PanelShowcase3D';

export default function MaterialsShowcase() {
  const { t } = useLanguage();

  return (
    <section className="relative z-10 py-24 px-5 sm:px-8 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 'min(1400px, 100%)',
          height: '100%',
          background: 'radial-gradient(50% 50% at 50% 45%, rgba(79,174,140,0.12) 0%, rgba(79,174,140,0) 70%)',
        }}
      />
      <Reveal className="relative max-w-2xl mx-auto text-center mb-4">
        <span className="block text-xs uppercase tracking-widest text-white/40 mb-3">{t.materials.eyebrow}</span>
        <h2 className="text-3xl sm:text-5xl font-light text-white" style={{ textWrap: 'balance' }}>
          {t.materials.heading1} <span className="font-serif italic">{t.materials.headingAccent}</span>
        </h2>
        <p className="mt-5 text-sm sm:text-base text-white/60 max-w-lg mx-auto leading-relaxed">{t.materials.text}</p>
      </Reveal>

      <Reveal delay={120} className="relative w-full h-[360px] sm:h-[440px] md:h-[520px]">
        <PanelShowcase3D />
      </Reveal>
    </section>
  );
}
