import React, {useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@web/firebase";
import {dashNavLinks} from "./constants";
import Image from "next/image";
import UserProfileModal from './UserProfileModal';

const DashboardNav = () => {
    const [active, setActive] = useState("Dashboard");
    const [lastActive, setLastActive] = useState("Dashboard");
    const [authUser] = useAuthState(auth);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        if (!isModalOpen) {
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
                    className="ml-6 logo"

                />
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
                                toggleModal();
                            }
                        }}
                    >
                        { nav.id === 'userProfile' ?
                            <a className="flex">
                                {React.createElement(nav.logo, {size: 25, className: `mr-2 ${active === nav.title ? 'text-blue-500' : ''}`})}
                                <p className={`flex items-center ${active === nav.title ? 'text-blue-500' : ''}`}>{nav.title}</p>
                            </a>
                            :
                            <a href={`/${nav.id}`} className="flex">
                                {React.createElement(nav.logo, {size: 25, className: `mr-2 ${active === nav.title ? 'text-blue-500' : ''}`})}
                                <p className={`flex items-center ${active === nav.title ? 'text-blue-500' : ''}`}>{nav.title}</p>
                            </a>
                        }

                    </li>
                ))}
            </ul>
            {isModalOpen && <UserProfileModal user={authUser} onClose={toggleModal} />}
        </nav>
    );
};

export default DashboardNav;