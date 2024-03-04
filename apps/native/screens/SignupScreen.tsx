import React, { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';

import { auth, db } from '../firebase';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

const SignupScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [errorMessage, setError] = useState("");
    const [role, setRole] = useState("User");
    const [connectionStatus, setConnectionStatus] = useState("");
    const [open, setOpen] = useState(false);

    const handleSignup = async () => {
        async function returnRole(uid: string) {
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                return docSnap.data().role;
            } else {
                // docSnap.data() will be undefined in this case
                return "notFound";
            }
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                email: email,
                role: role,
            });

            const signInCredential = await signInWithEmailAndPassword(auth, email, password);
            await AsyncStorage.setItem('userUID', signInCredential.user.uid);
            await AsyncStorage.setItem('userRole', await returnRole(signInCredential.user.uid));
            setConnectionStatus("Success!");
            navigation.navigate('UserProfile');
        } catch (error) {
            setConnectionStatus("error");
            setError("Firestore: " + error);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.flexibleContainer}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
                            <FontAwesome5 name="times" solid size={24} color="#000" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Signup</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.headerRightText}>
                            <Text style={styles.headerText}>Log In</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../assets/logoBright.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.centeredContent}>
                        <Text style={connectionStatus == "error" ? styles.errorMessage : null}>{errorMessage}</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />

                            <DropDownPicker
                                open={open}
                                setOpen={setOpen}
                                value={role}
                                style={styles.input}
                                setValue={(itemValue) => setRole(itemValue)}
                                items={[{ label: "User", value: "User" }, { label: "Condo Management Company", value: "Condo Management Company" }]}
                            >
                            </DropDownPicker>

                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!passwordVisible}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity
                                    onPress={() => setPasswordVisible(!passwordVisible)}
                                    style={styles.showButton}
                                >
                                    <Text style={styles.showButtonText}>{passwordVisible ? 'Hide' : 'Show'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.button} onPress={handleSignup}>
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    errorMessage: {
        color: 'red',
        backgroundColor: '#FFB2B2',
        padding: 10,
        borderRadius: 6,
        textAlign: 'center',
        overflow: 'hidden',
    },
    flexibleContainer: {
        flex: 1,
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        marginTop: Platform.OS === 'android' ? 60 : 60
    },
    centeredContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerIcon: {
        padding: 10,
    },
    headerRightText: {
        padding: 10,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2074df',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
        zIndex: -1,
    },
    logoContainer: {
        alignItems: 'center',
        marginVertical: 5,
    },
    logo: {
        width: 250,
        height: 250,
    },
    inputContainer: {
        width: '80%',
        paddingHorizontal: 0,
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 10,
        fontSize: 16,
        borderWidth: 1,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderRadius: 10,
    },
    passwordInput: {
        backgroundColor: '#fff',
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    showButton: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: '#fff',
    },
    showButtonText: {
        fontWeight: 'bold',
        color: '#2074df',
    },
    showPasswordButton: {
        position: 'absolute',
        right: 10,
    },
    showPasswordText: {
        color: '#2074df',
    },
    button: {
        backgroundColor: '#2074df',
        width: '80%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    forgotPasswordText: {
        color: '#2074df',
        marginTop: 20,
    },
});

export default SignupScreen;
