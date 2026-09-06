import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';
import MagneticButton from './MagneticButton';

export default function CtaBand() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="relative z-10 py-24 px-5 text-center">
      <Reveal className="max-w-xl mx-auto glass-panel rounded-3xl p-10">
        <h2 className="text-3xl sm:text-4xl font-light text-white mb-4" style={{ textWrap: 'balance' }}>
          {t.cta.heading} <span className="font-serif italic">{t.cta.headingAccent}</span>
        </h2>
        <p className="text-white/60 mb-8">{t.cta.text}</p>
        <MagneticButton
          href="tel:0474173333"
          className="inline-flex bg-crimson hover:bg-[#c81450] text-white text-base font-medium px-9 py-4 rounded-full transition-colors active:scale-95 hover:shadow-lg hover:shadow-crimson/40"
        >
          04 74 17 33 33
        </MagneticButton>
      </Reveal>
    </section>
  );
}
