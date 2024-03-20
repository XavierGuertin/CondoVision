// AddCondoPropertyForm.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Defines the shape of a condo property object.
 */
type CondoProperty = {
  propertyName: string;
  unitCount: number;
  parkingCount: number;
  lockerCount: number;
  address: string;
  owner: string;
};

/**
 * Defines the props for AddCondoPropertyForm component.
 */
type AddCondoPropertyFormProps = {
  onPropertySaved: (propertyName: string, address: string) => void;
};

/**
 * A form component for adding a new condo property.
 * @param {AddCondoPropertyFormProps} props The props passed to the component.
 */
const AddCondoPropertyForm: React.FC<AddCondoPropertyFormProps> = ({ onPropertySaved }) => {
  const [property, setProperty] = useState<CondoProperty>({
    propertyName: '',
    unitCount: 0,
    parkingCount: 0,
    lockerCount: 0,
    address: '',
    owner: '',
  });

  /**
   * Handles input changes for the form fields and updates the state.
   * @param {keyof CondoProperty} field The field to update.
   * @param {any} value The new value for the field.
   */
  const handleInputChange = (field: keyof CondoProperty, value: any) => {
    setProperty((prevProperty) => ({
      ...prevProperty,
      [field]: value,
    }));
  };

  /**
   * Checks if the input from the form is valid.
   * @returns {boolean} True if valid, false otherwise.
   */
  const validInput = (): boolean => {
    return property.propertyName !== "" && property.unitCount > 0 && property.address !== "";
  };

  /**
   * Saves the condo property to the database and resets the form.
   */
  const saveCondoProperty = async () => {
    if (!validInput()) {
      alert('Invalid property information!');
      return;
    }
    try {
      const userId = await AsyncStorage.getItem("userUID");
      const newProperty = { ...property, owner: userId };
      await addDoc(collection(db, 'properties'), newProperty);
      alert('Condo property saved successfully!');
      onPropertySaved(newProperty.propertyName, newProperty.address);
      // Reset form after successful save
      setProperty({
        propertyName: '',
        unitCount: 0,
        parkingCount: 0,
        lockerCount: 0,
        address: '',
        owner: '',
      });
    } catch (error) {
      console.error('Error saving condo property:', error);
      alert('Failed to save condo property.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Add New Condo Property</Text>
      <View>
        <Text>Property Name <Text style={styles.mandatory}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Property Name"
          value={property.propertyName}
          onChangeText={(text) => handleInputChange('propertyName', text)}
        />
      </View>
      <View>
        <Text>Unit Count <Text style={styles.mandatory}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Unit Count"
          keyboardType="numeric"
          value={property.unitCount.toString()}
          onChangeText={(text) => handleInputChange('unitCount', parseInt(text) || 0)}
        />
      </View>
      <View>
        <Text>Parking Count</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Parking Count"
          keyboardType="numeric"
          value={property.parkingCount.toString()}
          onChangeText={(text) => handleInputChange('parkingCount', parseInt(text) || 0)}
        />
      </View>
      <View>
        <Text>Locker Count</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Locker Count"
          keyboardType="numeric"
          value={property.lockerCount.toString()}
          onChangeText={(text) => handleInputChange('lockerCount', parseInt(text) || 0)}
        />
      </View>
      <View>
        <Text>Address <Text style={styles.mandatory}>*</Text></Text>
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
  mandatory: {
    color: 'red',
  },
});

export default AddCondoPropertyForm;
