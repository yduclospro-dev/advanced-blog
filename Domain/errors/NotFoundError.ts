import { HttpError } from '@domain/errors/HttpError';

export class NotFoundError extends HttpError {
  constructor(message: string = 'Ressource non trouvée') {
    super(message, 404);
  }
}
