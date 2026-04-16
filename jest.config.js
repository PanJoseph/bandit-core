module.exports = {
  coveragePathIgnorePatterns: ['/node_modules/', 'src/stat.ts', 'src/__tests__/definitions'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/src/__tests__/definitions/'],
  globals: {
    'ts-jest': {
      tsconfig: './src/__tests__/tsconfig.json'
    }
  },
  preset: 'ts-jest'
};
