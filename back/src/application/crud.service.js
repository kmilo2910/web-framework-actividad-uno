import { NotFoundError } from '../domain/errors.js';
import { normalizeLanguage, withoutLanguage } from '../i18n/languages.js';
import { localizeRecord } from '../i18n/localize.js';
export class CrudService {
  constructor(repository, localizedFields = [], translations = {}) {
    this.repository = repository;
    this.localizedFields = localizedFields;
    this.translations = translations;
  }
  list(filters = {}) {
    const language = this.getLanguage(filters);
    return this.repository
      .findAll(withoutLanguage(filters))
      .then((rows) => rows.map((row) => this.localize(row, language)));
  }

  getLanguage(filters = {}) {
    return normalizeLanguage(filters.lang);
  }
  async getById(id, requestedLanguage) {
    const item = await this.repository.findById(id);
    if (!item) throw new NotFoundError();
    return this.localize(item, requestedLanguage);
  }
  localize(row, language) {
    return localizeRecord(
      { ...row, translations: { ...this.translations[row.id], ...row.translations } },
      language,
      this.localizedFields
    );
  }
  create(data) {
    return this.repository.create(data);
  }
  async update(id, data) {
    await this.getById(id);
    return this.repository.update(id, data);
  }
  async remove(id) {
    await this.getById(id);
    return this.repository.remove(id);
  }
}
