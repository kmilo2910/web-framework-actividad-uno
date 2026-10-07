import { newId } from '../../db.js';

export class PostgresRepository {
  constructor(pool, collection, prefix) {
    this.pool = pool;
    this.collection = collection;
    this.prefix = prefix;
  }

  async findAll(filters = {}) {
    const values = [this.collection];
    const clauses = ['collection = $1'];
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== '') {
        values.push(key, String(value));
        clauses.push(`data ->> $${values.length - 1} = $${values.length}`);
      }
    }
    const result = await this.pool.query(
      `SELECT data FROM nexus_records WHERE ${clauses.join(' AND ')} ORDER BY created_at ASC`,
      values
    );
    return result.rows.map(({ data }) => data);
  }

  async findById(id) {
    const result = await this.pool.query(
      'SELECT data FROM nexus_records WHERE collection = $1 AND id = $2',
      [this.collection, id]
    );
    return result.rows[0]?.data;
  }

  async findByEmail(email) {
    const result = await this.pool.query(
      `SELECT data FROM nexus_records WHERE collection = $1 AND data ->> 'email' = $2 LIMIT 1`,
      [this.collection, email]
    );
    return result.rows[0]?.data;
  }

  async create(data) {
    const row = { id: data.id || newId(this.prefix), ...data, createdAt: data.createdAt || new Date().toISOString() };
    await this.pool.query(
      `INSERT INTO nexus_records (collection, id, data, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [this.collection, row.id, row, row.createdAt]
    );
    return row;
  }

  async update(id, data) {
    const current = await this.findById(id);
    if (!current) return undefined;
    const row = { ...current, ...data, id, updatedAt: new Date().toISOString() };
    await this.pool.query(
      `UPDATE nexus_records SET data = $3, updated_at = NOW()
       WHERE collection = $1 AND id = $2`,
      [this.collection, id, row]
    );
    return row;
  }

  async remove(id) {
    await this.pool.query('DELETE FROM nexus_records WHERE collection = $1 AND id = $2', [
      this.collection,
      id,
    ]);
  }
}

export class PostgresBookRepository extends PostgresRepository {
  async findBestSellers(limit) {
    const result = await this.pool.query(
      `SELECT data FROM nexus_records
       WHERE collection = $1
       ORDER BY COALESCE((data ->> 'soldLastWeeks')::int, 0) DESC
       LIMIT $2`,
      [this.collection, limit]
    );
    return result.rows.map(({ data }) => data);
  }
}
