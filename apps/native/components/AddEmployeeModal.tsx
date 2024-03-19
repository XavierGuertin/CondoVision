import React, {useState} from 'react'
import {doc, getDoc, setDoc, addDoc, collection} from "firebase/firestore";
import {auth, db} from "@native/firebase";
import {createUserWithEmailAndPassword} from "@firebase/auth";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    StyleSheet, Text, TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import DropDownPicker from "react-native-dropdown-picker";
import {useNavigation} from "@react-navigation/native";

export const AddEmployeeModal = (props) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const role = "Employee";
    const [job, setJob] = useState("Janitor");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState("");
    const [errorMessage, setError] = useState("");
    const [visible, setVisible] = useState(false);
    const [open, setOpen] = useState(false);
    const show = () => setVisible(true);
    const hide = () => setVisible(false);

    const navigation = useNavigation();

    const handleRegistration = async () => {
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
                job: job,
            });

            await addDoc(collection(db, `properties/${props.propertyId}/Employees`), {
                user: doc(db, "users", user.uid),
                email: email,
                job: job
            })
            setConnectionStatus("");
            hide();
            setJob("Janitor");
            setEmail('');
            setPassword('');
            setPasswordVisible(false);
            setError("");
            alert("Click on View Employees to view Updated List");
        } catch (error) {
            setConnectionStatus("error");
            setError("Firestore: " + error);
        }
    };

    return (
        <>
            <TouchableOpacity style={[styles.modalButton, styles.modalButtonShow]} onPress={show}>
                <Text style={styles.modalButtonText}>ADD EMPLOYEE</Text>
            </TouchableOpacity>
            <Modal transparent={true} visible={visible} animationType={"fade"} onRequestClose={hide}>
                <SafeAreaView style={[styles.centeredContent, styles.backGround]}>
                    <View style={styles.modal}>
                        <TouchableOpacity onPress={hide} style={styles.modalButton}>
                            <FontAwesome5  name="times" solid size={24} color="#fff" />
                        </TouchableOpacity>
                        {
                        //    Registration form
                            <KeyboardAvoidingView
                                behavior={Platform.OS === "ios" ? "padding" : "height"}
                                style={styles.container}
                            >
                                <TouchableWithoutFeedback>
                                    <View style={styles.flexibleContainer}>
                                        <View style={styles.header}>
                                            <Text style={styles.headerTitle}>Registration</Text>
                                        </View>

                                        <View style={styles.centeredContent}>
                                            <Text id={'SignUpError'} style={connectionStatus == "error" ? styles.errorMessage : null}>{errorMessage}</Text>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    id={'emailSignUp'}
                                                    style={styles.input}
                                                    placeholder="Email"
                                                    placeholderTextColor={'rgba(0,0,0,0.3)'}
                                                    value={email}
                                                    onChangeText={setEmail}
                                                    keyboardType="email-address"
                                                    autoCapitalize="none"
                                                />

                                                <DropDownPicker
                                                    open={open}
                                                    setOpen={setOpen}
                                                    value={job}
                                                    style={styles.input}
                                                    setValue={(itemValue) => setJob(itemValue)}
                                                    dropDownDirection={"TOP"}
                                                    items={[{ label: "Janitor", value: "Janitor" }, { label: "Pool Boy/Girl/...", value: "Pool Boy/Girl/..." }, { label: "Chef", value: "Chef"}, { label: "Finance", value: "Finance"}, { label: "Custodian", value: "Custodian"}]}
                                                >
                                                </DropDownPicker>

                                                <View style={styles.passwordContainer}>
                                                    <TextInput
                                                        id={'passwordSignUp'}
                                                        style={styles.passwordInput}
                                                        placeholder="Password"
                                                        placeholderTextColor={'rgba(0,0,0,0.3)'}
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
                                            <TouchableOpacity style={styles.button} onPress={handleRegistration}>
                                                <Text id={'createAccountButton'} style={styles.buttonText}>Register Employee</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </KeyboardAvoidingView >
                        }
                    </View>
                </SafeAreaView>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    backGround: {
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
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
    modal: {
        width: '80%',
        height: '65%',
        margin: 15,
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderColor: "black",
        borderWidth: 2,
        borderRadius: 20,
        overflow: 'hidden',
    },
    modalButton: {
        backgroundColor: '#2074df',
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    modalButtonShow: {
        borderRadius: 5,
    },
    modalButtonText: {
        fontSize: 20,
        color: '#fff',
        fontWeight: "500",
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
})

export default AddEmployeeModal;