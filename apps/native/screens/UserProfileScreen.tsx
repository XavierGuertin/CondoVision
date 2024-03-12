import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    Button,
    TouchableOpacity,
    Platform,
    Alert,
} from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { auth, db, storage } from '../firebase';

const UserProfileScreen = ({ navigation }) => {
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
                const { uid, email, displayName, phoneNumber, photoURL } = user;
                if (photoURL) {
                    setImageUrl(photoURL);
                } else {
                    const imageRef = ref(storage, `users/${uid}/profilePicture.jpg`);
                    try {
                        const url = await getDownloadURL(imageRef);
                        setImageUrl(url);
                    } catch (error) {
                        // @ts-ignore
                        if (error.code === 'storage/object-not-found') {
                            // Handle the case where the profile picture does not exist
                            alert('Add your info.');
                            // Optionally set a default image or leave it blank
                            // setImageUrl('path_to_default_image_if_desired');
                        } else {
                            console.error("Error fetching profile picture: ", error);
                        }
                    }
                }

                const docRef = doc(db, "users", uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setUserProfile(prevState => ({
                        ...prevState,
                        email: userData.email || email,
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
                        phoneNumber: phoneNumber,

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
                await updateDoc(userRef, userProfile);
                Alert.alert('Profile updated successfully');
                setEditMode(false);
            } catch (error) {
                console.error("Error updating document: ", error);
                Alert.alert('Failed to update profile');
            }
        }
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            Alert.alert('Logged out successfully');
            navigation.navigate('Login');
        } catch (error) {
            console.error("Error signing out: ", error);
            Alert.alert('Failed to log out');
        }
    };

    const pickImageAndUpdateProfile = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const asset = result.assets[0]; // Access the first selected asset
            const uri = asset.uri; // Use the uri from the asset
            const user = auth.currentUser;
            if (user) {
                const response = await fetch(uri);
                const blob = await response.blob();
                const imageRef = ref(storage, `users/${user.uid}/profilePicture.jpg`);

                uploadBytes(imageRef, blob).then((snapshot) => {
                    getDownloadURL(snapshot.ref).then((url) => {
                        setImageUrl(url);
                        const userRef = doc(db, 'users', user.uid);
                        updateDoc(userRef, { photoURL: url }).then(() => {
                            Alert.alert('Profile picture updated successfully');
                        }).catch((error) => {
                            console.error("Error updating document: ", error);
                            Alert.alert('Failed to update profile picture');
                        });
                    });
                }).catch((error) => {
                    console.error("Error uploading image: ", error);
                    Alert.alert('Failed to upload image');
                });
            }
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
                    <Button title="Upload Profile Picture" onPress={pickImageAndUpdateProfile} />
                    <TextInput
                        style={styles.input}
                        value={userProfile.username}
                        onChangeText={value => setUserProfile(prevState => ({...prevState, username: value}))}
                        placeholder="Username"
                    />
                    <TextInput
                        style={styles.input}
                        value={userProfile.phoneNumber}
                        onChangeText={value => setUserProfile(prevState => ({...prevState, phoneNumber: value}))}
                        placeholder="Phone Number"
                    />
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

export default UserProfileScreen;
