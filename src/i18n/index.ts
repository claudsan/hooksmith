import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ptBR } from './locales/ptBR';
import { enUS } from './locales/enUS';
import { esES } from './locales/esES';

export type SupportedLanguage = 'pt-BR' | 'en-US' | 'es-ES';

export const LANGUAGE_STORAGE_KEY = 'hooksmith_language';

const getInitialLanguage = (): SupportedLanguage => {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === 'pt-BR' || saved === 'en-US' || saved === 'es-ES') {
      return saved;
    }
    const nav = navigator.language.toLowerCase();
    if (nav.startsWith('pt')) {
      return 'pt-BR';
    }
    if (nav.startsWith('es')) {
      return 'es-ES';
    }
    if (nav.startsWith('en')) {
      return 'en-US';
    }
  } catch {
    // Fallback silencioso
  }
  return 'pt-BR';
};

export const defaultNS = 'translation';
export const resources = {
  'pt-BR': {
    translation: ptBR,
  },
  'en-US': {
    translation: enUS,
  },
  'es-ES': {
    translation: esES,
  },
} as const;

void i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'pt-BR',
    interpolation: {
      escapeValue: false, // React já protege contra XSS
    },
    defaultNS,
  });

export function changeLanguage(lang: SupportedLanguage) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {
    // Ignora
  }
  return i18n.changeLanguage(lang);
}

export function getCurrentLanguage(): SupportedLanguage {
  const current = i18n.language;
  if (current === 'es-ES') return 'es-ES';
  if (current === 'en-US') return 'en-US';
  return 'pt-BR';
}

export default i18n;
