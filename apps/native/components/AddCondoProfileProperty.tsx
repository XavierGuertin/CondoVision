// AddCondoPropertyForm.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CondoProperty = {
  propertyName: string;
  unitCount: number;
  parkingCount: number;
  lockerCount: number;
  address: string;
  owner: string;
};

type AddCondoPropertyFormProps = {
    onPropertySaved: (propertyName: string, address: string) => void;
  };

const AddCondoPropertyForm: React.FC<AddCondoPropertyFormProps> = ({onPropertySaved}) => {
  const [property, setProperty] = useState<CondoProperty>({
    propertyName: '',
    unitCount: 0,
    parkingCount: 0,
    lockerCount: 0,
    address: '',
    owner: '',
  });

  const handleInputChange = (field: keyof CondoProperty, value: any) => {
    setProperty((prevProperty) => ({
      ...prevProperty,
      [field]: value,
    }));
  };

  const validInput = () => {
    return property.propertyName != "" && property.unitCount > 0 && property.address != "";
  }

  const saveCondoProperty = async () => {
    try {
      if(!validInput()){
        alert('Invalid property information!');
        return;
      }
      const userId = await AsyncStorage.getItem("userUID")
      property.owner = userId
      await addDoc(collection(db, 'properties'), property);
      alert('Condo property saved successfully!');
      setProperty({
        propertyName: '',
        unitCount: 0,
        parkingCount: 0,
        lockerCount: 0,
        address: '',
        owner: '',
      }); // Reset form after successful save
      onPropertySaved(property.propertyName, property.address);
    } catch (error) {
      console.error('Error saving condo property:', error);
      alert('Failed to save condo property.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Add New Condo Property</Text>
      <View>
        <Text style={styles.label}>Property Name <Text style = {styles.mandatory}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Property Name"
          value={property.propertyName}
          onChangeText={(text) => handleInputChange('propertyName', text)}
        />
      </View>
      <View>
          <Text style={styles.label}>Unit Count <Text style = {styles.mandatory}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Unit Count"
            keyboardType="numeric"
            value={property.unitCount.toString()}
            onChangeText={(text) => handleInputChange('unitCount', parseInt(text) || 0)}
          />
      </View>
      <View>
          <Text style={styles.label}>Parking Count</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Parking Count"
            keyboardType="numeric"
            value={property.parkingCount.toString()}
            onChangeText={(text) => handleInputChange('parkingCount', parseInt(text) || 0)}
          />
      </View>
      <View>
          <Text style={styles.label}>Locker Count</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Locker Count"
            keyboardType="numeric"
            value={property.lockerCount.toString()}
            onChangeText={(text) => handleInputChange('lockerCount', parseInt(text) || 0)}
          />
      </View>
      <View>
          <Text style={styles.label}>Address <Text style = {styles.mandatory}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Address"
            value={property.address}
            onChangeText={(text) => handleInputChange('address', text)}
          />
      </View>
      <Button title="Save Property" onPress={saveCondoProperty} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  mandatory:{
    color: 'red',
  },
});

export default AddCondoPropertyForm;
