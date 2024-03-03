import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
// @ts-ignore
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CondoProfileComponent from '../../../packages/ui/src/CondoProfileComponent';

const CondoProfileScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
          <FontAwesome5 name="times" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Condo Profiles</Text>
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

export default CondoProfileScreen;
