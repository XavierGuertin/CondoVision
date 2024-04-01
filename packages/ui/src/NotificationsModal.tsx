import React, {useEffect, useState} from 'react';
import {IoClose} from 'react-icons/io5'
import {auth, db} from "@web/firebase";
import {addDoc, collection, getDocs, updateDoc, deleteDoc} from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";

// Request Box Component
const RequestBox = ({onRequestSubmit, properties}: any) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [selectedProperty, setSelectedProperty] = useState(properties[0]?.id || '');

    useEffect(() => {
        setSelectedProperty(properties[0]?.id || '');
    }, [properties]);

    const handleSubmit = () => {
        onRequestSubmit(title, message, selectedProperty);
        setTitle('');
        setMessage('');
    };

    return (
        <div className="notification-box mt-3 ml-3">
            <div className="content">
                <input type="text" value={title} className="w-full mb-2 border-2 pl-1" onChange={(e) => setTitle(e.target.value)}
                       placeholder=" Title"/>
                <textarea value={message} className="w-full border-2 pl-1" onChange={(e) => setMessage(e.target.value)}
                          placeholder=" Message"/>
                <p>Select the property</p>
                <select value={selectedProperty} className="border-2" onChange={(e) => setSelectedProperty(e.target.value)}>
                    {properties.map((property: any) => (
                        <option key={property.id} value={property.id}>{property.propertyName}</option>
                    ))}
                </select>
            </div>
            <button onClick={handleSubmit} className="send-request-button px-2 py-1">Submit Request</button>
        </div>
    );
};

// Custom hook for fetching notifications
const useNotifications = () => {
    const [notifications, setNotifications] = useState([
        {id: 1, category: 'Notification', message: 'There is no notification at the moment.'}
    ]);

    useEffect(() => {
        const fetchUserProfileAndAuthData = async () => {
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
        fetchUserProfileAndAuthData();
    }, []);

    return {notifications, setNotifications};
};

const NotificationsModal = ({onClose}: any) => {
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
                            break; // Break the loop as soon as we find a matching condo unit
                        }
                    }
                }

                setProperties(propertiesData);
            }
        };
        fetchProperties();
    }, []);

    const markAsRead = async (id: number) => {
        setNotifications(notifications.filter(notification => notification.id !== id));
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        const notificationDocRef = doc(db, "users", uid, "notifications", id.toString());
        await updateDoc(notificationDocRef, {markAsRead: true});
    };

    const [isRequestBoxVisible, setRequestBoxVisible] = useState(false);

    const handleRequestSubmit = (title: string, message: string) => {
        // Handle the request submission here
        console.log(title, message);
        setRequestBoxVisible(false);
    };



    // Custom hook for fetching user's requests
    const useUserRequests = () => {
        const [userRequests, setUserRequests] = useState([]);

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
                            let request : any = {id: document.id, ...document.data()};
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

        const handleDeleteRequest = async (id: number) => {
            const requestDocRef = doc(db, "requests", id.toString());
            await deleteDoc(requestDocRef);
            setUserRequests(userRequests.filter((request: any) => request.id !== id));
        };

        return {userRequests, setUserRequests, handleDeleteRequest};
    };

    const {userRequests, handleDeleteRequest}: any = useUserRequests();

    const [expandedRequestId, setExpandedRequestId] = useState(null);

    const handleExpandCollapseClick = (id: number) => {
        if (expandedRequestId === id) {
            setExpandedRequestId(null);
        } else {
            // @ts-ignore
            setExpandedRequestId(id);
        }
    };

    return (
        <div
            className="fixed z-10 right-0 top-10 bottom-10 mt-20 w-1/4 max-sm:w-3/4 xs:w-3/4 sm:w-1/3 md:w-1/4 lg:w-1/5 bg-white p-6 overflow-auto rounded-lg shadow-xl transition-all duration-500 delay-200 transform translate-x-full ease-out transition-medium m-4 border-black border-2"
            style={{transform: 'translateX(0)', height: 'calc(85%)'}}>
            <div className="flex justify-end">
                <button onClick={onClose}
                        className="flex items-center justify-center bg-red-500 hover:bg-red-700 text-white font-bold rounded-full w-10 h-10">
                    <IoClose className="text-2xl"/>
                </button>
            </div>
            <div className="flex flex-col items-center">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4 mt-3">Notifications Center</h2>
                {notifications.map(notification => (
                    <div key={notification.id} className="notification-box">
                        <div className="content">
                            <p><strong>{notification.category.toUpperCase()}</strong></p>
                            <p>{notification.message}</p>
                        </div>
                        <button onClick={() => markAsRead(notification.id)}
                                className="notification-box-button px-2 py-1">Mark as read
                        </button>
                    </div>
                ))}
            </div>
            {!isRequestBoxVisible &&
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <button onClick={() => setRequestBoxVisible(true)} className="request-button px-2 py-1">Make a
                        Request
                    </button>
                </div>
            }
            {isRequestBoxVisible && <button onClick={() => setRequestBoxVisible(false)}
                                            className="request-button px-2 py-1">Cancel</button>}
            {isRequestBoxVisible && <RequestBox onRequestSubmit={handleRequestSubmit} properties={properties}/>}

            <div className="flex flex-col items-center">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4 mt-3">Your Requests</h2>
                {userRequests.map((request : any) => (
                    <div key={request.id} className="notification-box">
                        <div className="content">
                            <p><strong>Title:</strong> {request.title}</p>
                            <p style={{ color: request.status === 'accepted' ? 'green' : request.status === 'rejected' ? 'red' : 'black' }}><strong>Status:</strong> {request.status}</p>
                            {expandedRequestId === request.id && (
                                <>
                                    <p><strong>Message:</strong> {request.message}</p>
                                    <p><strong>Property:</strong> {request.propertyName}</p>
                                    <p><strong>Response:</strong> {request.response}</p>
                                    {(request.status === 'accepted' || request.status === 'rejected') && (
                                        <button onClick={() => handleDeleteRequest(request.id)}
                                                className="delete-request-button px-2 py-1">
                                            Delete Request
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                        <button onClick={() => handleExpandCollapseClick(request.id)}
                                className="notification-box-button px-2 py-1">
                            {expandedRequestId === request.id ? 'Collapse' : 'Expand'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationsModal;
