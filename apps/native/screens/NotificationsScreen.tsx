import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {auth, db} from '../firebase';

const NotificationsScreen = ({navigation}: any) => {
    const [userProfile, setUserProfile] = useState({
        email: '',
        username: '',
        role: '',
        phoneNumber: '',
    });

    useEffect(() => {
        const fetchUserProfileAndAuthData = async () => {
            const user = auth.currentUser;
            if (user) {
                const {uid, email, displayName, photoURL} = user;
                // Fetch additional user profile data from Firestore
                const docRef = doc(db, "users", uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setUserProfile(prevState => ({
                        ...prevState,
                        email: userData.email || email, // Prefer Firestore email, fallback to Auth if unavailable
                        username: userData.username || displayName,
                        role: userData.role,
                        phoneNumber: userData.phoneNumber,
                    }));
                } else {
                    console.log("No Firestore document for user!");
                    // @ts-ignore
                    setUserProfile(prevState => ({
                        ...prevState,
                        email: email,
                        username: displayName,
                    }));
                }
            }
        };

        fetchUserProfileAndAuthData();
    }, []);

    const handleUpdate = async () => {
        const userUID = await AsyncStorage.getItem('userUID');
        if (userUID) {
            const userRef = doc(db, 'users', userUID);
            try {
                await updateDoc(userRef, {
                    ...userProfile,
                });
                alert('Profile updated successfully');
            } catch (error) {
                console.error("Error updating document: ", error);
                alert('Failed to update profile');
            }
        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Notification Center</Text>
            <Text>Hasn't been developed yet</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        marginBottom: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    info: {
        fontSize: 18,
        marginBottom: 10,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: '80%',
    },
    logoutButton: {
        padding: 0,
        marginRight: -130,
        marginLeft: 130,
        marginBottom: 150,
        marginTop: -150,
    },
    logoutButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2074df',
    },
});

export default NotificationsScreen