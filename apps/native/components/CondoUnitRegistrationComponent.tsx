// CondoUnitRegistration.js
// Provides functionality for users to register a condo unit using a registration key.
// The component retrieves the user's email from local storage or the current Firebase auth session,
// and validates the provided registration key against Firestore database entries.

import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '@native/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CondoUnitRegistration = () => {
    const [registrationKey, setRegistrationKey] = useState('');
    const [userEmail, setUserEmail] = useState('');

    // Fetches the user's email on component mount, either from AsyncStorage or Firebase Auth
    useEffect(() => {
        const fetchUserEmail = async () => {
            const storedEmail = await AsyncStorage.getItem('userEmail');
            //if (storedEmail) {
            //    setUserEmail(storedEmail);
            //} else {
                const auth = getAuth();
                const user = auth.currentUser;
                if (user) {
                    setUserEmail(user.email || '');
                    await AsyncStorage.setItem('userEmail', user.email || '');
                }
            //}
        };

        fetchUserEmail();
    }, []);

    // Handles the submission of the registration key.
    const handleSubmit = async () => {
        if (!registrationKey || !userEmail) {
        Alert.alert('Error', 'Missing registration key');
        return;
        }

        const registrationKeysRef = collection(db, "RegistrationKeys");
        const q = query(registrationKeysRef, where("key", "==", registrationKey), where("email", "==", userEmail));
        const querySnapshot = await getDocs(q);

        //Check if Email and Key matches
        if (querySnapshot.empty) {
            Alert.alert('Error', 'Email and Registration Key do not match.');
            return;
        }
        
        // Check if key was previously used
        const isUsedCheck = querySnapshot.docs[0].data();
        if (isUsedCheck.isUsed) {
            Alert.alert('Error', 'This key has already been registered');
            return;
        }

        const docRef = querySnapshot.docs[0].ref;
        await setDoc(docRef, {isUsed: true}, {merge: true});

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
            <Text style={styles.buttonText}>Register Condo Unit</Text>
        </TouchableOpacity>
        </View>
    );
};

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