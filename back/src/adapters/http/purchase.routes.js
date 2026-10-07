import { Router } from 'express';
export function purchaseRoutes(service, authMiddleware) {
  const router = Router();
  router.get('/mine', authMiddleware, async (req, res, next) => {
    try {
      res.json(await service.listForUser(req.authUser.email));
    } catch (error) {
      next(error);
    }
  });
  router.post('/', authMiddleware, async (req, res, next) => {
    try {
      res
        .status(201)
        .json(
          await service.purchase({ userEmail: req.authUser.email, bookId: req.body.bookId })
        );
    } catch (error) {
      next(error);
    }
  });
  return router;
}
