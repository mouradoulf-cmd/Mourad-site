import atelierStock from '../assets/atelier-stock.jpg';

export default function About() {
  return (
    <section id="apropos" className="py-24 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <img
          src={atelierStock}
          alt="Intérieur du hangar de stockage Atelier des Façadiers, panneaux de bardage sur convoyeur"
          className="rounded-2xl w-full h-[280px] sm:h-[360px] object-cover"
        />
        <div>
          <h2 className="text-3xl sm:text-4xl font-light text-navy mb-5" style={{ textWrap: 'balance' }}>
            Le trait d'union entre les <span className="font-serif italic">fabricants</span> et les poseurs
          </h2>
          <p className="text-slate leading-relaxed mb-8">
            Atelier des Façadiers accompagne les professionnels du bardage à chaque étape : sélection des
            matériaux, usinage sur-mesure, logistique de chantier et suivi technique. Un seul interlocuteur
            pour sécuriser vos délais et la qualité de vos façades.
          </p>
          <div className="flex gap-10">
            <div>
              <div className="text-3xl font-semibold text-crimson">5</div>
              <div className="text-sm text-slate">métiers intégrés</div>
            </div>
            <div>
              <div className="text-3xl font-semibold text-crimson">5</div>
              <div className="text-sm text-slate">marques distribuées</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
