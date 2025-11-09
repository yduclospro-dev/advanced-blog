// Load .env.test if present, otherwise use default .env
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import dotenv from 'dotenv';

const testEnv = resolve(process.cwd(), '.env.test');
if (existsSync(testEnv)) {
  // Parse and assign env variables without dotenv's debug/logs
  const parsed = dotenv.parse(readFileSync(testEnv));
  for (const k of Object.keys(parsed)) {
    process.env[k] = parsed[k];
  }
} else {
  // Load default .env silently
  const envPath = resolve(process.cwd(), '.env');
  if (existsSync(envPath)) {
    const parsed = dotenv.parse(readFileSync(envPath));
    for (const k of Object.keys(parsed)) {
      if (typeof process.env[k] === 'undefined') process.env[k] = parsed[k];
    }
  }
}
