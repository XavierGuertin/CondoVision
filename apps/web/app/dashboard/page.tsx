'use client';
import React from "react";
import { DashboardNav, DashboardCard } from "@ui/index";
import PropertiesImg from "../../../../public/images/propertiesImage.jpg"
import FinanceImg from "../../public/financeImage.jpg"

const Page = () => {
    return (
        <div className="h-screen bg-gradient-to-r from-[#87A8FA] to-[#87CCFA] overflow-hidden">
            <DashboardNav />
            <div className="grid grid-cols-2 justify-items-center items-center mx-20 h-[90%]">
                <DashboardCard url="/properties" imageUrl={PropertiesImg} name="Properties" />
                <DashboardCard url="/finance" imageUrl={FinanceImg} name="Finance" />
                <DashboardCard url="/dashboard" imageUrl={PropertiesImg} name="Dashboard" />
                <DashboardCard url="/dashboard" imageUrl={PropertiesImg} name="Dashboard" />
            </div>
        </div>
    );
};

export default Page;