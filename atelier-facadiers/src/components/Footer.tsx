import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useLanguage } from '../context/LanguageContext';

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
  const { t } = useLanguage();
  const location = useLocation();
  const onHome = location.pathname === '/';

  return (
    <footer className="relative z-10 bg-void text-white/80 pt-16 pb-6 px-5 sm:px-8">
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #e41959, transparent)', opacity: 0.5 }}
      />

      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-10 pb-10 border-b border-white/10">
        <div className="md:col-span-2">
          <img src={logo} alt="Atelier des Façadiers" className="h-9 bg-white rounded-lg px-3 py-1.5 mb-5" />
          <p className="text-sm max-w-xs">{t.footer.address}</p>
          <p className="text-sm mt-1">{t.footer.hours}</p>
        </div>

        <nav className="flex flex-col gap-2.5 text-sm">
          {t.footer.links.map((link) => (
            <Link
              key={link.label}
              to={onHome ? link.href : `/${link.href}`}
              className="w-fit hover:text-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-4 sm:items-end">
          <a
            href={`tel:${t.footer.phone.replace(/\s/g, '')}`}
            className="text-lg font-display font-semibold text-white hover:text-gold transition-colors"
          >
            {t.footer.phone}
          </a>
          <div className="flex gap-3">
            <a
              href="#"
              aria-label="LinkedIn"
              className="w-9 h-9 rounded-full border border-white/25 flex items-center justify-center transition-all hover:border-transparent hover:text-white hover:scale-110"
              style={{ transition: 'all 0.25s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 16px rgba(76,150,209,0.55)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
            >
              <LinkedinIcon />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full border border-white/25 flex items-center justify-center transition-all hover:border-transparent hover:scale-110"
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 16px rgba(228,25,89,0.55)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
            >
              <InstagramIcon />
            </a>
          </div>
        </div>
      </div>
      <p className="max-w-6xl mx-auto text-xs text-white/45 pt-6">{t.footer.rights}</p>
    </footer>
  );
}
