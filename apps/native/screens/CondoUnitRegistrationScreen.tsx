import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import CondoUnitRegistration from '../components/CondoUnitRegistrationComponent'; // Import CondoUnitRegistration component

/**
 * Screen component for registering a new condo unit.
 * This component renders a header text and the CondoUnitRegistration component,
 * which contains the form for registering a condo unit.
 */
const CondoUnitRegistrationScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header text indicating the purpose of the screen */}
      <Text style={styles.headerText}>Register Your Property</Text>
      {/* Condo unit registration form component */}
      <CondoUnitRegistration />
    </SafeAreaView>
  );
};

// StyleSheet for the CondoUnitRegistrationScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1, // Use the entire screen
    alignItems: 'center', // Center items horizontally
    justifyContent: 'center', // Center items vertically
    padding: 20, // Padding around the edges
  },
  headerText: {
    fontSize: 24, // Font size for the header text
    fontWeight: 'bold', // Bold font weight for emphasis
    marginBottom: 20, // Margin at the bottom for spacing
  },
});

export default CondoUnitRegistrationScreen;
