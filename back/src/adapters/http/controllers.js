import { Buffer } from 'node:buffer';

export const makeCrudController = (service) => ({
  list: async (req, res, next) => {
    try {
      res.json(await service.list(req.query));
    } catch (error) {
      next(error);
    }
  },
  get: async (req, res, next) => {
    try {
      res.json(await service.getById(req.params.id));
    } catch (error) {
      next(error);
    }
  },
  create: async (req, res, next) => {
    try {
      res.status(201).json(await service.create(req.body));
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      res.json(await service.update(req.params.id, req.body));
    } catch (error) {
      next(error);
    }
  },
  remove: async (req, res, next) => {
    try {
      await service.remove(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
});
export const makeBookController = (service) => ({
  ...makeCrudController(service),
  bestsellers: async (_req, res, next) => {
    try {
      res.json(await service.bestsellers());
    } catch (error) {
      next(error);
    }
  },
  cover: async (req, res, next) => {
    try {
      const { data, mimeType } = await service.getCover(req.params.id);
      res.type(mimeType).send(Buffer.from(data, 'base64'));
    } catch (error) {
      next(error);
    }
  },
});
