import { NotFoundError, ValidationError } from '../../domain/errors.js';
export const errorMiddleware = (error, _req, res, _next) => {
  if (error instanceof ValidationError) return res.status(400).json({ error: error.message });
  if (error instanceof NotFoundError) return res.status(404).json({ error: error.message });
  console.error(error);
  return res.status(500).json({ error: 'Error interno del servidor' });
};
