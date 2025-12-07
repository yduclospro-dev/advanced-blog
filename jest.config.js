export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],

  moduleFileExtensions: ['ts', 'js', 'json'],

  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/Application/$1',
    '^@domain/(.*)$': '<rootDir>/Domain/$1',
    '^@infra/(.*)$': '<rootDir>/Infrastructure/$1',
    '^@webapi/(.*)$': '<rootDir>/WebApi/$1',
    '^@root/(.*)$': '<rootDir>/$1'
  },

  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true
      }
    ]
  },

  globalTeardown: './tests/globalTeardown.ts',
  forceExit: true
};
