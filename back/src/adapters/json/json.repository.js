import { newId, readDb, writeDb } from '../../db.js';
export class JsonRepository {
  constructor(collection, prefix) { this.collection = collection; this.prefix = prefix; }
  async findAll(filters = {}) { const db = await readDb(); let rows = db[this.collection] || []; for (const [key, value] of Object.entries(filters)) if (value !== undefined && value !== '') rows = rows.filter((row) => String(row[key]) === String(value)); return rows; }
  async findById(id) { return (await this.findAll()).find((row) => row.id === id); }
  async findByEmail(email) { return (await this.findAll()).find((row) => row.email === email); }
  async create(data) { const db = await readDb(); const row = { id: newId(this.prefix), ...data, createdAt: new Date().toISOString() }; db[this.collection] ||= []; db[this.collection].push(row); await writeDb(db); return row; }
  async update(id, data) { const db = await readDb(); const index = (db[this.collection] || []).findIndex((row) => row.id === id); db[this.collection][index] = { ...db[this.collection][index], ...data, id, updatedAt: new Date().toISOString() }; await writeDb(db); return db[this.collection][index]; }
  async remove(id) { const db = await readDb(); db[this.collection] = (db[this.collection] || []).filter((row) => row.id !== id); await writeDb(db); }
}
export class JsonBookRepository extends JsonRepository { constructor() { super('books', 'book'); } async findBestSellers(limit) { return [...await this.findAll()].sort((a, b) => b.soldLastWeeks - a.soldLastWeeks).slice(0, limit); } }
