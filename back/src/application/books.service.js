import { NotFoundError, ValidationError } from '../domain/errors.js';
export class BooksService {
  constructor(bookRepository) {
    this.bookRepository = bookRepository;
  }
  list(filters) {
    return this.bookRepository.findAll(filters);
  }
  async getById(id) {
    const book = await this.bookRepository.findById(id);
    if (!book) throw new NotFoundError('Libro o revista no encontrado');
    return book;
  }
  bestsellers() {
    return this.bookRepository.findBestSellers(10);
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
