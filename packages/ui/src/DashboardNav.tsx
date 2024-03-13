import React, {useEffect, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@web/firebase";
import {dashNavLinks} from "./constants";
import { IoIosSettings } from "react-icons/io"; // Import the icon you want to use
import Image from "next/image";

const DashboardNav = () => {
    const [active, setActive] = useState("Dashboard");
    const [authUser] = useAuthState(auth);
    
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
                        onClick={() => setActive(nav.title)}
                    >
                        <a href={`/${nav.id}`} className="flex">
                            {React.createElement(nav.logo, {size: 25, className: `mr-2 ${active === nav.title ? 'text-blue-500' : ''}`})}
                            <p className={`flex items-center ${active === nav.title ? 'text-blue-500' : ''}`}>{nav.title}</p>
                        </a>

                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default DashboardNav;
