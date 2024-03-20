'use client';
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import { Footer, Navbar, Response, SignIn, SignUp } from "@ui/index";
import styles from "@/styles/style";
import "./auth.css";

const Page = () => {
    // Extracted styles
    const paddingAndCenterStyles = `${styles.paddingX} ${styles.flexCenter}`;

    // Get authenticated user
    const [authUser] = useAuthState(auth);

    return (
        <div className="App bg-primary">
            {/* Navbar */}
            <div className={paddingAndCenterStyles}>
                <div className={`${styles.boxWidth} z-[20]`}>
                    <Navbar />
                </div>
            </div>

            {/* Gradient background */}
            <div className="absolute z-[0] opacity-45 w-[60%] h-[60%] -bottom-[140%] top-0 -left-[10%] rounded-full blue__gradient" />

            {/* Sign-in and sign-up sections */}
            <div className="flex justify-between px-16">
                <SignIn />
                <div className="flex flex-col justify-center items-center">
                    <div className="h-[250px] border-gray-800 border-l w-0"></div>
                    <h1 className="text-white py-4 font-poppins">or</h1>
                    <div className="h-[250px] border-gray-800 border-l w-0"></div>
                </div>
                <SignUp />
            </div>

            {/* Footer */}
            <div className={`bg-primary ${paddingAndCenterStyles}`}>
                <div className={`${styles.boxWidth}`}>
                    <Footer />
                </div>
            </div>

            {/* Display login status */}
            {authUser && <Response success={true} message={"You are logged in"} />}
        </div>
    );
};

export default Page;
