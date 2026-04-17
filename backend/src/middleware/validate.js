import { validationResult } from 'express-validator';

export function handleValidation(req, _res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Hay datos inválidos en la solicitud.');
    error.status = 422;
    error.details = errors.array();
    return next(error);
  }
  next();
}
