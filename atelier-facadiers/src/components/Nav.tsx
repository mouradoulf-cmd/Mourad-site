import { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import logo from '../assets/logo.png';
import { useLanguage } from '../context/LanguageContext';
import type { Lang } from '../i18n';

function LangSwitch({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLanguage();
  const options: Lang[] = ['fr', 'en'];

  return (
    <div
      className={`flex items-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md p-0.5 text-xs font-semibold ${compact ? '' : ''}`}
      role="group"
      aria-label="Langue / Language"
    >
      {options.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`px-2.5 py-1 rounded-full uppercase transition-colors ${
            lang === code ? 'bg-white text-navy' : 'text-white/70 hover:text-white'
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileBardageOpen, setMobileBardageOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const location = useLocation();
  const onHome = location.pathname === '/';

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5">
      <Link to="/" className="bg-white rounded-xl px-3 py-1.5 shadow-sm">
        <img src={logo} alt="Atelier des Façadiers" className="h-7 sm:h-8 w-auto" />
      </Link>

      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-2 py-2 items-center gap-1">
        {t.nav.links.map((link) =>
          link.href === '#marques' ? (
            <div key={link.label} className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                className="flex items-center gap-1 text-white/85 hover:bg-white/20 hover:text-white transition-colors px-4 py-1.5 rounded-full text-sm font-medium"
              >
                {link.label}
                <ChevronDown size={14} className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
              </button>
              {menuOpen && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+14px)] bg-navy/95 backdrop-blur-xl border border-white/15 rounded-2xl p-6 flex gap-8 shadow-2xl"
                  style={{ minWidth: 560 }}
                >
                  {t.nav.bardageMenu.map((cat) => (
                    <div key={cat.category} className="min-w-[130px]">
                      <span
                        className="block text-xs uppercase tracking-wide font-semibold mb-3 whitespace-nowrap"
                        style={{ color: cat.color }}
                      >
                        {cat.category}
                      </span>
                      <div className="flex flex-col gap-2">
                        {cat.items.map((item) => (
                          <Link
                            key={item.label}
                            to={item.to}
                            onClick={() => setMenuOpen(false)}
                            className="text-white/80 hover:text-white text-sm transition-colors whitespace-nowrap"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link
              key={link.label}
              to={onHome ? link.href : `/${link.href}`}
              className="text-white/85 hover:bg-white/20 hover:text-white transition-colors px-4 py-1.5 rounded-full text-sm font-medium"
            >
              {link.label}
            </Link>
          ),
        )}
      </div>

      <div className="flex items-center gap-3">
        <LangSwitch />
        <Link
          to={onHome ? '#contact' : '/#contact'}
          className="hidden md:block bg-white text-navy text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          {t.nav.cta}
        </Link>

        <button
          type="button"
          className="md:hidden text-white p-2 -mr-2"
          aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 top-[64px] bg-void z-[99] flex flex-col items-center justify-center gap-6 overflow-y-auto py-10">
          {t.nav.links.map((link) =>
            link.href === '#marques' ? (
              <div key={link.label} className="flex flex-col items-center gap-4 w-full px-8">
                <button
                  type="button"
                  onClick={() => setMobileBardageOpen((v) => !v)}
                  aria-expanded={mobileBardageOpen}
                  className="flex items-center gap-2 text-white text-2xl font-medium"
                >
                  {link.label}
                  <ChevronDown size={20} className={`transition-transform ${mobileBardageOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileBardageOpen && (
                  <div className="flex flex-col items-center gap-5 mt-2">
                    {t.nav.bardageMenu.map((cat) => (
                      <div key={cat.category} className="text-center">
                        <span
                          className="block text-xs uppercase tracking-wide font-semibold mb-2"
                          style={{ color: cat.color }}
                        >
                          {cat.category}
                        </span>
                        <div className="flex flex-col gap-2">
                          {cat.items.map((item) => (
                            <Link
                              key={item.label}
                              to={item.to}
                              className="text-white/80 text-lg"
                              onClick={() => {
                                setOpen(false);
                                setMobileBardageOpen(false);
                              }}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.label}
                to={onHome ? link.href : `/${link.href}`}
                className="text-white text-2xl font-medium"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ),
          )}
          <Link
            to={onHome ? '#contact' : '/#contact'}
            className="mt-4 bg-crimson text-white text-base font-semibold px-8 py-3 rounded-full"
            onClick={() => setOpen(false)}
          >
            {t.hero.cta}
          </Link>
        </div>
      )}
    </nav>
  );
}
