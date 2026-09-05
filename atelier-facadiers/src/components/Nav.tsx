import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import logo from '../assets/logo.png';

const LINKS = [
  { label: 'Qui sommes-nous', href: '#apropos' },
  { label: 'Bardage', href: '#services' },
  { label: 'Ossature', href: '#services' },
  { label: 'Projets', href: '#projets' },
  { label: 'Documentation', href: '#documentation' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5">
      <a href="#top" className="bg-white rounded-xl px-3 py-1.5 shadow-sm">
        <img src={logo} alt="Atelier des Façadiers" className="h-7 sm:h-8 w-auto" />
      </a>

      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-2 py-2 items-center gap-1">
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-white/85 hover:bg-white/20 hover:text-white transition-colors px-4 py-1.5 rounded-full text-sm font-medium"
          >
            {link.label}
          </a>
        ))}
      </div>

      <a
        href="#contact"
        className="hidden md:block bg-white text-navy text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors"
      >
        Devis
      </a>

      <button
        type="button"
        className="md:hidden text-white p-2 -mr-2"
        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={26} /> : <Menu size={26} />}
      </button>

      {open && (
        <div className="md:hidden fixed inset-0 top-[64px] bg-void z-[99] flex flex-col items-center justify-center gap-6">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-white text-2xl font-medium"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="mt-4 bg-crimson text-white text-base font-semibold px-8 py-3 rounded-full"
            onClick={() => setOpen(false)}
          >
            Demander un devis
          </a>
        </div>
      )}
    </nav>
  );
}
