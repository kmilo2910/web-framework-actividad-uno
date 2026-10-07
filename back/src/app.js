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
import { createAuth0Adapter } from './adapters/auth0/auth0.adapter.js';
import { PurchasesService } from './application/purchases.service.js';
import { purchaseRoutes } from './adapters/http/purchase.routes.js';
import { makeAuthMiddleware } from './adapters/http/auth.middleware.js';
import { ReservationsService } from './application/reservations.service.js';
import { reservationRoutes } from './adapters/http/reservation.routes.js';
import { spaceTranslations } from './i18n/space-translations.js';
import { createPostgresPool } from './adapters/postgres/postgres.client.js';
import { PostgresBookRepository, PostgresRepository } from './adapters/postgres/postgres.repository.js';

export function createApp() {
  const app = express();
  app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
  app.use(express.json());
  const usePostgres = process.env.PERSISTENCE === 'postgres';
  const pool = usePostgres ? createPostgresPool() : null;
  const repository = (collection, prefix) =>
    usePostgres
      ? new PostgresRepository(pool, collection, prefix)
      : new JsonRepository(collection, prefix);
  const userRepository = repository('users', 'user');
  const bookRepository = usePostgres
    ? new PostgresBookRepository(pool, 'books', 'book')
    : new JsonBookRepository();
  const purchaseRepository = repository('purchases', 'purchase');
  const authService = new AuthService(userRepository);
  const authProvider = createAuth0Adapter();
  const purchaseService = new PurchasesService(purchaseRepository, bookRepository, userRepository);
  const spaceRepository = repository('spaces', 'space');
  const reservationRepository = repository('reservations', 'reservation');
  const reservationsService = new ReservationsService(
    reservationRepository,
    spaceRepository,
    userRepository
  );
  app.use(
    '/api/auth',
    authRoutes({
      authService,
      authProvider,
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    })
  );
  const books = makeBookController(new BooksService(bookRepository));
  app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'nexus-backend' }));
  app.get('/api/books/bestsellers/top', books.bestsellers);
  app.get('/api/books/:id/cover', books.cover);
  app.use('/api/books', resourceRoutes(books));
  for (const [path, collection, prefix] of [
    ['users', 'users', 'user'],
    ['spaces', 'spaces', 'space'],
  ]) {
    const fields =
      path === 'spaces' ? ['name', 'shortDescription', 'longDescription', 'benefits'] : [];
    const controller = makeCrudController(
      new CrudService(
        repository(collection, prefix),
        fields,
        path === 'spaces' ? spaceTranslations : {}
      )
    );
    app.use(`/api/${path}`, resourceRoutes(controller));
  }
  app.use('/api/purchases', purchaseRoutes(purchaseService, makeAuthMiddleware(authProvider)));
  app.use(
    '/api/reservations',
    reservationRoutes(reservationsService, makeAuthMiddleware(authProvider))
  );
  app.use(errorMiddleware);
  return app;
}
