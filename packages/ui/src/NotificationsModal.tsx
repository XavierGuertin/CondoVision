import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5'
import { auth, db } from "@web/firebase";
import { doc, getDocs, collection, updateDoc } from "firebase/firestore";

// Request Box Component
const RequestBox = ({ onRequestSubmit }: any) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = () => {
        onRequestSubmit(title, message);
        setTitle('');
        setMessage('');
    };

    return (
        <div className="notification-box mt-3 ml-3">
            <div className="content">
                <input type="text" value={title} className="w-1/2 mb-2" onChange={(e) => setTitle(e.target.value)} placeholder=" Title" />
                <textarea value={message} className="w-full" onChange={(e) => setMessage(e.target.value)} placeholder=" Message" />
            </div>
            <button onClick={handleSubmit} className="px-2 py-1">Submit Request</button>
        </div>
    );
};

// Custom hook for fetching notifications
const useNotifications = () => {
    const [notifications, setNotifications] = useState([
        { id: 1, category: 'Notification', message: 'There is no notification at the moment.' }
    ]);

    useEffect(() => {
        const fetchUserProfileAndAuthData = async () => {
            const user = auth.currentUser;
            if (user) {
                const { uid } = user;
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

    return { notifications, setNotifications };
};

const NotificationsModal = ({ onClose }: any) => {
    const { notifications, setNotifications } = useNotifications();

    const markAsRead = async (id: number) => {
        setNotifications(notifications.filter(notification => notification.id !== id));
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        const notificationDocRef = doc(db, "users", uid, "notifications", id.toString());
        await updateDoc(notificationDocRef, { markAsRead: true });
    };

    const [isRequestBoxVisible, setRequestBoxVisible] = useState(false);

    const handleRequestSubmit = (title: string, message: string) => {
        // Handle the request submission here
        console.log(title, message);
        setRequestBoxVisible(false);
    };

    return (
        <div className="fixed z-10 right-0 top-10 bottom-10 mt-20 w-1/4 max-sm:w-3/4 xs:w-3/4 sm:w-1/3 md:w-1/4 lg:w-1/5 bg-white p-6 overflow-auto rounded-lg shadow-xl transition-all duration-500 delay-200 transform translate-x-full ease-out transition-medium m-4 border-black border-2"
            style={{ transform: 'translateX(0)', height: 'calc(85%)' }}>
            <div className="flex justify-end">
                <button onClick={onClose}
                    className="flex items-center justify-center bg-red-500 hover:bg-red-700 text-white font-bold rounded-full w-10 h-10">
                    <IoClose className="text-2xl" />
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
            {!isRequestBoxVisible && <button onClick={() => setRequestBoxVisible(true)} className="request-button px-2 py-1">Make a Request</button>}
            {isRequestBoxVisible && <button onClick={() => setRequestBoxVisible(false)} className="request-button px-2 py-1">Cancel</button>}
            {isRequestBoxVisible && <RequestBox onRequestSubmit={handleRequestSubmit} />}
        </div>
    );
};

export default NotificationsModal;
