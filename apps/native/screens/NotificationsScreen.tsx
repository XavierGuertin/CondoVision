import React, { useEffect, useState } from 'react';
import {View, Text, ScrollView, TextInput, Button} from 'react-native';
import { auth, db } from "@native/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import Picker from 'react-native-picker-select';
import { StyleSheet } from 'react-native';

// Request Box Component
// @ts-ignore
const RequestBox = ({ onRequestSubmit, properties }) => {
    properties = properties || [];
    const [title, setTitle] : any = useState('');
    const [message, setMessage] : any = useState('');
    const [selectedProperty, setSelectedProperty] : any = useState(properties[0]?.id || '');

    useEffect(() => {
        setSelectedProperty(properties[0]?.id || '');
    }, [properties]);

    const handleSubmit = () => {
        onRequestSubmit(title, message, selectedProperty);
        setTitle('');
        setMessage('');
    };

    const propertyItems = properties.map((property:any) => ({
        label: property.propertyName,
        value: property.id,
        key: property.id
    }));

    return (
        <View style={styles.notificationBox}>
            <Text style={styles.label}>Select the property</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Title" />
            <TextInput style={styles.input} value={message} onChangeText={setMessage} placeholder="Message" />
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
            <View style={styles.sendRequestButton}>
                <Button title="Submit Request" onPress={handleSubmit} />
            </View>
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
                const { uid } = user;
                const notificationsCollectionRef = collection(db, "users", uid, "notifications");
                const querySnapshot = await getDocs(notificationsCollectionRef);
                let notificationsData : any = [];

                querySnapshot.forEach(document => {
                    if (!document.data().markAsRead) {
                        notificationsData.push({ id: document.id, ...document.data() });
                    }
                });

                setNotifications(notificationsData);
            }
        };
        fetchNotifications();
    }, []);

    return { notifications, setNotifications };
};

