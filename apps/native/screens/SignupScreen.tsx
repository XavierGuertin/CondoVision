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

import { auth } from '../firebase';
// @ts-ignore
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { createUserWithEmailAndPassword } from '@firebase/auth';

const SignupScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [errorMessage, setError] = useState("");
    const [connectionStatus, setConnectionStatus] = useState("");

    const handleSignup = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                console.log('User account created & signed in!');
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    console.log('That email address is already in use!');
                }

                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                }

                console.error(error);
                setError("Firestore: " + error)
            });
        console.log('Signup with:', email, password);
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
                        <Text>{errorMessage}</Text>
                    </View>
                    <View style={styles.centeredContent}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
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
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
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
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
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
        marginTop: 60,
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
