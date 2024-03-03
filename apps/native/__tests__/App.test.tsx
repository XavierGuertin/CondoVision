import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

//Create Jest tests
describe('<App />', () => {
    it('renders correctly', () => {
        const tree = render(<App />);
        expect(tree).toBeTruthy();
    });
});