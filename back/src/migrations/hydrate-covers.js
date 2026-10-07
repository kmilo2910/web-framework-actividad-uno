import 'dotenv/config';
import https from 'node:https';
import { createPostgresPool } from '../adapters/postgres/postgres.client.js';

const covers = {
  'book-1': 'https://images-na.ssl-images-amazon.com/images/P/0132350882.01.LZZZZZZZ.jpg',
  'book-2': 'https://images-na.ssl-images-amazon.com/images/P/1593279507.01.LZZZZZZZ.jpg',
  'book-3': 'https://images-na.ssl-images-amazon.com/images/P/0135957052.01.LZZZZZZZ.jpg',
  'book-4': 'https://images-na.ssl-images-amazon.com/images/P/1857150031.01.LZZZZZZZ.jpg',
  'book-5': 'https://images-na.ssl-images-amazon.com/images/P/1449373321.01.LZZZZZZZ.jpg',
  'book-6': 'https://images-na.ssl-images-amazon.com/images/P/0134757599.01.LZZZZZZZ.jpg',
  'book-7': 'https://images.squarespace-cdn.com/content/v1/5e0129c5956b7a5624566864/1591301114319-ANPBYF2U0DCFBVY5RUSU/ydkjsy-get-started.png',
  'book-8': 'https://images-na.ssl-images-amazon.com/images/P/0137081073.01.LZZZZZZZ.jpg',
  'book-9': 'https://images-na.ssl-images-amazon.com/images/P/0321127420.01.LZZZZZZZ.jpg',
  'book-10': 'https://images-na.ssl-images-amazon.com/images/P/0321125215.01.LZZZZZZZ.jpg',
  'book-11': 'https://images-na.ssl-images-amazon.com/images/P/0465050654.01.LZZZZZZZ.jpg',
  'book-12': 'https://images-na.ssl-images-amazon.com/images/P/0062316095.01.LZZZZZZZ.jpg',
  'book-13': 'https://images-na.ssl-images-amazon.com/images/P/0307474720.01.LZZZZZZZ.jpg',
  'book-14': 'https://images-na.ssl-images-amazon.com/images/P/0156012197.01.LZZZZZZZ.jpg',
  'book-15': 'https://images-na.ssl-images-amazon.com/images/P/0140268863.01.LZZZZZZZ.jpg',
  'mag-1': 'https://content-historia.nationalgeographic.com.es/medio/2024/12/10/covadonga_3694c1ab_241210151443_1280x1696.webp',
};

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { rejectUnauthorized: false }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location)
        return resolve(download(response.headers.location));
      if (response.statusCode !== 200) return reject(new Error(`Portada HTTP ${response.statusCode}`));
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve({ data: globalThis.Buffer.concat(chunks), mimeType: response.headers['content-type'] || 'image/jpeg' }));
    }).on('error', reject);
  });
}

const pool = createPostgresPool();
for (const [id, url] of Object.entries(covers)) {
  const cover = await download(url);
  await pool.query(
    `UPDATE nexus_records SET data = data || $2::jsonb, updated_at = NOW()
     WHERE collection = 'books' AND id = $1`,
    [
      id,
      JSON.stringify({
        coverUrl: url,
        coverData: cover.data.toString('base64'),
        coverMimeType: cover.mimeType,
      }),
    ]
  );
  console.log(`Portada almacenada para ${id}`);
}
await pool.end();
