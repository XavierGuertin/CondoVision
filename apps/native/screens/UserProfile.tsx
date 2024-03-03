import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Button, TouchableOpacity } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db, storage } from '../firebase'; // Ensure these are correctly imported

const UserProfile = ({ navigation }: any) => {
    const [userProfile, setUserProfile] = useState({
        email: '',
        username: '',
        role: '',
        phoneNumber: '',
    });
    const [imageUrl, setImageUrl] = useState('');
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        const fetchUserProfileAndAuthData = async () => {
            const user = auth.currentUser;
            if (user) {
                // Authenticated user's information
                const { uid, email, displayName, photoURL } = user;
                // Attempt to fetch user profile picture URL from Firebase Storage if available
                if (photoURL) {
                    setImageUrl(photoURL);
                } else {
                    // If no photoURL in auth, try fetching from Firebase Storage
                    const imageRef = ref(storage, `users/${uid}/profilePicture.jpg`);
                    getDownloadURL(imageRef).then(setImageUrl).catch(console.error);
                }

                // Fetch additional user profile data from Firestore
                const docRef = doc(db, "users", uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    // Firestore document data
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
                    // Fallback to using only Auth data if Firestore document doesn't exist
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
                setEditMode(false);
            } catch (error) {
                console.error("Error updating document: ", error);
                alert('Failed to update profile');
            }
        }
    };
    const handleLogout = async () => {
        try {
            await auth.signOut();
            alert('Logged out successfully');
            navigation.navigate('Login');
        } catch (error) {
            console.error("Error signing out: ", error);
            alert('Failed to log out');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>
            <Text style={styles.title}>User Profile</Text>
            <Image
                source={imageUrl ? { uri: imageUrl } : require('../assets/profilepicture.png')}
                style={styles.profileImage}
            />
            {editMode ? (
                <>
                    <TextInput style={styles.input} value={userProfile.username} onChangeText={value => setUserProfile(prevState => ({...prevState, username: value}))} placeholder="Username" />
                    <TextInput style={styles.input} value={userProfile.phoneNumber} onChangeText={value => setUserProfile(prevState => ({...prevState, phoneNumber: value}))} placeholder="Phone Number" />
                    <Button title="Save Changes" onPress={handleUpdate} />
                    <Button title="Cancel" onPress={() => setEditMode(false)} />
                </>
            ) : (
                <>
                    <Text style={styles.info}>Username: {userProfile.username}</Text>
                    <Text style={styles.info}>Email: {userProfile.email}</Text>
                    <Text style={styles.info}>Phone Number: {userProfile.phoneNumber}</Text>
                    <Text style={styles.info}>Role: {userProfile.role}</Text>
                    <Button title="Edit Profile" onPress={() => setEditMode(true)} />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
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
    },
    logoutButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2074df',
    },
});

export default UserProfile;