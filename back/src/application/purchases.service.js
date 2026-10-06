import { NotFoundError, ValidationError } from '../domain/errors.js';
export class PurchasesService {
  constructor(purchaseRepository, bookRepository, userRepository) {
    this.purchaseRepository = purchaseRepository;
    this.bookRepository = bookRepository;
    this.userRepository = userRepository;
  }
  async purchase({ userEmail, bookId }) {
    const user = await this.userRepository.findByEmail(userEmail);
    const book = await this.bookRepository.findById(bookId);
    if (!user) throw new NotFoundError('Usuario no encontrado');
    if (!book) throw new NotFoundError('Libro o revista no encontrado');
    if (book.stock < 1) throw new ValidationError('El producto no tiene stock disponible');
    const existing = await this.purchaseRepository.findAll({ userId: user.id, bookId });
    if (existing.length) throw new ValidationError('Ya has adquirido esta publicación');
    await this.bookRepository.update(book.id, { stock: book.stock - 1 });
    return this.purchaseRepository.create({
      userId: user.id,
      bookId,
      price: book.price,
      purchasedAt: new Date().toISOString(),
    });
  }
  async listForUser(userEmail) {
    const user = await this.userRepository.findByEmail(userEmail);
    return user ? this.purchaseRepository.findAll({ userId: user.id }) : [];
  }
}
