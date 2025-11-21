import type { Request, Response, NextFunction } from 'express';
import { sendApiResponse } from '@webapi/utils/response';

export function ensureNotAuthenticated(req: Request, res: Response, next: NextFunction) {
  // Vérifie la présence d'un token d'authentification (header ou cookie)
  const authHeader = req.headers.authorization;
  const hasBearer = authHeader && authHeader.startsWith('Bearer ');
  const hasCookie = req.cookies && req.cookies.refresh_token;

  if (hasBearer || hasCookie) {
    return sendApiResponse(res, {
      success: false,
      message: 'Déjà connecté. Déconnectez-vous pour accéder à cette fonctionnalité.',
      result: null,
      statusCode: 400
    });
  }
  next();
}
