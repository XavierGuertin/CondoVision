import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase'; // Ensure this import path matches your Firebase config setup
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';

// Define your types (if not already defined)
type OccupantInfo = {
    name: string;
    contact: string;
};

type CondoFees = {
    monthlyFee: string;
    includes: string[];
};

type Unit = {
    unitId: string;
    size: string;
    owner: string;
    occupantInfo: OccupantInfo;
    condoFees: CondoFees;
    parkingSpotId: string;
    lockerId: string;
};

const initialUnitState: Unit = {
    unitId: '',
    size: '',
    owner: '',
    occupantInfo: { name: '', contact: '' },
    condoFees: { monthlyFee: '', includes: [] },
    parkingSpotId: '',
    lockerId: '',
};

type CondoUnitFormProps = {
    propertyId: string;
    onUnitSaved: () => void; // Add this callback function type
};


const AddCondoUnitForm: React.FC<CondoUnitFormProps> = ({ propertyId, onUnitSaved }) => {
    const [user] = useAuthState(auth);
    const [unit, setUnit] = useState<Unit>(initialUnitState);

    const handleInputChange = <T extends keyof Unit>(field: T, value: Unit[T]) => {
        setUnit((prevUnit) => ({
            ...prevUnit,
            [field]: value,
        }));
    };

      const validInput = () => {
        return unit.unitId != "" && unit.size != "" && unit.condoFees.monthlyFee != "";
      }
    const saveCondoUnit = async () => {
        if(!validInput()){
          alert('Invalid unit information!');
          return;
        }
        const propertyRef = doc(db, 'properties', propertyId);
        const propertyDoc = await getDoc(propertyRef);
        if (!propertyDoc.exists()) {
            alert('Property does not exist.');
            return;
        }

        try {
            // Add the condo unit to the 'condoUnits' subcollection of the found property
            await addDoc(collection(db, `properties/${propertyId}/condoUnits`), {
                ...unit,
            });
            alert('Condo unit saved successfully!');
            setUnit(initialUnitState); // Reset form after successful save
            onUnitSaved();
        } catch (error) {
            console.error('Error saving condo unit:', error);
            alert('Failed to save condo unit.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Add New Condo Unit</Text>
        <ScrollView style={styles.flexibleContainer}>
            <View>
              <Text style={styles.label}>Unit ID <Text style = {styles.mandatory}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Unit ID"
                value={unit.unitId}
                onChangeText={(text) => handleInputChange('unitId', text)}
              />
            </View>
            <View>
              <Text style={styles.label}>Size <Text style = {styles.mandatory}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Size"
                value={unit.size}
                onChangeText={(text) => handleInputChange('size', text)}
              />
            </View>
            <View>
              <Text style={styles.label}>Owner</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Owner"
                value={unit.owner}
                onChangeText={(text) => handleInputChange('owner', text)}
              />
            </View>
            <View>
              <Text style={styles.label}>Occupant Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Occupant Name"
                value={unit.occupantInfo.name}
                onChangeText={(text) => handleInputChange('occupantInfo', { ...unit.occupantInfo, name: text })}
              />
            </View>
            <View>
              <Text style={styles.label}>Occupant Contact</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Occupant Contact"
                value={unit.occupantInfo.contact}
                onChangeText={(text) => handleInputChange('occupantInfo', { ...unit.occupantInfo, contact: text })}
              />
            </View>
            <View>
              <Text style={styles.label}>Monthly Condo Fees <Text style = {styles.mandatory}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Monthly Condo Fees"
                value={unit.condoFees.monthlyFee}
                onChangeText={(text) => handleInputChange('condoFees', { ...unit.condoFees, monthlyFee: text })}
              />
            </View>
            <View>
              <Text style={styles.label}>Parking Spot ID</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Parking Spot ID"
                value={unit.parkingSpotId}
                onChangeText={(text) => handleInputChange('parkingSpotId', text)}
              />
            </View>
            <View>
              <Text style={styles.label}>Locker ID</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Locker ID"
                value={unit.lockerId}
                onChangeText={(text) => handleInputChange('lockerId', text)}
              />
            </View>
            </ScrollView>
        <View style = {styles.addUnitBtn}>
            <Button title="Save Condo Unit" onPress={saveCondoUnit} />
        </View>
        </SafeAreaView>

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
  addUnitBtn:{
    margin: 30,
    marginBottom: 100
  },
});

export default AddCondoUnitForm;
