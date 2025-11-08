import type { Request, Response, NextFunction } from 'express';
import { HttpError } from '../../Domain/errors/index.ts';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  console.error('Error:', error);

  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({
      message: error.message,
      statusCode: error.statusCode
    });
  }

  return res.status(500).json({
    message: 'Erreur interne du serveur',
    statusCode: 500
  });
}
