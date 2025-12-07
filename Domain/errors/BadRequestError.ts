import { HttpError } from '@domain/errors/HttpError';

export class BadRequestError extends HttpError {
  constructor(message: string = 'Requête invalide') {
    super(message, 400);
  }
}
