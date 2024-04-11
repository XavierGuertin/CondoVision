/**
 * NotificationsScreen Component
 *
 * This component is designed to manage and display notifications within a React application,
 * leveraging Firebase for data storage and operations.
 *
 * User's notifications are fetched from Firestore and displayed in the notification screen of the native app.
 * The user's can also make requests that are based on a specific unit and that can be approved or rejected by condo management companies.
 *
 * It makes use of React hooks for state management,including `useState` for local component state and `useEffect` for side effects.
 *
 * Key Functionalities:
 * - Interacts with Firebase Firestore for CRUD operations on notifications data.
 * - Utilizes `IoClose` from `react-icons` for UI elements.
 * - Implements a RequestBox sub-component for handling notification requests, with properties passed as props.
 *
 * Dependencies:
 * - React and React Icons for UI construction and iconography.
 * - Firebase and Firestore for backend data management.
 *
 * Usage:
 * Import and include `<NotificationsScreen />` in your component tree to enable notification management
 * within your application.
 */
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {auth, db} from "@native/firebase";
import {addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc} from "firebase/firestore";
import Picker from 'react-native-picker-select';

// Request Box Component
// @ts-ignore
const RequestBox = ({onRequestSubmit, properties}) => {
    properties = properties || [];
    const [title, setTitle]: any = useState('');
    const [message, setMessage]: any = useState('');
    const [selectedProperty, setSelectedProperty]: any = useState(properties[0]?.id || '');

    useEffect(() => {
        setSelectedProperty(properties[0]?.id || '');
    }, [properties]);

    const handleSubmit = () => {
        onRequestSubmit(title, message, selectedProperty);
        setTitle('');
        setMessage('');
    };

    const propertyItems = properties.map((property: any) => ({
        label: property.propertyName,
        value: property.id,
        key: property.id
    }));

    return (
        <View style={styles.notificationBox}>
            <Text style={styles.label}>Select the property</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Title"/>
            <TextInput style={styles.input} value={message} onChangeText={setMessage} placeholder="Message"/>
            <Text style={styles.label}>Select the property</Text>
            <Picker
                style={{
                    inputIOS: styles.input,
                    inputAndroid: styles.input,
                    inputWeb: styles.input,
                }}
                items={propertyItems}
                value={selectedProperty}
                onValueChange={(itemValue) => setSelectedProperty(itemValue)}
            />
            <TouchableOpacity style={styles.sendRequestButton} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit Request</Text>
            </TouchableOpacity>
        </View>
    );
};

// Custom hook for fetching notifications
const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            const user = auth.currentUser;
            if (user) {
                const {uid} = user;
                const notificationsCollectionRef = collection(db, "users", uid, "notifications");
                const querySnapshot = await getDocs(notificationsCollectionRef);
                let notificationsData: any = [];

                querySnapshot.forEach(document => {
                    if (!document.data().markAsRead) {
                        notificationsData.push({id: document.id, ...document.data()});
                    }
                });

                setNotifications(notificationsData);
            }
        };
        fetchNotifications();
    }, []);

    return {notifications, setNotifications};
};

