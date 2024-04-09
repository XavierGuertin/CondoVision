// UserPropertyForm.js
// Provides a form for submitting user property information, including email validation and status selection, with the capability to send a registration key to the user.

import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { db } from '@native/firebase';
import { addDoc, collection, getDocs, query, setDoc, where, doc, deleteDoc, updateDoc } from 'firebase/firestore';

/**
 * Validates an email address against a standard pattern.
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * A form component for registering a property to a user with a specific role.
 * @param {Object} props - Component props.
 * @param {Function} props.onFormSubmit - Callback function to handle form submission.
 * @param {string} props.propertyID - The ID of the property being registered.
 */
const UserPropertyForm = ({ onFormSubmit, condoUnitID, propertyID }) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');

    /**
     * Handles form submission by validating inputs and updating or adding registration key document in Firestore.
     */
    const handleSubmit = async () => {
        // Generate a random key for registration
        const key = Math.random().toString(36).substring(2, 9);
        if (email && status) {
            if (!isValidEmail(email)) {
                Alert.alert('Invalid Email', 'Please enter a valid email address');
                return;
            }

            const q = query(collection(db, "RegistrationKeys"), where("email", "==", email), where("condoUnitID", "==", condoUnitID));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docRef = querySnapshot.docs[0].ref;

                // Update the existing record
                await setDoc(docRef, { email, status, key, condoUnitID, propertyID, isUsed: false }, { merge: true });
                Alert.alert('Update Successful', 'Registration Key has been sent');
            } else {
                // Add a new record if no duplicate is found
                await addDoc(collection(db, "RegistrationKeys"), { email, status, key, condoUnitID, propertyID, isUsed: false });
                Alert.alert('Submission Successful', 'Registration Key has been sent');
            }
        } else {
            Alert.alert('Please fill in all fields.');
        }
    };
   
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Enter user's email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <RNPickerSelect
                onValueChange={(value) => setStatus(value)}
                items={[
                    { label: 'Owner', value: 'Owner' },
                    { label: 'Renter', value: 'Renter' },
                ]}
                placeholder={{
                    label: 'Select user status...',
                    value: null,
                }}
                style={{ ...pickerSelectStyles }}
                value={status}
            />
            <TouchableOpacity
                onPress={handleSubmit}
                style={styles.uploadButton}
            >
                <Text style={styles.buttonText}>Send Registration Key</Text>
            </TouchableOpacity>
        </View>
    );
};

const textSize = 20;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 10,
        overflow: "hidden",
        margin: 10,
        backgroundColor: "#FFFFFF",
        elevation: 3,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    collapsedContainer: {
        height: 100,
    },
    expandedContainer: {
        height: "auto",
    },
    expandedScrollView: {
        paddingBottom: 20,
    },
    imageContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    image: {
        width: "100%",
        height: 80,
        borderRadius: 10,
        marginRight: 10,
    },
    imageExpanded: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginRight: 10,
    },
    header: {
        fontSize: 18,
        fontWeight: "600",
        color: "#2f80ed",
        textAlign: "center",
        marginVertical: 10,
    },
    expandedHeader: {
        fontSize: 22,
    },
    detailSection: {
        marginBottom: 10,
        paddingHorizontal: 5,
    },
    infoTitle: {
        fontSize: textSize,
        fontWeight: "600",
        color: "#333",
    },
    infoText: {
        fontSize: textSize,
        color: "#666",
        marginLeft: 10,
        fontFamily: "System",
    },
    uploadButton: {
        backgroundColor: "#2074df",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 20,
    },
    buttonText: {
        color: "#ffffff",
        fontSize: textSize,
        fontWeight: "500",
    },
    infoContainer: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "space-between",
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
        marginBottom: 20,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
        marginBottom: 20,
    },
});

export default UserPropertyForm;