import React, {useEffect, useState} from 'react';
import {IoClose} from 'react-icons/io5'
import {auth, db} from "@web/firebase";
import {doc, getDocs, collection, updateDoc} from "firebase/firestore";
const NotificationsModal = ({onClose}: any) => {

    useEffect(() => {
        const fetchUserProfileAndAuthData = async () => {
            const user = auth.currentUser;
            if (user) {
                const {uid} = user;

                // Define the path to the notifications sub collection
                const notificationsCollectionRef = collection(db, "users", uid, "notifications");

                const querySnapshot = await getDocs(notificationsCollectionRef);

                let notificationsData: any = [];

                querySnapshot.forEach(doc => {
                    if (!doc.data().markAsRead) {
                        notificationsData.push({ id: doc.id, ...doc.data() });
                    }
                });

                setNotifications(notificationsData);
            }
        };

        fetchUserProfileAndAuthData();
    }, []);

    const [notifications, setNotifications] = useState([
        { id: 1, category:'Notification', message: 'There is no notification at the moment.'}
    ]);

    const markAsRead = async (id: number) => {
        // Filter notifications on the client side
        setNotifications(notifications.filter(notification => notification.id !== id));

        // Get the user's UID
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        // Create a reference to the specific notification document
        const notificationDocRef = doc(db, "users", uid, "notifications", id.toString());

        // Update the document's markAsRead field to true
        await updateDoc(notificationDocRef, {
            markAsRead: true
        });
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
                            <p><strong>{notification.category.toUpperCase()}</strong></p>
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