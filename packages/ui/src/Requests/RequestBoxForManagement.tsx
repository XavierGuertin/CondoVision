import React, {useEffect, useState} from 'react';
import {auth, db} from "@web/firebase";
import {collection, doc, getDoc, getDocs, updateDoc} from "firebase/firestore";

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
    const {requests, setRequests} = useRequests();
    const [responses, setResponses]: any = useState({});
    const [properties, setProperties] = useState([]);

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
        setResponses((prev: any) => ({...prev, [id]: value}));
    };

    const handleAccept = async (id: number, response: string) => {
        if (!response) {
            alert('Please provide a response');
            return;
        }
        const requestDocRef = doc(db, "requests", id.toString());
        await updateDoc(requestDocRef, {status: "accepted", response: response});
        setRequests(requests.filter((request: any) => request.id !== id));
    };

    const handleReject = async (id: number, response: string) => {
        if (!response) {
            alert('Please provide a response');
            return;
        }
        const requestDocRef = doc(db, "requests", id.toString());
        await updateDoc(requestDocRef, {status: "rejected", response: response});
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
                            <textarea value={responses[request.id] || ''} className="w-full border-2 pl-1"
                                      onChange={(e) => handleResponseChange(request.id, e.target.value)}
                                      placeholder=" Response"/>
                        </div>
                        <div className="button-container">
                            <button onClick={() => handleAccept(request.id, responses[request.id])}
                                    className="accept-button px-2 py-1">Accept
                            </button>
                            <button onClick={() => handleReject(request.id, responses[request.id])}
                                    className="reject-button px-2 py-1">Reject
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default RequestBoxForManagement;