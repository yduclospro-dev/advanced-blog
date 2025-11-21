import { HttpError } from '@domain/errors/HttpError.ts';

export class UnauthorizedError extends HttpError {
  constructor(message: string = 'Non autorisé') {
    super(message, 401);
  }
}
