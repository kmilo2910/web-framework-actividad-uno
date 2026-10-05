import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'data');
const dbFile = path.join(dataDir, 'db.json');
const seedFile = path.join(dataDir, 'seed.json');

export async function readDb() {
  try { return JSON.parse(await fs.readFile(dbFile, 'utf8')); }
  catch { const seed = JSON.parse(await fs.readFile(seedFile, 'utf8')); await writeDb(seed); return seed; }
}

export async function writeDb(db) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dbFile, JSON.stringify(db, null, 2));
  return db;
}

export const newId = (prefix) => `${prefix}-${crypto.randomUUID()}`;
