import express from 'express';
import cors from 'cors';
import { JsonBookRepository, JsonRepository } from './adapters/json/json.repository.js';
import { makeBookController, makeCrudController } from './adapters/http/controllers.js';
import { resourceRoutes } from './adapters/http/routes.js';
import { errorMiddleware } from './adapters/http/error.middleware.js';
import { BooksService } from './application/books.service.js';
import { CrudService } from './application/crud.service.js';
import { AuthService } from './application/auth.service.js';
import { authRoutes } from './adapters/http/auth.routes.js';
import { createFirebaseAuthAdapter } from './adapters/firebase/firebase-admin.adapter.js';

export function createApp() {
  const app = express();
  app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
  app.use(express.json());
  const userRepository = new JsonRepository('users', 'user');
  const authService = new AuthService(userRepository);
  const firebaseAuth = createFirebaseAuthAdapter();
  app.use('/api/auth', authRoutes({ authService, firebaseAuth, frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000' }));
  const books = makeBookController(new BooksService(new JsonBookRepository()));
  app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'nexus-backend' }));
  app.get('/api/books/bestsellers/top', books.bestsellers);
  app.use('/api/books', resourceRoutes(books));
  for (const [path, collection, prefix] of [['users', 'users', 'user'], ['spaces', 'spaces', 'space'], ['purchases', 'purchases', 'purchase'], ['reservations', 'reservations', 'reservation']]) {
    const controller = makeCrudController(new CrudService(new JsonRepository(collection, prefix)));
    app.use(`/api/${path}`, resourceRoutes(controller));
  }
  app.use(errorMiddleware);
  return app;
}
