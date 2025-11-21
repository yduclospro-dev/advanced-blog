import { HttpError } from '@domain/errors/HttpError.ts';

export class ForbiddenError extends HttpError {
  constructor(message: string = 'Accès interdit') {
    super(message, 403);
  }
}
