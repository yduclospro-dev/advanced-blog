import { HttpError } from '@domain/errors/HttpError';

export class UnauthorizedError extends HttpError {
  constructor(message: string = 'Non autorisé') {
    super(message, 401);
  }
}
