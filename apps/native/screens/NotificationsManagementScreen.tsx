/**
 * RequestsModal Component
 *
 * Overall view of the feature:
 * A user can submit a request linked to a condo unit they own. Once submitted, the request's status becomes "created" and it awaits a response from the condo management company.
 * Only the management company that owns the property associated with the requested condo unit can view the submitted request.
 * The management company has the option to either accept or reject the request. Regardless of the decision, they must provide a response message.
 * After the request has been either accepted or rejected, the user will be notified of the status change and can view the management company's response message.
 * If desired, the user has the option to delete the request.
 *
 * Specific to this class:
 * This component is only accessible for the management company role. It displays a modal that contains the `RequestBoxForManagement` component, which handles the request-related functionalities.
 */


import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {db} from "@native/firebase";
import {collection, getDocs, updateDoc, doc, getDoc} from "firebase/firestore";

// Custom hook for fetching requests
const useRequests = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            const requestsCollectionRef = collection(db, "requests");
            const querySnapshot = await getDocs(requestsCollectionRef);
            let requestData: any = [];

            for (let document of querySnapshot.docs) {
                if (document.data().status === "created") {
                    const propertyDocRef = doc(db, "properties", document.data().propertyUID);
                    const propertyDoc = await getDoc(propertyDocRef);
                    const userDocRef = doc(db, "users", document.data().userUID);
                    const userDoc = await getDoc(userDocRef);
                    if (propertyDoc.exists() && userDoc.exists()) {
                        const propertyName = propertyDoc.data().propertyName;
                        const userEmail = userDoc.data().email;
                        requestData.push({id: document.id, propertyName, userEmail, ...document.data()});
                    }
                }
            }

            setRequests(requestData);
        };
        fetchRequests();
    }, []);

    return {requests, setRequests};
};

// Request Box Component for Management
// @ts-ignore
const RequestBoxForManagement = ({request, handleAccept, handleReject}) => {
    const [response, setResponse] = useState('');

    return (
        <View style={styles.notificationBox}>
            <Text style={styles.notificationTitle}>Title: {request.title}</Text>
            <Text style={styles.notificationContent}>Message: {request.message}</Text>
            <Text style={styles.notificationContent}>Property: {request.propertyName}</Text>
            <Text style={styles.notificationContent}>Contact: {request.userEmail}</Text>
            <TextInput style={styles.input} value={response} onChangeText={setResponse} placeholder="Response"/>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.sendAcceptedRequestButton} onPress={() => handleAccept(request.id, response)}>
                    <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sendRejectedRequestButton} onPress={() => handleReject(request.id, response)}>
                    <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const NotificationsManagementScreen = () => {
    const {requests, setRequests} = useRequests();

    const handleAccept = async (id: any, response: any) => {
        if (!response) {
            alert('Please provide a response');
            return;
        }
        const requestDocRef = doc(db, "requests", id.toString());
        await updateDoc(requestDocRef, {status: "accepted", response: response});
        setRequests(requests.filter((request: any) => request.id !== id));
    };

    const handleReject = async (id: any, response: any) => {
        if (!response) {
            alert('Please provide a response');
            return;
        }
        const requestDocRef = doc(db, "requests", id.toString());
        await updateDoc(requestDocRef, {status: "rejected", response: response});
        setRequests(requests.filter((request: any) => request.id !== id));
    };

    return (
        <ScrollView>
            <View>
                <Text style={styles.mainTitle}>Request Center</Text>
                {requests.map((request: any) => (
                    <RequestBoxForManagement key={request.id} request={request} handleAccept={handleAccept}
                                             handleReject={handleReject}/>
                ))}
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    sendAcceptedRequestButton: {
        alignSelf: 'center',
        color: 'white',
        padding: 3,
        backgroundColor: '#4caf50',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 12,
        borderRadius: 5,
        width: '50%',
        height: 35,
        margin: 10,
        flex: 1,
    },
    sendRejectedRequestButton: {
        alignSelf: 'center',
        color: 'white',
        padding: 3,
        backgroundColor: '#F44336',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 12,
        borderRadius: 5,
        width: '50%',
        height: 35,
        margin: 10,
        flex: 1,
    },
    mainTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default NotificationsManagementScreen;