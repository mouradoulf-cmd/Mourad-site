import { useState } from 'react';
import { Menu, X } from 'lucide-react';
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
  const { t } = useLanguage();

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5">
      <a href="#top" className="bg-white rounded-xl px-3 py-1.5 shadow-sm">
        <img src={logo} alt="Atelier des Façadiers" className="h-7 sm:h-8 w-auto" />
      </a>

      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-2 py-2 items-center gap-1">
        {t.nav.links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-white/85 hover:bg-white/20 hover:text-white transition-colors px-4 py-1.5 rounded-full text-sm font-medium"
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <LangSwitch />
        <a
          href="#contact"
          className="hidden md:block bg-white text-navy text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          {t.nav.cta}
        </a>

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
        <div className="md:hidden fixed inset-0 top-[64px] bg-void z-[99] flex flex-col items-center justify-center gap-6">
          {t.nav.links.map((link) => (
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
            {t.hero.cta}
          </a>
        </div>
      )}
    </nav>
  );
}
