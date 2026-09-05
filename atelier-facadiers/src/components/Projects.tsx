import heroChantier from '../assets/hero-chantier.jpg';
import projetBatiment from '../assets/projet-batiment.jpg';
import equitone from '../assets/equitone-swatches.jpg';
import { useLanguage } from '../context/LanguageContext';

export default function Projects() {
  const { t } = useLanguage();

  return (
    <section id="projets" className="relative z-10 py-24 px-5 sm:px-8">
      <div className="max-w-3xl mx-auto text-center mb-14">
        <h2 className="text-3xl sm:text-5xl font-light text-white" style={{ textWrap: 'balance' }}>
          {t.projects.heading1} <span className="font-serif italic">{t.projects.headingAccent}</span> {t.projects.heading2}
        </h2>
      </div>
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 gap-5">
        <figure className="relative rounded-2xl overflow-hidden aspect-[4/5] group glass-panel">
          <img
            src={heroChantier}
            alt={t.projects.caption1}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <figcaption className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/70 to-transparent text-white text-sm font-medium font-display uppercase tracking-wide">
            {t.projects.caption1}
          </figcaption>
        </figure>
        <figure className="relative rounded-2xl overflow-hidden aspect-[4/5] group glass-panel">
          <img
            src={projetBatiment}
            alt={t.projects.caption2}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <figcaption className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/70 to-transparent text-white text-sm font-medium font-display uppercase tracking-wide">
            {t.projects.caption2}
          </figcaption>
        </figure>
      </div>
      <figure className="max-w-6xl mx-auto mt-5 rounded-2xl overflow-hidden glass-panel">
        <img src={equitone} alt="EQUITONE [inspira]" className="w-full h-auto" />
      </figure>
    </section>
  );
}
