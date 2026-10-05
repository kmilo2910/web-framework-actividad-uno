import fs from 'node:fs';
import path from 'node:path';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

export function createFirebaseAuthAdapter() {
  const accountPath = path.resolve(
    process.cwd(),
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './secrets/firebase-service-account.json'
  );
  if (!fs.existsSync(accountPath)) return null;
  const app =
    getApps()[0] ||
    initializeApp({ credential: cert(JSON.parse(fs.readFileSync(accountPath, 'utf8'))) });
  return { verifyToken: (token) => getAuth(app).verifyIdToken(token) };
}
