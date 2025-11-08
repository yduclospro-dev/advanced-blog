import { HttpError } from './HttpError.ts';

export class NotFoundError extends HttpError {
  constructor(message: string = 'Ressource non trouvée') {
    super(message, 404);
  }
}
