Test commands and notes

Canonical test commands

- Run all tests (front then back):

```bash
npm test
```

- Run only frontend tests:

```bash
npm run test:front
```

- Run only backend tests (starts test DB, resets Prisma, runs tests, stops DB):

```bash
npm run test:back
```

- Watch frontend tests:

```bash
npm run test:front:watch
```

- Watch backend tests (starts test DB and runs Jest in watch mode):

```bash
npm run test:back:watch
```

Notes

- On Windows, environment variables for the watch command are set using `cross-env`. The `test:back:watch` script uses `cross-env DOTENV_CONFIG_PATH=.env.test jest --config=tests/jest.back.cjs --watchAll` to ensure compatibility.
- Backend integration tests use a Docker Compose test Postgres listening on port 5433 (configured in `docker-compose.test.yml`). The scripts `test:ci:db:start` and `test:ci:db:stop` manage the test DB lifecycle.
- The frontend Jest config and shared test setup live under the `tests/` directory. Front tests are under `tests/front`.

If you'd like I can also:
- Remove or collapse redundant npm scripts in `package.json` to only keep `test`, `test:front`, and `test:back` (I can apply this automatically if you confirm), or
- Create a small PR with these changes so you can review them in Git.
