/* global process, console */

import pg from 'pg';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Falta DATABASE_URL. Configúrala antes de ejecutar el seed.');
  process.exit(1);
}

const books = [
  ['book-seed-01', 'Clean Code', 'Robert C. Martin', 2008, 34900, 'programacion'],
  ['book-seed-02', 'Eloquent JavaScript', 'Marijn Haverbeke', 2018, 29900, 'programacion'],
  [
    'book-seed-03',
    'The Pragmatic Programmer',
    'David Thomas y Andrew Hunt',
    2019,
    39900,
    'programacion',
  ],
  ['book-seed-04', 'Don Quijote de la Mancha', 'Miguel de Cervantes', 1605, 18500, 'literatura'],
  [
    'book-seed-05',
    'Designing Data-Intensive Applications',
    'Martin Kleppmann',
    2017,
    42500,
    'tecnologia',
  ],
  ['book-seed-06', 'National Geographic Historia', 'Varios autores', 2025, 9900, 'historia'],
  ['book-seed-07', 'You Don’t Know JS Yet', 'Kyle Simpson', 2020, 36900, 'programacion'],
  ['book-seed-08', 'The Design of Everyday Things', 'Don Norman', 2013, 28900, 'tecnologia'],
  ['book-seed-09', 'Refactoring', 'Martin Fowler', 2018, 45900, 'programacion'],
  ['book-seed-10', 'Sapiens', 'Yuval Noah Harari', 2015, 33900, 'historia'],
];

const spaces = [
  ['space-1', 'Sala Norte', 4, 1, 'available', 4.8],
  ['space-2', 'Sala Sur', 6, 1, 'available', 4.6],
  ['space-3', 'Mesa colaborativa', 8, 1, 'available', 4.9],
];

function record(collection, id, data) {
  return { collection, id, data, createdAt: new Date().toISOString() };
}

const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

try {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS nexus_records (
      collection TEXT NOT NULL,
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query('BEGIN');
  await pool.query(`DELETE FROM nexus_records WHERE collection IN ('books', 'spaces')`);

  for (const [id, title, author, year, price, category] of books) {
    const data = {
      id,
      title,
      author,
      year,
      price,
      category,
      type: 'book',
      stock: 10,
      soldLastWeeks: 0,
      shortDescription: `${title} para ampliar tus conocimientos y desarrollar nuevas ideas.`,
      longDescription: `${title} presenta conceptos y ejemplos útiles para estudiantes y lectores que desean profundizar en ${category}.`,
    };
    const item = record('books', id, data);
    await pool.query(
      `INSERT INTO nexus_records (collection, id, data, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [item.collection, item.id, item.data, item.createdAt]
    );
  }

  for (const [id, name, capacity, floor, status, rating] of spaces) {
    const data = {
      id,
      name,
      capacity,
      floor,
      status,
      rating,
      image: `/coworking/${id === 'space-1' ? 'sala-norte' : id === 'space-2' ? 'sala-sur' : 'mesa-colaborativa'}.png`,
      shortDescription: 'Espacio universitario equipado para estudiar y trabajar.',
      longDescription:
        'Un espacio cómodo, luminoso y preparado para sesiones individuales, reuniones y proyectos colaborativos.',
      benefits: ['Ambiente cómodo', 'Luz natural', 'Conectividad disponible'],
    };
    const item = record('spaces', id, data);
    await pool.query(
      `INSERT INTO nexus_records (collection, id, data, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [item.collection, item.id, item.data, item.createdAt]
    );
  }

  await pool.query('COMMIT');
  console.log(`Seed completado: ${books.length} libros y ${spaces.length} espacios.`);
} catch (error) {
  await pool.query('ROLLBACK');
  console.error('No fue posible ejecutar el seed:', error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
