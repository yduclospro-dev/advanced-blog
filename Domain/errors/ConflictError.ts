import { HttpError } from '@domain/errors/HttpError.ts';

export class ConflictError extends HttpError {
  constructor(message: string = 'Conflit avec une ressource existante') {
    super(message, 409);
  }
}
