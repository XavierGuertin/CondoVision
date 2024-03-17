'use client';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import React from "react";
import { DashboardNav, PropertyList } from "@ui/index";

const Page = () => {
    const [authUser] = useAuthState(auth);

    return (
        <div className="h-screen bg-gradient-to-r from-[#87A8FA] to-[#87CCFA] overflow-hidden">
            <DashboardNav />
            <PropertyList user={authUser} />
            This is properties page
        </div>
    );
};
export default Page;