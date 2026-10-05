import { Router } from 'express';

export function authRoutes({ authService, firebaseAuth, frontendUrl }) {
  const router = Router();
  const requireAuth = async (req, res, next) => {
    try {
      if (!firebaseAuth)
        return res.status(503).json({ error: 'Firebase Admin no está configurado en el backend' });
      const header = req.headers.authorization || '';
      if (!header.startsWith('Bearer '))
        return res.status(401).json({ error: 'Token de autenticación requerido' });
      req.firebaseUser = await firebaseAuth.verifyToken(header.slice(7));
      next();
    } catch (_error) {
      res.status(401).json({ error: 'Token inválido o expirado' });
    }
  };
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
