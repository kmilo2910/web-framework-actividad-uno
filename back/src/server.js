import 'dotenv/config';
import { createApp } from './app.js';
import { createPostgresPool, ensurePostgresSchema } from './adapters/postgres/postgres.client.js';
const port = process.env.PORT || 4000;
const start = async () => {
  if (process.env.PERSISTENCE === 'postgres') {
    const pool = createPostgresPool();
    await ensurePostgresSchema(pool);
    await pool.end();
  }
  createApp().listen(port, () => console.log(`Nexus API escuchando en http://localhost:${port}`));
};
start().catch((error) => {
  console.error('No se pudo iniciar la API', error);
  process.exitCode = 1;
});