const NotificationsScreen = () => {
    const {notifications, setNotifications} = useNotifications();
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        const fetchProperties = async () => {
            const user = auth.currentUser;
            if (user) {
                const {uid} = user;
                const propertiesCollectionRef = collection(db, "properties");
                const querySnapshot = await getDocs(propertiesCollectionRef);
                let propertiesData: any = [];

                for (let propertyDoc of querySnapshot.docs) {
                    const condoUnitsCollectionRef = collection(propertyDoc.ref, "condoUnits");
                    const condoUnitsSnapshot = await getDocs(condoUnitsCollectionRef);

                    for (let condoUnitDoc of condoUnitsSnapshot.docs) {
                        if (condoUnitDoc.data().owner === uid) {
                            propertiesData.push({id: propertyDoc.id, ...propertyDoc.data()});
                            break;
                        }
                    }
                }
                setProperties(propertiesData);
            }
        };
        fetchProperties();
    }, []);

    const markAsRead = async (id: any) => {
        setNotifications(notifications.filter((notification: any) => notification.id !== id));
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        const notificationDocRef = doc(db, "users", uid, "notifications", id.toString());
        await updateDoc(notificationDocRef, {markAsRead: true});
    };

    const [isRequestBoxVisible, setRequestBoxVisible] = useState(false);

    const handleRequestSubmit = async (title: any, message: any, propertyId: any) => {
        const user = auth.currentUser;
        if (!user) return;
        const {uid} = user;

        const newRequest: any = {
            userUID: uid,
            propertyUID: propertyId,
            title: title,
            message: message,
            status: "created"
        };

        try {
            const requestsCollectionRef = collection(db, "requests");
            const docRef = await addDoc(requestsCollectionRef, newRequest);

            // Fetch the property name
            const propertyRef = doc(db, "properties", newRequest.propertyUID);
            const propertyDoc: any = await getDoc(propertyRef);
            newRequest.propertyName = propertyDoc.data().propertyName;

            // Add the new request to the userRequests state
            setUserRequests((prevRequests: any) => [...prevRequests, {id: docRef.id, ...newRequest}]);

            alert("Request submitted successfully!");
        } catch (error) {
            alert("Error submitting request. Please try again later.");
            console.log(error);
        }

        setRequestBoxVisible(false);
    };

    // Custom hook for fetching user's requests
    // Custom hook for fetching user's requests
    const useUserRequests = () => {
        const [userRequests, setUserRequests] = useState<any>([]);

        useEffect(() => {
            const fetchUserRequests = async () => {
                const user = auth.currentUser;
                if (user) {
                    const {uid} = user;
                    const requestsCollectionRef = collection(db, "requests");
                    const querySnapshot = await getDocs(requestsCollectionRef);
                    let requestData: any = [];

                    for (let document of querySnapshot.docs) {
                        if (document.data().userUID === uid) {
                            let request: any = {id: document.id, ...document.data()};
                            const propertyRef = doc(db, "properties", request.propertyUID);
                            const propertyDoc: any = await getDoc(propertyRef);
                            request.propertyName = propertyDoc.data().propertyName;
                            requestData.push(request);
                        }
                    }

                    setUserRequests(requestData);
                }
            };
            fetchUserRequests();
        }, []);

        const handleDeleteRequest = async (id: any) => {
            const requestDocRef = doc(db, "requests", id.toString());
            await deleteDoc(requestDocRef);
            setUserRequests(userRequests.filter((request: any) => request.id !== id));
        };

        return {userRequests, setUserRequests, handleDeleteRequest};
    };

    const {userRequests, setUserRequests, handleDeleteRequest} = useUserRequests();

    const [expandedRequestId, setExpandedRequestId] = useState(null);

    const handleExpandCollapseClick = (id: any) => {
        if (expandedRequestId === id) {
            setExpandedRequestId(null);
        } else {
            setExpandedRequestId(id);
        }
    };

    const getStatusStyle = (status: any) => {
        switch (status) {
            case 'accepted':
                return {color: 'green', fontWeight: 'bold' as const};
            case 'refused':
                return {color: 'red', fontWeight: 'bold' as const};
            default:
                return {fontWeight: undefined};
        }
    };

    return (
        <ScrollView>
            <View>
                <Text style={styles.mainTitle}>Notifications Center</Text>
                {notifications.map((notification: any) => (
                    <View key={notification.id} style={styles.notificationBox}>
                        <Text style={styles.notificationTitle}>{notification.category.toUpperCase()}</Text>
                        <Text style={styles.notificationContent}>{notification.message}</Text>
                        <TouchableOpacity style={styles.notificationBoxButton}
                                          onPress={() => markAsRead(notification.id)}>
                            <Text style={styles.buttonText}>Mark as read</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            {!isRequestBoxVisible &&
                <TouchableOpacity style={styles.makeRequestButton} onPress={() => setRequestBoxVisible(true)}>
                    <Text style={styles.buttonText}>Make a Request</Text>
                </TouchableOpacity>
            }
            {isRequestBoxVisible &&
                <TouchableOpacity style={styles.makeRequestButton} onPress={() => setRequestBoxVisible(false)}>
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
            }
            {isRequestBoxVisible && <RequestBox onRequestSubmit={handleRequestSubmit} properties={properties}/>}
            <View>
                <Text style={styles.title}>Your Requests</Text>
                {userRequests.map((request: any) => (
                    <View key={request.id} style={styles.notificationBox}>
                        <Text style={styles.notificationTitle}>Title: {request.title}</Text>
                        <Text
                            style={[styles.notificationContent, getStatusStyle(request.status)]}>Status: {request.status}</Text>
                        {expandedRequestId === request.id && (
                            <>
                                <Text style={styles.notificationContent}>Message: {request.message}</Text>
                                <Text style={styles.notificationContent}>Property: {request.propertyName}</Text>
                                <Text style={styles.notificationContent}>Response: {request.response}</Text>
                                {(request.status === 'accepted' || request.status === 'rejected') && (
                                    <TouchableOpacity style={styles.requestButton}
                                                      onPress={() => handleDeleteRequest(request.id)}>
                                        <Text style={styles.buttonText}>Delete Request</Text>
                                    </TouchableOpacity>
                                )}
                            </>
                        )}
                        <TouchableOpacity style={styles.requestButton}
                                          onPress={() => handleExpandCollapseClick(request.id)}>
                            <Text
                                style={styles.buttonText}>{expandedRequestId === request.id ? 'Collapse' : 'Expand'}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                <View style={{height: 100}}/>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    notificationBox: {
        position: 'relative',
        backgroundColor: '#f8f9fa',
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.1,
        shadowRadius: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        fontSize: 16,
        fontWeight: '500',
        width: '80%',
        alignSelf: 'center',
    },
    notificationBoxButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        color: 'white',
        padding: 3,
        textAlign: 'center',
        backgroundColor: '#2196F3',
        fontSize: 12,
        justifyContent: 'center',
        borderRadius: 5,
        width: '40%',
        alignSelf: 'center',
        marginBottom: 10
    },
    sendRequestButton: {
        alignSelf: 'center',
        color: 'white',
        padding: 3,
        backgroundColor: '#2196F3',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 12,
        borderRadius: 5,
        width: '50%',
        height: 35,
    },
    makeRequestButton: {
        top: 7,
        height: 35,
        marginLeft: 15,
        marginBottom: 20,
        backgroundColor: '#2196F3',
        color: 'white',
        padding: 3,
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 12,
        borderRadius: 5,
        width: '30%',
        alignSelf: 'center',
    },

    requestButton: {
        top: 7,
        height: 35,
        marginLeft: 15,
        backgroundColor: '#2196F3',
        color: 'white',
        padding: 3,
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 12,
        borderRadius: 5,
        width: '50%',
        alignSelf: 'center',
        marginBottom: 10
    },
    mainTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 15,
        marginBottom: 20,
    },
    notificationTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    notificationContent: {
        marginBottom: 10,
    },
    input: {
        borderWidth: 2,
        borderColor: '#6e6e6e',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 5,
    },
    picker: {
        borderWidth: 2,
        borderColor: '#6e6e6e',
        marginBottom: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default NotificationsScreen;