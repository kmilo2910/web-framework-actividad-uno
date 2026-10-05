import { NotFoundError } from '../domain/errors.js';
export class CrudService {
  constructor(repository) { this.repository = repository; }
  list(filters) { return this.repository.findAll(filters); }
  async getById(id) { const item = await this.repository.findById(id); if (!item) throw new NotFoundError(); return item; }
  create(data) { return this.repository.create(data); }
  async update(id, data) { await this.getById(id); return this.repository.update(id, data); }
  async remove(id) { await this.getById(id); return this.repository.remove(id); }
}
