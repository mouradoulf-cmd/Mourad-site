import logo from '../assets/logo.png';

function LinkedinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer id="documentation" className="bg-navy text-white/80 pt-16 pb-6 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto flex flex-wrap gap-10 justify-between pb-8 border-b border-white/10">
        <div>
          <img src={logo} alt="Atelier des Façadiers" className="h-9 bg-white rounded-lg px-3 py-1.5 mb-4" />
          <p className="text-sm">7 rue des Garennes, 01600 Reyrieux</p>
          <p className="text-sm">04 74 17 33 33</p>
          <p className="text-sm">Lun–Jeu 7h30–17h00 · Ven 7h30–16h00</p>
        </div>
        <nav className="flex flex-col gap-2.5 text-sm">
          <a href="#apropos" className="hover:text-gold transition-colors">Qui sommes-nous ?</a>
          <a href="#services" className="hover:text-gold transition-colors">Bardage</a>
          <a href="#services" className="hover:text-gold transition-colors">Ossature</a>
          <a href="#projets" className="hover:text-gold transition-colors">Projets</a>
          <a href="#contact" className="hover:text-gold transition-colors">Contact / Devis</a>
        </nav>
        <div className="flex gap-3 items-start">
          <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-full border border-white/25 flex items-center justify-center hover:border-white/60 transition-colors">
            <LinkedinIcon />
          </a>
          <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full border border-white/25 flex items-center justify-center hover:border-white/60 transition-colors">
            <InstagramIcon />
          </a>
        </div>
      </div>
      <p className="max-w-6xl mx-auto text-xs text-white/45 pt-6">
        © 2026 Atelier des Façadiers — Tous droits réservés
      </p>
    </footer>
  );
}
