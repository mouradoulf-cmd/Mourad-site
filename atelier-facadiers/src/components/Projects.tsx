import heroChantier from '../assets/hero-chantier.jpg';
import projetBatiment from '../assets/projet-batiment.jpg';
import interieurVide from '../assets/interior-empty.jpg';
import batimentBicolore from '../assets/batiment-bicolore.jpg';
import equitone from '../assets/equitone-swatches.jpg';
import catalogue from '../assets/catalogue-2026.jpg';
import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';

export default function Projects() {
  const { t } = useLanguage();

  const photos = [
    { src: heroChantier, alt: t.projects.caption1, caption: t.projects.caption1 },
    { src: projetBatiment, alt: t.projects.caption2, caption: t.projects.caption2 },
    { src: interieurVide, alt: t.projects.caption3, caption: t.projects.caption3 },
    { src: batimentBicolore, alt: t.projects.caption4, caption: t.projects.caption4 },
  ];

  return (
    <section id="projets" className="relative z-10 py-24 px-5 sm:px-8">
      <Reveal className="max-w-3xl mx-auto text-center mb-14">
        <h2 className="text-3xl sm:text-5xl font-light text-white" style={{ textWrap: 'balance' }}>
          {t.projects.heading1} <span className="font-serif italic">{t.projects.headingAccent}</span> {t.projects.heading2}
        </h2>
      </Reveal>
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 gap-5">
        {photos.map((p, i) => (
          <Reveal key={p.caption} delay={i * 100}>
            <figure className="relative rounded-2xl overflow-hidden aspect-[4/3] group glass-panel">
              <img
                src={p.src}
                alt={p.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/70 to-transparent text-white text-sm font-medium font-display uppercase tracking-wide">
                {p.caption}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
      <Reveal className="max-w-6xl mx-auto mt-5 grid sm:grid-cols-[2fr_1fr] gap-5">
        <figure className="rounded-2xl overflow-hidden glass-panel">
          <img src={equitone} alt="EQUITONE [inspira]" className="w-full h-full object-cover" />
        </figure>
        <a
          id="documentation"
          href="#contact"
          className="glass-panel rounded-2xl overflow-hidden flex flex-col group scroll-mt-24"
        >
          <img
            src={catalogue}
            alt="Catalogue 2026 Atelier des Façadiers"
            className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="px-5 py-4 text-sm font-medium text-white/85 group-hover:text-white transition-colors">
            {t.projects.catalogueCta}
          </span>
        </a>
      </Reveal>
    </section>
  );
}
