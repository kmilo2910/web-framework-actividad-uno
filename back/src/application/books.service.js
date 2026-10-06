import { NotFoundError, ValidationError } from '../domain/errors.js';
import { Buffer } from 'node:buffer';
export class BooksService {
  constructor(bookRepository) {
    this.bookRepository = bookRepository;
  }
  list(filters) {
    return this.bookRepository
      .findAll(filters)
      .then((books) => books.map((book) => this.toPublicBook(book)));
  }
  async getById(id) {
    const book = await this.bookRepository.findById(id);
    if (!book) throw new NotFoundError('Libro o revista no encontrado');
    return this.toPublicBook(book);
  }
  bestsellers() {
    return this.bookRepository
      .findBestSellers(10)
      .then((books) => books.map((book) => this.toPublicBook(book)));
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
  toPublicBook(book) {
    const publicBook = { ...book };
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
