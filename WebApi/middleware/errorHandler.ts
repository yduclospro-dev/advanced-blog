import type { Request, Response, NextFunction } from 'express';
import { HttpError } from '../../Domain/errors/index.ts';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  // Log l'erreur pour le debugging
  console.error('Error:', error);

  // Si c'est une HttpError personnalisée, utiliser son code de statut
  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({
      error: error.message,
      statusCode: error.statusCode
    });
  }

  // Pour toutes les autres erreurs, renvoyer 500
  return res.status(500).json({
    error: 'Erreur interne du serveur',
    statusCode: 500
  });
}
