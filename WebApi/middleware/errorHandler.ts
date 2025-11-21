import type { Request, Response, NextFunction } from 'express';
import { HttpError } from '@domain/errors';
import { sendApiResponse } from '@webapi/utils/response';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof HttpError) {
    return sendApiResponse(res, {
      success: false,
      message: error.message,
      result: null,
      statusCode: error.statusCode
    });
  }

  void next;

  return sendApiResponse(res, {
    success: false,
    message: 'Erreur interne du serveur',
    result: null,
    statusCode: 500
  });
}
