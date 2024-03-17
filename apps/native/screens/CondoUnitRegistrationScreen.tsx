import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import CondoUnitRegistration from '../components/CondoUnitRegistrationComponent'; // Ensure this path matches your file structure

const CondoUnitRegistrationScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Register Your Property</Text>
      <CondoUnitRegistration />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default CondoUnitRegistrationScreen;