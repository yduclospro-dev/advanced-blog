import { HttpError } from '@domain/errors/HttpError';

export class ForbiddenError extends HttpError {
  constructor(message: string = 'Accès interdit') {
    super(message, 403);
  }
}
