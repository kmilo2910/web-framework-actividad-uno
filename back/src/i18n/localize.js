import { DEFAULT_LANGUAGE, normalizeLanguage } from './languages.js';

export function localizeRecord(record, requestedLanguage, fields = []) {
  const language = normalizeLanguage(requestedLanguage);
  const translation = record.translations?.[language] || record.translations?.[DEFAULT_LANGUAGE];
  if (!translation) return { ...record };

  const localized = { ...record };
  for (const field of fields) {
    if (translation[field] !== undefined) localized[field] = translation[field];
  }
  delete localized.translations;
  return localized;
}
