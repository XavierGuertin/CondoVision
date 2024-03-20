import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs, setDoc } from 'firebase/firestore';
import { db } from '@native/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * A component for registering a condo unit with a given registration key and user's email.
 */
const CondoUnitRegistration = () => {
    const [registrationKey, setRegistrationKey] = useState('');
    const [userEmail, setUserEmail] = useState('');

    // Fetch and set the user's email from AsyncStorage or Firebase auth on component mount
    useEffect(() => {
        const fetchUserEmail = async () => {
            const storedEmail = await AsyncStorage.getItem('userEmail');
            if (storedEmail) {
                setUserEmail(storedEmail);
            } else {
                const auth = getAuth();
                const user = auth.currentUser;
                if (user?.email) {
                    setUserEmail(user.email);
                    await AsyncStorage.setItem('userEmail', user.email);
                }
            }
        };

        fetchUserEmail();
    }, []);

    /**
     * Handles the form submission, checking the registration key against Firestore.
     */
    const handleSubmit = async () => {
        if (!registrationKey || !userEmail) {
            Alert.alert('Error', 'Missing registration key or user email.');
            return;
        }

        // Query the database for the provided registration key and email
        const registrationKeysRef = collection(db, "RegistrationKeys");
        const q = query(registrationKeysRef, where("key", "==", registrationKey), where("email", "==", userEmail));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            Alert.alert('Error', 'Email and Registration Key do not match.');
            return;
        }

        // Check if the key was previously used
        const registrationKeyData = querySnapshot.docs[0].data();
        if (registrationKeyData.isUsed) {
            Alert.alert('Error', 'This key has already been registered.');
            return;
        }

        // Mark the key as used
        await setDoc(querySnapshot.docs[0].ref, { isUsed: true }, { merge: true });

        Alert.alert('Success', 'Property has been registered to your profile.');
    };
    return (
        <View style={styles.formContainer}>
            <Text>Email: {userEmail}</Text>
            <TextInput
                style={styles.input}
                placeholder="Registration Key"
                value={registrationKey}
                onChangeText={setRegistrationKey}
            />
            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                <Text style={styles.buttonText}>Register Property</Text>
            </TouchableOpacity>
        </View>
    );
};

// Styles for the component
const styles = StyleSheet.create({
    formContainer: {
        width: '100%',
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        marginBottom: 20,
        padding: 10,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
    },
});

export default CondoUnitRegistration;