import { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Menu, X, ChevronDown, ChevronRight, Layers, Box, Waves, Grid3x3 } from 'lucide-react';
import logo from '../assets/logo.png';
import { useLanguage } from '../context/LanguageContext';
import { BRAND_LOGOS } from '../assets/brandLogos';
import type { Lang } from '../i18n';

const CATEGORY_ICONS = [Layers, Box, Waves, Grid3x3];

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

function BrandLogoChip({ label }: { label: string }) {
  const src = BRAND_LOGOS[label];
  if (!src) return null;
  return (
    <span className="w-7 h-7 rounded-md bg-white flex items-center justify-center shrink-0 overflow-hidden">
      <img src={src} alt="" className="max-w-[80%] max-h-[80%] object-contain" draggable={false} />
    </span>
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

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springX = useSpring(tiltX, { stiffness: 200, damping: 20 });
  const springY = useSpring(tiltY, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-7, 7]);

  function handlePanelMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    tiltX.set((e.clientX - rect.left) / rect.width - 0.5);
    tiltY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePanelLeave() {
    tiltX.set(0);
    tiltY.set(0);
  }

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setMobileBardageOpen(false);
    setOpen(false);
  }, [location.pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5">
      <Link to="/" className="bg-white rounded-xl px-3 py-1.5 shadow-sm">
        <img src={logo} alt="Atelier des Façadiers" className="h-7 sm:h-8 w-auto" />
      </Link>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="hidden md:block fixed inset-0 bg-void/70 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-2 py-2 items-center gap-1 z-50">
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
                <ChevronDown size={14} className={`transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.96 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    onMouseMove={handlePanelMove}
                    onMouseLeave={handlePanelLeave}
                    className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+14px)] rounded-2xl shadow-2xl overflow-hidden"
                    style={{
                      minWidth: 620,
                      background: 'rgba(10,15,23,0.97)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      rotateX,
                      rotateY,
                      transformPerspective: 1200,
                    }}
                  >
                    <div
                      className="h-[3px] w-full"
                      style={{
                        background: 'linear-gradient(90deg, #4fae8c, #f5b90f, #e41959, #4c96d1, #7d2a72, #4fae8c)',
                        backgroundSize: '200% 100%',
                        animation: 'menuGlow 4s linear infinite',
                      }}
                    />
                    <div className="flex gap-8 p-6">
                      {t.nav.bardageMenu.map((cat, ci) => {
                        const Icon = CATEGORY_ICONS[ci % CATEGORY_ICONS.length];
                        return (
                          <motion.div
                            key={cat.category}
                            className="min-w-[140px]"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: ci * 0.06 }}
                          >
                            <div className="flex items-center gap-1.5 mb-3">
                              <span
                                className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                                style={{ background: `${cat.color}22`, color: cat.color }}
                              >
                                <Icon size={12} />
                              </span>
                              <span
                                className="text-xs uppercase tracking-wide font-semibold whitespace-nowrap"
                                style={{ color: cat.color }}
                              >
                                {cat.category}
                              </span>
                            </div>
                            <div className="flex flex-col gap-1">
                              {cat.items.map((item, ii) => (
                                <motion.div
                                  key={item.label}
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.25, delay: ci * 0.06 + ii * 0.04 + 0.05 }}
                                >
                                  <Link
                                    to={item.to}
                                    onClick={() => setMenuOpen(false)}
                                    className="group flex items-center gap-2 text-white/80 hover:text-white text-sm transition-all py-1.5 px-2 -mx-2 rounded-lg hover:bg-white/5 hover:translate-x-0.5 whitespace-nowrap"
                                  >
                                    <BrandLogoChip label={item.label} />
                                    {item.label}
                                  </Link>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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

      <div className="flex items-center gap-3 z-50">
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

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden fixed inset-0 top-0 bg-void z-[99] flex flex-col items-stretch gap-3 overflow-y-auto px-6 pt-24 pb-12"
          >
            {t.nav.links.map((link, li) =>
              link.href === '#marques' ? (
                <div key={link.label}>
                  <button
                    type="button"
                    onClick={() => setMobileBardageOpen((v) => !v)}
                    aria-expanded={mobileBardageOpen}
                    className="flex items-center justify-between w-full text-white text-2xl font-medium py-3"
                  >
                    {link.label}
                    <ChevronDown
                      size={22}
                      className={`transition-transform duration-300 text-white/50 ${mobileBardageOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {mobileBardageOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-3 pb-3">
                          {t.nav.bardageMenu.map((cat, ci) => {
                            const Icon = CATEGORY_ICONS[ci % CATEGORY_ICONS.length];
                            return (
                              <motion.div
                                key={cat.category}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: ci * 0.05 }}
                                className="rounded-2xl bg-white/5 p-4"
                                style={{ borderLeft: `2px solid ${cat.color}` }}
                              >
                                <div className="flex items-center gap-1.5 mb-3">
                                  <span
                                    className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                                    style={{ background: `${cat.color}22`, color: cat.color }}
                                  >
                                    <Icon size={12} />
                                  </span>
                                  <span className="text-xs uppercase tracking-wide font-semibold" style={{ color: cat.color }}>
                                    {cat.category}
                                  </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                  {cat.items.map((item) => (
                                    <Link
                                      key={item.label}
                                      to={item.to}
                                      className="flex items-center gap-2.5 text-white/85 text-base py-2 active:scale-95 transition-transform"
                                      onClick={() => {
                                        setOpen(false);
                                        setMobileBardageOpen(false);
                                      }}
                                    >
                                      <BrandLogoChip label={item.label} />
                                      <span className="flex-1">{item.label}</span>
                                      <ChevronRight size={15} className="text-white/30" />
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {li < t.nav.links.length - 1 && <div className="h-px bg-white/10" />}
                </div>
              ) : (
                <div key={link.label}>
                  <Link
                    to={onHome ? link.href : `/${link.href}`}
                    className="block text-white text-2xl font-medium py-3"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                  {li < t.nav.links.length - 1 && <div className="h-px bg-white/10" />}
                </div>
              ),
            )}
            <Link
              to={onHome ? '#contact' : '/#contact'}
              className="mt-4 bg-crimson text-white text-center text-base font-semibold px-8 py-3.5 rounded-full active:scale-95 transition-transform"
              onClick={() => setOpen(false)}
            >
              {t.hero.cta}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
