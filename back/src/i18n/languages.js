export const SUPPORTED_LANGUAGES = ['es', 'en', 'fr', 'it', 'de'];
export const DEFAULT_LANGUAGE = 'es';

export function normalizeLanguage(value) {
  const language = String(value || DEFAULT_LANGUAGE)
    .toLowerCase()
    .split('-')[0];
  return SUPPORTED_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE;
}

export function withoutLanguage(filters = {}) {
  const rest = { ...filters };
  delete rest.lang;
  return rest;
}
