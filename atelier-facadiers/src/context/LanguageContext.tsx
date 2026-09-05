import { createContext, useContext, useState, type ReactNode } from 'react';
import { translations, type Lang } from '../i18n';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (typeof translations)['fr'];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function detectInitialLang(): Lang {
  if (typeof navigator === 'undefined') return 'fr';
  return navigator.language.toLowerCase().startsWith('en') ? 'en' : 'fr';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(detectInitialLang);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
