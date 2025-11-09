module.exports = {
  // ensure <rootDir> resolves to repository root even when config lives in tests/
  // use process.cwd() (repository root) instead of require('path') to avoid ESM lint issues
  rootDir: process.cwd(),
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/front/ui/**/*.test.(ts|tsx)', '**/tests/front/stores/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/tests/__mocks__/fileMock.js'
  },
  moduleDirectories: ['node_modules', '<rootDir>'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  // don't ignore any store tests by default
  testPathIgnorePatterns: [],
  setupFiles: ['<rootDir>/tests/loadEnv.ts'],
  // the shared setup lives under the tests/ directory
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
  verbose: true,
}
