'use client';
import {Footer, SignIn, SignUp, Navbar, Response} from "../../components/index";
import './auth.css';
import styles from "../../styles/style";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../firebase";
import React from "react";

const Page = () => {
    const [authUser] = useAuthState(auth);

    const sendBackHome = () => {
        setTimeout(() => {
            window.location.href = "/";
        }, 1750);
    }

    return (
        <div className="App bg-primary">
            <div className={`${styles.paddingX} ${styles.flexCenter}`}>
                <div className={`${styles.boxWidth} z-[20]`}>
                    <Navbar/>
                </div>
            </div>
            {/* gradient start */}
            <div
                className="absolute z-[0] opacity-45 w-[60%] h-[60%] -bottom-[140%] top-0 -left-[10%] rounded-full blue__gradient"/>

            <div className="flex justify-between px-16">
                <SignIn/>
                <div className="flex flex-col  justify-center items-center">
                    <div className="h-[250px] border-gray-800 border-l w-0"></div>
                    <h1 className="text-white py-4 font-poppins">or</h1>
                    <div className="h-[250px] border-gray-800 border-l w-0"></div>
                </div>
                <SignUp/>
            </div>

            <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
                <div className={`${styles.boxWidth}`}>
                    <Footer/>
                </div>
            </div>
            {authUser ? <Response success={true} message={"You are logged in: Redirecting you Home"}
                // @ts-ignore
                onLoad={sendBackHome}/> : <></>}

        </div>
    );
};
export default Page;