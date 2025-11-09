module.exports = {
  // use process.cwd() (repository root) to set rootDir
  rootDir: process.cwd(),
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/api/**/*.test.ts', '**/tests/api/**/*.test.tsx'],
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
  setupFiles: ['<rootDir>/tests/loadEnv.ts'],
  // Use a node-only setup that avoids window/document shims
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.node.ts'],
  globalSetup: '<rootDir>/tests/setupGlobal.ts',
  globalTeardown: '<rootDir>/tests/globalTeardown.ts',
  verbose: true,
}
