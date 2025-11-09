import { BadRequestError } from '@domain/errors';

export function validateRequiredFields(
  body: Record<string, unknown>,
  requiredFields: string[]
): void {
  const missingFields = requiredFields.filter(field => !body[field]);
  
  if (missingFields.length > 0) {
    throw new BadRequestError(`Champs requis manquants: ${missingFields.join(', ')}`);
  }
}
