import type { Request, Response, NextFunction } from 'express';
import { HttpError } from '@domain/errors/index.ts';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Avoid noisy logs during test runs
  const isTest = process.env.NODE_ENV === 'test' || typeof process.env.JEST_WORKER_ID !== 'undefined';
  if (!isTest) {
    console.error('Error:', error);
  }

  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({
      message: error.message,
      statusCode: error.statusCode
    });
  }

  void next;

  return res.status(500).json({
    message: 'Erreur interne du serveur',
    statusCode: 500
  });
}
