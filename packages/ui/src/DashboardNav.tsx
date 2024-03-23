import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@web/firebase";
import { dashNavLinks } from "./constants";
import Image from "next/image";
import UserProfileModal from './UserProfileModal';
import NotificationsModal from "./NotificationsModal";
import { collection, getDocs } from "firebase/firestore";

const DashboardNav = () => {
    const [active, setActive] = useState("Dashboard");
    const [lastActive, setLastActive] = useState("Dashboard");
    const [authUser] = useAuthState(auth);
    const [isModalOpenUser, setIsModalOpenUser] = useState(false);
    const [isModalOpenNotifications, setIsModalOpenNotifications] = useState(false);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (authUser) {
                const { uid } = authUser;

                // Define the path to the notifications sub collection
                const notificationsCollectionRef = collection(db, "users", uid, "notifications");

                const querySnapshot = await getDocs(notificationsCollectionRef);

                let notificationsData: any = [];

                querySnapshot.forEach(doc => {
                    if (!doc.data().markAsRead) {
                        notificationsData.push({ id: doc.id, ...doc.data() });
                    }
                });
                console.log('notificationsData', notificationsData);
                setUnreadNotificationsCount(notificationsData.length);
            }
        };

        fetchNotifications();
    }, [authUser]);

    const toggleModalUser = () => {
        setIsModalOpenUser(!isModalOpenUser);
        if (!isModalOpenUser) {
            setLastActive(active);
        } else {
            setActive(lastActive);
        }
    };

    const toggleModalNotifications = () => {
        setIsModalOpenNotifications(!isModalOpenNotifications);
        if (!isModalOpenNotifications) {
            setLastActive(active);
        } else {
            setActive(lastActive);
        }
    };

    return (
        <nav className="w-full flex py-2 justify-between items-center navbar bg-gradient-to-r bg-[#87A8FA] to-[#87CCFA] border-b border-[#87A8FA]">
            <a href="/dashboard">
                <Image
                    src="/logoBright.png"
                    alt="CondoVision Logo"
                    width={75}
                    height={75}
                    className="ml-6 logo" />
            </a>
            <ul className="list-none sm:flex hidden justify-end items-center flex-1">
                {dashNavLinks.map((nav) => (
                    <li
                        key={nav.id}
                        className={`font-poppins font-normal cursor-pointer text-16px ${active === nav.title ? "text-white" : "text-dimWhite"
                            } mr-10`}
                        onClick={() => {
                            setActive(nav.title);
                            if (nav.id === 'userProfile') {
                                toggleModalUser();
                            }
                            if (nav.id === 'notifications') {
                                toggleModalNotifications();
                            }
                        }}
                    >
                        {nav.id === 'notifications' ?
                            <a className="flex">
                                {React.createElement(nav.logo, { size: 25, className: `mr-2 ${active === nav.title ? 'text-blue-500' : ''}` })}
                                <p className={`flex items-center ${active === nav.title ? 'text-blue-500' : ''}`}>{nav.title}</p>
                                {unreadNotificationsCount > 0 &&
                                    <span className="badge">{unreadNotificationsCount}</span>}
                            </a> : null
                        }

                        {nav.id === 'userProfile' ?
                            <a className="flex">
                                {React.createElement(nav.logo, { size: 25, className: `mr-2 ${active === nav.title ? 'text-blue-500' : ''}` })}
                                <p className={`flex items-center ${active === nav.title ? 'text-blue-500' : ''}`}>{nav.title}</p>
                            </a>
                            : null
                        }

                        {nav.id != 'userProfile' && nav.id != 'notifications' ?
                            <a href={`/${nav.id}`} className="flex">
                                {React.createElement(nav.logo, { size: 25, className: `mr-2 ${active === nav.title ? 'text-blue-500' : ''}` })}
                                <p className={`flex items-center ${active === nav.title ? 'text-blue-500' : ''}`}>{nav.title}</p>
                            </a> : null
                        }

                    </li>
                ))}
            </ul>
            {isModalOpenUser && <UserProfileModal user={authUser} onClose={toggleModalUser} />}
            {isModalOpenNotifications && <NotificationsModal user={authUser} onClose={toggleModalNotifications} />}
        </nav>
    );
};

export default DashboardNav;