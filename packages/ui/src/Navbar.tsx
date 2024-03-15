import React, {useEffect, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {signOut} from "firebase/auth";
import {auth} from "@web/firebase";
import {navLinks} from "./constants";
import Image from "next/image";

const Navbar = () => {
    const [active, setActive] = useState("Home");
    const [toggle, setToggle] = useState(false);
    const [authUser] = useAuthState(auth);
    const [username, setUsername] = useState("");
    const loginTitle = 'Log In';

    const userSignOut = () => {
        signOut(auth)
            .then(() => {
                console.log("sign out successful");
                window.localStorage.setItem('``userUID``', "");
                window.localStorage.setItem('userRole', "");
                window.localStorage.setItem('username', "Portal");
            })
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        const username = async () => {
            const username = window.localStorage.getItem('username');
            if (username !== null) {
                setUsername(username);
            }
        };

        username();
    }, []);

    function getPortalLink() {
        return "/dashboard"
    }

    return (
        <nav className="w-full flex py-6 justify-between items-center navbar">
            <a href="/">
                <Image
                    src="/logoBright.png"
                    alt="CondoVision Logo"
                    width={150}
                    height={75}
                    className="logo"
                    priority
                />
            </a>
            <ul className="list-none sm:flex hidden justify-end items-center flex-1">
                {navLinks.map((nav) => (
                    <li
                        key={nav.id}
                        className={`font-poppins font-normal cursor-pointer text-[16px] ${active === nav.title ? "text-white" : "text-dimWhite"
                        } mr-10`}
                        onClick={() => setActive(nav.title)}
                    >
                        <a href={`/#${nav.id}`}>{nav.title}</a>
                    </li>
                ))}
                <li
                    className="font-poppins font-normal cursor-pointer text-[16px] text-dimWhite mr-10"
                >
                    {authUser ? (
                        <>
                            <a href={getPortalLink()} className="mr-10">{username}</a>
                            <button name={"signOutButton"} onClick={userSignOut}>Sign Out</button>
                        </>

                    ) : (
                        <a className="loginButton" href="/login">{loginTitle}</a>
                    )}
                </li>
            </ul>

            <div className="sm:hidden flex flex-1 justify-end items-center">
                <Image
                    src={toggle ? "/close.svg" : "/menu.svg"}
                    alt="menu"
                    width={28}
                    height={28}
                    className="object-contain"
                    onClick={() => setToggle(!toggle)}
                />

                <div
                    className={`${!toggle ? "hidden" : "flex"
                    } p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
                >
                    <ul className="list-none flex justify-end items-start flex-1 flex-col">
                        {navLinks.map((nav, index) => (
                            <li
                                key={nav.id}
                                className={`font-poppins font-medium cursor-pointer text-[16px] ${active === nav.title ? "text-white" : "text-dimWhite"
                                } ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}`}
                                onClick={() => setActive(nav.title)}
                            >
                                <a href={`#${nav.id}`}>{nav.title}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

        </nav>
    );
};

export default Navbar;