'use client';
import styles from "@/styles/style";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/firebase";
import React from "react";
import {DashboardNav} from  "@ui/index";

const Page = () => {
    const [authUser] = useAuthState(auth);

    return (
    <div>
        <DashboardNav/>
    </div>
    );
};
export default Page;