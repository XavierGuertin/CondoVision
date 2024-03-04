import React, { useState, useEffect } from 'react';
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
import CondoProfileComponent from '../components/CondoProfileComponent';
import { Button } from '@ui/button';
import { db } from '@web/firebase'; // Adjust based on your Firebase config setup
import { collection, query, where, getDocs  } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fetchData = async () => {
  try {
    const propertyInfo = [];

    const q = query(collection(db, "properties"), where("owner", "==", await AsyncStorage.getItem("userUID")));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      propertyInfo.push(doc.data())
    });

    return propertyInfo;
  } catch (error) {
    console.error("Error getting properties:", error);
  }
};

const PropertyManagementScreen = ({ navigation }: any) => {
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        fetchData().then(data => setUserData(data));
      });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
          <FontAwesome5 name="times" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Condo Property Profiles</Text>
          </View>
      </View>
      <ScrollView style={styles.flexibleContainer}>
        {userData && userData.length > 0 ?
            (userData.map((element) => (<CondoProfileComponent data={element}/>))):(<Text style={styles.headerTitle}>No Properties</Text>)
        }
      </ScrollView>
      <View style = {styles.footer}>
      <Button
        text="Add New Property"
        onClick={() => navigation.navigate('AddCondoProfileScreen')}
        />
        </View>
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
  footer:{
    margin: 30
  }
});

export default PropertyManagementScreen;
