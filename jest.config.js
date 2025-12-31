module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'script.js',
    '!node_modules/**'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ]
};
