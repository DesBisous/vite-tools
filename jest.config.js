// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node', // node、jsdom
  setupFilesAfterEnv: ['./src/jestExtends/toBeWithinRange.ts'],
};
