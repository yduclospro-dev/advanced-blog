import { execSync } from 'child_process';

const cwd = process.cwd();
const maxRetries = 20;
let attempt = 0;
let ready = false;

export default async function globalSetup() {
  // We expect the environment that runs tests (CI or developer) to start Docker.
  // Here we only attempt to reset the database (apply migrations) with retries so
  // tests fail fast and predictable if the DB is not available.
  while (attempt < maxRetries && !ready) {
    try {
      console.log('Running prisma migrate reset (attempt ' + (attempt + 1) + ')');
      execSync('npm run db:test:reset', { stdio: 'inherit', cwd });
      ready = true;
    } catch {
      attempt++;
      console.log('Waiting for Postgres to be ready...');
      // sleep 1s
      await new Promise((res) => setTimeout(res, 1000));
    }
  }

  if (!ready) {
    throw new Error('Test DB did not become ready in time');
  }

  console.log('Global setup complete (ts).');
}
