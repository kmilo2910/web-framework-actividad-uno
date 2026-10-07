import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPostgresPool, ensurePostgresSchema } from '../adapters/postgres/postgres.client.js';
import { PostgresRepository } from '../adapters/postgres/postgres.repository.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const seedPath = path.join(root, 'data/seed.json');
const collections = ['books', 'users', 'purchases', 'spaces', 'reservations'];

const pool = createPostgresPool();
const seed = JSON.parse(await fs.readFile(seedPath, 'utf8'));
await ensurePostgresSchema(pool);

for (const collection of collections) {
  const repository = new PostgresRepository(pool, collection, collection.slice(0, -1));
  const existing = await repository.findAll();
  if (!existing.length) {
    for (const row of seed[collection] || []) await repository.create(row);
    console.log(`Migrados ${seed[collection]?.length || 0} registros de ${collection}`);
  } else {
    if (collection === 'books') {
      for (const row of seed.books || []) {
        const current = await repository.findById(row.id);
        if (!current) {
          await repository.create(row);
          console.log(`Agregado ${row.id} a books`);
          continue;
        }
        if (row.coverUrl && !current.coverUrl)
          await repository.update(row.id, { coverUrl: row.coverUrl });
      }
    }
    console.log(`Omitida ${collection}: ya contiene ${existing.length} registros`);
  }
}

await pool.end();
