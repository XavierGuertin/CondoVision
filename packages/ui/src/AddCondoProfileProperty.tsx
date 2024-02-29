// AddCondoPropertyForm.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { db } from '@web/firebase'; // Adjust based on your Firebase config setup
import { collection, addDoc } from 'firebase/firestore';

type CondoProperty = {
  propertyName: string;
  unitCount: number;
  parkingCount: number;
  lockerCount: number;
  address: string;
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
  });

  const handleInputChange = (field: keyof CondoProperty, value: any) => {
    setProperty((prevProperty) => ({
      ...prevProperty,
      [field]: value,
    }));
  };

  const saveCondoProperty = async () => {
    try {
      await addDoc(collection(db, 'properties'), property);
      alert('Condo property saved successfully!');
      setProperty({
        propertyName: '',
        unitCount: 0,
        parkingCount: 0,
        lockerCount: 0,
        address: '',
        //ownerId: current userId that is logged in
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
      <TextInput
        style={styles.input}
        placeholder="Property Name"
        value={property.propertyName}
        onChangeText={(text) => handleInputChange('propertyName', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Unit Count"
        keyboardType="numeric"
        value={property.unitCount.toString()}
        onChangeText={(text) => handleInputChange('unitCount', parseInt(text) || 0)}
      />
      <TextInput
        style={styles.input}
        placeholder="Parking Count"
        keyboardType="numeric"
        value={property.parkingCount.toString()}
        onChangeText={(text) => handleInputChange('parkingCount', parseInt(text) || 0)}
      />
      <TextInput
        style={styles.input}
        placeholder="Locker Count"
        keyboardType="numeric"
        value={property.lockerCount.toString()}
        onChangeText={(text) => handleInputChange('lockerCount', parseInt(text) || 0)}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={property.address}
        onChangeText={(text) => handleInputChange('address', text)}
      />
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
});

export default AddCondoPropertyForm;
