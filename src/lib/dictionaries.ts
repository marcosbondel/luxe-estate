import type { Locale } from './i18n';

// We import the dictionaries statically for simplicity, or we can lazy load them.
// Lazy loading is better for performance.
const dictionaries = {
  en: () => import('../dictionaries/en.json').then((module) => module.default),
  es: () => import('../dictionaries/es.json').then((module) => module.default),
  fr: () => import('../dictionaries/fr.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  // Fallback to default locale if not found
  if (dictionaries[locale]) {
    return dictionaries[locale]();
  }
  return dictionaries['es']();
};
