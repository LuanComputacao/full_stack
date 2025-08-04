module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    testMatch: [
        '**/__tests__/**/*.+(ts|tsx|js)',
        '**/*.(test|spec).+(ts|tsx|js)'
    ],
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: 'tsconfig.test.json'
        }]
    },
    collectCoverageFrom: [
        'src/**/*.{ts,js}',
        '!src/**/*.d.ts',
        '!src/index.ts'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: [
        'text',
        'lcov',
        'clover',
        'html'
    ],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    testTimeout: 10000,
    verbose: true,
    clearMocks: true,
    restoreMocks: true
};
