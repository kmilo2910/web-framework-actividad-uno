import pg from 'pg';

const { Pool } = pg;

export function createPostgresPool() {
  return new Pool({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT || 5432),
    database: process.env.POSTGRES_DATABASE || 'postgres',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD,
    max: Number(process.env.POSTGRES_POOL_MAX || 10),
  });
}

export async function ensurePostgresSchema(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS nexus_records (
      collection TEXT NOT NULL,
      id TEXT NOT NULL,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (collection, id)
    );
    CREATE INDEX IF NOT EXISTS nexus_records_collection_idx ON nexus_records(collection);
    CREATE INDEX IF NOT EXISTS nexus_records_data_idx ON nexus_records USING GIN(data);
  `);
}
