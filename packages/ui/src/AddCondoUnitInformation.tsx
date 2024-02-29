import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@web/firebase'; // Ensure this import path matches your Firebase config setup
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

    const saveCondoUnit = async () => {
//         if (!user) {
//             alert('You must be logged in to save a condo unit.');
//             return;
//         }

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
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Add New Condo Unit</Text>

            <TextInput
                style={styles.input}
                placeholder="Unit ID"
                value={unit.unitId}
                onChangeText={(text) => handleInputChange('unitId', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Size"
                value={unit.size}
                onChangeText={(text) => handleInputChange('size', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Owner"
                value={unit.owner}
                onChangeText={(text) => handleInputChange('owner', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Occupant Name"
                value={unit.occupantInfo.name}
                onChangeText={(text) => handleInputChange('occupantInfo', { ...unit.occupantInfo, name: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Occupant Contact"
                value={unit.occupantInfo.contact}
                onChangeText={(text) => handleInputChange('occupantInfo', { ...unit.occupantInfo, contact: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Monthly Condo Fees"
                value={unit.condoFees.monthlyFee}
                onChangeText={(text) => handleInputChange('condoFees', { ...unit.condoFees, monthlyFee: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Parking Spot ID"
                value={unit.parkingSpotId}
                onChangeText={(text) => handleInputChange('parkingSpotId', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Locker ID"
                value={unit.lockerId}
                onChangeText={(text) => handleInputChange('lockerId', text)}
            />

            <Button title="Save Condo Unit" onPress={saveCondoUnit} />
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

export default AddCondoUnitForm;
