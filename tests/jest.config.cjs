module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/api/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  // Load env variables before anything else
  setupFiles: ['<rootDir>/tests/loadEnv.ts'],
  // Setup after environment (e.g. jest-dom)
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // Start/stop test DB and run migrations
  globalSetup: '<rootDir>/tests/setupGlobal.ts',
  globalTeardown: '<rootDir>/tests/globalTeardown.ts',
  verbose: true,
};
