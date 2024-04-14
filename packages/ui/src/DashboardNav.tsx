import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@web/firebase";
import { dashNavLinks } from "./constants";
import Image from "next/image";
import UserProfileModal from './UserProfileModal';
import NotificationsModal from "./NotificationsModal";
import { collection, getDocs } from "firebase/firestore";
import RequestsModal from "./Requests/RequestsModal";
import FinancePage from "../../../apps/web/app/finance/page";
import { useRouter } from 'next/router';

const DashboardNav = () => {
    const [authUser] = useAuthState(auth);
    const [isModalOpenUser, setIsModalOpenUser] = useState(false);
    const [isModalOpenNotifications, setIsModalOpenNotifications] = useState(false);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isFinanceOpen, setIsFinanceOpen] = useState(false);
    let userRole: any;
    if (typeof window !== 'undefined') {
        userRole = window.localStorage.getItem('userRole');
    }
    const [active, setActive] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.localStorage.getItem('active') || 'Dashboard';
        }
        return 'Dashboard';
    });
    const [lastActive, setLastActive] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.localStorage.getItem('lastActive') || 'Dashboard';
        }
        return 'Dashboard';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('active', active);
        }
    }, [active]);

    useEffect(() => {
        const fetchNotifications = async () => {
            setIsLoading(true);
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
                setUnreadNotificationsCount(notificationsData.length);
            }
            setIsLoading(false);
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

    const toggleFinance = () => {
        setIsFinanceOpen(!isFinanceOpen);
        if (!isFinanceOpen) {
            setLastActive(active);
        } else {
            setActive(lastActive);
        }
    };

    return (
        <nav className="w-full flex py-2 justify-between items-center navbar bg-gradient-to-r bg-[#87A8FA] to-[#87CCFA] border-b border-[#87A8FA] ${className}">
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
                            if (nav.id === 'finance') {
                                toggleFinance();
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

                        {nav.id === 'finance' ?
                            <a href={`/${nav.id}`} className="flex">
                                {React.createElement(nav.logo, { size: 25, className: `mr-2 ${active === nav.title ? 'text-blue-500' : ''}` })}
                                <p className={`flex items-center ${active === nav.title ? 'text-blue-500' : ''}`}>{nav.title}</p>
                            </a>
                            : null
                        }

                        {nav.id != 'userProfile' && nav.id != 'notifications' && nav.id != 'finance' ?
                            <a href={`/${nav.id}`} className="flex">
                                {React.createElement(nav.logo, { size: 25, className: `mr-2 ${active === nav.title ? 'text-blue-500' : ''}` })}
                                <p className={`flex items-center ${active === nav.title ? 'text-blue-500' : ''}`}>{nav.title}</p>
                            </a> : null
                        }

                    </li>
                ))}
            </ul>
            {!isLoading && isModalOpenUser && <UserProfileModal user={authUser} onClose={toggleModalUser} />}
            {!isLoading && isModalOpenNotifications && userRole != 'Condo Management Company' && <NotificationsModal user={authUser} onClose={toggleModalNotifications} setUnreadNotificationsCount={setUnreadNotificationsCount} />}
            {!isLoading && isModalOpenNotifications && userRole === 'Condo Management Company' && <RequestsModal user={authUser} onClose={toggleModalNotifications} />}
        </nav>
    );
};

export default DashboardNav;