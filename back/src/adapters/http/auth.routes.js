import { Router } from 'express';
import { makeAuthMiddleware } from './auth.middleware.js';

export function authRoutes({ authService, authProvider, frontendUrl }) {
  const router = Router();
  const requireAuth = makeAuthMiddleware(authProvider);
  router.get('/config', (_req, res) =>
    res.json({ auth0Configured: Boolean(authProvider), frontendUrl })
  );
  router.get('/me', requireAuth, async (req, res, next) => {
    try {
      res.json(await authService.findOrCreateGoogleUser(req.authUser));
    } catch (error) {
      next(error);
    }
  });
  router.post('/logout', (_req, res) => res.status(204).send());
  return router;
}
