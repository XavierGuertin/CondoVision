'use client';
import styles from "@/styles/style";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/firebase";
import React from "react";
import {DashboardNav} from  "@ui/index";
import DashboardCard from "@ui/dashboard/DashboardCard"

const Page = () => {
    const [authUser] = useAuthState(auth);

    return (
    <div className="h-screen bg-gradient-to-r from-[#87A8FA] to-[#87CCFA] overflow-hidden">
        <DashboardNav/>
        <div className="grid grid-cols-2 justify-items-center items-center mx-20 h-[90%]">
            <DashboardCard/>
            <DashboardCard/>
            <DashboardCard/>
            <DashboardCard/>
        </div>
    </div>
    );
};
export default Page;