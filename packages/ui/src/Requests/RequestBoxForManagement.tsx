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
import {auth, db} from "@web/firebase";
import {collection, getDocs, updateDoc} from "firebase/firestore";
import { getDoc, doc } from "firebase/firestore";

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
const RequestBoxForManagement = () => {
    const { requests, setRequests } = useRequests();
    const [responses, setResponses] : any = useState({});
    const [, setProperties] = useState([]);

    useEffect(() => {
        const fetchProperties = async () => {
            const user = auth.currentUser;
            if (user) {
                const {uid} = user;
                const propertiesCollectionRef = collection(db, "properties");
                const querySnapshot = await getDocs(propertiesCollectionRef);
                let propertiesData: any = [];

                querySnapshot.forEach(document => {
                    if (document.data().owner === uid) {
                        propertiesData.push({id: document.id, ...document.data()});
                    }
                });
                setProperties(propertiesData);
                console.log(propertiesData)
            }
        };
        fetchProperties();
    }, []);

    const handleResponseChange = (id: number, value: string) => {
        setResponses((prev : any) => ({ ...prev, [id]: value }));
    };

    const handleAccept = async (id: number, response: string) => {
        if (!response) {
            alert('Please provide a response');
            return;
        }
        const requestDocRef = doc(db, "requests", id.toString());
        await updateDoc(requestDocRef, { status: "accepted", response: response });
        setRequests(requests.filter((request: any) => request.id !== id));
    };

    const handleReject = async (id: number, response: string) => {
        if (!response) {
            alert('Please provide a response');
            return;
        }
        const requestDocRef = doc(db, "requests", id.toString());
        await updateDoc(requestDocRef, { status: "rejected", response: response });
        setRequests(requests.filter((request: any) => request.id !== id));
    };

    return (
        <div>
            {requests.map((request: any) => {
                return (
                    <div key={request.id} className="notification-box ml-3">
                        <div className="content">
                            <p><strong>Title:</strong> {request.title}</p>
                            <p><strong>Message:</strong> {request.message}</p>
                            <p><strong>Property:</strong> {request.propertyName}</p>
                            <p><strong>Contact:</strong> {request.userEmail}</p>
                            <textarea value={responses[request.id] || ''} className="w-full border-2 pl-1" onChange={(e) => handleResponseChange(request.id, e.target.value)}
                                      placeholder=" Response"/>
                        </div>
                        <div className="button-container">
                            <button onClick={() => handleAccept(request.id, responses[request.id])} className="accept-button px-2 py-1">Accept
                            </button>
                            <button onClick={() => handleReject(request.id, responses[request.id])} className="reject-button px-2 py-1">Reject
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default RequestBoxForManagement;