module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // If you're using module aliases, add them here
  moduleNameMapper: {
    '^@ui/(.*)$': '<rootDir>/../../packages/ui/src/$1',
  },
};
