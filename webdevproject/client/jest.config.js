module.exports = {
    setupFilesAfterEnv: ['./src/setupTests.js'],
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    transformIgnorePatterns: [
        '/node_modules/(?!(axios|slick-carousel)/)',
        '\\.css$',
    ],
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        "\\.(jpg|jpeg|png|gif)$": "<rootDir>/src/__mocks__/fileMock.js"
    }
};
