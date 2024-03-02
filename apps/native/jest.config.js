module.exports = {
    preset: 'react-native',
    setupFiles: ['./jest.setup.js'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(jest-)?react-native|@react-native|@react-native-community|@react-navigation|@react-native/js-polyfills|firebase|@firebase|react-native-vector-icons|react-native-async-storage|@expo/vector-icons|expo-font|expo-modules-core)', // Add 'expo-modules-core' here
    ],
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/android/', '<rootDir>/ios/'],
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect', '<rootDir>/jest.setup.js'],
};