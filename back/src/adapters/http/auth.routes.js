import { Router } from 'express';
import { makeAuthMiddleware } from './auth.middleware.js';

export function authRoutes({ authService, firebaseAuth, frontendUrl }) {
  const router = Router();
  const requireAuth = makeAuthMiddleware(firebaseAuth);
  router.get('/config', (_req, res) =>
    res.json({ firebaseConfigured: Boolean(firebaseAuth), frontendUrl })
  );
  router.get('/me', requireAuth, async (req, res, next) => {
    try {
      res.json(await authService.findOrCreateGoogleUser(req.firebaseUser));
    } catch (error) {
      next(error);
    }
  });
  router.post('/logout', (_req, res) => res.status(204).send());
  return router;
}
