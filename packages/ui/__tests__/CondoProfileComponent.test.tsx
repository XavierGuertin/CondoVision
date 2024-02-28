import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CondoProfileComponent from '../src/CondoProfileComponent'; // Adjust the import path as necessary

// Dummy data for the condo
const condoData = {
  images: [
    require('../../../public/logoWhiteBG.png'), // Adjust the path as necessary
    require('../../../public/logoBright.png'), // Adjust the path as necessary
  ],
  address: '123 Condo Lane, Condo City, CC 12345',
  unitID: 'Unit 101',
  unitOwner: 'John Doe',
  parkingSpot: 'Spot 12',
  financialRate: '5.5%',
  fee: '$300/month',
  rooms: 3,
  bathrooms: 2,
  lockerCount: 1,
  generalInfo: 'This condo offers great views, modern amenities, and is conveniently located near downtown.',
};

describe('CondoProfileComponent', () => {
  it('renders the collapsed state correctly', () => {
    const { getByText, queryByText } = render(<CondoProfileComponent data={condoData} />);

    expect(getByText('$300/month')).toBeTruthy();
    expect(getByText('Condo City')).toBeTruthy();
    expect(queryByText('Condo Details')).toBeNull(); // Condo Details should not be visible in collapsed state
  });

  it('expands to show additional details when pressed', () => {
    const { getByText, queryByText } = render(<CondoProfileComponent data={condoData} />);

    // Initially, Condo Details should not be visible
    expect(queryByText('Condo Details')).toBeNull();

    // Simulate pressing the component to expand it
    fireEvent.press(getByText('$300/month'));

    // After pressing, Condo Details should be visible
    expect(getByText('Condo Details')).toBeTruthy();
  });

  it('renders the correct number of images', () => {
    const { getByText, getAllByProps } = render(<CondoProfileComponent data={condoData} />);

    // Expand the component to see images
    fireEvent.press(getByText('$300/month'));

    // Check if the correct number of images are rendered
    const images = getAllByProps({ source: condoData.images[0] });
    expect(images.length).toBe(condoData.images.length);
  });

  it('renders all the detailed information when expanded', () => {
    const { getByText } = render(<CondoProfileComponent data={condoData} />);

    // Expand the component to check for all details
    fireEvent.press(getByText('$300/month'));

    // Verify that all the details are rendered
    expect(getByText('Address:')).toBeTruthy();
    expect(getByText(condoData.address)).toBeTruthy();
    expect(getByText('Unit ID:')).toBeTruthy();
    expect(getByText(condoData.unitID)).toBeTruthy();
    // ... Repeat for all other details
  });

  // Add more tests as necessary for different interactions and state changes
});
