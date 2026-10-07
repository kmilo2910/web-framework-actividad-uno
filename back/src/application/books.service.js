import { NotFoundError, ValidationError } from '../domain/errors.js';
import { Buffer } from 'node:buffer';
import { normalizeLanguage, withoutLanguage } from '../i18n/languages.js';
import { localizeRecord } from '../i18n/localize.js';
import { bookTranslations } from '../i18n/book-translations.js';
import { bookTranslationsExtra } from '../i18n/book-translations-extra.js';
import { categoryTranslations } from '../i18n/category-translations.js';
import { bookTranslationsCatalog } from '../i18n/book-translations-catalog.js';
export class BooksService {
  constructor(bookRepository) {
    this.bookRepository = bookRepository;
  }
  list(filters) {
    const language = normalizeLanguage(filters?.lang);
    return this.bookRepository
      .findAll(withoutLanguage(filters))
      .then((books) => books.map((book) => this.toPublicBook(book, language)));
  }
  async getById(id, language) {
    const book = await this.bookRepository.findById(id);
    if (!book) throw new NotFoundError('Libro o revista no encontrado');
    return this.toPublicBook(book, language);
  }
  bestsellers(language) {
    return this.bookRepository
      .findBestSellers(10)
      .then((books) => books.map((book) => this.toPublicBook(book, language)));
  }
  async getCover(id) {
    const book = await this.bookRepository.findById(id);
    if (!book) throw new NotFoundError('Libro o revista no encontrado');
    if (book.coverData && book.coverMimeType) {
      return { data: book.coverData, mimeType: book.coverMimeType };
    }
    if (!book.coverUrl) throw new NotFoundError('Portada no disponible');
    const response = await globalThis.fetch(book.coverUrl);
    if (!response.ok) throw new NotFoundError('No se pudo obtener la portada');
    const mimeType = response.headers.get('content-type') || 'image/jpeg';
    const data = Buffer.from(await response.arrayBuffer()).toString('base64');
    await this.bookRepository.update(id, { coverData: data, coverMimeType: mimeType });
    return { data, mimeType };
  }
  toPublicBook(book, language) {
    const localizedSource = {
      ...book,
      translations: {
        ...bookTranslationsCatalog[book.id],
        ...bookTranslationsExtra[book.id],
        ...bookTranslations[book.id],
        ...book.translations,
      },
    };
    const publicBook = localizeRecord(localizedSource, language, [
      'title',
      'author',
      'shortDescription',
      'longDescription',
      'category',
    ]);
    const category = categoryTranslations[book.category];
    if (category) publicBook.category = category[language] || category.es;
    delete publicBook.coverData;
    delete publicBook.coverMimeType;
    return publicBook;
  }
  create(data) {
    if (!data.title || !data.author) throw new ValidationError('title y author son obligatorios');
    return this.bookRepository.create({ ...data, type: data.type || 'book' });
  }
  async update(id, data) {
    await this.getById(id);
    return this.bookRepository.update(id, data);
  }
  async remove(id) {
    await this.getById(id);
    return this.bookRepository.remove(id);
  }
}