const NotificationsScreen = () => {
    const { notifications, setNotifications } = useNotifications();
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        const fetchProperties = async () => {
            const user = auth.currentUser;
            if (user) {
                const { uid } = user;
                const propertiesCollectionRef = collection(db, "properties");
                const querySnapshot = await getDocs(propertiesCollectionRef);
                let propertiesData : any= [];

                for (let propertyDoc of querySnapshot.docs) {
                    const condoUnitsCollectionRef = collection(propertyDoc.ref, "condoUnits");
                    const condoUnitsSnapshot = await getDocs(condoUnitsCollectionRef);

                    for (let condoUnitDoc of condoUnitsSnapshot.docs) {
                        if (condoUnitDoc.data().owner === uid) {
                            propertiesData.push({ id: propertyDoc.id, ...propertyDoc.data() });
                            break;
                        }
                    }
                }
                console.log(propertiesData)
                setProperties(propertiesData);
            }
        };
        fetchProperties();
    }, []);

    const markAsRead = async (id : any) => {
        setNotifications(notifications.filter((notification:any) => notification.id !== id));
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        const notificationDocRef = doc(db, "users", uid, "notifications", id.toString());
        await updateDoc(notificationDocRef, { markAsRead: true });
    };

    const [isRequestBoxVisible, setRequestBoxVisible] = useState(false);

    const handleRequestSubmit = async (title: any, message: any, propertyId: any) => {
        const user = auth.currentUser;
        if (!user) return;
        const { uid } = user;

        const newRequest = {
            userUID: uid,
            propertyUID: propertyId,
            title: title,
            message: message,
            status: "created"
        };

        try {
            const requestsCollectionRef = collection(db, "requests");
            await addDoc(requestsCollectionRef, newRequest);
            alert("Request submitted successfully!");
        } catch (error) {
            alert("Error submitting request. Please try again later.");
        }

        setRequestBoxVisible(false);
    };

    // Custom hook for fetching user's requests
    const useUserRequests = () => {
        const [userRequests, setUserRequests] = useState([]);

        useEffect(() => {
            const fetchUserRequests = async () => {
                const user = auth.currentUser;
                if (user) {
                    const { uid } = user;
                    const requestsCollectionRef = collection(db, "requests");
                    const querySnapshot = await getDocs(requestsCollectionRef);
                    let requestData : any = [];

                    for (let document of querySnapshot.docs) {
                        if (document.data().userUID === uid) {
                            let request : any = { id: document.id, ...document.data() };
                            const propertyRef = doc(db, "properties", request.propertyUID);
                            const propertyDoc : any = await getDoc(propertyRef);
                            request.propertyName = propertyDoc.data().propertyName;
                            requestData.push(request);
                        }
                    }

                    setUserRequests(requestData);
                }
            };
            fetchUserRequests();
        }, []);

        const handleDeleteRequest = async (id:any) => {
            const requestDocRef = doc(db, "requests", id.toString());
            await deleteDoc(requestDocRef);
            setUserRequests(userRequests.filter((request:any) => request.id !== id));
        };

        return { userRequests, handleDeleteRequest };
    };

    const { userRequests, handleDeleteRequest } = useUserRequests();

    const [expandedRequestId, setExpandedRequestId] = useState(null);

    const handleExpandCollapseClick = (id : any) => {
        if (expandedRequestId === id) {
            setExpandedRequestId(null);
        } else {
            setExpandedRequestId(id);
        }
    };

    const getStatusStyle = (status:any) => {
        switch (status) {
            case 'accepted':
                return { color: 'green', fontWeight: 'bold'};
            case 'refused':
                return { color: 'red', fontWeight: 'bold' };
            default:
                return {};
        }
    };

    return (
        <ScrollView>
            <View>
                <Text style={styles.title}>Notifications Center</Text>
                {notifications.map((notification:any) => (
                    <View key={notification.id} style={styles.notificationBox}>
                        <Text style={styles.notificationTitle}>{notification.category.toUpperCase()}</Text>
                        <Text style={styles.notificationContent}>{notification.message}</Text>
                        <View style={styles.notificationBoxButton}>
                            <Button title="Mark as read" onPress={() => markAsRead(notification.id)} />
                        </View>
                    </View>
                ))}
            </View>
            {!isRequestBoxVisible &&
                <View style={styles.requestButton}>
                    <Button title="Make a Request" onPress={() => setRequestBoxVisible(true)} />
                </View>
            }
            {isRequestBoxVisible && <RequestBox onRequestSubmit={handleRequestSubmit} properties={properties} />}
            <View>
                <Text style={styles.title}>Your Requests</Text>
                {userRequests.map((request:any) => (
                    <View key={request.id} style={styles.notificationBox}>
                        <Text style={styles.notificationTitle}>Title: {request.title}</Text>
                        <Text style={[styles.notificationContent, getStatusStyle(request.status)]}>Status: {request.status}</Text>
                        {expandedRequestId === request.id && (
                            <>
                                <Text style={styles.notificationContent}>Message: {request.message}</Text>
                                <Text style={styles.notificationContent}>Property: {request.propertyName}</Text>
                                <Text style={styles.notificationContent}>Response: {request.response}</Text>
                                {(request.status === 'accepted' || request.status === 'rejected') && (
                                    <View style={styles.requestButton}>
                                        <Button title="Delete Request" onPress={() => handleDeleteRequest(request.id)} />
                                    </View>
                                )}
                            </>
                        )}
                        <View style={styles.requestButton}>
                            <Button title={expandedRequestId === request.id ? 'Collapse' : 'Expand'} onPress={() => handleExpandCollapseClick(request.id)} />
                        </View>
                    </View>
                ))}
                <View style={{ height: 100 }} />
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
        shadowOffset: { width: 0, height: 10 },
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
        top: 7,
        right: 5,
        color: 'white',
        padding: 3,
        textAlign: 'center',
        fontSize: 12,
        borderRadius: 5,
        width: '40%',
        alignSelf: 'center',
        marginBottom: 10
    },
    sendRequestButton: {
        alignSelf: 'center',
        color: 'white',
        padding: 3,
        textAlign: 'center',
        fontSize: 12,
        borderRadius: 5,
    },
    requestButton: {
        top: 7,
        marginLeft: 15,
        color: 'white',
        padding: 3,
        textAlign: 'center',
        fontSize: 12,
        borderRadius: 5,
        width: '50%',
        alignSelf: 'center',
        marginBottom: 10
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 25,
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
});

export default NotificationsScreen;