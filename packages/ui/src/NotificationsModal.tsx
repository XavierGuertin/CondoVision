import React, {useEffect, useState} from 'react';
import {IoClose} from 'react-icons/io5'
import {auth, db} from "@web/firebase";
import {doc, getDoc} from "firebase/firestore";
const NotificationsModal = ({user, onClose}: any) => {

    useEffect(() => {
        const fetchUserProfileAndAuthData = async () => {
            const user = auth.currentUser;
            if (user) {
                const {uid, email, displayName} = user;

                // Get notifications from Firestore
                const docPath = doc(db, "users", uid).path + "/notifications";
                const docRef = doc(db, docPath, uid);
                const notificationSnap = await getDoc(docRef);
                const notifications = await docRef.get();


                const notificationsRef = firestore.collection('users').doc(uid).collection('notifications');
                const snapshot = await notificationsRef.get();
                const notificationsData = notifications.map(doc => doc.data());
                setNotifications(notificationsData);
            }
        };

        fetchUserProfileAndAuthData();
    }, []);

    const [notifications, setNotifications] = useState([
        { id: 1, category:'Finance', message: 'You haven\'t paid'},
        { id: 2, category: 'Information', message: 'Garbage one day late' },
    ]);

    const markAsRead = (id: number) => {
        setNotifications(notifications.filter(notification => notification.id !== id));
    };

    return (
        <div
            className="fixed right-0 top-10 bottom-10 mt-20 w-1/4 max-sm:w-3/4 xs:w-3/4 sm:w-1/3 md:w-1/4 lg:w-1/5 bg-white p-6 overflow-auto rounded-lg shadow-xl transition-all duration-500 delay-200 transform translate-x-full ease-out transition-medium m-4 border-black border-2"
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
                            <p><strong>{notification.category}</strong></p>
                            <p>{notification.message}</p>
                        </div>
                        <button onClick={() => markAsRead(notification.id)} className="px-2 py-1">Mark as read</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationsModal;