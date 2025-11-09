import { BadRequestError } from '../../Domain/errors/index.ts';

export function validateRequiredFields(
  body: Record<string, unknown>,
  requiredFields: string[]
): void {
  const missingFields = requiredFields.filter(field => !body[field]);
  
  if (missingFields.length > 0) {
    throw new BadRequestError(`Champs requis manquants: ${missingFields.join(', ')}`);
  }
}
