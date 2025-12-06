import { HttpError } from "./HttpError";

export class TooManyLoginAttemptsError extends HttpError {
  constructor(message = 'Trop de tentatives de connexion. Veuillez réessayer plus tard.') {
    super(message, 429);
  }
}