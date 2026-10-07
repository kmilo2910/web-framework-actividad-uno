import { Router } from 'express';
export function reservationRoutes(service, authMiddleware) {
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
      res.status(201).json(
        await service.reserve({
          userEmail: req.authUser.email,
          spaceId: req.body.spaceId,
          durationMinutes: req.body.durationMinutes,
          reservationDate: req.body.reservationDate,
          reservationTime: req.body.reservationTime,
        })
      );
    } catch (error) {
      next(error);
    }
  });
  router.patch('/:id/cancel', authMiddleware, async (req, res, next) => {
    try {
      res.json(
        await service.cancel({ userEmail: req.authUser.email, reservationId: req.params.id })
      );
    } catch (error) {
      next(error);
    }
  });
  return router;
}
