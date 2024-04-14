import React, {useEffect, useState} from 'react';
import NotificationsScreenUser from './NotificationsScreenUser';
import NotificationsScreenManagement from './NotificationsManagementScreen';
import {auth, db} from "@native/firebase";
import {doc, getDoc} from "firebase/firestore";

const NotificationsScreen = () => {
    const [userProfile, setUserProfile] = useState({
        username: "",
        role: "",
    });

    useEffect(() => {
        const fetchUserProfileAndAuthData = async () => {
            const user = auth.currentUser;
            if (user) {
                const {uid, displayName} = user;

                const docRef = doc(db, "users", uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setUserProfile((prevState) => ({
                        ...prevState,
                        username: userData.username || displayName,
                        role: userData.role,
                    }));
                } else {
                    console.log("No Firestore document for user!");
                }
            }
        };

        fetchUserProfileAndAuthData();
    }, []);


    return (
        userProfile.role === 'User' ? <NotificationsScreenUser/> :
            userProfile.role === 'Condo Management Company' ? <NotificationsScreenManagement/> :
                null
    );
};

export default NotificationsScreen;