jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(() => Promise.resolve('mocked value')),
}));

jest.mock('@react-navigation/native-stack', () => {
    return {
        createNativeStackNavigator: jest.fn(),
    };
});

jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(() => Promise.resolve('mocked value')),
}));

jest.mock('@react-native-firebase/app', () => ({}));
jest.mock('@react-native-firebase/auth', () => ({}));

jest.mock('@react-native-picker/picker', () => 'Picker');

jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => jest.fn(),
}));

jest.mock('@react-navigation/native-stack', () => ({
    createNativeStackNavigator: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
    ...jest.requireActual('react-native-safe-area-context'),
    useSafeAreaInsets: () => ({
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    }),
}));

jest.mock('react-native-screens', () => ({
    ...jest.requireActual('react-native-screens'),
    enableScreens: jest.fn(),
}));

jest.mock('react-native-vector-icons/FontAwesome5', () => 'FontAwesome5');
jest.mock('react-native-dropdown-picker', () => 'DropdownPicker');

jest.mock('react-native', () => {
    const rn = jest.requireActual('react-native');
    return rn;
});