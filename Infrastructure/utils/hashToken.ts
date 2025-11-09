import crypto from 'crypto';

const SECRET = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET || 'fallback_secret_for_dev';

export function hashToken(token: string): string {
  return crypto.createHmac('sha256', SECRET).update(token).digest('hex');
}

export function generateRandomToken(): string {
  return crypto.randomUUID();
}
