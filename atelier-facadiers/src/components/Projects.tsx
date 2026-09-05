import heroChantier from '../assets/hero-chantier.jpg';
import projetBatiment from '../assets/projet-batiment.jpg';
import equitone from '../assets/equitone-swatches.jpg';

export default function Projects() {
  return (
    <section id="projets" className="relative z-10 py-24 px-5 sm:px-8">
      <div className="max-w-3xl mx-auto text-center mb-14">
        <h2 className="text-3xl sm:text-5xl font-light text-white" style={{ textWrap: 'balance' }}>
          Des <span className="font-serif italic">chantiers</span> menés du gros œuvre à la finition
        </h2>
      </div>
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 gap-5">
        <figure className="relative rounded-2xl overflow-hidden aspect-[4/5] group glass-panel">
          <img
            src={heroChantier}
            alt="Ossature métallique en construction"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <figcaption className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/70 to-transparent text-white text-sm font-medium font-display uppercase tracking-wide">
            Nouveau bâtiment pour l'ossature
          </figcaption>
        </figure>
        <figure className="relative rounded-2xl overflow-hidden aspect-[4/5] group glass-panel">
          <img
            src={projetBatiment}
            alt="Bardage métallique posé sur bâtiment industriel"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <figcaption className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/70 to-transparent text-white text-sm font-medium font-display uppercase tracking-wide">
            Bardage métallique — finition posée
          </figcaption>
        </figure>
      </div>
      <figure className="max-w-6xl mx-auto mt-5 rounded-2xl overflow-hidden glass-panel">
        <img src={equitone} alt="Nouvelle gamme EQUITONE [inspira]" className="w-full h-auto" />
      </figure>
    </section>
  );
}
