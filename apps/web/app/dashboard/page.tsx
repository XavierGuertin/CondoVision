'use client';
import React, { useEffect, useState } from "react";
import { DashboardNav, DashboardCard } from "@ui/index";
import PropertiesImg from "../../../../public/images/propertiesImage.jpg"
import FinanceImg from "../../public/financeImage.jpg"
import { getUserRole } from '@ui/userRole';

const Page = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [active, setActive] = React.useState("Dashboard");

    let userRole = getUserRole();

        // Simulate data fetching
        const fetchData = async () => {
            return new Promise(resolve => setTimeout(resolve, 100));
        };
    
        useEffect(() => {
            fetchData().then(() => setIsLoading(false));
        }, []);

    return (
        <div className="h-screen bg-gradient-to-r from-[#87A8FA] to-[#87CCFA] overflow-hidden">
            <DashboardNav/>
            {isLoading ? (
            <h1>Loading...</h1>
        ) : (
            <div className="grid grid-cols-2 justify-items-center items-center mx-20 h-[90%]">
                <DashboardCard url="/properties" imageUrl={PropertiesImg} name="Properties" />
                {userRole === 'Condo Management Company' && <DashboardCard url="/finance" imageUrl={FinanceImg} name="Finance"/>}
                <DashboardCard url="/dashboard" imageUrl={PropertiesImg} name="Dashboard" />
                <DashboardCard url="/dashboard" imageUrl={PropertiesImg} name="Dashboard" />
            </div>
        )}
        </div>
    );
};



export default Page;