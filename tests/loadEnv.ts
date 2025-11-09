import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load .env.test if present, otherwise .env — silently via dotenv.parse
const testEnv = path.resolve(process.cwd(), '.env.test');
if (fs.existsSync(testEnv)) {
  const parsed = dotenv.parse(fs.readFileSync(testEnv));
  Object.keys(parsed).forEach((k) => { process.env[k] = parsed[k]; });
} else {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const parsed = dotenv.parse(fs.readFileSync(envPath));
    Object.keys(parsed).forEach((k) => { if (typeof process.env[k] === 'undefined') process.env[k] = parsed[k]; });
  }
}

export {};
