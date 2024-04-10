import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import CondoUnitRegistration from '@native/components/CondoUnitRegistrationComponent'; // Adjust path as necessary
import UserCondoUnitsList from '@native/components/UserCondoUnitsList'; // Adjust path as necessary

const CondoUnitRegistrationScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.registrationContainer}>
        <Text style={styles.headerText}>Register Your Condo Unit</Text>
        <CondoUnitRegistration />
      </View>
      <View style={styles.listContainer}>
        <Text style={styles.subHeaderText}>Your Condo Units</Text>
        <UserCondoUnitsList />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  registrationContainer: {
    alignItems: 'center',
    paddingBottom: 0,
  },
  listContainer: {
    marginLeft: 20,
    flex: 1,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
  },
  subHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
  },
});

export default CondoUnitRegistrationScreen;