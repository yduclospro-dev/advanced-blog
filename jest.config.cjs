module.exports = {
  rootDir: process.cwd(),
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/api/**/*.test.ts'],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/Application/$1',
    '^@domain/(.*)$': '<rootDir>/Domain/$1',
    '^@infra/(.*)$': '<rootDir>/Infrastructure/$1',
    '^@webapi/(.*)$': '<rootDir>/WebApi/$1',
    '^@root/(.*)$': '<rootDir>/$1'
  },
  setupFiles: ['<rootDir>/tests/loadEnv.ts', 'tsconfig-paths/register'],
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.node.ts'],
  globalSetup: '<rootDir>/tests/setupGlobal.ts',
  globalTeardown: '<rootDir>/tests/globalTeardown.ts',
  verbose: true
};