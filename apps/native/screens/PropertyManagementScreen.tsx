import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CondoProfileComponent from '@ui/CondoProfileComponent';
import { Button } from '@ui/button';

const PropertyManagementScreen = ({ navigation }: any) => {

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
          <FontAwesome5 name="times" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Condo Property Profiles</Text>
        <Button
          text="Add New Property"
          onClick={() => navigation.navigate('AddCondoProfile')}
          />
          </View>
      </View>
      <ScrollView style={styles.flexibleContainer}>
        <CondoProfileComponent />
        <CondoProfileComponent />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  flexibleContainer: {
    flex: 1,
    width: '100%',
  },
  headerContent: {
    alignItems: 'center',
    width: '100%',
    flexDirection: 'column'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  headerIcon: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 20, // Added margin to space out the title from the icon
  },
});

export default PropertyManagementScreen;
