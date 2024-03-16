// AddFacilityForm.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { db } from '../firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'; // Importing updateDoc and arrayUnion for updating an existing document

interface Reservation {
  userId: string; // Unique identifier for the user making the reservation
  startTime: Date; // Start time of the reservation
  endTime: Date; // End time of the reservation
}

// Assuming facility data type definition
interface Facility {
  facilityName: string;
  openHour: number;
  closeHour: number;
  reservations: Reservation[]; // Define a more specific type according to your reservation structure
  facilityType: string;
}

interface AddFacilityFormProps {
  propertyId: string; // Assuming the property ID is passed as a prop to this component
}

const AddFacilityForm: React.FC<AddFacilityFormProps> = ({ propertyId }) => {
  const [facility, setFacility] = useState<Facility>({
    facilityName: '',
    openHour: 0,
    closeHour: 0,
    reservations: Reservation[],
    facilityType: '',
  });

  const handleInputChange = (field: keyof Facility, value: any) => {
    setFacility((prevFacility) => ({
      ...prevFacility,
      [field]: value,
    }));
  };

  // Simplified validation check (update according to your needs)
  const validInput = () => {
    return facility.facilityName !== "" && facility.facilityType !== "";
  }

  const saveFacility = async () => {
    if (!validInput()) {
      alert('Invalid facility information!');
      return;
    }
    try {
      // Update the specified property with the new facility
      const propertyRef = doc(db, 'properties', propertyId);
      await updateDoc(propertyRef, {
        facilities: arrayUnion(facility),
      });
      alert('Facility added successfully!');
      // Reset form after successful save
      setFacility({
        facilityName: '',
        openHour: 0,
        closeHour: 0,
        reservations: [],
        facilityType: '',
      });
    } catch (error) {
      console.error('Error adding facility:', error);
      alert('Failed to add facility.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Add New Facility</Text>
      {/* Add form fields for facility attributes */}
      <View>
        <Text style={styles.label}>Facility Name<Text style={styles.mandatory}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Facility Name"
          value={facility.facilityName}
          onChangeText={(text) => handleInputChange('facilityName', text)}
        />
      </View>
      {/* Repeat for other fields like openHour, closeHour, facilityType */}
      {/* Implementation of other inputs similar to the one above */}
      <Button title="Save Facility" onPress={saveFacility} />
    </ScrollView>
  );
};

// Styles remain largely unchanged, adjust as needed
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

export default AddFacilityForm;
